import App from "./app";
import playlistsData from "../database/playlists.json";
import songsData from "../database/songs.json";
import ArtistPage from "../views/artist.ts";
import { Playlist as PlaylistType, Song } from "../interfaces";

class Playlist extends App {
	playlistId: number;
	constructor() {
		super();

		this.playlistId = +window.location.pathname.split("/")[2];
		this.init();
	}
	async init() {
		this.app.innerHTML += ArtistPage;

		this.fakeLoading();
		this.setData();
		this.setEventListeners();
	}
	async setData() {
		const playlist: PlaylistType | undefined = playlistsData.find(
			(playlist) => playlist.id === this.playlistId
		);
		if (typeof playlist === "undefined") {
			window.location.pathname = "/";
			return;
		}

		const playlistImageEl = document.querySelector(".artist__image") as HTMLImageElement;
		const playlistNameEl = document.querySelector(".artist__name") as HTMLHeadingElement;
		const musicsEl = document.querySelector(".music-container") as HTMLDivElement;
		playlistImageEl.src = playlist.image;
		playlistNameEl.innerText = playlist.name;

		const songs = songsData.filter((song: Song) =>
			playlist.songs.find((plSong: number) => plSong === song.id)
		);
		for await (const [i, song] of songs.entries()) {
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
			music.addEventListener("click", () => {
				const id = music.dataset.id;
				this.changePath("/song/" + id);
			});
		});
	}
	setEventListeners() {
		const btn = document.querySelector(".back-btn") as HTMLButtonElement;
		btn.addEventListener("click", this.navigateBack.bind(null));
	}
}

export default Playlist;
