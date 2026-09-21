// ========================================
// ANIMATION SHOWCASE
// JAVASCRIPT
// ========================================


// ========================================
// REPLAY CSS ANIMATION
// ========================================

function replayAnimation(animationClass) {

    const elements =
        document.querySelectorAll("." + animationClass);

    if (!elements.length) {
        console.warn(
            "Animation not found:",
            animationClass
        );

        return;
    }

    elements.forEach(function (element) {

        element.style.animation = "none";

        // Force browser reflow
        void element.offsetWidth;

        element.style.animation = "";

    });
}


// ========================================
// TYPING EFFECT
// ========================================

function typingEffect() {

    const text =
        "Welcome to Animation Showcase";

    const element =
        document.getElementById("typing-text");

    if (!element) return;

    element.textContent = "";

    let index = 0;

    function type() {

        if (index < text.length) {

            element.textContent +=
                text.charAt(index);

            index++;

            setTimeout(type, 80);

        }

    }

    type();
}


// ========================================
// REPLAY ALL
// ========================================

function replayAllAnimations() {

    const animations = [

        "fade-in",
        "slide-in",
        "scale-animation",
        "rotate-animation",
        "bounce-animation",
        "pulse-animation",
        "shake-animation",
        "swing-animation",
        "flip-card-inner",
        "zoom-in-animation",
        "slide-up-animation",
        "rubber-band-animation",
        "heartbeat-animation",
        "wobble-animation",
        "blur-in-animation"

    ];

    animations.forEach(function (animation) {

        replayAnimation(animation);

    });

    typingEffect();

    animateStaggerText();

    animateProgressBars();

}


// ========================================
// 23 - 3D CARD TILT
// ========================================

const tiltCard =
    document.querySelector(".tilt-card");

if (tiltCard) {

    tiltCard.addEventListener(
        "mousemove",
        function (event) {

            const rect =
                tiltCard.getBoundingClientRect();

            const x =
                event.clientX - rect.left;

            const y =
                event.clientY - rect.top;

            const centerX =
                rect.width / 2;

            const centerY =
                rect.height / 2;

            const rotateY =
                ((x - centerX) / centerX) * 15;

            const rotateX =
                ((centerY - y) / centerY) * 15;

            tiltCard.style.transform =
                `perspective(700px)
                 rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)
                 scale(1.05)`;

        }
    );


    tiltCard.addEventListener(
        "mouseleave",
        function () {

            tiltCard.style.transform =
                "perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)";

        }
    );

}


// ========================================
// 24 - MAGNETIC BUTTON
// ========================================

const magneticButton =
    document.querySelector(".magnetic-button");

if (magneticButton) {

    magneticButton.addEventListener(
        "mousemove",
        function (event) {

            const rect =
                magneticButton.getBoundingClientRect();

            const x =
                event.clientX -
                rect.left -
                rect.width / 2;

            const y =
                event.clientY -
                rect.top -
                rect.height / 2;

            const moveX =
                x * 0.25;

            const moveY =
                y * 0.25;

            magneticButton.style.transform =
                `translate(${moveX}px, ${moveY}px)`;

        }
    );


    magneticButton.addEventListener(
        "mouseleave",
        function () {

            magneticButton.style.transform =
                "translate(0, 0)";

        }
    );

}


// ========================================
// 25 - SCROLL REVEAL
// ========================================

const revealElements =
    document.querySelectorAll(".scroll-reveal");

const revealObserver =
    new IntersectionObserver(
        function (entries) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "visible"
                    );

                    revealObserver.unobserve(
                        entry.target
                    );

                }

            });

        },
        {
            threshold: 0.2
        }
    );


revealElements.forEach(function (element) {

    revealObserver.observe(element);

});


// ========================================
// 26 - STAGGERED TEXT
// ========================================

function animateStaggerText() {

    const textElements =
        document.querySelectorAll(".stagger-text");

    textElements.forEach(function (element) {

        const text =
            element.dataset.text;

        element.innerHTML = "";

        [...text].forEach(
            function (character, index) {

                const span =
                    document.createElement("span");

                span.className =
                    "stagger-letter";

                span.textContent =
                    character;

                span.style.animationDelay =
                    `${index * 0.08}s`;

                element.appendChild(span);

            }
        );

    });

}


// Run once when page loads
animateStaggerText();


// ========================================
// 27 - PROGRESS BARS
// ========================================

