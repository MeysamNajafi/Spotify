import App from "./app";
import artistsData from "../database/artsits.json";
import songsData from "../database/songs.json";
import ArtistPage from "../views/artist.ts";
import { Artist, Song } from "../interfaces";

class Home extends App {
	artistId: number;
	constructor() {
		super();

		this.artistId = +window.location.pathname.split("/")[2];
		this.init();
	}
	async init() {
		this.app.innerHTML += ArtistPage;

		this.fakeLoading();
		this.setData();
		this.setEventListeners();
	}
	async setData() {
		const artists: Array<Artist> = JSON.parse(JSON.stringify(artistsData));
		const songs: Array<Song> = JSON.parse(JSON.stringify(songsData));

		const foundedArtist: Artist | undefined = artists[this.artistId - 1];
		const artistSongs: Array<Song> = songs.filter((song) => song.artistId === this.artistId);
		const songsImages: Array<string> = [];
		if (typeof foundedArtist === "undefined") window.location.pathname = "/";

		const artistImageEl = document.querySelector(".artist__image") as HTMLImageElement;
		const artistNameEl = document.querySelector(".artist__name") as HTMLHeadingElement;
		const musicsEl = document.querySelector(".music-container") as HTMLDivElement;
		artistImageEl.src = foundedArtist.image;
		artistNameEl.innerText = foundedArtist.name;

		for (const [i, song] of artistSongs.entries()) {
			this.getSongCover(song.music, (base64: string) => {
				musicsEl.innerHTML += `<div class="music">
						<div class="music__info">
							<p class="music__number">${i + 1}</p>
							<img class="music__image" src="${base64}" alt="${song.name}" />
							<div class="music__title">
								<h6>${song.name}</h6>
								<p>${song.plays.toLocaleString()}</p>
							</div>
						</div>
						<img class="music__more" src="/images/more.svg" />
					</div>`;
			});
		}
	}
	setEventListeners() {
		const btn = document.querySelector(".back-btn") as HTMLButtonElement;
		btn.addEventListener("click", this.navigateBack.bind(null));
	}
}

export default Home;
