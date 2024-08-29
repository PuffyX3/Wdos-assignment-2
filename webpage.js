let products = [];
let cart = [];

// Function to fetch products from JSON file
async function fetchProducts() {
    const response = await fetch('cosproducts.json');
    products = await response.json();
    console.log("Products fetched:", products);
}

// Add event listeners to "Add to Cart" buttons
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (event) => {
        const productId = event.target.dataset.id;
        const product = findProductById(productId);
        const quantityInput = document.querySelector(`input[data-id="${productId}"]`);
        const quantity = parseInt(quantityInput.value) || 1; // Default to 1 if no valid input

        if (product && quantity > 0) {
            // Add the exact quantity of items to the cart
            for (let i = 0; i < quantity; i++) {
                cart.push(product);
            }
            updateCart();

            // Save the cart array to local storage
            localStorage.setItem('cart', JSON.stringify(cart));
        } else if (quantity <= 0) {
            console.log("Cannot add item with zero or negative quantity");
        }
    });
});

// Function to find a product by ID
function findProductById(id) {
    return products.find(product => product.id === id);
}

// Function to update the cart display
function updateCart() {
    const cartTable = document.getElementById('carttable');
    const itemsQuantity = document.getElementById('itemsquantity');
    const total = document.getElementById('total');

    // Clear current cart display
    cartTable.innerHTML = '';

    // Calculate total and display items
    let totalAmount = 0;
    let itemsCount = 0;
    const cartSummary = {};

    cart.forEach(item => {
        if (!cartSummary[item.id]) {
            cartSummary[item.id] = { ...item, quantity: 0 };
        }
        cartSummary[item.id].quantity += 1;
    });

    Object.values(cartSummary).forEach(item => {
        const itemPrice = item.price * item.quantity;
        totalAmount += itemPrice;
        itemsCount += item.quantity;

        let quantityDisplay = item.quantity;

        // Append "kg" if the item's ID is between "025" and "060"
        if (item.id >= "025" && item.id <= "060") {
            quantityDisplay += " kg";
        }

        cartTable.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${quantityDisplay}</td>
                <td>Rs ${itemPrice.toFixed(2)}</td>
                <td><button class="remove" data-id="${item.id}">Remove item</button></td>
            </tr>`;
    });

    itemsQuantity.textContent = itemsCount;
    total.textContent = totalAmount.toFixed(2);

    // Add event listeners to "Remove item" buttons
    document.querySelectorAll('.remove').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.dataset.id;
            removeItemFromCart(productId);
        });
    });
}

// Function to remove an item from the cart
function removeItemFromCart(productId) {
    // Find the index of the first item of the product in the cart
    const productIndex = cart.findIndex(item => item.id === productId);
    if (productIndex !== -1) {
        // Remove the occurrence of the product from the cart
        cart.splice(productIndex, 1);
        updateCart();

        // Update local storage
        localStorage.setItem('cart', JSON.stringify(cart));
    }
}

// Function to empty the cart
function emptyCart() {
    cart = [];
    updateCart();
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Event listener for empty cart button
document.getElementById('emptycart').addEventListener('click', emptyCart);

// Fetch and display products when the page loads
fetchProducts();
