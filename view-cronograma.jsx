/* Vista Cronograma — semanas navegables */

const SEMANAS = [
  { id: 'sem18', label: 'Sem 27 abr', inicio: '2026-04-27', fin: '2026-05-03', titulo: 'Semana del 27 de abr al 3 de mayo' },
  { id: 'sem19', label: 'Sem 4 may',  inicio: '2026-05-04', fin: '2026-05-10', titulo: 'Semana del 4 al 10 de mayo' },
  { id: 'sem20', label: 'Sem 11 may', inicio: '2026-05-11', fin: '2026-05-17', titulo: 'Semana del 11 al 17 de mayo' },
  { id: 'sem21', label: 'Sem 18 may', inicio: '2026-05-18', fin: '2026-05-24', titulo: 'Semana del 18 al 24 de mayo' },
  { id: 'sem22', label: 'Sem 25 may', inicio: '2026-05-25', fin: '2026-05-31', titulo: 'Semana del 25 al 31 de mayo' },
  { id: 'sem23', label: 'Sem 1 jun',  inicio: '2026-06-01', fin: '2026-06-07', titulo: 'Semana del 1 al 7 de junio' },
  { id: 'sem24', label: 'Sem 8 jun',  inicio: '2026-06-08', fin: '2026-06-14', titulo: 'Semana del 8 al 14 de junio' },
  { id: 'sem25', label: 'Sem 15 jun', inicio: '2026-06-15', fin: '2026-06-21', titulo: 'Semana del 15 al 21 de junio' },
  { id: 'sem26', label: 'Sem 22 jun', inicio: '2026-06-22', fin: '2026-06-28', titulo: 'Semana del 22 al 28 de junio · Encuentro' },
];

function semanaActual(hoy) {
  return SEMANAS.find(s => s.inicio <= hoy && hoy <= s.fin) || SEMANAS[1];
}

function Cronograma({ tasks, onToggle, agenda }) {
  const { HOY_ISO } = window.AGENDA;
  const [semId, setSemId] = useState(semanaActual(HOY_ISO).id);
  const sem = SEMANAS.find(s => s.id === semId);

  // Derivar sesiones del Ciclo desde data.json (fuente única de verdad)
  // Si agenda aún no cargó, usa el array estático de data.js como fallback
  const tipoPorOrient = { mercy: 'Saberes financieros', jeimmy: 'Saberes RIJ', felipe: 'Comunicaciones' };
  const CICLO_VIVO = (agenda?.eventos || [])
    .filter(e => e.camino === 'C1')
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .map((e, i) => ({
      n: i + 1,
      fecha: e.fecha,
      tema: e.titulo,
      tipo: tipoPorOrient[e.orientadora] || 'Sesión',
      orient: e.orientadora || '',
      hora: e.hora || '',
      lugar: e.lugar || '',
    }));
  const CICLO = CICLO_VIVO.length ? CICLO_VIVO : (window.AGENDA.CICLO || []);

  const enSemana = tasks.filter(t => t.fecha >= sem.inicio && t.fecha <= sem.fin);
  const sesionesSemana = CICLO.filter(s => s.fecha >= sem.inicio && s.fecha <= sem.fin);

  // Group by date
  const grupos = {};
  enSemana.forEach(t => { (grupos[t.fecha] = grupos[t.fecha] || []).push(t); });
  const fechasOrdenadas = Object.keys(grupos).sort();

  return (
    <div className="col gap-lg">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div className="eyebrow">Cronograma vivo</div>
          <h2 className="section-title" style={{ fontSize: 26 }}>{sem.titulo}</h2>
          <p className="section-sub violeta">aquí teje la semana</p>
        </div>
        <div className="row gap-sm">
          <button className="btn btn-ghost" onClick={() => {
            const i = SEMANAS.findIndex(s => s.id === semId);
            if (i > 0) setSemId(SEMANAS[i - 1].id);
          }}>← Anterior</button>
          <button className="btn btn-ghost" onClick={() => setSemId(semanaActual(HOY_ISO).id)}>Esta semana</button>
          <button className="btn btn-ghost" onClick={() => {
            const i = SEMANAS.findIndex(s => s.id === semId);
            if (i < SEMANAS.length - 1) setSemId(SEMANAS[i + 1].id);
          }}>Siguiente →</button>
        </div>
      </div>

      <div style={{ overflowX: 'auto', paddingBottom: 6 }}>
        <div className="tabs" style={{ width: 'max-content' }}>
          {SEMANAS.map(s => (
            <button key={s.id}
              className={s.id === semId ? 'active' : ''}
              onClick={() => setSemId(s.id)}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {sesionesSemana.length > 0 && (
        <div className="card card-tinted-amarillo">
          <div className="eyebrow">Ciclo de Formación · esta semana</div>
          {sesionesSemana.map(s => (
            <div key={s.n} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(232,197,53,0.3)' }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--naranja)', color: 'var(--crema)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--display)', fontWeight: 600 }}>
                {s.n}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14.5, lineHeight: 1.3 }}>{s.tema}</div>
                <div className="muted" style={{ fontSize: 13 }}>
                  {formatFecha(s.fecha, 'media')} · {s.tipo}
                  {s.hora && s.hora !== 'Por confirmar' && ` · ${s.hora}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {fechasOrdenadas.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--tinta-3)' }}>
          <SpiralGlyph size={48} color="#DDD1BA" />
          <p style={{ marginTop: 14 }}>No hay tareas registradas en esta semana.</p>
        </div>
      )}

      {fechasOrdenadas.map(fecha => {
        const dest = grupos[fecha].some(t => t.destacado);
        const ts = grupos[fecha];
        const colorPill = dest ? 'naranja' : 'violeta';
        return (
          <div key={fecha} className="card" style={dest ? { borderColor: 'var(--naranja)', borderWidth: 2 } : {}}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 8 }}>
              <DatePill iso={fecha} color={colorPill} />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontFamily: 'var(--display)', fontSize: 18, fontWeight: 600, margin: '4px 0 2px' }}>
                  {formatFecha(fecha)}
                </h3>
                {ts[0].alerta && <span className="chip chip-naranja">{ts[0].alerta}</span>}
              </div>
            </div>
            {ts.map(t => <TaskRow key={t.id} task={t} onToggle={onToggle} />)}
          </div>
        );
      })}
    </div>
  );
}

window.Cronograma = Cronograma;
