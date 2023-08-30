export default `
        <div class="padding">
			<section class="upper-tab">
				<button class="active">Music</button>
				<button>Podcasts</button>
			</section>
			<section class="bottom-tab">
				<button id="albums" class="active">Albums</button>
				<button id="artists">Artists</button>
				<button id="playlists">Playlists</button>
			</section>
			<section class="search">
				<div class="search__control">
					<input type="text" class="search__input" placeholder="Find in albums" />
					<svg
						class="search__icon"
						viewBox="0 0 19 21"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M14.2805 14.7728L18.5818 19.8202L17.8358 20.4497L13.5228 15.4139C12.0385 16.5408 10.3677 17.1042 8.51042 17.1042C7.3836 17.1042 6.30341 16.8866 5.26984 16.4514C4.24405 16.0084 3.35814 15.4178 2.6121 14.6796C1.87384 13.9335 1.28323 13.0476 0.840278 12.0218C0.405093 10.9883 0.1875 9.90807 0.1875 8.78125C0.1875 7.65443 0.405093 6.57812 0.840278 5.55233C1.28323 4.51877 1.87384 3.63285 2.6121 2.89459C3.35814 2.14856 4.24405 1.55795 5.26984 1.12277C6.30341 0.67981 7.3836 0.458331 8.51042 0.458331C9.63724 0.458331 10.7135 0.67981 11.7393 1.12277C12.7729 1.55795 13.6588 2.14856 14.3971 2.89459C15.1431 3.63285 15.7337 4.51877 16.1689 5.55233C16.6119 6.57812 16.8333 7.65443 16.8333 8.78125C16.8333 9.55837 16.7284 10.3122 16.5186 11.0427C16.3088 11.7731 16.0135 12.4531 15.6327 13.0826C15.2597 13.7043 14.8089 14.2677 14.2805 14.7728ZM4.82689 15.1458C5.9537 15.7986 7.18155 16.125 8.51042 16.125C9.83929 16.125 11.0671 15.7986 12.1939 15.1458C13.3208 14.4853 14.2106 13.5916 14.8633 12.4648C15.5239 11.338 15.8542 10.1101 15.8542 8.78125C15.8542 7.45238 15.5239 6.22454 14.8633 5.09772C14.2106 3.9709 13.3208 3.0811 12.1939 2.42832C11.0671 1.76777 9.83929 1.4375 8.51042 1.4375C7.18155 1.4375 5.9537 1.76777 4.82689 2.42832C3.70007 3.0811 2.80638 3.9709 2.14583 5.09772C1.49306 6.22454 1.16667 7.45238 1.16667 8.78125C1.16667 10.1101 1.49306 11.338 2.14583 12.4648C2.80638 13.5916 3.70007 14.4853 4.82689 15.1458Z"
							fill="#B3B3B3"
						/>
					</svg>
				</div>
				<button class="search__btn">Filters</button>
			</section>
			<main>
				<div class="album-item">
					<img
						src="./assets/images/artwork.png"
						class="album-item__image album-item__image--rounded"
						alt=""
					/>
					<p class="album-item__title">The weekend</p>
				</div>
				<div class="album-item">
					<img
						src="./assets/images/artwork.png"
						class="album-item__image album-item__image--rounded"
						alt=""
					/>
					<p class="album-item__title">Petit Biscuit</p>
				</div>
				<div class="album-item">
					<img
						src="./assets/images/artwork.png"
						class="album-item__image album-item__image--rounded"
						alt=""
					/>
					<p class="album-item__title">Seven Lions</p>
				</div>
			</main>
		</div>
`;
