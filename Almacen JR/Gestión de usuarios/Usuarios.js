document.addEventListener('DOMContentLoaded', function() {

    const formAnadirUsuario = document.getElementById('form-anadir-usuario');
    const tablaBody = document.getElementById('tabla-usuarios-body');
    const selectRoles = document.getElementById('id_Roles'); 

    // Cargar los roles en el formulario
    async function cargarRoles() {
        try {
            const response = await fetch('api_usuarios.php?accion=obtener_roles');
            if (!response.ok) throw new Error('No se pudieron cargar los roles.');
            
            const roles = await response.json();

            selectRoles.innerHTML = '<option value="" disabled selected>Seleccione un rol</option>';

            roles.forEach(rol => {
                const option = document.createElement('option');
                option.value = rol.id_Roles; 
                option.textContent = rol.Nombre_Rol; 
                selectRoles.appendChild(option);
            });

        } catch (error) {
            console.error('Error al cargar roles:', error);
            selectRoles.innerHTML = '<option value="" disabled>Error al cargar roles</option>';
        }
    }

    // Cargar y mostrar los usuarios en la tabla 
    async function cargarUsuarios() {
        try {
            const response = await fetch('api_usuarios.php?accion=obtener_usuarios');
            if (!response.ok) throw new Error('La respuesta de la red no fue correcta.');
            
            const usuarios = await response.json();
            tablaBody.innerHTML = ''; 

            if (usuarios.length === 0) {
                tablaBody.innerHTML = '<tr><td colspan="7" class="text-center p-4">No hay usuarios registrados.</td></tr>';
                return;
            }
            
            usuarios.forEach(usuario => {
                const tr = document.createElement('tr');
                tr.className = 'border-t border-t-[#dbe0e6]';
                
                // Formatea la fecha
                const fecha = new Date(usuario.Fecha_Registro).toLocaleDateString('es-ES');
                
                // Formatea el estado (la BD devuelve 1 o 0)
                const estadoTexto = usuario.Estado == 1 ? 'Activo' : 'Inactivo';
                const estadoClase = usuario.Estado == 1 ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800';

                tr.innerHTML = `
                    <td class="h-[72px] px-4 py-2">${usuario.Nombre}</td>
                    <td class="h-[72px] px-4 py-2">${usuario.Apellido}</td>
                    <td class="h-[72px] px-4 py-2">${usuario.Email}</td>
                    <td class="h-[72px] px-4 py-2">${usuario.Nombre_Rol}</td> <td class="h-[72px] px-4 py-2">
                        <span class="px-2 py-1 rounded ${estadoClase}">
                            ${estadoTexto}
                        </span>
                    </td>
                    <td class="h-[72px] px-4 py-2">${fecha}</td>
                    <td class="h-[72px] px-4 py-2 text-blue-600 font-bold">
                        <a href="#" class="cursor-pointer hover:underline" data-id="${usuario.id_Usuario}">Editar</a> |
                        <a href="#" class="cursor-pointer hover:underline text-red-600" data-id="${usuario.id_Usuario}">Eliminar</a>
                    </td>
                `;
                tablaBody.appendChild(tr);
            });

        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            tablaBody.innerHTML = `<tr><td colspan="7" class="text-center p-4 text-red-500">Error al cargar los datos.</td></tr>`;
        }
    }

    // Añadir un nuevo usuario
    async function anadirUsuario(event) {
        event.preventDefault(); // Evita que la página se recargue


        const formData = new FormData(formAnadirUsuario);
        
        // Convertimos FormData a un objeto simple
        const datosUsuario = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('api_usuarios.php', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosUsuario) // Envía el objeto como JSON
            });

            const resultado = await response.json();
            
            if (response.ok) {
                alert(resultado.mensaje);
                formAnadirUsuario.reset(); // Limpia el formulario
                cargarUsuarios(); // Recarga la tabla
            } else {
                throw new Error(resultado.error || 'Ocurrió un error.');
            }

        } catch (error) {
            console.error('Error al añadir usuario:', error);
            alert(`Error: ${error.message}`);
        }
    }

    // Inicialización de la página 
    async function init() {
        await cargarRoles(); // Primero carga los roles
        cargarUsuarios();    // Luego carga los usuarios
    }

    formAnadirUsuario.addEventListener('submit', anadirUsuario);
    
    init();

});