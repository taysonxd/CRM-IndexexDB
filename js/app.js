(function() {

	let DB;
	let listadoClientes = document.querySelector('#listado-clientes');

	window.onload = function() {

		crearDB();

		if(window.indexedDB.open('CRM', 1)) imprimirClientes();

		listadoClientes.onclick = function(e) {
			if(e.target.classList.contains('eliminar')){
				eliminarCliente(e);
			}
		}
	}

	function crearDB() {

		const indexedDB = window.indexedDB.open('CRM', 1);

		indexedDB.onerror = function() {

			console.log('Ha ocurrido un error.');
		};

		indexedDB.onsuccess = function() {
			DB = indexedDB.result;
		}

		indexedDB.onupgradeneeded = function(e) {

			const db = e.target.result;

			const objectStore = db.createObjectStore('CRM', {
				keyPath : 'id',
				autoIncrement : true
			});

			objectStore.createIndex('nombre', 'nombre', {unique : false});
			objectStore.createIndex('email', 'email', {unique : true});
			objectStore.createIndex('telefono', 'telefono', {unique : false});
			objectStore.createIndex('empresa', 'empresa', {unique : false});
			objectStore.createIndex('id', 'id', {unique : true});
		}
	}

	function imprimirClientes(){

		const conexionDB = window.indexedDB.open('CRM', 1);

		conexionDB.onerror = () => {
			console.log('Hubo un error');
		};

		conexionDB.onsuccess = function() {

			DB = conexionDB.result;
			
			const objectStore = DB.transaction('CRM').objectStore('CRM');

			objectStore.openCursor().onsuccess = (e) => {

				const cursor = e.target.result;

				if(cursor) {

					const { nombre, email, telefono, empresa, id } = cursor.value;
					
					listadoClientes.innerHTML += `
						<tr>
							<td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
								<p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
								<p class="text-sm leading-10 text-gray-700"> ${email} </p>
							</td>
								<td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
								<p class="text-gray-700">${telefono}</p>
							</td>
								<td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
								<p class="text-gray-600">${empresa}</p>
							</td>
							<td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
								<a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
								<a href="#" data-cliente="${id}" class="eliminar text-red-600 hover:text-red-900">Eliminar</a>
							</td>
						</tr>
					`;

					cursor.continue();
				}
			}
		};
	}

	function eliminarCliente(e) {

		const confirmacion = confirm('Esta seguro de eliminar este cliente?');

		if(confirmacion) {
			const transaction = DB.transaction(['CRM'], 'readwrite');
			const objectStore = transaction.objectStore('CRM');

			objectStore.delete(Number(e.target.dataset.cliente));	

			transaction.oncomplete = function() {
				e.target.parentElement.parentElement.remove();
				alert('El cliente ha sido eliminado');
			};
		}
	}

})();