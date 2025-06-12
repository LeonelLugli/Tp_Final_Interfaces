// CÓDIGO FINAL Y DEFINITIVO PARA crear_rutinas.js
document.addEventListener('DOMContentLoaded', function() {
    // --- OBTENCIÓN DE ELEMENTOS DEL DOM ---
    const routineFrequency = document.getElementById('routineFrequency');
    const daysContainer = document.getElementById('daysContainer');
    const daySelect = document.getElementById('daySelect');
    const addExercise = document.getElementById('addExercise');
    const createRoutineBtn = document.getElementById('createRoutine');
    const exerciseForm = document.getElementById('exerciseForm');

    // --- OBJETO PARA CONSTRUIR LA RUTINA ---
    let currentRoutine = {
        nombre: '',
        frecuencia: '',
        descanso: '',
        dias: []
    };

    // --- FUNCIÓN PARA ACTUALIZAR DÍAS DE DESCANSO ---
    function updateRestOptions(frequency) {
        const restSelect = document.getElementById('routineRest');
        restSelect.innerHTML = '<option value="">Días de descanso</option>';
        if (!frequency) return;
        let options = '';
        switch (parseInt(frequency)) {
            case 3: options = '<option value="1 día entre sesiones">1 día entre sesiones</option>'; break;
            case 4: options = '<option value="Alternar días">Alternar días</option>'; break;
            case 5: options = '<option value="Descansar fines de semana">Descansar fines de semana</option>'; break;
            case 6: options = '<option value="1 día al final">1 día al final</option>'; break;
        }
        restSelect.innerHTML += options;
    }

    // --- LÓGICA PARA CREAR LOS DÍAS VISUALMENTE ---
    routineFrequency.addEventListener('change', function() {
        const frequency = parseInt(this.value, 10) || 0;
        currentRoutine.dias = [];
        let dayOptions = '<option value="">Selecciona el día</option>';
        daysContainer.innerHTML = '';
        updateRestOptions(frequency);

        for (let i = 1; i <= frequency; i++) {
            currentRoutine.dias.push({ numero_dia: i, nombre_dia: `Día ${i}`, ejercicios: [] });
            dayOptions += `<option value="${i - 1}">Día ${i}</option>`;
            const dayCard = document.createElement('div');
            dayCard.className = 'day-card';
            dayCard.id = `day-${i - 1}`;
            dayCard.innerHTML = `<h3>Día ${i}</h3><ul class="exercise-list"></ul>`;
            daysContainer.appendChild(dayCard);
        }
        daySelect.innerHTML = dayOptions;
    });

    // --- LÓGICA PARA AÑADIR EJERCICIOS ---
    addExercise.addEventListener('click', function(e) {
        e.preventDefault();
        const dayIndex = daySelect.value;
        const exerciseData = {
            nombre_ejercicio: document.getElementById('exerciseName').value.trim(),
            grupo_muscular: document.getElementById('muscleGroup').value,
            series: document.getElementById('exerciseSets').value.trim(),
            repeticiones: document.getElementById('exerciseReps').value.trim()
        };
        if (dayIndex === "" || !exerciseData.nombre_ejercicio || !exerciseData.grupo_muscular || !exerciseData.series || !exerciseData.repeticiones) {
            alert('Por favor completa todos los campos del ejercicio');
            return;
        }
        currentRoutine.dias[dayIndex].ejercicios.push(exerciseData);
        const exerciseList = document.querySelector(`#day-${dayIndex} .exercise-list`);
        exerciseList.innerHTML += `<li><span class="muscle-tag ${exerciseData.grupo_muscular}">${exerciseData.grupo_muscular}</span> ${exerciseData.nombre_ejercicio} (${exerciseData.series}×${exerciseData.repeticiones})</li>`;
        exerciseForm.reset();
    });

    // --- LÓGICA PARA GUARDAR LA RUTINA EN LA BASE DE DATOS ---
    createRoutineBtn.addEventListener('click', async function() {
        const sessionDataString = sessionStorage.getItem('userSession') || localStorage.getItem('userSession');
        if (!sessionDataString) {
            alert('Debes iniciar sesión para guardar la rutina');
            return;
        }

        currentRoutine.nombre = document.getElementById('routineTitle').value.trim();
        currentRoutine.frecuencia = document.getElementById('routineFrequency').value;
        currentRoutine.descanso = document.getElementById('routineRest').value;

        if (!currentRoutine.nombre || !currentRoutine.frecuencia) {
            alert('Por favor, asigna un nombre y una frecuencia a la rutina.');
            return;
        }
        if (currentRoutine.dias.some(day => day.ejercicios.length === 0)) {
            alert('Todos los días deben tener al menos un ejercicio.');
            return;
        }

        try {
            // URL CORREGIDA Y COMPLETA
            const url = 'http://localhost/Tp_Final_Interfaces/backend/api/rutinas/crear_rutina.php';
            const response = await fetch(url, {
                method: 'POST',
                credentials: 'include', // Línea para enviar la cookie de sesión
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentRoutine)
            });

            const result = await response.json();
            alert(result.mensaje);
            if (response.ok) { window.location.href = 'mis_rutinas.html'; }
        } catch (err) {
            console.error('Error de conexión:', err);
            alert('Error de conexión. Revisa la consola (F12).');
        }
    });
});