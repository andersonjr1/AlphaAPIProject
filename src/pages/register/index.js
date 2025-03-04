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
    if (!(inputPassword.value === inputCofirmPassword.value)) {
      spanMessage.innerText = "As senhas não são as mesmas";
      return;
    }
    const response = await fetch(url + "api/register", {
      method: "POST",
      body: JSON.stringify({
        email: inputEmail.value,
        name: inputPassword.value,
        password: inputPassword.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      spanMessage.innerText = data;
      throw new Error(`Response status: ${response.status}`);
    }

    localStorage.setItem("user", JSON.stringify(data));

    window.location.href = url;
  } catch (error) {
    console.error(error);
  }
});

spanLogin.addEventListener("click", () => {
  window.location.href = url + "entrar";
});
