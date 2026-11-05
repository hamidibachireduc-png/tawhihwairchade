import React, { useState } from 'react';
import {
  Scale,
  BookOpen,
  Clock,
  Users,
  Search,
  Printer,
  FileDown,
  Plus,
  CheckCircle2,
  Copy,
  Check,
  Building2,
  FileText,
  Calendar,
  Award,
  Trash2,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
} from 'lucide-react';
import {
  LegislationCircular,
  AssignedClassGroup,
  InstitutionInfo,
  EducationStage,
} from '../types';
import { INITIAL_LEGISLATION_CIRCULARS } from '../data/initialData';
import { downloadOfficialPrintableDocument } from '../utils/pdfExport';

interface StatutoryHourItem {
  activity: string;
  shortLabel: string;
  hours: number;
  color: string;
  location: string;
  reference: string;
}

interface SectionDashboardProps {
  assignedClasses: AssignedClassGroup[];
  statutoryHours: StatutoryHourItem[];
}

export const SectionDashboard: React.FC<SectionDashboardProps> = ({
  assignedClasses,
  statutoryHours,
}) => {
  const totalStudents = assignedClasses.reduce(
    (sum, c) => sum + c.studentsCount,
    0
  );
  const totalFemales = assignedClasses.reduce(
    (sum, c) => sum + c.femaleCount,
    0
  );
  const totalMales = Math.max(0, totalStudents - totalFemales);
  const totalRepeaters = assignedClasses.reduce(
    (sum, c) => sum + c.repeatersCount,
    0
  );
  const maxClassStudents = Math.max(
    1,
    ...assignedClasses.map((c) => c.studentsCount)
  );

  const totalCompletedSessions = assignedClasses.reduce(
    (sum, c) => sum + c.infoSessionsCompleted,
    0
  );
  const totalPlannedSessions = assignedClasses.reduce(
    (sum, c) => sum + c.infoSessionsPlanned,
    0
  );
  const overallSessionCoverage =
    totalPlannedSessions > 0
      ? Math.round((totalCompletedSessions / totalPlannedSessions) * 100)
      : 0;

  const psychTestedCount = assignedClasses.filter(
    (c) => c.psychTestsApplied
  ).length;
  const psychCoverageRate =
    assignedClasses.length > 0
      ? Math.round((psychTestedCount / assignedClasses.length) * 100)
      : 0;

  const totalStatutoryHours = statutoryHours.reduce(
    (sum, item) => sum + item.hours,
    0
  );

  return (
    <div className="bg-[#081c13]/95 border border-[#d4af37]/40 rounded-2xl p-5 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800/60 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#f5d77f]">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-white">
              لوحة الإحصائيات البصرية للأقسام المسندة وتوزيع المهام الأسبوعية (SectionDashboard)
            </h3>
            <p className="text-xs text-slate-400">
              تحليل بصري لتعداد التلاميذ في كل قسم، نسب التغطية الإعلامية والنفسية، وتوزيع الـ 32 ساعة الأسبوعية
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="px-2.5 py-1 rounded-lg bg-[#071710] border border-emerald-700/60 text-emerald-300 tabular-nums">
            التغطية الإعلامية: {overallSessionCoverage}%
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-[#071710] border border-[#d4af37]/40 text-[#f5d77f] tabular-nums">
            تغطية الروائز: {psychCoverageRate}%
          </span>
        </div>
      </div>

      {/* 3 Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart 1: عدد التلاميذ في كل قسم مسند (أعمدة بيانية أفقية مزدوجة) */}
        <div className="bg-[#071710] border border-emerald-800/60 rounded-xl p-4 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-[#f5d77f] flex items-center gap-1.5">
                <Users className="w-4 h-4 text-sky-400" />
                <span>1. تعداد التلاميذ في كل قسم مسند</span>
              </span>
              <span className="text-[11px] font-mono font-bold text-slate-300 tabular-nums">
                المجموع: {totalStudents}
              </span>
            </div>

            {assignedClasses.length === 0 ? (
              <div className="text-xs text-slate-400 py-8 text-center">
                لا توجد أقسام مسندة حالياً
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[230px] overflow-y-auto pr-1">
                {assignedClasses.map((cls) => {
                  const widthPct = Math.round(
                    (cls.studentsCount / maxClassStudents) * 100
                  );
                  const femalePct =
                    cls.studentsCount > 0
                      ? Math.round((cls.femaleCount / cls.studentsCount) * 100)
                      : 0;

                  return (
                    <div key={cls.id} className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-white truncate">
                          {cls.groupName}{' '}
                          <span className="text-slate-400 font-normal">
                            ({cls.institutionName})
                          </span>
                        </span>
                        <span className="font-mono font-bold text-[#f5d77f] tabular-nums shrink-0">
                          {cls.studentsCount} تلميذ ({cls.femaleCount} إناث)
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-800/90 rounded-full overflow-hidden flex">
                        <div
                          className="h-full bg-gradient-to-l from-sky-400 to-emerald-500 rounded-full relative transition-all duration-300"
                          style={{ width: `${widthPct}%` }}
                          title={`إناث: ${femalePct}% | معيدون: ${cls.repeatersCount}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-2.5 border-t border-emerald-900/50 grid grid-cols-3 gap-2 text-center text-[11px] tabular-nums">
            <div className="bg-[#081c13] p-1.5 rounded-lg border border-emerald-900/40">
              <div className="text-slate-400">الإناث</div>
              <div className="font-black text-pink-300">{totalFemales}</div>
            </div>
            <div className="bg-[#081c13] p-1.5 rounded-lg border border-emerald-900/40">
              <div className="text-slate-400">الذكور</div>
              <div className="font-black text-sky-300">{totalMales}</div>
            </div>
            <div className="bg-[#081c13] p-1.5 rounded-lg border border-emerald-900/40">
              <div className="text-slate-400">المعيدون</div>
              <div className="font-black text-amber-300">{totalRepeaters}</div>
            </div>
          </div>
        </div>

        {/* Chart 2: نسبة التغطية الإعلامية والنفسية لكل قسم */}
        <div className="bg-[#071710] border border-emerald-800/60 rounded-xl p-4 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-[#f5d77f] flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>2. مؤشر نسبة التغطية حسب الأقسام</span>
              </span>
              <span className="text-[11px] font-mono font-bold text-emerald-400 tabular-nums">
                {totalCompletedSessions}/{totalPlannedSessions} حصة
              </span>
            </div>

            <div className="space-y-2.5 max-h-[230px] overflow-y-auto pr-1">
              {assignedClasses.map((cls) => {
                const coveragePct =
                  cls.infoSessionsPlanned > 0
                    ? Math.round(
                        (cls.infoSessionsCompleted / cls.infoSessionsPlanned) *
                          100
                      )
                    : 0;
                return (
                  <div key={cls.id} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white">
                          {cls.groupName}
                        </span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                            cls.psychTestsApplied
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {cls.psychTestsApplied ? 'روائز ✓' : 'بدون روائز'}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-emerald-300 tabular-nums">
                        {coveragePct}% ({cls.infoSessionsCompleted}/
                        {cls.infoSessionsPlanned})
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-800/90 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          coveragePct >= 75
                            ? 'bg-emerald-500'
                            : coveragePct >= 50
                            ? 'bg-[#d4af37]'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${coveragePct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gauge bars for overall coverage */}
          <div className="pt-2.5 border-t border-emerald-900/50 grid grid-cols-2 gap-2 text-[11px] tabular-nums">
            <div className="bg-[#081c13] p-2 rounded-lg border border-emerald-900/40 flex items-center justify-between">
              <span className="text-slate-300">تغطية الإعلام:</span>
              <span className="font-black text-emerald-400">
                {overallSessionCoverage}%
              </span>
            </div>
            <div className="bg-[#081c13] p-2 rounded-lg border border-emerald-900/40 flex items-center justify-between">
              <span className="text-slate-300">تغطية الروائز:</span>
              <span className="font-black text-[#f5d77f]">
                {psychCoverageRate}%
              </span>
            </div>
          </div>
        </div>

        {/* Chart 3: توزيع المهام الأسبوعية للمستشار (32 ساعة) */}
        <div className="bg-[#071710] border border-emerald-800/60 rounded-xl p-4 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-[#f5d77f] flex items-center gap-1.5">
                <PieChartIcon className="w-4 h-4 text-[#d4af37]" />
                <span>3. توزيع المهام الأسبوعية (32 سا)</span>
              </span>
              <span className="text-[11px] font-mono font-bold text-[#f5d77f] tabular-nums">
                {totalStatutoryHours} ساعة/أسبوع
              </span>
            </div>

            {/* Stacked distribution bar */}
            <div className="w-full h-5 rounded-lg overflow-hidden flex border border-emerald-800/70 mb-3">
              {statutoryHours.map((item, idx) => {
                const pct = Math.round(
                  (item.hours / totalStatutoryHours) * 100
                );
                return (
                  <div
                    key={idx}
                    style={{ width: `${pct}%`, backgroundColor: item.color }}
                    className="h-full flex items-center justify-center text-[9px] font-black text-[#071710] tabular-nums"
                    title={`${item.shortLabel}: ${item.hours} ساعات (${pct}%)`}
                  >
                    {pct >= 12 ? `${pct}%` : ''}
                  </div>
                );
              })}
            </div>

            {/* Breakdown items */}
            <div className="space-y-2">
              {statutoryHours.map((item, idx) => {
                const pct = Math.round(
                  (item.hours / totalStatutoryHours) * 100
                );
                return (
                  <div
                    key={idx}
                    className="bg-[#081c13] px-2.5 py-2 rounded-lg border border-emerald-900/40 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-3 h-3 rounded-sm shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-slate-200 font-bold truncate">
                        {item.shortLabel}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 tabular-nums">
                      <span className="text-xs font-black text-white">
                        {item.hours} سا
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#071710] text-[#f5d77f] font-mono font-bold">
                        {pct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-emerald-900/50 flex items-center justify-between text-[11px] text-slate-400">
            <span>المرجع: القرار الوزاري 831</span>
            <span className="text-emerald-300 font-bold">
              نصاب قانوني مكتمل (100%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface LegislationAndAssignedClassesViewProps {
  activeStage: EducationStage;
  institution: InstitutionInfo;
  assignedClasses: AssignedClassGroup[];
  onAddAssignedClass: (group: AssignedClassGroup) => void;
  onUpdateAssignedClass: (group: AssignedClassGroup) => void;
  onDeleteAssignedClass: (id: string) => void;
}

export const LegislationAndAssignedClassesView: React.FC<
  LegislationAndAssignedClassesViewProps
> = ({
  activeStage,
  institution,
  assignedClasses,
  onAddAssignedClass,
  onUpdateAssignedClass,
  onDeleteAssignedClass,
}) => {
  const [activeTab, setActiveTab] = useState<'legislation' | 'timetable'>(
    'timetable'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New class form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClass, setNewClass] = useState<Omit<AssignedClassGroup, 'id'>>({
    institutionName: institution.schoolName,
    stage: activeStage,
    level: activeStage === 'middle' ? '4 متوسط' : '1 ثانوي ج.م.ع.ت',
    groupName: activeStage === 'middle' ? '4 م 3' : '1 ج م ع ت 3',
    studentsCount: 35,
    femaleCount: 20,
    repeatersCount: 4,
    assignedSlotDay: 'الأحد',
    assignedSlotTime: '10:00 - 11:00',
    infoSessionsCompleted: 2,
    infoSessionsPlanned: 4,
    psychTestsApplied: false,
  });

  // Weekly 32h statutory breakdown
  const statutoryHours: StatutoryHourItem[] = [
    {
      activity: 'حصص الإعلام المدرسي والمهني في الأقسام المسندة والمقابلات الفردية',
      shortLabel: 'الإعلام في الأقسام والمقابلات الفردية',
      hours: 18,
      color: '#10b981',
      location: 'الثانوية ومتوسطات المقاطعة',
      reference: 'المنشور الوزاري 142/و.ت.و',
    },
    {
      activity: 'المتابعة النفسية التربوية، تطبيق الروائز، ومرافقة الفئات الخاصة (UDS)',
      shortLabel: 'المتابعة النفسية والروائز وUDS',
      hours: 6,
      color: '#d4af37',
      location: 'مكتب مستشار التوجيه + وحدة الكشف',
      reference: 'القرار الوزاري 831 المادة 12',
    },
    {
      activity: 'العمل الإداري والتقني، تفريغ بطاقات الرغبات، وتحليل النتائج الفصلية',
      shortLabel: 'العمل التقني وتحليل النتائج والرغبات',
      hours: 4,
      color: '#38bdf8',
      location: 'مكتب مستشار التوجيه',
      reference: 'القرار الوزاري 831 المادة 15',
    },
    {
      activity: 'التنسيق مع مركز التوجيه المدرسي والمهني (COSI) والمجالس البيداغوجية',
      shortLabel: 'التنسيق مع مركز التوجيه والمجالس',
      hours: 4,
      color: '#f59e0b',
      location: 'مركز التوجيه / المؤسسة',
      reference: 'المرسوم التنفيذي 25-54',
    },
  ];

  const filteredCirculars = INITIAL_LEGISLATION_CIRCULARS.filter((c) => {
    const matchesCategory =
      selectedCategory === 'ALL' || c.category === selectedCategory;
    const matchesSearch =
      c.title.includes(searchQuery) ||
      c.referenceCode.includes(searchQuery) ||
      c.summary.includes(searchQuery) ||
      c.articles.some(
        (a) => a.articleNum.includes(searchQuery) || a.content.includes(searchQuery)
      );
    return matchesCategory && matchesSearch;
  });

  const handleCopyCircular = (c: LegislationCircular) => {
    const text = `${c.title}\nالمرجع: ${c.referenceCode} (${c.issueDate})\nالملخص: ${c.summary}\nأهم المواد:\n${c.articles.map((a) => `- ${a.articleNum}: ${a.content}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopiedId(c.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportLegislationPdf = () => {
    const rowsHtml = filteredCirculars
      .map(
        (c, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td style="font-weight:700">${c.title}</td>
        <td>${c.referenceCode}<br/><span style="font-size:10px">${c.issueDate}</span></td>
        <td>${c.summary}</td>
        <td>
          <ul style="margin:0;padding-right:14px">
            ${c.articles.map((a) => `<li><strong>${a.articleNum}:</strong> ${a.content}</li>`).join('')}
          </ul>
        </td>
      </tr>
    `
      )
      .join('');

    downloadOfficialPrintableDocument({
      filename: 'الدليل-التشريعي-والمهام-لمستشار-التوجيه-2026',
      documentTitle:
        'الدليل التشريعي والمناشير الرسمية لمستشار التوجيه والإرشاد المدرسي والمهني',
      documentCode: 'تشريع/م.ت/2026',
      institution,
      bodyHtml: `
        <div class="box">
          <div class="box-title">أولاً: النصوص القانونية والمناشير المرجعية للسلك (${filteredCirculars.length} نصوص رسمية)</div>
          <table>
            <thead>
              <tr>
                <th style="width:35px">الرقم</th>
                <th style="width:190px">عنوان النص التشريعي</th>
                <th style="width:120px">المرجع والتاريخ</th>
                <th>الملخص التنفيذي</th>
                <th>أهم المواد والأحكام البيداغوجية</th>
              </tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
          </table>
        </div>
      `,
    });
  };

  const handleExportTimetablePdf = () => {
    const totalStudents = assignedClasses.reduce(
      (acc, c) => acc + c.studentsCount,
      0
    );
    const totalFemales = assignedClasses.reduce(
      (acc, c) => acc + c.femaleCount,
      0
    );
    const totalCompleted = assignedClasses.reduce(
      (acc, c) => acc + c.infoSessionsCompleted,
      0
    );
    const totalPlanned = assignedClasses.reduce(
      (acc, c) => acc + c.infoSessionsPlanned,
      0
    );

    const statutoryRows = statutoryHours
      .map(
        (s, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td style="font-weight:700">${s.activity}</td>
        <td style="text-align:center;font-weight:800">${s.hours} سا</td>
        <td>${s.location}</td>
        <td>${s.reference}</td>
      </tr>
    `
      )
      .join('');

    const classesRows = assignedClasses
      .map(
        (c, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td style="font-weight:700">${c.groupName}</td>
        <td>${c.level}</td>
        <td>${c.institutionName}</td>
        <td style="text-align:center">${c.studentsCount}</td>
        <td style="text-align:center">${c.femaleCount}</td>
        <td style="text-align:center">${c.repeatersCount}</td>
        <td>${c.assignedSlotDay} (${c.assignedSlotTime})</td>
        <td style="text-align:center">${c.infoSessionsCompleted} / ${c.infoSessionsPlanned}</td>
        <td style="text-align:center">${c.psychTestsApplied ? 'مطبق ✓' : 'قيد الإنجاز'}</td>
      </tr>
    `
      )
      .join('');

    downloadOfficialPrintableDocument({
      filename: 'جدول-التوقيت-الأسبوعي-والأقسام-المسندة-2026',
      documentTitle:
        'جدول التوقيت الأسبوعي الرسمي (32 ساعة) والأقسام التربوية المسندة',
      documentCode: 'توقيت/أقسام/2026',
      institution,
      bodyHtml: `
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-val">${assignedClasses.length}</div>
            <div class="stat-lbl">الأقسام التربوية المسندة</div>
          </div>
          <div class="stat-card">
            <div class="stat-val">${totalStudents}</div>
            <div class="stat-lbl">مجموع التلاميذ المسندين (${totalFemales} إناث)</div>
          </div>
          <div class="stat-card">
            <div class="stat-val">32 سا</div>
            <div class="stat-lbl">الحجم الساعي الأسبوعي القانوني</div>
          </div>
          <div class="stat-card">
            <div class="stat-val">${totalPlanned > 0 ? Math.round((totalCompleted / totalPlanned) * 100) : 0}%</div>
            <div class="stat-lbl">نسبة إنجاز الحصص الإعلامية</div>
          </div>
        </div>

        <div class="box">
          <div class="box-title">أولاً: توزيع الحجم الساعي الأسبوعي القانوني (32 ساعة عمل)</div>
          <table>
            <thead>
              <tr>
                <th style="width:40px">الرقم</th>
                <th>طبيعة النشاط والمهام الميدانية والإدارية</th>
                <th style="width:90px">الحجم الساعي</th>
                <th style="width:160px">مقر الإنجاز</th>
                <th style="width:150px">السند القانوني</th>
              </tr>
            </thead>
            <tbody>${statutoryRows}</tbody>
          </table>
        </div>

        <div class="box">
          <div class="box-title">ثانياً: بطاقة الأقسام التربوية والمؤسسات المسندة لمستشار التوجيه</div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>الفوج التربوي</th>
                <th>المستوى</th>
                <th>المؤسسة التربوية</th>
                <th>التعداد</th>
                <th>الإناث</th>
                <th>المعيدون</th>
                <th>التوقيت الأسبوعي المبرمج</th>
                <th>الحصص المنجزة</th>
                <th>الروائز النفسية</th>
              </tr>
            </thead>
            <tbody>${classesRows}</tbody>
          </table>
        </div>
      `,
    });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAssignedClass({
      ...newClass,
      id: `CLS-${Date.now()}`,
    });
    setShowAddModal(false);
  };

  const totalStudents = assignedClasses.reduce(
    (sum, c) => sum + c.studentsCount,
    0
  );
  const totalFemales = assignedClasses.reduce(
    (sum, c) => sum + c.femaleCount,
    0
  );
  const totalCompletedSessions = assignedClasses.reduce(
    (sum, c) => sum + c.infoSessionsCompleted,
    0
  );
  const totalPlannedSessions = assignedClasses.reduce(
    (sum, c) => sum + c.infoSessionsPlanned,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="no-print bg-gradient-to-l from-[#0b2217] via-[#091c13] to-[#071710] border border-[#d4af37]/30 rounded-2xl p-5 shadow-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#f5d77f] shrink-0">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black text-white">
                التشريع المدرسي، المهام والمناشير، والتوقيت والأقسام المسندة
              </h2>
              <span className="px-2.5 py-0.5 rounded-md bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f5d77f] text-xs font-bold">
                المرسوم التنفيذي 25-54 + القرار 831
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              المرجعية القانونية الكاملة لمستشار التوجيه والإرشاد المدرسي والمهني، توزيع الحجم الساعي (32 ساعة)، وبطاقة الأقسام والمؤسسات المسندة مع التصدير المباشر PDF.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('timetable')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'timetable'
                ? 'bg-[#d4af37] text-[#071710] shadow-md'
                : 'bg-[#071710]/80 text-slate-200 border border-emerald-800/60 hover:border-[#d4af37]/50'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>التوقيت (32 سا) والأقسام المسندة ({assignedClasses.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('legislation')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'legislation'
                ? 'bg-[#d4af37] text-[#071710] shadow-md'
                : 'bg-[#071710]/80 text-slate-200 border border-emerald-800/60 hover:border-[#d4af37]/50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>المهام والمناشير والتشريع</span>
          </button>
        </div>
      </div>

      {/* المكون الإحصائي البصري للقسم (SectionDashboard) */}
      <SectionDashboard
        assignedClasses={assignedClasses}
        statutoryHours={statutoryHours}
      />

      {activeTab === 'legislation' && (
        <div className="space-y-5">
          {/* Rank Tasks Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 no-print">
            <div className="bg-[#081c13]/90 border border-emerald-800/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#f5d77f]">
                  مستشار التوجيه (الصنف 13)
                </span>
                <Award className="w-4 h-4 text-[#d4af37]" />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                الإعلام المدرسي والمهني، المقابلات الفردية، تطبيق الروائز النفسية، مرافقة تلاميذ 4 متوسط و1 ثانوي، ومتابعة الحالات الخاصة.
              </p>
            </div>

            <div className="bg-[#081c13]/90 border border-emerald-800/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#f5d77f]">
                  مستشار رئيسي (الصنف 14)
                </span>
                <Award className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                تنسيق عمليات التوجيه بالمقاطعة، تحليل النتائج الإحصائية الفصلية، دراسة التماسات إعادة التوجيه، وتأطير الحملات الإعلامية.
              </p>
            </div>

            <div className="bg-[#081c13]/90 border border-emerald-800/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#f5d77f]">
                  مستشار مكون (الصنف 16)
                </span>
                <Award className="w-4 h-4 text-sky-400" />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                المرافقة البيداغوجية للمستشارين المتربصين، هندسة وتكييف المقاييس النفسية، والإشراف على الدراسات الميدانية التربوية.
              </p>
            </div>

            <div className="bg-[#081c13]/90 border border-emerald-800/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#f5d77f]">
                  مفتش التوجيه (الصنف 17)
                </span>
                <Award className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                التفتيش والتكوين، مراقبة تنفيذ البرامج السنوية لمراكز التوجيه، وتنسيق الخريطة المدرسية والتوجيه على مستوى الولاية.
              </p>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="no-print bg-[#081c13]/90 border border-emerald-800/60 rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث برقم المنشور، المرسوم، الكلمات المفتاحية (التوقيت، المهام، التوجيه، المخدرات)..."
                className="w-full bg-[#071710] border border-emerald-800/70 rounded-xl pr-9 pl-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'ALL', label: 'جميع النصوص' },
                { id: 'القانون الأساسي والمهام', label: 'القانون الأساسي والمهام' },
                { id: 'مناشير التوجيه وإعادة التوجيه', label: 'مناشير التوجيه' },
                { id: 'التوقيت والأقسام المسندة', label: 'التوقيت والأقسام' },
                { id: 'الإرشاد النفسي ووحدة UDS', label: 'الإرشاد ووحدة UDS' },
                { id: 'المجالس والامتحانات الرسمية', label: 'المجالس والامتحانات' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#d4af37] text-[#071710]'
                      : 'bg-[#071710] text-slate-300 border border-emerald-800/60 hover:border-[#d4af37]/50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportLegislationPdf}
                className="px-3 py-2 rounded-xl bg-[#d4af37] hover:bg-[#e3be42] text-[#071710] text-xs font-black flex items-center gap-1.5 transition cursor-pointer shrink-0"
              >
                <FileDown className="w-4 h-4" />
                <span>تصدير الدليل التشريعي PDF</span>
              </button>
            </div>
          </div>

          {/* Circulars Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredCirculars.map((circular) => (
              <div
                key={circular.id}
                className="bg-[#081c13]/90 border border-emerald-800/60 hover:border-[#d4af37]/40 rounded-2xl p-5 flex flex-col justify-between transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#f5d77f] text-[11px] font-bold">
                      {circular.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono tabular-nums">
                      {circular.issueDate}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-white mb-1">
                    {circular.title}
                  </h3>
                  <p className="text-xs text-emerald-300 font-bold mb-2.5">
                    المرجع الرسمي: {circular.referenceCode}
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3 bg-[#071710]/70 p-3 rounded-xl border border-emerald-900/50">
                    {circular.summary}
                  </p>

                  <div className="space-y-1.5 mb-4">
                    <p className="text-xs font-bold text-[#f5d77f]">
                      أهم المواد والضوابط المهنية:
                    </p>
                    {circular.articles.map((art, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-xs text-slate-200"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-[#f5d77f]">{art.articleNum}:</strong>{' '}
                          {art.content}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-emerald-800/40 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    سند رسمي معتمد في المداولات والتقارير
                  </span>
                  <button
                    onClick={() => handleCopyCircular(circular)}
                    className="px-3 py-1.5 rounded-lg bg-[#071710] hover:bg-emerald-950 border border-emerald-700/60 text-xs font-bold text-[#f5d77f] flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {copiedId === circular.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>تم نسخ السند القانوني</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>نسخ السند للاستدلال</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'timetable' && (
        <div className="space-y-5">
          {/* KPI Summary Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="bg-[#081c13]/90 border border-emerald-800/60 rounded-xl p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>الحجم الساعي القانوني</span>
                <Clock className="w-4 h-4 text-[#d4af37]" />
              </div>
              <div className="text-2xl font-black text-white tabular-nums">
                32 ساعة / أسبوعياً
              </div>
              <p className="text-[11px] text-emerald-300 mt-1">
                موزعة بين الثانوية ومتوسطات المقاطعة
              </p>
            </div>

            <div className="bg-[#081c13]/90 border border-emerald-800/60 rounded-xl p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>الأقسام المسندة</span>
                <Building2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white tabular-nums">
                {assignedClasses.length} أفواج تربوية
              </div>
              <p className="text-[11px] text-slate-300 mt-1">
                ثانوي (1ث / 2ث / 3ث) + متوسط (4م)
              </p>
            </div>

            <div className="bg-[#081c13]/90 border border-emerald-800/60 rounded-xl p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>مجموع التلاميذ المسندين</span>
                <Users className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-2xl font-black text-white tabular-nums">
                {totalStudents} تلميذاً
              </div>
              <p className="text-[11px] text-slate-300 mt-1 tabular-nums">
                الإناث: {totalFemales} ({totalStudents > 0 ? Math.round((totalFemales / totalStudents) * 100) : 0}%)
              </p>
            </div>

            <div className="bg-[#081c13]/90 border border-emerald-800/60 rounded-xl p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>إنجاز الحصص الإعلامية</span>
                <Calendar className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-[#f5d77f] tabular-nums">
                {totalCompletedSessions} / {totalPlannedSessions} حصة
              </div>
              <p className="text-[11px] text-slate-300 mt-1 tabular-nums">
                نسبة التغطية: {totalPlannedSessions > 0 ? Math.round((totalCompletedSessions / totalPlannedSessions) * 100) : 0}%
              </p>
            </div>
          </div>

          {/* 32h Statutory Breakdown Table */}
          <div className="bg-[#081c13]/90 border border-emerald-800/60 rounded-2xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-black text-[#f5d77f]">
                  توزيع الحجم الساعي الأسبوعي الرسمي لمستشار التوجيه (32 ساعة)
                </h3>
                <p className="text-xs text-slate-400">
                  وفق القرار الوزاري رقم 831 والمنشور الوزاري 142/و.ت.و
                </p>
              </div>
              <div className="flex items-center gap-2 no-print">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>إسناد قسم جديد</span>
                </button>
                <button
                  onClick={handleExportTimetablePdf}
                  className="px-3.5 py-2 rounded-xl bg-[#d4af37] hover:bg-[#e3be42] text-[#071710] text-xs font-black flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة وتصدير جدول التوقيت والأقسام PDF</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs border-collapse">
                <thead>
                  <tr className="bg-[#071710] text-[#f5d77f] border-b border-emerald-800/60">
                    <th className="p-2.5">#</th>
                    <th className="p-2.5">طبيعة النشاط البيداغوجي والتقني</th>
                    <th className="p-2.5 text-center">الحجم الساعي</th>
                    <th className="p-2.5">مقر النشاط</th>
                    <th className="p-2.5">المرجع القانوني</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/40">
                  {statutoryHours.map((item, idx) => (
                    <tr key={idx} className="hover:bg-emerald-950/30">
                      <td className="p-2.5 font-bold text-slate-400 tabular-nums">
                        {idx + 1}
                      </td>
                      <td className="p-2.5 font-bold text-white">
                        {item.activity}
                      </td>
                      <td className="p-2.5 text-center">
                        <span className="px-2.5 py-0.5 rounded-md bg-[#d4af37]/20 text-[#f5d77f] font-black tabular-nums">
                          {item.hours} ساعات
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-300">{item.location}</td>
                      <td className="p-2.5 text-emerald-300 font-semibold">
                        {item.reference}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Assigned Classes Interactive Registry */}
          <div className="bg-[#081c13]/90 border border-emerald-800/60 rounded-2xl p-5">
            <h3 className="text-sm font-black text-white mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#d4af37]" />
              <span>بطاقة الأقسام التربوية المسندة ومتابعة الحصص الإعلامية والروائز</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs border-collapse">
                <thead>
                  <tr className="bg-[#071710] text-slate-300 border-b border-emerald-800/60">
                    <th className="p-2.5">الفوج المسند</th>
                    <th className="p-2.5">المستوى</th>
                    <th className="p-2.5">المؤسسة</th>
                    <th className="p-2.5 text-center">التعداد</th>
                    <th className="p-2.5 text-center">الإناث</th>
                    <th className="p-2.5 text-center">المعيدون</th>
                    <th className="p-2.5">التوقيت الأسبوعي</th>
                    <th className="p-2.5 text-center">الحصص الإعلامية</th>
                    <th className="p-2.5 text-center">الروائز النفسية</th>
                    <th className="p-2.5 text-center no-print">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/40">
                  {assignedClasses.map((cls) => (
                    <tr key={cls.id} className="hover:bg-emerald-950/30">
                      <td className="p-2.5 font-black text-[#f5d77f]">
                        {cls.groupName}
                      </td>
                      <td className="p-2.5">
                        <span className="px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-200 font-bold">
                          {cls.level}
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-200 font-semibold">
                        {cls.institutionName}
                      </td>
                      <td className="p-2.5 text-center font-bold text-white tabular-nums">
                        {cls.studentsCount}
                      </td>
                      <td className="p-2.5 text-center text-slate-300 tabular-nums">
                        {cls.femaleCount}
                      </td>
                      <td className="p-2.5 text-center text-amber-300 tabular-nums">
                        {cls.repeatersCount}
                      </td>
                      <td className="p-2.5 text-emerald-300 font-semibold">
                        {cls.assignedSlotDay} ({cls.assignedSlotTime})
                      </td>
                      <td className="p-2.5 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() =>
                              onUpdateAssignedClass({
                                ...cls,
                                infoSessionsCompleted: Math.min(
                                  cls.infoSessionsPlanned,
                                  cls.infoSessionsCompleted + 1
                                ),
                              })
                            }
                            className="px-2 py-0.5 rounded bg-[#071710] border border-emerald-700/60 text-white font-bold tabular-nums hover:border-[#d4af37] cursor-pointer"
                            title="انقر لزيادة حصة منجزة"
                          >
                            {cls.infoSessionsCompleted} / {cls.infoSessionsPlanned}
                          </button>
                        </div>
                      </td>
                      <td className="p-2.5 text-center">
                        <button
                          onClick={() =>
                            onUpdateAssignedClass({
                              ...cls,
                              psychTestsApplied: !cls.psychTestsApplied,
                            })
                          }
                          className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                            cls.psychTestsApplied
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {cls.psychTestsApplied ? 'مطبق ✓' : 'قيد التطبيق'}
                        </button>
                      </td>
                      <td className="p-2.5 text-center no-print">
                        <button
                          onClick={() => onDeleteAssignedClass(cls.id)}
                          className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 transition cursor-pointer"
                          title="حذف القسم"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Modal for Adding Assigned Class */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#081c13] border border-[#d4af37]/40 rounded-2xl max-w-lg w-full p-5 shadow-2xl">
            <h3 className="text-base font-black text-[#f5d77f] mb-4">
              إسناد قسم تربوي جديد لجدول التوقيت
            </h3>
            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-bold">
                    رمز الفوج المسند
                  </label>
                  <input
                    type="text"
                    required
                    value={newClass.groupName}
                    onChange={(e) =>
                      setNewClass({ ...newClass, groupName: e.target.value })
                    }
                    className="w-full bg-[#071710] border border-emerald-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-bold">
                    المستوى التعليمي
                  </label>
                  <input
                    type="text"
                    required
                    value={newClass.level}
                    onChange={(e) =>
                      setNewClass({
                        ...newClass,
                        level: e.target.value,
                      })
                    }
                    className="w-full bg-[#071710] border border-emerald-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-bold">
                    المؤسسة التربوية
                  </label>
                  <input
                    type="text"
                    required
                    value={newClass.institutionName}
                    onChange={(e) =>
                      setNewClass({ ...newClass, institutionName: e.target.value })
                    }
                    className="w-full bg-[#071710] border border-emerald-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-bold">
                    يوم الحصة الأسبوعية
                  </label>
                  <select
                    value={newClass.assignedSlotDay}
                    onChange={(e) =>
                      setNewClass({
                        ...newClass,
                        assignedSlotDay: e.target.value as AssignedClassGroup['assignedSlotDay'],
                      })
                    }
                    className="w-full bg-[#071710] border border-emerald-800 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="الأحد">الأحد</option>
                    <option value="الاثنين">الاثنين</option>
                    <option value="الثلاثاء">الثلاثاء</option>
                    <option value="الأربعاء">الأربعاء</option>
                    <option value="الخميس">الخميس</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-bold">
                    التعداد الكلي
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newClass.studentsCount}
                    onChange={(e) =>
                      setNewClass({
                        ...newClass,
                        studentsCount: Number(e.target.value),
                      })
                    }
                    className="w-full bg-[#071710] border border-emerald-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-bold">
                    عدد الإناث
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newClass.femaleCount}
                    onChange={(e) =>
                      setNewClass({
                        ...newClass,
                        femaleCount: Number(e.target.value),
                      })
                    }
                    className="w-full bg-[#071710] border border-emerald-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-bold">
                    عدد المعيدين
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newClass.repeatersCount}
                    onChange={(e) =>
                      setNewClass({
                        ...newClass,
                        repeatersCount: Number(e.target.value),
                      })
                    }
                    className="w-full bg-[#071710] border border-emerald-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#d4af37] text-[#071710] font-black cursor-pointer"
                >
                  حفظ وإسناد القسم
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
