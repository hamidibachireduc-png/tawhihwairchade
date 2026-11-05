import React, { useState } from 'react';
import {
  X,
  Printer,
  UserCheck,
  MailWarning,
  Activity,
  Compass,
  ClipboardList,
  Scissors,
  Phone,
  Calendar,
  Clock,
  FileText,
} from 'lucide-react';
import {
  CounselingInterview,
  InstitutionInfo,
  PsychoPedagogicalCase,
  StudentCounselingRecord,
} from '../types';
import {
  calculateCompositeRiskScore,
  calculateOrientationMetrics,
  COUNSELOR_RANKS,
  STAGE_METADATA,
} from '../data/initialData';

interface StudentProfileAndSummonModalProps {
  student: StudentCounselingRecord | null;
  initialTab?: 'profile' | 'summon';
  onClose: () => void;
  institution: InstitutionInfo;
  interviews: CounselingInterview[];
  cases: PsychoPedagogicalCase[];
}

export const StudentProfileAndSummonModal: React.FC<StudentProfileAndSummonModalProps> = ({
  student,
  initialTab = 'profile',
  onClose,
  institution,
  interviews,
  cases,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'summon'>(initialTab);
  const [summonDate, setSummonDate] = useState<string>('2026-11-08');
  const [summonTime, setSummonTime] = useState<string>('09:30');
  const [summonReason, setSummonReason] = useState<string>(
    'التشاور التربوي حول المسار الدراسي ومرافقة التلميذ(ة) في بناء مشروعه المدرسي والمهني'
  );
  const [summonUrgency, setSummonUrgency] = useState<'عادي' | 'مستعجل' | 'هام جداً'>('مستعجل');
  const [summonRef, setSummonRef] = useState<string>(
    `م.ت/${new Date().getFullYear()}/${Math.floor(10 + Math.random() * 89)}`
  );

  if (!student) return null;

  const risk = calculateCompositeRiskScore(student);
  const orient = calculateOrientationMetrics(student);
  const studentInterviews = interviews.filter((i) => i.studentId === student.id);
  const studentCases = cases.filter((c) => c.studentId === student.id);
  const stageMeta = STAGE_METADATA[institution.stage];
  const rankMeta = COUNSELOR_RANKS[institution.rankKey];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-gradient-to-b from-[#0b2519] to-[#06150e] border-2 border-[#d4af37] rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden my-6 print-only-sheet">
        {/* شريط علوي غير قابل للطباعة */}
        <div className="px-6 py-4 bg-[#071a11] border-b border-[#d4af37]/30 flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710]'
                  : 'bg-[#05140d] text-slate-300 border border-[#d4af37]/30'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>الملف الفردي الشامل للتلميذ</span>
            </button>
            <button
              onClick={() => setActiveTab('summon')}
              className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all ${
                activeTab === 'summon'
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710]'
                  : 'bg-[#05140d] text-slate-300 border border-[#d4af37]/30'
              }`}
            >
              <MailWarning className="w-4 h-4" />
              <span>استدعاء الولي الرسمي + قسيمة الاستلام</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة فورية A4</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {activeTab === 'profile' ? (
          <div className="p-6 space-y-5 text-xs sm:text-sm print:bg-white print:text-black">
            {/* الترويسة الرسمية للبطاقة الفردية */}
            <div className="text-center border-b-2 border-[#d4af37]/40 print:border-black pb-4">
              <div className="font-bold text-sm sm:text-base text-[#f5d77f] print:text-black">
                الجمهورية الجزائرية الديمقراطية الشعبية
              </div>
              <div className="font-bold text-xs sm:text-sm text-slate-200 print:text-black">
                وزارة التربية الوطنية · {institution.wilaya}
              </div>
              <div className="text-xs text-slate-300 print:text-black mt-0.5">
                {institution.districtCenter} · {institution.schoolName}
              </div>
              <h2 className="text-base sm:text-xl font-black text-white print:text-black mt-2 underline">
                البطاقة الفردية الشاملة للمتابعة والتوجيه المدرسي والمهني
              </h2>
            </div>

            {/* الهوية ومؤشر الخطورة المركب */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 p-4 rounded-xl bg-[#05140d] print:bg-gray-50 border border-[#d4af37]/30 print:border-black space-y-2">
                <div className="text-xs font-black text-[#f5d77f] print:text-black border-b border-[#d4af37]/20 pb-1">
                  1. البيانات الشخصية والمدرسية:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div>
                    <span className="text-slate-400 print:text-gray-600">الاسم واللقب: </span>
                    <span className="font-bold text-white print:text-black">{student.fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 print:text-gray-600">رقم التعريف: </span>
                    <span className="font-mono tabular-nums text-emerald-300 print:text-black">
                      {student.matricule}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 print:text-gray-600">تاريخ الميلاد: </span>
                    <span className="font-mono tabular-nums">{student.birthDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 print:text-gray-600">المستوى والفوج: </span>
                    <span className="font-bold">{student.group}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 print:text-gray-600">اسم الولي: </span>
                    <span className="font-bold">{student.parentName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-[#d4af37]" />
                    <span className="font-mono tabular-nums">{student.parentPhone}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#081f15] print:bg-gray-50 border border-[#d4af37]/40 print:border-black flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#f5d77f] print:text-black flex items-center gap-1">
                    <Activity className="w-4 h-4" />
                    <span>مؤشر الخطورة المركب:</span>
                  </span>
                  <span className="text-lg font-black font-mono tabular-nums text-white print:text-black">
                    {risk.totalScore}/100
                  </span>
                </div>
                <div className="text-[11px] font-bold text-amber-300 print:text-black my-1">
                  {risk.riskLabelAr}
                </div>
                <div className="text-[11px] text-slate-300 print:text-black space-y-0.5 tabular-nums">
                  <div>• الغيابات ({student.unjustifiedAbsences} غ.م): {risk.absenceComponent}/30</div>
                  <div>• التحصيل والنتائج: {risk.academicComponent}/40</div>
                  <div>• السلوك والتوافق النفسي: {risk.behaviorPsychComponent}/30</div>
                </div>
              </div>
            </div>

            {/* المسار الدراسي والتوجيه ومقياس هولاند */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#05140d] print:bg-white border border-[#d4af37]/30 print:border-black space-y-2">
                <div className="text-xs font-black text-[#f5d77f] print:text-black flex items-center gap-1.5 border-b border-[#d4af37]/20 pb-1">
                  <Compass className="w-4 h-4" />
                  <span>2. الحصيلة الدراسية ومجموعات التوجيه:</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center font-mono tabular-nums">
                  <div className="p-2 rounded-lg bg-[#092116] print:border">
                    <div className="text-[10px] text-slate-400 print:text-black">معدل ف1</div>
                    <div className="font-black text-sm">{student.term1Avg.toFixed(2)}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-[#092116] print:border">
                    <div className="text-[10px] text-slate-400 print:text-black">معدل ف2</div>
                    <div className="font-black text-sm">{student.term2Avg.toFixed(2)}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-[#092116] print:border">
                    <div className="text-[10px] text-slate-400 print:text-black">المعدل السنوي</div>
                    <div className="font-black text-sm text-emerald-300 print:text-black">
                      {orient.annualAvg.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="text-xs space-y-1 pt-1 tabular-nums">
                  <div>
                    • معدل مجموعة العلوم والتكنولوجيا: <strong>{orient.scienceGroupScore}/20</strong>
                  </div>
                  <div>
                    • معدل مجموعة الآداب واللغات: <strong>{orient.artsGroupScore}/20</strong>
                  </div>
                  <div>
                    • الرغبة 1 المصرح بها: <strong className="text-[#f5d77f] print:text-black">{student.wish1}</strong>
                  </div>
                  <div>
                    • الشعبة المقترحة علمياً: <strong>{orient.recommendedStream}</strong> ({orient.wishCompatibility})
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#05140d] print:bg-white border border-[#d4af37]/30 print:border-black space-y-2">
                <div className="text-xs font-black text-[#f5d77f] print:text-black flex items-center gap-1.5 border-b border-[#d4af37]/20 pb-1">
                  <ClipboardList className="w-4 h-4" />
                  <span>3. ملمح الميول المهنية (هولاند RIASEC) والمواظبة:</span>
                </div>
                <div className="flex items-center justify-between bg-[#092116] print:border p-2.5 rounded-lg">
                  <span className="text-xs">الكود الثلاثي لهولاند:</span>
                  <span className="font-mono font-black text-base text-[#f5d77f] print:text-black tracking-widest">
                    {student.hollandCode}
                  </span>
                </div>
                <div className="grid grid-cols-6 gap-1 text-center font-mono text-[11px] tabular-nums">
                  {(['R', 'I', 'A', 'S', 'E', 'C'] as const).map((letter) => (
                    <div key={letter} className="p-1.5 rounded bg-[#081c13] print:border">
                      <div className="font-bold text-[#d4af37] print:text-black">{letter}</div>
                      <div>{student.hollandScores[letter]}</div>
                    </div>
                  ))}
                </div>
                <div className="text-xs pt-1 tabular-nums">
                  • الغيابات غير المبررة: <strong>{student.unjustifiedAbsences}</strong> | الغيابات المبررة:{' '}
                  <strong>{student.justifiedAbsences}</strong> | ملاحظات السلوك:{' '}
                  <strong>{student.behaviorNotesCount}</strong>
                </div>
              </div>
            </div>

            {/* سجل المقابلات والحالات المرتبطة بالتلميذ */}
            <div className="p-4 rounded-xl bg-[#05140d] print:bg-white border border-[#d4af37]/30 print:border-black space-y-2">
              <div className="text-xs font-black text-[#f5d77f] print:text-black border-b border-[#d4af37]/20 pb-1">
                4. سجل المقابلات الإرشادية والمتابعة المسجلة للتلميذ ({studentInterviews.length}):
              </div>
              {studentInterviews.length === 0 ? (
                <p className="text-xs text-slate-400">لا توجد مقابلات فردية موثقة بعد لهذا التلميذ.</p>
              ) : (
                <div className="space-y-2">
                  {studentInterviews.map((intv) => (
                    <div
                      key={intv.id}
                      className="p-2.5 rounded-lg bg-[#092116] print:border border border-[#d4af37]/20 text-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between font-bold">
                        <span>
                          مقابلة رقم {intv.serialNumber} · {intv.interviewType} ({intv.domain})
                        </span>
                        <span className="font-mono tabular-nums text-emerald-300 print:text-black">
                          {intv.date} ({intv.time})
                        </span>
                      </div>
                      <p className="text-slate-300 print:text-black mt-1">{intv.summary}</p>
                      <p className="text-[#f5d77f] print:text-black mt-0.5 font-semibold">
                        خطة المتابعة: {intv.followUpPlan}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {studentCases.length > 0 && (
                <div className="pt-2 border-t border-[#d4af37]/20">
                  <div className="text-xs font-bold text-amber-300 print:text-black mb-1">
                    ملفات المتابعة النفسية التربوية المفتوحة ({studentCases.length}):
                  </div>
                  {studentCases.map((c) => (
                    <div key={c.id} className="text-xs text-slate-300 print:text-black">
                      • [{c.caseCode}] {c.category} — الحالة: <strong>{c.status}</strong> ({c.diagnosisSummary})
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 text-xs font-bold">
              <div>تاريخ الاستخراج: {new Date().toISOString().slice(0, 10)}</div>
              <div>إمضاء وختم {rankMeta.title}</div>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* إعدادات سريعة للاستدعاء قبل الطباعة */}
            <div className="p-4 rounded-xl bg-[#05140d] border border-[#d4af37]/30 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs no-print">
              <div>
                <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>تاريخ الموعد المقترح:</span>
                </label>
                <input
                  type="date"
                  value={summonDate}
                  onChange={(e) => setSummonDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#092116] border border-[#d4af37]/40 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>ساعة الاستقبال:</span>
                </label>
                <input
                  type="time"
                  value={summonTime}
                  onChange={(e) => setSummonTime(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#092116] border border-[#d4af37]/40 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>رقم القيد التسلسلي:</span>
                </label>
                <input
                  type="text"
                  value={summonRef}
                  onChange={(e) => setSummonRef(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#092116] border border-[#d4af37]/40 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">طابع الاستدعاء:</label>
                <select
                  value={summonUrgency}
                  onChange={(e) =>
                    setSummonUrgency(e.target.value as 'عادي' | 'مستعجل' | 'هام جداً')
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#092116] border border-[#d4af37]/40 text-white"
                >
                  <option value="عادي">عادي</option>
                  <option value="مستعجل">مستعجل</option>
                  <option value="هام جداً">هام جداً وشخصي</option>
                </select>
              </div>
              <div className="sm:col-span-4">
                <label className="block text-slate-300 font-bold mb-1">سبب وموضوع الاستدعاء:</label>
                <input
                  type="text"
                  value={summonReason}
                  onChange={(e) => setSummonReason(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#092116] border border-[#d4af37]/40 text-white"
                />
              </div>
            </div>

            {/* ورقة الاستدعاء الرسمي الجاهزة للطباعة A4 */}
            <div className="bg-white text-black p-6 sm:p-8 rounded-xl border-2 border-black shadow-xl space-y-5 font-['Cairo',sans-serif]">
              <div className="text-center border-b-2 border-black pb-3">
                <div className="font-bold text-base">الجمهورية الجزائرية الديمقراطية الشعبية</div>
                <div className="font-bold text-sm">وزارة التربية الوطنية — {stageMeta.name}</div>
                <div className="flex items-center justify-between text-xs mt-2 font-semibold">
                  <div className="text-right">
                    <div>{institution.wilaya}</div>
                    <div>{institution.schoolName}</div>
                    <div>مكتب مستشار التوجيه والإرشاد المدرسي والمهني</div>
                  </div>
                  <div className="text-left font-mono tabular-nums">
                    <div>الرقم: {summonRef}</div>
                    <div>السنة الدراسية: {institution.schoolYear}</div>
                    <div>التاريخ: {new Date().toISOString().slice(0, 10)}</div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <span className="inline-block border-2 border-black px-6 py-1.5 font-black text-lg bg-gray-100">
                  استدعاء ولي أمر تلميذ(ة) ({summonUrgency})
                </span>
              </div>

              <div className="space-y-3 text-sm leading-relaxed">
                <p>
                  إلى السيد(ة) المحترم(ة): <strong>{student.parentName}</strong>، ولي أمر التلميذ(ة):{' '}
                  <strong>{student.fullName}</strong>، المسجل(ة) بقسم: <strong>{student.group}</strong>.
                </p>
                <p>
                  يشرفني نحن <strong>{institution.counselorName}</strong> ({rankMeta.title}) بالمؤسسة،
                  دعوتكم للحضور شخصياً إلى مكتب التوجيه والإرشاد المدرسي والمهني يوم:{' '}
                  <strong className="font-mono">{summonDate}</strong> على الساعة:{' '}
                  <strong className="font-mono">{summonTime}</strong>.
                </p>
                <div className="p-3 border border-black bg-gray-50 rounded">
                  <strong>موضوع المقابلة الإرشادية:</strong> {summonReason}.
                </div>
                <p className="text-xs">
                  ملاحظة هامة: إن حضوركم ومرافقتكم التربوية والنفسية لابنكم/ابنتكم يمثل ركيزة أساسية لنجاحه(ها)
                  الدراسي وبناء مشروعه(ها) المستقبلي. نشكركم مسبقاً على تعاونكم المثمر.
                </p>
              </div>

              <div className="grid grid-cols-2 pt-6 pb-8 text-xs font-bold text-center">
                <div>ختم وتأشيرة إدارة المؤسسة</div>
                <div>إمضاء وختم مستشار التوجيه والإرشاد</div>
              </div>

              {/* خط القص وقسيمة إشعار بالاستلام */}
              <div className="border-t-2 border-dashed border-black pt-4 relative">
                <div className="flex items-center justify-center gap-2 text-xs font-bold mb-2">
                  <Scissors className="w-4 h-4" />
                  <span>قسيمة إشعار باستلام الاستدعاء (تُعاد مملوءة وموقعة إلى مكتب مستشار التوجيه)</span>
                </div>

                <div className="p-4 border border-black rounded bg-gray-50 text-xs space-y-2">
                  <div className="flex justify-between font-bold">
                    <span>المرجع: {summonRef}</span>
                    <span>التلميذ(ة): {student.fullName} ({student.group})</span>
                  </div>
                  <p>
                    أشهد أنا الممضي أسفله السيد(ة): <strong>{student.parentName}</strong>، ولي أمر التلميذ(ة){' '}
                    <strong>{student.fullName}</strong>، أنني استلمت الاستدعاء الخاص بمقابلة مستشار التوجيه
                    والإرشاد المدرسي والمهني المقررة ليوم <strong className="font-mono">{summonDate}</strong> على
                    الساعة <strong className="font-mono">{summonTime}</strong>.
                  </p>
                  <div className="grid grid-cols-3 pt-2 font-bold">
                    <div>تاريخ الاستلام: ..../..../2026</div>
                    <div>رقم هاتف الولي: {student.parentPhone}</div>
                    <div>إمضاء وبصمة الولي: ....................</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
