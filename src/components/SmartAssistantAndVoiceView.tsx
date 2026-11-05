import React, { useState, useRef } from 'react';
import {
  Mic,
  MicOff,
  FileText,
  Activity,
  Lock,
  CheckCircle2,
  ClipboardCopy,
  FilePlus2,
  AlertCircle,
} from 'lucide-react';
import {
  CounselingInterview,
  EducationStage,
  InstitutionInfo,
  PsychoPedagogicalCase,
  SpecialCaseCategory,
  StudentCounselingRecord,
} from '../types';
import { calculateCompositeRiskScore } from '../data/initialData';

interface SmartAssistantAndVoiceViewProps {
  activeStage: EducationStage;
  institution: InstitutionInfo;
  students: StudentCounselingRecord[];
  onAddInterview: (newInterview: Omit<CounselingInterview, 'id' | 'serialNumber'>) => void;
  onAddCase: (newCase: Omit<PsychoPedagogicalCase, 'id' | 'caseCode'>) => void;
}

const PEDAGOGICAL_TEMPLATES_BY_CATEGORY: Record<
  SpecialCaseCategory,
  {
    diagnosisPrefix: string;
    actionPlan: string[];
    recommendation: string;
  }
> = {
  'القلق الدراسي وقلق الامتحانات': {
    diagnosisPrefix:
      'مؤشرات قلق التحصيل والامتحانات المرتبط بالضغط النفسي والخوف من الفشل، مما يؤثر على جودة الاسترجاع الذهني والتركيز الصفي.',
    actionPlan: [
      'برمجة جلسات تدريب فردية على تقنيات التنفس والاسترخاء وخفض التوتر قبل الفروض.',
      'إعادة هيكلة جدول المراجعة الأسبوعي إلى وحدات زمنية قصيرة قابلة للإنجاز.',
      'تعزيز الثقة بالنفس وتفكيك الأفكار التشاؤمية المرتبطة بالامتحانات الرسمية.',
      'التنسيق مع الأولياء لتوفير جو أسري هادئ وداعم بعيداً عن المقارنات.',
    ],
    recommendation:
      'يُوصى بتخفيف الضغط اللفظي الأسري وتشجيع التلميذ على الانتظام في النوم والمراجعة المتوازنة.',
  },
  'التنمر المدرسي': {
    diagnosisPrefix:
      'تعرض لمواقف تنمر وانعزال اجتماعي داخل الوسط المدرسي انعكس سلباً على التوافق النفسي والدافعية للحضور.',
    actionPlan: [
      'جلسة إصغاء ودعم نفسي فردي لإعادة بناء تقدير الذات والمهارات التوكيدية لدى التلميذ.',
      'التنسيق الفوري والسري مع مستشار التربية لحماية التلميذ وضبط السلوك داخل الفوج.',
      'برمجة حصة توعوية توجيهية داخل القسم حول قيم التسامح ونبذ العنف اللفظي والمعنوي.',
      'متابعة اندماج التلميذ في الأنشطة الجماعية والصفية خلال الأسابيع القادمة.',
    ],
    recommendation:
      'يُوصى بمتابعة يقظة من طرف الأساتذة ومستشار التربية لضمان بيئة صفية آمنة ومحفزة للتلميذ.',
  },
  'صعوبات التعلم': {
    diagnosisPrefix:
      'صعوبات منهجية ومعرفية في استيعاب المفاهيم الأساسية لبعض المواد، تتطلب تكييف طرائق الاستذكار والمرافقة البيداغوجية.',
    actionPlan: [
      'تشخيص دقيق لمواطن التعثر في المواد الأساسية بالتنسيق مع أساتذة الفوج.',
      'تدريب التلميذ على استخدام الخرائط الذهنية والتلخيص البصري للدروس.',
      'إدماج التلميذ في حصص المعالجة البيداغوجية والمذاكرة المحروسة.',
      'متابعة تطور نقاط التقويم المستمر والفروض المحروسة دورياً.',
    ],
    recommendation:
      'يُوصى بتشجيع كل تحسن تدريجي يحققه التلميذ وتكليفه بمهام صفية تتناسب مع وتيرة تعلمه.',
  },
  'التأخر الدراسي والتسرب': {
    diagnosisPrefix:
      'تراجع حاد في المعدل الفصلي مصحوب بفتور الدافعية وتكرار الغيابات، مما يضع التلميذ ضمن دائرة خطر التسرب المدرسي.',
    actionPlan: [
      'مقابلة معمقة لإعادة بناء المشروع الدراسي والمهني بما يتوافق مع ميول التلميذ (مقياس هولاند).',
      'استدعاء ولي الأمر لإبرام عقد مرافقة تربوية ومراقبة المواظبة اليومية.',
      'توجيه التلميذ نحو المسار أو الشعبة الأكثر ملاءمة لمؤهلاته الفعلية.',
      'المتابعة الأسبوعية لدفتر المراسلة والحضور الصفي.',
    ],
    recommendation:
      'ضرورة تضافر جهود الأسرة ومكتب التوجيه والناظر لمنع الانقطاع المدرسي ومرافقة التلميذ.',
  },
  'الوقاية من المخدرات والتدخين (UDS)': {
    diagnosisPrefix:
      'رصد مؤشرات خطر سلوكي وصحي (التدخين المبكر أو القابلية للانجراف) مصحوبة بغيابات متكررة وتراجع في التركيز.',
    actionPlan: [
      'جلسة إصغاء وتحسيس فردية سرية خالية من الوصم أو العقاب المنفر.',
      'تحرير بطاقة إحالة وتنسيق سرية مع طبيب وأخصائي وحدة الكشف والمتابعة (UDS).',
      'إشراك الولي بسرية وحكمة في المرافقة الوقائية وحماية التلميذ من رفقاء السوء.',
      'إدماج التلميذ في النوادي الثقافية والرياضية بالمؤسسة لملء أوقات الفراغ.',
    ],
    recommendation:
      'تفعيل بروتوكول المرافقة المشترك مع وحدة الكشف والمتابعة (UDS) مع الحفاظ التام على السر المهني.',
  },
};

