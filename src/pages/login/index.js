const button = document.getElementById("buttonLogin");
const inputEmail = document.getElementById("inputEmail");
const inputPassword = document.getElementById("inputPassword");
const spanMessage = document.getElementById("spanMessage");
const spanRegister = document.getElementById("spanRegister");

const url = "http://localhost:4000/";

button.addEventListener("click", async () => {
  try {
    const response = await fetch(url + "api/login", {
      method: "POST",
      body: JSON.stringify({
        email: inputEmail.value,
        password: inputPassword.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response);
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

spanRegister.addEventListener("click", () => {
  window.location.href = url + "registrar";
});
