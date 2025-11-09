const identificacion = document.getElementById("identificacion-section");
const envio = document.getElementById("envio-section");
const pago = document.getElementById("pago-section");

const toEnvio = document.getElementById("toEnvio");
const toPago = document.getElementById("toPago");
const btnPagar = document.getElementById("btnPagar");
const btnAgregarDireccion = document.getElementById("btnAgregarDireccion");
const formNuevaDireccion = document.getElementById("formNuevaDireccion");
const btnVolverResumen = document.getElementById("btnVolverResumen");

const btnCalcularTarifa = document.getElementById("btnCalcularTarifa");

const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const step3 = document.getElementById("step3");

const resumenDetalles = document.getElementById("resumen-detalles");

let direccionGuardada = null;
let usuarioEmail = "Usuario NO Autenticado";
let usuarioNombre = "Usuario NO Autenticado";
let costoEnvioActual = 0; 
let pesoTotalPedido = 0;

const priceSubtotal = document.querySelector('.summary > p.price:nth-child(2)');
const priceGastosEnvio = document.querySelector('.summary > p.price:nth-child(4)');
const priceTotal = document.querySelector('.total span:nth-child(2)');

function formatoMoneda(cantidad) {
    return `$${cantidad.toLocaleString('es-CO', { minimumFractionDigits: 0 })}`;
}

function calcularSubtotalProductos() {
    const pedidoParcial = JSON.parse(localStorage.getItem("pedidoParcial")) || { productos: [] };
    let subtotal = 0;
    let pesoAcumulado = 0;

    if (pedidoParcial.productos && Array.isArray(pedidoParcial.productos)) {
        pedidoParcial.productos.forEach(producto => {
            const precio = producto.precioUnitario || 0; 
            const cantidad = producto.cantidadProducto || 1;
            const peso = producto.pesoUnitario || 0;
            
            subtotal += precio * cantidad;
            pesoAcumulado += peso * cantidad;
        });
    }

    pesoTotalPedido = parseFloat(pesoAcumulado.toFixed(2));
    console.log(`Peso total calculado localmente: ${pesoTotalPedido} kg`);
    return subtotal;
}

function calcularTarifaBaseLocal(ciudad, peso) {
    let ciudadNormalizada = ciudad.toLowerCase()
        .replace(/á/g, "a")
        .replace(/é/g, "e")
        .replace(/í/g, "i")
        .replace(/ó/g, "o")
        .replace(/ú/g, "u");

    const tarifasBase = {
        'bogota': 8000,
        'medellin': 15000,
        'bucaramanga': 12000,
        'cali': 10000,
        'barranquilla': 14000
    };
    
    let tarifaBase = tarifasBase[ciudadNormalizada];
    
    if (tarifaBase === undefined) {
        console.error(`Ciudad no soportada en el cálculo local: ${ciudad}`);
        tarifaBase = 20000; 
    }

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

    const costoEnvio = tarifaBase + costoAdicional;
    
    console.log(`Cálculo Local: Tarifa Base (${ciudad}): ${formatoMoneda(tarifaBase)}, Costo Adicional (${peso.toFixed(2)}kg): ${formatoMoneda(costoAdicional)}. Total: ${formatoMoneda(costoEnvio)}`);

    return costoEnvio;
}

function actualizarResumenPrecios() {
    const subtotal = calcularSubtotalProductos();
    const gastosEnvio = costoEnvioActual; 
    const total = subtotal + gastosEnvio;

    if (priceSubtotal) {
        priceSubtotal.textContent = formatoMoneda(subtotal);
    }
    if (priceGastosEnvio) {
        priceGastosEnvio.textContent = formatoMoneda(gastosEnvio);
    }
    if (priceTotal) {
        priceTotal.textContent = formatoMoneda(total);
    }

    console.log(`Resumen de precios actualizado: Subtotal: ${formatoMoneda(subtotal)}, Gastos Envío: ${formatoMoneda(gastosEnvio)}, Total: ${formatoMoneda(total)}`);
}

