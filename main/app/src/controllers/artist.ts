import App from "./app";
import artistsData from "../database/artsits.json";
import songsData from "../database/songs.json";
import ArtistPage from "../views/artist.ts";
import { Artist, Song } from "../interfaces";

class Home extends App {
	artistId: number;
	artistSongsId: Array<number>;
	shuffleBtn: HTMLButtonElement;
	constructor() {
		super();

		this.artistId = +window.location.pathname.split("/")[2];
		this.init();

		this.shuffleBtn = document.querySelector(".play-button--green") as HTMLButtonElement;
		setTimeout(() => {
			this.setData();
			this.setEventListeners();
		}, 100);
	}
	async init() {
		this.app.innerHTML += ArtistPage;

		this.fakeLoading();
	}
	async setData() {
		const artists: Array<Artist> = JSON.parse(JSON.stringify(artistsData));
		const songs: Array<Song> = JSON.parse(JSON.stringify(songsData));

		const foundedArtist: Artist | undefined = artists[this.artistId - 1];
		const artistSongs: Array<Song> = songs.filter((song) => song.artistId === this.artistId);
		const artistSongsId: Array<number> = artistSongs.map((song: Song) => song.id);
		this.artistSongsId = artistSongsId;
		if (typeof foundedArtist === "undefined") window.location.pathname = "/";

		const artistImageEl = document.querySelector(".artist__image") as HTMLImageElement;
		const artistNameEl = document.querySelector(".artist__name") as HTMLHeadingElement;
		const musicsEl = document.querySelector(".music-container") as HTMLDivElement;
		artistImageEl.src = foundedArtist.image;
		artistNameEl.innerText = foundedArtist.name;

		for await (const [i, song] of artistSongs.entries()) {
			const base64 = await this.getSongCover(song.music);
			musicsEl.innerHTML += `<div class="music" data-id="${song.id}">
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
		}
		document.querySelectorAll(".music").forEach((music) => {
			if (music instanceof HTMLElement) {
				music.addEventListener("click", () => {
					// create queue
					this.queueGenerator(artistSongsId);

					const id = music.dataset.id;
					this.changePath("/song/" + id);
				});
			}
		});
	}
	setEventListeners() {
		const btn = document.querySelector(".back-btn") as HTMLButtonElement;
		btn.addEventListener("click", this.navigateBack.bind(null));
		this.shuffleBtn.addEventListener("click", this.shuffle.bind(this));
	}
	shuffle() {
		localStorage.setItem("isShuffle", "true");
		this.queueGenerator(this.artistSongsId);
		const queue: Array<number> = JSON.parse(localStorage.getItem("queue") as string);

		this.changePath("/song/" + queue[0]);
	}
}

export default Home;
