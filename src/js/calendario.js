let calendarInstance;

document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    
    // Datos de ejemplo de rutinas programadas
    const rutinasCalendario = [
        {
            id: 'rutina-1',
            title: 'Pecho y Tríceps',
            date: '2025-06-11',
            tipo: 'gimnasio',
            url: 'ver_rutina.html?id=pecho-triceps&fecha=2025-06-11'
        },
        {
            id: 'rutina-2',
            title: 'Espalda y Bíceps',
            date: '2025-06-12',
            tipo: 'gimnasio',
            url: 'ver_rutina.html?id=espalda-biceps&fecha=2025-06-12'
        },
        {
            id: 'rutina-3',
            title: 'Piernas',
            date: '2025-06-13',
            tipo: 'gimnasio',
            url: 'ver_rutina.html?id=piernas&fecha=2025-06-13'
        },
        {
            id: 'rutina-4',
            title: 'Cardio en Casa',
            date: '2025-06-14',
            tipo: 'casa',
            url: 'ver_rutina.html?id=cardio-casa&fecha=2025-06-14'
        },
        {
            id: 'rutina-5',
            title: 'Hombros y Abdomen',
            date: '2025-06-15',
            tipo: 'gimnasio',
            url: 'ver_rutina.html?id=hombros-abdomen&fecha=2025-06-15'
        }
    ];
    
    // Crear calendario con tu diseño personalizado
    calendarInstance = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        height: 'auto',
        headerToolbar: false, // Mantener false para usar tu navegación personalizada
        locale: 'es',
        editable: true,
        selectable: true,
        fixedWeekCount: false,
        showNonCurrentDates: false,
        events: rutinasCalendario.map(rutina => ({
            id: rutina.id,
            title: rutina.title,
            date: rutina.date,
            backgroundColor: rutina.tipo === 'gimnasio' ? '#00b4d8' : '#ff6b6b',
            borderColor: rutina.tipo === 'gimnasio' ? '#0077b6' : '#e55353',
            textColor: '#ffffff',
            extendedProps: {
                tipo: rutina.tipo,
                url: rutina.url
            }
        })),
        
        // Manejar clic en eventos (rutinas)
        eventClick: function(info) {
            info.jsEvent.preventDefault();
            
            const rutina = info.event;
            const confirmacion = confirm(
                `¿Quieres ver la rutina "${rutina.title}" programada para este día?`
            );
            
            if (confirmacion) {
                window.location.href = rutina.extendedProps.url;
            }
        },
        
        // Manejar clic en días vacíos
        dateClick: function(info) {
            const fecha = info.dateStr;
            const fechaObj = new Date(fecha + 'T00:00:00');
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            
            // Verificar si hay rutina programada para este día
            const rutinaDelDia = rutinasCalendario.find(r => r.date === fecha);
            
            if (rutinaDelDia) {
                const confirmacion = confirm(
                    `¿Quieres ver la rutina "${rutinaDelDia.title}" programada para el ${fechaObj.toLocaleDateString('es-ES')}?`
                );
                
                if (confirmacion) {
                    window.location.href = rutinaDelDia.url;
                }
            } else {
                // Si no hay rutina, ofrecer crear una
                const fechaFormateada = fechaObj.toLocaleDateString('es-ES');
                
                if (fechaObj < hoy) {
                    alert(`No hay rutina programada para el ${fechaFormateada} (fecha pasada).`);
                } else {
                    const crearRutina = confirm(
                        `No hay rutina programada para el ${fechaFormateada}. ¿Quieres crear una rutina para este día?`
                    );
                    
                    if (crearRutina) {
                        window.location.href = `crear_rutina.html?fecha=${fecha}`;
                    }
                }
            }
        },
        
        // Personalizar la apariencia de los días
        dayCellDidMount: function(info) {
            const fecha = info.dateStr;
            const rutinaDelDia = rutinasCalendario.find(r => r.date === fecha);
            
            if (rutinaDelDia) {
                // Agregar clase especial a días con rutina
                info.el.classList.add('dia-con-rutina');
                info.el.style.cursor = 'pointer';
                info.el.title = `Clic para ver: ${rutinaDelDia.title}`;
            } else {
                // Días sin rutina
                info.el.classList.add('dia-sin-rutina');
                info.el.style.cursor = 'pointer';
                info.el.title = 'Clic para programar rutina';
            }
        }
    });
    
    calendarInstance.render();

    // Crear barra de navegación personalizada (TU DISEÑO ORIGINAL)
    const navContainer = document.createElement('div');
    navContainer.className = 'calendar-nav';
    
    // Crear contenedor para los controles de navegación
    const navControls = document.createElement('div');
    navControls.className = 'nav-controls';
    
    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = '←';
    prevBtn.onclick = () => {
        calendarInstance.prev();
        updateTitle();
    };
    
    const monthTitle = document.createElement('div');
    monthTitle.className = 'month-title';
    
    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = '→';
    nextBtn.onclick = () => {
        calendarInstance.next();
        updateTitle();
    };
    
    const todayBtn = document.createElement('button');
    todayBtn.className = 'today-button';
    todayBtn.innerHTML = 'Día Actual';
    todayBtn.onclick = () => {
        calendarInstance.today();
        updateTitle();
    };
    
    function updateTitle() {
        const date = calendarInstance.getDate();
        const formattedDate = date.toLocaleDateString('es', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        monthTitle.innerHTML = formattedDate;
    }
    
    updateTitle();
    
    // Primero agregamos los elementos al navControls
    navControls.appendChild(prevBtn);
    navControls.appendChild(monthTitle);
    navControls.appendChild(nextBtn);
    
    // Luego agregamos navControls y todayBtn al contenedor principal
    navContainer.appendChild(navControls);
    navContainer.appendChild(todayBtn);
    
    calendarEl.insertBefore(navContainer, calendarEl.firstChild);
    
    // Mostrar rutina de hoy en la sección lateral
    mostrarRutinaDeHoy();
    
    function mostrarRutinaDeHoy() {
        const hoy = new Date().toISOString().split('T')[0];
        const rutinaHoy = rutinasCalendario.find(r => r.date === hoy);
        const rutinaSection = document.getElementById('routineSection');
        
        if (rutinaHoy) {
            rutinaSection.innerHTML = `
                <h2>Rutina de hoy</h2>
                <div class="rutina-hoy">
                    <div class="rutina-card ${rutinaHoy.tipo}">
                        <div class="rutina-header">
                            <i class="fas fa-${rutinaHoy.tipo === 'gimnasio' ? 'dumbbell' : 'home'}"></i>
                            <h3>${rutinaHoy.title}</h3>
                        </div>
                        <div class="rutina-tipo">
                            ${rutinaHoy.tipo === 'gimnasio' ? 'Gimnasio' : 'En Casa'}
                        </div>
                        <button class="btn-ver-rutina" onclick="window.location.href='${rutinaHoy.url}'">
                            <i class="fas fa-play"></i> Comenzar Rutina
                        </button>
                    </div>
                </div>
            `;
        } else {
            rutinaSection.innerHTML = `
                <h2>Rutina de hoy</h2>
                <div class="no-rutina">
                    <i class="fas fa-calendar-plus"></i>
                    <p>No hay rutina programada para hoy</p>
                    <button class="btn-crear-rutina" onclick="window.location.href='crear_rutina.html?fecha=${hoy}'">
                        <i class="fas fa-plus"></i> Crear Rutina
                    </button>
                </div>
            `;
        }
    }
});