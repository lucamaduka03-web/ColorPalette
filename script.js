const newBtn = document.getElementById("new-btn");
const paletteContainer = document.querySelector(".palette-container");
const searchIcon = document.querySelector(".search-icon");
const searchBar = document.querySelector(".search-bar");
const searchInput = document.getElementById("search-input");
const searchResultsContainer = document.querySelector(".search-results-container");
const foundColorBox = document.getElementById("found-color-box");
const similarColorsContainer = document.getElementById("similar-colors-container");
const backBtn = document.getElementById("back-btn");

// New: History array to store previous palettes
let paletteHistory = [];

// Event listeners
searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        handleSearch(e);
    }
});
newBtn.addEventListener("click", newPalette);

// New: Back button event listener
backBtn.addEventListener("click", () => {
    // If the search results are visible, go back to the main palette
    if (searchResultsContainer.style.display === "block") {
        searchResultsContainer.style.display = "none";
        paletteContainer.style.display = "grid";
        searchInput.value = "";
    } else {
        // If there's a history, go back to the previous palette
        if (paletteHistory.length > 1) {
            paletteHistory.pop(); // Remove the current palette
            const previousPalette = paletteHistory[paletteHistory.length - 1]; // Get the previous one
            updatePaletteDisplay(previousPalette);
        }
    }
});

paletteContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("copy-btn")) {
        const hexValue = e.target.previousElementSibling.textContent;
        navigator.clipboard.writeText(hexValue).then(() => showCopySuccess(e.target)).catch((err) => console.log(err));
    } else if (e.target.classList.contains("colour")) {
        const hexValue = e.target.nextElementSibling.querySelector(".hex-value").textContent;
        navigator.clipboard.writeText(hexValue).then(() => {
            showCopySuccess(e.target.nextElementSibling.querySelector(".copy-btn"));
        }).catch((err) => console.log(err));
    }
});
searchIcon.addEventListener("click", () => {
    searchBar.classList.toggle("active");
    if (searchBar.classList.contains("active")) {
        document.getElementById("search-input").focus();
    }
});

function showCopySuccess(element) {
    element.classList.remove("far", "fa-copy");
    element.classList.add("fas", "fa-check");
    element.style.color = "#48bb78";
    setTimeout(() => {
        element.classList.remove("fas", "fa-check");
        element.classList.add("far", "fa-copy");
        element.style.color = "";
    }, 1500);
}

function newPalette() {
    // Save the current palette to history before generating a new one
    const currentColours = Array.from(document.querySelectorAll(".palette-container .hex-value")).map(el => el.textContent);
    paletteHistory.push(currentColours);

    const colours = [];
    searchResultsContainer.style.display = "none";
    paletteContainer.style.display = "grid";
    for (let i = 0; i < 5; i++) {
        colours.push(generateRandomColor());
    }
    updatePaletteDisplay(colours);
}

function generateRandomColor() {
    const letters = "0123456789ABCDEF";
    let colour = "#";
    for (let i = 0; i < 6; i++) {
        colour += letters[Math.floor(Math.random() * 16)];
    }
    return colour;
}

function updatePaletteDisplay(colours) {
    const colourBoxes = document.querySelectorAll(".colour-box");
    colourBoxes.forEach((box, index) => {
        const colour = colours[index];
        const colourDiv = box.querySelector(".colour");
        const hexValue = box.querySelector(".hex-value");
        colourDiv.style.backgroundColor = colour;
        hexValue.textContent = colour;
    });
}

function handleSearch(e) {
    const searchTerm = e.target.value.trim().toUpperCase();
    if (searchTerm.length === 6 || (searchTerm.startsWith("#") && searchTerm.length === 7)) {
        const hexCode = searchTerm.startsWith("#") ? searchTerm : `#${searchTerm}`;
        if (isValidHex(hexCode)) {
            displayFoundColor(hexCode);
            generateSimilarColors(hexCode);
            paletteContainer.style.display = "none";
            searchResultsContainer.style.display = "block";
        }
    } else {
        searchResultsContainer.style.display = "none";
        paletteContainer.style.display = "grid";
    }
}

function isValidHex(hex) {
    return /^#[0-9A-F]{6}$/i.test(hex);
}

function displayFoundColor(hex) {
    const colorDiv = foundColorBox.querySelector(".colour");
    const hexValueSpan = foundColorBox.querySelector(".hex-value");
    colorDiv.style.backgroundColor = hex;
    hexValueSpan.textContent = hex;
}

function generateSimilarColors(baseHex) {
    similarColorsContainer.innerHTML = "";
    const similarColors = [];
    for (let i = 0; i < 5; i++) {
        similarColors.push(getSimilarColor(baseHex));
    }
    similarColors.forEach((color) => {
        const box = document.createElement("div");
        box.className = "colour-box";
        box.innerHTML = `
            <div class="colour" style="background-color: ${color}"></div>
            <div class="colour-info">
                <span class="hex-value">${color}</span>
                <i class="far fa-copy copy-btn" title="Copy to clipboard"></i>
            </div>
        `;
        similarColorsContainer.appendChild(box);
    });
}

function getSimilarColor(hex) {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);
    const adjustment = (Math.random() - 0.5) * 40;
    r = Math.min(255, Math.max(0, r + adjustment));
    g = Math.min(255, Math.max(0, g + adjustment));
    b = Math.min(255, Math.max(0, b + adjustment));
    return "#" + Math.floor(r).toString(16).padStart(2, "0") + Math.floor(g).toString(16).padStart(2, "0") + Math.floor(b).toString(16).padStart(2, "0");
}