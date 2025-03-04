import nav from "./nav.js";
import messageCreate from "./message.js";
const containerActivities = document.getElementById("containerActivities");
const url = "http://localhost:4000/";
const overlay = document.getElementById("overlay");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");
const modalExit = document.getElementById("modalExit");
let message;
let selectedActivity = "";

document.querySelector("body").appendChild(nav);

async function renderActivities() {
  try {
    containerActivities.innerHTML = "";
    const response = await fetch(url + "api/activity/");

    const data = await response.json();

    if (!response.ok) {
      message = messageCreate(false, data.error);
      document.querySelector("body").appendChild(message);
      throw new Error(`Response status: ${response.status}`);
    }

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
        <div class="activityName">Máximo de ${
          activity.value.participants_maximum
        } pessoas</div>
        <div id="activityButtonsContainer">
          <button class="activityButton" id="buttonDelete">Excluir</button>
          <button class="activityButton" id="buttonEdit">Editar</button>
        </div>
        <span id="spanVisualizeParticipants">Visualizar participantes</span>
        `;
      const buttonDelete = element.querySelector("#buttonDelete");
      const buttonEdit = element.querySelector("#buttonEdit");
      const spanVisualizeParticipants = element.querySelector(
        "#spanVisualizeParticipants"
      );

      buttonDelete.addEventListener("click", async () => {
        const response = await fetch(url + `api/activity/${activity.key}`, {
          method: "DELETE",
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

      buttonEdit.addEventListener("click", () => {
        overlay.style.display = "block";
        selectedActivity = activity.key;
        modalContent.innerHTML = `
          <div id="inputs">
            <div class="inputContainer">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M420-160v-520H200v-120h560v120H540v520H420Z"/></svg>
                <input type="text" id="inputTitle" placeholder="Título">
            </div>
            <div class="inputContainer">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/></svg>
                <input type="text" id="inputPlace" placeholder="Local">
            </div>
            <div class="inputContainer">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M0-240v-63q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65H0Zm240 0v-65q0-32 17.5-58.5T307-410q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v65H240Zm540 0v-65q0-26-6.5-49T754-397q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v63H780Zm-455-80h311q-10-20-55.5-35T480-370q-55 0-100.5 15T325-320ZM160-440q-33 0-56.5-23.5T80-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160-440Zm640 0q-33 0-56.5-23.5T720-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800-440Zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480Zm0-80q17 0 28.5-11.5T520-600q0-17-11.5-28.5T480-640q-17 0-28.5 11.5T440-600q0 17 11.5 28.5T480-560Zm1 240Zm-1-280Z"/></svg>
                <input type="number" id="inputParticipants" placeholder="Número Máximo de Participantes">
            </div>
            <div class="inputContainer">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"/></svg>
                <input type="date" id="inputDate" placeholder="Data">
            </div>
            <textarea id="textareaDescription" placeholder="Descição"></textarea>
            <span id="spanMessage"></span>
            <button id="buttonEditActivity">EDITAR</button>
        </div>
        `;

        const buttonEditActivity = modal.querySelector("#buttonEditActivity");
        buttonEditActivity.addEventListener("click", async () => {
          const inputTitle = modal.querySelector("#inputTitle");
          const inputPlace = modal.querySelector("#inputPlace");
          const inputParticipants = modal.querySelector("#inputParticipants");
          const inputDate = modal.querySelector("#inputDate");
          const textareaDescription = modal.querySelector(
            "#textareaDescription"
          );
          const spanMessage = modal.querySelector("#spanMessage");

          if (
            !inputTitle.value &&
            !inputPlace.value &&
            !inputParticipants.value &&
            !inputDate.value &&
            !textareaDescription.value
          ) {
            message = messageCreate(false, "Coloque ao menos um valor");
            document.querySelector("body").appendChild(message);
            return;
          }
          overlay.style.display = "none";
          const response = await fetch(
            url + `api/activity/${selectedActivity}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                title: inputTitle.value,
                description: textareaDescription.value,
                data: inputDate.value,
                place: inputPlace.value,
                participants: inputParticipants.value,
              }),
            }
          );
          const data = await response.json();

          if (!response.ok) {
            message = messageCreate(false, data.error);
            document.querySelector("body").appendChild(message);
          }

          message = messageCreate(true, data.success);
          document.querySelector("body").appendChild(message);

          overlay.style.display = "none";

          renderActivities();
        });
      });

      spanVisualizeParticipants.addEventListener("click", async () => {
        selectedActivity = activity.key;
        modalContent.innerHTML = ``;
        const response = await fetch(url + `api/activity/${selectedActivity}`);
        const data = await response.json();

        if (!response.ok) {
          message = messageCreate(false, data.error);
          document.querySelector("body").appendChild(message);
        }

        overlay.style.display = "block";
        const ul = document.createElement("ul");
        data.forEach((element) => {
          const li = document.createElement("li");
          li.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M360-390q-21 0-35.5-14.5T310-440q0-21 14.5-35.5T360-490q21 0 35.5 14.5T410-440q0 21-14.5 35.5T360-390Zm240 0q-21 0-35.5-14.5T550-440q0-21 14.5-35.5T600-490q21 0 35.5 14.5T650-440q0 21-14.5 35.5T600-390ZM480-160q134 0 227-93t93-227q0-24-3-46.5T786-570q-21 5-42 7.5t-44 2.5q-91 0-172-39T390-708q-32 78-91.5 135.5T160-486v6q0 134 93 227t227 93Zm0 80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-54-715q42 70 114 112.5T700-640q14 0 27-1.5t27-3.5q-42-70-114-112.5T480-800q-14 0-27 1.5t-27 3.5ZM177-581q51-29 89-75t57-103q-51 29-89 75t-57 103Zm249-214Zm-103 36Z"/></svg>
          <span>${element.value.name}</span>
          `;
          ul.appendChild(li);
        });
        modalContent.appendChild(ul);
      });
      containerActivities.appendChild(element);
    });
  } catch (error) {
    console.error(error.message);
  }
}

overlay.addEventListener("click", () => {
  overlay.style.display = "none";
});

modalExit.addEventListener("click", () => {
  overlay.style.display = "none";
});

modal.addEventListener("click", (event) => {
  event.stopPropagation();
});

renderActivities();

//const message = messageCreate(false, "Isso é um teste");
