import React, { useState } from 'react';
import {
  GraduationCap,
  Compass,
  Printer,
  Search,
  Sparkles,
  BookOpen,
  Briefcase,
} from 'lucide-react';
import { InstitutionInfo } from '../types';
import { UNIVERSITY_HORIZONS_DATA } from '../data/initialData';

interface StreamsAndHorizonsViewProps {
  institution: InstitutionInfo;
}

const SECONDARY_STREAMS_MATRIX = [
  {
    stream: 'شعبة الرياضيات',
    origin: 'جذع مشترك علوم وتكنولوجيا',
    keySubjects: 'الرياضيات (معامل 7) · الفيزياء (معامل 6) · العلوم الطبيعية (معامل 2)',
    profile: 'تفوق في التجريد الرياضي، البرهان المنطقي، والنمذجة الفيزيائية.',
    topHorizons: 'الذكاء الاصطناعي (ENSIA)، الإعلام الآلي (ESI)، الرياضيات (NHSM)، الهندسة، الطب.',
  },
  {
    stream: 'شعبة العلوم التجريبية',
    origin: 'جذع مشترك علوم وتكنولوجيا',
    keySubjects: 'العلوم الطبيعية (معامل 6) · الفيزياء (معامل 5) · الرياضيات (معامل 5)',
    profile: 'ميل للملاحظة العلمية، التجريب المخبري، والعلوم البيولوجية والطبية.',
    topHorizons: 'الطب، الصيدلة، طب الأسنان، البيولوجيا، المدارس العليا للأساتذة، الهندسة.',
  },
  {
    stream: 'شعبة تقني رياضي (الهندسات الأربع)',
    origin: 'جذع مشترك علوم وتكنولوجيا',
    keySubjects: 'التكنولوجيا (معامل 7) · الرياضيات (معامل 6) · الفيزياء (معامل 6)',
    profile: 'ميل تطبيقي تقني في الهندسة المدنية، الميكانيكية، الكهربائية، أو هندسة الطرائق.',
    topHorizons: 'المدارس الوطنية المتعددة التقنيات (Polytechnique)، الهندسة المعمارية، الطيران، البتروكيمياء.',
  },
  {
    stream: 'شعبة التسيير والاقتصاد',
    origin: 'جذع مشترك علوم وتكنولوجيا',
    keySubjects: 'التسيير المحاسبي والمالي (معامل 6) · الاقتصاد والمناجمنت (معامل 5) · الرياضيات (معامل 5)',
    profile: 'دقة تنظيمية، التعامل مع الأرقام، التحليل الاقتصادي والقانوني.',
    topHorizons: 'مدارس الدراسات التجارية العليا (HEC/ESC)، الإحصاء والاقتصاد التطبيقي، المالية والبنوك.',
  },
  {
    stream: 'شعبة اللغات الأجنبية',
    origin: 'جذع مشترك آداب',
    keySubjects: 'اللغة العربية (5) · الفرنسية (5) · الإنجليزية (5) · اللغة الأجنبية الثالثة إسبانية/ألمانية/إيطالية (5)',
    profile: 'قدرة تواصلية، إتقان اللسانيات، والانفتاح الثقافي والترجمة.',
    topHorizons: 'معاهد الترجمة الفورية، المدارس العليا للأساتذة، العلاقات الدولية، السياحة والإعلام.',
  },
  {
    stream: 'شعبة الآداب والفلسفة',
    origin: 'جذع مشترك آداب',
    keySubjects: 'الأدب العربي (معامل 6) · الفلسفة (معامل 6) · التاريخ والجغرافيا (معامل 4)',
    profile: 'قدرة على التحليل النقدي، الحجاج الفلسفي، والتعبير الأدبي والإنساني.',
    topHorizons: 'المدرسة العليا للقضاء والحقوق، العلوم الإنسانية والاجتماعية، علم النفس وعلوم التربية، الإعلام.',
  },
];

