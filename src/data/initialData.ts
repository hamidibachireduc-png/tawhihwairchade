import {
  CounselorRankKey,
  CounselorRankMeta,
  EducationStage,
  StageMeta,
  InstitutionInfo,
  StudentCounselingRecord,
  ReorientationRequest,
  CounselingInterview,
  PsychoPedagogicalCase,
  InfoSeekerEntry,
  WeeklyActivityEntry,
  AgendaItem,
  UniversityHorizonItem,
  LegislationCircular,
  AssignedClassGroup,
} from '../types';

export const DEFAULT_EMBLEM_URL = '/assets/aistudio/ca96685e-e166-473a-b7d1-cf381c8d132e.jpg';

export const COUNSELOR_RANKS: Record<CounselorRankKey, CounselorRankMeta> = {
  counselor: {
    key: 'counselor',
    title: 'مستشار التوجيه والإرشاد المدرسي والمهني',
    shortTitle: 'مستشار التوجيه',
    category: 'الصنف 13',
    baseIndex: 778,
    decreeRef: 'المرسوم التنفيذي 25-54 (تحيين 2026)',
    badgeText: 'مرافقة التلاميذ · الإعلام المدرسي · المقابلات الإرشادية · محاضر التوجيه',
    description:
      'المكلف بالإعلام المدرسي والمهني، إجراء المقابلات الإرشادية، متابعة الرغبات، والمشاركة في مجالس الأقسام والتوجيه.',
  },
  principal_counselor: {
    key: 'principal_counselor',
    title: 'مستشار رئيسي للتوجيه والإرشاد المدرسي والمهني',
    shortTitle: 'مستشار رئيسي للتوجيه',
    category: 'الصنف 14',
    baseIndex: 821,
    decreeRef: 'المرسوم التنفيذي 25-54 (تحيين 2026)',
    badgeText: 'التحليل الإحصائي المعمق · التكفل النفسي التربوي · تنسيق خلايا الإصغاء',
    description:
      'المكلف بالدراسات الإحصائية المعمقة لنتائج التوجيه، التكفل بالحالات النفسية التربوية الخاصة، وتأطير العمليات التقنية للتوجيه.',
  },
  trainer_counselor: {
    key: 'trainer_counselor',
    title: 'مستشار مكون للتوجيه والإرشاد المدرسي والمهني',
    shortTitle: 'مستشار مكون للتوجيه',
    category: 'الصنف 16',
    baseIndex: 913,
    decreeRef: 'المرسوم التنفيذي 25-54 (تحيين 2026)',
    badgeText: 'التكوين الميداني · هندسة المقاييس النفسية · الإشراف البيداغوجي بالمقاطعة',
    description:
      'المكلف بمرافقة وتكوين المستشارين المتربصين، بناء وتكييف الروائز والمقاييس النفسية، وتنسيق فرق العمل بالمقاطعة.',
  },
  inspector_counselor: {
    key: 'inspector_counselor',
    title: 'مفتش التوجيه والإرشاد المدرسي والمهني',
    shortTitle: 'مفتش التوجيه المدرسي',
    category: 'الصنف 17',
    baseIndex: 962,
    decreeRef: 'المرسوم التنفيذي 25-54 (تحيين 2026)',
    badgeText: 'التفتيش والتقويم · اعتماد الخرائط التربوية · رئاسة لجان الطعن الولائية',
    description:
      'المشرف على مقاطعة التوجيه المدرسي والمهني، مراقبة وتقويم النشاطات الميدانية، واعتماد المحاضر النهائية للتوجيه وإعادة التوجيه.',
  },
};

export const STAGE_METADATA: Record<EducationStage, StageMeta> = {
  middle: {
    key: 'middle',
    name: 'التعليم المتوسط (مقاطعة المتوسطات)',
    shortName: 'المتوسط',
    orientationFocus: 'توجيه السنة الرابعة متوسط (4م) إلى الجذوع المشتركة والمهني',
    badgeText: 'توجيه 4 متوسط · استكشاف الميول · الوقاية من التسرب المدرسي · مرافقة المراهق',
    description:
      'متابعة تلاميذ التعليم المتوسط مع التركيز على توجيه السنة 4 متوسط نحو الجذع المشترك علوم وتكنولوجيا أو الجذع المشترك آداب أو التكوين المهني.',
  },
  secondary: {
    key: 'secondary',
    name: 'التعليم الثانوي (الثانويات والمدارس العليا)',
    shortName: 'الثانوي',
    orientationFocus: 'توجيه 1 ثانوي إلى الشعب + جسور إعادة التوجيه + آفاق البكالوريا',
    badgeText: 'توجيه 1 ثانوي · جسور إعادة التوجيه · مقياس هولاند · آفاق البكالوريا والتخصصات الجامعية',
    description:
      'مرافقة تلاميذ الجذوع المشتركة (1 ثانوي) نحو الشعب الست، معالجة التماسات إعادة التوجيه، وتحضير طلبة البكالوريا لاختيار التخصصات الجامعية.',
  },
};

export const INITIAL_INSTITUTIONS_BY_STAGE: Record<EducationStage, InstitutionInfo> = {
  middle: {
    stage: 'middle',
    rankKey: 'principal_counselor',
    wilaya: 'مديرية التربية لولاية الجزائر وسط',
    schoolName: 'متوسطة الأمير عبد القادر - مقاطعة التوجيه 03',
    districtCenter: 'مركز التوجيه المدرسي والمهني - الجزائر وسط',
    counselorName: 'أ. حميدي بشير (مستشار التوجيه والإرشاد المدرسي والمهني)',
    principalName: 'السيد مدير المؤسسة',
    schoolYear: '2025 / 2026',
    currentTerm: 'الثاني',
    emblemUrl: DEFAULT_EMBLEM_URL,
    isVerifiedCertificate: true,
    certificateRef: 'ش.ع / م.ت / 2026 / 418',
  },
  secondary: {
    stage: 'secondary',
    rankKey: 'trainer_counselor',
    wilaya: 'مديرية التربية لولاية الجزائر وسط',
    schoolName: 'ثانوية العقيد لطفي النموذجية',
    districtCenter: 'مركز التوجيه المدرسي والمهني - الجزائر وسط',
    counselorName: 'أ. حميدي بشير (مستشار مكون للتوجيه والإرشاد)',
    principalName: 'السيد مدير الثانوية',
    schoolYear: '2025 / 2026',
    currentTerm: 'الثاني',
    emblemUrl: DEFAULT_EMBLEM_URL,
    isVerifiedCertificate: true,
    certificateRef: 'ش.ع / م.ت / 2026 / 418',
  },
};

// دالة حساب مؤشر الخطورة المركب من 100 نقطة (غياب 30 + نتائج 40 + سلوك ومؤشرات نفسية 30)
export function calculateCompositeRiskScore(student: StudentCounselingRecord): {
  totalScore: number;
  absenceComponent: number; // /30
  academicComponent: number; // /40
  behaviorPsychComponent: number; // /30
  riskLevel: 'critical' | 'high' | 'moderate' | 'low';
  riskLabelAr: string;
  primaryReasonAr: string;
} {
  // 1. مكون الغياب (من 30 نقطة): كل غياب غير مبرر = 3.5 نقطة، والمبرر المتكرر = 0.8 نقطة
  const rawAbsence = student.unjustifiedAbsences * 3.5 + student.justifiedAbsences * 0.8;
  const absenceComponent = Math.min(30, Math.round(rawAbsence));

  // 2. مكون النتائج الدراسية وتراجع المعدل (من 40 نقطة)
  const latestAvg = student.term2Avg || student.term1Avg;
  const dropDelta = Math.max(0, student.term1Avg - student.term2Avg);
  let academicRaw = 0;
  if (latestAvg < 8) {
    academicRaw += 28;
  } else if (latestAvg < 10) {
    academicRaw += 18;
  } else if (latestAvg < 11.5) {
    academicRaw += 8;
  }
  academicRaw += dropDelta * 5; // تراجع الفصول
  const academicComponent = Math.min(40, Math.round(academicRaw));

  // 3. مكون السلوك والمؤشرات النفسية (من 30 نقطة)
  const psychPoints =
    student.psychologicalAlertLevel === 'critical'
      ? 22
      : student.psychologicalAlertLevel === 'high'
      ? 15
      : student.psychologicalAlertLevel === 'moderate'
      ? 8
      : 0;
  const behaviorPoints = student.behaviorNotesCount * 3;
  const behaviorPsychComponent = Math.min(30, Math.round(psychPoints + behaviorPoints));

  const totalScore = Math.min(100, absenceComponent + academicComponent + behaviorPsychComponent);

  let riskLevel: 'critical' | 'high' | 'moderate' | 'low' = 'low';
  let riskLabelAr = 'وضع مستقر (متابعة عادية)';
  if (totalScore >= 70) {
    riskLevel = 'critical';
    riskLabelAr = 'خطر حرج (تدخل فوري واستدعاء ولي)';
  } else if (totalScore >= 50) {
    riskLevel = 'high';
    riskLabelAr = 'خطر مرتفع (مهدد بالتسرب / التعثر)';
  } else if (totalScore >= 32) {
    riskLevel = 'moderate';
    riskLabelAr = 'يقظة وقائية (مرافقة بيداغوجية)';
  }

  const reasons: string[] = [];
  if (absenceComponent >= 14) reasons.push(`انقطاع وغيابات متكررة (${student.unjustifiedAbsences} غياب غير مبرر)`);
  if (latestAvg < 10) reasons.push(`تعثر دراسي حاد (معدل ${latestAvg.toFixed(2)}/20)`);
  if (dropDelta >= 1.5) reasons.push(`تراجع فصلي ملحوظ (-${dropDelta.toFixed(2)} ن)`);
  if (behaviorPsychComponent >= 15) reasons.push('مؤشرات قلق أو صعوبات توافق نفسي-سلوكي');
  if (reasons.length === 0) reasons.push('استقرار في المواظبة والتحصيل');

  return {
    totalScore,
    absenceComponent,
    academicComponent,
    behaviorPsychComponent,
    riskLevel,
    riskLabelAr,
    primaryReasonAr: reasons.join(' · '),
  };
}

