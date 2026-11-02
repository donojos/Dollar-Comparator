// ---------------------------------------------------------------------------
// Data
//
// Companies use approximate yearly EBITDA from recent annual filings.
// Individuals use rough published estimates of annual earnings / wealth gain
// (individuals don't have EBITDA). All values in USD. Edit freely.
// ---------------------------------------------------------------------------

const AVERAGE_PERSON_INCOME = 83000; // Median U.S. household income (approx.)

const ENTITIES = [
  // Companies — approximate annual EBITDA
  { name: "Saudi Aramco", type: "company", annual: 220e9 },
  { name: "Apple", type: "company", annual: 135e9 },
  { name: "Alphabet (Google)", type: "company", annual: 130e9 },
  { name: "Microsoft", type: "company", annual: 145e9 },
  { name: "Amazon", type: "company", annual: 120e9 },
  { name: "NVIDIA", type: "company", annual: 95e9 },
  { name: "Meta (Facebook)", type: "company", annual: 90e9 },
  { name: "ExxonMobil", type: "company", annual: 75e9 },
  { name: "Walmart", type: "company", annual: 42e9 },
  { name: "Tesla", type: "company", annual: 13e9 },

  // Individuals — rough estimated annual earnings / wealth gain
  { name: "Elon Musk", type: "individual", annual: 60e9 },
  { name: "Mark Zuckerberg", type: "individual", annual: 40e9 },
  { name: "Jeff Bezos", type: "individual", annual: 30e9 },
  { name: "Warren Buffett", type: "individual", annual: 15e9 },
  { name: "Bernard Arnault", type: "individual", annual: 12e9 },
  { name: "Bill Gates", type: "individual", annual: 8e9 },
];

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

function formatBig(value) {
  if (value >= 1e12) return "$" + (value / 1e12).toFixed(2) + " trillion";
  if (value >= 1e9) return "$" + (value / 1e9).toFixed(2) + " billion";
  if (value >= 1e6) return "$" + (value / 1e6).toFixed(2) + " million";
  return "$" + value.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

function formatSmall(value) {
  if (value >= 0.01) {
    return "$" + value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  const cents = value * 100;
  if (cents >= 0.01) return cents.toFixed(2) + "¢";
  // Tiny fractions of a cent: express as "1/Nth of a cent"
  const denominator = Math.round(1 / cents);
  return "1/" + denominator.toLocaleString("en-US") + " of a cent";
}

function formatResult(value) {
  return value >= 1 ? formatBig(value) : formatSmall(value);
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

const entitySelect = document.getElementById("entity");
const entityInfo = document.getElementById("entity-info");
const directionSelect = document.getElementById("direction");
const amountInput = document.getElementById("amount");
const resultBox = document.getElementById("result");
const resultLabel = document.getElementById("result-label");
const resultValue = document.getElementById("result-value");
const resultNote = document.getElementById("result-note");

function populateEntities() {
  const companies = ENTITIES.filter((e) => e.type === "company");
  const individuals = ENTITIES.filter((e) => e.type === "individual");

  const companyGroup = document.createElement("optgroup");
  companyGroup.label = "Companies";
  companies.forEach((e) => {
    const opt = document.createElement("option");
    opt.value = e.name;
    opt.textContent = e.name;
    companyGroup.appendChild(opt);
  });

  const individualGroup = document.createElement("optgroup");
  individualGroup.label = "Individuals";
  individuals.forEach((e) => {
    const opt = document.createElement("option");
    opt.value = e.name;
    opt.textContent = e.name;
    individualGroup.appendChild(opt);
  });

  entitySelect.appendChild(companyGroup);
  entitySelect.appendChild(individualGroup);
}

function getSelectedEntity() {
  return ENTITIES.find((e) => e.name === entitySelect.value);
}

function update() {
  const entity = getSelectedEntity();
  const amount = parseFloat(amountInput.value);

  const basis =
    entity.type === "company"
      ? "yearly EBITDA of about " + formatBig(entity.annual)
      : "estimated annual earnings of about " + formatBig(entity.annual);
  entityInfo.textContent = entity.name + " — " + basis + ".";

  if (!isFinite(amount) || amount < 0) {
    resultBox.hidden = true;
    return;
  }

  const ratio = entity.annual / AVERAGE_PERSON_INCOME;

  if (directionSelect.value === "toPerson") {
    const equivalent = amount / ratio;
    resultLabel.textContent =
      formatResult(amount) + " to " + entity.name + " feels like";
    resultValue.textContent = formatResult(equivalent);
    resultNote.textContent =
      "to someone earning the median U.S. household income.";
  } else {
    const equivalent = amount * ratio;
    resultLabel.textContent =
      formatResult(amount) + " to an average person feels like";
    resultValue.textContent = formatResult(equivalent);
    resultNote.textContent = "to " + entity.name + ".";
  }

  resultBox.hidden = false;
}

populateEntities();
document.getElementById("baseline").textContent =
  "$" + AVERAGE_PERSON_INCOME.toLocaleString("en-US");

entitySelect.addEventListener("change", update);
directionSelect.addEventListener("change", update);
amountInput.addEventListener("input", update);

update();
