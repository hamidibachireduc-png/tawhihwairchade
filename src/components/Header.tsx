import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Compass,
  ClipboardList,
  HeartHandshake,
  Users,
  BrainCircuit,
  Mic,
  GraduationCap,
  Database,
  ShieldCheck,
  SlidersVertical,
  Bell,
  School,
  Calendar,
  Layers,
  Pencil,
  Check,
  RotateCcw,
  Wifi,
  WifiOff,
  Lock,
  Award,
  Scale,
  Calculator,
} from 'lucide-react';
import {
  CounselorRankKey,
  EducationStage,
  InstitutionInfo,
  SectionId,
} from '../types';
import {
  COUNSELOR_RANKS,
  DEFAULT_EMBLEM_URL,
  STAGE_METADATA,
} from '../data/initialData';

interface HeaderProps {
  activeStage: EducationStage;
  onSelectStage: (stage: EducationStage) => void;
  currentSection: SectionId;
  onSelectSection: (section: SectionId) => void;
  institution: InstitutionInfo;
  onUpdateInstitution: (updated: InstitutionInfo) => void;
  onOpenSettings: () => void;
  onOpenProtectedAuth: () => void;
  urgentAlertsCount: number;
  isOnline: boolean;
  lastSyncedAt: string | null;
  onTriggerCloudSync: () => void;
}

const STAGE_ROLE_PRESETS: Record<EducationStage, string[]> = {
  middle: [
    'مستشار التوجيه والإرشاد المدرسي والمهني (التعليم المتوسط)',
    'مستشار رئيسي للتوجيه والإرشاد بالمتوسطة',
    'مستشار مكون للتوجيه والإرشاد (مقاطعة المتوسطات)',
    'مفتش التوجيه والإرشاد المدرسي والمهني',
  ],
  secondary: [
    'مستشار التوجيه والإرشاد المدرسي والمهني (الثانوية)',
    'مستشار رئيسي للتوجيه والإرشاد بالثانوية',
    'مستشار مكون للتوجيه والإرشاد المدرسي والمهني',
    'مفتش التوجيه والإرشاد المدرسي والمهني',
  ],
};

