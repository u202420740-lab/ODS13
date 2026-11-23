# AtmosHero: adaptación de ACME a web_site

## Qué se encontró y qué se implementó
ACME contiene un menú accesible en menu.js. Su grafico-emisiones.js intenta seleccionar elementos que no existen en su HTML; tampoco está enlazado ni incluye los estilos de patrones. Por ello, copiar ese archivo solo produciría un error al consultar el botón inexistente.

web_site tiene navegación, submenú Explorar, un orientador basado en radios y un formulario, pero no tiene JavaScript ni historial/gráfico de emisiones. Se conservan todas sus secciones, textos, imágenes y estilos originales. Se incorporó una sección de demostración, sin atribuirle mediciones reales al usuario. Para convertirla en historial real hace falta proporcionar categorías, porcentajes y período de medición.

## Cómo abrirlo
Descomprime el ZIP y abre web_site/index.html en un navegador actual. No requiere instalación, servidor, frameworks, bibliotecas, fuentes remotas ni conexión para esta interacción. Las páginas recursos.html y confirmacion.html se conservan. El cambio del menú se aplica a la landing; las otras páginas mantienen su navegación original.

## Archivos
- js/menu.js: adaptación del menú de ACME a los enlaces y colores de AtmosHero.
- js/grafico-emisiones.js: JavaScript separado, comentado, que genera barras y leyenda desde un único arreglo.
- css/accesibilidad.css: estilos adicionales; no reemplaza estilos.css.
- index.html: enlaces a archivos nuevos, identificadores del menú y sección nueva.
- CAMBIOS_INDEX.diff: cada inserción y reemplazo exactos respecto del HTML recibido.

## Fragmentos exactos y ubicación
El proyecto entregado ya contiene todos estos cambios; no los agregues otra vez.

1. Justo antes de </head> se agregan:

```html
<link rel="stylesheet" href="css/accesibilidad.css">
<script src="js/menu.js" defer></script>
<script src="js/grafico-emisiones.js" defer></script>
```

defer descarga los scripts sin bloquear el análisis del HTML y los ejecuta, en orden, cuando el DOM ya está construido.

2. Se reemplaza únicamente la apertura de la navegación principal por:

```html
<button id="boton-menu" class="hamburguesa" type="button" aria-controls="navegacion" aria-expanded="false" aria-label="Abrir menú" hidden>
  <span aria-hidden="true">☰</span> <span id="texto-menu">Menú</span>
</button>
<nav id="navegacion" class="navegacion" aria-label="Navegación principal">
```

3. En esa navegación, `<details class="desplegable">` pasa a ser `<details id="resolver" class="desplegable">`. Los cinco enlaces index.html#... pasan a #... y la marca pasa de index.html a #inicio. A las secciones inicio, nosotros, servicios, orientador y contacto se agrega tabindex="-1" para recibir foco al navegar, sin añadirlas al recorrido de Tab.

4. Antes de `<section id="proyectos"` se agrega el bloque completo que empieza con el comentario “Sección nueva” y termina antes de proyectos. El bloque exacto se entrega también en FRAGMENTO_EMISIONES.html para copiarlo sin reconstruirlo. Introduce explícitamente los elementos que no existían: contenedor-grafico-emisiones, btn-modo-inclusivo, estado-modo, estado-emisiones, grafico-emisiones y leyenda-emisiones.

5. Agrega las carpetas/archivos js/menu.js, js/grafico-emisiones.js y css/accesibilidad.css tal como se entregan. No pegues JavaScript dentro del CSS o del HTML.

6. Corrección puntual adicional: el formulario apuntaba a confirmación.html, pero el ZIP contiene confirmacion.html, sin tilde. Se corrige únicamente ese destino. Sigue siendo una navegación de demostración: no se agregó un servicio de envío de mensajes.

## Explicación para principiantes
En grafico-emisiones.js, getElementById selecciona el botón, el contenedor, el gráfico, la leyenda y los textos de estado. Si falta alguno, return termina sin generar errores. El arreglo categorias contiene Transporte 45 %, Energía 30 %, Alimentación 15 % y Residuos 10 %: son ejemplos que suman 100 %, no cifras científicas ni datos personales.

forEach recorre las categorías. createElement crea cada fila, barra y entrada de leyenda. append las incorpora al DOM. textContent inserta los nombres y porcentajes como texto. La misma clase de categoría en barra y muestra asegura que tengan idénticos colores y patrones. Los iconos son caracteres locales: su aspecto puede variar según el sistema; siempre se conserva la etiqueta escrita.

