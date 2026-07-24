/**
 * DERY.SPACE - PORTFOLIO INTERACTIVE CORE SCRIPT
 * Dilengkapi dengan Advanced Canvas Starfield, Distortion Physics, 
 * Theme Toggler, Scroll Reveal, dan Interaction Handlers.
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. ENGINE ANIMASI LUAR ANGKASA (STARFIELD DISTORTION)
    const canvas = document.getElementById('space-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let stars = [];
    const MAX_STARS = 600; // Optimal untuk performa
    let mouseX = 0, mouseY = 0;
    let isMoving = false;
    let distortionLevel = 0;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resize);
    resize();

    class Star {
        constructor() {
            this.reset(true);
        }
        
        reset(randomizeZ = false) {
            this.x = (Math.random() - 0.5) * width * 2;
            this.y = (Math.random() - 0.5) * height * 2;
            this.z = randomizeZ ? Math.random() * width : width;
            this.size = Math.random() * 1.5 + 0.5;
            this.baseSpeed = Math.random() * 2 + 0.5;
        }

        update() {
            // Efek Distorsi "Warp Speed" berdasarkan pergerakan kursor
            let currentSpeed = this.baseSpeed + (distortionLevel * 15);
            this.z -= currentSpeed;

            if (this.z <= 0) {
                this.reset();
            }
        }

        draw() {
            let sx = (this.x / this.z) * width + width / 2;
            let sy = (this.y / this.z) * height + height / 2;
            
            // Efek paralaks saat mouse bergerak
            sx += (mouseX - width / 2) * (1 - this.z / width) * 0.5;
            sy += (mouseY - height / 2) * (1 - this.z / height) * 0.5;

            let radius = this.size * (width / this.z);
            let opacity = 1 - (this.z / width);
            
            const isLightMode = document.documentElement.getAttribute('data-theme') === 'light';
            const starColor = isLightMode ? `rgba(0, 86, 179, ${opacity})` : `rgba(102, 252, 241, ${opacity})`;

            ctx.beginPath();
            ctx.arc(sx, sy, radius, 0, Math.PI * 2);
            ctx.fillStyle = starColor;
            ctx.fill();
        }
    }

    // Inisiasi Bintang
    for (let i = 0; i < MAX_STARS; i++) {
        stars.push(new Star());
    }

    function animateSpace() {
        // Membersihkan frame dengan efek trail tipis
        const isLightMode = document.documentElement.getAttribute('data-theme') === 'light';
        ctx.fillStyle = isLightMode ? 'rgba(244, 247, 246, 0.2)' : 'rgba(11, 12, 16, 0.2)';
        ctx.fillRect(0, 0, width, height);
        
        // Logika penurunan efek distorsi secara bertahap (smoothing)
        if (!isMoving && distortionLevel > 0) {
            distortionLevel -= 0.02;
            if (distortionLevel < 0) distortionLevel = 0;
        }

        stars.forEach(star => {
            star.update();
            star.draw();
        });

        requestAnimationFrame(animateSpace);
    }
    
    animateSpace();

    // Event Listener untuk memicu efek distorsi partikel luar angkasa
    let mouseTimeout;
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMoving = true;
        distortionLevel = Math.min(distortionLevel + 0.1, 1); // Cap maximum distortion
        
        clearTimeout(mouseTimeout);
        mouseTimeout = setTimeout(() => { isMoving = false; }, 100);
    });

    document.addEventListener('touchmove', (e) => {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
        isMoving = true;
        distortionLevel = Math.min(distortionLevel + 0.1, 1);
        
        clearTimeout(mouseTimeout);
        mouseTimeout = setTimeout(() => { isMoving = false; }, 100);
    });


    // 2. SISTEM TEMA DARK/LIGHT MODE
    const themeBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;
    const themeIcon = themeBtn.querySelector('i');

    themeBtn.addEventListener('click', () => {
        if (htmlEl.getAttribute('data-theme') === 'dark') {
            htmlEl.setAttribute('data-theme', 'light');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            htmlEl.setAttribute('data-theme', 'dark');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
    });

    // 3. SCROLL REVEAL ANIMATION (Mendeteksi elemen yang masuk ke layar)
    const reveals = document.querySelectorAll('.reveal');
    const revealOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });

    // 4. INTERAKSI KLIK (RIPPLE EFFECT) PADA KARTU
    const interactiveCards = document.querySelectorAll('.interactive-card');
    interactiveCards.forEach(card => {
        card.addEventListener('mousedown', function(e) {
            let x = e.clientX - e.target.getBoundingClientRect().left;
            let y = e.clientY - e.target.getBoundingClientRect().top;
            
            let ripple = document.createElement('span');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            setTimeout(() => { ripple.remove(); }, 600);
        });
    });

    // 5. PENANGANAN FORM KONTAK FUNGSIONAL (SIMULASI)
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        const originalText = btn.innerHTML;
        
        // Simulasi pengiriman (loading)
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
        btn.style.opacity = '0.8';
        
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-check"></i> Pesan Terkirim!';
            btn.style.background = '#28a745'; // warna hijau sukses
            contactForm.reset();
            
            // Kembali ke state awal setelah 3 detik
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.style.opacity = '1';
            }, 3000);
        }, 1500);
    });
});

// 6. FUNGSI GLOBAL UNTUK MODAL / JENDELA POP-UP PROYEK
window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) modal.classList.add('show');
}

window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) modal.classList.remove('show');
}

// Tutup modal jika user mengklik area luar dari panel kaca (background gelap)
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
    }
}
