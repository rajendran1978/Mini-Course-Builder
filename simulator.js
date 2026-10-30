// Divider simulator: series (voltage divider) and parallel (current divider).
(function () {
  const root = document.getElementById("simulator");
  if (!root) return;

  const modes = {
    series: { label: "Supply voltage V", unit: "V", min: 1, max: 24, step: 0.5, supply: 8, r: [2150, 1000, 517] },
    parallel: { label: "Source current I<sub>S</sub>", unit: "mA", min: 1, max: 20, step: 0.5, supply: 10, r: [680, 330, 220] },
  };

  const supply = document.getElementById("sim-supply");
  const supplyLabel = document.getElementById("sim-supply-label");
  const supplyOut = document.getElementById("sim-supply-out");
  const rInputs = [1, 2, 3].map((n) => document.getElementById("sim-r" + n));
  const rOuts = [1, 2, 3].map((n) => document.getElementById("sim-r" + n + "-out"));
  const results = document.getElementById("sim-results");
  const modeInputs = root.querySelectorAll('input[name="sim-mode"]');

  function currentMode() {
    return root.querySelector('input[name="sim-mode"]:checked').value;
  }

  // Resistance as "517 Ω" or "2.15 kΩ".
  function fmtR(r) {
    if (r >= 1000) return +(r / 1000).toFixed(3) + " kΩ";
    return (Number.isInteger(r) ? r : r.toFixed(1)) + " Ω";
  }

  function load(mode) {
    const m = modes[mode];
    supplyLabel.innerHTML = m.label;
    supply.min = m.min;
    supply.max = m.max;
    supply.step = m.step;
    supply.value = m.supply;
    rInputs.forEach((input, i) => (input.value = m.r[i]));
    update();
  }

  function update() {
    const mode = currentMode();
    const unit = modes[mode].unit;
    const s = parseFloat(supply.value);
    const r = rInputs.map((input) => parseFloat(input.value));
    supplyOut.textContent = s + " " + unit;
    rOuts.forEach((out, i) => (out.textContent = fmtR(r[i])));

    let req, values, html;
    if (mode === "series") {
      req = r[0] + r[1] + r[2];
      values = r.map((x) => (x / req) * s);
      html = "<p>R<sub>eq</sub> = R<sub>1</sub> + R<sub>2</sub> + R<sub>3</sub> = " +
        r.map(fmtR).join(" + ") + " = <strong>" + fmtR(req) + "</strong></p>";
    } else {
      req = 1 / (1 / r[0] + 1 / r[1] + 1 / r[2]);
      values = r.map((x) => (req / x) * s);
      html = "<p>R<sub>eq</sub> = 1 / (1/R<sub>1</sub> + 1/R<sub>2</sub> + 1/R<sub>3</sub>) = <strong>" +
        fmtR(req) + "</strong></p>";
    }

    values.forEach((v, i) => {
      const n = i + 1;
      const share = (v / s) * 100;
      const formula = mode === "series"
        ? "V<sub>" + n + "</sub> = (R<sub>" + n + "</sub> / R<sub>eq</sub>) × V = (" +
          fmtR(r[i]) + " / " + fmtR(req) + ") × " + s + " V"
        : "I<sub>" + n + "</sub> = (R<sub>eq</sub> / R<sub>" + n + "</sub>) × I<sub>S</sub> = (" +
          fmtR(req) + " / " + fmtR(r[i]) + ") × " + s + " mA";
      html += "<p>" + formula + " = <strong>" + v.toFixed(2) + " " + unit + "</strong> (" +
        share.toFixed(0) + "% of the supply)</p>" +
        '<div class="bar"><span style="width:' + share.toFixed(1) + '%"></span></div>';
    });

    const sum = values.reduce((a, b) => a + b, 0);
    const law = mode === "series" ? "KVL" : "KCL";
    const name = mode === "series" ? "V" : "I";
    html += "<p><strong>" + law + " check:</strong> " + name + "<sub>1</sub> + " + name + "<sub>2</sub> + " +
      name + "<sub>3</sub> = " + values.map((v) => v.toFixed(2)).join(" + ") + " = " +
      sum.toFixed(2) + " " + unit + ", the supply (" + s + " " + unit + ").</p>";
    results.innerHTML = html;
  }

  modeInputs.forEach((input) => input.addEventListener("change", () => load(currentMode())));
  [supply].concat(rInputs).forEach((input) => input.addEventListener("input", update));
  document.getElementById("sim-reset").addEventListener("click", () => load(currentMode()));

  load("series");
})();