function animateProgressBars() {

    const progressBars =
        document.querySelectorAll(
            ".progress-fill"
        );

    progressBars.forEach(function (bar) {

        bar.style.width = "0%";

    });

    // Force reflow
    void document.body.offsetHeight;

    progressBars.forEach(function (bar) {

        const progress =
            bar.dataset.progress;

        setTimeout(function () {

            bar.style.width =
                progress + "%";

        }, 100);

    });

}


// ========================================
// 28 - PARTICLE SYSTEM
// ========================================

const canvas =
    document.getElementById(
        "particle-canvas"
    );

if (canvas) {

    const ctx =
        canvas.getContext("2d");

    let particles = [];

    let mouse = {
        x: null,
        y: null,
        radius: 100
    };


    function resizeCanvas() {

        const rect =
            canvas.getBoundingClientRect();

        canvas.width =
            rect.width * window.devicePixelRatio;

        canvas.height =
            rect.height * window.devicePixelRatio;

        ctx.scale(
            window.devicePixelRatio,
            window.devicePixelRatio
        );

        canvas.style.width =
            rect.width + "px";

        canvas.style.height =
            rect.height + "px";

        createParticles(
            rect.width,
            rect.height
        );

    }


    function createParticles(
        width,
        height
    ) {

        particles = [];

        const particleCount =
            Math.min(
                70,
                Math.floor(
                    (width * height) / 4500
                )
            );


        for (
            let i = 0;
            i < particleCount;
            i++
        ) {

            particles.push({

                x: Math.random() * width,

                y: Math.random() * height,

                size:
                    Math.random() * 2 + 1,

                speedX:
                    (Math.random() - 0.5) * 0.5,

                speedY:
                    (Math.random() - 0.5) * 0.5

            });

        }

    }


    function animateParticles() {

        const rect =
            canvas.getBoundingClientRect();

        ctx.clearRect(
            0,
            0,
            rect.width,
            rect.height
        );


        particles.forEach(
            function (particle) {

                particle.x +=
                    particle.speedX;

                particle.y +=
                    particle.speedY;


                if (
                    particle.x < 0 ||
                    particle.x > rect.width
                ) {

                    particle.speedX *= -1;

                }


                if (
                    particle.y < 0 ||
                    particle.y > rect.height
                ) {

                    particle.speedY *= -1;

                }


                let distanceToMouse =
                    Infinity;


                if (
                    mouse.x !== null &&
                    mouse.y !== null
                ) {

                    const dx =
                        particle.x -
                        mouse.x;

                    const dy =
                        particle.y -
                        mouse.y;

                    distanceToMouse =
                        Math.sqrt(
                            dx * dx +
                            dy * dy
                        );

                }


                const opacity =
                    distanceToMouse <
                    mouse.radius
                        ? 1
                        : 0.5;


                ctx.beginPath();

                ctx.arc(
                    particle.x,
                    particle.y,
                    particle.size,
                    0,
                    Math.PI * 2
                );

                ctx.fillStyle =
                    `rgba(
                        225,
                        6,
                        0,
                        ${opacity}
                    )`;

                ctx.fill();


                // Connect nearby particles
                particles.forEach(
                    function (other) {

                        const dx =
                            particle.x -
                            other.x;

                        const dy =
                            particle.y -
                            other.y;

                        const distance =
                            Math.sqrt(
                                dx * dx +
                                dy * dy
                            );


                        if (
                            distance < 80
                        ) {

                            const lineOpacity =
                                1 -
                                distance / 80;


                            ctx.beginPath();

                            ctx.moveTo(
                                particle.x,
                                particle.y
                            );

                            ctx.lineTo(
                                other.x,
                                other.y
                            );

                            ctx.strokeStyle =
                                `rgba(
                                    225,
                                    6,
                                    0,
                                    ${lineOpacity * 0.25}
                                )`;

                            ctx.lineWidth =
                                0.5;

                            ctx.stroke();

                        }

                    }
                );

            }
        );


        requestAnimationFrame(
            animateParticles
        );

    }


    canvas.addEventListener(
        "mousemove",
        function (event) {

            const rect =
                canvas.getBoundingClientRect();

            mouse.x =
                event.clientX -
                rect.left;

            mouse.y =
                event.clientY -
                rect.top;

        }
    );


    canvas.addEventListener(
        "mouseleave",
        function () {

            mouse.x = null;
            mouse.y = null;

        }
    );


    window.addEventListener(
        "resize",
        resizeCanvas
    );


    resizeCanvas();

    animateParticles();

}


