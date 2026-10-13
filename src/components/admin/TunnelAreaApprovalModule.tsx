import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  X,
  FileText,
  Clock,
  Send,
  Building2,
  User,
  Calendar,
  Phone,
  AlertCircle,
  HelpCircle,
  Info
} from 'lucide-react';

export interface TunnelAreaAppItem {
  id: string;
  location: string;             // 使用位置（起止）
  applyTime: string;            // 申请时间
  applicantOrg: string;         // 申请单位
  applicantName: string;        // 申请人
  usageStartDate: string;       // 申请使用开始时间
  usageEndDate: string;         // 申请使用结束时间
  status: string;               // 当前审批状态 e.g. '待校团委审批' | '待辅导员审批' | '待单位负责人审批' | '审批通过' | '审批不通过' | '已撤回'
  contactPhone?: string;        // 联系电话
  usagePlan?: string;           // 申请用途/计划描述
  myApprovalResult?: '同意' | '不同意' | '通过' | '拒绝'; // 我的审批结论
  myApprovalTime?: string;      // 我的审批时间
  myApprovalComment?: string;   // 我的审批意见
  approvalLogs?: Array<{
    step: string;
    reviewer: string;
    action: string;
    comment: string;
    timestamp: string;
  }>;
}

// Mock initial data
const INITIAL_PENDING_APPS: TunnelAreaAppItem[] = [
  {
    id: 'area-app-p1',
    location: 'K12+300.00 ~ K12+315.00 (左壁)',
    applyTime: '2026-08-08 09:30',
    applicantOrg: '计算机科学与技术系',
    applicantName: '张宇轩',
    contactPhone: '13812345678',
    usageStartDate: '2026-09-01',
    usageEndDate: '2027-08-31',
    status: '待校团委审批',
    usagePlan: '拟打造“代码与艺术”主题墙，展现厦大信息学子对AI与前沿科技的艺术畅想。方案整体色调明快，包含互动打卡点设计。',
    approvalLogs: [
      { step: '提交隧道涂鸦区域申请', reviewer: '张宇轩 (申请人)', action: '已提交', comment: '提交区域使用申请及设计蓝图，预订 K12+300-315 涂鸦段。', timestamp: '2026-08-08 09:30' },
      { step: '辅导员审批', reviewer: '辅导员 · 郭一凡', action: '通过', comment: '方案详实，符合隧道美化与校园文化阵地建设宗旨。', timestamp: '2026-08-08 10:15' },
      { step: '单位负责人审批', reviewer: '单位负责人 · 林院长', action: '通过', comment: '同意申报，请做好施工防护与安全防范。', timestamp: '2026-08-08 11:30' }
    ]
  },
  {
    id: 'area-app-p2',
    location: 'K12+320.00 ~ K12+335.00 (右壁)',
    applyTime: '2026-08-08 11:15',
    applicantOrg: '艺术学院青年志愿者协会',
    applicantName: '陈静',
    contactPhone: '13988887777',
    usageStartDate: '2026-09-01',
    usageEndDate: '2027-08-31',
    status: '待辅导员审批',
    usagePlan: '毕业季专题壁画《再见芙蓉，你好未来》，表现学子对母校的深情与祝福，色彩丰富层次清晰。',
    approvalLogs: [
      { step: '提交隧道涂鸦区域申请', reviewer: '陈静 (申请人)', action: '已提交', comment: '提交毕业季涂鸦作品申请。', timestamp: '2026-08-08 11:15' }
    ]
  },
  {
    id: 'area-app-p3',
    location: 'K12+350.00 ~ K12+365.00 (左壁)',
    applyTime: '2026-08-07 16:20',
    applicantOrg: '海洋与地球学院团党委',
    applicantName: '黄美玲',
    contactPhone: '13655554444',
    usageStartDate: '2026-09-15',
    usageEndDate: '2027-09-14',
    status: '待单位负责人审批',
    usagePlan: '“深海科考与蓝色梦想”科普文化墙展，展现嘉庚号科考船风采，普及海洋科学知识。',
    approvalLogs: [
      { step: '提交隧道涂鸦区域申请', reviewer: '黄美玲 (申请人)', action: '已提交', comment: '提交科普文化墙场地申请。', timestamp: '2026-08-07 16:20' },
      { step: '辅导员审批', reviewer: '辅导员 · 陈老师', action: '通过', comment: '推荐申报。', timestamp: '2026-08-07 17:00' }
    ]
  },
  {
    id: 'area-app-p4',
    location: 'K12+380.00 ~ K12+395.00 (右壁)',
    applyTime: '2026-08-07 14:00',
    applicantOrg: '外文学院学生会',
    applicantName: '李嘉欣',
    contactPhone: '13566668888',
    usageStartDate: '2026-09-01',
    usageEndDate: '2027-08-31',
    status: '待校团委审批',
    usagePlan: '多语种世界文化长廊手绘墙展示，促进多语种国际文化交流与互动。',
    approvalLogs: [
      { step: '提交隧道涂鸦区域申请', reviewer: '李嘉欣 (申请人)', action: '已提交', comment: '提交文化长廊申请。', timestamp: '2026-08-07 14:00' },
      { step: '辅导员审批', reviewer: '辅导员 · 张老师', action: '通过', comment: '审核通过。', timestamp: '2026-08-07 14:40' },
      { step: '单位负责人审批', reviewer: '单位负责人 · 王书记', action: '通过', comment: '同意。', timestamp: '2026-08-07 15:20' }
    ]
  },
  {
    id: 'area-app-p5',
    location: 'K12+410.00 ~ K12+425.00 (左壁)',
    applyTime: '2026-08-06 10:45',
    applicantOrg: '物理科学与技术学院',
    applicantName: '赵伟',
    contactPhone: '13799990000',
    usageStartDate: '2026-10-01',
    usageEndDate: '2027-09-30',
    status: '待辅导员审批',
    usagePlan: '“量子遐想”物理科学艺术墙面创作，科普物理学美感。',
    approvalLogs: [
      { step: '提交隧道涂鸦区域申请', reviewer: '赵伟 (申请人)', action: '已提交', comment: '提交物理学院墙面申请。', timestamp: '2026-08-06 10:45' }
    ]
  },
  {
    id: 'area-app-p6',
    location: 'K12+430.00 ~ K12+445.00 (右壁)',
    applyTime: '2026-08-05 15:30',
    applicantOrg: '建筑与土木工程学院',
    applicantName: '周博文',
    contactPhone: '13877776666',
    usageStartDate: '2026-09-01',
    usageEndDate: '2027-08-31',
    status: '待单位负责人审批',
    usagePlan: '“建筑几何与空间之美”现代主义风格涂鸦壁画。',
    approvalLogs: [
      { step: '提交隧道涂鸦区域申请', reviewer: '周博文 (申请人)', action: '已提交', comment: '提交建筑墙面申请。', timestamp: '2026-08-05 15:30' },
      { step: '辅导员审批', reviewer: '辅导员 · 钱老师', action: '通过', comment: '符合要求。', timestamp: '2026-08-05 16:10' }
    ]
  },
  {
    id: 'area-app-p7',
    location: 'K12+460.00 ~ K12+475.00 (左壁)',
    applyTime: '2026-08-04 09:10',
    applicantOrg: '厦门大学书画协会',
    applicantName: '王墨然',
    contactPhone: '13344445555',
    usageStartDate: '2026-09-10',
    usageEndDate: '2027-09-09',
    status: '待校团委审批',
    usagePlan: '国风水墨与现代涂鸦跨界融合墙面。',
    approvalLogs: [
      { step: '提交隧道涂鸦区域申请', reviewer: '王墨然 (申请人)', action: '已提交', comment: '提交水墨涂鸦申请。', timestamp: '2026-08-04 09:10' },
      { step: '辅导员审批', reviewer: '辅导员 · 孙老师', action: '通过', comment: '推荐。', timestamp: '2026-08-04 10:00' },
      { step: '单位负责人审批', reviewer: '单位负责人 · 李会长', action: '通过', comment: '同意。', timestamp: '2026-08-04 11:15' }
    ]
  }
];

