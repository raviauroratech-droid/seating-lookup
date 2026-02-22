// Ensure these variables match your API URL and your search modes
const apiBaseUrl = 'https://seating-app-backend-cw7q.onrender.com'; // Update this URL to your deployed API

const searchButton = document.getElementById('search-button');
const nameInput = document.getElementById('name-input');
const tableInput = document.getElementById('table-input');
const resultsDiv = document.getElementById('results');
const loadingDiv = document.getElementById('loading');

// Handle Search Button Click
searchButton.addEventListener('click', function () {
    const searchBy = document.querySelector('input[name="search-mode"]:checked').value;
    const searchValue = searchBy === 'name' ? nameInput.value.trim() : tableInput.value.trim();

    if (!searchValue) return alert('Please enter a search value.');

    // Show the loading spinner while waiting for results
    loadingDiv.style.display = 'block';

    let url = '';
    if (searchBy === 'name') {
        url = `${apiBaseUrl}/api/people?name=${encodeURIComponent(searchValue)}`;
    } else if (searchBy === 'table') {
        url = `${apiBaseUrl}/api/table/${encodeURIComponent(searchValue)}`;
    }

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            loadingDiv.style.display = 'none';
            showResults(data);
        })
        .catch((error) => {
            loadingDiv.style.display = 'none';
            alert('Error fetching data. Please try again later.');
            console.error(error);
        });
});

// Function to display results
function showResults(data) {
    if (data.error) {
        resultsDiv.innerHTML = `<p>${data.error}</p>`;
        return;
    }

    // Reset the results div before populating new results
    resultsDiv.innerHTML = '';
    
    if (data.length === 0) {
        resultsDiv.innerHTML = '<p>No results found.</p>';
        return;
    }

    // Create and display the table
    const table = document.createElement('table');
    table.setAttribute('id', 'results-table');
    
    const header = document.createElement('tr');
    header.innerHTML = '<th>First Name</th><th>Last Name</th><th>Table Number</th>';
    table.appendChild(header);

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.firstname}</td>
            <td>${item.lastname}</td>
            <td>${item.tablenumber}</td>
        `;
        table.appendChild(row);
    });

    resultsDiv.appendChild(table);
}

// Add Version Number in Footer
const footer = document.getElementById('footer');
footer.innerHTML = 'Version: 1.0.0';