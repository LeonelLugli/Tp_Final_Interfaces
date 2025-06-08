document.addEventListener('DOMContentLoaded', function() {
    const routineFrequency = document.getElementById('routineFrequency');
    const daysContainer = document.getElementById('daysContainer');
    const daySelect = document.getElementById('daySelect');
    const addExercise = document.getElementById('addExercise');
    const createRoutine = document.getElementById('createRoutine');

    let currentRoutine = {
        title: '',
        frequency: '',
        rest: '',
        days: []
    };

    routineFrequency.addEventListener('change', function() {
        const frequency = parseInt(this.value);
        currentRoutine.days = [];
        daySelect.innerHTML = '<option value="">Selecciona el día</option>';
        daysContainer.innerHTML = '';

        for (let i = 1; i <= frequency; i++) {
            const dayName = `Día ${i}`;
            
            // Agregar día al objeto de rutina
            currentRoutine.days.push({
                name: dayName,
                exercises: []
            });

            // Agregar opción al select
            daySelect.innerHTML += `<option value="${i-1}">${dayName}</option>`;

            // Crear contenedor visual para el día
            const dayCard = document.createElement('div');
            dayCard.className = 'day-card';
            dayCard.id = `day-${i-1}`;
            dayCard.innerHTML = `
                <h3>${dayName}</h3>
                <ul class="exercise-list"></ul>
            `;
            daysContainer.appendChild(dayCard);
        }
    });

    addExercise.addEventListener('click', function() {
    const dayIndex = daySelect.value;
    const exerciseName = document.getElementById('exerciseName').value;
    const muscleGroup = document.getElementById('muscleGroup').value;
    const sets = document.getElementById('exerciseSets').value;
    const reps = document.getElementById('exerciseReps').value;

    if (!dayIndex || !exerciseName || !muscleGroup || !sets || !reps) {
        alert('Por favor completa todos los campos');
        return;
    }

    const exercise = {
        name: exerciseName,
        muscle: muscleGroup,
        sets: sets,
        reps: reps
    };
    
    // Agregar al objeto de rutina
    currentRoutine.days[dayIndex].exercises.push(exercise);

    // Actualizar UI
    const dayCard = document.querySelector(`#day-${dayIndex}`);
    const exerciseList = dayCard.querySelector('.exercise-list');
    const exerciseItem = document.createElement('li');
    exerciseItem.innerHTML = `
        <span class="muscle-tag ${muscleGroup}">${muscleGroup}</span>
        ${exerciseName} (${sets}×${reps})
    `;
    exerciseList.appendChild(exerciseItem);

    // Limpiar campos
    document.getElementById('exerciseName').value = '';
    document.getElementById('muscleGroup').value = '';
    document.getElementById('exerciseSets').value = '';
    document.getElementById('exerciseReps').value = '';
});

    createRoutine.addEventListener('click', function() {
        currentRoutine.title = document.getElementById('routineTitle').value;
        currentRoutine.frequency = `${routineFrequency.value} veces por semana`;
        currentRoutine.rest = document.getElementById('routineRest').value;

        if (!currentRoutine.title || !currentRoutine.frequency || !currentRoutine.rest) {
            alert('Por favor completa la información de la rutina');
            return;
        }

        const emptyDays = currentRoutine.days.filter(day => day.exercises.length === 0);
        if (emptyDays.length > 0) {
            alert('Todos los días deben tener al menos un ejercicio');
            return;
        }

        // Guardar rutina
        const savedRoutines = JSON.parse(localStorage.getItem('customRoutines') || '[]');
        savedRoutines.push(currentRoutine);
        localStorage.setItem('customRoutines', JSON.stringify(savedRoutines));
        
        alert('¡Rutina creada exitosamente!');
        window.location.href = 'index.html';
    });
    // Función para actualizar opciones de descanso
    function updateRestOptions(frequency) {
        const restSelect = document.getElementById('routineRest');
        restSelect.innerHTML = '<option value="">Días de descanso</option>';
        
        switch(parseInt(frequency)) {
            case 3:
                restSelect.innerHTML += `
                    <option value="1">1 día entre sesiones</option>
                    <option value="2">2 días entre sesiones</option>
                `;
                break;
            case 4:
                restSelect.innerHTML += `
                    <option value="1">1 día entre sesiones</option>
                    <option value="2">2 días alternados</option>
                `;
                break;
            case 5:
                restSelect.innerHTML += `
                    <option value="1">1 día entre sesiones</option>
                    <option value="2">2 días al final</option>
                `;
                break;
            case 6:
                restSelect.innerHTML += `
                    <option value="1">1 día al final</option>
                `;
                break;
        }
    }

    // Evento para actualizar días de descanso cuando cambia la frecuencia
    routineFrequency.addEventListener('change', function() {
        const frequency = parseInt(this.value);
        updateRestOptions(frequency);
        

    });
});