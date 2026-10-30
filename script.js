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

// Quizzes: two multiple-choice questions at the end of each lesson.
// Text is trusted, hard-coded HTML (it uses <sub> for subscripts).
const quizzes = [
  [
    { q: "What is a node?", options: ["A single component such as a resistor", "A point where wires meet", "A closed path for current", "The battery in a circuit"], answer: 1, why: "A node is a junction where wires meet. Components sit in the branches between nodes." },
    { q: "Which description fits a loop?", options: ["A closed path that ends where it started", "Any single wire", "A path that stops at a resistor", "The point where three wires join"], answer: 0, why: "A loop is a closed path, so current can circulate around it." },
  ],
  [
    { q: "A lamp turns electrical energy into light and heat. What happens to the total amount of energy?", options: ["It decreases", "It increases", "It stays the same", "It disappears as light"], answer: 2, why: "Energy changes form but the total stays the same." },
    { q: "Which statement is true?", options: ["A battery creates energy from nothing", "Energy can be destroyed by a resistor", "Energy can only change form, never be created or destroyed"], answer: 2, why: "This idea is what makes Kirchhoff's Voltage Law work." },
  ],
  [
    { q: "10 mA flows into a node. 4 mA leaves through one branch and 2 mA through another. How much leaves through the third branch?", options: ["2 mA", "4 mA", "6 mA", "16 mA"], answer: 1, why: "10 = 4 + 2 + I, so I = 4 mA." },
    { q: "KCL is based on the conservation of which quantity?", options: ["Energy", "Resistance", "Voltage", "Charge"], answer: 3, why: "No charge is lost at a node, so current in equals current out." },
  ],
  [
    { q: "Three resistors of 100 Ω, 200 Ω and 400 Ω are in parallel. Which carries the most current?", options: ["100 Ω", "200 Ω", "400 Ω", "They all carry the same"], answer: 0, why: "The smallest resistance gets the biggest share of the current." },
    { q: "In a parallel circuit, what is the same across every branch?", options: ["Current", "Voltage", "Resistance", "Power"], answer: 1, why: "Every branch is connected across the same two points." },
  ],
  [
    { q: "In the example, why does the 220 Ω resistor carry more current than the 680 Ω resistor?", options: ["It is closer to the battery", "It has less resistance", "It is connected first", "It has more voltage across it"], answer: 1, why: "All branches have the same voltage, so less resistance means more current." },
    { q: "Two equal 100 Ω resistors are in parallel, so R<sub>eq</sub> = 50 Ω, and I<sub>S</sub> = 6 mA. What is the current through one resistor?", options: ["1.5 mA", "3 mA", "6 mA", "12 mA"], answer: 1, why: "I = (50 / 100) × 6 mA = 3 mA, half of the source current each." },
  ],
  [
    { q: "Two parallel resistors R<sub>1</sub> = 2 kΩ and R<sub>2</sub> = 6 kΩ share I = 8 mA. What is I<sub>1</sub>?", options: ["2 mA", "4 mA", "6 mA", "8 mA"], answer: 2, why: "I<sub>1</sub> = 8 × 6 / (2 + 6) = 6 mA." },
    { q: "Can you use the two-branch shortcut directly on a circuit with three parallel resistors?", options: ["Yes, always", "No, simplify two resistors at a time first", "Only if all three are equal"], answer: 1, why: "The shortcut only works for exactly two parallel resistors." },
  ],
  [
    { q: "What do the voltages around any closed loop add up to?", options: ["The source voltage", "The largest voltage drop", "Zero", "The total resistance"], answer: 2, why: "Rises and drops cancel, a result of conservation of energy." },
    { q: "A 12 V source drives two series resistors. One drops 5 V. What does the other drop?", options: ["5 V", "7 V", "12 V", "17 V"], answer: 1, why: "The drops must add up to the source: 12 = 5 + V." },
  ],
  [
    { q: "A 12 V source drives 1 kΩ, 2 kΩ and 3 kΩ resistors in series. What is the voltage across the 3 kΩ resistor?", options: ["2 V", "3 V", "6 V", "12 V"], answer: 2, why: "V = (3 / 6) × 12 V = 6 V." },
    { q: "In a series circuit, which resistor gets the biggest share of the voltage?", options: ["The first one", "The one with the largest resistance", "The one nearest the battery"], answer: 1, why: "V<sub>x</sub> = (R<sub>x</sub> / R<sub>eq</sub>) × V, so a bigger R<sub>x</sub> gives a bigger share." },
  ],
  [
    { q: "With R<sub>1</sub> = 1 kΩ, R<sub>2</sub> = 2 kΩ, R<sub>3</sub> = 3 kΩ and V = 12 V, what is the voltage across R<sub>2</sub>?", options: ["2 V", "4 V", "6 V", "8 V"], answer: 1, why: "V<sub>23</sub> = 12 × 2 / (1 + 2 + 3) = 4 V." },
    { q: "How is the voltage across R<sub>2</sub> found from the voltages at its two ends?", options: ["V<sub>2</sub> + V<sub>3</sub>", "V<sub>2</sub> − V<sub>3</sub>", "V<sub>2</sub> × V<sub>3</sub>", "V<sub>3</sub> − V"], answer: 1, why: "The voltage across a component is the difference between the voltages at its ends." },
  ],
  [
    { q: "In the example, V<sub>AB</sub> = 4.69 V and V<sub>BC</sub> = 2.18 V with an 8 V battery. Using KVL, what is V<sub>CD</sub>?", options: ["1.13 V", "2.18 V", "3.31 V", "6.87 V"], answer: 0, why: "8 − 4.69 − 2.18 = 1.13 V." },
    { q: "Why is V<sub>AB</sub> the largest of the three voltages?", options: ["R<sub>AB</sub> has the largest resistance", "It is closest to the battery", "It is measured first"], answer: 0, why: "In a series circuit the biggest resistor takes the biggest share." },
  ],
];

function buildQuestion(question, lessonNumber, questionNumber) {
  const fieldset = document.createElement("fieldset");
  const legend = document.createElement("legend");
  legend.innerHTML = "Question " + questionNumber + ": " + question.q;
  fieldset.appendChild(legend);

  const feedback = document.createElement("p");
  feedback.setAttribute("role", "status");
  const optionButtons = [];

  question.options.forEach((text, i) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option";
    button.innerHTML = text;
    button.addEventListener("click", () => {
      optionButtons.forEach((b, j) => {
        b.disabled = true;
        if (j === question.answer) b.classList.add("correct");
      });
      if (i !== question.answer) button.classList.add("wrong");
      const verdict =
        i === question.answer
          ? "Correct."
          : "Not quite. The correct answer is: " + question.options[question.answer] + ".";
      feedback.innerHTML = "<strong>" + verdict + "</strong> " + question.why;
    });
    optionButtons.push(button);
    fieldset.appendChild(button);
  });

  fieldset.appendChild(feedback);
  return fieldset;
}

lessons.forEach((lesson, i) => {
  const quiz = document.createElement("div");
  quiz.className = "quiz";
  const heading = document.createElement("h3");
  heading.textContent = "Quick quiz";
  quiz.appendChild(heading);
  quizzes[i].forEach((question, n) => {
    quiz.appendChild(buildQuestion(question, i + 1, n + 1));
  });
  lesson.appendChild(quiz);
});
