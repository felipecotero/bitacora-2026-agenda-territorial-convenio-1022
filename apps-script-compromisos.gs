/**
 * COMPROMISOS CICLO PUENTE — Google Apps Script Web App
 * 
 * Instrucciones:
 * 1. Crear un Google Sheet y copiar este script en Extensiones > Apps Script
 * 2. Implementar > Nueva implementación > Web App
 *    - Ejecutar como: Yo
 *    - Acceso: Cualquier usuario
 * 3. Copiar la URL de implementación y pegarla en compromiso.html y view-compromisos.jsx
 *
 * Endpoints:
 *   POST  → recibe un compromiso y lo agrega como fila
 *   GET   → devuelve todas las filas como JSON (para el Dashboard)
 */

const SHEET_NAME = 'Compromisos';

const HEADERS = [
  'Timestamp',
  'Organización',
  'Red',
  'Municipio',
  'Representante',
  'Correo',
  'Celular',
  'Camino',
  'Compromiso firmado',
  'Expectativa',
  'Lugar y fecha firma',
];

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  // Agregar encabezados si la hoja está vacía
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setBackground('#4A1C73')
      .setFontColor('#FFFFFF')
      .setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getSheet();
    
    const row = [
      new Date().toISOString(),
      data.organizacion || '',
      data.red || '',
      data.municipio || '',
      data.representante || '',
      data.correo || '',
      data.celular ? `'${data.celular}` : '',
      data.camino || '',
      data.compromisoFirmado ? 'SÍ' : 'NO',
      data.expectativa || '',
      data.lugarFecha || '',
    ];
    
    sheet.appendRow(row);
    
    // Enviar correo de copia al usuario
    if (data.correo) {
      enviarCorreoCopia(data);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, message: 'Compromiso registrado.' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const sheet = getSheet();
    const rows = sheet.getDataRange().getValues();
    
    if (rows.length <= 1) {
      // Solo encabezados, sin datos
      return ContentService
        .createTextOutput(JSON.stringify({ ok: true, total: 0, data: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const headers = rows[0];
    const data = rows.slice(1).map(row => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = row[i]; });
      return obj;
    });
    
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, total: data.length, data }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================================
// FUNCIÓN PARA ENVIAR CORREO DE CONFIRMACIÓN AL SUSCRIPTOR
// ============================================================
function enviarCorreoCopia(data) {
  const asunto = "Copia de tu compromiso · Ciclo de Formación Puente";
  
  const html = `
    <div style="font-family: Arial, sans-serif; color: #1D0F2E; max-width: 600px; margin: 0 auto; border: 1px solid #EAEAEA; border-radius: 10px; overflow: hidden;">
      <div style="background: #4A1C73; color: #FFFFFF; padding: 24px; text-align: center;">
        <h2 style="margin: 0; font-size: 22px;">¡Compromiso Registrado!</h2>
        <p style="margin: 8px 0 0; color: #E8C535; font-size: 15px;">Ciclo de Formación Puente · Convenio 1022</p>
      </div>
      <div style="padding: 32px 24px; background: #F7F1E6;">
        <p style="font-size: 16px;">Hola <strong>${data.representante || 'participante'}</strong>,</p>
        <p style="font-size: 16px; line-height: 1.5;">Hemos recibido correctamente el compromiso de participación de <strong>${data.organizacion || 'tu organización'}</strong> para el Ciclo de Formación Puente.</p>
        
        <h3 style="color: #4A1C73; border-bottom: 2px solid #D6C2A1; padding-bottom: 6px; margin-top: 32px;">Resumen de la inscripción</h3>
        <ul style="line-height: 1.8; padding-left: 20px; font-size: 15px;">
          <li><strong>Red:</strong> ${data.red || '—'}</li>
          <li><strong>Municipio:</strong> ${data.municipio || '—'}</li>
          <li><strong>Camino seleccionado:</strong> ${data.camino || '—'}</li>
          <li><strong>Compromiso aceptado:</strong> ${data.compromisoFirmado ? 'SÍ' : 'NO'}</li>
          <li><strong>Expectativa:</strong> <em>"${data.expectativa || '—'}"</em></li>
        </ul>
        
        <p style="margin-top: 32px; font-size: 14px; color: #5A3680; text-align: center;">
          Nos vemos pronto en nuestra primera sesión.<br>
          <strong>Seguimos tejiendo.</strong>
        </p>
      </div>
    </div>
  `;

  try {
    MailApp.sendEmail({
      to: data.correo,
      subject: asunto,
      htmlBody: html
    });
  } catch (e) {
    // Si falla el correo, no rompemos el envío
    console.error("Error al enviar correo: " + e.toString());
  }
}
