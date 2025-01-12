const about_page_lang_change = () => {
  // cfg
  const config = {
    defaultLanguage: "en" as const, // Default language
    languageKey: "lang", // Key for localStorage
    russianSuffix: "/ru", // Suffix for the RU version
  };

  type Language = "ru" | "en";

  // Utils
  const normalizePath = (path: string): string => (path.endsWith("/") ? path.slice(0, -1) : path);
  const getBasePath = (path: string): string => normalizePath(path).replace(config.russianSuffix, "");

  // Lang manage
  const setLanguage = (lang: Language): void => {
    localStorage.setItem(config.languageKey, lang);
    updateHtmlLangAttribute(lang);
    redirectToLanguagePage(lang);
  };

  const updateHtmlLangAttribute = (lang: Language): void => {
    document.documentElement.setAttribute("lang", lang);
  };

  const redirectToLanguagePage = (lang: Language): void => {
    const currentPage = normalizePath(window.location.pathname);
    const basePath = getBasePath(currentPage);
    const targetPage = lang === "ru" ? `${basePath}${config.russianSuffix}` : basePath;

    if (currentPage !== normalizePath(targetPage)) {
      window.location.href = targetPage;
    }
  };

  // Init
  const initializeLanguage = (): void => {
    const savedLang = localStorage.getItem(config.languageKey) as Language | null;
    const currentPage = normalizePath(window.location.pathname);
    const isRussianPage = currentPage.endsWith(config.russianSuffix);

    if (savedLang) {
      if (savedLang === "ru" && !isRussianPage) {
        redirectToLanguagePage("ru");
      } else if (savedLang === "en" && isRussianPage) {
        redirectToLanguagePage("en");
      }
      updateHtmlLangAttribute(savedLang);
    } else {
      const defaultLang = isRussianPage ? "ru" : config.defaultLanguage;
      updateHtmlLangAttribute(defaultLang);
    }
  };

  // Event listeners
  const setupEventListeners = (): void => {
    const langEnButton = document.getElementById("lang-en");
    const langRuButton = document.getElementById("lang-ru");

    langEnButton?.addEventListener("click", () => setLanguage("en"));
    langRuButton?.addEventListener("click", () => setLanguage("ru"));
  };

  // Start
  initializeLanguage();
  setupEventListeners();
};

about_page_lang_change();
