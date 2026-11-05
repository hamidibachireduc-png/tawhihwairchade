import React, { useState } from 'react';
import {
  BrainCircuit,
  BarChart3,
  Megaphone,
  Printer,
  CheckCircle2,
  Filter,
  ShieldAlert,
  Clock,
  HeartPulse,
  Sparkles,
} from 'lucide-react';
import {
  EducationStage,
  HollandCodeLetter,
  InstitutionInfo,
  StudentCounselingRecord,
} from '../types';
import {
  calculateOrientationMetrics,
  COUNSELOR_RANKS,
  HOLLAND_DIMENSIONS_META,
} from '../data/initialData';

interface ScalesAndCampaignsViewProps {
  activeStage: EducationStage;
  institution: InstitutionInfo;
  students: StudentCounselingRecord[];
  onUpdateStudent: (updated: StudentCounselingRecord) => void;
}

interface PosterTemplate {
  id: string;
  title: string;
  slogan: string;
  category: string;
  accentBorder: string;
  pillars: { heading: string; points: string[] }[];
  counselorAdvice: string;
}

const AWARENESS_POSTERS: PosterTemplate[] = [
  {
    id: 'poster-bullying',
    title: 'مدرستنا فضاء آمن للجميع — معاً ضد التنمر المدرسي',
    slogan: 'الاحترام المتبادل أساس النجاح والتفوق الدراسي',
    category: 'حملة الوقاية من العنف والتنمر المدرسي',
    accentBorder: 'border-emerald-700',
    pillars: [
      {
        heading: 'ما هي أشكال التنمر التي نرفضها؟',
        points: [
          'التنمر اللفظي: السخرية، الألقاب الجارحة، والتقليل من شأن الزملاء.',
          'التنمر الاجتماعي: العزل المتعمد، نشر الشائعات، أو الإقصاء من مجموعات الدراسة.',
          'التنمر الإلكتروني: الإساءة عبر مواقع التواصل أو تصوير الزملاء دون إذنهم.',
        ],
      },
      {
        heading: 'كيف تتصرف إذا تعرضت للتنمر أو شاهدته؟',
        points: [
          'لا تصمت ولا تتردد: تواصل فوراً وبسرية تامة مع مكتب مستشار التوجيه والإرشاد.',
          'كن سنداً إيجابياً لزميلك ولا تكن متفرجاً سلبياً.',
          'تذكر أن طلب المساعدة والإصغاء التربوي دليل وعي وشجاعة.',
        ],
      },
    ],
    counselorAdvice:
      'مكتب مستشار التوجيه والإرشاد المدرسي والمهني مفتوح دائماً للإصغاء السري ومرافقتكم في كل وقت.',
  },
  {
    id: 'poster-time',
    title: 'هندسة التفوق الدراسي وتنظيم الوقت الفعال',
    slogan: 'لا تدرس بجهد عشوائي، بل ادرس بذكاء وتخطيط',
    category: 'حملة منهجية الاستذكار والتحضير الفعال',
    accentBorder: 'border-amber-700',
    pillars: [
      {
        heading: 'القواعد الذهبية للمراجعة الذكية:',
        points: [
          'تقنية البومودورو (45 دقيقة تركيز تام + 10 دقائق راحة بعيداً عن الهاتف).',
          'البدء بالمواد العلمية والأساسية ذات المعاملات العالية في فترات النشاط الذهني الصباحي.',
          'التلخيص بالخرائط الذهنية وحل المواضيع النموذجية بدل القراءة السطحية المتكررة.',
        ],
      },
      {
        heading: 'التوازن الصحي للتلميذ المتفوق:',
        points: [
          'النوم الكافي (7 إلى 8 ساعات ليلاً) لتثبيت المعلومات في الذاكرة طويلة المدى.',
          'تجنب السهر المفرط والمراجعة التراكمية ليلة الفرض أو الامتحان.',
          'تخصيص جدول أسبوعي مرن يجمع بين الواجبات، المراجعة، والراحة.',
        ],
      },
    ],
    counselorAdvice:
      'يمكنك استلام نموذج "جدول المراجعة الأسبوعي الشخصي" مباشرة من مكتب مستشار التوجيه.',
  },
  {
    id: 'poster-anxiety',
    title: 'دليلك النفسي للتحكم في قلق الامتحانات الرسمية',
    slogan: 'الهدوء النفسي والثقة بالنفس نصف العلامة الكاملة',
    category: 'المرافقة النفسية للمقبلين على شهادة التعليم المتوسط والبكالوريا',
    accentBorder: 'border-blue-700',
    pillars: [
      {
        heading: 'قبل وأثناء يوم الامتحان:',
        points: [
          'تجنب النقاشات المقلقة ومراجعة الدروس الجديدة في الدقائق الأخيرة أمام قاعة الامتحان.',
          'مارس التنفس العميق (شهيق بطيء من الأنف لـ 4 ثوانٍ وزفير هادئ) لخفض التوتر الفيزيولوجي.',
          'اقرأ ورقة الأسئلة كاملة بتأنٍ، وابدأ بالسؤال الأسهل لتعزيز ثقتك بنفسك.',
        ],
      },
      {
        heading: 'تحويل القلق إلى طاقة إيجابية:',
        points: [
          'استبدل الأفكار السلبية ("سأنسى كل شيء") بعبارات واقعية إيجابية ("لقد حضرت جيداً وسأجيب بمنهجية").',
          'الامتحان يقيس معارفك في لحظة محددة، والهدوء يمنحك استرجاعاً أفضل للمعلومات.',
        ],
      },
    ],
    counselorAdvice:
      'ينظم مكتب التوجيه جلسات تدريب جماعية وفردية على تقنيات الاسترخاء والتركيز طوال الفصل الدراسي.',
  },
  {
    id: 'poster-drugs',
    title: 'حياتك ومستقبلك أغلى — معاً للوقاية من التدخين والمخدرات',
    slogan: 'عقل سليم وإرادة قوية لبناء مستقبل دراسي ومهني مشرق',
    category: 'حملة الوقاية الصحية بالتنسيق مع وحدة الكشف والمتابعة (UDS)',
    accentBorder: 'border-rose-700',
    pillars: [
      {
        heading: 'حقائق علمية وتربوية هامة:',
        points: [
          'التدخين (بما فيه السجائر الإلكترونية) والمؤثرات العقلية يدمر خلايا الذاكرة والتركيز الدراسي.',
          'الانجراف وراء "التجربة الأولى" تحت ضغط رفقاء السوء هو البوابة الرئيسية للإدمان والتسرب المدرسي.',
          'القوة الحقيقية للشاب المراهق تكمن في القدرة على قول "لا" لكل ما يضر صحته وكرامته.',
        ],
      },
      {
        heading: 'خلية الإصغاء والمرافقة السرية (مكتب التوجيه + UDS):',
        points: [
          'تضمن المؤسسة سرية تامة ومرافقة طبية-نفسية غير عقابية لكل تلميذ يطلب المساعدة للإقلاع.',
          'التنسيق المباشر مع أطباء وأخصائيي وحدة الكشف والمتابعة (UDS) لحماية صحتكم.',
        ],
      },
    ],
    counselorAdvice:
      'لا تتردد في التواصل السري مع مستشار التوجيه أو طبيب وحدة الكشف والمتابعة UDS بالمؤسسة.',
  },
];

