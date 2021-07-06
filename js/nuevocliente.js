(function() {

	let BD;

	let form = document.getElementById('formulario');
	let nombre = document.getElementById('nombre');
	let email = document.getElementById('email');
	let telefono = document.getElementById('telefono');
	let empresa = document.getElementById('empresa');

	let clienteObj = {
		nombre : '',
		email : '',
		telefono : '',
		empresa : ''
	}

	class UI {

		imprimirMensaje(mensaje, error){

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
	}

	const ui = new UI;

	window.onload = function() {

		form.querySelector('#nombre').addEventListener('input', llenarClienteObj);
		form.querySelector('#telefono').addEventListener('input', llenarClienteObj);
		form.querySelector('#email').addEventListener('input', llenarClienteObj);
		form.querySelector('#empresa').addEventListener('input', llenarClienteObj);
		form.addEventListener('submit', nuevoCliente);

		conectarBD();
	}	

	function conectarBD() {

		let conexionDB = window.indexedDB.open('CRM', 1);

		conexionDB.onerror = function() {
			console.log('Ha ocurrido un error.');
		};

		conexionDB.onsuccess = function() {
			BD = conexionDB.result;
		}
	};

	function llenarClienteObj(e) {
		const elemento = e.target;

		clienteObj[elemento.name] = elemento.value;
	}

	function validarClienteObj() {
		return Object.keys(clienteObj).some(key => clienteObj[key] === '');
	}

	function nuevoCliente(e) {
		e.preventDefault();

		if(validarClienteObj()){
			ui.imprimirMensaje('Todos los campos son obligatorios', 'error');
			return;
		}

		const transaction = BD.transaction(['CRM'], 'readwrite');
		const objectStore = transaction.objectStore('CRM');

		clienteObj.id = Date.now();

		objectStore.add({...clienteObj});

		transaction.onerror = function() {
			ui.imprimirMensaje('Error, no pudo crearse el cliente', 'error');
		};

		transaction.oncomplete = function() {
			ui.imprimirMensaje('Cliente ha sido creado.');

			setTimeout(() => {
				window.location.href = 'index.html';
			}, 3000);
		};
	};

	function limpiarClienteObj() {

		clienteObj = {
			nombre :  '',
			email :  '',
			telefono :  '',
			empresa :  ''
		}

		nombre = '';
		email = '';
		telefono = '';
		empresa = '';
	}
})();