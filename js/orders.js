// orders.js - Auth Gate & User-Specific Orders Management on orders.html
document.addEventListener("DOMContentLoaded", function () {
    const guestState = document.getElementById("orders-guest-state");
    const authWrapper = document.getElementById("orders-authenticated-wrapper");
    const headerActions = document.getElementById("orders-header-actions");
    const ordersList = document.getElementById("orders-list");
    const emptyState = document.getElementById("orders-empty-state");
    const clearAllBtn = document.getElementById("clear-all-orders-btn");
    const filterButtons = document.querySelectorAll(".order-filter-btn");
    const ORDERS_KEY = "autoworld_orders";

    if (!ordersList) return;

    const currentUser = typeof window.getCurrentUser === "function" ? window.getCurrentUser() : null;

    if (!currentUser) {
        if (guestState) guestState.style.display = "block";
        if (authWrapper) authWrapper.style.display = "none";
        if (headerActions) headerActions.style.display = "none";
        return;
    }

    if (guestState) guestState.style.display = "none";
    if (authWrapper) authWrapper.style.display = "block";
    if (headerActions) headerActions.style.display = "flex";

    let currentFilter = "All";

    function getAllOrders() {
        try {
            return JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
        } catch (e) {
            return [];
        }
    }

    function getMyOrders() {
        return getAllOrders().filter(function (o) {
            return o.userEmail && o.userEmail.toLowerCase() === currentUser.email.toLowerCase();
        });
    }

    function saveAllOrders(allOrders) {
        localStorage.setItem(ORDERS_KEY, JSON.stringify(allOrders));
        if (typeof window.updateGlobalNavUI === "function") {
            window.updateGlobalNavUI();
        }
    }

    function renderOrders() {
        const myOrders = getMyOrders();
        ordersList.innerHTML = "";

        const filtered = currentFilter === "All"
            ? myOrders
            : myOrders.filter(function (o) { return o.type === currentFilter; });

        if (filtered.length === 0) {
            emptyState.style.display = "block";
            return;
        }

        emptyState.style.display = "none";

        filtered.forEach(function (order) {
            const badgeClass = order.type === "Test Drive" ? "bg-warning text-dark" : "bg-danger";
            const col = document.createElement("div");
            col.className = "col-md-6";

            col.innerHTML =
                '<div class="card order-card h-100 p-4 shadow-sm">' +
                    '<div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">' +
                        '<div>' +
                            '<span class="badge ' + badgeClass + ' me-2">' + order.type + '</span>' +
                            '<small class="text-secondary fw-semibold">' + order.id + '</small>' +
                        '</div>' +
                        '<small class="text-secondary">' + order.createdAt + '</small>' +
                    '</div>' +
                    '<h2 class="h5 text-danger mb-1">' + order.car + ' <span class="text-secondary fs-6">(' + order.basePrice + ')</span></h2>' +
                    '<p class="fw-semibold mb-2">' + order.details + '</p>' +
                    '<p class="small text-secondary mb-1"><strong>Client:</strong> ' + order.clientName + ' (' + order.clientPhone + ')</p>' +
                    '<p class="small text-secondary mb-3"><strong>Notes:</strong> ' + order.notes + '</p>' +
                    '<div class="mt-auto text-end">' +
                        '<button type="button" class="btn btn-outline-danger btn-sm cancel-order-btn" data-id="' + order.id + '">Cancel Application</button>' +
                    '</div>' +
                '</div>';

            ordersList.appendChild(col);
        });
    }

    ordersList.addEventListener("click", function (event) {
        const cancelBtn = event.target.closest(".cancel-order-btn");
        if (!cancelBtn) return;

        const targetId = cancelBtn.getAttribute("data-id");
        const remaining = getAllOrders().filter(function (o) {
            return o.id !== targetId;
        });

        saveAllOrders(remaining);
        renderOrders();

        if (typeof window.showAppToast === "function") {
            window.showAppToast("Order " + targetId + " has been removed.", "Order Canceled");
        }
    });

    if (clearAllBtn) {
        clearAllBtn.addEventListener("click", function () {
            const otherUsersOrders = getAllOrders().filter(function (o) {
                return !o.userEmail || o.userEmail.toLowerCase() !== currentUser.email.toLowerCase();
            });
            saveAllOrders(otherUsersOrders);
            renderOrders();
            if (typeof window.showAppToast === "function") {
                window.showAppToast("All your saved orders have been cleared.", "Orders Cleared");
            }
        });
    }

    filterButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            filterButtons.forEach(function (b) {
                b.classList.remove("btn-danger");
                b.classList.add("btn-outline-danger");
            });
            btn.classList.remove("btn-outline-danger");
            btn.classList.add("btn-danger");

            currentFilter = btn.getAttribute("data-type") || "All";
            renderOrders();
        });
    });

    renderOrders();
});