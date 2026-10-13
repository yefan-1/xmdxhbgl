import React from 'react';
import { Eye, X } from 'lucide-react';

export interface PostingLocationItem {
  areaName: string;
  timeRange: string;
  campus?: string;
  boardName?: string;
  spot?: string;
  dates?: string[];
}

export interface PosterAppItem {
  id: string;
  title: string;
  posterImageUrl: string;
  submittedAt: string;
  orgName: string;
  applicantName: string;
  applicantType?: string;
  status: string;
  posterSize: string;
  postingLocations: PostingLocationItem[];
  contactPhone?: string;
  currentStep?: string;
  myApprovalResult?: '通过' | '不通过';
  myApprovalTime?: string;
}

interface PosterDetailModalProps {
  item: PosterAppItem | null;
  onClose: () => void;
}

const parsePostingLocationParts = (loc: PostingLocationItem) => {
  if (loc.campus && loc.boardName) {
    const spotStr = loc.spot ? ` ${loc.spot}` : '';
    return {
      campus: loc.campus,
      board: `${loc.boardName}${spotStr}`,
      dates: loc.dates && loc.dates.length > 0 ? loc.dates.join('、') : loc.timeRange
    };
  }

  const campuses = ['思明校区', '翔安校区', '樟宜校区', '漳州校区'];
  let foundCampus = '思明校区';
  let restBoard = loc.areaName;

  for (const c of campuses) {
    if (loc.areaName.startsWith(c)) {
      foundCampus = c;
      restBoard = loc.areaName.slice(c.length).trim();
      break;
    }
  }

  return {
    campus: foundCampus,
    board: restBoard || loc.areaName,
    dates: loc.dates && loc.dates.length > 0 ? loc.dates.join('、') : loc.timeRange
  };
};

const getApprovalTimeline = (app: PosterAppItem) => {
  const isWithdrawn = app.status === '已撤回';
  const isRejected = app.status === '审批不通过';
  const isApproved = app.status === '审批通过';

  const steps = [
    {
      key: 'submit',
      title: '提交海报张贴申请',
      approver: `${app.applicantName} (${app.orgName})`,
      time: app.submittedAt,
      status: 'completed',
      comment: '已提交申请及海报预览图稿，预订栏位等待辅导员审核。'
    },
    {
      key: 'counselor',
      title: '辅导员审批',
      approver: '辅导员 · 张明远老师',
      time: app.status !== '待辅导员审批' ? '2026-08-07 15:10' : '处理中',
      status: app.status === '待辅导员审批' ? 'active' : (['待单位负责人审批', '待学生会审批', '待团委审批', '审批通过'].includes(app.status) ? 'completed' : (isRejected ? 'rejected' : 'pending')),
      comment: app.status === '待辅导员审批' ? '辅导员正在审查活动真实性与合规性...' : '活动真实可靠，宣传内容符合规章要求，准予通过。'
    },
    {
      key: 'leader',
      title: '单位负责人审批',
      approver: '单位负责人 · 李建国 书记',
      time: ['待学生会审批', '待团委审批', '审批通过'].includes(app.status) ? '2026-08-07 17:30' : (app.status === '待单位负责人审批' ? '处理中' : '--'),
      status: app.status === '待单位负责人审批' ? 'active' : (['待学生会审批', '待团委审批', '审批通过'].includes(app.status) ? 'completed' : 'pending'),
      comment: app.status === '待单位负责人审批' ? '单位负责人正在核对组织资质与盖章备案...' : (['待学生会审批', '待团委审批', '审批通过'].includes(app.status) ? '已确认组织资质及活动备案，同意呈报。' : '等待前置环节完成')
    },
    {
      key: 'union',
      title: '学生会排期复核',
      approver: '校学生会张贴管理组 · 王思齐',
      time: ['待团委审批', '审批通过'].includes(app.status) ? '2026-08-08 09:20' : (app.status === '待学生会审批' ? '处理中' : '--'),
      status: app.status === '待学生会审批' ? 'active' : (['待团委审批', '审批通过'].includes(app.status) ? 'completed' : 'pending'),
      comment: app.status === '待学生会审批' ? '正在核对海报栏位排期冲突...' : (['待团委审批', '审批通过'].includes(app.status) ? '栏位排期无冲突，已锁定对应版面。' : '等待前置环节完成')
    },
    {
      key: 'tuanwei',
      title: '校团委终审与发码',
      approver: '校团委团宣传部 · 刘老师',
      time: isApproved ? '2026-08-08 10:45' : (app.status === '待团委审批' ? '处理中' : '--'),
      status: isApproved ? 'completed' : (app.status === '待团委审批' ? 'active' : 'pending'),
      comment: isApproved ? '终审批准通过！防伪核销二维码已自动生成。' : (app.status === '待团委审批' ? '校团委终审处理中...' : '等待前置环节完成')
    }
  ];

  if (isWithdrawn) {
    steps.push({
      key: 'withdraw',
      title: '申请人撤回申请',
      approver: app.applicantName,
      time: '2026-08-08 11:00',
      status: 'withdrawn',
      comment: '申请人已主动撤回本次海报张贴申请，预订栏位已自动释放。'
    });
  }

  return steps;
};

export default function PosterDetailModal({ item, onClose }: PosterDetailModalProps) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200 my-auto relative">
        
        {/* Header: 标题修改为：海报详情，去掉了右侧审批状态标签 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100/80 bg-white z-20 shrink-0">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
              <Eye className="text-blue-600" size={20} />
              <span>海报详情</span>
            </h3>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
            title="关闭"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs pb-6">
          <div className="lg:col-span-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">申请单位</label>
                <input type="text" disabled value={item.orgName} className="w-full bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 font-medium" />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">申请人</label>
                <input type="text" disabled value={item.applicantName} className="w-full bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 font-medium" />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">联系电话</label>
                <input type="text" disabled value={item.contactPhone || '13959200001'} className="w-full bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 font-medium" />
              </div>
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">活动主题</label>
              <input type="text" disabled value={item.title} className="w-full bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 font-medium" />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">海报效果图</label>
              <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-2xl p-3">
                <div className="w-16 h-20 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                  <img src={item.posterImageUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-1">
                  <span className="font-bold text-gray-900 text-xs">已提交海报高清晰预览图</span>
                  <p className="text-[11px] text-gray-500 font-medium">规格：{item.posterSize}</p>
                </div>
              </div>
            </div>
            <div className="border border-gray-200 rounded-2xl p-4 bg-white space-y-3">
              <h4 className="font-bold text-gray-900 text-xs">张贴位置和时间</h4>
              <ul className="space-y-2 text-[11px]">
                {item.postingLocations.map((loc, idx) => {
                  const parts = parsePostingLocationParts(loc);
                  return (
                    <li key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl border border-gray-200">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold">{parts.campus}</span>
                      <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-800 font-medium">{parts.board}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold">{parts.dates}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-4 bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
            <h4 className="font-bold text-gray-900 text-xs border-b pb-2">过程记录</h4>
            <div className="space-y-3">
              {getApprovalTimeline(item).map((step, idx) => (
                <div key={idx} className="space-y-1 text-[11px]">
                  <div className="flex items-center justify-between font-bold">
                    <span>{step.title}</span>
                    <span className="text-[10px] text-gray-500">{step.time}</span>
                  </div>
                  <p className="text-gray-600 font-medium">{step.approver}</p>
                  <p className="text-gray-500 bg-white p-2 rounded border border-gray-100">{step.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 底部“流程状态”和“关闭”按钮已按要求移除 */}
      </div>
    </div>
  );
}
