let allTalents = [];
let currentRenderedTalents = [];
let lastRenderedTalents = [];
let originalRenderedTalents = [];


function renderTalents(list) {
  originalRenderedTalents = [...list];
  currentRenderedTalents = [...list];
  lastRenderedTalents = [...list];
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  list.forEach(t => {
    const div = document.createElement("div");
    div.classList.add("talent-block");
    div.innerHTML = `
      <strong class="talent-name">${t.name}</strong>
      ${t.displayedReqs ? `<p class="talent-req"><em>${formatTextWithSymbols(t.displayedReqs)}</em></p>` : ""}
      ${t.narative ? `<p class="talent-narrative">${formatTextWithSymbols(t.narative)}</p>` : ""}
      <p>${formatTextWithSymbols(t.description)}</p>
      ${t.book ? (() => {
        const [name, page] = t.book.split(" pg.");
        const url = bookLinks[name];
        return `<div class="talent-book">` +
          (url ? `<a href="${url}" target="_blank">${t.book}</a>` : `${t.book}`) +
          `</div>`;
      })() : ""}
      ${t.legacy ? `
        <button class="toggle-legacy">Show old version ▼</button>
        <div class="legacy-content hidden">
          ${t.legacy.displayedReqs ? `<p class="talent-req"><em>${formatTextWithSymbols(t.legacy.displayedReqs)}</em></p>` : ""}
          <p>${formatTextWithSymbols(t.legacy.description)}</p>
          ${t.legacy.book ? `<div class="talent-book">${t.legacy.book}</div>` : ""}
        </div>
      ` : ""}
    `;
    resultsDiv.appendChild(div);
  });

  document.querySelectorAll(".toggle-legacy").forEach(btn => {
    btn.addEventListener("click", () => {
      const legacy = btn.nextElementSibling;
      legacy.classList.toggle("hidden");
      btn.textContent = legacy.classList.contains("hidden")
        ? "Show old version ▼"
        : "Hide old version ▲";
    });
  });

  const searchBar = document.getElementById("searchBar");
  if (searchBar) searchBar.classList.remove("hidden");
}

if (!document.body.classList.contains("dark")) {
  document.body.classList.add("dark");
}

const themeToggleBtn = document.createElement("button");
themeToggleBtn.id = "themeToggleBtn";
themeToggleBtn.title = "Toggle theme";
themeToggleBtn.innerHTML = "🌙";
themeToggleBtn.style.position = "fixed";
themeToggleBtn.style.top = "10px";
themeToggleBtn.style.right = "10px";
themeToggleBtn.style.padding = "8px";
themeToggleBtn.style.borderRadius = "50%";
themeToggleBtn.style.border = "none";
themeToggleBtn.style.cursor = "pointer";
themeToggleBtn.style.zIndex = "1000";
themeToggleBtn.style.fontSize = "18px";
themeToggleBtn.style.backgroundColor = "var(--bg-button, #181a1b)";
themeToggleBtn.style.color = "var(--fg-button, #fff)";
document.body.appendChild(themeToggleBtn);

themeToggleBtn.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  themeToggleBtn.innerHTML = isDark ? "🌙" : "☀️";
  themeToggleBtn.style.backgroundColor = isDark ? "var(--bg-button, #181a1b)" : "var(--bg-button, #ffffff)";
});


const bookLinks = {
  "Core Book": "https://giveusyourmoneypleasethankyou-wyrd.com/collections/through-the-breach/products/through-the-breach-2nd-edition",
  "Into the Steam": "https://giveusyourmoneypleasethankyou-wyrd.com/collections/through-the-breach/products/into-the-steam",
  "Under Quarantine": "https://giveusyourmoneypleasethankyou-wyrd.com/collections/through-the-breach/products/under-quarantine",
  "Above the Law": "https://giveusyourmoneypleasethankyou-wyrd.com/collections/through-the-breach/products/above-the-law",
  "From Shadows": "https://giveusyourmoneypleasethankyou-wyrd.com/collections/through-the-breach/products/from-shadows",
  "From the Nightmares": "https://giveusyourmoneypleasethankyou-wyrd.com/collections/through-the-breach/products/from-nightmares",
  "Rules Update 1.2025": "https://static1.squarespace.com/static/54fe412ce4b0c449f7369857/t/6787d7391b29cf777f969608/1736955705681/Through-the-Breach_Rules-Update_1.2025.pdf",
  "Into the Bayou": "https://giveusyourmoneypleasethankyou-wyrd.com/collections/through-the-breach/products/into-the-bayou",
  "Onward": "https://giveusyourmoneypleasethankyou-wyrd.com/collections/through-the-breach/products/from-shadows-copy"
};


