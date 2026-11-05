export type EducationStage = 'middle' | 'secondary';

export type CounselorRankKey =
  | 'counselor'
  | 'principal_counselor'
  | 'trainer_counselor'
  | 'inspector_counselor';

export type SectionId =
  | 'dashboard'
  | 'orientation'
  | 'interviews'
  | 'cases'
  | 'infoseekers'
  | 'scales'
  | 'assistant'
  | 'legislation'
  | 'career_simulator'
  | 'horizons'
  | 'digitalization';

export interface LegislationCircular {
  id: string;
  referenceCode: string;
  title: string;
  issueDate: string;
  category:
    | 'القانون الأساسي والمهام'
    | 'مناشير التوجيه وإعادة التوجيه'
    | 'التوقيت والأقسام المسندة'
    | 'الإرشاد النفسي ووحدة UDS'
    | 'المجالس والامتحانات الرسمية';
  summary: string;
  articles: { articleNum: string; content: string }[];
}

export interface AssignedClassGroup {
  id: string;
  institutionName: string;
  stage: EducationStage;
  level: string;
  groupName: string;
  studentsCount: number;
  femaleCount: number;
  repeatersCount: number;
  assignedSlotDay: 'الأحد' | 'الاثنين' | 'الثلاثاء' | 'الأربعاء' | 'الخميس';
  assignedSlotTime: string;
  infoSessionsCompleted: number;
  infoSessionsPlanned: number;
  psychTestsApplied: boolean;
}

export interface CounselorRankMeta {
  key: CounselorRankKey;
  title: string;
  shortTitle: string;
  category: string;
  baseIndex: number;
  decreeRef: string;
  badgeText: string;
  description: string;
}

export interface StageMeta {
  key: EducationStage;
  name: string;
  shortName: string;
  orientationFocus: string;
  badgeText: string;
  description: string;
}

export interface InstitutionInfo {
  stage: EducationStage;
  rankKey: CounselorRankKey;
  wilaya: string;
  schoolName: string;
  districtCenter: string; // مركز التوجيه المدرسي والمهني / المقاطعة
  counselorName: string;
  principalName: string;
  schoolYear: string;
  currentTerm: 'الأول' | 'الثاني' | 'الثالث';
  emblemUrl?: string;
  customRoleTitle?: string;
  isVerifiedCertificate?: boolean;
  certificateRef?: string;
}

export type HollandCodeLetter = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

export interface StudentCounselingRecord {
  id: string;
  matricule: string;
  fullName: string;
  gender: 'ذكر' | 'أنثى';
  birthDate: string;
  stage: EducationStage;
  level: '4 متوسط' | '1 ثانوي ج.م.ع.ت' | '1 ثانوي ج.م.آ' | '2 ثانوي' | '3 ثانوي';
  group: string; // مثلاً 4م1 أو 1ج م ع ت 2
  // النتائج الدراسية والنقاط الأساسية
  term1Avg: number;
  term2Avg: number;
  term3Avg: number;
  mathGrade: number;
  physicsGrade: number;
  scienceGrade: number;
  arabicGrade: number;
  frenchGrade: number;
  englishGrade: number;
  historyGeoGrade: number;
  // الغيابات والسلوك (لحساب مؤشر الخطورة المركب من 100)
  unjustifiedAbsences: number;
  justifiedAbsences: number;
  behaviorNotesCount: number; // ملاحظات انضباطية أو سلوكية
  psychologicalAlertLevel: 'normal' | 'moderate' | 'high' | 'critical';
  // بطاقة الرغبات والتوجيه
  wishCardCompleted: boolean;
  wish1: string;
  wish2: string;
  wish3: string;
  councilProposal: string;
  finalOrientationDecision: string;
  orientationStatus: 'satisfied_1' | 'satisfied_2' | 'satisfied_3' | 'council_assigned' | 'appeal_pending';
  // مقياس هولاند للميول المهنية
  hollandCode: string; // مثل "ISA" أو "RIC"
  hollandScores: Record<HollandCodeLetter, number>;
  parentPhone: string;
  parentName: string;
}

export interface ReorientationRequest {
  id: string;
  orderNumber: string;
  studentId: string;
  studentName: string;
  stage: EducationStage;
  group: string;
  currentStream: string;
  requestedStream: string;
  annualAverage: number;
  keySubjectsAverage: number;
  justification: string;
  counselorOpinion: string;
  committeeDecision: 'مقبول' | 'مرفوض' | 'قيد الدراسة';
  requestDate: string;
}

export type InterviewType = 'فردية' | 'جماعية' | 'مع الولي' | 'استعجالية';

