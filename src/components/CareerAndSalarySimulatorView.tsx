import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Award,
  TrendingUp,
  Clock,
  Landmark,
  FileDown,
  CheckCircle2,
  Coins,
  Briefcase,
} from 'lucide-react';
import { InstitutionInfo, CounselorRankKey } from '../types';
import { downloadOfficialPrintableDocument } from '../utils/pdfExport';

interface CareerAndSalarySimulatorViewProps {
  institution: InstitutionInfo;
}

interface RankConfig {
  id: CounselorRankKey;
  title: string;
  category: number;
  baseIndex: number;
  nextRankTitle: string;
  nextRankCategory: number;
  nextRankBaseIndex: number;
  supervisionRate: number; // علاوة التأطير والتوجيه %
  qualificationRate: number; // تعويض التأهيل %
}

const SIMULATOR_RANKS: Record<CounselorRankKey, RankConfig> = {
  counselor: {
    id: 'counselor',
    title: 'مستشار التوجيه والإرشاد المدرسي والمهني',
    category: 13,
    baseIndex: 778,
    nextRankTitle: 'مستشار رئيسي للتوجيه والإرشاد المدرسي والمهني',
    nextRankCategory: 14,
    nextRankBaseIndex: 821,
    supervisionRate: 0.25,
    qualificationRate: 0.45,
  },
  principal_counselor: {
    id: 'principal_counselor',
    title: 'مستشار رئيسي للتوجيه والإرشاد المدرسي والمهني',
    category: 14,
    baseIndex: 821,
    nextRankTitle: 'مستشار مكون للتوجيه والإرشاد المدرسي والمهني',
    nextRankCategory: 16,
    nextRankBaseIndex: 913,
    supervisionRate: 0.30,
    qualificationRate: 0.48,
  },
  trainer_counselor: {
    id: 'trainer_counselor',
    title: 'مستشار مكون للتوجيه والإرشاد المدرسي والمهني',
    category: 16,
    baseIndex: 913,
    nextRankTitle: 'مفتش التوجيه والإرشاد المدرسي والمهني',
    nextRankCategory: 17,
    nextRankBaseIndex: 962,
    supervisionRate: 0.35,
    qualificationRate: 0.50,
  },
  inspector_counselor: {
    id: 'inspector_counselor',
    title: 'مفتش التوجيه والإرشاد المدرسي والمهني',
    category: 17,
    baseIndex: 962,
    nextRankTitle: 'مفتش عام للبيداغوجيا والتوجيه',
    nextRankCategory: 17,
    nextRankBaseIndex: 1050,
    supervisionRate: 0.40,
    qualificationRate: 0.55,
  },
};

const POINT_VALUE = 45; // قيمة النقطة الاستدلالية بالجزائر (45 دج)

export const CareerAndSalarySimulatorView: React.FC<
  CareerAndSalarySimulatorViewProps
