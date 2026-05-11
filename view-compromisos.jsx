/* Vista interna: Compromisos recibidos — Dashboard + Matriz */

function Compromisos() {
  // ============================================================
  // CONFIGURACIÓN — pega aquí las URLs de tu Google Apps Script y Sheet
  // ============================================================
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwaPWfTzIcOoV-OdDtGJb9dQk66AjvN65fzh9JEW5fbEUeV3gBqL5-DmBxb04GzAbun/exec';
  const SHEET_URL  = 'https://docs.google.com/spreadsheets/d/1bD1UR2Hq34XsPrICc4ZU-KMrjfztDcsvi4XJ1ltaY_s/edit?usp=sharing';
  // URL de exportación CSV (sin CORS issues — requiere que el Sheet sea público)
  const CSV_URL    = 'https://docs.google.com/spreadsheets/d/1bD1UR2Hq34XsPrICc4ZU-KMrjfztDcsvi4XJ1ltaY_s/export?format=csv&sheet=Compromisos';
  // ============================================================

  const [datos, setDatos] = React.useState([]);
  const [cargando, setCargando] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [filtroRed, setFiltroRed] = React.useState('Todas');
  const [filtroCarril, setFiltroCarril] = React.useState('Todos');
  const [modalDato, setModalDato] = React.useState(null);

  // Cargar datos desde Google Sheets CSV (evita problemas CORS con Apps Script)
  function parseCSV(text) {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    return lines.slice(1).filter(l => l.trim()).map(line => {
      // Manejar campos con comas dentro de comillas
      const values = [];
      let cur = '', inQ = false;
      for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (c === '"') { inQ = !inQ; }
        else if (c === ',' && !inQ) { values.push(cur.trim()); cur = ''; }
        else { cur += c; }
      }
      values.push(cur.trim());
      const obj = {};
      headers.forEach((h, i) => { obj[h] = (values[i] || '').replace(/^"|"$/g, ''); });
      return obj;
    });
  }

  React.useEffect(() => {
    fetch(CSV_URL)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then(text => {
        const parsed = parseCSV(text);
        // Filtrar fila de encabezados si viene duplicada
        const datos = parsed.filter(d => d['Organización'] && d['Organización'] !== 'Organización');
        setDatos(datos);
      })
      .catch(err => {
        console.warn('CSV fetch error:', err);
        setError('No se pudo conectar con el Google Sheet. Verifica que el Sheet esté compartido públicamente (cualquiera con el link puede ver).');
      })
      .finally(() => setCargando(false));
  }, []);

  // Datos de demo (mientras no está configurado Apps Script)
  const DEMO_DATA = [
    { 'Timestamp': '2026-05-11T10:00:00', 'Organización': 'Colectivo Manigua', 'Red': 'Red Intercultural Juvenil (RIJ)', 'Municipio': 'Santa Marta, Magdalena', 'Representante': 'Ana Torres', 'Correo': 'ana@manigua.org', 'Celular': '+57 300 111 2222', 'Asistentes': 'Ana Torres, Luis Díaz', 'Carril': 'C1 · Saberes Financieros y Vínculos', 'Compromiso firmado': 'SÍ', 'Expectativa': 'Aprender a gestionar mejor los recursos de la organización.', 'Lugar y fecha firma': 'Santa Marta, 11 de mayo de 2026' },
    { 'Timestamp': '2026-05-11T11:30:00', 'Organización': 'Mujeres Tejedoras', 'Red': 'Red de Mujeres Sabedoras, Creadoras y Gestoras', 'Municipio': 'Ciénaga, Magdalena', 'Representante': 'Clara Rincón', 'Correo': 'clara@tejedoras.co', 'Celular': '+57 310 222 3333', 'Asistentes': 'Clara Rincón', 'Carril': 'C2 · Autonomía Digital', 'Compromiso firmado': 'SÍ', 'Expectativa': 'Mejorar nuestra presencia digital y comunicar mejor nuestra labor.', 'Lugar y fecha firma': 'Ciénaga, 11 de mayo de 2026' },
  ];

  const noConfigurado = !SCRIPT_URL;

  // Filtros disponibles
  const redes = ['Todas', ...new Set(datos.map(d => d['Red']).filter(Boolean))];
  const carriles = ['Todos', ...new Set(datos.map(d => d['Carril']).filter(Boolean))];

  const filtrados = datos.filter(d => {
    const okRed = filtroRed === 'Todas' || d['Red'] === filtroRed;
    const okCarril = filtroCarril === 'Todos' || d['Carril'] === filtroCarril;
    return okRed && okCarril;
  });

  // Conteos para dashboard
  const porRed = {};
  const porCarril = {};
  const municipios = new Set();
  datos.forEach(d => {
    const r = d['Red'] || 'Sin red'; porRed[r] = (porRed[r] || 0) + 1;
    const c = d['Carril'] || 'Sin carril'; porCarril[c] = (porCarril[c] || 0) + 1;
    if (d['Municipio']) municipios.add(d['Municipio']);
  });

  // Exportar CSV
  function exportarCSV() {
    const cols = ['Timestamp', 'Organización', 'Red', 'Municipio', 'Representante', 'Correo', 'Celular', 'Asistentes', 'Carril', 'Compromiso firmado', 'Expectativa', 'Lugar y fecha firma'];
    const filas = [cols.join(','), ...filtrados.map(d => cols.map(c => `"${(d[c] || '').toString().replace(/"/g, '""')}"`).join(','))];
    const blob = new Blob([filas.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `compromisos-ciclo-puente-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  const RED_COLORS = {
    'Red Intercultural Juvenil (RIJ)': { bg: '#EFE8F7', color: '#5A3680' },
    'Red de Mujeres Sabedoras, Creadoras y Gestoras': { bg: '#F4E1ED', color: '#A8438A' },
    'Otra': { bg: '#E1F0E8', color: '#528E71' },
  };
  const CARRIL_COLORS = {
    'C1 · Saberes Financieros y Vínculos': { bg: '#FBF1C7', color: '#6E5B0D' },
    'C2 · Autonomía Digital': { bg: '#E2E7F4', color: '#3D50A8' },
    'Ambos carriles': { bg: '#F4E1ED', color: '#A8438A' },
  };

  function chipRed(red) {
    const c = RED_COLORS[red] || { bg: 'var(--hueso)', color: 'var(--tinta-2)' };
    return { background: c.bg, color: c.color };
  }
  function chipCarril(car) {
    const c = CARRIL_COLORS[car] || { bg: 'var(--hueso)', color: 'var(--tinta-2)' };
    return { background: c.bg, color: c.color };
  }
  function fmtTs(ts) {
    if (!ts) return '—';
    try { return new Date(ts).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }); }
    catch { return ts; }
  }

  return (
    <div className="col gap-lg">

      {/* Encabezado */}
      <div>
        <div className="eyebrow">Ciclo de Formación Puente</div>
        <h2 className="section-title" style={{ fontSize: 28 }}>Compromisos recibidos</h2>
        <p className="section-sub violeta">quiénes se sumaron al proceso</p>
      </div>

      {/* Banner de config pendiente */}
      {noConfigurado && (
        <div className="card" style={{ background: 'var(--amarillo)', border: 'none', borderLeft: '6px solid var(--naranja)' }}>
          <div className="eyebrow" style={{ color: 'var(--tinta)' }}>Configuración pendiente</div>
          <p style={{ fontSize: 14, margin: '4px 0 0', lineHeight: 1.6 }}>
            Aún no está conectado a Google Sheets. Abre <code>view-compromisos.jsx</code> y pega la URL de tu Apps Script en <code>SCRIPT_URL</code>.
            Mientras tanto, se muestran datos de demo.
          </p>
        </div>
      )}

      {/* Dashboard de conteos */}
      <div className="grid-3">
        <div className="card" style={{ textAlign: 'center' }}>
          <div className="eyebrow">Total compromisos</div>
          <div style={{ fontFamily: 'var(--display)', fontSize: 52, fontWeight: 700, color: 'var(--violeta)', lineHeight: 1, margin: '8px 0 4px' }}>{datos.length}</div>
          <div style={{ fontFamily: 'var(--acento)', fontSize: 18, color: 'var(--tinta-3)' }}>organizaciones</div>
        </div>
        <div className="card">
          <div className="eyebrow" style={{ marginBottom: 10 }}>Por red</div>
          <div className="col gap-sm">
            {Object.entries(porRed).map(([r, n]) => (
              <div key={r} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="chip" style={chipRed(r)}>{r.length > 28 ? r.slice(0, 28) + '…' : r}</span>
                <span style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 18, color: 'var(--tinta)' }}>{n}</span>
              </div>
            ))}
            {!datos.length && <span className="muted" style={{ fontSize: 13 }}>Sin datos aún</span>}
          </div>
        </div>
        <div className="card">
          <div className="eyebrow" style={{ marginBottom: 10 }}>Por carril</div>
          <div className="col gap-sm">
            {Object.entries(porCarril).map(([c, n]) => (
              <div key={c} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="chip" style={chipCarril(c)}>{c.length > 22 ? c.slice(0, 22) + '…' : c}</span>
                <span style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 18, color: 'var(--tinta)' }}>{n}</span>
              </div>
            ))}
            {!datos.length && <span className="muted" style={{ fontSize: 13 }}>Sin datos aún</span>}
          </div>
        </div>
      </div>

      {/* Municipios */}
      {municipios.size > 0 && (
        <div className="card">
          <div className="eyebrow" style={{ marginBottom: 10 }}>Municipios representados · {municipios.size}</div>
          <div className="row" style={{ flexWrap: 'wrap', gap: 8 }}>
            {[...municipios].map(m => (
              <span key={m} className="chip chip-violeta">{m}</span>
            ))}
          </div>
        </div>
      )}

      {/* Matriz / Tabla */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--hueso)', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <div className="eyebrow">Matriz de compromisos</div>
            <div style={{ fontFamily: 'var(--display)', fontWeight: 600, fontSize: 17 }}>{filtrados.length} de {datos.length} registros</div>
          </div>

          {/* Filtro red */}
          <select value={filtroRed} onChange={e => setFiltroRed(e.target.value)}
            style={{ padding: '7px 12px', borderRadius: 8, border: '1.5px solid var(--lino)', background: 'var(--papel)', fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--tinta)', cursor: 'pointer' }}>
            {redes.map(r => <option key={r}>{r}</option>)}
          </select>

          {/* Filtro carril */}
          <select value={filtroCarril} onChange={e => setFiltroCarril(e.target.value)}
            style={{ padding: '7px 12px', borderRadius: 8, border: '1.5px solid var(--lino)', background: 'var(--papel)', fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--tinta)', cursor: 'pointer' }}>
            {carriles.map(c => <option key={c}>{c}</option>)}
          </select>

          {/* Botón Google Sheets */}
          {SHEET_URL && (
            <a href={SHEET_URL} target="_blank" rel="noopener" className="btn btn-ghost" style={{ fontSize: 13, textDecoration: 'none' }}>
              📊 Abrir en Sheets
            </a>
          )}

          {/* Exportar CSV */}
          <button className="btn btn-primary" style={{ fontSize: 13 }} onClick={exportarCSV} disabled={!filtrados.length}>
            ⬇ Exportar CSV
          </button>
        </div>

        {/* Estado cargando / error */}
        {cargando && (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--tinta-3)' }}>
            <div style={{ fontFamily: 'var(--acento)', fontSize: 22 }}>Cargando compromisos…</div>
          </div>
        )}
        {error && (
          <div style={{ padding: 24, background: '#FDE8E8', color: '#8B1A1A', fontSize: 13, borderTop: '1px solid #E57373' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Tabla */}
        {!cargando && !error && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--papel)', borderBottom: '2px solid var(--lino)' }}>
                  {['Organización', 'Red', 'Municipio', 'Representante', 'Carril', 'Firmó', 'Fecha'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontFamily: 'var(--display)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--tinta-3)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrados.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ padding: '28px 14px', textAlign: 'center', color: 'var(--tinta-3)', fontFamily: 'var(--acento)', fontSize: 18 }}>
                      Aún no hay compromisos registrados
                    </td>
                  </tr>
                )}
                {filtrados.map((d, i) => (
                  <tr key={i} onClick={() => setModalDato(d)}
                    style={{ borderBottom: '1px solid var(--hueso)', cursor: 'pointer', transition: 'background .12s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(90,54,128,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--tinta)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d['Organización'] || '—'}</td>
                    <td style={{ padding: '12px 14px' }}><span className="chip" style={{ ...chipRed(d['Red']), fontSize: 11, whiteSpace: 'nowrap' }}>{(d['Red'] || '—').replace('Red Intercultural Juvenil (RIJ)', 'RIJ').replace('Red de Mujeres Sabedoras, Creadoras y Gestoras', 'R. Mujeres')}</span></td>
                    <td style={{ padding: '12px 14px', color: 'var(--tinta-2)', whiteSpace: 'nowrap' }}>{d['Municipio'] || '—'}</td>
                    <td style={{ padding: '12px 14px', color: 'var(--tinta-2)' }}>{d['Representante'] || '—'}</td>
                    <td style={{ padding: '12px 14px' }}><span className="chip" style={{ ...chipCarril(d['Carril']), fontSize: 11, whiteSpace: 'nowrap' }}>{(d['Carril'] || '—').replace(' · Saberes Financieros y Vínculos', '').replace(' · Autonomía Digital', '')}</span></td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      {d['Compromiso firmado'] === 'SÍ'
                        ? <span style={{ color: '#2C5A47', fontWeight: 700 }}>✓</span>
                        : <span style={{ color: '#8B1A1A' }}>✗</span>}
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--tinta-3)', whiteSpace: 'nowrap' }}>{fmtTs(d['Timestamp'])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Link al formulario */}
      <div className="card" style={{ background: 'var(--violeta)', color: 'var(--crema)', border: 'none' }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <div className="eyebrow" style={{ color: 'var(--amarillo)' }}>URL pública del formulario</div>
            <div style={{ fontFamily: 'var(--display)', fontWeight: 600, fontSize: 16, marginTop: 4 }}>
              Comparte solo este enlace con las organizaciones
            </div>
            <code style={{ fontSize: 12, color: 'rgba(247,241,230,0.7)', marginTop: 6, display: 'block' }}>
              {window.location.origin}{window.location.pathname.replace('index.html', '') || '/'}compromiso.html
            </code>
          </div>
          <a href="compromiso.html" target="_blank" className="btn" style={{ background: 'var(--amarillo)', color: 'var(--tinta)', textDecoration: 'none', flexShrink: 0 }}>
            Ver formulario →
          </a>
        </div>
      </div>

      {/* Modal detalle */}
      {modalDato && (
        <div className="modal-overlay" onClick={() => setModalDato(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 580 }}>
            <button className="modal-close" onClick={() => setModalDato(null)}>×</button>
            <div className="eyebrow">Compromiso · detalle completo</div>
            <h3 style={{ fontFamily: 'var(--display)', fontSize: 22, fontWeight: 700, margin: '6px 0 18px', color: 'var(--violeta)' }}>{modalDato['Organización']}</h3>
            <div className="col gap-md">
              {[
                ['Red', modalDato['Red']],
                ['Municipio', modalDato['Municipio']],
                ['Representante', modalDato['Representante']],
                ['Correo', modalDato['Correo']],
                ['Celular', modalDato['Celular']],
                ['Asistentes', modalDato['Asistentes']],
                ['Carril', modalDato['Carril']],
                ['Compromiso firmado', modalDato['Compromiso firmado']],
                ['Expectativa', modalDato['Expectativa']],
                ['Lugar y fecha firma', modalDato['Lugar y fecha firma']],
                ['Fecha de envío', fmtTs(modalDato['Timestamp'])],
              ].map(([label, val]) => val ? (
                <div key={label} style={{ display: 'flex', gap: 14, borderBottom: '1px solid var(--hueso)', paddingBottom: 10 }}>
                  <div style={{ width: 140, flexShrink: 0, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--tinta-3)', fontWeight: 600, paddingTop: 2 }}>{label}</div>
                  <div style={{ fontSize: 14, color: 'var(--tinta)', lineHeight: 1.5 }}>{val}</div>
                </div>
              ) : null)}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

window.Compromisos = Compromisos;
