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

// --- BOTÓN NUEVO (ASUME que tienes un botón con id="btnCalcularTarifa") ---
const btnCalcularTarifa = document.getElementById("btnCalcularTarifa");

// --- PASOS ---
const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const step3 = document.getElementById("step3");

// --- RESUMEN ---
const resumenDetalles = document.getElementById("resumen-detalles");

// --- VARIABLES GLOBALES ---
let direccionGuardada = null;
let usuarioEmail = "Usuario NO Autenticado"; // Fallback
let usuarioNombre = "Usuario NO Autenticado"; // Fallback
// Almacenamos el costo de envío actual, inicialmente 0.
let costoEnvioActual = 0; 
let pesoTotalPedido = 0; // 👈 NUEVA VARIABLE GLOBAL PARA EL PESO

// --- REFERENCIAS A PRECIOS EN EL RESUMEN ---
const priceSubtotal = document.querySelector('.summary > p.price:nth-child(2)');
const priceGastosEnvio = document.querySelector('.summary > p.price:nth-child(4)');
const priceTotal = document.querySelector('.total span:nth-child(2)');


// =======================================================
// FUNCIONES DE CÁLCULO Y FORMATO
// =======================================================

/**
 * Función de utilidad para dar formato de moneda a los números.
 */
function formatoMoneda(cantidad) {
    // Usamos 'es-CO' (Colombia) o similar para el formato local.
    return `$${cantidad.toLocaleString('es-CO', { minimumFractionDigits: 0 })}`;
}

/**
 * Calcula la suma total de los productos (Subtotal) y ACTUALIZA el peso total.
 * ⚠️ REQUIERE que el objeto producto en localStorage tenga 'pesoUnitario'.
 */
function calcularSubtotalProductos() {
    const pedidoParcial = JSON.parse(localStorage.getItem("pedidoParcial")) || { productos: [] };
    let subtotal = 0;
    let pesoAcumulado = 0;

    if (pedidoParcial.productos && Array.isArray(pedidoParcial.productos)) {
        pedidoParcial.productos.forEach(producto => {
            const precio = producto.precioUnitario || 0; 
            const cantidad = producto.cantidadProducto || 1;
            const peso = producto.pesoUnitario || 0; // 👈 ASUMIMOS QUE EXISTE
            
            subtotal += precio * cantidad;
            pesoAcumulado += peso * cantidad;
        });
    }

    pesoTotalPedido = parseFloat(pesoAcumulado.toFixed(2)); // Guardar peso redondeado
    console.log(`⚖️ Peso total calculado localmente: ${pesoTotalPedido} kg`);
    return subtotal;
}

/**
 * REPLICA la lógica de TarifaFactory del backend en JavaScript.
 * Esto asume que tienes acceso a las tarifas de todas las ciudades y la lógica de escalonamiento.
 */
function calcularTarifaBaseLocal(ciudad, peso) {
    
    // 1. Normalización de Ciudad (Replicando la lógica de TarifaFactory.java)
    let ciudadNormalizada = ciudad.toLowerCase()
        .replace(/á/g, "a")
        .replace(/é/g, "e")
        .replace(/í/g, "i")
        .replace(/ó/g, "o")
        .replace(/ú/g, "u");

    // 2. Definición de Tarifas Base por Ciudad (Replicando las clases Tarifa[Ciudad].java)
    const tarifasBase = {
        'bogota': 8000, 		// De TarifaBogota.java
        'medellin': 15000, 		// De TarifaMedellin.java
        'bucaramanga': 12000, 	// De TarifaBucaramanga.java
        'cali': 10000, 			// De TarifaCali.java
        'barranquilla': 14000 	// De TarifaBarranquilla.java
    };
    
    // Obtener la tarifa base. Si la ciudad no está soportada, arrojar error o usar una tarifa alta.
    let tarifaBase = tarifasBase[ciudadNormalizada];
    
    if (tarifaBase === undefined) {
        console.error(`Ciudad no soportada en el cálculo local: ${ciudad}`);
        // Puedes lanzar un error o usar una tarifa por defecto, aquí usaremos 20000 como fallback
        tarifaBase = 20000; 
    }

    // 3. Lógica Escalona de Peso (Común en todas tus implementaciones Tarifa[Ciudad])
    let costoAdicional = 0;
    
    if (peso <= 1) {
        costoAdicional = 0;
    } else if (peso <= 2.5) {
        costoAdicional = 2000;
    } else if (peso <= 4) {
        costoAdicional = 5000;
    } else if (peso <= 7) {
        costoAdicional = 8000;
    } else {
        costoAdicional = 12000;
    }

    // 4. Resultado final
    const costoEnvio = tarifaBase + costoAdicional;
    
    console.log(`✅ Cálculo Local: Tarifa Base (${ciudad}): ${formatoMoneda(tarifaBase)}, Costo Adicional (${peso.toFixed(2)}kg): ${formatoMoneda(costoAdicional)}. Total: ${formatoMoneda(costoEnvio)}`);

    return costoEnvio;
}