const skillCategories = {
  "Academic": ["Bureaucracy", "Engineering", "History", "Literacy", "Mathematics", "Music"],
  "Close Combat": ["Flexible", "Grappling", "Heavy Melee", "Martial Arts", "Melee", "Pneumatic", "Pugilism"],
  "Crafting": ["Alchemistry", "Art", "Artefacting", "Blacksmithing", "Culinary", "Explosives", "Homesteading", "Printing", "Stitching"],
  "Expertise": ["Doctor", "Forgery", "Gambling", "Husbandry", "Lockpicking", "Notice", "Track", "Wilderness"],
  "Magical": ["Counter-Spelling", "Enchanting", "Necromancy", "Sorcery", "Prestidigitation"],
  "Ranged Combat": ["Archery", "Heavy Guns", "Long Arms", "Pistol", "Shotgun", "Thrown Weapons"],
  "Social": ["Barter", "Bewitch", "Convince", "Deceive", "Intimidate", "Leadership", "Scrutiny"],
  "Training": ["Acrobatics", "Athletics", "Carouse", "Centering", "Evade", "Pickpocket", "Stealth", "Toughness"]
};

function formatTextWithSymbols(text) {
  const symbolMap = {
    '[r]': 'r', '[t]': 't', '[m]': 'm', '[C]': 'C', '[p]': 'p',
    '[a]': 'a', '[b]': 'b', '[l]': 'l', '[x]': 'x', '[+]': '+', '[-]': '-'
  };

  let formatted = text;

  Object.entries(symbolMap).forEach(([key, sym]) => {
    formatted = formatted.replace(new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), `<span class="malifaux-symbol">${sym}</span>`);
  });

  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
  formatted = formatted.replace(/\n/g, '<br>');
  formatted = formatted.replace(/_(.*?)_/g, '<u>$1</u>');

  return formatted;
}


fetch("talents.json")
  .then(res => res.json())
  .then(data => {
    allTalents = data;
    console.log("Talents loaded:", allTalents.length);
  });

function createRoundSelector(container) {
  for (let i = 1; i <= 5; i++) {
    const btn = document.createElement("div");
    btn.className = "round-button";
    btn.dataset.value = i;
    btn.addEventListener("click", () => {
      const current = parseInt(container.dataset.selected || 0);
      const selected = parseInt(btn.dataset.value);
      container.dataset.selected = (current === selected) ? 0 : selected;
      updateButtons(container, selected, current === selected);
    });
    container.appendChild(btn);
  }
}

