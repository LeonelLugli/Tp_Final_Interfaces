document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');

    registerForm.addEventListener('submit', async function(e) {
        // Prevenimos que la página se recargue
        e.preventDefault();

        // Obtenemos los valores de los campos por su id
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const contrasena = document.getElementById('contrasena').value;

        // Validamos que los campos no estén vacíos
        if (!nombre || !email || !contrasena) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        // Creamos el objeto de datos para enviar al backend
        const userData = {
            nombre: nombre,
            email: email,
            contrasena: contrasena
        };

        try {
            // Usamos fetch() para enviar los datos a nuestro script de PHP
            const response = await fetch('http://localhost/TP_FINAL_INTERFACES/backend/api/usuarios/registro.php', {
                method: 'POST', // Usamos el método POST
                headers: {
                    'Content-Type': 'application/json' // Indicamos que el cuerpo de la petición es JSON
                },
                body: JSON.stringify(userData) // Convertimos el objeto de JavaScript a un string en formato JSON
            });

            // Leemos la respuesta que nos da el servidor (PHP)
            const result = await response.json();

            // Actuamos según la respuesta del servidor
            if (response.ok) { // Si la respuesta fue exitosa (ej: código 201 Created)
                alert(result.mensaje); // "Usuario creado exitosamente."
                window.location.href = 'login.html'; // Redirigimos al usuario a la página de login
            } else { // Si hubo un error (ej: código 409 Conflict por email duplicado)
                alert('Error: ' + result.mensaje); // Mostramos el mensaje de error que nos dio PHP
            }

        } catch (error) {
            // Este error ocurre si hay un problema de red o el servidor no responde
            console.error('Error de conexión:', error);
            alert('No se pudo conectar con el servidor. Revisa la consola (F12) para más detalles.');
        }
    });
});