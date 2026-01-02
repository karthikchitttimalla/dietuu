// ================================
// 🔥 FIREBASE IMPORTS
// ================================
import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ================================
// 🔐 AUTH PROTECTION
// ================================
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "loginandsignup.html";
  } else {
    console.log("Logged in:", user.email);
    await loadProfile(user.uid);
  }
});

// ================================
// 🧭 NAVIGATION + TUBELIGHT
// ================================
document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) lucide.createIcons();

  const activeItem = document.querySelector(".nav-item.active");
  if (activeItem) moveLamp(activeItem);
});

window.setActive = (element, tabName) => {
  switchTab(tabName);

  document.querySelectorAll(".nav-item").forEach(el =>
    el.classList.remove("active")
  );
  element.classList.add("active");

  moveLamp(element);
};

function moveLamp(target) {
  const lamp = document.getElementById("lamp-highlighter");
  if (!lamp || !target) return;

  lamp.style.display = "block";
  lamp.style.left = `${target.offsetLeft}px`;
  lamp.style.width = `${target.offsetWidth}px`;
}

window.switchTab = (tabName) => {
  const views = [
    "dashboard-view",
    "chatbot-view",
    "plans-view",
    "progress-view",
    "profile-view"
  ];

  views.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });

  const target = document.getElementById(`${tabName}-view`);
  if (target) {
    target.style.display = tabName === "chatbot" ? "flex" : "block";
  }
};

// ================================
// 👤 PROFILE → FIRESTORE
// ================================
window.saveProfile = async () => {
  const user = auth.currentUser;
  if (!user) return alert("Not logged in");

  const data = {
    email: user.email,
    age: document.getElementById("age")?.value || "",
    gender: document.getElementById("gender")?.value || "",
    height: document.getElementById("height")?.value || "",
    currentWeight: document.getElementById("currentWeight")?.value || "",
    activity: document.getElementById("activity")?.value || "",
    goal: document.getElementById("goal")?.value || "",
    allergies: document.getElementById("allergies")?.value || "",
    updatedAt: new Date()
  };

  await setDoc(doc(db, "users", user.uid), data);
  alert("✅ Profile saved to Firebase");
};

async function loadProfile(uid) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const d = snap.data();
    setVal("age", d.age);
    setVal("gender", d.gender);
    setVal("height", d.height);
    setVal("currentWeight", d.currentWeight);
    setVal("activity", d.activity);
    setVal("goal", d.goal);
    setVal("allergies", d.allergies);
  }
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val || "";
}

// ================================
// 📦 PLAN SELECTION (UI ONLY)
// ================================
window.selectPlan = (plan) => {
  if (confirm(`Switch to ${plan}?`)) {
    alert(`✅ ${plan} activated`);
  }
};

// ================================
// 💧 WATER TRACKER
// ================================
let water = 0;
window.updateWater = (c) => {
  water += c;
  water = Math.max(0, Math.min(8, water));
  document.getElementById("water-count").innerText = `${water} / 8 Glasses`;
  document.getElementById("water-fill").style.width = `${(water / 8) * 100}%`;
};

// ================================
// ⚖️ LOG WEIGHT (UI ONLY)
// ================================
window.logWeight = () => {
  const w = document.getElementById("weight-input").value;
  if (!w) return alert("Enter weight");
  alert(`📉 Weight logged: ${w} kg`);
  document.getElementById("weight-input").value = "";
};

// ================================
// 📊 CHARTS
// ================================
document.addEventListener("DOMContentLoaded", () => {
  if (!window.Chart) return;

  const ctx = document.getElementById("weightChart");
  if (ctx) {
    new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [{
          data: [72, 70.5, 70, 69.5],
          borderColor: "#3b82f6",
          fill: false,
          tension: 0.4
        }]
      },
      options: { plugins: { legend: { display: false } } }
    });
  }

  const pCtx = document.getElementById("progressChart");
  if (pCtx) {
    new Chart(pCtx, {
      type: "bar",
      data: {
        labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
        datasets: [{
          data: [2100,2300,1950,2200,2400,2150,2000],
          backgroundColor: "#3b82f6"
        }]
      },
      options: { plugins: { legend: { display: false } } }
    });
  }
});

// ================================
// 🤖 CHATBOT
// ================================
window.sendMessage = async () => {
  const input = document.getElementById("chat-input");
  const history = document.getElementById("chat-history");
  const msg = input.value.trim();
  if (!msg) return;

  history.innerHTML += `
    <div class="message-row user">
      <div class="bubble user">${msg}</div>
      <div class="avatar">👤</div>
    </div>`;
  input.value = "";

  const loaderId = "bot-" + Date.now();
  history.innerHTML += `
    <div class="message-row bot">
      <div class="avatar">🤖</div>
      <div class="bubble bot" id="${loaderId}">Typing...</div>
    </div>`;
  history.scrollTop = history.scrollHeight;

  try {
    const res = await fetch("http://localhost:5000/api/diet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: msg })
    });

    const data = await res.json();
    document.getElementById(loaderId).innerText =
      data.reply || "Demo response: Eat healthy & stay hydrated!";
  } catch {
    document.getElementById(loaderId).innerText =
      "⚠️ AI offline. This is a demo response.";
  }
};
