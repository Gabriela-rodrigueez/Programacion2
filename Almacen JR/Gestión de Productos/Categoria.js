document.addEventListener('DOMContentLoaded', () => {

    // --- Selectores de Elementos ---
    const formCategoria = document.getElementById('form-categoria');
    const inputCategoria = document.getElementById('input-nueva-categoria');
    const listaCategoriasUI = document.getElementById('lista-categorias-existentes');


    async function cargarCategorias() {
        // Verificamos que el DIV exista antes de usarlo
        if (!listaCategoriasUI) {
            console.error("Error: No se encontró el elemento 'lista-categorias-existentes' en el HTML.");
            return;
        }

        try {
            const respuesta = await fetch('api_productos.php?accion=listar_categorias');
            const datos = await respuesta.json();

            if (datos.success) {
                listaCategoriasUI.innerHTML = ''; // Limpiamos la lista actual
                
                if (datos.data.length === 0) {
                    listaCategoriasUI.innerHTML = '<p class="px-4 text-gray-500">No hay categorías registradas.</p>';
                } else {
                    datos.data.forEach(categoria => {
                        listaCategoriasUI.innerHTML += `
                            <div class="flex items-center gap-4 bg-white px-4 min-h-14 justify-between border-t border-t-[#dbe0e6]">
                                <p class="text-[#111418] text-base font-normal leading-normal flex-1 truncate">${categoria.Nombre}</p>
                                <div class="shrink-0">
                                    <div class="text-[#111418] flex size-7 items-center justify-center cursor-pointer" data-icon="PencilSimple" data-size="24px" data-weight="regular">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                                            <path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        `;
                    });
                }
            } else {
                console.error('Error al listar categorías:', datos.error);
            }
        } catch (error) {
            console.error('Error de red:', error);
        }
    }


    formCategoria.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        const nombreCategoria = inputCategoria.value.trim();

        if (nombreCategoria === '') {
            alert('Por favor, ingrese un nombre para la categoría.');
            return;
        }

        try {
            const respuesta = await fetch('api_productos.php?accion=agregar_categoria', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombre: nombreCategoria })
            });

            const datos = await respuesta.json();

            if (datos.success) {
                inputCategoria.value = ''; // Limpiamos el input
                alert('Categoría agregada con éxito.');
                cargarCategorias(); // Recargamos la lista de categorías
            } else {
                alert('Error al agregar categoría: ' + datos.error);
            }
        } catch (error) {
            console.error('Error de red:', error);
        }
    });


    cargarCategorias();
});