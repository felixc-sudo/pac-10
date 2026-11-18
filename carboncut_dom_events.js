// CARBONCUT DOM Event Handlers: Interactive Form Validation, Dropdown Menu, Modal & CRUD Array

// --- 1. DROPDOWN MENU (Modify DOM elements to toggle menu visibility) ---
const dropToggleBtn = document.getElementById("dropToggleBtn");
const dropMenuList = document.getElementById("dropMenuList");

dropToggleBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  const isHidden = dropMenuList.hidden;
  dropMenuList.hidden = !isHidden;
  dropToggleBtn.setAttribute("aria-expanded", String(isHidden));
});

document.querySelectorAll("#dropMenuList a[data-tier]").forEach(link => {
  link.addEventListener("click", () => {
    const chosenTier = link.getAttribute("data-tier");
    document.getElementById("selectedServiceInput").value = chosenTier;
    document.getElementById("resultPlanLabel").textContent = chosenTier;
    dropMenuList.hidden = true;
    dropToggleBtn.setAttribute("aria-expanded", "false");
  });
});

document.addEventListener("click", () => {
  dropMenuList.hidden = true;
  dropToggleBtn.setAttribute("aria-expanded", "false");
});

// --- 2. INTERACTIVE FORM (Access DOM elements to validate form input) ---
const auditForm = document.getElementById("carbonAuditForm");
const orgInput = document.getElementById("orgNameInput");
const kwhInput = document.getElementById("kwhInput");
const kmInput = document.getElementById("kmInput");
const serviceSelect = document.getElementById("selectedServiceInput");

let latestAudit = {
  org: "GreenTech Logistics Hub",
  service: "Scope 1–2 Energy Audit",
  annualTonnes: "3.97"
};

auditForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const orgErr = document.getElementById("orgNameErr");
  const kwhErr = document.getElementById("kwhErr");
  const kmErr = document.getElementById("kmErr");

  // Reset validation states
  orgErr.textContent = "";
  kwhErr.textContent = "";
  kmErr.textContent = "";
  orgInput.classList.remove("invalid");
  kwhInput.classList.remove("invalid");
  kmInput.classList.remove("invalid");

  let isValid = true;
  const orgVal = orgInput.value.trim();
  const kwhVal = Number(kwhInput.value);
  const kmVal = Number(kmInput.value);

  if (orgVal.length < 2) {
    orgErr.textContent = "Please enter an organization or facility name (min 2 characters).";
    orgInput.classList.add("invalid");
    isValid = false;
  }

  if (!kwhVal || kwhVal <= 0) {
    kwhErr.textContent = "Monthly electricity usage must be greater than 0 kWh.";
    kwhInput.classList.add("invalid");
    isValid = false;
  }

  if (kmInput.value === "" || kmVal < 0) {
    kmErr.textContent = "Monthly fleet distance cannot be negative.";
    kmInput.classList.add("invalid");
    isValid = false;
  }

  if (!isValid) return;

  // Compute monthly & annual CO2e
  const monthlyKg = Math.round((kwhVal * 0.72) + (kmVal * 0.21));
  const annualTonnes = ((monthlyKg * 12) / 1000).toFixed(2);

  latestAudit = {
    org: orgVal,
    service: serviceSelect.value,
    annualTonnes
  };

  document.getElementById("resultOrgTitle").textContent = orgVal;
  document.getElementById("monthlyCo2Val").textContent = monthlyKg;
  document.getElementById("annualCo2Val").textContent = annualTonnes;
  document.getElementById("resultPlanLabel").textContent = serviceSelect.value;
  document.getElementById("validationStatus").textContent =
    `Validated — ${annualTonnes} tonnes CO₂e/yr queued for ${serviceSelect.value}`;
});

// --- 3. MODAL (Manipulate DOM elements to display modal) ---
const offsetModal = document.getElementById("offsetModal");
const closeModalBtn = document.getElementById("closeModalBtn");

function showOffsetModal() {
  document.getElementById("modalOrgName").textContent = latestAudit.org;
  document.getElementById("modalServiceName").textContent = latestAudit.service;
  document.getElementById("modalAnnualTonnes").textContent = latestAudit.annualTonnes;
  offsetModal.hidden = false;
}

