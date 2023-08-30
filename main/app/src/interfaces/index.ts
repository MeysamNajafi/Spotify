export interface Playlist {
	name: string;
	image: string;
	songs: number[];
}

export interface Artist {
	id: number;
	name: string;
	image: string;
}

export interface Song {
	id: number;
	name: string;
	artistId: number;
	music: string;
	plays: number;
}
