// Global attributes
// *****************
// Holds the currently selected language (default value is "de" for german)
let language = "de";
// Get all language buttons
const languageButtons = document.querySelectorAll(".languageButton");
// List of chapter files, in the order they should appear in the book
const bookFiles = [
	"mythology",/**/
	"frontCover",/**/
	"dedication",/**/
	"tableOfContents"/**/,
	"mythology",/**/
	"page",/**/
	"page",/**/
	"page",/**/
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

	// Automatically number every normal page (not the hard covers)
	addPageNumbers(flipbook);

	// Create table of content dynamicly
	createTableOfContents(flipbook);

	// Initialize Turn.js
	$("#flipbook").turn({
		width: 900,
		height: 600,
		autoCenter: true,
		gradients: true
	});
	console.log("createBook end");
}

/**
 * Adds a running page number to every .page element inside the flipbook
 * @param {*} flipbook the element to add the page number to
 */
function addPageNumbers(flipbook) {
	console.log("	addPageNumbers start");

	// Get every element with the page class
	const pages = flipbook.querySelectorAll(".page");
	console.log("	pages gotten");

	// Create div with class "page-number"
	pages.forEach((page, index) => {
		// Create div
		const pageNumber = document.createElement("div");
		// Add class to div
		pageNumber.className = "page-number";
		// Set text for div
		pageNumber.textContent = index + 1;
		// Add div
		page.appendChild(pageNumber);
	});

	console.log("	addPageNumbers end");
}

/**
 * Collects every page marked with data-toc-title and lists it on the table of contents page
 * @param {*} flipbook the element to add the table of contents entries to
 */
function createTableOfContents(flipbook) {
	console.log("	createTableOfContents start");

	// Find the <ul> element with class "tocList" (inside tableOfContents.html)
	const tocList = flipbook.querySelector(".tocList");

	// If this book has no table of contents page, there's nothing to do
	if (!tocList) {
		return;
	}

	// Find every page that has a data-toc-title attribute set - these are the
	// pages we marked as "this should show up in the table of contents"
	const chapterPages = flipbook.querySelectorAll("[data-toc-title]");

	// Build one list entry (<li><a>...</a></li>) per matching page
	chapterPages.forEach((page) => {
		// Read the chapter's title from its data-toc-title attribute
		const title = page.dataset.tocTitle;

		// Read the page number that addPageNumbers() already wrote onto this page,
		// so the table of contents knows which page to jump to
		const pageNumber = page.querySelector(".page-number").textContent;

		// Create the list item and the clickable link inside it
		const listItem = document.createElement("li");
		const link = document.createElement("a");
		link.href = "#";
		link.textContent = title;
		link.dataset.page = pageNumber;

		// Clicking an entry jumps straight to that page in the book
		link.addEventListener("click", (event) => {
			event.preventDefault();
			$("#flipbook").turn("page", Number(link.dataset.page));
		});

		// Put the link inside the list item, then the list item inside the tocList
		listItem.appendChild(link);
		tocList.appendChild(listItem);
	});

	console.log("	createTableOfContents end");
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