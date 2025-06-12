document.addEventListener('DOMContentLoaded', function() {
    // 1. Buscamos los datos del usuario en la sesión del navegador
    const sessionData = sessionStorage.getItem('userSession') || localStorage.getItem('userSession');

    if (sessionData) {
        // 2. Si encontramos datos, significa que el usuario está logueado
        const userData = JSON.parse(sessionData);

        // Guarda el id_usuario en localStorage para otras partes de la app
        if (userData.id_usuario) {
            localStorage.setItem('id_usuario', userData.id_usuario);
        }

        // Buscamos el contenedor de los botones de usuario en tu HTML
        const userActionsDiv = document.querySelector('.user-actions');
        
        if (userActionsDiv) {
            // 3. Reemplazamos el HTML de ese contenedor con el saludo y el botón de logout
            userActionsDiv.innerHTML = `
                <span class="welcome-message">Hola, ${userData.nombre}</span>
                <a href="#" id="logoutBtn" class="logout-link">Cerrar Sesión</a>
            `;

            // 4. Le damos funcionalidad al nuevo botón de "Cerrar Sesión"
            const logoutBtn = document.getElementById('logoutBtn');
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                // Borramos los datos de la sesión del navegador
                sessionStorage.removeItem('userSession');
                localStorage.removeItem('userSession');
                localStorage.removeItem('id_usuario'); // <-- Limpia el id_usuario también
                // Redirigimos al usuario a la página de login
                window.location.href = 'login.html';
            });
        }
    }
    // 5. Si no hay sessionData, no hacemos nada. La página mostrará los botones por defecto
    // de "Registrarse" e "Iniciar Sesión" que ya están en el HTML.
});