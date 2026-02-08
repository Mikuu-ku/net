/**
 * Nate's Valentine Surprise - script.js
 */

// --- 1. Loading Screen Logic ---
window.addEventListener('load', () => {
    const loader = document.getElementById('loading-screen');
    if (loader) {
        // Give it a 1.5s delay so she can see the cute loading leaf
        setTimeout(() => {
            loader.classList.add('fade-out');
            // Remove from DOM after transition so it doesn't block clicks
            setTimeout(() => {
                loader.style.display = 'none';
            }, 1000);
        }, 1500);
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
    const typewriterElement = document.getElementById('typewriter-text');

    // Tracking
    let clickedFlowers = new Set();
    const flowers = document.querySelectorAll('.interactive');
    const totalFlowers = flowers.length;

    const triggerVibration = (ms = 50) => {
        if (navigator.vibrate) navigator.vibrate(ms);
    };

    // --- Sparkle Effect ---
    const createSparkle = (x, y) => {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = '✨';
        sparkle.style.position = 'fixed';
        sparkle.style.left = (x || Math.random() * window.innerWidth) + 'px';
        sparkle.style.top = (y || Math.random() * window.innerHeight) + 'px';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '15000'; // High z-index to stay above modals
        sparkle.style.fontSize = '20px';
        sparkle.style.animation = 'fall 1.5s forwards';
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 1500);
    };

    // --- Envelope Logic ---
    if (seal) {
        seal.addEventListener('click', (e) => {
            triggerVibration(100);
            createSparkle(e.clientX, e.clientY);
            
            // Audio play (standard mobile browser requirement: play on user click)
            if (openSound) openSound.play();
            if (bgMusic) {
                bgMusic.volume = 0.6; // Set a nice background volume
                bgMusic.play().catch(err => console.log("Music play blocked:", err));
            }

            wrapper.classList.add('open');
            
            // Transition from Envelope to Bouquet
            setTimeout(() => {
                envelopePage.style.opacity = "0";
                setTimeout(() => {
                    envelopePage.style.display = "none";
                    bouquetPage.classList.remove('hidden');
                    // Small delay to allow the "hidden" removal to register for the opacity transition
                    setTimeout(() => {
                        bouquetPage.style.opacity = "1";
                        if (magicSound) magicSound.play();
                    }, 50);
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
            
            // Set Modal Content
            if (popupImg) popupImg.src = flower.getAttribute('data-img');
            if (modalText) modalText.innerText = flower.getAttribute('data-note');
            
            // Show Modal
            if (photoModal) photoModal.classList.remove('modal-hidden');

            // Check if all flowers discovered
            if (clickedFlowers.size === totalFlowers) {
                setTimeout(() => {
                    if (finalLetterBtn) {
                        finalLetterBtn.classList.remove('hidden');
                        triggerVibration([50, 100, 50]);
                    }
                }, 800);
            }
        });
    });

    // --- Letter Typewriter Logic ---
    const message = "Alam ko hindi ako expressive na pagkatao, pero gusto kong malaman mo na sobrang mahalaga ka sakin. I love you so much, babyy. Happy Valentine's Day! 💚";
    let isTyping = false;
    let charIndex = 0;

    function startTypewriter() {
        if (charIndex < message.length) {
            typewriterElement.innerHTML += message.charAt(charIndex);
            charIndex++;
            setTimeout(startTypewriter, 55); // Adjusted speed slightly for readability
        } else {
            const sig = document.querySelector('.signature');
            if(sig) sig.style.opacity = '1';
        }
    }

    if (finalLetterBtn) {
        finalLetterBtn.onclick = () => {
            if (letterModal) {
                letterModal.classList.add('letter-modal-show');
                triggerVibration(60);
                if (!isTyping) {
                    isTyping = true;
                    // Wait 1s after modal opens before typing starts
                    setTimeout(startTypewriter, 1000);
                }
            }
        };
    }

    // --- Modal Closing Logic ---
    const closeModals = () => {
        if (photoModal) photoModal.classList.add('modal-hidden');
        if (letterModal) letterModal.classList.remove('letter-modal-show');
    };

    document.querySelectorAll('.close-modal, .close-letter').forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            closeModals();
        };
    });

    // Close on background click
    window.onclick = (e) => {
        if (e.target === photoModal || e.target === letterModal) closeModals();
    };

    // --- Device Tilt Effect (Parallax) ---
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', (event) => {
            const bouquet = document.querySelector('.bouquet');
            // Only tilt if bouquet page is visible
            if (bouquet && bouquetPage && !bouquetPage.classList.contains('hidden')) {
                const tiltX = Math.round(event.gamma) / 2; // Horizontal tilt
                const tiltY = Math.round(event.beta) / 4;  // Vertical tilt
                bouquet.style.transform = `rotateY(${tiltX}deg) rotateX(${-tiltY}deg)`;
            }
        });
    }

    // --- Mute Logic ---
    if (muteBtn) {
        muteBtn.onclick = () => {
            if (bgMusic) {
                bgMusic.muted = !bgMusic.muted;
                muteBtn.innerText = bgMusic.muted ? "🔇" : "🔊";
            }
        };
    }

    // --- Reset Logic ---
    if (resetBtn) {
        resetBtn.onclick = () => {
            bouquetPage.style.opacity = "0";
            setTimeout(() => location.reload(), 500);
        };
    }

    // --- Falling Particles (Leaves & Hearts) ---
    setInterval(() => {
        const container = document.getElementById('heart-container');
        // Only spawn if bouquet is showing
        if (!container || !bouquetPage || bouquetPage.classList.contains('hidden')) return;
        
        const p = document.createElement('div');
        p.className = 'heart-particle';
        const items = ['💚', '🌿', '🍃', '🌱', '✨'];
        p.innerHTML = items[Math.floor(Math.random() * items.length)];
        p.style.left = Math.random() * 100 + 'vw';
        p.style.fontSize = (Math.random() * 15 + 10) + 'px';
        p.style.opacity = Math.random();
        p.style.animation = `fall ${(Math.random() * 3 + 4)}s linear forwards`;
        container.appendChild(p);
        
        // Cleanup particle
        setTimeout(() => p.remove(), 7000);
    }, 450);
});
