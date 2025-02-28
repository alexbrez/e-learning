const API_BASE_URL = "https://learning-hub-1whk.onrender.com";

async function fetchCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (!response.ok) {
            throw new Error(`Failed to fetch categories: ${response.status}`);
        }
        const categories = await response.json();
        renderCategories(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
}

function renderCategories(categories) {
    const container = document.getElementById("categories-container");
    container.innerHTML = ""; // Καθαρίζουμε το container

    categories.forEach(category => {
        const categoryDiv = document.createElement("div");
        categoryDiv.className = "category";

        const img = document.createElement("img");
        img.src = category.img_url;
        img.alt = category.title;

        const title = document.createElement("h3");
        title.textContent = category.title;

        const link = document.createElement("a");
        link.href = `category.html?id=${category.id}`;
        link.textContent = "View Category";

        categoryDiv.appendChild(img);
        categoryDiv.appendChild(title);
        categoryDiv.appendChild(link);

        container.appendChild(categoryDiv);
    });
}

// Φόρτωση κατηγοριών κατά το άνοιγμα της σελίδας
fetchCategories();
