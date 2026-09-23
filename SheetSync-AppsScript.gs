/**
 * Productivity Tracker → Google Sheets sync
 *
 * SETUP
 * 1. Open your sheet: https://docs.google.com/spreadsheets/d/1DKa_ZNskRCgv-QqlMLpJiSuPby-Y5S5zbTfvD_yOatw/edit
 * 2. Extensions → Apps Script
 * 3. Delete any placeholder code, paste this whole file in, and Save.
 * 4. Deploy → New deployment → type "Web app"
 *      Execute as: Me
 *      Who has access: Anyone
 * 5. Click Deploy, authorize it, then copy the "Web app URL" it gives you.
 * 6. Paste that URL into the tracker's Admin → Sync tab, "Web app URL" field.
 *
 * This creates/updates three tabs in your sheet: Employees, Processes, ProductivityLog.
 */
const SPREADSHEET_ID = '1DKa_ZNskRCgv-QqlMLpJiSuPby-Y5S5zbTfvD_yOatw';

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    if (body.type === 'employees') writeTable(ss, 'Employees', ['Employee ID','Name','Band','Email','Password'], body.rows.map(r => [r.id, r.name, r.band, r.email, r.password]));
    else if (body.type === 'processes') writeTable(ss, 'Processes', ['Process name','Target hours','Target 100%','Target count / hour'], body.rows.map(r => [r.name, r.targetHours, r.target100, r.targetCountPerHour]));
    else if (body.type === 'log') appendLogRows(ss, body.row);
    else return jsonOut({ok:false, error:'Unknown type'});

    return jsonOut({ok:true});
  } catch (err) {
    return jsonOut({ok:false, error: String(err)});
  }
}

function writeTable(ss, sheetName, headers, rows) {
  let sh = ss.getSheetByName(sheetName);
  if (!sh) sh = ss.insertSheet(sheetName);
  sh.clearContents();
  sh.appendRow(headers);
  if (rows.length) sh.getRange(2, 1, rows.length, headers.length).setValues(rows);
}

function appendLogRows(ss, l) {
  const sheetName = 'ProductivityLog';
  let sh = ss.getSheetByName(sheetName);
  const headers = ['Date','Employee ID','Employee name','Band','Process name','Hours','Count','Note description','Note hours','Submitted at'];
  if (!sh) { sh = ss.insertSheet(sheetName); sh.appendRow(headers); }
  if (sh.getLastRow() === 0) sh.appendRow(headers);

  const submitted = new Date(l.submittedAt).toISOString();
  const rows = [];
  (l.processes || []).forEach(p => {
    if (p.process || p.hour || p.count) rows.push([l.date, l.employeeId, l.employeeName, l.band, p.process, p.hour, p.count, '', '', submitted]);
  });
  (l.notes || []).forEach(n => {
    if (n.desc || n.hour) rows.push([l.date, l.employeeId, l.employeeName, l.band, '', '', '', n.desc, n.hour, submitted]);
  });
  if (rows.length) sh.getRange(sh.getLastRow()+1, 1, rows.length, headers.length).setValues(rows);
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
