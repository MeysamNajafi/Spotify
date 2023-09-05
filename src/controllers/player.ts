import App from "./app";
import artistsData from "../database/artsits.json";
import songsData from "../database/songs.json";
import PlayerPage from "../views/player.ts";
import { Artist, Song } from "../interfaces";
import { convertSecondsToTime } from "../utils/index.ts";
import { loads } from "../main.ts";
import { getFile, saveFile } from "../models/index.ts";

class Player extends App {
	songId: number;
	isPlaying = !!loads;
	isShuffle = true;
	isRepeat = false;
	isLiked = false;
	duration: string = "0";
	currentTime: string = "0";
	musicCoverEl: HTMLImageElement;
	musicTitleEl: HTMLParagraphElement;
	musicArtistEl: HTMLParagraphElement;
	audioPlayerEl: HTMLAudioElement;
	sliderEl: HTMLInputElement;
	playButton: HTMLButtonElement;
	songDurationEl: HTMLParagraphElement;
	currentTimeEl: HTMLParagraphElement;
	shuffleButton: HTMLButtonElement;
	backButton: HTMLButtonElement;
	repeatButton: HTMLButtonElement;
	likeButton: HTMLButtonElement;
	nextButton: HTMLButtonElement;
	prevButton: HTMLButtonElement;

