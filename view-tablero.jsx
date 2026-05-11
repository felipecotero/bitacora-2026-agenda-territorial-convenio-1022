/* Vista Tablero — Hoy y esta semana */

function Tablero({ tasks, onToggle, onGoTo, agenda }) {
  const { ALERTAS, HOY_ISO, BITACORA } = window.AGENDA;
  const diasAlEncuentro = diffDias(HOY_ISO, '2026-06-24');

  // Próxima sesión del Ciclo · prefiere data.json si está disponible
  const sesionesC1 = (agenda?.eventos || [])
    .filter(e => e.camino === 'C1')
    .sort((a, b) => a.fecha.localeCompare(b.fecha));
  const tipoPorOrient = { mercy: 'Saberes financieros', jeimmy: 'Saberes RIJ', felipe: 'Comunicaciones' };
  const CICLO = sesionesC1.length
    ? sesionesC1.map((e, i) => ({
        n: i + 1, fecha: e.fecha, tema: e.titulo,
        tipo: tipoPorOrient[e.orientadora] || 'Sesión',
        orient: e.orientadora || 'felipe',
        estado: 'pendiente',
      }))
    : (window.AGENDA.CICLO || []);

  // Filtrar tareas: hoy, esta semana, próximas
  const hoyTasks = tasks.filter(t => t.fecha === HOY_ISO);
  const semanaTasks = tasks.filter(t => {
    const d = diffDias(HOY_ISO, t.fecha);
    return d >= 0 && d <= 7 && !t.semana;
  }).sort((a,b) => a.fecha.localeCompare(b.fecha));

  const proxSesion = CICLO.find(s => diffDias(HOY_ISO, s.fecha) >= 0);

  return (
    <div className="col gap-lg">

      {/* Hero — Encuentro RIJ countdown */}
      <div className="hero with-tex" style={{ '--hero-img': 'url(img/bg-puente.jpg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 24 }}>
          <div style={{ flex: '1 1 320px' }}>
            <div className="eyebrow" style={{ color: 'var(--amarillo)' }}>Encuentro presencial · destacado</div>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: 32, fontWeight: 600, margin: '6px 0 4px', letterSpacing: '-0.02em' }}>
              Encuentro Red Intercultural Juvenil
            </h2>
            <p style={{ fontFamily: 'var(--acento)', fontSize: 26, color: 'var(--amarillo)', margin: '4px 0 12px', lineHeight: 1 }}>
              donde convergemos
            </p>
            <p style={{ fontSize: 14.5, lineHeight: 1.55, color: 'rgba(247,241,230,0.85)', margin: '0 0 16px', maxWidth: 460 }}>
              24 al 27 de junio · 3 noches · 5 jornadas efectivas · ~40 participantes. Sede por confirmar entre Cali y Tunja.
            </p>
            <button className="btn" style={{ background: 'var(--amarillo)', color: 'var(--tinta)' }}
                    onClick={() => onGoTo('encuentro')}>
              Ver logística →
            </button>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="bignum" style={{ color: 'var(--amarillo)' }}>{diasAlEncuentro}</div>
            <div style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(247,241,230,0.7)', marginTop: 4 }}>
              días para el encuentro
            </div>
          </div>
        </div>
      </div>

      {/* Alertas */}
      <div>
        <div className="eyebrow">Atención esta semana</div>
        <h2 className="section-title">Lo que no puede esperar</h2>
        <p className="section-sub">tres focos vivos</p>
        <div className="grid-3">
          {ALERTAS.map((a, i) => (
            <div key={i} className="card" style={{ borderLeft: `4px solid ${a.color}` }}>
              <div style={{ fontSize: 22, color: a.color, fontWeight: 600, fontFamily: 'var(--display)', marginBottom: 6 }}>
                {a.icono}
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 6px', lineHeight: 1.35 }}>{a.titulo}</h3>
              <p style={{ fontSize: 13, color: 'var(--tinta-2)', margin: 0, lineHeight: 1.5 }}>{a.detalle}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Esta semana en una mirada */}
      <div className="grid-2">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
            <div>
              <div className="eyebrow">Próximos 7 días</div>
              <h3 className="section-title" style={{ fontSize: 20 }}>Tareas en curso</h3>
            </div>
            <button className="btn btn-ghost" onClick={() => onGoTo('cronograma')}>Ver todo →</button>
          </div>
          {semanaTasks.length === 0 && <p className="muted">Sin tareas en los próximos 7 días.</p>}
          {semanaTasks.slice(0, 5).map(t => (
            <TaskRow key={t.id} task={t} onToggle={onToggle} compact />
          ))}
        </div>

        <div className="card card-tinted-amarillo">
          <div className="eyebrow">Próxima sesión del Ciclo</div>
          {proxSesion && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 10, marginBottom: 14 }}>
                <DatePill iso={proxSesion.fecha} color="naranja" />
                <div>
                  <h3 style={{ fontFamily: 'var(--display)', fontSize: 19, fontWeight: 600, margin: '0 0 2px', lineHeight: 1.2 }}>
                    Sesión {proxSesion.n} · {proxSesion.tema}
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--tinta-2)', margin: 0 }}>
                    {proxSesion.tipo} · virtual · 1h30
                  </p>
                </div>
              </div>
              <p style={{ fontSize: 13.5, color: 'var(--tinta-2)', margin: 0 }}>
                <strong>Autonomía digital de las redes</strong>. Felipe coordina con orientadoras.
              </p>
              <button className="btn btn-ghost" style={{ marginTop: 14 }} onClick={() => onGoTo('ciclo')}>
                Ver el ciclo completo →
              </button>
            </>
          )}
        </div>
      </div>

      {/* Bitácora preview */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
          <div>
            <div className="eyebrow">Bitácora</div>
            <h3 className="section-title" style={{ fontSize: 20 }}>Lo último que pasó</h3>
          </div>
          <button className="btn btn-ghost" onClick={() => onGoTo('bitacora')}>Ver todo →</button>
        </div>
        {BITACORA.slice(0, 3).map((b, i) => (
          <BitacoraRow key={i} entry={b} />
        ))}
      </div>
    </div>
  );
}

