import React, { useState } from 'react';
import { 
  Building2, 
  Smartphone, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Grid,
  FileSpreadsheet,
  Download
} from 'lucide-react';
import { motion } from 'motion/react';
import SystemFeatureCatalogModal from './common/SystemFeatureCatalogModal';

interface LandingPageProps {
  onSelectSubsystem: (subsystem: 'PORTAL' | 'ADMIN' | 'INSPECTION' | 'EXHIBITION', initialTab?: '3D_TUNNEL' | 'POSTER_GALLERY') => void;
}

export default function LandingPage({ onSelectSubsystem }: LandingPageProps) {
  const [showFeatureCatalog, setShowFeatureCatalog] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-center items-center py-12 px-6">
      <div className="w-full max-w-7xl">
        {/* Header Intro Title */}
        <section className="text-center space-y-3 mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            厦门大学海报涂鸦管理系统 · 请选择进入的子系统
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            系统包含后台管理、移动巡检及线上 3D 展示三个协同子系统
          </p>

          {/* Quick Action: Feature Catalog Table & Download Button */}
          <div className="pt-2 flex items-center justify-center">
            <button
              onClick={() => setShowFeatureCatalog(true)}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-950 border border-slate-300 hover:border-emerald-300 font-black text-xs shadow-xs hover:shadow-md transition-all cursor-pointer group active:scale-95"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileSpreadsheet size={15} />
              </div>
              <span className="tracking-wide">系统功能清单 (表格查阅与下载)</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200">
                49 项全景功能
              </span>
              <Download size={14} className="text-slate-400 group-hover:text-emerald-600 transition-colors" />
            </button>
          </div>
        </section>

        {/* 3 Subsystem Cards Grid */}
        <section className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Subsystem 1: Backoffice Admin */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-white border border-slate-200 rounded-3xl p-7 flex flex-col justify-between hover:border-blue-500 transition-all shadow-sm hover:shadow-xl relative group overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600"></div>
              
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    <Building2 size={24} />
                  </div>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                    子系统一
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    后台管理系统
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    面向团委、学生会审批员、辅导员、OA秘书及部门领导的核心管控中台
                  </p>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-blue-600 flex-shrink-0" />
                    <span>公共设置：组织角色、巡检包干网格</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-blue-600 flex-shrink-0" />
                    <span>海报管理：选座锁定、四级审批工作台</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-blue-600 flex-shrink-0" />
                    <span>芙蓉隧道：5cm列编号、三级审批与流控</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-blue-600 flex-shrink-0" />
                    <span>防伪绑定：不干胶码与 PVC 永固二维码</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => onSelectSubsystem('ADMIN')}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 group-hover:gap-3"
                >
                  <span>进入后台管理系统</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>

            {/* Subsystem 2: Mobile Inspection */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-white border border-slate-200 rounded-3xl p-7 flex flex-col justify-between hover:border-emerald-500 transition-all shadow-sm hover:shadow-xl relative group overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-600"></div>

              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                    <Smartphone size={24} />
                  </div>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                    子系统二
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    巡检系统 (移动端)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    为学生会巡检员量身定制的移动打卡、扫码查验与违规上报客户端
                  </p>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                    <span>扫码查验：秒级验真海报印章/PVC铭牌</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                    <span>巡检任务：张贴栏与隧道区域打卡存证</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                    <span>违规上报：现场拍照取证并推送整改工单</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                    <span>预警监控：超时未巡自动触发提醒</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => onSelectSubsystem('INSPECTION')}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 group-hover:gap-3"
                >
                  <span>进入巡检系统 (移动端)</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>

            {/* Subsystem 3: Public Exhibition */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-white border border-slate-200 rounded-3xl p-7 flex flex-col justify-between hover:border-sky-500 transition-all shadow-sm hover:shadow-xl relative group overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-sky-600"></div>

              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center font-bold">
                    <Sparkles size={24} />
                  </div>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 uppercase tracking-wider">
                    子系统三
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                    线上展示系统 (公众端)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    面向公众与广大师生的 3D 芙蓉隧道沉浸涂鸦与实时线上海报展栏
                  </p>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-sky-600 flex-shrink-0" />
                    <span>3D 沉浸体验：Three.js 驱动芙蓉隧道漫游</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-sky-600 flex-shrink-0" />
                    <span>线上海报展栏：云映射双校区张贴位</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-sky-600 flex-shrink-0" />
                    <span>文化打卡地图：精细标记宣发展位与景点</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-sky-600 flex-shrink-0" />
                    <span>互动赞赏：涂鸦作品在线点赞与主题筛选</span>
                  </div>
                </div>
              </div>

              <div className="pt-8 grid grid-cols-2 gap-3">
                <button
                  onClick={() => onSelectSubsystem('EXHIBITION', 'POSTER_GALLERY')}
                  className="py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-2xl transition-all shadow-md shadow-sky-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Grid size={15} />
                  <span>海报栏</span>
                </button>
                <button
                  onClick={() => onSelectSubsystem('EXHIBITION', '3D_TUNNEL')}
                  className="py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl transition-all shadow-md shadow-indigo-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles size={15} />
                  <span>芙蓉隧道</span>
                </button>
              </div>
            </motion.div>

          </div>
        </section>
      </div>

      {/* System Feature Catalog Modal */}
      <SystemFeatureCatalogModal 
        isOpen={showFeatureCatalog} 
        onClose={() => setShowFeatureCatalog(false)} 
      />
    </div>
  );
}

