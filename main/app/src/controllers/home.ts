import { getHumanizedTime } from "../utils";
import App from "./app";
import playlists from "../database/playlists.json";
import { Playlist } from "../interfaces";
import IndexPage from "../views/index";

class Home extends App {
	constructor() {
		super();
		this.init();
		this.getPlaylists();
		this.setStyles();
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
		try {
			recentEl.innerHTML = JSON.parse(JSON.stringify(playlists))
				.map(
					(item: Playlist) => `<div class="recent__card">
								<img class="recent__image" src=${item.image} />
								<p class="recent__title">${item.name}</p>
							</div>`
				)
				.join("");
		} catch (err) {
			console.log(err);
		}
	}
}

export default Home;