const url = 'http://localhost:3000/api/productos/';
const urlCategorias = 'http://localhost:3000/api/categorias/';
const urlProveedores = 'http://localhost:3000/api/proveedores/';



document.addEventListener('DOMContentLoaded', function () {
    const modalProducto = document.getElementById('modalProducto');
    if (modalProducto) {
        const modalInstance = new bootstrap.Modal(modalProducto);

        const btnCrear = document.getElementById('btnCrear');
        if (btnCrear) {
            btnCrear.addEventListener('click', () => {
                modalInstance.show();
            });
        }

        const formProducto = document.getElementById('formProducto');
        const nombre = document.getElementById('nombre');
        const img = document.getElementById('img');
        const descripcion = document.getElementById('descripcion');
        const categoria = document.getElementById('categoria');
        const proveedor = document.getElementById('proveedor');
        const precio = document.getElementById('precio');
        const stock = document.getElementById('stock');

        const btnGuardar = document.getElementById('btnGuardar');
        if (btnGuardar) {
            btnGuardar.addEventListener('click', () => {
                const nuevoProducto = {
                    nombre: nombre.value,
                    img: img.value,
                    descripcion: descripcion.value,
                    precio: parseFloat(precio.value),
                    stock: parseInt(stock.value),
                    id_categoria: parseInt(categoria.value),
                    id_proveedor: parseInt(proveedor.value)
                };

                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(nuevoProducto)
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    alert('Producto guardado exitosamente.');
                    modalInstance.hide();
                    cargarDatos();
                })
                .catch(error => {
                    console.error('Error en la solicitud Fetch:', error);
                    alert('Error al guardar el producto. Por favor, intenta de nuevo.');
                });
            });
        }

        const tablaProductos = document.getElementById('tablaProductos');
        tablaProductos.addEventListener('click', function (event) {
            const target = event.target;
            if (target.classList.contains('eliminar-btn')) {
                const fila = target.closest('tr');
                const id = fila.id.split('-')[1]; 
                eliminarProducto(id);
            } else if (target.classList.contains('modificar-btn')) {
                const fila = target.closest('tr');
                const id = fila.id.split('-')[1]; 
                modificarProducto(id);
            }
        });

        cargarOpcionesCategorias();
        cargarOpcionesProveedores();
    }

    function cargarDatos() {
        fetch(url)
        .then(response => response.json())
        .then(data => {
            const tablaProductos = document.getElementById('tablaProductos');
            tablaProductos.innerHTML = '';

            data.forEach(producto => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${producto.id_producto}</td>
                    <td>${producto.nombre}</td>
                    <td><img src="${producto.img}" alt="${producto.nombre}" width="60" height="60"></td>
                    <td>${producto.descripcion}</td>
                    <td>${producto.precio}</td>
                    <td>${producto.stock}</td>
                    <td>${producto.id_categoria}</td>
                    <td>${producto.id_proveedor}</td>
                    <td>
                       
                        
                        <button class="btn modificar-btn"><i class="far fa-edit modificar-btn"></i></button>
                        <button class="btn  eliminar-btn"><i class="far fa-trash-alt eliminar-btn "></i></button>
                    </td>
                `;
                fila.id = `producto-${producto.id_producto}`;
                tablaProductos.appendChild(fila);
            });
        })
        .catch(error => console.error('Error al cargar los datos:', error));
    }

    function modificarProducto(id) {
        fetch(`${url}${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('La solicitud de obtener el producto no fue exitosa. ' + response.status);
                }
                return response.json();
            })
            .then(producto => {
                const nombreInput = document.getElementById('nombre');
                const imgInput = document.getElementById('img');
                const descripcionInput = document.getElementById('descripcion');
                const precioInput = document.getElementById('precio');
                const stockInput = document.getElementById('stock');
                const categoriaInput = document.getElementById('categoria');
                const proveedorInput = document.getElementById('proveedor');

                nombreInput.value = producto.nombre;
                imgInput.value = producto.img;
                descripcionInput.value = producto.descripcion;
                precioInput.value = producto.precio;
                stockInput.value = producto.stock;
                categoriaInput.value = producto.id_categoria;
                proveedorInput.value = producto.id_proveedor;

                const btnGuardar = document.getElementById('btnGuardar');
                btnGuardar.onclick = () => {
                    const productoActualizado = {
                        nombre: nombreInput.value,
                        img: imgInput.value,
                        descripcion: descripcionInput.value,
                        precio: parseFloat(precioInput.value),
                        stock: parseInt(stockInput.value),
                        id_categoria: parseInt(categoriaInput.value),
                        id_proveedor: parseInt(proveedorInput.value)
                    };

                    fetch(`${url}${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(productoActualizado)
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        alert('Producto actualizado exitosamente.');
                        cargarDatos();
                    })
                    .catch(error => {
                        console.error('Error en la solicitud Fetch:', error);
                        alert('Error al actualizar el producto. Por favor, intenta de nuevo.');
                    });
                };

                const modalInstance = new bootstrap.Modal(document.getElementById('modalProducto'));
                modalInstance.show();
            })
            .catch(error => console.error('Error al obtener el producto:', error));
    }

    function eliminarProducto(id) {
        fetch(`${url}${id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('La solicitud de eliminar el producto no fue exitosa. ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            alert('Producto eliminado exitosamente.');
            cargarDatos();
        })
        .catch(error => console.error('Error al eliminar el producto:', error));
    }

    function cargarOpcionesCategorias() {
        fetch(urlCategorias)
        .then(response => response.json())
        .then(categorias => {
            const categoriaSelect = document.getElementById('categoria');
            categorias.forEach(categoria => {
                const option = document.createElement('option');
                option.value = categoria.id_categoria;
                option.textContent = categoria.nombre;
                categoriaSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error al cargar las categorías:', error));
    }

    function cargarOpcionesProveedores() {
        fetch(urlProveedores)
        .then(response => response.json())
        .then(proveedores => {
            const proveedorSelect = document.getElementById('proveedor');
            proveedores.forEach(proveedor => {
                const option = document.createElement('option');
                option.value = proveedor.id_proveedor;
                option.textContent = proveedor.nombre;
                proveedorSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error al cargar los proveedores:', error));
    }

    cargarDatos();
});
