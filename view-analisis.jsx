/* Vista Análisis de Beneficiarios — Caracterización, Resultados y Sincronización Inteligente en Línea */

const { useState: aUseState, useEffect: aUseEffect, useRef: aUseRef, useMemo: aUseMemo } = React;

function AnalisisBeneficiarios() {
  const [tab, setTab] = aUseState('fichas'); // 'fichas' | 'resultados'
  const [sidecarState, setSidecarState] = aUseState({});
  const [syncStatus, setSyncStatus] = aUseState({ estado: 'ok', mensaje: 'Sincronizado en línea' });
  const iframeRef = aUseRef(null);
  const fileInputRef = aUseRef(null);
  const ghTimerRef = aUseRef(null);

  const STORE_KEY = 'caracterizacion_conv1022_v1';
  const RAW_SIDECAR_URL = 'https://raw.githubusercontent.com/felipecotero/bitacora-2026-agenda-territorial-convenio-1022/main/fichas_sidecar.json';

  // Función inteligente para combinar estado local y remoto sin borrar avances
  const mergeSidecarStates = (localSt, remoteSt) => {
    const merged = { ...(remoteSt || {}) };
    if (localSt && typeof localSt === 'object') {
      Object.keys(localSt).forEach(key => {
        const loc = localSt[key];
        const rem = merged[key];
        if (loc && (loc.esta || loc.dl || (loc.nota && loc.nota.trim()))) {
          if (!rem || (!rem.esta && !rem.dl && (!rem.nota || !rem.nota.trim()))) {
            merged[key] = loc;
          } else {
            merged[key] = {
              esta: loc.esta || rem.esta,
              dl: loc.dl || rem.dl,
              nota: (loc.nota && loc.nota.trim()) ? loc.nota : (rem.nota || '')
            };
          }
        }
      });
    }
    return merged;
  };

  // 1. Cargar estado inicial y sincronizar sin sobreescribir
  aUseEffect(() => {
    let localSt = {};
    try {
      const saved = localStorage.getItem(STORE_KEY);
      if (saved) localSt = JSON.parse(saved);
    } catch (e) {}

    setSidecarState(localSt);
    setSyncStatus({ estado: 'cargando', mensaje: 'Cargando datos en línea…' });

    fetch(RAW_SIDECAR_URL + '?t=' + Date.now())
      .then(r => {
        if (!r.ok) throw new Error(`GitHub HTTP ${r.status}`);
        return r.json();
      })
      .then(data => {
        const remoteSt = data.state || data || {};
        const combined = mergeSidecarStates(localSt, remoteSt);
        setSidecarState(combined);
        try { localStorage.setItem(STORE_KEY, JSON.stringify(combined)); } catch (e) {}
        setSyncStatus({ estado: 'ok', mensaje: 'Datos sincronizados en línea' });
      })
      .catch(err => {
        console.warn('No se pudo descargar fichas_sidecar.json desde GitHub:', err);
        setSyncStatus({ estado: 'local', mensaje: 'Modo local activo' });
      });
  }, []);

  // 2. Función para guardar cambios a GitHub en línea
  const syncToGitHub = (nextState) => {
    if (!window.GitHubSync || !window.GitHubSync.estaConfigurado()) return;

    if (ghTimerRef.current) clearTimeout(ghTimerRef.current);
    setSyncStatus({ estado: 'guardando', mensaje: 'Guardando en la nube…' });

    ghTimerRef.current = setTimeout(async () => {
      const cfg = window.GitHubSync.cargarConfig();
      if (!cfg) return;

      const payloadObj = {
        proyecto: "Convenio 1022 de 2025 · Caracterización beneficiarios · Abril–Julio 2026",
        key: STORE_KEY,
        fecha: new Date().toISOString(),
        total_organizaciones: 65,
        state: nextState
      };
      const jsonContent = JSON.stringify(payloadObj, null, 2);

      try {
        const ghConfigForSidecar = { ...cfg, path: 'fichas_sidecar.json' };
        await window.GitHubSync.commit(
          ghConfigForSidecar,
          jsonContent,
          `Caracterización: actualización online ${new Date().toISOString().slice(0,16).replace('T',' ')}`
        );
        setSyncStatus({ estado: 'ok', mensaje: 'Guardado en la nube (GitHub)' });
      } catch (e) {
        console.error('Error al guardar fichas_sidecar en GitHub:', e);
        setSyncStatus({ estado: 'error', mensaje: 'Error al sincronizar en la nube' });
      }
    }, 1500);
  };

  // 3. Escuchar actualizaciones desde el iframe en tiempo real
  aUseEffect(() => {
    function handleMessage(e) {
      if (e.data && e.data.type === 'SIDECAR_UPDATE') {
        const sc = e.data.state;
        if (sc && sc.state) {
          setSidecarState(sc.state);
          try { localStorage.setItem(STORE_KEY, JSON.stringify(sc.state)); } catch (err) {}
          syncToGitHub(sc.state);
        }
      }
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // 4. Métricas estadísticas
  const stats = aUseMemo(() => {
    if (!sidecarState) return { revisadas: 0, descargadas: 0, notas: 0, total: 65 };
    const keys = Object.keys(sidecarState);
    let revisadas = 0;
    let descargadas = 0;
    let notas = 0;

    keys.forEach(k => {
      const item = sidecarState[k];
      if (item) {
        if (item.esta === 'si' || item.esta === 'no') revisadas++;
        if (item.dl) descargadas++;
        if (item.nota && item.nota.trim()) notas++;
      }
    });

    return { revisadas, descargadas, notas, total: 65 };
  }, [sidecarState]);

  // Exportar archivo Sidecar JSON
  const handleExportSidecar = () => {
    try {
      const raw = localStorage.getItem(STORE_KEY) || '{}';
      const st = JSON.parse(raw);
      const sidecarObj = {
        proyecto: "Convenio 1022 de 2025 · Caracterización beneficiarios · Abril–Julio 2026",
        key: STORE_KEY,
        fecha: new Date().toISOString(),
        total_organizaciones: 65,
        state: st
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sidecarObj, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `avance_fichas_conv1022_${new Date().toISOString().slice(0,10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      alert("No se pudo exportar el archivo Sidecar: " + e.message);
    }
  };

  // Importar archivo Sidecar JSON
  const handleImportClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        const importedState = json.state || json;
        localStorage.setItem(STORE_KEY, JSON.stringify(importedState));
        setSidecarState(importedState);
        syncToGitHub(importedState);

        if (iframeRef.current) {
          iframeRef.current.src = iframeRef.current.src;
        }
        alert("¡Archivo Sidecar cargado exitosamente!");
      } catch (err) {
        alert("Error al leer el archivo JSON Sidecar: " + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleOpenFullscreen = () => {
    window.open('FINAL_fichas_caracterizacion_convenio1022_abr-jul-2026.html', '_blank');
  };

  return (
    <div className="analisis-view col gap-lg">
      
      {/* Selector de sub-pestañas */}
      <div className="analisis-subnav-bar">
        <div className="analisis-tabs">
          <button
            className={`analisis-tab-btn ${tab === 'fichas' ? 'active' : ''}`}
            onClick={() => setTab('fichas')}
          >
            <span className="tab-num">1</span>
            <span className="tab-label">Fichas de Caracterización</span>
            <span className="tab-badge ok">Activo</span>
          </button>
          <button
            className={`analisis-tab-btn ${tab === 'resultados' ? 'active' : ''}`}
            onClick={() => setTab('resultados')}
          >
            <span className="tab-num">2</span>
            <span className="tab-label">Resultados del Análisis</span>
            <span className="tab-badge pending">Próxima Fase</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: FICHAS DE CARACTERIZACIÓN */}
      {tab === 'fichas' && (
        <div className="col gap-md">
          {/* Barra de Gestión de Persistencia Sidecar & Sync en Línea */}
          <div className="sidecar-bar card">
            <div className="sidecar-left">
              <div className="sidecar-status-pill">
                <span className="sidecar-dot pulse"></span>
                <span>{syncStatus.mensaje}</span>
              </div>
              <div className="sidecar-stats">
                <span className="stat-pill"><b>{stats.descargadas}</b> / {stats.total} Descargadas</span>
                <span className="stat-pill"><b>{stats.revisadas}</b> Revisadas</span>
                {stats.notas > 0 && <span className="stat-pill"><b>{stats.notas}</b> Notas</span>}
              </div>
            </div>

            <div className="sidecar-right">
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".json"
                onChange={handleFileChange}
              />
              <button className="btn-sidecar btn-secondary" onClick={handleImportClick} title="Cargar avance guardado localmente">
                ↑ Cargar Sidecar (.json)
              </button>
              <button className="btn-sidecar btn-primary" onClick={handleExportSidecar} title="Descargar copia de respaldo JSON">
                ↓ Guardar Sidecar (.json)
              </button>
              <button className="btn-sidecar btn-ghost" onClick={handleOpenFullscreen} title="Abrir en pantalla completa">
                ↗ Abrir Pantalla Completa
              </button>
            </div>
          </div>

          {/* Aviso contextual de seguridad */}
          <div className="sidecar-callout">
            <span className="icon">🛡️</span>
            <div>
              <strong>Persistencia activa:</strong> Tus respuestas y marcas de caracterización se preservan en este navegador y se combinan automáticamente con el servidor para evitar pérdidas de información.
            </div>
          </div>

          {/* Iframe contenedor de Fichas */}
          <div className="iframe-container-card card">
            <iframe
              ref={iframeRef}
              src="FINAL_fichas_caracterizacion_convenio1022_abr-jul-2026.html"
              title="Fichas de Caracterización Convenio 1022"
              className="analisis-iframe"
            />
          </div>
        </div>
      )}

      {/* SUB-TAB 2: RESULTADOS DEL ANÁLISIS */}
      {tab === 'resultados' && (
        <div className="col gap-md">
          {/* Banner de Estado de la Fase */}
          <div className="card resultados-hero-banner">
            <div className="resultados-hero-header">
              <span className="hero-eyebrow">Convenio 1022 · Fase de Síntesis</span>
              <h2>Tablero de Resultados del Análisis de Beneficiarios</h2>
              <p>
                Visualización consolidada en línea de la caracterización socio-demográfica, cobertura territorial y niveles de autonomía digital de las organizaciones y públicos participantes.
              </p>
            </div>

            <div className="resultados-hero-status card">
              <div className="status-badge-lg">
                <span className="badge-pulse"></span>
                <span>En Proceso de Caracterización</span>
              </div>
              <div className="status-desc">
                Esta sección procesará automáticamente los datos del archivo <strong>Sidecar en línea (fichas_sidecar.json)</strong> una vez finalizada la etapa de diligenciamiento en la pestaña 1.
              </div>
              <div className="status-progress-bar">
                <div
                  className="status-progress-fill"
                  style={{ width: `${Math.round((stats.descargadas / stats.total) * 100)}%` }}
                ></div>
              </div>
              <div className="status-progress-meta">
                <span>Avance de caracterización: {Math.round((stats.descargadas / stats.total) * 100)}%</span>
                <span>{stats.descargadas} de {stats.total} fichas procesadas</span>
              </div>
            </div>
          </div>

          {/* Maqueta de Módulos Analíticos Proyectados */}
          <div className="resultados-grid">
            
            <div className="card modulo-card">
              <div className="modulo-icon">🗺️</div>
              <div className="modulo-title">1. Cobertura y Distribución Territorial</div>
              <div className="modulo-desc">
                Análisis de presencia institucional y comunitaria por municipios, subregiones y comités del Convenio 1022.
              </div>
              <div className="modulo-preview-metrics">
                <div className="metric-box"><span className="num">65</span><span className="label">Organizaciones</span></div>
                <div className="metric-box"><span className="num">3</span><span className="label">Caminos</span></div>
                <div className="metric-box"><span className="num">8</span><span className="label">Rubros</span></div>
              </div>
              <div className="modulo-footer-tag">Próxima liberación</div>
            </div>

            <div className="card modulo-card">
              <div className="modulo-icon">💻</div>
              <div className="modulo-title">2. Diagnóstico de Autonomía Digital</div>
              <div className="modulo-desc">
                Evaluación de infraestructura tecnológica, conectividad y apropiación de herramientas digitales por red cultural.
              </div>
              <div className="modulo-preview-list">
                <div className="preview-item"><span>· Conectividad y Equipamiento</span> <span className="p-badge">En línea</span></div>
                <div className="preview-item"><span>· Soberanía y Gestión de Datos</span> <span className="p-badge">En línea</span></div>
                <div className="preview-item"><span>· Herramientas Colaborativas</span> <span className="p-badge">En línea</span></div>
              </div>
              <div className="modulo-footer-tag">Próxima liberación</div>
            </div>

            <div className="card modulo-card">
              <div className="modulo-icon">👥</div>
              <div className="modulo-title">3. Matriz de Públicos & Beneficiarios</div>
              <div className="modulo-desc">
                Clasificación cualitativa de las audiencias alcanzadas por los colectivos, comités de gestión y redes de formación.
              </div>
              <div className="modulo-preview-list">
                <div className="preview-item"><span>· Colectivos y Organizaciones Base</span> <span className="p-badge">En captura</span></div>
                <div className="preview-item"><span>· Redes de Mujeres y Saberes</span> <span className="p-badge">En captura</span></div>
                <div className="preview-item"><span>· Jóvenes e Identidades Territoriales</span> <span className="p-badge">En captura</span></div>
              </div>
              <div className="modulo-footer-tag">Próxima liberación</div>
            </div>

            <div className="card modulo-card">
              <div className="modulo-icon">📊</div>
              <div className="modulo-title">4. Consolidados & Informes Oficiales</div>
              <div className="modulo-desc">
                Exportación de reportes tabulares en formato CSV, Excel e informes ejecutivos en PDF para supervisión de convenio.
              </div>
              <div className="modulo-actions-preview">
                <button className="btn btn-disabled" disabled>Descargar Reporte PDF (Próximamente)</button>
                <button className="btn btn-disabled" disabled>Exportar Matriz Excel (Próximamente)</button>
              </div>
              <div className="modulo-footer-tag">Próxima liberación</div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

window.AnalisisBeneficiarios = AnalisisBeneficiarios;