/**
 * Función principal para actualizar el resumen de precios en el DOM.
 * Ahora usa la variable global costoEnvioActual.
 */
function actualizarResumenPrecios() {
    // 1. Calcular el Subtotal (y actualiza el pesoTotalPedido)
    const subtotal = calcularSubtotalProductos();

    // 2. Obtener el Costo de Envío (Usa la variable global)
    // NOTA: Si esta función se llama después de seleccionar extras, costoEnvioActual ya incluye los extras.
    const gastosEnvio = costoEnvioActual; 

    // 3. Calcular el Total
    const total = subtotal + gastosEnvio;

    // 4. Actualizar la Interfaz
    if (priceSubtotal) {
        priceSubtotal.textContent = formatoMoneda(subtotal);
    }
    if (priceGastosEnvio) {
        priceGastosEnvio.textContent = formatoMoneda(gastosEnvio);
    }
    if (priceTotal) {
        priceTotal.textContent = formatoMoneda(total);
    }

    console.log(`💲 Resumen de precios actualizado: Subtotal: ${formatoMoneda(subtotal)}, Gastos Envío: ${formatoMoneda(gastosEnvio)}, Total: ${formatoMoneda(total)}`);
}


/**
 * Calcula la tarifa de envío base localmente sin llamar al backend.
 * Modificado para usar la lógica local.
 */
async function calcularYActualizarEnvio() {
    const ciudadSeleccionada = pedidoFinal.ciudad;

    if (!ciudadSeleccionada) {
        alert("Por favor, selecciona una ciudad para calcular la tarifa de envío.");
        return;
    }
    
    // 1. Asegurarse que el peso se haya calculado (la llamada a subtotal ya lo hace)
    calcularSubtotalProductos(); 
    
    const pesoTotal = pesoTotalPedido;

    if (pesoTotal <= 0) {
        console.warn("Peso total es cero o no se pudo calcular. Asignando peso de 1kg para cálculo.");
        // Podrías forzar un valor mínimo o usar 1kg para evitar errores.
        // pesoTotal = 1; 
    }

    // 2. Obtener Tarifa usando la función LOCAL
    const costoBaseCalculado = calcularTarifaBaseLocal(ciudadSeleccionada, pesoTotal);

    // **ACTUALIZAR LA VARIABLE GLOBAL**
    // Solo actualizamos el costo de envío base. Los extras se suman en el listener de 'extras'.
    costoEnvioActual = costoBaseCalculado; 
    
    // 3. Actualizar la interfaz y mostrar al usuario
    actualizarResumenPrecios();
    
    alert(`✅ Tarifa de envío para ${ciudadSeleccionada.toUpperCase()} (Peso: ${pesoTotal}kg): ${formatoMoneda(costoEnvioActual)}`);
    
    // 4. Asegurarnos que los extras estén sumados si ya hay alguno seleccionado
    // Esto recalcula el total, asegurando que si ya había extras, se sumen al nuevo costo base.
    document.dispatchEvent(new Event('change'));
}


// =======================================================
// MANEJO DE EVENTOS
// =======================================================

// --- ASIGNAR EVENTO AL BOTÓN DE CALCULAR TARIFA (NUEVO) ---
if (btnCalcularTarifa) {
    btnCalcularTarifa.addEventListener("click", calcularYActualizarEnvio);
}

