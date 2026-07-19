
const container = document.querySelector('.productCards');

const products = [
    { 
        id: "princessBea",
        name: "Princess Bea", 
        image: "princessBea.jpg",
        price: "2,280" 
    },
    {   
        id: "royalSwan",
        name: "Royal Swan", 
        image: "royalSwan.jpg",
        price: "1,950" 
    },
    { 
        id: "tulips",
        name: "Tulips", 
        image: "tulips.jpg",
        price: "1,980" 
    },
    { 
        id: "sweetRice",
        name: "Sweet Rice", 
        image: "sweetRice.jpg",
        price: "1,100" 
    },
    { 
        id: "kuyaRice",
        name: "Kuya Rice", 
        image: "kuyaRice.jpg",
        price: "1,980" 
    },
    { 
        id: "dragonLady",
        name: "Dragon Lady", 
        image: "dragonLady.jpg",
        price: "1,030" 
    },
    { 
        id: "kingOfZion",
        name: "King of Zion", 
        image: "KingOfZion.jpg",
        price: "2,100" 
    },
    { 
        id: "deliciousRice",
        name: "Delicious Rice", 
        image: "deliciousRice.jpg",
        price: "1,030" 
    },
];

const cardsHTML = products
    .map(
        (product) => `
        <div class="productCard">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>₱ <span>${product.price}</span></p>

            <div class="addToCartBtn">
                <button>Add to Cart</button>
            </div>
        </div>
    `
    )
    .join("");

    

container.innerHTML = cardsHTML;


