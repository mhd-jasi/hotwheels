document.addEventListener("DOMContentLoaded", function () {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Common function to add items to the cart
  function addItemToCart(product, isBuyNow = false) {
    const existingItemIndex = cart.findIndex(item => item.name === product.name);

    if (isBuyNow) {
      cart.push(product);
    } else {
      if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += product.quantity;
        cart[existingItemIndex].total = parseFloat((cart[existingItemIndex].price * cart[existingItemIndex].quantity).toFixed(2));
      } else {
        cart.push(product);
      }
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCounter();

    // Show alert only if it's not a Buy Now action
    if (!isBuyNow) {
      alert("Your item has been added to the cart!");
    }

    // If Buy Now, redirect to checkout, else do nothing
    if (isBuyNow) {
      window.location.href = "checkout.html";
    }
  }

  // Handle Add to Cart and Buy Now button click
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  const buyNowButtons = document.querySelectorAll(".buy-now");
  const viewDetailsButtons = document.querySelectorAll(".view-details");

  // Add to Cart functionality
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const card = button.closest(".product-card");
      const productName = card.querySelector("h3").textContent;
      const productPriceText = card.querySelector("p").textContent.trim();
      const productPrice = extractPrice(productPriceText);
      const productImage = card.querySelector("img").src;
      const quantityInput = card.querySelector('input[type="number"]');
      const quantity = parseInt(quantityInput?.value) || 1;

      if (isNaN(productPrice) || quantity <= 0) {
        alert("Invalid input.");
        return;
      }

      const product = {
        name: productName,
        price: parseFloat(productPrice.toFixed(2)),
        quantity: quantity,
        image: productImage,
        total: parseFloat((productPrice * quantity).toFixed(2)),
        originalPriceText: formatCurrency(productPrice)
      };

      addItemToCart(product);  // Add item without Buy Now behavior
    });
  });

  // Buy Now functionality
  buyNowButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const card = button.closest(".product-card");
      const productName = card.querySelector("h3").textContent;
      const productPriceText = card.querySelector("p").textContent.trim();
      const productPrice = extractPrice(productPriceText);
      const productImage = card.querySelector("img").src;
      const quantityInput = card.querySelector('input[type="number"]');
      const quantity = parseInt(quantityInput?.value) || 1;

      if (isNaN(productPrice) || quantity <= 0) {
        alert("Invalid input.");
        return;
      }

      const product = {
        name: productName,
        price: parseFloat(productPrice.toFixed(2)),
        quantity: quantity,
        image: productImage,
        total: parseFloat((productPrice * quantity).toFixed(2)),
        originalPriceText: formatCurrency(productPrice)
      };

      addItemToCart(product, true);  // Add item with Buy Now behavior
    });
  });

  // View Details functionality
  viewDetailsButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const card = button.closest(".product-card");

      // Extract details from data attributes
      const productName = button.getAttribute("data-name");
      const productDescription = button.getAttribute("data-description");
      const productPrice = button.getAttribute("data-price");
      const productImage = button.getAttribute("data-image");

      // Build the query string for the URL
      const queryString = `product-details.html?name=${encodeURIComponent(productName)}&description=${encodeURIComponent(productDescription)}&price=${encodeURIComponent(productPrice)}&image=${encodeURIComponent(productImage)}`;

      // Redirect to the product-details page
      window.location.href = queryString;
    });
  });

  function extractPrice(priceText) {
    const match = priceText.replace(/[^0-9.-]+/g, "");
    return parseFloat(match);
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
  }

  function updateCartCounter() {
    const cartCounter = document.getElementById("cart-counter");
    if (cartCounter) {
      cartCounter.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
  }

  updateCartCounter();
});