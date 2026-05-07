/* Vista Documentos + Bitácora */

function Documentos() {
  const { DOCUMENTOS } = window.AGENDA;
  const [sel, setSel] = useState(null);

  return (
    <div className="col gap-lg">
      <div>
        <div className="eyebrow">Materiales del equipo</div>
        <h2 className="section-title" style={{ fontSize: 26 }}>Documentos clave</h2>
        <p className="section-sub violeta">la memoria viva del Convenio</p>
      </div>

      <div className="grid-2">
        {DOCUMENTOS.map(d => (
          <div key={d.id} className="card doc-card" onClick={() => setSel(d)}>
            <div className="doc-thumb">
              <div className="doc-thumb-band" style={{ background: d.color }}></div>
            </div>
            <div style={{ flex: 1 }}>
              <span className="chip" style={{ background: d.color, color: '#fff', marginBottom: 8 }}>
                {d.tipo}
              </span>
              <h3 style={{ fontFamily: 'var(--display)', fontSize: 17, fontWeight: 600, margin: '6px 0 2px', lineHeight: 1.3 }}>
                {d.titulo}
              </h3>
              <p style={{ fontFamily: 'var(--acento)', fontSize: 18, color: d.color, margin: '0 0 8px', lineHeight: 1 }}>
                {d.subtitulo}
              </p>
              <p style={{ fontSize: 12.5, color: 'var(--tinta-3)', margin: 0 }}>
                {d.autor} · {d.fecha} {d.paginas ? `· ${d.paginas} pp.` : ''}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="card card-tinted-verde">
        <div className="eyebrow">Próximamente · sitios conectados</div>
        <h3 style={{ fontFamily: 'var(--display)', fontSize: 18, fontWeight: 600, margin: '4px 0 8px' }}>
          Ecosistema de cifras, redes y organizaciones
        </h3>
        <p style={{ fontSize: 13.5, color: 'var(--tinta-2)', margin: 0, lineHeight: 1.55 }}>
          Felipe va a conectar los sitios ya montados con: directorios de organizaciones, cifras de inversión y participantes beneficiarios, y el cronograma inicial de la Formación Puente. Esta sección crece desde aquí.
        </p>
      </div>

      {sel && <DocumentoModal doc={sel} onClose={() => setSel(null)} />}
    </div>
  );
}

function DocumentoModal({ doc, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 22 }}>
          <div style={{ width: 88, height: 110, borderRadius: 8, background: 'var(--blanco)', border: '1px solid var(--lino)', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
            <div style={{ position: 'absolute', top: 12, left: 0, right: 0, height: 18, background: doc.color }}></div>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(transparent 0 8px, rgba(29,15,46,0.08) 8px 9px)' }}></div>
          </div>
          <div style={{ flex: 1 }}>
            <span className="chip" style={{ background: doc.color, color: '#fff', marginBottom: 6 }}>{doc.tipo}</span>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: 24, fontWeight: 600, margin: '6px 0 4px', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
              {doc.titulo}
            </h2>
            <p style={{ fontFamily: 'var(--acento)', fontSize: 22, color: doc.color, margin: '0 0 8px', lineHeight: 1 }}>{doc.subtitulo}</p>
            <p className="muted" style={{ fontSize: 13, margin: 0 }}>
              {doc.autor} · {doc.fecha}{doc.paginas ? ` · ${doc.paginas} páginas` : ''}
            </p>
          </div>
        </div>

        <h3 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--tinta-3)', fontWeight: 600, margin: '0 0 8px' }}>Resumen</h3>
        <p style={{ fontSize: 14.5, color: 'var(--tinta-2)', lineHeight: 1.6, margin: '0 0 22px' }}>
          {doc.resumen}
        </p>

        <h3 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--tinta-3)', fontWeight: 600, margin: '0 0 10px' }}>Contenido</h3>
        <ul className="bullet-list">
          {doc.secciones.map((s, i) => <li key={i}>{s}</li>)}
        </ul>

        <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid var(--lino)', display: 'flex', gap: 10 }}>
          {doc.enlace && doc.enlace !== '#' && (
            <a className="btn btn-primary" href={doc.enlace} target="_blank" rel="noopener">
              Abrir documento original ↗
            </a>
          )}
          <button className="btn btn-ghost" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

function Bitacora() {
  const { BITACORA, TEAM } = window.AGENDA;
  const [tipo, setTipo] = useState('todo');
  const filtered = BITACORA.filter(b => tipo === 'todo' || b.tipo === tipo);

  return (
    <div className="col gap-lg">
      <div>
        <div className="eyebrow">Bitácora</div>
        <h2 className="section-title" style={{ fontSize: 26 }}>Lo que pasa en el equipo</h2>
        <p className="section-sub">novedades cuando surjan, síntesis cada lunes</p>
      </div>

      <div className="tabs">
        <button className={tipo === 'todo' ? 'active' : ''} onClick={() => setTipo('todo')}>Todo</button>
        <button className={tipo === 'novedad' ? 'active' : ''} onClick={() => setTipo('novedad')}>Novedades</button>
        <button className={tipo === 'sintesis' ? 'active' : ''} onClick={() => setTipo('sintesis')}>Síntesis semanal</button>
      </div>

      <div className="card">
        {filtered.map((b, i) => <BitacoraRow key={i} entry={b} />)}
      </div>

      <div className="card card-tinted-azul">
        <div className="eyebrow">Contingencias</div>
        <h3 style={{ fontFamily: 'var(--display)', fontSize: 17, fontWeight: 600, margin: '4px 0 8px' }}>
          Hilo del WhatsApp del equipo
        </h3>
        <p style={{ fontSize: 13.5, color: 'var(--tinta-2)', margin: '0 0 12px', lineHeight: 1.55 }}>
          Las contingencias siguen pasando por el WhatsApp del equipo. Acá las consolidamos como novedad cuando alguna requiera registro o decisión.
        </p>
        <div className="row gap-sm">
          {TEAM.map(p => <Avatar key={p.id} id={p.id} size="sm" />)}
        </div>
      </div>
    </div>
  );
}

window.Documentos = Documentos;
window.Bitacora = Bitacora;
