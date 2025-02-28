const API_BASE_URL = "https://learning-hub-1whk.onrender.com";

async function fetchSubcategoryItems(subcategoryId) {
    try {
        const response = await fetch(`${API_BASE_URL}/learning-items?subcategory=${subcategoryId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch items: ${response.status}`);
        }
        const items = await response.json();
        renderItems(items);
    } catch (error) {
        console.error("Error fetching subcategory items:", error);
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

        itemDiv.appendChild(img);
        itemDiv.appendChild(title);
        itemDiv.appendChild(description);
        itemDiv.appendChild(cost);

        container.appendChild(itemDiv);
    });
}

function loadSubcategoryPage() {
    const params = new URLSearchParams(window.location.search);
    const subcategoryId = params.get("id");

    if (subcategoryId) {
        fetchSubcategoryItems(subcategoryId);
    } else {
        console.error("No subcategory ID found in URL.");
    }
}

loadSubcategoryPage();