// دالة حساب مجموع ومعدل مجموعات التوجيه الرسمية (4 متوسط و 1 ثانوي)
export function calculateOrientationMetrics(student: StudentCounselingRecord): {
  scienceGroupScore: number; // معدل مجموعة العلوم والتكنولوجيا /20
  artsGroupScore: number; // معدل مجموعة الآداب /20
  annualAvg: number;
  recommendedStream: string;
  wishCompatibility: 'متوافق كلياً' | 'متوافق جزئياً' | 'غير متوافق (تباين رغبة/ملمح)';
} {
  const annualAvg = Number(((student.term1Avg + student.term2Avg + student.term3Avg) / 3).toFixed(2));

  // معادلة مجموعة العلوم والتكنولوجيا: (رياضيات*4 + فيزياء*3 + علوم*3 + عربية*2) / 12
  const scienceGroupScore = Number(
    (
      (student.mathGrade * 4 +
        student.physicsGrade * 3 +
        student.scienceGrade * 3 +
        student.arabicGrade * 2) /
      12
    ).toFixed(2)
  );

  // معادلة مجموعة الآداب واللغات: (عربية*4 + فرنسية*3 + إنجليزية*2 + تاريخ وجغرافيا*3) / 12
  const artsGroupScore = Number(
    (
      (student.arabicGrade * 4 +
        student.frenchGrade * 3 +
        student.englishGrade * 2 +
        student.historyGeoGrade * 3) /
      12
    ).toFixed(2)
  );

  let recommendedStream = '';
  if (student.stage === 'middle') {
    if (scienceGroupScore >= 11 && scienceGroupScore >= artsGroupScore - 0.5) {
      recommendedStream = 'جذع مشترك علوم وتكنولوجيا';
    } else if (annualAvg >= 10) {
      recommendedStream = 'جذع مشترك آداب';
    } else {
      recommendedStream = 'تكوين مهني / إعادة السنة حسب السن';
    }
  } else {
    // 1 ثانوي
    if (student.level === '1 ثانوي ج.م.آ') {
      recommendedStream =
        student.frenchGrade >= 12 && student.englishGrade >= 12 ? 'لغات أجنبية' : 'آداب وفلسفة';
    } else {
      if (student.mathGrade >= 14.5 && student.physicsGrade >= 14) {
        recommendedStream = 'رياضيات';
      } else if (student.mathGrade >= 12.5 && student.physicsGrade >= 13) {
        recommendedStream = 'تقني رياضي';
      } else if (scienceGroupScore >= 11.5) {
        recommendedStream = 'علوم تجريبية';
      } else {
        recommendedStream = 'تسيير واقتصاد';
      }
    }
  }

  const isScienceWish =
    student.wish1.includes('علوم') ||
    student.wish1.includes('رياضيات') ||
    student.wish1.includes('تقني');
  const isScienceProfile = scienceGroupScore >= 10.5;

  let wishCompatibility: 'متوافق كلياً' | 'متوافق جزئياً' | 'غير متوافق (تباين رغبة/ملمح)' =
    'متوافق كلياً';
  if (student.wish1 === recommendedStream) {
    wishCompatibility = 'متوافق كلياً';
  } else if (isScienceWish && !isScienceProfile) {
    wishCompatibility = 'غير متوافق (تباين رغبة/ملمح)';
  } else {
    wishCompatibility = 'متوافق جزئياً';
  }

  return {
    scienceGroupScore,
    artsGroupScore,
    annualAvg,
    recommendedStream,
    wishCompatibility,
  };
}

