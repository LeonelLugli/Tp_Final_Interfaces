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

    const routine = routines[difficulty]?.[frequency];

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

const routines = {
    'principiante': {
        '3': {
            title: "Full Body - Principiante",
            frequency: "3 veces por semana",
            rest: "1 día entre sesiones",
            days: [
                {
                    name: "Día 1 - Enfoque Pecho/Pierna",
                    exercises: [
                        "Flexiones de pecho (3×15)",
                        "Sentadillas sin peso (3×15)",
                        "Mountain climbers (3×15)",
                        "Zancadas (2×15)",
                        "Plancha (3×30s)",
                        "Abdominales (3×20)"
                    ]
                },
                {
                    name: "Día 2 - Enfoque Espalda/Core",
                    exercises: [
                        "Superman hold (3×30s)",
                        "Puente de glúteos (3×15)",
                        "Bird dog (3×15 por lado)",
                        "Push ups (2×15)",
                        "Plancha lateral (2×30s)",
                        "Russian twist (3×20)"
                    ]
                },
                {
                    name: "Día 3 - Enfoque Full Body",
                    exercises: [
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
        '4': {
        title: "Upper/Lower Split - Principiante",
        frequency: "4 veces por semana",
        rest: "Alternar días",
        days: [
            {
                name: "Día 1 - Upper Body",
                exercises: [
                    "Flexiones de pecho (3×12)",
                    "Fondos en silla (3×10)",
                    "Pike push-ups (3×8)",
                    "Plancha con toque de hombros (3×12)",
                    "Superman hold (3×30s)",
                    "Flexiones inclinadas (3×15)"
                ]
            },
            {
                name: "Día 2 - Lower Body",
                exercises: [
                    "Sentadillas (4×15)",
                    "Zancadas alternadas (3×12)",
                    "Puente de glúteos (3×20)",
                    "Step-ups en silla (3×15)",
                    "Elevación de pantorrillas (3×25)",
                    "Plancha lateral (3×30s)"
                ]
            },
            {
                name: "Día 3 - Upper Body",
                exercises: [
                    "Flexiones diamante (3×10)",
                    "Dips en silla (3×12)",
                    "Push-ups con rotación (2×8)",
                    "Plancha up-down (3×10)",
                    "Flexiones declinadas (3×12)",
                    "Dead bug (3×15)"
                ]
            },
            {
                name: "Día 4 - Lower Body",
                exercises: [
                    "Sentadillas búlgaras (3×12)",
                    "Hip thrusts (3×20)",
                    "Mountain climbers (3×20)",
                    "Sentadillas sumo (3×15)",
                    "Jumping squats (3×12)",
                    "Wall sit (3×45s)"
                ]
            }
        ]
        }
    },
    'avanzado': {
        '3': {
            title: "HIIT Intenso",
            frequency: "3 veces por semana",
            rest: "1 día entre sesiones",
            days: [
                {
                    name: "Día 1 - HIIT Superior",
                    exercises: [
                        "Burpees (4×15)",
                        "Diamond push-ups (3×15)",
                        "Pike push-ups (3×12)",
                        "Dips en silla (3×15)",
                        "Plancha con shoulder taps (3×20)",
                        "V-ups (4×15)"
                    ]
                },
                {
                    name: "Día 2 - HIIT Inferior",
                    exercises: [
                        "Jump squats (4×15)",
                        "Pistol squats asistidos (3×8)",
                        "Jumping lunges (4×12)",
                        "Burpees sin push-up (4×15)",
                        "Mountain climbers (4×25)",
                        "Flutter kicks (4×30s)"
                    ]
                },
                {
                    name: "Día 3 - HIIT Total",
                    exercises: [
                        "Muscle-ups negativos (3×8)",
                        "Handstand push-ups contra pared (3×8)",
                        "Explosive push-ups (3×12)",
                        "Tuck planche holds (4×15s)",
                        "L-sit holds (3×20s)",
                        "Dragon flags (3×8)"
                    ]
                }
            ]
        },
        '4': {
        title: "Calistenia Avanzada",
        frequency: "4 veces por semana",
        rest: "Descansar día por medio",
        days: [
            {
                name: "Día 1 - Push",
                exercises: [
                    "Flexiones explosivas (4×12)",
                    "Pike push-ups (4×12)",
                    "Pseudo planche push-ups (3×10)",
                    "Flexiones archer (4×8 por lado)",
                    "Fondos en silla explosivos (3×12)",
                    "Handstand hold (3×30s)"
                ]
            },
            {
                name: "Día 2 - Core/Cardio",
                exercises: [
                    "Burpees (4×15)",
                    "Dragon flags progresión (4×8)",
                    "L-sit hold (4×15s)",
                    "Hollow body rocks (3×20)",
                    "V-sits (4×12)",
                    "Mountain climbers (4×30)"
                ]
            },
            {
                name: "Día 3 - Legs",
                exercises: [
                    "Pistol squats progresión (4×8)",
                    "Jumping lunges (4×12)",
                    "Sissy squats (3×12)",
                    "Box jumps (4×10)",
                    "Sprints en lugar (4×30s)",
                    "Wall sit con elevación (3×45s)"
                ]
            },
            {
                name: "Día 4 - Skills",
                exercises: [
                    "Handstand push-ups progresión (4×8)",
                    "Planche lean holds (4×20s)",
                    "Pseudo planche holds (4×15s)",
                    "Wall walks (3×5)",
                    "Pike push-ups profundas (3×12)",
                    "Crow pose holds (3×30s)"
                ]
            }
        ]
    }
}
};


function createRoutineCard(routine) {
    return `
        <div class="workout-card">
            <h3>${routine.title}</h3>
            <div class="routine-info">
                <p>Frecuencia: ${routine.frequency}</p>
                <p>Descanso: ${routine.rest}</p>
            </div>
            <div class="workout-columns">
                ${routine.days.map(day => `
                    <div class="day-tab">
                        <h4>${day.name}</h4>
                        <ul class="exercise-list">
                            ${day.exercises.map(exercise => `
                                <li>${exercise}</li>
                            `).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
            <button class="btn-primary">Start Routine</button>
        </div>
    `;
}

function getLayoutType(routine) {
    if (routine.title.includes('Upper/Lower')) return 'two-columns';
    if (routine.title.includes('Push/Pull/Legs')) return 'ppl-grid';
    return 'three-columns'; // Default for Full Body
}

function createWorkoutDays(days, layout) {
    if (layout === 'two-columns') {
        return createTwoColumnsLayout(days);
    } else if (layout === 'ppl-grid') {
        return createPPLLayout(days);
    }
    return createThreeColumnsLayout(days);
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
            <h4>${day.name}</h4>
            <ul class="exercise-list">
                ${day.exercises.map(exercise => `
                    <li>${exercise}</li>
                `).join('')}
            </ul>
        </div>
    `).join('');
}
