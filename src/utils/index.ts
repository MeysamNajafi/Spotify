import axios from "axios";

interface RGB {
	r: number;
	g: number;
	b: number;
}

// get the HumanizedTime for the hom page (morning, afternoon, evening, ...)
export const getHumanizedTime = async function (): Promise<string> {
	try {
		const timezoneKey = import.meta.env.VITE_TIMEZONE_API;

		const { data } = await axios.get(
			`https://timezoneapi.io/api/timezone/?Asia/Tehran&token=${timezoneKey}`
		);
		if (typeof data.data?.datetime?.timeday_gen === "string")
			return data.data?.datetime?.timeday_gen;
		else throw new Error("Error in getting data");
	} catch (err) {
		console.log(err);
		throw err;
	}
};

export function getAverageRGB(imgEl: HTMLImageElement): RGB {
	var blockSize = 5, // only visit every 5 pixels
		defaultRGB = { r: 0, g: 0, b: 0 }, // for non-supporting envs
		canvas = document.createElement("canvas"),
		context = canvas.getContext && canvas.getContext("2d"),
		data,
		width,
		height,
		i = -4,
		length,
		rgb = { r: 0, g: 0, b: 0 },
		count = 0;

	if (!context) {
		return defaultRGB;
	}

	height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
	width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

	context.drawImage(imgEl, 0, 0);

	try {
		data = context.getImageData(0, 0, width, height);
	} catch (e) {
		/* security error, img on diff domain */ alert("x");
		return defaultRGB;
	}

	length = data.data.length;

	while ((i += blockSize * 4) < length) {
		++count;
		rgb.r += data.data[i];
		rgb.g += data.data[i + 1];
		rgb.b += data.data[i + 2];
	}

	// ~~ used to floor values
	rgb.r = ~~(rgb.r / count);
	rgb.g = ~~(rgb.g / count);
	rgb.b = ~~(rgb.b / count);

	return rgb;
}

export function convertSecondsToTime(totalSeconds: number): string {
	const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
	totalSeconds %= 3600;
	const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
	const seconds = String(Math.floor(totalSeconds % 60)).padStart(2, "0");

	let res = "";
	if (hours !== "00") res += `${hours}:`;
	res += `${minutes}:${seconds}`;
	return res;
}