async function calcularYActualizarEnvio() {
    const ciudadSeleccionada = pedidoFinal.ciudad;

    if (!ciudadSeleccionada) {
        alert("Por favor, selecciona una ciudad para calcular la tarifa de envío.");
        return;
    }
    
    calcularSubtotalProductos(); 
    
    const pesoTotal = pesoTotalPedido;

    if (pesoTotal <= 0) {
        console.warn("Peso total es cero o no se pudo calcular. Asignando peso de 1kg para cálculo.");
    }

    const costoBaseCalculado = calcularTarifaBaseLocal(ciudadSeleccionada, pesoTotal);
    costoEnvioActual = costoBaseCalculado; 
    actualizarResumenPrecios();
    
    alert(`Tarifa de envío para ${ciudadSeleccionada.toUpperCase()} (Peso: ${pesoTotal}kg): ${formatoMoneda(costoEnvioActual)}`);
    document.dispatchEvent(new Event('change'));
}

if (btnCalcularTarifa) {
    btnCalcularTarifa.addEventListener("click", calcularYActualizarEnvio);
}

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

function cargarDatosUsuarioDesdeToken() {
    const accessToken = localStorage.getItem("accessToken");
    let nombreCargado = "Usuario NO Autenticado";
    let emailCargado = "Por favor, inicie sesión";

    if (accessToken) {
        const payload = decodeJWT(accessToken);

        if (payload && payload.sub) {
            emailCargado = payload.sub;
            nombreCargado = payload.nombre || payload.sub; 
            console.log("Datos del usuario (del Token) cargados:", { email: emailCargado, nombre: nombreCargado });
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

btnAgregarDireccion.addEventListener("click", () => {
    formNuevaDireccion.classList.toggle("hidden");
});

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

function goToEnvio() {
    identificacion.classList.add("hidden");
    envio.classList.remove("hidden");

    step1.classList.replace("active", "done");
    step2.classList.add("active");

    const bloquesExistente = resumenDetalles.querySelectorAll('.resumen-bloque');
    bloquesExistente.forEach(bloque => {
        if (bloque.querySelector('h4')?.textContent.includes('Identificación')) {
            bloque.remove();
        }
    });

    resumenDetalles.innerHTML += `
        <div class="resumen-bloque">
            <h4>Identificación</h4>
            <p>${usuarioNombre}</p>
            <p>${usuarioEmail}</p>
        </div>
    `;
}

toEnvio.addEventListener("click", goToEnvio);

toPago.addEventListener("click", () => {
    envio.classList.add("hidden");
    pago.classList.remove("hidden");

    step2.classList.replace("active", "done");
    step3.classList.add("active");

    let direccionTexto;
    let ciudadSeleccionada;
    if (direccionGuardada) {
        direccionTexto = `${direccionGuardada.direccion}, ${direccionGuardada.ciudad.toUpperCase()} ${
            direccionGuardada.infoExtra ? "- " + direccionGuardada.infoExtra : ""
        }`;
        ciudadSeleccionada = direccionGuardada.ciudad;
    } else {
        const seleccion = document.querySelector("input[name='direccion']:checked");
        direccionTexto = seleccion
            ? seleccion.parentElement.textContent.trim()
            : "Dirección no seleccionada";
        ciudadSeleccionada = pedidoFinal.ciudad;
    }
    
    if (costoEnvioActual === 0) {
        calcularYActualizarEnvio(); 
    }

    let extrasHTML = '';
    const extrasSeleccionados = document.querySelectorAll('input[name="extras"]:checked');
    let costoEnvioBase = costoEnvioActual; 
    let costoEnvioFinal = costoEnvioBase;

    extrasSeleccionados.forEach(checkbox => {
        const extraDiv = checkbox.closest('.extra-option');
        const precioSpan = extraDiv.querySelector('span');
        const precioTexto = precioSpan.textContent.replace('$', '').replace(/\./g, '').replace(',', '');
        const precioExtra = parseInt(precioTexto) || 0;
        const nombreExtra = checkbox.parentElement.textContent.trim();
        costoEnvioFinal += precioExtra;
        extrasHTML += `<p class="extra-line" style="font-size: 0.85em; margin: 0; padding-left: 10px;">
                                 • ${nombreExtra}: <span style="float: right;">${formatoMoneda(precioExtra)}</span>
                            </p>`;
    });

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

    costoEnvioActual = costoEnvioFinal; 
    actualizarResumenPrecios(); 
});

const pedidoParcial = JSON.parse(localStorage.getItem("pedidoParcial")) || { productos: [] };
const valorPago = pedidoParcial.metodoPago || pedidoParcial.medioPago || '';

let pedidoFinal = {
    ciudad: pedidoParcial.ciudad,
    productos: pedidoParcial.productos || [],
    extras: pedidoParcial.extras || [],
    metodoPago: valorPago,
    medioPago: valorPago 
};

function guardarPedido() {
    localStorage.setItem("pedidoParcial", JSON.stringify(pedidoFinal));
}

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
            if (pedidoFinal.ciudad) {
                selectCiudad.value = pedidoFinal.ciudad;
                calcularYActualizarEnvio();
            }
        })
        .catch(error => console.error('Error cargando zonas:', error));
}

