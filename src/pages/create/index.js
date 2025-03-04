import nav from "./nav.js";

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
    spanMessage.innerText = "Preencha todos os valores";
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
  console.log(data);
  if (!response.ok) {
    spanMessage.innerText = data;
    return;
  }
  inputTitle.value = "";
  inputPlace.value = "";
  inputParticipants.value = "";
  inputDate.value = "";
  textareaDescription.value = "";
  spanMessage.innerText = "Atividade criada";
});

document.querySelector("body").appendChild(nav);
