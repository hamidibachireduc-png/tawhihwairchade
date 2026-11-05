import React, { useState } from 'react';
import {
  Users,
  Calendar,
  Plus,
  Printer,
  CheckCircle2,
  Check,
  BookOpen,
} from 'lucide-react';
import {
  EducationStage,
  InfoSeekerEntry,
  InfoTopicCategory,
  InstitutionInfo,
  WeeklyActivityEntry,
} from '../types';
import { COUNSELOR_RANKS } from '../data/initialData';

interface InfoSeekersAndActivityViewProps {
  activeStage: EducationStage;
  institution: InstitutionInfo;
  infoSeekers: InfoSeekerEntry[];
  onAddInfoSeeker: (entry: Omit<InfoSeekerEntry, 'id' | 'serialNumber'>) => void;
  weeklyActivities: WeeklyActivityEntry[];
  onAddWeeklyActivity: (entry: Omit<WeeklyActivityEntry, 'id'>) => void;
  onToggleWeeklyActivity: (id: string) => void;
}

const INFO_TOPICS: InfoTopicCategory[] = [
  'الشعب والمسارات الدراسية',
  'التكوين والتعليم المهنيين',
  'نظام الامتحانات الرسمية',
  'إجراءات إعادة التوجيه والطعن',
  'التخصصات والآفاق الجامعية',
  'المنح والنظام الداخلي',
];

const ACTIVITY_AXES: WeeklyActivityEntry['axis'][] = [
  'الإعلام المدرسي والمهني في الأقسام',
  'المقابلات الإرشادية والمتابعة النفسية',
  'المجالس واللجان الرسمية',
  'استغلال وتحليل النتائج المدرسية',
  'تطبيق المقاييس والاستبيانات',
  'التنسيق الإداري ووحدة UDS',
];

