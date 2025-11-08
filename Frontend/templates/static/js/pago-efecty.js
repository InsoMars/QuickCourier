window.onload = () => {
   

    document.getElementById("reciboContainer")?.classList.add("hidden");

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

   
    if (btnGenerar) {
        btnGenerar.addEventListener("click", async () => {

            if (refRecibo) refRecibo.textContent = codigo;
            if (valorRecibo) valorRecibo.textContent = totalMonto;

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