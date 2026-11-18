// auth.js - Authentication Simulation, Strict +7 Phone Mask & Profile Dashboard
document.addEventListener("DOMContentLoaded", function () {
    const USERS_KEY = "autoworld_users";
    const SESSION_KEY = "autoworld_current_user";
    const ORDERS_KEY = "autoworld_orders";
    const RATINGS_KEY = "autoworld_ratings";

    const nameRegex = /^[\p{L}]+(?:\s+[\p{L}]+)*$/u;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const kzPhoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
    const passwordComplexRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    // Format raw input strictly into +7 (XXX) XXX-XX-XX with max 10 digits after +7
    window.formatKzPhoneNumber = function (rawValue) {
        let digits = String(rawValue || "").replace(/\D/g, "");
        if (!digits) return "";

        if (digits.charAt(0) === "7" || digits.charAt(0) === "8") {
            digits = digits.slice(1);
        }

        digits = digits.slice(0, 10);

        let formatted = "+7";
        if (digits.length > 0) {
            formatted += " (" + digits.slice(0, 3);
        }
        if (digits.length >= 3) {
            formatted += ")";
        }
        if (digits.length > 3) {
            formatted += " " + digits.slice(3, 6);
        }
        if (digits.length > 6) {
            formatted += "-" + digits.slice(6, 8);
        }
        if (digits.length > 8) {
            formatted += "-" + digits.slice(8, 10);
        }
        return formatted;
    };

    window.attachKzPhoneMask = function (inputEl) {
        if (!inputEl) return;
        inputEl.addEventListener("focus", function () {
            if (!inputEl.value.trim()) {
                inputEl.value = "+7 (";
            }
        });
        inputEl.addEventListener("input", function () {
            const raw = inputEl.value;
            if (raw === "+" || raw === "+7" || raw === "+7 ") {
                inputEl.value = "+7 (";
                return;
            }
            inputEl.value = window.formatKzPhoneNumber(raw);
        });
        inputEl.addEventListener("blur", function () {
            if (inputEl.value === "+7 (" || inputEl.value === "+7") {
                inputEl.value = "";
            }
        });
    };

    window.validateKzPhone = function (phoneValue) {
        return kzPhoneRegex.test(String(phoneValue || "").trim());
    };

    function getStoredUsers() {
        try {
            return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
        } catch (e) {
            return [];
        }
    }

    window.getCurrentUser = function () {
        try {
            return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
        } catch (e) {
            return null;
        }
    };

    window.getUserOrders = function () {
        const user = window.getCurrentUser();
        if (!user || !user.email) return [];
        try {
            const all = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
            return all.filter(function (o) {
                return o.userEmail && o.userEmail.toLowerCase() === user.email.toLowerCase();
            });
        } catch (e) {
            return [];
        }
    };

    window.updateGlobalNavUI = function () {
        const currentUser = window.getCurrentUser();
        const navProfileLink = document.getElementById("nav-profile-link");
        const navOrderBadge = document.getElementById("nav-order-badge");

        if (navProfileLink) {
            if (currentUser && currentUser.name) {
                const firstName = currentUser.name.split(" ")[0];
                navProfileLink.textContent = "Profile (" + firstName + ")";
            } else {
                navProfileLink.textContent = "Profile";
            }
        }

        if (navOrderBadge) {
            if (currentUser) {
                const userOrders = window.getUserOrders();
                if (userOrders.length > 0) {
                    navOrderBadge.textContent = userOrders.length;
                    navOrderBadge.style.display = "inline-block";
                } else {
                    navOrderBadge.style.display = "none";
                }
            } else {
                navOrderBadge.style.display = "none";
            }
        }
    };

    window.updateGlobalNavUI();

    function setFieldError(inputEl, errorId, message) {
        if (!inputEl) return;
        inputEl.classList.add("is-invalid");
        let errEl = document.getElementById(errorId);
        if (!errEl) {
            errEl = document.createElement("div");
            errEl.id = errorId;
            errEl.className = "invalid-feedback";
            inputEl.insertAdjacentElement("afterend", errEl);
        }
        errEl.textContent = message;
        errEl.style.display = "block";
    }

    function clearFieldError(inputEl, errorId) {
        if (!inputEl) return;
        inputEl.classList.remove("is-invalid");
        const errEl = document.getElementById(errorId);
        if (errEl) {
            errEl.textContent = "";
            errEl.style.display = "";
        }
    }

    // Attach phone mask on Profile Sign-Up phone field
    window.attachKzPhoneMask(document.getElementById("signup-phone"));

    const guestView = document.getElementById("guest-auth-view");
    const authView = document.getElementById("authenticated-profile-view");

    function renderProfilePage() {
        if (!guestView || !authView) return;

        const currentUser = window.getCurrentUser();
        if (!currentUser) {
            guestView.style.display = "block";
            authView.style.display = "none";
            return;
        }

        guestView.style.display = "none";
        authView.style.display = "block";

        const setText = function (id, val) {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };

        setText("profile-display-name", currentUser.name);
        setText("profile-info-name", currentUser.name);
        setText("profile-info-email", currentUser.email);
        setText("profile-info-phone", currentUser.phone);
        setText("profile-info-date", currentUser.createdAt || "November 2026");

        const userOrders = window.getUserOrders();
        setText("profile-orders-count", userOrders.length);

        let ratingsCount = 0;
        try {
            const ratingsObj = JSON.parse(localStorage.getItem(RATINGS_KEY)) || {};
            ratingsCount = Object.keys(ratingsObj).length;
        } catch (e) {
            ratingsCount = 0;
        }
        setText("profile-ratings-count", ratingsCount);
    }

    renderProfilePage();

    const showLoginBtn = document.getElementById("show-login-tab-btn");
    const showSignupBtn = document.getElementById("show-signup-tab-btn");
    const loginCard = document.getElementById("login-card");
    const signupCard = document.getElementById("signup-card");

    if (showLoginBtn && showSignupBtn && loginCard && signupCard) {
        showLoginBtn.addEventListener("click", function () {
            loginCard.style.display = "block";
            signupCard.style.display = "none";
            showLoginBtn.className = "btn btn-danger px-4";
            showSignupBtn.className = "btn btn-outline-danger px-4";
        });

        showSignupBtn.addEventListener("click", function () {
            loginCard.style.display = "none";
            signupCard.style.display = "block";
            showSignupBtn.className = "btn btn-danger px-4";
            showLoginBtn.className = "btn btn-outline-danger px-4";
        });
    }

    const signupForm = document.getElementById("signup-form");
    if (signupForm) {
        signupForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const nameInput = document.getElementById("signup-name") || signupForm.querySelector('[name="signup-name"]');
            const emailInput = document.getElementById("signup-email") || signupForm.querySelector('[name="signup-email"]');
            const phoneInput = document.getElementById("signup-phone") || signupForm.querySelector('[name="signup-phone"]');
            const passInput = document.getElementById("signup-password") || signupForm.querySelector('[name="signup-password"]');
            const confirmInput = document.getElementById("signup-confirm") || signupForm.querySelector('[name="signup-confirm"]');

            const cleanName = nameInput ? nameInput.value.trim() : "";
            const cleanEmail = emailInput ? emailInput.value.trim() : "";
            const cleanPhone = phoneInput ? phoneInput.value.trim() : "";
            const rawPass = passInput ? passInput.value : "";
            const rawConfirm = confirmInput ? confirmInput.value : "";

            let isValid = true;

            if (!cleanName || !nameRegex.test(cleanName) || cleanName.length < 2) {
                setFieldError(nameInput, "signup-name-error", "Please enter your full name (letters only, at least 2 characters).");
                isValid = false;
            } else {
                clearFieldError(nameInput, "signup-name-error");
            }

            if (!cleanEmail || !emailRegex.test(cleanEmail)) {
                setFieldError(emailInput, "signup-email-error", "Please enter a valid email address (e.g. client@autoworld.kz).");
                isValid = false;
            } else {
                clearFieldError(emailInput, "signup-email-error");
            }

            if (!window.validateKzPhone(cleanPhone)) {
                setFieldError(phoneInput, "signup-phone-error", "Enter a valid number starting with +7 and 10 digits: +7 (700) 123-45-67.");
                isValid = false;
            } else {
                clearFieldError(phoneInput, "signup-phone-error");
            }

            if (!rawPass || /\s/.test(rawPass) || !passwordComplexRegex.test(rawPass)) {
                setFieldError(passInput, "signup-password-error", "Password must be 8+ characters with at least 1 uppercase letter, 1 lowercase letter, and 1 number.");
                isValid = false;
            } else {
                clearFieldError(passInput, "signup-password-error");
            }

            if (!rawConfirm || rawConfirm !== rawPass) {
                setFieldError(confirmInput, "signup-confirm-error", "Passwords do not match.");
                isValid = false;
            } else {
                clearFieldError(confirmInput, "signup-confirm-error");
            }

            if (!isValid) return;

            const users = getStoredUsers();
            const existing = users.find(function (u) {
                return u.email.toLowerCase() === cleanEmail.toLowerCase();
            });

            if (existing) {
                setFieldError(emailInput, "signup-email-error", "An account with this email already exists. Please log in.");
                return;
            }

            const newUser = {
                name: cleanName,
                email: cleanEmail,
                phone: cleanPhone,
                password: rawPass,
                createdAt: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
            };

            users.push(newUser);
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
            localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));

            signupForm.reset();
            window.updateGlobalNavUI();
            renderProfilePage();

            if (typeof window.showAppToast === "function") {
                window.showAppToast("Welcome to AutoWorld, " + newUser.name + "! Your profile is now active.", "Account Created");
            }
        });
    }

    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const emailInput = document.getElementById("login-email") || loginForm.querySelector('[name="login-email"]');
            const passInput = document.getElementById("login-password") || loginForm.querySelector('[name="login-password"]');
            const generalError = document.getElementById("login-general-error");

            if (generalError) generalError.textContent = "";

            const cleanEmail = emailInput ? emailInput.value.trim() : "";
            const rawPass = passInput ? passInput.value : "";
            let isValid = true;

            if (!cleanEmail || !emailRegex.test(cleanEmail)) {
                setFieldError(emailInput, "login-email-error", "Please enter a valid email address.");
                isValid = false;
            } else {
                clearFieldError(emailInput, "login-email-error");
            }

            if (!rawPass) {
                setFieldError(passInput, "login-password-error", "Please enter your password.");
                isValid = false;
            } else {
                clearFieldError(passInput, "login-password-error");
            }

            if (!isValid) return;

            const users = getStoredUsers();
            const matchedUser = users.find(function (u) {
                return u.email.toLowerCase() === cleanEmail.toLowerCase() && u.password === rawPass;
            });

            if (!matchedUser) {
                if (generalError) {
                    generalError.textContent = "Invalid email or password. If you are a new client, please click 'Create Account (Sign Up)' above.";
                }
                return;
            }

            localStorage.setItem(SESSION_KEY, JSON.stringify(matchedUser));
            loginForm.reset();
            window.updateGlobalNavUI();
            renderProfilePage();

            if (typeof window.showAppToast === "function") {
                window.showAppToast("Welcome back, " + matchedUser.name + "!", "Logged In");
            }
        });
    }

    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem(SESSION_KEY);
            window.updateGlobalNavUI();
            renderProfilePage();

            if (typeof window.showAppToast === "function") {
                window.showAppToast("You have logged out of your client profile.", "Logged Out");
            }
        });
    }
});