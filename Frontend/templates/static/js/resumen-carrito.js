console.log(" resumen-carrito.js cargado correctamente");


const API_URL = 'http://localhost:8081/QuickCourier/Productos/Catalogo'; 

const tbody = document.getElementById('resumen-carrito-body');
const subtotalSpan = document.getElementById('resumen-carrito-subtotal');
const totalSpan = document.getElementById('resumen-carrito-total');
const countSpan = document.getElementById('resumen-carrito-count');


async function logoutUser() {
    const accessToken = localStorage.getItem('accessToken');
    
   
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('carritoIds'); 
    
 
    if (accessToken) {
        try {
            const LOGOUT_URL = 'http://localhost:8081/auth/logout';
            await fetch(LOGOUT_URL, {
                method: 'POST', 
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
        } catch (error) {
            console.error("Error al notificar logout al servidor:", error);
        }
    }
}



document.addEventListener('DOMContentLoaded', () => {

    // cargar el resumen del carrito e inhabilitar el boton de pago
    cargarResumenDelCarrito();
    actualizarEstadoBotonPago(); 
});


async function cargarResumenDelCarrito() {
  const mainContainer = document.querySelector("main.resumen-carrito-main");
  const accessToken = localStorage.getItem('accessToken'); 

  if (!accessToken) {
    mainContainer.innerHTML = "<p class='text-center text-red-600' style='padding: 2rem;'>Debes iniciar sesión para ver tu carrito. Redirigiendo...</p>";
    setTimeout(() => {
      window.location.href = '/frontend/templates/index.html'; 
    }, 2000);
    return;
  }

  try {

  
    const idsEnCarrito = JSON.parse(localStorage.getItem('carritoIds') || '[]');

    if (!idsEnCarrito.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center; padding: 20px;">
            🛒 Tu carrito está vacío.<br>
            <a href="catalogo.html" style="color:#007bff; text-decoration:underline;">¡Agrega productos!</a>
          </td>
        </tr>`;
      
      subtotalSpan.textContent = "$0";
      document.getElementById("resumen-carrito-peso").textContent = "0 kg";
      countSpan.textContent = "0";
      localStorage.removeItem("pedidoParcial");
      actualizarEstadoBotonPago();
      return;
    }

    // traer el catalogo desde el back

    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        console.error('Token inválido/expirado al cargar carrito:', response.status);
        mainContainer.innerHTML = "<p class='text-center text-red-600' style='padding: 2rem;'>Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.</p>";
        await logoutUser();
        setTimeout(() => {
          window.location.href = '/frontend/templates/index.html';
        }, 2000);
        return;
      }
      throw new Error(`Error HTTP: ${response.status}`);
    }

    
    const todosLosProductos = await response.json();
    const resumenCarrito = agruparProductosYContar(idsEnCarrito, todosLosProductos);


    renderCarrito(resumenCarrito);
    actualizarEstadoBotonPago();

  } catch (error) {
    console.error(' Error al cargar el resumen del carrito:', error);
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; padding: 20px; color: #dc3545;">
           Error al cargar el carrito. Intenta más tarde.
        </td>
      </tr>`;
    subtotalSpan.textContent = "$0";
    document.getElementById("resumen-carrito-peso").textContent = "0 kg";
    countSpan.textContent = "0";
    actualizarEstadoBotonPago();
  }
}


function agruparProductosYContar(idsEnCarrito, todosLosProductos) {
    const resumen = {};
    
    const mapaProductos = new Map(todosLosProductos.map(p => [String(p.idProducto), p]));

   
    idsEnCarrito.forEach(id => {
        const idString = String(id);
        const detalles = mapaProductos.get(idString);
        
        if (detalles) {
            if (!resumen[idString]) {
                
                resumen[idString] = { 
                    ...detalles, 
                    cantidad: 1 
                };
            } else {
              
                resumen[idString].cantidad += 1;
            }
        }
    });

    
    return Object.values(resumen);
}



async function renderCarrito(productosEnCarrito) {
  tbody.innerHTML = '';
  let subtotal = 0;
  let totalProductos = 0;
  let pesoTotal = 0;

  productosEnCarrito.forEach((producto) => {
    const precioUnitario = producto.precioUniProd;
    const cantidad = producto.cantidad;
    const peso = producto.pesoProd || 0;
    const precioTotalProducto = precioUnitario * cantidad;
    const pesoTotalProducto = peso * cantidad;

    subtotal += precioTotalProducto;
    totalProductos += cantidad;
    pesoTotal += pesoTotalProducto;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>
        <div class="product-info-wrap">
          <img src="${producto.rutaImagen}" alt="${producto.nombreProd}"> 
          <div>
            <strong>${producto.nombreProd}</strong><br>
            <small>${producto.descripcionProd}</small>
          </div>
        </div>
      </td>
      <td>$${precioUnitario.toLocaleString()}</td>
      <td>${peso.toFixed(2)} kg</td>
      <td>
        <div class="cantidad-controls">
          <button class="control-btn minus-btn" data-id="${producto.idProducto}">-</button>
          <span class="cantidad-display">${cantidad}</span>
          <button class="control-btn plus-btn" data-id="${producto.idProducto}">+</button>
        </div>
      </td>
      <td><button class="remove-all-btn" data-id="${producto.idProducto}">Eliminar</button></td>
    `;
    tbody.appendChild(row);
  });
  
  // pedido parcial con los productos cantidades y peso

  const pedidoParcial = {
    productos: productosEnCarrito.map(p => ({
      idProducto: p.idProducto,
      cantidadProducto: p.cantidad,
      precioUnitario: p.precioUniProd,
      pesoUnitario: p.pesoProd
    }))
  };
  localStorage.setItem("pedidoParcial", JSON.stringify(pedidoParcial));

  subtotalSpan.textContent = `$${subtotal.toLocaleString()}`;
  countSpan.textContent = totalProductos;
  document.getElementById('resumen-carrito-peso').textContent = `${pesoTotal.toFixed(2)} kg`;


}


async function calcularEnvio(productos, pesoCalculadoLocal) {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) return 0;

  const datosEnvio = {
    ciudad:null,
    empaqueRegalo: false,
    envioExpress: false,
    envioSeguro: false,
    manejoFragil: false,
    productos: productos.map(p => ({
      idProducto: p.idProducto,
      cantidadProducto: p.cantidad
    }))
  };

  try {
    const response = await fetch("http://localhost:8081/pedido/calcular-envio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify(datosEnvio)
    });

    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    const data = await response.json();

    // mostrar el peso total en el HTML
    const pesoSpan = document.getElementById('resumen-carrito-peso');
    pesoSpan.textContent = `${(data.pesoTotal ?? pesoCalculadoLocal).toFixed(2)} kg`;

 
    if (data.totalFinal) {
      subtotalSpan.textContent = `$${data.totalFinal.toLocaleString()}`;
    }

    return data.totalFinal || 0;

  } catch (error) {
    console.error("Error al calcular envío:", error);
    return 0;
  }
}



function actualizarTotales(subtotal, totalProductos) {
    subtotalSpan.textContent = `$${subtotal.toLocaleString()}`;
    totalSpan.textContent = `$${subtotal.toLocaleString()}`;
    countSpan.textContent = totalProductos; 
}


// lógica para aumentar, disminuir y eliminar productos desde el carrito

function aumentarCantidad(id) {
    const idsEnCarrito = JSON.parse(localStorage.getItem('carritoIds') || '[]');
    idsEnCarrito.push(id);
    localStorage.setItem('carritoIds', JSON.stringify(idsEnCarrito));
    cargarResumenDelCarrito();
}


function disminuirCantidad(id) {
    let idsEnCarrito = JSON.parse(localStorage.getItem('carritoIds') || '[]');
    
    const indexToRemove = idsEnCarrito.findIndex(itemId => itemId === id);
    
    if (indexToRemove !== -1) {
        idsEnCarrito.splice(indexToRemove, 1); 
        localStorage.setItem('carritoIds', JSON.stringify(idsEnCarrito));
        cargarResumenDelCarrito();
    } else {
       
        console.warn(`Intento de disminuir la cantidad de ID ${id}, pero no se encontró en el carrito.`);
    }
}


function eliminarProducto(id) {
    let idsEnCarrito = JSON.parse(localStorage.getItem('carritoIds') || '[]');
    
    
    idsEnCarrito = idsEnCarrito.filter(itemId => itemId !== id);
    
    localStorage.setItem('carritoIds', JSON.stringify(idsEnCarrito));

    cargarResumenDelCarrito();
}



document.addEventListener("click", (e) => {
    const target = e.target;
    const id = target.getAttribute("data-id");

    if (!id) return; 

    if (target.classList.contains("plus-btn")) {
        aumentarCantidad(id);
    } else if (target.classList.contains("minus-btn")) {
        disminuirCantidad(id);
    } else if (target.classList.contains("remove-all-btn")) {
        eliminarProducto(id);
    }
    
});


// side bar menu 

const menuBtn = document.querySelector(".menu-btn");
const sideMenu = document.getElementById("side-menu");
const closeMenu = document.getElementById("close-menu");
const overlay = document.getElementById("overlay");
const logoutBtn = document.getElementById("logoutBtn"); 


if (menuBtn && sideMenu && closeMenu && overlay) {
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
}


if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        await logoutUser();
        console.log("Sesión cerrada correctamente desde el carrito."); 
        window.location.href = '/frontend/templates/index.html';
    });
}



// deshabilitar el boton de pago en tanto no hayan productos en el carrito

function actualizarEstadoBotonPago() {
  const botonPagar = document.getElementById("resumen-carrito-pagar");
  const idsEnCarrito = JSON.parse(localStorage.getItem("carritoIds") || "[]");

  if (!idsEnCarrito.length) {
    botonPagar.classList.add("disabled");
    botonPagar.style.pointerEvents = "none"; 
    botonPagar.style.opacity = "0.5"; 
    botonPagar.title = "Agrega productos para continuar con el pago";
  } else {
    botonPagar.classList.remove("disabled");
    botonPagar.style.pointerEvents = "auto";
    botonPagar.style.opacity = "1";
    botonPagar.removeAttribute("title");
  }
}

document.addEventListener("DOMContentLoaded", actualizarEstadoBotonPago);
window.addEventListener("storage", actualizarEstadoBotonPago);