export const Header: React.FC<HeaderProps> = ({
  activeStage,
  onSelectStage,
  currentSection,
  onSelectSection,
  institution,
  onUpdateInstitution,
  onOpenSettings,
  onOpenProtectedAuth,
  urgentAlertsCount,
  isOnline,
  lastSyncedAt,
  onTriggerCloudSync,
}) => {
  const stageMeta = STAGE_METADATA[activeStage];
  const rankMeta = COUNSELOR_RANKS[institution.rankKey || 'principal_counselor'];
  const activeRoleTitle = institution.customRoleTitle?.trim() || rankMeta.shortTitle;

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState(activeRoleTitle);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraftTitle(institution.customRoleTitle?.trim() || rankMeta.shortTitle);
    setIsEditingTitle(false);
  }, [activeStage, institution.customRoleTitle, rankMeta.shortTitle]);

  useEffect(() => {
    if (isEditingTitle && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingTitle]);

  const applyRoleTitle = (newTitle: string) => {
    const cleaned = newTitle.trim() || rankMeta.shortTitle;
    setDraftTitle(cleaned);
    onUpdateInstitution({
      ...institution,
      customRoleTitle: cleaned,
    });
    setIsEditingTitle(false);
  };

  const resetRoleTitle = () => {
    setDraftTitle(rankMeta.shortTitle);
    onUpdateInstitution({
      ...institution,
      customRoleTitle: undefined,
    });
    setIsEditingTitle(false);
  };

  const handleSelectRank = (rankKey: CounselorRankKey) => {
    onUpdateInstitution({
      ...institution,
      rankKey,
      customRoleTitle: undefined,
    });
  };

  const navItems: { id: SectionId; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'dashboard',
      label: 'لوحة التحكم والداشبورد الإحصائي',
      icon: <LayoutDashboard className="w-4 h-4" />,
      badge: urgentAlertsCount > 0 ? `${urgentAlertsCount} إنذار` : 'إحصائيات + PDF',
    },
    {
      id: 'orientation',
      label: 'توجيه التلاميذ والمحاضر الرسمية',
      icon: <Compass className="w-4 h-4" />,
      badge: activeStage === 'middle' ? 'توجيه 4م' : 'توجيه 1ث + الجسور',
    },
    {
      id: 'interviews',
      label: 'المقابلات الإرشادية واستدعاءات الأولياء',
      icon: <ClipboardList className="w-4 h-4" />,
      badge: 'سجل مقنن',
    },
    {
      id: 'cases',
      label: 'سجل الحالات والمتابعة النفسية (UDS)',
      icon: <HeartHandshake className="w-4 h-4" />,
      badge: 'سري + UDS',
    },
    {
      id: 'legislation',
      label: 'التشريع والتوقيت والأقسام المسندة',
      icon: <Scale className="w-4 h-4" />,
      badge: '32 سا + المناشير',
    },
    {
      id: 'career_simulator',
      label: 'محاكي الراتب والدرجات والترقية والتقاعد',
      icon: <Calculator className="w-4 h-4" />,
      badge: 'المرسوم 25-54',
    },
    {
      id: 'infoseekers',
      label: 'طالبي الإعلام والنشاط الأسبوعي',
      icon: <Users className="w-4 h-4" />,
      badge: 'ميداني',
    },
    {
      id: 'scales',
      label: 'بنك المقاييس (هولاند) وحملات التوعية',
      icon: <BrainCircuit className="w-4 h-4" />,
      badge: 'RIASEC + ملصقات',
    },
    {
      id: 'assistant',
      label: 'الإملاء الصوتي والتقارير السرية',
      icon: <Mic className="w-4 h-4" />,
      badge: 'صوتي + مؤشر /100',
    },
    {
      id: 'horizons',
      label: 'دليل الشعب وآفاق البكالوريا',
      icon: <GraduationCap className="w-4 h-4" />,
      badge: 'التخصصات الجامعية',
    },
    {
      id: 'digitalization',
      label: 'الرقمنة والأمان والمزامنة',
      icon: <Database className="w-4 h-4" />,
      badge: isOnline ? 'متصل + مشفر' : 'Offline محلي',
    },
  ];

  const logoSrc = institution.emblemUrl?.trim() ? institution.emblemUrl : DEFAULT_EMBLEM_URL;

  return (
    <header className="sticky top-0 z-40 bg-[#071a12]/95 backdrop-blur-md border-b border-[#d4af37]/50 shadow-lg no-print">
      <div className="h-0.5 w-full bg-gradient-to-r from-[#0f6839] via-[#f8fafc] to-[#b91c1c]" />

      <div className="max-w-7xl mx-auto px-3 sm:px-5">
        {/* السطر الأول المدمج: الهوية + الطور والرتبة + أزرار التحكم */}
        <div className="flex items-center justify-between py-1.5 gap-2">
          {/* الهوية والشعار بحجم مدمج */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="relative group cursor-pointer shrink-0"
              onClick={() => onSelectSection('dashboard')}
              title="العودة للوحة التحكم والرادار الذكي"
            >
              <div className="w-9 h-9 rounded-full p-0.5 bg-gradient-to-tr from-[#8f1414] via-[#d4af37] to-[#105e32] shadow flex items-center justify-center bg-[#06150e]">
                <img
                  src={logoSrc}
                  alt="شعار منصة مستشار SNTE 2026"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm sm:text-base font-black text-white tracking-tight flex items-center gap-1.5 truncate">
                  {!isEditingTitle ? (
                    <span
                      onClick={() => setIsEditingTitle(true)}
                      title="انقر لتعديل اللقب الوظيفي"
                      className="text-white hover:text-[#f5d77f] cursor-pointer inline-flex items-center gap-1 border-b border-dashed border-[#d4af37]/60 pb-0.5 transition-colors group"
                    >
                      <span>منصة {activeRoleTitle}</span>
                      <Pencil className="w-3 h-3 text-[#d4af37] opacity-75 group-hover:opacity-100" />
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-[#05140d] border border-[#d4af37] rounded-lg p-1 shadow-xl z-50">
                      <input
                        ref={inputRef}
                        type="text"
                        value={draftTitle}
                        onChange={(e) => setDraftTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') applyRoleTitle(draftTitle);
                          if (e.key === 'Escape') setIsEditingTitle(false);
                        }}
                        placeholder="اللقب الوظيفي..."
                        className="px-2 py-0.5 rounded bg-[#092116] border border-[#d4af37]/60 text-white text-xs font-bold focus:outline-none min-w-[140px]"
                      />
                      <button
                        type="button"
                        onClick={() => applyRoleTitle(draftTitle)}
                        className="p-1 rounded bg-[#d4af37] text-[#071710] cursor-pointer"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={resetRoleTitle}
                        className="p-1 rounded bg-slate-800 text-slate-300 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </h1>
                <span className="hidden md:inline-block text-[10px] bg-[#8f1414] text-white px-1.5 py-0.5 rounded font-bold border border-[#f5d77f]/30 shrink-0">
                  SNTE 2026
                </span>
              </div>
              <div className="text-[10px] text-slate-300 truncate hidden sm:block">
                {institution.schoolName} · {institution.counselorName}
              </div>
            </div>
          </div>

          {/* مبدل الطور والرتبة المدمج + أزرار الأمان والمزامنة */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* التبديل السريع للطور */}
            <div className="flex items-center bg-[#05120c] p-0.5 rounded-lg border border-[#d4af37]/30">
              {(['middle', 'secondary'] as EducationStage[]).map((stKey) => {
                const isSelected = activeStage === stKey;
                return (
                  <button
                    key={stKey}
                    onClick={() => onSelectStage(stKey)}
                    className={`px-2 py-1 rounded-md text-[11px] font-black transition-all cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710]'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {STAGE_METADATA[stKey].shortName}
                  </button>
                );
              })}
            </div>

            {/* قائمة منسدلة مدمجة لرتب التوجيه الـ 4 */}
            <select
              value={institution.rankKey}
              onChange={(e) => handleSelectRank(e.target.value as CounselorRankKey)}
              aria-label="رتبة مستشار التوجيه"
              className="hidden lg:block px-2 py-1 rounded-lg bg-[#0b2318] border border-[#d4af37]/40 text-[#f5d77f] text-[11px] font-bold focus:outline-none cursor-pointer"
            >
              {(Object.keys(COUNSELOR_RANKS) as CounselorRankKey[]).map((rKey) => (
                <option key={rKey} value={rKey} className="bg-[#071710] text-white">
                  {COUNSELOR_RANKS[rKey].shortTitle} ({COUNSELOR_RANKS[rKey].category})
                </option>
              ))}
            </select>

            {/* مؤشر المزامنة السحابية */}
            <button
              onClick={onTriggerCloudSync}
              className={`px-2 py-1 text-[11px] font-bold rounded-lg border flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap ${
                isOnline
                  ? 'bg-[#09291b] text-emerald-300 border-emerald-500/40 hover:bg-[#0e3b27]'
                  : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
              }`}
              title={
                lastSyncedAt
                  ? `آخر مزامنة سحابية مشفرة: ${lastSyncedAt}`
                  : 'حفظ فوري على الجهاز مع مزامنة سحابية مشفرة'
              }
            >
              {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              <span className="hidden xl:inline">{isOnline ? 'متصل' : 'Offline'}</span>
            </button>

            {/* زر الدخول المهني المحمي */}
            <button
              onClick={onOpenProtectedAuth}
              className="px-2.5 py-1 text-[11px] font-bold bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] hover:brightness-110 rounded-lg flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap"
              title="دخول مهني محمي: قراءة شهادة العمل بالمسح الذكي"
            >
              <Lock className="w-3 h-3" />
              <span className="hidden sm:inline">شهادة العمل</span>
            </button>

            {/* إعدادات المكتب */}
            <button
              onClick={onOpenSettings}
              className="px-2 py-1 text-[11px] font-bold bg-[#0c2a1c] text-[#e5c158] hover:text-white border border-[#d4af37]/40 rounded-lg flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap"
              title="تعديل بيانات المؤسسة ومكتب التوجيه"
            >
              <SlidersVertical className="w-3 h-3" />
              <span className="hidden md:inline">المكتب</span>
            </button>

            {/* جرس الإنذار المبكر */}
            <button
              onClick={() => onSelectSection('dashboard')}
              className="relative p-1.5 bg-[#8f1414]/85 hover:bg-[#a61b1b] text-white border border-[#f5d77f]/40 rounded-lg transition-all cursor-pointer"
              title={`${urgentAlertsCount} حالات في رادار الإنذار المبكر`}
            >
              <Bell className="w-3.5 h-3.5" />
              {urgentAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#d4af37] text-[#0d2818] font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-[#091512] tabular-nums">
                  {urgentAlertsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* السطر الثاني المدمج: شريط التنقل بين أركان المنصة الـ 9 */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1 border-t border-[#d4af37]/15 scrollbar-none text-[11px] sm:text-xs font-semibold">
          {navItems.map((item) => {
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectSection(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#105e32] via-[#0d4a27] to-[#0a351c] text-[#f5d77f] font-bold border border-[#d4af37]/60 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-[#0c281b]/70 border border-transparent'
                }`}
              >
                <span className={isActive ? 'text-[#f5d77f]' : 'text-slate-400'}>{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1 py-0.2 rounded font-bold tabular-nums ${
                      item.id === 'dashboard' && urgentAlertsCount > 0
                        ? 'bg-[#8f1414] text-white'
                        : isActive
                        ? 'bg-[#d4af37]/20 text-[#f5d77f]'
                        : 'bg-slate-800/90 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
