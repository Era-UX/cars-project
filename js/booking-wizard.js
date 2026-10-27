// booking-wizard.js - Assignment 5 (Services page):
// 1. Multi-step form navigated via "Next" and "Back" buttons using a callback function
// 2. Objects & Methods: financing calculator object computing monthly installment dynamically
// 3. Reset button using document.querySelectorAll('input').forEach(input => input.value = '')
// 4. Strict real-world validation:
//    - Full Name: letters and spaces only (no numbers or symbols)
//    - Email: strict alphanumeric format (no special symbols like !#$% or spaces)
//    - Password: at least 8 characters and no spaces allowed
//    - Confirm Password: must match password

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("booking-form");
    if (!form) {
        return;
    }

    const steps = document.querySelectorAll(".wizard-step");
    const progressBar = document.getElementById("wizard-progress");
    const nextBtn1 = document.getElementById("next-step-1");
    const backBtn2 = document.getElementById("back-step-2");
    const resetBtn = document.getElementById("reset-form-btn");

    const carSelect = document.getElementById("car-model");
    const monthsSelect = document.getElementById("loan-months");
    const paymentOutput = document.getElementById("monthly-estimate");

    const nameInput = document.getElementById("reg-name");
    const emailInput = document.getElementById("reg-email");
    const passwordInput = document.getElementById("reg-password");
    const confirmInput = document.getElementById("reg-confirm");
    const successMessage = document.getElementById("signup-success");

    // Only letters (English, Russian, Kazakh) and single spaces between words
    const namePattern = /^[\p{L}]+(?:\s+[\p{L}]+)*$/u;

    // Strict email: letters and numbers, optional single dot/underscore/hyphen, valid domain
    const strictEmailPattern = /^[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*(\.[a-zA-Z]{2,})+$/;

    const minPasswordLength = 8;
    let currentStep = 0;

    // Financing Calculator Object with Method
    const financeCalculator = {
        prices: {
            "Aurora S (Sedan)": 24500,
            "Trailblazer X (SUV)": 38900,
            "Volt Pro (Electric)": 41200,
            "Raptor GT (Sports)": 62000
        },
        annualInterestRate: 0.05,
        calculateMonthly: function (modelName, months) {
            const basePrice = this.prices[modelName] || 24500;
            const totalWithInterest = basePrice * (1 + this.annualInterestRate * (months / 12));
            return Math.round(totalWithInterest / months);
        }
    };

    function updateMonthlyEstimate() {
        if (!carSelect || !monthsSelect || !paymentOutput) return;
        const selectedCar = carSelect.value;
        const months = parseInt(monthsSelect.value, 10) || 36;
        const monthly = financeCalculator.calculateMonthly(selectedCar, months);
        paymentOutput.textContent = "$" + monthly + " / month (" + months + " months)";
    }

    if (carSelect && monthsSelect) {
        carSelect.addEventListener("change", updateMonthlyEstimate);
        monthsSelect.addEventListener("change", updateMonthlyEstimate);
        updateMonthlyEstimate();
    }

    // Callback function to display the correct step and update progress bar
    function navigateStep(targetStep, onStepChangeCallback) {
        steps.forEach(function (stepDiv, index) {
            stepDiv.style.display = index === targetStep ? "block" : "none";
        });
        currentStep = targetStep;

        if (typeof onStepChangeCallback === "function") {
            onStepChangeCallback(currentStep);
        }
    }

    function updateProgressUI(stepIndex) {
        if (!progressBar) return;
        if (stepIndex === 0) {
            progressBar.style.width = "50%";
            progressBar.textContent = "Step 1 of 2: Vehicle & Financing";
        } else {
            progressBar.style.width = "100%";
            progressBar.textContent = "Step 2 of 2: Client Profile & Confirmation";
        }
    }

    if (nextBtn1) {
        nextBtn1.addEventListener("click", function () {
            navigateStep(1, updateProgressUI);
        });
    }

    if (backBtn2) {
        backBtn2.addEventListener("click", function () {
            navigateStep(0, updateProgressUI);
        });
    }

    // Assignment 5 Event Listener: Reset button clearing all inputs with querySelectorAll().forEach()
    if (resetBtn) {
        resetBtn.addEventListener("click", function () {
            document.querySelectorAll("#booking-form input").forEach(function (input) {
                input.value = "";
                input.classList.remove("is-invalid");
            });
            document.querySelectorAll("#booking-form textarea").forEach(function (area) {
                area.value = "";
            });
            document.querySelectorAll(".invalid-feedback").forEach(function (err) {
                err.textContent = "";
            });
            successMessage.textContent = "";
            navigateStep(0, updateProgressUI);
        });
    }

    function showError(input, message) {
        input.classList.add("is-invalid");
        document.getElementById(input.id + "-error").textContent = message;
    }

    function clearError(input) {
        input.classList.remove("is-invalid");
        document.getElementById(input.id + "-error").textContent = "";
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        let isValid = true;
        successMessage.textContent = "";

        const cleanName = nameInput.value.trim();
        const cleanEmail = emailInput.value.trim();
        const rawPassword = passwordInput.value;
        const rawConfirm = confirmInput.value;

        // 1. Full Name validation (required, letters only, no numbers or symbols)
        if (cleanName === "") {
            showError(nameInput, "Please enter your full name.");
            isValid = false;
        } else if (!namePattern.test(cleanName) || cleanName.length < 2) {
            showError(nameInput, "Name must contain letters only (no numbers or symbols).");
            isValid = false;
        } else {
            clearError(nameInput);
        }

        // 2. Email validation (required, no spaces, no invalid symbols before/after @)
        if (cleanEmail === "") {
            showError(emailInput, "Please enter your email address.");
            isValid = false;
        } else if (/\s/.test(cleanEmail) || !strictEmailPattern.test(cleanEmail)) {
            showError(emailInput, "Please enter a valid email address (letters and numbers only, e.g. name@example.com).");
            isValid = false;
        } else {
            clearError(emailInput);
        }

        // 3. Password validation (required, no spaces allowed, at least 8 characters)
        if (rawPassword.trim() === "") {
            showError(passwordInput, "Please enter a password (cannot be blank spaces).");
            isValid = false;
        } else if (/\s/.test(rawPassword)) {
            showError(passwordInput, "Password cannot contain spaces.");
            isValid = false;
        } else if (rawPassword.length < minPasswordLength) {
            showError(passwordInput, "Password must be at least " + minPasswordLength + " characters long.");
            isValid = false;
        } else {
            clearError(passwordInput);
        }

        // 4. Confirm Password validation
        if (rawConfirm.trim() === "") {
            showError(confirmInput, "Please confirm your password.");
            isValid = false;
        } else if (rawConfirm !== rawPassword) {
            showError(confirmInput, "Passwords do not match.");
            isValid = false;
        } else {
            clearError(confirmInput);
        }

        if (isValid) {
            if (typeof playNotificationChime === "function") {
                playNotificationChime();
            }
            const selectedCar = carSelect ? carSelect.value : "your selected model";
            successMessage.textContent = "Client profile created! Your test drive for the " + selectedCar + " has been booked.";
        }
    });
});