/* Vista Telar — calendario editable de coordinación */

const { useState: tUseState, useEffect: tUseEffect, useMemo: tUseMemo, useRef: tUseRef } = React;

const MESES_TELAR = [
  { num: 4, nombre: 'Mayo' },     // 0-indexed: abr=3, may=4
  { num: 5, nombre: 'Junio' },
  { num: 6, nombre: 'Julio' },
];
const DIAS_CORTO = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

function caminoColor(c) {
  return ({
    C1: '#A8438A',
    C2: '#5A3680',
    C3: '#3D50A8',
    HITO: '#528E71',
  })[c] || '#5A3680';
}
function caminoNombre(c) {
  return ({
    C1: 'Formación Puente',
    C2: 'Autonomía Digital',
    C3: 'Identidad Mujeres',
    HITO: 'Hito',
  })[c] || c;
}
function estadoLabel(e) {
  return ({
    'propuesta': 'propuesta',
    'en-revision': 'en revisión',
    'confirmada': 'confirmada',
  })[e] || e;
}

/* ===== Construir grilla del mes ===== */
function buildMonth(year, month) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  // L=0, M=1... D=6 (lunes primero)
  const startOffset = (first.getDay() + 6) % 7;
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= last.getDate(); d++) {
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    cells.push({ d, iso });
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

/* ===== Editor modal ===== */
function EditorEvento({ eventoIdx, evento, onClose, onSave, onDelete }) {
  const isNew = eventoIdx == null;
  const [form, setForm] = tUseState({
    fecha: evento?.fecha || '',
    camino: evento?.camino || 'C1',
    orientadora: evento?.orientadora || '',
    titulo: evento?.titulo || '',
    hora: evento?.hora || 'Por confirmar',
    duracion: evento?.duracion || '1h 30min',
    lugar: evento?.lugar || 'Microsoft Teams',
    notas: evento?.notas || '',
    estadoCal: evento?.estadoCal || 'propuesta',
    destacado: evento?.destacado || false,
  });

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const guardar = () => {
    const limpio = { ...form };
    if (limpio.camino !== 'C1') delete limpio.orientadora;
    if (!limpio.orientadora) delete limpio.orientadora;
    if (!limpio.estadoCal) delete limpio.estadoCal;
    if (!limpio.destacado) delete limpio.destacado;
    onSave(eventoIdx, limpio);
  };

  return (
    <div className="telar-modal-overlay" onClick={onClose}>
      <div className="telar-modal" onClick={e => e.stopPropagation()}>
        <div className="telar-modal-head">
          <div className="eyebrow" style={{ color: caminoColor(form.camino) }}>
            {isNew ? 'Nueva sesión' : 'Editar sesión'}
          </div>
          <h3 style={{ fontFamily: 'var(--display)', margin: '4px 0 0', fontSize: 26, fontWeight: 600 }}>
            {form.titulo || 'Sin título'}
          </h3>
          <button className="telar-modal-close" onClick={onClose} aria-label="Cerrar">×</button>
        </div>

        <div className="telar-form">
          <label>
            <span>Título</span>
            <input type="text" value={form.titulo} onChange={e => update('titulo', e.target.value)} />
          </label>

          <div className="telar-form-row">
            <label>
              <span>Fecha</span>
              <input type="date" value={form.fecha} onChange={e => update('fecha', e.target.value)} />
            </label>
            <label>
              <span>Hora</span>
              <input type="text" value={form.hora} onChange={e => update('hora', e.target.value)} placeholder="9:00 a.m." />
            </label>
            <label>
              <span>Duración</span>
              <input type="text" value={form.duracion} onChange={e => update('duracion', e.target.value)} />
            </label>
          </div>

          <div className="telar-form-row">
            <label>
              <span>Camino</span>
              <select value={form.camino} onChange={e => update('camino', e.target.value)}>
                <option value="C1">C1 · Formación Puente</option>
                <option value="C2">C2 · Autonomía Digital</option>
                <option value="C3">C3 · Identidad Mujeres</option>
                <option value="HITO">HITO</option>
              </select>
            </label>
            {form.camino === 'C1' && (
              <label>
                <span>Orientadora</span>
                <select value={form.orientadora} onChange={e => update('orientadora', e.target.value)}>
                  <option value="">— sin asignar —</option>
                  <option value="mercy">Mercy · Saberes financieros</option>
                  <option value="jeimmy">Jeimmy · Saberes RIJ</option>
                  <option value="felipe">Felipe · Comunicaciones</option>
                </select>
              </label>
            )}
            {form.camino === 'C1' && (
              <label>
                <span>Estado</span>
                <select value={form.estadoCal} onChange={e => update('estadoCal', e.target.value)}>
                  <option value="propuesta">Propuesta</option>
                  <option value="en-revision">En revisión</option>
                  <option value="confirmada">Confirmada</option>
                </select>
              </label>
            )}
          </div>

          <label>
            <span>Lugar</span>
            <input type="text" value={form.lugar} onChange={e => update('lugar', e.target.value)} />
          </label>

          <label>
            <span>Notas</span>
            <textarea rows={3} value={form.notas} onChange={e => update('notas', e.target.value)} />
          </label>

          <label className="telar-check">
            <input type="checkbox" checked={form.destacado} onChange={e => update('destacado', e.target.checked)} />
            <span>Marcar como destacado · pin en el Tablero</span>
          </label>
        </div>

        <div className="telar-modal-foot">
          {!isNew && (
            <button className="btn-fantasma btn-peligro" onClick={() => onDelete(eventoIdx)}>
              Eliminar
            </button>
          )}
          <div style={{ flex: 1 }}></div>
          <button className="btn-fantasma" onClick={onClose}>Cancelar</button>
          <button className="btn-solido" onClick={guardar} style={{ background: caminoColor(form.camino) }}>
            {isNew ? 'Crear sesión' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===== Card de evento dentro de un día ===== */
function ChipEvento({ ev, idx, onClick }) {
  const color = caminoColor(ev.camino);
  return (
    <button
      className={`telar-chip ${ev.destacado ? 'destacado' : ''}`}
      style={{ '--c': color, borderLeftColor: color }}
      onClick={() => onClick(idx)}
      title={`${ev.titulo} · ${ev.hora}`}
    >
      <span className="telar-chip-camino" style={{ background: color }}>{ev.camino}</span>
      <span className="telar-chip-titulo">{ev.titulo}</span>
      {ev.hora && ev.hora !== 'Por confirmar' && <span className="telar-chip-hora">{ev.hora}</span>}
    </button>
  );
}

/* ===== Vista principal ===== */
function Telar({ agenda, onUpdateAgenda }) {
  const [editing, setEditing] = tUseState(null); // { idx, evento } | { idx: null, evento: {fecha} }
  const [filtroCamino, setFiltroCamino] = tUseState('todos');
  const [showConfig, setShowConfig] = tUseState(false);
  const [mesActivo, setMesActivo] = tUseState(0); // 0=may, 1=jun, 2=jul
  const fileInputRef = tUseRef(null);

  const eventos = agenda?.eventos || [];

  const eventosPorDia = tUseMemo(() => {
    const m = {};
    eventos.forEach((ev, idx) => {
      const f = ev.fecha;
      if (!m[f]) m[f] = [];
      if (filtroCamino === 'todos' || ev.camino === filtroCamino) {
        m[f].push({ ...ev, _idx: idx });
      }
    });
    return m;
  }, [eventos, filtroCamino]);

  const onEditEv = (idx) => setEditing({ idx, evento: eventos[idx] });
  const onNewEv = (fecha) => setEditing({ idx: null, evento: { fecha, camino: 'C1' } });

  const onSaveEv = (idx, datos) => {
    const next = { ...agenda, eventos: [...eventos] };
    if (idx == null) next.eventos.push(datos);
    else next.eventos[idx] = datos;
    next.eventos.sort((a, b) => a.fecha.localeCompare(b.fecha));
    next.meta = { ...next.meta, ultimaActualizacion: new Date().toISOString().slice(0, 10) };
    onUpdateAgenda(next);
    setEditing(null);
  };

  const onDeleteEv = (idx) => {
    if (!confirm('¿Eliminar esta sesión?')) return;
    const next = { ...agenda, eventos: eventos.filter((_, i) => i !== idx) };
    next.meta = { ...next.meta, ultimaActualizacion: new Date().toISOString().slice(0, 10) };
    onUpdateAgenda(next);
    setEditing(null);
  };

  const descargarJson = () => {
    const blob = new Blob([JSON.stringify(agenda, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const cargarJson = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const datos = JSON.parse(e.target.result);
        if (!datos.eventos || !Array.isArray(datos.eventos)) {
          alert('El archivo no parece un data.json válido (falta el array eventos).');
          return;
        }
        onUpdateAgenda(datos);
      } catch (err) {
        alert('No se pudo leer el JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const caminos = ['todos', 'C1', 'C2', 'C3', 'HITO'];
  const totalSemestre = eventos.length;
  const conteoCaminos = ['C1', 'C2', 'C3', 'HITO'].map(c => ({
    c,
    n: eventos.filter(e => e.camino === c).length,
  }));

  if (!agenda) {
    return <div className="card"><p>Cargando Telar…</p></div>;
  }

  const year = 2026;
  const mes = MESES_TELAR[mesActivo];
  const cells = buildMonth(year, mes.num);

  return (
    <div className="vista">
      {/* Encabezado del Telar */}
      <div className="card telar-head">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 320px' }}>
            <div className="eyebrow">El Telar · {agenda.meta?.descripcion || 'calendario interno'}</div>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: 36, fontWeight: 600, margin: '6px 0 6px', letterSpacing: '-0.02em' }}>
              {agenda.meta?.subtitulo || 'Mayo · Junio · Julio · 2026'}
            </h2>
            <p style={{ fontFamily: 'var(--acento)', fontSize: 22, color: 'var(--violeta)', margin: 0, lineHeight: 1.1 }}>
              tres caminos tejidos · una sola fuente
            </p>
            <p className="muted" style={{ marginTop: 10, fontSize: 14 }}>
              Última actualización: {agenda.meta?.ultimaActualizacion || '—'} · {totalSemestre} sesiones · edita haciendo clic en cualquier sesión
            </p>
          </div>
          <div className="telar-actions">
            {window.GhStatusBadge && <window.GhStatusBadge onClick={() => setShowConfig(true)} />}
            <button
              className="btn-fantasma"
              onClick={() => fileInputRef.current?.click()}
              title="Cargar un data.json desde tu computador (sobrescribe el actual)"
            >
              ↑ Cargar
            </button>
            <button
              className="btn-fantasma"
              onClick={descargarJson}
              title="Descargar copia local del data.json"
            >
              ↓ Descargar
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              style={{ display: 'none' }}
              onChange={e => e.target.files[0] && cargarJson(e.target.files[0])}
            />
          </div>
        </div>

        <div className="telar-leyenda">
          {conteoCaminos.map(({ c, n }) => (
            <span key={c} className="telar-leyenda-item">
              <span className="telar-leyenda-dot" style={{ background: caminoColor(c) }}></span>
              <strong>{c}</strong>
              <span className="muted"> · {caminoNombre(c)} · {n}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Controles */}
      <div className="telar-controles">
        <div className="telar-tabs">
          {MESES_TELAR.map((m, i) => (
            <button
              key={m.num}
              className={`telar-tab ${mesActivo === i ? 'activo' : ''}`}
              onClick={() => setMesActivo(i)}
            >
              {m.nombre}
              <span className="muted"> · {Object.keys(eventosPorDia).filter(f => f.startsWith(`2026-${String(m.num + 1).padStart(2, '0')}`)).reduce((a, f) => a + eventosPorDia[f].length, 0)}</span>
            </button>
          ))}
        </div>
        <div className="telar-filtros">
          <span className="muted" style={{ fontSize: 13 }}>Filtrar:</span>
          {caminos.map(c => (
            <button
              key={c}
              className={`telar-filtro ${filtroCamino === c ? 'activo' : ''}`}
              onClick={() => setFiltroCamino(c)}
              style={filtroCamino === c && c !== 'todos' ? { background: caminoColor(c), color: '#fff', borderColor: caminoColor(c) } : {}}
            >
              {c === 'todos' ? 'Todos' : c}
            </button>
          ))}
        </div>
      </div>

      {/* Grilla del mes */}
      <div className="telar-grilla">
        <div className="telar-grilla-head">
          {DIAS_CORTO.map(d => <div key={d} className="telar-dh">{d}</div>)}
        </div>
        <div className="telar-grilla-body">
          {cells.map((cell, i) => {
            if (!cell) return <div key={i} className="telar-celda vacia"></div>;
            const evs = eventosPorDia[cell.iso] || [];
            const esHoy = cell.iso === window.AGENDA?.HOY_ISO;
            return (
              <div key={i} className={`telar-celda ${esHoy ? 'hoy' : ''}`}>
                <div className="telar-celda-head">
                  <span className="telar-celda-dia">{cell.d}</span>
                  <button
                    className="telar-celda-add"
                    onClick={() => onNewEv(cell.iso)}
                    aria-label="Agregar sesión"
                    title="Agregar sesión"
                  >+</button>
                </div>
                <div className="telar-celda-evs">
                  {evs.map(ev => (
                    <ChipEvento key={ev._idx} ev={ev} idx={ev._idx} onClick={onEditEv} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pie con guía */}
      <div className="card" style={{ background: '#FAF6E7', borderColor: '#E8C535' }}>
        <div className="eyebrow" style={{ color: '#6E5B0D' }}>Cómo editar</div>
        <p style={{ margin: '6px 0 0', fontSize: 14, lineHeight: 1.55 }}>
          <strong>Clic en cualquier sesión</strong> para editar título, fecha, hora, lugar, orientadora y notas.
          {' '}<strong>Botón +</strong> en cada día para crear una sesión nueva.
          {' '}{window.GitHubSync?.estaConfigurado()
            ? <>Cada cambio se guarda automáticamente en GitHub a los pocos segundos. Mercy y Jeimmy verán los cambios al recargar.</>
            : <>Aún no has conectado GitHub — <a href="#" onClick={(e) => { e.preventDefault(); setShowConfig(true); }} style={{ color: 'var(--violeta)', fontWeight: 600 }}>configurar guardado automático</a> · o <a href="guia-github.html" target="_blank" style={{ color: 'var(--violeta)' }}>ver la guía paso a paso</a>.</>
          }
        </p>
      </div>

      {editing && (
        <EditorEvento
          eventoIdx={editing.idx}
          evento={editing.evento}
          onClose={() => setEditing(null)}
          onSave={onSaveEv}
          onDelete={onDeleteEv}
        />
      )}

      {showConfig && window.ModalConfigGitHub && (
        <window.ModalConfigGitHub
          onClose={() => setShowConfig(false)}
          onGuardado={() => {
            window.dispatchEvent(new Event('github-config-changed'));
          }}
        />
      )}
    </div>
  );
}

window.Telar = Telar;