// ========================================
// 29 - RIPPLE CLICK
// ========================================

const rippleButtons =
    document.querySelectorAll(
        ".ripple-button"
    );

rippleButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function (event) {

                const rect =
                    button.getBoundingClientRect();

                const x =
                    event.clientX -
                    rect.left;

                const y =
                    event.clientY -
                    rect.top;


                const ripple =
                    document.createElement(
                        "span"
                    );

                ripple.classList.add(
                    "ripple"
                );

                ripple.style.left =
                    x + "px";

                ripple.style.top =
                    y + "px";


                button.appendChild(
                    ripple
                );


                setTimeout(
                    function () {

                        ripple.remove();

                    },
                    700
                );

            }
        );

    }
);


// ========================================
// 30 - MODAL
// ========================================

function openModal() {

    let modal =
        document.getElementById(
            "animation-modal"
        );


    if (!modal) {

        modal =
            document.createElement(
                "div"
            );

        modal.id =
            "animation-modal";

        modal.className =
            "modal-overlay";


        modal.innerHTML = `

            <div class="modal">

                <h2>Animation Modal</h2>

                <p>
                    This modal uses opacity,
                    scale and translate animations
                    to create a smooth entrance.
                </p>

                <button
                    class="modal-close"
                    onclick="closeModal()">
                    Close
                </button>

            </div>

        `;


        document.body.appendChild(
            modal
        );


        modal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === modal
                ) {

                    closeModal();

                }

            }
        );

    }


    requestAnimationFrame(
        function () {

            modal.classList.add(
                "active"
            );

        }
    );

}


function closeModal() {

    const modal =
        document.getElementById(
            "animation-modal"
        );

    if (modal) {

        modal.classList.remove(
            "active"
        );

    }

}


// ========================================
// ESCAPE KEY CLOSES MODAL
// ========================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            closeModal();

        }

    }
);
// ========================================
// 38 - SHATTER EFFECT
// ========================================

function shatterEffect() {
    const object =
        document.getElementById("shatter-object");

    if (!object) return;

    object.classList.remove("shattering");

    void object.offsetWidth;

    object.classList.add("shattering");

    setTimeout(function () {
        object.classList.remove("shattering");
    }, 900);
}


// ========================================
// 39 - PIXEL EXPLOSION
// ========================================

const explosionCanvas =
    document.getElementById("explosion-canvas");

let explosionParticles = [];

function setupExplosionCanvas() {

    if (!explosionCanvas) return;

    const rect =
        explosionCanvas.getBoundingClientRect();

    explosionCanvas.width =
        rect.width * window.devicePixelRatio;

    explosionCanvas.height =
        rect.height * window.devicePixelRatio;

    const ctx =
        explosionCanvas.getContext("2d");

    ctx.scale(
        window.devicePixelRatio,
        window.devicePixelRatio
    );
}

function pixelExplosion() {

    if (!explosionCanvas) return;

    const rect =
        explosionCanvas.getBoundingClientRect();

    explosionParticles = [];

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    for (let i = 0; i < 120; i++) {

        const angle =
            Math.random() * Math.PI * 2;

        const speed =
            Math.random() * 5 + 2;

        explosionParticles.push({

            x: centerX,
            y: centerY,

            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,

            size:
                Math.random() * 3 + 1,

            life: 1

        });
    }

    animateExplosion();
}

function animateExplosion() {

    if (!explosionCanvas) return;

    const ctx =
        explosionCanvas.getContext("2d");

    const rect =
        explosionCanvas.getBoundingClientRect();

    ctx.clearRect(
        0,
        0,
        rect.width,
        rect.height
    );

    let activeParticles = 0;

    explosionParticles.forEach(function (particle) {

        particle.x += particle.vx;
        particle.y += particle.vy;

        particle.vy += 0.03;

        particle.life -= 0.015;

        if (particle.life > 0) {

            activeParticles++;

            ctx.beginPath();

            ctx.arc(
                particle.x,
                particle.y,
                particle.size,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                `rgba(225, 6, 0, ${particle.life})`;

            ctx.fill();
        }
    });

    if (activeParticles > 0) {
        requestAnimationFrame(animateExplosion);
    }
}

if (explosionCanvas) {

    setupExplosionCanvas();

    window.addEventListener(
        "resize",
        setupExplosionCanvas
    );
}
