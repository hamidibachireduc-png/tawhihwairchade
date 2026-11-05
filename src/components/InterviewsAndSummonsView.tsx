import React, { useState } from 'react';
import {
  ClipboardList,
  BarChart3,
  Plus,
  Printer,
  MailWarning,
  UserCheck,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import {
  CounselingInterview,
  EducationStage,
  InstitutionInfo,
  InterviewDomain,
  InterviewSource,
  InterviewType,
  StudentCounselingRecord,
} from '../types';
import { COUNSELOR_RANKS, STAGE_METADATA } from '../data/initialData';

interface InterviewsAndSummonsViewProps {
  activeStage: EducationStage;
  institution: InstitutionInfo;
  students: StudentCounselingRecord[];
  interviews: CounselingInterview[];
  onAddInterview: (newInterview: Omit<CounselingInterview, 'id' | 'serialNumber'>) => void;
  onToggleVisa: (id: string) => void;
  onSelectStudentForModal: (student: StudentCounselingRecord, tab: 'profile' | 'summon') => void;
}

const INTERVIEW_TYPES: InterviewType[] = ['فردية', 'جماعية', 'مع الولي', 'استعجالية'];

const INTERVIEW_SOURCES: InterviewSource[] = [
  'تلقائي (المستشار)',
  'بطلب التلميذ',
  'إحالة الناظر / مستشار التربية',
  'إحالة أستاذ',
  'بطلب الولي',
  'رادار الإنذار المبكر',
];

const INTERVIEW_DOMAINS: InterviewDomain[] = [
  'توجيه مدرسي ومهني',
  'توافق نفسي وتربوي',
  'تحصيل ومنهجية استذكار',
  'سلوكي وانضباطي',
  'عائلي واجتماعي',
  'وقاية صحية (UDS)',
];

export const InterviewsAndSummonsView: React.FC<InterviewsAndSummonsViewProps> = ({
  activeStage,
  institution,
  students,
  interviews,
  onAddInterview,
  onToggleVisa,
  onSelectStudentForModal,
}) => {
  const [activeTab, setActiveTab] = useState<'registry' | 'bilan'>('registry');
  const stageStudents = students.filter((s) => s.stage === activeStage);

  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    stageStudents[0]?.id || students[0]?.id || ''
  );
  const [interviewType, setInterviewType] = useState<InterviewType>('فردية');
  const [source, setSource] = useState<InterviewSource>('تلقائي (المستشار)');
  const [domain, setDomain] = useState<InterviewDomain>('توجيه مدرسي ومهني');
  const [date, setDate] = useState<string>('2026-11-05');
  const [time, setTime] = useState<string>('10:00');
  const [summary, setSummary] = useState<string>('');
  const [followUpPlan, setFollowUpPlan] = useState<string>('');
  const [requiresParentSummon, setRequiresParentSummon] = useState<boolean>(false);

  const nextSerialPreview = `2026/${String(interviews.length + 1).padStart(3, '0')}`;
  const stageMeta = STAGE_METADATA[activeStage];
  const rankMeta = COUNSELOR_RANKS[institution.rankKey];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s) => s.id === selectedStudentId);
    if (!st) return;

    onAddInterview({
      date,
      time,
      term: institution.currentTerm,
      stage: st.stage,
      studentId: st.id,
      studentName: st.fullName,
      studentGroup: st.group,
      gender: st.gender,
      interviewType,
      source,
      domain,
      summary:
        summary.trim() ||
        'جلسة إرشادية لتشخيص الصعوبات المدرسية وبناء خطة عمل فردية لتحسين المردود الدراسي.',
      followUpPlan:
        followUpPlan.trim() ||
        'برمجة مقابلة تتبعية بعد أسبوعين والتنسيق مع الأستاذ الرئيسي للفوج.',
      counselorVisa: true,
      requiresParentSummon,
    });

    setSummary('');
    setFollowUpPlan('');
  };

  // حساب إحصائيات الحصيلة الفصلية والسنوية آلياً
  const byDomainStats = INTERVIEW_DOMAINS.map((dom) => {
    const list = interviews.filter((i) => i.domain === dom);
    return {
      domain: dom,
      total: list.length,
      male: list.filter((i) => i.gender === 'ذكر').length,
      female: list.filter((i) => i.gender === 'أنثى').length,
      withParent: list.filter((i) => i.interviewType === 'مع الولي').length,
    };
  });

  const bySourceStats = INTERVIEW_SOURCES.map((src) => ({
    source: src,
    count: interviews.filter((i) => i.source === src).length,
  }));

  return (
    <div className="space-y-6">
      {/* التبويبات وأزرار الطباعة */}
      <div className="bg-[#081c13] border border-[#d4af37]/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('registry')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'registry'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] shadow-md'
                : 'bg-[#05140d] text-slate-300 border border-[#d4af37]/30 hover:text-white'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>سجل المقابلات المقنن ({interviews.length} مقابلة)</span>
          </button>

          <button
            onClick={() => setActiveTab('bilan')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'bilan'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] shadow-md'
                : 'bg-[#05140d] text-slate-300 border border-[#d4af37]/30 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>الحصيلة الفصلية والسنوية المستخرجة آلياً</span>
          </button>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow"
        >
          <Printer className="w-4 h-4" />
          <span>طباعة السجل / الحصيلة الرسمية A4</span>
        </button>
      </div>

      {activeTab === 'registry' ? (
        <div className="space-y-6">
          {/* استمارة تدوين مقابلة إرشادية جديدة */}
          <form
            onSubmit={handleSubmit}
            className="bg-[#081c13] border border-[#d4af37]/40 rounded-2xl p-5 space-y-4 text-xs no-print"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#d4af37]/20 pb-3">
              <h3 className="text-sm sm:text-base font-black text-[#f5d77f] flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#d4af37]" />
                <span>تدوين مقابلة إرشادية جديدة في السجل المقنن</span>
              </h3>
              <span className="px-3 py-1 rounded-lg bg-[#05140d] border border-[#d4af37]/40 font-mono font-black text-emerald-300 tabular-nums">
                الترقيم التسلسلي الآلي القادم: {nextSerialPreview}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">التلميذ(ة) المعني(ة):</label>
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
                <label className="block text-slate-300 font-bold mb-1">نوع المقابلة:</label>
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value as InterviewType)}
                  className="w-full px-3 py-2 rounded-xl bg-[#05140d] border border-[#d4af37]/40 text-white"
                >
                  {INTERVIEW_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">مصدر المقابلة / الإحالة:</label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value as InterviewSource)}
                  className="w-full px-3 py-2 rounded-xl bg-[#05140d] border border-[#d4af37]/40 text-white"
                >
                  {INTERVIEW_SOURCES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">مجال المقابلة:</label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value as InterviewDomain)}
                  className="w-full px-3 py-2 rounded-xl bg-[#05140d] border border-[#d4af37]/40 text-white"
                >
                  {INTERVIEW_DOMAINS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">ملخص المقابلة والتشخيص:</label>
                <input
                  type="text"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="وقائع المقابلة وأهم الملاحظات المسجلة..."
                  className="w-full px-3 py-2 rounded-xl bg-[#05140d] border border-[#d4af37]/40 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">خطة المتابعة والتكفل:</label>
                <input
                  type="text"
                  value={followUpPlan}
                  onChange={(e) => setFollowUpPlan(e.target.value)}
                  placeholder="الإجراءات المتفق عليها مع التلميذ / الولي..."
                  className="w-full px-3 py-2 rounded-xl bg-[#05140d] border border-[#d4af37]/40 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">التاريخ:</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-[#05140d] border border-[#d4af37]/40 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">الساعة:</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-[#05140d] border border-[#d4af37]/40 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requiresParentSummon}
                  onChange={(e) => setRequiresParentSummon(e.target.checked)}
                  className="rounded border-[#d4af37]"
                />
                <span>تتطلب الحالة تحرير استدعاء رسمي لولي الأمر</span>
              </label>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] font-black flex items-center gap-1.5 cursor-pointer shadow-lg"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>تثبيت في سجل المقابلات المقنن ({nextSerialPreview})</span>
              </button>
            </div>
          </form>

          {/* جدول سجل المقابلات المقنن */}
          <div className="bg-[#081c13] print:bg-white print:text-black border border-[#d4af37]/40 print:border-black rounded-2xl p-5 shadow-xl space-y-4 print-only-sheet">
            <div className="text-center border-b border-[#d4af37]/25 print:border-black pb-3">
              <div className="text-xs font-bold text-[#f5d77f] print:text-black">
                الجمهورية الجزائرية الديمقراطية الشعبية · وزارة التربية الوطنية · {institution.wilaya}
              </div>
              <h3 className="text-base sm:text-lg font-black text-white print:text-black mt-1">
                سجل المقابلات الإرشادية المقنن — {institution.schoolName} ({institution.schoolYear})
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs border-collapse">
                <thead>
                  <tr className="bg-[#05140d] print:bg-gray-200 text-[#f5d77f] print:text-black border-b border-[#d4af37]/30 print:border-black">
                    <th className="p-2.5">الرقم التسلسلي</th>
                    <th className="p-2.5">التاريخ والساعة</th>
                    <th className="p-2.5">هوية التلميذ(ة) والفوج</th>
                    <th className="p-2.5">نوع ومصدر المقابلة</th>
                    <th className="p-2.5">المجال</th>
                    <th className="p-2.5">ملخص المقابلة وخطة المتابعة</th>
                    <th className="p-2.5 text-center">تأشيرة المستشار</th>
                    <th className="p-2.5 no-print">استدعاء الولي / الملف</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d4af37]/15 print:divide-black">
                  {interviews.map((item) => {
                    const stObj = students.find((s) => s.id === item.studentId);
                    return (
                      <tr key={item.id} className="hover:bg-[#0c291c]/50">
                        <td className="p-2.5 font-mono font-black text-[#f5d77f] print:text-black tabular-nums">
                          {item.serialNumber}
                        </td>
                        <td className="p-2.5 font-mono tabular-nums">
                          <div>{item.date}</div>
                          <div className="text-[10px] text-slate-400 print:text-black">{item.time}</div>
                        </td>
                        <td className="p-2.5">
                          <div className="font-bold text-white print:text-black">
                            {item.studentName}
                          </div>
                          <div className="text-[11px] text-emerald-300 print:text-black">
                            {item.studentGroup} ({item.gender})
                          </div>
                        </td>
                        <td className="p-2.5">
                          <div className="font-bold">{item.interviewType}</div>
                          <div className="text-[11px] text-slate-400 print:text-black">
                            {item.source}
                          </div>
                        </td>
                        <td className="p-2.5 font-bold text-[#f5d77f] print:text-black">
                          {item.domain}
                        </td>
                        <td className="p-2.5 max-w-md space-y-1 leading-relaxed">
                          <div>{item.summary}</div>
                          <div className="text-emerald-300 print:text-black font-semibold">
                            المتابعة: {item.followUpPlan}
                          </div>
                        </td>
                        <td className="p-2.5 text-center">
                          <button
                            type="button"
                            onClick={() => onToggleVisa(item.id)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer ${
                              item.counselorVisa
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                                : 'bg-slate-800 text-slate-400'
                            } print:bg-transparent print:text-black print:border-black`}
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>{item.counselorVisa ? 'مؤشر ✓' : 'قيد التأشير'}</span>
                          </button>
                        </td>
                        <td className="p-2.5 no-print">
                          {stObj && (
                            <div className="flex flex-col gap-1">
                              <button
                                onClick={() => onSelectStudentForModal(stObj, 'summon')}
                                className="px-2.5 py-1 rounded-lg bg-[#8f1414] hover:bg-[#a61919] text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <MailWarning className="w-3 h-3" />
                                <span>طباعة استدعاء</span>
                              </button>
                              <button
                                onClick={() => onSelectStudentForModal(stObj, 'profile')}
                                className="px-2.5 py-1 rounded-lg bg-[#0d3522] text-emerald-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <UserCheck className="w-3 h-3" />
                                <span>ملف التلميذ</span>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* التبويب 2: الحصيلة الفصلية والسنوية المستخرجة آلياً */
        <div className="bg-white text-black p-6 sm:p-8 rounded-2xl border-2 border-black shadow-2xl space-y-6 print-only-sheet">
          <div className="text-center border-b-2 border-black pb-4">
            <div className="font-bold text-base">الجمهورية الجزائرية الديمقراطية الشعبية</div>
            <div className="font-bold text-sm">وزارة التربية الوطنية — {institution.wilaya}</div>
            <div className="text-xs font-semibold mt-1">
              {institution.districtCenter} · {institution.schoolName} · الفصل الدراسي:{' '}
              {institution.currentTerm} ({institution.schoolYear})
            </div>
            <h2 className="text-lg sm:text-xl font-black mt-3 underline">
              الحصيلة الإحصائية الفصلية والسنوية للمقابلات الإرشادية واستقبال الأولياء
            </h2>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-black bg-gray-100 p-2 border border-black">
              1. توزيع المقابلات الإرشادية حسب مجالات التدخل والجنس:
            </h3>
            <table className="w-full text-right text-xs border-collapse border border-black">
              <thead>
                <tr className="bg-gray-200 font-bold">
                  <th className="border border-black p-2">مجال المقابلة الإرشادية</th>
                  <th className="border border-black p-2 text-center">الذكور</th>
                  <th className="border border-black p-2 text-center">الإناث</th>
                  <th className="border border-black p-2 text-center">المجموع</th>
                  <th className="border border-black p-2 text-center">منها مقابلات مع الأولياء</th>
                </tr>
              </thead>
              <tbody>
                {byDomainStats.map((row) => (
                  <tr key={row.domain} className="font-mono tabular-nums">
                    <td className="border border-black p-2 font-sans font-bold">{row.domain}</td>
                    <td className="border border-black p-2 text-center">{row.male}</td>
                    <td className="border border-black p-2 text-center">{row.female}</td>
                    <td className="border border-black p-2 text-center font-bold">{row.total}</td>
                    <td className="border border-black p-2 text-center">{row.withParent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-black bg-gray-100 p-2 border border-black">
              2. توزيع المقابلات حسب مصدر الإحالة والطلب:
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              {bySourceStats.map((s) => (
                <div
                  key={s.source}
                  className="p-3 border border-black rounded bg-gray-50 flex items-center justify-between"
                >
                  <span className="font-bold">{s.source}:</span>
                  <span className="font-mono font-black text-base tabular-nums">{s.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 pt-6 text-xs font-bold text-center">
            <div>إمضاء وختم {rankMeta.title} ({stageMeta.shortName})</div>
            <div>تأشيرة وختم مدير المؤسسة</div>
          </div>
        </div>
      )}
    </div>
  );
};
