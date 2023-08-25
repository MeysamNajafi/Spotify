const sliderEl = document.querySelector(".music-slider__input");

sliderEl.addEventListener("input", (event) => {
	const tempSliderValue = event.target.value;
	sliderEl.style.background = `linear-gradient(to right, #fff ${tempSliderValue}%, #474747 ${tempSliderValue}%)`;
});
