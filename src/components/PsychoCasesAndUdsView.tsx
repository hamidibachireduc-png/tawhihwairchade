import React, { useState } from 'react';
import {
  HeartHandshake,
  ShieldAlert,
  Stethoscope,
  Plus,
  Printer,
  UserCheck,
  MailWarning,
  Lock,
} from 'lucide-react';
import {
  EducationStage,
  InstitutionInfo,
  PsychoPedagogicalCase,
  SpecialCaseCategory,
  StudentCounselingRecord,
} from '../types';
import { COUNSELOR_RANKS } from '../data/initialData';

interface PsychoCasesAndUdsViewProps {
  activeStage: EducationStage;
  institution: InstitutionInfo;
  students: StudentCounselingRecord[];
  cases: PsychoPedagogicalCase[];
  onAddCase: (newCase: Omit<PsychoPedagogicalCase, 'id' | 'caseCode'>) => void;
  onSelectStudentForModal: (student: StudentCounselingRecord, tab: 'profile' | 'summon') => void;
}

const CASE_CATEGORIES: SpecialCaseCategory[] = [
  'التنمر المدرسي',
  'القلق الدراسي وقلق الامتحانات',
  'صعوبات التعلم',
  'التأخر الدراسي والتسرب',
  'الوقاية من المخدرات والتدخين (UDS)',
];

