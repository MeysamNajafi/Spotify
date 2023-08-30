import FooterLayout from "../layouts/footer.ts";
import { navigate } from "../main.ts";
import { getPathname } from "../router.ts";

interface JsMediaTags {
	read: Function;
	Reader: object;
	Cofig: Object;
}

export default class App {
	app: HTMLDivElement;
	constructor() {
		this.app = document.querySelector("#app") as HTMLDivElement;
		this.app.innerHTML = "";
		this.deleteBodyStyles();
		this.setFooter();
	}
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
	async getSongCover(song: string, successHandler: Function) {
		const jsmediatags = window.jsmediatags as JsMediaTags;
		let blob = await fetch("../../public" + song).then((r) => r.blob());

		jsmediatags.read(blob, {
			onSuccess: function (tag: any) {
				const image = tag.tags.picture;
				if (!image) return;

				let base64String = "";
				for (let i = 0; i < image.data.length; i++)
					base64String += String.fromCharCode(image.data[i]);

				const base64 = "data:" + image.format + ";base64," + window.btoa(base64String);
				successHandler(base64);
			},
			onError: function (error: any) {
				console.log(
					"An error occurred while loading the cover image",
					error.type,
					error.info
				);
			},
		});
	}
	changePath(path: string): void {
		window.history.pushState("", "", path);
		navigate();
	}
	deleteBodyStyles() {
		document.body.attributeStyleMap.clear();
	}
}
