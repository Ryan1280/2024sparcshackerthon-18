// script.js
document.addEventListener("DOMContentLoaded", function () {
    const ballFrame = document.getElementById("ball-frame");

    ballFrame.addEventListener("click", function () {
        // Create overlay
        const overlay = document.createElement("div");
        overlay.classList.add("full-screen-overlay");
        document.body.appendChild(overlay);

        // Display the overlay
        overlay.style.display = "block"; // Show overlay
        requestAnimationFrame(() => {
            overlay.style.opacity = 1; // Fade in
        });

        // Navigate to physic.html after a short delay
        setTimeout(function () {
            window.location.href = "physic.html";
        }, 2000); // Delay before navigation (after the overlay has fully faded in)
    });
});
