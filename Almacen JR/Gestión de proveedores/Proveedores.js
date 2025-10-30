document.addEventListener('DOMContentLoaded', () => {
    // --- URLs de la API (Ajusta la ruta según tu servidor) ---
    const API_BASE_URL = 'http://localhost/tu_proyecto/';
    const ADD_SUPPLIER_URL = API_BASE_URL + 'add_supplier.php';
    const GET_SUPPLIERS_URL = API_BASE_URL + 'get_suppliers.php';

    // --- Referencias del DOM ---
    const nameInput = document.getElementById('supplierName');
    const contactInput = document.getElementById('supplierContact');
    const phoneInput = document.getElementById('supplierPhone');
    const addressInput = document.getElementById('supplierAddress');
    const addButton = document.getElementById('addSupplierButton');
    const messageDisplay = document.getElementById('supplierMessageDisplay');
    const tableBody = document.getElementById('suppliersTableBody');

    // Añadimos estilos para los mensajes (Puedes mover esto a tu CSS)
    messageDisplay.style.color = '#dc2626'; 

    /**
     * Muestra un mensaje de estado al usuario.
     */
    function displayMessage(message, isSuccess = false) {
        messageDisplay.textContent = message;
        messageDisplay.style.color = isSuccess ? '#10b981' : '#dc2626';
    }

    /**
     * Limpia los campos del formulario.
     */
    function clearForm() {
        nameInput.value = '';
        contactInput.value = '';
        phoneInput.value = '';
        addressInput.value = '';
        nameInput.focus();
    }

    /**
     * Maneja el envío del formulario para agregar un nuevo proveedor.
     */
    async function handleAddSupplier() {
        // Validación de campos
        const name = nameInput.value.trim();
        const contact = contactInput.value.trim();
        const phone = phoneInput.value.trim();
        const address = addressInput.value.trim();

        if (!name || !contact || !phone) {
            displayMessage('Por favor, complete al menos Nombre, Correo y Teléfono.');
            return;
        }

        // Deshabilitar botón
        addButton.disabled = true;
        addButton.querySelector('span').textContent = 'Guardando...';
        displayMessage('');

        const supplierData = {
            Nombre: name,
            Contacto: contact, // Usamos el campo Contacto para el email temporalmente. En la DB es el campo Contacto.
            Direccion: address,
            Telefono: phone, // El campo 'Productos_Suministrados' se dejará vacío o se manejará en otra pantalla.
        };

        try {
            const response = await fetch(ADD_SUPPLIER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(supplierData),
            });

            const data = await response.json();

            if (response.ok) {
                displayMessage('✅ Proveedor añadido con éxito.', true);
                clearForm();
                loadSuppliers(); // Recargar la tabla con el nuevo proveedor
            } else {
                displayMessage(`❌ Error al añadir: ${data.message || 'Error desconocido.'}`);
            }

        } catch (error) {
            displayMessage('⛔ Error de red. No se pudo conectar con el servidor.');
            console.error('Error al agregar proveedor:', error);
        } finally {
            addButton.disabled = false;
            addButton.querySelector('span').textContent = 'Añadir Proveedor';
        }
    }

    /**
     * Carga y renderiza la lista de proveedores en la tabla.
     */
    async function loadSuppliers() {
        if (!tableBody) return; // Salir si el cuerpo de la tabla no existe

        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Cargando proveedores...</td></tr>';

        try {
            const response = await fetch(GET_SUPPLIERS_URL);
            const data = await response.json();

            if (response.ok) {
                renderSuppliersTable(data.suppliers);
            } else {
                tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#dc2626;">Error al cargar: ${data.message || 'Error desconocido'}</td></tr>`;
            }

        } catch (error) {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:#dc2626;">Error de red al obtener proveedores.</td></tr>';
            console.error('Error al cargar proveedores:', error);
        }
    }

    /**
     * Renderiza la tabla de proveedores a partir de un array de datos.
     * @param {Array} suppliers - Lista de objetos proveedor.
     */
    function renderSuppliersTable(suppliers) {
        tableBody.innerHTML = ''; // Limpiar el contenido existente

        if (suppliers.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No hay proveedores registrados.</td></tr>';
            return;
        }

        suppliers.forEach(supplier => {
            const row = document.createElement('tr');
            row.classList.add('border-t', 'border-t-[#dbe0e6]');

            // Nota: Aquí se mapean los campos de la tabla a los campos de la DB.
            row.innerHTML = `
                <td class="h-[72px] px-4 py-2 w-[400px] text-[#111418] text-sm font-normal leading-normal">${supplier.Nombre}</td>
                <td class="h-[72px] px-4 py-2 w-[400px] text-[#617589] text-sm font-normal leading-normal">${supplier.Contacto || 'N/A'}</td>
                <td class="h-[72px] px-4 py-2 w-[400px] text-[#617589] text-sm font-normal leading-normal">${supplier.Telefono || 'N/A'}</td>
                <td class="h-[72px] px-4 py-2 w-[400px] text-[#617589] text-sm font-normal leading-normal">${supplier.Direccion || 'N/A'}</td>
                <td class="h-[72px] px-4 py-2 w-60 text-[#617589] text-sm font-bold leading-normal tracking-[0.015em]">
                    <a href="#" data-id="${supplier.id_Proveedor}" class="edit-btn">Editar</a> | 
                    <a href="#" data-id="${supplier.id_Proveedor}" class="delete-btn">Eliminar</a>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Aquí podrías agregar listeners para los botones "Editar" y "Eliminar"
    }

    // --- Inicialización ---
    addButton.addEventListener('click', handleAddSupplier);
    loadSuppliers(); // Cargar la lista al iniciar la página
});