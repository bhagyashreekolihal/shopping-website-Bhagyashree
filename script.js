
// Get HTML Elements
const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const cartToggle = document.getElementById("cartToggle");
const closeCart = document.getElementById("closeCart");
const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

const checkoutBtn = document.getElementById("checkoutBtn");

let products = [];
let cart = [];
let selectedCategory = "All";


// Format Price
function formatPrice(price) {
    return "₹" + price.toLocaleString("en-IN");
}


// Fetch Products from JSON
async function loadProducts() {

    try {

        const response = await fetch("products.json");

        if (!response.ok) {
            throw new Error("Unable to load products.");
        }

        products = await response.json();

        displayProducts(products);

    } catch (error) {

        productGrid.innerHTML = `
            <p class="no-products">
                Unable to load products.
                Please run the website using Live Server.
            </p>
        `;

        console.error(error);

    }

}


// Display Products
function displayProducts(productList) {

    productGrid.innerHTML = "";

    if (productList.length === 0) {

        productGrid.innerHTML = `
            <p class="no-products">
                No products found!
            </p>
        `;

        return;
    }

    productList.forEach(product => {

        const card = document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `

            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >

            </div>

            <div class="product-info">

                <p class="product-category">
                    ${product.category}
                </p>

                <h3>${product.name}</h3>

                <div class="rating">
                    ⭐ ${product.rating} / 5
                </div>

                <div class="price">
                    ${formatPrice(product.price)}
                </div>

                <button
                    class="add-cart-btn"
                    data-id="${product.id}"
                >
                    🛒 Add to Cart
                </button>

            </div>

        `;

        productGrid.appendChild(card);

    });

}


// Search Products
function searchProducts() {

    const searchValue = searchInput.value.toLowerCase().trim();

    const filteredProducts = products.filter(product => {

        const matchesSearch =
            product.name.toLowerCase().includes(searchValue) ||
            product.category.toLowerCase().includes(searchValue);

        const matchesCategory =
            selectedCategory === "All" ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;

    });

    displayProducts(filteredProducts);

}


// Search Button
searchBtn.addEventListener("click", searchProducts);


// Search While Typing
searchInput.addEventListener("input", searchProducts);


// Category Filtering
document.querySelectorAll(".category-btn").forEach(button => {

    button.addEventListener("click", () => {

        document.querySelector(".category-btn.active")
            .classList.remove("active");

        button.classList.add("active");

        selectedCategory = button.dataset.category;

        searchProducts();

    });

});


// Add Products to Cart
productGrid.addEventListener("click", function(event) {

    const button = event.target.closest(".add-cart-btn");

    if (!button) return;

    const productId = Number(button.dataset.id);

    addToCart(productId);

});


// Add to Cart Function
function addToCart(productId) {

    const product = products.find(item => item.id === productId);

    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }

    updateCart();

    buttonFeedback();

}


// Button Feedback
function buttonFeedback() {

    cartToggle.style.transform = "scale(1.1)";

    setTimeout(() => {
        cartToggle.style.transform = "scale(1)";
    }, 200);

}


// Update Cart
function updateCart() {

    cartItems.innerHTML = "";

    let total = 0;
    let count = 0;

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                Your cart is empty!
            </p>
        `;

    }

    cart.forEach(item => {

        total += item.price * item.quantity;

        count += item.quantity;

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `

            <img src="${item.image}" alt="${item.name}">

            <div class="cart-item-info">

                <h4>${item.name}</h4>

                <p>${formatPrice(item.price)}</p>

                <div class="quantity-controls">

                    <button
                        class="quantity-btn"
                        data-id="${item.id}"
                        data-action="decrease"
                    >−</button>

                    <span>${item.quantity}</span>

                    <button
                        class="quantity-btn"
                        data-id="${item.id}"
                        data-action="increase"
                    >+</button>

                </div>

                <button
                    class="remove-btn"
                    data-id="${item.id}"
                >
                    Remove
                </button>

            </div>

        `;

        cartItems.appendChild(cartItem);

    });

    cartCount.textContent = count;

    cartTotal.textContent = formatPrice(total);

}


// Cart Quantity and Remove Controls
cartItems.addEventListener("click", function(event) {

    const button = event.target.closest("button");

    if (!button) return;

    const productId = Number(button.dataset.id);

    if (button.classList.contains("quantity-btn")) {

        const item = cart.find(item => item.id === productId);

        if (!item) return;

        if (button.dataset.action === "increase") {

            item.quantity++;

        } else if (button.dataset.action === "decrease") {

            item.quantity--;

            if (item.quantity <= 0) {
                cart = cart.filter(item => item.id !== productId);
            }

        }

    }

    if (button.classList.contains("remove-btn")) {

        cart = cart.filter(item => item.id !== productId);

    }

    updateCart();

});


// Open Cart
function openCart() {

    cartSidebar.classList.add("active");

    cartOverlay.classList.add("active");

}


// Close Cart
function hideCart() {

    cartSidebar.classList.remove("active");

    cartOverlay.classList.remove("active");

}


cartToggle.addEventListener("click", openCart);

closeCart.addEventListener("click", hideCart);

cartOverlay.addEventListener("click", hideCart);


// Checkout Button
checkoutBtn.addEventListener("click", function() {

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;

    }

    alert(
        "Thank you for shopping with ShopZone! " +
        "Your total is " + cartTotal.textContent +
        ". This is a demo checkout."
    );

});


// Newsletter Subscription
document.getElementById("newsletterForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const email = document.getElementById("emailInput").value;

        alert("Thank you for subscribing: " + email);

        this.reset();

    });


// Load Products When Website Opens
loadProducts();


// Initialize Cart
updateCart();


