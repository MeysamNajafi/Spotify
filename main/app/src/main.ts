import "./css/album.css";
import "./css/artist.css";
import "./css/home.css";
import "./css/liked.css";
import "./css/player.css";
import "./css/reset.css";
import "./css/styles.css";

import IndexPage from "./views/index.ts";
import FooterLayout from "./layouts/footer.ts";
import { getPathname } from "./router.ts";
import Home from "./js/home.ts";
import axios from "axios";
import Cookies from "js-cookie";

const app = document.querySelector<HTMLDivElement>("#app");
const pathname = getPathname();

// refresh access token
(async () => {
	const curExpire = Cookies.get("expire");
	if (curExpire > Date.now()) return;
	try {
		const { data } = await axios.post(
			"https://accounts.spotify.com/api/token",
			{
				grant_type: "client_credentials",
				client_id: "4b480161aff0413db779d69a4d931460",
				client_secret: "d7dfaa773d464801b1db2ec79e53a032",
			},
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}
		);
		Cookies.set("expire", Date.now() + 1000 * 60 * 60);
		Cookies.set("token", data.access_token);
	} catch (err) {
		console.log(err);
	}
})();

if (pathname === "/") {
	app!.innerHTML = IndexPage;

	window.addEventListener("load", () => {
		new Home();
	});
}

app!.innerHTML += FooterLayout;
