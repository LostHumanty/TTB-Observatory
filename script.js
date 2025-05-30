let allTalents = [];

fetch("talents.json")
  .then(res => res.json())
  .then(data => {
    allTalents = data;
    console.log("Talents loaded:", allTalents.length);
  })
  .catch(err => {
    console.error("Failed to load talents.json", err);
  });

function createRoundSelector(container, name) {
  for (let i = 1; i <= 5; i++) {
    const btn = document.createElement("div");
    btn.className = "round-button";
    btn.dataset.value = i;

    btn.addEventListener("click", () => {
      let current = parseInt(container.dataset.selected || 0);
      const selected = parseInt(btn.dataset.value);
      container.dataset.selected = (current === selected) ? 0 : selected;
      updateButtons(container, selected, current === selected);
    });

    container.appendChild(btn);
  }
}

function updateButtons(container, count, reset = false) {
  const buttons = container.querySelectorAll(".round-button");
  buttons.forEach((btn, idx) => {
    if (reset || idx + 1 > count) {
      btn.classList.remove("active");
    } else {
      btn.classList.add("active");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const destinySteps = document.querySelector('[data-name="destiny_steps"]');
  createRoundSelector(destinySteps, "destiny_steps");

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

  const skillsContainer = document.getElementById("skillsContainer");
  const column1 = document.createElement("div");
  const column2 = document.createElement("div");
  column1.classList.add("skills-column");
  column2.classList.add("skills-column");

  const categories = Object.entries(skillCategories);
  const half = Math.ceil(categories.length / 2);

  categories.forEach(([category, skills], index) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("skill-category");

    const title = document.createElement("h3");
    title.classList.add("collapsible");
    title.textContent = `${category} ▼`;

    const content = document.createElement("div");
    content.classList.add("category-content", "hidden");

    title.addEventListener("click", () => {
      content.classList.toggle("hidden");
      title.textContent = category + (content.classList.contains("hidden") ? " ▼" : " ▲");
    });

    skills.forEach(skill => {
      const skillDiv = document.createElement("div");
      skillDiv.classList.add("skill-selector");
      skillDiv.dataset.name = skill;

      const label = document.createElement("label");
      label.textContent = skill + ": ";
      skillDiv.appendChild(label);

      createRoundSelector(skillDiv, skill);
      content.appendChild(skillDiv);
    });

    wrapper.appendChild(title);
    wrapper.appendChild(content);
    if (index < half) column1.appendChild(wrapper);
    else column2.appendChild(wrapper);
  });

  skillsContainer.appendChild(column1);
  skillsContainer.appendChild(column2);
});

document.querySelectorAll('input[type="number"]').forEach(input => {
  input.addEventListener("wheel", function (e) {
    if (document.activeElement === input) {
      e.stopPropagation();
    }
  }, { passive: true });
});

function compare(a, op, b) {
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

  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  const formData = new FormData(e.target);
  const filters = Object.fromEntries(formData.entries());
  Object.keys(filters).forEach(k => filters[k] = Number(filters[k]));

  const destinySteps = parseInt(document.querySelector('[data-name="destiny_steps"]').dataset.selected || "0");
  const includeNoReq = document.querySelector('input[name="reqNoneOnly"]').checked;

  const selectedSkills = {};
  document.querySelectorAll(".skill-selector").forEach(skillDiv => {
    const name = skillDiv.dataset.name;
    const level = parseInt(skillDiv.dataset.selected || "0");
    if (level > 0) {
      selectedSkills[name.toLowerCase()] = level;
    }
  });

  const matched = allTalents.filter(talent => {
    if (!talent.requirements || talent.requirements.length === 0) {
      return includeNoReq;
    }

    return talent.requirements.every(req => {
      const { type, name, operator, value } = req;

      let compareValue;

      if (type === "attribute") {
        compareValue = filters[name] ?? 0;
      } else if (type === "destiny") {
        compareValue = destinySteps;
      } else if (type === "skill") {
        if (name === "any") {
          return Object.values(selectedSkills).some(val => compare(val, operator, value));
        } else {
          compareValue = selectedSkills[name.toLowerCase()] || 0;
        }
      } else {
        return false;
      }

      return compare(compareValue, operator, value);
    });
  });

  if (matched.length === 0) {
    resultsDiv.innerHTML = "<p>No matching talents found.</p>";
  } else {
    matched.forEach(t => {
      const div = document.createElement("div");
      div.classList.add("talent-block");
      div.innerHTML = `<strong>${t.name}</strong><p>${t.description}</p>`;
      resultsDiv.appendChild(div);
    });
  }
});
