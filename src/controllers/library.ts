import App from "./app";
import artistsData from "../database/artsits.json";
import albumsData from "../database/albums.json";
import playlistsData from "../database/playlists.json";
import LibraryPage from "../views/library.ts";
import { Album, Artist, Playlist } from "../interfaces";

class Library extends App {
	main: HTMLDivElement;
	input: HTMLInputElement;
	activeTab: string = "Album";
	constructor() {
		super();
		this.init();
		this.main = document.querySelector("main") as HTMLDivElement;
		this.input = document.querySelector(".search__input") as HTMLInputElement;

		setTimeout(() => {
			// the default tab is albums so the albums will be rendered on init
			this.renderAlbums();
			this.addListeners();
		}, 100);
	}
	async init() {
		this.app.innerHTML += LibraryPage;
	}
	async addListeners() {
		const artistsBtn = document.querySelector("#artists") as HTMLButtonElement;
		const playlistsBtn = document.querySelector("#playlists") as HTMLButtonElement;
		const albumsBtn = document.querySelector("#albums") as HTMLButtonElement;

		// change active tab
		artistsBtn.addEventListener("click", (e) => {
			playlistsBtn.classList.remove("active");
			albumsBtn.classList.remove("active");
			(<HTMLButtonElement>e.target)!.classList.add("active");
			this.activeTab = "Artist";

			this.renderArtists();
		});
		playlistsBtn.addEventListener("click", (e) => {
			artistsBtn.classList.remove("active");
			albumsBtn.classList.remove("active");
			(<HTMLButtonElement>e.target)!.classList.add("active");
			this.activeTab = "Playlist";

			this.renderPlaylists();
		});
		albumsBtn.addEventListener("click", (e) => {
			artistsBtn.classList.remove("active");
			playlistsBtn.classList.remove("active");
			(<HTMLButtonElement>e.target)!.classList.add("active");
			this.activeTab = "Album";

			this.renderAlbums();
		});

		// search functionality based on active tab
		this.input.addEventListener("input", (event) => {
			const query = (<HTMLInputElement>event?.target).value;
			const dataToSearch: Array<Playlist> | Array<Album> | Array<Artist> =
				this.activeTab === "Album"
					? albumsData
					: this.activeTab === "Artist"
					? artistsData
					: playlistsData;

			const data = dataToSearch.filter((item: Playlist | Album | Artist) =>
				item.name.toLowerCase().includes(query.toLowerCase())
			);
			if (this.activeTab === "Album") this.renderAlbums(data);
			if (this.activeTab === "Artist") this.renderArtists(data);
			if (this.activeTab === "Playlist") this.renderPlaylists(data);
		});
	}
	renderArtists(givenData: Array<Playlist> | undefined = undefined) {
		const data = givenData || artistsData;
		this.main.innerHTML = "";
		this.main.innerHTML = data
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
	renderPlaylists(givenData: Array<Playlist> | undefined = undefined) {
		const data = givenData || playlistsData;
		this.main.innerHTML = "";
		this.main.innerHTML = data
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
				this.changePath.bind(null, "/playlist/" + playlistsData[i].id)
			);
		});
	}
	async renderAlbums(givenData: Array<Album> | undefined = undefined) {
		const data = givenData || albumsData;
		this.main.innerHTML = "";
		for await (const album of data) {
			const song = this.getAlbumFirstSong(album);
			if (typeof song === "undefined") return;

			const base64 = await this.getSongCover(song.music);
			this.main.innerHTML += `	
							<div class="album-item album-item-${album.id}" data-id="${album.id}">
								<img
									src="${base64}"
									class="album-item__image"
									alt="${album.name}"
								/>
								<p class="album-item__title">${album.name}</p>
							</div> `;
			this.setAlbumListeners();
		}
	}
	setAlbumListeners() {
		document.querySelectorAll(".album-item").forEach((item, i) => {
			item.addEventListener(
				"click",
				this.changePath.bind(null, "/album/" + albumsData[i].id)
			);
		});
	}
}

export default Library;
