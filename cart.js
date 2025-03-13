// Get cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartList = document.getElementById("cart-list");
const emptyCartMessage = document.getElementById("empty-cart-message");
const cartTotal = document.getElementById("cart-total");

// Utility function to format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

// Function to render the cart items
function renderCart() {
  cartList.innerHTML = ""; // Clear the cart content
  let totalAmount = 0;

  if (cart.length === 0) {
    emptyCartMessage.style.display = "block";
    cartTotal.textContent = "Total: $0.00";
  } else {
    emptyCartMessage.style.display = "none";

    cart.forEach((item, index) => {
      totalAmount += item.total;

      // Create the cart item
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");

      cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-details">
          <h3>${item.name}</h3>
          <p>Price: ${formatCurrency(item.price)}</p>
          <p>Quantity: ${item.quantity}</p>
          <p>Total: ${formatCurrency(item.total)}</p>
          <button class="remove-item" onclick="removeItem(${index})">Remove</button>
        </div>
      `;
      cartList.appendChild(cartItem);
    });

    cartTotal.textContent =` Total: ${formatCurrency(totalAmount)}`;
  }
}

// Function to remove an item from the cart
function removeItem(index) {
  cart.splice(index, 1); // Remove item at specified index
  localStorage.setItem("cart", JSON.stringify(cart)); // Update localStorage
  renderCart(); // Re-render the cart
}

// Checkout button click handler
document.getElementById("checkout-btn").addEventListener("click", function () {
  alert("Proceeding to checkout!");
  window.location.href = "checkout.html";
});

// Back button click handler
document.getElementById("back-btn").addEventListener("click", function () {
  window.location.href = "intex.html"; // Redirect to index page
});

// Initial render of the cart
renderCart();




  