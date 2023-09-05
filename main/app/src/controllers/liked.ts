import App from "./app";
import artistsData from "../database/artsits.json";
import playlistsData from "../database/playlists.json";
import albumsData from "../database/albums.json";
import songsData from "../database/songs.json";
import SearchPage from "../views/search.ts";
import { Artist, Playlist, Song, Album } from "../interfaces";
import LikedPage from "../views/liked.ts";

class Liked extends App {
	container: HTMLDivElement;
	backButton: HTMLButtonElement;
	shuffleButton: HTMLButtonElement;
	liked: Array<number> = [];

	constructor() {
		super();
		this.init();
		this.container = document.querySelector(".liked-musics-container") as HTMLDivElement;
		this.backButton = document.querySelector(".back-btn") as HTMLButtonElement;
		this.shuffleButton = document.querySelector(".shuffle-btn") as HTMLButtonElement;

		setTimeout(() => {
			this.setMarkup();
		}, 100);
	}
	init(): void {
		this.app.innerHTML += LikedPage;
	}
	async setMarkup(): Promise<void> {
		const likedJson = localStorage.getItem("liked") || "[]";
		let liked: Array<number> = JSON.parse(likedJson);
		const likedSongs: Array<Song> = songsData.filter((song: Song) => liked.includes(song.id));
		this.liked = liked;

		for await (const song of likedSongs) {
			const base64 = await this.getSongCover(song.music);
			this.container.innerHTML += ` 
                    <div class="music" data-id="${song.id}">
						<div class="music__info">
							<img class="music__image" src="${base64}" alt="" />
							<div class="music__title">
								<h6>${song.name}</h6>
								<div class="music__plays">
									<img style="position:relative;top:1px" src="/images/downloaded.svg" alt="" />
									<p>${song.plays.toLocaleString()}</p>
								</div>
							</div>
						</div>
						<div class="music__actions">
							<button class="like-btn active">
								<svg
									width="22"
									height="20"
									viewBox="0 0 22 20"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M19.7024 2.09524C20.9008 3.29365 21.5 4.74603 21.5 6.45238C21.5 8.15079 20.9008 9.59921 19.7024 10.7976L13.0952 18.5952C12.5 19.1984 11.8016 19.5 11 19.5C10.6111 19.5 10.2421 19.4246 9.89286 19.2738C9.55159 19.1151 9.26984 18.8889 9.04762 18.5952L2.29762 10.7976C1.09921 9.59921 0.5 8.15079 0.5 6.45238C0.5 4.74603 1.09921 3.29365 2.29762 2.09524C3.04365 1.34921 3.90476 0.821427 4.88095 0.511904C5.86508 0.20238 6.86111 0.142856 7.86905 0.333332C8.87698 0.523808 9.76984 0.960316 10.5476 1.64286C10.6508 1.74603 10.8016 1.79762 11 1.79762C11.0873 1.79762 11.1667 1.78571 11.2381 1.7619C11.3175 1.73809 11.373 1.71428 11.4048 1.69047L11.4524 1.64286C12.2381 0.999999 13.131 0.583332 14.131 0.392857C15.131 0.20238 16.123 0.253967 17.1071 0.547618C18.0992 0.841269 18.9643 1.35714 19.7024 2.09524Z"
										
									/>
								</svg>
							</button>
							<img class="music__more" src="/images/more.svg" />
						</div>
					</div>
            `;
		}

		// unlike functionality
		document.querySelectorAll(".music").forEach((songEl) =>
			songEl.addEventListener("click", (e) => {
				const divEl = (e.target as HTMLElement).closest(".music") as HTMLDivElement;
				const id = divEl.dataset!.id;
				if (typeof id === "undefined") return;
				this.unlike(+id);
				divEl.remove();
			})
		);

		// back functionality
		this.backButton.addEventListener("click", this.navigateBack.bind(null));
		this.shuffleButton.addEventListener("click", this.shuffle.bind(this));
	}
	unlike(songId: number) {
		const likedJson = localStorage.getItem("liked") || "[]";
		let liked: Array<number> = JSON.parse(likedJson);
		liked = liked.filter((likedMusic: number) => likedMusic !== songId);
		localStorage.setItem("liked", JSON.stringify(liked));
	}
	shuffle() {
		localStorage.setItem("isShuffle", "true");
		this.queueGenerator(this.liked);
		const queue: Array<number> = JSON.parse(localStorage.getItem("queue") as string);

		this.changePath("/song/" + queue[0]);
	}
}

export default Liked;
