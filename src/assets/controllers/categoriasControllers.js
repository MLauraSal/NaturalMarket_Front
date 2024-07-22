
const api = 'http://localhost:3000/api/categorias/';




document.addEventListener('DOMContentLoaded', function () {
    const modalCategoria = document.getElementById('modalCategoria');
    if (modalCategoria) {
        const modalInstance = new bootstrap.Modal(modalCategoria);

        const btnCrearCategoria = document.getElementById('btnCrearCategoria');
        if (btnCrearCategoria) {
            btnCrearCategoria.addEventListener('click', () => {
                modalInstance.show();
            });
        }

        const formCategoria = document.getElementById('formCategoria');
        const nombre_categoria = document.getElementById('nombre_categoria');
        const descripcion = document.getElementById('descripcion');
        

        const btnAdd = document.getElementById('btnAdd');
        if (btnAdd) {
            btnAdd.addEventListener('click', () => {
                const nuevaCategoria = {
                    nombre_categoria: nombre_categoria.value,
                    descripcion: descripcion.value
                    
                };

                fetch(api, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(nuevaCategoria)
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    alert('Categoria guardada exitosamente.');
                    modalInstance.hide();
                    cargarDatos();
                })
                .catch(error => {
                    console.error('Error en la solicitud Fetch:', error);
                    alert('Error al guardar la categoria. Por favor, intenta de nuevo.');
                });
            });
        }

        const tablaCategorias = document.getElementById('tablaCategorias');
        tablaCategorias.addEventListener('click', function (event) {
            const target = event.target;
            if (target.classList.contains('eliminar-btn')) {
                const fila = target.closest('tr');
                const id = fila.id.split('-')[1]; 
                eliminarCategoria(id);
            } else if (target.classList.contains('modificar-btn')) {
                const fila = target.closest('tr');
                const id = fila.id.split('-')[1]; 
                modificarCategoria(id);
            }
        });

       
    }

    function cargarDatos() {
        fetch(api)
        .then(response => response.json())
        .then(data => {
            const tablaCategorias = document.getElementById('tablaCategorias');
            tablaCategorias.innerHTML = '';

            data.forEach(categoria => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${categoria.id_categoria}</td>
                    <td>${categoria.nombre_categoria}</td>
                    <td>${categoria.descripcion}</td>
                    
                    <td>
                       
                        
                       <button class="btn modificar-btn"><i class="far fa-edit modificar-btn"></i></button>
                        <button class="btn  eliminar-btn"><i class="far fa-trash-alt eliminar-btn "></i></button>
                    </td>
                `;
                fila.id = `categoria-${categoria.id_categoria}`;
                tablaCategorias.appendChild(fila);
            });
        })
        .catch(error => console.error('Error al cargar los datos:', error));
    }

    function modificarCategoria(id) {
        fetch(`${api}${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('La solicitud de obtener la categoria no fue exitosa. ' + response.status);
                }
                return response.json();
            })
            .then(categoria => {
                const nombreInput = document.getElementById('nombre_categoria');
                const descripcionInput = document.getElementById('descripcion');
                

                nombreInput.value = categoria.nombre_categoria;
                descripcionInput.value = categoria.descripcion;

                const btnAdd = document.getElementById('btnAdd');
                btnAdd.onclick = () => {
                    const categoriaActualizada = {
                        nombre: nombreInput.value,
                        descripcion: descripcionInput.value
                        
                    };

                    fetch(`${api}${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(categoriaActualizada)
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        alert('Categoria actualizada exitosamente.');
                        cargarDatos();
                    })
                    .catch(error => {
                        console.error('Error en la solicitud Fetch:', error);
                        alert('Error al actualizar categoria. Por favor, intenta de nuevo.');
                    });
                };

                const modalInstance = new bootstrap.Modal(document.getElementById('modalCategoria'));
                modalInstance.show();
            })
            .catch(error => console.error('Error al obtener categoria:', error));
    }

    function eliminarCategoria(id) {
        fetch(`${api}${id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('La solicitud de eliminar la categoria no fue exitosa. ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            alert('Categoria eliminado exitosamente.');
            cargarDatos();
        })
        .catch(error => console.error('Error al eliminar la categoria:', error));
    }

   

   

    cargarDatos();
});