export const PsychoCasesAndUdsView: React.FC<PsychoCasesAndUdsViewProps> = ({
  institution,
  students,
  cases,
  onAddCase,
  onSelectStudentForModal,
}) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [showUdsCardModal, setShowUdsCardModal] = useState<PsychoPedagogicalCase | null>(
    null
  );

  // نموذج فتح ملف متابعة نفسية تربوية جديد أو بطاقة UDS
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [category, setCategory] = useState<SpecialCaseCategory>(
    'الوقاية من المخدرات والتدخين (UDS)'
  );
  const [symptomsInput, setSymptomsInput] = useState<string>('');
  const [diagnosisSummary, setDiagnosisSummary] = useState<string>('');
  const [interventionPlan, setInterventionPlan] = useState<string>('');
  const [isReferredToUds, setIsReferredToUds] = useState<boolean>(true);
  const [udsDoctorName, setUdsDoctorName] = useState<string>('د. بن تومي سهام (طبيبة وحدة UDS)');
  const [smokingOrSubstanceType, setSmokingOrSubstanceType] = useState<string>(
    'تدخين مبكر / مؤشرات خطر سلوكي'
  );

  const filteredCases = cases.filter((c) =>
    selectedCategoryFilter === 'all' ? true : c.category === selectedCategoryFilter
  );

  const rankMeta = COUNSELOR_RANKS[institution.rankKey];

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s) => s.id === selectedStudentId);
    if (!st) return;

    const symptomsList = symptomsInput
      .split('،')
      .map((x) => x.trim())
      .filter(Boolean);

    onAddCase({
      studentId: st.id,
      studentName: st.fullName,
      stage: st.stage,
      group: st.group,
      category,
      openedDate: new Date().toISOString().slice(0, 10),
      confidentialityLevel:
        category === 'الوقاية من المخدرات والتدخين (UDS)'
          ? 'سري للغاية (ملف خاص)'
          : 'سري',
      symptomsAndIndicators:
        symptomsList.length > 0
          ? symptomsList
          : ['تراجع مفاجئ في التركيز والتحصيل', 'غيابات متكررة ومؤشرات قلق أو انعزال'],
      udsCoordination: {
        isReferredToUds:
          category === 'الوقاية من المخدرات والتدخين (UDS)' || isReferredToUds,
        udsDoctorName: udsDoctorName,
        referralDate: new Date().toISOString().slice(0, 10),
        udsProtocolCode: `UDS-PREV-2026-${Math.floor(10 + Math.random() * 89)}`,
        udsFollowUpStatus: 'تحت المتابعة الطبية النفسية',
        smokingOrSubstanceType,
      },
      sessionsCount: 1,
      diagnosisSummary:
        diagnosisSummary.trim() ||
        'حالة تتطلب مرافقة نفسية تربوية منتظمة وتنسيقاً وقائياً لحماية المسار الدراسي للتلميذ.',
      interventionPlan:
        interventionPlan.trim() ||
        '1. جلسات إصغاء فردية سرية. 2. تنسيق مع وحدة الكشف والمتابعة UDS. 3. إشراك الولي في خطة المرافقة.',
      status: 'نشطة (قيد التكفل)',
    });

    setSymptomsInput('');
    setDiagnosisSummary('');
    setInterventionPlan('');
  };

  return (
    <div className="space-y-6">
      {/* شريط الفئات الخاصة والوقاية من المخدرات والتدخين UDS */}
      <div className="bg-[#081c13] border border-[#d4af37]/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedCategoryFilter('all')}
            className={`px-3 py-2 rounded-xl text-xs font-black cursor-pointer transition-all ${
              selectedCategoryFilter === 'all'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710]'
                : 'bg-[#05140d] text-slate-300 border border-[#d4af37]/30'
            }`}
          >
            جميع الحالات الخاصة ({cases.length})
          </button>
          {CASE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                selectedCategoryFilter === cat
                  ? 'bg-[#105e32] text-[#f5d77f] border border-[#d4af37]'
                  : 'bg-[#05140d] text-slate-300 border border-[#d4af37]/20 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>طباعة سجل المتابعة السري</span>
        </button>
      </div>

      {/* نموذج فتح ملف حالة جديدة / بطاقة تدخل UDS */}
      <form
        onSubmit={handleCreateCase}
        className="bg-[#081c13] border border-[#d4af37]/40 rounded-2xl p-5 space-y-4 text-xs no-print"
      >
        <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-3">
          <h3 className="text-sm sm:text-base font-black text-[#f5d77f] flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#d4af37]" />
            <span>فتح بطاقة حالة نفسية-تربوية أو بطاقة تدخل وقائي مع وحدة الكشف والمتابعة (UDS)</span>
          </h3>
          <span className="px-2.5 py-1 rounded bg-rose-950/90 text-rose-300 border border-rose-500/40 font-bold flex items-center gap-1">
            <Lock className="w-3.5 h-3.5" />
            <span>محمي بالسر المهني</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-slate-300 font-bold mb-1">التلميذ(ة):</label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#05140d] border border-[#d4af37]/40 text-white"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fullName} ({s.group})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">تصنيف الفئة الخاصة:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as SpecialCaseCategory)}
              className="w-full px-3 py-2 rounded-xl bg-[#05140d] border border-[#d4af37]/40 text-white"
            >
              {CASE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">
              مؤشرات الرصد والأعراض الملاحظة (افصل بفاصلة):
            </label>
            <input
              type="text"
              value={symptomsInput}
              onChange={(e) => setSymptomsInput(e.target.value)}
              placeholder="مثال: انعزال، قلق، غياب مسائي، تدخين..."
              className="w-full px-3 py-2 rounded-xl bg-[#05140d] border border-[#d4af37]/40 text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-bold mb-1">ملخص التشخيص التربوي والنفسي:</label>
            <input
              type="text"
              value={diagnosisSummary}
              onChange={(e) => setDiagnosisSummary(e.target.value)}
              placeholder="التشخيص الأولي للحالة..."
              className="w-full px-3 py-2 rounded-xl bg-[#05140d] border border-[#d4af37]/40 text-white"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-bold mb-1">خطة التدخل والمرافقة المقترحة:</label>
            <input
              type="text"
              value={interventionPlan}
              onChange={(e) => setInterventionPlan(e.target.value)}
              placeholder="جلسات الإصغاء، تعديل السلوك، الإحالة..."
              className="w-full px-3 py-2 rounded-xl bg-[#05140d] border border-[#d4af37]/40 text-white"
            />
          </div>
        </div>

        {/* قسم التنسيق مع وحدة الكشف والمتابعة UDS */}
        <div className="p-3.5 rounded-xl bg-[#05140d] border border-emerald-500/30 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div>
            <label className="flex items-center gap-2 text-emerald-300 font-bold mb-1 cursor-pointer">
              <input
                type="checkbox"
                checked={isReferredToUds}
                onChange={(e) => setIsReferredToUds(e.target.checked)}
              />
              <Stethoscope className="w-4 h-4" />
              <span>تفعيل بطاقة التنسيق مع وحدة الكشف والمتابعة (UDS)</span>
            </label>
            <input
              type="text"
              value={udsDoctorName}
              onChange={(e) => setUdsDoctorName(e.target.value)}
              placeholder="اسم طبيب أو أخصائي نفساني وحدة UDS"
              className="w-full px-3 py-1.5 rounded-lg bg-[#092116] border border-[#d4af37]/30 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">
              طبيعة الوقاية (التدخين / المؤثرات / الفحص النفسي):
            </label>
            <input
              type="text"
              value={smokingOrSubstanceType}
              onChange={(e) => setSmokingOrSubstanceType(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-[#092116] border border-[#d4af37]/30 text-white"
            />
          </div>

          <button
            type="submit"
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] font-black flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
          >
            <HeartHandshake className="w-4 h-4" />
            <span>حفظ الحالة وإصدار بطاقة المتابعة</span>
          </button>
        </div>
      </form>

      {/* قائمة البطاقات المقننة للحالات النفسية التربوية ووحدة UDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCases.map((c) => {
          const stObj = students.find((s) => s.id === c.studentId);
          return (
            <div
              key={c.id}
              className="p-5 rounded-2xl bg-[#081c13] border border-[#d4af37]/40 shadow-xl flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#d4af37]/20 pb-2">
                  <div>
                    <span className="font-mono text-xs text-[#f5d77f] font-black">
                      {c.caseCode}
                    </span>
                    <h4 className="text-base font-black text-white mt-0.5">
                      {c.studentName} ({c.group})
                    </h4>
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-amber-300">{c.category}</div>
                    <div className="text-[10px] text-emerald-300">{c.status}</div>
                  </div>
                </div>

                <div className="text-xs space-y-1">
                  <div className="font-bold text-slate-300">مؤشرات الرصد الميداني:</div>
                  <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                    {c.symptomsAndIndicators.map((sym, idx) => (
                      <li key={idx}>{sym}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-[#05140d] border border-[#d4af37]/20 text-xs space-y-1">
                  <div>
                    <strong className="text-[#f5d77f]">التشخيص التربوي السري: </strong>
                    <span className="text-slate-200">{c.diagnosisSummary}</span>
                  </div>
                  <div>
                    <strong className="text-emerald-300">خطة التكفل ({c.sessionsCount} جلسات): </strong>
                    <span className="text-slate-200">{c.interventionPlan}</span>
                  </div>
                </div>

                {c.udsCoordination.isReferredToUds && (
                  <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-xs space-y-1">
                    <div className="font-black text-emerald-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Stethoscope className="w-4 h-4" />
                        <span>بطاقة تنسيق مقننة مع وحدة الكشف والمتابعة (UDS)</span>
                      </span>
                      <span className="font-mono text-[11px]">
                        {c.udsCoordination.udsProtocolCode}
                      </span>
                    </div>
                    <div className="text-slate-200">
                      الطبيب/الأخصائي المنسق: <strong>{c.udsCoordination.udsDoctorName}</strong>
                    </div>
                    <div className="text-amber-200">
                      موضوع التدخل الوقائي: {c.udsCoordination.smokingOrSubstanceType}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#d4af37]/20 flex flex-wrap items-center justify-between gap-2 no-print">
                <button
                  onClick={() => setShowUdsCardModal(c)}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] text-xs font-black flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>طباعة بطاقة التدخل السرية (UDS)</span>
                </button>

                {stObj && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onSelectStudentForModal(stObj, 'profile')}
                      className="px-2.5 py-1.5 rounded-xl bg-[#0d3522] text-emerald-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>الملف الفردي</span>
                    </button>
                    <button
                      onClick={() => onSelectStudentForModal(stObj, 'summon')}
                      className="px-2.5 py-1.5 rounded-xl bg-[#8f1414] text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <MailWarning className="w-3.5 h-3.5" />
                      <span>استدعاء الولي</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* نافذة معاينة وطباعة بطاقة التدخل المقننة بالتنسيق مع UDS */}
      {showUdsCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 overflow-y-auto">
          <div className="bg-white text-black max-w-3xl w-full rounded-2xl p-6 sm:p-8 border-2 border-black shadow-2xl space-y-5 print-only-sheet">
            <div className="flex justify-between items-center border-b pb-3 no-print">
              <span className="font-black text-sm">
                معاينة بطاقة التدخل المقننة (الوقاية من المخدرات والتدخين — UDS)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                >
                  طباعة البطاقة A4
                </button>
                <button
                  onClick={() => setShowUdsCardModal(null)}
                  className="px-3 py-1.5 rounded-lg bg-gray-800 text-white text-xs font-bold cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </div>

            <div className="text-center border-b-2 border-black pb-3">
              <div className="font-bold text-base">الجمهورية الجزائرية الديمقراطية الشعبية</div>
              <div className="font-bold text-sm">
                وزارة التربية الوطنية · بالتنسيق مع وحدة الكشف والمتابعة للصحة المدرسية (UDS)
              </div>
              <div className="text-xs mt-1">
                {institution.wilaya} · {institution.schoolName} · السنة الدراسية:{' '}
                {institution.schoolYear}
              </div>
              <h2 className="text-lg font-black mt-2 border-2 border-black inline-block px-5 py-1 bg-gray-100">
                بطاقة تدخل ومتابعة مقننة (سرية) — رمز: {showUdsCardModal.caseCode}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs border border-black p-3 bg-gray-50">
              <div>
                <strong>اسم ولقب التلميذ(ة):</strong> {showUdsCardModal.studentName}
              </div>
              <div>
                <strong>الفوج التربوي:</strong> {showUdsCardModal.group}
              </div>
              <div>
                <strong>تصنيف الحالة:</strong> {showUdsCardModal.category}
              </div>
              <div>
                <strong>تاريخ فتح الملف:</strong> {showUdsCardModal.openedDate}
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 border border-black">
                <div className="font-bold underline mb-1">1. مؤشرات الرصد التربوي والنفسي:</div>
                <ul className="list-disc list-inside">
                  {showUdsCardModal.symptomsAndIndicators.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 border border-black">
                <div className="font-bold underline mb-1">
                  2. الملخص التشخيصي لمستشار التوجيه والإرشاد:
                </div>
                <p>{showUdsCardModal.diagnosisSummary}</p>
              </div>

              <div className="p-3 border border-black">
                <div className="font-bold underline mb-1">
                  3. بروتوكول التنسيق مع وحدة الكشف والمتابعة (UDS) والوقاية الصحية:
                </div>
                <p>
                  • الطبيب / الأخصائي النفساني المنسق:{' '}
                  <strong>{showUdsCardModal.udsCoordination.udsDoctorName || 'طبيب وحدة UDS'}</strong>
                </p>
                <p>
                  • خطة التكفل المشترك: {showUdsCardModal.interventionPlan}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 pt-6 text-xs font-bold text-center">
              <div>إمضاء {rankMeta.title}</div>
              <div>تأشيرة طبيب / نفساني وحدة UDS</div>
              <div>ختم مدير المؤسسة (سري)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
