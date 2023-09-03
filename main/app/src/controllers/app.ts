import FooterLayout from "../layouts/footer.ts";
import { navigate } from "../main.ts";
import { getPathname } from "../router.ts";
import songsData from "../database/songs.json";
import { Album, Song } from "../interfaces/index.ts";
import { connect } from "../models/index.ts";

interface JsMediaTags {
	read: Function;
	Reader: object;
	Cofig: Object;
}
declare global {
	interface Window {
		jsmediatags: JsMediaTags;
	}
}

export default class App {
	app: HTMLDivElement;
	constructor(footer = true) {
		connect();
		this.app = document.querySelector("#app") as HTMLDivElement;
		this.app.innerHTML = "";
		this.deleteBodyStyles();
		if (footer) this.setFooter();
	}
	// set footer and event listeners
	setFooter() {
		this.app.innerHTML += FooterLayout;

		const homeIcon = document.querySelector(".footer-tab__icon--home") as HTMLImageElement;
		const searchIcon = document.querySelector(".footer-tab__icon--search") as HTMLImageElement;
		const libraryIcon = document.querySelector(
			".footer-tab__icon--library"
		) as HTMLImageElement;

		const pathname = getPathname();
		if (pathname === "/") homeIcon.src = "/images/home-enabled.svg";
		else if (pathname === "/search") searchIcon.src = "/images/search-enabled.svg";
		else if (pathname === "/library") libraryIcon.src = "/images/library-enabled.svg";

		// reference: https://www.macarthur.me/posts/when-dom-updates-appear-to-be-asynchronous
		setTimeout(() => {
			const homeBtn = document.querySelector("#footer--home") as HTMLButtonElement;
			const libraryBtn = document.querySelector("#footer--library") as HTMLButtonElement;
			const searchBtn = document.querySelector("#footer--search") as HTMLButtonElement;

			searchBtn.addEventListener("click", () => {
				this.changePath("/search");
			});
			libraryBtn.addEventListener("click", () => {
				this.changePath("/library");
			});
			homeBtn.addEventListener("click", () => {
				this.changePath("/");
			});
		}, 100);
	}
	setLoading(state: boolean) {
		const containerEl = document.querySelector(".loading-container") as HTMLDivElement;
		const bodyEl = document.querySelector("body") as HTMLBodyElement;
		if (state) {
			bodyEl.style.overflow = "hidden";
			bodyEl.innerHTML += `<div class="loading-container">
            	<div class="lds-ellipsis">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
			    </div>
             </div>`;
		} else {
			bodyEl.style.overflow = "visible";
			containerEl.remove();
		}
	}
	// fake loading to simulate fetching data from server
	fakeLoading() {
		const bodyEl = document.querySelector("body") as HTMLBodyElement;

		bodyEl.style.overflow = "hidden";
		bodyEl.innerHTML += `<div class="loading-container">
            	<div class="lds-ellipsis">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
			    </div>
             </div>`;

		setTimeout(() => {
			const containerEl = document.querySelector(".loading-container") as HTMLDivElement;

			bodyEl.style.overflow = "visible";
			containerEl.remove();
		}, 1000);
	}
	// extract song's cover from the song
	// I could choose a photo for each song in the data, but I decided to directly extract the photo from the song. That's why I had to use JsMediaTags package
	async getSongCover(song: string): Promise<string> {
		const jsmediatags = window.jsmediatags as JsMediaTags;
		let blob = await fetch("../../public" + song).then((r) => r.blob());

		return new Promise((resolve, reject) => {
			jsmediatags.read(blob, {
				onSuccess: function (tag: any) {
					const image = tag.tags.picture;
					if (!image) return;

					let base64String = "";
					for (let i = 0; i < image.data.length; i++)
						base64String += String.fromCharCode(image.data[i]);

					const base64 = "data:" + image.format + ";base64," + window.btoa(base64String);
					resolve(base64);
				},
				onError: function (error: any) {
					console.log(error.type, error.info);
					reject("An error occurred while loading the cover image");
				},
			});
		});
	}
	// change the url to render new markup
	changePath(path: string): void {
		window.history.pushState("", "", path);
		navigate();
	}
	navigateBack(): void {
		window.history.back();
		addEventListener(
			"popstate",
			() => {
				navigate();
			},
			{ once: true }
		);
	}
	deleteBodyStyles(): void {
		document.body.attributeStyleMap.clear();
	}
	getAlbumFirstSong(album: Album): Song | undefined {
		const firstSongId = album.songs[0];
		const song = songsData.find((song: Song) => song.id === firstSongId);
		return song;
	}
}