const selectCiudad = document.getElementById("ciudad");
if (selectCiudad) {
    selectCiudad.addEventListener("change", (e) => {
        pedidoFinal.ciudad = e.target.value;
        console.log("Ciudad seleccionada:", pedidoFinal.ciudad);
        guardarPedido();
        if (pedidoFinal.ciudad) {
            calcularYActualizarEnvio(); 
        } else {
            costoEnvioActual = 0;
            actualizarResumenPrecios();
        }
    });
}

const radiosPago = document.querySelectorAll('input[name="pago"]');
radiosPago.forEach(radio => {
    radio.addEventListener("change", (e) => {
        pedidoFinal.metodoPago = e.target.value;
        pedidoFinal.medioPago = e.target.value; 
        console.log("Medio de pago seleccionado:", pedidoFinal.metodoPago);
        guardarPedido();
        sincronizarPagoUI(e.target.value);
    });
});

function sincronizarPagoUI(valorPago) {
    radiosPago.forEach(radio => {
        if (radio.value === valorPago) {
            radio.checked = true;
        }
    });
}

document.addEventListener("change", (e) => {
    if (e.target && e.target.name === "extras") {
        const raw = e.target.value || "";
        const normalized = raw.toLowerCase().replace(/\s+/g, '');

        if (e.target.checked) {
            if (!pedidoFinal.extras.includes(normalized)) pedidoFinal.extras.push(normalized);
        } else {
            pedidoFinal.extras = pedidoFinal.extras.filter(extra => extra !== normalized);
        }

        console.log("Lista de extras actualizada:", pedidoFinal.extras);
        guardarPedido();
        
        const subtotal = calcularSubtotalProductos();
        let costoBaseMasExtras = costoEnvioActual; 

        document.querySelectorAll('input[name="extras"]:checked').forEach(checkbox => {
            const extraDiv = checkbox.closest('.extra-option');
            const precioSpan = extraDiv.querySelector('span');
            const precioTexto = precioSpan.textContent.replace('$', '').replace(/\./g, '').replace(',', '');
            const precioExtra = parseInt(precioTexto) || 0;
            costoBaseMasExtras += precioExtra; 
        });

        const totalGastosEnvio = costoBaseMasExtras;
        
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

btnPagar.addEventListener("click", async () => {
    const metodoSeleccionado = document.querySelector("input[name='pago']:checked")?.value || "No seleccionado";
    pedidoFinal.metodoPago = metodoSeleccionado;
    pedidoFinal.medioPago = metodoSeleccionado;
    guardarPedido();

    resumenDetalles.innerHTML += `
        <div class="resumen-bloque">
            <h4>Pago</h4>
            <p>Método: ${metodoSeleccionado}</p>
        </div>
    `;

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
            return;
    }

    try {
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
            console.log("Pedido creado con éxito:", data);

            if (data.codigoPago) {
                localStorage.setItem("codigoPagoEfecty", data.codigoPago);
                console.log("Código de pago Efecty guardado:", data.codigoPago);
            }

            window.location.href = urlRedireccion;
        } else {
            console.error("Error al enviar pedido:", response.status);
            alert("Error al registrar el pedido.");
        }
    } catch (error) {
        console.error("Error de conexión:", error);
        alert("Error de conexión al registrar el pedido.");
    }
});

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

document.addEventListener('DOMContentLoaded', () => {
    cargarCiudades(); 
    cargarExtras(); 
    cargarDatosUsuarioDesdeToken(); 
    actualizarResumenPrecios();
    sincronizarPagoUI(pedidoFinal.metodoPago);
});

guardarPedido();
