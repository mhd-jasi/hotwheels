document.querySelector(".contact-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const comment = document.getElementById("comment").value.trim();

    if (!name || !phone || !email || !comment) {
        alert("All fields are required!");
        return;
    }

    const formData = { name, phone, email, comment };

    try {
        const response = await fetch("http://localhost:3000/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message || "Your message has been sent successfully!");
        } else {
            console.error('Error:', result.error);  // Log the detailed error response from the server
            alert(result.message || "Something went wrong, please try again.");
        }
    } catch (error) {
        console.error("Error submitting form:", error);  // Log the error if the fetch fails
        alert("Failed to submit the form. Try again later.");
    }
});
