document.addEventListener('DOMContentLoaded', function() {
    // Agregar event listeners a los selectores
    document.getElementById('frequency').addEventListener('change', filterRoutines);
    document.getElementById('difficulty').addEventListener('change', filterRoutines);
});

function filterRoutines() {
    const frequency = document.getElementById('frequency').value;
    const difficulty = document.getElementById('difficulty').value;
    const grid = document.getElementById('workoutsGrid');
    const message = document.getElementById('routineMessage');

    console.log('Filtering:', frequency, difficulty); // Para debug

    if (!frequency || !difficulty) {
        grid.classList.add('hidden');
        message.classList.remove('hidden');
        return;
    }

    const routine = routines[frequency]?.[difficulty];
    
    console.log('Found routine:', routine); // Para debug

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
    'full-body': {
        'principiante': {
            title: 'Full Body - Principiante',
            frequency: '3 veces por semana',
            rest: '1 día entre sesiones',
            days: [
                {
                    name: 'Día 1 - Enfoque Pecho/Pierna',
                    exercises: [
                        'Sentadillas con peso corporal (3x15)',
                        'Press banca con mancuernas (3x15)',
                        'Remo con mancuerna (3x15)',
                        'Zancadas (2x15)',
                        'Elevaciones laterales (2x15)',
                        'Abdominales (3x20)'
                    ]
                },
                {
                    name: 'Día 2 - Enfoque Espalda/Hombro',
                    exercises: [
                        'Peso muerto con mancuernas (3x15)',
                        'Press militar con mancuernas (3x15)',
                        'Jalones al pecho (3x15)',
                        'Extensions de tríceps (2x15)',
                        'Curl de bíceps (2x15)',
                        'Plancha (3x30s)'
                    ]
                },
                {
                    name: 'Día 3 - Enfoque Pierna/Core',
                    exercises: [
                        'Prensa (3x15)',
                        'Push ups (3x12)',
                        'Remo en máquina (3x15)',
                        'Extension de cuádriceps (2x15)',
                        'Curl de isquios (2x15)',
                        'Russian twist (3x20)'
                    ]
                }
            ]
        },
        'avanzado': {
            title: 'Full Body - Avanzado',
            frequency: '3 veces por semana',
            rest: '1 día entre sesiones',
            days: [
                {
                    name: 'Día 1 - Fuerza Principal',
                    exercises: [
                        'Sentadillas con barra (5x5)',
                        'Press banca (5x5)',
                        'Dominadas lastradas (4x8)',
                        'Press militar (4x8)',
                        'Hip thrust (3x12)',
                        'Abdominales con peso (4x15)'
                    ]
                },
                {
                    name: 'Día 2 - Volumen',
                    exercises: [
                        'Peso muerto (5x5)',
                        'Press inclinado (4x8)',
                        'Remo con barra (4x8)',
                        'Fondos lastrados (4x10)',
                        'Bulgarian split squats (3x10)',
                        'Pallof press (3x15)'
                    ]
                },
                {
                    name: 'Día 3 - Explosividad',
                    exercises: [
                        'Clean & Press (4x6)',
                        'Press banca cerrado (4x8)',
                        'Remo pendlay (4x8)',
                        'Front squats (4x8)',
                        'Pull ups (4x8)',
                        'Dragon flags (3x8)'
                    ]
                }
            ]
        }
    },
    'upper-lower': {
        'principiante': {
            title: 'Upper/Lower - Principiante',
            frequency: '4 veces por semana',
            rest: 'Alternar días',
            days: [
                {
                    name: 'Upper (Día 1)',
                    exercises: [
                        'Press banca con mancuernas (3x15)',
                        'Remo con polea baja (3x15)',
                        'Press militar máquina (3x15)',
                        'Curl de bíceps con mancuernas (3x15)',
                        'Extensions de tríceps en polea (3x15)'
                    ]
                },
                {
                    name: 'Lower (Día 2)',
                    exercises: [
                        'Sentadillas con peso corporal (3x15)',
                        'Peso muerto rumano con mancuernas (3x15)',
                        'Extension de cuádriceps (3x15)',
                        'Curl de isquios (3x15)',
                        'Elevación de gemelos (3x20)'
                    ]
                }
            ]
        },
        'avanzado': {
            title: 'Upper/Lower - Avanzado',
            frequency: '4 veces por semana',
            rest: 'Alternar días',
            days: [
                {
                    name: 'Upper (Día 1)',
                    exercises: [
                        'Press banca (4x8)',
                        'Remo pendlay (4x8)',
                        'Press militar con barra (4x8)',
                        'Dominadas con peso (4x8)',
                        'Fondos lastrados (4x10)'
                    ]
                },
                {
                    name: 'Lower (Día 2)',
                    exercises: [
                        'Sentadillas (5x5)',
                        'Peso muerto (5x5)',
                        'Bulgarian split squats (4x8)',
                        'Hip thrust con barra (4x10)',
                        'Peso muerto rumano (4x8)'
                    ]
                }
            ]
        }
    },
    'push-pull': {
    'principiante': {
        title: 'Push/Pull/Legs - Principiante',
        frequency: '3-6 veces por semana',
        rest: 'Descanso según frecuencia elegida',
        days: [
            {
                name: 'Push (Día 1)',
                exercises: [
                    'Press banca en máquina (3x15)',
                    'Press militar en máquina (3x15)',
                    'Press inclinado con mancuernas (3x15)',
                    'Extensiones de tríceps en polea (3x15)',
                    'Elevaciones laterales (3x15)',
                    'Push ups (2x10)'
                ]
            },
            {
                name: 'Pull (Día 2)',
                exercises: [
                    'Jalones al pecho máquina (3x15)',
                    'Remo en máquina (3x15)',
                    'Remo con mancuerna (3x15)',
                    'Curl de bíceps con mancuernas (3x15)',
                    'Face pulls (3x15)',
                    'Curl martillo (2x15)'
                ]
            },
            {
                name: 'Legs (Día 3)',
                exercises: [
                    'Sentadillas con peso corporal (3x15)',
                    'Prensa (3x15)',
                    'Peso muerto rumano mancuerna (3x15)',
                    'Extensión de cuádriceps (3x15)',
                    'Curl de isquios (3x15)',
                    'Elevación de gemelos (4x20)'
                ]
            },
            {
                name: 'Push 2 (Día 4)',
                exercises: [
                    'Press banca con mancuernas (3x15)',
                    'Press militar con mancuernas (3x15)',
                    'Aperturas en máquina (3x15)',
                    'Extensiones de tríceps con cuerda (3x15)',
                    'Elevaciones frontales (3x15)',
                    'Fondos asistidos (2x10)'
                ]
            },
            {
                name: 'Pull 2 (Día 5)',
                exercises: [
                    'Jalones con agarre cerrado (3x15)',
                    'Remo a una mano (3x15)',
                    'Pullover con mancuerna (3x15)',
                    'Curl predicador (3x15)',
                    'Remo al mentón (3x15)',
                    'Hiperextensiones (2x15)'
                ]
            },
            {
                name: 'Legs 2 (Día 6)',
                exercises: [
                    'Búlgaras con peso corporal (3x12)',
                    'Hack squat en máquina (3x15)',
                    'Peso muerto sumo mancuerna (3x15)',
                    'Abducciones (3x20)',
                    'Elevación de talones sentado (4x20)',
                    'Plancha (3x30s)'
                ]
            }
        ]
    },
    'avanzado': {
        title: 'Push/Pull/Legs - Avanzado',
        frequency: '3-6 veces por semana',
        rest: 'Descanso según frecuencia elegida',
        days: [
            {
                name: 'Push (Día 1)',
                exercises: [
                    'Press banca (4x6-8)',
                    'Press militar con barra (4x8)',
                    'Press inclinado con barra (4x8)',
                    'Fondos lastrados (4x8)',
                    'Extensiones de tríceps (4x10)',
                    'Elevaciones laterales (4x12)'
                ]
            },
            {
                name: 'Pull (Día 2)',
                exercises: [
                    'Dominadas lastradas (4x8)',
                    'Remo pendlay (4x8)',
                    'Remo con barra (4x8)',
                    'Curl de bíceps con barra (4x8)',
                    'Remo en T (4x10)',
                    'Face pulls (4x15)'
                ]
            },
            {
                name: 'Legs (Día 3)',
                exercises: [
                    'Sentadillas (5x5)',
                    'Peso muerto (4x6)',
                    'Hack squats (4x8)',
                    'Hip thrust con barra (4x10)',
                    'Peso muerto rumano (4x8)',
                    'Elevación de gemelos (5x12)'
                ]
            },
            {
                name: 'Push 2 (Día 4)',
                exercises: [
                    'Press banca cerrado (4x8)',
                    'Press arnold (4x10)',
                    'Dips explosivos (4x8)',
                    'JM Press (4x10)',
                    'Laterales gota (3x12-15-20)',
                    'Press en guillotina (3x12)'
                ]
            },
            {
                name: 'Pull 2 (Día 5)',
                exercises: [
                    'Dominadas agarre cerrado (4x8)',
                    'Remo meadows (4x10)',
                    'Pull-ups explosivas (4x6)',
                    'Curl 21s (3 series)',
                    'Remo Kroc (2x20)',
                    'Shrugs con trampa (4x12)'
                ]
            },
            {
                name: 'Legs 2 (Día 6)',
                exercises: [
                    'Front squats (4x8)',
                    'Good mornings (4x10)',
                    'Peso muerto sumo (4x8)',
                    'Lunges con barra (3x12)',
                    'Sissy squats (3x12)',
                    'Gemelos parado (5x15)'
                ]
            }
        ]
    }
}
};

function createRoutineCard(routine) {
    const layout = getLayoutType(routine);
    
    return `
        <div class="workout-card">
            <h3>${routine.title}</h3>
            <div class="routine-info">
                <p>Frecuencia: ${routine.frequency}</p>
                <p>Descanso: ${routine.rest}</p>
            </div>
            <div class="workout-columns ${layout}">
                ${createWorkoutDays(routine.days, layout)}
            </div>
            <button class="btn-primary">Comenzar Rutina</button>
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
