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

// ========= IMPORTANT =========
// setTimeout has been used in several places of the program to set the event listeners
// reference: https://www.macarthur.me/posts/when-dom-updates-appear-to-be-asynchronous
// ========= IMPORTANT =========

// It is not possible to play the song automatically when the user has not yet connected with the page.
// Therefore, this variable helps to play the song automatically if the song page is not the first page loaded
export let loads = 0;

// find the related class to current path to generate markup in page
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

	// delete queue whenever user goes out from player
	if (!pathname.startsWith("/song")) {
		localStorage.removeItem("queue");
		localStorage.removeItem("musics");
		localStorage.removeItem("cursor");
	}

	loads++;
};

// first load
window.addEventListener("load", () => {
	navigate();
});
