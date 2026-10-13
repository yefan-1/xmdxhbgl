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
  Info,
  Eye,
  Maximize2
} from 'lucide-react';

export interface GraffitiContentAppItem {
  id: string;
  title: string;                // 主题
  description: string;          // 构想说明
  imageUrl: string;             // 设计效果图/稿件图片
  location: string;             // 使用位置（起止）
  applyTime: string;            // 申请时间
  applicantOrg: string;         // 申请单位
  applicantName: string;        // 申请人
  contactPhone?: string;        // 联系电话
  status: string;               // 当前审批状态 e.g. '待校团委审批' | '待辅导员审批' | '待单位负责人审批' | '审批通过' | '审批不通过' | '已撤回'
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

// Initial Mock Data
const INITIAL_PENDING_APPS: GraffitiContentAppItem[] = [
  {
    id: 'gra-content-p1',
    title: '“代码与诗篇”人工智能与青年愿景主题壁画',
    description: '作品以流动的数据线条与凤凰花融合，展现信息学院学子以代码筑梦、科技报国的艺术构想。配色明快活泼，不含商业宣传元素。',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&q=80',
    location: 'K12+300.00 ~ K12+315.00 (左壁)',
    applyTime: '2026-08-08 09:30',
    applicantOrg: '计算机科学与技术系',
    applicantName: '张宇轩',
    contactPhone: '13812345678',
    status: '待校团委审批',
    approvalLogs: [
      { step: '提交涂鸦内容申请', reviewer: '张宇轩 (申请人)', action: '已提交', comment: '提交“代码与诗篇”壁画设计高清稿件与色彩说明。', timestamp: '2026-08-08 09:30' },
      { step: '辅导员审批', reviewer: '辅导员 · 郭一凡', action: '通过', comment: '内容积极向上，符合校园文化艺术阵地管理要求。', timestamp: '2026-08-08 10:15' },
      { step: '单位负责人审批', reviewer: '单位负责人 · 林院长', action: '通过', comment: '同意提交校团委终审。', timestamp: '2026-08-08 11:30' }
    ]
  },
  {
    id: 'gra-content-p2',
    title: '“再见芙蓉，你好未来”2026届毕业季手绘长廊',
    description: '表现毕业学子对母校的感恩与眷恋，画面主打嘉庚建筑群与建南大会堂剪影，色彩温馨动人，寄托不舍与祝福。',
    imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80',
    location: 'K12+320.00 ~ K12+335.00 (右壁)',
    applyTime: '2026-08-08 11:15',
    applicantOrg: '艺术学院青年志愿者协会',
    applicantName: '陈静',
    contactPhone: '13988887777',
    status: '待辅导员审批',
    approvalLogs: [
      { step: '提交涂鸦内容申请', reviewer: '陈静 (申请人)', action: '已提交', comment: '提交毕业季主题涂鸦稿件。', timestamp: '2026-08-08 11:15' }
    ]
  },
  {
    id: 'gra-content-p3',
    title: '“深海科考与蓝色梦想”科普文化墙',
    description: '以“嘉庚号”科考船深海探测为核心题材，绘制深海生物与海洋保护图景，向师生普及海洋科学知识。',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
    location: 'K12+350.00 ~ K12+365.00 (左壁)',
    applyTime: '2026-08-07 16:20',
    applicantOrg: '海洋与地球学院团党委',
    applicantName: '黄美玲',
    contactPhone: '13655554444',
    status: '待单位负责人审批',
    approvalLogs: [
      { step: '提交涂鸦内容申请', reviewer: '黄美玲 (申请人)', action: '已提交', comment: '提交海洋科普壁画稿件。', timestamp: '2026-08-07 16:20' },
      { step: '辅导员审批', reviewer: '辅导员 · 陈老师', action: '通过', comment: '主题新颖，推荐申报。', timestamp: '2026-08-07 17:00' }
    ]
  },
  {
    id: 'gra-content-p4',
    title: '“世界同心”多语种文化手绘交流墙',
    description: '融入各国友好祝福与外文书法艺术，展现厦大国际化办学氛围与多元文化交融的美好愿景。',
    imageUrl: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&q=80',
    location: 'K12+380.00 ~ K12+395.00 (右壁)',
    applyTime: '2026-08-07 14:00',
    applicantOrg: '外文学院学生会',
    applicantName: '李嘉欣',
    contactPhone: '13566668888',
    status: '待校团委审批',
    approvalLogs: [
      { step: '提交涂鸦内容申请', reviewer: '李嘉欣 (申请人)', action: '已提交', comment: '提交文化长廊设计草图。', timestamp: '2026-08-07 14:00' },
      { step: '辅导员审批', reviewer: '辅导员 · 张老师', action: '通过', comment: '审核通过。', timestamp: '2026-08-07 14:40' },
      { step: '单位负责人审批', reviewer: '单位负责人 · 王书记', action: '通过', comment: '同意。', timestamp: '2026-08-07 15:20' }
    ]
  },
  {
    id: 'gra-content-p5',
    title: '“量子遐想”物理探索艺术壁画',
    description: '抽象几何与现代粒子轨迹结合，用色彩表达物理学中的对称与守恒之美。',
    imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80',
    location: 'K12+410.00 ~ K12+425.00 (左壁)',
    applyTime: '2026-08-06 10:45',
    applicantOrg: '物理科学与技术学院',
    applicantName: '赵伟',
    contactPhone: '13799990000',
    status: '待辅导员审批',
    approvalLogs: [
      { step: '提交涂鸦内容申请', reviewer: '赵伟 (申请人)', action: '已提交', comment: '提交物理学院涂鸦效果图。', timestamp: '2026-08-06 10:45' }
    ]
  }
];

const INITIAL_COMPLETED_APPS: GraffitiContentAppItem[] = [
  {
    id: 'gra-content-c1',
    title: '“新浪潮”新闻传播历史演变插画墙',
    description: '梳理从活字印刷到现代数字媒体的发展历程，画面具有浓厚的时代感与艺术冲击力。',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
    location: 'K12+310.00 ~ K12+325.00 (左壁)',
    applyTime: '2026-08-03 14:00',
    applicantOrg: '新闻传播学院',
    applicantName: '刘子涵',
    contactPhone: '13911112222',
    status: '审批通过',
    myApprovalResult: '同意',
    myApprovalTime: '2026-08-04 10:30',
    myApprovalComment: '同意申请，构思巧妙，思想导向正确，符合芙蓉隧道涂鸦内容要求。',
    approvalLogs: [
      { step: '提交涂鸦内容申请', reviewer: '刘子涵 (申请人)', action: '已提交', comment: '提交新闻传播历史壁画稿。', timestamp: '2026-08-03 14:00' },
      { step: '辅导员审批', reviewer: '辅导员 · 高老师', action: '通过', comment: '审核通过。', timestamp: '2026-08-03 15:00' },
      { step: '单位负责人审批', reviewer: '单位负责人 · 余书记', action: '通过', comment: '同意。', timestamp: '2026-08-03 16:30' },
      { step: '校团委终审', reviewer: '校团委管理组', action: '通过', comment: '同意申请，构思巧妙，思想导向正确。', timestamp: '2026-08-04 10:30' }
    ]
  },
  {
    id: 'gra-content-c2',
    title: '“分子万象”化学元素艺术墙',
    description: '将元素周期表中的关键元素转化为萌系卡通形象与科学图腾，趣味科普。',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
    location: 'K12+330.00 ~ K12+345.00 (右壁)',
    applyTime: '2026-08-02 16:50',
    applicantOrg: '化学化工学院',
    applicantName: '孙瑞',
    contactPhone: '13822223333',
    status: '审批通过',
    myApprovalResult: '同意',
    myApprovalTime: '2026-08-03 11:20',
    myApprovalComment: '同意，科普性与趣味性兼备。',
    approvalLogs: [
      { step: '提交涂鸦内容申请', reviewer: '孙瑞 (申请人)', action: '已提交', comment: '提交化学元素图谱壁画草稿。', timestamp: '2026-08-02 16:50' },
      { step: '辅导员审批', reviewer: '辅导员 · 谢老师', action: '通过', comment: '通过。', timestamp: '2026-08-02 17:30' },
      { step: '校团委终审', reviewer: '校团委管理组', action: '通过', comment: '同意，科普性与趣味性兼备。', timestamp: '2026-08-03 11:20' }
    ]
  },
  {
    id: 'gra-content-c3',
    title: '“商业新纪元”商业赞助合作手绘墙',
    description: '展示某企业赞助LOGO与品牌宣传标语，结合金融图表进行墙面创作。',
    imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80',
    location: 'K12+360.00 ~ K12+375.00 (左壁)',
    applyTime: '2026-08-01 10:15',
    applicantOrg: '经济学院团党委',
    applicantName: '方思远',
    contactPhone: '13733334444',
    status: '审批不通过',
    myApprovalResult: '不同意',
    myApprovalTime: '2026-08-02 09:40',
    myApprovalComment: '稿件包含过多商业赞助标识与促销元素，违背隧道阵地公益宣教性质，不予通过。',
    approvalLogs: [
      { step: '提交涂鸦内容申请', reviewer: '方思远 (申请人)', action: '已提交', comment: '提交商科文化壁画稿。', timestamp: '2026-08-01 10:15' },
      { step: '辅导员审批', reviewer: '辅导员 · 许老师', action: '通过', comment: '初步通过。', timestamp: '2026-08-01 11:00' },
      { step: '校团委终审', reviewer: '校团委管理组', action: '拒绝', comment: '稿件包含过多商业赞助标识与促销元素，违背隧道阵地公益宣教性质，不予通过。', timestamp: '2026-08-02 09:40' }
    ]
  },
  {
    id: 'gra-content-c4',
    title: '“暖心校园”志愿服务故事插画',
    description: '讲述厦大青年志愿者无偿献血、支教扶贫与马拉松志愿服务的感人瞬间。',
    imageUrl: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80',
    location: 'K12+400.00 ~ K12+415.00 (右壁)',
    applyTime: '2026-07-30 11:00',
    applicantOrg: '管理学院青年志愿者队',
    applicantName: '吴晓敏',
    contactPhone: '13644445555',
    status: '审批通过',
    myApprovalResult: '同意',
    myApprovalTime: '2026-07-31 14:15',
    myApprovalComment: '同意，传递正能量。',
    approvalLogs: [
      { step: '提交涂鸦内容申请', reviewer: '吴晓敏 (申请人)', action: '已提交', comment: '提交志愿服务故事稿。', timestamp: '2026-07-30 11:00' },
      { step: '校团委终审', reviewer: '校团委管理组', action: '通过', comment: '同意，传递正能量。', timestamp: '2026-07-31 14:15' }
    ]
  }
];

export default function TunnelContentApprovalModule() {
  // State for Lists
  const [pendingApps, setPendingApps] = useState<GraffitiContentAppItem[]>(INITIAL_PENDING_APPS);
  const [completedApps, setCompletedApps] = useState<GraffitiContentAppItem[]>(INITIAL_COMPLETED_APPS);

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
  const [reviewingApp, setReviewingApp] = useState<GraffitiContentAppItem | null>(null);
  const [approvalDecision, setApprovalDecision] = useState<'同意' | '不同意'>('同意');
  const [approvalComment, setApprovalComment] = useState('同意申请，稿件内容符合芙蓉隧道涂鸦内容管理规定。');

  const [viewingApp, setViewingApp] = useState<GraffitiContentAppItem | null>(null);
  const [revokingApp, setRevokingApp] = useState<GraffitiContentAppItem | null>(null);

  // Image Preview Modal State
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

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
  const filterList = (list: GraffitiContentAppItem[]) => {
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

    const updatedItem: GraffitiContentAppItem = {
      ...reviewingApp,
      status: approvalDecision === '同意' ? '审批通过' : '审批不通过',
      myApprovalResult: approvalDecision,
      myApprovalTime: formattedNow,
      myApprovalComment: approvalComment || (approvalDecision === '同意' ? '同意申请。' : '不同意该申请。'),
      approvalLogs: [
        ...(reviewingApp.approvalLogs || []),
        {
          step: '校团委审批',
          reviewer: '校团委 · 管理员',
          action: approvalDecision === '同意' ? '通过' : '拒绝',
          comment: approvalComment || (approvalDecision === '同意' ? '同意申请。' : '不同意该申请。'),
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
    const resetItem: GraffitiContentAppItem = {
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
            隧道涂鸦内容审批
          </h1>
        </div>
      </div>

      {/* 2. 查询条件 Card: 申请单位、申请时间（时间段） */}
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
            /* 待审批列表字段：图片、主题、构想说明、使用位置（起止）、申请时间、申请单位、申请人，操作区域为：审批 */
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-gray-50/90 text-gray-500 font-bold border-b border-gray-200/80">
                <tr>
                  <th className="sticky left-0 z-20 bg-gray-50 py-3.5 px-4 whitespace-nowrap min-w-[80px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] border-b border-gray-200/80">
                    图片
                  </th>
                  <th className="py-3.5 px-4 whitespace-nowrap min-w-[180px]">主题</th>
                  <th className="py-3.5 px-4 whitespace-nowrap min-w-[220px]">构想说明</th>
                  <th className="py-3.5 px-4 whitespace-nowrap min-w-[200px]">使用位置（起止）</th>
                  <th className="py-3.5 px-4 whitespace-nowrap min-w-[140px]">申请时间</th>
                  <th className="py-3.5 px-4 whitespace-nowrap min-w-[160px]">申请单位</th>
                  <th className="py-3.5 px-4 whitespace-nowrap min-w-[100px]">申请人</th>
                  <th className="sticky right-0 z-20 bg-gray-50 py-3.5 px-4 text-center whitespace-nowrap min-w-[100px] shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.06)] border-b border-gray-200/80">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                {pagedList.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-400">
                      暂无待审批的涂鸦内容申请记录
                    </td>
                  </tr>
                ) : (
                  pagedList.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/40 transition-colors group">
                      {/* 图片 */}
                      <td className="sticky left-0 z-10 bg-white group-hover:bg-blue-50/40 py-2.5 px-4 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] transition-colors">
                        <div
                          onClick={() => setPreviewImageUrl(item.imageUrl)}
                          className="w-12 h-12 rounded-lg border border-gray-200 overflow-hidden bg-gray-100 cursor-pointer relative group/img shadow-2xs"
                        >
                          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform group-hover/img:scale-110" />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity text-white">
                            <Eye size={14} />
                          </div>
                        </div>
                      </td>
                      {/* 主题 */}
                      <td className="py-3.5 px-4 font-bold text-gray-900 max-w-[200px] truncate" title={item.title}>
                        {item.title}
                      </td>
                      {/* 构想说明 */}
                      <td className="py-3.5 px-4 text-gray-600 max-w-[260px] truncate" title={item.description}>
                        {item.description}
                      </td>
                      {/* 使用位置（起止） */}
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-600 whitespace-nowrap">
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
                      {/* 操作: 审批 */}
                      <td className="sticky right-0 z-10 bg-white group-hover:bg-blue-50/40 py-3.5 px-4 text-center whitespace-nowrap shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.06)] transition-colors">
                        <button
                          type="button"
                          onClick={() => {
                            setReviewingApp(item);
                            setApprovalDecision('同意');
                            setApprovalComment('同意申请，稿件内容符合芙蓉隧道涂鸦内容管理规定。');
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
            /* 已审批列表字段：图片、主题、构想说明、使用位置（起止）、我的审批结论、我的审批时间、当前审批状态、申请时间、申请单位、申请人，操作区域为：查看、撤回审批 */
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-gray-50/90 text-gray-500 font-bold border-b border-gray-200/80">
                <tr>
                  <th className="sticky left-0 z-20 bg-gray-50 py-3.5 px-4 whitespace-nowrap min-w-[80px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] border-b border-gray-200/80">
                    图片
                  </th>
                  <th className="py-3.5 px-4 whitespace-nowrap min-w-[180px]">主题</th>
                  <th className="py-3.5 px-4 whitespace-nowrap min-w-[200px]">构想说明</th>
                  <th className="py-3.5 px-4 whitespace-nowrap min-w-[200px]">使用位置（起止）</th>
                  <th className="py-3.5 px-4 whitespace-nowrap min-w-[120px]">我的审批结论</th>
                  <th className="py-3.5 px-4 whitespace-nowrap min-w-[140px]">我的审批时间</th>
                  <th className="py-3.5 px-4 whitespace-nowrap min-w-[130px]">当前审批状态</th>
                  <th className="py-3.5 px-4 whitespace-nowrap min-w-[140px]">申请时间</th>
                  <th className="py-3.5 px-4 whitespace-nowrap min-w-[160px]">申请单位</th>
                  <th className="py-3.5 px-4 whitespace-nowrap min-w-[100px]">申请人</th>
                  <th className="sticky right-0 z-20 bg-gray-50 py-3.5 px-4 text-center whitespace-nowrap min-w-[160px] shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.06)] border-b border-gray-200/80">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                {pagedList.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-12 text-center text-gray-400">
                      暂无已审批的涂鸦内容申请记录
                    </td>
                  </tr>
                ) : (
                  pagedList.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/40 transition-colors group">
                      {/* 图片 */}
                      <td className="sticky left-0 z-10 bg-white group-hover:bg-blue-50/40 py-2.5 px-4 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] transition-colors">
                        <div
                          onClick={() => setPreviewImageUrl(item.imageUrl)}
                          className="w-12 h-12 rounded-lg border border-gray-200 overflow-hidden bg-gray-100 cursor-pointer relative group/img shadow-2xs"
                        >
                          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform group-hover/img:scale-110" />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity text-white">
                            <Eye size={14} />
                          </div>
                        </div>
                      </td>
                      {/* 主题 */}
                      <td className="py-3.5 px-4 font-bold text-gray-900 max-w-[180px] truncate" title={item.title}>
                        {item.title}
                      </td>
                      {/* 构想说明 */}
                      <td className="py-3.5 px-4 text-gray-600 max-w-[220px] truncate" title={item.description}>
                        {item.description}
                      </td>
                      {/* 使用位置（起止） */}
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-600 whitespace-nowrap">
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
                        {item.myApprovalTime || '2026-08-04 10:30'}
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

        {/* 4. 分页控制区域 (与海报张贴审批一致) */}
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
                  隧道涂鸦内容审批
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

                  {/* 涂鸦草图预览 */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 block">设计草稿/效果图</label>
                    <div
                      onClick={() => setPreviewImageUrl(reviewingApp.imageUrl)}
                      className="w-full h-40 rounded-xl border border-gray-200 overflow-hidden bg-gray-100 cursor-pointer relative group/preview shadow-inner"
                    >
                      <img src={reviewingApp.imageUrl} alt={reviewingApp.title} className="w-full h-full object-cover group-hover/preview:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/preview:opacity-100 flex items-center justify-center transition-opacity text-white font-bold text-xs gap-1.5">
                        <Maximize2 size={16} />
                        <span>点击放大查看高清图</span>
                      </div>
                    </div>
                  </div>

                  {/* 一行一个字段 */}
                  <div className="space-y-3.5 text-xs">
                    {/* 1. 主题 */}
                    <div>
                      <label className="text-gray-500 font-medium block mb-1">
                        主题 <span className="text-gray-400 font-normal">(只读)</span>
                      </label>
                      <div className="bg-gray-100/80 border border-gray-200/50 rounded-xl px-3.5 py-2.5 text-gray-900 font-bold">
                        {reviewingApp.title}
                      </div>
                    </div>

                    {/* 2. 构想说明 */}
                    <div>
                      <label className="text-gray-500 font-medium block mb-1">
                        构想说明 <span className="text-gray-400 font-normal">(只读)</span>
                      </label>
                      <div className="bg-gray-100/80 border border-gray-200/50 rounded-xl px-3.5 py-2.5 text-gray-700 leading-relaxed">
                        {reviewingApp.description}
                      </div>
                    </div>

                    {/* 3. 使用位置（起止） */}
                    <div>
                      <label className="text-gray-500 font-medium block mb-1">
                        使用位置（起止） <span className="text-gray-400 font-normal">(只读)</span>
                      </label>
                      <div className="bg-blue-50/80 border border-blue-200/60 rounded-xl px-3.5 py-2.5 text-blue-700 font-bold font-mono">
                        {reviewingApp.location}
                      </div>
                    </div>

                    {/* 4. 申请单位 */}
                    <div>
                      <label className="text-gray-500 font-medium block mb-1">
                        申请单位 <span className="text-gray-400 font-normal">(只读)</span>
                      </label>
                      <div className="bg-gray-100/80 border border-gray-200/50 rounded-xl px-3.5 py-2.5 text-gray-900 font-bold">
                        {reviewingApp.applicantOrg}
                      </div>
                    </div>

                    {/* 5. 申请人 */}
                    <div>
                      <label className="text-gray-500 font-medium block mb-1">
                        申请人 <span className="text-gray-400 font-normal">(只读)</span>
                      </label>
                      <div className="bg-gray-100/80 border border-gray-200/50 rounded-xl px-3.5 py-2.5 text-gray-900 font-bold">
                        {reviewingApp.applicantName}
                      </div>
                    </div>

                    {/* 6. 联系电话 */}
                    <div>
                      <label className="text-gray-500 font-medium block mb-1">
                        联系电话 <span className="text-gray-400 font-normal">(只读)</span>
                      </label>
                      <div className="bg-gray-100/80 border border-gray-200/50 rounded-xl px-3.5 py-2.5 text-gray-800 font-mono">
                        {reviewingApp.contactPhone || '13812345678'}
                      </div>
                    </div>

                    {/* 7. 申请时间 */}
                    <div>
                      <label className="text-gray-500 font-medium block mb-1">
                        申请时间 <span className="text-gray-400 font-normal">(只读)</span>
                      </label>
                      <div className="bg-gray-100/80 border border-gray-200/50 rounded-xl px-3.5 py-2.5 text-gray-800 font-mono">
                        {reviewingApp.applyTime}
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
                            setApprovalComment('同意申请，稿件内容符合芙蓉隧道涂鸦内容管理规定。');
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
                            setApprovalComment('不同意该申请，稿件内容或构想有待进一步调整。');
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
                      <label className="text-xs font-bold text-gray-800 flex items-center justify-between">
                        <span>审批意见 <span className="text-gray-400 font-normal">(可选)</span></span>
                      </label>
                      <textarea
                        rows={5}
                        value={approvalComment}
                        onChange={(e) => setApprovalComment(e.target.value)}
                        placeholder="请输入审批意见说明..."
                        className="w-full bg-gray-50/80 border border-gray-200 rounded-xl p-3.5 text-xs text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all leading-relaxed resize-none"
                      />
                    </div>
                  </div>

                  {/* 提交按钮 */}
                  <div className="pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={handleConfirmApproval}
                      className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Send size={15} />
                      <span>提交审批结论</span>
                    </button>
                  </div>
                </div>

                {/* ===== COLUMN 3: 过程记录 (3 / 12) - 宽度较窄 ===== */}
                <div className="col-span-12 lg:col-span-3 bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-500" />
                      <h3 className="font-bold text-gray-900 text-xs">过程记录</h3>
                    </div>
                    <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded">时序追踪</span>
                  </div>

                  <div className="space-y-4 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-gray-200 before:z-0 py-1">
                    {(reviewingApp.approvalLogs || []).map((log, index) => {
                      const isCompleted = log.action === '已提交' || log.action === '通过';
                      const isRejected = log.action === '拒绝' || log.action === '不通过';

                      return (
                        <div key={index} className="relative z-10 flex gap-3 text-xs">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                            isCompleted
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : isRejected
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-blue-600 text-white shadow-xs'
                          }`}>
                            {index + 1}
                          </div>

                          <div className="flex-1 bg-gray-50/80 rounded-xl p-3 border border-gray-200/60 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-gray-900 text-[11px]">{log.step}</span>
                              <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                                isCompleted
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : isRejected
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {log.action}
                              </span>
                            </div>
                            <div className="text-[11px] text-gray-600 font-medium">{log.reviewer}</div>
                            <div className="text-[10px] text-gray-400 font-mono">{log.timestamp}</div>
                            {log.comment && (
                              <div className="text-[11px] text-gray-600 bg-white p-2 rounded-lg border border-gray-100 mt-1 leading-normal">
                                “{log.comment}”
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* Modal 2: 查看 Details Modal */}
      {viewingApp && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl w-[96vw] max-w-5xl max-h-[90vh] flex flex-col overflow-hidden font-sans my-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <FileText size={18} />
                </div>
                <h2 className="font-extrabold text-gray-900 text-base">
                  涂鸦内容审批详情
                </h2>
                <span className={`px-3 py-0.5 rounded-full text-xs font-bold border ${
                  viewingApp.status === '审批通过'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
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

            <div className="p-6 overflow-y-auto space-y-6 bg-slate-50/30">
              {/* Draft Banner & Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
                <div className="sm:col-span-1 space-y-2">
                  <label className="text-xs font-bold text-gray-500">设计草图/效果图</label>
                  <div
                    onClick={() => setPreviewImageUrl(viewingApp.imageUrl)}
                    className="w-full h-48 rounded-xl border border-gray-200 overflow-hidden bg-gray-100 cursor-pointer relative group/viewimg"
                  >
                    <img src={viewingApp.imageUrl} alt={viewingApp.title} className="w-full h-full object-cover group-hover/viewimg:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/viewimg:opacity-100 flex items-center justify-center text-white text-xs font-bold gap-1 transition-opacity">
                      <Maximize2 size={16} />
                      <span>查看大图</span>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2 space-y-3 text-xs">
                  <div>
                    <span className="text-gray-400 font-medium">主题：</span>
                    <span className="font-bold text-gray-900 text-sm block mt-0.5">{viewingApp.title}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium">构想说明：</span>
                    <p className="text-gray-700 leading-relaxed mt-0.5 bg-gray-50 p-3 rounded-xl border border-gray-100">{viewingApp.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <span className="text-gray-400 font-medium">使用位置（起止）：</span>
                      <span className="font-mono font-bold text-blue-600 block">{viewingApp.location}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 font-medium">申请单位：</span>
                      <span className="font-bold text-gray-900 block">{viewingApp.applicantOrg}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 font-medium">申请人：</span>
                      <span className="font-bold text-gray-900 block">{viewingApp.applicantName} ({viewingApp.contactPhone || '13812345678'})</span>
                    </div>
                    <div>
                      <span className="text-gray-400 font-medium">申请时间：</span>
                      <span className="font-mono text-gray-700 block">{viewingApp.applyTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* My Approval Decision Block */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-3">
                <h3 className="font-bold text-gray-900 text-xs flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-blue-600" />
                  <span>我的审批结果</span>
                </h3>
                <div className="flex items-center gap-4 text-xs bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                  <div>
                    <span className="text-gray-400">结论：</span>
                    <span className={`font-bold ml-1 ${viewingApp.myApprovalResult === '同意' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {viewingApp.myApprovalResult || '同意'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">时间：</span>
                    <span className="font-mono text-gray-700 ml-1">{viewingApp.myApprovalTime || viewingApp.applyTime}</span>
                  </div>
                </div>
                {viewingApp.myApprovalComment && (
                  <div className="text-xs text-gray-700 bg-blue-50/50 p-3 rounded-xl border border-blue-100/60">
                    <span className="font-bold text-blue-900">审批意见：</span> {viewingApp.myApprovalComment}
                  </div>
                )}
              </div>

              {/* Timeline Logs */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-3">
                <h3 className="font-bold text-gray-900 text-xs flex items-center gap-2">
                  <Clock size={16} className="text-gray-500" />
                  <span>流转日志</span>
                </h3>
                <div className="space-y-3">
                  {(viewingApp.approvalLogs || []).map((log, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-900">{log.step}</span>
                          <span className="font-mono text-gray-400 text-[10px]">{log.timestamp}</span>
                        </div>
                        <div className="text-gray-600">{log.reviewer} · <strong className="text-gray-800">{log.action}</strong></div>
                        {log.comment && <div className="text-gray-500 italic mt-1">“{log.comment}”</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-white flex justify-end">
              <button
                type="button"
                onClick={() => setViewingApp(null)}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: 撤回审批 Confirm Modal */}
      {revokingApp && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl w-full max-w-md p-6 font-sans space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center shrink-0">
                <AlertCircle size={22} />
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900 text-base">确认撤回审批结果？</h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5">撤回后该申请将重新回到“待审批”列表中。</p>
              </div>
            </div>

            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/60 text-xs space-y-1.5 text-amber-900">
              <div><span className="text-amber-700 font-medium">主题：</span> <strong className="font-bold">{revokingApp.title}</strong></div>
              <div><span className="text-amber-700 font-medium">申请单位：</span> <span>{revokingApp.applicantOrg}</span></div>
              <div><span className="text-amber-700 font-medium">使用位置：</span> <span className="font-mono font-bold">{revokingApp.location}</span></div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRevokingApp(null)}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmRevoke}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-sm shadow-rose-500/20 transition-all cursor-pointer"
              >
                确认撤回
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Image Preview Fullscreen Modal */}
      {previewImageUrl && (
        <div
          onClick={() => setPreviewImageUrl(null)}
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-200"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img src={previewImageUrl} alt="Preview" className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl border border-white/20" />
            <button
              type="button"
              onClick={() => setPreviewImageUrl(null)}
              className="absolute -top-12 right-0 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
