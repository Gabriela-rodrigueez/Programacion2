// Espera a que todo el contenido del HTML esté cargado
document.addEventListener('DOMContentLoaded', () => {

    const formCategoria = document.getElementById('form-categoria');
    const inputCategoria = document.getElementById('input-nueva-categoria');
    const listaCategoriasUI = document.getElementById('lista-categorias-existentes');

    // Sección de Productos
    const tablaProductosBody = document.getElementById('tabla-productos-body');


    async function cargarCategorias() {
        try {
            const respuesta = await fetch('api.php?accion=listar_categorias');
            const datos = await respuesta.json();

            if (datos.success) {
                listaCategoriasUI.innerHTML = ''; // Limpiamos la lista actual
                datos.data.forEach(categoria => {
                    listaCategoriasUI.innerHTML += `
                        <div class="flex items-center gap-4 bg-white px-4 min-h-14 justify-between">
                            <p class="text-[#111418] text-base font-normal leading-normal flex-1 truncate">${categoria.Nombre}</p>
                            <div class="shrink-0">
                                <div class="text-[#111418] flex size-7 items-center justify-center" data-icon="PencilSimple" data-size="24px" data-weight="regular">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                                        <path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    `;
                });
            } else {
                console.error('Error al listar categorías:', datos.error);
            }
        } catch (error) {
            console.error('Error de red:', error);
        }
    }


    async function cargarProductos() {
        try {
            const respuesta = await fetch('api.php?accion=listar_productos');
            const datos = await respuesta.json();

            if (datos.success) {
                tablaProductosBody.innerHTML = ''; // Limpiamos la tabla
                datos.data.forEach(producto => {
                    // (Simulamos una imagen)
                    const imgUrl = `http://googleusercontent.com/profile/picture/${producto.id_Producto}`;

                    tablaProductosBody.innerHTML += `
                        <tr class="border-t border-t-[#dbe0e6]">
                            <td class="h-[72px] px-4 py-2 w-14">
                                <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10" style='background-image: url("${imgUrl}");'></div>
                            </td>
                            <td class="h-[72px] px-4 py-2 w-[400px] text-[#111418]">${producto.Nombre}</td>
                            <td class="h-[72px] px-4 py-2 w-[400px] text-[#617589]">${producto.Descripcion || ''}</td>
                            <td class="h-[72px] px-4 py-2 w-[400px] text-[#617589]">${producto.CategoriaNombre}</td>
                            <td class="h-[72px] px-4 py-2 w-60">
                                <button class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-[#f0f2f4] text-[#111418] text-sm font-medium w-full">
                                    <span class="truncate">${producto.Precio_Compra}</span>
                                </button>
                            </td>
                            <td class="h-[72px] px-4 py-2 w-60">
                                <button class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-[#f0f2f4] text-[#111418] text-sm font-medium w-full">
                                    <span class="truncate">${producto.Precio_Venta}</span>
                                </button>
                            </td>
                            <td class="h-[72px] px-4 py-2 w-[400px]">
                                <div class="flex items-center gap-3">
                                    <div class="w-[88px] overflow-hidden rounded-sm bg-[#dbe0e6]"><div class="h-1 rounded-full bg-[#111418]" style="width: 100%;"></div></div>
                                    <p class="text-[#111418] text-sm font-medium">${producto.Stock_Actual}</p>
                                </div>
                            </td>
                        </tr>
                    `;
                });
            } else {
                console.error('Error al listar productos:', datos.error);
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
            const respuesta = await fetch('api.php?accion=agregar_categoria', {
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
    cargarProductos();

});