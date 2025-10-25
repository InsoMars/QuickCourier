const identificacion = document.getElementById("identificacion-section");
const envio = document.getElementById("envio-section");
const pago = document.getElementById("pago-section");

const toEnvio = document.getElementById("toEnvio");
const toPago = document.getElementById("toPago");
const btnPagar = document.getElementById("btnPagar");

// pasos visuales
const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const step3 = document.getElementById("step3");

const resumenDetalles = document.getElementById("resumen-detalles");


toEnvio.addEventListener("click", () => {
  identificacion.classList.add("hidden");
  envio.classList.remove("hidden");

  step1.classList.remove("active");
  step1.classList.add("done");
  step2.classList.add("active");

  resumenDetalles.innerHTML += `
    <div class="resumen-bloque">
      <h4>Identificación</h4>
      <p>Mariana Landinez</p>
      <p>correo@ejemplo.com</p>
    </div>
  `;
});


toPago.addEventListener("click", () => {
  envio.classList.add("hidden");
  pago.classList.remove("hidden");

  step2.classList.remove("active");
  step2.classList.add("done");
  step3.classList.add("active");


  const direccion = document.querySelector("input[name='direccion']:checked")
    ? "Calle 123 #45-67, Bogotá"
    : "Dirección no seleccionada";

  resumenDetalles.innerHTML += `
    <div class="resumen-bloque">
      <h4>Envío</h4>
      <p>${direccion}</p>
      <p>Envío estándar: $9.000</p>
    </div>
  `;
});

// Paso 3 → Final
btnPagar.addEventListener("click", () => {
  
  const metodo = document.querySelector("input[name='pago']:checked")?.value || "No seleccionado";
  
  resumenDetalles.innerHTML += `
    <div class="resumen-bloque">
      <h4>Pago</h4>
      <p>Método: ${metodo}</p>
    </div>
  `;

  alert("Simulación: redirigiendo a la pasarela de pago...");
});




const backToIdent = document.getElementById("backToIdent");
const backToEnvio = document.getElementById("backToEnvio");


backToIdent.addEventListener("click", () => {
  envio.classList.add("hidden");
  identificacion.classList.remove("hidden");

  step2.classList.remove("active");
  step1.classList.add("active");
});


backToEnvio.addEventListener("click", () => {
  pago.classList.add("hidden");
  envio.classList.remove("hidden");

  step3.classList.remove("active");
  step2.classList.add("active");
});


const btnVolverResumen = document.getElementById("btnVolverResumen");

btnVolverResumen.addEventListener("click", () => {
  window.location.href = "resumen-carrito.html"; 
});


// Menú
const menuBtn = document.querySelector(".menu-btn");
const sideMenu = document.getElementById("side-menu");
const closeMenu = document.getElementById("close-menu");
const overlay = document.getElementById("overlay");

// Abrir menu
menuBtn.addEventListener("click", () => {
    sideMenu.classList.add("open");
    overlay.classList.add("show");
});

// Cerrar menu
closeMenu.addEventListener("click", () => {
    sideMenu.classList.remove("open");
    overlay.classList.remove("show");
});

// Cerrar si hace click fuera
overlay.addEventListener("click", () => {
    sideMenu.classList.remove("open");
    overlay.classList.remove("show");
});

