document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.pictureMotion');
    if (!container) return;

    // ---------- STEP 1: build the product cards ----------
    const products = [
        { 
            name: "Princess Bea", 
            image: "princessBea.jpg",
            price: "2,280" 
        },
        { 
            name: "Royal Swan", 
            image: "royalSwan.jpg",
            price: "1,950" 
        },
        { 
            name: "Tulips", 
            image: "tulips.jpg",
            price: "1,980" 
        },
        { 
            name: "Sweet Rice", 
            image: "sweetRice.jpg",
            price: "1,100" 
        },
        { 
            name: "Kuya Rice", 
            image: "kuyaRice.jpg",
            price: "1,980" 
        },
        { 
            name: "Dragon Lady", 
            image: "dragonLady.jpg",
            price: "1,030" 
        },
        { 
            name: "King of Zion", 
            image: "KingOfZion.jpg",
            price: "2,100" 
        },
        { 
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
            </div>
        `
        )
        .join("");

    container.innerHTML = cardsHTML;

    // ---------- STEP 2: turn the cards into an infinite slider ----------
   

    container.style.overflow = 'hidden';
    container.style.position = 'relative';

    const track = document.createElement('div');
    track.style.display = 'flex';
    track.style.width = 'max-content';
    track.style.willChange = 'transform';

    const originalCards = Array.from(container.children);
    originalCards.forEach(card => {
        card.style.marginRight = '2rem';
        track.appendChild(card);
    });

    originalCards.forEach(card => {
        track.appendChild(card.cloneNode(true));
    });

    container.appendChild(track);

    if (!document.getElementById('sodaTradeSlideKeyframes')) {
        const style = document.createElement('style');
        style.id = 'sodaTradeSlideKeyframes';
        style.textContent = `
            @keyframes sodaTradeSlide {
                from { transform: translateX(0); }
                to   { transform: translateX(-50%); }
            }
        `;
        document.head.appendChild(style);
    }

    const pixelsPerSecond = 60;
    const oneSetWidth = track.scrollWidth / 2;
    const duration = oneSetWidth / pixelsPerSecond;

    track.style.animation = `sodaTradeSlide ${duration}s linear infinite`;
});