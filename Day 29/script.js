

function replayAnimation(animationClass) {

    const element = document.querySelector("." + animationClass);

    if (!element) {
        console.error("Animation element not found:", animationClass);
        return;
    }

    // Remove the current animation
    element.style.animation = "none";

    // Force browser reflow
    element.offsetHeight;

    // Restore the animation
    element.style.animation = "";
}
// ----------------------------------------
// Replay All Animations
// ----------------------------------------

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
        "flip-card-inner"
    ];

    animations.forEach(function(animationClass) {

        replayAnimation(animationClass);

    });

    typingEffect();
}

// ----------------------------------------
// Typing Effect
// ----------------------------------------

function typingEffect() {

    const text = "Welcome to Animation Showcase";

    const element = document.getElementById("typing-text");

    if (!element) {
        console.error("Typing element not found.");
        return;
    }

    // Clear existing text
    element.textContent = "";

    let index = 0;

    function type() {

        if (index < text.length) {

            element.textContent += text.charAt(index);

            index++;

            setTimeout(type, 80);
        }
    }

    type();
}