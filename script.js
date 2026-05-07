// ===== DATA =====
const DESTINATIONS = [
  { name: "Bali, Indonesia", desc: "Tropical paradise with ancient temples, rice terraces, and stunning beaches.", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=250&fit=crop", price: "$80/day", rating: "4.9", category: "beach" },
  { name: "Paris, France", desc: "The City of Light offers world-class art, cuisine, and iconic landmarks.", img: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=250&fit=crop", price: "$150/day", rating: "4.8", category: "culture" },
  { name: "Kyoto, Japan", desc: "Ancient capital with thousands of shrines, bamboo groves, and tea houses.", img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=250&fit=crop", price: "$120/day", rating: "4.9", category: "culture" },
  { name: "Santorini, Greece", desc: "Whitewashed villages perched on cliffs above a deep blue caldera.", img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=250&fit=crop", price: "$130/day", rating: "4.7", category: "romantic" },
  { name: "Machu Picchu, Peru", desc: "The lost city of the Incas, set high in the Andes Mountains.", img: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=400&h=250&fit=crop", price: "$90/day", rating: "4.9", category: "adventure" },
  { name: "Reykjavik, Iceland", desc: "Gateway to Northern Lights, geysers, waterfalls, and volcanic landscapes.", img: "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=400&h=250&fit=crop", price: "$160/day", rating: "4.6", category: "nature" },
  { name: "Marrakech, Morocco", desc: "Vibrant souks, stunning palaces, and rich culinary traditions.", img: "https://images.unsplash.com/photo-1597211833712-5e41faa202ea?w=400&h=250&fit=crop", price: "$60/day", rating: "4.5", category: "food" },
  { name: "New York, USA", desc: "The city that never sleeps — iconic skyline, Broadway, and Central Park.", img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=250&fit=crop", price: "$200/day", rating: "4.7", category: "city" }
];

const CATEGORY_ICONS = {
  adventure: "🏔️", beach: "🏖️", culture: "🏛️",
  food: "🍜", nature: "🌿", city: "🏙️", romantic: "💕"
};

// ===== STATE =====
let itinerary = JSON.parse(localStorage.getItem("wanderlust_itinerary") || "[]");

// ===== DOM =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ===== NAVBAR SCROLL =====
window.addEventListener("scroll", () => {
  $("#navbar").classList.toggle("scrolled", window.scrollY > 50);
  // Active section
  const sections = ["hero", "destinations", "planner", "itinerary"];
  for (const id of sections.reverse()) {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 200) {
      $$(".nav-link").forEach(l => l.classList.remove("active"));
      const link = $(`.nav-link[href="#${id}"]`);
      if (link) link.classList.add("active");
      break;
    }
  }
});

// ===== STAT COUNTER ANIMATION =====
function animateCounters() {
  $$(".stat-number").forEach(el => {
    const target = +el.dataset.count;
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current);
    }, 25);
  });
}

// Intersection observer for stats
const statsObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { animateCounters(); statsObs.disconnect(); } });
}, { threshold: 0.5 });
const statsEl = $(".hero-stats");
if (statsEl) statsObs.observe(statsEl);

// ===== RENDER DESTINATIONS =====
function renderDestinations() {
  const grid = $("#destinationsGrid");
  grid.innerHTML = DESTINATIONS.map((d, i) => `
    <div class="dest-card" style="animation-delay:${i * 0.1}s">
      <div class="dest-card-img-wrap">
        <img class="dest-card-img" src="${d.img}" alt="${d.name}" loading="lazy">
        <span class="dest-card-badge">${CATEGORY_ICONS[d.category]} ${d.category}</span>
      </div>
      <div class="dest-card-body">
        <h3>${d.name}</h3>
        <p>${d.desc}</p>
        <div class="dest-card-meta">
          <span><i class="fas fa-star" style="color:#fbbf24"></i> ${d.rating}</span>
          <span class="dest-card-price">${d.price}</span>
          <button class="dest-card-add" data-idx="${i}"><i class="fas fa-plus"></i> Quick Add</button>
        </div>
      </div>
    </div>
  `).join("");

  // Quick add buttons
  $$(".dest-card-add").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const d = DESTINATIONS[btn.dataset.idx];
      $("#destinationName").value = d.name;
      $("#category").value = d.category;
      const today = new Date();
      const end = new Date(today);
      end.setDate(end.getDate() + 3);
      $("#startDate").value = today.toISOString().split("T")[0];
      $("#endDate").value = end.toISOString().split("T")[0];
      document.getElementById("planner").scrollIntoView({ behavior: "smooth" });
      toast("Destination loaded! Fill in the details and add to itinerary.", "info");
    });
  });
}

