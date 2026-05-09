// Datos del equipo Agenda Territorial — Convenio 1022 de 2025
// Bitácora interna · Despacho · Ministerio de las Culturas, las Artes y los Saberes

const TEAM = [
  {
    id: 'yuli',
    nombre: 'Yuli Rocío Camelo',
    corto: 'Yuli',
    rol: 'Coordinación general',
    area: 'Coordinación',
    color: '#5A3680',
    inicial: 'Y',
    descripcion: 'Articula con Dirección de Poblaciones y con la institucionalidad. Decide rumbo y prioridades del Convenio.',
  },
  {
    id: 'monica',
    nombre: 'Mónica Andrea López',
    corto: 'Mónica',
    rol: 'Coordinación de campo',
    area: 'Coordinación',
    color: '#3D50A8',
    inicial: 'M',
    descripcion: 'Articula el documento conceptual del Encuentro RIJ y el trabajo territorial con organizaciones.',
  },
  {
    id: 'jeimmy',
    nombre: 'Jeimmy Ruiz',
    corto: 'Jeimmy',
    rol: 'Orientadora — Red Intercultural Juvenil',
    area: 'Red Intercultural Juvenil',
    color: '#D97B3F',
    inicial: 'J',
    descripcion: 'Acompaña a las organizaciones de la RIJ. Lleva CONPES Juventudes y articulación con poblaciones.',
  },
  {
    id: 'mercy',
    nombre: 'Mercy Tatiana Arias',
    corto: 'Mercy',
    rol: 'Orientadora — Red de Mujeres Sabedoras, Artistas y Gestoras',
    area: 'Red de Mujeres',
    color: '#A8438A',
    inicial: 'M',
    descripcion: 'Acompaña a las mujeres sabedoras y gestoras. Lidera socializaciones de costos y firma de contratos.',
  },
  {
    id: 'emerson',
    nombre: 'Emerson Fandiño',
    corto: 'Emerson',
    rol: 'Seguimiento documental',
    area: 'Seguimiento',
    color: '#528E71',
    inicial: 'E',
    descripcion: 'Convoca reuniones, maneja agenda del equipo, base de datos y caracterización del Directorio Vivo.',
  },
  {
    id: 'felipe',
    nombre: 'Felipe Camacho Otero',
    corto: 'Felipe',
    rol: 'Enlace de comunicaciones',
    area: 'Comunicaciones',
    color: '#E8C535',
    inicial: 'F',
    descripcion: 'Diseña piezas, manuales de identidad, plataforma web y el Ciclo de Formación Puente.',
  },
];

// Formato fecha: año-mes-día (ISO). Mes 04=abril, 05=mayo, 06=junio, 07=julio.
// Fecha de hoy en ISO local (yyyy-mm-dd) — usa hora local del dispositivo,
// NO Date.toISOString() que devuelve UTC y puede retrasarse un día en Colombia (UTC-5).
const _hoy = new Date();
const HOY_ISO = `${_hoy.getFullYear()}-${String(_hoy.getMonth() + 1).padStart(2, '0')}-${String(_hoy.getDate()).padStart(2, '0')}`;