export const INITIAL_STUDENTS: StudentCounselingRecord[] = [
  // --- تلاميذ التعليم الثانوي (1 ثانوي، 2 ثانوي، 3 ثانوي) ---
  {
    id: 'st-sec-01',
    matricule: '2026160101',
    fullName: 'بن عيسى عبد الرحمن',
    gender: 'ذكر',
    birthDate: '2010-03-14',
    stage: 'secondary',
    level: '1 ثانوي ج.م.ع.ت',
    group: '1 ج.م.ع.ت 1',
    term1Avg: 15.8,
    term2Avg: 16.2,
    term3Avg: 16.4,
    mathGrade: 17.5,
    physicsGrade: 16.5,
    scienceGrade: 15.0,
    arabicGrade: 14.5,
    frenchGrade: 14.0,
    englishGrade: 16.0,
    historyGeoGrade: 15.0,
    unjustifiedAbsences: 0,
    justifiedAbsences: 1,
    behaviorNotesCount: 0,
    psychologicalAlertLevel: 'normal',
    wishCardCompleted: true,
    wish1: 'رياضيات',
    wish2: 'علوم تجريبية',
    wish3: 'تقني رياضي (هندسة كهربائية)',
    councilProposal: 'رياضيات',
    finalOrientationDecision: 'رياضيات',
    orientationStatus: 'satisfied_1',
    hollandCode: 'IRC',
    hollandScores: { R: 22, I: 28, A: 11, S: 14, E: 16, C: 24 },
    parentName: 'بن عيسى كمال',
    parentPhone: '0550123456',
  },
  {
    id: 'st-sec-02',
    matricule: '2026160102',
    fullName: 'مرادية آية سلسبيل',
    gender: 'أنثى',
    birthDate: '2010-07-22',
    stage: 'secondary',
    level: '1 ثانوي ج.م.ع.ت',
    group: '1 ج.م.ع.ت 1',
    term1Avg: 13.9,
    term2Avg: 14.1,
    term3Avg: 14.3,
    mathGrade: 13.0,
    physicsGrade: 14.0,
    scienceGrade: 16.5,
    arabicGrade: 15.0,
    frenchGrade: 15.5,
    englishGrade: 16.0,
    historyGeoGrade: 14.0,
    unjustifiedAbsences: 0,
    justifiedAbsences: 2,
    behaviorNotesCount: 0,
    psychologicalAlertLevel: 'moderate',
    wishCardCompleted: true,
    wish1: 'علوم تجريبية',
    wish2: 'رياضيات',
    wish3: 'تسيير واقتصاد',
    councilProposal: 'علوم تجريبية',
    finalOrientationDecision: 'علوم تجريبية',
    orientationStatus: 'satisfied_1',
    hollandCode: 'ISA',
    hollandScores: { R: 12, I: 27, A: 19, S: 25, E: 13, C: 16 },
    parentName: 'مرادية فريد',
    parentPhone: '0661234567',
  },
  {
    id: 'st-sec-03',
    matricule: '2026160103',
    fullName: 'قاسمي ياسين أيوب',
    gender: 'ذكر',
    birthDate: '2009-11-05',
    stage: 'secondary',
    level: '1 ثانوي ج.م.ع.ت',
    group: '1 ج.م.ع.ت 2',
    term1Avg: 11.4,
    term2Avg: 8.6,
    term3Avg: 8.9,
    mathGrade: 7.5,
    physicsGrade: 8.0,
    scienceGrade: 8.5,
    arabicGrade: 11.0,
    frenchGrade: 9.0,
    englishGrade: 10.0,
    historyGeoGrade: 12.5,
    unjustifiedAbsences: 7,
    justifiedAbsences: 3,
    behaviorNotesCount: 4,
    psychologicalAlertLevel: 'critical',
    wishCardCompleted: true,
    wish1: 'علوم تجريبية',
    wish2: 'تقني رياضي (هندسة مدنية)',
    wish3: 'تسيير واقتصاد',
    councilProposal: 'تسيير واقتصاد',
    finalOrientationDecision: 'تسيير واقتصاد',
    orientationStatus: 'appeal_pending',
    hollandCode: 'ESC',
    hollandScores: { R: 15, I: 10, A: 12, S: 22, E: 26, C: 21 },
    parentName: 'قاسمي عبد القادر',
    parentPhone: '0770987654',
  },
  {
    id: 'st-sec-04',
    matricule: '2026160104',
    fullName: 'بوزيدي مريم نور الهدى',
    gender: 'أنثى',
    birthDate: '2010-01-19',
    stage: 'secondary',
    level: '1 ثانوي ج.م.آ',
    group: '1 ج.م.آ 1',
    term1Avg: 14.2,
    term2Avg: 14.8,
    term3Avg: 15.1,
    mathGrade: 11.5,
    physicsGrade: 12.0,
    scienceGrade: 13.0,
    arabicGrade: 16.0,
    frenchGrade: 16.5,
    englishGrade: 17.0,
    historyGeoGrade: 14.5,
    unjustifiedAbsences: 1,
    justifiedAbsences: 1,
    behaviorNotesCount: 0,
    psychologicalAlertLevel: 'normal',
    wishCardCompleted: true,
    wish1: 'لغات أجنبية',
    wish2: 'آداب وفلسفة',
    wish3: 'آداب وفلسفة',
    councilProposal: 'لغات أجنبية',
    finalOrientationDecision: 'لغات أجنبية',
    orientationStatus: 'satisfied_1',
    hollandCode: 'ASE',
    hollandScores: { R: 9, I: 15, A: 28, S: 26, E: 21, C: 14 },
    parentName: 'بوزيدي محمد',
    parentPhone: '0554321876',
  },
  {
    id: 'st-sec-05',
    matricule: '2026160105',
    fullName: 'شريفي وليد إسلام',
    gender: 'ذكر',
    birthDate: '2009-06-30',
    stage: 'secondary',
    level: '1 ثانوي ج.م.ع.ت',
    group: '1 ج.م.ع.ت 2',
    term1Avg: 12.6,
    term2Avg: 12.9,
    term3Avg: 13.2,
    mathGrade: 14.0,
    physicsGrade: 14.5,
    scienceGrade: 11.0,
    arabicGrade: 12.0,
    frenchGrade: 11.5,
    englishGrade: 13.0,
    historyGeoGrade: 12.5,
    unjustifiedAbsences: 2,
    justifiedAbsences: 1,
    behaviorNotesCount: 1,
    psychologicalAlertLevel: 'normal',
    wishCardCompleted: true,
    wish1: 'تقني رياضي (هندسة ميكانيكية)',
    wish2: 'علوم تجريبية',
    wish3: 'تسيير واقتصاد',
    councilProposal: 'تقني رياضي (هندسة ميكانيكية)',
    finalOrientationDecision: 'تقني رياضي (هندسة ميكانيكية)',
    orientationStatus: 'satisfied_1',
    hollandCode: 'RIC',
    hollandScores: { R: 29, I: 24, A: 10, S: 12, E: 15, C: 22 },
    parentName: 'شريفي مصطفى',
    parentPhone: '0662112233',
  },
  {
    id: 'st-sec-06',
    matricule: '2026160106',
    fullName: 'حماني سارة إيناس',
    gender: 'أنثى',
    birthDate: '2008-09-12',
    stage: 'secondary',
    level: '3 ثانوي',
    group: '3 ع.ت 1',
    term1Avg: 13.5,
    term2Avg: 10.8,
    term3Avg: 11.2,
    mathGrade: 10.5,
    physicsGrade: 10.0,
    scienceGrade: 12.0,
    arabicGrade: 13.0,
    frenchGrade: 12.5,
    englishGrade: 13.0,
    historyGeoGrade: 11.5,
    unjustifiedAbsences: 4,
    justifiedAbsences: 5,
    behaviorNotesCount: 2,
    psychologicalAlertLevel: 'high',
    wishCardCompleted: false,
    wish1: 'العلوم الطبية / الصيدلة',
    wish2: 'المدرسة العليا للأساتذة',
    wish3: 'علوم الطبيعة والحياة',
    councilProposal: 'مرافقة نفسية لتحضير البكالوريا',
    finalOrientationDecision: 'علوم تجريبية (بكالوريا)',
    orientationStatus: 'satisfied_1',
    hollandCode: 'SIA',
    hollandScores: { R: 11, I: 23, A: 19, S: 27, E: 14, C: 15 },
    parentName: 'حماني نور الدين',
    parentPhone: '0558998877',
  },

  // --- تلاميذ التعليم المتوسط (4 متوسط) ---
  {
    id: 'st-mid-01',
    matricule: '2026040201',
    fullName: 'علاوي ريان عبد الإله',
    gender: 'ذكر',
    birthDate: '2011-04-18',
    stage: 'middle',
    level: '4 متوسط',
    group: '4 م 1',
    term1Avg: 14.9,
    term2Avg: 15.3,
    term3Avg: 15.6,
    mathGrade: 16.5,
    physicsGrade: 15.5,
    scienceGrade: 15.0,
    arabicGrade: 14.5,
    frenchGrade: 14.0,
    englishGrade: 15.5,
    historyGeoGrade: 15.0,
    unjustifiedAbsences: 0,
    justifiedAbsences: 0,
    behaviorNotesCount: 0,
    psychologicalAlertLevel: 'normal',
    wishCardCompleted: true,
    wish1: 'جذع مشترك علوم وتكنولوجيا',
    wish2: 'جذع مشترك آداب',
    wish3: 'تكوين مهني',
    councilProposal: 'جذع مشترك علوم وتكنولوجيا',
    finalOrientationDecision: 'جذع مشترك علوم وتكنولوجيا',
    orientationStatus: 'satisfied_1',
    hollandCode: 'IRC',
    hollandScores: { R: 24, I: 28, A: 12, S: 15, E: 14, C: 21 },
    parentName: 'علاوي سليم',
    parentPhone: '0551445566',
  },
  {
    id: 'st-mid-02',
    matricule: '2026040202',
    fullName: 'بلقاسمي لينة يسرى',
    gender: 'أنثى',
    birthDate: '2011-08-09',
    stage: 'middle',
    level: '4 متوسط',
    group: '4 م 1',
    term1Avg: 12.8,
    term2Avg: 13.1,
    term3Avg: 13.4,
    mathGrade: 9.5,
    physicsGrade: 10.0,
    scienceGrade: 11.5,
    arabicGrade: 16.0,
    frenchGrade: 15.0,
    englishGrade: 15.5,
    historyGeoGrade: 15.0,
    unjustifiedAbsences: 1,
    justifiedAbsences: 1,
    behaviorNotesCount: 0,
    psychologicalAlertLevel: 'normal',
    wishCardCompleted: true,
    wish1: 'جذع مشترك آداب',
    wish2: 'جذع مشترك علوم وتكنولوجيا',
    wish3: 'تكوين مهني',
    councilProposal: 'جذع مشترك آداب',
    finalOrientationDecision: 'جذع مشترك آداب',
    orientationStatus: 'satisfied_1',
    hollandCode: 'ASE',
    hollandScores: { R: 10, I: 14, A: 27, S: 25, E: 20, C: 15 },
    parentName: 'بلقاسمي حسان',
    parentPhone: '0663778899',
  },
  {
    id: 'st-mid-03',
    matricule: '2026040203',
    fullName: 'زروقي آدم سيف الدين',
    gender: 'ذكر',
    birthDate: '2010-02-11',
    stage: 'middle',
    level: '4 متوسط',
    group: '4 م 2',
    term1Avg: 10.2,
    term2Avg: 7.4,
    term3Avg: 7.8,
    mathGrade: 6.5,
    physicsGrade: 7.0,
    scienceGrade: 8.0,
    arabicGrade: 9.0,
    frenchGrade: 6.5,
    englishGrade: 7.5,
    historyGeoGrade: 8.5,
    unjustifiedAbsences: 8,
    justifiedAbsences: 2,
    behaviorNotesCount: 5,
    psychologicalAlertLevel: 'critical',
    wishCardCompleted: false,
    wish1: 'جذع مشترك علوم وتكنولوجيا',
    wish2: 'جذع مشترك آداب',
    wish3: 'تكوين مهني (ميكانيك السيارات)',
    councilProposal: 'جذع مشترك آداب / تكوين مهني',
    finalOrientationDecision: 'جذع مشترك آداب',
    orientationStatus: 'council_assigned',
    hollandCode: 'REA',
    hollandScores: { R: 27, I: 11, A: 18, S: 13, E: 21, C: 12 },
    parentName: 'زروقي رابح',
    parentPhone: '0771223344',
  },
  {
    id: 'st-mid-04',
    matricule: '2026040204',
    fullName: 'بوجمعة خديجة مروة',
    gender: 'أنثى',
    birthDate: '2011-12-03',
    stage: 'middle',
    level: '4 متوسط',
    group: '4 م 2',
    term1Avg: 11.8,
    term2Avg: 11.4,
    term3Avg: 11.9,
    mathGrade: 10.0,
    physicsGrade: 10.5,
    scienceGrade: 12.0,
    arabicGrade: 13.5,
    frenchGrade: 12.0,
    englishGrade: 12.5,
    historyGeoGrade: 13.0,
    unjustifiedAbsences: 3,
    justifiedAbsences: 4,
    behaviorNotesCount: 1,
    psychologicalAlertLevel: 'high',
    wishCardCompleted: true,
    wish1: 'جذع مشترك علوم وتكنولوجيا',
    wish2: 'جذع مشترك آداب',
    wish3: 'تكوين مهني',
    councilProposal: 'جذع مشترك آداب',
    finalOrientationDecision: 'جذع مشترك آداب',
    orientationStatus: 'satisfied_2',
    hollandCode: 'SAC',
    hollandScores: { R: 11, I: 15, A: 22, S: 26, E: 14, C: 20 },
    parentName: 'بوجمعة عمر',
    parentPhone: '0552667788',
  },
];