> = ({ institution }) => {
  const [activeTab, setActiveTab] = useState<
    'salary' | 'seniority' | 'promotion' | 'retirement'
  >('salary');

  // Salary & Echelon state
  const [selectedRank, setSelectedRank] = useState<CounselorRankKey>(
    institution.rankKey || 'principal_counselor'
  );
  const [echelon, setEchelon] = useState<number>(6); // الدرجة من 0 إلى 12
  const [childrenCount, setChildrenCount] = useState<number>(2);
  const [singleIncomeSpouse, setSingleIncomeSpouse] = useState<boolean>(true); // منحة الأجر الوحيد
  const [zoneAllowanceRate, setZoneAllowanceRate] = useState<number>(0); // منحة المنطقة / الجنوب (0%، 15%، 25%، 35%)
  const [yieldMark, setYieldMark] = useState<number>(40); // نقطة المردودية من 40

  // Seniority Calculator state
  const [firstAppointmentDate, setFirstAppointmentDate] =
    useState<string>('2013-09-01');
  const [currentRankDate, setCurrentRankDate] = useState<string>('2019-12-31');
  const [lastEchelonDate, setLastEchelonDate] = useState<string>('2023-06-01');
  const [promotionSpeed, setPromotionSpeed] = useState<
    'min' | 'med' | 'max'
  >('min'); // الدنيا 2.5، المتوسطة 3، القصوى 3.5

  // Promotion Simulator state
  const [adminMark, setAdminMark] = useState<number>(19.5); // نقطة المدير من 20
  const [inspectorMark, setInspectorMark] = useState<number>(18.5); // نقطة المفتش من 20
  const [extraDegreePoints, setExtraDegreePoints] = useState<number>(2); // شهادات إضافية (ماستر/دكتوراه)
  const [studyDaysCount, setStudyDaysCount] = useState<number>(6); // ندوات وأيام دراسية

  // Retirement Simulator state
  const [birthDate, setBirthDate] = useState<string>('1975-04-15');
  const [serviceYears, setServiceYears] = useState<number>(28);
  const [universityYearsBought, setUniversityYearsBought] = useState<number>(4); // شراء سنوات الدراسة الجامعية
  const [nationalServiceYears, setNationalServiceYears] = useState<number>(1); // الخدمة الوطنية

  const rankCfg = SIMULATOR_RANKS[selectedRank];

  // Calculate Echelon points (each echelon is ~5% of base index rounded)
  const echelonIndexPoints = useMemo(() => {
    return Math.round(rankCfg.baseIndex * 0.05 * echelon);
  }, [rankCfg.baseIndex, echelon]);

  const totalIndex = rankCfg.baseIndex + echelonIndexPoints;

  // Detailed Salary Breakdown (Algerian Decree 25-54 of 2026)
  const salaryCalc = useMemo(() => {
    const baseSalary = totalIndex * POINT_VALUE; // الراتب الرئيسي (القاعدي + الخبرة المهنية)
    const mainBaseOnly = rankCfg.baseIndex * POINT_VALUE;
    const echelonAmount = echelonIndexPoints * POINT_VALUE;

    // Allowances calculated on Base Salary (الراتب الرئيسي)
    const pedagogicalExp = Math.round(baseSalary * 0.12); // تعويض الخبرة البيداغوجية (12%)
    const qualificationAllowance = Math.round(
      baseSalary * rankCfg.qualificationRate
    ); // تعويض التأهيل (45% - 55%)
    const supervisionAllowance = Math.round(
      baseSalary * rankCfg.supervisionRate
    ); // علاوة التأطير والتوجيه والمتابعة النفسية (25% - 40%)
    const supportAllowance = Math.round(baseSalary * 0.15); // تعويض الدعم المدرسي والمعالجة البيداغوجية (15%)
    const documentationAllowance =
      rankCfg.category >= 16 ? 4500 : 3500; // منحة التوثيق التربوي
    const postAllowance = Math.round(baseSalary * 0.10); // تعويض المنصب والتنقل الميداني بالمقاطعة (10%)
    const zoneAllowance = Math.round(
      mainBaseOnly * (zoneAllowanceRate / 100)
    ); // منحة المنطقة / الجنوب

    const taxableGross =
      baseSalary +
      pedagogicalExp +
      qualificationAllowance +
      supervisionAllowance +
      supportAllowance +
      documentationAllowance +
      postAllowance +
      zoneAllowance;

    // Social Security (9%)
    const socialSecurity = Math.round(taxableGross * 0.09);
    const netTaxable = taxableGross - socialSecurity;

    // Algerian IRG 2026 progressive brackets approximation
    let irgTax = 0;
    if (netTaxable > 30000) {
      if (netTaxable <= 40000) {
        irgTax = Math.round((netTaxable - 30000) * 0.23 * 0.6);
      } else if (netTaxable <= 80000) {
        irgTax = Math.round(2300 + (netTaxable - 40000) * 0.27);
      } else {
        irgTax = Math.round(13100 + (netTaxable - 80000) * 0.30);
      }
    }

    // Family Allowances (Non-taxable)
    const familyAllowance =
      childrenCount * 300 + (singleIncomeSpouse ? 800 : 0);

    const netMonthlySalary =
      taxableGross - socialSecurity - irgTax + familyAllowance;

    // Quarterly Yield Bonus (منحة المردودية الفصلية - حتى 40% كل 3 أشهر)
    const quarterlyGrossYield = Math.round(
      baseSalary * 3 * (yieldMark / 100)
    );
    const quarterlySS = Math.round(quarterlyGrossYield * 0.09);
    const quarterlyIRG = Math.round(
      (quarterlyGrossYield - quarterlySS) * 0.10
    );
    const quarterlyNetYield =
      quarterlyGrossYield - quarterlySS - quarterlyIRG;

    return {
      mainBaseOnly,
      echelonAmount,
      baseSalary,
      pedagogicalExp,
      qualificationAllowance,
      supervisionAllowance,
      supportAllowance,
      documentationAllowance,
      postAllowance,
      zoneAllowance,
      taxableGross,
      socialSecurity,
      irgTax,
      familyAllowance,
      netMonthlySalary,
      quarterlyGrossYield,
      quarterlyNetYield,
    };
  }, [
    totalIndex,
    rankCfg,
    echelonIndexPoints,
    zoneAllowanceRate,
    childrenCount,
    singleIncomeSpouse,
    yieldMark,
  ]);

  // Seniority Calculation
  const seniorityCalc = useMemo(() => {
    const now = new Date('2026-04-20');
    const calcDiff = (dateStr: string) => {
      const d = new Date(dateStr);
      if (isNaN(d.getTime()))
        return { years: 0, months: 0, days: 0, totalYears: 0 };
      let years = now.getFullYear() - d.getFullYear();
      let months = now.getMonth() - d.getMonth();
      let days = now.getDate() - d.getDate();
      if (days < 0) {
        months -= 1;
        days += 30;
      }
      if (months < 0) {
        years -= 1;
        months += 12;
      }
      const totalYears = +(years + months / 12 + days / 365).toFixed(2);
      return { years, months, days, totalYears };
    };

    const general = calcDiff(firstAppointmentDate);
    const inRank = calcDiff(currentRankDate);
    const sinceLastEchelon = calcDiff(lastEchelonDate);

    const durationMonths =
      promotionSpeed === 'min' ? 30 : promotionSpeed === 'med' ? 36 : 42;
    const lastDate = new Date(lastEchelonDate);
    const nextEchelonDate = new Date(lastDate);
    nextEchelonDate.setMonth(nextEchelonDate.getMonth() + durationMonths);

    const nextEchelonIndexGain = Math.round(rankCfg.baseIndex * 0.05);
    const nextEchelonMonthlyGain = Math.round(
      nextEchelonIndexGain * POINT_VALUE * 1.65
    );

    return {
      general,
      inRank,
      sinceLastEchelon,
      nextEchelonDate: nextEchelonDate.toISOString().split('T')[0],
      nextEchelonIndexGain,
      nextEchelonMonthlyGain,
    };
  }, [
    firstAppointmentDate,
    currentRankDate,
    lastEchelonDate,
    promotionSpeed,
    rankCfg.baseIndex,
  ]);

  // Promotion Scale Calculation
  const promotionCalc = useMemo(() => {
    const rankSeniorityPoints = Math.min(20, seniorityCalc.inRank.years * 2);
    const generalSeniorityPoints = Math.min(
      10,
      Math.max(0, seniorityCalc.general.years - seniorityCalc.inRank.years) * 1
    );
    const echelonPoints = echelon * 1;
    const evaluationsPoints = +(adminMark + inspectorMark * 2).toFixed(2);
    const studyDaysPoints = Math.min(6, studyDaysCount * 0.5);
    const totalScore = +(
      rankSeniorityPoints +
      generalSeniorityPoints +
      echelonPoints +
      evaluationsPoints +
      extraDegreePoints +
      studyDaysPoints
    ).toFixed(2);

    const nextRankIndexDiff = rankCfg.nextRankBaseIndex - rankCfg.baseIndex;
    const estimatedMonthlyNetGain = Math.round(
      nextRankIndexDiff * POINT_VALUE * 1.78
    );

    const eligibleForExam = seniorityCalc.inRank.years >= 5;
    const eligibleForList = seniorityCalc.inRank.years >= 10;

    return {
      rankSeniorityPoints,
      generalSeniorityPoints,
      echelonPoints,
      evaluationsPoints,
      studyDaysPoints,
      totalScore,
      nextRankIndexDiff,
      estimatedMonthlyNetGain,
      eligibleForExam,
      eligibleForList,
    };
  }, [
    seniorityCalc,
    echelon,
    adminMark,
    inspectorMark,
    studyDaysCount,
    extraDegreePoints,
    rankCfg,
  ]);

  // Retirement Calculation
  const retirementCalc = useMemo(() => {
    const totalAccreditedYears = Math.min(
      32,
      serviceYears + universityYearsBought + nationalServiceYears
    );
    const pensionPercentage = Math.min(80, totalAccreditedYears * 2.5);
    const referenceGross5Years = Math.round(salaryCalc.taxableGross * 0.97);
    const grossPension = Math.round(
      referenceGross5Years * (pensionPercentage / 100)
    );
    const pensionDeductions = Math.round(grossPension * 0.07);
    const spouseSupplement = singleIncomeSpouse ? 2500 : 0;
    const netMonthlyPension =
      grossPension - pensionDeductions + spouseSupplement;

    const endOfCareerGrant = Math.round(salaryCalc.netMonthlySalary * 6);

    const birthYear = new Date(birthDate).getFullYear() || 1975;
    const currentAge = 2026 - birthYear;

    return {
      totalAccreditedYears,
      pensionPercentage,
      referenceGross5Years,
      grossPension,
      netMonthlyPension,
      endOfCareerGrant,
      currentAge,
    };
  }, [
    serviceYears,
    universityYearsBought,
    nationalServiceYears,
    salaryCalc.taxableGross,
    salaryCalc.netMonthlySalary,
    singleIncomeSpouse,
    birthDate,
  ]);

  const handleExportSimulatorPdf = () => {
    downloadOfficialPrintableDocument({
      filename: 'كشف-محاكي-الراتب-والترقية-والتقاعد-مستشار-التوجيه-2026',
      documentTitle:
        'بطاقة المحاكاة المالية والإدارية لمستشار التوجيه والإرشاد المدرسي والمهني',
      documentCode: 'محاكي/راتب-ترقية/2026',
      institution,
      bodyHtml: `
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-val">${salaryCalc.netMonthlySalary.toLocaleString('ar-DZ')} دج</div>
            <div class="stat-lbl">الراتب الشهري الصافي</div>
          </div>
          <div class="stat-card">
            <div class="stat-val">${salaryCalc.quarterlyNetYield.toLocaleString('ar-DZ')} دج</div>
            <div class="stat-lbl">منحة المردودية الصافية (40%)</div>
          </div>
          <div class="stat-card">
            <div class="stat-val">${promotionCalc.totalScore} نقطة</div>
            <div class="stat-lbl">مجموع نقاط الترقية للرتبة الأعلى</div>
          </div>
          <div class="stat-card">
            <div class="stat-val">${retirementCalc.netMonthlyPension.toLocaleString('ar-DZ')} دج</div>
            <div class="stat-lbl">المعاش التقاعدي الصافي المتوقع (${retirementCalc.pensionPercentage}%)</div>
          </div>
        </div>

        <div class="box">
          <div class="box-title">أولاً: تفصيل الراتب الشهري والمنح والعلاوات (الصنف ${rankCfg.category} - الدرجة ${echelon} - الاستدلالي الكلي ${totalIndex})</div>
          <table>
            <thead>
              <tr>
                <th>العنصر المالي / العلاوة</th>
                <th>المرجع والنسبة القانونية</th>
                <th>المبلغ الشهري (دج)</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>الأجر القاعدي للرتبة (الصنف ${rankCfg.category})</td><td>الرقم الاستدلالي ${rankCfg.baseIndex} × 45 دج</td><td>${salaryCalc.mainBaseOnly.toLocaleString('ar-DZ')} دج</td></tr>
              <tr><td>تعويض الخبرة المهنية (الدرجة ${echelon})</td><td>${echelonIndexPoints} نقطة استدلالية إضافية</td><td>${salaryCalc.echelonAmount.toLocaleString('ar-DZ')} دج</td></tr>
              <tr><td>تعويض الخبرة البيداغوجية</td><td>12% من الراتب الرئيسي</td><td>${salaryCalc.pedagogicalExp.toLocaleString('ar-DZ')} دج</td></tr>
              <tr><td>تعويض التأهيل البيداغوجي</td><td>${Math.round(rankCfg.qualificationRate * 100)}% من الراتب الرئيسي</td><td>${salaryCalc.qualificationAllowance.toLocaleString('ar-DZ')} دج</td></tr>
              <tr><td>علاوة التأطير والتوجيه والمتابعة النفسية</td><td>${Math.round(rankCfg.supervisionRate * 100)}% من الراتب الرئيسي</td><td>${salaryCalc.supervisionAllowance.toLocaleString('ar-DZ')} دج</td></tr>
              <tr><td>تعويض الدعم المدرسي والتوثيق والمنصب</td><td>15% دعم + 10% منصب + توثيق</td><td>${(salaryCalc.supportAllowance + salaryCalc.documentationAllowance + salaryCalc.postAllowance).toLocaleString('ar-DZ')} دج</td></tr>
              <tr><td>الراتب الخام الخاضع للاقتطاع</td><td>مجموع العناصر الخاضعة</td><td style="font-weight:800">${salaryCalc.taxableGross.toLocaleString('ar-DZ')} دج</td></tr>
              <tr><td>اقتطاع الضمان الاجتماعي (9%) + الضريبة IRG</td><td>اقتطاعات قانونية</td><td>- ${(salaryCalc.socialSecurity + salaryCalc.irgTax).toLocaleString('ar-DZ')} دج</td></tr>
              <tr><td style="font-weight:800">الراتب الشهري الصافي للدفع</td><td>شامل المنح العائلية (${salaryCalc.familyAllowance} دج)</td><td style="font-weight:900;font-size:13px">${salaryCalc.netMonthlySalary.toLocaleString('ar-DZ')} دج</td></tr>
            </tbody>
          </table>
        </div>

        <div class="box">
          <div class="box-title">ثانياً: حساب الأقدمية والترقية والتقاعد</div>
          <table>
            <thead>
              <tr>
                <th>المؤشر الإداري والمهني</th>
                <th>القيمة المحسوبة</th>
                <th>الأثر المالي / القانوني</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>الأقدمية العامة في القطاع</td><td>${seniorityCalc.general.years} سنة و ${seniorityCalc.general.months} شهر</td><td>تحتسب في التقاعد والترقية الاختيارية</td></tr>
              <tr><td>الأقدمية في الرتبة الحالية</td><td>${seniorityCalc.inRank.years} سنة و ${seniorityCalc.inRank.months} شهر</td><td>تاريخ الدرجة القادمة: ${seniorityCalc.nextEchelonDate} (+${seniorityCalc.nextEchelonMonthlyGain} دج/شهر)</td></tr>
              <tr><td>الترقية إلى رتبة: ${rankCfg.nextRankTitle}</td><td>الصنف ${rankCfg.nextRankCategory} (الاستدلالي ${rankCfg.nextRankBaseIndex})</td><td>زيادة صافية مقدرة بـ: +${promotionCalc.estimatedMonthlyNetGain.toLocaleString('ar-DZ')} دج شهرياً</td></tr>
              <tr><td>الحصيلة التقاعدية (${retirementCalc.totalAccreditedYears} سنة معتمدة)</td><td>نسبة التصفية: ${retirementCalc.pensionPercentage}%</td><td>معاش صافي: ${retirementCalc.netMonthlyPension.toLocaleString('ar-DZ')} دج + منحة نهاية الخدمة: ${retirementCalc.endOfCareerGrant.toLocaleString('ar-DZ')} دج</td></tr>
            </tbody>
          </table>
        </div>
      `,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="no-print bg-gradient-to-l from-[#0b2217] via-[#091c13] to-[#071710] border border-[#d4af37]/30 rounded-2xl p-5 shadow-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#f5d77f] shrink-0">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black text-white">
                المحاكي الذكي للدرجات والراتب والأقدمية والترقية والتقاعد
              </h2>
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                محدث وفق المرسوم 25-54 لسنة 2026
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              حاسبة دقيقة لرتب التوجيه الأربع: الراتب الصافي والخام، العلاوات والمنح، المردودية (40%)، الأقدمية، الترقية، ومعاش التقاعد مع تصدير كشف PDF.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportSimulatorPdf}
            className="px-3.5 py-2 rounded-xl bg-[#d4af37] hover:bg-[#e3be42] text-[#071710] text-xs font-black flex items-center gap-1.5 transition cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
            <span>تصدير الكشف المالي والإداري PDF</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="no-print grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {[
          {
            id: 'salary',
            label: 'الراتب والدرجات والمنح والعلاوات',
            icon: Coins,
          },
          {
            id: 'seniority',
            label: 'حساب الأقدمية العامة وفي الرتبة',
            icon: Clock,
          },
          {
            id: 'promotion',
            label: 'محاكي الترقية للرتب الأعلى',
            icon: TrendingUp,
          },
          {
            id: 'retirement',
            label: 'حاسبة التقاعد ومنحة نهاية الخدمة',
            icon: Landmark,
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(
                  tab.id as 'salary' | 'seniority' | 'promotion' | 'retirement'
                )
              }
              className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                active
                  ? 'bg-[#d4af37] text-[#071710] border-[#d4af37] shadow-lg'
                  : 'bg-[#081c13]/90 text-slate-200 border-emerald-800/60 hover:border-[#d4af37]/50'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: SALARY, ECHELONS & ALLOWANCES */}
      {activeTab === 'salary' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Controls Column */}
          <div className="lg:col-span-5 bg-[#081c13]/90 border border-emerald-800/60 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-black text-[#f5d77f] flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              <span>معطيات الرتبة والدرجة والوضعية العائلية</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                الرتبة الحالية في سلك التوجيه (المرسوم 25-54)
              </label>
              <select
                value={selectedRank}
                onChange={(e) =>
                  setSelectedRank(e.target.value as CounselorRankKey)
                }
                className="w-full bg-[#071710] border border-emerald-800 rounded-xl px-3 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-[#d4af37]"
              >
                {Object.values(SIMULATOR_RANKS).map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title} (الصنف {r.category} - الاستدلالي {r.baseIndex})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-300">
                  الدرجة الحالية (من 0 إلى 12)
                </span>
                <span className="font-black text-[#f5d77f] tabular-nums">
                  الدرجة {echelon} (+{echelonIndexPoints} نقطة استدلالية)
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={12}
                value={echelon}
                onChange={(e) => setEchelon(Number(e.target.value))}
                className="w-full accent-[#d4af37] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 tabular-nums mt-1">
                <span>متربص (0)</span>
                <span>3</span>
                <span>6</span>
                <span>9</span>
                <span>الدرجة 12</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  عدد الأطفال المتمدرسين
                </label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={childrenCount}
                  onChange={(e) => setChildrenCount(Number(e.target.value))}
                  className="w-full bg-[#071710] border border-emerald-800 rounded-xl px-3 py-2 text-xs text-white tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  منحة المنطقة / الجنوب
                </label>
                <select
                  value={zoneAllowanceRate}
                  onChange={(e) =>
                    setZoneAllowanceRate(Number(e.target.value))
                  }
                  className="w-full bg-[#071710] border border-emerald-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value={0}>الشمال (0%)</option>
                  <option value={15}>الهضاب العليا (15%)</option>
                  <option value={25}>الجنوب (25%)</option>
                  <option value={35}>الجنوب الكبير (35%)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between bg-[#071710] p-3 rounded-xl border border-emerald-900/60">
              <span className="text-xs font-bold text-slate-200">
                الاستفادة من منحة الأجر الوحيد (800 دج)
              </span>
              <input
                type="checkbox"
                checked={singleIncomeSpouse}
                onChange={(e) => setSingleIncomeSpouse(e.target.checked)}
                className="w-4 h-4 accent-[#d4af37] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-300">
                  نقطة منحة المردودية الفصلية (من 40)
                </span>
                <span className="font-black text-emerald-400 tabular-nums">
                  {yieldMark} / 40
                </span>
              </div>
              <input
                type="range"
                min={20}
                max={40}
                value={yieldMark}
                onChange={(e) => setYieldMark(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Salary Breakdown Column */}
          <div className="lg:col-span-7 bg-[#081c13]/90 border border-emerald-800/60 rounded-2xl p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-gradient-to-br from-[#d4af37]/20 to-[#071710] border border-[#d4af37]/50 rounded-xl p-3.5">
                <span className="text-[11px] text-slate-300 block">
                  الراتب الشهري الصافي
                </span>
                <span className="text-xl font-black text-[#f5d77f] tabular-nums">
                  {salaryCalc.netMonthlySalary.toLocaleString('ar-DZ')} دج
                </span>
                <span className="text-[10px] text-emerald-300 block mt-0.5 tabular-nums">
                  الاستدلالي الكلي: {totalIndex} نقطة
                </span>
              </div>

              <div className="bg-[#071710] border border-emerald-800/60 rounded-xl p-3.5">
                <span className="text-[11px] text-slate-300 block">
                  منحة المردودية الصافية (3 أشهر)
                </span>
                <span className="text-xl font-black text-emerald-400 tabular-nums">
                  {salaryCalc.quarterlyNetYield.toLocaleString('ar-DZ')} دج
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5 tabular-nums">
                  الخام: {salaryCalc.quarterlyGrossYield.toLocaleString('ar-DZ')} دج
                </span>
              </div>

              <div className="bg-[#071710] border border-emerald-800/60 rounded-xl p-3.5">
                <span className="text-[11px] text-slate-300 block">
                  الراتب الخام الخاضع للاقتطاع
                </span>
                <span className="text-xl font-black text-white tabular-nums">
                  {salaryCalc.taxableGross.toLocaleString('ar-DZ')} دج
                </span>
                <span className="text-[10px] text-rose-300 block mt-0.5 tabular-nums">
                  اقتطاعات: {(salaryCalc.socialSecurity + salaryCalc.irgTax).toLocaleString('ar-DZ')} دج
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs border-collapse">
                <thead>
                  <tr className="bg-[#071710] text-[#f5d77f] border-b border-emerald-800/60">
                    <th className="p-2.5">البند المالي / المنحة</th>
                    <th className="p-2.5">قاعدة الحساب</th>
                    <th className="p-2.5 text-left">المبلغ (دج)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/40">
                  <tr>
                    <td className="p-2 font-bold text-white">
                      الأجر القاعدي للرتبة (الصنف {rankCfg.category})
                    </td>
                    <td className="p-2 text-slate-400 tabular-nums">
                      {rankCfg.baseIndex} نقطة × 45 دج
                    </td>
                    <td className="p-2 text-left font-bold text-white tabular-nums">
                      {salaryCalc.mainBaseOnly.toLocaleString('ar-DZ')}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-white">
                      تعويض الخبرة المهنية (الدرجة {echelon})
                    </td>
                    <td className="p-2 text-slate-400 tabular-nums">
                      {echelonIndexPoints} نقطة × 45 دج
                    </td>
                    <td className="p-2 text-left font-bold text-emerald-300 tabular-nums">
                      +{salaryCalc.echelonAmount.toLocaleString('ar-DZ')}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 text-slate-200">
                      تعويض الخبرة البيداغوجية
                    </td>
                    <td className="p-2 text-slate-400">12% من الراتب الرئيسي</td>
                    <td className="p-2 text-left text-slate-200 tabular-nums">
                      +{salaryCalc.pedagogicalExp.toLocaleString('ar-DZ')}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 text-slate-200">
                      تعويض التأهيل البيداغوجي
                    </td>
                    <td className="p-2 text-slate-400 tabular-nums">
                      {Math.round(rankCfg.qualificationRate * 100)}% من الراتب الرئيسي
                    </td>
                    <td className="p-2 text-left text-slate-200 tabular-nums">
                      +{salaryCalc.qualificationAllowance.toLocaleString('ar-DZ')}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 text-slate-200">
                      علاوة التأطير والتوجيه والمتابعة النفسية
                    </td>
                    <td className="p-2 text-slate-400 tabular-nums">
                      {Math.round(rankCfg.supervisionRate * 100)}% من الراتب الرئيسي
                    </td>
                    <td className="p-2 text-left text-slate-200 tabular-nums">
                      +{salaryCalc.supervisionAllowance.toLocaleString('ar-DZ')}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 text-slate-200">
                      تعويض الدعم المدرسي والإرشاد (15%) + المنصب (10%)
                    </td>
                    <td className="p-2 text-slate-400">25% من الراتب الرئيسي</td>
                    <td className="p-2 text-left text-slate-200 tabular-nums">
                      +{(salaryCalc.supportAllowance + salaryCalc.postAllowance).toLocaleString('ar-DZ')}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 text-slate-200">
                      منحة التوثيق التربوي + المنطقة ({zoneAllowanceRate}%)
                    </td>
                    <td className="p-2 text-slate-400">مبلغ جزافي + نسبة المنطقة</td>
                    <td className="p-2 text-left text-slate-200 tabular-nums">
                      +{(salaryCalc.documentationAllowance + salaryCalc.zoneAllowance).toLocaleString('ar-DZ')}
                    </td>
                  </tr>
                  <tr className="bg-rose-950/20">
                    <td className="p-2 text-rose-300 font-bold">
                      اقتطاع الضمان الاجتماعي (9%) + ضريبة الدخل IRG
                    </td>
                    <td className="p-2 text-rose-300/80 tabular-nums">
                      ضمان: {salaryCalc.socialSecurity.toLocaleString('ar-DZ')} | ضريبة: {salaryCalc.irgTax.toLocaleString('ar-DZ')}
                    </td>
                    <td className="p-2 text-left font-bold text-rose-300 tabular-nums">
                      -{(salaryCalc.socialSecurity + salaryCalc.irgTax).toLocaleString('ar-DZ')}
                    </td>
                  </tr>
                  <tr className="bg-[#071710]">
                    <td className="p-2.5 font-black text-[#f5d77f]">
                      الصافي الشهري للدفع (شامل المنح العائلية {salaryCalc.familyAllowance} دج)
                    </td>
                    <td className="p-2.5 text-emerald-300 font-bold">
                      صافي قابل للتحويل البريدي/البنكي
                    </td>
                    <td className="p-2.5 text-left font-black text-base text-[#f5d77f] tabular-nums">
                      {salaryCalc.netMonthlySalary.toLocaleString('ar-DZ')} دج
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SENIORITY IN RANK & GENERAL SENIORITY */}
      {activeTab === 'seniority' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-5 bg-[#081c13]/90 border border-emerald-800/60 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-black text-[#f5d77f]">
              تواريخ السريان والترقية في الدرجات
            </h3>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                تاريخ أول توظيف في القطاع (الأقدمية العامة)
              </label>
              <input
                type="date"
                value={firstAppointmentDate}
                onChange={(e) => setFirstAppointmentDate(e.target.value)}
                className="w-full bg-[#071710] border border-emerald-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                تاريخ التعيين في الرتبة الحالية (الأقدمية في الرتبة)
              </label>
              <input
                type="date"
                value={currentRankDate}
                onChange={(e) => setCurrentRankDate(e.target.value)}
                className="w-full bg-[#071710] border border-emerald-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                تاريخ سريان آخر درجة ({echelon})
              </label>
              <input
                type="date"
                value={lastEchelonDate}
                onChange={(e) => setLastEchelonDate(e.target.value)}
                className="w-full bg-[#071710] border border-emerald-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                وتيرة الترقية في الدرجة القادمة
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'min', label: 'الدنيا (سنتان و6 أشهر)' },
                  { id: 'med', label: 'المتوسطة (3 سنوات)' },
                  { id: 'max', label: 'القصوى (3 سنوات و6 أشهر)' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() =>
                      setPromotionSpeed(s.id as 'min' | 'med' | 'max')
                    }
                    className={`p-2 rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                      promotionSpeed === s.id
                        ? 'bg-[#d4af37] text-[#071710] border-[#d4af37]'
                        : 'bg-[#071710] text-slate-300 border-emerald-800'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#081c13]/90 border border-emerald-800/60 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-black text-white">
              نتائج حساب الأقدمية والترقية الآلية للدرجة الموالية
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#071710] border border-emerald-800/70 rounded-xl p-4">
                <span className="text-xs text-slate-400 block mb-1">
                  الأقدمية العامة في التربية الوطنية
                </span>
                <div className="text-xl font-black text-[#f5d77f] tabular-nums">
                  {seniorityCalc.general.years} سنة و {seniorityCalc.general.months} شهر و {seniorityCalc.general.days} يوم
                </div>
                <span className="text-[11px] text-emerald-300 mt-1 block tabular-nums">
                  المجموع الكلي: {seniorityCalc.general.totalYears} سنة خدمة فعلية
                </span>
              </div>

              <div className="bg-[#071710] border border-emerald-800/70 rounded-xl p-4">
                <span className="text-xs text-slate-400 block mb-1">
                  الأقدمية في الرتبة الحالية ({rankCfg.title})
                </span>
                <div className="text-xl font-black text-emerald-400 tabular-nums">
                  {seniorityCalc.inRank.years} سنة و {seniorityCalc.inRank.months} شهر و {seniorityCalc.inRank.days} يوم
                </div>
                <span className="text-[11px] text-slate-300 mt-1 block tabular-nums">
                  الأقدمية منذ آخر درجة: {seniorityCalc.sinceLastEchelon.years} سنة و {seniorityCalc.sinceLastEchelon.months} شهر
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-l from-[#d4af37]/15 to-[#071710] border border-[#d4af37]/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-[#f5d77f] block">
                  تاريخ استحقاق الدرجة القادمة (الدرجة {Math.min(12, echelon + 1)})
                </span>
                <span className="text-lg font-black text-white tabular-nums">
                  {seniorityCalc.nextEchelonDate}
                </span>
                <p className="text-xs text-slate-300 mt-0.5">
                  زيادة في الرقم الاستدلالي بـ +{seniorityCalc.nextEchelonIndexGain} نقطة
                </p>
              </div>
              <div className="text-right sm:text-left">
                <span className="text-xs text-slate-300 block">
                  الأثر المالي الصافي للدرجة الجديدة
                </span>
                <span className="text-xl font-black text-emerald-400 tabular-nums">
                  +{seniorityCalc.nextEchelonMonthlyGain.toLocaleString('ar-DZ')} دج / شهرياً
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PROMOTION TO HIGHER RANKS */}
      {activeTab === 'promotion' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-5 bg-[#081c13]/90 border border-emerald-800/60 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-black text-[#f5d77f]">
              معايير سلم التنقيط للترقية الاختيارية والامتحان المهني
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  نقطة المدير (الإدارية / 20)
                </label>
                <input
                  type="number"
                  step="0.25"
                  min={10}
                  max={20}
                  value={adminMark}
                  onChange={(e) => setAdminMark(Number(e.target.value))}
                  className="w-full bg-[#071710] border border-emerald-800 rounded-xl px-3 py-2 text-xs text-white tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  نقطة المفتش البيداغوجية (/ 20)
                </label>
                <input
                  type="number"
                  step="0.25"
                  min={10}
                  max={20}
                  value={inspectorMark}
                  onChange={(e) => setInspectorMark(Number(e.target.value))}
                  className="w-full bg-[#071710] border border-emerald-800 rounded-xl px-3 py-2 text-xs text-white tabular-nums"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  نقاط الشهادات الإضافية (ماستر/دكتوراه)
                </label>
                <select
                  value={extraDegreePoints}
                  onChange={(e) =>
                    setExtraDegreePoints(Number(e.target.value))
                  }
                  className="w-full bg-[#071710] border border-emerald-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value={0}>ليسانس فقط (0 نقطة)</option>
                  <option value={2}>شهادة ماستر / ماجستير (+2 نقطتان)</option>
                  <option value={4}>شهادة دكتوراه (+4 نقاط)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  عدد الأيام الدراسية والندوات الموثقة
                </label>
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={studyDaysCount}
                  onChange={(e) => setStudyDaysCount(Number(e.target.value))}
                  className="w-full bg-[#071710] border border-emerald-800 rounded-xl px-3 py-2 text-xs text-white tabular-nums"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#081c13]/90 border border-emerald-800/60 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#071710] p-4 rounded-xl border border-emerald-800/70">
              <div>
                <span className="text-xs text-slate-400 block">
                  الرتبة المستهدفة للترقية (المرسوم 25-54)
                </span>
                <h4 className="text-base font-black text-[#f5d77f]">
                  {rankCfg.nextRankTitle} (الصنف {rankCfg.nextRankCategory})
                </h4>
                <span className="text-xs text-emerald-300 tabular-nums">
                  الرقم الاستدلالي القاعدي الجديد: {rankCfg.nextRankBaseIndex} (+{promotionCalc.nextRankIndexDiff} نقطة)
                </span>
              </div>
              <div className="text-left">
                <span className="text-xs text-slate-400 block">
                  المجموع العام في سلم الترقية
                </span>
                <span className="text-2xl font-black text-[#f5d77f] tabular-nums">
                  {promotionCalc.totalScore} نقطة
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#071710] border border-emerald-900/60">
                <span className="text-slate-400 block">الأهلية للامتحان المهني</span>
                <span className="font-bold text-white flex items-center gap-1 mt-1">
                  <CheckCircle2
                    className={`w-4 h-4 ${promotionCalc.eligibleForExam ? 'text-emerald-400' : 'text-amber-400'}`}
                  />
                  {promotionCalc.eligibleForExam
                    ? 'مستوفٍ لشرط 5 سنوات'
                    : 'أقل من 5 سنوات في الرتبة'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#071710] border border-emerald-900/60">
                <span className="text-slate-400 block">التسجيل على قوائم التأهيل</span>
                <span className="font-bold text-white flex items-center gap-1 mt-1">
                  <CheckCircle2
                    className={`w-4 h-4 ${promotionCalc.eligibleForList ? 'text-emerald-400' : 'text-amber-400'}`}
                  />
                  {promotionCalc.eligibleForList
                    ? 'مستوفٍ لشرط 10 سنوات'
                    : 'أقل من 10 سنوات في الرتبة'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-600/40">
                <span className="text-emerald-300 block">الزيادة الصافية عند الترقية</span>
                <span className="text-base font-black text-white tabular-nums mt-0.5 block">
                  +{promotionCalc.estimatedMonthlyNetGain.toLocaleString('ar-DZ')} دج/شهر
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RETIREMENT PENSION & GRANT */}
      {activeTab === 'retirement' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-5 bg-[#081c13]/90 border border-emerald-800/60 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-black text-[#f5d77f]">
              معطيات حساب معاش ومنحة التقاعد (قانون التقاعد الجديد)
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  تاريخ الميلاد
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full bg-[#071710] border border-emerald-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  سنوات الخدمة الفعلية
                </label>
                <input
                  type="number"
                  min={15}
                  max={40}
                  value={serviceYears}
                  onChange={(e) => setServiceYears(Number(e.target.value))}
                  className="w-full bg-[#071710] border border-emerald-800 rounded-xl px-3 py-2 text-xs text-white tabular-nums"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  اعتماد سنوات الجامعة
                </label>
                <select
                  value={universityYearsBought}
                  onChange={(e) =>
                    setUniversityYearsBought(Number(e.target.value))
                  }
                  className="w-full bg-[#071710] border border-emerald-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value={0}>بدون ضم (0 سنة)</option>
                  <option value={3}>ليسانس (3 سنوات)</option>
                  <option value={4}>ليسانس كلاسيك / ماستر (4 سنوات)</option>
                  <option value={5}>5 سنوات جامعية</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  سنوات الخدمة الوطنية
                </label>
                <select
                  value={nationalServiceYears}
                  onChange={(e) =>
                    setNationalServiceYears(Number(e.target.value))
                  }
                  className="w-full bg-[#071710] border border-emerald-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value={0}>0 سنة</option>
                  <option value={1}>سنة واحدة (12 شهراً)</option>
                  <option value={2}>سنتان (18-24 شهراً)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#081c13]/90 border border-emerald-800/60 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-[#d4af37]" />
              <span>الحصيلة التقاعدية ومنحة نهاية الخدمة المتوقعة</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-gradient-to-br from-[#d4af37]/20 to-[#071710] border border-[#d4af37]/50 rounded-xl p-4">
                <span className="text-xs text-slate-300 block">
                  المعاش الشهري الصافي المتوقع
                </span>
                <span className="text-xl font-black text-[#f5d77f] tabular-nums mt-1 block">
                  {retirementCalc.netMonthlyPension.toLocaleString('ar-DZ')} دج
                </span>
                <span className="text-[11px] text-emerald-300 tabular-nums">
                  نسبة التصفية: {retirementCalc.pensionPercentage}% (حد أقصى 80%)
                </span>
              </div>

              <div className="bg-[#071710] border border-emerald-800/70 rounded-xl p-4">
                <span className="text-xs text-slate-300 block">
                  مجموع السنوات المعتمدة للتقاعد
                </span>
                <span className="text-xl font-black text-white tabular-nums mt-1 block">
                  {retirementCalc.totalAccreditedYears} سنة
                </span>
                <span className="text-[11px] text-slate-400 tabular-nums">
                  السن الحالي: {retirementCalc.currentAge} سنة
                </span>
              </div>

              <div className="bg-[#071710] border border-emerald-800/70 rounded-xl p-4">
                <span className="text-xs text-slate-300 block">
                  منحة الإحالة على التقاعد (نهاية الخدمة)
                </span>
                <span className="text-xl font-black text-emerald-400 tabular-nums mt-1 block">
                  {retirementCalc.endOfCareerGrant.toLocaleString('ar-DZ')} دج
                </span>
                <span className="text-[11px] text-slate-400">
                  الخدمات الاجتماعية + المؤسسة
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
