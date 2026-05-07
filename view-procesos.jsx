/* Vista Ciclo de Formación + Encuentro RIJ */

const DIAS_LARGO_C = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];

function Ciclo({ agenda, onGoTo }) {
  const { CICLO_HILO, HOY_ISO, PUENTE } = window.AGENDA;

  // Fuente única: derivar las sesiones C1 desde data.json
  const CICLO = React.useMemo(() => {
    if (!agenda?.eventos) return window.AGENDA.CICLO || [];
    const tipoPorOrient = {
      mercy:  'Saberes financieros',
      jeimmy: 'Saberes RIJ',
      felipe: 'Comunicaciones',
    };
    return agenda.eventos
      .filter(e => e.carril === 'C1')
      .sort((a, b) => a.fecha.localeCompare(b.fecha))
      .map((e, i) => {
        const d = parseISO(e.fecha);
        const alerta = (e.notas && (e.notas.toLowerCase().includes('festivo') || e.notas.toLowerCase().includes('andrea'))) ? e.notas : null;
        return {
          n: i + 1,
          fecha: e.fecha,
          dia: DIAS_LARGO_C[d.getDay()],
          tipo: tipoPorOrient[e.orientadora] || 'Sesión',
          tema: e.titulo,
          orient: e.orientadora || 'felipe',
          hora: e.hora,
          lugar: e.lugar,
          estado: 'pendiente',
          estadoCal: e.estadoCal || 'propuesta',
          alerta,
        };
      });
  }, [agenda]);

  const proxIdx = CICLO.findIndex(s => diffDias(HOY_ISO, s.fecha) >= 0);
  const [verPuente, setVerPuente] = useState(false);
  const [verHilo, setVerHilo] = useState(false);
  const [filtroLinea, setFiltroLinea] = useState('todas');

  const lineas = [
    { id: 'todas',           label: 'Todas',          color: 'var(--tinta-2)' },
    { id: 'mercy',           label: 'Saberes financieros · Mercy', color: '#A8438A', orient: 'mercy' },
    { id: 'jeimmy',          label: 'Saberes RIJ · Jeimmy',        color: '#D97B3F', orient: 'jeimmy' },
    { id: 'felipe',          label: 'Comunicaciones · Felipe',     color: '#E8C535', orient: 'felipe' },
  ];

  const sesionesFiltradas = filtroLinea === 'todas'
    ? CICLO
    : CICLO.filter(s => s.orient === filtroLinea);

  const conteo = {
    mercy:  CICLO.filter(s => s.orient === 'mercy').length,
    jeimmy: CICLO.filter(s => s.orient === 'jeimmy').length,
    felipe: CICLO.filter(s => s.orient === 'felipe').length,
  };

  return (
    <div className="col gap-lg">
      <div>
        <div className="eyebrow">Ciclo de Formación Puente</div>
        <h2 className="section-title" style={{ fontSize: 28 }}>Saberes que se entretejen</h2>
        <p className="section-sub">finanzas · RIJ · comunicaciones — 12 sesiones</p>
      </div>

      {/* Banda de estado · cierra mañana */}
      <div className="card" style={{ background: 'var(--amarillo)', color: 'var(--tinta)', border: 'none', borderLeft: '6px solid var(--naranja)' }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 320px' }}>
            <div className="eyebrow" style={{ color: 'var(--tinta)' }}>{CICLO_HILO.estado}</div>
            <h3 style={{ fontFamily: 'var(--display)', fontSize: 20, fontWeight: 600, margin: '4px 0 6px', lineHeight: 1.3 }}>
              Mañana en la tarde se cierran fechas, horas y días con Mercy y Jeimmy.
            </h3>
            <p style={{ fontSize: 13.5, color: 'var(--tinta-2)', margin: 0, lineHeight: 1.55 }}>
              Hasta entonces este calendario está como <em>propuesta</em>. La propuesta de Mercy del 5 de mayo, las observaciones de Andrea (Fondo Mixto) y la alerta sobre festivos del 18 de mayo y el 15 de junio se consolidarán en esa reunión.
            </p>
          </div>
          <button className="btn" style={{ background: 'var(--tinta)', color: 'var(--crema)', flexShrink: 0 }} onClick={() => setVerHilo(v => !v)}>
            {verHilo ? 'Cerrar hilo' : 'Ver hilo del correo →'}
          </button>
        </div>

        {verHilo && (
          <div style={{ marginTop: 18, paddingTop: 18, borderTop: '1px solid rgba(28,18,12,0.18)' }}>
            <div className="col gap-md">
              {CICLO_HILO.mensajes.map((m, i) => {
                const tipoColor = {
                  propuesta:   { bg: 'rgba(168,67,138,0.12)', tag: '#A8438A', label: 'Propuesta' },
                  observacion: { bg: 'rgba(61,80,168,0.12)',  tag: '#3D50A8', label: 'Observación' },
                  alerta:      { bg: 'rgba(217,123,63,0.18)', tag: '#D97B3F', label: 'Alerta' },
                  cierre:      { bg: 'rgba(82,142,113,0.18)', tag: '#528E71', label: 'Cierre' },
                }[m.tipo];
                const autor = m.autor ? getMember(m.autor) : null;
                return (
                  <div key={i} style={{ background: tipoColor.bg, borderRadius: 'var(--r-md)', padding: 14, borderLeft: `3px solid ${tipoColor.tag}` }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 6 }}>
                      <span className="chip" style={{ background: tipoColor.tag, color: '#fff' }}>{tipoColor.label}</span>
                      {autor && <span className="muted" style={{ fontSize: 12.5 }}>· {autor.corto}</span>}
                      <span className="muted" style={{ fontSize: 12.5 }}>· {formatFecha(m.fecha, 'media')}</span>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 14.5, marginBottom: 4, color: 'var(--tinta)' }}>{m.titulo}</div>
                    <div style={{ fontSize: 13, color: 'var(--tinta-2)', lineHeight: 1.55 }}>{m.cuerpo}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Antesala PUENTE */}
      <div className="card tex-invade" style={{ background: '#1D0F2E', color: 'var(--crema)', borderColor: '#1D0F2E', overflow: 'hidden', position: 'relative', '--tex-img': 'url(img/bg-puente.jpg)', '--tex-op': 0.28, '--tex-blend': 'screen', '--tex-pos': 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 90% 10%, rgba(232,197,53,0.12) 0, transparent 40%), radial-gradient(circle at 5% 90%, rgba(217,123,63,0.18) 0, transparent 45%)', zIndex: 0 }}></div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div className="eyebrow" style={{ color: 'var(--amarillo)' }}>Avanzada · 2025</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap', margin: '6px 0 8px' }}>
            <img src="img/puente-logo-blanco.svg" alt="PUENTE" className="puente-logo" style={{ maxWidth: 320, filter: 'drop-shadow(0 2px 12px rgba(0,0,0,0.35))' }} />
          </div>
          <p style={{ fontFamily: 'var(--acento)', fontSize: 26, color: 'var(--amarillo)', margin: '0 0 14px', lineHeight: 1 }}>
            {PUENTE.lema}
          </p>
          <p style={{ fontSize: 14.5, color: 'rgba(247,241,230,0.85)', margin: '0 0 18px', maxWidth: 620, lineHeight: 1.6 }}>
            {PUENTE.bajada}. La avanzada del año pasado da marco al Convenio 1022 y al Ciclo de Formación Puente que arranca este abril.
          </p>
          <div className="row gap-sm" style={{ marginBottom: 16 }}>
            {PUENTE.apuesta.map(a => (
              <span key={a} className="chip" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--crema)', border: '1px solid rgba(255,255,255,0.15)' }}>{a}</span>
            ))}
          </div>
          <button className="btn" style={{ background: 'var(--amarillo)', color: 'var(--tinta)' }}
                  onClick={() => setVerPuente(v => !v)}>
            {verPuente ? 'Cerrar marco PUENTE' : 'Abrir marco PUENTE →'}
          </button>

          {verPuente && (
            <div style={{ marginTop: 22, paddingTop: 22, borderTop: '1px solid rgba(255,255,255,0.15)' }}>
              <div className="eyebrow" style={{ color: 'var(--amarillo)' }}>Cinco enfoques</div>
              <div className="row gap-sm" style={{ marginTop: 8, marginBottom: 22 }}>
                {PUENTE.enfoques.map(e => (
                  <span key={e.n} className="chip" style={{ background: e.c, color: '#fff' }}>{e.n}</span>
                ))}
              </div>

              <div className="eyebrow" style={{ color: 'var(--amarillo)' }}>Tres rutas</div>
              <div className="grid-3" style={{ marginTop: 10, marginBottom: 22 }}>
                {PUENTE.rutas.map(r => (
                  <div key={r.nombre} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--r-md)', padding: 16, borderTop: `3px solid ${r.color}` }}>
                    <div style={{ fontFamily: 'var(--display)', fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{r.nombre}</div>
                    <div style={{ fontFamily: 'var(--acento)', fontSize: 18, color: 'var(--amarillo)', marginBottom: 8, lineHeight: 1 }}>{r.bajada}</div>
                    <div style={{ fontSize: 13, color: 'rgba(247,241,230,0.78)', lineHeight: 1.5 }}>{r.detalle}</div>
                  </div>
                ))}
              </div>

              <div style={{ paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <p style={{ fontFamily: 'var(--acento)', fontSize: 22, color: 'var(--amarillo)', lineHeight: 1.4, margin: 0, maxWidth: 720 }}>
                  {PUENTE.cita}
                </p>
                <p style={{ fontSize: 12, color: 'rgba(247,241,230,0.6)', marginTop: 8, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  — {PUENTE.citaAutor}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card weave" style={{ background: 'var(--violeta)', color: 'var(--crema)' }}>
        <div className="grid-3" style={{ gap: 20 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--amarillo)', marginBottom: 4 }}>Periodo propuesto</div>
            <div style={{ fontFamily: 'var(--display)', fontSize: 22, fontWeight: 600 }}>13 mayo – 22 junio</div>
          </div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--amarillo)', marginBottom: 4 }}>Sesiones</div>
            <div style={{ fontFamily: 'var(--display)', fontSize: 22, fontWeight: 600 }}>12 · virtuales</div>
          </div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--amarillo)', marginBottom: 4 }}>Tres líneas</div>
            <div style={{ fontFamily: 'var(--display)', fontSize: 16, fontWeight: 500, lineHeight: 1.3 }}>Saberes financieros · Saberes RIJ · Comunicaciones</div>
          </div>
        </div>
      </div>

      {/* Las tres líneas */}
      <div className="grid-3">
        <div className="card" style={{ borderTop: '4px solid #A8438A' }}>
          <div className="row gap-sm" style={{ alignItems: 'center', marginBottom: 8 }}>
            <Avatar id="mercy" />
            <div>
              <div className="eyebrow" style={{ color: '#A8438A' }}>Línea · Mercy</div>
              <h3 style={{ fontFamily: 'var(--display)', fontSize: 18, fontWeight: 600, margin: 0 }}>Saberes financieros</h3>
            </div>
          </div>
          <p style={{ fontSize: 13, color: 'var(--tinta-2)', margin: '0 0 10px', lineHeight: 1.55 }}>
            Cinco sesiones que abren la pregunta por los recursos en clave personal y organizativa.
          </p>
          <ul style={{ fontSize: 12.5, color: 'var(--tinta-2)', margin: 0, paddingLeft: 16, lineHeight: 1.7 }}>
            <li>Finanzas Personales</li>
            <li>Presupuesto</li>
            <li>Flujo de caja</li>
            <li>Diversificación de ingresos</li>
            <li>Indicadores para control financiero</li>
          </ul>
        </div>

        <div className="card" style={{ borderTop: '4px solid #D97B3F' }}>
          <div className="row gap-sm" style={{ alignItems: 'center', marginBottom: 8 }}>
            <Avatar id="jeimmy" />
            <div>
              <div className="eyebrow" style={{ color: '#D97B3F' }}>Línea · Jeimmy</div>
              <h3 style={{ fontFamily: 'var(--display)', fontSize: 18, fontWeight: 600, margin: 0 }}>Saberes RIJ</h3>
            </div>
          </div>
          <p style={{ fontSize: 13, color: 'var(--tinta-2)', margin: '0 0 10px', lineHeight: 1.55 }}>
            Cinco sesiones desde lo íntimo, lo plural y las herramientas de la Red Intercultural Juvenil.
          </p>
          <ul style={{ fontSize: 12.5, color: 'var(--tinta-2)', margin: 0, paddingLeft: 16, lineHeight: 1.7 }}>
            <li>Íntimo esencial</li>
            <li>Vínculos Recíprocos</li>
            <li>Plural Comunitario</li>
            <li>Herramientas</li>
            <li>Herramientas II</li>
          </ul>
        </div>

        <div className="card" style={{ borderTop: '4px solid #E8C535' }}>
          <div className="row gap-sm" style={{ alignItems: 'center', marginBottom: 8 }}>
            <Avatar id="felipe" />
            <div>
              <div className="eyebrow" style={{ color: '#9A7E12' }}>Línea · Felipe</div>
              <h3 style={{ fontFamily: 'var(--display)', fontSize: 18, fontWeight: 600, margin: 0 }}>Comunicaciones</h3>
            </div>
          </div>
          <p style={{ fontSize: 13, color: 'var(--tinta-2)', margin: '0 0 10px', lineHeight: 1.55 }}>
            Dos sesiones generales del ciclo, sin contar las capacitaciones específicas con los grupos de comunicaciones de cada red.
          </p>
          <ul style={{ fontSize: 12.5, color: 'var(--tinta-2)', margin: 0, paddingLeft: 16, lineHeight: 1.7 }}>
            <li>Comunicaciones I</li>
            <li>Comunicaciones II</li>
            <li className="muted" style={{ fontStyle: 'italic' }}>+ talleres por red</li>
          </ul>
        </div>
      </div>

      {/* Calendario con filtro */}
      <div className="card">
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: 14 }}>
          <div style={{ flex: '1 1 200px' }}>
            <div className="eyebrow">Calendario propuesto</div>
            <h3 className="section-title" style={{ fontSize: 20, margin: 0 }}>12 sesiones — fechas en revisión</h3>
          </div>
          <div className="row gap-xs" style={{ flexWrap: 'wrap' }}>
            {lineas.map(l => {
              const active = filtroLinea === l.id;
              return (
                <button key={l.id} className="chip" style={{
                  background: active ? l.color : 'var(--hueso)',
                  color: active ? '#fff' : 'var(--tinta-2)',
                  border: active ? `1px solid ${l.color}` : '1px solid transparent',
                  cursor: 'pointer',
                }} onClick={() => setFiltroLinea(l.id)}>
                  {l.label}{l.id !== 'todas' && conteo[l.id] !== undefined && ` · ${conteo[l.id]}`}
                </button>
              );
            })}
          </div>
        </div>

        {sesionesFiltradas.map((s, i) => {
          const isProx = CICLO.indexOf(s) === proxIdx;
          const isPast = s.estado === 'hecha';
          const orient = getMember(s.orient);
          const orientColor = { mercy: '#A8438A', jeimmy: '#D97B3F', felipe: '#E8C535' }[s.orient];
          const enRevision = s.estadoCal === 'en-revision';
          return (
            <div key={s.n} style={{
              display: 'flex', gap: 18, padding: '14px 0',
              borderBottom: i < sesionesFiltradas.length - 1 ? '1px solid var(--hueso)' : 'none',
              opacity: isPast ? 0.55 : 1,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: isProx ? 'var(--naranja)' : orientColor,
                color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--display)', fontWeight: 600, fontSize: 18,
              }}>{s.n}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', flexWrap: 'wrap', marginBottom: 4 }}>
                  <span className="chip" style={{ background: orientColor, color: '#fff' }}>{s.tipo}</span>
                  {isProx && <span className="chip chip-amarillo">Próxima</span>}
                  {enRevision && <span className="chip" style={{ background: 'rgba(217,123,63,0.18)', color: '#9C4719', border: '1px solid rgba(217,123,63,0.4)' }}>En revisión</span>}
                  <span className="muted" style={{ fontSize: 12.5 }}>{s.dia} · {formatFecha(s.fecha, 'media')}</span>
                  <span className="muted" style={{ fontSize: 12.5 }}>· {orient.corto}</span>
                </div>
                <h4 style={{ fontSize: 16, fontWeight: 600, margin: 0, lineHeight: 1.35 }}>{s.tema}</h4>
                {s.alerta && (
                  <div style={{ marginTop: 6, fontSize: 12, color: '#9C4719', fontStyle: 'italic' }}>↳ {s.alerta}</div>
                )}
              </div>
            </div>
          );
        })}

        <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px dashed var(--hueso)', fontSize: 12.5, color: 'var(--tinta-2)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--tinta)' }}>Notas vivas del calendario:</strong> Mercy alertó que el <strong>18 de mayo</strong> y el <strong>15 de junio</strong> son festivos — por eso algunos lunes están desplazados a viernes. Andrea (Fondo Mixto) propuso 18, 25 de mayo y 1, 15, 22 de junio como sus fechas; varias coinciden con festivos y se ajustan en la reunión de mañana.
        </div>
      </div>
    </div>
  );
}

function Encuentro({ onGoTo }) {
  const { HOY_ISO } = window.AGENDA;
  const dias = diffDias(HOY_ISO, '2026-06-24');
  const semanas = Math.floor(dias / 7);
  const diasRest = dias - semanas * 7;

  return (
    <div className="col gap-lg">
      <div>
        <div className="eyebrow">Encuentro presencial</div>
        <h2 className="section-title" style={{ fontSize: 28 }}>Encuentro Red Intercultural Juvenil</h2>
        <p className="section-sub">donde convergemos</p>
      </div>

      <div className="hero with-tex" style={{ '--hero-img': 'url(img/bg-mapa.jpg)' }}>
        <div className="grid-2" style={{ alignItems: 'center', gap: 30 }}>
          <div>
            <div className="eyebrow" style={{ color: 'var(--amarillo)' }}>Cuenta atrás</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 8 }}>
              <div className="bignum" style={{ color: 'var(--amarillo)' }}>{dias}</div>
              <div style={{ color: 'rgba(247,241,230,0.85)' }}>
                <div style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em' }}>días</div>
                <div style={{ fontFamily: 'var(--acento)', fontSize: 22, color: 'var(--amarillo)' }}>
                  {semanas} sem · {diasRest} d
                </div>
              </div>
            </div>
            <p style={{ fontSize: 14.5, lineHeight: 1.55, color: 'rgba(247,241,230,0.85)', marginTop: 16 }}>
              <strong style={{ color: 'var(--crema)' }}>24 al 27 de junio de 2026</strong>. 3 noches. 5 jornadas efectivas. Aproximadamente 40 participantes de las organizaciones de la RIJ.
            </p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 'var(--r-lg)', padding: 22, backdropFilter: 'blur(8px)' }}>
            <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--amarillo)', marginBottom: 10 }}>Sede · por confirmar</div>
            <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center', gap: 20 }}>
              <div>
                <div style={{ fontFamily: 'var(--display)', fontSize: 26, fontWeight: 600 }}>Cali</div>
                <div style={{ fontSize: 12, color: 'rgba(247,241,230,0.7)' }}>opción A</div>
              </div>
              <div style={{ fontFamily: 'var(--acento)', fontSize: 28, color: 'var(--amarillo)', alignSelf: 'center' }}>ó</div>
              <div>
                <div style={{ fontFamily: 'var(--display)', fontSize: 26, fontWeight: 600 }}>Tunja</div>
                <div style={{ fontSize: 12, color: 'rgba(247,241,230,0.7)' }}>opción B</div>
              </div>
            </div>
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.15)', fontSize: 13, color: 'rgba(247,241,230,0.85)' }}>
              Yuli decide a más tardar el <strong style={{ color: 'var(--amarillo)' }}>viernes 8 de mayo</strong>, según respuesta de la Gobernación de Boyacá.
            </div>
          </div>
        </div>
      </div>

      <div className="grid-3">
        <div className="card">
          <div className="eyebrow">Hito · 15 may</div>
          <h3 style={{ fontFamily: 'var(--display)', fontSize: 17, fontWeight: 600, margin: '4px 0 6px' }}>Primer borrador del documento conceptual</h3>
          <p style={{ fontSize: 13, color: 'var(--tinta-2)', margin: 0 }}>Mónica articula. El equipo aporta.</p>
        </div>
        <div className="card">
          <div className="eyebrow">Hito · 25 may</div>
          <h3 style={{ fontFamily: 'var(--display)', fontSize: 17, fontWeight: 600, margin: '4px 0 6px' }}>Documento conceptual consolidado</h3>
          <p style={{ fontSize: 13, color: 'var(--tinta-2)', margin: 0 }}>Versión revisada y lista para diagramación con Felipe.</p>
        </div>
        <div className="card">
          <div className="eyebrow">Hito · 24 jun</div>
          <h3 style={{ fontFamily: 'var(--display)', fontSize: 17, fontWeight: 600, margin: '4px 0 6px' }}>Inicio del encuentro</h3>
          <p style={{ fontSize: 13, color: 'var(--tinta-2)', margin: 0 }}>Llegadas y apertura. 3 noches en sede confirmada.</p>
        </div>
      </div>

      <div className="card">
        <div className="eyebrow">Coordinación del encuentro</div>
        <h3 className="section-title" style={{ fontSize: 18, marginBottom: 14 }}>Quién hace qué</h3>
        <div className="grid-2">
          {[
            { id: 'yuli', tarea: 'Decisión de sede · articulación institucional · gestión British Council' },
            { id: 'monica', tarea: 'Documento conceptual · articulación con poblaciones · línea gráfica con Alejandra' },
            { id: 'jeimmy', tarea: 'Convocatoria de organizaciones de la RIJ · CONPES Juventudes' },
            { id: 'mercy', tarea: 'Articulación poblaciones · base de datos para convocatoria' },
            { id: 'emerson', tarea: 'Caracterización del Directorio Vivo · costeo de transportes · agenda del equipo' },
            { id: 'felipe', tarea: 'Diagramación documento · piezas comunicativas · plataforma RIJ' },
          ].map(({ id, tarea }) => (
            <div key={id} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--hueso)' }}>
              <Avatar id={id} />
              <div style={{ flex: 1, fontSize: 13.5, color: 'var(--tinta-2)', lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--tinta)' }}>{getMember(id).corto}</strong> · {tarea}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.Ciclo = Ciclo;
window.Encuentro = Encuentro;
