let calendarInstance;

document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    calendarInstance = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        height: 'auto',
        headerToolbar: false,
        locale: 'es',
        editable: true,
        selectable: true,
        fixedWeekCount: false,
        showNonCurrentDates: false
    });
    
    calendarInstance.render();

    // Crear barra de navegación personalizada
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
});