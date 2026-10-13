import React from 'react';
import { 
  MOCK_POSTER_APPLICATIONS, 
  MOCK_WARNINGS, 
  MOCK_VIOLATION_EVENTS, 
  MOCK_POSTER_BOARDS 
} from '../../data/posterGraffitiMock';
import { 
  Building2, 
  Palette, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  QrCode, 
  Sparkles, 
  Users, 
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

interface AdminDashboardOverviewProps {
  onNavigateTab?: (tabId: string) => void;
}

export default function AdminDashboardOverview({ onNavigateTab }: AdminDashboardOverviewProps) {
  const pendingApps = MOCK_POSTER_APPLICATIONS.filter(a => a.status !== 'APPROVED' && a.status !== 'REJECTED');

  return (
    <div className="p-6 space-y-6">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-6 rounded-3xl shadow-xl shadow-blue-500/10 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-white">
              后台管理系统 V1.0
            </span>
            <span className="text-xs text-blue-100">厦门大学校团委联合数字化管理平台</span>
          </div>
          <h2 className="text-xl font-black tracking-tight">海报张贴与芙蓉隧道涂鸦数字化管理主控台</h2>
          <p className="text-xs text-blue-100 max-w-2xl leading-relaxed">
            实时覆盖思明校区与翔安校区公共宣传网格。实现申请选座、四级联动审批、不干胶/PVC二维码防伪颁发、移动巡检与3D全景数字化闭环。
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 flex-shrink-0">
          <button
            onClick={() => onNavigateTab?.('pos-review')}
            className="px-5 py-2.5 bg-white text-blue-600 font-black text-xs rounded-xl shadow-lg hover:bg-blue-50 transition-all flex items-center gap-1.5"
          >
            <Clock size={16} /> 快速审核待办 ({pendingApps.length})
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold">在用张贴栏与展位</span>
            <Building2 size={18} className="text-blue-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-gray-900">24 栏 / 144 列</span>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">82% 占用</span>
          </div>
          <p className="text-[11px] text-gray-400">涵盖思明与翔安两大校区主要网格</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold">芙蓉隧道 3D 涂鸦专区</span>
            <Palette size={18} className="text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-gray-900">840 处</span>
            <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded">100% 颁发PVC码</span>
          </div>
          <p className="text-[11px] text-gray-400">1.1 公里隧道，收录毕业季等四大主题</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold">今日巡检打卡完成率</span>
            <ShieldCheck size={18} className="text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-gray-900">96.8 %</span>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">正常在岗</span>
          </div>
          <p className="text-[11px] text-gray-400">学生巡检组 12 人在岗实地扫描核查</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold">待处理巡检预警与违规</span>
            <ShieldAlert size={18} className="text-rose-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-600">{MOCK_WARNINGS.length + MOCK_VIOLATION_EVENTS.length} 件</span>
            <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded">预警中</span>
          </div>
          <p className="text-[11px] text-gray-400">其中包含 1 件超时未打卡与 2 件现场异常</p>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Quick Pending Approvals */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                <Clock size={16} className="text-blue-600" /> 四级审批待办工单队列 ({pendingApps.length})
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">需要辅导员、部门领导、学生会及团委依序审定</p>
            </div>
            <button
              onClick={() => onNavigateTab?.('pos-mgmt')}
              className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"
            >
              进入审批工作台 <ChevronRight size={14} />
            </button>
          </div>

          <div className="space-y-3">
            {pendingApps.map(app => (
              <div key={app.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/40 hover:bg-blue-50/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-bold text-[10px]">
                      {app.currentStep}
                    </span>
                    <h4 className="text-xs font-black text-gray-900">{app.title}</h4>
                  </div>
                  <p className="text-xs text-gray-500">
                    申办单位：<strong className="text-gray-800">{app.orgName}</strong> ({app.applicantName}) · 锁第 {app.selectedColumns[0]?.colIndices.join(', ')} 列
                  </p>
                  <p className="text-[11px] text-gray-400">拟张贴时间：{app.startDate} ~ {app.endDate} ({app.daysCount}天)</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => onNavigateTab?.('pos-mgmt')}
                    className="px-3.5 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-sm"
                  >
                    前往处理
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Violation Alerts & Realtime Feed */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
              <ShieldAlert size={16} className="text-rose-500" /> 现场违规预警流水
            </h3>
            <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
              闭环跟踪中
            </span>
          </div>

          <div className="space-y-3">
            {MOCK_VIOLATION_EVENTS.map(vio => (
              <div key={vio.id} className="p-3.5 rounded-2xl border border-rose-100 bg-rose-50/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900 truncate max-w-[180px]">{vio.title}</span>
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-md">
                    {vio.type}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500">{vio.location} · {vio.reportedBy}</p>
                <div className="pt-1 flex items-center justify-between text-[10px]">
                  <span className="text-gray-400">{vio.reportTime}</span>
                  <button
                    onClick={() => onNavigateTab?.('pub-settings')}
                    className="text-rose-600 font-bold hover:underline"
                  >
                    下发整改通知 ➔
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
