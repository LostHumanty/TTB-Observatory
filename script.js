let talents = [];

fetch("talents.json")
  .then(response => response.json())
  .then(data => {
    talents = data;
  })
  .catch(err => {
    console.error("Ошибка загрузки talents.json", err);
  });

document.getElementById("filterForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const filters = Object.fromEntries(formData.entries());
  Object.keys(filters).forEach(k => filters[k] = Number(filters[k]));

  const matched = talents.filter(talent => {
    return talent.requirements.every(req => {
      const userValue = filters[req.name] ?? 0;
      switch (req.operator) {
        case ">=": return userValue >= req.value;
        case "<=": return userValue <= req.value;
        case ">": return userValue > req.value;
        case "<": return userValue < req.value;
        case "==": return userValue == req.value;
        default: return false;
      }
    });
  });

  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = matched.length
    ? matched.map(t => `<div><b>${t.name}</b>: ${t.description}</div>`).join("")
    : "<p>Нет подходящих талантов.</p>";
});
