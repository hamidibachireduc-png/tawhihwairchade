import React, { useState } from 'react';
import {
  CalendarCheck,
  ClipboardList,
  Compass,
  HeartHandshake,
  Users,
  BrainCircuit,
  Mic,
  GraduationCap,
  Database,
  UserCheck,
  MailWarning,
  Plus,
  Check,
  Sparkles,
  ShieldAlert,
  ArrowLeft,
  Scale,
  Calculator,
  FileDown,
  BarChart3,
  Printer,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import {
  AgendaItem,
  AssignedClassGroup,
  CounselingInterview,
  EducationStage,
  InfoSeekerEntry,
  InstitutionInfo,
  PsychoPedagogicalCase,
  ReorientationRequest,
  SectionId,
  StudentCounselingRecord,
  WeeklyActivityEntry,
} from '../types';
import {
  calculateCompositeRiskScore,
  COUNSELOR_RANKS,
  DEFAULT_EMBLEM_URL,
  STAGE_METADATA,
} from '../data/initialData';
import { downloadOfficialPrintableDocument } from '../utils/pdfExport';

interface DashboardRadarViewProps {
  activeStage: EducationStage;
  onSelectStage: (stage: EducationStage) => void;
  institution: InstitutionInfo;
  onNavigate: (section: SectionId) => void;
  students: StudentCounselingRecord[];
  interviews: CounselingInterview[];
  cases: PsychoPedagogicalCase[];
  infoSeekers: InfoSeekerEntry[];
  weeklyActivities: WeeklyActivityEntry[];
  reorientationRequests: ReorientationRequest[];
  assignedClasses: AssignedClassGroup[];
  agendaItems: AgendaItem[];
  onToggleAgenda: (id: string) => void;
  onAddAgendaItem: (item: Omit<AgendaItem, 'id'>) => void;
  onSelectStudentForModal: (
    student: StudentCounselingRecord,
    tab: 'profile' | 'summon'
  ) => void;
  onOpenSettings: () => void;
}

export const DashboardRadarView: React.FC<DashboardRadarViewProps> = ({
  activeStage,
  institution,
  onNavigate,
  students,
  interviews,
  cases,
  infoSeekers,
  weeklyActivities,
  reorientationRequests,
  assignedClasses,
  agendaItems,
  onToggleAgenda,
  onAddAgendaItem,
  onSelectStudentForModal,
  onOpenSettings,
}) => {
  const stageMeta = STAGE_METADATA[activeStage];
  const rankMeta = COUNSELOR_RANKS[institution.rankKey];
  const stageStudents = students.filter((s) => s.stage === activeStage);
  const stageInterviews = interviews.filter((i) => i.stage === activeStage);
  const stageCases = cases.filter((c) => c.stage === activeStage);
  const stageInfoSeekers = infoSeekers.filter((i) => i.stage === activeStage);
  const stageWeekly = weeklyActivities.filter((w) => w.stage === activeStage);
  const stageReorientation = reorientationRequests.filter(
    (r) => r.stage === activeStage
  );
  const stageAssignedClasses = assignedClasses.filter(
    (c) => c.stage === activeStage
  );
  const stageAgenda = agendaItems.filter(
    (a) => a.stage === activeStage || a.stage === 'all'
  );

  const [riskFilter, setRiskFilter] = useState<'all' | 'critical' | 'high'>(
    'all'
  );
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('2026-11-06');
  const [newTaskTime, setNewTaskTime] = useState('10:00');
  const [newTaskPriority, setNewTaskPriority] = useState<
    'عاجل' | 'مهم' | 'عادي'
  >('مهم');

  // حساب المؤشرات الحيوية
  const totalUnjustifiedAbsences = stageStudents.reduce(
    (acc, s) => acc + s.unjustifiedAbsences,
    0
  );
  const completedWishCardsCount = stageStudents.filter(
    (s) => s.wishCardCompleted
  ).length;
  const wishCardsCompletionRate =
    stageStudents.length > 0
      ? Math.round((completedWishCardsCount / stageStudents.length) * 100)
      : 100;

  const satisfiedWish1Count = stageStudents.filter(
    (s) => s.orientationStatus === 'satisfied_1'
  ).length;
  const satisfiedWish2Count = stageStudents.filter(
    (s) => s.orientationStatus === 'satisfied_2'
  ).length;
  const satisfiedWish1Rate =
    stageStudents.length > 0
      ? Math.round((satisfiedWish1Count / stageStudents.length) * 100)
      : 100;

  // إحصائيات الأقسام المسندة والحصص الإعلامية
  const totalAssignedStudents = stageAssignedClasses.reduce(
    (acc, c) => acc + c.studentsCount,
    0
  );
  const completedInfoSessions = stageAssignedClasses.reduce(
    (acc, c) => acc + c.infoSessionsCompleted,
    0
  );
  const plannedInfoSessions = stageAssignedClasses.reduce(
    (acc, c) => acc + c.infoSessionsPlanned,
    0
  );
  const infoSessionsRate =
    plannedInfoSessions > 0
      ? Math.round((completedInfoSessions / plannedInfoSessions) * 100)
      : 100;

  const psychTestsClassesCount = stageAssignedClasses.filter(
    (c) => c.psychTestsApplied
  ).length;

  // إحصائيات النشاط الأسبوعي
  const completedWeeklyCount = stageWeekly.filter((w) => w.completed).length;
  const weeklyCompletionRate =
    stageWeekly.length > 0
      ? Math.round((completedWeeklyCount / stageWeekly.length) * 100)
      : 100;

  // توزيع المقابلات الإرشادية حسب المجال
  const interviewDomains = [
    'توجيه مدرسي ومهني',
    'توافق نفسي وتربوي',
    'تحصيل ومنهجية استذكار',
    'سلوكي وانضباطي',
    'عائلي واجتماعي',
    'وقاية صحية (UDS)',
  ] as const;

  const domainCounts = interviewDomains.map((dom) => ({
    domain: dom,
    count: stageInterviews.filter((i) => i.domain === dom).length,
  }));

  // توزيع الحالات النفسية والوقائية UDS
  const caseCategories = [
    'التنمر المدرسي',
    'القلق الدراسي وقلق الامتحانات',
    'صعوبات التعلم',
    'التأخر الدراسي والتسرب',
    'الوقاية من المخدرات والتدخين (UDS)',
  ] as const;

  const caseCategoryCounts = caseCategories.map((cat) => ({
    category: cat,
    count: stageCases.filter((c) => c.category === cat).length,
  }));

  // حساب رادار الإنذار المبكر ومؤشر الخطورة المركب من 100
  const studentsWithRisk = stageStudents
    .map((student) => ({
      student,
      risk: calculateCompositeRiskScore(student),
    }))
    .sort((a, b) => b.risk.totalScore - a.risk.totalScore);

  const atRiskStudents = studentsWithRisk.filter((item) => {
    if (riskFilter === 'critical') return item.risk.riskLevel === 'critical';
    if (riskFilter === 'high')
      return (
        item.risk.riskLevel === 'critical' || item.risk.riskLevel === 'high'
      );
    return item.risk.totalScore >= 30;
  });

  const criticalCount = studentsWithRisk.filter(
    (x) => x.risk.riskLevel === 'critical' || x.risk.riskLevel === 'high'
  ).length;

  const handleAddQuickAgenda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddAgendaItem({
      title: newTaskTitle.trim(),
      date: newTaskDate,
      time: newTaskTime,
      stage: activeStage,
      category: 'مقابلة إرشادية',
      priority: newTaskPriority,
      completed: false,
      notes: 'تذكير دوري مضاف من لوحة التحكم',
    });
    setNewTaskTitle('');
  };

  // توليد مستندات PDF الرسمية لجميع الأقسام من الداشبورد الرئيسي
  const handleGenerateSectionPdf = (
    reportType:
      | 'master_dashboard'
      | 'orientation_report'
      | 'interviews_report'
      | 'cases_uds_report'
      | 'timetable_classes_report'
      | 'infoseekers_weekly_report'
  ) => {
    if (reportType === 'master_dashboard') {
      downloadOfficialPrintableDocument({
        filename: `التقرير-الإحصائي-العام-الشامل-لمهام-المستشار-${activeStage}`,
        documentTitle:
          'الحصيلة الإحصائية الشاملة لجميع أقسام ومهام مستشار التوجيه والإرشاد المدرسي والمهني',
        documentCode: 'حصيلة-عامة/م.ت/2026',
        institution,
        bodyHtml: `
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-val">${stageStudents.length} (${wishCardsCompletionRate}%)</div>
              <div class="stat-lbl">تلاميذ المستويات المسندة وإنجاز الرغبات</div>
            </div>
            <div class="stat-card">
              <div class="stat-val">${stageInterviews.length}</div>
              <div class="stat-lbl">المقابلات الإرشادية الموثقة</div>
            </div>
            <div class="stat-card">
              <div class="stat-val">${stageCases.length}</div>
              <div class="stat-lbl">الحالات النفسية ومتابعة UDS</div>
            </div>
            <div class="stat-card">
              <div class="stat-val">${stageAssignedClasses.length} (${infoSessionsRate}%)</div>
              <div class="stat-lbl">الأقسام المسندة وتغطية الإعلام</div>
            </div>
          </div>

          <div class="box">
            <div class="box-title">أولاً: جدول مؤشرات الإنجاز الشامل لمهام مستشار التوجيه حسب الأقسام</div>
            <table>
              <thead>
                <tr>
                  <th>القسم الوظيفي / المهمة القانونية</th>
                  <th>المؤشر الكمي المحقق</th>
                  <th>نسبة الإنجاز / التغطية</th>
                  <th>التقييم والملاحظات البيداغوجية</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="font-weight:bold">1. توجيه التلاميذ وبطاقات الرغبات</td>
                  <td>${completedWishCardsCount} من أصل ${stageStudents.length} تلميذ</td>
                  <td>${wishCardsCompletionRate}% (تلبية الرغبة 1: ${satisfiedWish1Rate}%)</td>
                  <td>معالجة آلية متوافقة مع محاضر القبول والتوجيه</td>
                </tr>
                <tr>
                  <td style="font-weight:bold">2. جسور إعادة التوجيه والالتماسات</td>
                  <td>${stageReorientation.length} طلبات مدروسة</td>
                  <td>مقبول: ${stageReorientation.filter((r) => r.committeeDecision === 'مقبول').length} | قيد الدراسة: ${stageReorientation.filter((r) => r.committeeDecision === 'قيد الدراسة').length}</td>
                  <td>مداولات تقنية وفق المقاعد البيداغوجية</td>
                </tr>
                <tr>
                  <td style="font-weight:bold">3. سجل المقابلات الإرشادية واستدعاءات الأولياء</td>
                  <td>${stageInterviews.length} مقابلة مقننة</td>
                  <td>مؤشرة: ${stageInterviews.filter((i) => i.counselorVisa).length} (${stageInterviews.length > 0 ? Math.round((stageInterviews.filter((i) => i.counselorVisa).length / stageInterviews.length) * 100) : 100}%)</td>
                  <td>ترقيم تسلسلي سنوي آلي وتوثيق خطط المتابعة</td>
                </tr>
                <tr>
                  <td style="font-weight:bold">4. سجل الحالات النفسية والوقاية (UDS)</td>
                  <td>${stageCases.length} ملفات سرية مفتوحة</td>
                  <td>إحالة وتنسيق UDS: ${stageCases.filter((c) => c.udsCoordination.isReferredToUds).length} حالات</td>
                  <td>تكفل مشترك مع أطباء ونفسيي الصحة المدرسية</td>
                </tr>
                <tr>
                  <td style="font-weight:bold">5. الأقسام المسندة والتوقيت الأسبوعي (32 سا)</td>
                  <td>${stageAssignedClasses.length} أفواج (${totalAssignedStudents} تلميذاً)</td>
                  <td>الحصص الإعلامية: ${completedInfoSessions}/${plannedInfoSessions} (${infoSessionsRate}%)</td>
                  <td>تطبيق الروائز النفسية في ${psychTestsClassesCount} أفواج</td>
                </tr>
                <tr>
                  <td style="font-weight:bold">6. سجل طالبي الإعلام والنشاط الأسبوعي</td>
                  <td>${stageInfoSeekers.length} زائر لمكتب التوجيه</td>
                  <td>تنفيذ البرنامج الأسبوعي: ${weeklyCompletionRate}%</td>
                  <td>توثيق ميداني منتظم حسب الرزنامة الرسمية</td>
                </tr>
                <tr>
                  <td style="font-weight:bold">7. رادار الإنذار المبكر ومؤشر الخطورة (/100)</td>
                  <td>${criticalCount} حالات إنذار مرتفع/حرج</td>
                  <td>إجمالي الغيابات غير المبررة: ${totalUnjustifiedAbsences}</td>
                  <td>كشف استباقي للتسرب وتدني التحصيل الدراسي</td>
                </tr>
              </tbody>
            </table>
          </div>
        `,
      });
      return;
    }

    if (reportType === 'orientation_report') {
      const rows = stageStudents
        .map(
          (s, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td style="font-weight:bold">${s.fullName}</td>
          <td>${s.group}</td>
          <td>${((s.term1Avg + s.term2Avg + s.term3Avg) / 3).toFixed(2)}</td>
          <td>${s.wish1}</td>
          <td>${s.councilProposal}</td>
          <td style="font-weight:bold">${s.finalOrientationDecision}</td>
        </tr>
      `
        )
        .join('');
      downloadOfficialPrintableDocument({
        filename: `محضر-التوجيه-النهائي-والإحصائيات-${activeStage}`,
        documentTitle: `المحضر الإحصائي الرسمي لتوجيه التلاميذ (${stageMeta.name})`,
        documentCode: 'محضر-توجيه/2026',
        institution,
        bodyHtml: `
          <div class="box">
            <div class="box-title">قائمة التوجيه النهائي للتلاميذ (${stageStudents.length} تلميذاً - نسبة إنجاز الرغبات ${wishCardsCompletionRate}%)</div>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>الاسم واللقب</th>
                  <th>الفوج</th>
                  <th>المعدل السنوي</th>
                  <th>الرغبة الأولى</th>
                  <th>اقتراح المجلس</th>
                  <th>قرار التوجيه النهائي</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        `,
      });
      return;
    }

    if (reportType === 'interviews_report') {
      const rows = stageInterviews
        .map(
          (i) => `
        <tr>
          <td>${i.serialNumber}</td>
          <td>${i.date}</td>
          <td style="font-weight:bold">${i.studentName} (${i.studentGroup})</td>
          <td>${i.interviewType}</td>
          <td>${i.domain}</td>
          <td>${i.summary}</td>
          <td>${i.followUpPlan}</td>
        </tr>
      `
        )
        .join('');
      downloadOfficialPrintableDocument({
        filename: `حصيلة-سجل-المقابلات-الإرشادية-${activeStage}`,
        documentTitle: 'الحصيلة الرسمية لسجل المقابلات الإرشادية المقنن',
        documentCode: 'سجل-مقابلات/2026',
        institution,
        bodyHtml: `
          <div class="box">
            <div class="box-title">جدول المقابلات الإرشادية الموثقة (${stageInterviews.length} مقابلة)</div>
            <table>
              <thead>
                <tr>
                  <th>الرقم التسلسلي</th>
                  <th>التاريخ</th>
                  <th>التلميذ والفوج</th>
                  <th>نوع المقابلة</th>
                  <th>المجال</th>
                  <th>ملخص المقابلة</th>
                  <th>خطة المتابعة</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        `,
      });
      return;
    }

    if (reportType === 'cases_uds_report') {
      const rows = stageCases
        .map(
          (c) => `
        <tr>
          <td>${c.caseCode}</td>
          <td style="font-weight:bold">${c.studentName} (${c.group})</td>
          <td>${c.category}</td>
          <td>${c.openedDate}</td>
          <td>${c.udsCoordination.isReferredToUds ? `محال (${c.udsCoordination.udsDoctorName || 'وحدة UDS'})` : 'متابعة داخلية'}</td>
          <td>${c.interventionPlan}</td>
          <td>${c.status}</td>
        </tr>
      `
        )
        .join('');
      downloadOfficialPrintableDocument({
        filename: `تقرير-الحالات-النفسية-ووحدة-UDS-${activeStage}`,
        documentTitle:
          'التقرير السري لمتابعة الفئات الخاصة والتنسيق مع وحدة الكشف والمتابعة (UDS)',
        documentCode: 'حالات-UDS/2026',
        institution,
        bodyHtml: `
          <div class="box">
            <div class="box-title">بيان الحالات النفسية التربوية المتكفل بها (${stageCases.length} حالات)</div>
            <table>
              <thead>
                <tr>
                  <th>رمز الملف</th>
                  <th>التلميذ والفوج</th>
                  <th>تصنيف الحالة</th>
                  <th>تاريخ الفتح</th>
                  <th>التنسيق مع UDS</th>
                  <th>خطة التدخل والمرافقة</th>
                  <th>الوضعية</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        `,
      });
      return;
    }

    if (reportType === 'timetable_classes_report') {
      const rows = stageAssignedClasses
        .map(
          (c, i) => `
        <tr>
          <td>${i + 1}</td>
          <td style="font-weight:bold">${c.groupName}</td>
          <td>${c.level}</td>
          <td>${c.institutionName}</td>
          <td>${c.studentsCount} (${c.femaleCount} إناث)</td>
          <td>${c.assignedSlotDay} (${c.assignedSlotTime})</td>
          <td>${c.infoSessionsCompleted}/${c.infoSessionsPlanned}</td>
          <td>${c.psychTestsApplied ? 'مطبق ✓' : 'قيد التطبيق'}</td>
        </tr>
      `
        )
        .join('');
      downloadOfficialPrintableDocument({
        filename: `بطاقة-التوقيت-والأقسام-المسندة-${activeStage}`,
        documentTitle:
          'بطاقة التوقيت الأسبوعي (32 ساعة) والأقسام التربوية المسندة',
        documentCode: 'توقيت-أقسام/2026',
        institution,
        bodyHtml: `
          <div class="box">
            <div class="box-title">قائمة الأقسام المسندة لمستشار التوجيه (${stageAssignedClasses.length} أفواج - ${totalAssignedStudents} تلميذاً)</div>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>الفوج</th>
                  <th>المستوى</th>
                  <th>المؤسسة</th>
                  <th>التعداد</th>
                  <th>التوقيت المبرمج</th>
                  <th>الحصص الإعلامية</th>
                  <th>الروائز النفسية</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        `,
      });
      return;
    }

    if (reportType === 'infoseekers_weekly_report') {
      const rows = stageInfoSeekers
        .map(
          (s) => `
        <tr>
          <td>${s.serialNumber}</td>
          <td>${s.date}</td>
          <td style="font-weight:bold">${s.visitorName} (${s.visitorType})</td>
          <td>${s.topicCategory}</td>
          <td>${s.questionBrief}</td>
          <td>${s.answerProvided}</td>
        </tr>
      `
        )
        .join('');
      downloadOfficialPrintableDocument({
        filename: `حصيلة-طالبي-الإعلام-والنشاط-الأسبوعي-${activeStage}`,
        documentTitle: 'حصيلة سجل طالبي الإعلام وتنفيذ البرنامج الأسبوعي',
        documentCode: 'إعلام-نشاط/2026',
        institution,
        bodyHtml: `
          <div class="box">
            <div class="box-title">سجل طالبي الإعلام المدرسي والمهني (${stageInfoSeekers.length} زيارات موثقة)</div>
            <table>
              <thead>
                <tr>
                  <th>الرقم</th>
                  <th>التاريخ</th>
                  <th>طالب الإعلام وصفته</th>
                  <th>موضوع الاستفسار</th>
                  <th>ملخص الطلب</th>
                  <th>الإجابة والتوجيه المقدم</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        `,
      });
    }
  };

  const logoSrc = institution.emblemUrl?.trim()
    ? institution.emblemUrl
    : DEFAULT_EMBLEM_URL;

  const moduleCards: {
    id: SectionId;
    title: string;
    subtitle: string;
    metric: string;
    submetric: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'orientation',
      title: 'توجيه التلاميذ والمحاضر الرسمية',
      subtitle:
        'توجيه 4 متوسط و1 ثانوي، المحاضر النهائية، وجسور إعادة التوجيه وتغيير الشعبة',
      metric: `إنجاز الرغبات ${wishCardsCompletionRate}%`,
      submetric: `تلبية الرغبة 1: ${satisfiedWish1Rate}%`,
      icon: <Compass className="w-5 h-5" />,
    },
    {
      id: 'interviews',
      title: 'المقابلات الإرشادية واستدعاءات الأولياء',
      subtitle:
        'سجل المقابلات المقنن بترقيم سنوي آلي، الحصيلة الفصلية، واستدعاء الولي الفوري',
      metric: `${stageInterviews.length} مقابلة موثقة`,
      submetric: 'ترقيم تسلسلي آلي 2026',
      icon: <ClipboardList className="w-5 h-5" />,
    },
    {
      id: 'cases',
      title: 'سجل الحالات والمتابعة النفسية (UDS)',
      subtitle:
        'التنمر، القلق الدراسي، صعوبات التعلم، وبطاقة الوقاية من المخدرات والتدخين مع UDS',
      metric: `${stageCases.length} حالات قيد المتابعة`,
      submetric: 'تنسيق مباشر مع وحدة UDS',
      icon: <HeartHandshake className="w-5 h-5" />,
    },
    {
      id: 'legislation',
      title: 'التشريع والمهام والتوقيت والأقسام المسندة',
      subtitle:
        'المرسوم 25-54 والقرار 831، مناشير التوجيه، التوقيت الأسبوعي (32 سا)، وبطاقة الأقسام المسندة',
      metric: `${stageAssignedClasses.length} أقسام مسندة`,
      submetric: '32 ساعة عمل + تصدير PDF',
      icon: <Scale className="w-5 h-5" />,
    },
    {
      id: 'career_simulator',
      title: 'المحاكي الذكي للراتب والدرجات والترقية والتقاعد',
      subtitle:
        'حساب الراتب الصافي، الدرجات (12)، الأقدمية العامة وفي الرتبة، المنح والمردودية، والترقية والتقاعد',
      metric: `الصنف ${rankMeta.category}`,
      submetric: `الاستدلالي القاعدي ${rankMeta.baseIndex}`,
      icon: <Calculator className="w-5 h-5" />,
    },
    {
      id: 'infoseekers',
      title: 'سجل طالبي الإعلام والنشاط الأسبوعي',
      subtitle:
        'توثيق الزيارات السريعة لمكتب التوجيه وتخطيط البرنامج السنوي والنشاط الأسبوعي',
      metric: `${stageInfoSeekers.length} طالب إعلام`,
      submetric: `إنجاز النشاط: ${weeklyCompletionRate}%`,
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: 'scales',
      title: 'بنك المقاييس (هولاند) وحملات التوعية',
      subtitle:
        'مقياس الميول RIASEC وتحليل الفوج، مع ملصقات توعوية جاهزة للطباعة A4',
      metric: 'مقياس هولاند RIASEC',
      submetric: '4 ملصقات وقائية للطباعة',
      icon: <BrainCircuit className="w-5 h-5" />,
    },
    {
      id: 'assistant',
      title: 'الإملاء الصوتي والمولّد التربوي السري',
      subtitle:
        'كتابة الملاحظات بالصوت مباشرة وصياغة التقارير التربوية السرية وحساب مؤشر الخطورة /100 محلياً',
      metric: 'إملاء صوتي + تقارير',
      submetric: 'معالجة محلية 100% دون خادم',
      icon: <Mic className="w-5 h-5" />,
    },
    {
      id: 'horizons',
      title: 'دليل الشعب والمسارات وآفاق البكالوريا',
      subtitle:
        'التخصصات الجامعية المتوفرة، المدارس العليا، شروط الالتحاق، ومعاملات الشعب',
      metric: 'دليل البكالوريا والجامعة',
      submetric: 'مصفوفة الأولويات الجامعية',
      icon: <GraduationCap className="w-5 h-5" />,
    },
    {
      id: 'digitalization',
      title: 'الرقمنة والأمان والعمل دون إنترنت',
      subtitle:
        'استيراد قوائم Excel/CSV من الرقمنة، مسح شهادة العمل، والمزامنة السحابية المشفرة',
      metric: 'استيراد الرقمنة CSV',
      submetric: 'حفظ Offline + تشفير سحابي',
      icon: <Database className="w-5 h-5" />,
    },
  ];

  return (
    <div className="space-y-5">
      {/* شريط مدمج لبيانات المكتب والمؤشرات الحيوية */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#0d2e1f] via-[#092216] to-[#123b28] border border-[#d4af37]/40 p-3.5 shadow-lg">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              onClick={onOpenSettings}
              title="انقر لتعديل بيانات المكتب وشعار الترويسة"
              className="w-12 h-12 rounded-xl bg-white/95 p-1 border border-[#d4af37] shadow flex items-center justify-center cursor-pointer shrink-0"
            >
              <img
                src={logoSrc}
                alt="شعار المؤسسة"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain rounded"
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-[#f5d77f]">
                <span>{institution.wilaya}</span>
                <span>·</span>
                <span>{stageMeta.name}</span>
                <span>·</span>
                <span className="text-emerald-300">
                  {rankMeta.shortTitle} ({rankMeta.category})
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-black text-white mt-0.5">
                {institution.schoolName} — {stageMeta.orientationFocus}
              </h2>
            </div>
          </div>

          {/* المؤشرات الحيوية (Vital KPIs) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 shrink-0">
            <div className="px-3 py-1.5 rounded-lg bg-[#061810]/90 border border-[#d4af37]/30 text-center">
              <div className="text-[10px] text-slate-400">الأقسام المسندة</div>
              <div className="text-base font-black text-sky-300 font-mono tabular-nums">
                {stageAssignedClasses.length}
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-[#061810]/90 border border-[#d4af37]/30 text-center">
              <div className="text-[10px] text-slate-400">المقابلات</div>
              <div className="text-base font-black text-[#f5d77f] font-mono tabular-nums">
                {stageInterviews.length}
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-[#061810]/90 border border-[#d4af37]/30 text-center">
              <div className="text-[10px] text-slate-400">بطاقات الرغبات</div>
              <div className="text-base font-black text-emerald-400 font-mono tabular-nums">
                {wishCardsCompletionRate}%
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-[#061810]/90 border border-[#d4af37]/30 text-center">
              <div className="text-[10px] text-slate-400">الغيابات</div>
              <div className="text-base font-black text-amber-400 font-mono tabular-nums">
                {totalUnjustifiedAbsences}
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-rose-950/70 border border-rose-500/40 text-center col-span-2 sm:col-span-1">
              <div className="text-[10px] text-rose-200">إنذار مبكر</div>
              <div className="text-base font-black text-white font-mono tabular-nums">
                {criticalCount}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* الداشبورد الإحصائي الشامل لجميع الأقسام المتعلقة بالمهام + مركز إصدار مستندات PDF */}
      <div className="bg-[#081c13] border border-[#d4af37]/40 rounded-2xl p-5 shadow-xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-[#d4af37]/20 pb-3.5">
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#f5d77f] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#d4af37]" />
              <span>
                الداشبورد الإحصائي الشامل لجميع الأقسام المتعلقة بمهام المستشار
                ومركز تقارير PDF
              </span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              متابعة فورية لنسب إنجاز المهام الميدانية والإدارية في كل قسم مع
              توليد وطباعة مستندات PDF رسمية بضغطة واحدة
            </p>
          </div>

          <button
            onClick={() => handleGenerateSectionPdf('master_dashboard')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] text-xs font-black flex items-center gap-1.5 shadow-md hover:brightness-110 transition cursor-pointer shrink-0"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة وتصدير التقرير الإحصائي العام الشامل (PDF)</span>
          </button>
        </div>

        {/* شبكة البطاقات الإحصائية للأقسام الـ 6 المتعلقة بالمهام */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. إحصائيات التوجيه وإعادة التوجيه */}
          <div className="bg-[#05140d] border border-emerald-800/60 rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-[#f5d77f] flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-[#d4af37]" />
                  <span>1. التوجيه المدرسي وجسور إعادة التوجيه</span>
                </span>
                <span className="text-xs font-mono font-black text-emerald-400 tabular-nums">
                  {wishCardsCompletionRate}%
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-1 tabular-nums">
                    <span>إنجاز بطاقات الرغبات ({completedWishCardsCount}/{stageStudents.length})</span>
                    <span>{wishCardsCompletionRate}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${wishCardsCompletionRate}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-1 tabular-nums">
                    <span>تلبية الرغبة الأولى ({satisfiedWish1Count}) والثانية ({satisfiedWish2Count})</span>
                    <span>{satisfiedWish1Rate}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#d4af37] rounded-full"
                      style={{ width: `${satisfiedWish1Rate}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 tabular-nums">
                  <span>طلبات إعادة التوجيه: {stageReorientation.length}</span>
                  <span className="text-emerald-300 font-bold">
                    مقبول: {stageReorientation.filter((r) => r.committeeDecision === 'مقبول').length}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2.5 border-t border-emerald-900/60 flex items-center justify-between gap-2">
              <button
                onClick={() => onNavigate('orientation')}
                className="text-[11px] font-bold text-slate-300 hover:text-white cursor-pointer"
              >
                فتح القسم ←
              </button>
              <button
                onClick={() => handleGenerateSectionPdf('orientation_report')}
                className="px-2.5 py-1 rounded-lg bg-[#0d2e1f] hover:bg-[#14452f] text-[#f5d77f] border border-[#d4af37]/40 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>محضر التوجيه PDF</span>
              </button>
            </div>
          </div>

          {/* 2. إحصائيات سجل المقابلات الإرشادية واستدعاءات الأولياء */}
          <div className="bg-[#05140d] border border-emerald-800/60 rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-[#f5d77f] flex items-center gap-1.5">
                  <ClipboardList className="w-4 h-4 text-[#d4af37]" />
                  <span>2. سجل المقابلات واستدعاءات الأولياء</span>
                </span>
                <span className="text-xs font-mono font-black text-[#f5d77f] tabular-nums">
                  {stageInterviews.length} مقابلة
                </span>
              </div>

              <div className="space-y-1.5 text-[11px]">
                {domainCounts.slice(0, 4).map((d) => {
                  const pct =
                    stageInterviews.length > 0
                      ? Math.round((d.count / stageInterviews.length) * 100)
                      : 0;
                  return (
                    <div key={d.domain}>
                      <div className="flex justify-between text-slate-300 tabular-nums">
                        <span>{d.domain}</span>
                        <span className="font-bold text-white">
                          {d.count} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                        <div
                          className="h-full bg-sky-400 rounded-full"
                          style={{ width: `${Math.max(8, pct)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2.5 border-t border-emerald-900/60 flex items-center justify-between gap-2">
              <button
                onClick={() => onNavigate('interviews')}
                className="text-[11px] font-bold text-slate-300 hover:text-white cursor-pointer"
              >
                فتح السجل ←
              </button>
              <button
                onClick={() => handleGenerateSectionPdf('interviews_report')}
                className="px-2.5 py-1 rounded-lg bg-[#0d2e1f] hover:bg-[#14452f] text-[#f5d77f] border border-[#d4af37]/40 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>حصيلة المقابلات PDF</span>
              </button>
            </div>
          </div>

          {/* 3. إحصائيات سجل الحالات النفسية ووحدة الكشف UDS */}
          <div className="bg-[#05140d] border border-emerald-800/60 rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-[#f5d77f] flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4 text-rose-400" />
                  <span>3. المتابعة النفسية ووحدة الكشف (UDS)</span>
                </span>
                <span className="text-xs font-mono font-black text-rose-300 tabular-nums">
                  {stageCases.length} ملفات
                </span>
              </div>

              <div className="space-y-1.5 text-[11px]">
                {caseCategoryCounts.map((c) => (
                  <div
                    key={c.category}
                    className="flex items-center justify-between bg-[#081c13] px-2.5 py-1 rounded border border-emerald-900/50 tabular-nums"
                  >
                    <span className="text-slate-300 truncate">{c.category}</span>
                    <span className="font-black text-[#f5d77f]">{c.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2.5 border-t border-emerald-900/60 flex items-center justify-between gap-2">
              <button
                onClick={() => onNavigate('cases')}
                className="text-[11px] font-bold text-slate-300 hover:text-white cursor-pointer"
              >
                فتح الملفات ←
              </button>
              <button
                onClick={() => handleGenerateSectionPdf('cases_uds_report')}
                className="px-2.5 py-1 rounded-lg bg-[#0d2e1f] hover:bg-[#14452f] text-[#f5d77f] border border-[#d4af37]/40 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>تقرير الحالات وUDS PDF</span>
              </button>
            </div>
          </div>

          {/* 4. إحصائيات التوقيت الأسبوعي (32 سا) والأقسام المسندة */}
          <div className="bg-[#05140d] border border-emerald-800/60 rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-[#f5d77f] flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#d4af37]" />
                  <span>4. التوقيت (32 سا) والأقسام المسندة</span>
                </span>
                <span className="text-xs font-mono font-black text-emerald-400 tabular-nums">
                  {stageAssignedClasses.length} أقسام
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[11px] text-slate-300 tabular-nums">
                  <span>إجمالي التلاميذ في الأقسام المسندة:</span>
                  <span className="font-bold text-white">
                    {totalAssignedStudents} تلميذاً
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-1 tabular-nums">
                    <span>
                      الحصص الإعلامية المنجزة ({completedInfoSessions}/{plannedInfoSessions})
                    </span>
                    <span className="font-bold text-[#f5d77f]">
                      {infoSessionsRate}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#d4af37] rounded-full"
                      style={{ width: `${infoSessionsRate}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between text-[11px] text-slate-300 tabular-nums pt-1">
                  <span>أفواج طبقت عليها الروائز النفسية:</span>
                  <span className="font-bold text-emerald-400">
                    {psychTestsClassesCount} / {stageAssignedClasses.length}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2.5 border-t border-emerald-900/60 flex items-center justify-between gap-2">
              <button
                onClick={() => onNavigate('legislation')}
                className="text-[11px] font-bold text-slate-300 hover:text-white cursor-pointer"
              >
                فتح التوقيت والأقسام ←
              </button>
              <button
                onClick={() =>
                  handleGenerateSectionPdf('timetable_classes_report')
                }
                className="px-2.5 py-1 rounded-lg bg-[#0d2e1f] hover:bg-[#14452f] text-[#f5d77f] border border-[#d4af37]/40 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>جدول الأقسام PDF</span>
              </button>
            </div>
          </div>

          {/* 5. إحصائيات سجل طالبي الإعلام والنشاط الأسبوعي */}
          <div className="bg-[#05140d] border border-emerald-800/60 rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-[#f5d77f] flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-sky-400" />
                  <span>5. طالبي الإعلام والبرنامج الأسبوعي</span>
                </span>
                <span className="text-xs font-mono font-black text-sky-300 tabular-nums">
                  {stageInfoSeekers.length} زائر
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-1 tabular-nums">
                    <span>
                      تنفيذ النشاط الأسبوعي ({completedWeeklyCount}/{stageWeekly.length})
                    </span>
                    <span className="font-bold text-emerald-400">
                      {weeklyCompletionRate}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 rounded-full"
                      style={{ width: `${weeklyCompletionRate}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1.5 pt-1 text-center text-[10px]">
                  <div className="bg-[#081c13] p-1.5 rounded border border-emerald-900/50">
                    <div className="text-slate-400">تلاميذ</div>
                    <div className="font-black text-white tabular-nums">
                      {stageInfoSeekers.filter((i) => i.visitorType === 'تلميذ(ة)').length}
                    </div>
                  </div>
                  <div className="bg-[#081c13] p-1.5 rounded border border-emerald-900/50">
                    <div className="text-slate-400">أولياء</div>
                    <div className="font-black text-[#f5d77f] tabular-nums">
                      {stageInfoSeekers.filter((i) => i.visitorType === 'ولي أمر').length}
                    </div>
                  </div>
                  <div className="bg-[#081c13] p-1.5 rounded border border-emerald-900/50">
                    <div className="text-slate-400">أساتذة</div>
                    <div className="font-black text-emerald-300 tabular-nums">
                      {stageInfoSeekers.filter((i) => i.visitorType === 'أستاذ(ة)').length}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2.5 border-t border-emerald-900/60 flex items-center justify-between gap-2">
              <button
                onClick={() => onNavigate('infoseekers')}
                className="text-[11px] font-bold text-slate-300 hover:text-white cursor-pointer"
              >
                فتح السجل ←
              </button>
              <button
                onClick={() =>
                  handleGenerateSectionPdf('infoseekers_weekly_report')
                }
                className="px-2.5 py-1 rounded-lg bg-[#0d2e1f] hover:bg-[#14452f] text-[#f5d77f] border border-[#d4af37]/40 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>حصيلة الإعلام PDF</span>
              </button>
            </div>
          </div>

          {/* 6. الوضعية الإدارية والمالية والتشريع (المرسوم 25-54) */}
          <div className="bg-[#05140d] border border-emerald-800/60 rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-[#f5d77f] flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-[#d4af37]" />
                  <span>6. التشريع ومحاكي الراتب والترقية</span>
                </span>
                <span className="text-xs font-mono font-black text-[#f5d77f] tabular-nums">
                  الصنف {rankMeta.category}
                </span>
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-300">
                <div className="flex items-center justify-between bg-[#081c13] px-2.5 py-1.5 rounded border border-emerald-900/50">
                  <span>الرتبة المعتمدة:</span>
                  <span className="font-bold text-white">
                    {rankMeta.shortTitle}
                  </span>
                </div>
                <div className="flex items-center justify-between bg-[#081c13] px-2.5 py-1.5 rounded border border-emerald-900/50 tabular-nums">
                  <span>الرقم الاستدلالي القاعدي:</span>
                  <span className="font-black text-emerald-400">
                    {rankMeta.baseIndex} نقطة
                  </span>
                </div>
                <div className="flex items-center justify-between bg-[#081c13] px-2.5 py-1.5 rounded border border-emerald-900/50">
                  <span>السند التشريعي:</span>
                  <span className="font-bold text-[#f5d77f]">
                    {rankMeta.decreeRef}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2.5 border-t border-emerald-900/60 flex items-center justify-between gap-2">
              <button
                onClick={() => onNavigate('legislation')}
                className="text-[11px] font-bold text-emerald-300 hover:text-white cursor-pointer flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>المناشير والتشريع</span>
              </button>
              <button
                onClick={() => onNavigate('career_simulator')}
                className="px-2.5 py-1 rounded-lg bg-[#d4af37] hover:bg-[#e5c148] text-[#071710] text-[11px] font-black flex items-center gap-1 cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>فتح محاكي الراتب والتقاعد</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* القسم الرئيسي: رادار الإنذار المبكر (مؤشر الخطورة المركب /100) + الأجندة والمهام */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* نظام الإنذار المبكر (2 أعمدة) */}
        <div className="lg:col-span-2 bg-[#081c13] border border-[#d4af37]/40 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#d4af37]/20 pb-3">
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#f5d77f] flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                <span>
                  نظام الإنذار المبكر والرادار الذكي (مؤشر الخطورة المركب /100)
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                كشف آلي للتلاميذ المهددين بالتسرب أو تدني النتائج (الغياب 30ن +
                النتائج 40ن + السلوك والتوافق 30ن)
              </p>
            </div>

            {/* أزرار التصفية */}
            <div className="flex items-center gap-1 bg-[#05120c] p-1 rounded-xl border border-[#d4af37]/30 text-xs">
              <button
                onClick={() => setRiskFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-colors ${
                  riskFilter === 'all'
                    ? 'bg-[#d4af37] text-[#071710]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                كل المرصودين (
                {studentsWithRisk.filter((x) => x.risk.totalScore >= 30).length})
              </button>
              <button
                onClick={() => setRiskFilter('high')}
                className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-colors ${
                  riskFilter === 'high'
                    ? 'bg-rose-700 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                خطر مرتفع وحرج ({criticalCount})
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {atRiskStudents.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-[#05140d] rounded-xl border border-[#d4af37]/20">
                لا توجد حالات تتجاوز عتبة الإنذار المحددة في هذا الطور حالياً.
              </div>
            ) : (
              atRiskStudents.map(({ student, risk }) => (
                <div
                  key={student.id}
                  className="p-4 rounded-xl bg-[#05140d] border border-[#d4af37]/30 hover:border-[#d4af37]/70 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-black text-sm text-white">
                        {student.fullName}
                      </span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs font-bold text-[#f5d77f]">
                        {student.group}
                      </span>
                      <span className="text-xs text-slate-400">·</span>
                      <span
                        className={`text-xs font-bold ${
                          risk.riskLevel === 'critical'
                            ? 'text-rose-400'
                            : risk.riskLevel === 'high'
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {risk.riskLabelAr}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300">
                      {risk.primaryReasonAr}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-mono tabular-nums pt-1">
                      <span>معدل ف1: {student.term1Avg.toFixed(2)}</span>
                      <span>·</span>
                      <span>معدل ف2: {student.term2Avg.toFixed(2)}</span>
                      <span>·</span>
                      <span>غياب غير مبرر: {student.unjustifiedAbsences}</span>
                      <span>·</span>
                      <span>كود هولاند: {student.hollandCode}</span>
                    </div>
                  </div>

                  {/* مؤشر الخطورة من 100 وأزرار التدخل الفوري */}
                  <div className="flex flex-col sm:items-end gap-2 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">
                        مؤشر الخطورة:
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-lg font-mono font-black text-sm tabular-nums border ${
                          risk.totalScore >= 70
                            ? 'bg-rose-950 text-rose-300 border-rose-500/50'
                            : risk.totalScore >= 50
                            ? 'bg-amber-950 text-amber-300 border-amber-500/50'
                            : 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                        }`}
                      >
                        {risk.totalScore}/100
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() =>
                          onSelectStudentForModal(student, 'profile')
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-[#0d3522] hover:bg-[#134b30] text-emerald-200 border border-emerald-500/30 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>الملف الفردي</span>
                      </button>
                      <button
                        onClick={() =>
                          onSelectStudentForModal(student, 'summon')
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-[#8f1414] hover:bg-[#a81818] text-white border border-[#f5d77f]/30 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <MailWarning className="w-3.5 h-3.5" />
                        <span>استدعاء الولي</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* الأجندة والمهام والتذكيرات الدورية */}
        <div className="bg-[#081c13] border border-[#d4af37]/40 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="border-b border-[#d4af37]/20 pb-3">
              <h3 className="text-base font-black text-[#f5d77f] flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-[#d4af37]" />
                <span>الأجندة والمهام والتذكيرات</span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                مواعيد اليوم والأسبوع ورزنامة التدخلات الميدانية
              </p>
            </div>

            <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
              {stageAgenda.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onToggleAgenda(item.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                    item.completed
                      ? 'bg-[#05120c]/60 border-slate-800 opacity-65'
                      : 'bg-[#05140d] border-[#d4af37]/30 hover:border-[#d4af37]'
                  }`}
                >
                  <button
                    type="button"
                    className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                      item.completed
                        ? 'bg-emerald-600 border-emerald-400 text-white'
                        : 'border-[#d4af37]'
                    }`}
                  >
                    {item.completed && <Check className="w-3 h-3" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-xs font-bold ${
                        item.completed
                          ? 'line-through text-slate-400'
                          : 'text-white'
                      }`}
                    >
                      {item.title}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1 font-mono tabular-nums">
                      <span>{item.date}</span>
                      <span>·</span>
                      <span>{item.time}</span>
                      <span>·</span>
                      <span
                        className={
                          item.priority === 'عاجل'
                            ? 'text-rose-400 font-bold'
                            : 'text-[#f5d77f]'
                        }
                      >
                        {item.priority}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* نموذج إضافة موعد سريع */}
          <form
            onSubmit={handleAddQuickAgenda}
            className="pt-3 border-t border-[#d4af37]/20 space-y-2 text-xs"
          >
            <div className="font-bold text-[#f5d77f]">
              إضافة موعد أو تذكير دوري:
            </div>
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="عنوان الموعد أو المهمة..."
              className="w-full px-3 py-2 rounded-xl bg-[#05140d] border border-[#d4af37]/40 text-white focus:outline-none focus:border-[#f5d77f]"
            />
            <div className="grid grid-cols-3 gap-1.5">
              <input
                type="date"
                value={newTaskDate}
                onChange={(e) => setNewTaskDate(e.target.value)}
                className="px-2 py-1.5 rounded-lg bg-[#05140d] border border-[#d4af37]/30 text-white font-mono text-[11px]"
              />
              <input
                type="time"
                value={newTaskTime}
                onChange={(e) => setNewTaskTime(e.target.value)}
                className="px-2 py-1.5 rounded-lg bg-[#05140d] border border-[#d4af37]/30 text-white font-mono text-[11px]"
              />
              <select
                value={newTaskPriority}
                onChange={(e) =>
                  setNewTaskPriority(
                    e.target.value as 'عاجل' | 'مهم' | 'عادي'
                  )
                }
                className="px-2 py-1.5 rounded-lg bg-[#05140d] border border-[#d4af37]/30 text-white text-[11px]"
              >
                <option value="عاجل">عاجل</option>
                <option value="مهم">مهم</option>
                <option value="عادي">عادي</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] font-black flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة إلى أجندة المستشار</span>
            </button>
          </form>
        </div>
      </div>

      {/* بطاقات الأركان التخصصية الـ 10 لمنصة مستشار */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base sm:text-lg font-black text-[#f5d77f] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#d4af37]" />
            <span>
              الأركان التخصصية لمنصة مستشار التوجيه والإرشاد (SNTE 2026)
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {moduleCards.map((card) => (
            <div
              key={card.id}
              onClick={() => onNavigate(card.id)}
              className="p-4 rounded-2xl bg-[#081c13] border border-[#d4af37]/30 hover:border-[#d4af37] transition-all cursor-pointer flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-xl bg-[#105e32]/50 text-[#f5d77f] border border-[#d4af37]/40">
                    {card.icon}
                  </div>
                  <span className="text-[11px] font-mono font-bold text-emerald-300 tabular-nums">
                    {card.metric}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-[#f5d77f] transition-colors">
                  {card.title}
                </h4>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  {card.subtitle}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#d4af37]/15 flex items-center justify-between text-[11px] text-[#d4af37] font-bold">
                <span>{card.submetric}</span>
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