// ... (El resto del código de JWT, cargarDatosUsuarioDesdeToken, etc. se mantiene) ...

// --- FUNCIÓN DE DECODIFICACIÓN BÁSICA DE JWT (Payload) ---
function decodeJWT(token) {
    try {
        const base64Url = token.split('.')[1];
        if (!base64Url) return null;
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Error al decodificar el token JWT:", e);
        return null;
    }
}

// --- FUNCIÓN PRINCIPAL PARA CARGAR DATOS DE IDENTIFICACIÓN ---
function cargarDatosUsuarioDesdeToken() {
    const accessToken = localStorage.getItem("accessToken");
    let nombreCargado = "Usuario NO Autenticado";
    let emailCargado = "Por favor, inicie sesión";

    if (accessToken) {
        const payload = decodeJWT(accessToken);

        if (payload && payload.sub) {
            emailCargado = payload.sub;
            nombreCargado = payload.nombre || payload.sub; 
            console.log("👤 Datos del usuario (del Token) cargados:", { email: emailCargado, nombre: nombreCargado });
        } else {
            console.error("El token no pudo ser decodificado o está incompleto.");
        }
    }

    usuarioEmail = emailCargado;
    usuarioNombre = nombreCargado;

    let botonSiguiente = identificacion.querySelector('#toEnvio');
    
    let pElements = identificacion.querySelectorAll('p');
    pElements.forEach(p => p.remove());

    const nuevoCorreo = document.createElement('p');
    nuevoCorreo.innerHTML = `<strong>Correo:</strong> ${usuarioEmail}`;
    
    const nuevoNombre = document.createElement('p');
    nuevoNombre.innerHTML = `<strong>Nombre:</strong> ${usuarioNombre}`;

    identificacion.insertBefore(nuevoCorreo, botonSiguiente);
    identificacion.insertBefore(nuevoNombre, botonSiguiente);
}


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

    const nuevaOpcion = document.createElement("label");
    nuevaOpcion.classList.add("address-option");
    nuevaOpcion.innerHTML = `
        <input type="radio" name="direccion" checked />
        ${direccion}, ${ciudad.charAt(0).toUpperCase() + ciudad.slice(1)}
        ${infoExtra ? " - " + infoExtra : ""}
    `;
    btnAgregarDireccion.insertAdjacentElement("beforebegin", nuevaOpcion);
});


// === NAVEGACIÓN ENTRE PASOS (USA VARIABLES GLOBALES RELLENADAS) ===

// 1. Función para avanzar al envío 
function goToEnvio() {
    identificacion.classList.add("hidden");
    envio.classList.remove("hidden");

    step1.classList.replace("active", "done");
    step2.classList.add("active");

    // Borrar el bloque de identificación anterior del resumen para evitar duplicados
    const bloquesExistente = resumenDetalles.querySelectorAll('.resumen-bloque');
    bloquesExistente.forEach(bloque => {
        if (bloque.querySelector('h4')?.textContent.includes('Identificación')) {
            bloque.remove();
        }
    });

    // Usa las variables globales 'usuarioNombre' y 'usuarioEmail' que fueron rellenadas
    resumenDetalles.innerHTML += `
        <div class="resumen-bloque">
            <h4>Identificación</h4>
            <p>${usuarioNombre}</p>
            <p>${usuarioEmail}</p>
        </div>
    `;
}
// 2. Asignar el listener de Siguiente
toEnvio.addEventListener("click", goToEnvio);