function updateButtons(container, count, reset = false) {
  container.querySelectorAll(".round-button").forEach((btn, idx) => {
    btn.classList.toggle("active", !reset && idx + 1 <= count);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  createRoundSelector(document.querySelector('[data-name="destiny_steps"]'));

  const container = document.getElementById("skillsContainer");
  const [col1, col2] = [document.createElement("div"), document.createElement("div")];
  col1.classList.add("skills-column");
  col2.classList.add("skills-column");

  const entries = Object.entries(skillCategories);
  const half = Math.ceil(entries.length / 2);
  entries.forEach(([cat, skills], i) => {
    const box = document.createElement("div");
    box.classList.add("skill-category");

    const title = document.createElement("h3");
    title.classList.add("collapsible");
    title.textContent = `${cat} ▼`;

    const section = document.createElement("div");
    section.classList.add("category-content");
    title.onclick = () => {
      section.classList.toggle("hidden");
      title.textContent = `${cat} ${section.classList.contains("hidden") ? "▼" : "▲"}`;
    };

    skills.forEach(skill => {
      const div = document.createElement("div");
      div.classList.add("skill-selector");
      div.dataset.name = skill;
      const label = document.createElement("label");
      label.textContent = skill + ": ";
      div.appendChild(label);
      createRoundSelector(div);
      section.appendChild(div);
    });

    box.appendChild(title);
    box.appendChild(section);
    (i < half ? col1 : col2).appendChild(box);
  });

  document.getElementById("showNarrative").addEventListener("change", function () {
    document.body.classList.toggle("narrative-hidden", !this.checked);
    });

    container.appendChild(col1);
    container.appendChild(col2);

    const toggleSkillsBtn = document.getElementById("toggleSkills");
    const skillsTab = document.querySelector(".skills_tab");
    if (toggleSkillsBtn && skillsTab) {
      toggleSkillsBtn.addEventListener("click", () => {
        skillsTab.classList.toggle("hidden");
        toggleSkillsBtn.textContent = skillsTab.classList.contains("hidden")
          ? "Skills ▼"
          : "Skills ▲";
      });
    }

    const searchBar = document.getElementById("searchBar");
    const searchInput = document.getElementById("searchInput");
    const clearSearch = document.getElementById("clearSearch");

  searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();

    const filtered = originalRenderedTalents.filter(t =>
      t.name.toLowerCase().includes(term) ||
      (t.description && t.description.toLowerCase().includes(term)) ||
      (t.displayedReqs && t.displayedReqs.toLowerCase().includes(term)) ||
      (t.book && t.book.toLowerCase().includes(term))
    );

    currentRenderedTalents = filtered;
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    filtered.forEach(t => {
      const div = document.createElement("div");
      div.classList.add("talent-block");
      div.innerHTML = `
        <strong class="talent-name">${t.name}</strong>
        ${t.displayedReqs ? `<p class="talent-req"><em>${formatTextWithSymbols(t.displayedReqs)}</em></p>` : ""}
        ${t.narative ? `<p class="talent-narrative">${formatTextWithSymbols(t.narative)}</p>` : ""}
        <p>${formatTextWithSymbols(t.description)}</p>
        ${t.book ? (() => {
          const [name, page] = t.book.split(" pg.");
          const url = bookLinks[name];
          return `<div class="talent-book">` +
            (url ? `<a href="${url}" target="_blank">${t.book}</a>` : `${t.book}`) +
            `</div>`;
        })() : ""}
        ${t.legacy ? `
          <button class="toggle-legacy">Show old version ▼</button>
          <div class="legacy-content hidden">
            ${t.legacy.displayedReqs ? `<p class="talent-req"><em>${formatTextWithSymbols(t.legacy.displayedReqs)}</em></p>` : ""}
            <p>${formatTextWithSymbols(t.legacy.description)}</p>
            ${t.legacy.book ? `<div class="talent-book">${t.legacy.book}</div>` : ""}
          </div>
        ` : ""}
      `;
      resultsDiv.appendChild(div);
    });
  });


  clearSearch.addEventListener("click", () => {
    searchInput.value = "";
    renderTalents(originalRenderedTalents);
  });
});


document.querySelectorAll('input[type="number"]').forEach(input => {
  input.addEventListener("wheel", e => {
    if (document.activeElement === input) {
      e.preventDefault();
      const step = Number(input.step) || 1;
      const delta = e.deltaY < 0 ? 1 : -1;
      const value = Number(input.value) || 0;
      input.value = value + delta * step;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }, { passive: false });
});

document.getElementById("toggleRare").addEventListener("click", () => {
  const section = document.getElementById("rareRequirements");
  section.classList.toggle("hidden");
  document.getElementById("toggleRare").textContent = section.classList.contains("hidden")
    ? "Show rare requirements ▼"
    : "Hide rare requirements ▲";
});

function compare(a, op, b) {
  a = Number(a);
  b = Number(b);
  switch (op) {
    case ">=": return a >= b;
    case "<=": return a <= b;
    case ">": return a > b;
    case "<": return a < b;
    case "==": return a == b;
    default: return false;
  }
}

document.getElementById("filterForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const filters = Object.fromEntries([...formData.entries()].filter(([k]) => !k.endsWith("[]")));

  ["might", "grace", "speed", "resilience", "intellect", "charm", "cunning", "tenacity"].forEach(k => {
    filters[k] = parseInt(filters[k]) || 0;
  });

  const destinySteps = parseInt(document.querySelector('[data-name="destiny_steps"]').dataset.selected || "0");

  const selectedSkills = {};
  document.querySelectorAll(".skill-selector").forEach(div => {
    const level = parseInt(div.dataset.selected || "0");
    if (level > 0) selectedSkills[div.dataset.name.toLowerCase()] = level;
  });

  const selectedFlags = new Set([
    ...formData.getAll("traits"),
    ...formData.getAll("rare[]")
  ]);

  const includeNoReq = document.querySelector('input[name="reqNoneOnly"]').checked;

  const matched = allTalents.filter(talent => {
    const requirements = talent.requirements || [];
    if (requirements.length === 0) return includeNoReq;

    return requirements.every(req => {
      const { type, name, operator, value, category, or } = req;

      if (or && Array.isArray(or)) {
        return or.some(sub => evaluateRequirement(sub, filters, destinySteps, selectedSkills, selectedFlags));
      }

      return evaluateRequirement(req, filters, destinySteps, selectedSkills, selectedFlags);
    });
  });

  if (!matched.length) {
    document.getElementById("results").innerHTML = "<p>No matching talents found.</p>";
    document.getElementById("searchBar").classList.add("hidden");
  } else {
    renderTalents(matched);
  }
});