const CRONOGRAMA = [
  {
    id: 't-may05-a',
    fecha: '2026-05-05', hora: '12:00 m.',
    titulo: 'Reunión con Andrea — Fondo Mixto',
    detalle: 'Aclarar cláusula que vincula a las dos organizaciones aliadas y cláusula octava de derechos de autor.',
    responsables: ['emerson', 'mercy', 'jeimmy', 'yuli'],
    tipo: 'reunion', estado: 'hecha',
  },
  {
    id: 't-may05-b',
    fecha: '2026-05-05',
    titulo: 'Firma de contratos · Ciclo de Formación Puente',
    detalle: 'Ajuste a 5 sesiones por orientadora.',
    responsables: ['mercy', 'jeimmy'],
    tipo: 'entrega', estado: 'hecha',
  },
  {
    id: 't-may06-a',
    fecha: '2026-05-06',
    titulo: 'Documento borrador CONPES Juventudes',
    detalle: 'Remitir a Yuli y Mónica para revisión.',
    responsables: ['jeimmy'],
    tipo: 'entrega', estado: 'hecha',
  },
  {
    id: 't-may06-b',
    fecha: '2026-05-06',
    titulo: 'Listado de organizaciones con ubicación',
    detalle: 'Caracterización del Directorio Vivo para costeo de transportes.',
    responsables: ['felipe', 'jeimmy', 'emerson'],
    tipo: 'entrega', estado: 'hecha',
  },
  {
    id: 't-sem19-a',
    fecha: '2026-05-08', semanaInicio: '2026-05-05', semanaFin: '2026-05-09',
    titulo: 'Articulación con Dirección de Poblaciones',
    detalle: 'Reunión con Mercy y gestión con Alejandra (línea gráfica encuentro de mujeres).',
    responsables: ['yuli', 'monica'],
    tipo: 'gestion', estado: 'pendiente', semana: true,
  },
  {
    id: 't-sem19-b',
    fecha: '2026-05-08', semanaInicio: '2026-05-05', semanaFin: '2026-05-09',
    titulo: 'Gestión British Council',
    detalle: 'Definir canal de solicitud por Oficina de Internacionales.',
    responsables: ['yuli', 'jeimmy'],
    tipo: 'gestion', estado: 'pendiente', semana: true,
  },
  {
    id: 't-sem19-c',
    fecha: '2026-05-08', semanaInicio: '2026-05-05', semanaFin: '2026-05-09',
    titulo: 'Intercambio de bases de datos con poblaciones',
    detalle: 'Para convocatoria del Ciclo de Formación e instructivo.',
    responsables: ['mercy', 'emerson'],
    tipo: 'gestion', estado: 'pendiente', semana: true,
  },
  {
    id: 't-may08-ciclo',
    fecha: '2026-05-08',
    titulo: 'Reunión de coordinación · Ciclo de Formación Puente',
    detalle: 'Cierre de fechas, horas y días con Mercy y Jeimmy. Articula propuesta del 5 de mayo con observaciones de Andrea (Fondo Mixto) y alerta sobre festivos.',
    responsables: ['felipe', 'mercy', 'jeimmy'],
    tipo: 'reunion', estado: 'pendiente',
    alerta: 'Cierra el ciclo',
  },
  {
    id: 't-may13-ciclo',
    fecha: '2026-05-13',
    titulo: 'Inicio del Ciclo · Finanzas Personales',
    detalle: 'Sesión 1 con Mercy. Arranca el Ciclo de Formación Puente.',
    responsables: ['mercy'],
    tipo: 'formacion', estado: 'pendiente',
  },
  {
    id: 't-may15-ciclo',
    fecha: '2026-05-15',
    titulo: 'Ciclo · Comunicaciones I',
    detalle: 'Sesión 2 con Felipe.',
    responsables: ['felipe'],
    tipo: 'formacion', estado: 'pendiente',
  },
  {
    id: 't-may08',
    fecha: '2026-05-08',
    titulo: 'Definición de la sede del Encuentro',
    detalle: 'Confirmar respuesta de Gobernación de Boyacá y decidir entre Cali o Tunja.',
    responsables: ['yuli'],
    tipo: 'decision', estado: 'pendiente',
    alerta: 'Fecha límite',
  },
  {
    id: 't-may11-a',
    fecha: '2026-05-11', hora: '8:00 a 9:00 a.m.',
    titulo: 'Reunión semanal del equipo',
    detalle: 'Primer encuentro de seguimiento. A partir de aquí, todos los lunes.',
    responsables: ['yuli', 'monica', 'jeimmy', 'mercy', 'emerson', 'felipe'],
    tipo: 'reunion', estado: 'pendiente',
    recurrente: 'Cada lunes',
  },
  {
    id: 't-may11-b',
    fecha: '2026-05-11', hora: '6:00 p.m.',
    titulo: 'Socialización Ciclo de Formación Puente',
    detalle: 'Con todas las organizaciones del Convenio 1022.',
    responsables: ['mercy', 'jeimmy', 'felipe'],
    tipo: 'reunion', estado: 'pendiente',
  },
  {
    id: 't-sem20',
    fecha: '2026-05-13', semanaInicio: '2026-05-11', semanaFin: '2026-05-15',
    titulo: 'Cierre virtual de la vigencia 2025',
    detalle: 'Espacio de 2 horas para revisar avances, cierres y alertas.',
    responsables: ['yuli', 'monica', 'jeimmy', 'mercy', 'emerson', 'felipe'],
    tipo: 'reunion', estado: 'pendiente', semana: true,
  },
  {
    id: 't-may15',
    fecha: '2026-05-15',
    titulo: 'Primer borrador del documento conceptual — Encuentro RIJ',
    detalle: 'Mónica articula. Aporta todo el equipo.',
    responsables: ['monica', 'jeimmy', 'mercy', 'felipe', 'yuli'],
    tipo: 'entrega', estado: 'pendiente',
    alerta: 'Entrega borrador',
  },
  {
    id: 't-may19',
    fecha: '2026-05-19', hora: '6:00 p.m.',
    titulo: 'Socialización del instructivo de costos y gastos',
    detalle: 'Asistencia obligatoria del responsable contable o financiero de cada organización. Sesión grabada.',
    responsables: ['mercy', 'jeimmy', 'felipe', 'emerson'],
    tipo: 'reunion', estado: 'pendiente',
  },
  {
    id: 't-may25',
    fecha: '2026-05-25',
    titulo: 'Documento conceptual consolidado — Encuentro RIJ',
    detalle: 'Versión revisada y lista para diagramación con Felipe.',
    responsables: ['monica', 'jeimmy', 'mercy', 'felipe'],
    tipo: 'entrega', estado: 'pendiente',
    alerta: 'Documento consolidado',
  },
  {
    id: 't-jun24',
    fecha: '2026-06-24', semanaInicio: '2026-06-24', semanaFin: '2026-06-27',
    titulo: 'Encuentro Red Intercultural Juvenil',
    detalle: '3 noches · 5 jornadas efectivas · ~40 participantes · sede por confirmar (Cali o Tunja).',
    responsables: ['yuli', 'monica', 'jeimmy', 'mercy', 'emerson', 'felipe'],
    tipo: 'encuentro', estado: 'pendiente', destacado: true,
  },
];

