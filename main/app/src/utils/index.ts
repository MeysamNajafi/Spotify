import axios from "axios";

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
