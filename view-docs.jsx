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
function BitacoraEditor({ onGuardar, onCancelar, initialValues, modoEdicion }) {
  const { TEAM } = window.AGENDA;
  const hoy = new Date();
  const fechaHoy = `${hoy.getFullYear()}-${String(hoy.getMonth()+1).padStart(2,'0')}-${String(hoy.getDate()).padStart(2,'0')}`;

  const [form, setForm] = useState({
    tipo:       initialValues?.tipo       || 'novedad',
    autor:      initialValues?.autor      || 'felipe',
    asistentes: initialValues?.asistentes || [],
    titulo:     initialValues?.titulo     || '',
    cuerpo:     initialValues?.cuerpo     || '',
    enlaceUrl:  initialValues?.enlaceUrl  || '',
    enlaceLabel:initialValues?.enlaceLabel|| '',
    fecha:      initialValues?.fecha      || fechaHoy,
  });
  const [guardando, setGuardando] = useState(false);
  const [error, setError]         = useState('');

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const toggleAsistente = (id) => {
    setForm(p => ({
      ...p,
      asistentes: p.asistentes.includes(id)
        ? p.asistentes.filter(a => a !== id)
        : [...p.asistentes, id],
    }));
  };

  const valido = form.titulo.trim().length > 0 && form.cuerpo.trim().length > 0;

  const guardar = async () => {
    if (!valido) return;
    setGuardando(true);
    setError('');
    try {
      const entry = {
        ...form,
        titulo:      form.titulo.trim(),
        cuerpo:      form.cuerpo.trim(),
        enlaceUrl:   form.enlaceUrl.trim(),
        enlaceLabel: form.enlaceLabel.trim(),
      };
      // Limpiar campos vacíos opcionales
      if (!entry.enlaceUrl)   { delete entry.enlaceUrl;   delete entry.enlaceLabel; }
      if (!entry.enlaceLabel) delete entry.enlaceLabel;
      if (!entry.asistentes?.length) delete entry.asistentes;
      await onGuardar(entry);
    } catch (e) {
      setError(e.message || 'Error al guardar');
      setGuardando(false);
    }
  };

  const tiposBtn = [
    { id: 'novedad',  label: 'Novedad',   color: '#E8C535', bg: 'rgba(232,197,53,0.15)' },
    { id: 'sintesis', label: 'Síntesis',  color: '#5A3680', bg: 'rgba(90,54,128,0.12)'  },
  ];

  const labelStyle = { fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--tinta-3)', marginBottom: 7 };

  return (
    <div className="card" style={{ border: '2px solid var(--violeta)', background: 'var(--crema)' }}>
      <div className="eyebrow" style={{ color: 'var(--violeta)', marginBottom: 16 }}>
        {modoEdicion ? '✏️ Editar entrada · Bitácora' : 'Nueva entrada · Bitácora'}
      </div>

      {/* Tipo */}
      <div style={{ marginBottom: 16 }}>
        <div style={labelStyle}>Tipo</div>
        <div className="row gap-sm">
          {tiposBtn.map(t => (
            <button key={t.id} onClick={() => update('tipo', t.id)} style={{
              padding: '6px 16px', borderRadius: 20, fontWeight: 600, fontSize: 13,
              border: `2px solid ${form.tipo === t.id ? t.color : 'transparent'}`,
              background: form.tipo === t.id ? t.bg : 'var(--hueso)',
              color: form.tipo === t.id ? t.color : 'var(--tinta-2)',
              cursor: 'pointer', transition: 'all 0.15s',
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* Autor — selección única */}
      <div style={{ marginBottom: 16 }}>
        <div style={labelStyle}>Quién escribe</div>
        <div className="row gap-sm" style={{ flexWrap: 'wrap' }}>
          {TEAM.map(p => {
            const sel = form.autor === p.id;
            return (
              <button key={p.id} onClick={() => update('autor', p.id)} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '5px 12px 5px 6px', borderRadius: 20,
                border: `2px solid ${sel ? p.color : 'transparent'}`,
                background: sel ? `${p.color}18` : 'var(--hueso)',
                cursor: 'pointer', fontSize: 13, fontWeight: sel ? 600 : 400,
                color: sel ? p.color : 'var(--tinta-2)', transition: 'all 0.15s',
              }}>
                <Avatar id={p.id} size="sm" />{p.corto}
              </button>
            );
          })}
        </div>
      </div>

      {/* Asistentes — selección múltiple */}
      <div style={{ marginBottom: 16 }}>
        <div style={labelStyle}>Asistentes / participantes <span style={{ fontWeight: 400, textTransform: 'none', fontSize: 11, color: 'var(--tinta-3)' }}>(opcional · múltiple)</span></div>
        <div className="row gap-sm" style={{ flexWrap: 'wrap' }}>
          {TEAM.map(p => {
            const sel = (form.asistentes || []).includes(p.id);
            return (
              <button key={p.id} onClick={() => toggleAsistente(p.id)} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '5px 12px 5px 6px', borderRadius: 20,
                border: `2px solid ${sel ? p.color : 'transparent'}`,
                background: sel ? `${p.color}18` : 'var(--hueso)',
                cursor: 'pointer', fontSize: 13, fontWeight: sel ? 600 : 400,
                color: sel ? p.color : 'var(--tinta-2)', transition: 'all 0.15s',
              }}>
                <Avatar id={p.id} size="sm" />{p.corto}
                {sel && <span style={{ marginLeft: 2, fontSize: 11 }}>✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Título */}
      <div style={{ marginBottom: 12 }}>
        <div style={labelStyle}>Título</div>
        <input className="ed-input" type="text"
          placeholder="Ej: Reunión de equipo · acuerdos del lunes"
          value={form.titulo} onChange={e => update('titulo', e.target.value)}
          style={{ fontSize: 15, fontWeight: 500 }} />
      </div>

      {/* Cuerpo */}
      <div style={{ marginBottom: 16 }}>
        <div style={labelStyle}>Descripción</div>
        <textarea className="ed-input"
          placeholder="¿Qué pasó? ¿Qué quedó acordado? ¿Qué hay que tener en cuenta?"
          value={form.cuerpo} onChange={e => update('cuerpo', e.target.value)}
          rows={5} style={{ resize: 'vertical', fontSize: 14, lineHeight: 1.6, fontFamily: 'inherit' }} />
      </div>

      {/* Enlace / adjunto */}
      <div style={{ marginBottom: 16, padding: '14px 16px', background: 'var(--hueso)', borderRadius: 10 }}>
        <div style={{ ...labelStyle, marginBottom: 10 }}>Adjunto / enlace externo <span style={{ fontWeight: 400, textTransform: 'none', fontSize: 11 }}>(opcional · Google Drive, acta, imagen…)</span></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input className="ed-input" type="url"
            placeholder="https://drive.google.com/… o cualquier URL"
            value={form.enlaceUrl} onChange={e => update('enlaceUrl', e.target.value)}
            style={{ fontSize: 13 }} />
          {form.enlaceUrl && (
            <input className="ed-input" type="text"
              placeholder="Nombre del documento (ej: Acta reunión 8 mayo)"
              value={form.enlaceLabel} onChange={e => update('enlaceLabel', e.target.value)}
              style={{ fontSize: 13 }} />
          )}
        </div>
      </div>

      {error && (
        <div style={{ marginBottom: 12, padding: '8px 12px', background: '#FBE6E0', border: '1px solid #E0A795', borderRadius: 8, fontSize: 13, color: '#7A2A14' }}>
          {error}
        </div>
      )}

      <div className="row gap-sm" style={{ justifyContent: 'flex-end' }}>
        <button className="btn-fantasma" onClick={onCancelar} disabled={guardando}>Cancelar</button>
        <button className="btn-solido" onClick={guardar}
          disabled={!valido || guardando}
          style={{ background: 'var(--violeta)', opacity: (!valido || guardando) ? 0.5 : 1 }}>
          {guardando ? 'Guardando en GitHub…' : (modoEdicion ? '✓ Guardar cambios' : '↑ Publicar entrada')}
        </button>
      </div>
    </div>
  );
}

/* ── Fila de entrada en la Bitácora ── */
function BitacoraRow({ entry, onEditar, onBorrar }) {
  const m = getMember(entry.autor);
  const tipoColor = entry.tipo === 'novedad' ? 'amarillo' : 'violeta';
  const [expandido, setExpandido] = useState(false);

  const confirmarBorrado = () => {
    if (window.confirm(`¿Eliminar la entrada "${entry.titulo}"?\n\nEsta acción se guarda en GitHub y no se puede deshacer desde la página.`)) {
      onBorrar();
    }
  };

  return (
    <div style={{ padding: '16px 0', borderBottom: '1px solid var(--hueso)' }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <div style={{ flexShrink: 0 }}>
          <Avatar id={entry.autor} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Cabecera */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', flexWrap: 'wrap', marginBottom: 4 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>{m?.corto || entry.autor}</span>
            <span className={`chip chip-${tipoColor}`}>
              {entry.tipo === 'novedad' ? 'Novedad' : 'Síntesis'}
            </span>
            <span className="muted" style={{ fontSize: 12 }}>{formatFecha(entry.fecha)}</span>
          </div>

          {/* Título */}
          <h4 style={{ fontSize: 15, fontWeight: 600, margin: '2px 0 6px', lineHeight: 1.35 }}>{entry.titulo}</h4>

          {/* Cuerpo — expandible si es largo */}
          <div style={{ fontSize: 13.5, color: 'var(--tinta-2)', lineHeight: 1.6, margin: '0 0 8px' }}>
            {entry.cuerpo.length > 280 && !expandido
              ? <>{entry.cuerpo.slice(0, 280)}<span style={{ color: 'var(--tinta-3)' }}>… </span><button onClick={() => setExpandido(true)} style={{ background: 'none', border: 'none', color: 'var(--violeta)', fontSize: 13, cursor: 'pointer', padding: 0, fontWeight: 600 }}>leer más</button></>
              : <>{entry.cuerpo}{entry.cuerpo.length > 280 && <> <button onClick={() => setExpandido(false)} style={{ background: 'none', border: 'none', color: 'var(--tinta-3)', fontSize: 12, cursor: 'pointer', padding: 0 }}>↑ menos</button></>}</>
            }
          </div>

          {/* Asistentes */}
          {entry.asistentes?.length > 0 && (
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--tinta-3)' }}>Asistentes</span>
              <AvatarStack ids={entry.asistentes} size="sm" />
              <span style={{ fontSize: 12, color: 'var(--tinta-3)' }}>
                {entry.asistentes.map(id => getMember(id)?.corto).filter(Boolean).join(', ')}
              </span>
            </div>
          )}

          {/* Enlace adjunto */}
          {entry.enlaceUrl && (
            <a href={entry.enlaceUrl} target="_blank" rel="noopener"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 13, color: 'var(--violeta)', fontWeight: 600,
                padding: '4px 12px 4px 10px', borderRadius: 8,
                background: 'rgba(90,54,128,0.08)', border: '1px solid rgba(90,54,128,0.2)',
                textDecoration: 'none', marginBottom: 4,
              }}>
              📎 {entry.enlaceLabel || 'Abrir adjunto'} ↗
            </a>
          )}
        </div>

        {/* Botones: editar + borrar */}
        {(onEditar || onBorrar) && (
          <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
            {onEditar && (
              <button onClick={onEditar} title="Editar esta entrada"
                style={{
                  background: 'none', border: '1px solid var(--lino)', borderRadius: 8,
                  width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'var(--tinta-3)', fontSize: 14, transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background='var(--hueso)'; e.currentTarget.style.color='var(--violeta)'; }}
                onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.color='var(--tinta-3)'; }}
              >✏️</button>
            )}
            {onBorrar && (
              <button onClick={confirmarBorrado} title="Eliminar esta entrada"
                style={{
                  background: 'none', border: '1px solid var(--lino)', borderRadius: 8,
                  width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'var(--tinta-3)', fontSize: 14, transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background='#FBE6E0'; e.currentTarget.style.color='#C0392B'; e.currentTarget.style.borderColor='#E0A795'; }}
                onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.color='var(--tinta-3)'; e.currentTarget.style.borderColor='var(--lino)'; }}
              >🗑️</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Componente principal Bitácora ── */
function Bitacora({ agenda, onUpdateAgenda }) {
  const { TEAM } = window.AGENDA;

  const entradas = (agenda?.bitacora || window.AGENDA.BITACORA || [])
    .slice()
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  const [tipo,          setTipo]          = useState('todo');
  const [editando,      setEditando]      = useState(null); // null | { index: number, entry: {} }
  const [editorAbierto, setEditorAbierto] = useState(false);
  const filtered = entradas.filter(b => tipo === 'todo' || b.tipo === tipo);

  const ghConfigurado = window.GitHubSync?.estaConfigurado?.() || false;

  // Guardar nueva entrada (prepend)
  const onGuardarNueva = async (entrada) => {
    const next = { ...agenda, bitacora: [entrada, ...(agenda?.bitacora || [])] };
    onUpdateAgenda(next);
    setEditorAbierto(false);
  };

  // Guardar edición de entrada existente (reemplazar en posición original)
  const onGuardarEdicion = async (entradaEditada) => {
    const bitacoraActual = agenda?.bitacora || [];
    // Encontrar el índice real en el array original (no filtrado)
    const idxReal = bitacoraActual.findIndex(
      b => b.fecha === editando.entry.fecha &&
           b.autor === editando.entry.autor &&
           b.titulo === editando.entry.titulo
    );
    const nueva = [...bitacoraActual];
    if (idxReal >= 0) {
      nueva[idxReal] = entradaEditada;
    } else {
      nueva.unshift(entradaEditada); // fallback: prepend
    }
    onUpdateAgenda({ ...agenda, bitacora: nueva });
    setEditando(null);
  };

  const editorVisible = editorAbierto || editando !== null;

  return (
    <div className="col gap-lg">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="eyebrow">Bitácora</div>
          <h2 className="section-title" style={{ fontSize: 26 }}>Lo que pasa en el equipo</h2>
          <p className="section-sub">novedades cuando surjan, síntesis cada lunes</p>
        </div>
        {!editorVisible && (
          <button className="btn-solido" onClick={() => setEditorAbierto(true)}
            style={{ background: 'var(--violeta)', alignSelf: 'flex-start' }}>
            + Nueva entrada
          </button>
        )}
      </div>

      {/* Editor: nueva entrada */}
      {editorAbierto && (
        <BitacoraEditor
          onGuardar={onGuardarNueva}
          onCancelar={() => setEditorAbierto(false)}
        />
      )}

      {/* Editor: editar entrada existente */}
      {editando && (
        <BitacoraEditor
          modoEdicion
          initialValues={editando.entry}
          onGuardar={onGuardarEdicion}
          onCancelar={() => setEditando(null)}
        />
      )}

      {!ghConfigurado && !editorVisible && (
        <div style={{ padding: '10px 14px', background: 'rgba(232,197,53,0.15)', border: '1px solid rgba(232,197,53,0.4)', borderRadius: 10, fontSize: 13, color: 'var(--tinta-2)' }}>
          ℹ️ Para publicar o editar entradas, configura GitHub en el botón de la barra superior.
        </div>
      )}

      <div className="tabs">
        <button className={tipo === 'todo' ? 'active' : ''} onClick={() => setTipo('todo')}>
          Todo <span style={{ opacity: 0.6, fontSize: 12 }}>· {entradas.length}</span>
        </button>
        <button className={tipo === 'novedad'  ? 'active' : ''} onClick={() => setTipo('novedad')}>Novedades</button>
        <button className={tipo === 'sintesis' ? 'active' : ''} onClick={() => setTipo('sintesis')}>Síntesis semanal</button>
      </div>

      <div className="card">
        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--tinta-3)', padding: '20px 0', fontFamily: 'var(--acento)', fontSize: 18 }}>
            sin entradas aún
          </p>
        )}
        {filtered.map((b, i) => (
          <BitacoraRow
            key={i}
            entry={b}
            onEditar={ghConfigurado ? () => setEditando({ index: i, entry: b }) : null}
            onBorrar={ghConfigurado ? () => {
              const bitacoraActual = agenda?.bitacora || [];
              const idxReal = bitacoraActual.findIndex(
                e => e.fecha === b.fecha && e.autor === b.autor && e.titulo === b.titulo
              );
              if (idxReal >= 0) {
                const nueva = bitacoraActual.filter((_, j) => j !== idxReal);
                onUpdateAgenda({ ...agenda, bitacora: nueva });
              }
            } : null}
          />
        ))}
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

