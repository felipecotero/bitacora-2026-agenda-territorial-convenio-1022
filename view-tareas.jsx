/* Vista Tareas — filtrable por persona */

function Tareas({ tasks, onToggle }) {
  const { TEAM, HOY_ISO } = window.AGENDA;
  const [filtro, setFiltro] = useState('todos');
  const [verHechas, setVerHechas] = useState(false);

  const filtered = tasks.filter(t => {
    if (!verHechas && t.estado === 'hecha') return false;
    if (filtro === 'todos') return true;
    if (filtro === 'mias-felipe') return t.responsables.includes('felipe');
    return t.responsables.includes(filtro);
  });

  const pendientes = filtered.filter(t => t.estado !== 'hecha').sort((a,b) => a.fecha.localeCompare(b.fecha));
  const hechas = filtered.filter(t => t.estado === 'hecha').sort((a,b) => b.fecha.localeCompare(a.fecha));

  const totales = TEAM.map(p => ({
    p,
    count: tasks.filter(t => t.estado !== 'hecha' && t.responsables.includes(p.id)).length,
  }));

  return (
    <div className="col gap-lg">
      <div>
        <div className="eyebrow">Tareas</div>
        <h2 className="section-title" style={{ fontSize: 26 }}>Lo que está pendiente</h2>
        <p className="section-sub">por persona, sin perderse</p>
      </div>

      <div className="card">
        <div className="eyebrow" style={{ marginBottom: 10 }}>Filtrar por persona</div>
        <div className="row gap-sm" style={{ marginBottom: 4 }}>
          <button
            className={`btn btn-ghost ${filtro === 'todos' ? 'active' : ''}`}
            onClick={() => setFiltro('todos')}
          >
            Todo el equipo
            <span className="chip" style={{ marginLeft: 4 }}>{tasks.filter(t => t.estado !== 'hecha').length}</span>
          </button>
          {totales.map(({ p, count }) => (
            <button
              key={p.id}
              className={`btn btn-ghost ${filtro === p.id ? 'active' : ''}`}
              onClick={() => setFiltro(p.id)}
              style={filtro === p.id ? { background: p.color, borderColor: p.color, color: '#fff' } : {}}
            >
              <Avatar id={p.id} size="sm" />
              {p.corto}
              <span className="chip" style={filtro === p.id ? { background: 'rgba(255,255,255,0.25)', color: '#fff' } : {}}>{count}</span>
            </button>
          ))}
        </div>
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--hueso)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={verHechas}
              onChange={e => setVerHechas(e.target.checked)}
              style={{ width: 16, height: 16 }}
            />
            Mostrar tareas hechas
          </label>
        </div>
      </div>

      <div className="card">
        <h3 className="section-title" style={{ fontSize: 18, marginBottom: 14 }}>
          Pendientes <span style={{ color: 'var(--tinta-3)', fontWeight: 400 }}>· {pendientes.length}</span>
        </h3>
        {pendientes.length === 0 && (
          <p className="muted" style={{ textAlign: 'center', padding: '20px 0' }}>
            <span style={{ fontFamily: 'var(--acento)', fontSize: 24, color: 'var(--verde)' }}>al día</span>
            <br/>No hay tareas pendientes con este filtro.
          </p>
        )}
        {pendientes.map(t => <TaskRow key={t.id} task={t} onToggle={onToggle} />)}
      </div>

      {verHechas && hechas.length > 0 && (
        <div className="card" style={{ background: 'var(--hueso)' }}>
          <h3 className="section-title" style={{ fontSize: 18, marginBottom: 14 }}>
            Hechas <span style={{ color: 'var(--tinta-3)', fontWeight: 400 }}>· {hechas.length}</span>
          </h3>
          {hechas.map(t => <TaskRow key={t.id} task={t} onToggle={onToggle} />)}
        </div>
      )}
    </div>
  );
}

window.Tareas = Tareas;