export const INITIAL_REORIENTATION_REQUESTS: ReorientationRequest[] = [
  {
    id: 'reor-01',
    orderNumber: 'ط.ت/2026/01',
    studentId: 'st-sec-03',
    studentName: 'قاسمي ياسين أيوب',
    stage: 'secondary',
    group: '1 ج.م.ع.ت 2',
    currentStream: 'تسيير واقتصاد',
    requestedStream: 'تقني رياضي (هندسة مدنية)',
    annualAverage: 9.63,
    keySubjectsAverage: 10.25,
    justification: 'رغبة التلميذ في المسار التقني التطبيقي وتحسن نقاط الهندسة في الفصل الثالث.',
    counselorOpinion:
      'ملمح التلميذ في مقياس هولاند يظهر ميلاً تطبيقياً، نقترح قبول الالتماس نحو تقني رياضي بشرط التزام الولي بمتابعة المواظبة.',
    committeeDecision: 'قيد الدراسة',
    requestDate: '2026-06-18',
  },
  {
    id: 'reor-02',
    orderNumber: 'ط.ت/2026/02',
    studentId: 'st-sec-02',
    studentName: 'مرادية آية سلسبيل',
    stage: 'secondary',
    group: '1 ج.م.ع.ت 1',
    currentStream: 'رياضيات',
    requestedStream: 'علوم تجريبية',
    annualAverage: 14.1,
    keySubjectsAverage: 14.5,
    justification: 'رغبة التلميذة في الترشح مستقبلاً للعلوم الطبية وتفوقها في علوم الطبيعة والحياة (16.5/20).',
    counselorOpinion: 'مؤهلات علمية ممتازة وميول متطابقة (ISA)، رأي المستشار موافق تماماً.',
    committeeDecision: 'مقبول',
    requestDate: '2026-06-15',
  },
  {
    id: 'reor-03',
    orderNumber: 'ط.ت/2026/03',
    studentId: 'st-mid-04',
    studentName: 'بوجمعة خديجة مروة',
    stage: 'middle',
    group: '4 م 2',
    currentStream: 'جذع مشترك آداب',
    requestedStream: 'جذع مشترك علوم وتكنولوجيا',
    annualAverage: 11.7,
    keySubjectsAverage: 10.83,
    justification: 'إلحاح الولي على توجيه التلميذة إلى الجذع المشترك علوم وتكنولوجيا.',
    counselorOpinion:
      'معدل مجموعة العلوم (10.83) أقل من عتبة الاستقرار مقارنة بمجموعة الآداب (13.00)، تحتاج جلسة إقناع مع الولي.',
    committeeDecision: 'مرفوض',
    requestDate: '2026-06-20',
  },
];

export const INITIAL_INTERVIEWS: CounselingInterview[] = [
  {
    id: 'int-01',
    serialNumber: '2026/001',
    date: '2026-10-12',
    time: '09:30',
    term: 'الأول',
    stage: 'secondary',
    studentId: 'st-sec-03',
    studentName: 'قاسمي ياسين أيوب',
    studentGroup: '1 ج.م.ع.ت 2',
    gender: 'ذكر',
    interviewType: 'فردية',
    source: 'رادار الإنذار المبكر',
    domain: 'تحصيل ومنهجية استذكار',
    summary:
      'تم رصد تراجع حاد في نتائج الفصل الثاني (من 11.40 إلى 8.60) مع تسجيل 7 غيابات غير مبررة. أظهر التلميذ شعوراً بالإحباط من صعوبة مادتي الرياضيات والفيزياء.',
    followUpPlan:
      'برمجة حصة لتعديل منهجية المراجعة، استدعاء الولي للمرافقة الأسرية، والتنسيق مع أستاذ الرياضيات.',
    counselorVisa: true,
    requiresParentSummon: true,
  },
  {
    id: 'int-02',
    serialNumber: '2026/002',
    date: '2026-10-19',
    time: '10:45',
    term: 'الأول',
    stage: 'secondary',
    studentId: 'st-sec-06',
    studentName: 'حماني سارة إيناس',
    studentGroup: '3 ع.ت 1',
    gender: 'أنثى',
    interviewType: 'فردية',
    source: 'بطلب التلميذ',
    domain: 'توافق نفسي وتربوي',
    summary:
      'تعاني التلميذة من قلق حاد مرتبط بامتحان شهادة البكالوريا واضطراب في النوم أدى إلى تغيبها وتراجع معدلها رغم قدراتها العلمية الجيدة.',
    followUpPlan:
      'تطبيق تقنيات الاسترخاء وتنظيم جدول المراجعة الذكي، مع فتح بطاقة متابعة في سجل القلق الدراسي.',
    counselorVisa: true,
    requiresParentSummon: false,
  },
  {
    id: 'int-03',
    serialNumber: '2026/003',
    date: '2026-10-25',
    time: '14:00',
    term: 'الأول',
    stage: 'middle',
    studentId: 'st-mid-03',
    studentName: 'زروقي آدم سيف الدين',
    studentGroup: '4 م 2',
    gender: 'ذكر',
    interviewType: 'مع الولي',
    source: 'إحالة الناظر / مستشار التربية',
    domain: 'سلوكي وانضباطي',
    summary:
      'حضور الولي إثر تكرار الغيابات غير المبررة وملاحظات التدخين خارج محيط المتوسطة. تم توضيح مخاطر التسرب المدرسي وآليات التكفل المشترك مع وحدة الكشف والمتابعة (UDS).',
    followUpPlan:
      'إحالة سرية لوحدة الكشف والمتابعة UDS، ومرافقة التلميذ في بناء مشروع مهني يتوافق مع ميوله العملية (REA).',
    counselorVisa: true,
    requiresParentSummon: true,
  },
  {
    id: 'int-04',
    serialNumber: '2026/004',
    date: '2026-11-02',
    time: '11:00',
    term: 'الأول',
    stage: 'middle',
    studentId: 'st-mid-04',
    studentName: 'بوجمعة خديجة مروة',
    studentGroup: '4 م 2',
    gender: 'أنثى',
    interviewType: 'فردية',
    source: 'إحالة أستاذ',
    domain: 'توجيه مدرسي ومهني',
    summary:
      'مناقشة التباين بين رغبة الأسرة (جذع مشترك علوم) ومؤهلات التلميذة الفعلية وميولها الأدبية-الاجتماعية (SAC).',
    followUpPlan: 'تزويد التلميذة والولي بمطوية آفاق شعبة الآداب واللغات الأجنبية في البكالوريا والجامعة.',
    counselorVisa: true,
    requiresParentSummon: false,
  },
];

export const INITIAL_PSYCHO_CASES: PsychoPedagogicalCase[] = [
  {
    id: 'case-01',
    caseCode: 'ملف-سري/2026/01',
    studentId: 'st-sec-06',
    studentName: 'حماني سارة إيناس',
    stage: 'secondary',
    group: '3 ع.ت 1',
    category: 'القلق الدراسي وقلق الامتحانات',
    openedDate: '2026-10-19',
    confidentialityLevel: 'سري',
    symptomsAndIndicators: [
      'توتر شديد وخفقان قبل الفروض المحروسة',
      'أرق ليلي وإرهاق ذهني أثناء الحصص الصباحية',
      'خوف مفرط من عدم بلوغ معدل الطب في البكالوريا',
    ],
    udsCoordination: {
      isReferredToUds: false,
      udsFollowUpStatus: 'لم يحل',
    },
    sessionsCount: 3,
    diagnosisSummary:
      'قلق الامتحانات المرتبط بالكمالية المفرطة والضغط الأسري غير المباشر у طالبة مقبلة على شهادة البكالوريا.',
    interventionPlan:
      'برنامج مرافقة من 4 جلسات: إعادة البناء المعرفي للأفكار السلبية، التدريب على التنفس البطني، وتفكيك أهداف المراجعة الأسبوعية.',
    status: 'تحسن ملحوظ',
  },
  {
    id: 'case-02',
    caseCode: 'ملف-سري/2026/02',
    studentId: 'st-mid-03',
    studentName: 'زروقي آدم سيف الدين',
    stage: 'middle',
    group: '4 م 2',
    category: 'الوقاية من المخدرات والتدخين (UDS)',
    openedDate: '2026-10-25',
    confidentialityLevel: 'سري للغاية (ملف خاص)',
    symptomsAndIndicators: [
      'غيابات متكررة في الفترات المسائية (8 غيابات)',
      'شرود ذهني وتراجع حاد في التحصيل (-2.80 نقطة)',
      'رصد تدخين سجائر إلكترونية وتأثر برفقاء السوء خارج المؤسسة',
    ],
    udsCoordination: {
      isReferredToUds: true,
      udsDoctorName: 'د. بن تومي سهام (طبيبة ومنسقة UDS)',
      referralDate: '2026-10-26',
      udsProtocolCode: 'UDS-PREV-2026-14',
      udsFollowUpStatus: 'تحت المتابعة الطبية النفسية',
      smokingOrSubstanceType: 'تدخين مبكر + قابلية للانجراف نحو المؤثرات العقلية',
    },
    sessionsCount: 4,
    diagnosisSummary:
      'حالة تعثر دراسي مصحوبة بسلوكيات خطر (التدخين المبكر والانقطاع الجزئي) تتطلب تكفلاً مشتركاً بين مكتب التوجيه ووحدة الكشف والمتابعة UDS.',
    interventionPlan:
      '1. جلسة تحسيسية فردية بسرية تامة. 2. فحص ومتابعة مع الأخصائي النفساني لوحدة UDS. 3. إشراك الولي في عقد مرافقة تربوية دون عقاب منفر.',
    status: 'نشطة (قيد التكفل)',
  },
  {
    id: 'case-03',
    caseCode: 'ملف-سري/2026/03',
    studentId: 'st-mid-04',
    studentName: 'بوجمعة خديجة مروة',
    stage: 'middle',
    group: '4 م 2',
    category: 'التنمر المدرسي',
    openedDate: '2026-10-28',
    confidentialityLevel: 'سري',
    symptomsAndIndicators: [
      'انعزال أثناء فترات الاستراحة وتجنب المشاركة الصفية',
      'شكوى من سخرية لفظية متكررة من بعض زميلات الفوج',
      'رغبة في الغياب المتكرر لتفادي الاحتكاك',
    ],
    udsCoordination: {
      isReferredToUds: false,
      udsFollowUpStatus: 'لم يحل',
    },
    sessionsCount: 2,
    diagnosisSummary:
      'تعرض لتنمر لفظي وعزلة اجتماعية داخل القسم أثر على تقدير الذات والدافعية للتعلم.',
    interventionPlan:
      'جلسة تعزيز الثقة بالنفس للتلميذة، مقابلة توجيهية حازمة مع الأطراف المعنية بالتنسيق مع مستشار التربية، وتنشيط حصة توعوية حول التعايش المدرسي بالقسم.',
    status: 'نشطة (قيد التكفل)',
  },
  {
    id: 'case-04',
    caseCode: 'ملف-سري/2026/04',
    studentId: 'st-sec-03',
    studentName: 'قاسمي ياسين أيوب',
    stage: 'secondary',
    group: '1 ج.م.ع.ت 2',
    category: 'التأخر الدراسي والتسرب',
    openedDate: '2026-10-14',
    confidentialityLevel: 'سري',
    symptomsAndIndicators: [
      'معدل فصلي دون 09/20 في الجذع المشترك علوم',
      'فقدان الدافعية والتفكير في مغادرة الدراسة',
      'عدم تطابق بين الملمح التطبيقي-التسييري ومتطلبات الشعبة العلمية',
    ],
    udsCoordination: {
      isReferredToUds: false,
      udsFollowUpStatus: 'لم يحل',
    },
    sessionsCount: 3,
    diagnosisSummary: 'تأخر دراسي ناتج عن سوء توافق مع المسار الدراسي وضغط الأقران.',
    interventionPlan:
      'إعادة بناء المشروع الدراسي عبر التوجيه نحو شعبة تقني رياضي أو تسيير واقتصاد، ومتابعة أسبوعية لدفتر المراجعة.',
    status: 'نشطة (قيد التكفل)',
  },
];

