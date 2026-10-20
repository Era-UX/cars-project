// validation.js - Task 1: form validation (Services page, Test Drive & Client Profile form)
//
// Rules:
//   - full name is required
//   - email is required and must have a correct format
//   - password is required and must be at least 8 characters
//   - confirm password must be the same as the password
// Error messages appear under the wrong field (Bootstrap's is-invalid / invalid-feedback classes).

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("booking-form");

    // Stop if the form is not on this page
    if (!form) {
        return;
    }

    const nameInput = document.getElementById("reg-name");
    const emailInput = document.getElementById("reg-email");
    const passwordInput = document.getElementById("reg-password");
    const confirmInput = document.getElementById("reg-confirm");
    const carSelect = document.getElementById("car-model");
    const successMessage = document.getElementById("signup-success");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const minPasswordLength = 8;

    // Show an error under a field: red border + message text
    function showError(input, message) {
        input.classList.add("is-invalid");
        document.getElementById(input.id + "-error").textContent = message;
    }

    // Remove the error from a field
    function clearError(input) {
        input.classList.remove("is-invalid");
        document.getElementById(input.id + "-error").textContent = "";
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // there is no server, so we never really send the form

        let isValid = true;
        successMessage.textContent = "";

        // Full name
        if (nameInput.value.trim() === "") {
            showError(nameInput, "Please enter your full name.");
            isValid = false;
        } else {
            clearError(nameInput);
        }

        // Email
        if (emailInput.value.trim() === "") {
            showError(emailInput, "Please enter your email address.");
            isValid = false;
        } else if (!emailPattern.test(emailInput.value.trim())) {
            showError(emailInput, "Please enter a valid email address, for example name@example.com.");
            isValid = false;
        } else {
            clearError(emailInput);
        }

        // Password
        if (passwordInput.value === "") {
            showError(passwordInput, "Please enter a password.");
            isValid = false;
        } else if (passwordInput.value.length < minPasswordLength) {
            showError(passwordInput, "Password must be at least " + minPasswordLength + " characters long.");
            isValid = false;
        } else {
            clearError(passwordInput);
        }

        // Confirm password
        if (confirmInput.value === "") {
            showError(confirmInput, "Please confirm your password.");
            isValid = false;
        } else if (confirmInput.value !== passwordInput.value) {
            showError(confirmInput, "Passwords do not match.");
            isValid = false;
        } else {
            clearError(confirmInput);
        }

        // Everything is correct
        if (isValid) {
            const selectedCar = carSelect ? carSelect.value : "your selected model";
            successMessage.textContent = "Client profile created! Your test drive for the " + selectedCar + " has been booked.";
            form.reset();
        }
    });
});