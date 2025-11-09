window.onload = () => {
    const codigoGenerado = localStorage.getItem("codigoPagoEfecty");
    const totalMonto = localStorage.getItem("totalPedido") || "0";

    document.getElementById("reciboContainer")?.classList.add("hidden");

    const codigoRef = document.getElementById("codigoRef");
    const valorPagar = document.getElementById("valorPagar");
    const refRecibo = document.getElementById("refRecibo");
    const valorRecibo = document.getElementById("valorRecibo");
    const btnGenerar = document.getElementById("btnGenerar");
    const btnContinuar = document.getElementById("btnContinuar");
    const pantallaInicial = document.getElementById("pantallaInicial");
    const reciboContainer = document.getElementById("reciboContainer");

    if (codigoRef && codigoGenerado) {
        codigoRef.textContent = codigoGenerado;
    }

    if (btnGenerar) {
        btnGenerar.addEventListener("click", async () => {
            if (refRecibo) refRecibo.textContent = codigoGenerado || "EF-000000";
            if (valorRecibo) valorRecibo.textContent = `$${parseInt(totalMonto).toLocaleString('es-CO')}`;

            if (pantallaInicial) pantallaInicial.classList.add("hidden");
            if (reciboContainer) reciboContainer.classList.remove("hidden");
        });
    }

    if (btnContinuar) {
        btnContinuar.addEventListener("click", () => {
            window.location.href = "detalle-pedido.html";
        });
    }
};