const INITIAL_COMPLETED_APPS: TunnelAreaAppItem[] = [
  {
    id: 'area-app-c1',
    location: 'K12+310.00 ~ K12+325.00 (左壁)',
    applyTime: '2026-08-03 14:00',
    applicantOrg: '新闻传播学院',
    applicantName: '刘子涵',
    contactPhone: '13911112222',
    usageStartDate: '2026-09-01',
    usageEndDate: '2027-08-31',
    status: '审批通过',
    myApprovalResult: '同意',
    myApprovalTime: '2026-08-04 10:30',
    myApprovalComment: '同意申请，符合芙蓉隧道文化空间规划要求，请按计划文明施工。',
    usagePlan: '新传播媒介历史演变主题墙画。',
    approvalLogs: [
      { step: '提交隧道涂鸦区域申请', reviewer: '刘子涵 (申请人)', action: '已提交', comment: '提交场地申请。', timestamp: '2026-08-03 14:00' },
      { step: '辅导员审批', reviewer: '辅导员 · 高老师', action: '通过', comment: '审核通过。', timestamp: '2026-08-03 15:00' },
      { step: '单位负责人审批', reviewer: '单位负责人 · 余书记', action: '通过', comment: '同意。', timestamp: '2026-08-03 16:30' },
      { step: '校团委终审', reviewer: '校团委管理组', action: '通过', comment: '同意申请，符合芙蓉隧道文化空间规划要求。', timestamp: '2026-08-04 10:30' }
    ]
  },
  {
    id: 'area-app-c2',
    location: 'K12+330.00 ~ K12+345.00 (右壁)',
    applyTime: '2026-08-02 16:50',
    applicantOrg: '化学化工学院',
    applicantName: '孙瑞',
    contactPhone: '13822223333',
    usageStartDate: '2026-09-01',
    usageEndDate: '2027-08-31',
    status: '审批通过',
    myApprovalResult: '同意',
    myApprovalTime: '2026-08-03 11:20',
    myApprovalComment: '同意，化学元素之美创意充沛。',
    usagePlan: '“分子万象”化学元素周期表创意艺术墙。',
    approvalLogs: [
      { step: '提交隧道涂鸦区域申请', reviewer: '孙瑞 (申请人)', action: '已提交', comment: '提交场地申请。', timestamp: '2026-08-02 16:50' },
      { step: '辅导员审批', reviewer: '辅导员 · 谢老师', action: '通过', comment: '审核通过。', timestamp: '2026-08-02 17:30' },
      { step: '校团委终审', reviewer: '校团委管理组', action: '通过', comment: '同意，化学元素之美创意充沛。', timestamp: '2026-08-03 11:20' }
    ]
  },
  {
    id: 'area-app-c3',
    location: 'K12+360.00 ~ K12+375.00 (左壁)',
    applyTime: '2026-08-01 10:15',
    applicantOrg: '经济学院团党委',
    applicantName: '方思远',
    contactPhone: '13733334444',
    usageStartDate: '2026-09-01',
    usageEndDate: '2027-08-31',
    status: '审批不通过',
    myApprovalResult: '不同意',
    myApprovalTime: '2026-08-02 09:40',
    myApprovalComment: '图案含过多商业LOGO赞助信息，请修改后重新申报。',
    usagePlan: '金融创新与实体经济主题壁画。',
    approvalLogs: [
      { step: '提交隧道涂鸦区域申请', reviewer: '方思远 (申请人)', action: '已提交', comment: '提交场地申请。', timestamp: '2026-08-01 10:15' },
      { step: '辅导员审批', reviewer: '辅导员 · 许老师', action: '通过', comment: '初步通过。', timestamp: '2026-08-01 11:00' },
      { step: '校团委终审', reviewer: '校团委管理组', action: '拒绝', comment: '图案含过多商业LOGO赞助信息，请修改后重新申报。', timestamp: '2026-08-02 09:40' }
    ]
  },
  {
    id: 'area-app-c4',
    location: 'K12+400.00 ~ K12+415.00 (右壁)',
    applyTime: '2026-07-30 11:00',
    applicantOrg: '管理学院青年志愿者队',
    applicantName: '吴晓敏',
    contactPhone: '13644445555',
    usageStartDate: '2026-09-01',
    usageEndDate: '2027-08-31',
    status: '审批通过',
    myApprovalResult: '同意',
    myApprovalTime: '2026-07-31 14:15',
    myApprovalComment: '同意申请使用。',
    usagePlan: '公益无国界——校园志愿服务故事墙。',
    approvalLogs: [
      { step: '提交隧道涂鸦区域申请', reviewer: '吴晓敏 (申请人)', action: '已提交', comment: '提交申请。', timestamp: '2026-07-30 11:00' },
      { step: '校团委终审', reviewer: '校团委管理组', action: '通过', comment: '同意申请使用。', timestamp: '2026-07-31 14:15' }
    ]
  },
  {
    id: 'area-app-c5',
    location: 'K12+440.00 ~ K12+455.00 (左壁)',
    applyTime: '2026-07-28 15:40',
    applicantOrg: '法学院',
    applicantName: '郑明礼',
    contactPhone: '13555556666',
    usageStartDate: '2026-09-01',
    usageEndDate: '2027-08-31',
    status: '审批通过',
    myApprovalResult: '同意',
    myApprovalTime: '2026-07-29 16:00',
    myApprovalComment: '同意，法治文化入脑入心。',
    usagePlan: '“法安天下，德润人心”普法艺术表达墙。',
    approvalLogs: [
      { step: '提交隧道涂鸦区域申请', reviewer: '郑明礼 (申请人)', action: '已提交', comment: '提交申请。', timestamp: '2026-07-28 15:40' },
      { step: '校团委终审', reviewer: '校团委管理组', action: '通过', comment: '同意，法治文化入脑入心。', timestamp: '2026-07-29 16:00' }
    ]
  },
  {
    id: 'area-app-c6',
    location: 'K12+480.00 ~ K12+495.00 (右壁)',
    applyTime: '2026-07-25 09:20',
    applicantOrg: '生命科学学院',
    applicantName: '杨紫晴',
    contactPhone: '13466667777',
    usageStartDate: '2026-09-01',
    usageEndDate: '2027-08-31',
    status: '审批通过',
    myApprovalResult: '同意',
    myApprovalTime: '2026-07-26 10:10',
    myApprovalComment: '同意，体现生物多样性与生态文明。',
    usagePlan: '“万物生长”南方生态与生物多样性插画墙。',
    approvalLogs: [
      { step: '提交隧道涂鸦区域申请', reviewer: '杨紫晴 (申请人)', action: '已提交', comment: '提交申请。', timestamp: '2026-07-25 09:20' },
      { step: '校团委终审', reviewer: '校团委管理组', action: '通过', comment: '同意，体现生物多样性与生态文明。', timestamp: '2026-07-26 10:10' }
    ]
  }
];

