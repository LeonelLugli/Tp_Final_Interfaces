document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('frequency').addEventListener('change', filterRoutines);
    document.getElementById('difficulty').addEventListener('change', filterRoutines);
});

function filterRoutines() {
    const frequency = document.getElementById('frequency').value;
    const difficulty = document.getElementById('difficulty').value;
    const grid = document.getElementById('workoutsGrid');
    const message = document.getElementById('routineMessage');

    grid.innerHTML = '';

    if (!frequency || !difficulty) {
        grid.classList.add('hidden');
        message.classList.remove('hidden');
        return;
    }

    const routine = rutinas[difficulty]?.[frequency];

    if (!routine) {
        message.textContent = 'No hay rutinas disponibles para esta combinación';
        message.classList.remove('hidden');
        grid.classList.add('hidden');
        return;
    }

    grid.innerHTML = createRoutineCard(routine);
    grid.classList.remove('hidden');
    message.classList.add('hidden');
}

const rutinas = {
    principiante: {
        3: {
            titulo: "Full Body - Principiante",
            frecuencia: "3 veces por semana",
            descanso: "1 día entre sesiones",
            dias: [
                {
                    nombre: "Día 1 - Enfoque Pecho/Pierna",
                    ejercicios: [
                        "Flexiones de pecho (3×15)",
                        "Sentadillas sin peso (3×15)",
                        "Mountain climbers (3×15)",
                        "Zancadas (2×15)",
                        "Plancha (3×30s)",
                        "Abdominales (3×20)"
                    ]
                },
                {
                    nombre: "Día 2 - Enfoque Espalda/Core",
                    ejercicios: [
                        "Superman hold (3×30s)",
                        "Puente de glúteos (3×15)",
                        "Bird dog (3×15 por lado)",
                        "Push ups (2×15)",
                        "Plancha lateral (2×30s)",
                        "Russian twist (3×20)"
                    ]
                },
                {
                    nombre: "Día 3 - Enfoque Full Body",
                    ejercicios: [
                        "Burpees sin salto (3x10)",
                        "Flexiones inclinadas (3x15)",
                        "Sentadillas sumo (3x15)",
                        "Plancha con toques (2x15)",
                        "Jumping jacks (3x20)",
                        "Crunch bicicleta (3x20)"
                    ]
                }
            ]
        },
        4: {
            // Agregar rutina de 4 días principiante
        }
    },
    avanzado: {
        3: {
            titulo: "HIIT Intenso",
            frecuencia: "3 veces por semana",
            descanso: "1 día entre sesiones",
            dias: [
                {
                    nombre: "Día 1 - HIIT Superior",
                    ejercicios: [
                        "Burpees (4×15)",
                        "Diamond push ups (3×15)",
                        "Pike push ups (3×12)",
                        "Dips en silla (3×15)",
                        "Plancha con shoulder taps (3×20)",
                        "V-ups (4×15)"
                    ]
                },
                // Agregar más días
            ]
        },
        4: {
            // Agregar rutina de 4 días avanzado
        }
    }
};

function createRoutineCard(routine) {
    return `
        <div class="workout-card">
            <h3>${routine.titulo}</h3>
            <div class="routine-info">
                <p>Frecuencia: ${routine.frecuencia}</p>
                <p>Descanso: ${routine.descanso}</p>
            </div>
            <div class="workout-columns">
                ${routine.dias.map(day => `
                    <div class="day-tab">
                        <h4>${day.nombre}</h4>
                        <ul class="exercise-list">
                            ${day.ejercicios.map(exercise => `
                                <li>${exercise}</li>
                            `).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function getLayoutType(routine) {
    if (routine.title.includes('Upper/Lower')) return 'two-columns';
    if (routine.title.includes('Push/Pull/Legs')) return 'ppl-grid';
    return 'three-columns'; // Default for Full Body
}

function createWorkoutDays(days) {
    return days.map(day => `
        <div class="day-tab">
            <h4>${day.nombre}</h4>
            <ul class="exercise-list">
                ${day.ejercicios.map(exercise => `
                    <li>${exercise}</li>
                `).join('')}
            </ul>
        </div>
    `).join('');
}

function createTwoColumnsLayout(days) {
    const halfLength = Math.ceil(days.length / 2);
    const leftDays = days.slice(0, halfLength);
    const rightDays = days.slice(halfLength);

    return `
        <div class="workout-column">
            ${createDayCards(leftDays)}
        </div>
        <div class="workout-column">
            ${createDayCards(rightDays)}
        </div>
    `;
}

function createPPLLayout(days) {
    const firstRow = days.slice(0, 3);
    const secondRow = days.slice(3);

    return `
        <div class="ppl-row">
            ${createDayCards(firstRow)}
        </div>
        <div class="ppl-row">
            ${createDayCards(secondRow)}
        </div>
    `;
}

function createThreeColumnsLayout(days) {
    const columnLength = Math.ceil(days.length / 3);
    const column1 = days.slice(0, columnLength);
    const column2 = days.slice(columnLength, columnLength * 2);
    const column3 = days.slice(columnLength * 2);

    return `
        <div class="workout-column">
            ${createDayCards(column1)}
        </div>
        <div class="workout-column">
            ${createDayCards(column2)}
        </div>
        <div class="workout-column">
            ${createDayCards(column3)}
        </div>
    `;
}

function createDayCards(days) {
    return days.map(day => `
        <div class="day-tab">
            <h4>${day.nombre}</h4>
            <ul class="exercise-list">
                ${day.ejercicios.map(exercise => `
                    <li>${exercise}</li>
                `).join('')}
            </ul>
        </div>
    `).join('');
}
