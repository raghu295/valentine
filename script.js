// ===== Floating Hearts Background =====
function createFloatingHearts() {
    const container = document.getElementById('floatingHearts');
    const hearts = ['💕', '💖', '💗', '💘', '💝', '♥️', '🩷', '🤍', '✨', '🌸'];

    for (let i = 0; i < 25; i++) {
        const heart = document.createElement('span');
        heart.classList.add('floating-heart');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (0.8 + Math.random() * 1.4) + 'rem';
        heart.style.animationDuration = (6 + Math.random() * 8) + 's';
        heart.style.animationDelay = Math.random() * 10 + 's';
        container.appendChild(heart);
    }
}

createFloatingHearts();

// ===== "No" Button Runaway Logic =====
const btnNo = document.getElementById('btnNo');
const btnYes = document.getElementById('btnYes');
let noAttempts = 0;

const funnyTexts = [
    "No",
    "Are you sure? 🥺",
    "Really? 😢",
    "Think again! 💔",
    "Don't do this 😭",
    "Please? 🥹",
    "I'll cry... 😿",
    "Pretty please? 🙏",
    "You're breaking my heart 💔",
    "Last chance! 😤"
];

function moveButton() {
    noAttempts++;

    // Update button text
    if (noAttempts < funnyTexts.length) {
        btnNo.textContent = funnyTexts[noAttempts];
    } else {
        btnNo.textContent = "OK fine, just click Yes 😅";
    }

    // Make Yes button grow
    if (noAttempts <= 5) {
        btnYes.className = 'btn btn-yes grow-' + Math.min(noAttempts, 5);
    }

    // Move the No button to a random position within the card
    const card = btnNo.closest('.card');
    const cardRect = card.getBoundingClientRect();

    const maxX = cardRect.width - btnNo.offsetWidth - 20;
    const maxY = cardRect.height - btnNo.offsetHeight - 20;

    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;

    btnNo.style.position = 'absolute';
    btnNo.style.left = randomX + 'px';
    btnNo.style.top = randomY + 'px';
    btnNo.style.zIndex = '20';
}

// Desktop: hover
btnNo.addEventListener('mouseenter', moveButton);

// Mobile: touch
btnNo.addEventListener('touchstart', function(e) {
    e.preventDefault();
    moveButton();
}, { passive: false });

// Also on click just in case
btnNo.addEventListener('click', function(e) {
    e.preventDefault();
    moveButton();
});

// ===== YES Button Click =====
function sayYes() {
    // Create sparkle burst from button position
    const btnRect = btnYes.getBoundingClientRect();
    const centerX = btnRect.left + btnRect.width / 2;
    const centerY = btnRect.top + btnRect.height / 2;
    createSparkleBurst(centerX, centerY);

    // Transition to celebration page
    setTimeout(() => {
        document.getElementById('questionPage').classList.remove('active');
        document.getElementById('celebrationPage').classList.add('active');

        // Allow scrolling for the celebration page
        document.body.classList.add('celebrate-mode');

        // Change background to a more vibrant pink
        document.body.style.background = 'linear-gradient(135deg, #f48fb1 0%, #ec407a 30%, #e91e63 60%, #d81b60 100%)';

        // Change page title
        document.title = 'We Did It 💖';

        // Start confetti
        startConfetti();
    }, 500);
}

// ===== Sparkle Burst Effect =====
function createSparkleBurst(x, y) {
    const sparkles = ['✨', '💖', '💕', '🌟', '⭐', '💗', '🩷'];
    for (let i = 0; i < 15; i++) {
        const sparkle = document.createElement('span');
        sparkle.classList.add('sparkle');
        sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];

        const angle = (Math.PI * 2 / 15) * i;
        const distance = 60 + Math.random() * 80;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        sparkle.style.setProperty('--tx', tx + 'px');
        sparkle.style.setProperty('--ty', ty + 'px');

        document.body.appendChild(sparkle);

        setTimeout(() => sparkle.remove(), 1000);
    }
}

// ===== Confetti Effect =====
function startConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confettiPieces = [];
    const colors = [
        '#e91e63', '#f06292', '#f48fb1', '#fce4ec',
        '#ff4081', '#ff80ab', '#ec407a', '#d81b60',
        '#f50057', '#c51162', '#ffeb3b', '#ffc107',
        '#ff9800', '#ff5722', '#e040fb', '#7c4dff'
    ];

    // Create confetti pieces
    for (let i = 0; i < 150; i++) {
        confettiPieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            w: 6 + Math.random() * 8,
            h: 4 + Math.random() * 6,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedY: 2 + Math.random() * 4,
            speedX: (Math.random() - 0.5) * 3,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            opacity: 0.8 + Math.random() * 0.2
        });
    }

    let frame = 0;
    const maxFrames = 400;

    function animate() {
        if (frame > maxFrames) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        confettiPieces.forEach(p => {
            p.y += p.speedY;
            p.x += p.speedX;
            p.rotation += p.rotationSpeed;

            // Fade out near the end
            if (frame > maxFrames - 60) {
                p.opacity = Math.max(0, p.opacity - 0.015);
            }

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();

            // Reset if falls off screen
            if (p.y > canvas.height + 20) {
                p.y = -20;
                p.x = Math.random() * canvas.width;
            }
        });

        frame++;
        requestAnimationFrame(animate);
    }

    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}
