document.addEventListener("DOMContentLoaded", function () {
    loadCartItems();
});

// Load all cart items from localStorage
function loadCartItems() {
    const orderItemsContainer = document.getElementById("order-items");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        orderItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    orderItemsContainer.innerHTML = cart.map((item, index) => `
        <div class="order-item">
            <img src="${item.image}" alt="${item.name}" class="item-image">
            <div>
                <h3 class="product-name">${item.name}</h3>
                <p>Price: $${item.price}</p>
                <p class="quantity">Quantity: ${item.quantity}</p>
                <p>Total: $${(item.price * item.quantity).toFixed(2)}</p>
                <button class="remove-item" onclick="removeItem(${index})">Remove</button>
            </div>
        </div>
    `).join("");
}

// Remove a specific item from the cart
function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);  // Remove the item at the given index
    localStorage.setItem("cart", JSON.stringify(cart));  // Update localStorage
    loadCartItems();  // Re-render cart items
}

// Show Payment Details
function showPaymentDetails() {
    const paymentMethod = document.getElementById("payment").value;
    const paymentDetails = document.getElementById("payment-details");

    if (paymentMethod === "credit-card") {
        paymentDetails.innerHTML = `
            <h3>Credit Card Details</h3>
            <label for="card-number">Card Number:</label>
            <input type="text" id="card-number" placeholder="1234 5678 9012 3456" required>
            <label for="expiry">Expiry Date:</label>
            <input type="month" id="expiry" required>
            <label for="cvv">CVV:</label>
            <input type="text" id="cvv" placeholder="123" required>
        `;
    } else if (paymentMethod === "gpay") {
        paymentDetails.innerHTML = `
            <h3>GPay Payment</h3>
            <p>Scan the QR code to pay.</p>
            <img src="qr code.jpg" alt="GPay QR Code" width="200" height="200">
        `;
    } else if (paymentMethod === "bank-transfer") {
        paymentDetails.innerHTML = `
            <h3>Bank Transfer Details</h3>
            <label for="account-name">Account Name:</label>
            <input type="text" id="account-name" required>
            <label for="bank-name">Bank Name:</label>
            <input type="text" id="bank-name" required>
            <label for="account-number">Account Number:</label>
            <input type="text" id="account-number" required>
            <label for="ifsc-code">IFSC Code:</label>
            <input type="text" id="ifsc-code" required>
        `;
    } else {
        paymentDetails.innerHTML = "";  // Clear payment details if no method is selected
    }
}

// Proceed to payment and submit order
async function proceedToPayment() {


    console.log("Place Order Button Clicked");

    const name = document.getElementById("name")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const address = document.getElementById("address")?.value.trim();
    const phone = document.getElementById("phone")?.value.trim();
    const paymentMethod = document.getElementById("payment")?.value;

    // Basic validation for required fields
    if (!name || !email || !address || !phone || !paymentMethod) {
        alert("Please fill all fields.");
        return;
    }

    let products = [];
    document.querySelectorAll("#order-items .order-item").forEach(item => {
        const productName = item.querySelector(".product-name")?.textContent;
        const quantityText = item.querySelector(".quantity")?.textContent || "";
        const quantity = parseInt(quantityText.replace("Quantity: ", ""), 10);
        const priceText = item.querySelector("p:nth-of-type(1)")?.textContent || "$0";
        const price = parseFloat(priceText.replace("Price: $", ""));
        const image = item.querySelector("img")?.src || "";

        if (productName && quantity > 0) {
            products.push({ productName, quantity, price, image });
        }
    });

    const paymentDetails = getPaymentDetails(paymentMethod); // Store payment details


    // Store the order data in localStorage
    localStorage.setItem("orderItems", JSON.stringify(products));
    localStorage.setItem("paymentDetails", JSON.stringify({ paymentMethod, details: paymentDetails }));

    const response = await fetch("http://localhost:3000/checkout", {

            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, address, phone, paymentMethod, paymentDetails, products }),
        });

        const result = await response.json();

        if (response.ok && result.message) {
            alert(result.message);

            if (result.message === "Order placed successfully!") {
                localStorage.setItem("orderId", result.orderId);  // Save orderId from the backend response
                window.location.href = "order-summary.html";  // Redirect to the order summary page
            }
        } else {
            alert(result.message || "Failed to place the order.");
        }
    try {
        const response = await fetch("http://localhost:3000/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, address, phone, paymentMethod, paymentDetails, products }),
        });

        const result = await response.json();

        if (response.ok && result.message) {
            alert(result.message);

            if (result.message === "Order placed successfully!") {
                localStorage.removeItem("cart"); // Clear cart after order is placed
                window.location.href = "order-summary.html";  // Redirect to order summary page after successful order
            }
        } else {
            alert(result.message || "Failed to place the order.");
        }
    } catch (error) {
        console.error("Error submitting order:", error);
        alert("Failed to place order.");
    }



}


// Get the payment details from the form based on the selected payment method
function getPaymentDetails(paymentMethod) {
    console.log("Payment Method Selected:", paymentMethod);  // Debug log
    if (paymentMethod === "credit-card") {
        return {
            cardNumber: document.getElementById("card-number")?.value,
            expiry: document.getElementById("expiry")?.value,
            cvv: document.getElementById("cvv")?.value,
        };
    } else if (paymentMethod === "gpay") {
        return { qrCode: "qr code.jpg" }; // Example for GPay
    } else if (paymentMethod === "bank-transfer") {
        return {
            accountName: document.getElementById("account-name")?.value,
            bankName: document.getElementById("bank-name")?.value,
            accountNumber: document.getElementById("account-number")?.value,
            ifscCode: document.getElementById("ifsc-code")?.value,
        };
    }
    return {};
}
