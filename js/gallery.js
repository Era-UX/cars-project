// gallery.js - Assignment 5 (Models page):
// 1. Manipulating Attributes: clicking a thumbnail dynamically updates the src and alt of the main display image
// 2. Keyboard Event Handling: pressing Left/Right arrow keys navigates through the gallery thumbnails

document.addEventListener("DOMContentLoaded", function () {
    const mainImage = document.getElementById("gallery-main-img");
    const mainCaption = document.getElementById("gallery-main-caption");
    const thumbnails = document.querySelectorAll(".thumb-img");
    const prevBtn = document.getElementById("gallery-prev-btn");
    const nextBtn = document.getElementById("gallery-next-btn");

    if (!mainImage || thumbnails.length === 0) {
        return;
    }

    let currentIndex = 0;

    function selectThumbnail(index) {
        // Wrap around smoothly using modulo
        currentIndex = (index + thumbnails.length) % thumbnails.length;
        const targetThumb = thumbnails[currentIndex];

        // Brief fade effect via inline style
        mainImage.style.opacity = "0.3";

        setTimeout(function () {
            // Dynamically change src and alt attributes of the main image
            mainImage.setAttribute("src", targetThumb.getAttribute("src"));
            mainImage.setAttribute("alt", targetThumb.getAttribute("alt"));

            if (mainCaption) {
                mainCaption.textContent = targetThumb.getAttribute("data-caption");
            }
            mainImage.style.opacity = "1";
        }, 120);

        // Highlight active thumbnail
        thumbnails.forEach(function (thumb, idx) {
            if (idx === currentIndex) {
                thumb.classList.add("active-thumb");
            } else {
                thumb.classList.remove("active-thumb");
            }
        });
    }

    // Click event on each thumbnail
    thumbnails.forEach(function (thumb, index) {
        thumb.addEventListener("click", function () {
            selectThumbnail(index);
        });
    });

    if (prevBtn) {
        prevBtn.addEventListener("click", function () {
            selectThumbnail(currentIndex - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", function () {
            selectThumbnail(currentIndex + 1);
        });
    }

    // Keyboard Event Handling: Left and Right arrow keys
    document.addEventListener("keydown", function (event) {
        if (event.key === "ArrowRight") {
            selectThumbnail(currentIndex + 1);
        } else if (event.key === "ArrowLeft") {
            selectThumbnail(currentIndex - 1);
        }
    });
});