const search = document.querySelector("#client-search");
const cards = [...document.querySelectorAll(".client-card")];
const count = document.querySelector("#client-count");
const empty = document.querySelector("#empty-state");

function filterClients() {
  const query = search.value.trim().toLowerCase();
  let visible = 0;
  cards.forEach(card => {
    const matches = card.dataset.name.toLowerCase().includes(query);
    card.hidden = !matches;
    if (matches) visible++;
  });
  count.textContent = String(visible).padStart(2, "0");
  empty.hidden = visible !== 0;
}
search.addEventListener("input", filterClients);
document.addEventListener("keydown", event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    search.focus();
  }
  if (event.key === "Escape" && document.activeElement === search) {
    search.value = "";
    filterClients();
    search.blur();
  }
});
document.querySelector("#year").textContent = new Date().getFullYear();
