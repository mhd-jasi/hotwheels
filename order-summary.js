document.addEventListener("DOMContentLoaded", function () {
    displayOrderSummary();
});

function displayOrderSummary() {
    const orderItems = JSON.parse(localStorage.getItem("orderItems")) || [];
    const paymentDetails = JSON.parse(localStorage.getItem("paymentDetails")) || {};

    const orderItemsContainer = document.getElementById("order-items-summary");
    const paymentSummaryContainer = document.getElementById("payment-summary");
    const totalSummaryContainer = document.getElementById("order-summary-total");

    // Debugging: Check if the data is correctly retrieved from localStorage
    console.log("Order Items:", orderItems);
    console.log("Payment Details:", paymentDetails);

    if (orderItems.length === 0) {
        orderItemsContainer.innerHTML = "<p>Your order is empty.</p>";
    } else {
        let totalPrice = 0;
        orderItemsContainer.innerHTML = orderItems.map(item => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;
            return `
                <div class="order-item">
                    <img src="${item.image}" alt="${item.productName}" class="item-image">
                    <div>
                        <h3 class="product-name">${item.productName}</h3>
                        <p>Price: $${item.price}</p>
                        <p>Quantity: ${item.quantity}</p>
                        <p>Total: $${itemTotal.toFixed(2)}</p>
                    </div>
                </div>
            `;
        }).join("");

        // Display the total price
        totalSummaryContainer.innerHTML = `<h3>Total: $${totalPrice.toFixed(2)}</h3>`;
    }

    if (paymentDetails.paymentMethod) {
        paymentSummaryContainer.innerHTML = `
            <h3>Payment Method: ${paymentDetails.paymentMethod}</h3>
            <p>Details: ${JSON.stringify(paymentDetails.details, null, 2)}</p> <!-- Pretty-print JSON -->
        `;
    } else {
        paymentSummaryContainer.innerHTML = "<p>No payment method selected.</p>";
    }
}

