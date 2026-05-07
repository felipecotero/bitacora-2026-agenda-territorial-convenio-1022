/* Vista Equipo */

function Equipo() {
  const { TEAM, CRONOGRAMA } = window.AGENDA;
  const [sel, setSel] = useState(null);

  return (
    <div className="col gap-lg">
      <div>
        <div className="eyebrow">Equipo · Agenda Territorial del Despacho</div>
        <h2 className="section-title" style={{ fontSize: 26 }}>Quiénes tejen este convenio</h2>
        <p className="section-sub violeta">seis voces, un solo telar</p>
      </div>

      <div className="grid-3">
        {TEAM.map(p => {
          const tareas = CRONOGRAMA.filter(t => t.responsables.includes(p.id) && t.estado !== 'hecha').length;
          return (
            <div key={p.id} className="card" style={{ cursor: 'pointer', borderTop: `4px solid ${p.color}` }} onClick={() => setSel(p)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                <Avatar id={p.id} size="lg" />
                <div>
                  <div style={{ fontFamily: 'var(--display)', fontSize: 18, fontWeight: 600, lineHeight: 1.2 }}>{p.corto}</div>
                  <div className="muted" style={{ fontSize: 12.5 }}>{p.area}</div>
                </div>
              </div>
              <div style={{ fontSize: 13.5, color: 'var(--tinta-2)', minHeight: 38, lineHeight: 1.45, marginBottom: 12 }}>
                {p.rol}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--hueso)' }}>
                <span className="muted" style={{ fontSize: 12 }}>{p.nombre}</span>
                <span className={`chip chip-violeta`}>{tareas} pendientes</span>
              </div>
            </div>
          );
        })}
      </div>

      {sel && <PersonaModal persona={sel} onClose={() => setSel(null)} />}
    </div>
  );
}

function PersonaModal({ persona, onClose }) {
  const { CRONOGRAMA } = window.AGENDA;
  const sus = CRONOGRAMA.filter(t => t.responsables.includes(persona.id));
  const pend = sus.filter(t => t.estado !== 'hecha');
  const hechas = sus.filter(t => t.estado === 'hecha');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center', marginBottom: 18 }}>
          <Avatar id={persona.id} size="lg" />
          <div>
            <div className="eyebrow" style={{ color: persona.color }}>{persona.area}</div>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: 28, fontWeight: 600, margin: '2px 0 4px', letterSpacing: '-0.01em' }}>
              {persona.nombre}
            </h2>
            <div style={{ fontSize: 14, color: 'var(--tinta-2)' }}>{persona.rol}</div>
          </div>
        </div>
        <p style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--tinta-2)', marginBottom: 24 }}>
          {persona.descripcion}
        </p>
        <h3 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--tinta-3)', fontWeight: 600, margin: '0 0 10px' }}>
          Pendientes · {pend.length}
        </h3>
        {pend.map(t => (
          <div key={t.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--hueso)' }}>
            <div style={{ fontWeight: 500 }}>{t.titulo}</div>
            <div className="muted" style={{ fontSize: 12.5 }}>{formatFecha(t.fecha, 'media')}</div>
          </div>
        ))}
        {hechas.length > 0 && (
          <>
            <h3 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--tinta-3)', fontWeight: 600, margin: '20px 0 10px' }}>
              Cerradas · {hechas.length}
            </h3>
            {hechas.map(t => (
              <div key={t.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--hueso)', opacity: 0.7 }}>
                <div style={{ fontWeight: 500, textDecoration: 'line-through' }}>{t.titulo}</div>
                <div className="muted" style={{ fontSize: 12.5 }}>{formatFecha(t.fecha, 'media')}</div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

window.Equipo = Equipo;
