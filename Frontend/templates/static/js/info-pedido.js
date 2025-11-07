// info-pedido.js - Conexión backend y LocalStorage (usuario desde localStorage)
// Ajustes: intenta usar /pedido/calcular-envio si existe, sino fallback con /pedido/calcular-peso o cálculo local.

const API_BASE = "http://localhost:8081"; // ajústalo si tu backend usa otro host/puerto

document.addEventListener("DOMContentLoaded", () => {
  // --- VARIABLES GLOBALES ---
  const subtotalEl = document.getElementById("subtotalResumen");
  const envioEl = document.getElementById("envioResumen");
  const totalEl = document.getElementById("totalResumen");

  const correoUsuarioEl = document.getElementById("correoUsuario");
  const nombreUsuarioEl = document.getElementById("nombreUsuario");

  const btnAgregarDireccion = document.getElementById("btnAgregarDireccion");
  const formNuevaDireccion = document.getElementById("formNuevaDireccion");
  const btnPagar = document.getElementById("btnPagar");
  const btnVolverResumen = document.getElementById("btnVolverResumen");
  const selectCiudad = document.getElementById("ciudad");
  const extrasContainer = document.getElementById("extras-container");

  // --- Cargar pedido parcial existente o crear nuevo ---
  let pedidoFinal = JSON.parse(localStorage.getItem("pedidoParcial")) || {
    productos: [],
    ciudad: "",
    extras: [],
    medioPago: ""
  };

  const btnToEnvio = document.getElementById("toEnvio");
  const btnBackIdent = document.getElementById("backToIdent");
  const btnToPago = document.getElementById("toPago");
  const btnBackEnvio = document.getElementById("backToEnvio");

  // Secciones de pasos
  const identificacionSection = document.getElementById("identificacion-section");
  const envioSection = document.getElementById("envio-section");
  const pagoSection = document.getElementById("pago-section");

  // Indicadores de pasos (círculos)
  const step1 = document.getElementById("step1");
  const step2 = document.getElementById("step2");
  const step3 = document.getElementById("step3");

  // constantes de fallback para estimación local (ajústalas si quieres)
  const COSTO_POR_KG = 1200; // COP por kg (solo si no existe endpoint)
  const EXTRA_BASE_SIMULADO = 0; // si quieres sumar base por extra aparte del precio del extra del backend

  // ======================================================
  // FUNCIONES AUXILIARES
  // ======================================================
  function guardarPedido() {
    localStorage.setItem("pedidoParcial", JSON.stringify(pedidoFinal));
  }

  function leerCarritoLocal() {
    // preferimos 'carrito' (con precios) si existe, sino 'carritoIds' -> intentamos obtener catálogo
    const carrito = JSON.parse(localStorage.getItem("carrito") || "null");
    if (carrito && Array.isArray(carrito.productos)) return carrito.productos;
    // fallback: si solo hay pedidoParcial, devolvemos sus ids (sin precio)
    if (pedidoFinal && Array.isArray(pedidoFinal.productos) && pedidoFinal.productos.length) {
      return pedidoFinal.productos.map(p => ({ idProducto: p.idProducto, cantidad: p.cantidadProducto || p.cantidad || p.cantidadProducto }));
    }
    return [];
  }

  // ======================================================
  // CÁLCULOS: intento BACKEND primero, si no existe usar FALLBACK
  // ======================================================
  async function pedirCalculoEnvioBackend(pedido) {
    // intenta POST /pedido/calcular-envio (muchos proyectos lo exponen); si 404 -> lanzar error para fallback
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE}/pedido/calcular-envio`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify(pedido)
      });
      if (res.status === 404) throw new Error("endpoint-no-existe");
      if (!res.ok) throw new Error(`http:${res.status}`);
      const data = await res.json();
      console.log("✅ Backend /pedido/calcular-envio usado:", data);
      return { ok: true, data };
    } catch (err) {
      console.warn("⚠️ No se pudo usar /pedido/calcular-envio:", err.message || err);
      return { ok: false, error: err };
    }
  }

  async function pedirPesoBackend(pedidoSinCiudad) {
    // intenta POST /pedido/calcular-peso
    try {
      const res = await fetch(`${API_BASE}/pedido/calcular-peso`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedidoSinCiudad)
      });
      if (!res.ok) throw new Error(`http:${res.status}`);
      const peso = await res.json();
      console.log("✅ Backend /pedido/calcular-peso usado:", peso);
      return { ok: true, peso };
    } catch (err) {
      console.warn("⚠️ No se pudo usar /pedido/calcular-peso:", err.message || err);
      return { ok: false, error: err };
    }
  }

  async function fetchZonas() {
    try {
      const res = await fetch(`${API_BASE}/pedido/zonas`);
      if (!res.ok) throw new Error(`http:${res.status}`);
      const zonas = await res.json();
      console.log("✅ Zonas cargadas:", zonas);
      return zonas;
    } catch (err) {
      console.warn("⚠️ No se pudieron cargar zonas:", err);
      return [];
    }
  }

  async function fetchExtras() {
    try {
      const res = await fetch(`${API_BASE}/pedido/extras`);
      if (!res.ok) throw new Error(`http:${res.status}`);
      const extras = await res.json();
      console.log("✅ Extras cargados:", extras);
      return extras;
    } catch (err) {
      console.warn("⚠️ No se pudieron cargar extras:", err);
      return [];
    }
  }

  async function fetchCatalogo() {
    // endpoint que usas en resumen-carrito
    const catalogUrl = `${API_BASE}/QuickCourier/Productos/Catalogo`;
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(catalogUrl, {
        headers: { "Content-Type": "application/json", ...(token ? { "Authorization": `Bearer ${token}` } : {}) }
      });
      if (!res.ok) throw new Error(`http:${res.status}`);
      const catalogo = await res.json();
      console.log("✅ Catálogo cargado:", catalogo.length, "productos");
      return catalogo;
    } catch (err) {
      console.warn("⚠️ No se pudo cargar catálogo:", err);
      return [];
    }
  }

  // calcula subtotal local usando 'carrito' del localStorage o catálogo si hace falta
  async function calcularSubtotalYPrepararPedido() {
    const carritoLocal = JSON.parse(localStorage.getItem("carrito") || "null");
    let productosParaPedido = [];
    let subtotal = 0;

    if (carritoLocal && Array.isArray(carritoLocal.productos) && carritoLocal.productos.length) {
      productosParaPedido = carritoLocal.productos.map(p => {
        const cantidad = p.cantidad || p.cantidadProducto || 1;
        const precio = p.precio || p.precioUniProd || 0;
        subtotal += precio * cantidad;
        // formato esperado por backend: DetalleFacturaDTO -> idProducto y cantidadProducto
        return { idProducto: p.idProducto || p.id || p.id_prod || p.idProducto, cantidadProducto: cantidad };
      });
    } else {
      // fallback: si no hay carrito con precios, tomamos pedidoFinal.productos (ids) y preguntamos catálogo
      const pedidoParcial = JSON.parse(localStorage.getItem("pedidoParcial") || "null");
      const catalogo = await fetchCatalogo();
      if (pedidoParcial && Array.isArray(pedidoParcial.productos)) {
        pedidoParcial.productos.forEach(pp => {
          const cantidad = pp.cantidadProducto || pp.cantidad || 1;
          const prod = catalogo.find(c => String(c.idProducto) === String(pp.idProducto));
          const precio = prod ? (prod.precioUniProd || 0) : 0;
          subtotal += precio * cantidad;
          productosParaPedido.push({ idProducto: pp.idProducto, cantidadProducto: cantidad });
        });
      }
    }

    // actualizar pedidoFinal.productos para que se use al crear
    pedidoFinal.productos = productosParaPedido;
    guardarPedido();

    return { subtotal, productosParaPedido };
  }

  // ======================================================
  // FUNCIÓN PRINCIPAL: calcular y mostrar resumen (usa backend si puede)
  // ======================================================
  async function calcularYMostrarResumen() {
    console.log("🔁 calcularYMostrarResumen iniciado");
    // 1) preparar pedido con productos y subtotal local
    const { subtotal, productosParaPedido } = await calcularSubtotalYPrepararPedido();

    // Mostrar subtotal inmediato (IVA incluido: si quieres mostrar IVA, lo puedes agregar)
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toLocaleString()}`;

    // 2) Preparamos DTO para backend
    const pedidoDTO = {
      ciudad: pedidoFinal.ciudad || "",
      extras: pedidoFinal.extras || [],
      medioPago: pedidoFinal.medioPago || "",
      productos: productosParaPedido
    };

    // 3) Intentamos usar /pedido/calcular-envio directo (backend exacto)
    const intentoEnvio = await pedirCalculoEnvioBackend(pedidoDTO);
    if (intentoEnvio.ok) {
      const data = intentoEnvio.data;
      // Se asume que el backend devuelve campos similares a CalculoEnvioResponseDTO:
      // subtotal (o precio con IVA), costoEnvio (o envio), pesoTotal, totalFinal
      const subtotalBackend = data.subtotal ?? data.precioConIva ?? data.precioDespuesImpuestos ?? subtotal;
      const envioBackend = data.costoEnvio ?? data.envio ?? data.envioConDescuento ?? 0;
      const totalBackend = data.totalFinal ?? data.total ?? subtotalBackend + envioBackend;

      if (subtotalEl) subtotalEl.textContent = `$${Number(subtotalBackend).toLocaleString()}`;
      if (envioEl) envioEl.textContent = `$${Number(envioBackend).toLocaleString()}`;
      if (totalEl) totalEl.textContent = `$${Number(totalBackend).toLocaleString()}`;

      // guardar respuesta parcial si quieres usarla
      localStorage.setItem("pedidoConfirmado", JSON.stringify(data));
      console.log("✅ Resumen actualizado desde backend (calcular-envio).");
      return;
    }

    // 4) Fallback: intentar /pedido/calcular-peso para obtener peso
    let pesoTotal = 0;
    const intentoPeso = await pedirPesoBackend({ productos: productosParaPedido });
    if (intentoPeso.ok) {
      pesoTotal = Number(intentoPeso.peso) || 0;
    } else {
      // 5) Fallback aún: calcular peso localmente desde catálogo
      const catalogo = await fetchCatalogo();
      if (catalogo.length) {
        pesoTotal = productosParaPedido.reduce((acc, p) => {
          const prod = catalogo.find(c => String(c.idProducto) === String(p.idProducto));
          const pesoProd = prod ? (Number(prod.pesoProd) || 0) : 0;
          return acc + pesoProd * (p.cantidadProducto || 1);
        }, 0);
        console.log("✅ Peso calculado localmente desde catálogo:", pesoTotal);
      } else {
        console.warn("⚠️ No se pudo determinar peso (ni backend ni catálogo). Peso asumido 0.");
        pesoTotal = 0;
      }
    }

    // 6) Cargar zonas y extras (si no están en memoria)
    const [zonas, extrasBackend] = await Promise.all([fetchZonas(), fetchExtras()]);

    // 7) Calcular costo de envío estimado:
    // - buscar zona por nombre (pedidoFinal.ciudad)
    let costoZona = 0;
    if (pedidoFinal.ciudad && zonas && zonas.length) {
      const zonaMatch = zonas.find(z => String(z.nombreZona).toLowerCase() === String(pedidoFinal.ciudad).toLowerCase());
      costoZona = zonaMatch ? Number(zonaMatch.precioZona || zonaMatch.precio || 0) : 0;
    }

    // extras: sumar precios de extras seleccionadas (si backend dio precios)
    let costoExtras = 0;
    if (pedidoFinal.extras && pedidoFinal.extras.length && extrasBackend && extrasBackend.length) {
      pedidoFinal.extras.forEach(sel => {
        const match = extrasBackend.find(e => String(e.codigo) === String(sel) || String(e.nombre).toLowerCase() === String(sel).toLowerCase());
        if (match) costoExtras += Number(match.precio || 0);
        else costoExtras += EXTRA_BASE_SIMULADO; // si no encontramos, valor simulado
      });
    }

    // coste por peso fallback
    const costoPorPeso = pesoTotal * COSTO_POR_KG;

    // estimación final
    const envioEstimado = Math.round(costoZona + costoPorPeso + costoExtras);
    const totalEstimado = Math.round(subtotal + envioEstimado);

    if (envioEl) envioEl.textContent = `$${envioEstimado.toLocaleString()}`;
    if (totalEl) totalEl.textContent = `$${totalEstimado.toLocaleString()}`;

    console.log("ℹ️ Resumen estimado (fallback):", { subtotal, envioEstimado, totalEstimado, pesoTotal, costoZona, costoExtras });
  }

  // ======================================================
  // CARGA DINÁMICA DE EXTRAS EN LA UI
  // ======================================================
  async function cargarExtrasUI() {
    const extras = await fetchExtras();
    if (!extrasContainer) return;
    extrasContainer.innerHTML = "";

    extras.forEach(extra => {
      const id = extra.codigo || extra.nombre;
      const div = document.createElement("div");
      div.className = "extra-option";
      div.innerHTML = `
        <label>
          <input type="checkbox" name="extras" value="${id}">
          ${extra.nombre} - $${Number(extra.precio || 0).toLocaleString()}
        </label>
      `;
      extrasContainer.appendChild(div);
    });

    // marcar y escuchar cambios
    document.querySelectorAll("input[name='extras']").forEach(input => {
      input.checked = pedidoFinal.extras?.includes(input.value);
      input.addEventListener("change", async (e) => {
        const val = e.target.value;
        if (e.target.checked) {
          if (!pedidoFinal.extras.includes(val)) pedidoFinal.extras.push(val);
        } else {
          pedidoFinal.extras = pedidoFinal.extras.filter(x => x !== val);
        }
        guardarPedido();
        await calcularYMostrarResumen();
      });
    });
  }

  // ======================================================
  // CARGA DATOS USUARIO (desde localStorage tal como pediste)
  // ======================================================
  function cargarDatosUsuarioDesdeLocal() {
    const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
    if (usuario) {
      if (correoUsuarioEl) correoUsuarioEl.textContent = usuario.correo || "No disponible";
      if (nombreUsuarioEl) nombreUsuarioEl.textContent = usuario.nombre || "Usuario sin nombre";
      console.log("✅ Datos de usuario cargados desde localStorage:", usuario);
      return;
    }

    // Si no existe objeto 'usuario', intentar decodificar accessToken (si prefieres)
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const [, payload] = token.split(".");
        const decoded = JSON.parse(atob(payload));
        if (correoUsuarioEl) correoUsuarioEl.textContent = decoded.correo || decoded.sub || "No disponible";
        if (nombreUsuarioEl) nombreUsuarioEl.textContent = decoded.nombre || decoded.nom || decoded.sub || "Usuario";
        console.log("✅ Datos de usuario decodificados desde token (fallback):", decoded);
      } catch (err) {
        console.warn("⚠️ No se pudo decodificar accessToken:", err);
      }
    } else {
      console.warn("⚠️ No hay datos del usuario en localStorage ni token.");
    }
  }

  // ======================================================
  // EVENTOS DE NAVEGACIÓN ENTRE PASOS
  // ======================================================
  if (btnToEnvio) {
    btnToEnvio.addEventListener("click", () => {
      identificacionSection.classList.add("hidden");
      envioSection.classList.remove("hidden");
      step1.classList.remove("active");
      step2.classList.add("active");
    });
  }

  if (btnBackIdent) {
    btnBackIdent.addEventListener("click", () => {
      envioSection.classList.add("hidden");
      identificacionSection.classList.remove("hidden");
      step2.classList.remove("active");
      step1.classList.add("active");
    });
  }

  if (btnToPago) {
    btnToPago.addEventListener("click", () => {
      envioSection.classList.add("hidden");
      pagoSection.classList.remove("hidden");
      step2.classList.remove("active");
      step3.classList.add("active");
    });
  }

  if (btnBackEnvio) {
    btnBackEnvio.addEventListener("click", () => {
      pagoSection.classList.add("hidden");
      envioSection.classList.remove("hidden");
      step3.classList.remove("active");
      step2.classList.add("active");
    });
  }
  // ======================================================
  // EVENTOS UI
  // ======================================================
  if (btnAgregarDireccion && formNuevaDireccion) {
    btnAgregarDireccion.addEventListener("click", () => {
      formNuevaDireccion.classList.toggle("hidden");
    });
    formNuevaDireccion.addEventListener("submit", (e) => {
      e.preventDefault();
      const ciudad = (document.getElementById("ciudad") || {}).value;
      const direccion = (document.getElementById("direccion") || {}).value || "";
      if (!ciudad || !direccion.trim()) {
        alert("Por favor completa todos los campos obligatorios.");
        return;
      }
      pedidoFinal.ciudad = ciudad;
      guardarPedido();
      calcularYMostrarResumen();
      formNuevaDireccion.classList.add("hidden");
      alert("Dirección guardada.");
    });
  }

  if (selectCiudad) {
    selectCiudad.addEventListener("change", async (e) => {
      pedidoFinal.ciudad = e.target.value;
      guardarPedido();
      await calcularYMostrarResumen();
    });
  }

  // Pago: mantener selección en pedidoFinal
  document.querySelectorAll('input[name="pago"]').forEach(r => {
    r.addEventListener("change", e => {
      pedidoFinal.medioPago = e.target.value;
      guardarPedido();
    });
  });

  // Botón pagar: envía el pedido completo (ya lo tenías así)
  if (btnPagar) {
    btnPagar.addEventListener("click", async () => {
      if (!pedidoFinal.medioPago) {
        alert("Selecciona un método de pago.");
        return;
      }
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("Debes iniciar sesión.");
        return;
      }
      try {
        // asegurar productos en pedidoFinal antes de enviar
        await calcularSubtotalYPrepararPedido();
        const res = await fetch(`${API_BASE}/pedido/crear`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(pedidoFinal)
        });
        if (!res.ok) throw new Error(`http:${res.status}`);
        const data = await res.json();
        localStorage.setItem("pedidoConfirmado", JSON.stringify(data));
        console.log("✅ Pedido creado:", data);
        // redirecciones según método
        if (pedidoFinal.medioPago === "tarjeta") window.location.href = "pago-tarjeta.html";
        else if (pedidoFinal.medioPago === "efecty") window.location.href = "pago-efecty.html";
        else window.location.href = "pago-contraentrega.html";
      } catch (err) {
        console.error("Error creando pedido:", err);
        alert("Error al crear pedido. Revisa consola.");
      }
    });
  }

  // Volver al resumen
  if (btnVolverResumen) {
    btnVolverResumen.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "resumen-carrito.html"; // ajusta ruta si es diferente
    });
  }

  // ======================================================
  // INICIALIZACIÓN
  // ======================================================
  (async function init() {
    cargarDatosUsuarioDesdeLocal();
    await cargarExtrasUI();
    await calcularYMostrarResumen();
    guardarPedido();
  })();
});
