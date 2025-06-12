document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    // Toggle para mostrar/ocultar contraseña (tu código original, que funciona perfecto)
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });

    // Manejar envío del formulario con la lógica real hacia el backend
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;

        if (!email || !password) {
            showMessage('Por favor, completa todos los campos', 'error');
            return;
        }

        const submitBtn = document.querySelector('.btn-login');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando sesión...';
        submitBtn.disabled = true;

        try {
            // Usamos fetch para enviar los datos al backend real
            const response = await fetch('https://myproyectTPinterfaces.infy.ukbackend/api/usuarios/login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, contrasena: password })
            });

            const result = await response.json();

            if (response.ok) { // Si la respuesta fue exitosa (código 200 OK)
                showMessage(result.mensaje, 'success');

                // Guardamos los datos REALES del usuario que nos devolvió el backend
                const storage = remember ? localStorage : sessionStorage;
                storage.setItem('userSession', JSON.stringify(result.usuario));

                // Redirigimos al inicio después de un momento
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);

            } else {
                // Si el servidor nos dio un error (401, 404), mostramos el mensaje de error
                showMessage(result.mensaje, 'error');
            }

        } catch (error) {
            console.error('Error de conexión:', error);
            showMessage('No se pudo conectar con el servidor.', 'error');
        } finally {
            // Esto se ejecuta siempre para restaurar el botón
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        }
    });

    // Tu función para mostrar notificaciones (funciona perfecto)
    function showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;

        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        `;

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(messageDiv);
            }, 300);
        }, 3000);
    }

    // Tu código para verificar si ya hay sesión activa (funciona perfecto)
    const userSession = localStorage.getItem('userSession') || sessionStorage.getItem('userSession');
    if (userSession) {
        // Para evitar bucles, solo redirige si no estamos ya en index.html
        if (!window.location.pathname.endsWith('index.html')) {
            window.location.href = 'index.html';
        }
    }
});

// Tu código para agregar las animaciones CSS (funciona perfecto)
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);