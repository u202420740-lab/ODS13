document.addEventListener('DOMContentLoaded', () => {
    const btnEscuchar = document.getElementById('btn-atmos-escuchar');
    const btnPausar = document.getElementById('btn-atmos-pausar');
    const btnDetener = document.getElementById('btn-atmos-detener');
    const selectVelocidad = document.getElementById('atmos-velocidad');
    const estadoTexto = document.getElementById('lector-atmos-estado');

    // Recuperación ante errores si el navegador no soporta Web Speech API
    if (!('speechSynthesis' in window)) {
        estadoTexto.textContent = 'Tu navegador no es compatible con la lectura por voz.';
        btnEscuchar.disabled = true;
        selectVelocidad.disabled = true;
        return;
    }

    const synth = window.speechSynthesis;
    let secciones = [];
    let indice = 0;
    let pausado = false;

    function actualizarControles(leyendo, enPausa = false) {
        btnEscuchar.disabled = leyendo && !enPausa;
        btnPausar.disabled = !leyendo;
        btnDetener.disabled = !leyendo;
        btnEscuchar.textContent = enPausa ? '▶ Seguir' : '▶ Escuchar';
    }

    function limpiarResaltado() {
        document.querySelectorAll('.seccion-en-lectura').forEach(sec => {
            sec.classList.remove('seccion-en-lectura');
        });
    }

    // Extrae el texto limpio de cada sección de AtmosHero evitando ruido visual
    function extraerTextoSeccion(seccion) {
        const clon = seccion.cloneNode(true);

        // Eliminar elementos ocultos, decorativos, formularios y controles internos
        clon.querySelectorAll('[aria-hidden="true"], [hidden], noscript, form, button, select, input').forEach(el => {
            el.remove();
        });

        // En el orientador (#orientador), leer solo la acción que el usuario tiene seleccionada
        if (seccion.id === 'orientador') {
            const radioActivo = seccion.querySelector('input[type="radio"]:checked');
            if (radioActivo) {
                const claseActiva = radioActivo.id; // mochila, libreta o abrigo
                clon.querySelectorAll('.respuesta').forEach(resp => {
                    if (!resp.classList.contains(claseActiva)) {
                        resp.remove();
                    }
                });
            }
        }

        return clon.innerText.replace(/\s+/g, ' ').trim();
    }

    function narrarSeccion(idx) {
        if (idx >= secciones.length) {
            limpiarResaltado();
            estadoTexto.textContent = 'Lectura completada. Gracias por informarte con AtmosHero.';
            actualizarControles(false, false);
            indice = 0;
            return;
        }

        limpiarResaltado();
        const seccionActual = secciones[idx];
        seccionActual.classList.add('seccion-en-lectura');
        seccionActual.scrollIntoView({ behavior: 'smooth', block: 'center' });

        const encabezado = seccionActual.querySelector('h1, h2');
        const titulo = encabezado ? encabezado.innerText.trim() : `Sección ${idx + 1}`;
        estadoTexto.textContent = `Leyendo (${idx + 1}/${secciones.length}): ${titulo}`;

        const texto = extraerTextoSeccion(seccionActual);
        const enunciado = new SpeechSynthesisUtterance(texto);
        enunciado.lang = 'es-PE';
        enunciado.rate = parseFloat(selectVelocidad.value);

        enunciado.onend = () => {
            if (!pausado) {
                indice++;
                narrarSeccion(indice);
            }
        };

        enunciado.onerror = (evento) => {
            if (evento.error !== 'interrupted' && evento.error !== 'canceled') {
                limpiarResaltado();
                estadoTexto.textContent = 'Se detuvo la narración por un fallo de audio.';
                actualizarControles(false, false);
            }
        };

        synth.speak(enunciado);
    }

    btnEscuchar.addEventListener('click', () => {
        if (synth.paused && pausado) {
            pausado = false;
            synth.resume();
            estadoTexto.textContent = 'Reanudando lectura...';
            actualizarControles(true, false);
            return;
        }

        synth.cancel();
        pausado = false;
        secciones = Array.from(document.querySelectorAll('#contenido > section'));
        indice = 0;

        if (secciones.length === 0) {
            estadoTexto.textContent = 'No se encontró contenido para narrar.';
            return;
        }

        actualizarControles(true, false);
        narrarSeccion(indice);
    });

    btnPausar.addEventListener('click', () => {
        if (synth.speaking && !synth.paused) {
            pausado = true;
            synth.pause();
            estadoTexto.textContent = 'Lectura en pausa. Pulsa Seguir para continuar.';
            actualizarControles(true, true);
        }
    });

    btnDetener.addEventListener('click', () => {
        pausado = false;
        synth.cancel();
        limpiarResaltado();
        indice = 0;
        estadoTexto.textContent = 'Lectura detenida. Listo cuando lo necesites.';
        actualizarControles(false, false);
    });

    selectVelocidad.addEventListener('change', () => {
        if (synth.speaking) {
            synth.cancel();
            narrarSeccion(indice);
        }
    });

    window.addEventListener('beforeunload', () => {
        synth.cancel();
    });
});