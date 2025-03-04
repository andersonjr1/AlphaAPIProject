import nav from "./nav.js";

import messageCreate from "./message.js";

let message;

const url = "http://localhost:4000/";

const buttonCreateActivity = document.getElementById("buttonCreateActivity");

const inputTitle = document.getElementById("inputTitle");

const inputPlace = document.getElementById("inputPlace");

const inputParticipants = document.getElementById("inputParticipants");

const inputDate = document.getElementById("inputDate");

const textareaDescription = document.getElementById("textareaDescription");

const spanMessage = document.getElementById("spanMessage");

buttonCreateActivity.addEventListener("click", async () => {
  if (
    !inputTitle.value ||
    !inputPlace.value ||
    !inputParticipants.value ||
    !inputDate.value
  ) {
    message = messageCreate(false, "Coloque todos os campos");
    document.querySelector("body").appendChild(message);
    return;
  }

  const response = await fetch(url + "api/activity", {
    method: "POST",
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
  });

  const data = await response.json();

  if (!response.ok) {
    message = messageCreate(false, data.error);
    document.querySelector("body").appendChild(message);
  }

  message = messageCreate(true, data.success);
  document.querySelector("body").appendChild(message);

  inputTitle.value = "";
  inputPlace.value = "";
  inputParticipants.value = "";
  inputDate.value = "";
  textareaDescription.value = "";
});

document.querySelector("body").appendChild(nav);
