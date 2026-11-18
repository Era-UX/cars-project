// booking-wizard.js - Auth-Protected Dual-Mode Wizard & Strict +7 Phone Validation
document.addEventListener("DOMContentLoaded", function () {
    const authGate = document.getElementById("services-auth-gate");
    const bookingWrapper = document.getElementById("services-booking-wrapper");
    const form = document.getElementById("booking-form");

    if (!form) return;

    const currentUser = typeof window.getCurrentUser === "function" ? window.getCurrentUser() : null;

    if (!currentUser) {
        if (authGate) authGate.style.display = "block";
        if (bookingWrapper) bookingWrapper.style.display = "none";
        return;
    }

    if (authGate) authGate.style.display = "none";
    if (bookingWrapper) bookingWrapper.style.display = "block";

    const ORDERS_KEY = "autoworld_orders";

    const steps = document.querySelectorAll(".wizard-step");
    const progressBar = document.getElementById("wizard-progress");
    const nextBtn1 = document.getElementById("next-step-1");
    const backBtn2 = document.getElementById("back-step-2");
    const resetBtn = document.getElementById("reset-form-btn");

    const modeButtons = document.querySelectorAll(".service-mode-btn");
    const serviceTypeInput = document.getElementById("service-type-input");
    const step1Heading = document.getElementById("step-1-heading");
    const financingTermCol = document.getElementById("financing-term-col");
    const financingEstimateCol = document.getElementById("financing-estimate-col");
    const testDriveDateCol = document.getElementById("testdrive-date-col");

    const carSelect = document.getElementById("car-model");
    const monthsSelect = document.getElementById("loan-months");
    const preferredDateSelect = document.getElementById("preferred-date");
    const paymentOutput = document.getElementById("monthly-estimate");

    const namePattern = /^[\p{L}]+(?:\s+[\p{L}]+)*$/u;
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordComplexPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    const financeCalculator = {
        prices: {
            "Aurora S": 24500,
            "Echelon LX": 29800,
            "Trailblazer X": 38900,
            "Summit AWD": 34200,
            "Volt Pro": 41200,
            "Ionix GT-E": 46500,
            "Raptor GT": 62000,
            "Apex RS": 68900
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

    function setServiceMode(mode) {
        if (serviceTypeInput) serviceTypeInput.value = mode;

        modeButtons.forEach(function (btn) {
            if (btn.getAttribute("data-mode") === mode) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });

        if (mode === "Test Drive") {
            if (step1Heading) step1Heading.textContent = "Step 1: Select Vehicle & Preferred Test-Drive Slot";
            if (financingTermCol) financingTermCol.style.display = "none";
            if (financingEstimateCol) financingEstimateCol.style.display = "none";
            if (testDriveDateCol) testDriveDateCol.style.display = "block";
        } else {
            if (step1Heading) step1Heading.textContent = "Step 1: Select Vehicle & Financing Plan";
            if (financingTermCol) financingTermCol.style.display = "block";
            if (financingEstimateCol) financingEstimateCol.style.display = "block";
            if (testDriveDateCol) testDriveDateCol.style.display = "none";
        }
    }

    modeButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            setServiceMode(btn.getAttribute("data-mode"));
        });
    });

    const urlParams = new URLSearchParams(window.location.search);
    const paramCar = urlParams.get("car");
    const paramMode = urlParams.get("mode");

    if (paramCar && carSelect) {
        Array.from(carSelect.options).forEach(function (opt) {
            if (opt.value === paramCar) {
                carSelect.value = paramCar;
            }
        });
    }
    if (paramMode === "Test Drive" || paramMode === "Vehicle Order") {
        setServiceMode(paramMode);
    }

    // Pre-fill authenticated client details & attach strict +7 phone mask
    const nameEl = document.getElementById("reg-name");
    const emailEl = document.getElementById("reg-email");
    const phoneEl = document.getElementById("reg-phone");

    if (typeof window.attachKzPhoneMask === "function") {
        window.attachKzPhoneMask(phoneEl);
    }

    if (nameEl && currentUser.name) nameEl.value = currentUser.name;
    if (emailEl && currentUser.email) emailEl.value = currentUser.email;
    if (phoneEl && currentUser.phone && typeof window.formatKzPhoneNumber === "function") {
        phoneEl.value = window.formatKzPhoneNumber(currentUser.phone);
    }

    if (carSelect && monthsSelect) {
        carSelect.addEventListener("change", updateMonthlyEstimate);
        monthsSelect.addEventListener("change", updateMonthlyEstimate);
        updateMonthlyEstimate();
    }

    function navigateStep(targetStep, callback) {
        steps.forEach(function (stepDiv, index) {
            stepDiv.style.display = index === targetStep ? "block" : "none";
        });
        if (typeof callback === "function") callback(targetStep);
    }

    function updateProgressUI(stepIndex) {
        if (!progressBar) return;
        if (stepIndex === 0) {
            progressBar.style.width = "50%";
            progressBar.textContent = "Step 1 of 2: Vehicle Configuration";
        } else {
            progressBar.style.width = "100%";
            progressBar.textContent = "Step 2 of 2: Client Verification";
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

    if (resetBtn) {
        resetBtn.addEventListener("click", function () {
            document.querySelectorAll("#booking-form input:not([type='hidden'])").forEach(function (input) {
                input.value = "";
                input.classList.remove("is-invalid");
            });
            document.querySelectorAll("#booking-form textarea").forEach(function (area) {
                area.value = "";
            });
            document.querySelectorAll(".invalid-feedback").forEach(function (err) {
                err.textContent = "";
            });
            navigateStep(0, updateProgressUI);
        });
    }

    function showError(input, errorId, message) {
        if (!input) return;
        input.classList.add("is-invalid");
        let errEl = document.getElementById(errorId);
        if (!errEl) {
            errEl = document.createElement("div");
            errEl.id = errorId;
            errEl.className = "invalid-feedback";
            input.insertAdjacentElement("afterend", errEl);
        }
        errEl.textContent = message;
        errEl.style.display = "block";
    }

    function clearError(input, errorId) {
        if (!input) return;
        input.classList.remove("is-invalid");
        const errEl = document.getElementById(errorId);
        if (errEl) {
            errEl.textContent = "";
            errEl.style.display = "";
        }
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const nameInput = document.getElementById("reg-name") || form.querySelector('[name="reg-name"]');
        const emailInput = document.getElementById("reg-email") || form.querySelector('[name="reg-email"]');
        const phoneInput = document.getElementById("reg-phone") || form.querySelector('[name="reg-phone"]');
        const passwordInput = document.getElementById("reg-password") || form.querySelector('[name="reg-password"]');
        const confirmInput = document.getElementById("reg-confirm") || form.querySelector('[name="reg-confirm"]');
        const wishesInput = document.getElementById("message");

        const cleanName = nameInput ? nameInput.value.trim() : "";
        const cleanEmail = emailInput ? emailInput.value.trim() : "";
        const cleanPhone = phoneInput ? phoneInput.value.trim() : "";
        const rawPassword = passwordInput ? passwordInput.value : "";
        const rawConfirm = confirmInput ? confirmInput.value : "";

        let isValid = true;

        if (!cleanName || !namePattern.test(cleanName) || cleanName.length < 2) {
            showError(nameInput, "reg-name-error", "Please enter a valid full name (letters only, minimum 2 characters).");
            isValid = false;
        } else {
            clearError(nameInput, "reg-name-error");
        }

        if (!cleanEmail || !emailPattern.test(cleanEmail)) {
            showError(emailInput, "reg-email-error", "Please enter a valid email address (e.g. name@example.com).");
            isValid = false;
        } else {
            clearError(emailInput, "reg-email-error");
        }

        const isValidPhone = typeof window.validateKzPhone === "function"
            ? window.validateKzPhone(cleanPhone)
            : /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(cleanPhone);

        if (!isValidPhone) {
            showError(phoneInput, "reg-phone-error", "Enter a valid number starting with +7 and 10 digits: +7 (700) 123-45-67.");
            isValid = false;
        } else {
            clearError(phoneInput, "reg-phone-error");
        }

        if (!rawPassword || /\s/.test(rawPassword) || !passwordComplexPattern.test(rawPassword)) {
            showError(passwordInput, "reg-password-error", "Password must be 8+ characters with at least 1 uppercase letter, 1 lowercase letter, and 1 number.");
            isValid = false;
        } else {
            clearError(passwordInput, "reg-password-error");
        }

        if (!rawConfirm || rawConfirm !== rawPassword) {
            showError(confirmInput, "reg-confirm-error", "Passwords do not match.");
            isValid = false;
        } else {
            clearError(confirmInput, "reg-confirm-error");
        }

        if (!isValid) {
            form.dataset.validSubmit = "false";
            return;
        }

        form.dataset.validSubmit = "true";

        const activeMode = serviceTypeInput ? serviceTypeInput.value : "Vehicle Order";
        const selectedCar = carSelect ? carSelect.value : "Aurora S";
        const months = monthsSelect ? parseInt(monthsSelect.value, 10) : 36;
        const monthlyPayment = financeCalculator.calculateMonthly(selectedCar, months);
        const totalBasePrice = financeCalculator.prices[selectedCar] || 24500;
        const slot = preferredDateSelect ? preferredDateSelect.value : "Tomorrow, 10:00 AM";

        const newOrder = {
            id: "AW-" + Math.floor(100000 + Math.random() * 900000),
            userEmail: currentUser.email,
            type: activeMode,
            car: selectedCar,
            basePrice: "$" + totalBasePrice.toLocaleString(),
            details: activeMode === "Test Drive"
                ? "Scheduled Slot: " + slot
                : "$" + monthlyPayment + "/mo for " + months + " months (5% APR)",
            clientName: cleanName,
            clientEmail: cleanEmail,
            clientPhone: cleanPhone,
            notes: wishesInput && wishesInput.value.trim() ? wishesInput.value.trim() : "Standard showroom configuration",
            createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        };

        try {
            const existingOrders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
            existingOrders.unshift(newOrder);
            localStorage.setItem(ORDERS_KEY, JSON.stringify(existingOrders));
        } catch (e) {}

        window.lastSubmittedOrder = newOrder;
    });
});