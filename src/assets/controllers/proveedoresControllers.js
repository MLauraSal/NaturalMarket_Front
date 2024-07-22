const urlPro = 'http://localhost:3000/api/proveedores/';

document.addEventListener('DOMContentLoaded', function () {
    const modalProveedor = document.getElementById('modalProveedor');
    if (modalProveedor) {
        const modalInstance = new bootstrap.Modal(modalProveedor);

        const btnCrearProveedor = document.getElementById('btnCrearProveedor');
        if (btnCrearProveedor) {
            btnCrearProveedor.addEventListener('click', () => {
                modalInstance.show();
            });
        }

        const formProveedor = document.getElementById('formProveedor');
        const nombre = document.getElementById('nombre_proveedor');
        const contacto = document.getElementById('contacto');
        const email = document.getElementById('email');

        const btn_Add = document.getElementById('btn_Add');
        if (btn_Add) {
            btn_Add.addEventListener('click', () => {
                const nuevoProveedor = {
                    nombre: nombre_proveedor.value,
                    contacto: contacto.value,
                    email: email.value
                    
                };

                fetch(urlPro, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(nuevoProveedor)
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    alert('Proveedor guardado exitosamente.');
                    modalInstance.hide();
                    cargarDatos();
                })
                .catch(error => {
                    console.error('Error en la solicitud Fetch:', error);
                    alert('Error al guardar el proveedor. Por favor, intenta de nuevo.');
                });
            });
        }

        const tablaProveedores = document.getElementById('tablaProveedores');
        tablaProveedores.addEventListener('click', function (event) {
            const target = event.target;
            if (target.classList.contains('eliminar-btn')) {
                const fila = target.closest('tr');
                const id = fila.id.split('-')[1]; 
                eliminarProveedor(id);
            } else if (target.classList.contains('modificar-btn')) {
                const fila = target.closest('tr');
                const id = fila.id.split('-')[1]; 
                modificarProveedor(id);
            }
        });

       
    }

    function cargarDatos() {
        fetch(urlPro)
        .then(response => response.json())
        .then(data => {
            const tablaProveedores = document.getElementById('tablaProveedores');
            tablaProveedores.innerHTML = '';

            data.forEach(proveedor => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${proveedor.id_proveedor}</td>
                    <td>${proveedor.nombre_proveedor}</td>
                    <td>${proveedor.contacto}</td>
                    <td>${proveedor.email}</td>
                    
                    <td>
                       
                        
                        <button class="btn modificar-btn"><i class="far fa-edit modificar-btn"></i></button>
                        <button class="btn  eliminar-btn"><i class="far fa-trash-alt eliminar-btn "></i></button>
                    </td>
                `;
                fila.id = `proveedor-${proveedor.id_proveedor}`;
                tablaProveedores.appendChild(fila);
            });
        })
        .catch(error => console.error('Error al cargar los datos:', error));
    }

    function modificarProveedor(id) {
        fetch(`${urlPro}${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('La solicitud de obtener el proveedor no fue exitosa. ' + response.status);
                }
                return response.json();
            })
            .then(proveedor => {
                const nombreInput = document.getElementById('nombre_proveedor');
                const contactoInput = document.getElementById('contacto');
                const emailInput = document.getElementById('email');
               
                

                nombreInput.value = proveedor.nombre_proveedor;
                contactoInput.value = proveedor.contacto;
                emailInput.value = proveedor.email;

                
                const btn_Add = document.getElementById('btn_Add');
                btn_Add.onclick = () => {
                    const proveedorActualizado = {
                        nombre_proveedor: nombreInput.value,
                        contacto: contactoInput.value,
                       email: emailInput.value
                        
                    };

                    fetch(`${urlPro}${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(proveedorActualizadoActualizada)
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        alert('Porveedor actualizado exitosamente.');
                        cargarDatos();
                    })
                    .catch(error => {
                        console.error('Error en la solicitud Fetch:', error);
                        alert('Error al actualizar proveedor. Por favor, intenta de nuevo.');
                    });
                };

                const modalInstance = new bootstrap.Modal(document.getElementById('modalProveedor'));
                modalInstance.show();
            })
            .catch(error => console.error('Error al obtener proveedor:', error));
    }

    function eliminarProveedor(id) {
        fetch(`${urlPro}${id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('La solicitud de eliminar el proveedor no fue exitosa. ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            alert('Proveedor eliminado exitosamente.');
            cargarDatos();
        })
        .catch(error => console.error('Error al eliminar el proveedor:', error));
    }

   

   

    cargarDatos();
});