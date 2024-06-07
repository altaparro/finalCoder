const url = 'http://localhost:6607/api/v1/products/obtenerTodosLosProductos';
const urlDelete = 'http://localhost:6607/api/v1/products/eliminarProducto/';
const urlCrear = 'http://localhost:6607/api/v1/products/crearProducto';
const urlEditar = 'http://localhost:6607/api/v1/products/actualizarProducto/';
const contenedor = document.querySelector('tbody');

let resultados = '';

const modalArticulo = new bootstrap.Modal(document.getElementById('modalArticulo'));
const formArticulo = document.querySelector('form');
const codigo = document.getElementById('codigo');
const nombre = document.getElementById('nombre');
const precio = document.getElementById('precio');
const cantidad = document.getElementById('cantidad');
const tipo = document.getElementById('tipo');
const proveedor = document.getElementById('proveedor');
const imagen = document.getElementById('imagen');
let opcion = '';

btnCrear.addEventListener('click', () => {
    limpiarCampos();
    modalArticulo.show();
    opcion = 'crear';
});

formArticulo.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); // Evitar que el modal se cierre al presionar "Enter"..
    }
});

function limpiarCampos() {
    codigo.value = '';
    nombre.value = '';
    precio.value = '';
    cantidad.value = '';
    tipo.value = '';
    proveedor.value = '';
    imagen.value = '';
}

const mostrar = (articulos) => {
    resultados = '';
    articulos.forEach(articulo => {
        resultados += `<tr>
                            <td>${articulo.product_id}</td>
                            <td>${articulo.codigo}</td>
                            <td>${articulo.product_name}</td>
                            <td>${articulo.price}</td>
                            <td>${articulo.cantidad}</td>
                            <td>${articulo.tipo}</td>
                            <td>${articulo.proveedor}</td>
                            <td>${articulo.imagen}</td>
                            <td class="text-center"><a class="btnEditar btn btn-primary">Editar</a>  <a class="btnBorrar btn btn-danger">Borrar</a></td>
                        </tr>
                      `;
    });
    contenedor.innerHTML = resultados;
}

// Función para obtener todos los productos de la API
const obtenerProductos = () => {
    fetch(url)
        .then(Response => Response.json())
        .then(data => {
            mostrar(data.body);
        })
        .catch(error => console.log(error));
}

// Mostrar registros iniciales
obtenerProductos();

const on = (element, event, selector, handler) => {
    element.addEventListener(event, e => {
        if (e.target.closest(selector)) {
            handler(e);
        }
    });
}

// proceso para eliminar
on(document, 'click', '.btnBorrar', e => {
    const fila = e.target.parentNode.parentNode;
    const id = fila.firstElementChild.innerHTML;
    alertify.confirm("¿Esta seguro que desea eliminar el producto?",
        function () {
            fetch(urlDelete + id, {
                method: 'DELETE'
            })
                .then(response => response.json())
                .then(() => obtenerProductos()); // Actualizar la tabla después de eliminar
        },
        function () {
            alertify.error('Cancel');
        });
});

// proceso para editar
let idForm = 0;
on(document, 'click', '.btnEditar', e => {
    const fila = e.target.parentNode.parentNode;
    idForm = fila.children[0].innerHTML;
    const codigoForm = fila.children[1].innerHTML;
    const nombreForm = fila.children[2].innerHTML;
    const precioForm = fila.children[3].innerHTML;
    const cantidadForm = fila.children[4].innerHTML;
    const tipoForm = fila.children[5].innerHTML;
    const proveedorForm = fila.children[6].innerHTML;
    const imagenForm = fila.children[7].innerHTML;

    codigo.value = codigoForm;
    nombre.value = nombreForm;
    precio.value = precioForm;
    cantidad.value = cantidadForm;
    tipo.value = tipoForm;
    proveedor.value = proveedorForm;
    // imagen.value=imagenruta
    opcion = 'editar';
    modalArticulo.show();
});

// proceso para crear y editar
formArticulo.addEventListener('submit', (e) => {
    e.preventDefault();
    if (opcion == 'crear') {
        let imagenruta = '';
        if (imagen.files.length > 0) {
            imagenruta = imagen.files[0].name;
        }
        fetch(urlCrear, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                codigo: codigo.value,
                product_name: nombre.value,
                price: precio.value,
                cantidad: cantidad.value,
                tipo: tipo.value,
                proveedor: proveedor.value,
                imagen: imagenruta
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data); // Inspeccionar los datos devueltos
                obtenerProductos(); // Actualizar la tabla después de crear
            })
            .catch(error => console.log(error));
    }
    if (opcion == 'editar') {
        let imagenruta = imagen.value; // Conserva el valor existente por defecto
        if (imagen.files.length > 0) {
            imagenruta = imagen.files[0].name;
        }
        fetch(urlEditar + idForm, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                codigo: codigo.value,
                product_name: nombre.value,
                price: precio.value,
                cantidad: cantidad.value,
                tipo: tipo.value,
                proveedor: proveedor.value,
                imagen: imagenruta
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data); // Inspeccionar los datos devueltos
                obtenerProductos(); // Actualizar la tabla después de editar
            })
            .catch(error => console.log(error));
    }
    modalArticulo.hide();
});