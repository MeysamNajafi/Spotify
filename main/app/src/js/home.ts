import axios from "axios";
import { getHumanizedTime } from "../utils";
import Cookies from "js-cookie";
import App from "./app";

class Home extends App {
	userId: string;

	constructor() {
		super();
		this.userId = import.meta.env.VITE_USER_ID;
		this.init();
		this.getPlaylists();
	}
	async init() {
		try {
			this.setLoading(true);
			let humanizedTime = await getHumanizedTime();

			humanizedTime = humanizedTime.charAt(0).toUpperCase() + humanizedTime.slice(1);
			const timeEl = document.querySelector(".time-welcome") as HTMLHeadingElement;

			timeEl.innerHTML = "Good " + humanizedTime;
		} catch (err) {
			console.log(err);
		}
	}
	async getPlaylists() {
		const recentEl = document.querySelector(".recent") as HTMLHeadingElement;
		try {
			const { data } = await axios.get(
				`https://api.spotify.com/v1/users/${this.userId}/playlists?limit=6`,
				{
					headers: {
						Authorization: `Bearer ${Cookies.get("token")}`,
					},
				}
			);

			recentEl.innerHTML = data.items
				.map(
					(item) => `<div class="recent__card">
								<img class="recent__image" src=${item.images[0]?.url} />
								<p class="recent__title">${item.name}</p>
							</div>`
				)
				.join("");
			this.setLoading(false);
		} catch (err) {
			console.log(err);
		}
	}
}

export default Home;
