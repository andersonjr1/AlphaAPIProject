import nav from "./nav.js";
import messageCreate from "./message.js";
let message;

const url = "http://localhost:4000/";
const containerActivities = document.getElementById("containerActivities");
const buttonAvailable = document.getElementById("buttonAvailable");

document.querySelector("body").appendChild(nav);

async function renderActivities() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const response = await fetch(
      url + `api/enrollment/search?user_id=${user.id}`
    );

    const data = await response.json();

    if (!response.ok) {
      message = messageCreate(false, data.error);
      document.querySelector("body").appendChild(message);
    }

    data.forEach((activity) => {
      const element = document.createElement("div");
      const date = new Date(activity.value.date);
      element.id = activity.key;
      element.classList.add("activity");
      element.innerHTML = `
        <div class="activityName">${activity.value.title}</div>
        <div class="activityData">${String(date.getDate()).padStart(
          2,
          "0"
        )}/${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}/${date.getFullYear()}</div>
        <div class="activityLocation">${activity.value.place}</div>
        <button class="activityButton">Sair</button>
        `;
      const button = element.querySelector("button");
      button.addEventListener("click", async () => {
        const response = await fetch(url + "api/enrollment/", {
          method: "DELETE",
          body: JSON.stringify({
            activity_id: button.parentElement.id,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          message = messageCreate(false, data.error);
          document.querySelector("body").appendChild(message);
        }

        message = messageCreate(true, data.success);
        document.querySelector("body").appendChild(message);

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
