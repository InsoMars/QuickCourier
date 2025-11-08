window.onload = () => {
    // Es buena práctica asegurarse de que la pantalla del recibo esté oculta al inicio.
    // Usamos optional chaining (?) para evitar errores si el elemento no existe.
    document.getElementById("reciboContainer")?.classList.add("hidden");

    // Referencias a elementos del DOM
    const codigoRef = document.getElementById("codigoRef");
    const valorPagar = document.getElementById("valorPagar");
    const refRecibo = document.getElementById("refRecibo");
    const valorRecibo = document.getElementById("valorRecibo");
    const btnGenerar = document.getElementById("btnGenerar");
    const btnContinuar = document.getElementById("btnContinuar");
    const pantallaInicial = document.getElementById("pantallaInicial");
    const reciboContainer = document.getElementById("reciboContainer");

    // 1. Generación del Código de Pago (Referencia)
    const codigo = Math.floor(100000 + Math.random() * 900000);
    if (codigoRef) {
        codigoRef.textContent = codigo;
    }

    // 2. Carga y manejo del Monto a Pagar desde localStorage
    // 3. Lógica para Generar Recibo
    if (btnGenerar) {
        btnGenerar.addEventListener("click", async () => {
            // Actualizar los datos del recibo con la información cargada
            if (refRecibo) refRecibo.textContent = codigo;
            if (valorRecibo) valorRecibo.textContent = totalMonto;

            // Transición de pantallas
            if (pantallaInicial) pantallaInicial.classList.add("hidden");
            if (reciboContainer) reciboContainer.classList.remove("hidden");
        });
    }

    // 4. Redirigir al detalle
    if (btnContinuar) {
        btnContinuar.addEventListener("click", () => {
            // Asegúrate de que esta URL sea correcta en tu entorno:
            window.location.href = "detalle-pedido.html";
        });
    }
};