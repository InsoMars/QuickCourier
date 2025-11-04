// --- SECCIONES ---
const identificacion = document.getElementById("identificacion-section");
const envio = document.getElementById("envio-section");
const pago = document.getElementById("pago-section");
 
// --- BOTONES ---
const toEnvio = document.getElementById("toEnvio");
const toPago = document.getElementById("toPago");
const btnPagar = document.getElementById("btnPagar");
const btnAgregarDireccion = document.getElementById("btnAgregarDireccion");
const formNuevaDireccion = document.getElementById("formNuevaDireccion");
const btnVolverResumen = document.getElementById("btnVolverResumen");

// --- PASOS ---
const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const step3 = document.getElementById("step3");
 
// --- RESUMEN ---
const resumenDetalles = document.getElementById("resumen-detalles");
 
// --- DIRECCIÓN ---
let direccionGuardada = null; // almacena la nueva dirección ingresada

// --- MOSTRAR/OCULTAR FORMULARIO DIRECCIÓN ---
btnAgregarDireccion.addEventListener("click", () => {
  formNuevaDireccion.classList.toggle("hidden");
});

// --- GUARDAR NUEVA DIRECCIÓN ---
formNuevaDireccion.addEventListener("submit", (event) => {
  event.preventDefault();
 
  const ciudad = document.getElementById("ciudad").value;
  const direccion = document.getElementById("direccion").value.trim();
  const infoExtra = document.getElementById("info-extra-dir").value.trim();
 
  if (!ciudad || !direccion) {
    alert("Por favor completa todos los campos obligatorios.");
    return;
  }
 
  direccionGuardada = { ciudad, direccion, infoExtra };
 
  formNuevaDireccion.classList.add("hidden");
  alert("Nueva dirección guardada correctamente.");
 
  // Agregar opción seleccionable en la lista
  const nuevaOpcion = document.createElement("label");
  nuevaOpcion.classList.add("address-option");
  nuevaOpcion.innerHTML = `
    <input type="radio" name="direccion" checked />
    ${direccion}, ${ciudad.charAt(0).toUpperCase() + ciudad.slice(1)}
    ${infoExtra ? " - " + infoExtra : ""}
  `;
  btnAgregarDireccion.insertAdjacentElement("beforebegin", nuevaOpcion);
});


// --- NAVEGACIÓN ENTRE PASOS ---
toEnvio.addEventListener("click", () => {
  identificacion.classList.add("hidden");
  envio.classList.remove("hidden");
 
  step1.classList.replace("active", "done");
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
 
  step2.classList.replace("active", "done");
  step3.classList.add("active");
 
  // Determinar la dirección a mostrar
  let direccionTexto;
  if (direccionGuardada) {
    direccionTexto = `${direccionGuardada.direccion}, ${direccionGuardada.ciudad.toUpperCase()} ${
      direccionGuardada.infoExtra ? "- " + direccionGuardada.infoExtra : ""
    }`;
  } else {
    const seleccion = document.querySelector("input[name='direccion']:checked");
    direccionTexto = seleccion
      ? seleccion.parentElement.textContent.trim()
      : "Dirección no seleccionada";
  }
 
  resumenDetalles.innerHTML += `
    <div class="resumen-bloque">
      <h4>Envío</h4>
      <p>${direccionTexto}</p>
      <p>Envío estándar: $9.000</p>
    </div>
  `;
});
 
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
 

// --- BOTONES ATRÁS ---
document.getElementById("backToIdent").addEventListener("click", () => {
  envio.classList.add("hidden");
  identificacion.classList.remove("hidden");
  step2.classList.remove("active");
  step1.classList.add("active");
});
 
document.getElementById("backToEnvio").addEventListener("click", () => {
  pago.classList.add("hidden");
  envio.classList.remove("hidden");
  step3.classList.remove("active");
  step2.classList.add("active");
});
 
btnVolverResumen.addEventListener("click", () => {
  window.location.href = "resumen-carrito.html";
});
 
// --- MENÚ LATERAL ---
const menuBtn = document.querySelector(".menu-btn");
const sideMenu = document.getElementById("side-menu");
const closeMenu = document.getElementById("close-menu");
const overlay = document.getElementById("overlay");
 