function BitacoraRow({ entry }) {
  const m = getMember(entry.autor);
  return (
    <div style={{ display: 'flex', gap: 14, padding: '14px 0', borderBottom: '1px solid var(--hueso)' }}>
      <div style={{ flexShrink: 0 }}>
        <Avatar id={entry.autor} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', flexWrap: 'wrap', marginBottom: 4 }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>{m.corto}</span>
          <span className={`chip chip-${entry.tipo === 'novedad' ? 'amarillo' : 'violeta'}`}>
            {entry.tipo === 'novedad' ? 'Novedad' : 'Síntesis'}
          </span>
          <span className="muted" style={{ fontSize: 12 }}>{formatFecha(entry.fecha)}</span>
        </div>
        <h4 style={{ fontSize: 15, fontWeight: 500, margin: '2px 0 4px' }}>{entry.titulo}</h4>
        <p style={{ fontSize: 13.5, color: 'var(--tinta-2)', margin: 0, lineHeight: 1.55 }}>{entry.cuerpo}</p>
      </div>
    </div>
  );
}

function TaskRow({ task, onToggle, compact }) {
  const tipoColor = tipoToColor(task.tipo);
  const isDone = task.estado === 'hecha';
  return (
    <div className={`task ${isDone ? 'done' : ''}`}>
      <button
        className={`task-check ${isDone ? 'checked' : ''}`}
        onClick={() => onToggle(task.id)}
        aria-label="Marcar como hecha"
      >
        <svg viewBox="0 0 14 14"><path d="M2 7 L6 11 L12 3" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <div>
        <p className="task-title">{task.titulo}</p>
        {!compact && task.detalle && <p className="task-detail">{task.detalle}</p>}
        <div className="task-meta">
          <span className={`chip chip-${tipoColor}`}>{tipoLabel(task.tipo)}</span>
          {task.fecha && <span>{formatFecha(task.fecha, 'media')}</span>}
          {task.hora && <span>· {task.hora}</span>}
          {task.responsables && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <AvatarStack ids={task.responsables} size="sm" />
            </span>
          )}
          {task.alerta && <span className="chip chip-naranja">{task.alerta}</span>}
        </div>
      </div>
      {task.recurrente && (
        <span className="chip" style={{ alignSelf: 'flex-start' }}>{task.recurrente}</span>
      )}
    </div>
  );
}

window.Tablero = Tablero;
window.TaskRow = TaskRow;
window.BitacoraRow = BitacoraRow;
