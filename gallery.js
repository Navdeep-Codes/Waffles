const isMotionReduced =
  window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
  window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

let allRecords = [];

async function fetchSubmissions() {
  try {
    const response = await axios.get(
      "https://waffles.hackclub.com/api/airtable"
    );
    allRecords = response.data.records;
    renderCards(allRecords);
  } catch (error) {
    console.error("Error fetching data:", error);
    renderCards([]);
  }
}

function renderCards(records) {
  const submissionsDiv = document.getElementById("submissions");
  submissionsDiv.innerHTML = "";
  records.forEach((record) => {
    const {
      "Playable URL": playableUrl,
      "Review Status": reviewStatus,
      "Code URL": codeUrl,
      Screenshot: screenshot,
    } = record.fields;

    const imageUrl =
      screenshot && screenshot[0]
        ? screenshot[0].url
        : "https://via.placeholder.com/400x250?text=No+Image";
    const card = document.createElement("div");
    card.className = "card";

    let statusColor = "#10b981";
    if (reviewStatus === "Pending") statusColor = "#f59e0b";
    if (reviewStatus === "Rejected") statusColor = "#ef4444";
    if (reviewStatus === "Re-Review") statusColor = "#D36507";

    card.innerHTML = `
        <img src="${imageUrl}" alt="${firstName || "No Name"}'s project">
        <div class="status-badge" style="background-color: ${statusColor}">${
      reviewStatus || "N/A"
    }</div> 
        <br>
        <br>
        <br>
        <div class="card-buttons">
          ${
            playableUrl
              ? `<a href="${playableUrl}" target="_blank" class="demo-button">📱 Demo</a>`
              : ""
          }
          ${
            codeUrl
              ? `<a href="${codeUrl}" target="_blank" class="github-button">📂 Github</a>`
              : ""
          }
        </div>
        <p class="submission-date">Submitted on ${new Date().toLocaleDateString()}</p>
      `;
    submissionsDiv.appendChild(card);
  });
}

document.getElementById("status").addEventListener("change", function () {
  const selected = this.value;
  if (selected === "All") {
    renderCards(allRecords);
  } else {
    const filtered = allRecords.filter(
      (r) => r.fields["Review Status"] === selected
    );
    renderCards(filtered);
  }
});

fetchSubmissions();

var app = document.getElementById("app");

if (!isMotionReduced) {
  var typewriter = new Typewriter(app, {
    loop: true,
  });

  typewriter
    .typeString("Waffles")
    .pauseFor(2500)
    .deleteAll()
    .typeString("Waffles")
    .pauseFor(2500)
    .deleteAll()
    .start();
} else {
  app.innerHTML = "Waffles";
}
