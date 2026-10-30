// Theme toggle: light by default, remembered between visits.
const root = document.documentElement;
const themeButton = document.getElementById("theme-toggle");

function setTheme(theme) {
  root.dataset.theme = theme;
  themeButton.textContent =
    theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
  try {
    localStorage.setItem("theme", theme);
  } catch (e) {
    // Storage may be blocked; the theme still works for this visit.
  }
}

let savedTheme = "light";
try {
  savedTheme = localStorage.getItem("theme") === "dark" ? "dark" : "light";
} catch (e) {
  // Ignore and keep the light default.
}
setTheme(savedTheme);

themeButton.addEventListener("click", () => {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

// Lessons: show one section at a time. Without JavaScript, all stay visible.
const lessons = Array.from(document.querySelectorAll(".lesson"));
const navLinks = Array.from(document.querySelectorAll("#lesson-nav a"));
const controls = document.getElementById("lesson-controls");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const position = document.getElementById("position");

function showLesson(index, moveFocus) {
  lessons.forEach((lesson, i) => {
    lesson.hidden = i !== index;
  });
  navLinks.forEach((link, i) => {
    if (i === index) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });
  prevButton.disabled = index === 0;
  nextButton.disabled = index === lessons.length - 1;
  position.textContent = "Lesson " + (index + 1) + " of " + lessons.length;
  history.replaceState(null, "", "#" + lessons[index].id);
  if (moveFocus) {
    const heading = lessons[index].querySelector("h2");
    heading.tabIndex = -1;
    heading.focus();
    heading.scrollIntoView();
  }
}

function indexFromHash() {
  const index = lessons.findIndex((l) => "#" + l.id === location.hash);
  return index === -1 ? 0 : index;
}

navLinks.forEach((link, i) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showLesson(i, true);
  });
});

prevButton.addEventListener("click", () => {
  showLesson(Math.max(0, indexFromHash() - 1), true);
});

nextButton.addEventListener("click", () => {
  showLesson(Math.min(lessons.length - 1, indexFromHash() + 1), true);
});

controls.hidden = false;
showLesson(indexFromHash(), false);