// Listener para avanzar al Pago (MODIFICADO para incluir EXTRAS y el Costo Total)
toPago.addEventListener("click", () => {
    envio.classList.add("hidden");
    pago.classList.remove("hidden");

    step2.classList.replace("active", "done");
    step3.classList.add("active");

    // 1. OBTENER LA DIRECCIÓN
    let direccionTexto;
    let ciudadSeleccionada;
    if (direccionGuardada) {
        direccionTexto = `${direccionGuardada.direccion}, ${direccionGuardada.ciudad.toUpperCase()} ${
            direccionGuardada.infoExtra ? "- " + direccionGuardada.infoExtra : ""
        }`;
        ciudadSeleccionada = direccionGuardada.ciudad;
    } else {
        const seleccion = document.querySelector("input[name='direccion']:checked");
        // Asumiendo que la ciudad está en la dirección seleccionada si no se usa el formulario
        // Sería mejor guardar la ciudad en un atributo data-ciudad para evitar parsear el texto.
        // Por ahora, asumimos que pedidoFinal.ciudad ya está populado.
        direccionTexto = seleccion
            ? seleccion.parentElement.textContent.trim()
            : "Dirección no seleccionada";
        ciudadSeleccionada = pedidoFinal.ciudad;
    }
    
    if (costoEnvioActual === 0) {
        // Ejecutar el cálculo si el usuario se saltó el botón y no se autoejecutó en el 'change'
        calcularYActualizarEnvio(); 
    }


    // 2. OBTENER EXTRAS SELECCIONADOS Y CALCULAR COBRO
    let extrasHTML = '';
    const extrasSeleccionados = document.querySelectorAll('input[name="extras"]:checked');
    
    // El costo base es la tarifa calculada por la función calcularYActualizarEnvio (guardada en costoEnvioActual)
    // Reiniciamos el costo final y usamos la tarifa base para sumarle los extras.
    let costoEnvioBase = costoEnvioActual; 
    let costoEnvioFinal = costoEnvioBase;

    extrasSeleccionados.forEach(checkbox => {
        const extraDiv = checkbox.closest('.extra-option');
        const precioSpan = extraDiv.querySelector('span');
        
        // Limpiar y parsear el precio del HTML (ej: "$5.000" -> 5000)
        const precioTexto = precioSpan.textContent.replace('$', '').replace(/\./g, '').replace(',', '');
        const precioExtra = parseInt(precioTexto) || 0;
        
        // Obtener el nombre del extra
        const nombreExtra = checkbox.parentElement.textContent.trim();
        
        costoEnvioFinal += precioExtra;

        // Añadir línea HTML para el extra
        extrasHTML += `<p class="extra-line" style="font-size: 0.85em; margin: 0; padding-left: 10px;">
                                 • ${nombreExtra}: <span style="float: right;">${formatoMoneda(precioExtra)}</span>
                            </p>`;
    });

    // 3. ACTUALIZAR EL RESUMEN LATERAL DEL PEDIDO (Bloque Envío)
    const bloquesExistente = resumenDetalles.querySelectorAll('.resumen-bloque');
    bloquesExistente.forEach(bloque => {
        if (bloque.querySelector('h4')?.textContent.includes('Envío')) {
            bloque.remove();
        }
    });

    resumenDetalles.innerHTML += `
        <div class="resumen-bloque">
            <h4>Envío (${ciudadSeleccionada.toUpperCase()})</h4>
            <p style="font-weight: bold; margin-bottom: 5px;">${direccionTexto}</p>
            <p style="font-size: 0.9em; margin-bottom: 5px;">Peso del envío: ${pesoTotalPedido} kg</p>
            <p>Tarifa Base: <span style="float: right;">${formatoMoneda(costoEnvioBase)}</span></p>
            ${extrasHTML}
            <p style="border-top: 1px dashed #ccc; padding-top: 5px; margin-top: 5px;">
                Costo Total Envío: <strong style="float: right;">${formatoMoneda(costoEnvioFinal)}</strong>
            </p>
        </div>
    `;

    // 4. ACTUALIZAR EL TOTAL GENERAL (EN EL CUADRO DE PRECIOS)
    costoEnvioActual = costoEnvioFinal; // ¡Importante! Actualiza la variable global con los extras sumados
    actualizarResumenPrecios(); // Llama a la función para recalcular el Total
});

// =========================
// 🔧 CONSTRUCCIÓN DEL JSON FINAL DE PEDIDO
// =========================
// 1. Cargar el objeto parcial del localStorage
const pedidoParcial = JSON.parse(localStorage.getItem("pedidoParcial")) || { productos: [] };

// 2. Determinar el valor del método de pago a partir de las dos posibles claves
// Usaremos el valor de 'metodoPago' que se establece en el listener de radio, o buscamos 'medioPago'.
// Si el usuario ya seleccionó un método de pago, este es el valor que debe prevalecer.
const valorPago = pedidoParcial.metodoPago || pedidoParcial.medioPago || '';