function evaluateRequirement(req, filters, destinySteps, selectedSkills, selectedFlags) {
  const { type, name, operator, value, category } = req;

  if (type === "attribute") {
    if (name === "Any" && req.count) {
      const aspectKeys = ["might", "grace", "speed", "resilience", "intellect", "charm", "cunning", "tenacity"];
      const matchCount = aspectKeys.reduce((acc, attr) => {
        const val = filters[attr] ?? 0;
        return acc + (compare(val, operator, value) ? 1 : 0);
      }, 0);
      return matchCount >= req.count;
    } else {
      return compare(filters[name.toLowerCase()] ?? 0, operator, value);
    }
  }

  if (type === "parameter") {
    const paramValue = parseInt(document.querySelector(`input[name="${name.toLowerCase()}"]`)?.value || "0");
    return compare(paramValue, operator, value);
  }

  if (type === "destiny") {
    return compare(destinySteps, operator, value);
  }

  if (type === "skill") {
    if (Array.isArray(category)) {
      const skillList = category.flatMap(cat => skillCategories[cat] || []).map(s => s.toLowerCase());
      return skillList.some(skill => selectedSkills[skill] && compare(selectedSkills[skill], operator, value));
    }

    if (Array.isArray(name)) {
      return name.some(skill => {
        const lvl = selectedSkills[skill.toLowerCase()] || 0;
        return compare(lvl, operator, value);
      });
    }

    if (name === "any") {
      return Object.values(selectedSkills).some(val => compare(val, operator, value));
    }

    return compare(selectedSkills[name.toLowerCase()] || 0, operator, value);
  }

  if (type === "custom") {
    if (name) {
      return selectedFlags.has(name.toLowerCase());
    }

    if (Array.isArray(req.values)) {
      return req.values.some(val => selectedFlags.has(val.toLowerCase()));
    }

    return false;
  }

  if (type === "number") {
    const input = document.querySelector(`input[name="${name}"]`);
    if (!input) return false;
    const val = parseInt(input.value) || 0;
    return compare(val, operator, value);
  }

  return false;
}

// Parameter calculation
document.getElementById("calculateParams")?.addEventListener("click", () => {
  const getAspect = name => parseInt(document.querySelector(`input[name="${name}"]`)?.value) || 0;
  const getSkill = name => parseInt(document.querySelector(`.skill-selector[data-name="${name}"]`)?.dataset.selected || 0);

  const evade = getSkill("Evade");
  const speed = getAspect("speed");
  const tenacity = getAspect("tenacity");
  const centering = getSkill("Centering");
  const resilience = getAspect("resilience");
  const toughness = getSkill("Toughness");
  const notice = getSkill("Notice");

  const df = 2 + Math.max(evade, speed);
  const wp = 2 + Math.max(centering, tenacity);
  const wk = 4 + Math.ceil(speed / 2);
  const ch = Math.max(4 + speed, 4 + speed);
  const wd = 4 + toughness + (resilience > 0 ? Math.ceil(resilience / 2) : 0);
  const init = speed + notice;

  document.querySelector(`input[name="df"]`).value = df;
  document.querySelector(`input[name="wp"]`).value = wp;
  document.querySelector(`input[name="wk"]`).value = wk;
  document.querySelector(`input[name="ch"]`).value = ch;
  document.querySelector(`input[name="wd"]`).value = wd;
  document.querySelector(`input[name="init"]`).value = init;
});

// Show all talents button
document.getElementById("showAllTalents")?.addEventListener("click", () => {
  renderTalents(allTalents);
});
