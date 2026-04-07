document.addEventListener('DOMContentLoaded', () => {
    const bouquet = document.getElementById('bouquet');
    const wrap = document.getElementById('wrap');
    const flowerContainers = document.querySelectorAll('.rose-container');
    const photo = document.getElementById('photoPopup');
    const particleContainer = document.getElementById('particle-container');
    
    const musicBtn = document.getElementById('musicToggle');
    const backBtn = document.getElementById('backBtn');

    const bloomSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
    const backgroundMusic = new Audio('audio/haha.mp3'); 
    
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.6;
    let isBloomed = false;
    let musicPlaying = false;

    const handleReset = (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.location.reload();
    };

    const handleMusicToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (musicPlaying) {
            backgroundMusic.pause();
            musicBtn.innerText = "🎵 Music: Off";
        } else {
            backgroundMusic.play().catch(() => {
                console.log("Waiting for user interaction to play audio.");
            });
            musicBtn.innerText = "🎵 Music: On";
        }
        musicPlaying = !musicPlaying;
    };

    backBtn.addEventListener('click', handleReset);
    backBtn.addEventListener('touchstart', handleReset);

    musicBtn.addEventListener('click', handleMusicToggle);
    musicBtn.addEventListener('touchstart', handleMusicToggle);

    const startSurprise = (e) => {
        if (isBloomed) return;
        
        if (e.target.closest('.ui-controls')) return;

        isBloomed = true;

        // Mobile Heartbeat Vibration
        if (navigator.vibrate) {
            navigator.vibrate([60, 100, 60]);
        }

        bloomSound.play().catch(() => {});
        backgroundMusic.play().then(() => {
            musicPlaying = true;
            musicBtn.innerText = "🎵 Music: On";
        }).catch((err) => {
            console.log("Autoplay prevented. Audio will resume on next tap.");
        });

        wrap.style.transform = 'translateY(110%)';
        
        flowerContainers.forEach((container, i) => {
            setTimeout(() => {
                container.style.opacity = '1';
                container.style.transform = 'translateY(0) scale(1)';
                container.classList.add('bloomed');
                createParticles();
            }, 400 + (i * 180));
        });

        setTimeout(() => {
            photo.classList.add('show');
        }, 1800);

        const hint = document.querySelector('.tap-hint');
        if(hint) hint.style.opacity = '0';
    };

    bouquet.addEventListener('click', startSurprise);
    bouquet.addEventListener('touchstart', (e) => {
        if (!isBloomed) {
            startSurprise(e);
        }
    }, {passive: true});

    function createParticles() {
        for (let i = 0; i < 7; i++) {
            const p = document.createElement('div');
            const isHeart = Math.random() > 0.6;
            p.className = isHeart ? 'heart-particle' : 'petal';
            if (isHeart) p.innerHTML = '❤';
            
            const size = Math.random() * 10 + 5 + 'px';
            p.style.width = isHeart ? 'auto' : size;
            p.style.height = isHeart ? 'auto' : size;
            p.style.left = Math.random() * 100 + '%';
            p.style.bottom = '20%'; 
            
            const duration = Math.random() * 2 + 3;
            p.style.animation = `floatUp ${duration}s ease-out forwards`;
            
            particleContainer.appendChild(p);
            
            // Clean up memory
            setTimeout(() => p.remove(), duration * 1000);
        }
    }

    console.log("%c 🌿 Pinalangga's Surprise %c Status: Deployed & Functional ", 
        "background: #1b4332; color: #f1e5ac; padding: 5px; border-radius: 5px; font-weight: bold;", 
        "color: #45aca2; font-style: italic;");
});