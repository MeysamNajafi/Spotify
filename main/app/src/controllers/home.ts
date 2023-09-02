import { getHumanizedTime } from "../utils";
import App from "./app";
import playlists from "../database/playlists.json";
import { Playlist } from "../interfaces";
import IndexPage from "../views/index";

class Home extends App {
	likedButton: HTMLDivElement;
	constructor() {
		super();
		this.init();

		this.likedButton = document.querySelector("#liked") as HTMLDivElement;

		setTimeout(() => {
			this.getPlaylists();
			this.setStyles();
			this.setListeners();
		}, 100);
	}
	async init() {
		try {
			this.app.innerHTML += IndexPage;

			this.setLoading(true);
			let humanizedTime = await getHumanizedTime();

			humanizedTime = humanizedTime.charAt(0).toUpperCase() + humanizedTime.slice(1);
			const timeEl = document.querySelector(".time-welcome") as HTMLHeadingElement;

			timeEl.innerHTML = "Good " + humanizedTime;
			this.setLoading(false);
		} catch (err) {
			console.log(err);
		}
	}
	setStyles() {
		const body = document.body;
		body.style.backgroundImage = `url("/images/fade.png")`;
		body.style.backgroundRepeat = "no-repeat";
		body.style.backgroundSize = "contain";
	}
	async getPlaylists() {
		const recentEl = document.querySelector(".recent") as HTMLHeadingElement;

		recentEl.innerHTML = JSON.parse(JSON.stringify(playlists))
			.map(
				(item: Playlist) => `<div class="recent__card" data-id="${item.id}">
								<img class="recent__image" src=${item.image} />
								<p class="recent__title">${item.name}</p>
							</div>`
			)
			.join("");

		recentEl.addEventListener("click", (e) => {
			const item = (<HTMLDivElement>e.target).closest(".recent__card") as HTMLDivElement;
			if (!item) return;
			const id = item.dataset.id;
			this.changePath("/playlist/" + id);
		});
	}
	setListeners() {
		this.likedButton.addEventListener("click", () => {
			this.changePath("/liked");
		});
	}
}

export default Home;
