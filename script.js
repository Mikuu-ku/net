/**
 * Nate's Valentine Surprise - script.js
 */

window.addEventListener('load', () => {
    const loader = document.getElementById('loading-screen');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 1000);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Core Elements
    const seal = document.getElementById('sealButton');
    const wrapper = document.getElementById('wrapper');
    const envelopePage = document.getElementById('envelope-page');
    const bouquetPage = document.getElementById('bouquet-page');
    const resetBtn = document.getElementById('resetBtn');
    
    // Audio
    const openSound = document.getElementById('openSound');
    const magicSound = document.getElementById('magicSound');
    const bgMusic = document.getElementById('bgMusic');
    const muteBtn = document.getElementById('muteBtn');

    // Modals
    const photoModal = document.getElementById('photo-modal');
    const letterModal = document.getElementById('letter-modal');
    const finalLetterBtn = document.getElementById('final-letter-btn');
    const popupImg = document.getElementById('popup-img');
    const modalText = document.getElementById('modal-text');

    // Tracking
    let clickedFlowers = new Set();
    const flowers = document.querySelectorAll('.interactive');
    const totalFlowers = flowers.length;

    const triggerVibration = (ms = 50) => {
        if (navigator.vibrate) navigator.vibrate(ms);
    };

    // --- Sparkle Effect Function ---
    const createSparkle = (x, y) => {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = '✨';
        sparkle.style.position = 'fixed';
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '4000';
        sparkle.style.fontSize = '20px';
        sparkle.style.animation = 'fall 1s forwards';
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 1000);
    };

    // --- Envelope Logic ---
    if (seal) {
        seal.addEventListener('click', (e) => {
            triggerVibration(100);
            createSparkle(e.clientX, e.clientY);
            if (openSound) openSound.play();
            if (bgMusic) bgMusic.play().catch(() => {});
            wrapper.classList.add('open');
            
            setTimeout(() => {
                envelopePage.style.opacity = "0";
                setTimeout(() => {
                    envelopePage.style.display = "none";
                    bouquetPage.classList.remove('hidden');
                    setTimeout(() => bouquetPage.style.opacity = "1", 50);
                    if (magicSound) magicSound.play();
                }, 800);
            }, 2200);
        });
    }

    // --- Flower Logic ---
    flowers.forEach((flower, index) => {
        flower.addEventListener('click', (e) => {
            triggerVibration(40);
            createSparkle(e.clientX, e.clientY);
            clickedFlowers.add(index);
            
            popupImg.src = flower.getAttribute('data-img');
            modalText.innerText = flower.getAttribute('data-note');
            
            // Show Modal
            photoModal.classList.remove('modal-hidden');
            photoModal.style.display = 'flex';

            if (clickedFlowers.size === totalFlowers) {
                setTimeout(() => {
                    finalLetterBtn.classList.remove('hidden');
                    triggerVibration([50, 100, 50]);
                }, 1000);
            }
        });
    });

    // --- Modal Logic ---
    const hidePhotoModal = () => {
        photoModal.classList.add('modal-hidden');
        photoModal.style.display = 'none';
    };

    document.querySelector('.close-modal').addEventListener('click', (e) => {
        e.stopPropagation();
        hidePhotoModal();
    });

    document.querySelector('.close-letter').addEventListener('click', () => {
        letterModal.classList.remove('letter-modal-show');
    });

    window.addEventListener('click', (e) => {
        if (e.target === photoModal) hidePhotoModal();
        if (e.target === letterModal) letterModal.classList.remove('letter-modal-show');
    });

    if (finalLetterBtn) {
        finalLetterBtn.addEventListener('click', () => {
            letterModal.classList.add('letter-modal-show');
            triggerVibration(60);
        });
    }

    // --- Reset Logic ---
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            bouquetPage.style.opacity = "0";
            setTimeout(() => location.reload(), 800);
        });
    }

    // --- Enhanced Particles ---
    setInterval(() => {
        const container = document.getElementById('heart-container');
        if (!container) return;
        const p = document.createElement('div');
        p.classList.add('heart-particle');
        const items = ['💚', '🌿', '🍃', '🌱', '✨'];
        p.innerHTML = items[Math.floor(Math.random()*items.length)];
        p.style.left = Math.random() * 100 + 'vw';
        p.style.fontSize = (Math.random() * 15 + 10) + 'px';
        p.style.opacity = Math.random();
        p.style.animation = `fall ${(Math.random() * 3 + 4)}s linear forwards`;
        container.appendChild(p);
        setTimeout(() => p.remove(), 7000);
    }, 400);
});