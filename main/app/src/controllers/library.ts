import App from "./app";
import artistsData from "../database/artsits.json";
import albumsData from "../database/albums.json";
import playlistsData from "../database/playlists.json";
import LibraryPage from "../views/library.ts";
import { Album, Artist, Playlist } from "../interfaces";

class Library extends App {
	main: HTMLDivElement;
	constructor() {
		super();
		this.init();
		this.addListeners();
	}
	async init() {
		this.app.innerHTML += LibraryPage;
		this.main = document.querySelector("main") as HTMLDivElement;
		this.renderAlbums();
	}
	async addListeners() {
		const artistsBtn = document.querySelector("#artists") as HTMLButtonElement;
		const playlistsBtn = document.querySelector("#playlists") as HTMLButtonElement;
		const albumsBtn = document.querySelector("#albums") as HTMLButtonElement;

		artistsBtn.addEventListener("click", (e) => {
			playlistsBtn.classList.remove("active");
			albumsBtn.classList.remove("active");
			e.target!.classList.add("active");

			this.renderArtists();
		});
		playlistsBtn.addEventListener("click", (e) => {
			artistsBtn.classList.remove("active");
			albumsBtn.classList.remove("active");
			e.target!.classList.add("active");

			this.renderPlaylists();
		});
		albumsBtn.addEventListener("click", (e) => {
			artistsBtn.classList.remove("active");
			playlistsBtn.classList.remove("active");
			e.target!.classList.add("active");

			this.renderAlbums();
		});
	}
	renderArtists() {
		this.main.innerHTML = "";
		this.main.innerHTML = artistsData
			.map(
				(artist: Artist) => `	
                <div class="album-item">
					<img
						src="${artist.image}"
						class="album-item__image album-item__image--rounded"
						alt="${artist.name}"
					/>
					<p class="album-item__title">${artist.name}</p>
				</div> `
			)
			.join("");

		document.querySelectorAll(".album-item").forEach((item, i) => {
			item.addEventListener(
				"click",
				this.changePath.bind(null, "/artist/" + artistsData[i].id)
			);
		});
	}
	renderPlaylists() {
		this.main.innerHTML = "";
		this.main.innerHTML = playlistsData
			.map(
				(playlist: Playlist) => `	
                <div class="album-item">
					<img
						src="${playlist.image}"
						class="album-item__image"
						alt="${playlist.name}"
					/>
					<p class="album-item__title">${playlist.name}</p>
				</div> `
			)
			.join("");

		document.querySelectorAll(".album-item").forEach((item, i) => {
			item.addEventListener(
				"click",
				this.changePath.bind(null, "/playlist/" + artistsData[i].id)
			);
		});
	}
	renderAlbums() {
		this.main.innerHTML = "";
		albumsData
			.map((album: Album) => {
				const song = this.getAlbumFirstSong(album);
				if (typeof song === "undefined") return;

				this.getSongCover(song.music, (base64: string) => {
					this.main.innerHTML += `	
							<div class="album-item">
								<img
									src="${base64}"
									class="album-item__image"
									alt="${album.name}"
								/>
								<p class="album-item__title">${album.name}</p>
							</div> `;
				});
			})
			.join("");
	}
}

export default Library;
