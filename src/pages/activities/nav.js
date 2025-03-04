const nav = document.createElement("nav");

const url = "http://localhost:4000/";

const menuAvailable = document.createElement("div");

const userAdmin = JSON.parse(localStorage.getItem("user")).admin;

menuAvailable.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="white"><path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z" class="svgMenu"/></svg>
<span>Disponível</span>`;

const menuParticipating = document.createElement("div");

menuParticipating.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="white"><path d="M438-226 296-368l58-58 84 84 168-168 58 58-226 226ZM200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z" class="svgMenu"/></svg>
<span>Participando</span>`;

const menuExit = document.createElement("div");

menuExit.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="white"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" class="svgMenu"/></svg>
<span>Sair</span>`;

const menuCreate = document.createElement("div");

menuCreate.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
<span>Criar Atividade</span>`;

const menuActivities = document.createElement("div");

menuActivities.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff"><path d="M240-160q-33 0-56.5-23.5T160-240q0-33 23.5-56.5T240-320q33 0 56.5 23.5T320-240q0 33-23.5 56.5T240-160Zm240 0q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm240 0q-33 0-56.5-23.5T640-240q0-33 23.5-56.5T720-320q33 0 56.5 23.5T800-240q0 33-23.5 56.5T720-160ZM240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400ZM240-640q-33 0-56.5-23.5T160-720q0-33 23.5-56.5T240-800q33 0 56.5 23.5T320-720q0 33-23.5 56.5T240-640Zm240 0q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Zm240 0q-33 0-56.5-23.5T640-720q0-33 23.5-56.5T720-800q33 0 56.5 23.5T800-720q0 33-23.5 56.5T720-640Z"/></svg>
<span>Listar todas Atividades</span>`;

menuAvailable.classList.add("svgContainer");

menuParticipating.classList.add("svgContainer");

menuCreate.classList.add("svgContainer");

menuActivities.classList.add("svgContainer");

if (window.innerWidth > 500) {
  nav.style.boxSizing = "border-box";
  nav.style.position = "fixed";
  nav.style.display = "flex";
  nav.style.padding = "10px";
  nav.style.flexDirection = "column";
  nav.style.alignItems = "center";
  nav.style.gap = "20px";
  nav.style.backgroundColor = "#202020";
  nav.style.left = "0px";
  nav.style.top = "0px";
  nav.style.height = "100%";
  nav.style.width = "fit-content";
  nav.style.color = "white";
  nav.style.zIndex = "1";

  menuExit.style.position = "absolute";
  menuExit.style.bottom = "0";
  menuExit.style.width = "100%";
  menuExit.style.backgroundColor = "#7091E6";
  menuExit.style.padding = "10px 0px";
  menuExit.style.textAlign = "center";

  menuExit.addEventListener("mouseover", () => {
    menuExit.style.cursor = "pointer";
  });

  nav.appendChild(menuAvailable);

  nav.appendChild(menuParticipating);

  if (userAdmin) {
    nav.appendChild(menuCreate);

    nav.appendChild(menuActivities);
  }

  nav.appendChild(menuExit);

  const svgContainers = nav.querySelectorAll(".svgContainer");

  svgContainers.forEach((container) => {
    container.style.padding = "10px";
    container.style.borderRadius = "10px";
    container.style.transition = "background-color 0.4s";

    container.addEventListener("mouseover", () => {
      container.style.cursor = "pointer";
      container.style.backgroundColor = "#4b4949";
    });

    container.addEventListener("mouseout", () => {
      container.style.backgroundColor = "";
    });
  });

  function createAfterElement(element, text) {
    element.addEventListener("mouseover", (event) => {
      const svg = element.querySelector("svg");
      svg.style.pointerEvents = "none";
      const afterElement = document.createElement("div");
      afterElement.textContent = text;
      afterElement.style.textAlign = "center";
      afterElement.style.position = "absolute";
      afterElement.style.borderRadius = "5px";
      afterElement.style.padding = "5px 10px";
      afterElement.style.backgroundColor = "#4b4949";
      afterElement.style.transform = "translateY(-33px)";
      afterElement.style.animation = "slideLeft 0.4s forwards";

      element.appendChild(afterElement);

      const styleSheet = document.styleSheets[0];
      styleSheet.insertRule(
        `
        @keyframes slideLeft {
            0% {
                left: 60px;
            }
            100% {
                left: 80px;
            }
        }
    `,
        styleSheet.cssRules.length
      );
    });

    element.addEventListener("mouseout", () => {
      const afterElement = element.querySelector("div");
      if (afterElement) {
        element.removeChild(afterElement);
      }
    });
  }

  createAfterElement(menuAvailable, "Disponível");

  createAfterElement(menuParticipating, "Participando");

  createAfterElement(menuActivities, "Todas Atividades");

  createAfterElement(menuCreate, "Criar Atividades");

  createAfterElement(menuExit, "Sair");

  const navDivSpans = nav.querySelectorAll("div > span");

  navDivSpans.forEach((span) => {
    span.style.display = "none";
  });
} else {
  const menuOpen = document.createElement("div");

  menuExit.classList.add("svgContainer");

  menuOpen.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="white"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" class="svgMenu"/></svg>`;

  nav.style.boxSizing = "border-box"; // Padrão para todos os navegadores
  nav.style.position = "fixed";
  nav.style.display = "flex";
  nav.style.padding = "10px";
  nav.style.flexDirection = "column";
  nav.style.gap = "20px";
  nav.style.backgroundColor = "#202020";
  nav.style.justifyItems = "end";
  nav.style.alignItems = "start";
  nav.style.top = "0px";
  nav.style.left = "0px";
  nav.style.height = "fit-content";
  nav.style.width = "100%";
  nav.style.color = "white";

  nav.appendChild(menuOpen);

  menuOpen.addEventListener("mouseover", () => {
    menuOpen.style.cursor = "pointer";
  });

  function openMenu() {
    menuOpen.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#fff"><path d="M120-240v-80h520v80H120Zm664-40L584-480l200-200 56 56-144 144 144 144-56 56ZM120-440v-80h400v80H120Zm0-200v-80h520v80H120Z"/></svg>`;

    nav.appendChild(menuAvailable);

    nav.appendChild(menuParticipating);

    if (userAdmin) {
      nav.appendChild(menuCreate);

      nav.appendChild(menuActivities);
    }

    nav.appendChild(menuExit);

    const svgContainers = nav.querySelectorAll(".svgContainer");

    svgContainers.forEach((container) => {
      container.style.display = "flex";
      container.style.alignItems = "center";
      container.style.gap = "10px";
      container.style.padding = "10px";
      container.style.borderRadius = "10px";
      container.style.transition = "background-color 0.4s";

      container.addEventListener("mouseover", () => {
        container.style.cursor = "pointer";
        container.style.backgroundColor = "#4b4949";
      });

      container.addEventListener("mouseout", () => {
        container.style.backgroundColor = "";
      });
    });

    this.removeEventListener("click", openMenu);

    this.addEventListener("click", closeMenu);
  }

  function closeMenu() {
    menuOpen.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="white"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" class="svgMenu"/></svg>`;

    nav.removeChild(menuAvailable);

    nav.removeChild(menuParticipating);

    nav.removeChild(menuExit);

    this.addEventListener("click", openMenu);

    this.removeEventListener("click", closeMenu);
  }

  menuOpen.addEventListener("click", openMenu);
}

menuAvailable.addEventListener("click", () => {
  window.location.href = url + "disponivel";
});

menuParticipating.addEventListener("click", () => {
  window.location.href = url + "participando";
});

if (userAdmin) {
  menuCreate.addEventListener("click", () => {
    window.location.href = url + "criar";
  });

  menuActivities.addEventListener("click", () => {
    window.location.href = url + "atividades";
  });
}

menuExit.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = url + "sair";
});

export default nav;
