tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#271310",
                "on-surface-variant": "#504442",
                "secondary-fixed-dim": "#cfc4c0",
                "on-surface": "#1b1c1a",
                "secondary-fixed": "#ece0dc",
                "outline-variant": "#d3c3c0",
                "on-tertiary": "#ffffff",
                "on-tertiary-container": "#8d9884",
                "surface-tint": "#745853",
                "primary-container": "#3e2723",
                "surface-container": "#efeeea",
                "on-secondary-fixed": "#201a18",
                "inverse-on-surface": "#f2f0ed",
                "on-secondary-fixed-variant": "#4c4542",
                "surface-container-low": "#f5f3ef",
                "tertiary-container": "#263020",
                "inverse-surface": "#30312e",
                "surface-bright": "#fbf9f5",
                "on-primary-container": "#ae8d87",
                "on-tertiary-fixed-variant": "#404a39",
                "surface-variant": "#e4e2de",
                "surface-container-lowest": "#ffffff",
                error: "#ba1a1a",
                "surface-container-high": "#eae8e4",
                "on-secondary": "#ffffff",
                "on-primary-fixed-variant": "#5b403c",
                "on-primary-fixed": "#2b1613",
                "surface-dim": "#dbdad6",
                surface: "#fbf9f5",
                "on-tertiary-fixed": "#151e10",
                "on-error": "#ffffff",
                "primary-fixed": "#ffdad4",
                tertiary: "#121b0d",
                "tertiary-fixed-dim": "#bfcab4",
                background: "#fbf9f5",
                "on-primary": "#ffffff",
                "on-background": "#1b1c1a",
                "on-secondary-container": "#6b6360",
                "surface-container-highest": "#e4e2de",
                "inverse-primary": "#e3beb8",
                "on-error-container": "#93000a",
                outline: "#827472",
                "secondary-container": "#ece0dc",
                "error-container": "#ffdad6",
                "primary-fixed-dim": "#e3beb8",
                secondary: "#655d5a",
                "tertiary-fixed": "#dbe6cf"
            },
            borderRadius: {
                DEFAULT: "0.25rem",
                lg: "0.5rem",
                xl: "0.75rem",
                full: "9999px"
            },
            spacing: {
                unit: "8px",
                "margin-desktop": "40px",
                "margin-mobile": "16px",
                gutter: "24px",
                "stack-sm": "8px",
                "stack-md": "16px",
                "stack-lg": "32px",
                "container-max": "1200px"
            },
            fontFamily: {
                "body-lg": ["Plus Jakarta Sans"],
                "body-md": ["Plus Jakarta Sans"],
                "headline-md": ["Libre Caslon Text"],
                "headline-sm": ["Libre Caslon Text"],
                "label-md": ["Plus Jakarta Sans"],
                "display-lg-mobile": ["Libre Caslon Text"],
                "display-lg": ["Libre Caslon Text"],
                caption: ["Plus Jakarta Sans"]
            },
            fontSize: {
                "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
                "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
                "headline-md": ["32px", { lineHeight: "40px", fontWeight: "600" }],
                "headline-sm": ["24px", { lineHeight: "32px", fontWeight: "600" }],
                "label-md": ["14px", { lineHeight: "20px", letterSpacing: "0.05em", fontWeight: "600" }],
                "display-lg-mobile": ["36px", { lineHeight: "44px", letterSpacing: "-0.01em", fontWeight: "700" }],
                "display-lg": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" }],
                caption: ["12px", { lineHeight: "16px", fontWeight: "500" }]
            }
        }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("animate-fade-up");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll(".animate-fade-up").forEach((el) => {
        el.style.opacity = "0";
        observer.observe(el);
    });

    const reservationForm = document.getElementById("reservationForm");

    if (reservationForm) {
        reservationForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const btn = reservationForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;

            btn.innerHTML = '<span class="material-symbols-outlined animate-spin">autorenew</span> Processing...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> Reservation Confirmed';
                btn.classList.remove("bg-primary");
                btn.classList.add("bg-on-tertiary-container");

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.classList.add("bg-primary");
                    btn.classList.remove("bg-on-tertiary-container");
                    btn.disabled = false;
                    reservationForm.reset();
                }, 3000);
            }, 1500);
        });

        window.addEventListener("scroll", () => {
            const nav = document.querySelector("nav");
            if (window.scrollY > 20) {
                nav.classList.add("shadow-md");
                nav.classList.remove("shadow-sm");
            } else {
                nav.classList.remove("shadow-md");
                nav.classList.add("shadow-sm");
            }
        });
    } else {
        window.addEventListener("scroll", () => {
            const nav = document.querySelector("nav");
            if (window.scrollY > 50) {
                nav.classList.add("py-2", "shadow-md");
                nav.classList.remove("py-4", "shadow-sm");
            } else {
                nav.classList.add("py-4", "shadow-sm");
                nav.classList.remove("py-2", "shadow-md");
            }
        });
    }
});
