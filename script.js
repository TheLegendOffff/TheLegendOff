// Global attributes
// *****************
// Holds the currently selected language (default value is "de" for german)
let language = "de";

// Get all language buttons
const languageButtons = document.querySelectorAll(".languageButton");

// List of chapter files, in the order they should appear in the book
const bookFiles = [
	"frontCover",
	//"dedication",
	"tableOfContents",
	//"mythology",
	//"mythologyHistoryOfOrigins",
	//"credits",
	"backCover"
];

// Main Script part
// *************************************************************************

// Create the book from the bookFiles
createBook(getStartPageFromUrl());

// Functions
// *************************************************************************

/**
 * Create book
 */
async function createBook(startPage = 1) {
	// Get flip book by ID
	const flipbook = document.getElementById("flipbook");

	// Clear out any previous build (needed when switching language)
	flipbook.innerHTML = "";

	// Load every file of the book
	for (const file of bookFiles) {
		const response = await fetch(`book/${language}/${file}.html`);
		const html = await response.text();
		flipbook.innerHTML += html;
	}

	// Automatically number every normal page (not the hard covers)
	addPageNumbers(flipbook);

	// Create table of content dynamicly
	createTableOfContents(flipbook);

	// If turn.js was already initialized (i.e. this is a language switch, not the first load),
	// destroy it first, so it doesn't try to layer a new book on top of the old one
	if ($("#flipbook").data("turn")) {
		$("#flipbook").turn("destroy");
	}

	// Initialize Turn.js
	$("#flipbook").turn({
		width: 900,
		height: 600,
		autoCenter: true,
		gradients: true,
		page: startPage
	});

	// Keep the URL in sync with the currently visible page
	enableUrlSync();

	// Enable turning pages with the left/right arrow keys
	enableKeyboardNavigation();
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
 * Collects every page marked with data-chapter or data-sub-chapter and lists it on the table of contents page
 * @param {*} flipbook the element to add the table of contents entries to
 */
function createTableOfContents(flipbook) {
	console.log("	createTableOfContents start");

	const chapterList = flipbook.querySelector(".chapterList");

	if (!chapterList) {
		return;
	}

	// Select pages that have either attribute, in document order
	const chapterPages = flipbook.querySelectorAll("[data-chapter], [data-sub-chapter]");

	chapterPages.forEach((page) => {
		// A page has either data-chapter OR data-sub-chapter, never both -
		// figure out which one this page has, and remember it's a sub-chapter or not
		const isSubChapter = page.dataset.subChapter !== undefined;
		const title = isSubChapter ? page.dataset.subChapter : page.dataset.chapter;

		const pageNumber = page.querySelector(".page-number").textContent;

		const listItem = document.createElement("li");

		// Add a class to sub-chapter entries, so we can style them differently (e.g. indent them)
		if (isSubChapter) {
			listItem.className = "sub-chapter-entry";
		}

		// Create "links" to chapters
		const link = document.createElement("a");
		link.href = "#";
		link.textContent = title;
		link.dataset.page = pageNumber;

		link.addEventListener("click", (event) => {
			event.preventDefault();
			$("#flipbook").turn("page", Number(link.dataset.page));
		});

		// Fills the space between the title and the page number with dots
		const leader = document.createElement("span");
		leader.className = "leader";

		const pageNumberSpan = document.createElement("span");
		pageNumberSpan.textContent = pageNumber;

		listItem.appendChild(link);
		listItem.appendChild(leader);
		listItem.appendChild(pageNumberSpan);
		chapterList.appendChild(listItem);
	});

	console.log("	createTableOfContents end");
}

/**
 * Enables navigating the book with the keyboard's left/right arrow keys.
 * Listens on the whole document, so it works no matter where the user last clicked.
 */
function enableKeyboardNavigation() {
	document.addEventListener("keydown", (event) => {
		// Right arrow key pressed - flip to the next page
		if (event.key === "ArrowRight") {
			$("#flipbook").turn("next");
		}
		// Left arrow key pressed - flip back to the previous page
		else if (event.key === "ArrowLeft") {
			$("#flipbook").turn("previous");
		}
	});
}

// Add a click listener to each button
languageButtons.forEach((button) => {
	button.addEventListener("click", () => {
		// Set language
		language = button.dataset.lang;
		// Get page number
		const currentPage = $("#flipbook").turn("page") || 1;
		// Rebuild the entire book in the newly selected language
		createBook(currentPage);
	});
});

// Updates the URL to reflect the currently visible page, without reloading or adding browser history entries
function enableUrlSync() {
	$("#flipbook").bind("turned", (event, page) => {
		history.replaceState(null, "", "#" + page);
	});
}

// Reads the page number from the URL (e.g. "#page-5" -> 5). Defaults to 1 if none is set.
function getStartPageFromUrl() {
	const match = location.hash.match(/^#(\d+)$/);
	return match ? Number(match[1]) : 1;
}