// Ciclo de Formación Puente · Avanzada formativa
// Propuesta Mercy del 5 de mayo + ajustes de Andrea (Fondo Mixto) y Mercy sobre festivos
// CIERRA: reunión de coordinación mañana en la tarde con Mercy y Jeimmy
const CICLO = [
  { n: 1, fecha: '2026-05-13', dia: 'Miércoles', orient: 'mercy', tipo: 'Saberes financieros', tema: 'Finanzas Personales', estado: 'pendiente', estadoCal: 'propuesta' },
  { n: 2, fecha: '2026-05-15', dia: 'Viernes', orient: 'felipe', tipo: 'Comunicaciones', tema: 'Comunicaciones I', estado: 'pendiente', estadoCal: 'propuesta' },
  { n: 3, fecha: '2026-05-20', dia: 'Miércoles', orient: 'mercy', tipo: 'Saberes financieros', tema: 'Presupuesto', estado: 'pendiente', estadoCal: 'propuesta' },
  { n: 4, fecha: '2026-05-22', dia: 'Viernes', orient: 'felipe', tipo: 'Comunicaciones', tema: 'Comunicaciones II', estado: 'pendiente', estadoCal: 'propuesta' },
  { n: 5, fecha: '2026-05-25', dia: 'Lunes', orient: 'jeimmy', tipo: 'Saberes RIJ', tema: 'Íntimo esencial', estado: 'pendiente', estadoCal: 'en-revision', alerta: 'Andrea propone 18 may; Mercy alerta festivo' },
  { n: 6, fecha: '2026-05-27', dia: 'Miércoles', orient: 'mercy', tipo: 'Saberes financieros', tema: 'Flujo de caja', estado: 'pendiente', estadoCal: 'propuesta' },
  { n: 7, fecha: '2026-05-29', dia: 'Viernes', orient: 'mercy', tipo: 'Saberes financieros', tema: 'Diversificación de ingresos', estado: 'pendiente', estadoCal: 'propuesta' },
  { n: 8, fecha: '2026-06-01', dia: 'Lunes', orient: 'jeimmy', tipo: 'Saberes RIJ', tema: 'Vínculos Recíprocos', estado: 'pendiente', estadoCal: 'en-revision', alerta: 'Andrea propone 1 jun: confirmado' },
  { n: 9, fecha: '2026-06-05', dia: 'Viernes', orient: 'mercy', tipo: 'Saberes financieros', tema: 'Indicadores para control financiero', estado: 'pendiente', estadoCal: 'propuesta' },
  { n: 10, fecha: '2026-06-12', dia: 'Viernes', orient: 'jeimmy', tipo: 'Saberes RIJ', tema: 'Plural Comunitario', estado: 'pendiente', estadoCal: 'en-revision' },
  { n: 11, fecha: '2026-06-19', dia: 'Viernes', orient: 'jeimmy', tipo: 'Saberes RIJ', tema: 'Herramientas', estado: 'pendiente', estadoCal: 'en-revision' },
  { n: 12, fecha: '2026-06-22', dia: 'Lunes', orient: 'jeimmy', tipo: 'Saberes RIJ', tema: 'Herramientas II', estado: 'pendiente', estadoCal: 'en-revision' },
];

