document.addEventListener("DOMContentLoaded", () => {
    // Smooth Animation on Page Load
    document.body.style.opacity = "0";
    setTimeout(() => {
        document.body.style.transition = "opacity 1s ease-in-out";
        document.body.style.opacity = "1";
    }, 100);

    // Continue Button Click Event
    document.getElementById("continue-btn").addEventListener("click", () => {
        window.location.href = "signup.html"; // Redirect to signup page
    });

    // Prevent Image Dragging
    document.querySelectorAll("img").forEach(img => {
        img.ondragstart = (e) => e.preventDefault();
    });
});