// ===== FORM HANDLING =====
$("#tripForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("#destinationName").value.trim();
  const start = $("#startDate").value;
  const end = $("#endDate").value;
  const category = $("#category").value;
  const budget = +$("#budget").value || 0;
  const activities = $("#activities").value.trim().split("\n").filter(a => a.trim());
  const notes = $("#notes").value.trim();

  if (!name || !start || !end) return toast("Please fill in all required fields.", "error");
  if (new Date(end) < new Date(start)) return toast("End date must be after start date.", "error");

  const days = Math.ceil((new Date(end) - new Date(start)) / 86400000) + 1;

  itinerary.push({ id: Date.now(), name, start, end, days, category, budget, activities, notes });
  itinerary.sort((a, b) => new Date(a.start) - new Date(b.start));
  save();
  renderAll();
  e.target.reset();
  toast(`${name} added to your itinerary!`, "success");
});

// ===== RENDER MINI TIMELINE =====
function renderMiniTimeline() {
  const el = $("#miniTimeline");
  if (!itinerary.length) {
    el.innerHTML = `<div class="empty-state" id="emptyState"><div class="empty-icon"><i class="fas fa-map-location-dot"></i></div><p>Your journey starts here!</p><span>Add your first destination to begin planning</span></div>`;
    return;
  }
  el.innerHTML = itinerary.map((s, i) => `
    <div class="mini-stop">
      <div class="mini-stop-num">${i + 1}</div>
      <div class="mini-stop-info">
        <h4>${CATEGORY_ICONS[s.category] || ""} ${s.name}</h4>
        <p>${formatDate(s.start)} — ${formatDate(s.end)} · ${s.days} days</p>
      </div>
      <button class="mini-stop-remove" data-id="${s.id}" title="Remove"><i class="fas fa-xmark"></i></button>
    </div>
  `).join("");

  $$(".mini-stop-remove").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = +btn.dataset.id;
      const stop = itinerary.find(s => s.id === id);
      itinerary = itinerary.filter(s => s.id !== id);
      save(); renderAll();
      toast(`${stop?.name || "Stop"} removed.`, "info");
    });
  });
}

// ===== RENDER TIMELINE =====
function renderTimeline() {
  const el = $("#timeline");
  if (!itinerary.length) {
    el.innerHTML = `<div class="timeline-empty" id="timelineEmpty"><div class="timeline-empty-icon"><i class="fas fa-earth-americas"></i></div><h3>No Destinations Yet</h3><p>Start building your dream trip by adding destinations above</p><a href="#planner" class="btn btn-primary"><i class="fas fa-plus"></i> Add First Destination</a></div>`;
    return;
  }
  el.innerHTML = itinerary.map((s, i) => `
    <div class="timeline-item" style="animation-delay:${i * 0.15}s">
      <div class="timeline-dot ${s.category}">${i + 1}</div>
      <div class="timeline-card">
        <div class="timeline-card-header">
          <div class="timeline-card-title">
            <h3>${CATEGORY_ICONS[s.category] || ""} ${s.name}</h3>
            <span>Stop ${i + 1} of ${itinerary.length}</span>
          </div>
          <div class="timeline-card-dates">
            <div class="date-range">${formatDate(s.start)} — ${formatDate(s.end)}</div>
            <div class="duration">${s.days} day${s.days > 1 ? "s" : ""}</div>
          </div>
        </div>
        <div class="timeline-card-body">
          ${s.activities.length ? `
            <div class="timeline-activities">
              <h4><i class="fas fa-list-check"></i> Activities</h4>
              <div class="activity-list">
                ${s.activities.map((a, ai) => `<div class="activity-item" data-stop="${s.id}" data-ai="${ai}"><i class="fas fa-circle-dot"></i> ${a}</div>`).join("")}
              </div>
            </div>
          ` : ""}
          ${s.notes ? `<div class="timeline-notes"><strong>Notes:</strong> ${s.notes}</div>` : ""}
        </div>
        <div class="timeline-card-footer">
          <span class="timeline-budget"><i class="fas fa-wallet"></i> $${(s.budget * s.days).toLocaleString()} total</span>
          <span class="timeline-category">${CATEGORY_ICONS[s.category]} ${s.category}</span>
        </div>
      </div>
    </div>
  `).join("");

  // Toggle activity checked
  $$(".activity-item").forEach(item => {
    item.addEventListener("click", () => item.classList.toggle("checked"));
  });
}

