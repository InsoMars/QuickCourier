window.onload = () => {
  document.getElementById("reciboContainer").classList.add("hidden");
  const codigoRef = document.getElementById("codigoRef");
  const valorPagar = document.getElementById("valorPagar");
  const refRecibo = document.getElementById("refRecibo");
  const valorRecibo = document.getElementById("valorRecibo");
  const btnGenerar = document.getElementById("btnGenerar");
  const btnContinuar = document.getElementById("btnContinuar");
  const pantallaInicial = document.getElementById("pantallaInicial");
  const reciboContainer = document.getElementById("reciboContainer");

  // Simular código de pago
  const codigo = Math.floor(100000 + Math.random() * 900000);
  codigoRef.textContent = codigo;

  // Cargar monto
  const pedidoFinal = JSON.parse(localStorage.getItem("pedidoFinal")) || {};
  valorPagar.textContent = pedidoFinal.total || 0;

  // Generar recibo
  btnGenerar.addEventListener("click", async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("⚠️ No hay sesión activa. Inicia sesión primero.");
      return;
    }

    if (!pedidoFinal) {
      alert("No hay pedido en proceso.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/pedido/crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(pedidoFinal)
      });

      if (response.ok) {
        pantallaInicial.classList.add("hidden");
        reciboContainer.classList.remove("hidden");

        refRecibo.textContent = codigo;
        valorRecibo.textContent = pedidoFinal.total || 0;
      } else {
        alert("❌ Error al registrar el pedido.");
      }
    } catch (error) {
      console.error("⚠️ Error al conectar con el servidor:", error);
      alert("No se pudo registrar el pedido.");
    }
  });

  // Redirigir al detalle
  btnContinuar.addEventListener("click", () => {
    window.location.href = "detalle-pedido.html";
  });
};