function hideOffsetModal() {
  offsetModal.hidden = true;
}

document.getElementById("openModalBtn").addEventListener("click", showOffsetModal);
document.getElementById("heroModalBtn").addEventListener("click", showOffsetModal);
document.getElementById("openCertFromResultBtn").addEventListener("click", showOffsetModal);
closeModalBtn.addEventListener("click", hideOffsetModal);

offsetModal.addEventListener("click", (e) => {
  if (e.target === offsetModal) hideOffsetModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !offsetModal.hidden) hideOffsetModal();
});

document.getElementById("commitToCrudBtn").addEventListener("click", () => {
  carbonTasks.unshift({
    id: Date.now(),
    text: `Offset ${latestAudit.annualTonnes} t CO2e/yr for ${latestAudit.org} (${latestAudit.service})`,
    done: false
  });
  saveTasks();
  renderTasks();
  hideOffsetModal();
  document.getElementById("crud-checklist").scrollIntoView({ behavior: "smooth" });
});

// --- 4. CRUD TASK ARRAY (Input box, Add button onclick, CRUD array of tasks) ---
const DEFAULT_TASKS = [
  { id: 1, text: "Complete Scope 1–2 Energy Audit across primary facility", done: true },
  { id: 2, text: "Transition 60% of electricity consumption to Solar & PPA", done: false },
  { id: 3, text: "Retire 4.0 tonnes CO2e via Verified Reforestation Offsets", done: false }
];

let carbonTasks = JSON.parse(localStorage.getItem("carboncut_dom_tasks_v1")) || [...DEFAULT_TASKS];

function saveTasks() {
  localStorage.setItem("carboncut_dom_tasks_v1", JSON.stringify(carbonTasks));
}

// READ
function renderTasks() {
  const ul = document.getElementById("taskListUl");
  const counter = document.getElementById("taskCounter");
  ul.innerHTML = "";

  const doneCount = carbonTasks.filter(t => t.done).length;
  counter.textContent = `${doneCount} of ${carbonTasks.length} reduction milestones completed`;

  if (carbonTasks.length === 0) {
    ul.innerHTML = `<li class="cc-task-item"><span>No reduction tasks yet. Add one above!</span></li>`;
    return;
  }

  carbonTasks.forEach((task, idx) => {
    const li = document.createElement("li");
    li.className = "cc-task-item";
    li.innerHTML = `
      <div class="cc-task-left">
        <input type="checkbox" ${task.done ? "checked" : ""} onchange="toggleTask(${idx})" />
        <span class="${task.done ? "cc-done" : ""}">${escapeHtml(task.text)}</span>
      </div>
      <div class="cc-task-actions">
        <button type="button" class="cc-mini-btn" onclick="editTask(${idx})">Edit</button>
        <button type="button" class="cc-mini-btn del" onclick="deleteTask(${idx})">Delete</button>
      </div>
    `;
    ul.appendChild(li);
  });
}

// CREATE (onclick="addTask()")
function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();
  if (!text) {
    input.focus();
    return;
  }
  carbonTasks.unshift({ id: Date.now(), text, done: false });
  input.value = "";
  saveTasks();
  renderTasks();
}

// UPDATE
function toggleTask(idx) {
  carbonTasks[idx].done = !carbonTasks[idx].done;
  saveTasks();
  renderTasks();
}

function editTask(idx) {
  const updated = prompt("Update carbon reduction milestone:", carbonTasks[idx].text);
  if (updated !== null && updated.trim() !== "") {
    carbonTasks[idx].text = updated.trim();
    saveTasks();
    renderTasks();
  }
}

// DELETE
function deleteTask(idx) {
  carbonTasks.splice(idx, 1);
  saveTasks();
  renderTasks();
}

function resetDefaultTasks() {
  carbonTasks = [...DEFAULT_TASKS];
  saveTasks();
  renderTasks();
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, m => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[m]));
}

document.getElementById("taskInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

renderTasks();
