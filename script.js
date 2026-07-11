// Global attributes
// *****************
// Holds the currently selected language (default value is "de" for german)
let language = "de";
// Get all language buttons
const languageButtons = document.querySelectorAll(".languageButton");

// Add a click listener to each button
languageButtons.forEach((button) => {
	button.addEventListener("click", () => {
		// Read the language code from the button's data-lang attribute
		language = button.dataset.lang;

		// Log it for now, so we can see it's working
		console.log("Language changed to:", language);

		// TODO: update the page text once the translations exist
	});
});