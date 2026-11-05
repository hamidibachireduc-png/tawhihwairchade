import { InstitutionInfo } from '../types';
import { COUNSELOR_RANKS, STAGE_METADATA } from '../data/initialData';

/**
 * يقوم بتوليد وتنزيل مستند رسمي جاهز للطباعة والحفظ كملف PDF / مستند رسمي A4
 * بترويسة الجمهورية الجزائرية الديمقراطية الشعبية ووزارة التربية الوطنية
 */
export function downloadOfficialPrintableDocument(params: {
  filename: string;
  documentTitle: string;
  documentCode: string;
  institution: InstitutionInfo;
  bodyHtml: string;
  autoPrint?: boolean;
}) {
  const { filename, documentTitle, documentCode, institution, bodyHtml, autoPrint = true } = params;
  const stageMeta = STAGE_METADATA[institution.stage];
  const rankMeta = COUNSELOR_RANKS[institution.rankKey];
  const dateStr = new Date().toISOString().slice(0, 10);

  const fullHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>${documentTitle}</title>
  <style>
    @page { size: A4; margin: 12mm; }
    body {
      font-family: 'Cairo', 'Traditional Arabic', 'Simplified Arabic', Tahoma, Arial, sans-serif;
      direction: rtl;
      text-align: right;
      color: #000000;
      background: #ffffff;
      margin: 0;
      padding: 18px;
      line-height: 1.55;
    }
    .header-box {
      border-bottom: 2px solid #000;
      padding-bottom: 10px;
      margin-bottom: 16px;
      text-align: center;
    }
    .header-meta {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      font-weight: bold;
      margin-top: 8px;
    }
    .doc-title {
      font-size: 17px;
      font-weight: 900;
      text-align: center;
      margin: 12px 0;
      padding: 6px 12px;
      border: 2px solid #000;
      background: #f3f4f6;
    }
    .box {
      border: 1px solid #000;
      padding: 10px;
      margin: 12px 0;
      border-radius: 4px;
    }
    .box-title {
      font-weight: 900;
      font-size: 13px;
      margin-bottom: 8px;
      border-bottom: 1px solid #ccc;
      padding-bottom: 4px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin-bottom: 14px;
    }
    .stat-card {
      border: 1px solid #000;
      padding: 8px;
      text-align: center;
      background: #f9fafb;
    }
    .stat-val {
      font-size: 16px;
      font-weight: 900;
    }
    .stat-lbl {
      font-size: 11px;
      color: #374151;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0;
      font-size: 11.5px;
    }
    th, td {
      border: 1px solid #000;
      padding: 5px 7px;
      text-align: right;
    }
    th {
      background: #e5e7eb;
      font-weight: bold;
    }
    .signatures {
      margin-top: 26px;
      display: flex;
      justify-content: space-between;
      font-weight: bold;
      font-size: 13px;
    }
    .print-bar {
      background: #071710;
      color: #f5d77f;
      padding: 10px 16px;
      margin-bottom: 16px;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .print-btn {
      background: #d4af37;
      color: #071710;
      border: none;
      padding: 6px 14px;
      font-weight: bold;
      border-radius: 6px;
      cursor: pointer;
    }
    @media print {
      .print-bar { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="print-bar">
    <span>وثيقة رسمية جاهزة للطباعة أو الحفظ بصيغة PDF (اختر Save as PDF في نافذة الطباعة)</span>
    <button class="print-btn" onclick="window.print()">طباعة / حفظ كملف PDF</button>
  </div>
  <div class="header-box">
    <div style="font-size: 16px; font-weight: bold;">الجمهورية الجزائرية الديمقراطية الشعبية</div>
    <div style="font-size: 14px; font-weight: bold;">وزارة التربية الوطنية — ${stageMeta.name}</div>
    <div class="header-meta">
      <div>
        <div>${institution.wilaya}</div>
        <div>${institution.districtCenter}</div>
        <div>${institution.schoolName}</div>
      </div>
      <div style="text-align: left;">
        <div>المرجع: ${documentCode}</div>
        <div>السنة الدراسية: ${institution.schoolYear}</div>
        <div>تاريخ التحرير: ${dateStr}</div>
      </div>
    </div>
  </div>

  <div class="doc-title">${documentTitle}</div>

  <div>${bodyHtml}</div>

  <div class="signatures">
    <div>إمضاء وختم ${rankMeta.title}<br/>(${institution.counselorName})</div>
    <div>تأشيرة وختم مدير المؤسسة<br/>(${institution.principalName})</div>
  </div>
  ${autoPrint ? '<script>window.onload = function() { setTimeout(function(){ window.print(); }, 300); };</script>' : ''}
</body>
</html>`;

  // Also print in hidden iframe immediately so the user gets the native browser Save as PDF dialog right away
  try {
    const printIframe = document.createElement('iframe');
    printIframe.style.position = 'fixed';
    printIframe.style.right = '0';
    printIframe.style.bottom = '0';
    printIframe.style.width = '0';
    printIframe.style.height = '0';
    printIframe.style.border = '0';
    document.body.appendChild(printIframe);

    const doc = printIframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(fullHtml.replace('<script>window.onload = function() { setTimeout(function(){ window.print(); }, 300); };</script>', ''));
      doc.close();
      setTimeout(() => {
        printIframe.contentWindow?.focus();
        printIframe.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(printIframe);
        }, 2000);
      }, 250);
    }
  } catch {
    // Fallback download
  }

  // Also download the standalone printable file
  const blob = new Blob(['\uFEFF' + fullHtml], {
    type: 'text/html;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}_PDF_A4.html`;
  a.click();
  URL.revokeObjectURL(url);
}
