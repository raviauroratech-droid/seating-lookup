const apiBaseUrl = "https://seating-app-backend-cw7q.onrender.com";  // Your Render API URL

const searchByNameButton = document.getElementById("search-by-name");
const searchByTableButton = document.getElementById("search-by-table");

const nameSearchSection = document.getElementById("name-search");
const tableSearchSection = document.getElementById("table-search");

const nameSearchButton = document.getElementById("name-search-btn");
const tableSearchButton = document.getElementById("table-search-btn");

const resultsSection = document.getElementById("results");
const resultsTableBody = document.querySelector("#results-table tbody");
const loadingIndicator = document.getElementById("loading");

const nameInput = document.getElementById("name-input");
const tableInput = document.getElementById("table-input");

// Toggle search mode
searchByNameButton.addEventListener("click", () => {
    searchByNameButton.classList.add("active");
    searchByTableButton.classList.remove("active");
    nameSearchSection.classList.remove("hidden");
    tableSearchSection.classList.add("hidden");
});

searchByTableButton.addEventListener("click", () => {
    searchByTableButton.classList.add("active");
    searchByNameButton.classList.remove("active");
    tableSearchSection.classList.remove("hidden");
    nameSearchSection.classList.add("hidden");
});

// Search by Name
nameSearchButton.addEventListener("click", async () => {
    const name = nameInput.value.trim();
    if (!name) return alert("Please enter a name!");

    resultsSection.classList.add("hidden");
    loadingIndicator.classList.remove("hidden");

    try {
        const response = await fetch(`${apiBaseUrl}/api/people?name=${name}`);
        const results = await response.json();

        if (results.length === 0) {
            resultsTableBody.innerHTML = "<tr><td colspan='3'>No results found.</td></tr>";
        } else {
            resultsTableBody.innerHTML = results
                .map(result => {
                    return `<tr><td>${result.firstname}</td><td>${result.lastname}</td><td>${result.tablenumber}</td></tr>`;
                })
                .join("");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        resultsTableBody.innerHTML = "<tr><td colspan='3'>Error fetching data</td></tr>";
    }

    loadingIndicator.classList.add("hidden");
    resultsSection.classList.remove("hidden");
});

// Search by Table
tableSearchButton.addEventListener("click", async () => {
    const tableNumber = tableInput.value.trim();
    if (!tableNumber) return alert("Please enter a table number!");

    resultsSection.classList.add("hidden");
    loadingIndicator.classList.remove("hidden");

    try {
        const response = await fetch(`${apiBaseUrl}/api/table/${tableNumber}`);
        const results = await response.json();

        if (results.length === 0) {
            resultsTableBody.innerHTML = "<tr><td colspan='2'>No results found for this table.</td></tr>";
        } else {
            resultsTableBody.innerHTML = results
                .map(result => {
                    return `<tr><td>${result.firstname}</td><td>${result.lastname}</td></tr>`;
                })
                .join("");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        resultsTableBody.innerHTML = "<tr><td colspan='2'>Error fetching data</td></tr>";
    }

    loadingIndicator.classList.add("hidden");
    resultsSection.classList.remove("hidden");
});