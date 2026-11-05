import React, { useState } from 'react';
import {
  Compass,
  FileSpreadsheet,
  GitCompareArrows,
  Printer,
  CheckCircle2,
  Plus,
  UserCheck,
  Filter,
} from 'lucide-react';
import {
  EducationStage,
  InstitutionInfo,
  ReorientationRequest,
  StudentCounselingRecord,
} from '../types';
import {
  calculateOrientationMetrics,
  COUNSELOR_RANKS,
  STAGE_METADATA,
} from '../data/initialData';

interface OrientationAndMinutesViewProps {
  activeStage: EducationStage;
  institution: InstitutionInfo;
  students: StudentCounselingRecord[];
  onUpdateStudent: (updated: StudentCounselingRecord) => void;
  reorientationRequests: ReorientationRequest[];
  onAddReorientation: (req: Omit<ReorientationRequest, 'id'>) => void;
  onUpdateReorientationDecision: (
    id: string,
    decision: 'مقبول' | 'مرفوض' | 'قيد الدراسة'
  ) => void;
  onSelectStudentForModal: (student: StudentCounselingRecord, tab: 'profile' | 'summon') => void;
}

const STREAM_OPTIONS_4AM = [
  'جذع مشترك علوم وتكنولوجيا',
  'جذع مشترك آداب',
  'تكوين مهني',
];

const STREAM_OPTIONS_1AS = [
  'علوم تجريبية',
  'رياضيات',
  'تقني رياضي (هندسة ميكانيكية)',
  'تقني رياضي (هندسة كهربائية)',
  'تقني رياضي (هندسة مدنية)',
  'تقني رياضي (هندسة الطرائق)',
  'تسيير واقتصاد',
  'آداب وفلسفة',
  'لغات أجنبية',
];