export const INITIAL_INFO_SEEKERS: InfoSeekerEntry[] = [
  {
    id: 'info-01',
    serialNumber: 'إع/2026/01',
    date: '2026-11-01',
    time: '09:15',
    stage: 'secondary',
    visitorType: 'تلميذ(ة)',
    visitorName: 'بن عيسى عبد الرحمن',
    groupOrRelation: '1 ج.م.ع.ت 1',
    topicCategory: 'التخصصات والآفاق الجامعية',
    questionBrief: 'استفسار حول الفرق بين شعبة الرياضيات والعلوم التجريبية في أولوية الالتحاق بالمدرسة العليا للذكاء الاصطناعي.',
    answerProvided: 'توضيح أن شعبة الرياضيات تحظى بالأولوية الأولى ومعامل الترجيح الأعلى في مدارس الإعلام الآلي والذكاء الاصطناعي.',
    documentsHanded: 'مطوية آفاق البكالوريا 2026',
  },
  {
    id: 'info-02',
    serialNumber: 'إع/2026/02',
    date: '2026-11-02',
    time: '10:30',
    stage: 'secondary',
    visitorType: 'ولي أمر',
    visitorName: 'السيد شريفي مصطفى',
    groupOrRelation: 'ولي التلميذ شريفي وليد (1 ج.م.ع.ت 2)',
    topicCategory: 'الشعب والمسارات الدراسية',
    questionBrief: 'طلب معلومات حول فروع شعبة تقني رياضي (الهندسة الميكانيكية والكهربائية) وآفاقها الجامعية.',
    answerProvided: 'شرح المعاملات (معامل 6 و7 في التخصص) وأن الشعبة تفتح كافة آفاق الهندسة والمدارس العليا للتكنولوجيا.',
    documentsHanded: 'بطاقة الإعلام حول شعبة تقني رياضي',
  },
  {
    id: 'info-03',
    serialNumber: 'إع/2026/03',
    date: '2026-11-03',
    time: '11:20',
    stage: 'middle',
    visitorType: 'تلميذ(ة)',
    visitorName: 'علاوي ريان عبد الإله',
    groupOrRelation: '4 م 1',
    topicCategory: 'نظام الامتحانات الرسمية',
    questionBrief: 'كيفية حساب معدل القبول في السنة الأولى ثانوي وعلاقته بمعدل شهادة التعليم المتوسط.',
    answerProvided: 'شرح معادلة الانتقال وحساب مجموعتي التوجيه (علوم وتكنولوجيا / آداب) بناءً على الفصول الثلاثة.',
    documentsHanded: 'دليل تلميذ الرابعة متوسط',
  },
  {
    id: 'info-04',
    serialNumber: 'إع/2026/04',
    date: '2026-11-04',
    time: '14:15',
    stage: 'middle',
    visitorType: 'ولي أمر',
    visitorName: 'السيد زروقي رابح',
    groupOrRelation: 'ولي التلميذ زروقي آدم (4 م 2)',
    topicCategory: 'التكوين والتعليم المهنيين',
    questionBrief: 'استعلام حول التخصصات المتاحة في التكوين المهني المتوج بشهادة تقني سامي والمسار المهني.',
    answerProvided: 'تقديم قائمة معاهد ومراكز التكوين المهني بالمقاطعة وشروط التوجيه نحو التعليم المهني.',
    documentsHanded: 'دليل عروض التكوين المهني بالولاية',
  },
];

export const INITIAL_WEEKLY_ACTIVITIES: WeeklyActivityEntry[] = [
  {
    id: 'act-01',
    weekLabel: 'الأسبوع الأول من نوفمبر 2026',
    dayName: 'الأحد',
    date: '2026-11-01',
    timeSlot: 'الفترة الصباحية (08:00 - 12:00)',
    stage: 'secondary',
    axis: 'الإعلام المدرسي والمهني في الأقسام',
    targetAudience: 'أقسام 1 ج.م.ع.ت 1 + 1 ج.م.ع.ت 2',
    activityDescription: 'تنشيط حصة إعلامية حول هيكلة التعليم الثانوي، الشعب المتاحة، ومعاملات المواد في السنة الثانية ثانوي.',
    observations: 'تفاعل ممتاز من التلاميذ وتوزيع استبيان الرغبات الأولية.',
    completed: true,
  },
  {
    id: 'act-02',
    weekLabel: 'الأسبوع الأول من نوفمبر 2026',
    dayName: 'الاثنين',
    date: '2026-11-02',
    timeSlot: 'الفترة الصباحية (08:00 - 12:00)',
    stage: 'secondary',
    axis: 'المقابلات الإرشادية والمتابعة النفسية',
    targetAudience: 'التلاميذ المرصودون في رادار الإنذار المبكر (4 حالات)',
    activityDescription: 'إجراء مقابلات فردية معمقة مع التلاميذ المتراجعين في الفروض الأولى وتحديث سجل الحالات.',
    observations: 'تم تحرير استدعاء ولي للتلميذ قاسمي ياسين.',
    completed: true,
  },
  {
    id: 'act-03',
    weekLabel: 'الأسبوع الأول من نوفمبر 2026',
    dayName: 'الثلاثاء',
    date: '2026-11-03',
    timeSlot: 'الفترة المسائية (13:30 - 16:30)',
    stage: 'middle',
    axis: 'تطبيق المقاييس والاستبيانات',
    targetAudience: 'أقسام السنة 4 متوسط (4م1 و 4م2)',
    activityDescription: 'تطبيق مقياس هولاند للميول المهنية (RIASEC) وتفريغ الأكواد الثلاثية لمقارنتها ببطاقات الرغبات.',
    observations: 'رصد 3 حالات تباين بين الرغبة المصرح بها والميل الحقيقي.',
    completed: true,
  },
  {
    id: 'act-04',
    weekLabel: 'الأسبوع الأول من نوفمبر 2026',
    dayName: 'الأربعاء',
    date: '2026-11-04',
    timeSlot: 'الفترة الصباحية (08:00 - 12:00)',
    stage: 'middle',
    axis: 'التنسيق الإداري ووحدة UDS',
    targetAudience: 'فريق صحة مدرسية UDS + مستشار التربية',
    activityDescription: 'اجتماع تنسيقي لتفعيل الحملة التحسيسية للوقاية من التدخين والمخدرات ومتابعة الحالات المحالة.',
    observations: 'برمجة يوم تحسيسي مع تعليق الملصقات الوقائية.',
    completed: false,
  },
  {
    id: 'act-05',
    weekLabel: 'الأسبوع الأول من نوفمبر 2026',
    dayName: 'الخميس',
    date: '2026-11-05',
    timeSlot: 'الفترة الصباحية (08:00 - 12:00)',
    stage: 'secondary',
    axis: 'استغلال وتحليل النتائج المدرسية',
    targetAudience: 'مستويات الجذوع المشتركة والسنوات النهائية',
    activityDescription: 'استيراد قوائم النقاط من الرقمنة وإعداد التقرير الإحصائي لعرضه في مجالس الأقسام.',
    observations: 'نسبة إنجاز بطاقات الرغبات بلغت 92%.',
    completed: false,
  },
];

