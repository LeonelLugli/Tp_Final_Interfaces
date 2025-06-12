// CÓDIGO FINAL Y DEFINITIVO para ver_rutina.js

document.addEventListener('DOMContentLoaded', async function() {
    const routineDetailContainer = document.getElementById('routineDetailContainer');
    
    // Obtenemos el ID de la rutina desde la URL
    const params = new URLSearchParams(window.location.search);
    const rutinaId = params.get('id');

    if (!rutinaId) {
        routineDetailContainer.innerHTML = '<h2>Error: No se ha especificado una rutina para ver.</h2>';
        return;
    }

    try {
        const url = `https://myproyectTPinterfaces.infy.uk/backend/api/rutinas/obtener_detalle_rutina.php?id=${rutinaId}`;
        
        const response = await fetch(url, {
            credentials: 'include'
        });

        const result = await response.json();

        if (response.ok && result.success) {
            displayRoutine(result.rutina);
        } else {
            routineDetailContainer.innerHTML = `<h2>Error: ${result.mensaje || 'No se pudo cargar la rutina.'}</h2>`;
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        routineDetailContainer.innerHTML = '<h2>Error de conexión al cargar la rutina.</h2>';
    }
});

function displayRoutine(rutina) {
    const container = document.getElementById('routineDetailContainer');
    
    // Construimos el HTML para cada día de la rutina
    let diasHtml = rutina.dias.map(dia => {
        // Por cada día, construimos la lista de sus ejercicios
        let ejerciciosHtml = dia.ejercicios.map(ej => 
            `<li>
                <span class="exercise-name">${ej.nombre_ejercicio}</span>
                <span class="exercise-sets-reps">${ej.series} × ${ej.repeticiones}</span>
            </li>`
        ).join('');

        // Creamos la tarjeta del día con su lista de ejercicios
        return `
            <div class="day-details-card">
                <h3>${dia.nombre_dia}</h3>
                <ul class="exercise-detail-list">
                    ${ejerciciosHtml.length > 0 ? ejerciciosHtml : '<li>No hay ejercicios para este día.</li>'}
                </ul>
            </div>
        `;
    }).join('');

    // Finalmente, construimos el HTML completo de la página
    container.innerHTML = `
        <div class="routine-detail-header">
            <h1>${rutina.nombre}</h1>
            <p>Frecuencia: ${rutina.frecuencia} veces/semana | Descanso: ${rutina.descanso}</p>
        </div>
        <div class="routine-days-grid">
            ${diasHtml}
        </div>
        <button class="btn-primary" onclick="window.location.href = 'mis_rutinas.html'">Volver a Mis Rutinas</button>
    `;
}