/* ============ Speakers page: grid, track filter, search ============ */

const speakerState = { track: "all", search: "" };

function renderSpeakers() {
  const grid = document.getElementById("speakerGrid");
  if (!grid) return;
  const q = speakerState.search.toLowerCase();
  const list = SPEAKERS.filter(function (s) {
    const trackOk = speakerState.track === "all" || s.track === speakerState.track;
    const searchOk = !q || (s.name + " " + s.company + " " + s.role + " " + s.talk).toLowerCase().indexOf(q) !== -1;
    return trackOk && searchOk;
  });
  document.getElementById("speakerCount").textContent =
    list.length + (list.length === 1 ? " speaker" : " speakers");
  grid.innerHTML = list.length
    ? list.map(speakerCardHTML).join("")
    : '<div class="empty-state" style="grid-column:1/-1"><h3>No speakers match that search</h3></div>';
  observeReveals();
}

document.addEventListener("DOMContentLoaded", function () {
  const grid = document.getElementById("speakerGrid");
  if (!grid) return;

  const tracks = [];
  SPEAKERS.forEach(function (s) { if (tracks.indexOf(s.track) === -1) tracks.push(s.track); });

  const chipRow = document.getElementById("trackChips");
  chipRow.innerHTML =
    '<button class="chip is-active" type="button" data-track="all">All tracks</button>' +
    tracks.map(function (t) { return '<button class="chip" type="button" data-track="' + t + '">' + t + "</button>"; }).join("");
  chipRow.addEventListener("click", function (e) {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    speakerState.track = chip.getAttribute("data-track");
    chipRow.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("is-active"); });
    chip.classList.add("is-active");
    renderSpeakers();
  });

  document.getElementById("speakerSearch").addEventListener("input", debounce(function (e) {
    speakerState.search = e.target.value.trim();
    renderSpeakers();
  }, 220));

  renderSpeakers();
});
