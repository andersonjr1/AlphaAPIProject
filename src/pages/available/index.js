const url = "http://localhost:4000/";
const containerActivities = document.getElementById("containerActivities");
const buttonParticipating = document.getElementById("buttonParticipating");

async function renderActivities() {
  try {
    const response = await fetch(url + "api/activity/search?available=true");

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();

    data.forEach((activity) => {
      const element = document.createElement("div");
      element.id = activity.key;
      element.classList.add("activity");
      element.innerHTML = `
        <div class="activityName">${activity.value.title}</div>
        <div class="activityLocation">${activity.value.place}</div>
        <div class="activityAmountContainer">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFFF"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/></svg>
            <span class="activityAmount">${activity.value.current_participants}/${activity.value.participants_maximum}</span>
        </div>
        <button class="activityButton">Participar</button>
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

buttonParticipating.addEventListener("click", () => {
  window.location.href = url + "participando";
});

const exit = document.getElementById("exitContainer");
exit.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = url + "sair";
});

renderActivities();