// Hilo del ciclo · correo del 5 al 6 de mayo
const CICLO_HILO = {
  estado: 'En coordinación · cierra mañana en la tarde',
  bajada: 'Reunión de cierre con Mercy y Jeimmy para consolidar fechas, horas y días.',
  mensajes: [
    {
      fecha: '2026-05-05', autor: 'mercy', tipo: 'propuesta',
      titulo: 'Propuesta de calendario · 12 sesiones',
      cuerpo: 'Mercy propone arranque el miércoles 13 de mayo con 5 sesiones suyas (finanzas), 5 de Jeimmy (saberes RIJ) y 2 de Felipe (Comunicaciones I y II). Alerta: a Jeimmy le quedan bien los lunes pero mayo y junio tienen lunes festivos.',
    },
    {
      fecha: '2026-05-06', autor: null, tipo: 'observacion',
      titulo: 'Andrea (Fondo Mixto) propone modificar fechas',
      cuerpo: 'Andrea pide ajustar el cronograma para articular el ejercicio inicial. Sus fechas serían 18 y 25 de mayo, 1, 15 y 22 de junio. Queda pendiente reunión para definir.',
    },
    {
      fecha: '2026-05-06', autor: 'mercy', tipo: 'alerta',
      titulo: 'Alerta sobre festivos',
      cuerpo: 'Mercy a Jeimmy: 18 de mayo y 15 de junio son festivos. ¿Quieres ofrecer clases en festivos? Queda atenta a la respuesta.',
    },
    {
      fecha: '2026-05-08', autor: null, tipo: 'cierre',
      titulo: 'Reunión de cierre · mañana en la tarde',
      cuerpo: 'Felipe coordina con Mercy y Jeimmy reunión para consolidar definitivamente fechas, horas y días del ciclo. Después de esta reunión todo queda en firme y se actualiza esta sección.',
    },
  ],
};

