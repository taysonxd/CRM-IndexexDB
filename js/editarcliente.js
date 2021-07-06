(function() {

	let DB;

	let form = document.getElementById('formulario');
	let nombreInput = document.getElementById('nombre');
	let emailInput = document.getElementById('email');
	let telefonoInput = document.getElementById('telefono');
	let empresaInput = document.getElementById('empresa');

	let clienteObj = {
		nombre : '',
		email : '',
		telefono : '',
		empresa : ''
	}

	window.onload = function() {

		conexionDB();

		const idCliente = new URLSearchParams(window.location.search).get('id');

		if(idCliente) {
			setTimeout(function(){
				obtenerCliente(idCliente);
			}, 500);
		}

		form.addEventListener('submit', actualizarCliente);

		nombreInput.addEventListener('change', llenarClienteObj);
		emailInput.addEventListener('change', llenarClienteObj);
		telefonoInput.addEventListener('change', llenarClienteObj);
		empresaInput.addEventListener('change', llenarClienteObj);
	};

	function obtenerCliente(idCliente) {

		const objectStore = DB.transaction(['CRM'], 'readonly').objectStore('CRM');

		const cursor = objectStore.openCursor();

		cursor.onsuccess = function(e) {

			const cliente = e.target.result;

			if(cliente) {

				if(cliente.value.id === Number(idCliente)) {
					clienteObj = {...cliente.value};
					const { nombre, email, telefono, empresa } = cliente.value;

					nombreInput.value = nombre;
					emailInput.value = email;
					telefonoInput.value = telefono;
					empresaInput.value = empresa;

					nombreInput.disabled = false;
					emailInput.disabled = false;
					telefonoInput.disabled = false;
					empresaInput.disabled = false;
					form.querySelector('input[type="submit"]').disabled = false;

				}

				cliente.continue();
			}
		}
	};

	function llenarClienteObj(e) {
		const input = e.target;

		clienteObj[input.name] = input.value;
	}

	function validarClienteObj() {
		return Object.keys(clienteObj).some(key => clienteObj[key] === '');
	}

	function actualizarCliente(e) {
		e.preventDefault();

		if(validarClienteObj()){
			imprimirMensaje('Todos los campos son obligatorios', 'error');
			return;
		}

		const transaction = DB.transaction(['CRM'], 'readwrite');
		const objectStore = transaction.objectStore('CRM');

		objectStore.put({...clienteObj});

		transaction.onerror = function() {
			console.log('Hubo un error');
		};

		transaction.oncomplete = function() {

			imprimirMensaje('El cliente ha sido actualizado');

			setTimeout(function() {
				window.location.href = 'index.html';
			}, 2000);
		}
	};

	function conexionDB() {
		const conexionDB = window.indexedDB.open('CRM', 1);

		conexionDB.onerror = () => {
			console.log('Hubo un error');
		};

		conexionDB.onsuccess = () => {
			DB = conexionDB.result;
		};
	}

	function imprimirMensaje(mensaje, error){

		const alerta = document.querySelector('.alerta');

		if(!alerta){

			const divMensaje = document.createElement('div');
			divMensaje.classList.add('border', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'alerta');

			if(error === 'error') divMensaje.classList.add('bg-red-100', 'border-red-400', 'text-red-700');
				else divMensaje.classList.add('bg-green-100', 'border-green-400', 'text-green-700');

			divMensaje.textContent = mensaje;

			form.appendChild(divMensaje);

			setTimeout(function() {
				divMensaje.remove();
			}, 3000);
		}
	}

})();