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

/* ── Editor de entrada de Bitácora ── */
function BitacoraEditor({ onGuardar, onCancelar }) {
  const { TEAM } = window.AGENDA;
  const hoy = new Date();
  const fechaHoy = `${hoy.getFullYear()}-${String(hoy.getMonth()+1).padStart(2,'0')}-${String(hoy.getDate()).padStart(2,'0')}`;

  const [form, setForm] = useState({
    tipo: 'novedad',
    autor: 'felipe',
    titulo: '',
    cuerpo: '',
    fecha: fechaHoy,
  });
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const valido = form.titulo.trim().length > 0 && form.cuerpo.trim().length > 0;

  const guardar = async () => {
    if (!valido) return;
    setGuardando(true);
    setError('');
    try {
      await onGuardar({ ...form, titulo: form.titulo.trim(), cuerpo: form.cuerpo.trim() });
    } catch (e) {
      setError(e.message || 'Error al guardar');
      setGuardando(false);
    }
  };

  const tiposBtn = [
    { id: 'novedad',  label: 'Novedad',        color: '#E8C535', bg: 'rgba(232,197,53,0.15)'  },
    { id: 'sintesis', label: 'Síntesis',        color: '#5A3680', bg: 'rgba(90,54,128,0.12)'   },
  ];

  return (
    <div className="card" style={{ border: '2px solid var(--violeta)', background: 'var(--crema)' }}>
      <div className="eyebrow" style={{ color: 'var(--violeta)', marginBottom: 14 }}>Nueva entrada · Bitácora</div>

      {/* Tipo */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--tinta-3)', marginBottom: 8 }}>Tipo</div>
        <div className="row gap-sm">
          {tiposBtn.map(t => (
            <button key={t.id} onClick={() => update('tipo', t.id)}
              style={{
                padding: '6px 16px', borderRadius: 20, fontWeight: 600, fontSize: 13,
                border: `2px solid ${form.tipo === t.id ? t.color : 'transparent'}`,
                background: form.tipo === t.id ? t.bg : 'var(--hueso)',
                color: form.tipo === t.id ? t.color : 'var(--tinta-2)',
                cursor: 'pointer', transition: 'all 0.15s',
              }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Autor */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--tinta-3)', marginBottom: 8 }}>Quién escribe</div>
        <div className="row gap-sm" style={{ flexWrap: 'wrap' }}>
          {TEAM.map(p => {
            const sel = form.autor === p.id;
            return (
              <button key={p.id} onClick={() => update('autor', p.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '5px 12px 5px 6px', borderRadius: 20,
                  border: `2px solid ${sel ? p.color : 'transparent'}`,
                  background: sel ? `${p.color}18` : 'var(--hueso)',
                  cursor: 'pointer', fontSize: 13, fontWeight: sel ? 600 : 400,
                  color: sel ? p.color : 'var(--tinta-2)', transition: 'all 0.15s',
                }}>
                <Avatar id={p.id} size="sm" />
                {p.corto}
              </button>
            );
          })}
        </div>
      </div>

      {/* Título */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--tinta-3)', marginBottom: 6 }}>Título</div>
        <input
          className="ed-input"
          type="text"
          placeholder="Ej: Reunión de equipo · acuerdos del lunes"
          value={form.titulo}
          onChange={e => update('titulo', e.target.value)}
          style={{ fontSize: 15, fontWeight: 500 }}
        />
      </div>

      {/* Cuerpo */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--tinta-3)', marginBottom: 6 }}>Descripción</div>
        <textarea
          className="ed-input"
          placeholder="¿Qué pasó? ¿Qué quedó acordado? ¿Qué hay que tener en cuenta?"
          value={form.cuerpo}
          onChange={e => update('cuerpo', e.target.value)}
          rows={5}
          style={{ resize: 'vertical', fontSize: 14, lineHeight: 1.6, fontFamily: 'inherit' }}
        />
      </div>

      {error && (
        <div style={{ marginBottom: 12, padding: '8px 12px', background: '#FBE6E0', border: '1px solid #E0A795', borderRadius: 8, fontSize: 13, color: '#7A2A14' }}>
          {error}
        </div>
      )}

      <div className="row gap-sm" style={{ justifyContent: 'flex-end' }}>
        <button className="btn-fantasma" onClick={onCancelar} disabled={guardando}>Cancelar</button>
        <button
          className="btn-solido"
          onClick={guardar}
          disabled={!valido || guardando}
          style={{ background: 'var(--violeta)', opacity: (!valido || guardando) ? 0.5 : 1 }}
        >
          {guardando ? 'Guardando en GitHub…' : '↑ Publicar entrada'}
        </button>
      </div>
    </div>
  );
}

/* ── Componente principal Bitácora ── */
function Bitacora({ agenda, onUpdateAgenda }) {
  const { TEAM } = window.AGENDA;

  // Leer desde agenda.bitacora (data.json GitHub) con fallback a data.js
  const entradas = (agenda?.bitacora || window.AGENDA.BITACORA || [])
    .slice()
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  const [tipo, setTipo] = useState('todo');
  const [editorAbierto, setEditorAbierto] = useState(false);
  const filtered = entradas.filter(b => tipo === 'todo' || b.tipo === tipo);

  const ghConfigurado = window.GitHubSync?.estaConfigurado?.() || false;

  const onGuardar = async (entrada) => {
    const nuevasBitacora = [entrada, ...(agenda?.bitacora || [])];
    const next = { ...agenda, bitacora: nuevasBitacora };
    await onUpdateAgenda(next);
    setEditorAbierto(false);
  };

  return (
    <div className="col gap-lg">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="eyebrow">Bitácora</div>
          <h2 className="section-title" style={{ fontSize: 26 }}>Lo que pasa en el equipo</h2>
          <p className="section-sub">novedades cuando surjan, síntesis cada lunes</p>
        </div>
        {!editorAbierto && (
          <button
            className="btn-solido"
            onClick={() => setEditorAbierto(true)}
            style={{ background: 'var(--violeta)', alignSelf: 'flex-start' }}
            title={ghConfigurado ? 'Publicar nueva entrada' : 'Configura GitHub primero para guardar entradas'}
          >
            + Nueva entrada
          </button>
        )}
      </div>

      {editorAbierto && (
        <BitacoraEditor
          onGuardar={onGuardar}
          onCancelar={() => setEditorAbierto(false)}
        />
      )}

      {!ghConfigurado && !editorAbierto && (
        <div style={{ padding: '10px 14px', background: 'rgba(232,197,53,0.15)', border: '1px solid rgba(232,197,53,0.4)', borderRadius: 10, fontSize: 13, color: 'var(--tinta-2)' }}>
          ℹ️ Para publicar entradas, configura GitHub en el botón de la barra superior.
        </div>
      )}

      <div className="tabs">
        <button className={tipo === 'todo' ? 'active' : ''} onClick={() => setTipo('todo')}>
          Todo <span style={{ opacity: 0.6, fontSize: 12 }}>· {entradas.length}</span>
        </button>
        <button className={tipo === 'novedad' ? 'active' : ''} onClick={() => setTipo('novedad')}>Novedades</button>
        <button className={tipo === 'sintesis' ? 'active' : ''} onClick={() => setTipo('sintesis')}>Síntesis semanal</button>
      </div>

      <div className="card">
        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--tinta-3)', padding: '20px 0', fontFamily: 'var(--acento)', fontSize: 18 }}>
            sin entradas aún
          </p>
        )}
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
