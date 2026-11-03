// jquery-search.js - Assignment 6 (Tasks 1, 2 & 3: jQuery Search & Highlighting)
$(document).ready(function () {
    console.log("jQuery is ready! (jquery-search.js)");

    const suggestionsPool = [
        "Aurora S", "Trailblazer X", "Volt Pro", "Raptor GT",
        "Dual Motor EV", "2.0L Turbo", "3.0L V6", "4.0L V8",
        "Sedan", "SUV", "Electric", "Sports", "2025", "2026"
    ];

    const $searchInput = $("#model-search-input");
    const $autocompleteList = $("#autocomplete-list");

    // ==========================================================
    // Integration Fix: Clear search when Vanilla JS category buttons are clicked
    // ==========================================================
    $(".filter-btn").on("click", function () {
        if ($searchInput.val().length > 0) {
            $searchInput.val("");
            $autocompleteList.hide();
        }
    });

    // ==========================================================
    // Task 1: Real-time Search and Live Filter
    // ==========================================================
    function performLiveFilter(query) {
        const cleanQuery = query.toLowerCase().trim();

        // Filter dynamically generated Vanilla JS Catalog Cards
        $("#catalog-grid .col-md-6").each(function () {
            const cardText = $(this).text().toLowerCase();
            if (cardText.indexOf(cleanQuery) > -1) {
                $(this).fadeIn(200);
            } else {
                $(this).fadeOut(200);
            }
        });

        // Filter Table Rows
        $(".catalog-table tbody tr").each(function () {
            const rowText = $(this).text().toLowerCase();
            if (rowText.indexOf(cleanQuery) > -1) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }

    $searchInput.on("keyup", function () {
        const val = $(this).val();
        performLiveFilter(val);
        handleAutocomplete(val);
    });

    // ==========================================================
    // Task 2: Autocomplete Search Suggestions
    // ==========================================================
    function handleAutocomplete(val) {
        const cleanVal = val.trim().toLowerCase();
        $autocompleteList.empty();

        if (cleanVal.length === 0) {
            $autocompleteList.hide();
            return;
        }

        const matches = suggestionsPool.filter(function (item) {
            return item.toLowerCase().indexOf(cleanVal) > -1;
        });

        if (matches.length === 0) {
            $autocompleteList.hide();
            return;
        }

        matches.forEach(function (match) {
            const $item = $("<div></div>")
                .addClass("autocomplete-item")
                .text(match);

            $item.on("click", function () {
                $searchInput.val(match);
                $autocompleteList.hide();
                performLiveFilter(match);
            });

            $autocompleteList.append($item);
        });

        $autocompleteList.slideDown(150);
    }

    $(document).on("click", function (event) {
        if (!$(event.target).closest(".search-wrapper").length) {
            $autocompleteList.hide();
        }
    });

    // ==========================================================
    // Task 3: Search Highlighting (FAQ Section)
    // ==========================================================
    const $faqSearchInput = $("#faq-search-input");

    $(".faq-item").each(function () {
        const $questionText = $(this).find(".faq-question span:first-child");
        const $answerText = $(this).find(".faq-answer p");

        $questionText.data("original-text", $questionText.text());
        $answerText.data("original-text", $answerText.text());
    });

    $faqSearchInput.on("keyup", function () {
        const query = $(this).val().trim();

        $(".faq-item").each(function () {
            const $item = $(this);
            const $questionSpan = $item.find(".faq-question span:first-child");
            const $answerP = $item.find(".faq-answer p");

            const origQ = $questionSpan.data("original-text");
            const origA = $answerP.data("original-text");

            if (!query) {
                $questionSpan.text(origQ);
                $answerP.text(origA);
                $item.show();
                return;
            }

            const safeQuery = query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
            const regex = new RegExp("(" + safeQuery + ")", "gi");
            let matched = false;

            if (regex.test(origQ)) {
                $questionSpan.html(origQ.replace(regex, '<mark class="search-highlight">$1</mark>'));
                matched = true;
            } else {
                $questionSpan.text(origQ);
            }

            if (regex.test(origA)) {
                $answerP.html(origA.replace(regex, '<mark class="search-highlight">$1</mark>'));
                matched = true;
            } else {
                $answerP.text(origA);
            }

            if (matched) {
                $item.fadeIn(150);
            } else {
                $item.fadeOut(150);
            }
        });
    });
});