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
  column1.classList.add("skills-column");
  const column2 = document.createElement("div");
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

    if (index < half) {
      column1.appendChild(wrapper);
    } else {
      column2.appendChild(wrapper);
    }
  });

  skillsContainer.appendChild(column1);
  skillsContainer.appendChild(column2);
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


document.getElementById("filterForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const form = e.target;
  const results = document.getElementById("results");

  const formData = new FormData(form);
  const filters = Object.fromEntries(formData.entries());
  for (let key in filters) {
    filters[key] = Number(filters[key]);
  }

  const destinySteps = document.querySelector('.step-selector').dataset.selected;
  filters["destiny_steps"] = Number(destinySteps || 0);

  document.querySelectorAll(".skill-selector").forEach(div => {
    const name = div.dataset.name;
    const value = Number(div.dataset.selected || 0);
    if (value > 0) filters[name] = value;
  });

  const traits = Array.from(document.querySelectorAll('input[name="traits"]:checked')).map(i => i.value);
  filters["traits"] = traits;

  const matched = allTalents.filter(talent => {
    return talent.requirements.every(req => {
      if (req.type === "attribute") {
        const val = filters[req.name] ?? 0;
        return compare(val, req.operator, req.value);
      }
      if (req.type === "skill") {
        if (req.name === "any") {
          return Object.entries(filters).some(([key, val]) => {
            return skillCategoriesFlat.has(key) && compare(val, req.operator, req.value);
          });
        } else {
          const val = filters[req.name] ?? 0;
          return compare(val, req.operator, req.value);
        }
      }
      return true;
    });
  });

  if (matched.length === 0) {
    results.innerHTML = `<p>No matching talents found.</p>`;
  } else {
    results.innerHTML = matched.map(t =>
      `<div class="talent-block"><b>${t.name}</b><br><span>${t.description}</span></div>`
    ).join("");
  }
});

document.querySelectorAll('input[type="number"]').forEach(input => {
  input.addEventListener("wheel", function (e) {
    if (document.activeElement === input) {
      e.stopPropagation();
    }
  }, { passive: true });
});

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


const skillCategoriesFlat = new Set([
  "Bureaucracy", "Engineering", "History", "Literacy", "Mathematics", "Music",
  "Flexible", "Grappling", "Heavy Melee", "Martial Arts", "Melee", "Pneumatic", "Pugilism",
  "Alchemistry", "Art", "Artefacting", "Blacksmithing", "Culinary", "Explosives", "Homesteading", "Printing", "Stitching",
  "Doctor", "Forgery", "Gambling", "Husbandry", "Lockpicking", "Notice", "Track", "Wilderness",
  "Counter-Spelling", "Enchanting", "Necromancy", "Sorcery", "Prestidigitation",
  "Archery", "Heavy Guns", "Long Arms", "Pistol", "Shotgun", "Thrown Weapons",
  "Barter", "Bewitch", "Convince", "Deceive", "Intimidate", "Leadership", "Scrutiny",
  "Acrobatics", "Athletics", "Carouse", "Centering", "Evade", "Pickpocket", "Stealth", "Toughness"
]);

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
