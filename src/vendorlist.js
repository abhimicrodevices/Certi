// vendorlist.js
document.addEventListener('DOMContentLoaded', () => {
    async function fetchAndDisplayVendors() {
        try {
            const response = await fetch('vendor_data.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            displayVendors(data);
        } catch (error) {
            console.error('Error fetching vendor data:', error);
        }
    }

    function displayVendors(vendors) {
        const vendorList = document.getElementById('vendor-list');
        vendorList.innerHTML = '';
        vendors.forEach(vendor => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${vendor.vendor_name}</td>
                <td>${vendor.vendor_number}</td>
                <td>${vendor.company_name}</td>
                <td>${vendor.vendor_place}</td>
                <td>${vendor.company_email}</td>
                <td>${vendor.company_number}</td>
            `;
            vendorList.appendChild(row);
        });
    }

    fetchAndDisplayVendors();
});