// 3. Definir 'pedidoFinal' de forma explícita para evitar que 'medioPago' vacío 
// del localStorage sobrescriba el valor correcto. Usamos 'let' para que pueda 
// ser modificado por los listeners de la interfaz.
let pedidoFinal = {
    // 3a. Valores existentes del pedidoParcial y fallbacks
    ciudad: pedidoParcial.ciudad || 'bogotá',
    productos: pedidoParcial.productos || [],
    extras: pedidoParcial.extras || [],
    
    // 3b. Asignamos el valor de pago a AMBOS campos con el valor seguro, 
    // garantizando que el backend siempre reciba una clave no nula con el valor correcto.
    metodoPago: valorPago,
    medioPago: valorPago 
};

// Guardar helper
function guardarPedido() {
    // Cuando guardamos, guardamos el estado actual de la interfaz (metodoPago, ciudad, extras)
    // Usamos el objeto pedidoFinal (que es mutable con let)
    localStorage.setItem("pedidoParcial", JSON.stringify(pedidoFinal));
}

// --- CIUDADES ---
function cargarCiudades() {
    const selectCiudad = document.getElementById('ciudad');
    fetch('http://localhost:8081/pedido/zonas')
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar las zonas, status: ' + response.status);
            return response.json();
        })
        .then(data => {
            selectCiudad.innerHTML = '<option value="">Selecciona una ciudad</option>';
            data.forEach(zona => {
                const option = document.createElement('option');
                option.value = zona.nombreZona.toLowerCase();
                option.textContent = zona.nombreZona;
                selectCiudad.appendChild(option);
            });
            // Si ya hay una ciudad en pedidoFinal, seleccionarla
            if (pedidoFinal.ciudad) {
                selectCiudad.value = pedidoFinal.ciudad;
                // ⚠️ AUTOCÁLCULO AL INICIAR SI YA HAY CIUDAD
                calcularYActualizarEnvio();
            }
        })
        .catch(error => console.error('Error cargando zonas:', error));
}


// --- ACTUALIZAR CIUDAD ---
const selectCiudad = document.getElementById("ciudad");
if (selectCiudad) {
    selectCiudad.addEventListener("change", (e) => {
        pedidoFinal.ciudad = e.target.value;
        console.log("🏙️ Ciudad seleccionada:", pedidoFinal.ciudad);
        guardarPedido();
        // 🚨 AUTOCÁLCULO: Llamar automáticamente a la función de cálculo local
        if (pedidoFinal.ciudad) {
            calcularYActualizarEnvio(); 
        } else {
            // Si deseleccionan la ciudad, poner el costo a 0
            costoEnvioActual = 0;
            actualizarResumenPrecios();
        }
    });
}

// --- MEDIO DE PAGO ---
const radiosPago = document.querySelectorAll('input[name="pago"]');
radiosPago.forEach(radio => {
    radio.addEventListener("change", (e) => {
        // Al seleccionar, se actualiza el campo principal que se guarda en localStorage
        pedidoFinal.metodoPago = e.target.value;
        // También actualizamos el campo alternativo en la memoria (pedidoFinal)
        pedidoFinal.medioPago = e.target.value; 
        
        console.log("💳 Medio de pago seleccionado:", pedidoFinal.metodoPago);
        guardarPedido();
        
        // Sincronizar el radio seleccionado
        sincronizarPagoUI(e.target.value);
    });
});

// Función para sincronizar el estado del radio (útil si se carga desde localStorage)
function sincronizarPagoUI(valorPago) {
    radiosPago.forEach(radio => {
        if (radio.value === valorPago) {
            radio.checked = true;
        }
    });
}


