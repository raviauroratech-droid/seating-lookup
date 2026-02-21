const apiBaseUrl = "https://seating-app-backend-cw7q.onrender.com"; // Your deployed API URL

// DOM Elements
const nameSearchSection = document.getElementById("name-search");
const tableSearchSection = document.getElementById("table-search");
const nameSearchBtn = document.getElementById("name-search-btn");
const tableSearchBtn = document.getElementById("table-search-btn");
const loadingIndicator = document.getElementById("loading");
const resultsTableBody = document.querySelector("#results-table tbody");
const resultsSection = document.getElementById("results");
const searchByNameBtn = document.getElementById("search-by-name");
const searchByTableBtn = document.getElementById("search-by-table");

// Search mode toggle
searchByNameBtn.addEventListener("click", () => {
    nameSearchSection.classList.remove("hidden");
    tableSearchSection.classList.add("hidden");
    searchByNameBtn.classList.add("active");
    searchByTableBtn.classList.remove("active");
    clearResults();
});

searchByTableBtn.addEventListener("click", () => {
    tableSearchSection.classList.remove("hidden");
    nameSearchSection.classList.add("hidden");
    searchByTableBtn.classList.add("active");
    searchByNameBtn.classList.remove("active");
    clearResults();
});

// Handle search by name
nameSearchBtn.addEventListener("click", async () => {
    const name = document.getElementById("name-input").value;
    if (name.trim() === "") return;
    showLoading();
    try {
        const response = await fetch(`${apiBaseUrl}/api/people?name=${name}`);
        const data = await response.json();
        displayResults(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
});

// Handle search by table
tableSearchBtn.addEventListener("click", async () => {
    const tableNumber = document.getElementById("table-input").value;
    if (!tableNumber) return;
    showLoading();
    try {
        const response = await fetch(`${apiBaseUrl}/api/table/${tableNumber}`);
        const data = await response.json();
        displayResults(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
});

// Show results in the table
function displayResults(data) {
    clearResults();
    if (data.length === 0) {
        resultsTableBody.innerHTML = "<tr><td colspan='3'>No results found</td></tr>";
    } else {
        data.sort((a, b) => a.lastname.localeCompare(b.lastname)); // Sort by last name
        data.forEach(person => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${person.firstname}</td>
                <td>${person.lastname}</td>
                <td>${person.tablenumber}</td>
            `;
            resultsTableBody.appendChild(row);
        });
    }
    hideLoading();
    resultsSection.classList.remove("hidden");
}

// Show loading indicator
function showLoading() {
    loadingIndicator.classList.remove("hidden");
    resultsSection.classList.add("hidden");
}

// Hide loading indicator
function hideLoading() {
    loadingIndicator.classList.add("hidden");
}

// Clear results
function clearResults() {
    resultsTableBody.innerHTML = "";
    resultsSection.classList.add("hidden");
}