export const INITIAL_AGENDA: AgendaItem[] = [
  {
    id: 'ag-01',
    title: 'استقبال ولي أمر التلميذ قاسمي ياسين (متابعة رادار الإنذار المبكر)',
    date: '2026-11-05',
    time: '09:30',
    stage: 'secondary',
    category: 'مقابلة إرشادية',
    priority: 'عاجل',
    completed: false,
    notes: 'مناقشة الغيابات الـ 7 غير المبررة وتراجع المعدل في الرياضيات.',
  },
  {
    id: 'ag-02',
    title: 'حصة إعلامية حول آفاق البكالوريا والمدارس العليا (قسم 3 ع.ت 1)',
    date: '2026-11-05',
    time: '11:00',
    stage: 'secondary',
    category: 'حصة إعلامية',
    priority: 'مهم',
    completed: false,
    notes: 'عرض دليل التخصصات الجامعية والمنشور الوزاري للتسجيلات الأولية.',
  },
  {
    id: 'ag-03',
    title: 'جلسة تنسيق مع طبيبة وحدة الكشف والمتابعة UDS (الوقاية من التدخين)',
    date: '2026-11-06',
    time: '10:00',
    stage: 'middle',
    category: 'تنسيق UDS',
    priority: 'عاجل',
    completed: false,
    notes: 'متابعة البطاقة المقننة للتلميذ زروقي آدم وتوزيع ملصقات التوعية.',
  },
  {
    id: 'ag-04',
    title: 'ضبط المحضر النهائي للتوجيه المسبق (4 متوسط و 1 ثانوي)',
    date: '2026-11-08',
    time: '13:30',
    stage: 'all',
    category: 'استحقاق توجيه',
    priority: 'مهم',
    completed: true,
    notes: 'مراجعة تطابق بطاقات الرغبات مع نتائج مقياس هولاند قبل مجالس الأقسام.',
  },
];

export const UNIVERSITY_HORIZONS_DATA: UniversityHorizonItem[] = [
  {
    id: 'uh-01',
    fieldAr: 'العلوم الطبية والصيدلة وطب الأسنان',
    specialties: ['الطب العام (دكتور في الطب)', 'طب الأسنان', 'الصيدلة', 'الصيدلة الصناعية'],
    eligibleBacStreams: [
      {
        stream: 'علوم تجريبية',
        priority: 'الأولوية 1',
        minWeightedAvgEstimate: '16.50 - 17.20 / 20',
        keySubjectCondition: 'علامة علوم الطبيعة والحياة والفيزياء ≥ 15/20',
      },
      {
        stream: 'رياضيات',
        priority: 'الأولوية 2',
        minWeightedAvgEstimate: '17.00 - 17.60 / 20',
        keySubjectCondition: 'المعدل الموزون يعتمد على المعدل العام + العلوم',
      },
      {
        stream: 'تقني رياضي',
        priority: 'الأولوية 3',
        minWeightedAvgEstimate: '17.30+ / 20',
        keySubjectCondition: 'مقاعد محددة وفق الترتيب الوطني',
      },
    ],
    careerProspects: ['طبيب ممارس بالمستشفيات', 'طبيب مختص / جراح', 'صيدلي أو باحث صيدلاني', 'طبيب جراح أسنان'],
    hollandMatch: 'ISA / IRS',
  },
  {
    id: 'uh-02',
    fieldAr: 'المدارس العليا للذكاء الاصطناعي والإعلام الآلي والرياضيات',
    specialties: [
      'المدرسة الوطنية العليا للذكاء الاصطناعي (ENSIA)',
      'المدرسة الوطنية العليا للإعلام الآلي (ESI)',
      'المدرسة الوطنية العليا للرياضيات (NHSM)',
      'الأمن السيبراني وعلوم البيانات',
    ],
    eligibleBacStreams: [
      {
        stream: 'رياضيات',
        priority: 'الأولوية 1',
        minWeightedAvgEstimate: '16.20 - 17.40 / 20',
        keySubjectCondition: 'علامة الرياضيات ≥ 16/20 في البكالوريا',
      },
      {
        stream: 'علوم تجريبية',
        priority: 'الأولوية 2',
        minWeightedAvgEstimate: '16.80 - 17.80 / 20',
        keySubjectCondition: 'علامة الرياضيات ≥ 15/20',
      },
      {
        stream: 'تقني رياضي',
        priority: 'الأولوية 2',
        minWeightedAvgEstimate: '16.80 - 17.50 / 20',
        keySubjectCondition: 'علامة الرياضيات والتكنولوجيا ≥ 15/20',
      },
    ],
    careerProspects: ['مهندس دولة في الذكاء الاصطناعي', 'مهندس معماري للأنظمة والأمن السيبراني', 'باحث في علوم البيانات والخوارزميات'],
    hollandMatch: 'IRC / ICR',
  },
  {
    id: 'uh-03',
    fieldAr: 'العلوم والتكنولوجيا والمدارس متعددة التقنيات (Polytechnique)',
    specialties: [
      'الهندسة المدنية والأشغال العمومية',
      'الهندسة الكهربائية والأوتوماتيك',
      'الهندسة الميكانيكية والطيران',
      'هندسة الطرائق والبتروكيمياء',
      'الهندسة المعمارية وعمران المدن',
    ],
    eligibleBacStreams: [
      {
        stream: 'تقني رياضي',
        priority: 'الأولوية 1',
        minWeightedAvgEstimate: '13.50 - 15.80 / 20',
        keySubjectCondition: 'الأولوية المباشرة في تخصص الهندسة الموافق',
      },
      {
        stream: 'رياضيات',
        priority: 'الأولوية 1',
        minWeightedAvgEstimate: '13.50 - 15.50 / 20',
        keySubjectCondition: 'الرياضيات والفيزياء ≥ 13/20',
      },
      {
        stream: 'علوم تجريبية',
        priority: 'الأولوية 2',
        minWeightedAvgEstimate: '14.00 - 16.00 / 20',
        keySubjectCondition: 'الرياضيات والفيزياء ≥ 13/20',
      },
    ],
    careerProspects: ['مهندس دولة في الصناعة والطاقة', 'مهندس معماري معتمد', 'مهندس مشاريع كبرى وأشغال عمومية'],
    hollandMatch: 'RIC / RCI',
  },
  {
    id: 'uh-04',
    fieldAr: 'المدارس العليا للأساتذة (ENS) وعلوم التربية',
    specialties: [
      'أستاذ التعليم الثانوي (جميع المواد)',
      'أستاذ التعليم المتوسط (جميع المواد)',
      'أستاذ التعليم الابتدائي (اللغة العربية / الفرنسية / الإنجليزية)',
      'علم النفس التربوي والتوجيه المدرسي والمهني',
    ],
    eligibleBacStreams: [
      {
        stream: 'جميع الشعب (حسب التخصص)',
        priority: 'الأولوية 1',
        minWeightedAvgEstimate: '14.00 - 16.20 / 20',
        keySubjectCondition: 'اجتياز المقابلة الشفوية بنجاح + نقطة المادة الأساسية ≥ 13/20',
      },
    ],
    careerProspects: ['أستاذ مرسم بقطاع التربية الوطنية', 'مستشار التوجيه والإرشاد المدرسي والمهني (تخصص علوم التربية/علم النفس)'],
    hollandMatch: 'SAE / SIA',
  },
  {
    id: 'uh-05',
    fieldAr: 'العلوم الاقتصادية والتجارية ومدارس التسيير العليا (HEC / ESC)',
    specialties: [
      'المدرسة العليا للدراسات التجارية (HEC)',
      'المدرسة الوطنية العليا للإحصاء والاقتصاد التطبيقي (ENSSEA)',
      'المحاسبة والمالية والبنوك والتأمينات',
      'إدارة الأعمال والتجارة الدولية الرقمنة',
    ],
    eligibleBacStreams: [
      {
        stream: 'تسيير واقتصاد',
        priority: 'الأولوية 1',
        minWeightedAvgEstimate: '12.50 - 15.50 / 20',
        keySubjectCondition: 'علامة التسيير المحاسبي والمالي والاقتصاد ≥ 12/20',
      },
      {
        stream: 'رياضيات / علوم تجريبية',
        priority: 'الأولوية 2',
        minWeightedAvgEstimate: '13.50 - 15.80 / 20',
        keySubjectCondition: 'علامة الرياضيات ≥ 12/20',
      },
    ],
    careerProspects: ['خبير محاسب ومحافظ حسابات', 'إطار مالي ومصرفي', 'محلل اقتصادي وإحصائي', 'مسير مؤسسات ناشئة'],
    hollandMatch: 'ECS / CES',
  },
  {
    id: 'uh-06',
    fieldAr: 'الآداب واللغات الأجنبية والترجمة والحقوق والعلوم السياسية',
    specialties: [
      'معهد الترجمة الفورية واللغات الحية (عربي/فرنسي/إنجليزي/إسباني/ألماني)',
      'المدرسة العليا للقضاء والحقوق والعلوم القانونية',
      'المدرسة الوطنية العليا للعلوم السياسية والإعلام والاتصال',
      'الأدب العربي واللسانيات والحضارة',
    ],
    eligibleBacStreams: [
      {
        stream: 'لغات أجنبية',
        priority: 'الأولوية 1',
        minWeightedAvgEstimate: '12.00 - 15.20 / 20',
        keySubjectCondition: 'الأولوية الأولى في معاهد الترجمة واللغات الحية',
      },
      {
        stream: 'آداب وفلسفة',
        priority: 'الأولوية 1',
        minWeightedAvgEstimate: '11.50 - 14.80 / 20',
        keySubjectCondition: 'الأولوية الأولى في الأدب، الفلسفة، العلوم الإنسانية والحقوق',
      },
    ],
    careerProspects: ['مترجم رسمي ودبلوماسي', 'قاضٍ أو محامٍ أو موثق', 'صحفي وإعلامي', 'باحث في العلوم الإنسانية والاجتماعية'],
    hollandMatch: 'ASE / SEA',
  },
];

