// language.js - Assignment 5 (About page):
// 1. Switch Statement for Language Selector (English, Russian, Kazakh)
// 2. Time-of-day dynamic greeting translated in all 3 languages
// 3. "Read More" button toggling visibility via style.display

document.addEventListener("DOMContentLoaded", function () {
    const langButtons = document.querySelectorAll(".lang-btn");
    const readMoreBtn = document.getElementById("read-more-btn");
    const extraStory = document.getElementById("extra-story");
    const timeGreeting = document.getElementById("time-greeting");

    let currentLang = "en";

    // Full Language Dictionary Objects
    const translations = {
        en: {
            morning: "Good Morning! Welcome to the AutoWorld Showroom.",
            afternoon: "Good Afternoon! Welcome to the AutoWorld Showroom.",
            evening: "Good Evening! Welcome to the AutoWorld Showroom.",
            title: "About AutoWorld",
            intro: "AutoWorld was founded with one simple goal: to connect passionate drivers with the cars of their dreams. We believe in quality, transparency, and top-tier customer service.",
            extraStory: "Since opening our first showroom in Astana, we have delivered over 1,500 inspected vehicles across Kazakhstan. Our certified technicians test every engine, battery pack, and safety system so our clients drive away with complete confidence.",
            readMore: "Read More About Our History",
            showLess: "Show Less",
            visitTitle: "Visit Our Showroom",
            visitHours: "Open Monday – Saturday: 9:00 AM – 7:00 PM",
            timeLabel: "Current Local Date & Time:",
            valuesTitle: "Our Core Values",
            val1Title: "Trust",
            val1Desc: "No hidden fees.",
            val2Title: "Quality",
            val2Desc: "Every car passes a 150-point inspection.",
            val3Title: "Innovation",
            val3Desc: "The latest EV and hybrid models.",
            teamTitle: "Meet Our Team",
            member1Role: "Frontend Developer & Designer",
            member1Bio: "Responsible for the Services and About pages. Loves classic muscle cars and clean code.",
            member2Role: "Frontend Developer",
            member2Bio: "Created the Home and Models pages. Enjoys Formula 1 racing and responsive web design."
        },
        ru: {
            morning: "Доброе утро! Добро пожаловать в автосалон AutoWorld.",
            afternoon: "Добрый день! Добро пожаловать в автосалон AutoWorld.",
            evening: "Добрый вечер! Добро пожаловать в автосалон AutoWorld.",
            title: "Об автосалоне AutoWorld",
            intro: "AutoWorld был основан с одной простой целью: соединить увлеченных водителей с автомобилями их мечты. Мы верим в качество, прозрачность и первоклассный сервис.",
            extraStory: "С момента открытия нашего первого шоурума в Астане мы передали клиентам более 1 500 проверенных автомобилей по всему Казахстану. Наши сертифицированные механики тестируют каждый двигатель, батарею и систему безопасности.",
            readMore: "Читать подробнее о нашей истории",
            showLess: "Скрыть",
            visitTitle: "Посетите наш автосалон",
            visitHours: "Открыто Пн – Сб: 9:00 – 19:00",
            timeLabel: "Местная дата и время:",
            valuesTitle: "Наши главные ценности",
            val1Title: "Доверие",
            val1Desc: "Никаких скрытых комиссий.",
            val2Title: "Качество",
            val2Desc: "Каждый автомобиль проходит проверку по 150 пунктам.",
            val3Title: "Инновации",
            val3Desc: "Новейшие электромобили и гибридные модели.",
            teamTitle: "Наша команда",
            member1Role: "Frontend-разработчик и дизайнер",
            member1Bio: "Отвечает за страницы услуг и информации о компании. Любит классические маслкары и чистый код.",
            member2Role: "Frontend-разработчик",
            member2Bio: "Создал главную страницу и каталог моделей. Увлекается Формулой-1 и адаптивным веб-дизайном."
        },
        kz: {
            morning: "Қайырлы таң! AutoWorld автосалонына қош келдіңіз.",
            afternoon: "Қайырлы күн! AutoWorld автосалонына қош келдіңіз.",
            evening: "Қайырлы кеш! AutoWorld автосалонына қош келдіңіз.",
            title: "AutoWorld автосалоны туралы",
            intro: "AutoWorld бір қарапайым мақсатпен құрылды: көлік сүйер қауымды арманындағы автокөліктермен қауыштыру. Біз сапаға, ашықтыққа және жоғары деңгейлі қызметке сенеміз.",
            extraStory: "Астанада алғашқы автосалонымыз ашылғаннан бері біз Қазақстан бойынша 1 500-ден астам тексерілген автокөлікті табыстадық. Біздің сертификатталған мамандар әрбір қозғалтқышты, батареяны және қауіпсіздік жүйесін мұқият тексереді.",
            readMore: "Біздің тарихымыз туралы толығырақ",
            showLess: "Жасыру",
            visitTitle: "Біздің автосалонға келіңіз",
            visitHours: "Дүйсенбі – Сенбі ашық: 9:00 – 19:00",
            timeLabel: "Жергілікті күн мен уақыт:",
            valuesTitle: "Біздің негізгі құндылықтарымыз",
            val1Title: "Сенім",
            val1Desc: "Ешқандай жасырын төлемдер жоқ.",
            val2Title: "Сапа",
            val2Desc: "Әрбір автокөлік 150 пункт бойынша тексеруден өтеді.",
            val3Title: "Инновация",
            val3Desc: "Ең заманауи электромобильдер мен гибридті модельдер.",
            teamTitle: "Біздің команда",
            member1Role: "Frontend-әзірлеуші және дизайнер",
            member1Bio: "Қызметтер және компания туралы беттерге жауапты. Классикалық спорттық көліктерді және таза кодты ұнатады.",
            member2Role: "Frontend-әзірлеуші",
            member2Bio: "Басты бет пен модельдер каталогын жасады. Формула-1 жарыстарына және адаптивті веб-дизайнға қызығады."
        }
    };

    // 1. Time of Day Greeting using a switch(true) statement
    function updateGreeting(pack) {
        if (!timeGreeting) return;
        const hour = new Date().getHours();

        switch (true) {
            case (hour >= 5 && hour < 12):
                timeGreeting.textContent = pack.morning;
                break;
            case (hour >= 12 && hour < 18):
                timeGreeting.textContent = pack.afternoon;
                break;
            default:
                timeGreeting.textContent = pack.evening;
                break;
        }
    }

    // Helper to update textContent safely by ID
    function setText(id, text) {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = text;
        }
    }

    // 2. Switch Statement applying the selected language pack
    function applyLanguage(langCode) {
        currentLang = langCode;
        let selectedPack;

        switch (langCode) {
            case "ru":
                selectedPack = translations.ru;
                break;
            case "kz":
                selectedPack = translations.kz;
                break;
            case "en":
            default:
                selectedPack = translations.en;
                break;
        }

        updateGreeting(selectedPack);

        setText("i18n-title", selectedPack.title);
        setText("i18n-intro", selectedPack.intro);
        setText("i18n-extra-story", selectedPack.extraStory);
        setText("i18n-visit-title", selectedPack.visitTitle);
        setText("i18n-visit-hours", selectedPack.visitHours);
        setText("i18n-time-label", selectedPack.timeLabel);
        setText("i18n-values-title", selectedPack.valuesTitle);
        setText("i18n-val1-title", selectedPack.val1Title);
        setText("i18n-val1-desc", selectedPack.val1Desc);
        setText("i18n-val2-title", selectedPack.val2Title);
        setText("i18n-val2-desc", selectedPack.val2Desc);
        setText("i18n-val3-title", selectedPack.val3Title);
        setText("i18n-val3-desc", selectedPack.val3Desc);
        setText("i18n-team-title", selectedPack.teamTitle);
        setText("i18n-member1-role", selectedPack.member1Role);
        setText("i18n-member1-bio", selectedPack.member1Bio);
        setText("i18n-member2-role", selectedPack.member2Role);
        setText("i18n-member2-bio", selectedPack.member2Bio);

        if (readMoreBtn && extraStory) {
            const isHidden = extraStory.style.display === "none" || extraStory.style.display === "";
            readMoreBtn.textContent = isHidden ? selectedPack.readMore : selectedPack.showLess;
        }
    }

    // 3. "Read More" button toggling style.display
    if (readMoreBtn && extraStory) {
        readMoreBtn.addEventListener("click", function () {
            const pack = translations[currentLang] || translations.en;
            if (extraStory.style.display === "none" || extraStory.style.display === "") {
                extraStory.style.display = "block";
                readMoreBtn.textContent = pack.showLess;
            } else {
                extraStory.style.display = "none";
                readMoreBtn.textContent = pack.readMore;
            }
        });
    }

    langButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            langButtons.forEach(function (b) {
                b.classList.remove("btn-danger");
                b.classList.add("btn-outline-danger");
            });
            btn.classList.remove("btn-outline-danger");
            btn.classList.add("btn-danger");

            const lang = btn.getAttribute("data-lang");
            applyLanguage(lang);
        });
    });

    // Initialize default English greeting on page load
    applyLanguage("en");
});