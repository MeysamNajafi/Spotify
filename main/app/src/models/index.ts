import { SavedData } from "../interfaces";
let DB: IDBDatabase;

// connct to database
export const connect = () => {
	if (!window.indexedDB) {
		console.log("Indexed DB is not supported!");
	}

	let request = window.indexedDB.open("Spotify", 1);

	request.onerror = (err) => {
		console.log(err);
		console.log("Error while opening the database!");
	};
	request.onsuccess = (result) => {
		DB = request.result;
	};
	request.onupgradeneeded = (event) => {
		if (!event.target) return;
		DB = event.target.result;

		const objectStore = DB.createObjectStore("saved", { keyPath: "songId" });
		objectStore.createIndex("songId", "songId", { unique: true });
	};
};

// save music file as ArrayBuffer
export const saveFile = (arrayBuffer: ArrayBuffer, songId: number): Promise<void> => {
	const transaction = DB.transaction("saved", "readwrite");
	const objectStore = transaction.objectStore("saved");
	const req = objectStore.add({ buffer: arrayBuffer, songId });

	return new Promise((resolve, reject) => {
		req.onsuccess = (event) => {
			resolve();
		};
		req.onerror = (event) => {
			console.log(event);
			reject(event);
		};
	});
};

// get ArrayBuffer by songId
export const getFile = (songId: number): Promise<ArrayBuffer | number> => {
	const transaction = DB.transaction("saved");
	const objectStore = transaction.objectStore("saved");

	const req = objectStore.get(songId);

	return new Promise((resolve, reject) => {
		req.onsuccess = (event) => {
			if (req.result) {
				resolve((<SavedData>req.result).buffer);
			} else {
				resolve(404);
			}
		};
		req.onerror = (event) => {
			console.log(event);
			reject("An error occurred while getting data.");
		};
	});
};
