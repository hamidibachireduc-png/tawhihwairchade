import React, { useState } from 'react';
import {
  Database,
  Upload,
  Download,
  Cloud,
  ShieldCheck,
  Wifi,
  WifiOff,
  CheckCircle2,
  Lock,
  FileSpreadsheet,
  RefreshCw,
} from 'lucide-react';
import {
  EducationStage,
  InstitutionInfo,
  StudentCounselingRecord,
} from '../types';

interface DigitalizationAndSecurityViewProps {
  activeStage: EducationStage;
  institution: InstitutionInfo;
  students: StudentCounselingRecord[];
  onImportStudents: (imported: StudentCounselingRecord[]) => void;
  isOnline: boolean;
  lastSyncedAt: string | null;
  onTriggerCloudSync: () => void;
  onOpenProtectedAuth: () => void;
  onExportEncryptedBackup: () => void;
}

export const DigitalizationAndSecurityView: React.FC<DigitalizationAndSecurityViewProps> = ({
  activeStage,
  institution,
  students,
  onImportStudents,
  isOnline,
  lastSyncedAt,
  onTriggerCloudSync,
  onOpenProtectedAuth,
  onExportEncryptedBackup,
}) => {
  const [importMessage, setImportMessage] = useState<string | null>(null);

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const content = String(reader.result || '');
      const lines = content
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);

      if (lines.length < 2) {
        setImportMessage('الملف المرفوع فارغ أو لا يحتوي على صفوف بيانات كافية.');
        return;
      }

      const importedList: StudentCounselingRecord[] = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(/[;,]/).map((c) => c.trim());
        if (cols.length < 3) continue;

        const fullName = cols[1] || `تلميذ مستورد ${i}`;
        const group = cols[2] || (activeStage === 'middle' ? '4 م 1' : '1 ج.م.ع.ت 1');
        const term1Avg = parseFloat(cols[3]) || 12.5;
        const term2Avg = parseFloat(cols[4]) || 12.8;
        const mathGrade = parseFloat(cols[5]) || 13.0;
        const physicsGrade = parseFloat(cols[6]) || 12.5;
        const scienceGrade = parseFloat(cols[7]) || 13.0;
        const arabicGrade = parseFloat(cols[8]) || 13.5;
        const wish1 =
          cols[9] ||
          (activeStage === 'middle' ? 'جذع مشترك علوم وتكنولوجيا' : 'علوم تجريبية');

        importedList.push({
          id: `imp-${Date.now()}-${i}`,
          matricule: cols[0] || `2026990${i}`,
          fullName,
          gender: i % 2 === 0 ? 'أنثى' : 'ذكر',
          birthDate: '2010-05-15',
          stage: activeStage,
          level: activeStage === 'middle' ? '4 متوسط' : '1 ثانوي ج.م.ع.ت',
          group,
          term1Avg,
          term2Avg,
          term3Avg: Number(((term1Avg + term2Avg) / 2).toFixed(2)),
          mathGrade,
          physicsGrade,
          scienceGrade,
          arabicGrade,
          frenchGrade: 12.5,
          englishGrade: 13.0,
          historyGeoGrade: 13.0,
          unjustifiedAbsences: parseInt(cols[10] || '0', 10) || 0,
          justifiedAbsences: 1,
          behaviorNotesCount: 0,
          psychologicalAlertLevel: 'normal',
          wishCardCompleted: true,
          wish1,
          wish2: activeStage === 'middle' ? 'جذع مشترك آداب' : 'تسيير واقتصاد',
          wish3: 'تكوين مهني',
          councilProposal: wish1,
          finalOrientationDecision: wish1,
          orientationStatus: 'satisfied_1',
          hollandCode: 'ISA',
          hollandScores: { R: 18, I: 25, A: 19, S: 23, E: 15, C: 17 },
          parentName: `ولي ${fullName}`,
          parentPhone: '0550001122',
        });
      }

      if (importedList.length > 0) {
        onImportStudents(importedList);
        setImportMessage(
          `تم استيراد ودمج ${importedList.length} تلميذ من ملف الرقمنة (${file.name}) بنجاح وتحديث الرادار الذكي ✓`
        );
      }
    };
    reader.readAsText(file, 'utf-8');
  };

  const handleDownloadSampleCsv = () => {
    const csvHeader =
      'رقم_التعريف,الاسم_واللقب,الفوج,معدل_ف1,معدل_ف2,الرياضيات,الفيزياء,العلوم,العربية,الرغبة_الأولى,الغيابات_غير_المبررة\n';
    const sampleRows =
      '2026160901,تومي محمد الأمين,1 ج.م.ع.ت 1,14.50,15.10,16.0,15.5,15.0,14.0,علوم تجريبية,0\n' +
      '2026160902,سليماني نور الهدى,1 ج.م.ع.ت 1,10.80,8.90,8.5,9.0,10.0,12.5,تسيير واقتصاد,5\n';

    const blob = new Blob(['\uFEFF' + csvHeader + sampleRows], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'نموذج_استيراد_الرقمنة_مستشار_التوجيه_2026.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleOneClickDemoImport = () => {
    const demoBatch: StudentCounselingRecord[] = [
      {
        id: `amatti-${Date.now()}-1`,
        matricule: '20268801',
        fullName: 'حمزاوي لقمان عبد الصمد',
        gender: 'ذكر',
        birthDate: '2010-02-20',
        stage: activeStage,
        level: activeStage === 'middle' ? '4 متوسط' : '1 ثانوي ج.م.ع.ت',
        group: activeStage === 'middle' ? '4 م 1' : '1 ج.م.ع.ت 1',
        term1Avg: 15.2,
        term2Avg: 15.7,
        term3Avg: 15.9,
        mathGrade: 16.5,
        physicsGrade: 16.0,
        scienceGrade: 15.5,
        arabicGrade: 14.5,
        frenchGrade: 14.0,
        englishGrade: 15.0,
        historyGeoGrade: 14.5,
        unjustifiedAbsences: 0,
        justifiedAbsences: 0,
        behaviorNotesCount: 0,
        psychologicalAlertLevel: 'normal',
        wishCardCompleted: true,
        wish1: activeStage === 'middle' ? 'جذع مشترك علوم وتكنولوجيا' : 'رياضيات',
        wish2: activeStage === 'middle' ? 'جذع مشترك آداب' : 'علوم تجريبية',
        wish3: 'تقني رياضي',
        councilProposal: activeStage === 'middle' ? 'جذع مشترك علوم وتكنولوجيا' : 'رياضيات',
        finalOrientationDecision:
          activeStage === 'middle' ? 'جذع مشترك علوم وتكنولوجيا' : 'رياضيات',
        orientationStatus: 'satisfied_1',
        hollandCode: 'IRC',
        hollandScores: { R: 23, I: 28, A: 12, S: 15, E: 16, C: 24 },
        parentName: 'حمزاوي عز الدين',
        parentPhone: '0661998877',
      },
    ];
    onImportStudents(demoBatch);
    setImportMessage(
      'تم استيراد بيانات الرقمنة النموذجية تلقائياً وتحديث قوائم التوجيه والرادار الذكي ✓'
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. الاستيراد من الرقمنة (Amatti Excel / CSV) */}
        <div className="bg-[#081c13] border border-[#d4af37]/40 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-3">
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#f5d77f] flex items-center gap-2">
                <Database className="w-5 h-5 text-[#d4af37]" />
                <span>الاستيراد التلقائي من أرضية الرقمنة (Excel / CSV)</span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                رفع ملفات قوائم التلاميذ، النقاط الفصلية، الغيابات، وبطاقات الرغبات دفعة واحدة
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-xs font-mono tabular-nums">
              {students.length} تلميذ مسجل
            </span>
          </div>

          <div className="border-2 border-dashed border-[#d4af37]/40 rounded-2xl p-6 text-center bg-[#05140d]/80 space-y-3">
            <FileSpreadsheet className="w-10 h-10 text-[#d4af37] mx-auto" />
            <div className="text-sm font-black text-white">
              ارفع ملف الرقمنة بصيغة CSV أو Excel المصدّر بصيغة CSV
            </div>
            <p className="text-xs text-slate-400">
              يتم حساب المعدلات ومجموعات التوجيه (علوم/آداب) ومؤشر الخطورة المركب (/100) آلياً فور الرفع
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              <label className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] font-black text-xs cursor-pointer flex items-center gap-1.5 shadow">
                <Upload className="w-4 h-4" />
                <span>رفع ملف الرقمنة (CSV)</span>
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleCsvUpload}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={handleDownloadSampleCsv}
                className="px-4 py-2.5 rounded-xl bg-[#0d3522] text-emerald-200 border border-emerald-500/30 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>تحميل نموذج CSV للرقمنة</span>
              </button>

              <button
                type="button"
                onClick={handleOneClickDemoImport}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-[#f5d77f] border border-[#d4af37]/30 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>محاكاة استيراد فوري</span>
              </button>
            </div>
          </div>

          {importMessage && (
            <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{importMessage}</span>
            </div>
          )}
        </div>

        {/* 2. الأمان والعمل الميداني دون إنترنت (Offline + Encrypted Cloud Sync) */}
        <div className="bg-[#081c13] border border-[#d4af37]/40 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-3">
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#f5d77f] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#10b981]" />
                <span>الأمان والعمل الميداني (Offline + مزامنة سحابية مشفرة)</span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                حفظ فوري على الجهاز دون إنترنت مع مزامنة سحابية مشفرة عند توفر الاتصال
              </p>
            </div>

            <span
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 border ${
                isOnline
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-950 text-amber-300 border-amber-500/40'
              }`}
            >
              {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              <span>{isOnline ? 'متصل بالسحابة المشفرة' : 'وضع العمل دون إنترنت'}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-[#05140d] border border-[#d4af37]/25 space-y-1.5">
              <div className="font-black text-[#f5d77f] flex items-center gap-1.5">
                <Lock className="w-4 h-4" />
                <span>الدخول المهني المحمي (رتب التوجيه الـ 4)</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                حالة الشهادة:{' '}
                <strong className="text-emerald-300">
                  {institution.isVerifiedCertificate
                    ? `موثقة (${institution.certificateRef})`
                    : 'قيد التحقق'}
                </strong>
              </p>
              <button
                type="button"
                onClick={onOpenProtectedAuth}
                className="mt-2 w-full py-2 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] font-black cursor-pointer"
              >
                فتح ماسح شهادة العمل الذكي
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#05140d] border border-[#d4af37]/25 space-y-1.5">
              <div className="font-black text-emerald-300 flex items-center gap-1.5">
                <Cloud className="w-4 h-4" />
                <span>المزامنة السحابية المشفرة (AES/SHA)</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                آخر مزامنة:{' '}
                <strong className="font-mono text-white">
                  {lastSyncedAt || 'محفوظ محلياً بشكل فوري'}
                </strong>
              </p>
              <button
                type="button"
                onClick={onTriggerCloudSync}
                className="mt-2 w-full py-2 rounded-lg bg-[#105e32] text-[#f5d77f] border border-[#d4af37]/40 font-bold cursor-pointer hover:bg-[#14743e]"
              >
                مزامنة سحابية مشفرة الآن
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#05140d] border border-[#d4af37]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="font-bold text-white">
                تصدير الحقيبة الرقمية المشفرة للمكتب (نسخة احتياطية كاملة):
              </div>
              <div className="text-slate-400 mt-0.5">
                تتضمن قوائم التلاميذ، سجل المقابلات المقنن، الحالات السرية، ومحاضر التوجيه.
              </div>
            </div>
            <button
              type="button"
              onClick={onExportEncryptedBackup}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-[#f5d77f] border border-[#d4af37]/40 font-bold flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>تصدير نسخة مشفرة (.json)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
