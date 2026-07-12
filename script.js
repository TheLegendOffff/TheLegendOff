// Global attributes
// *****************
// Holds the currently selected language (default value is "de" for german)
let language = "de";
// Get all language buttons
const languageButtons = document.querySelectorAll(".languageButton");
// List of chapter files, in the order they should appear in the book
const bookFiles = [
	"frontCover",/**/
	"dedication",/**/
	"tableOfContents"/**/,
	"mythology",/**/
	"mythologyAct1",/**/
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