export default function TunnelAreaApprovalModule() {
  // State for Lists
  const [pendingApps, setPendingApps] = useState<TunnelAreaAppItem[]>(INITIAL_PENDING_APPS);
  const [completedApps, setCompletedApps] = useState<TunnelAreaAppItem[]>(INITIAL_COMPLETED_APPS);

  // Tab State ('pending' | 'completed')
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');

  // Search Filter State
  const [searchOrgInput, setSearchOrgInput] = useState('');
  const [searchStartDateInput, setSearchStartDateInput] = useState('');
  const [searchEndDateInput, setSearchEndDateInput] = useState('');

  const [appliedOrg, setAppliedOrg] = useState('');
  const [appliedStartDate, setAppliedStartDate] = useState('');
  const [appliedEndDate, setAppliedEndDate] = useState('');

  // Pagination States
  const [pendingPage, setPendingPage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);
  const pageSize = 5;

  // Modal States
  const [reviewingApp, setReviewingApp] = useState<TunnelAreaAppItem | null>(null);
  const [approvalDecision, setApprovalDecision] = useState<'同意' | '不同意'>('同意');
  const [approvalComment, setApprovalComment] = useState('同意申请，尺寸与内容符合涂鸦区域管理规定。');

  const [viewingApp, setViewingApp] = useState<TunnelAreaAppItem | null>(null);
  const [revokingApp, setRevokingApp] = useState<TunnelAreaAppItem | null>(null);

  // Handle Search & Reset
  const handleSearch = () => {
    setAppliedOrg(searchOrgInput.trim());
    setAppliedStartDate(searchStartDateInput);
    setAppliedEndDate(searchEndDateInput);
    setPendingPage(1);
    setCompletedPage(1);
  };

  const handleReset = () => {
    setSearchOrgInput('');
    setSearchStartDateInput('');
    setSearchEndDateInput('');
    setAppliedOrg('');
    setAppliedStartDate('');
    setAppliedEndDate('');
    setPendingPage(1);
    setCompletedPage(1);
  };

  // Filter Logic
  const filterList = (list: TunnelAreaAppItem[]) => {
    return list.filter((item) => {
      // Filter by Org
      if (appliedOrg && !item.applicantOrg.toLowerCase().includes(appliedOrg.toLowerCase())) {
        return false;
      }
      // Filter by Apply Date Range
      const itemDate = item.applyTime.slice(0, 10);
      if (appliedStartDate && itemDate < appliedStartDate) {
        return false;
      }
      if (appliedEndDate && itemDate > appliedEndDate) {
        return false;
      }
      return true;
    });
  };

  const filteredPendingList = filterList(pendingApps);
  const filteredCompletedList = filterList(completedApps);

  // Submit Approval Decision
  const handleConfirmApproval = () => {
    if (!reviewingApp) return;

    const now = new Date();
    const formattedNow = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const updatedItem: TunnelAreaAppItem = {
      ...reviewingApp,
      status: approvalDecision === '同意' ? '审批通过' : '审批不通过',
      myApprovalResult: approvalDecision,
      myApprovalTime: formattedNow,
      myApprovalComment: approvalComment || (approvalDecision === '同意' ? '同意申请使用。' : '不同意该申请。'),
      approvalLogs: [
        ...(reviewingApp.approvalLogs || []),
        {
          step: '校团委审批',
          reviewer: '校团委 · 管理员',
          action: approvalDecision === '同意' ? '通过' : '拒绝',
          comment: approvalComment || (approvalDecision === '同意' ? '同意申请使用。' : '不同意该申请。'),
          timestamp: formattedNow
        }
      ]
    };

    // Remove from pending, add to top of completed
    setPendingApps((prev) => prev.filter((item) => item.id !== reviewingApp.id));
    setCompletedApps((prev) => [updatedItem, ...prev]);

    setReviewingApp(null);
  };

  // Handle Revoke Approval (撤回审批)
  const handleConfirmRevoke = () => {
    if (!revokingApp) return;

    // Reset status to pending
    const resetItem: TunnelAreaAppItem = {
      ...revokingApp,
      status: '待校团委审批',
      myApprovalResult: undefined,
      myApprovalTime: undefined,
      myApprovalComment: undefined
    };

    // Remove from completed, add to pending
    setCompletedApps((prev) => prev.filter((item) => item.id !== revokingApp.id));
    setPendingApps((prev) => [resetItem, ...prev]);

    setRevokingApp(null);
  };

  // Pagination calculation
  const currentList = activeTab === 'pending' ? filteredPendingList : filteredCompletedList;
  const currentPage = activeTab === 'pending' ? pendingPage : completedPage;
  const setCurrentPage = activeTab === 'pending' ? setPendingPage : setCompletedPage;
  const totalCount = currentList.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const pagedList = currentList.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const currentStart = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const currentEnd = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="p-6 bg-gray-50/60 min-h-screen space-y-6 text-gray-800 font-sans">
      {/* 1. 标题 Header: 纯线条竖标 + 粗体标题（无二级标题），去掉最右侧的按钮 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-1.5 h-6 bg-blue-600 rounded-full mr-3 shadow-sm"></div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">
            隧道涂鸦区域审批
          </h1>
        </div>
      </div>

      {/* 2. 查询条件 Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/80 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* 申请单位 */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 tracking-wide">申请单位</label>
            <input
              type="text"
              value={searchOrgInput}
              onChange={(e) => setSearchOrgInput(e.target.value)}
              placeholder="请输入申请单位..."
              className="w-full bg-gray-50/80 border border-gray-200/60 rounded-xl px-4 py-2.5 text-xs text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>

          {/* 申请时间 (时间段) */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 tracking-wide">申请时间</label>
            <div className="flex items-center gap-1.5 bg-gray-50/80 border border-gray-200/60 rounded-xl px-3 py-1.5 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <input
                type="date"
                value={searchStartDateInput}
                onChange={(e) => setSearchStartDateInput(e.target.value)}
                className="bg-transparent text-xs text-gray-800 outline-none w-full cursor-pointer"
              />
              <span className="text-gray-400 font-medium text-xs">-</span>
              <input
                type="date"
                value={searchEndDateInput}
                onChange={(e) => setSearchEndDateInput(e.target.value)}
                className="bg-transparent text-xs text-gray-800 outline-none w-full cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 查询与重置按钮 */}
        <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100/60">
          <button
            type="button"
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold px-8 py-2.5 rounded-xl text-xs shadow-sm shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center"
          >
            <span>查询</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-100/90 hover:bg-gray-200 active:scale-95 text-gray-600 font-bold px-8 py-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center"
          >
            <span>重置</span>
          </button>
        </div>
      </div>

      {/* 3. 数据列表 Card (包含 2 个 Tab 与数据表格) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden">
        {/* Tab 标头栏 */}
        <div className="px-6 py-3.5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4 bg-white">
          {/* Segmented Tab */}
          <div className="bg-gray-100/80 p-1 rounded-xl flex items-center gap-1 border border-gray-200/50">
            <button
              type="button"
              onClick={() => {
                setActiveTab('pending');
                setPendingPage(1);
              }}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'pending'
                  ? 'bg-white text-blue-600 shadow-sm border border-gray-100 font-black'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/50'
              }`}
            >
              <span>待审批</span>
              <span className={`px-2 py-0.5 text-[10px] font-black rounded-full transition-colors ${
                activeTab === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {filteredPendingList.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('completed');
                setCompletedPage(1);
              }}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'completed'
                  ? 'bg-white text-blue-600 shadow-sm border border-gray-100 font-black'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/50'
              }`}
            >
              <span>已审批</span>
              {/* 已审批不显示角标 */}
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <span>
              显示 <strong className="text-gray-900 font-bold">{currentStart}</strong> 到 <strong className="text-gray-900 font-bold">{currentEnd}</strong>，共 <strong className="text-blue-600 font-bold">{totalCount}</strong> 条记录
            </span>
          </div>
        </div>

        {/* 表格主体 */}
        <div className="overflow-x-auto relative">
          {activeTab === 'pending' ? (
            /* 待审批列表字段：使用位置（起止）、申请时间、申请单位、申请人、申请使用开始时间、申请使用结束时间，操作区域为：审批 */
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-gray-50/90 text-gray-500 font-bold border-b border-gray-200/80">
                <tr>
                  <th className="sticky left-0 z-20 bg-gray-50 py-3.5 px-4 whitespace-nowrap min-w-[240px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] border-b border-gray-200/80">
                    使用位置（起止）
                  </th>
                  <th className="py-3.5 px-4 whitespace-nowrap min-w-[140px]">申请时间</th>
                  <th className="py-3.5 px-4 whitespace-nowrap min-w-[180px]">申请单位</th>
                  <th className="py-3.5 px-4 whitespace-nowrap min-w-[120px]">申请人</th>
                  <th className="py-3.5 px-4 whitespace-nowrap min-w-[140px]">申请使用开始时间</th>
                  <th className="py-3.5 px-4 whitespace-nowrap min-w-[140px]">申请使用结束时间</th>
                  <th className="sticky right-0 z-20 bg-gray-50 py-3.5 px-4 text-center whitespace-nowrap min-w-[100px] shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.06)] border-b border-gray-200/80">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                {pagedList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400">
                      暂无待审批的涂鸦区域申请记录
                    </td>
                  </tr>
                ) : (
                  pagedList.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/40 transition-colors group">
                      {/* 使用位置（起止） */}
                      <td className="sticky left-0 z-10 bg-white group-hover:bg-blue-50/40 py-3.5 px-4 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] transition-colors font-mono font-bold text-blue-600 whitespace-nowrap">
                        {item.location}
                      </td>
                      {/* 申请时间 */}
                      <td className="py-3.5 px-4 font-mono text-gray-500 whitespace-nowrap">
                        {item.applyTime}
                      </td>
                      {/* 申请单位 */}
                      <td className="py-3.5 px-4 font-bold text-gray-900 whitespace-nowrap">
                        {item.applicantOrg}
                      </td>
                      {/* 申请人 */}
                      <td className="py-3.5 px-4 text-gray-800 whitespace-nowrap">
                        {item.applicantName}
                      </td>
                      {/* 申请使用开始时间 */}
                      <td className="py-3.5 px-4 font-mono text-gray-600 whitespace-nowrap">
                        {item.usageStartDate}
                      </td>
                      {/* 申请使用结束时间 */}
                      <td className="py-3.5 px-4 font-mono text-gray-600 whitespace-nowrap">
                        {item.usageEndDate}
                      </td>
                      {/* 操作: 审批 */}
                      <td className="sticky right-0 z-10 bg-white group-hover:bg-blue-50/40 py-3.5 px-4 text-center whitespace-nowrap shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.06)] transition-colors">
                        <button
                          type="button"
                          onClick={() => {
                            setReviewingApp(item);
                            setApprovalDecision('同意');
                            setApprovalComment('同意申请，尺寸与内容符合涂鸦区域管理规定。');
                          }}
                          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-lg text-xs shadow-xs transition-all cursor-pointer"
                        >
                          审批
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            /* 已审批列表字段：使用位置（起止）、我的审批结论、我的审批时间久、当前审批状态、申请时间、申请单位、申请人、申请使用开始时间、申请使用结束时间，操作区域为：查看、撤回审批 */
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-gray-50/90 text-gray-500 font-bold border-b border-gray-200/80">
                <tr>
                  <th className="sticky left-0 z-20 bg-gray-50 py-3.5 px-4 whitespace-nowrap min-w-[240px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] border-b border-gray-200/80">
                    使用位置（起止）
                  </th>
                  <th className="py-3.5 px-4 whitespace-nowrap min-w-[120px]">我的审批结论</th>
                  <th className="py-3.5 px-4 whitespace-nowrap min-w-[140px]">我的审批时间</th>
                  <th className="py-3.5 px-4 whitespace-nowrap min-w-[130px]">当前审批状态</th>
                  <th className="py-3.5 px-4 whitespace-nowrap min-w-[140px]">申请时间</th>
                  <th className="py-3.5 px-4 whitespace-nowrap min-w-[180px]">申请单位</th>
                  <th className="py-3.5 px-4 whitespace-nowrap min-w-[120px]">申请人</th>
                  <th className="py-3.5 px-4 whitespace-nowrap min-w-[140px]">申请使用开始时间</th>
                  <th className="py-3.5 px-4 whitespace-nowrap min-w-[140px]">申请使用结束时间</th>
                  <th className="sticky right-0 z-20 bg-gray-50 py-3.5 px-4 text-center whitespace-nowrap min-w-[160px] shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.06)] border-b border-gray-200/80">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                {pagedList.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-gray-400">
                      暂无已审批的涂鸦区域申请记录
                    </td>
                  </tr>
                ) : (
                  pagedList.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/40 transition-colors group">
                      {/* 使用位置（起止） */}
                      <td className="sticky left-0 z-10 bg-white group-hover:bg-blue-50/40 py-3.5 px-4 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] transition-colors font-mono font-bold text-blue-600 whitespace-nowrap">
                        {item.location}
                      </td>
                      {/* 我的审批结论 */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {item.myApprovalResult === '同意' || item.myApprovalResult === '通过' ? (
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md font-bold text-[11px] inline-flex items-center gap-1">
                            <CheckCircle2 size={12} className="text-emerald-600" />
                            <span>同意</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-md font-bold text-[11px] inline-flex items-center gap-1">
                            <X size={12} className="text-rose-600" />
                            <span>不同意</span>
                          </span>
                        )}
                      </td>
                      {/* 我的审批时间 */}
                      <td className="py-3.5 px-4 font-mono text-gray-500 whitespace-nowrap">
                        {item.myApprovalTime || '2026-08-07 16:30'}
                      </td>
                      {/* 当前审批状态 */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                          item.status === '审批通过'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                            : item.status === '审批不通过'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200/80'
                            : 'bg-blue-50 text-blue-700 border border-blue-200/80'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            item.status === '审批通过' ? 'bg-emerald-500' : item.status === '审批不通过' ? 'bg-rose-500' : 'bg-blue-500'
                          }`} />
                          {item.status}
                        </span>
                      </td>
                      {/* 申请时间 */}
                      <td className="py-3.5 px-4 font-mono text-gray-500 whitespace-nowrap">
                        {item.applyTime}
                      </td>
                      {/* 申请单位 */}
                      <td className="py-3.5 px-4 font-bold text-gray-900 whitespace-nowrap">
                        {item.applicantOrg}
                      </td>
                      {/* 申请人 */}
                      <td className="py-3.5 px-4 text-gray-800 whitespace-nowrap">
                        {item.applicantName}
                      </td>
                      {/* 申请使用开始时间 */}
                      <td className="py-3.5 px-4 font-mono text-gray-600 whitespace-nowrap">
                        {item.usageStartDate}
                      </td>
                      {/* 申请使用结束时间 */}
                      <td className="py-3.5 px-4 font-mono text-gray-600 whitespace-nowrap">
                        {item.usageEndDate}
                      </td>
                      {/* 操作区域：查看、撤回审批 */}
                      <td className="sticky right-0 z-10 bg-white group-hover:bg-blue-50/40 py-3.5 px-4 text-center whitespace-nowrap shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.06)] transition-colors">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => setViewingApp(item)}
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-bold text-xs transition-all cursor-pointer"
                          >
                            查看
                          </button>
                          <button
                            type="button"
                            onClick={() => setRevokingApp(item)}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg font-bold text-xs transition-all cursor-pointer"
                          >
                            撤回审批
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* 4. 分页控制区域 (与海报张贴审批完全一致) */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3 bg-white">
          <div className="text-xs text-gray-500 font-medium">
            显示第 <strong className="text-gray-900 font-bold">{currentStart}</strong> 到 <strong className="text-gray-900 font-bold">{currentEnd}</strong> 条，共 <strong className="text-blue-600 font-bold">{totalCount}</strong> 条记录
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
            >
              <ChevronLeft size={14} />
              <span>上一页</span>
            </button>

            <div className="flex items-center gap-1 px-1">
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
            >
              <span>下一页</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal 1: 审批 Modal (3栏结构：左-基本信息一行一个字段，中-我的审批[较宽]，右-过程记录[较窄]) */}
      {reviewingApp && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl w-[96vw] max-w-7xl max-h-[92vh] flex flex-col overflow-hidden font-sans animate-in fade-in zoom-in-95 duration-150 my-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <CheckCircle2 size={20} />
                </div>
                <h2 className="font-extrabold text-gray-900 text-lg tracking-tight">
                  隧道涂鸦区域审批
                </h2>
                <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200/80 rounded-full font-bold text-xs inline-flex items-center gap-1.5 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  {reviewingApp.status || '待校团委审批'}
                </span>
              </div>
              
              <button
                type="button"
                onClick={() => setReviewingApp(null)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content - 3 Column Layout */}
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50/40">
              <div className="grid grid-cols-12 gap-6 items-start">

                {/* ===== COLUMN 1: 基本信息 (4 / 12) - 一行一个字段原则 ===== */}
                <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs space-y-4">
                  <div className="text-sm font-black text-gray-900 pb-3 border-b border-gray-100 flex items-center justify-between">
                    <span>基本信息</span>
                    <span className="text-[11px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded">只读信息</span>
                  </div>

                  {/* 一行一个字段 */}
                  <div className="space-y-3.5 text-xs">
                    {/* 1. 申请单位 */}
                    <div>
                      <label className="text-gray-500 font-medium block mb-1">
                        申请单位 <span className="text-gray-400 font-normal">(只读)</span>
                      </label>
                      <div className="bg-gray-100/80 border border-gray-200/50 rounded-xl px-3.5 py-2.5 text-gray-900 font-bold">
                        {reviewingApp.applicantOrg}
                      </div>
                    </div>

                    {/* 2. 申请人 */}
                    <div>
                      <label className="text-gray-500 font-medium block mb-1">
                        申请人 <span className="text-gray-400 font-normal">(只读)</span>
                      </label>
                      <div className="bg-gray-100/80 border border-gray-200/50 rounded-xl px-3.5 py-2.5 text-gray-900 font-bold">
                        {reviewingApp.applicantName}
                      </div>
                    </div>

                    {/* 3. 联系电话 */}
                    <div>
                      <label className="text-gray-500 font-medium block mb-1">
                        联系电话 <span className="text-gray-400 font-normal">(只读)</span>
                      </label>
                      <div className="bg-gray-100/80 border border-gray-200/50 rounded-xl px-3.5 py-2.5 text-gray-800 font-mono">
                        {reviewingApp.contactPhone || '13812345678'}
                      </div>
                    </div>

                    {/* 4. 申请时间 */}
                    <div>
                      <label className="text-gray-500 font-medium block mb-1">
                        申请时间 <span className="text-gray-400 font-normal">(只读)</span>
                      </label>
                      <div className="bg-gray-100/80 border border-gray-200/50 rounded-xl px-3.5 py-2.5 text-gray-800 font-mono">
                        {reviewingApp.applyTime}
                      </div>
                    </div>

                    {/* 5. 使用位置（起止） */}
                    <div>
                      <label className="text-gray-500 font-medium block mb-1">
                        使用位置（起止） <span className="text-gray-400 font-normal">(只读)</span>
                      </label>
                      <div className="bg-blue-50/80 border border-blue-200/60 rounded-xl px-3.5 py-2.5 text-blue-700 font-bold font-mono">
                        {reviewingApp.location}
                      </div>
                    </div>

                    {/* 6. 申请使用开始时间 */}
                    <div>
                      <label className="text-gray-500 font-medium block mb-1">
                        申请使用开始时间 <span className="text-gray-400 font-normal">(只读)</span>
                      </label>
                      <div className="bg-gray-100/80 border border-gray-200/50 rounded-xl px-3.5 py-2.5 text-gray-800 font-mono">
                        {reviewingApp.usageStartDate}
                      </div>
                    </div>

                    {/* 7. 申请使用结束时间 */}
                    <div>
                      <label className="text-gray-500 font-medium block mb-1">
                        申请使用结束时间 <span className="text-gray-400 font-normal">(只读)</span>
                      </label>
                      <div className="bg-gray-100/80 border border-gray-200/50 rounded-xl px-3.5 py-2.5 text-gray-800 font-mono">
                        {reviewingApp.usageEndDate}
                      </div>
                    </div>

                    {/* 8. 申请用途/说明 */}
                    <div>
                      <label className="text-gray-500 font-medium block mb-1">
                        申请用途与说明 <span className="text-gray-400 font-normal">(只读)</span>
                      </label>
                      <div className="bg-gray-100/80 border border-gray-200/50 rounded-xl px-3.5 py-2.5 text-gray-700 leading-relaxed">
                        {reviewingApp.usagePlan || '申请使用该段隧道墙面进行主题涂鸦壁画创作，展示校园艺术文化。'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ===== COLUMN 2: 我的审批 (5 / 12) - 宽度较大 ===== */}
                <div className="col-span-12 lg:col-span-5 bg-white rounded-2xl border border-blue-200 p-6 shadow-sm space-y-6 flex flex-col justify-between min-h-[460px]">
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={18} className="text-blue-600" />
                        <h3 className="font-bold text-gray-900 text-base">我的审批</h3>
                      </div>
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200/80 rounded-full text-xs font-bold">
                        待处理
                      </span>
                    </div>

                    {/* 审批结论 Radio Option Buttons */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-gray-800 block">
                        审批结论 <span className="text-rose-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {/* 同意 Button Card */}
                        <button
                          type="button"
                          onClick={() => {
                            setApprovalDecision('同意');
                            setApprovalComment('同意申请，尺寸与内容符合涂鸦区域管理规定。');
                          }}
                          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            approvalDecision === '同意'
                              ? 'bg-emerald-50/90 border-emerald-500 text-emerald-800 shadow-xs ring-2 ring-emerald-200'
                              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            approvalDecision === '同意' ? 'border-emerald-600 bg-emerald-600' : 'border-gray-300'
                          }`}>
                            {approvalDecision === '同意' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <span>同意</span>
                        </button>

                        {/* 不同意 Button Card */}
                        <button
                          type="button"
                          onClick={() => {
                            setApprovalDecision('不同意');
                            setApprovalComment('不同意该申请，图案或规划有待进一步调整。');
                          }}
                          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            approvalDecision === '不同意'
                              ? 'bg-rose-50/90 border-rose-500 text-rose-800 shadow-xs ring-2 ring-rose-200'
                              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            approvalDecision === '不同意' ? 'border-rose-600 bg-rose-600' : 'border-gray-300'
                          }`}>
                            {approvalDecision === '不同意' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <span>不同意</span>
                        </button>
                      </div>
                    </div>

                    {/* 审批意见 Textarea */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-800 block">
                        审批意见 <span className="text-gray-400 font-normal">(可选)</span>
                      </label>
                      <textarea
                        rows={6}
                        value={approvalComment}
                        onChange={(e) => setApprovalComment(e.target.value)}
                        placeholder="请输入您的具体审批意见与建议..."
                        className="w-full bg-gray-50/80 border border-gray-200/80 rounded-xl p-3.5 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* 提交 Button */}
                  <div className="pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={handleConfirmApproval}
                      className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold py-3 px-6 rounded-xl text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Send size={15} />
                      <span>提交</span>
                    </button>
                  </div>
                </div>

                {/* ===== COLUMN 3: 过程记录 (3 / 12) - 宽度较小 ===== */}
                <div className="col-span-12 lg:col-span-3 bg-gray-50/80 rounded-2xl border border-gray-200/80 p-4 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200/60">
                    <div className="flex items-center gap-1.5">
                      <Clock size={16} className="text-blue-600" />
                      <h3 className="font-bold text-gray-900 text-sm">过程记录</h3>
                    </div>
                    <span className="text-[10px] bg-gray-200/80 text-gray-600 font-medium px-2 py-0.5 rounded-full">
                      时序追踪
                    </span>
                  </div>

                  {/* Step Timeline */}
                  <div className="space-y-4 text-xs pt-1">
                    {/* Log 1: 提交 */}
                    {reviewingApp.approvalLogs && reviewingApp.approvalLogs.length > 0 ? (
                      reviewingApp.approvalLogs.map((log, idx) => (
                        <div key={idx} className="relative pl-6 pb-2 border-l-2 border-blue-200 last:border-l-0 last:pb-0">
                          {/* Circle Badge */}
                          <div className="absolute -left-[11px] top-0.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shadow-2xs">
                            ✓
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-gray-900">{log.step}</span>
                              <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded">
                                {log.action}
                              </span>
                            </div>
                            <div className="text-[11px] text-gray-500">{log.reviewer}</div>
                            <div className="text-[10px] text-gray-400 font-mono">{log.timestamp}</div>
                            {log.comment && (
                              <div className="bg-white border border-gray-200/80 rounded-lg p-2 text-[11px] text-gray-700 mt-1 shadow-2xs">
                                {log.comment}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="relative pl-6 pb-2 border-l-2 border-blue-200">
                        <div className="absolute -left-[11px] top-0.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                          ✓
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-gray-900">提交涂鸦区域申请</span>
                            <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded">已提交</span>
                          </div>
                          <div className="text-[11px] text-gray-500">{reviewingApp.applicantName} ({reviewingApp.applicantOrg})</div>
                          <div className="text-[10px] text-gray-400 font-mono">{reviewingApp.applyTime}</div>
                        </div>
                      </div>
                    )}

                    {/* Current Step (Pending) */}
                    <div className="relative pl-6">
                      <div className="absolute -left-[11px] top-0.5 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                        { (reviewingApp.approvalLogs?.length || 1) + 1 }
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-blue-700">{reviewingApp.status || '校团委终审'}</span>
                          <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded">
                            审批中
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-500">处理中...</div>
                        <div className="bg-white border border-blue-100 rounded-lg p-2 text-[11px] text-gray-600 mt-1">
                          等待当前环节完成审批...
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* Modal 2: 查看详情 Modal (已审批查看 - 同 3 栏结构，但只读) */}
      {viewingApp && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl w-[96vw] max-w-7xl max-h-[92vh] flex flex-col overflow-hidden font-sans animate-in fade-in zoom-in-95 duration-150 my-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <FileText size={20} />
                </div>
                <h2 className="font-extrabold text-gray-900 text-lg tracking-tight">
                  隧道涂鸦区域审批详情
                </h2>
                <span className={`px-3 py-1 rounded-full font-bold text-xs inline-flex items-center gap-1.5 ${
                  viewingApp.status === '审批通过' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${viewingApp.status === '审批通过' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                  {viewingApp.status}
                </span>
              </div>
              
              <button
                type="button"
                onClick={() => setViewingApp(null)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body - 3 Column Layout */}
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50/40">
              <div className="grid grid-cols-12 gap-6 items-start">

                {/* ===== COLUMN 1: 基本信息 (4 / 12) - 一行一个字段 ===== */}
                <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs space-y-4">
                  <div className="text-sm font-black text-gray-900 pb-3 border-b border-gray-100 flex items-center justify-between">
                    <span>基本信息</span>
                    <span className="text-[11px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded">只读信息</span>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div>
                      <label className="text-gray-500 font-medium block mb-1">申请单位 (只读)</label>
                      <div className="bg-gray-100/80 border border-gray-200/50 rounded-xl px-3.5 py-2.5 text-gray-900 font-bold">
                        {viewingApp.applicantOrg}
                      </div>
                    </div>

                    <div>
                      <label className="text-gray-500 font-medium block mb-1">申请人 (只读)</label>
                      <div className="bg-gray-100/80 border border-gray-200/50 rounded-xl px-3.5 py-2.5 text-gray-900 font-bold">
                        {viewingApp.applicantName}
                      </div>
                    </div>

                    <div>
                      <label className="text-gray-500 font-medium block mb-1">联系电话 (只读)</label>
                      <div className="bg-gray-100/80 border border-gray-200/50 rounded-xl px-3.5 py-2.5 text-gray-800 font-mono">
                        {viewingApp.contactPhone || '13812345678'}
                      </div>
                    </div>

                    <div>
                      <label className="text-gray-500 font-medium block mb-1">申请时间 (只读)</label>
                      <div className="bg-gray-100/80 border border-gray-200/50 rounded-xl px-3.5 py-2.5 text-gray-800 font-mono">
                        {viewingApp.applyTime}
                      </div>
                    </div>

                    <div>
                      <label className="text-gray-500 font-medium block mb-1">使用位置（起止） (只读)</label>
                      <div className="bg-blue-50/80 border border-blue-200/60 rounded-xl px-3.5 py-2.5 text-blue-700 font-bold font-mono">
                        {viewingApp.location}
                      </div>
                    </div>

                    <div>
                      <label className="text-gray-500 font-medium block mb-1">申请使用开始时间 (只读)</label>
                      <div className="bg-gray-100/80 border border-gray-200/50 rounded-xl px-3.5 py-2.5 text-gray-800 font-mono">
                        {viewingApp.usageStartDate}
                      </div>
                    </div>

                    <div>
                      <label className="text-gray-500 font-medium block mb-1">申请使用结束时间 (只读)</label>
                      <div className="bg-gray-100/80 border border-gray-200/50 rounded-xl px-3.5 py-2.5 text-gray-800 font-mono">
                        {viewingApp.usageEndDate}
                      </div>
                    </div>

                    <div>
                      <label className="text-gray-500 font-medium block mb-1">申请用途与说明 (只读)</label>
                      <div className="bg-gray-100/80 border border-gray-200/50 rounded-xl px-3.5 py-2.5 text-gray-700 leading-relaxed">
                        {viewingApp.usagePlan || '涂鸦区域建设规划说明与使用申请。'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ===== COLUMN 2: 我的审批结果 (5 / 12) - 宽度较大 ===== */}
                <div className="col-span-12 lg:col-span-5 bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-blue-600" />
                      <h3 className="font-bold text-gray-900 text-base">我的审批历史</h3>
                    </div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold">
                      已完成
                    </span>
                  </div>

                  {/* 审批结论 */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 block">我的审批结论</label>
                    <div className={`p-4 rounded-xl border flex items-center justify-between ${
                      viewingApp.myApprovalResult === '同意' || viewingApp.myApprovalResult === '通过'
                        ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800'
                        : 'bg-rose-50/80 border-rose-200 text-rose-800'
                    }`}>
                      <div className="font-black text-sm flex items-center gap-2">
                        <CheckCircle2 size={18} />
                        <span>{viewingApp.myApprovalResult || '同意'}</span>
                      </div>
                      <span className="text-xs font-mono opacity-80">{viewingApp.myApprovalTime || '2026-08-04 10:30'}</span>
                    </div>
                  </div>

                  {/* 审批意见 */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 block">我的审批意见</label>
                    <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-4 text-xs text-gray-800 leading-relaxed min-h-[120px]">
                      {viewingApp.myApprovalComment || '同意申请，符合芙蓉隧道文化空间规划要求。'}
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={() => setViewingApp(null)}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      关闭界面
                    </button>
                  </div>
                </div>

                {/* ===== COLUMN 3: 过程记录 (3 / 12) - 宽度较小 ===== */}
                <div className="col-span-12 lg:col-span-3 bg-gray-50/80 rounded-2xl border border-gray-200/80 p-4 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200/60">
                    <div className="flex items-center gap-1.5">
                      <Clock size={16} className="text-blue-600" />
                      <h3 className="font-bold text-gray-900 text-sm">过程记录</h3>
                    </div>
                    <span className="text-[10px] bg-gray-200/80 text-gray-600 font-medium px-2 py-0.5 rounded-full">
                      时序追踪
                    </span>
                  </div>

                  {/* Step Timeline */}
                  <div className="space-y-4 text-xs pt-1">
                    {viewingApp.approvalLogs?.map((log, idx) => (
                      <div key={idx} className="relative pl-6 pb-2 border-l-2 border-emerald-200 last:border-l-0 last:pb-0">
                        <div className="absolute -left-[11px] top-0.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shadow-2xs">
                          ✓
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-gray-900">{log.step}</span>
                            <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded">
                              {log.action}
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-500">{log.reviewer}</div>
                          <div className="text-[10px] text-gray-400 font-mono">{log.timestamp}</div>
                          {log.comment && (
                            <div className="bg-white border border-gray-200/80 rounded-lg p-2 text-[11px] text-gray-700 mt-1 shadow-2xs">
                              {log.comment}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* Modal 3: 撤回审批 Confirm Modal */}
      {revokingApp && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-md overflow-hidden font-sans animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
                <AlertCircle size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-gray-900 text-base">确认撤回该笔审批？</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  撤回后，该申请将被移回【待审批】列表中，您可以重新进行审批考量。
                </p>
              </div>
              <div className="bg-gray-50 border border-gray-200/60 rounded-xl p-3 text-left text-xs space-y-1 text-gray-700">
                <div><span className="text-gray-400">申请单位：</span><span className="font-bold">{revokingApp.applicantOrg}</span></div>
                <div><span className="text-gray-400">使用位置：</span><span className="font-mono text-blue-600 font-bold">{revokingApp.location}</span></div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-slate-50/50">
              <button
                type="button"
                onClick={() => setRevokingApp(null)}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmRevoke}
                className="px-6 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold rounded-xl text-xs shadow-sm transition-all cursor-pointer"
              >
                确认撤回
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
