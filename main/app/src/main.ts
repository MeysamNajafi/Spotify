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
import Playlist from "./controllers/playlist.ts";
import Album from "./controllers/album.ts";
import Player from "./controllers/player.ts";
import Liked from "./controllers/liked.ts";

export let loads = 0;

export const navigate = (): void => {
	const pathname = getPathname();

	if (pathname === "/") new Home();
	if (pathname === "/search") new Search();
	if (pathname === "/library") new Library();
	if (pathname.startsWith("/artist")) new Artist();
	if (pathname.startsWith("/playlist")) new Playlist();
	if (pathname.startsWith("/album")) new Album();
	if (pathname.startsWith("/song")) new Player();
	if (pathname.startsWith("/liked")) new Liked();

	loads++;
};

window.addEventListener("load", () => {
	navigate();
});
