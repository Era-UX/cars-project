// catalog.js - Assignment 5 (Models page):
// 1. Objects & Methods (car objects with getFormattedPrice and getMonthlyEstimate methods)
// 2. Arrays, Loops & Higher-Order Functions (.filter, .forEach)
// 3. Switch Statement for category filtering
// 4. Interactive Star Rating using document.querySelectorAll
// 5. Event-triggered hover transform animations

document.addEventListener("DOMContentLoaded", function () {
    const gridContainer = document.getElementById("catalog-grid");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const filterStatus = document.getElementById("filter-status");

    if (!gridContainer) {
        return;
    }

    // Array of Car Objects with internal methods
    const carDatabase = [
        {
            id: "aurora",
            name: "Aurora S",
            category: "Sedan",
            engine: "2.0L Turbo",
            year: 2025,
            price: 24500,
            image: "images/gallery-1.jpeg",
            rating: 4,
            getFormattedPrice: function () {
                return "$" + this.price.toLocaleString("en-US");
            },
            getMonthlyPayment: function () {
                return "$" + Math.round(this.price / 60) + "/mo";
            }
        },
        {
            id: "trailblazer",
            name: "Trailblazer X",
            category: "SUV",
            engine: "3.0L V6",
            year: 2026,
            price: 38900,
            image: "images/gallery-3.jpeg",
            rating: 5,
            getFormattedPrice: function () {
                return "$" + this.price.toLocaleString("en-US");
            },
            getMonthlyPayment: function () {
                return "$" + Math.round(this.price / 60) + "/mo";
            }
        },
        {
            id: "volt",
            name: "Volt Pro",
            category: "Electric",
            engine: "Dual Motor EV",
            year: 2026,
            price: 41200,
            image: "images/gallery-5.jpeg",
            rating: 5,
            getFormattedPrice: function () {
                return "$" + this.price.toLocaleString("en-US");
            },
            getMonthlyPayment: function () {
                return "$" + Math.round(this.price / 60) + "/mo";
            }
        },
        {
            id: "raptor",
            name: "Raptor GT",
            category: "Sports",
            engine: "4.0L V8",
            year: 2025,
            price: 62000,
            image: "images/gallery-7.jpeg",
            rating: 5,
            getFormattedPrice: function () {
                return "$" + this.price.toLocaleString("en-US");
            },
            getMonthlyPayment: function () {
                return "$" + Math.round(this.price / 60) + "/mo";
            }
        }
    ];

    // Render vehicle cards dynamically
    function renderCatalog(carsArray) {
        gridContainer.innerHTML = "";

        // Higher-order function: .forEach()
        carsArray.forEach(function (car) {
            const col = document.createElement("div");
            col.className = "col-md-6 col-lg-3";

            // Build 5 interactive stars using a for loop
            let starsHtml = "";
            for (let i = 1; i <= 5; i++) {
                const selectedClass = i <= car.rating ? "selected" : "";
                starsHtml += '<span class="rating-star ' + selectedClass + '" data-car="' + car.id + '" data-value="' + i + '">&#9733;</span>';
            }

            col.innerHTML =
                '<div class="card h-100 shadow-sm catalog-card">' +
                    '<img src="' + car.image + '" class="card-img-top" alt="' + car.name + '">' +
                    '<div class="card-body d-flex flex-column">' +
                        '<div class="d-flex justify-content-between align-items-center mb-1">' +
                            '<h3 class="card-title h5 mb-0">' + car.name + '</h3>' +
                            '<span class="badge bg-danger">' + car.category + '</span>' +
                        '</div>' +
                        '<p class="text-secondary small mb-2">' + car.year + ' &bull; ' + car.engine + '</p>' +
                        '<p class="fw-bold fs-5 mb-1">' + car.getFormattedPrice() + ' <span class="text-secondary fw-normal small">(' + car.getMonthlyPayment() + ')</span></p>' +
                        '<div class="mt-auto pt-2 border-top">' +
                            '<div class="star-container" data-car-id="' + car.id + '">' +
                                starsHtml +
                            '</div>' +
                            '<small class="rating-label text-secondary d-block mt-1">Customer Rating: ' + car.rating + ' / 5</small>' +
                        '</div>' +
                    '</div>' +
                '</div>';

            gridContainer.appendChild(col);
        });

        attachStarRatingListeners();
        attachCardHoverAnimations();
    }

    // Use document.querySelectorAll to select rating stars and change color on click
    function attachStarRatingListeners() {
        const allStars = document.querySelectorAll(".rating-star");

        allStars.forEach(function (star) {
            star.addEventListener("click", function () {
                const carId = star.getAttribute("data-car");
                const newRating = parseInt(star.getAttribute("data-value"), 10);

                // Update object rating in carDatabase
                const targetCar = carDatabase.find(function (c) {
                    return c.id === carId;
                });
                if (targetCar) {
                    targetCar.rating = newRating;
                }

                // Select all stars in this specific card and update their color class
                const container = star.parentElement;
                const siblingStars = container.querySelectorAll(".rating-star");
                siblingStars.forEach(function (s) {
                    const val = parseInt(s.getAttribute("data-value"), 10);
                    if (val <= newRating) {
                        s.classList.add("selected");
                    } else {
                        s.classList.remove("selected");
                    }
                });

                // Update rating label textContent
                const label = container.nextElementSibling;
                if (label) {
                    label.textContent = "Your Rating: " + newRating + " / 5 (Saved!)";
                }
            });
        });
    }

    // Dynamic style.transform animation on card mouseenter/mouseleave
    function attachCardHoverAnimations() {
        const cards = document.querySelectorAll(".catalog-card");
        cards.forEach(function (card) {
            card.addEventListener("mouseenter", function () {
                card.style.transform = "translateY(-6px)";
            });
            card.addEventListener("mouseleave", function () {
                card.style.transform = "translateY(0)";
            });
        });
    }

    // Switch Statement + Higher-Order Function (.filter) for category buttons
    filterButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            filterButtons.forEach(function (b) {
                b.classList.remove("btn-danger");
                b.classList.add("btn-outline-danger");
            });
            btn.classList.remove("btn-outline-danger");
            btn.classList.add("btn-danger");

            const selectedCategory = btn.getAttribute("data-filter");
            let statusMessage = "";

            // Switch statement controlling category message and filter logic
            switch (selectedCategory) {
                case "Sedan":
                    statusMessage = "Showing Sedan models: built for daily comfort and fuel efficiency.";
                    break;
                case "SUV":
                    statusMessage = "Showing SUV models: spacious utility vehicles for family adventures.";
                    break;
                case "Electric":
                    statusMessage = "Showing Electric models: zero-emission dual-motor EV technology.";
                    break;
                case "Sports":
                    statusMessage = "Showing Sports models: track-ready V8 performance vehicles.";
                    break;
                default:
                    statusMessage = "Showing all 4 verified AutoWorld models.";
                    break;
            }

            if (filterStatus) {
                filterStatus.textContent = statusMessage;
            }

            // Higher-Order Function: .filter() takes a callback function as argument
            const filteredCars = selectedCategory === "All"
                ? carDatabase
                : carDatabase.filter(function (car) {
                    return car.category === selectedCategory;
                });

            renderCatalog(filteredCars);
        });
    });

    // Initial render on page load
    renderCatalog(carDatabase);
});