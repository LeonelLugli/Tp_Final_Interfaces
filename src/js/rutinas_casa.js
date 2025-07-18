document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('frequency').addEventListener('change', filterRoutines);
    document.getElementById('difficulty').addEventListener('change', filterRoutines);
    document.getElementById('workoutsGrid').addEventListener('click', function(event) {
        if (event.target && event.target.classList.contains('btn-primary')) {
            const routineId = event.target.dataset.id;
            programRoutine(routineId);
        }
    });
});

async function filterRoutines() {
    const frequency = document.getElementById('frequency').value;
    const difficulty = document.getElementById('difficulty').value;
    const grid = document.getElementById('workoutsGrid');
    const message = document.getElementById('routineMessage');
    grid.innerHTML = '';

    if (!frequency || !difficulty) {
        grid.classList.add('hidden');
        message.classList.remove('hidden');
        message.textContent = 'Seleccione frecuencia y nivel para ver la rutina';
        return;
    }

    message.textContent = 'Buscando rutina...';
    message.classList.remove('hidden');
    grid.classList.add('hidden');

    try {
        const url = `https://myproyectTPinterfaces.infy.uk/backend/api/rutinas/obtener_rutinas.php?tipo=casa&frecuencia=${frequency}&nivel=${difficulty}`;
        const response = await fetch(url);
        const routinesData = await response.json();

        if (response.ok && routinesData.length > 0) {
            grid.innerHTML = '';
            routinesData.forEach(routine => {
                grid.innerHTML += createRoutineCard(routine);
            });
            grid.classList.remove('hidden');
            message.classList.add('hidden');
        } else {
            message.textContent = routinesData.mensaje || 'No hay una rutina para esta combinación';
            message.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error al obtener la rutina:', error);
        message.textContent = 'Error al conectar con el servidor.';
    }
}

function createRoutineCard(routine) {
    return `<div class="workout-card"><h3>${routine.title}</h3>
        <div class="routine-info">
            <p>Frecuencia: ${routine.frequency}</p>
            <p>Descanso: <span class="math-inline">${routine.rest}</span></p>

        </div>
        <div class="workout-columns">
            ${routine.days.map(day => `
                <div class="day-tab">
                    <h4>${day.name}</h4>
                    <ul class="exercise-list">
                        ${day.exercises.map(exercise => `<li>${exercise}</li>`).join('')}
                    </ul>
                </div>
            `).join('')}
        </div>
        <button class="btn-primary" data-id="${routine.id}">Comenzar Rutina</button>
    </div>`;
}

async function programRoutine(routineId) {
    // Asignar la fecha actual automáticamente
    const today = new Date();
    const fechaInicio = today.toISOString().split('T')[0]; // Formato YYYY-MM-DD

    try {
        const response = await fetch('http://localhost/Tp_Final_Interfaces/backend/api/rutinas/programar_rutina.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_rutina: routineId,
                fecha_inicio: fechaInicio
            }),
            credentials: 'include'
        });

        const result = await response.json();

        if (response.ok && result.success) {
            alert(`¡Rutina programada con éxito a partir de hoy (${fechaInicio})!`);
            window.location.href = 'index.html';
        } else {
            alert(`Error al programar la rutina: ${result.mensaje}`);
        }
    } catch (error) {
        console.error('Error de red:', error);
        alert('Error de conexión al intentar programar la rutina.');
    }
}