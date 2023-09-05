import App from "./app";
import albumsData from "../database/albums.json";
import songsData from "../database/songs.json";
import artistsData from "../database/artsits.json";
import AlbumPage from "../views/album.ts";
import { Artist, Album as AlbumType, Song } from "../interfaces";
import { getAverageRGB } from "../utils/index.ts";

class Album extends App {
	albumId: number;
	shuffleBtn: HTMLButtonElement;
	album: AlbumType;
	constructor() {
		super();

		this.albumId = +window.location.pathname.split("/")[2];
		this.init();
		this.shuffleBtn = document.querySelector(".play-button--green") as HTMLButtonElement;

		setTimeout(() => {
			this.setData();
			this.setEventListeners();
		}, 100);
	}
	async init() {
		this.app.innerHTML += AlbumPage;

		this.fakeLoading();
	}
	async setData() {
		const album: AlbumType | undefined = albumsData.find(
			(album: AlbumType) => album.id === this.albumId
		);
		if (typeof album === "undefined") {
			window.location.pathname = "/";
			return;
		}
		this.album = album;
		const artist = artistsData.find((artist: Artist) => artist.id === album.artistId) as Artist;
		const songs = songsData.filter((song: Song) =>
			album.songs.find((albumSong: number) => albumSong === song.id)
		);

		const base64: string = await this.getSongCover(songs[0].music);
		const albumImageEl = document.querySelector(".cover__image") as HTMLImageElement;
		const albumColorEl = document.querySelector(".cover__color") as HTMLImageElement;
		const albumNameEl = document.querySelector(".title") as HTMLHeadingElement;
		const albumYearEl = document.querySelector("#album-year") as HTMLParagraphElement;
		const musicsEl = document.querySelector("main") as HTMLDivElement;
		const avatarEl = document.querySelector(".avatar") as HTMLImageElement;
		const artistNameEl = document.querySelector(
			".album-singer__singer"
		) as HTMLParagraphElement;

		albumNameEl.innerText = album.name;
		albumYearEl.innerText = album.year.toString();
		artistNameEl.innerText = artist.name;
		avatarEl.src = artist.image;
		albumImageEl.src = base64;

		const rgb = getAverageRGB(albumImageEl);
		albumColorEl.style.background = `radial-gradient(rgb(${rgb.r}, ${rgb.g}, ${rgb.b}), #121212)`;

		for (const song of songs) {
			musicsEl.innerHTML += `
                        <div class="album-music" data-id="${song.id}">
                            <div>
                                <p class="album-music__title">${song.name}</p>
                                <div class="album-music__artist">
                                    <img src="/images/download.svg" width="20" />
                                    <p>${artist.name}</p>
                                </div>
                            </div>
                            <img src="/images/more.svg" />
                        </div>
                `;
		}
		document.querySelectorAll(".album-music").forEach((music) => {
			if (!(music instanceof HTMLElement)) return;

			music.addEventListener("click", () => {
				// create queue
				this.queueGenerator(album.songs);

				const id = music.dataset.id;
				this.changePath("/song/" + id);
			});
		});
	}
	setEventListeners() {
		const btn = document.querySelector(".back-btn") as HTMLButtonElement;
		btn.addEventListener("click", this.navigateBack.bind(null));
		this.shuffleBtn.addEventListener("click", this.shuffle.bind(this));
	}
	shuffle() {
		localStorage.setItem("isShuffle", "true");
		this.queueGenerator(this.album.songs);
		const queue: Array<number> = JSON.parse(localStorage.getItem("queue") as string);

		this.changePath("/song/" + queue[0]);
	}
}

export default Album;
