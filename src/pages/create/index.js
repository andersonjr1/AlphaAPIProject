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
  const title = inputTitle.value;
  const date = inputDate.value;
  const place = inputPlace.value;
  const description = textareaDescription.value;
  const participants = inputParticipants.value;

  if (!title || !place || !participants || !date) {
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
      title: title,
      description: description,
      data: date,
      place: place,
      participants: participants,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    message = messageCreate(false, data.error);
    document.querySelector("body").appendChild(message);
    return;
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