export type InterviewSource =
  | 'تلقائي (المستشار)'
  | 'بطلب التلميذ'
  | 'إحالة الناظر / مستشار التربية'
  | 'إحالة أستاذ'
  | 'بطلب الولي'
  | 'رادار الإنذار المبكر';

export type InterviewDomain =
  | 'توجيه مدرسي ومهني'
  | 'توافق نفسي وتربوي'
  | 'تحصيل ومنهجية استذكار'
  | 'سلوكي وانضباطي'
  | 'عائلي واجتماعي'
  | 'وقاية صحية (UDS)';

export interface CounselingInterview {
  id: string;
  serialNumber: string; // ترقيم تسلسلي سنوي آلي مثل 2026/001
  date: string;
  time: string;
  term: 'الأول' | 'الثاني' | 'الثالث';
  stage: EducationStage;
  studentId: string;
  studentName: string;
  studentGroup: string;
  gender: 'ذكر' | 'أنثى';
  interviewType: InterviewType;
  source: InterviewSource;
  domain: InterviewDomain;
  summary: string;
  followUpPlan: string;
  counselorVisa: boolean;
  requiresParentSummon: boolean;
}

export type SpecialCaseCategory =
  | 'التنمر المدرسي'
  | 'القلق الدراسي وقلق الامتحانات'
  | 'صعوبات التعلم'
  | 'التأخر الدراسي والتسرب'
  | 'الوقاية من المخدرات والتدخين (UDS)';

export interface PsychoPedagogicalCase {
  id: string;
  caseCode: string;
  studentId: string;
  studentName: string;
  stage: EducationStage;
  group: string;
  category: SpecialCaseCategory;
  openedDate: string;
  confidentialityLevel: 'سري' | 'سري للغاية (ملف خاص)';
  symptomsAndIndicators: string[];
  udsCoordination: {
    isReferredToUds: boolean;
    udsDoctorName?: string;
    referralDate?: string;
    udsProtocolCode?: string;
    udsFollowUpStatus?: 'لم يحل' | 'تحت المتابعة الطبية النفسية' | 'تكفل مشترك مكتمل';
    smokingOrSubstanceType?: string;
  };
  sessionsCount: number;
  diagnosisSummary: string;
  interventionPlan: string;
  status: 'نشطة (قيد التكفل)' | 'تحسن ملحوظ' | 'مغلقة بعد التكفل';
}

export type InfoTopicCategory =
  | 'الشعب والمسارات الدراسية'
  | 'التكوين والتعليم المهنيين'
  | 'نظام الامتحانات الرسمية'
  | 'إجراءات إعادة التوجيه والطعن'
  | 'التخصصات والآفاق الجامعية'
  | 'المنح والنظام الداخلي';

export interface InfoSeekerEntry {
  id: string;
  serialNumber: string;
  date: string;
  time: string;
  stage: EducationStage;
  visitorType: 'تلميذ(ة)' | 'ولي أمر' | 'أستاذ(ة)';
  visitorName: string;
  groupOrRelation: string;
  topicCategory: InfoTopicCategory;
  questionBrief: string;
  answerProvided: string;
  documentsHanded: string;
}

export interface WeeklyActivityEntry {
  id: string;
  weekLabel: string;
  dayName: 'الأحد' | 'الاثنين' | 'الثلاثاء' | 'الأربعاء' | 'الخميس';
  date: string;
  timeSlot: 'الفترة الصباحية (08:00 - 12:00)' | 'الفترة المسائية (13:30 - 16:30)';
  stage: EducationStage;
  axis:
    | 'الإعلام المدرسي والمهني في الأقسام'
    | 'المقابلات الإرشادية والمتابعة النفسية'
    | 'المجالس واللجان الرسمية'
    | 'استغلال وتحليل النتائج المدرسية'
    | 'تطبيق المقاييس والاستبيانات'
    | 'التنسيق الإداري ووحدة UDS';
  targetAudience: string;
  activityDescription: string;
  observations: string;
  completed: boolean;
}

export interface AgendaItem {
  id: string;
  title: string;
  date: string;
  time: string;
  stage: EducationStage | 'all';
  category: 'مقابلة إرشادية' | 'حصة إعلامية' | 'مجلس رسمي' | 'تنسيق UDS' | 'استحقاق توجيه';
  priority: 'عاجل' | 'مهم' | 'عادي';
  completed: boolean;
  notes: string;
}

export interface UniversityHorizonItem {
  id: string;
  fieldAr: string;
  specialties: string[];
  eligibleBacStreams: {
    stream: string;
    priority: 'الأولوية 1' | 'الأولوية 2' | 'الأولوية 3';
    minWeightedAvgEstimate: string;
    keySubjectCondition: string;
  }[];
  careerProspects: string[];
  hollandMatch: string;
}