export const ScalesAndCampaignsView: React.FC<ScalesAndCampaignsViewProps> = ({
  activeStage,
  institution,
  students,
  onUpdateStudent,
}) => {
  const [activeTab, setActiveTab] = useState<
    'holland_test' | 'group_analysis' | 'awareness_posters'
  >('holland_test');

  const stageStudents = students.filter((s) => s.stage === activeStage);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    stageStudents[0]?.id || students[0]?.id || ''
  );
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('all');
  const [selectedPoster, setSelectedPoster] = useState<PosterTemplate>(
    AWARENESS_POSTERS[0]
  );

  const currentStudent =
    students.find((s) => s.id === selectedStudentId) || students[0];

  const [scores, setScores] = useState<Record<HollandCodeLetter, number>>(
    currentStudent?.hollandScores || { R: 20, I: 25, A: 15, S: 22, E: 18, C: 19 }
  );

  const handleSelectStudent = (id: string) => {
    setSelectedStudentId(id);
    const found = students.find((s) => s.id === id);
    if (found) {
      setScores({ ...found.hollandScores });
    }
  };

  // حساب الكود الثلاثي المرتب تنازلياً
  const computedTop3Code = (Object.entries(scores) as [HollandCodeLetter, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([letter]) => letter)
    .join('');

  const primaryLetter = (computedTop3Code[0] || 'I') as HollandCodeLetter;
  const primaryMeta = HOLLAND_DIMENSIONS_META[primaryLetter];

  const handleSaveHollandResult = () => {
    if (!currentStudent) return;
    onUpdateStudent({
      ...currentStudent,
      hollandCode: computedTop3Code,
      hollandScores: { ...scores },
    });
  };

  const groups = Array.from(new Set(stageStudents.map((s) => s.group)));
  const groupFilteredStudents = stageStudents.filter((s) =>
    selectedGroupFilter === 'all' ? true : s.group === selectedGroupFilter
  );

  // إحصاء الأنماط السائدة في الفوج/المستوى
  const dominantDimensionCounts: Record<HollandCodeLetter, number> = {
    R: 0,
    I: 0,
    A: 0,
    S: 0,
    E: 0,
    C: 0,
  };
  groupFilteredStudents.forEach((s) => {
    const first = (s.hollandCode?.[0] || 'I') as HollandCodeLetter;
    if (first in dominantDimensionCounts) {
      dominantDimensionCounts[first] += 1;
    }
  });

  const rankMeta = COUNSELOR_RANKS[institution.rankKey];

  return (
    <div className="space-y-6">
      {/* شريط التبويبات */}
      <div className="bg-[#081c13] border border-[#d4af37]/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('holland_test')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'holland_test'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710]'
                : 'bg-[#05140d] text-slate-300 border border-[#d4af37]/30'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            <span>تطبيق مقياس هولاند للميول المهنية (RIASEC)</span>
          </button>

          <button
            onClick={() => setActiveTab('group_analysis')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'group_analysis'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710]'
                : 'bg-[#05140d] text-slate-300 border border-[#d4af37]/30'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>تحليل الميول حسب الفوج والمستوى (مقارنة الرغبات بالميول)</span>
          </button>

          <button
            onClick={() => setActiveTab('awareness_posters')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'awareness_posters'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710]'
                : 'bg-[#05140d] text-slate-300 border border-[#d4af37]/30'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>ملصقات حملات التوعية الجاهزة للطباعة A4</span>
          </button>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>طباعة التقرير / الملصق A4</span>
        </button>
      </div>

      {/* التبويب 1: تطبيق مقياس هولاند للميول المهنية */}
      {activeTab === 'holland_test' && currentStudent && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#081c13] border border-[#d4af37]/40 rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d4af37]/20 pb-3">
              <div>
                <h3 className="text-base font-black text-[#f5d77f]">
                  تطبيق وتصحيح مقياس الميول والاهتمامات المهنية (جون هولاند RIASEC)
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  اضبط درجات الأبعاد الستة من 30 بناءً على إجابات التلميذ لاستخراج الكود الثلاثي والشعب المتوافقة
                </p>
              </div>

              <select
                value={selectedStudentId}
                onChange={(e) => handleSelectStudent(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#05140d] border border-[#d4af37]/40 text-white text-xs font-bold"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.fullName} ({s.group})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(['R', 'I', 'A', 'S', 'E', 'C'] as HollandCodeLetter[]).map((letter) => {
                const dim = HOLLAND_DIMENSIONS_META[letter];
                return (
                  <div
                    key={letter}
                    className="p-4 rounded-xl bg-[#05140d] border border-[#d4af37]/25 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-xs text-[#f5d77f]">
                        [{letter}] {dim.nameAr}
                      </span>
                      <span className="font-mono font-black text-sm text-emerald-300 tabular-nums">
                        {scores[letter]}/30
                      </span>
                    </div>

                    <input
                      type="range"
                      min={0}
                      max={30}
                      value={scores[letter]}
                      onChange={(e) =>
                        setScores((prev) => ({
                          ...prev,
                          [letter]: Number(e.target.value),
                        }))
                      }
                      className="w-full accent-[#d4af37] cursor-pointer"
                    />

                    <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                      {dim.questions.map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          {/* لوحة النتيجة الفورية والكود الثلاثي */}
          <div className="bg-[#081c13] border-2 border-[#d4af37] rounded-2xl p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="text-center p-4 rounded-xl bg-[#05140d] border border-[#d4af37]/40">
                <div className="text-xs text-slate-300">
                  الكود الثلاثي المستخرج للتلميذ(ة):{' '}
                  <strong className="text-white">{currentStudent.fullName}</strong>
                </div>
                <div className="text-3xl font-black font-mono tracking-widest text-[#f5d77f] my-2">
                  {computedTop3Code}
                </div>
                <div className="text-xs font-bold text-emerald-300">
                  النمط القيادي الأول: {primaryMeta.nameAr}
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="font-bold text-[#f5d77f]">الخصائص النفسية والمهنية للنمط:</div>
                <p className="text-slate-300 leading-relaxed">{primaryMeta.traitsAr}</p>
              </div>

              <div className="p-3 rounded-xl bg-[#05140d] border border-[#d4af37]/20 space-y-1.5 text-xs">
                <div className="font-bold text-emerald-300">
                  الشعب والمسارات الدراسية المتوافقة:
                </div>
                <ul className="list-disc list-inside text-white space-y-0.5">
                  {primaryMeta.matchingSecondaryStreams.map((st, idx) => (
                    <li key={idx}>{st}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-[#05140d] border border-[#d4af37]/20 space-y-1.5 text-xs">
                <div className="font-bold text-[#f5d77f]">الآفاق المهنية والجامعية المستهدفة:</div>
                <ul className="list-disc list-inside text-slate-200 space-y-0.5">
                  {primaryMeta.matchingCareers.map((cr, idx) => (
                    <li key={idx}>{cr}</li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={handleSaveHollandResult}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>تثبيت كود هولاند ({computedTop3Code}) في ملف التلميذ</span>
            </button>
          </div>
        </div>
      )}

      {/* التبويب 2: تحليل النتائج حسب الفوج التربوي أو المستوى كاملاً لمقارنة الرغبات بالميول */}
      {activeTab === 'group_analysis' && (
        <div className="bg-[#081c13] print:bg-white print:text-black border border-[#d4af37]/40 print:border-black rounded-2xl p-6 space-y-5 print-only-sheet">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#d4af37]/20 print:border-black pb-3">
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#f5d77f] print:text-black">
                التحليل الإحصائي لمقياس هولاند حسب الفوج التربوي والمستوى ومقارنة الرغبات بالميول
              </h3>
              <p className="text-xs text-slate-300 print:text-black mt-0.5">
                كشف التطابق أو التباين بين الرغبة المصرح بها في بطاقة الرغبات والميول المهنية الحقيقية للتلميذ
              </p>
            </div>

            <div className="flex items-center gap-2 no-print">
              <Filter className="w-4 h-4 text-[#d4af37]" />
              <select
                value={selectedGroupFilter}
                onChange={(e) => setSelectedGroupFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-[#05140d] border border-[#d4af37]/40 text-white text-xs font-bold"
              >
                <option value="all">المستوى كاملاً ({stageStudents.length} تلميذ)</option>
                {groups.map((g) => (
                  <option key={g} value={g}>
                    الفوج التربوي: {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* توزيع الأنماط الـ 6 في الفوج المختار */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5 text-center text-xs font-mono tabular-nums">
            {(['R', 'I', 'A', 'S', 'E', 'C'] as HollandCodeLetter[]).map((letter) => (
              <div
                key={letter}
                className="p-3 rounded-xl bg-[#05140d] print:bg-gray-100 border border-[#d4af37]/25 print:border-black"
              >
                <div className="font-bold text-[#f5d77f] print:text-black font-sans">
                  {HOLLAND_DIMENSIONS_META[letter].nameAr.split('(')[0]}
                </div>
                <div className="text-lg font-black text-white print:text-black mt-1">
                  {dominantDimensionCounts[letter]} تلميذ
                </div>
              </div>
            ))}
          </div>

          {/* جدول مقارنة الرغبة المصرح بها مع كود الميول والمؤهلات */}
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs border-collapse">
              <thead>
                <tr className="bg-[#05140d] print:bg-gray-200 text-[#f5d77f] print:text-black border-b border-[#d4af37]/30 print:border-black">
                  <th className="p-2.5">التلميذ(ة)</th>
                  <th className="p-2.5">الفوج</th>
                  <th className="p-2.5 text-center">كود هولاند</th>
                  <th className="p-2.5">الشعب المتوافقة مع الميول</th>
                  <th className="p-2.5">الرغبة 1 المصرح بها</th>
                  <th className="p-2.5">المعدل السنوي</th>
                  <th className="p-2.5">تشخيص التطابق (رغبة / ميول / ملمح)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d4af37]/15 print:divide-black">
                {groupFilteredStudents.map((st) => {
                  const firstLet = (st.hollandCode[0] || 'I') as HollandCodeLetter;
                  const meta = HOLLAND_DIMENSIONS_META[firstLet];
                  const orient = calculateOrientationMetrics(st);
                  const isMatch = meta.matchingSecondaryStreams.some((m) =>
                    st.wish1.includes(m.split(' ')[0])
                  );

                  return (
                    <tr key={st.id} className="hover:bg-[#0c291c]/50">
                      <td className="p-2.5 font-bold text-white print:text-black">
                        {st.fullName}
                      </td>
                      <td className="p-2.5">{st.group}</td>
                      <td className="p-2.5 text-center font-mono font-black text-base text-[#f5d77f] print:text-black">
                        {st.hollandCode}
                      </td>
                      <td className="p-2.5 text-slate-300 print:text-black">
                        {meta.matchingSecondaryStreams.join(' · ')}
                      </td>
                      <td className="p-2.5 font-bold text-emerald-300 print:text-black">
                        {st.wish1}
                      </td>
                      <td className="p-2.5 font-mono font-bold tabular-nums">
                        {orient.annualAvg.toFixed(2)}
                      </td>
                      <td className="p-2.5">
                        <span
                          className={`font-bold ${
                            isMatch && !orient.wishCompatibility.includes('غير')
                              ? 'text-emerald-400'
                              : 'text-amber-400'
                          } print:text-black`}
                        >
                          {isMatch && !orient.wishCompatibility.includes('غير')
                            ? 'تطابق ممتاز بين الرغبة والميول والنتائج ✓'
                            : 'تباين يستدعي مقابلة إرشادية لتصويب الرغبة'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* التبويب 3: الملصقات التوعوية الجاهزة للطباعة A4 */}
      {activeTab === 'awareness_posters' && (
        <div className="space-y-6">
          {/* شريط اختيار الملصق */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 no-print">
            {AWARENESS_POSTERS.map((poster) => {
              const isSelected = selectedPoster.id === poster.id;
              return (
                <button
                  key={poster.id}
                  onClick={() => setSelectedPoster(poster)}
                  className={`p-4 rounded-2xl border text-right transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-br from-[#13462c] to-[#081b11] border-2 border-[#d4af37] shadow-xl'
                      : 'bg-[#081c13] border-[#d4af37]/30 hover:border-[#d4af37]/70'
                  }`}
                >
                  <div className="text-[11px] font-bold text-[#f5d77f] mb-1">
                    {poster.category}
                  </div>
                  <div className="text-xs sm:text-sm font-black text-white">
                    {poster.title}
                  </div>
                </button>
              );
            })}
          </div>

          {/* الملصق الجاهز للطباعة A4 */}
          <div
            className={`bg-white text-black p-8 rounded-2xl border-4 ${selectedPoster.accentBorder} shadow-2xl space-y-6 print-only-sheet max-w-4xl mx-auto`}
          >
            <div className="text-center border-b-2 border-black pb-4">
              <div className="font-bold text-sm">
                الجمهورية الجزائرية الديمقراطية الشعبية · وزارة التربية الوطنية
              </div>
              <div className="text-xs font-semibold mt-0.5">
                {institution.wilaya} · {institution.schoolName} · مكتب مستشار التوجيه والإرشاد المدرسي والمهني
              </div>
              <div className="inline-block mt-3 px-4 py-1 bg-gray-100 border border-black text-xs font-bold">
                {selectedPoster.category}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black mt-3 text-black">
                {selectedPoster.title}
              </h2>
              <p className="text-sm font-bold text-gray-700 mt-1">
                « {selectedPoster.slogan} »
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedPoster.pillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl border-2 border-black bg-gray-50 space-y-3"
                >
                  <h3 className="text-base font-black border-b border-black pb-1.5 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>{pillar.heading}</span>
                  </h3>
                  <ul className="space-y-2 text-xs sm:text-sm leading-relaxed list-disc list-inside">
                    {pillar.points.map((pt, i) => (
                      <li key={i} className="font-medium">
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl border-2 border-black bg-gray-100 text-center space-y-1">
              <div className="text-sm font-black">رسالة مكتب التوجيه والإرشاد المدرسي والمهني:</div>
              <p className="text-xs sm:text-sm font-semibold">{selectedPoster.counselorAdvice}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-black text-xs font-bold">
              <div>إعداد وتنشيط: {institution.counselorName} ({rankMeta.shortTitle})</div>
              <div>السنة الدراسية: {institution.schoolYear}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
