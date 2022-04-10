var themeToggleDarkIcon = document.querySelectorAll(
  '[data-id="theme-toggle-dark-icon"]'
);
var themeToggleLightIcon = document.querySelectorAll(
  '[data-id="theme-toggle-light-icon"]'
);

console.log(themeToggleDarkIcon);

// Change the icons inside the button based on previous settings
if (
  localStorage.getItem("color-theme") === "dark" ||
  (!("color-theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  themeToggleLightIcon.forEach(function (element) {
    element.classList.remove("hidden");
  });
} else {
  themeToggleDarkIcon.forEach(function (element) {
    element.classList.remove("hidden");
  });
}

var themeToggleBtn = document.querySelectorAll('[data-id="theme-toggle"]');

themeToggleBtn.forEach(function (element) {
  element.addEventListener("click", function () {
    // toggle icons inside button
    themeToggleDarkIcon.forEach(function (element) {
      element.classList.toggle("hidden");
    });
    themeToggleLightIcon.forEach(function (element) {
      element.classList.toggle("hidden");
    });

    // if set via local storage previously
    if (localStorage.getItem("color-theme")) {
      if (localStorage.getItem("color-theme") === "light") {
        document.documentElement.classList.add("dark");
        localStorage.setItem("color-theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("color-theme", "light");
      }

      // if NOT set via local storage previously
    } else {
      if (document.documentElement.classList.contains("dark")) {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("color-theme", "light");
      } else {
        document.documentElement.classList.add("dark");
        localStorage.setItem("color-theme", "dark");
      }
    }
  });
});
