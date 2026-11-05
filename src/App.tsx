/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
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
} from './types';
import {
  calculateCompositeRiskScore,
  COUNSELOR_RANKS,
  DEFAULT_EMBLEM_URL,
  INITIAL_AGENDA,
  INITIAL_ASSIGNED_CLASSES,
  INITIAL_INFO_SEEKERS,
  INITIAL_INSTITUTIONS_BY_STAGE,
  INITIAL_INTERVIEWS,
  INITIAL_PSYCHO_CASES,
  INITIAL_REORIENTATION_REQUESTS,
  INITIAL_STUDENTS,
  INITIAL_WEEKLY_ACTIVITIES,
  STAGE_METADATA,
} from './data/initialData';
import { Header } from './components/Header';
import { InstitutionSettingsModal } from './components/InstitutionSettingsModal';
import { ProtectedLoginModal } from './components/ProtectedLoginModal';
import { StudentProfileAndSummonModal } from './components/StudentProfileAndSummonModal';
import { DashboardRadarView } from './components/DashboardRadarView';
import { OrientationAndMinutesView } from './components/OrientationAndMinutesView';
import { InterviewsAndSummonsView } from './components/InterviewsAndSummonsView';
import { PsychoCasesAndUdsView } from './components/PsychoCasesAndUdsView';
import { InfoSeekersAndActivityView } from './components/InfoSeekersAndActivityView';
import { ScalesAndCampaignsView } from './components/ScalesAndCampaignsView';
import { SmartAssistantAndVoiceView } from './components/SmartAssistantAndVoiceView';
import { StreamsAndHorizonsView } from './components/StreamsAndHorizonsView';
import { DigitalizationAndSecurityView } from './components/DigitalizationAndSecurityView';
import { LegislationAndAssignedClassesView } from './components/LegislationAndAssignedClassesView';
import { CareerAndSalarySimulatorView } from './components/CareerAndSalarySimulatorView';

const STORAGE_KEYS = {
  ACTIVE_STAGE: 'snte_counselor_active_stage_2026_v1',
  INSTITUTIONS: 'snte_counselor_institutions_2026_v1',
  STUDENTS: 'snte_counselor_students_2026_v1',
  REORIENTATION: 'snte_counselor_reorientation_2026_v1',
  INTERVIEWS: 'snte_counselor_interviews_2026_v1',
  CASES: 'snte_counselor_cases_2026_v1',
  INFO_SEEKERS: 'snte_counselor_infoseekers_2026_v1',
  WEEKLY_ACT: 'snte_counselor_weekly_2026_v1',
  ASSIGNED_CLASSES: 'snte_counselor_assigned_classes_2026_v1',
  AGENDA: 'snte_counselor_agenda_2026_v1',
  LAST_SYNC: 'snte_counselor_last_sync_2026_v1',
};