// ===== SUMMARY =====
function updateSummary() {
  $("#totalStops").textContent = itinerary.length;
  const totalDays = itinerary.reduce((s, i) => s + i.days, 0);
  $("#totalDays").textContent = totalDays;
  const totalBudget = itinerary.reduce((s, i) => s + i.budget * i.days, 0);
  $("#totalBudget").textContent = "$" + totalBudget.toLocaleString();
}

// ===== HELPERS =====
function formatDate(d) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function save() { localStorage.setItem("wanderlust_itinerary", JSON.stringify(itinerary)); }
function renderAll() { renderMiniTimeline(); renderTimeline(); updateSummary(); }

// ===== TOAST =====
function toast(msg, type = "info") {
  const icons = { success: "fa-check-circle", error: "fa-exclamation-circle", info: "fa-info-circle" };
  const t = document.createElement("div");
  t.className = `toast ${type}`;
  t.innerHTML = `<i class="fas ${icons[type]}"></i><span>${msg}</span>`;
  $("#toastContainer").appendChild(t);
  setTimeout(() => { t.style.animation = "toastOut .4s ease forwards"; setTimeout(() => t.remove(), 400); }, 3000);
}

// ===== CLEAR & EXPORT =====
$("#clearAllBtn").addEventListener("click", () => {
  if (!itinerary.length) return;
  if (confirm("Clear all destinations from your itinerary?")) {
    itinerary = []; save(); renderAll();
    toast("Itinerary cleared.", "info");
  }
});

$("#exportBtn").addEventListener("click", () => {
  if (!itinerary.length) return toast("Nothing to export yet!", "error");
  let text = "✈️ WANDERLUST TRAVEL ITINERARY\n" + "=".repeat(40) + "\n\n";
  itinerary.forEach((s, i) => {
    text += `📍 Stop ${i + 1}: ${s.name}\n`;
    text += `   📅 ${s.start} to ${s.end} (${s.days} days)\n`;
    text += `   🏷️ ${s.category} | 💰 $${s.budget}/day ($${s.budget * s.days} total)\n`;
    if (s.activities.length) { text += `   📋 Activities:\n`; s.activities.forEach(a => text += `      • ${a}\n`); }
    if (s.notes) text += `   📝 ${s.notes}\n`;
    text += "\n";
  });
  const totalBudget = itinerary.reduce((sum, s) => sum + s.budget * s.days, 0);
  const totalDays = itinerary.reduce((sum, s) => sum + s.days, 0);
  text += "=".repeat(40) + `\nTotal: ${itinerary.length} stops · ${totalDays} days · $${totalBudget}\n`;

  const blob = new Blob([text], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "wanderlust-itinerary.txt";
  a.click();
  toast("Itinerary exported!", "success");
});

// ===== NAV CTA =====
$("#startPlanningBtn").addEventListener("click", () => {
  document.getElementById("planner").scrollIntoView({ behavior: "smooth" });
});

// ===== SMOOTH SCROLL FOR ALL ANCHORS =====
$$('a[href^="#"]').forEach(a => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});

// ===== INIT =====
renderDestinations();
renderAll();
