// popup.js - Home Page Subscription Modal with Pure JS Regex Validation
document.addEventListener("DOMContentLoaded", function () {
    const subscribeBtn = document.getElementById("subscribe-btn");
    const popupOverlay = document.getElementById("popup-overlay");
    const popupClose = document.getElementById("popup-close");
    const subscribeForm = document.getElementById("subscribe-form");

    const strictEmailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!subscribeBtn || !popupOverlay) return;

    function resetPopup() {
        const emailInput = document.getElementById("sub-email") || (subscribeForm && subscribeForm.querySelector("input"));
        const subError = document.getElementById("sub-error");
        const subSuccess = document.getElementById("sub-success");

        if (emailInput) {
            emailInput.value = "";
            emailInput.classList.remove("is-invalid");
        }
        if (subError) subError.textContent = "";
        if (subSuccess) subSuccess.textContent = "";
    }

    subscribeBtn.addEventListener("click", function () {
        resetPopup();
        popupOverlay.style.display = "flex";
    });

    if (popupClose) {
        popupClose.addEventListener("click", function () {
            popupOverlay.style.display = "none";
        });
    }

    popupOverlay.addEventListener("click", function (event) {
        if (event.target === popupOverlay) {
            popupOverlay.style.display = "none";
        }
    });

    if (subscribeForm) {
        subscribeForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const emailInput = document.getElementById("sub-email") || subscribeForm.querySelector("input");
            const subError = document.getElementById("sub-error");
            const subSuccess = document.getElementById("sub-success");

            if (subError) subError.textContent = "";
            if (subSuccess) subSuccess.textContent = "";

            const cleanVal = emailInput ? emailInput.value.trim() : "";

            if (!cleanVal) {
                if (emailInput) emailInput.classList.add("is-invalid");
                if (subError) subError.textContent = "Please enter your email address.";
                return;
            }

            if (!strictEmailRegex.test(cleanVal)) {
                if (emailInput) emailInput.classList.add("is-invalid");
                if (subError) subError.textContent = "Please enter a valid email address (e.g. name@example.com).";
                return;
            }

            if (emailInput) emailInput.classList.remove("is-invalid");
            if (subSuccess) subSuccess.textContent = "Thank you! " + cleanVal + " has been subscribed to AutoWorld updates.";
        });
    }
});