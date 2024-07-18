document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('vendorSearchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsDiv = document.getElementById('searchResults');

    // Check if elements are correctly found
    if (!searchInput || !searchButton || !resultsDiv) {
        console.error('Error: One or more DOM elements were not found.');
        return;
    }

    searchButton.addEventListener('click', async (event) => {
        event.preventDefault(); // Prevent default form submission

        const searchTerm = searchInput.value.trim().toLowerCase();
        resultsDiv.innerHTML = ''; // Clear previous results

        if (searchTerm) {
            try {
                // Fetch the data from data.json
                const response = await fetch('data.json', {
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const vendors = await response.json();

                // Ensure vendors is an array
                if (!Array.isArray(vendors)) {
                    throw new Error('Error: Data is not an array.');
                }

                // Find matching vendor by name
                const matchingVendor = vendors.find(vendor => {
                    if (vendor && vendor.vendorName) {
                        return vendor.vendorName.toLowerCase().includes(searchTerm); // Change to match partial names
                    } else {
                        console.warn('Warning: Vendor or vendor name is undefined.');
                        return false;
                    }
                });

                // Display the result
                if (matchingVendor) {
                    resultsDiv.innerHTML = `<p>Vendor found: ${matchingVendor.vendorName}, Certificate Type: ${matchingVendor.certificateType}, Submission Date: ${matchingVendor.submissionDate}</p>`;
                } else {
                    resultsDiv.innerHTML = '<p>No vendor found.</p>';
                }
            } catch (error) {
                console.error('Error fetching or processing data:', error);
                resultsDiv.innerHTML = '<p>Error searching for vendor. See console for details.</p>';
            }
        } else {
            resultsDiv.innerHTML = '<p>Please enter a vendor name.</p>';
        }
    });
});
