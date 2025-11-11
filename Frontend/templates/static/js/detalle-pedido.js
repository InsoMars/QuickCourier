document.addEventListener("DOMContentLoaded", () => {
  fetch("http://backend:8081/facturas/ultima")
    .then(response => {
      if (!response.ok) throw new Error("Error al cargar la factura");
      return response.json();
    })
    .then(data => {
      //  Datos del cliente
      document.getElementById("nombreCliente").textContent = data.nombreCliente || "Desconocido";
      document.getElementById("correoCliente").textContent = data.correoCliente || "Sin correo";
      document.getElementById("telefonoCliente").textContent = data.telefonoCliente || "Sin teléfono";
      document.getElementById("zonaEnvio").textContent = data.zonaEnvio || "N/A";

      // Totales
      document.getElementById("costoZona").textContent = (data.costoZona ?? 0).toLocaleString();
      document.getElementById("impuesto").textContent = (data.impuesto ?? 0).toLocaleString();
      document.getElementById("totalFactura").textContent = (data.totalFactura ?? 0).toLocaleString();

      // Productos
      const productosContainer = document.getElementById("productos");
      productosContainer.innerHTML = "";
      data.productos.forEach(prod => {
        const li = document.createElement("li");
        li.textContent = `${prod.nombreProducto} × ${prod.cantidad} — $${prod.subtotal.toLocaleString()}`;
        productosContainer.appendChild(li);
      });

      // Extras
      const extrasContainer = document.getElementById("extras");
      extrasContainer.innerHTML = "";
      data.extras.forEach(extra => {
        const li = document.createElement("li");
        li.textContent = `${extra.nombreExtra} — $${extra.subtotal.toLocaleString()}`;
        extrasContainer.appendChild(li);
      });
    })
    .catch(error => console.error("❌ Error al cargar la factura:", error));



  const btnFinalizar = document.getElementById("btnFinalizar");
  btnFinalizar.addEventListener("click", () => {
    window.location.href = "catalogo.html";
  });
  
  
});
