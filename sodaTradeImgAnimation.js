document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.pictureMotion');
    if (!container) return;

    container.style.overflow = 'hidden';
    container.style.position = 'relative';

    const track = document.createElement('div');
    track.style.display = 'flex';
    track.style.width = 'max-content';
    track.style.willChange = 'transform';

    const originalImages = Array.from(container.children);
    originalImages.forEach(img => {
        img.style.width = '150px';
        img.style.height = '150px';
        img.style.objectFit = 'contain';
        img.style.flexShrink = '0';
        img.style.marginRight = '2rem';
        track.appendChild(img);
    });

    originalImages.forEach(img => {
        track.appendChild(img.cloneNode(true));
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

    const pixelsPerSecond = 60; // raise this to speed the slide up
    const oneSetWidth = track.scrollWidth / 2;
    const duration = oneSetWidth / pixelsPerSecond;

    track.style.animation = `sodaTradeSlide ${duration}s linear infinite`;
});