addEventListener('click', ...) escucha la activación del botón. Al ser un button nativo, Enter y espacio también disparan clic sin programar eventos duplicados. classList.toggle añade o retira modo-inclusivo-activo; el CSS responde mostrando líneas diagonales, puntos, franjas horizontales o cuadrícula. aria-pressed comunica el estado del botón y role="status" anuncia el cambio. El nombre del botón permanece estable. Los nombres de los patrones se muestran u ocultan con hidden. Las cifras y las anchuras no cambian al alternar el modo.

El gráfico visual tiene aria-hidden porque la leyenda contiene los mismos nombres y porcentajes en texto; así no se repiten los datos al usar un lector de pantalla. Los iconos y colores nunca son la única forma de identificar las categorías. El CSS limita los estilos del modo al componente nuevo.

menu.js selecciona boton-menu, navegacion, texto-menu, resolver y marca. Escucha clic para abrir/cerrar, selección de enlaces para cerrar y enfocar la sección, keydown para Escape, y change de matchMedia para sincronizar el límite de 600 px con el CSS. Se conserva el menú visible cuando JavaScript está desactivado; el botón interactivo solo aparece al ejecutarse el script. El orientador sigue funcionando con su CSS original.

Para cambiar el ejemplo, edita únicamente categorias en grafico-emisiones.js. Mantén números entre 0 y 100 que sumen 100; si agregas categorías, define también una clase de color y patrón en accesibilidad.css. No hay cálculo de emisiones ni almacenamiento de preferencias: al recargar, los patrones comienzan desactivados.

## Pruebas manuales y resultados esperados
| Prueba | Pasos | Resultado esperado |
|---|---|---|
| Estado inicial | Abrir index.html y bajar a Emisiones por categoría | Aviso de demostración visible; cuatro barras, iconos, nombres y porcentajes; botón desactivado; sin patrones |
| Escenario 1 / visualización dual | Pulsar Modo Inclusivo | Se mantienen colores y se añaden cuatro texturas distintas al instante; aria-pressed="true" |
| Escenario 2 / leyenda | Comparar cada barra con su muestra | Transporte: diagonales, 45 %; Energía: puntos, 30 %; Alimentación: franjas, 15 %; Residuos: cuadrícula, 10 % |
| Desactivación | Volver a pulsar | Desaparecen las texturas y sus nombres; se conservan iconos, nombres, porcentajes y tamaños; aria-pressed="false" |
| Teclado | Llegar al botón con Tab; usar Enter y espacio | Foco visible; cada activación alterna una vez el estado y conserva el foco |
| Lector de pantalla | Activar el control y recorrer la leyenda | Anuncia botón pulsado/no pulsado y cambio de estado; lee categoría, porcentaje y, si está activo, patrón |
| Independencia del color | Activar el modo y observar en escala de grises o con simulación de daltonismo | Se distinguen categorías por patrón, icono y texto; los porcentajes siguen legibles |
| Responsive | Revisar a 320, 375, 768 y 1280 px; probar zoom 200 % | Sin desplazamiento horizontal; textos se ajustan; muestras y barras permanecen reconocibles |
| Menú móvil de ACME | A 375 px, abrir Menú, abrir Explorar, elegir enlace; repetir con Escape | Navegación vertical; el enlace lleva a su sección y cierra; Escape cierra y devuelve foco al botón |
| Cambio de ancho | Abrir menú móvil y pasar a escritorio | Navegación visible y botón móvil oculto; al regresar a móvil queda cerrado |
| Regresión | Cambiar los radios del orientador, abrir recursos.html y enviar formulario válido | Los paneles responden; se abre la página de recursos y el formulario llega a confirmacion.html |
| Sin JavaScript | Desactivarlo y recargar | La navegación y el orientador siguen disponibles; no aparecen controles inoperantes y se muestra aviso en el gráfico |

## Validación realizada y límites
Se comprobó la sintaxis con node --check en ambos scripts. Se ejecutó una prueba de DOM simulado para verificar creación de cuatro barras y cuatro entradas, suma 100, activación/desactivación, aria-pressed, nombres de patrones y salida segura si faltan elementos. Estas comprobaciones pasaron.

No se pudo ejecutar la prueba visual automatizada porque el entorno no dispone de Chromium. Las pruebas de navegador, contraste perceptual, zoom y lector de pantalla de la tabla quedan como comprobación manual; no se afirma una certificación de accesibilidad.