export const HOLLAND_DIMENSIONS_META: Record<
  'R' | 'I' | 'A' | 'S' | 'E' | 'C',
  {
    code: 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
    nameAr: string;
    traitsAr: string;
    matchingSecondaryStreams: string[];
    matchingCareers: string[];
    questions: string[];
  }
> = {
  R: {
    code: 'R',
    nameAr: 'النمط الواقعي العملي (Realistic)',
    traitsAr: 'يميل إلى العمل اليدوي، الهندسة التطبيقية، الآلات، الإلكترونيك، والأنشطة الميدانية الملموسة.',
    matchingSecondaryStreams: ['تقني رياضي (ميكانيكية / كهربائية / مدنية / طرائق)', 'التعليم والتكوين المهني'],
    matchingCareers: ['مهندس ميكانيك أو كهرباء أو مدني', 'تقني سامي في الصيانة الصناعية', 'مهندس فلاحي أو طيران'],
    questions: [
      'أستمتع بتركيب الأجهزة الإلكترونية أو إصلاح الآلات والأدوات بيدي.',
      'أفضل الأعمال التطبيقية في الورشة أو المخبر على الحفظ النظري الطويل.',
      'يهوي بي تصميم المجسمات الهندسية أو الرسومات التقنية الدقيقة.',
    ],
  },
  I: {
    code: 'I',
    nameAr: 'النمط البحثي العلمي (Investigative)',
    traitsAr: 'يتميز بالفضول العلمي، التفكير المنطقي والتحليلي، حل المسائل الرياضية، والتجارب المخبرية.',
    matchingSecondaryStreams: ['رياضيات', 'علوم تجريبية', 'تقني رياضي'],
    matchingCareers: ['طبيب أو صيدلي أو بيولوجي', 'مهندس ذكاء اصطناعي وإعلام آلي', 'باحث في الرياضيات أو الفيزياء'],
    questions: [
      'أجد متعة كبيرة في حل المسائل الرياضية والفيزيائية المعقدة.',
      'أحب إجراء التجارب العلمية في مخبر العلوم الطبيعية وفهم الظواهر الحيوية.',
      'أميل إلى البحث عن الأسباب العلمية والمنطقية وراء كل ظاهرة.',
    ],
  },
  A: {
    code: 'A',
    nameAr: 'النمط الفني الإبداعي (Artistic)',
    traitsAr: 'يميل إلى التعبير الأدبي، اللغات، الإبداع الفني، التصميم المعماري، والتفكير الحر غير النمطي.',
    matchingSecondaryStreams: ['لغات أجنبية', 'آداب وفلسفة', 'تقني رياضي (هندسة معمارية/مدنية)'],
    matchingCareers: ['مترجم وأديب وكاتب', 'مهندس معماري أو مصمم جرافيك', 'صحفي أو مخرج سمعي بصري'],
    questions: [
      'أحب تعلم اللغات الأجنبية والتعبير الكتابي والأدبي الحر.',
      'أمتلك خيالاً واسعاً في الرسم أو التصميم أو كتابة المقالات والقصص.',
      'أفضل المهام التي تتيح لي الابتكار والتجديد بعيداً عن الروتين.',
    ],
  },
  S: {
    code: 'S',
    nameAr: 'النمط الاجتماعي الإنساني (Social)',
    traitsAr: 'يتميز بحب مساعدة الآخرين، التواصل، التعليم، الإرشاد النفسي، والعمل الجماعي التربوي والصحي.',
    matchingSecondaryStreams: ['آداب وفلسفة', 'علوم تجريبية', 'لغات أجنبية'],
    matchingCareers: ['أستاذ تعليم أو مستشار توجيه وإرشاد', 'أخصائي نفساني أو أرطفوني', 'طبيب أو ممرض في الصحة العمومية'],
    questions: [
      'أشعر بالسعادة عندما أشرح الدروس لزملائي أو أساعدهم في حل مشكلاتهم.',
      'أهتم بفهم نفسية الآخرين وبناء علاقات تواصل إيجابية داخل القسم.',
      'أرغب مستقبلاً في مهنة إنسانية كالتعليم أو الإرشاد النفسي أو الرعاية الصحية.',
    ],
  },
  E: {
    code: 'E',
    nameAr: 'النمط المغامر القيادي (Enterprising)',
    traitsAr: 'يميل إلى القيادة، الإقناع، إدارة المشاريع، الاقتصاد، القانون، والمبادرة المقاولاتية.',
    matchingSecondaryStreams: ['تسيير واقتصاد', 'آداب وفلسفة', 'لغات أجنبية'],
    matchingCareers: ['مسير مؤسسات أو رائد أعمال', 'محامٍ أو قاضٍ أو دبلوماسي', 'إطار في التجارة الدولية والتسويق'],
    questions: [
      'أحب قيادة مجموعات العمل والنشاطات الثقافية والعلمية في المؤسسة.',
      'أمتلك قدرة جيدة على الحوار والإقناع والدفاع عن الأفكار بالحجة.',
      'أهتم بعالم الاقتصاد، التجارة، القانون، وإدارة المشاريع الناجحة.',
    ],
  },
  C: {
    code: 'C',
    nameAr: 'النمط التقليدي التنظيمي (Conventional)',
    traitsAr: 'يتميز بالدقة، التنظيم، التعامل مع الأرقام والجداول المحاسبية، واحترام القواعد والإجراءات.',
    matchingSecondaryStreams: ['تسيير واقتصاد', 'رياضيات'],
    matchingCareers: ['خبير محاسب أو محافظ حسابات', 'إطار بنكي ومالي أو إحصائي', 'متصرف إداري ورقمي'],
    questions: [
      'أحب تنظيم دفاتري وجداول أوقاتي والعمل وفق خطوات واضحة ومرتبة.',
      'أستمتع بالحسابات المالية، الجداول الإحصائية، وترتيب البيانات الرقمية.',
      'أفضل الدقة والانضباط ومراجعة التفاصيل الصغيرة في كل عمل أقوم به.',
    ],
  },
};

