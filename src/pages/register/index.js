import messageCreate from "/components/message.js";

let message;

const button = document.getElementById("buttonRegister");
const inputEmail = document.getElementById("inputEmail");
const inputName = document.getElementById("inputName");
const inputPassword = document.getElementById("inputPassword");
const spanLogin = document.getElementById("spanLogin");
const inputCofirmPassword = document.getElementById("inputCofirmPassword");
const spanMessage = document.getElementById("spanMessage");
const url = "http://localhost:4000/";

button.addEventListener("click", async () => {
  try {
    if (
      !inputEmail.value ||
      !inputName.value ||
      !inputPassword.value ||
      !inputCofirmPassword.value
    ) {
      message = messageCreate(false, "Preencha todos os campos");
      document.querySelector("body").appendChild(message);
    }
    if (!(inputPassword.value === inputCofirmPassword.value)) {
      message = messageCreate(false, "As senhas tem que ser iguais");
      document.querySelector("body").appendChild(message);
      return;
    }
    const response = await fetch(url + "api/register", {
      method: "POST",
      body: JSON.stringify({
        email: inputEmail.value,
        name: inputName.value,
        password: inputPassword.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      message = messageCreate(false, data.error);
      document.querySelector("body").appendChild(message);
      throw new Error(`Response status: ${response.status}`);
    }

    localStorage.setItem("user", JSON.stringify(data));

    window.location.href = url + "disponivel";
  } catch (error) {
    console.error(error);
  }
});

spanLogin.addEventListener("click", () => {
  window.location.href = url + "entrar";
});
