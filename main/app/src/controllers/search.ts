import App from "./app";
import artistsData from "../database/artsits.json";
import songsData from "../database/songs.json";
import SearchPage from "../views/search.ts";
import { Artist, Song } from "../interfaces";

class Search extends App {
	constructor() {
		super();
		this.init();
	}
	async init() {
		this.app.innerHTML += SearchPage;
		this.setData();
	}
	async setData() {}
}

export default Search;