	constructor() {
		super(false);
		this.songId = +window.location.pathname.split("/")[2];

		this.init();
		this.musicCoverEl = document.querySelector(".music-cover") as HTMLImageElement;
		this.musicTitleEl = document.querySelector(".music-title") as HTMLParagraphElement;
		this.musicArtistEl = document.querySelector(".music-artist") as HTMLParagraphElement;
		this.songDurationEl = document.querySelector("#duration") as HTMLParagraphElement;
		this.currentTimeEl = document.querySelector("#current-time") as HTMLParagraphElement;
		this.shuffleButton = document.querySelector("#shuffle") as HTMLButtonElement;
		this.repeatButton = document.querySelector("#repeat") as HTMLButtonElement;
		this.likeButton = document.querySelector(".like-btn") as HTMLButtonElement;
		this.playButton = document.querySelector(".music-control__pause") as HTMLButtonElement;
		this.backButton = document.querySelector("#back") as HTMLButtonElement;
		this.prevButton = document.querySelector("#prev") as HTMLButtonElement;
		this.nextButton = document.querySelector("#next") as HTMLButtonElement;
		this.audioPlayerEl = document.querySelector("audio") as HTMLAudioElement;
		this.sliderEl = document.querySelector(".music-slider__input") as HTMLInputElement;

		// get previous value of shuffle and repeat
		this.isShuffle = localStorage.getItem("isShuffle") === "true" ? true : false;
		this.isRepeat = localStorage.getItem("isRepeat") === "true" ? true : false;
		if (!this.isShuffle && !this.isRepeat) this.isShuffle = true;

		// reference: https://www.macarthur.me/posts/when-dom-updates-appear-to-be-asynchronous
		setTimeout(() => {
			this.setData();
			this.setEventListeners();
		}, 50);
	}
	async init() {
		this.app.innerHTML += PlayerPage;
		this.app.style.height = "100%";
	}
	async setData() {
		const song: Song | undefined = songsData.find((song: Song) => song.id === this.songId);
		if (typeof song === "undefined") {
			window.location.pathname = "/";
			return;
		}
		const artist: Artist | undefined = artistsData.find(
			(artist: Artist) => artist.id === song.artistId
		);
		if (typeof artist === "undefined") {
			window.location.pathname = "/";
			return;
		}

		const img = await this.getSongCover(song.music);

		this.musicCoverEl.src = img;
		this.musicTitleEl.innerText = song.name;
		this.musicArtistEl.innerText = artist.name;

		// retrieve the saved blob
		try {
			const savedbuffer = await getFile(this.songId);

			// if savedbuffer equals to 404 then it means there wasn't any saved buffer and song wasn't saved in indexedDB
			if (typeof savedbuffer === "number") {
				const buffer = await this.convertAudioToArrayBuffer(song.music);
				if (buffer === undefined) return;

				await saveFile(buffer, this.songId);
				this.audioPlayerEl.src = song.music;
			} else {
				this.audioPlayerEl.querySelector("source") as HTMLSourceElement;
				this.audioPlayerEl.src = URL.createObjectURL(new Blob([savedbuffer]));
			}
		} catch (err) {
			console.log(err);
		}
	}
	setEventListeners() {
		const self = this;

		// check if video is liked
		this.like(true);

		// default icon for play/pause button
		this.setPlayButtonIcon();

		// Play and Puase event listener
		this.playButton.addEventListener("click", () => {
			this.isPlaying = !this.isPlaying;

			if (this.isPlaying) {
				this.setPlayButtonIcon();
				this.audioPlayerEl.play();
			} else {
				this.setPlayButtonIcon();
				this.audioPlayerEl.pause();
			}
		});

		// input event listener for change the music current time based on input value
		this.sliderEl.addEventListener("input", (event) => {
			this.audioPlayerEl.pause();

			const percentage = +(<HTMLInputElement>event.target).value;
			const duration = this.audioPlayerEl.duration;
			this.audioPlayerEl.currentTime = duration * (percentage / 100);
			this.sliderEl.style.background = `linear-gradient(to right, #fff ${percentage}%, #474747 ${percentage}%)`;

			if (this.isPlaying) this.audioPlayerEl.play();
		});

		// get the duration of song when audio was is downloaded
		this.audioPlayerEl.addEventListener("loadeddata", function (e) {
			self.songDurationEl.innerText = convertSecondsToTime(this.duration);
		});

		// audio event listener for change the input progress
		this.audioPlayerEl.addEventListener("timeupdate", function (event) {
			const currentTime = this.currentTime;
			const duration = this.duration;
			let percentage = +((currentTime / duration) * 100).toFixed(2);
			if (Number.isNaN(percentage)) percentage = 0;

			self.sliderEl.value = percentage.toString();
			self.sliderEl.style.background = `linear-gradient(to right, #fff ${percentage}%, #474747 ${percentage}%)`;

			// set duration and currentTime for class
			self.duration = convertSecondsToTime(this.duration);
			self.currentTime = convertSecondsToTime(this.currentTime);

			self.songDurationEl.innerText = self.duration;
			self.currentTimeEl.innerText = self.currentTime;
		});

		// shuffle and repeat
		// set default values for shuffle and repeat
		if (this.isShuffle) this.shuffleButton.classList.add("active");
		if (this.isRepeat) this.repeatButton.classList.add("active");

		// shuffle and repeat event listeners
		this.shuffleButton.addEventListener("click", this.shuffle.bind(this));
		this.repeatButton.addEventListener("click", this.repeat.bind(this));

		// like event listener
		this.likeButton.addEventListener("click", this.like.bind(this, false));

		// back event listener
		this.backButton.addEventListener("click", () => {
			this.navigateBack();
		});

		// next music and prev music event listeners
		this.nextButton.addEventListener("click", this.nextMusic.bind(this));
		this.prevButton.addEventListener("click", this.prevMusic.bind(this));
	}
	nextMusic() {
		const queueJson = localStorage.getItem("queue");
		let cursor = localStorage.getItem("cursor") || 0;
		if (!queueJson) return;

		if (typeof cursor === "string") cursor = +cursor;
		const queue: Array<number> = JSON.parse(queueJson);

		cursor += 1;
		if (cursor > queue.length - 1) cursor = 0; // queue is ended so start again;
		localStorage.setItem("cursor", cursor.toString());
		this.changePath("/song/" + queue[cursor]);
	}
	prevMusic() {
		const queueJson = localStorage.getItem("queue");
		let cursor = localStorage.getItem("cursor") || 0;
		if (!queueJson) return;

		if (typeof cursor === "string") cursor = +cursor;
		const queue: Array<number> = JSON.parse(queueJson);

		cursor -= 1;
		if (cursor < 0) cursor = 0; // queue is ended so start again;
		localStorage.setItem("cursor", cursor.toString());
		this.changePath("/song/" + queue[cursor]);
	}
	shuffle() {
		// UI
		this.isShuffle = !this.isShuffle;
		this.repeatButton.classList.toggle("active");
		this.shuffleButton.classList.toggle("active");
		this.isRepeat = !this.isShuffle;

		localStorage.setItem("isShuffle", this.isShuffle ? "true" : "false");
		localStorage.setItem("isRepeat", this.isRepeat ? "true" : "false");

		// shuffle queue
		const queueJson = localStorage.getItem("queue");
		if (!queueJson) return;
		this.queueGenerator(JSON.parse(queueJson));
	}
	repeat() {
		// UI
		this.isRepeat = !this.isRepeat;
		this.repeatButton.classList.toggle("active");
		this.shuffleButton.classList.toggle("active");
		this.isShuffle = !this.isRepeat;
		localStorage.setItem("isShuffle", this.isShuffle ? "true" : "false");
		localStorage.setItem("isRepeat", this.isRepeat ? "true" : "false");

		// repeat mode queue
		const musicsJson = localStorage.getItem("musics");
		if (!musicsJson) return;
		this.queueGenerator(JSON.parse(musicsJson));
	}
	like(init: boolean) {
		const likedJson = localStorage.getItem("liked") || "[]";
		let liked: Array<number> = JSON.parse(likedJson);

		// init state helps to show the song is liked already or no when the page renders
		if (init) {
			const wasLiked = liked.find((likedMusic) => likedMusic === this.songId);
			if (wasLiked) {
				this.isLiked = true;
				this.likeButton.classList.add("active");
			} else {
				this.isLiked = false;
				this.likeButton.classList.remove("active");
			}
		} else {
			this.isLiked = !this.isLiked;

			if (this.isLiked) {
				liked.unshift(this.songId);
				localStorage.setItem("liked", JSON.stringify(liked));
			} else {
				liked = liked.filter((likedMusic: number) => likedMusic !== this.songId);
				localStorage.setItem("liked", JSON.stringify(liked));
			}
			this.likeButton.classList.toggle("active");
		}
	}
	setPlayButtonIcon() {
		if (!this.isPlaying)
			this.playButton.innerHTML = `
                            <svg  style="position:relative;left:3px" width="25" viewBox="0 0 18 20" fill="black" xmlns="http://www.w3.org/2000/svg">
                                <path  fill="#181718" d="M1.75 19.4861C1.36111 19.7176 0.972223 19.7222 0.583334 19.5C0.194445 19.2685 0 18.9306 0 18.4861V1.51389C0 1.06944 0.194445 0.73611 0.583334 0.513888C0.972223 0.282407 1.36111 0.282407 1.75 0.513888L16.4306 8.98611C16.8194 9.21759 17.0139 9.55556 17.0139 10C17.0139 10.4444 16.8194 10.7824 16.4306 11.0139L1.75 19.4861Z" fill="white"/>
                            </svg>
                    `;
		else
			this.playButton.innerHTML = `
                            <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M14 1.50793C14 1.2328 14.0952 0.999998 14.2857 0.809523C14.4868 0.608464 14.7249 0.507935 15 0.507935H19C19.2751 0.507935 19.5079 0.608464 19.6984 0.809523C19.8995 0.999998 20 1.2328 20 1.50793V22.5079C20 22.7725 19.8995 23.0053 19.6984 23.2063C19.5079 23.4074 19.2751 23.5079 19 23.5079H15C14.7249 23.5079 14.4868 23.4074 14.2857 23.2063C14.0952 23.0053 14 22.7725 14 22.5079V1.50793ZM1 23.5079C0.724868 23.5079 0.486773 23.4074 0.285715 23.2063C0.0952385 23.0053 4.76837e-07 22.7725 4.76837e-07 22.5079V1.50793C4.76837e-07 1.2328 0.0952385 0.999998 0.285715 0.809523C0.486773 0.608464 0.724868 0.507935 1 0.507935H5C5.27513 0.507935 5.50794 0.608464 5.69841 0.809523C5.89947 0.999998 6 1.2328 6 1.50793V22.5079C6 22.7725 5.89947 23.0053 5.69841 23.2063C5.50794 23.4074 5.27513 23.5079 5 23.5079H1Z"
                                    fill="#181718"
                                />
                            </svg>
                    `;
	}
	async convertAudioToArrayBuffer(src: string): Promise<ArrayBuffer | undefined> {
		try {
			const res = await fetch(src);
			const arraybuffer = await res.arrayBuffer();
			return arraybuffer;
		} catch (err) {
			console.log("An error occurred while converting file");
		}
	}
	randomInteger(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}

export default Player;