export const OrientationAndMinutesView: React.FC<OrientationAndMinutesViewProps> = ({
  activeStage,
  institution,
  students,
  onUpdateStudent,
  reorientationRequests,
  onAddReorientation,
  onUpdateReorientationDecision,
  onSelectStudentForModal,
}) => {
  const [activeTab, setActiveTab] = useState<
    '4am_orientation' | '1as_orientation' | 'official_minutes' | 'reorientation_bridges'
  >(activeStage === 'middle' ? '4am_orientation' : '1as_orientation');

  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('all');

  // نموذج إضافة طلب إعادة توجيه (جسور إعادة التوجيه)
  const [selectedStudentIdForReor, setSelectedStudentIdForReor] = useState<string>(
    students[0]?.id || ''
  );
  const [requestedNewStream, setRequestedNewStream] = useState<string>(
    'تقني رياضي (هندسة مدنية)'
  );
  const [reorJustification, setReorJustification] = useState<string>('');
  const [reorCounselorOpinion, setReorCounselorOpinion] = useState<string>('');

  const middleStudents = students.filter((s) => s.stage === 'middle');
  const secondaryStudents = students.filter(
    (s) => s.stage === 'secondary' && s.level.startsWith('1 ثانوي')
  );

  const currentList =
    activeTab === '4am_orientation' ? middleStudents : secondaryStudents;
  const groups = Array.from(new Set(currentList.map((s) => s.group)));

  const filteredList = currentList.filter((s) =>
    selectedGroupFilter === 'all' ? true : s.group === selectedGroupFilter
  );

  const rankMeta = COUNSELOR_RANKS[institution.rankKey];
  const stageMeta = STAGE_METADATA[activeStage];

  const handleCreateReorientation = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s) => s.id === selectedStudentIdForReor);
    if (!st) return;
    const metrics = calculateOrientationMetrics(st);

    onAddReorientation({
      orderNumber: `ط.ت/2026/0${reorientationRequests.length + 1}`,
      studentId: st.id,
      studentName: st.fullName,
      stage: st.stage,
      group: st.group,
      currentStream: st.finalOrientationDecision,
      requestedStream: requestedNewStream,
      annualAverage: metrics.annualAvg,
      keySubjectsAverage: metrics.scienceGroupScore,
      justification:
        reorJustification.trim() ||
        'التماس عائلي وتربوي لمراجعة قرار التوجيه بما يتوافق مع ملمح التلميذ',
      counselorOpinion:
        reorCounselorOpinion.trim() ||
        `معدل التلميذ (${metrics.annualAvg}/20) وكود هولاند (${st.hollandCode}) يسمحان بدراسة الطلب في حدود المقاعد البيداغوجية.`,
      committeeDecision: 'قيد الدراسة',
      requestDate: new Date().toISOString().slice(0, 10),
    });

    setReorJustification('');
    setReorCounselorOpinion('');
  };

  // حساب إحصائيات المحضر النهائي الرسمي (4م + 1ث)
  const computeStreamStats = (list: StudentCounselingRecord[]) => {
    const streamMap: Record<
      string,
      { total: number; male: number; female: number; wish1Satisfied: number }
    > = {};

    list.forEach((s) => {
      const stream = s.finalOrientationDecision || 'غير محدد';
      if (!streamMap[stream]) {
        streamMap[stream] = { total: 0, male: 0, female: 0, wish1Satisfied: 0 };
      }
      streamMap[stream].total += 1;
      if (s.gender === 'ذكر') streamMap[stream].male += 1;
      else streamMap[stream].female += 1;
      if (s.wish1 === stream) streamMap[stream].wish1Satisfied += 1;
    });

    return Object.entries(streamMap);
  };

  const stats4AM = computeStreamStats(middleStudents);
  const stats1AS = computeStreamStats(secondaryStudents);

  return (
    <div className="space-y-6">
      {/* شريط التبويبات الـ 4 لتوجيه التلاميذ والمحاضر وجسور إعادة التوجيه */}
      <div className="bg-[#081c13] border border-[#d4af37]/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setActiveTab('4am_orientation');
              setSelectedGroupFilter('all');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === '4am_orientation'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] shadow-md'
                : 'bg-[#05140d] text-slate-300 border border-[#d4af37]/30 hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>توجيه 4 متوسط (الجذوع المشتركة)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('1as_orientation');
              setSelectedGroupFilter('all');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === '1as_orientation'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] shadow-md'
                : 'bg-[#05140d] text-slate-300 border border-[#d4af37]/30 hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>توجيه 1 ثانوي (الشعب الـ 6)</span>
          </button>

          <button
            onClick={() => setActiveTab('official_minutes')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'official_minutes'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] shadow-md'
                : 'bg-[#05140d] text-slate-300 border border-[#d4af37]/30 hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>المحاضر النهائية الرسمية (4م و 1ث)</span>
          </button>

          <button
            onClick={() => setActiveTab('reorientation_bridges')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'reorientation_bridges'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] shadow-md'
                : 'bg-[#05140d] text-slate-300 border border-[#d4af37]/30 hover:text-white'
            }`}
          >
            <GitCompareArrows className="w-4 h-4" />
            <span>جسور إعادة التوجيه ({reorientationRequests.length})</span>
          </button>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow"
        >
          <Printer className="w-4 h-4" />
          <span>طباعة الجدول / المحضر الرسمي A4</span>
        </button>
      </div>

      {/* التبويب 1 و 2: جداول توجيه 4 متوسط أو 1 ثانوي */}
      {(activeTab === '4am_orientation' || activeTab === '1as_orientation') && (
        <div className="bg-[#081c13] border border-[#d4af37]/40 rounded-2xl p-5 shadow-xl space-y-4 print-only-sheet">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#d4af37]/20 pb-3">
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#f5d77f] print:text-black">
                {activeTab === '4am_orientation'
                  ? 'جدول معالجة رغبات وملمح توجيه تلاميذ السنة الرابعة متوسط (4م)'
                  : 'جدول معالجة رغبات وملمح توجيه تلاميذ السنة الأولى ثانوي (1ث - الجذوع المشتركة)'}
              </h3>
              <p className="text-xs text-slate-300 print:text-black mt-0.5">
                حساب آلي لمجموعتي العلوم والتكنولوجيا والآداب ومطابقة الرغبة الأولى مع مقياس هولاند وقرار مجلس القسم
              </p>
            </div>

            <div className="flex items-center gap-2 no-print">
              <Filter className="w-4 h-4 text-[#d4af37]" />
              <select
                value={selectedGroupFilter}
                onChange={(e) => setSelectedGroupFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-[#05140d] border border-[#d4af37]/40 text-white text-xs font-bold"
              >
                <option value="all">جميع الأفواج التربوية ({currentList.length})</option>
                {groups.map((g) => (
                  <option key={g} value={g}>
                    فوج: {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs border-collapse">
              <thead>
                <tr className="bg-[#05140d] print:bg-gray-100 text-[#f5d77f] print:text-black border-b border-[#d4af37]/30 print:border-black">
                  <th className="p-2.5">الرقم</th>
                  <th className="p-2.5">الاسم واللقب</th>
                  <th className="p-2.5">الفوج</th>
                  <th className="p-2.5 text-center">المعدل السنوي</th>
                  <th className="p-2.5 text-center">مجموعة العلوم</th>
                  <th className="p-2.5 text-center">مجموعة الآداب</th>
                  <th className="p-2.5 text-center">هولاند</th>
                  <th className="p-2.5">الرغبة 1 المصرح بها</th>
                  <th className="p-2.5">اقتراح الملمح</th>
                  <th className="p-2.5">قرار التوجيه النهائي</th>
                  <th className="p-2.5 no-print">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d4af37]/15 print:divide-black">
                {filteredList.map((student, idx) => {
                  const metrics = calculateOrientationMetrics(student);
                  const streamOptions =
                    activeTab === '4am_orientation'
                      ? STREAM_OPTIONS_4AM
                      : STREAM_OPTIONS_1AS;

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-[#0c291c]/60 transition-colors"
                    >
                      <td className="p-2.5 font-mono tabular-nums">{idx + 1}</td>
                      <td className="p-2.5 font-bold text-white print:text-black">
                        {student.fullName}
                      </td>
                      <td className="p-2.5">{student.group}</td>
                      <td className="p-2.5 text-center font-mono font-bold tabular-nums text-emerald-300 print:text-black">
                        {metrics.annualAvg.toFixed(2)}
                      </td>
                      <td className="p-2.5 text-center font-mono tabular-nums">
                        {metrics.scienceGroupScore.toFixed(2)}
                      </td>
                      <td className="p-2.5 text-center font-mono tabular-nums">
                        {metrics.artsGroupScore.toFixed(2)}
                      </td>
                      <td className="p-2.5 text-center font-mono font-black text-[#f5d77f] print:text-black">
                        {student.hollandCode}
                      </td>
                      <td className="p-2.5">
                        <select
                          value={student.wish1}
                          onChange={(e) =>
                            onUpdateStudent({
                              ...student,
                              wish1: e.target.value,
                              wishCardCompleted: true,
                            })
                          }
                          className="px-2 py-1 rounded bg-[#05140d] print:bg-transparent border border-[#d4af37]/30 print:border-none text-white print:text-black text-xs"
                        >
                          {streamOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2.5">
                        <div className="font-bold text-slate-200 print:text-black">
                          {metrics.recommendedStream}
                        </div>
                        <div
                          className={`text-[10px] ${
                            metrics.wishCompatibility.includes('غير')
                              ? 'text-rose-400'
                              : 'text-emerald-400'
                          } print:text-black`}
                        >
                          {metrics.wishCompatibility}
                        </div>
                      </td>
                      <td className="p-2.5">
                        <select
                          value={student.finalOrientationDecision}
                          onChange={(e) =>
                            onUpdateStudent({
                              ...student,
                              finalOrientationDecision: e.target.value,
                              orientationStatus:
                                e.target.value === student.wish1
                                  ? 'satisfied_1'
                                  : 'satisfied_2',
                            })
                          }
                          className="px-2 py-1 rounded bg-[#09281a] print:bg-transparent border border-[#d4af37]/50 print:border-none text-[#f5d77f] print:text-black font-bold text-xs"
                        >
                          {streamOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2.5 no-print">
                        <button
                          onClick={() => onSelectStudentForModal(student, 'profile')}
                          className="px-2.5 py-1 rounded-lg bg-[#105e32] text-[#f5d77f] text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <UserCheck className="w-3 h-3" />
                          <span>الملف</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* التبويب 3: المحاضر النهائية الرسمية (جداول 4م و 1ث مع إحصائيات دقيقة) */}
      {activeTab === 'official_minutes' && (
        <div className="bg-white text-black p-6 sm:p-8 rounded-2xl border-2 border-black shadow-2xl space-y-6 print-only-sheet">
          <div className="text-center border-b-2 border-black pb-4">
            <div className="font-bold text-base">الجمهورية الجزائرية الديمقراطية الشعبية</div>
            <div className="font-bold text-sm">وزارة التربية الوطنية — {institution.wilaya}</div>
            <div className="text-xs font-semibold mt-1">
              {institution.districtCenter} · {institution.schoolName} · السنة الدراسية:{' '}
              {institution.schoolYear}
            </div>
            <h2 className="text-lg sm:text-xl font-black mt-3 underline">
              المحضر النهائي الرسمي لإحصائيات التوجيه المدرسي والمهني (4 متوسط + 1 ثانوي)
            </h2>
          </div>

          {/* أولاً: المحضر الإحصائي لتوجيه 4 متوسط */}
          <div className="space-y-2">
            <h3 className="text-sm font-black bg-gray-100 p-2 border border-black">
              أولاً: الجدول الإحصائي الرسمي لتوجيه تلاميذ السنة الرابعة متوسط (4م) إلى الجذوع المشتركة:
            </h3>
            <table className="w-full text-right text-xs border-collapse border border-black">
              <thead>
                <tr className="bg-gray-200 font-bold">
                  <th className="border border-black p-2">الجذع المشترك / المسار</th>
                  <th className="border border-black p-2 text-center">الذكور</th>
                  <th className="border border-black p-2 text-center">الإناث</th>
                  <th className="border border-black p-2 text-center">المجموع الكلي</th>
                  <th className="border border-black p-2 text-center">النسبة المئوية</th>
                  <th className="border border-black p-2 text-center">نسبة تلبية الرغبة الأولى</th>
                </tr>
              </thead>
              <tbody>
                {stats4AM.map(([stream, st]) => {
                  const pct =
                    middleStudents.length > 0
                      ? ((st.total / middleStudents.length) * 100).toFixed(1)
                      : '0.0';
                  const wishPct =
                    st.total > 0
                      ? ((st.wish1Satisfied / st.total) * 100).toFixed(1)
                      : '0.0';
                  return (
                    <tr key={stream} className="font-mono tabular-nums">
                      <td className="border border-black p-2 font-sans font-bold">{stream}</td>
                      <td className="border border-black p-2 text-center">{st.male}</td>
                      <td className="border border-black p-2 text-center">{st.female}</td>
                      <td className="border border-black p-2 text-center font-bold">{st.total}</td>
                      <td className="border border-black p-2 text-center">{pct}%</td>
                      <td className="border border-black p-2 text-center font-bold">{wishPct}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ثانياً: المحضر الإحصائي لتوجيه 1 ثانوي */}
          <div className="space-y-2">
            <h3 className="text-sm font-black bg-gray-100 p-2 border border-black">
              ثانياً: الجدول الإحصائي الرسمي لتوجيه تلاميذ السنة الأولى ثانوي (1ث) إلى شعب السنة الثانية ثانوي:
            </h3>
            <table className="w-full text-right text-xs border-collapse border border-black">
              <thead>
                <tr className="bg-gray-200 font-bold">
                  <th className="border border-black p-2">الشعبة المستقبلة (2 ثانوي)</th>
                  <th className="border border-black p-2 text-center">الذكور</th>
                  <th className="border border-black p-2 text-center">الإناث</th>
                  <th className="border border-black p-2 text-center">المجموع الكلي</th>
                  <th className="border border-black p-2 text-center">النسبة المئوية</th>
                  <th className="border border-black p-2 text-center">تلبية الرغبة 1</th>
                </tr>
              </thead>
              <tbody>
                {stats1AS.map(([stream, st]) => {
                  const pct =
                    secondaryStudents.length > 0
                      ? ((st.total / secondaryStudents.length) * 100).toFixed(1)
                      : '0.0';
                  const wishPct =
                    st.total > 0
                      ? ((st.wish1Satisfied / st.total) * 100).toFixed(1)
                      : '0.0';
                  return (
                    <tr key={stream} className="font-mono tabular-nums">
                      <td className="border border-black p-2 font-sans font-bold">{stream}</td>
                      <td className="border border-black p-2 text-center">{st.male}</td>
                      <td className="border border-black p-2 text-center">{st.female}</td>
                      <td className="border border-black p-2 text-center font-bold">{st.total}</td>
                      <td className="border border-black p-2 text-center">{pct}%</td>
                      <td className="border border-black p-2 text-center font-bold">{wishPct}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-3 pt-6 text-xs font-bold text-center">
            <div>تأشيرة مستشار التوجيه ({rankMeta.shortTitle})</div>
            <div>تأشيرة ناظر الثانوية / مستشار التربية</div>
            <div>ختم وإمضاء مدير المؤسسة (رئيس المجلس)</div>
          </div>
        </div>
      )}

      {/* التبويب 4: جسور إعادة التوجيه (سجل ومحضر وجدول إحصائي مستقل لمعالجة طلبات تغيير الشعبة) */}
      {activeTab === 'reorientation_bridges' && (
        <div className="space-y-6">
          {/* نموذج تسجيل التماس إعادة توجيه جديد */}
          <form
            onSubmit={handleCreateReorientation}
            className="bg-[#081c13] border border-[#d4af37]/40 rounded-2xl p-5 space-y-4 text-xs no-print"
          >
            <h3 className="text-sm sm:text-base font-black text-[#f5d77f] flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#d4af37]" />
              <span>إدراج طلب تغيير شعبة جديد في سجل جسور إعادة التوجيه</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">اختر التلميذ(ة):</label>
                <select
                  value={selectedStudentIdForReor}
                  onChange={(e) => setSelectedStudentIdForReor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#05140d] border border-[#d4af37]/40 text-white"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.group} — موجه: {s.finalOrientationDecision})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  الشعبة المطلوبة في الالتماس:
                </label>
                <select
                  value={requestedNewStream}
                  onChange={(e) => setRequestedNewStream(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#05140d] border border-[#d4af37]/40 text-white"
                >
                  {[...STREAM_OPTIONS_1AS, ...STREAM_OPTIONS_4AM].map((stOpt) => (
                    <option key={stOpt} value={stOpt}>
                      {stOpt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">مبررات طلب التلميذ/الولي:</label>
                <input
                  type="text"
                  value={reorJustification}
                  onChange={(e) => setReorJustification(e.target.value)}
                  placeholder="مثلاً: الرغبة في المسار التقني..."
                  className="w-full px-3 py-2 rounded-xl bg-[#05140d] border border-[#d4af37]/40 text-white"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-end">
              <div className="flex-1 w-full">
                <label className="block text-slate-300 font-bold mb-1">
                  رأي مستشار التوجيه المعلل (الملمح + كود هولاند):
                </label>
                <input
                  type="text"
                  value={reorCounselorOpinion}
                  onChange={(e) => setReorCounselorOpinion(e.target.value)}
                  placeholder="دراسة مدى توافق نقاط المواد المميزة مع الشعبة المطلوبة..."
                  className="w-full px-3 py-2 rounded-xl bg-[#05140d] border border-[#d4af37]/40 text-white"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] font-black flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>تسجيل في سجل إعادة التوجيه</span>
              </button>
            </div>
          </form>

          {/* المحضر والجدول الإحصائي المستقل لجسور إعادة التوجيه */}
          <div className="bg-[#081c13] print:bg-white print:text-black border border-[#d4af37]/40 print:border-black rounded-2xl p-6 shadow-xl space-y-4 print-only-sheet">
            <div className="text-center border-b border-[#d4af37]/30 print:border-black pb-3">
              <div className="font-bold text-sm text-[#f5d77f] print:text-black">
                الجمهورية الجزائرية الديمقراطية الشعبية · وزارة التربية الوطنية
              </div>
              <h3 className="text-base sm:text-lg font-black text-white print:text-black mt-1">
                سجل ومحضر لجنة جسور إعادة التوجيه ومعالجة التماسات تغيير الشعبة ({stageMeta.shortName})
              </h3>
            </div>

            {/* ملخص إحصائي مستقل */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs font-mono tabular-nums">
              <div className="p-3 rounded-xl bg-[#05140d] print:bg-gray-100 border border-[#d4af37]/20 print:border-black">
                <div className="text-slate-400 print:text-black font-sans">إجمالي الطلبات المودعة</div>
                <div className="text-lg font-black text-white print:text-black">
                  {reorientationRequests.length}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-950/60 print:bg-gray-100 border border-emerald-500/30 print:border-black">
                <div className="text-emerald-300 print:text-black font-sans">الطلبات المقبولة</div>
                <div className="text-lg font-black text-emerald-300 print:text-black">
                  {reorientationRequests.filter((r) => r.committeeDecision === 'مقبول').length}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-rose-950/60 print:bg-gray-100 border border-rose-500/30 print:border-black">
                <div className="text-rose-300 print:text-black font-sans">الطلبات المرفوضة</div>
                <div className="text-lg font-black text-rose-300 print:text-black">
                  {reorientationRequests.filter((r) => r.committeeDecision === 'مرفوض').length}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-amber-950/60 print:bg-gray-100 border border-amber-500/30 print:border-black">
                <div className="text-amber-300 print:text-black font-sans">قيد الدراسة باللجنة</div>
                <div className="text-lg font-black text-amber-300 print:text-black">
                  {reorientationRequests.filter((r) => r.committeeDecision === 'قيد الدراسة').length}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs border-collapse">
                <thead>
                  <tr className="bg-[#05140d] print:bg-gray-200 text-[#f5d77f] print:text-black border-b border-[#d4af37]/30 print:border-black">
                    <th className="p-2.5">الرقم</th>
                    <th className="p-2.5">التلميذ(ة) والفوج</th>
                    <th className="p-2.5">الشعبة الأصلية</th>
                    <th className="p-2.5">الشعبة المطلوبة</th>
                    <th className="p-2.5 text-center">المعدل السنوي</th>
                    <th className="p-2.5">رأي مستشار التوجيه المعلل</th>
                    <th className="p-2.5">قرار اللجنة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d4af37]/15 print:divide-black">
                  {reorientationRequests.map((req) => (
                    <tr key={req.id}>
                      <td className="p-2.5 font-mono tabular-nums">{req.orderNumber}</td>
                      <td className="p-2.5 font-bold">
                        {req.studentName} ({req.group})
                      </td>
                      <td className="p-2.5 text-slate-300 print:text-black">{req.currentStream}</td>
                      <td className="p-2.5 font-bold text-[#f5d77f] print:text-black">
                        {req.requestedStream}
                      </td>
                      <td className="p-2.5 text-center font-mono font-bold tabular-nums">
                        {req.annualAverage.toFixed(2)}
                      </td>
                      <td className="p-2.5 max-w-xs leading-relaxed">{req.counselorOpinion}</td>
                      <td className="p-2.5">
                        <select
                          value={req.committeeDecision}
                          onChange={(e) =>
                            onUpdateReorientationDecision(
                              req.id,
                              e.target.value as 'مقبول' | 'مرفوض' | 'قيد الدراسة'
                            )
                          }
                          className={`px-2.5 py-1 rounded-lg font-bold text-xs border ${
                            req.committeeDecision === 'مقبول'
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                              : req.committeeDecision === 'مرفوض'
                              ? 'bg-rose-950 text-rose-300 border-rose-500/40'
                              : 'bg-amber-950 text-amber-300 border-amber-500/40'
                          } print:bg-transparent print:text-black print:border-black`}
                        >
                          <option value="مقبول">مقبول</option>
                          <option value="مرفوض">مرفوض</option>
                          <option value="قيد الدراسة">قيد الدراسة</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
