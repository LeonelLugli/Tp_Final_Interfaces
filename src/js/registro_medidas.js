// CÓDIGO FINAL Y DEFINITIVO para registro_medidas.js
document.addEventListener('DOMContentLoaded', function() {
    // --- OBTENER Y MOSTRAR DATOS HISTÓRICOS AL CARGAR LA PÁGINA ---
    async function cargarHistorial() {
        try {
            const url = 'http://localhost/Tp_Final_Interfaces/backend/api/medidas/obtener_medidas.php';
            const response = await fetch(url, { credentials: 'include' });
            const result = await response.json();

            if (response.ok && result.success && result.historial.length > 0) {
                const historial = result.historial;
                const registroActual = historial[0]; // El más reciente
                const ultimoRegistro = historial[1] || null; // El anterior, si existe

                // Actualizamos las tablas con los datos de la base de datos
                actualizarTablaPeso(historial.filter(r => r.peso !== null));
                if(registroActual) {
                    mostrarComparacion(ultimoRegistro, registroActual);
                }
            } else {
                mostrarComparacion(null, null);
                actualizarTablaPeso([]);
            }
        } catch (error) {
            console.error("Error al cargar historial:", error);
        }
    }
    
    cargarHistorial(); // Llamamos a la función al cargar la página

    // --- LÓGICA PARA GUARDAR MEDIDAS CORPORALES ---
    const medidasForm = document.getElementById('medidasForm');
    if (medidasForm) {
        medidasForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const campos = ['pecho', 'brazo_der', 'brazo_izq', 'antebrazo_der', 'antebrazo_izq', 'cintura', 'pierna_der', 'pierna_izq', 'gemelo_der', 'gemelo_izq', 'cuello'];
            const registroActual = {};
            let hayDatos = false;

            campos.forEach(id => {
                const valor = document.getElementById(id).value;
                if (valor) {
                    registroActual[id] = parseFloat(valor);
                    hayDatos = true;
                }
            });

            if (!hayDatos) {
                alert('Debes rellenar al menos una medida corporal.');
                return;
            }

            // Enviamos solo las medidas corporales al backend
            guardarRegistro(registroActual);
        });
    }

    // --- LÓGICA PARA GUARDAR PESO ---
    const btnPeso = document.querySelector('.btn-registro-peso');
    if(btnPeso) {
        btnPeso.addEventListener('click', async function() {
            const pesoInput = document.getElementById('peso-actual');
            const peso = pesoInput.value;

            if (!peso || parseFloat(peso) <= 0) {
                alert('Por favor ingresa un peso válido');
                return;
            }
            // Enviamos solo el peso al backend
            guardarRegistro({ peso: parseFloat(peso) });
            pesoInput.value = '';
        });
    }

    // --- FUNCIÓN CENTRAL PARA GUARDAR EN LA BASE DE DATOS ---
    async function guardarRegistro(datos) {
        try {
            const url = 'https://myproyectTPinterfaces.infy.uk/backend/api/medidas/guardar_medidas.php';
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(datos)
            });
            const result = await response.json();
            mostrarNotificacion(result.mensaje);
            if (response.ok) {
                cargarHistorial(); // Si se guardó bien, recargamos el historial
            }
        } catch (error) {
            console.error("Error al guardar:", error);
            mostrarNotificacion('Error de conexión al guardar.');
        }
    }

    // --- FUNCIONES PARA MOSTRAR DATOS (Tus funciones adaptadas) ---
    function mostrarComparacion(ultimo, actual) {
        const campos = [
            { id: 'pecho', label: 'Pecho' }, { id: 'cintura', label: 'Cintura' }, { id: 'cuello', label: 'Cuello' },
            { id: 'brazo_der', label: 'Brazo der.' }, { id: 'brazo_izq', label: 'Brazo izq.' },
            { id: 'antebrazo_der', label: 'Antebrazo der.' }, { id: 'antebrazo_izq', label: 'Antebrazo izq.' },
            { id: 'pierna_der', label: 'Pierna der.' }, { id: 'pierna_izq', label: 'Pierna izq.' },
            { id: 'gemelo_der', label: 'Gemelo der.' }, { id: 'gemelo_izq', label: 'Gemelo izq.' }
        ];

        let html = '';
        if (!actual) {
            html = '<p>No hay registros previos.</p>';
        } else if (actual && !ultimo) {
            html = '<p>Este es tu primer registro de medidas.</p>';
        } else {
            html = '<table style="width:100%;text-align:center;"><tr><th>Medida</th><th>Anterior</th><th>Actual</th><th>Cambio</th></tr>';
            campos.forEach(campo => {
                const prev = ultimo[campo.id] || '-';
                const curr = actual[campo.id] || '-';
                let cambio = '-';
                if (prev !== '-' && curr !== '-') {
                    const diff = (parseFloat(curr) - parseFloat(prev)).toFixed(1);
                    cambio = (diff >= 0 ? '+' : '') + diff + ' cm';
                }
                html += `<tr><td>${campo.label}</td><td>${prev} cm</td><td>${curr} cm</td><td>${cambio}</td></tr>`;
            });
            html += '</table>';
        }
        document.getElementById('comparacionContenido').innerHTML = html;
    }

    function actualizarTablaPeso(historialPeso) {
        const tbody = document.getElementById('peso-comparison-body');
        tbody.innerHTML = '';
        const ultimosRegistros = historialPeso.slice(0, 5);
        
        ultimosRegistros.forEach((registro, index, arr) => {
            const anterior = arr[index + 1] ? arr[index + 1].peso : registro.peso;
            const cambio = registro.peso - anterior;
            const cambioClase = cambio > 0 ? 'positive' : cambio < 0 ? 'negative' : 'neutral';
            const cambioTexto = (index === arr.length - 1) ? '-' : (cambio >= 0 ? `+${cambio.toFixed(1)}` : cambio.toFixed(1));
            const pesoAnteriorTexto = (index === arr.length-1) ? '-' : anterior.toFixed(1) + ' kg';
            
            tbody.innerHTML += `<tr><td>${new Date(registro.fecha).toLocaleDateString('es-ES')}</td><td>${pesoAnteriorTexto}</td><td>${parseFloat(registro.peso).toFixed(1)} kg</td><td class="peso-change ${cambioClase}">${cambioTexto} kg</td></tr>`;
        });

        if (ultimosRegistros.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4">No hay registros de peso</td></tr>';
        }
    }

    function mostrarNotificacion(msg) {
        let notif = document.createElement('div');
        notif.className = 'notificacion-exito';
        notif.innerText = msg;
        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 2500);
    }
});