document.addEventListener('DOMContentLoaded', () => {

    const formNuevoProducto = document.getElementById('form-nuevo-producto');
    const selectCategoria = document.getElementById('select-categoria');
    const tablaProductosBody = document.getElementById('tabla-productos-body');

   
    async function cargarCategoriasEnSelect() {
        try {
            const respuesta = await fetch('api_productos.php?accion=listar_categorias');
            const datos = await respuesta.json();

            if (datos.success) {
                selectCategoria.innerHTML = '<option value="" disabled selected>Seleccione una categoría</option>'; 
                datos.data.forEach(categoria => {
                    selectCategoria.innerHTML += `
                        <option value="${categoria.id_Categoria}">${categoria.Nombre}</option>
                    `;
                });
            } else {
                selectCategoria.innerHTML = '<option value="">Error al cargar categorías</option>';
            }
        } catch (error) {
            console.error('Error de red:', error);
        }
    }

    async function cargarProductos() {
        try {
            const respuesta = await fetch('api_productos.php?accion=listar_productos');
            const datos = await respuesta.json();

            if (datos.success) {
                tablaProductosBody.innerHTML = ''; 
                datos.data.forEach(producto => {
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


    formNuevoProducto.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        const formData = new FormData(formNuevoProducto);
        const datosProducto = Object.fromEntries(formData.entries());

        try {
            const respuesta = await fetch('api_productos.php?accion=agregar_producto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosProducto)
            });

            const datos = await respuesta.json();

            if (datos.success) {
                alert('Producto registrado con éxito.');
                formNuevoProducto.reset(); // Limpiamos el formulario
                cargarProductos(); // Recargamos la tabla de productos
            } else {
                alert('Error al registrar producto: ' + datos.error);
            }
        } catch (error) {
            console.error('Error de red:', error);
        }
    });

    cargarCategoriasEnSelect();
    cargarProductos();
});