export const StreamsAndHorizonsView: React.FC<StreamsAndHorizonsViewProps> = ({
  institution,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStreamFilter, setSelectedStreamFilter] = useState<string>('all');

  const filteredHorizons = UNIVERSITY_HORIZONS_DATA.filter((item) => {
    const matchesSearch =
      item.fieldAr.includes(searchTerm) ||
      item.specialties.some((sp) => sp.includes(searchTerm)) ||
      item.careerProspects.some((cr) => cr.includes(searchTerm));

    const matchesStream =
      selectedStreamFilter === 'all' ||
      item.eligibleBacStreams.some(
        (b) =>
          b.stream.includes(selectedStreamFilter) ||
          b.stream.includes('جميع الشعب')
      );

    return matchesSearch && matchesStream;
  });

  return (
    <div className="space-y-6">
      {/* شريط البحث والتصفية والطباعة */}
      <div className="bg-[#081c13] border border-[#d4af37]/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#d4af37] absolute right-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث عن تخصص جامعي، مدرسة عليا، أو مهنة مستقبلية..."
              className="w-full pr-9 pl-3 py-2 rounded-xl bg-[#05140d] border border-[#d4af37]/40 text-white text-xs focus:outline-none focus:border-[#f5d77f]"
            />
          </div>

          <select
            value={selectedStreamFilter}
            onChange={(e) => setSelectedStreamFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#05140d] border border-[#d4af37]/40 text-white text-xs font-bold"
          >
            <option value="all">كل شعب البكالوريا (الـ 6)</option>
            <option value="علوم تجريبية">علوم تجريبية</option>
            <option value="رياضيات">رياضيات</option>
            <option value="تقني رياضي">تقني رياضي</option>
            <option value="تسيير واقتصاد">تسيير واقتصاد</option>
            <option value="لغات أجنبية">لغات أجنبية</option>
            <option value="آداب وفلسفة">آداب وفلسفة</option>
          </select>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>طباعة دليل الشعب وآفاق البكالوريا A4</span>
        </button>
      </div>

      {/* القسم الأول: دليل الشعب الثانوية ومعاملات المواد المميزة */}
      <div className="bg-[#081c13] print:bg-white print:text-black border border-[#d4af37]/40 print:border-black rounded-2xl p-5 space-y-4 print-only-sheet">
        <div className="border-b border-[#d4af37]/20 print:border-black pb-3">
          <h3 className="text-base sm:text-lg font-black text-[#f5d77f] print:text-black flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#d4af37]" />
            <span>هندسة الشعب والمسارات في التعليم الثانوي ومعاملات المواد المميزة</span>
          </h3>
          <p className="text-xs text-slate-300 print:text-black mt-0.5">
            مرجع إعلامي رسمي لتلاميذ 4 متوسط و1 ثانوي و3 ثانوي — {institution.schoolName}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SECONDARY_STREAMS_MATRIX.map((item) => (
            <div
              key={item.stream}
              className="p-4 rounded-xl bg-[#05140d] print:bg-gray-50 border border-[#d4af37]/30 print:border-black space-y-2 text-xs"
            >
              <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-1.5">
                <span className="font-black text-sm text-[#f5d77f] print:text-black">
                  {item.stream}
                </span>
                <span className="text-[10px] text-emerald-300 print:text-black font-bold">
                  {item.origin}
                </span>
              </div>
              <div>
                <strong className="text-slate-300 print:text-black">المواد المميزة والمعاملات:</strong>
                <div className="text-white print:text-black font-semibold mt-0.5">
                  {item.keySubjects}
                </div>
              </div>
              <div>
                <strong className="text-slate-300 print:text-black">الملمح المطلوب:</strong>{' '}
                <span className="text-slate-300 print:text-black">{item.profile}</span>
              </div>
              <div className="pt-1 border-t border-[#d4af37]/15">
                <strong className="text-[#f5d77f] print:text-black">أبرز الآفاق الجامعية:</strong>{' '}
                <span className="text-emerald-200 print:text-black">{item.topHorizons}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* القسم الثاني: مصفوفة آفاق البكالوريا والتخصصات الجامعية المتوفرة */}
      <div className="space-y-4">
        <h3 className="text-base sm:text-lg font-black text-[#f5d77f] flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-[#d4af37]" />
          <span>مصفوفة التخصصات الجامعية والمدارس العليا المتوفرة لحاملي البكالوريا</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHorizons.map((horizon) => (
            <div
              key={horizon.id}
              className="p-5 rounded-2xl bg-[#081c13] border border-[#d4af37]/40 shadow-xl space-y-3 text-xs"
            >
              <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-2">
                <h4 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                  <span>{horizon.fieldAr}</span>
                </h4>
                <span className="font-mono font-bold text-[#f5d77f] bg-[#05140d] px-2.5 py-1 rounded-lg border border-[#d4af37]/30">
                  هولاند: {horizon.hollandMatch}
                </span>
              </div>

              <div>
                <div className="font-bold text-emerald-300 flex items-center gap-1.5 mb-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>الفروع والمدارس العليا المتوفرة:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {horizon.specialties.map((sp, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-[#05140d] border border-[#d4af37]/20 text-slate-200"
                    >
                      {sp}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="font-bold text-[#f5d77f]">
                  أولويات شعب البكالوريا والمعدلات الموزونة التقديرية:
                </div>
                {horizon.eligibleBacStreams.map((el, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-[#05140d] border border-[#d4af37]/20 flex flex-wrap items-center justify-between gap-2"
                  >
                    <div>
                      <span className="font-bold text-white">{el.stream}</span>{' '}
                      <span className="text-emerald-300 font-bold">({el.priority})</span>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {el.keySubjectCondition}
                      </div>
                    </div>
                    <span className="font-mono font-black text-[#f5d77f] tabular-nums">
                      {el.minWeightedAvgEstimate}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-[#d4af37]/15">
                <div className="font-bold text-slate-300 flex items-center gap-1.5 mb-1">
                  <Briefcase className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>المهن والوظائف المستقبلية:</span>
                </div>
                <p className="text-slate-200">{horizon.careerProspects.join(' · ')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
