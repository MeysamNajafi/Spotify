import App from "./app";
import artistsData from "../database/artsits.json";
import songsData from "../database/songs.json";
import PlayerPage from "../views/player.ts";
import { Artist, Song } from "../interfaces";
import { convertSecondsToTime } from "../utils/index.ts";
import { loads } from "../main.ts";

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
		this.audioPlayerEl = document.querySelector("audio") as HTMLAudioElement;
		this.sliderEl = document.querySelector(".music-slider__input") as HTMLInputElement;

		// reference: https://www.macarthur.me/posts/when-dom-updates-appear-to-be-asynchronous
		setTimeout(() => {
			this.setData();
			this.setEventListeners();
		}, 50);
	}
	async init() {
		this.app.innerHTML += PlayerPage;
		this.app.style.height = "100%";
		this.fakeLoading();
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
		this.audioPlayerEl.src = song.music;
	}
	setEventListeners() {
		const self = this;

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

			const percentage = event.target.value;
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
		if (this.isRepeat) this.shuffleButton.classList.add("active");

		// shuffle and repeat event listeners
		this.shuffleButton.addEventListener("click", this.shuffle.bind(this));
		this.repeatButton.addEventListener("click", this.repeat.bind(this));

		// like event listener
		this.likeButton.addEventListener("click", this.like.bind(this));

		// back event listener
		this.backButton.addEventListener("click", () => {
			this.navigateBack();
		});
	}
	shuffle() {
		this.isShuffle = !this.isShuffle;
		this.repeatButton.classList.toggle("active");
		this.shuffleButton.classList.toggle("active");
		this.isRepeat = !this.isShuffle;
	}
	repeat() {
		this.isRepeat = !this.isRepeat;
		this.repeatButton.classList.toggle("active");
		this.shuffleButton.classList.toggle("active");
		this.isShuffle = !this.isRepeat;
	}
	like() {
		this.isLiked = !this.isLiked;
		this.likeButton.classList.toggle("active");
	}
	setPlayButtonIcon() {
		if (!this.isPlaying) {
			this.playButton.innerHTML = `
                            <svg  style="position:relative;left:3px" width="25" viewBox="0 0 18 20" fill="black" xmlns="http://www.w3.org/2000/svg">
                                <path  fill="#181718" d="M1.75 19.4861C1.36111 19.7176 0.972223 19.7222 0.583334 19.5C0.194445 19.2685 0 18.9306 0 18.4861V1.51389C0 1.06944 0.194445 0.73611 0.583334 0.513888C0.972223 0.282407 1.36111 0.282407 1.75 0.513888L16.4306 8.98611C16.8194 9.21759 17.0139 9.55556 17.0139 10C17.0139 10.4444 16.8194 10.7824 16.4306 11.0139L1.75 19.4861Z" fill="white"/>
                            </svg>
                    `;
		} else {
			this.playButton.innerHTML = `
                            <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M14 1.50793C14 1.2328 14.0952 0.999998 14.2857 0.809523C14.4868 0.608464 14.7249 0.507935 15 0.507935H19C19.2751 0.507935 19.5079 0.608464 19.6984 0.809523C19.8995 0.999998 20 1.2328 20 1.50793V22.5079C20 22.7725 19.8995 23.0053 19.6984 23.2063C19.5079 23.4074 19.2751 23.5079 19 23.5079H15C14.7249 23.5079 14.4868 23.4074 14.2857 23.2063C14.0952 23.0053 14 22.7725 14 22.5079V1.50793ZM1 23.5079C0.724868 23.5079 0.486773 23.4074 0.285715 23.2063C0.0952385 23.0053 4.76837e-07 22.7725 4.76837e-07 22.5079V1.50793C4.76837e-07 1.2328 0.0952385 0.999998 0.285715 0.809523C0.486773 0.608464 0.724868 0.507935 1 0.507935H5C5.27513 0.507935 5.50794 0.608464 5.69841 0.809523C5.89947 0.999998 6 1.2328 6 1.50793V22.5079C6 22.7725 5.89947 23.0053 5.69841 23.2063C5.50794 23.4074 5.27513 23.5079 5 23.5079H1Z"
                                    fill="#181718"
                                />
                            </svg>
                    `;
		}
	}
}

export default Player;
