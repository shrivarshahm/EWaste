const form = document.getElementById("wasteForm");
const statusTitle = document.getElementById("statusTitle");
const statusText = document.getElementById("statusText");
const activityLog = document.getElementById("activityLog");
const deviceGrid = document.getElementById("deviceGrid");
const alertCount = document.getElementById("alertCount");
const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const { tab } = button.dataset;

    tabButtons.forEach((item) => item.classList.remove("active"));
    tabPanels.forEach((panel) => panel.classList.remove("active"));

    button.classList.add("active");
    document.getElementById(`tab-${tab}`)?.classList.add("active");
  });
});

function getTimeLabel() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function inferRisk(category, concern) {
  const text = `${category} ${concern}`.toLowerCase();

  if (text.includes("batter") || text.includes("toxic") || text.includes("unsafe")) {
    return {
      level: "High risk",
      chipClass: "red",
      cardClass: "risk-high",
      action: "Hazard containment"
    };
  }

  if (text.includes("monitor") || text.includes("display") || text.includes("mixed")) {
    return {
      level: "Medium risk",
      chipClass: "amber",
      cardClass: "risk-medium",
      action: "Sorting and screening"
    };
  }

  return {
    level: "Low risk",
    chipClass: "green",
    cardClass: "risk-low",
    action: "Reuse screening"
  };
}

if (form && statusTitle && statusText && activityLog && deviceGrid && alertCount) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const organization = formData.get("organization");
    const category = formData.get("category");
    const quantity = formData.get("quantity");
    const concern = formData.get("concern");
    const risk = inferRisk(category, concern);
    const batchId = `EW-${Math.floor(Math.random() * 900 + 100)}`;

    statusTitle.textContent = "Tracking Request Logged";
    statusText.textContent =
      `${organization} submitted ${quantity} of ${category}. Batch ${batchId} moved into intake review.`;

    const activityItem = document.createElement("article");
    activityItem.className = "activity-item";
    activityItem.innerHTML = `
      <strong>${getTimeLabel()}</strong>
      <p>${organization} created ${batchId} for ${category}. Priority set to ${risk.level.toLowerCase()}.</p>
    `;
    activityLog.prepend(activityItem);

    const deviceCard = document.createElement("article");
    deviceCard.className = `device-card ${risk.cardClass}`;
    deviceCard.innerHTML = `
      <div class="device-top">
        <strong>Batch ${batchId}</strong>
        <span class="risk-chip ${risk.chipClass}">${risk.level}</span>
      </div>
      <p>${concern}</p>
      <ul class="device-meta">
        <li>Category: ${category}</li>
        <li>Quantity: ${quantity}</li>
        <li>Action: ${risk.action}</li>
      </ul>
    `;
    deviceGrid.prepend(deviceCard);

    const currentAlerts = Number.parseInt(alertCount.textContent, 10);
    if (risk.level === "High risk" && Number.isFinite(currentAlerts)) {
      alertCount.textContent = String(currentAlerts + 1).padStart(2, "0");
    }

    form.reset();
  });
}
