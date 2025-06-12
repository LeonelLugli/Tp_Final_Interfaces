// CÓDIGO FINAL, COMPLETO Y CORREGIDO para rutinas_guardadas.js

document.addEventListener('DOMContentLoaded', async function() {
    // Esta parte carga las rutinas cuando la página se abre
    const sessionDataString = sessionStorage.getItem('userSession') || localStorage.getItem('userSession');
    if (!sessionDataString) {
        mostrarMensajeVacio();
        return; 
    }

    try {
        const url = 'https://myproyectTPinterfaces.infy.uk/backend/api/rutinas/obtener_rutinas_usuario.php';
        const response = await fetch(url, { credentials: 'include' });
        const result = await response.json();

        if (response.ok && result.success && Array.isArray(result.rutinas) && result.rutinas.length > 0) {
            cargarRutinas(result.rutinas);
        } else {
            mostrarMensajeVacio();
        }
    } catch (err) {
        console.error("Error al obtener las rutinas:", err);
        mostrarMensajeVacio();
    }
});

function cargarRutinas(rutinas) {
    const container = document.getElementById('routinesContainer');
    const mainContainer = document.querySelector('.my-routines-container');
    const noRoutinesMessage = document.getElementById('noRoutinesMessage');

    mainContainer.style.display = 'block';
    noRoutinesMessage.style.display = 'none';
    container.innerHTML = '';
    
    rutinas.forEach(rutina => {
        const cardElement = crearTarjetaRutina(rutina);
        container.appendChild(cardElement);
    });
    
    actualizarEstadisticas(rutinas);
}

function mostrarMensajeVacio() {
    const mainContainer = document.querySelector('.my-routines-container');
    const noRoutinesMessage = document.getElementById('noRoutinesMessage');
    if (mainContainer) mainContainer.style.display = 'none';
    if (noRoutinesMessage) noRoutinesMessage.style.display = 'flex';
}

function crearTarjetaRutina(rutina) {
    const card = document.createElement('div');
    card.className = 'routine-card';
    card.innerHTML = `
        <div class="routine-header">
            <h3 class="routine-title">${rutina.nombre}</h3>
            <div class="routine-actions">
                <button class="action-btn favorite" title="Marcar como favorita"><i class="fas fa-heart"></i></button>
                <button class="action-btn delete-btn" data-id-rutina="${rutina.id}" title="Eliminar rutina"><i class="fas fa-trash"></i></button>
            </div>
        </div>
        <div class="routine-info">
            <div class="routine-meta">
                <span><i class="fas fa-calendar"></i> ${rutina.frecuencia} veces/sem</span>
                <span><i class="fas fa-tag"></i> Personalizada</span>
                <span><i class="fas fa-clock"></i> Creada: ${new Date(rutina.fecha_creacion).toLocaleDateString('es-ES')}</span>
            </div>
            <p class="routine-description">${rutina.descripcion || 'Sin descripción'}</p>
        </div>
        <div class="routine-buttons">
            <button class="btn-view" data-id-rutina="${rutina.id}"><i class="fas fa-eye"></i> Ver Rutina</button>
            <button class="btn-edit" data-id-rutina="${rutina.id}"><i class="fas fa-edit"></i> Editar</button>
        </div>
    `;
    return card;
}

function actualizarEstadisticas(rutinas) {
    const totalRoutinesSpan = document.getElementById('totalRoutines');
    if (totalRoutinesSpan) totalRoutinesSpan.textContent = rutinas.length;
}

// --- BLOQUE DE EVENTOS UNIFICADO ---
// Este es el único event listener que necesitas para los clics en toda la página
document.addEventListener('click', async function(e) {
    const target = e.target;

    // Lógica para el botón VER
    if (target.closest('.btn-view')) {
        e.preventDefault();
        const rutinaId = target.closest('.btn-view').dataset.idRutina;
        if (rutinaId) {
            window.location.href = `ver_rutina.html?id=${rutinaId}`;
        }
    }

    // Lógica para el botón EDITAR
    if (target.closest('.btn-edit')) {
        e.preventDefault();
        const rutinaId = target.closest('.btn-edit').dataset.idRutina;
        alert(`Funcionalidad "Editar" para la rutina ID: ${rutinaId} aún no implementada.`);
    }

    // Lógica para el botón BORRAR
    if (target.closest('.delete-btn')) {
        e.preventDefault();
        const deleteButton = target.closest('.delete-btn');
        const card = deleteButton.closest('.routine-card');
        const rutinaId = deleteButton.dataset.idRutina;

        if (rutinaId && confirm('¿Estás seguro de que quieres eliminar esta rutina de forma permanente?')) {
            try {
                const url = 'http://localhost/Tp_Final_Interfaces/backend/api/rutinas/borrar_rutina.php';
                const response = await fetch(url, {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id_rutina: rutinaId })
                });
                const result = await response.json();

                if (response.ok && result.success) {
                    card.style.transition = 'opacity 0.5s ease';
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.remove();
                        actualizarEstadisticas(document.querySelectorAll('.routine-card'));
                    }, 500);
                } else {
                    alert('Error: ' + (result.mensaje || 'No se pudo borrar la rutina.'));
                }
            } catch (error) {
                console.error('Error de conexión al borrar:', error);
                alert('Error de conexión. No se pudo borrar la rutina.');
            }
        }
    }
});