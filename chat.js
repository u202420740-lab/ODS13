(() => {
  const temas = [
    {
      pregunta: '¿Qué es AtmosHero?',
      palabras: /^\s*atmos\s?hero\s*$|\b(que es atmos\s?hero|mision|vision|quienes son|quienes somos|que es este sitio)\b/,
      respuesta: 'AtmosHero reúne recursos, acciones cotidianas e iniciativas comunitarias para cuidar el ambiente y actuar frente al cambio climático.',
      enlace: ['Conoce AtmosHero', '#nosotros']
    },
    {
      pregunta: 'Ahorro de energía',
      palabras: /\b(energia|electricidad|electrico|luz|luces|consumo electrico|ahorrar energia)\b/,
      respuesta: 'Aprovecha la luz natural, apaga las luces que no necesitas y desconecta los aparatos que puedas dejar desenchufados.',
      enlace: ['Ver acciones ambientales', '#orientador']
    },
    {
      pregunta: 'Reciclaje',
      palabras: /\b(recicl\w*|residuos?|basura|reutiliz\w*|desechos?)\b/,
      respuesta: 'Separa los materiales aprovechables de los demás residuos. Reutiliza lo que puedas y consulta qué materiales recibe el programa de reciclaje de tu comunidad.',
      enlace: ['Ver acciones ambientales', '#orientador']
    },
    {
      pregunta: 'Transporte',
      palabras: /\b(transporte|movilidad|bici\w*|caminar|desplaz\w*|auto|bus)\b/,
      respuesta: 'Cuando sea viable y seguro, camina, usa bicicleta o transporte público, o comparte un viaje en lugar de desplazarte individualmente.',
      enlace: ['Ver acciones ambientales', '#orientador']
    },
    {
      pregunta: 'Emisiones',
      palabras: /\b(emisiones|huella|grafico|porcentajes?|modo inclusivo|patrones?)\b/,
      respuesta: 'El gráfico muestra porcentajes de ejemplo. Puedes activar el modo inclusivo para identificar las categorías también por sus patrones.',
      enlace: ['Ver gráfico de emisiones', '#emisiones']
    },
    {
      pregunta: 'Video y guía',
      palabras: /\b(videos?|guias?|recursos?|ods|cambio climatico|accion por el clima)\b/,
      respuesta: 'En Video y guía encontrarás una introducción al ODS 13 y propuestas para actuar frente al cambio climático en tu comunidad.',
      enlace: ['Abrir Video y guía', 'recursos.html']
    },
    {
      pregunta: 'Proyectos',
      palabras: /\b(proyectos?|particip\w*|encuentros?|voluntari\w*|actividades comunitarias)\b/,
      respuesta: 'En Proyectos puedes explorar las iniciativas presentadas para Lima, Arequipa, Trujillo y Cusco.',
      enlace: ['Explorar proyectos', '#proyectos']
    },
    {
      pregunta: 'Contacto',
      palabras: /\b(contact\w*|correo|telefono|formulario|escribirles|colabor\w*|compartir.*idea|enviar.*propuesta)\b/,
      respuesta: 'En Contáctanos encontrarás la información de contacto y un formulario de demostración para explorar cómo compartir una idea o consulta.',
      enlace: ['Ir a Contáctanos', '#contacto']
    }
  ];

  const chat = document.querySelector('.chat');
  const boton = chat.querySelector('.chat-boton');
  const panel = chat.querySelector('.chat-panel');
  const cerrar = chat.querySelector('.chat-cerrar');
  const contenido = chat.querySelector('.chat-contenido');
  const preguntasRapidas = chat.querySelector('.chat-temas');
  const mensajes = chat.querySelector('.chat-mensajes');
  const volver = chat.querySelector('.chat-volver');
  const formulario = chat.querySelector('.chat-formulario');
  const campo = chat.querySelector('#chat-pregunta');

  function mostrarChat(abierto) {
    panel.hidden = !abierto;
    boton.setAttribute('aria-expanded', String(abierto));
    boton.setAttribute('aria-label', abierto ? 'Cerrar chat de AtmosHero' : 'Abrir chat de AtmosHero');
    if (window.parent !== window) {
      window.parent.postMessage(abierto ? 'atmoshero-chat:abrir' : 'atmoshero-chat:cerrar', '*');
    }
    (abierto ? cerrar : boton).focus({ preventScroll: true });
  }

  function agregarMensaje(autor, texto, destino) {
    const mensaje = document.createElement('div');
    mensaje.className = autor === 'Tú' ? 'chat-mensaje chat-mensaje-usuario' : 'chat-mensaje';
    const etiqueta = document.createElement('strong');
    etiqueta.textContent = autor;
    const parrafo = document.createElement('p');
    parrafo.textContent = texto;
    mensaje.append(etiqueta, parrafo);

    if (destino) {
      const [nombre, ruta] = destino;
      const enlace = document.createElement('a');
      enlace.href = ruta.startsWith('#') ? `index.html${ruta}` : ruta;
      enlace.target = '_parent';
      enlace.textContent = nombre;
      enlace.addEventListener('click', () => mostrarChat(false));
      mensaje.append(enlace);
    }

    mensajes.append(mensaje);
    return mensaje;
  }

  function responder(pregunta, tema, desdeBoton = false) {
    agregarMensaje('Tú', pregunta);
    const respuesta = tema?.respuesta ??
      'No encontré una respuesta para esa consulta. Elige una de las preguntas rápidas o prueba con una palabra como «reciclaje», «emisiones» o «contacto».';
    const mensaje = agregarMensaje('AtmosHero', respuesta, tema?.enlace);
    volver.hidden = false;

    if (desdeBoton) {
      mensaje.tabIndex = -1;
      mensaje.focus({ preventScroll: true });
    }
    contenido.scrollTop = mensaje.offsetTop - contenido.offsetTop;
  }

  temas.forEach((tema) => {
    const opcion = document.createElement('button');
    opcion.type = 'button';
    opcion.textContent = tema.pregunta;
    opcion.addEventListener('click', () => responder(tema.pregunta, tema, true));
    preguntasRapidas.append(opcion);
  });

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const pregunta = campo.value.trim();
    if (!pregunta) {
      campo.setCustomValidity('Escribe una pregunta.');
      campo.reportValidity();
      return;
    }

    const normalizada = pregunta.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const tema = temas.find((opcion) => opcion.palabras.test(normalizada));
    responder(pregunta, tema);
    campo.value = '';
    campo.focus();
  });

  campo.addEventListener('input', () => campo.setCustomValidity(''));
  boton.addEventListener('click', () => mostrarChat(panel.hidden));
  cerrar.addEventListener('click', () => mostrarChat(false));
  volver.addEventListener('click', () => {
    contenido.scrollTop = 0;
    preguntasRapidas.querySelector('button').focus({ preventScroll: true });
  });
  chat.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && !panel.hidden) {
      evento.preventDefault();
      evento.stopPropagation();
      mostrarChat(false);
    }
  });
})();
