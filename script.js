// Global attributes
// *****************
// Holds the currently selected language (default value is "de" for german)
let language = "de";
// Get all language buttons
const languageButtons = document.querySelectorAll(".languageButton");
// List of chapter files, in the order they should appear in the book
const bookFiles = [
	"frontCover",/**/
	/*"dedication",/**/
	"backCover",/**/
];

// Main Script part
// *************************************************************************

// Create the book from the bookFiles
createBook();

// Functions
// *************************************************************************

/**
 * Create book
 */
async function createBook() {
	console.log("createBook start");

	// Get flip book by ID
	const flipbook = document.getElementById("flipbook");
	console.log("flipbook gotten");

	// Load every file of the book
	for (const file of bookFiles) {
		const response = await fetch("components/book/" + file + ".html");
		const html = await response.text();
		flipbook.innerHTML += html;
	}
	console.log("files loaded");

	// Initialize Turn.js
	$("#flipbook").turn({
		width: 900,
		height: 600,
		autoCenter: true,
		gradients: true
	});
	console.log("createBook end");
}

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