export const SmartAssistantAndVoiceView: React.FC<SmartAssistantAndVoiceViewProps> = ({
  institution,
  students,
  onAddInterview,
  onAddCase,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [dictationText, setDictationText] = useState<string>(
    'تلميذ يعاني من تراجع ملحوظ في نتائج الفصل الثاني خاصة في المواد العلمية مع تسجيل غيابات متكررة في الفترة المسائية وشعور بالقلق والإحباط من صعوبة المنهاج.'
  );
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceStatusMsg, setVoiceStatusMsg] = useState<string | null>(null);
  const [caseCategory, setCaseCategory] = useState<SpecialCaseCategory>(
    'القلق الدراسي وقلق الامتحانات'
  );
  const [generatedReport, setGeneratedReport] = useState<{
    professionalSummary: string;
    pedagogicalDiagnosis: string;
    actionPlan: string[];
    parentTeacherRecommendation: string;
  } | null>(null);
  const [savedToast, setSavedToast] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  const selectedStudent =
    students.find((s) => s.id === selectedStudentId) || students[0];
  const risk = selectedStudent
    ? calculateCompositeRiskScore(selectedStudent)
    : {
        totalScore: 50,
        absenceComponent: 15,
        academicComponent: 20,
        behaviorPsychComponent: 15,
        riskLevel: 'high',
        riskLabelAr: 'خطر مرتفع',
        primaryReasonAr: '',
      };

  const toggleVoiceDictation = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      setVoiceStatusMsg('تم إيقاف الإملاء الصوتي المباشر.');
      return;
    }

    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setVoiceStatusMsg(
        'المتصفح الحالي لا يدعم Web Speech API المباشر، يمكنك استخدام أزرار القوالب التربوية السريعة أدناه أو الكتابة المباشرة.'
      );
      return;
    }

    try {
      const recognition = new SpeechRecognitionAPI();
      recognition.lang = 'ar-DZ';
      recognition.continuous = true;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceStatusMsg('جاري الاستماع للإملاء الصوتي باللغة العربية عبر المتصفح... تحدث الآن');
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript + ' ';
          }
        }
        if (transcript.trim()) {
          setDictationText((prev) => (prev ? `${prev} ${transcript.trim()}` : transcript.trim()));
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setVoiceStatusMsg('تعذر الوصول للميكروفون، يمكنك استخدام القوالب الجاهزة أو الكتابة اليدوية.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // صياغة تربوية سرية مقننة محلياً 100% دون الحاجة لأي ذكاء اصطناعي أو خادم خارجي
  const handleGenerateLocalReport = () => {
    if (!dictationText.trim() || !selectedStudent) return;
    const template = PEDAGOGICAL_TEMPLATES_BY_CATEGORY[caseCategory];

    setGeneratedReport({
      professionalSummary: `في إطار المرافقة الإرشادية السرية للتلميذ(ة) ${selectedStudent.fullName} المسجل(ة) بقسم (${selectedStudent.group})، وبناءً على مؤشر الخطورة المركب (${risk.totalScore}/100) والمقابلة الميدانية، تم توثيق ما يلي: ${dictationText.trim()}`,
      pedagogicalDiagnosis: `${template.diagnosisPrefix} (المعدل الفصلي الحالي: ${selectedStudent.term2Avg.toFixed(
        2
      )}/20 · الغيابات غير المبررة: ${selectedStudent.unjustifiedAbsences} · كود هولاند: ${
        selectedStudent.hollandCode
      }).`,
      actionPlan: template.actionPlan,
      parentTeacherRecommendation: template.recommendation,
    });
  };

  const handleSaveToInterviews = () => {
    if (!selectedStudent || !generatedReport) return;
    onAddInterview({
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toTimeString().slice(0, 5),
      term: institution.currentTerm,
      stage: selectedStudent.stage,
      studentId: selectedStudent.id,
      studentName: selectedStudent.fullName,
      studentGroup: selectedStudent.group,
      gender: selectedStudent.gender,
      interviewType: 'فردية',
      source: 'تلقائي (المستشار)',
      domain: 'توافق نفسي وتربوي',
      summary: generatedReport.professionalSummary,
      followUpPlan: generatedReport.actionPlan.join(' · '),
      counselorVisa: true,
      requiresParentSummon: risk.totalScore >= 55,
    });
    setSavedToast('تم ترحيل الملخص المهني السري إلى سجل المقابلات المقنن بنجاح ✓');
    setTimeout(() => setSavedToast(null), 3500);
  };

  const handleSaveToCases = () => {
    if (!selectedStudent || !generatedReport) return;
    onAddCase({
      studentId: selectedStudent.id,
      studentName: selectedStudent.fullName,
      stage: selectedStudent.stage,
      group: selectedStudent.group,
      category: caseCategory,
      openedDate: new Date().toISOString().slice(0, 10),
      confidentialityLevel: 'سري',
      symptomsAndIndicators: [dictationText.slice(0, 100)],
      udsCoordination: {
        isReferredToUds: caseCategory === 'الوقاية من المخدرات والتدخين (UDS)',
        udsFollowUpStatus: 'تحت المتابعة الطبية النفسية',
      },
      sessionsCount: 1,
      diagnosisSummary: generatedReport.pedagogicalDiagnosis,
      interventionPlan: generatedReport.actionPlan.join(' - '),
      status: 'نشطة (قيد التكفل)',
    });
    setSavedToast('تم إدراج التقرير السري في سجل الحالات والمتابعة النفسية ✓');
    setTimeout(() => setSavedToast(null), 3500);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* وحدة الإملاء الصوتي المباشر والمولّد التربوي المحلي للتقارير السرية (عمودان) */}
        <div className="lg:col-span-2 bg-[#081c13] border border-[#d4af37]/40 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#d4af37]/20 pb-3">
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#f5d77f] flex items-center gap-2">
                <Mic className="w-5 h-5 text-[#d4af37]" />
                <span>الإملاء الصوتي المباشر والمولّد التربوي للتقارير السرية</span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                كتابة الملاحظات عبر الصوت مباشرة على المتصفح وصياغتها محلياً بأسلوب تربوي سري مقنن (دون اتصال خارجي)
              </p>
            </div>

            <span className="px-3 py-1 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-xs font-bold text-emerald-300 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" />
              <span>محلي 100% ويحفظ السر المهني</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">اختر التلميذ(ة) المعني بالحالة:</label>
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
              <label className="block text-slate-300 font-bold mb-1">تصنيف الحالة النفسية التربوية:</label>
              <select
                value={caseCategory}
                onChange={(e) => setCaseCategory(e.target.value as SpecialCaseCategory)}
                className="w-full px-3 py-2 rounded-xl bg-[#05140d] border border-[#d4af37]/40 text-white"
              >
                <option value="القلق الدراسي وقلق الامتحانات">القلق الدراسي وقلق الامتحانات</option>
                <option value="التنمر المدرسي">التنمر المدرسي</option>
                <option value="صعوبات التعلم">صعوبات التعلم</option>
                <option value="التأخر الدراسي والتسرب">التأخر الدراسي والتسرب</option>
                <option value="الوقاية من المخدرات والتدخين (UDS)">
                  الوقاية من المخدرات والتدخين (UDS)
                </option>
              </select>
            </div>
          </div>

          {/* أزرار التحكم الصوتي والقوالب التربوية الجاهزة */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={toggleVoiceDictation}
              className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all shadow ${
                isListening
                  ? 'bg-rose-700 text-white animate-pulse'
                  : 'bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710]'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span>
                {isListening ? 'إيقاف التسجيل الصوتي المباشر' : 'بدء الإملاء الصوتي المباشر (عربي)'}
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                setDictationText(
                  'تلميذ يعاني من قلق حاد قبيل الامتحانات الرسمية مع اضطراب في النوم وخوف من عدم تحقيق معدل الرغبة الأولى رغم نتائجه الفصلية الجيدة.'
                )
              }
              className="px-3 py-2 rounded-xl bg-[#05140d] border border-[#d4af37]/30 text-slate-300 hover:text-white text-xs font-bold cursor-pointer"
            >
              قالب جاهز: قلق الامتحانات
            </button>

            <button
              type="button"
              onClick={() =>
                setDictationText(
                  'تم رصد غيابات غير مبررة متكررة في الفترة المسائية مع تراجع في نقاط الرياضيات والفيزياء ومؤشرات بداية تدخين خارج المؤسسة تستدعي التنسيق السري مع وحدة UDS.'
                )
              }
              className="px-3 py-2 rounded-xl bg-[#05140d] border border-[#d4af37]/30 text-slate-300 hover:text-white text-xs font-bold cursor-pointer"
            >
              قالب جاهز: وقاية UDS وتسرب
            </button>
          </div>

          {voiceStatusMsg && (
            <div className="p-2.5 rounded-xl bg-[#05140d] border border-[#d4af37]/30 text-xs text-[#f5d77f] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{voiceStatusMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs text-slate-300 font-bold mb-1">
              نص الإملاء الصوتي / الملاحظات الميدانية الأولية للمستشار:
            </label>
            <textarea
              rows={4}
              value={dictationText}
              onChange={(e) => setDictationText(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#05140d] border border-[#d4af37]/40 text-white text-xs sm:text-sm leading-relaxed focus:outline-none focus:border-[#f5d77f]"
              placeholder="تحدث عبر الميكروفون أو دون ملاحظاتك الأولية هنا..."
            />
          </div>

          <button
            type="button"
            onClick={handleGenerateLocalReport}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#105e32] via-[#136f3b] to-[#0d4a27] text-[#f5d77f] border border-[#d4af37] font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:brightness-110"
          >
            <FileText className="w-4 h-4" />
            <span>صياغة التقرير المهني وخطة التكفل بأسلوب تربوي سري (معالجة محلية فورية)</span>
          </button>

          {savedToast && (
            <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-200 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{savedToast}</span>
            </div>
          )}

          {generatedReport && (
            <div className="p-5 rounded-2xl bg-[#05140d] border-2 border-[#d4af37]/60 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-2">
                <span className="font-black text-sm text-[#f5d77f]">
                  المخرجات المهنية المقننة (أسلوب تربوي سري):
                </span>
                <button
                  type="button"
                  onClick={() =>
                    navigator.clipboard?.writeText(
                      `${generatedReport.professionalSummary}\nالتشخيص: ${generatedReport.pedagogicalDiagnosis}\nخطة المتابعة: ${generatedReport.actionPlan.join(' - ')}`
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <ClipboardCopy className="w-3.5 h-3.5" />
                  <span>نسخ التقرير</span>
                </button>
              </div>

              <div>
                <div className="font-bold text-emerald-300 mb-0.5">
                  1. الصياغة التربوية السرية لملخص السجل:
                </div>
                <p className="text-slate-200 leading-relaxed">{generatedReport.professionalSummary}</p>
              </div>

              <div>
                <div className="font-bold text-[#f5d77f] mb-0.5">
                  2. التشخيص التربوي والنفسي الأولي:
                </div>
                <p className="text-slate-200 leading-relaxed">{generatedReport.pedagogicalDiagnosis}</p>
              </div>

              <div>
                <div className="font-bold text-emerald-300 mb-0.5">3. خطة التكفل والمتابعة الميدانية:</div>
                <ul className="list-disc list-inside text-slate-200 space-y-0.5">
                  {generatedReport.actionPlan.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="font-bold text-amber-300 mb-0.5">
                  4. التوصية الموجهة للولي / الطاقم التربوي:
                </div>
                <p className="text-slate-200">{generatedReport.parentTeacherRecommendation}</p>
              </div>

              <div className="pt-3 border-t border-[#d4af37]/20 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleSaveToInterviews}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] font-black flex items-center gap-1.5 cursor-pointer"
                >
                  <FilePlus2 className="w-4 h-4" />
                  <span>إدراج مباشر في سجل المقابلات المقنن</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveToCases}
                  className="px-4 py-2 rounded-xl bg-[#105e32] text-[#f5d77f] border border-[#d4af37]/50 font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <FilePlus2 className="w-4 h-4" />
                  <span>فتح بطاقة في سجل الحالات النفسية السرية</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* مؤشر الخطورة المركب من 100 نقطة (غياب 30، نتائج 40، سلوك 30) */}
        <div className="bg-[#081c13] border border-[#d4af37]/40 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="border-b border-[#d4af37]/20 pb-3">
            <h3 className="text-base font-black text-[#f5d77f] flex items-center gap-2">
              <Activity className="w-5 h-5 text-rose-400" />
              <span>تفصيل مؤشر الخطورة المركب (/100 نقطة)</span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              قياس علمي دقيق لخطورة الحالة من 100 نقطة (الغياب 30 + النتائج 40 + السلوك والتوافق 30)
            </p>
          </div>

          {selectedStudent && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-[#05140d] border border-[#d4af37]/30 text-center">
                <div className="text-slate-400">التلميذ(ة): {selectedStudent.fullName}</div>
                <div className="text-3xl font-black font-mono tabular-nums text-white my-1.5">
                  {risk.totalScore} <span className="text-base text-[#d4af37]">/ 100</span>
                </div>
                <div className="font-bold text-amber-300">{risk.riskLabelAr}</div>
              </div>

              <div className="space-y-3 font-mono tabular-nums">
                <div className="p-3 rounded-xl bg-[#05140d] border border-[#d4af37]/20">
                  <div className="flex justify-between font-sans font-bold mb-1">
                    <span>1. مؤشر الغياب والانقطاع:</span>
                    <span className="font-mono text-[#f5d77f]">{risk.absenceComponent} / 30</span>
                  </div>
                  <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full"
                      style={{ width: `${(risk.absenceComponent / 30) * 100}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-slate-400 font-sans mt-1">
                    غياب غير مبرر: {selectedStudent.unjustifiedAbsences} · مبرر:{' '}
                    {selectedStudent.justifiedAbsences}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#05140d] border border-[#d4af37]/20">
                  <div className="flex justify-between font-sans font-bold mb-1">
                    <span>2. مؤشر تعثر وتراجع النتائج:</span>
                    <span className="font-mono text-rose-400">{risk.academicComponent} / 40</span>
                  </div>
                  <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-rose-500 h-full"
                      style={{ width: `${(risk.academicComponent / 40) * 100}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-slate-400 font-sans mt-1">
                    معدل ف1: {selectedStudent.term1Avg} · معدل ف2: {selectedStudent.term2Avg}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#05140d] border border-[#d4af37]/20">
                  <div className="flex justify-between font-sans font-bold mb-1">
                    <span>3. مؤشر السلوك والقلق النفسي:</span>
                    <span className="font-mono text-emerald-400">
                      {risk.behaviorPsychComponent} / 30
                    </span>
                  </div>
                  <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full"
                      style={{ width: `${(risk.behaviorPsychComponent / 30) * 100}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-slate-400 font-sans mt-1">
                    ملاحظات سلوكية: {selectedStudent.behaviorNotesCount}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
