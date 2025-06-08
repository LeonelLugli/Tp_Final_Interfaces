// Datos de ejemplo para mostrar cómo se vería la página
const rutinasEjemplo = [
    {
        id: 1,
        nombre: "Push Pull Legs",
        tipo: "push-pull-legs",
        dias: 6,
        descripcion: "Rutina de 6 días dividida en empuje, tirón y piernas",
        fechaCreacion: "2023-12-01",
        favorita: true,
        diasEntrenamiento: ["Lunes - Push", "Martes - Pull", "Miércoles - Legs"]
    },
    {
        id: 2,
        nombre: "Upper Lower",
        tipo: "upper-lower",
        dias: 4,
        descripcion: "Rutina de 4 días alternando tren superior e inferior",
        fechaCreacion: "2023-11-15",
        favorita: false,
        diasEntrenamiento: ["Lunes - Upper", "Martes - Lower"]
    }
];

// Cargar rutinas al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Intentar cargar rutinas del localStorage primero
    const rutinasGuardadas = localStorage.getItem('rutinasCreadas');
    if (rutinasGuardadas) {
        const rutinas = JSON.parse(rutinasGuardadas);
        if (rutinas.length > 0) {
            cargarRutinas(rutinas);
            actualizarEstadisticas(rutinas);
            return;
        }
    }
    
    // Si no hay rutinas guardadas, mostrar mensaje de no rutinas
    mostrarMensajeVacio();
});

function cargarRutinas(rutinas) {
    const container = document.getElementById('routinesContainer');
    const noRoutinesMessage = document.getElementById('noRoutinesMessage');
    const mainContainer = document.querySelector('.my-routines-container');
    
    // Agregar clase que muestra rutinas (y el sidebar)
    document.body.classList.add('has-routines');
    
    // Resto del código igual...
}
function mostrarMensajeVacio() {
    const container = document.getElementById('routinesContainer');
    const noRoutinesMessage = document.getElementById('noRoutinesMessage');
    const mainContainer = document.querySelector('.my-routines-container');
    
    // Quitar clase que muestra rutinas
    document.body.classList.remove('has-routines');
    
    // Ocultar completamente el grid Y el contenedor principal
    if (container) {
        container.style.display = 'none';
        container.innerHTML = '';
    }
    
    if (mainContainer) {
        mainContainer.style.display = 'none';
    }
    
    // Mostrar mensaje
    if (noRoutinesMessage) {
        noRoutinesMessage.style.display = 'flex';
    }
}

function crearTarjetaRutina(rutina) {
    const card = document.createElement('div');
    card.className = 'routine-card';
    
    card.innerHTML = `
        <div class="routine-header">
            <h3 class="routine-title">${rutina.nombre}</h3>
            <div class="routine-actions">
                <button class="action-btn favorite ${rutina.favorita ? 'active' : ''}">
                    <i class="fas fa-heart"></i>
                </button>
                <button class="action-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        
        <div class="routine-info">
            <div class="routine-meta">
                <span><i class="fas fa-calendar"></i> ${rutina.dias} días</span>
                <span><i class="fas fa-tag"></i> ${rutina.tipo || 'Personalizada'}</span>
                <span><i class="fas fa-clock"></i> ${new Date(rutina.fechaCreacion || Date.now()).toLocaleDateString()}</span>
            </div>
            <p class="routine-description">${rutina.descripcion || 'Sin descripción'}</p>
        </div>
        
        <div class="routine-buttons">
            <button class="btn-view">
                <i class="fas fa-eye"></i> Ver Rutina
            </button>
            <button class="btn-edit">
                <i class="fas fa-edit"></i> Editar
            </button>
        </div>
    `;
    
    return card;
}

function actualizarEstadisticas(rutinas) {
    document.getElementById('totalRoutines').textContent = rutinas.length;
    document.getElementById('favoriteRoutines').textContent = rutinas.filter(r => r.favorita).length;
    document.getElementById('completedWorkouts').textContent = '0';
}

// Funcionalidad básica de filtros
document.getElementById('searchRoutines')?.addEventListener('input', function(e) {
    console.log('Buscando:', e.target.value);
});

document.getElementById('filterByDays')?.addEventListener('change', function(e) {
    console.log('Filtrar por días:', e.target.value);
});

document.getElementById('filterByType')?.addEventListener('change', function(e) {
    console.log('Filtrar por tipo:', e.target.value);
});