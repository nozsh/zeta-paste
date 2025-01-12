const THEMES = {
  DARK: "dark",
  LIGHT: "light",
} as const;

type Theme = (typeof THEMES)[keyof typeof THEMES];

// Utility
function getThemeControl(): HTMLInputElement | null {
  return document.getElementById("theme-control") as HTMLInputElement;
}

function setTheme(theme: Theme, save: boolean = true) {
  document.documentElement.setAttribute("data-theme", theme);

  document.documentElement.classList.replace(theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT, theme);

  if (save) localStorage.setItem("theme", theme);
}

function getSavedTheme(): Theme {
  return (localStorage.getItem("theme") as Theme) || THEMES.DARK;
}

// Init
function initializeTheme() {
  const savedTheme = getSavedTheme();
  setTheme(savedTheme, false);

  const themeControl = getThemeControl();
  if (themeControl) {
    themeControl.checked = savedTheme === THEMES.LIGHT;
  }
}

function toggleTheme() {
  const themeControl = getThemeControl();
  if (themeControl) {
    const newTheme = themeControl.checked ? THEMES.LIGHT : THEMES.DARK;
    setTheme(newTheme);
  }
}

// Event listeners
window.addEventListener("load", initializeTheme);

const themeControl = getThemeControl();
if (themeControl) {
  themeControl.addEventListener("change", toggleTheme);
}
