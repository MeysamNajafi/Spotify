export default class App {
	setLoading(state: boolean) {
		const containerEl = document.querySelector(".loading-container") as HTMLDivElement;
		const bodyEl = document.querySelector("body") as HTMLBodyElement;
		if (state) {
			bodyEl.style.overflow = "hidden";
			bodyEl.innerHTML += `<div class="loading-container">
            	<div class="lds-ellipsis">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
			    </div>
             </div>`;
		} else {
			bodyEl.style.overflow = "visible";
			containerEl.remove();
		}
	}
}
