document.addEventListener("DOMContentLoaded", () => {
    fetch('vendors.json')
        .then(response => response.json())
        .then(data => {
            const vendorListSection = document.getElementById('vendor-list');
            const vendorDetailsSection = document.getElementById('vendor-details');

            data.forEach((vendor, index) => {
                const vendorDiv = document.createElement('div');
                vendorDiv.classList.add('vendor');

                const vendorNameContainer = document.createElement('div');
                vendorNameContainer.classList.add('vendor-name-container');
                vendorDiv.appendChild(vendorNameContainer);

                const vendorNameHeading = document.createElement('h3');
                vendorNameHeading.textContent = 'Vendor Name:';
                vendorNameHeading.classList.add('heading');
                vendorNameContainer.appendChild(vendorNameHeading);

                const vendorName = document.createElement('h1');
                vendorName.textContent = vendor.name;
                vendorName.classList.add('name');
                vendorNameContainer.appendChild(vendorName);

                const productNameHeading = document.createElement('h3');
                productNameHeading.textContent = 'Product Names:';
                productNameHeading.classList.add('heading-pro');
                vendorDiv.appendChild(productNameHeading);

                const productList = document.createElement('ul');
                vendor.products.forEach((product, productIndex) => {
                    const productItem = document.createElement('li');
                    productItem.textContent = product.productName;
                    productItem.classList.add('product');
                    productList.appendChild(productItem);
                });
                vendorDiv.appendChild(productList);

                const viewDetailsButton = document.createElement('button');
                viewDetailsButton.classList.add('view-details', 'large-button');
                viewDetailsButton.textContent = 'View Details';
                viewDetailsButton.dataset.index = index;
                vendorDiv.appendChild(viewDetailsButton);

                vendorListSection.appendChild(vendorDiv);
            });

            document.querySelectorAll('.view-details').forEach(button => {
                button.addEventListener('click', (event) => {
                    const index = event.target.dataset.index;
                    const vendor = data[index];

                    const vendorDetails = `
                        <h2 class="vendor-highlight">${vendor.name}</h2>
                        <p><strong>Company Name:</strong> ${vendor.companyName}</p>
                        <p><strong>Address:</strong> ${vendor.address}</p>
                        <p><strong>Mobile Number:</strong> ${vendor.mobileNumber}</p>
                        <p><strong>Email ID:</strong> ${vendor.email}</p>
                    `;

                    const productList = vendor.products.map(product => `
                        <div class="product product-details">
                            <p><strong>Product Name:</strong> ${product.productName}</p>
                            <p><strong>Product ID:</strong> ${product.productId}</p>
                            <p><strong>Model Number:</strong> ${product.modelNumber}</p>
                            <p><strong>Price:</strong> ${product.price}</p>
                            <p><strong>Original Manufacturer:</strong> ${product.originalManufacturer}</p>
                            <button class="send-request" data-vendor-index="${index}" data-product-index="${vendor.products.indexOf(product)}">Send Request</button>
                        </div>
                    `).join('');

                    vendorDetailsSection.innerHTML = vendorDetails + productList;
                    vendorDetailsSection.style.display = 'block';
                    vendorListSection.style.display = 'none';

                    document.querySelectorAll('.send-request').forEach(sendButton => {
                        sendButton.addEventListener('click', (event) => {
                            console.log('Send request button clicked');
                            const vendorIndex = event.target.dataset.vendorIndex;
                            const productIndex = event.target.dataset.productIndex;
                            const selectedProduct = data[vendorIndex].products[productIndex];

                            console.log('Selected product:', selectedProduct);

                            document.body.innerHTML = `
                            <div class="box">
                            <h2>Product Details</h2>
                            <div class="product-details">
                                <p><strong>Product Name:</strong> ${selectedProduct.productName}</p>
                                <p><strong>Product ID:</strong> ${selectedProduct.productId}</p>
                                <p><strong>Model Number:</strong> ${selectedProduct.modelNumber}</p>
                                <p><strong>Price:</strong> ${selectedProduct.price}</p>
                                <p><strong>Original Manufacturer:</strong> ${selectedProduct.originalManufacturer}</p>
                            </div>
                            <label for="quantity">Quantity:</label>
                            <input type="number" id="quantity" name="quantity" min="1">
                            <div class="button">
                            <button id="sendRequestBtn">Send Request</button>
                            <button onclick="location.reload()">Back</button>
                            </div>
                        </div>
                        <style>
                        body {
                            font-family: Arial, sans-serif;
                            padding: 20px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            margin: 0;
                            background-image: url('./assets/img.jpg'); /* Ensure the background image is still applied */
                            background-size: cover;
                            background-position: center;
                            background-repeat: no-repeat;
                        }
                        .box {
                            background-color: #f9f9f9;
                            padding: 20px;
                            border-radius: 8px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                            max-width: 400px;
                            width: 100%;
                        }
                        .product-details {
                            margin-bottom: 20px;
                        }
                        input {
                            display: block;
                            margin-top: 10px;
                            width: 100%;
                            padding: 8px;
                            box-sizing: border-box;
                        }
                        .button{
                            // background-color: #4070f4;
                            margin-left: 50px
                        }
                        button {
                            display: block;
                            width: 70%;
                            padding: 10px;
                            margin-top: 10px;
                            cursor: pointer;
                            background-color: #4070f4;
                            border-radius: 25px;
                            // right: 200px;
                            color:white;
                        }
                        button{
                            margin-top: 25px;
                            margin-left: 30px;
                        }
                        button:hover{
                            background-color: black;
                        }
                    </style>
                            `;

                            document.getElementById('sendRequestBtn').addEventListener('click', () => {
                                const quantity = document.getElementById('quantity').value;
                                console.log(`Request sent for ${quantity} units of ${selectedProduct.productName}`);
                                alert(`Request sent for ${quantity} units of ${selectedProduct.productName}`);
                                // Add your request sending logic here
                            });
                        });
                    });
                });
            });
        })
        .catch(error => console.error('Error fetching vendor data:', error));
});
