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
