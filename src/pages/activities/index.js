import nav from "./nav.js";
const containerActivities = document.getElementById("containerActivities");
// const buttonParticipating = document.getElementById("buttonParticipating");
const url = "http://localhost:4000/";

document.querySelector("body").appendChild(nav);

async function renderActivities() {
  try {
    const response = await fetch(url + "api/activity/");

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();

    data.forEach((activity) => {
      const element = document.createElement("div");
      const date = new Date(activity.value.date);
      element.id = activity.key;
      element.classList.add("activity");
      element.innerHTML = `
        <div class="activityName">${activity.value.title}</div>
        <div class="activityName">${String(date.getDate()).padStart(
          2,
          "0"
        )}/${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}/${date.getFullYear()}</div>
        <div class="activityLocation">${activity.value.place}</div>
        <div id="activityButtonsContainer">
          <button class="activityButton" id="buttonDelete">Excluir</button>
          <button class="activityButton" id="editButton">Editar</button>
        </div>
        <span id="spanVisualizeParticipants">Visualizar participantes</span>
        `;
      const button = element.querySelector("button");
      button.addEventListener("click", async () => {
        const response = await fetch(url + "api/enrollment/", {
          method: "POST",
          body: JSON.stringify({
            activity_id: button.parentElement.id,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        containerActivities.innerHTML = "";
        renderActivities();
      });
      containerActivities.appendChild(element);
    });
  } catch (error) {
    console.error(error.message);
  }
}

renderActivities();
