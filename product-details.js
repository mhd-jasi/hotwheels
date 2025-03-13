document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
  
    const productName = params.get("name") || "No Name Available";
    const productDescription = params.get("description") || "No Description Available";
    const productPrice = params.get("price") || "N/A";
    const productImage = params.get("image") || "default.jpg";
  
    // Split the description into an array of lines
    const descriptionLines = productDescription.split('\n');
  
    // Render product details
    const productDetailsContainer = document.getElementById("product-details");
    productDetailsContainer.innerHTML = `
      <div class="product-details-card">
        <img src="${productImage}" alt="${productName}" style="max-width: 300px;">
        <h2>${productName}</h2>
        <p><strong>Price:</strong> $${parseFloat(productPrice).toFixed(2)}</p>
        <h3>Product Details:</h3>
        <ul>
          ${descriptionLines.map(line => `<li>${line}</li>`).join('')}
        </ul>
        <button onclick="window.history.back()">Back</button>
      </div>
    `;
  });
  
  