const DOCUMENTOS = [
  {
    id: 'propuesta-ciclo',
    titulo: 'Ciclo de Formación Puente',
    subtitulo: 'Saberes financieros, RIJ y comunicaciones · 12 sesiones',
    autor: 'Mercy · Jeimmy · Felipe',
    fecha: 'Mayo 2026',
    tipo: 'Documento en construcción',
    paginas: 12,
    color: '#5A3680',
    resumen: 'Avanzada formativa del Convenio 1022 con tres líneas que tejen los saberes del equipo: finanzas personales y manejo de recursos (Mercy), saberes RIJ desde lo íntimo, plural y comunitario (Jeimmy) y comunicaciones de las redes (Felipe). Calendario en cierre: mañana en la tarde se consolidan fechas, horas y días con Mercy y Jeimmy.',
    secciones: [
      'Línea finanzas · 5 sesiones · Mercy',
      'Línea RIJ · 5 sesiones · Jeimmy',
      'Línea comunicaciones · 2 sesiones · Felipe',
      'Calendario propuesto · arranca 13 de mayo',
      'Observaciones de Andrea (Fondo Mixto)',
      'Alerta de festivos · 18 de mayo y 15 de junio',
    ],
    enlace: '#ciclo',
  },
  {
    id: 'manual-mujeres',
    titulo: 'Manual de Identidad · Red de Mujeres',
    subtitulo: 'Sistema visual para tejer territorios — v1.0',
    autor: 'Equipo de comunicaciones',
    fecha: 'Abril 2026',
    tipo: 'Manual de identidad',
    paginas: 14,
    color: '#A8438A',
    resumen: 'Marco conceptual, logo, paleta 60·30·10, tres familias tipográficas, patrones de tejido y mola, y aplicaciones del sistema visual de la Red de Mujeres Sabedoras, Artistas y Gestoras.',
    secciones: [
      'Marco conceptual · Cinco principios visuales',
      'Logotipo · Variantes y usos',
      'Color · Paleta principal y secundaria',
      'Tipografía · Display, cuerpo y acento',
      'Patrones · Tejido y mola',
      'Aplicaciones del sistema',
    ],
    enlace: 'uploads/manual_red_mujeres.pptx',
  },
  {
    id: 'manual-rij',
    titulo: 'Manual de Identidad · Red Intercultural Juvenil',
    subtitulo: 'Identidad gráfica de la RIJ',
    autor: 'Equipo de comunicaciones',
    fecha: '2025',
    tipo: 'Manual de identidad',
    paginas: null,
    color: '#D97B3F',
    resumen: 'Sistema gráfico de la Red Intercultural Juvenil. Antecede al manual de la Red de Mujeres y sirvió de modelo para la transferencia de plataforma y kit gráfico.',
    secciones: [
      'Marco conceptual',
      'Logotipo y variantes',
      'Color',
      'Tipografía',
      'Patrones y aplicaciones',
    ],
    enlace: '#',
  },
  {
    id: 'puente',
    titulo: 'Plataforma PUENTE',
    subtitulo: 'En Colombia los puentes cambian vidas',
    autor: 'Equipo Convenio 1022 · 2025',
    fecha: '2025',
    tipo: 'Avanzada conceptual',
    paginas: 9,
    color: '#3D50A8',
    resumen: 'Plataforma de fortalecimiento y agencia de organizaciones en territorio. Avanzada del año pasado que da marco al Convenio 1022: tres rutas (Bastión, Contraventeo, Pasamanos) y cinco enfoques (político, cuidado, investigativo, formativo, administrativo) para que las organizaciones tengan herramientas y agencien sus dinámicas con menos dependencia institucional.',
    secciones: [
      'Apuesta · menos dependencia institucional, más capacidad resolutiva',
      'Cinco enfoques · político, cuidado, investigativo, formativo, administrativo',
      'Ruta Bastión · laboratorios por enfoque',
      'Ruta Contraventeo · formulación, contratación, implementación',
      'Ruta Pasamanos · actividades transversales y soporte',
      'Curva temporal · 4 meses',
    ],
    enlace: 'uploads/presentacion_puente.pdf',
  },
  {
    id: 'cronograma-fuente',
    titulo: 'Cronograma · Mesa del 4 de mayo',
    subtitulo: 'Agenda colectiva de compromisos',
    autor: 'Equipo Convenio 1022',
    fecha: '4 de mayo de 2026',
    tipo: 'Acta de sincronización',
    paginas: null,
    color: '#528E71',
    resumen: 'Compromisos de la primera mesa de sincronización del equipo, base del cronograma vivo de esta bitácora. Cubre del 5 de mayo al 27 de junio de 2026.',
    secciones: [
      '15 fechas clave',
      'Hitos del Ciclo de Formación',
      'Hitos del Encuentro RIJ',
      'Reuniones semanales del equipo',
    ],
    enlace: 'uploads/cronograma_compromisos_convenio_1022.html',
  },
];

