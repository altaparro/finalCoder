let productos = []; 

fetch("http://localhost:6607/api/v1/products/obtenerTodosLosProductos")
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error al obtener productos: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        cargarProductos(data);
        botonesAgregar = document.querySelectorAll(".producto-agregar");
        actualizarBotonesAgregar();
        botonesAgregar.forEach(boton => {
            boton.addEventListener("click", agregarAlCarrito);
        });
    })
    .catch(error => console.error(error.message));

const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
const numerito = document.querySelector("#numerito");

botonesCategorias.forEach(boton => boton.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
}))

const WEBURL="http://localhost:5500/";

async function cargarProductos(responseData) {
    try {
        if (!responseData || !Array.isArray(responseData.body)) {
            console.error('La respuesta no tiene la estructura esperada:', responseData);
            return;
        }

        productos = responseData.body; // Actualiza la variable 'productos'

        contenedorProductos.innerHTML = "";

        for (const producto of productos) {
            const div = document.createElement("div");
            div.classList.add("producto");
            div.innerHTML = `
                <img class="producto-imagen" src="${WEBURL}${producto.imagen}" alt="${producto.product_name}">
                <div class="producto-detalles">
                    <h3 class="producto-titulo">${producto.product_name}</h3>
                    <p class="producto-precio">$${producto.price}</p>
                    <button class="producto-agregar" id="${producto.product_id}">Agregar</button>
                </div>  
            `;

            div.dataset.tipo = producto.tipo; // Agrega la propiedad 'tipo' al producto

            contenedorProductos.append(div);
        }

        actualizarBotonesAgregar();
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}


botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {
        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        if (e.currentTarget.id !== "todos") {
            const tipoCategoria = e.currentTarget.id;
            const productosBoton = Array.from(contenedorProductos.children).filter(producto => producto.dataset.tipo === tipoCategoria);
            cargarProductos(productosBoton);
        } else {
            tituloPrincipal.innerText = "Todos los productos";
            cargarProductos(productos);
        }
    });
});

function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

let productosEnCarrito;

let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarNumerito();
} else {
    productosEnCarrito = [];
}

function alertaOk() {
    Swal.fire({
        position: "center",
        icon: "success",
        title: "El producto se ha agregado con éxito!",
        showConfirmButton: false,
        timer: 1500,
    });
}

function agregarAlCarrito(e) {
    const idBoton = parseInt(e.currentTarget.id, 10);
    console.log('ID del botón:', idBoton);

    console.log('Datos de productos:', productos);

    const productoAgregado = productos.find(producto => producto.product_id === idBoton);
    console.log('Producto encontrado:', productoAgregado);

    if (!productoAgregado) {
        console.error('Producto no encontrado:', idBoton);
        return;
    }

    if(productosEnCarrito.some(producto => producto.product_id === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.product_id === idBoton);
        productosEnCarrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
        alertaOk();
    }

    actualizarNumerito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
}