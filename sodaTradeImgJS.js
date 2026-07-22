document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.pictureMotion');
    if (!container) return;
   

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