menuBtn.addEventListener("click", () => {
  sideMenu.classList.add("open");
  overlay.classList.add("show");
});
closeMenu.addEventListener("click", () => {
  sideMenu.classList.remove("open");
  overlay.classList.remove("show");
});
overlay.addEventListener("click", () => {
  sideMenu.classList.remove("open");
  overlay.classList.remove("show");
});


// --- EXTRAS DINÁMICOS ---
async function cargarExtras() {
  try {
    const response = await fetch('http://localhost:8081/pedido/extras');
    const extras = await response.json();

    const container = document.getElementById('extras-container');
    container.innerHTML = '';

    extras.forEach(extra => {
      // usa la misma normalización que en tu código original
      const nombreNormalizado = extra.nombre.toLowerCase().replace(/\s+/g, '');
      const extraDiv = document.createElement('div');
      extraDiv.classList.add('extra-option');

      extraDiv.innerHTML = `
        <label>
          <input type="checkbox" name="extras" value="${nombreNormalizado}">
          ${extra.nombre}
        </label>
        <span>$${extra.precio.toLocaleString()}</span>
      `;

      container.appendChild(extraDiv);
    });

    // una vez creados todos los inputs, sincronizamos su estado con pedidoFinal
    sincronizarExtrasUI();

    console.log('Extras cargados y UI sincronizada.');

  } catch (error) {
    console.error('Error cargando los extras:', error);
  }
}

 
cargarExtras();


function cargarCiudades() {
    const selectCiudad = document.getElementById('ciudad');

    fetch('http://localhost:8081/pedido/zonas') // <--- URL completa del backend
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar las zonas, status: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            // Limpiar opciones anteriores
            selectCiudad.innerHTML = '<option value="">Selecciona una ciudad</option>';

            // Agregar cada ciudad
            data.forEach(zona => {
                const option = document.createElement('option');
                option.value = zona.nombreZona.toLowerCase();
                option.textContent = zona.nombreZona;
                selectCiudad.appendChild(option);
            });
        })
        .catch(error => console.error('Error cargando zonas:', error));
}

document.addEventListener('DOMContentLoaded', cargarCiudades);

// =========================
// 🔧 CONSTRUCCIÓN DEL JSON FINAL DE PEDIDO (mejorada)
// =========================

// Recuperar el JSON base del carrito (productos)
let pedidoFinal = JSON.parse(localStorage.getItem("pedidoParcial")) || { productos: [] };

// Inicializar campos booleanos por defecto para evitar `undefined`


// Asegurar estructura inicial
pedidoFinal = Object.assign({
  ciudad: pedidoFinal.ciudad || '',
  productos: pedidoFinal.productos || [],
  extras: [] // ✅ ahora es una lista
}, pedidoFinal);


// Guardar helper
function guardarPedido() {
  localStorage.setItem("pedidoFinal", JSON.stringify(pedidoFinal));
}


// Actualizar ciudad seleccionada (ya la tenías)
const selectCiudad = document.getElementById("ciudad");
if (selectCiudad) {
  selectCiudad.addEventListener("change", (e) => {
    pedidoFinal.ciudad = e.target.value;
    console.log("🏙️ Ciudad seleccionada:", pedidoFinal.ciudad);
    guardarPedido();
  });
}



// --- MANEJO DE EXTRAS COMO LISTA ---
document.addEventListener("change", (e) => {
  if (e.target && e.target.name === "extras") {
    const raw = e.target.value || "";
    const normalized = raw.toLowerCase().replace(/\s+/g, '');

    // Si se marca el checkbox ➕ agregar a la lista
    if (e.target.checked) {
      if (!pedidoFinal.extras.includes(normalized)) {
        pedidoFinal.extras.push(normalized);
      }
    } 
    // Si se desmarca ➖ quitarlo de la lista
    else {
      pedidoFinal.extras = pedidoFinal.extras.filter(extra => extra !== normalized);
    }

    console.log("🎁 Lista de extras actualizada:", pedidoFinal.extras);
    guardarPedido();
  }
});


// --- SINCRONIZAR UI ---
function sincronizarExtrasUI() {
  const checks = document.querySelectorAll("input[name='extras']");
  checks.forEach(input => {
    const normalized = input.value.toLowerCase().replace(/\s+/g, '');
    input.checked = pedidoFinal.extras.includes(normalized);
  });
}

// Llamar una vez al cargar
guardarPedido();


