// popup.js - Task 3: popup subscription form (Home page)
//
// The popup (#popup-overlay) is hidden by default: the CSS gives it "display: none".
// JavaScript shows it by setting style.display = "flex" and hides it with "none".
// It closes with the X button OR by clicking on the dark area outside the white box.

document.addEventListener("DOMContentLoaded", function () {
    // 1. Find the elements we need
    const openButton = document.getElementById("subscribe-btn");
    const overlay = document.getElementById("popup-overlay");
    const closeButton = document.getElementById("popup-close");
    const form = document.getElementById("subscribe-form");
    const emailInput = document.getElementById("sub-email");
    const errorBox = document.getElementById("sub-error");
    const successBox = document.getElementById("sub-success");

    // Stop if the popup is not on this page
    if (!openButton || !overlay) {
        return;
    }

    // Strict email pattern: only letters, numbers, single dots/hyphens/underscores allowed before @,
    // valid domain name, and a 2+ letter domain extension (no !#$%^&* or spaces allowed)
    const strictEmailPattern = /^[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*(\.[a-zA-Z]{2,})+$/;

    // 2. Show and hide the popup
    function openPopup() {
        overlay.style.display = "flex";
    }

    function closePopup() {
        overlay.style.display = "none";
        form.reset();                 // clear the typed email
        errorBox.textContent = "";    // clear old messages
        successBox.textContent = "";
    }

    openButton.addEventListener("click", openPopup);
    closeButton.addEventListener("click", closePopup);

    // 3. Click outside: a click on the dark overlay itself (not on the white box inside it)
    overlay.addEventListener("click", function (event) {
        if (event.target === overlay) {
            closePopup();
        }
    });

    // 4. Check the email when the form is submitted
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // do not reload the page

        const rawEmail = emailInput.value;
        const email = rawEmail.trim();
        successBox.textContent = "";

        if (email === "") {
            errorBox.textContent = "Please enter your email address.";
        } else if (/\s/.test(email)) {
            errorBox.textContent = "Email address cannot contain spaces.";
        } else if (!strictEmailPattern.test(email)) {
            errorBox.textContent = "Please enter a valid email (letters and numbers only, e.g. name@example.com).";
        } else {
            errorBox.textContent = "";
            successBox.textContent = "Thank you! You are subscribed.";
            form.reset();
        }
    });
});