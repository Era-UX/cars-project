// catalog.js - 8-Car Showroom Database, Toggleable Star Ratings & Clean Refresh Behavior
document.addEventListener("DOMContentLoaded", function () {
    const catalogGrid = document.getElementById("catalog-grid");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const filterStatus = document.getElementById("filter-status");
    const RATINGS_KEY = "autoworld_ratings";

    if (!catalogGrid) return;

    const carDatabase = [
        {
            id: "aurora-s",
            name: "Aurora S",
            category: "Sedan",
            engine: "2.0L Turbo",
            year: 2025,
            price: "$24,500",
            image: "images/gallery-1.jpeg",
            fallback: "images/category-sedan.jpg",
            specs: ["195 HP", "6.8L / 100km", "Apple CarPlay & Heated Seats"]
        },
        {
            id: "echelon-lx",
            name: "Echelon LX",
            category: "Sedan",
            engine: "2.5L Hybrid",
            year: 2026,
            price: "$29,800",
            image: "images/car-echelong.jpg",
            fallback: "images/gallery-2.jpeg",
            specs: ["235 HP Hybrid", "4.5L / 100km", "Executive Leather & Panoramic Roof"]
        },
        {
            id: "trailblazer-x",
            name: "Trailblazer X",
            category: "SUV",
            engine: "3.0L V6",
            year: 2026,
            price: "$38,900",
            image: "images/gallery-3.jpeg",
            fallback: "images/category-suv.jpg",
            specs: ["310 HP V6", "7-Passenger", "Intelligent 4WD Terrain Control"]
        },
        {
            id: "summit-awd",
            name: "Summit AWD",
            category: "SUV",
            engine: "2.4L Turbo AWD",
            year: 2026,
            price: "$34,200",
            image: "images/car-summit.jpg",
            fallback: "images/gallery-3.jpeg",
            specs: ["275 HP", "All-Weather Package", "360-Degree Off-Road Camera"]
        },
        {
            id: "volt-pro",
            name: "Volt Pro",
            category: "Electric",
            engine: "Dual Motor EV",
            year: 2026,
            price: "$41,200",
            image: "images/gallery-5.jpeg",
            fallback: "images/gallery-2.jpeg",
            specs: ["520 km Range", "0-100 in 4.2s", "350 kW Ultra-Fast Charging"]
        },
        {
            id: "ionix-gte",
            name: "Ionix GT-E",
            category: "Electric",
            engine: "Long Range Tri-Motor EV",
            year: 2026,
            price: "$46,500",
            image: "images/car-ionix.jpg",
            fallback: "images/gallery-5.jpeg",
            specs: ["610 km Range", "0-100 in 3.4s", "Autonomous Highway Pilot"]
        },
        {
            id: "raptor-gt",
            name: "Raptor GT",
            category: "Sports",
            engine: "4.0L V8",
            year: 2025,
            price: "$62,000",
            image: "images/gallery-7.jpeg",
            fallback: "images/category-sport.jpg",
            specs: ["510 HP V8", "0-100 in 3.6s", "Carbon-Ceramic Track Brakes"]
        },
        {
            id: "apex-rs",
            name: "Apex RS",
            category: "Sports",
            engine: "3.8L Twin-Turbo",
            year: 2026,
            price: "$68,900",
            image: "images/car-apex.jpg",
            fallback: "images/hero-car.jpeg",
            specs: ["580 HP Twin-Turbo", "0-100 in 3.1s", "Active Aero Rear Wing"]
        }
    ];

    function getSavedRatings() {
        try {
            return JSON.parse(localStorage.getItem(RATINGS_KEY)) || {};
        } catch (e) {
            return {};
        }
    }

    function setSavedRating(carId, ratingValue) {
        const ratings = getSavedRatings();
        if (ratingValue <= 0) {
            delete ratings[carId];
        } else {
            ratings[carId] = ratingValue;
        }
        localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings));
    }

    function renderCatalog(selectedCategory) {
        catalogGrid.innerHTML = "";
        const savedRatings = getSavedRatings();

        const filteredCars = selectedCategory === "All"
            ? carDatabase
            : carDatabase.filter(function (car) { return car.category === selectedCategory; });

        if (filterStatus) {
            filterStatus.textContent = "Showing " + filteredCars.length + " of " + carDatabase.length + " verified AutoWorld models (" + selectedCategory + ").";
        }

        filteredCars.forEach(function (car) {
            const currentRating = savedRatings[car.id] || 0;

            const col = document.createElement("div");
            col.className = "col-md-6 col-lg-3";

            let starsHtml = "";
            for (let i = 1; i <= 5; i++) {
                const selectedClass = i <= currentRating ? " selected" : "";
                starsHtml += '<span class="rating-star' + selectedClass + '" data-car-id="' + car.id + '" data-star="' + i + '" title="Click to rate, click again to remove">&#9733;</span>';
            }

            let specsHtml = "";
            car.specs.forEach(function (s) {
                specsHtml += "<li>" + s + "</li>";
            });

            col.innerHTML =
                '<div class="card catalog-card h-100 shadow-sm">' +
                    '<img src="' + car.image + '" onerror="this.onerror=null;this.src=\'' + car.fallback + '\';" class="card-img-top" alt="' + car.name + '">' +
                    '<div class="card-body d-flex flex-column justify-content-between">' +
                        '<div>' +
                            '<div class="d-flex justify-content-between align-items-center mb-1">' +
                                '<span class="badge bg-danger">' + car.category + '</span>' +
                                '<span class="fw-bold text-danger">' + car.price + '</span>' +
                            '</div>' +
                            '<h3 class="h5 card-title mb-1">' + car.name + '</h3>' +
                            '<p class="text-secondary small mb-2">' + car.year + ' &bull; ' + car.engine + '</p>' +
                            '<ul class="small ps-3 mb-2">' + specsHtml + '</ul>' +
                        '</div>' +
                        '<div class="border-top pt-2 mt-2">' +
                            '<div class="d-flex justify-content-between align-items-center mb-2">' +
                                '<div class="star-container">' + starsHtml + '</div>' +
                                '<small class="rating-label text-secondary">' + (currentRating > 0 ? currentRating + "/5" : "Rate") + '</small>' +
                            '</div>' +
                            '<div class="d-grid gap-1">' +
                                '<a href="services.html?car=' + encodeURIComponent(car.name) + '&mode=Vehicle Order" class="btn btn-danger btn-sm">Order / Finance</a>' +
                                '<a href="services.html?car=' + encodeURIComponent(car.name) + '&mode=Test Drive" class="btn btn-outline-danger btn-sm">Book Test Drive</a>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>';

            catalogGrid.appendChild(col);
        });

        const tableRows = document.querySelectorAll("#comparison-table-body tr");
        tableRows.forEach(function (row) {
            const rowCategory = row.children[1] ? row.children[1].textContent.trim() : "";
            if (selectedCategory === "All" || rowCategory === selectedCategory) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    }

    // Click star to rate; click the same star again to revert/remove rating
    catalogGrid.addEventListener("click", function (event) {
        const starEl = event.target.closest(".rating-star");
        if (!starEl) return;

        const carId = starEl.getAttribute("data-car-id");
        const clickedStar = parseInt(starEl.getAttribute("data-star"), 10) || 1;
        const existingRating = getSavedRatings()[carId] || 0;

        const nextRating = (existingRating === clickedStar) ? 0 : clickedStar;
        setSavedRating(carId, nextRating);

        const container = starEl.parentElement;
        const allStars = container.querySelectorAll(".rating-star");
        allStars.forEach(function (s, idx) {
            if (idx < nextRating) {
                s.classList.add("selected");
            } else {
                s.classList.remove("selected");
            }
        });

        const label = container.parentElement.querySelector(".rating-label");
        if (label) {
            label.textContent = nextRating > 0 ? nextRating + "/5" : "Rate";
        }
    });

    function setActiveCategoryButton(category) {
        filterButtons.forEach(function (btn) {
            if (btn.getAttribute("data-filter") === category) {
                btn.classList.remove("btn-outline-danger");
                btn.classList.add("btn-danger");
            } else {
                btn.classList.remove("btn-danger");
                btn.classList.add("btn-outline-danger");
            }
        });
    }

    filterButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            const category = btn.getAttribute("data-filter") || "All";
            setActiveCategoryButton(category);
            renderCatalog(category);
        });
    });

    // Read ?category=... ONLY when navigating from Home page, then clean URL so F5 refresh stays at top with All Models
    const urlParams = new URLSearchParams(window.location.search);
    const urlCategory = urlParams.get("category");
    const validCategories = ["All", "Sedan", "SUV", "Electric", "Sports"];

    let initialCategory = "All";
    if (urlCategory && validCategories.indexOf(urlCategory) > -1) {
        initialCategory = urlCategory;
    }

    setActiveCategoryButton(initialCategory);
    renderCatalog(initialCategory);

    if (window.location.search || window.location.hash) {
        setTimeout(function () {
            if (window.history && window.history.replaceState) {
                window.history.replaceState(null, "", window.location.pathname);
            }
        }, 600);
    }
});