// Bitácora — síntesis y novedades
const BITACORA = [
  {
    fecha: '2026-05-07', tipo: 'novedad', autor: 'felipe',
    titulo: 'Ciclo de Formación Puente · entra al sitio en versión propuesta',
    cuerpo: 'Mercy compartió el 5 de mayo una propuesta de 12 sesiones (5 suyas, 5 de Jeimmy, 2 mías). Andrea del Fondo Mixto pidió ajustar fechas y Mercy alertó que el 18 de mayo y el 15 de junio son festivos. Mañana en la tarde nos reunimos las tres para cerrar fechas, horas y días definitivos. Mientras tanto, el calendario queda como propuesta en la sección Ciclo.',
  },
  {
    fecha: '2026-05-07', tipo: 'novedad', autor: 'felipe',
    titulo: 'Estrenamos la Bitácora del equipo',
    cuerpo: 'Este es el primer espacio interno de la Agenda Territorial. Acá vamos a ir consolidando cronograma, tareas y documentos de aquí hasta el cierre del Convenio. Comentarios y ajustes a Felipe.',
  },
  {
    fecha: '2026-05-06', tipo: 'sintesis', autor: 'emerson',
    titulo: 'Avance miércoles',
    cuerpo: 'Jeimmy remitió borrador CONPES Juventudes a Yuli y Mónica. Felipe entregó listado de organizaciones con ubicación a Jeimmy para que pase a Emerson para costeo de transportes.',
  },
  {
    fecha: '2026-05-05', tipo: 'sintesis', autor: 'emerson',
    titulo: 'Mesa de sincronización · cierre',
    cuerpo: 'Reunión con Andrea del Fondo Mixto al mediodía. Quedó aclarada la cláusula que vincula a las organizaciones aliadas y la cláusula octava de derechos de autor. Mercy y Jeimmy firmaron contratos del Ciclo, ajustados a 5 sesiones por orientadora.',
  },
  {
    fecha: '2026-05-04', tipo: 'sintesis', autor: 'yuli',
    titulo: 'Primera mesa de equipo · 4 de mayo',
    cuerpo: 'Definimos cronograma de aquí a junio, fechas tope y responsables. Reunión semanal del equipo queda fijada cada lunes 8:00 a 9:00 a.m. arrancando el 11 de mayo.',
  },
];

const ALERTAS = [
  {
    icono: '◐',
    titulo: 'Ciclo de Formación · cierra mañana en la tarde',
    detalle: 'Reunión con Mercy y Jeimmy para consolidar fechas, horas y días. Hasta entonces el calendario está como propuesta.',
    color: '#A8438A',
  },
  {
    icono: '!',
    titulo: 'Sede del Encuentro · decisión esta semana',
    detalle: 'Yuli debe confirmar respuesta de Gobernación de Boyacá y decidir entre Cali o Tunja a más tardar el viernes 8.',
    color: '#D97B3F',
  },
  {
    icono: '✦',
    titulo: 'Próxima reunión semanal · lunes 11, 8:00 a.m.',
    detalle: 'Primer encuentro de seguimiento. Desde acá quedan en agenda recurrente todos los lunes.',
    color: '#3D50A8',
  },
];

// Plataforma PUENTE — avanzada conceptual del año pasado
const PUENTE = {
  lema: 'En Colombia los puentes cambian vidas',
  bajada: 'Plataforma de fortalecimiento y agencia de organizaciones en territorio',
  apuesta: ['Menos dependencia institucional', 'Mayor capacidad resolutiva', 'Pensamiento reflexivo y crítico'],
  enfoques: [
    { n: 'Político', c: '#5A3680' },
    { n: 'Cuidado', c: '#A8438A' },
    { n: 'Investigativo', c: '#3D50A8' },
    { n: 'Formativo', c: '#D97B3F' },
    { n: 'Administrativo', c: '#528E71' },
  ],
  rutas: [
    {
      nombre: 'Bastión',
      bajada: 'Laboratorios por enfoque',
      detalle: 'Autodiagnóstico · derechos culturales · pedagogías sensibles situadas · presupuesto · investigación en procesos artísticos · protocolos de cuidado.',
      color: '#5A3680',
    },
    {
      nombre: 'Contraventeo',
      bajada: 'Formulación, contratación, implementación',
      detalle: 'El puente deja de ser un mecanismo y se vuelve una estructura. Tres etapas: planificación y escritura del proyecto, contratación, acompañamiento + cierre + evaluación.',
      color: '#D97B3F',
    },
    {
      nombre: 'Pasamanos',
      bajada: 'Actividades transversales y soporte',
      detalle: 'Internacionalización · pensamiento estratégico · redes sociales · IA · violencia de género · antimilitarismo · economías populares · finanzas personales. Soporte tecnológico, directorio de saberes, canasto de conocimiento.',
      color: '#528E71',
    },
  ],
  curva: ['Mes 1', 'Mes 2', 'Mes 3 (BIS)', 'Mes 4'],
  cita: '"Ahí está el puente para cruzarlo o para no cruzarlo. Yo lo voy a cruzar, sin prevenciones. En la otra orilla alguien me espera con un durazno y un país."',
  citaAutor: 'Mario Benedetti',
};

window.AGENDA = { TEAM, CRONOGRAMA, CICLO, CICLO_HILO, DOCUMENTOS, BITACORA, ALERTAS, HOY_ISO, PUENTE };