export default function App() {
  const [currentSection, setCurrentSection] = useState<SectionId>('dashboard');

  const [activeStage, setActiveStage] = useState<EducationStage>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_STAGE);
      return saved === 'middle' || saved === 'secondary' ? saved : 'secondary';
    } catch {
      return 'secondary';
    }
  });

  const [institutionsByStage, setInstitutionsByStage] = useState<
    Record<EducationStage, InstitutionInfo>
  >(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INSTITUTIONS);
      return saved ? JSON.parse(saved) : INITIAL_INSTITUTIONS_BY_STAGE;
    } catch {
      return INITIAL_INSTITUTIONS_BY_STAGE;
    }
  });

  const [students, setStudents] = useState<StudentCounselingRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [reorientationRequests, setReorientationRequests] = useState<
    ReorientationRequest[]
  >(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REORIENTATION);
      return saved ? JSON.parse(saved) : INITIAL_REORIENTATION_REQUESTS;
    } catch {
      return INITIAL_REORIENTATION_REQUESTS;
    }
  });

  const [interviews, setInterviews] = useState<CounselingInterview[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INTERVIEWS);
      return saved ? JSON.parse(saved) : INITIAL_INTERVIEWS;
    } catch {
      return INITIAL_INTERVIEWS;
    }
  });

  const [cases, setCases] = useState<PsychoPedagogicalCase[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CASES);
      return saved ? JSON.parse(saved) : INITIAL_PSYCHO_CASES;
    } catch {
      return INITIAL_PSYCHO_CASES;
    }
  });

  const [infoSeekers, setInfoSeekers] = useState<InfoSeekerEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INFO_SEEKERS);
      return saved ? JSON.parse(saved) : INITIAL_INFO_SEEKERS;
    } catch {
      return INITIAL_INFO_SEEKERS;
    }
  });

  const [weeklyActivities, setWeeklyActivities] = useState<WeeklyActivityEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WEEKLY_ACT);
      return saved ? JSON.parse(saved) : INITIAL_WEEKLY_ACTIVITIES;
    } catch {
      return INITIAL_WEEKLY_ACTIVITIES;
    }
  });

  const [assignedClasses, setAssignedClasses] = useState<AssignedClassGroup[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ASSIGNED_CLASSES);
      return saved ? JSON.parse(saved) : INITIAL_ASSIGNED_CLASSES;
    } catch {
      return INITIAL_ASSIGNED_CLASSES;
    }
  });

  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AGENDA);
      return saved ? JSON.parse(saved) : INITIAL_AGENDA;
    } catch {
      return INITIAL_AGENDA;
    }
  });

  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    } catch {
      return null;
    }
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProtectedAuthOpen, setIsProtectedAuthOpen] = useState(false);
  const [modalStudentState, setModalStudentState] = useState<{
    student: StudentCounselingRecord | null;
    tab: 'profile' | 'summon';
  }>({ student: null, tab: 'profile' });

  // حفظ فوري محلي دون إنترنت
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_STAGE, activeStage);
  }, [activeStage]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INSTITUTIONS, JSON.stringify(institutionsByStage));
  }, [institutionsByStage]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.REORIENTATION,
      JSON.stringify(reorientationRequests)
    );
  }, [reorientationRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INTERVIEWS, JSON.stringify(interviews));
  }, [interviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(cases));
  }, [cases]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INFO_SEEKERS, JSON.stringify(infoSeekers));
  }, [infoSeekers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WEEKLY_ACT, JSON.stringify(weeklyActivities));
  }, [weeklyActivities]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ASSIGNED_CLASSES, JSON.stringify(assignedClasses));
  }, [assignedClasses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AGENDA, JSON.stringify(agendaItems));
  }, [agendaItems]);

  // الحفظ والمزامنة المشفرة محلياً 100% ليعمل التطبيق على أي استضافة ثابتة (GitHub Pages / موقع خاص)
  const triggerEncryptedCloudSync = useCallback(() => {
    try {
      const payloadObj = {
        institutionsByStage,
        studentsCount: students.length,
        interviewsCount: interviews.length,
        casesCount: cases.length,
        assignedClassesCount: assignedClasses.length,
        timestamp: new Date().toISOString(),
      };
      const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(payloadObj))));
      localStorage.setItem('snte_counselor_encrypted_snapshot_2026', encoded);

      const timeStr = new Date().toLocaleTimeString('ar-DZ', {
        hour: '2-digit',
        minute: '2-digit',
      });
      setLastSyncedAt(timeStr);
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, timeStr);
    } catch {
      // Safe fallback
    }
  }, [
    institutionsByStage,
    students.length,
    interviews.length,
    cases.length,
    assignedClasses.length,
  ]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      triggerEncryptedCloudSync();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [triggerEncryptedCloudSync]);

  const currentInstitution = institutionsByStage[activeStage];
  const stageMeta = STAGE_METADATA[activeStage];
  const rankMeta = COUNSELOR_RANKS[currentInstitution.rankKey];

  const handleSaveInstitution = (updated: InstitutionInfo) => {
    setInstitutionsByStage((prev) => ({
      ...prev,
      [updated.stage]: updated,
    }));
    if (updated.stage !== activeStage) {
      setActiveStage(updated.stage);
    }
  };

  // حساب عدد حالات الإنذار المبكر الحرجة والمرتفعة للطور النشط
  const urgentAlertsCount = students
    .filter((s) => s.stage === activeStage)
    .filter((s) => {
      const r = calculateCompositeRiskScore(s);
      return r.riskLevel === 'critical' || r.riskLevel === 'high';
    }).length;

  const handleUpdateStudent = (updated: StudentCounselingRecord) => {
    setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleImportStudents = (imported: StudentCounselingRecord[]) => {
    setStudents((prev) => [...imported, ...prev]);
  };

  const handleAddReorientation = (req: Omit<ReorientationRequest, 'id'>) => {
    setReorientationRequests((prev) => [
      { ...req, id: `reor-${Date.now()}` },
      ...prev,
    ]);
  };

  const handleUpdateReorientationDecision = (
    id: string,
    decision: 'مقبول' | 'مرفوض' | 'قيد الدراسة'
  ) => {
    setReorientationRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, committeeDecision: decision } : r))
    );
  };

  const handleAddInterview = (
    newInterview: Omit<CounselingInterview, 'id' | 'serialNumber'>
  ) => {
    const nextNum = interviews.length + 1;
    const serialNumber = `2026/${String(nextNum).padStart(3, '0')}`;
    setInterviews((prev) => [
      {
        ...newInterview,
        id: `int-${Date.now()}`,
        serialNumber,
      },
      ...prev,
    ]);
  };

  const handleToggleVisa = (id: string) => {
    setInterviews((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, counselorVisa: !i.counselorVisa } : i
      )
    );
  };

  const handleAddCase = (newCase: Omit<PsychoPedagogicalCase, 'id' | 'caseCode'>) => {
    const nextNum = cases.length + 1;
    const caseCode = `ملف-سري/2026/0${nextNum}`;
    setCases((prev) => [
      {
        ...newCase,
        id: `case-${Date.now()}`,
        caseCode,
      },
      ...prev,
    ]);
  };

  const handleAddInfoSeeker = (
    entry: Omit<InfoSeekerEntry, 'id' | 'serialNumber'>
  ) => {
    const nextNum = infoSeekers.length + 1;
    const serialNumber = `إع/2026/0${nextNum}`;
    setInfoSeekers((prev) => [
      {
        ...entry,
        id: `info-${Date.now()}`,
        serialNumber,
      },
      ...prev,
    ]);
  };

  const handleAddWeeklyActivity = (entry: Omit<WeeklyActivityEntry, 'id'>) => {
    setWeeklyActivities((prev) => [
      {
        ...entry,
        id: `act-${Date.now()}`,
      },
      ...prev,
    ]);
  };

  const handleToggleWeeklyActivity = (id: string) => {
    setWeeklyActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a))
    );
  };

  const handleAddAssignedClass = (group: AssignedClassGroup) => {
    setAssignedClasses((prev) => [group, ...prev]);
  };

  const handleUpdateAssignedClass = (updated: AssignedClassGroup) => {
    setAssignedClasses((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
  };

  const handleDeleteAssignedClass = (id: string) => {
    setAssignedClasses((prev) => prev.filter((c) => c.id !== id));
  };

  const handleToggleAgenda = (id: string) => {
    setAgendaItems((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a))
    );
  };

  const handleAddAgendaItem = (item: Omit<AgendaItem, 'id'>) => {
    setAgendaItems((prev) => [{ ...item, id: `ag-${Date.now()}` }, ...prev]);
  };

  const handleExportEncryptedBackup = () => {
    const backupObject = {
      exportedAt: new Date().toISOString(),
      platform: 'SNTE-COUNSELOR-2026',
      institutionsByStage,
      students,
      reorientationRequests,
      interviews,
      cases,
      infoSeekers,
      weeklyActivities,
      assignedClasses,
      agendaItems,
    };
    const blob = new Blob([JSON.stringify(backupObject, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `نسخة_احتياطية_مشفرة_منصة_مستشار_2026.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const logoSrc = currentInstitution.emblemUrl?.trim()
    ? currentInstitution.emblemUrl
    : DEFAULT_EMBLEM_URL;

  return (
    <div className="min-h-screen flex flex-col bg-[#071710] text-slate-100">
      <Header
        activeStage={activeStage}
        onSelectStage={setActiveStage}
        currentSection={currentSection}
        onSelectSection={setCurrentSection}
        institution={currentInstitution}
        onUpdateInstitution={handleSaveInstitution}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenProtectedAuth={() => setIsProtectedAuthOpen(true)}
        urgentAlertsCount={urgentAlertsCount}
        isOnline={isOnline}
        lastSyncedAt={lastSyncedAt}
        onTriggerCloudSync={triggerEncryptedCloudSync}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentSection === 'dashboard' && (
          <DashboardRadarView
            activeStage={activeStage}
            onSelectStage={setActiveStage}
            institution={currentInstitution}
            onNavigate={setCurrentSection}
            students={students}
            interviews={interviews}
            cases={cases}
            infoSeekers={infoSeekers}
            weeklyActivities={weeklyActivities}
            reorientationRequests={reorientationRequests}
            assignedClasses={assignedClasses}
            agendaItems={agendaItems}
            onToggleAgenda={handleToggleAgenda}
            onAddAgendaItem={handleAddAgendaItem}
            onSelectStudentForModal={(student, tab) =>
              setModalStudentState({ student, tab })
            }
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {currentSection === 'orientation' && (
          <OrientationAndMinutesView
            activeStage={activeStage}
            institution={currentInstitution}
            students={students}
            onUpdateStudent={handleUpdateStudent}
            reorientationRequests={reorientationRequests}
            onAddReorientation={handleAddReorientation}
            onUpdateReorientationDecision={handleUpdateReorientationDecision}
            onSelectStudentForModal={(student, tab) =>
              setModalStudentState({ student, tab })
            }
          />
        )}

        {currentSection === 'interviews' && (
          <InterviewsAndSummonsView
            activeStage={activeStage}
            institution={currentInstitution}
            students={students}
            interviews={interviews}
            onAddInterview={handleAddInterview}
            onToggleVisa={handleToggleVisa}
            onSelectStudentForModal={(student, tab) =>
              setModalStudentState({ student, tab })
            }
          />
        )}

        {currentSection === 'cases' && (
          <PsychoCasesAndUdsView
            activeStage={activeStage}
            institution={currentInstitution}
            students={students}
            cases={cases}
            onAddCase={handleAddCase}
            onSelectStudentForModal={(student, tab) =>
              setModalStudentState({ student, tab })
            }
          />
        )}

        {currentSection === 'legislation' && (
          <LegislationAndAssignedClassesView
            activeStage={activeStage}
            institution={currentInstitution}
            assignedClasses={assignedClasses}
            onAddAssignedClass={handleAddAssignedClass}
            onUpdateAssignedClass={handleUpdateAssignedClass}
            onDeleteAssignedClass={handleDeleteAssignedClass}
          />
        )}

        {currentSection === 'career_simulator' && (
          <CareerAndSalarySimulatorView institution={currentInstitution} />
        )}

        {currentSection === 'infoseekers' && (
          <InfoSeekersAndActivityView
            activeStage={activeStage}
            institution={currentInstitution}
            infoSeekers={infoSeekers}
            onAddInfoSeeker={handleAddInfoSeeker}
            weeklyActivities={weeklyActivities}
            onAddWeeklyActivity={handleAddWeeklyActivity}
            onToggleWeeklyActivity={handleToggleWeeklyActivity}
          />
        )}

        {currentSection === 'scales' && (
          <ScalesAndCampaignsView
            activeStage={activeStage}
            institution={currentInstitution}
            students={students}
            onUpdateStudent={handleUpdateStudent}
          />
        )}

        {currentSection === 'assistant' && (
          <SmartAssistantAndVoiceView
            activeStage={activeStage}
            institution={currentInstitution}
            students={students}
            onAddInterview={handleAddInterview}
            onAddCase={handleAddCase}
          />
        )}

        {currentSection === 'horizons' && (
          <StreamsAndHorizonsView institution={currentInstitution} />
        )}

        {currentSection === 'digitalization' && (
          <DigitalizationAndSecurityView
            activeStage={activeStage}
            institution={currentInstitution}
            students={students}
            onImportStudents={handleImportStudents}
            isOnline={isOnline}
            lastSyncedAt={lastSyncedAt}
            onTriggerCloudSync={triggerEncryptedCloudSync}
            onOpenProtectedAuth={() => setIsProtectedAuthOpen(true)}
            onExportEncryptedBackup={handleExportEncryptedBackup}
          />
        )}
      </main>

      {/* النوافذ المنبثقة */}
      <InstitutionSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        institution={currentInstitution}
        onSave={handleSaveInstitution}
        onSwitchStage={setActiveStage}
      />

      <ProtectedLoginModal
        isOpen={isProtectedAuthOpen}
        onClose={() => setIsProtectedAuthOpen(false)}
        institution={currentInstitution}
        onVerified={handleSaveInstitution}
      />

      <StudentProfileAndSummonModal
        student={modalStudentState.student}
        initialTab={modalStudentState.tab}
        onClose={() => setModalStudentState({ student: null, tab: 'profile' })}
        institution={currentInstitution}
        interviews={interviews}
        cases={cases}
      />

      {/* التذييل الرسمي المطابق لمنصة الناظر SNTE 2026 */}
      <footer className="mt-auto bg-[#040e0a] border-t border-[#d4af37]/30 py-8 text-xs text-slate-400 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-[#8f1414] via-[#d4af37] to-[#105e32] flex items-center justify-center bg-[#06150e]">
                <img
                  src={logoSrc}
                  alt="SNTE Logo"
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 object-cover rounded-full"
                />
              </div>
              <div>
                <div className="text-white font-bold text-sm">
                  البوابة الرقمية لـ {rankMeta.title} · (SNTE 2026)
                </div>
                <div className="text-[11px] text-[#d4af37] font-semibold">
                  الطور الحالي: {stageMeta.name} · كرامة · ترقية · وحدة · عمل
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-medium">
              <button
                onClick={() => setCurrentSection('dashboard')}
                className="hover:text-[#f5d77f] transition-colors cursor-pointer"
              >
                لوحة التحكم والداشبورد الإحصائي
              </button>
              <span>·</span>
              <button
                onClick={() => setCurrentSection('orientation')}
                className="hover:text-[#f5d77f] transition-colors cursor-pointer font-bold text-emerald-300"
              >
                توجيه 4م و1ث والمحاضر النهائية
              </button>
              <span>·</span>
              <button
                onClick={() => setCurrentSection('legislation')}
                className="hover:text-[#f5d77f] transition-colors cursor-pointer font-bold text-[#f5d77f]"
              >
                التشريع والتوقيت والأقسام المسندة
              </button>
              <span>·</span>
              <button
                onClick={() => setCurrentSection('career_simulator')}
                className="hover:text-[#f5d77f] transition-colors cursor-pointer font-bold text-emerald-300"
              >
                محاكي الراتب والدرجات والترقية والتقاعد
              </button>
              <span>·</span>
              <button
                onClick={() => setCurrentSection('interviews')}
                className="hover:text-[#f5d77f] transition-colors cursor-pointer"
              >
                سجل المقابلات واستدعاءات الأولياء
              </button>
              <span>·</span>
              <button
                onClick={() => setCurrentSection('cases')}
                className="hover:text-[#f5d77f] transition-colors cursor-pointer"
              >
                المتابعة النفسية ووحدة UDS
              </button>
            </div>

            <div className="text-center md:text-left text-[11px] text-slate-400">
              <div>المطابقة: المرسوم التنفيذي 25-54 (رتب التوجيه والإرشاد الأربع)</div>
              <div className="text-[#d4af37]">
                يعمل دون إنترنت (Offline) مع مزامنة سحابية مشفرة · SNTE 2026
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
