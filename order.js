document.addEventListener("DOMContentLoaded", function () {
    const storedOrders = JSON.parse(localStorage.getItem("cart")) || [];
    const consolidatedCart = consolidateCart(storedOrders);
    updateOrderTable(consolidatedCart);
    updateTotal(consolidatedCart);

    //click event to the "Add to Favorite" button
    const addToFavButton = document.getElementById("addtofav");
    if (addToFavButton) {
        addToFavButton.addEventListener("click", () => addToFavorites(consolidatedCart));
    }

    const applyFavButton = document.getElementById("applyfav");
    if (applyFavButton) {
        applyFavButton.addEventListener("click", () => applyFavourite(consolidatedCart));
    }

    const placeOrderButton = document.getElementById("place_order");
    if (placeOrderButton) {
        placeOrderButton.addEventListener("click", placeOrder);
    }
});

// Function to gather cart items by ID
function consolidateCart(cart) {
    const itemMap = {};

    cart.forEach(item => {
        if (itemMap[item.id]) {
            // If the item already exists in the itemmap, update its quantity and total price
            itemMap[item.id].quantity += 1;
            itemMap[item.id].totalPrice += item.price;
        } else {
            // Otherwise, create a new item in the map
            itemMap[item.id] = {
                ...item,
                quantity: 1,
                totalPrice: item.price
            };
        }
    });

    // Convert  the above thingy back into an array
    return Object.values(itemMap);
}

function updateOrderTable(cart) {
    const orderTable = document.getElementById("order");
    if (!orderTable) {
        console.error("Order table not found");
        return;
    }

    const tbody = orderTable.querySelector("tbody") || document.createElement("tbody");
    tbody.innerHTML = ""; // Clear previous cart

    tbody.innerHTML += `<tr>
        <th>Product</th>
        <th>Quantity</th>
        <th>Price of items</th>
    </tr>`;

    cart.forEach(item => {
        // Append "kg" if the item's ID is between "025" and "060"
        const quantityDisplay = (item.id >= "025" && item.id <= "060") ? `${item.quantity} kg` : item.quantity;

        tbody.innerHTML += `<tr>
            <td>${item.name}</td>
            <td>${quantityDisplay}</td>
            <td>${item.totalPrice.toFixed(2)}</td>
        </tr>`;
    });
    orderTable.appendChild(tbody);
}

function updateTotal(cart) {
    const orderTotal = document.getElementById("totalorder");
    if (!orderTotal) {
        console.error("Total order element not found");
        return;
    }

    let totalPrice = 0;

    cart.forEach(item => {
        totalPrice += item.totalPrice;
    });

    orderTotal.innerHTML = `Your total is: $${totalPrice.toFixed(2)}`;
}

function addToFavorites(cart) {
    // Save the current cart to local storage as a favorite
    localStorage.setItem("favourite", JSON.stringify(cart));
    console.log("Items added to favorites:", cart);
    alert("Items have been added to your favorites!");
}

function applyFavourite(currentCart) {
    const favlist = JSON.parse(localStorage.getItem("favourite")) || [];
    
    // Update the cart with favorite items
    favlist.forEach(favItem => {
        const tableItem = currentCart.find(cartItem => cartItem.id === favItem.id);

        if (tableItem) {
            // If item already exists in cart, update its quantity and total price
            tableItem.quantity += favItem.quantity;
            tableItem.totalPrice += favItem.totalPrice;
        } else {
            // else add the favorite item to the cart
            currentCart.push({ ...favItem });
        }
    });

    // Update the table and total with the updated cart
    updateOrderTable(currentCart);
    updateTotal(currentCart);
}

function placeOrder() {
    const form = document.getElementById('orderForm'); // Correctly select the form using its ID
    const currentDate = new Date();
    
    // Check if the form is valid
    if (form.checkValidity()) {
        // If the form is valid, proceed with placing the order
        alert(`You've placed an order on ${currentDate.toLocaleDateString()}. Your cart will be delivered soon. Thank you!`);
    } else {
        // If the form is invalid, display an alert and report form validity
        alert("Please fill all the required fields in the form.");
        form.reportValidity(); // This will highlight the invalid fields
    }
}
