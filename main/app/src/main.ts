import "./css/album.css";
import "./css/artist.css";
import "./css/home.css";
import "./css/liked.css";
import "./css/player.css";
import "./css/reset.css";
import "./css/styles.css";

import { getPathname } from "./router.ts";
import Home from "./controllers/home.ts";
import Artist from "./controllers/artist.ts";
import Search from "./controllers/search.ts";
import Library from "./controllers/library.ts";

export const navigate = (): void => {
	const pathname = getPathname();

	if (pathname === "/") new Home();
	if (pathname === "/search") new Search();
	if (pathname === "/library") new Library();
	if (pathname.startsWith("/artist")) new Artist();
};

window.addEventListener("load", () => {
	navigate();
});
