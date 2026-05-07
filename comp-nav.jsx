/* Sidebar / Nav */

const SECTION_COLORS = {
  tablero:    { color: '#5A3680', accent: '#E8C535' }, // violeta + amarillo
  cronograma: { color: '#D97B3F', accent: '#F7D8B4' }, // naranja
  tareas:     { color: '#528E71', accent: '#C8E2D2' }, // verde
  bitacora:   { color: '#3D50A8', accent: '#B7C4EC' }, // azul
  equipo:     { color: '#A8438A', accent: '#F0BFD8' }, // magenta
  ciclo:      { color: '#7E5BA4', accent: '#E8C535' }, // violeta claro + amarillo
  encuentro:  { color: '#1D0F2E', accent: '#D97B3F' }, // tinta + naranja
  telar:      { color: '#3D2058', accent: '#E8C535' }, // tinta violeta + amarillo
  documentos: { color: '#6E5B0D', accent: '#E8C535' }, // ocre + amarillo
};
window.SECTION_COLORS = SECTION_COLORS;

function Sidebar({ active, onChange, counts }) {
  const items = [
    { id: 'tablero',   label: 'Tablero',           section: 'Hoy' },
    { id: 'cronograma',label: 'Cronograma',        section: 'Hoy', count: counts.proximas },
    { id: 'tareas',    label: 'Tareas',            section: 'Hoy', count: counts.pendientes },
    { id: 'bitacora',  label: 'Bitácora',          section: 'Hoy' },
    { id: 'equipo',    label: 'Equipo',            section: 'Personas' },
    { id: 'ciclo',     label: 'Ciclo de Formación',section: 'Procesos' },
    { id: 'telar',     label: 'El Telar',          section: 'Procesos' },
    { id: 'encuentro', label: 'Encuentro RIJ',     section: 'Procesos' },
    { id: 'documentos',label: 'Documentos',        section: 'Materiales' },
  ];
  const sections = [...new Set(items.map(i => i.section))];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <SpiralGlyph size={28} color="#E8C535" />
          <span>Convenio 1022 · 2025</span>
        </div>
        <div className="brand-name">Bitácora del equipo</div>
        <div className="brand-sub">agenda territorial</div>
      </div>

      <nav className="nav">
        {sections.map(sec => (
          <React.Fragment key={sec}>
            <div className="nav-section">{sec}</div>
            {items.filter(i => i.section === sec).map(it => (
              <button
                key={it.id}
                className={`nav-item ${active === it.id ? 'active' : ''}`}
                onClick={() => onChange(it.id)}
              >
                <span className="nav-dot"></span>
                <span>{it.label}</span>
                {it.count != null && <span className="nav-count">{it.count}</span>}
              </button>
            ))}
          </React.Fragment>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div><strong>Despacho · Agenda Territorial</strong></div>
        <div>Ministerio de las Culturas, las Artes y los Saberes</div>
        <div className="acento" style={{ marginTop: 8, fontFamily: 'var(--acento)', fontSize: 18 }}>
          seguimos tejiendo
        </div>
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="img/puente-logo-blanco.svg" alt="PUENTE" className="puente-logo-sm" />
        </div>
      </div>
    </aside>
  );
}

function Topbar({ titulo, subtitulo, hoy }) {
  const d = parseISO(hoy);
  const fechaTxt = `${DIAS_LARGO[d.getDay()]} ${d.getDate()} de ${MESES_LARGO[d.getMonth()]} de ${d.getFullYear()}`;
  return (
    <div className="topbar">
      <div className="topbar-left">
        <h1>{titulo}</h1>
        {subtitulo && <p>{subtitulo}</p>}
      </div>
      <div className="topbar-right">
        <span className="today-pill">
          <span className="dot"></span>
          Hoy · {fechaTxt}
        </span>
      </div>
    </div>
  );
}

window.Sidebar = Sidebar;
window.Topbar = Topbar;
