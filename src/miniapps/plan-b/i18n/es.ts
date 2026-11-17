export const es = {
  calendar: {
    summary: 'Plan B: {action}',
    description:
      'Si {situation}, entonces {action}.\nTu propósito: {purpose}\nHecho con MiMiniApp',
  },
  ui: {
    subtitle: 'Vamos a evitarlo. Tardas 2 minutos.',
    headline: 'Es {month} y ya has abandonado tu propósito.',
    question: '¿Qué quieres lograr?',
    januaryQuestion: '¿Qué quieres lograr este año?',
    obstacleQuestion:
      'Imagina que es 1 de {month} y lo has dejado. ¿Qué ha pasado?',
    planTitle: 'Tu plan para ese día',
    loading: 'Preparando tu plan…',
    start: 'Empezar',
    exampleButton: 'Ver un ejemplo',
    back: 'Atrás',
    next: 'Siguiente',
    viewPlan: 'Ver mi plan',
    reset: 'Empezar otra vez',
    if: 'Si',
    then: 'entonces',
    goalLabel: 'Tu propósito',
    situationLabel: 'Situación',
    actionLabel: 'Acción',
    otherLabel: 'Otro obstáculo',
    timeLabel: 'Hora',
    daysLabel: 'Días',
    obstacleHint: 'Al elegir un obstáculo, pasarás al siguiente paso.',
    otherPlaceholder: 'Cuéntalo en pocas palabras',
    situationHint: '¿Lo podrías ver en una foto? Si no, concrétalo más.',
    actionHint: 'Algo pequeño: 5 minutos o menos.',
    timeQuestion: '¿A qué hora suele pasar? (opcional)',
    timeHint: 'Con una hora, te preparamos un recordatorio para tu calendario.',
    stepTemplate: 'Paso {current} de {total}',
    counterTemplate: '{current} de {max} caracteres',
    exampleTag: 'Ejemplo',
    privacy:
      'Gratis y sin cuenta. Tu texto se procesa en este navegador y se guarda temporalmente si el navegador lo permite. Puedes borrarlo con «Empezar otra vez». Solo sale si lo exportas a Google o compartes la imagen.',
    memory:
      'Tu navegador no permite guardar el progreso. Se conservará mientras esta página siga abierta.',
    invalid: 'No se pudo recuperar el progreso guardado. Empieza de nuevo.',
    deleteFailed:
      'No se pudo borrar la copia guardada. Puedes eliminar los datos de este sitio en los ajustes del navegador.',
    languageLoss:
      'Al cambiar de idioma se perderá el progreso porque el navegador no permite guardarlo.',
    errorLength: 'Escribe entre {min} y {max} caracteres.',
    errorLine: 'Escribe una sola línea, sin saltos de línea.',
    errorRequired: 'Completa este campo.',
    errorTime: 'Elige una hora válida.',
    errorDays: 'Selecciona al menos un día o quita la hora.',
    errorObstacle: 'Elige un obstáculo.',
    monthLabel: 'Mes',
    planLabel: 'Tu plan',
    stamp: 'Este {month}, no.',
    calendarSummary: '{days} a las {time}, durante 4 semanas',
    allDays: 'Todos los días',
    workingDays: 'De lunes a viernes',
    noTime: 'Añade una hora para crear el recordatorio.',
    addTime: 'Añadir hora',
    calendarHint: 'El aviso depende de los ajustes de tu calendario.',
    catalogue: 'Más miniapps',
    noScript:
      'Activa JavaScript para preparar tu plan. Tu texto se procesa en este navegador.',
  },
  exports: {
    calendarTitle: 'Recuérdamelo',
    calendarDownload: 'Añadir a mi calendario',
    google: 'Añadir a Google Calendar',
    continue: 'Continuar',
    cancel: 'Cancelar',
    googleWarning:
      'Se abrirá Google Calendar con tu plan. El texto se enviará a Google y puede quedar en la URL y el historial. Revisa y guarda el evento allí.',
    duplicateWarning:
      'Importar el archivo otra vez puede duplicar los eventos.',
    wallpaperTitle: 'Fondo de pantalla',
    saveImage: 'Guardar imagen',
    openImage: 'Abrir imagen',
    imageLabel: 'Mi plan B',
    imageNotice:
      'La imagen contiene tu plan. Si eliges otra app al compartirla, esa app recibirá la imagen.',
    imagePreparing: 'Preparando imagen…',
    imageReady: 'Imagen del plan lista',
    imageInstructions:
      'Comprueba la descarga o el destino elegido. También puedes abrir la imagen para guardarla manualmente; las opciones dependen del navegador y del sistema. Después, elige la imagen desde los ajustes de fondo de pantalla.',
    retryImage: 'Preparar imagen de nuevo',
    shareTitle: 'Compartir Plan B',
    share: 'Compartir',
    copy: 'Copiar enlace',
    shareText: 'Haz tu plan B para tu propósito en 2 minutos.',
    copied: 'Enlace copiado',
    shared: 'Enlace compartido',
    filePrepared:
      'Archivo preparado. Comprueba la descarga o la aplicación de destino.',
    googleOpened: 'Revisa y guarda el evento en Google Calendar.',
    offline: 'Necesitas conexión para esto. Tu plan sigue aquí.',
    offlineNote:
      'Con esta página completamente cargada y abierta, puedes completar tu plan y generar los archivos sin conexión.',
    exportError:
      'No se pudo preparar el archivo. Tu plan sigue aquí; inténtalo de nuevo.',
    popupError:
      'No se pudo abrir Google Calendar. Permite la nueva pestaña o descarga el archivo de calendario.',
    shareError: 'No se pudo compartir. Puedes copiar el enlace.',
    imageError:
      'No se pudo guardar la imagen. Puedes abrirla para guardarla manualmente.',
    imagePrepareError:
      'No se pudo preparar la imagen. Tu plan sigue aquí; inténtalo de nuevo.',
    manualCopy:
      'No se pudo copiar automáticamente. Selecciona y copia este enlace.',
    linkLabel: 'Enlace de la herramienta',
    busy: 'Espera a que termine la acción actual.',
  },
  obstacles: {
    time: 'No tuve tiempo',
    motivation: 'Perdí las ganas',
    unexpected: 'Algo se cruzó',
    overload: 'Era demasiado',
    forgetting: 'Se me olvidó',
    other: 'Otra cosa',
  },
  suggestions: {
    purpose: [
      'Hacer ejercicio',
      'Leer más',
      'Ahorrar',
      'Aprender un idioma',
      'Dormir mejor',
      'Usar menos el móvil',
    ],
    situation: {
      time: ['llego tarde a casa', 'tengo el día lleno de reuniones'],
      motivation: ['no me apetece nada', 'llego sin energía'],
      unexpected: ['surge un imprevisto', 'cambian mis planes'],
      overload: ['me parece demasiado', 'llevo varios días sin hacerlo'],
      forgetting: ['llega la hora y no me he acordado', 'salgo de mi rutina'],
    },
    action: {
      time: ['hago una versión de 5 minutos', 'lo hago nada más levantarme'],
      motivation: [
        'empiezo solo 2 minutos y luego decido',
        'preparo lo que necesito y empiezo por lo más fácil',
      ],
      unexpected: ['lo muevo a la mañana siguiente', 'hago la mitad ese día'],
      overload: ['hago la versión mínima', 'vuelvo con la mitad del objetivo'],
      forgetting: [
        'lo hago en cuanto vea el recordatorio',
        'lo uno a algo que ya hago, como el café',
      ],
      other: ['hago una versión de 5 minutos', 'lo muevo al día siguiente'],
    },
  },
  example: {
    purpose: 'Hacer ejercicio 3 veces por semana',
    situation: 'llego a casa después de las 20:00',
    action: 'hago 5 minutos de estiramientos antes de sentarme en el sofá',
  },
};
