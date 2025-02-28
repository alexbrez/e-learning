const API_BASE_URL = "https://learning-hub-1whk.onrender.com";
const LOCAL_API_BASE_URL = "http://localhost:3000";

let sessionId = null; // Κρατάμε το session ID του χρήστη

// Διαχείριση υποβολής φόρμας σύνδεσης
async function handleLogin(event) {
    event.preventDefault(); // Αποτρέπουμε την ανανέωση της σελίδας

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch(`${LOCAL_API_BASE_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error(`Login failed: ${response.status}`);
        }

        const data = await response.json();
        sessionId = data.sessionId; // Αποθηκεύουμε το session ID
        
        //emfanisi id gia prosvasi sto kalathi
        console.log("Session ID:", sessionId);

        document.getElementById("login-message").textContent = "Login successful!";
        document.getElementById("login-form").style.display = "none";
    } catch (error) {
        console.error("Login error:", error);
        document.getElementById("login-message").textContent = "Login failed. Try again.";
    }
}

document.getElementById("login-form").addEventListener("submit", handleLogin);


async function fetchCategoryItems(categoryId) {
    try {
        const response = await fetch(`${API_BASE_URL}/learning-items?category=${categoryId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch items: ${response.status}`);
        }
        const items = await response.json();
        renderItems(items);
    } catch (error) {
        console.error("Error fetching category items:", error);
    }
}

function renderItems(items) {
    const container = document.getElementById("items-container");
    container.innerHTML = "";

    items.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "item";

        const img = document.createElement("img");
        img.src = item.image;
        img.alt = item.title;

        const title = document.createElement("h3");
        title.textContent = item.title;

        const description = document.createElement("p");
        description.textContent = item.description;

        const cost = document.createElement("p");
        cost.textContent = `Cost: $${item.cost}`;

        const button = document.createElement("button");
        button.textContent = "Add to Cart";
        button.addEventListener("click", () => addToCart(item));

        itemDiv.appendChild(img);
        itemDiv.appendChild(title);
        itemDiv.appendChild(description);
        itemDiv.appendChild(cost);
        itemDiv.appendChild(button);

        container.appendChild(itemDiv);
    });
}

async function addToCart(item) {
    if (!sessionId) {
        alert("Please login to add items to your cart.");
        return;
    }

    try {
        const response = await fetch(`${LOCAL_API_BASE_URL}/cart`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                sessionId,
                itemId: item.id,
                itemType: item.type,
                title: item.title,
                cost: item.cost,
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to add to cart: ${response.status}`);
        }

        alert("Item added to cart successfully!");
    } catch (error) {
        console.error("Error adding to cart:", error);
        alert("Failed to add item to cart.");
    }
}


function loadCategoryPage() {
    const params = new URLSearchParams(window.location.search);
    const categoryId = params.get("id");

    if (categoryId) {
        fetchCategoryItems(categoryId);
    } else {
        console.error("No category ID found in URL.");
    }
}

loadCategoryPage();
