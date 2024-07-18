document.addEventListener('DOMContentLoaded', () => {
    async function fetchAndDisplayVendors() {
        try {
            const response = await fetch('item.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            displayVendors(data);
        } catch (error) {
            console.error('Error fetching item data:', error);
        }
    }

    function displayVendors(items) {
        const itemList = document.getElementById('item-list');
        itemList.innerHTML = '';
        items.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.productId}</td>
                <td>${item.modelNumber}</td>
                <td>${item.productName}</td>
                <td>${item.price}</td>
                <td>
                    <button class="edit-btn" data-index="${index}">Edit</button>
                    <button class="delete-btn" data-index="${index}">Delete</button>
                </td>
            `;
            itemList.appendChild(row);
        });

        // Add event listeners for edit and delete buttons
        itemList.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', handleEdit);
        });

        itemList.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', handleDelete);
        });
    }

    function handleEdit(event) {
        const index = event.target.dataset.index;
        const item = document.querySelectorAll('#item-list tr')[index];
        const priceColumn = item.querySelector('td:nth-child(4)');
        
        // Create an input element to edit the price
        const currentPrice = priceColumn.textContent;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentPrice;
        input.className = 'edit-input';

        // Replace the price cell content with the input element
        priceColumn.textContent = '';
        priceColumn.appendChild(input);
        input.focus();

        // Handle saving the new value
        input.addEventListener('blur', () => {
            priceColumn.textContent = input.value;
        });

        // Save the new value when Enter is pressed
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                priceColumn.textContent = input.value;
            } else if (e.key === 'Escape') {
                priceColumn.textContent = currentPrice; // Revert to the old price on Escape
            }
        });
    }

    function handleDelete(event) {
        const index = event.target.dataset.index;
        const itemList = document.getElementById('item-list');
        itemList.removeChild(document.querySelectorAll('#item-list tr')[index]);
    }

    fetchAndDisplayVendors();
});