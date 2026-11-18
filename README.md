# AutoWorld — Interactive Car Dealership Web Application

A responsive, 6-page digital car dealership platform built for Astana drivers. Users can browse an 8-car showroom lineup, filter and search vehicles in real time, rate models with persistent storage, check live Astana test-drive weather conditions, create a client profile, and submit vehicle financing orders or test-drive bookings.

## Live Links
- Live Website (GitHub Pages): [https://Era-UX.github.io/cars-project/](https://Era-UX.github.io/cars-project/)
- GitHub Repository: [https://github.com/Era-UX/cars-project](https://github.com/Era-UX/cars-project)

## Team Members & Work Division
- **Yerassyl Aldebayev:** Home page (**index.html**), Models & Showroom catalog (**models.html**), live search and autocomplete (**js/jquery-search.js**), persistent star ratings (**js/catalog.js**), interactive gallery (**js/gallery.js**), FAQ accordion (**js/accordion.js**), engine sound simulator (**js/sound.js**), newsletter modal (**js/popup.js**), and NHTSA Vehicle Registry API integration (**js/api.js**).
- **Temirlan Tatken:** Services & dual-mode booking wizard (**services.html**, **js/booking-wizard.js**), client authentication & profile dashboard (**profile.html**, **js/auth.js**), orders management page (**orders.html**, **js/orders.js**), About page (**about.html**), trilingual EN/RU/KZ switcher (**js/language.js**), live showroom clock (**js/datetime.js**), Open-Meteo Astana Weather API (**js/api.js**), and persistent Light/Dark theme system (**js/theme.js**).

## Pages & Key Features
1. **Home (index.html):** Hero showcase with Web Audio V8 engine sound simulation, scroll-triggered animated statistics counters, category quick-filter links, and a JS-validated newsletter subscription modal.
2. **Models (models.html):** 8 vehicles across 4 categories (Sedan, SUV, Electric, Sports), real-time search with autocomplete dropdown, toggleable star ratings persisted in localStorage, comparison table, keyboard-navigable gallery, searchable FAQ accordion with yellow text highlighting, and NHTSA partner brand registry lookup.
3. **Services (services.html):** Account-protected booking wizard supporting both Vehicle Financing Orders (with live 5% APR monthly payment calculator) and Free Test Drive Reservations, paired with live Astana weather conditions.
4. **Orders (orders.html):** Client-scoped dashboard displaying active vehicle orders and scheduled test drives saved in localStorage, with category filters and order cancellation.
5. **Profile (profile.html):** Client-side authentication simulation with Guest View, Sign Up, Log In, Log Out, stored account summary, and strict +7 (XXX) XXX-XX-XX phone masking.
6. **About (about.html):** Showroom details (Turan Ave 53, Astana), live digital clock, trilingual language switcher (English, Russian, Kazakh), clipboard copy buttons with toast notifications, and lazy-loaded team portraits.

## Technical Highlights
- **Pure JavaScript Form Validation:** All forms use novalidate with zero HTML5 validation attributes (no required, pattern, minlength, maxlength, or type="email"), enforcing custom RegExp rules for names, emails, password complexity, and Kazakhstan phone numbers.
- **Persistent Client State:** Theme preference (Day/Night mode), registered users, active login session, submitted orders, car ratings, and search queries are persisted via localStorage.
- **Keyless Public APIs (async/await + fetch):**
  - NHTSA vPIC Vehicle API for official manufacturer model verification.
  - Open-Meteo Weather API for real-time Astana showroom temperature, wind speed, and driving recommendations.

## Folder Structure
cars-project/
├── index.html
├── models.html
├── services.html
├── orders.html
├── profile.html
├── about.html
├── README.md
├── css/
│   └── style.css
├── js/
│   ├── accordion.js
│   ├── api.js
│   ├── auth.js
│   ├── booking-wizard.js
│   ├── catalog.js
│   ├── datetime.js
│   ├── gallery.js
│   ├── jquery-features.js
│   ├── jquery-search.js
│   ├── jquery-services.js
│   ├── jquery-ux.js
│   ├── language.js
│   ├── orders.js
│   ├── popup.js
│   ├── sound.js
│   └── theme.js
└── images/

## Running Locally
1. Clone the repository:
   git clone [https://github.com/Era-UX/cars-project.git](https://github.com/Era-UX/cars-project.git)
2. Open index.html in any modern web browser (or run via VS Code Live Server).
