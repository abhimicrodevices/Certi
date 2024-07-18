// script.js

document.addEventListener('DOMContentLoaded', () => {
    fetchVendorData();
    setupSearch();
});

let allVendors = [];  

function fetchVendorData() {
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            allVendors = data; 
            renderVendorTable(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function renderVendorTable(data) {
    const vendorTableBody = document.querySelector('#vendor-table tbody');

    // Clear previous content
    vendorTableBody.innerHTML = '';

    // Loop through each vendor object in the JSON data
    data.forEach(vendor => {
        // Create a table row (tr) for each vendor
        const row = document.createElement('tr');

        // Populate row cells with vendor information
        row.innerHTML = `
            <td>${vendor.vendorName}</td>
            <td>${vendor.certificateType}</td>
            <td>${vendor.submissionDate}</td>
            <td>
                <button onclick="viewDetails('${vendor.vendorName}')">View Details</button>
                <button onclick="verify()">Verify</button>
            </td>
        `;

        // Append row to the table body
        vendorTableBody.appendChild(row);
    });
}

function setupSearch() {
    const searchBar = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');

    searchButton.addEventListener('click', () => searchVendors(searchBar.value.trim()));
    searchBar.addEventListener('keypress', event => {
        if (event.key === 'Enter') {
            searchVendors(searchBar.value.trim());
        }
    });
}

function searchVendors(query) {
    if (!query) {
        renderVendorTable(allVendors);  // Show all vendors if search query is empty
        return;
    }

    
    const filteredVendors = allVendors.filter(vendor =>
        vendor.vendorName.toLowerCase().includes(query.toLowerCase())
    );

    renderVendorTable(filteredVendors);
}

function viewDetails(vendorName) {
    console.log('View details for:', vendorName);
    
    window.location.href = `vendor.html?vendor=${encodeURIComponent(vendorName)}`;
}

function verify() {
    console.log('Verification process started');
    
    window.location.href = 'validate.html';
}