export const InfoSeekersAndActivityView: React.FC<InfoSeekersAndActivityViewProps> = ({
  activeStage,
  institution,
  infoSeekers,
  onAddInfoSeeker,
  weeklyActivities,
  onAddWeeklyActivity,
  onToggleWeeklyActivity,
}) => {
  const [activeTab, setActiveTab] = useState<'info_seekers' | 'weekly_activity'>(
    'info_seekers'
  );

  // نموذج سجل طالبي الإعلام
  const [visitorType, setVisitorType] = useState<'تلميذ(ة)' | 'ولي أمر' | 'أستاذ(ة)'>('تلميذ(ة)');
  const [visitorName, setVisitorName] = useState('');
  const [groupOrRelation, setGroupOrRelation] = useState('');
  const [topicCategory, setTopicCategory] = useState<InfoTopicCategory>(
    'الشعب والمسارات الدراسية'
  );
  const [questionBrief, setQuestionBrief] = useState('');
  const [answerProvided, setAnswerProvided] = useState('');
  const [documentsHanded, setDocumentsHanded] = useState('مطوية إعلامية');

  // نموذج سجل النشاط الأسبوعي
  const [dayName, setDayName] = useState<WeeklyActivityEntry['dayName']>('الأحد');
  const [actDate, setActDate] = useState('2026-11-08');
  const [timeSlot, setTimeSlot] = useState<WeeklyActivityEntry['timeSlot']>(
    'الفترة الصباحية (08:00 - 12:00)'
  );
  const [axis, setAxis] = useState<WeeklyActivityEntry['axis']>(
    'الإعلام المدرسي والمهني في الأقسام'
  );
  const [targetAudience, setTargetAudience] = useState('');
  const [activityDescription, setActivityDescription] = useState('');
  const [observations, setObservations] = useState('');

  const rankMeta = COUNSELOR_RANKS[institution.rankKey];

  const handleCreateInfoSeeker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim()) return;
    onAddInfoSeeker({
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toTimeString().slice(0, 5),
      stage: activeStage,
      visitorType,
      visitorName: visitorName.trim(),
      groupOrRelation: groupOrRelation.trim() || 'قسم غير محدد',
      topicCategory,
      questionBrief: questionBrief.trim() || 'استفسار سريع حول المسارات الدراسية والتوجيه',
      answerProvided:
        answerProvided.trim() || 'تقديم الشروحات القانونية والبيداغوجية اللازمة بالمكتب',
      documentsHanded: documentsHanded.trim() || 'دليل التوجيه',
    });
    setVisitorName('');
    setGroupOrRelation('');
    setQuestionBrief('');
    setAnswerProvided('');
  };

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityDescription.trim()) return;
    onAddWeeklyActivity({
      weekLabel: 'الأسبوع الثاني من نوفمبر 2026',
      dayName,
      date: actDate,
      timeSlot,
      stage: activeStage,
      axis,
      targetAudience: targetAudience.trim() || 'أقسام السنة النهائية',
      activityDescription: activityDescription.trim(),
      observations: observations.trim() || 'تم الإنجاز وفق الرزنامة الرسمية',
      completed: true,
    });
    setTargetAudience('');
    setActivityDescription('');
    setObservations('');
  };

  return (
    <div className="space-y-6">
      {/* التبويبات */}
      <div className="bg-[#081c13] border border-[#d4af37]/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('info_seekers')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'info_seekers'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710]'
                : 'bg-[#05140d] text-slate-300 border border-[#d4af37]/30'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>سجل طالبي الإعلام السريع ({infoSeekers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('weekly_activity')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'weekly_activity'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710]'
                : 'bg-[#05140d] text-slate-300 border border-[#d4af37]/30'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>سجل النشاط الأسبوعي والبرنامج السنوي ({weeklyActivities.length})</span>
          </button>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>طباعة السجل الرسمي A4</span>
        </button>
      </div>

      {activeTab === 'info_seekers' ? (
        <div className="space-y-6">
          {/* إحصائيات سريعة حسب تصنيف المواضيع */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 no-print">
            {INFO_TOPICS.map((topic) => {
              const count = infoSeekers.filter((x) => x.topicCategory === topic).length;
              return (
                <div
                  key={topic}
                  className="p-3 rounded-xl bg-[#081c13] border border-[#d4af37]/30 text-center"
                >
                  <div className="text-[11px] text-slate-300 font-bold line-clamp-1">{topic}</div>
                  <div className="text-lg font-black text-[#f5d77f] font-mono tabular-nums mt-1">
                    {count}
                  </div>
                </div>
              );
            })}
          </div>

          {/* نموذج إضافة طالب إعلام سريع */}
          <form
            onSubmit={handleCreateInfoSeeker}
            className="bg-[#081c13] border border-[#d4af37]/40 rounded-2xl p-5 space-y-4 text-xs no-print"
          >
            <h3 className="text-sm sm:text-base font-black text-[#f5d77f] flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#d4af37]" />
              <span>توثيق زائر في سجل طالبي الإعلام (معلومة سريعة دون مقابلة معمقة)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">صفة طالب الإعلام:</label>
                <select
                  value={visitorType}
                  onChange={(e) =>
                    setVisitorType(e.target.value as 'تلميذ(ة)' | 'ولي أمر' | 'أستاذ(ة)')
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#05140d] border border-[#d4af37]/40 text-white"
                >
                  <option value="تلميذ(ة)">تلميذ(ة)</option>
                  <option value="ولي أمر">ولي أمر</option>
                  <option value="أستاذ(ة)">أستاذ(ة)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">الاسم واللقب:</label>
                <input
                  type="text"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  placeholder="اسم التلميذ أو الولي..."
                  className="w-full px-3 py-2 rounded-xl bg-[#05140d] border border-[#d4af37]/40 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">الفوج / صلة القرابة:</label>
                <input
                  type="text"
                  value={groupOrRelation}
                  onChange={(e) => setGroupOrRelation(e.target.value)}
                  placeholder="مثلاً: 1 ج.م.ع.ت 1 أو ولي تلميذ"
                  className="w-full px-3 py-2 rounded-xl bg-[#05140d] border border-[#d4af37]/40 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">تصنيف موضوع الإعلام:</label>
                <select
                  value={topicCategory}
                  onChange={(e) => setTopicCategory(e.target.value as InfoTopicCategory)}
                  className="w-full px-3 py-2 rounded-xl bg-[#05140d] border border-[#d4af37]/40 text-white"
                >
                  {INFO_TOPICS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <div>
                <label className="block text-slate-300 font-bold mb-1">ملخص الاستفسار:</label>
                <input
                  type="text"
                  value={questionBrief}
                  onChange={(e) => setQuestionBrief(e.target.value)}
                  placeholder="السؤال المطروح من الزائر..."
                  className="w-full px-3 py-2 rounded-xl bg-[#05140d] border border-[#d4af37]/40 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">الإجابة والوثائق المسلمة:</label>
                <input
                  type="text"
                  value={answerProvided}
                  onChange={(e) => setAnswerProvided(e.target.value)}
                  placeholder="التوجيه المقدم والمطوية المسلمة..."
                  className="w-full px-3 py-2 rounded-xl bg-[#05140d] border border-[#d4af37]/40 text-white"
                />
              </div>

              <button
                type="submit"
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] font-black flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>تدوين في سجل طالبي الإعلام</span>
              </button>
            </div>
          </form>

          {/* جدول سجل طالبي الإعلام */}
          <div className="bg-[#081c13] print:bg-white print:text-black border border-[#d4af37]/40 print:border-black rounded-2xl p-5 shadow-xl space-y-4 print-only-sheet">
            <div className="text-center border-b border-[#d4af37]/25 print:border-black pb-3">
              <div className="text-xs font-bold text-[#f5d77f] print:text-black">
                الجمهورية الجزائرية الديمقراطية الشعبية · وزارة التربية الوطنية · {institution.wilaya}
              </div>
              <h3 className="text-base sm:text-lg font-black text-white print:text-black mt-1">
                سجل طالبي الإعلام المدرسي والمهني — {institution.schoolName} ({institution.schoolYear})
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs border-collapse">
                <thead>
                  <tr className="bg-[#05140d] print:bg-gray-200 text-[#f5d77f] print:text-black border-b border-[#d4af37]/30 print:border-black">
                    <th className="p-2.5">الرقم</th>
                    <th className="p-2.5">التاريخ والتوقيت</th>
                    <th className="p-2.5">الصفة والاسم</th>
                    <th className="p-2.5">الفوج / العلاقة</th>
                    <th className="p-2.5">موضوع الإعلام</th>
                    <th className="p-2.5">فحوى الاستفسار والإجابة المقدمة</th>
                    <th className="p-2.5">الدعائم المسلمة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d4af37]/15 print:divide-black">
                  {infoSeekers.map((entry) => (
                    <tr key={entry.id} className="hover:bg-[#0c291c]/50">
                      <td className="p-2.5 font-mono font-bold text-[#f5d77f] print:text-black tabular-nums">
                        {entry.serialNumber}
                      </td>
                      <td className="p-2.5 font-mono tabular-nums">
                        {entry.date} · {entry.time}
                      </td>
                      <td className="p-2.5">
                        <span className="font-bold text-white print:text-black">
                          {entry.visitorName}
                        </span>{' '}
                        <span className="text-[11px] text-emerald-300 print:text-black">
                          ({entry.visitorType})
                        </span>
                      </td>
                      <td className="p-2.5">{entry.groupOrRelation}</td>
                      <td className="p-2.5 font-bold text-[#f5d77f] print:text-black">
                        {entry.topicCategory}
                      </td>
                      <td className="p-2.5 max-w-md">
                        <div>
                          <strong>السؤال:</strong> {entry.questionBrief}
                        </div>
                        <div className="text-slate-300 print:text-black">
                          <strong>الإجابة:</strong> {entry.answerProvided}
                        </div>
                      </td>
                      <td className="p-2.5">{entry.documentsHanded}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* التبويب 2: سجل النشاط الأسبوعي والبرنامج السنوي */
        <div className="space-y-6">
          {/* نموذج تدوين حصة / نشاط أسبوعي */}
          <form
            onSubmit={handleCreateActivity}
            className="bg-[#081c13] border border-[#d4af37]/40 rounded-2xl p-5 space-y-4 text-xs no-print"
          >
            <h3 className="text-sm sm:text-base font-black text-[#f5d77f] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#d4af37]" />
              <span>تدوين حصة ميدانية في سجل النشاط الأسبوعي والبرنامج السنوي</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">اليوم:</label>
                <select
                  value={dayName}
                  onChange={(e) =>
                    setDayName(e.target.value as WeeklyActivityEntry['dayName'])
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#05140d] border border-[#d4af37]/40 text-white"
                >
                  {(['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'] as const).map(
                    (d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">التاريخ:</label>
                <input
                  type="date"
                  value={actDate}
                  onChange={(e) => setActDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#05140d] border border-[#d4af37]/40 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">الفترة الزمنية:</label>
                <select
                  value={timeSlot}
                  onChange={(e) =>
                    setTimeSlot(e.target.value as WeeklyActivityEntry['timeSlot'])
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#05140d] border border-[#d4af37]/40 text-white"
                >
                  <option value="الفترة الصباحية (08:00 - 12:00)">
                    الفترة الصباحية (08:00 - 12:00)
                  </option>
                  <option value="الفترة المسائية (13:30 - 16:30)">
                    الفترة المسائية (13:30 - 16:30)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">محور النشاط الرسمي:</label>
                <select
                  value={axis}
                  onChange={(e) => setAxis(e.target.value as WeeklyActivityEntry['axis'])}
                  className="w-full px-3 py-2 rounded-xl bg-[#05140d] border border-[#d4af37]/40 text-white"
                >
                  {ACTIVITY_AXES.map((ax) => (
                    <option key={ax} value={ax}>
                      {ax}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <div>
                <label className="block text-slate-300 font-bold mb-1">الفئة المستهدفة / الأقسام:</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="مثلاً: أقسام 4م1 + 4م2 أو 1ج م ع ت"
                  className="w-full px-3 py-2 rounded-xl bg-[#05140d] border border-[#d4af37]/40 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">وصف النشاط المنجز:</label>
                <input
                  type="text"
                  value={activityDescription}
                  onChange={(e) => setActivityDescription(e.target.value)}
                  placeholder="تفاصيل الحصة الإعلامية أو المجلس..."
                  className="w-full px-3 py-2 rounded-xl bg-[#05140d] border border-[#d4af37]/40 text-white"
                  required
                />
              </div>

              <button
                type="submit"
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] font-black flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>إدراج في سجل النشاط الأسبوعي</span>
              </button>
            </div>
          </form>

          {/* جدول سجل النشاط الأسبوعي والبرنامج السنوي */}
          <div className="bg-[#081c13] print:bg-white print:text-black border border-[#d4af37]/40 print:border-black rounded-2xl p-5 shadow-xl space-y-4 print-only-sheet">
            <div className="text-center border-b border-[#d4af37]/25 print:border-black pb-3">
              <div className="text-xs font-bold text-[#f5d77f] print:text-black">
                الجمهورية الجزائرية الديمقراطية الشعبية · وزارة التربية الوطنية · {institution.wilaya}
              </div>
              <h3 className="text-base sm:text-lg font-black text-white print:text-black mt-1">
                سجل النشاط الأسبوعي وتنفيذ البرنامج السنوي — {rankMeta.title} ({institution.schoolYear})
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs border-collapse">
                <thead>
                  <tr className="bg-[#05140d] print:bg-gray-200 text-[#f5d77f] print:text-black border-b border-[#d4af37]/30 print:border-black">
                    <th className="p-2.5">اليوم والتاريخ</th>
                    <th className="p-2.5">الفترة الزمنية</th>
                    <th className="p-2.5">محور النشاط</th>
                    <th className="p-2.5">الفئة المستهدفة</th>
                    <th className="p-2.5">محتوى النشاط الميداني</th>
                    <th className="p-2.5">الملاحظات والتقويم</th>
                    <th className="p-2.5 text-center">الإنجاز</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d4af37]/15 print:divide-black">
                  {weeklyActivities.map((act) => (
                    <tr key={act.id} className="hover:bg-[#0c291c]/50">
                      <td className="p-2.5">
                        <div className="font-bold text-white print:text-black">{act.dayName}</div>
                        <div className="font-mono text-[11px] text-slate-400 print:text-black tabular-nums">
                          {act.date}
                        </div>
                      </td>
                      <td className="p-2.5 font-mono text-[11px]">{act.timeSlot}</td>
                      <td className="p-2.5 font-bold text-[#f5d77f] print:text-black">{act.axis}</td>
                      <td className="p-2.5 font-semibold text-emerald-300 print:text-black">
                        {act.targetAudience}
                      </td>
                      <td className="p-2.5 max-w-sm leading-relaxed">{act.activityDescription}</td>
                      <td className="p-2.5 text-slate-300 print:text-black">{act.observations}</td>
                      <td className="p-2.5 text-center">
                        <button
                          onClick={() => onToggleWeeklyActivity(act.id)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer ${
                            act.completed
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                          } print:bg-transparent print:text-black print:border-black`}
                        >
                          {act.completed && <Check className="w-3 h-3" />}
                          <span>{act.completed ? 'منجز ✓' : 'مبرمج'}</span>
                        </button>
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
