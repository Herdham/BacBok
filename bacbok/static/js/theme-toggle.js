// Theme toggle helper: exposes toggleTheme() and initTheme()
(function () {
  function getStoredTheme() {
    try {
      return localStorage.getItem("bacbok_theme");
    } catch (e) {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem("bacbok_theme", theme);
    } catch (e) {}
  }

  function applyTheme(theme) {
    if (!theme) return;
    document.documentElement.setAttribute("data-theme", theme);
  }

  function detectSystemPref() {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches
    )
      return "light";
    return "dark";
  }

  function initTheme() {
    var stored = getStoredTheme();
    var theme = stored || "light"; // default to light when nothing stored
    applyTheme(theme);
    return theme;
  }

  function toggleTheme() {
    var cur = document.documentElement.getAttribute("data-theme") || "light";
    var next = cur === "light" ? "dark" : "light";
    applyTheme(next);
    storeTheme(next);
    // update any toggle UI
    var btn = document.getElementById("themeToggleBtn");
    if (btn) btn.setAttribute("aria-pressed", next === "dark");
    return next;
  }

  window.bacbokTheme = {
    initTheme: initTheme,
    toggleTheme: toggleTheme,
    applyTheme: applyTheme,
  };
})();