export const INITIAL_LEGISLATION_CIRCULARS: LegislationCircular[] = [
  {
    id: 'leg-01',
    referenceCode: 'المرسوم التنفيذي 25-54 (تحيين 2026)',
    title: 'القانون الأساسي الخاص بالموظفين المنتمين للأسلاك الخاصة بالتربية الوطنية — سلك مستشاري التوجيه والإرشاد المدرسي والمهني',
    issueDate: '2025 / 2026',
    category: 'القانون الأساسي والمهام',
    summary:
      'يحدد التصنيف الجديد، الرتب الأربع (مستشار الصنف 13، مستشار رئيسي الصنف 14، مستشار مكون الصنف 16، مفتش التوجيه الصنف 17)، المهام البيداغوجية، وشروط الترقية والإدماج.',
    articles: [
      {
        articleNum: 'المادة 148 (مستشار التوجيه - الصنف 13)',
        content:
          'يكلف مستشارو التوجيه والإرشاد المدرسي والمهني بمرافقة التلاميذ في بناء مشاريعهم الدراسية والمهنية، القيام بالحملات الإعلامية، إجراء المقابلات الإرشادية، والمشاركة كأعضاء فاعلين في مجالس الأقسام والتوجيه.',
      },
      {
        articleNum: 'المادة 151 (مستشار رئيسي للتوجيه - الصنف 14)',
        content:
          'زيادة على مهام مستشار التوجيه، يكلف المستشارون الرئيسيون بإنجاز الدراسات الإحصائية والتحليلية لنتائج التلاميذ، التكفل بالحالات النفسية التربوية الخاصة، وتنسيق خلايا الإصغاء والوقاية.',
      },
      {
        articleNum: 'المادة 154 (مستشار مكون للتوجيه - الصنف 16)',
        content:
          'يكلف المستشارون المكونون بمرافقة وتكوين المستشارين المتربصين، بناء وتكييف الروائز والمقاييس النفسية والتربوية، والإشراف على الفرق التقنية بالمقاطعة.',
      },
      {
        articleNum: 'المادة 158 (مفتش التوجيه المدرسي والمهني - الصنف 17)',
        content:
          'يكلف مفتشو التوجيه والإرشاد المدرسي والمهني بالتفتيش والتقويم والمراقبة الميدانية لنشاطات مستشاري التوجيه، اعتماد الخرائط التربوية للتوجيه، ورئاسة لجان الطعن الولائية.',
      },
    ],
  },
  {
    id: 'leg-02',
    referenceCode: 'القرار الوزاري رقم 831 المؤرخ في 13 نوفمبر 1991 (والمناشير المكملة)',
    title: 'تحديد مهام مستشار التوجيه المدرسي والمهني ونظام العمل في الثانويات والمتوسطات ومراكز التوجيه',
    issueDate: 'ساري المفعول ومحين 2026',
    category: 'القانون الأساسي والمهام',
    summary:
      'يفصل المحاور الأربعة لنشاط مستشار التوجيه: الإعلام المدرسي والمهني، الإرشاد والمتابعة النفسية التربوية، التقويم والفحص النفسي، والتوجيه المدرسي والمهني.',
    articles: [
      {
        articleNum: 'المادة 04 (محور الإعلام المدرسي والمهني)',
        content:
          'تنظيم الحصص الإعلامية لفائدة تلاميذ السنة الرابعة متوسط والسنوات الأولى والثانية والثالثة ثانوي وأوليائهم حول المسارات الدراسية، التكوين المهني، والتخصصات الجامعية.',
      },
      {
        articleNum: 'المادة 08 (محور الإرشاد والمتابعة النفسية)',
        content:
          'التكفل بالتلاميذ الذين يعانون من صعوبات التكيف المدرسي، التأخر الدراسي، القلق، أو الاضطرابات السلوكية عن طريق المقابلات الفردية والجماعية.',
      },
      {
        articleNum: 'المادة 12 (محور التقويم والروائز)',
        content:
          'تطبيق المقاييس والاستبيانات النفسية ومقاييس الميول المهنية، وتحليل النتائج الفصلية والسنوية لتقديم البدائل البيداغوجية في مجالس الأقسام.',
      },
    ],
  },
  {
    id: 'leg-03',
    referenceCode: 'المنشور الوزاري المنظم للحجم الساعي والتوقيت الأسبوعي لمستشار التوجيه',
    title: 'تنظيم التوقيت الأسبوعي (32 ساعة) وتوزيع النشاط بين الثانوية ومقاطعة المتوسطات ومركز التوجيه',
    issueDate: 'تنظيم التوقيت الرسمي',
    category: 'التوقيت والأقسام المسندة',
    summary:
      'يضبط النصاب الزمني الأسبوعي لمستشار التوجيه وكيفية توزيع الفترات الصباحية والمسائية بين العمل الميداني بالمؤسسات المسندة والعمل التقني بمركز التوجيه.',
    articles: [
      {
        articleNum: 'البند 01 (النصاب الزمني الأسبوعي)',
        content:
          'يحدد الحجم الساعي الأسبوعي لمستشار التوجيه والإرشاد المدرسي والمهني بـ 32 ساعة أسبوعياً موزعة على 5 أيام عمل وفق جدول توقيت مصادق عليه من مدير مركز التوجيه ومدير الثانوية.',
      },
      {
        articleNum: 'البند 02 (توزيع الأنشطة والأقسام المسندة)',
        content:
          'يُسند لمستشار التوجيه متابعة الثانوية المعين بها بالإضافة إلى متوسطتين إلى ثلاث متوسطات ضمن المقاطعة الجغرافية، مع تخصيص يوم عمل تقني وتنسيقي بمركز التوجيه المدرسي والمهني (أو حسب برمجة المركز).',
      },
      {
        articleNum: 'البند 03 (السجلات الرسمية الإلزامية)',
        content:
          'يمسك المستشار إلزامياً: سجل النشاط الأسبوعي، سجل المقابلات الإرشادية المرقم والمؤشر، سجل طالبي الإعلام، سجل متابعة الحالات الخاصة، وملف محاضر التوجيه وإعادة التوجيه.',
      },
    ],
  },
  {
    id: 'leg-04',
    referenceCode: 'المنشور الإطار للتوجيه المسبق والنهائي وجسور إعادة التوجيه 2026',
    title: 'إجراءات توجيه تلاميذ 4 متوسط و 1 ثانوي ومعالجة التماسات إعادة التوجيه والطعون',
    issueDate: 'تحيين 2026',
    category: 'مناشير التوجيه وإعادة التوجيه',
    summary:
      'يحدد رزنامة ومعايير حساب مجموعات التوجيه الموزونة، دراسة الرغبات، وضوابط جسور إعادة التوجيه قبل الدخول المدرسي.',
    articles: [
      {
        articleNum: 'المادة 01 (التوجيه التشاركي التربوي)',
        content:
          'يبنى قرار التوجيه على التوفيق العلمي بين رغبة التلميذ المصرح بها، ملمحه الدراسي في المواد المميزة، نتائج مقاييس الميول، ومقاعد الاستقبال المتوفرة في الخريطة التربوية.',
      },
      {
        articleNum: 'المادة 05 (جسور إعادة التوجيه والطعون)',
        content:
          'تودع طلبات إعادة التوجيه وتغيير الشعبة لدى مكتب مستشار التوجيه لدراستها وتدوين الرأي التربوي المعلل قبل عرضها على لجنة التوجيه والطعن للفصل النهائي.',
      },
    ],
  },
  {
    id: 'leg-05',
    referenceCode: 'التعليمة الوزارية المشتركة (التربية / الصحة) حول خلايا الإصغاء ووحدات UDS',
    title: 'بروتوكول الوقاية من الآفات الاجتماعية والمخدرات والتدخين والتنمر في الوسط المدرسي',
    issueDate: 'ساري المفعول',
    category: 'الإرشاد النفسي ووحدة UDS',
    summary:
      'ينظم العمل المشترك بين مستشار التوجيه والإرشاد وأطباء وأخصائيي وحدات الكشف والمتابعة (UDS) للتكفل السري بالحالات.',
    articles: [
      {
        articleNum: 'البند 01 (السر المهني والمقاربة الوقائية)',
        content:
          'تخضع جميع ملفات المتابعة النفسية وحالات الوقاية من التدخين والمؤثرات العقلية للسر المهني المطلق، وتعتمد المقاربة التربوية العلاجية غير العقابية.',
      },
      {
        articleNum: 'البند 02 (بطاقة التنسيق السرية مع UDS)',
        content:
          'يتم إخطار طبيب أو أخصائي وحدة الكشف والمتابعة (UDS) بموجب بطاقة تدخل مقننة وسرية لضمان المتابعة الطبية النفسية المشتركة للتلميذ.',
      },
    ],
  },
];

export const INITIAL_ASSIGNED_CLASSES: AssignedClassGroup[] = [
  {
    id: 'cls-01',
    institutionName: 'ثانوية العقيد لطفي النموذجية (المؤسسة المقر)',
    stage: 'secondary',
    level: '1 ثانوي ج.م.ع.ت',
    groupName: '1 ج.م.ع.ت 1',
    studentsCount: 36,
    femaleCount: 20,
    repeatersCount: 3,
    assignedSlotDay: 'الأحد',
    assignedSlotTime: '09:00 - 10:00',
    infoSessionsCompleted: 3,
    infoSessionsPlanned: 3,
    psychTestsApplied: true,
  },
  {
    id: 'cls-02',
    institutionName: 'ثانوية العقيد لطفي النموذجية (المؤسسة المقر)',
    stage: 'secondary',
    level: '1 ثانوي ج.م.ع.ت',
    groupName: '1 ج.م.ع.ت 2',
    studentsCount: 35,
    femaleCount: 18,
    repeatersCount: 5,
    assignedSlotDay: 'الأحد',
    assignedSlotTime: '10:00 - 11:00',
    infoSessionsCompleted: 3,
    infoSessionsPlanned: 3,
    psychTestsApplied: true,
  },
  {
    id: 'cls-03',
    institutionName: 'ثانوية العقيد لطفي النموذجية (المؤسسة المقر)',
    stage: 'secondary',
    level: '1 ثانوي ج.م.آ',
    groupName: '1 ج.م.آ 1',
    studentsCount: 32,
    femaleCount: 22,
    repeatersCount: 4,
    assignedSlotDay: 'الاثنين',
    assignedSlotTime: '09:00 - 10:00',
    infoSessionsCompleted: 2,
    infoSessionsPlanned: 3,
    psychTestsApplied: true,
  },
  {
    id: 'cls-04',
    institutionName: 'ثانوية العقيد لطفي النموذجية (المؤسسة المقر)',
    stage: 'secondary',
    level: '3 ثانوي (أقسام البكالوريا)',
    groupName: '3 ع.ت 1 + 3 ت.ر 1',
    studentsCount: 64,
    femaleCount: 36,
    repeatersCount: 8,
    assignedSlotDay: 'الاثنين',
    assignedSlotTime: '11:00 - 12:00',
    infoSessionsCompleted: 2,
    infoSessionsPlanned: 3,
    psychTestsApplied: false,
  },
  {
    id: 'cls-05',
    institutionName: 'متوسطة الأمير عبد القادر (مقاطعة التوجيه 03)',
    stage: 'middle',
    level: '4 متوسط',
    groupName: '4 م 1',
    studentsCount: 38,
    femaleCount: 21,
    repeatersCount: 4,
    assignedSlotDay: 'الثلاثاء',
    assignedSlotTime: '09:00 - 10:00',
    infoSessionsCompleted: 3,
    infoSessionsPlanned: 3,
    psychTestsApplied: true,
  },
  {
    id: 'cls-06',
    institutionName: 'متوسطة الأمير عبد القادر (مقاطعة التوجيه 03)',
    stage: 'middle',
    level: '4 متوسط',
    groupName: '4 م 2',
    studentsCount: 37,
    femaleCount: 19,
    repeatersCount: 6,
    assignedSlotDay: 'الثلاثاء',
    assignedSlotTime: '10:00 - 11:00',
    infoSessionsCompleted: 2,
    infoSessionsPlanned: 3,
    psychTestsApplied: true,
  },
];