// --- MANEJO DE EXTRAS ---
document.addEventListener("change", (e) => {
    if (e.target && e.target.name === "extras") {
        const raw = e.target.value || "";
        const normalized = raw.toLowerCase().replace(/\s+/g, '');

        if (e.target.checked) {
            if (!pedidoFinal.extras.includes(normalized)) pedidoFinal.extras.push(normalized);
        } else {
            pedidoFinal.extras = pedidoFinal.extras.filter(extra => extra !== normalized);
        }

        console.log("🎁 Lista de extras actualizada:", pedidoFinal.extras);
        guardarPedido();
        
        // Re-calcular el total en el resumen cuando se selecciona o deselecciona un extra
        const subtotal = calcularSubtotalProductos();
        
        // La TARIFA BASE ya está en costoEnvioActual. Solo sumamos los extras AHORA.
        let costoBaseMasExtras = costoEnvioActual; 

        document.querySelectorAll('input[name="extras"]:checked').forEach(checkbox => {
            const extraDiv = checkbox.closest('.extra-option');
            const precioSpan = extraDiv.querySelector('span');
            const precioTexto = precioSpan.textContent.replace('$', '').replace(/\./g, '').replace(',', '');
            const precioExtra = parseInt(precioTexto) || 0;
            costoBaseMasExtras += precioExtra; // Sumar el costo del extra
        });

        const totalGastosEnvio = costoBaseMasExtras;
        
        // ACTUALIZAMOS LAS REFERENCIAS DEL DOM
        if (priceGastosEnvio) priceGastosEnvio.textContent = formatoMoneda(totalGastosEnvio);
        if (priceTotal) priceTotal.textContent = formatoMoneda(subtotal + totalGastosEnvio);
    }
});

function sincronizarExtrasUI() {
    const checks = document.querySelectorAll("input[name='extras']");
    checks.forEach(input => {
        const normalized = input.value.toLowerCase().replace(/\s+/g, '');
        input.checked = pedidoFinal.extras.includes(normalized);
    });
}

// --- CARGAR EXTRAS ---
async function cargarExtras() {
    try {
        const response = await fetch('http://localhost:8081/pedido/extras');
        const extras = await response.json();
        const container = document.getElementById('extras-container');
        container.innerHTML = '';

        extras.forEach(extra => {
            const nombreNormalizado = extra.codigo;
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

        sincronizarExtrasUI();
        console.log('Extras cargados y UI sincronizada.');
    } catch (error) {
        console.error('Error cargando los extras:', error);
    }
}


// --- PAGO Y ENVÍO AL BACKEND ---
btnPagar.addEventListener("click", async () => {
    // 1. Guardar el método de pago
    const metodoSeleccionado = document.querySelector("input[name='pago']:checked")?.value || "No seleccionado";
    pedidoFinal.metodoPago = metodoSeleccionado;
    pedidoFinal.medioPago = metodoSeleccionado;
    guardarPedido();

    // 2. Mostrar en el resumen lateral
    resumenDetalles.innerHTML += `
        <div class="resumen-bloque">
            <h4>Pago</h4>
            <p>Método: ${metodoSeleccionado}</p>
        </div>
    `;

    // 3. Determinar la URL de redirección según el método de pago
    let urlRedireccion = "";
    switch (metodoSeleccionado.toLowerCase()) {
        case "contraentrega":
            urlRedireccion = "pago-contraentrega.html";
            break;
        case "tarjeta":
            urlRedireccion = "pago-tarjeta.html";
            break;
        case "efecty":
            urlRedireccion = "pago-efecty.html";
            break;
        default:
            alert("Por favor selecciona un método de pago válido.");
            return; // Salir si no hay método de pago
    }

    try {
        // 4. Enviar el pedido al backend
        const accessToken = localStorage.getItem("accessToken");

        const response = await fetch("http://localhost:8081/pedido/crear", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}` 
            },
            body: JSON.stringify(pedidoFinal)
        });

        if (response.ok) {
            const data = await response.json();
            console.log("✅ Pedido creado con éxito:", data);
            // 5. Redirigir al usuario según el método de pago
            window.location.href = urlRedireccion;
        } else {
            console.error("❌ Error al enviar pedido:", response.status);
            alert("Error al registrar el pedido.");
        }
    } catch (error) {
        console.error("⚠️ Error de conexión:", error);
        alert("Error de conexión al registrar el pedido.");
    }
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

// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    cargarCiudades(); 
    cargarExtras(); 
    cargarDatosUsuarioDesdeToken(); 
    actualizarResumenPrecios(); // Se llama inicialmente para mostrar Subtotal y Envío ($0)
    sincronizarPagoUI(pedidoFinal.metodoPago); // Sincroniza el radio de pago
});

guardarPedido();