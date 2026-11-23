(() => {
  const marco = document.createElement('iframe');
  marco.title = 'Asistente de AtmosHero';
  marco.src = new URL('../chatbot.html', document.currentScript.src).href;

  const ventana = window.visualViewport;
  let abierto = false;

  Object.assign(marco.style, {
    position: 'fixed',
    display: 'block',
    left: 'env(safe-area-inset-left, 0px)',
    border: '0',
    background: 'transparent',
    zIndex: '110'
  });

  function ajustarMarco() {
    const areaVisible = ventana && ventana.scale === 1 ? ventana : null;
    const alto = areaVisible?.height ?? window.innerHeight;
    const inferior = Math.max(0, window.innerHeight - alto - (areaVisible?.offsetTop ?? 0));

    marco.style.bottom = `calc(env(safe-area-inset-bottom, 0px) + ${inferior}px)`;
    marco.style.width = abierto
      ? 'min(25rem, calc(100% - env(safe-area-inset-right, 0px) - env(safe-area-inset-left, 0px)))'
      : '5rem';
    marco.style.height = abierto
      ? `min(39rem, calc(${alto}px - env(safe-area-inset-bottom, 0px) - env(safe-area-inset-top, 0px)))`
      : '5rem';
  }

  window.addEventListener('message', (evento) => {
    if (evento.source !== marco.contentWindow) return;
    if (evento.data !== 'atmoshero-chat:abrir' && evento.data !== 'atmoshero-chat:cerrar') return;

    abierto = evento.data === 'atmoshero-chat:abrir';
    ajustarMarco();
  });

  window.addEventListener('resize', ajustarMarco);
  ventana?.addEventListener('resize', ajustarMarco);
  ventana?.addEventListener('scroll', ajustarMarco);

  ajustarMarco();
  document.body.append(marco);
})();
