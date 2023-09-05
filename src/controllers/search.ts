import App from "./app";
import artistsData from "../database/artsits.json";
import playlistsData from "../database/playlists.json";
import albumsData from "../database/albums.json";
import songsData from "../database/songs.json";
import SearchPage from "../views/search.ts";
import { Artist, Playlist, Song, Album } from "../interfaces";

class Search extends App {
	input: HTMLInputElement;
	container: HTMLDivElement;
	query: string = "";

	constructor() {
		super();
		this.init();
		this.input = document.querySelector(".search__input") as HTMLInputElement;
		this.container = document.querySelector("main") as HTMLDivElement;

		setTimeout(() => {
			this.setListeners();
		}, 100);
	}
	init(): void {
		this.app.innerHTML += SearchPage;
	}
	setListeners(): void {
		this.input.addEventListener("input", (e) => {
			this.query = (<HTMLInputElement>e.target).value.toLowerCase();
			this.findAndSetMarkup();
		});

		// attaching the event listener to whole container
		this.container.addEventListener("click", (e) => {
			const el = e.target as HTMLElement;

			// click outside of any result
			if (el.nodeName === "MAIN") return;

			const targetDiv = <HTMLDivElement>el.closest("#data-container");
			const id = targetDiv?.dataset.id;
			const type = targetDiv?.dataset.type;
			this.changePath(`/${type}/${id}`);
		});
	}
	async findAndSetMarkup(): Promise<void> {
		this.container.innerHTML = "";

		// render founded artists
		this.container.innerHTML += artistsData
			.filter((artist: Artist) => artist.name.toLowerCase().includes(this.query))
			.map(
				(artist: Artist) => ` 
				<div class="album-item" data-id="${artist.id}" data-type="artist" id="data-container">
					<img
						src="${artist.image}"
						class="album-item__image album-item__image--rounded"
						alt="${artist.name}"
					/>
					<p class="album-item__title">${artist.name}</p>
				</div> `
			)
			.join("");

		// render founded playlists
		this.container.innerHTML += playlistsData
			.filter((playlist: Playlist) => playlist.name.toLowerCase().includes(this.query))
			.map((playlist: Playlist) => {
				return ` 
				<div class="album-item" data-id="${playlist.id}" data-type="playlist" id="data-container">
					<img
						src="${playlist.image}"
						class="album-item__image"
						alt="${playlist.name}"
					/>
					<p class="album-item__title">${playlist.name}</p>
				</div> `;
			})
			.join("");

		// render founded songs
		const filteredSongs = songsData.filter((song: Song) =>
			song.name.toLowerCase().includes(this.query)
		);
		for await (const song of filteredSongs) {
			const base64 = await this.getSongCover(song.music);
			this.container.innerHTML += ` 
					<div class="music" data-id="${song.id}" data-type="song" id="data-container">
						<div class="music__info">
							<img class="music__image" src="${base64}" alt="${song.name}" />
							<div class="music__title">
								<h6>${song.name}</h6>
								<p>${song.plays.toLocaleString()}</p>
							</div>
						</div>
					</div>`;
		}

		// render founded albums
		const filteredAlbums = albumsData.filter((album: Album) =>
			album.name.toLowerCase().includes(this.query)
		);
		for await (const album of filteredAlbums) {
			const firstSong = this.getAlbumFirstSong(album);
			if (typeof firstSong === "undefined") continue;
			const base64 = await this.getSongCover(firstSong.music);

			this.container.innerHTML += ` 
							<div class="album-item" data-id="${album.id}" data-type="album" id="data-container">
								<img
									src="${base64}"
									class="album-item__image"
									alt="${album.name}"
								/>
								<p class="album-item__title">${album.name}</p>
							</div> `;
		}
	}
}

export default Search;
