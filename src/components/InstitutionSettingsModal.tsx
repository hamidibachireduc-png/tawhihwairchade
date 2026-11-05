import React, { useState, useEffect } from 'react';
import { X, Save, School, Layers, Award, Image as ImageIcon } from 'lucide-react';
import { CounselorRankKey, EducationStage, InstitutionInfo } from '../types';
import { COUNSELOR_RANKS, DEFAULT_EMBLEM_URL, STAGE_METADATA } from '../data/initialData';

interface InstitutionSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  institution: InstitutionInfo;
  onSave: (updated: InstitutionInfo) => void;
  onSwitchStage: (stage: EducationStage) => void;
}

export const InstitutionSettingsModal: React.FC<InstitutionSettingsModalProps> = ({
  isOpen,
  onClose,
  institution,
  onSave,
  onSwitchStage,
}) => {
  const [formData, setFormData] = useState<InstitutionInfo>(institution);

  useEffect(() => {
    setFormData(institution);
  }, [institution, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto no-print">
      <div className="bg-gradient-to-b from-[#0b2519] to-[#06150e] border-2 border-[#d4af37] rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-8">
        <div className="px-6 py-4 bg-[#071a11] border-b border-[#d4af37]/30 flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#f5d77f] flex items-center gap-2">
              <School className="w-5 h-5 text-[#d4af37]" />
              <span>إعدادات المؤسسة ومكتب مستشار التوجيه والإرشاد</span>
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              تظهر هذه البيانات تلقائياً في ترويسة محاضر التوجيه الرسمية، استدعاءات الأولياء، وسجل المقابلات A4
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          {/* اختيار الطور التعليمي */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>الطور التعليمي النشط (يخصص معادلات توجيه 4م أو 1ث تلقائياً):</span>
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {(['middle', 'secondary'] as EducationStage[]).map((st) => {
                const meta = STAGE_METADATA[st];
                const isSelected = formData.stage === st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, stage: st }));
                      onSwitchStage(st);
                    }}
                    className={`py-2.5 px-3 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] border-[#d4af37] font-black shadow'
                        : 'bg-[#05140d] text-slate-300 border-[#d4af37]/30 hover:text-white'
                    }`}
                  >
                    {meta.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* اختيار الرتبة من رتب التوجيه الأربع */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>الرتبة الرسمية في سلك التوجيه والإرشاد المدرسي والمهني (المرسوم 25-54):</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(Object.keys(COUNSELOR_RANKS) as CounselorRankKey[]).map((rk) => {
                const rMeta = COUNSELOR_RANKS[rk];
                const isSelected = formData.rankKey === rk;
                return (
                  <button
                    key={rk}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, rankKey: rk }))}
                    className={`p-2.5 rounded-xl text-right border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#105e32] text-[#f5d77f] border-[#d4af37] font-bold'
                        : 'bg-[#05140d] text-slate-300 border-[#d4af37]/25 hover:border-[#d4af37]/60'
                    }`}
                  >
                    <div className="text-xs font-black">{rMeta.title}</div>
                    <div className="text-[10px] text-emerald-300 mt-0.5 tabular-nums">
                      {rMeta.category} · الرقم الاستدلالي القاعدي: {rMeta.baseIndex}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">مديرية التربية (الولاية):</label>
              <input
                type="text"
                value={formData.wilaya}
                onChange={(e) => setFormData({ ...formData, wilaya: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#05140d] border border-[#d4af37]/40 text-white focus:outline-none focus:border-[#f5d77f]"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">مركز التوجيه المدرسي والمهني:</label>
              <input
                type="text"
                value={formData.districtCenter}
                onChange={(e) => setFormData({ ...formData, districtCenter: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#05140d] border border-[#d4af37]/40 text-white focus:outline-none focus:border-[#f5d77f]"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">اسم الثانوية / المتوسطة (أو المقاطعة):</label>
              <input
                type="text"
                value={formData.schoolName}
                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#05140d] border border-[#d4af37]/40 text-white focus:outline-none focus:border-[#f5d77f]"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">اسم ولقب مستشار التوجيه:</label>
              <input
                type="text"
                value={formData.counselorName}
                onChange={(e) => setFormData({ ...formData, counselorName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#05140d] border border-[#d4af37]/40 text-white focus:outline-none focus:border-[#f5d77f]"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">اسم مدير المؤسسة:</label>
              <input
                type="text"
                value={formData.principalName}
                onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#05140d] border border-[#d4af37]/40 text-white focus:outline-none focus:border-[#f5d77f]"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">السنة الدراسية:</label>
                <input
                  type="text"
                  value={formData.schoolYear}
                  onChange={(e) => setFormData({ ...formData, schoolYear: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#05140d] border border-[#d4af37]/40 text-white focus:outline-none focus:border-[#f5d77f]"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">الفصل الدراسي:</label>
                <select
                  value={formData.currentTerm}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currentTerm: e.target.value as 'الأول' | 'الثاني' | 'الثالث',
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#05140d] border border-[#d4af37]/40 text-white focus:outline-none focus:border-[#f5d77f]"
                >
                  <option value="الأول">الأول</option>
                  <option value="الثاني">الثاني</option>
                  <option value="الثالث">الثالث</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>رابط شعار الترويسة (أو اتركه افتراضياً لشعار SNTE):</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={formData.emblemUrl || ''}
                onChange={(e) => setFormData({ ...formData, emblemUrl: e.target.value })}
                placeholder={DEFAULT_EMBLEM_URL}
                className="flex-1 px-3 py-2 rounded-xl bg-[#05140d] border border-[#d4af37]/40 text-white focus:outline-none focus:border-[#f5d77f]"
              />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, emblemUrl: DEFAULT_EMBLEM_URL })}
                className="px-3 py-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white text-xs font-bold cursor-pointer"
              >
                الشعار الافتراضي
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-[#d4af37]/20 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b58922] text-[#071710] font-black flex items-center gap-2 shadow-lg hover:brightness-110 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>حفظ وتعميم على كافة المحاضر</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
