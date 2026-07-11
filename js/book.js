// Current language
let language = "de"; // Options: de = Deutsch, en = English, es = español

function createBook(data) {
	// Get all parameters
	const title = data.title;
	const dedication = data.dedication[language];
	const backCoverText = data.backCoverText[language];
	const pages = data.pages;

	// Create the flipbook
	const flipbook = document.getElementById("flipbook");

	// Front cover
	flipbook.appendChild(createFrontCoverOutside(title));
	flipbook.appendChild(createFrontCoverInside(dedication));

	// Pages
	pages.forEach(page => {
		flipbook.appendChild(createPages(page));
	});

	// Back cover
	flipbook.appendChild(createBackCoverInside());
	flipbook.appendChild(createBackCoverOutside(backCoverText));

	// Initialize Turn.js
	$("#flipbook").turn({
		width: 900,
		height: 600,
		autoCenter: true,
		gradients: true
	});
}

function createFrontCoverOutside(title){
	const div = document.createElement("div");

	div.className = "hard front";
	div.innerHTML = `${title}`;

	return div;
}

function createFrontCoverInside(dedication){
	const div = document.createElement("div");

	div.className = "hard dedication";
	div.innerHTML = `${dedication}`;

	return div;
}

function createBackCoverInside(){
	const div = document.createElement("div");

	div.className = "hard";

	return div;
}

function createBackCoverOutside(backCoverText){
	const div = document.createElement("div");

	div.className = "hard back";
	div.innerHTML = `${backCoverText}`;

	return div;
}

function createPages(page){
	const div = document.createElement("div");

	// Add page decoration - always first so it sits behind everything
	div.appendChild(createPageDecoration());

	// Create page depedning on whitch type it is
	switch(page.type){
		case "chapter":
			div.appendChild(createTitle(page.title[language]));
			break;
		case "subchapter":
			div.appendChild(createTitle(page.title[language]));
			div.appendChild(createText(page.text[language]));
			break;
		case "text":
			div.appendChild(createText(page.text[language]));
			break;
	}

	return div;
}

function createPageDecoration() {
	// Class for corner decoration
	const classCorner = "corner-decoration";
	// Path to the image
	const pathToCornerDecoration = "..//images//page//corner-decoration.png";

	// Top left corner
	const cornerTopLeft = document.createElement("img");
	cornerTopLeft.className = `${classCorner} corner-top-left`;
	cornerTopLeft.src = pathToCornerDecoration;
	
	// Top right corner
	const cornerTopRight = document.createElement("img");
	cornerTopRight.className = `${classCorner} corner-top-right`;
	cornerTopRight.src = pathToCornerDecoration;

	// Bottom left corner
	const cornerBottomLeft = document.createElement("img");
	cornerBottomLeft.className = `${classCorner} corner-bottom-left`;
	cornerBottomLeft.src = pathToCornerDecoration;
	
	// Bottom right corner
	const cornerBottomRight = document.createElement("img");
	cornerBottomRight.className = `${classCorner} corner-bottom-right`;
	cornerBottomRight.src = pathToCornerDecoration;

	// Create and return a fragment with all images inside
	const fragment = document.createDocumentFragment();
	fragment.appendChild(cornerTopLeft);
	fragment.appendChild(cornerTopRight);
	fragment.appendChild(cornerBottomLeft);
	fragment.appendChild(cornerBottomRight);

	return fragment;
}

function createTitle(title) {
	const h1 = document.createElement("h1");
	h1.className = "page-title";
	h1.innerHTML = `${title}`;
	return h1;
}
function createTitle(title) {
	const div = document.createElement("div");
	div.className = "title-container";

	// Title as an h1 element
	const h1Title = document.createElement("h1");
	h1Title.className = "page-title";
	h1Title.innerHTML = `${title}`;

	// The image of the underline for the title
	const imgUnderline = document.createElement("img");
	imgUnderline.className = "title-divider";
	imgUnderline.src = "../images/page/title-underline.png";

	// Create and return a div with all elements inside
	div.appendChild(h1Title);
	div.appendChild(imgUnderline);

	return div;
}

function createText(text){
	const div = document.createElement("div");

	div.className = "text-box";
	div.innerHTML = `${text}`;

	return div;
}

// Load the JSON and build the book
fetch("data/book.json")
	.then(response => response.json())
	.then(data => createBook(data))
	.catch(error => console.error("Error loading book data:", error));