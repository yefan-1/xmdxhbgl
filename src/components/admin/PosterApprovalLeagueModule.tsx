import React, { useState } from 'react';
import { 
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  RotateCcw,
  QrCode,
  Check,
  Plus,
  Trash2,
  Search
} from 'lucide-react';

export interface PostingLocationItem {
  areaName: string;
  timeRange: string;
  campus?: string;
  boardName?: string;
  spot?: string;
  dates?: string[];
}

export interface QrCodeListItem {
  id: string;
  no: string;
  content: string;
  issuedAt: string;
}

export interface PosterAppItem {
  id: string;
  title: string;
  posterImageUrl: string;
  submittedAt: string;     // 申请时间
  approvedAt: string;      // 审核通过时间
  qrCodeIssuedAt?: string; // 二维码发放时间
  qrCodeNo?: string;       // 巡检防伪二维码编号
  issuerName?: string;     // 发放人
  qrCodeCount?: number;    // 发放数量
  orgName: string;
  applicantName: string;
  applicantType?: string;
  status: '待发放' | '已发放' | string;
  posterSize: string;
  postingLocations: PostingLocationItem[];
  contactPhone?: string;
  notes?: string;
  qrCodeList?: QrCodeListItem[];
}

// Helper to generate a 32-character random lowercase string
const generateRandom32String = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const INITIAL_APPLICATIONS: PosterAppItem[] = [
  {
    id: 'APP-20260808-001',
    title: '“凤凰花开”2026年毕业生专场草地音乐节',
    posterImageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&q=80',
    submittedAt: '2026-08-08 10:25',
    approvedAt: '2026-08-08 16:00',
    orgName: '校学生会宣传部',
    applicantName: '陈立豪',
    contactPhone: '13850012345',
    status: '待发放',
    posterSize: '2 栏',
    postingLocations: [
      {
        areaName: '三家村 1 号张贴栏 (第 1 - 2 栏)',
        timeRange: '2026-08-10 至 2026-08-12',
        campus: '思明校区',
        boardName: '三家村 1 号张贴栏',
        spot: '第 1 - 2 栏',
        dates: ['2026-08-10', '2026-08-11', '2026-08-12']
      },
      {
        areaName: '竞丰餐厅前张贴栏 (第 2 - 3 栏)',
        timeRange: '2026-08-10 至 2026-08-12',
        campus: '翔安校区',
        boardName: '竞丰餐厅前张贴栏',
        spot: '第 2 - 3 栏',
        dates: ['2026-08-10', '2026-08-11', '2026-08-12']
      },
      {
        areaName: '芙蓉餐厅侧栏 (第 1 栏)',
        timeRange: '2026-08-10 至 2026-08-12',
        campus: '思明校区',
        boardName: '芙蓉餐厅侧栏',
        spot: '第 1 栏',
        dates: ['2026-08-10', '2026-08-11', '2026-08-12']
      }
    ],
    qrCodeList: [
      { id: 'qr-001', no: 'QR-20260808-001', content: 'wknxvhqazmoplrtyuiosdfghjklxcvbn', issuedAt: '2026-08-08 16:30' },
      { id: 'qr-002', no: 'QR-20260808-002', content: 'qazwsxedcrfvtgbyhnujmikolpzxasqw', issuedAt: '2026-08-08 16:32' }
    ]
  },
  {
    id: 'APP-20260807-003',
    title: '计算机系“智算未来”人工智能前沿学术讲座',
    posterImageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80',
    submittedAt: '2026-08-07 14:10',
    approvedAt: '2026-08-07 17:30',
    orgName: '计算机科学与技术系',
    applicantName: '张敏涵',
    contactPhone: '13959288812',
    status: '待发放',
    posterSize: '1 栏',
    postingLocations: [
      {
        areaName: '群贤楼主海报栏 (第 3 栏)',
        timeRange: '2026-08-09 至 2026-08-11',
        campus: '思明校区',
        boardName: '群贤楼主海报栏',
        spot: '第 3 栏',
        dates: ['2026-08-09', '2026-08-10', '2026-08-11']
      }
    ],
    qrCodeList: [
      { id: 'qr-003', no: 'QR-20260807-003', content: 'mnbvcxzlkjhgfdsaapoiuytrewq0032', issuedAt: '2026-08-07 17:35' }
    ]
  },
  {
    id: 'APP-20260806-005',
    title: '厦大音协“夏日终曲”不插电吉他夜唱',
    posterImageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80',
    submittedAt: '2026-08-06 16:45',
    approvedAt: '2026-08-06 18:20',
    orgName: '厦大音乐社',
    applicantName: '许泽宇',
    contactPhone: '13779921100',
    status: '待发放',
    posterSize: '2 栏',
    postingLocations: [
      {
        areaName: '三家村 2 号张贴栏 (第 3 - 4 栏)',
        timeRange: '2026-08-08 至 2026-08-10',
        campus: '思明校区',
        boardName: '三家村 2 号张贴栏',
        spot: '第 3 - 4 栏',
        dates: ['2026-08-08', '2026-08-09', '2026-08-10']
      }
    ],
    qrCodeList: []
  },
  {
    id: 'APP-20260805-002',
    title: '“绿动校园”环校无废生活倡议及旧物无偿置换',
    posterImageUrl: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb9?w=600&q=80',
    submittedAt: '2026-08-05 09:30',
    approvedAt: '2026-08-05 14:10',
    qrCodeIssuedAt: '2026-08-05 15:20',
    qrCodeNo: 'QR-20260805-8821',
    issuerName: '校团委（张老师）',
    qrCodeCount: 1,
    orgName: '艺术学院青年志愿者协会',
    applicantName: '李思齐',
    contactPhone: '13600912233',
    status: '已发放',
    posterSize: '1 栏',
    postingLocations: [
      {
        areaName: '芙蓉餐厅侧栏 (第 2 栏)',
        timeRange: '2026-08-06 至 2026-08-08',
        campus: '思明校区',
        boardName: '芙蓉餐厅侧栏',
        spot: '第 2 栏',
        dates: ['2026-08-06', '2026-08-07', '2026-08-08']
      }
    ],
    qrCodeList: [
      { id: 'qr-004', no: 'QR-20260805-8821', content: 'vbnmklosdfghjertyuipaqzxcvbnmkk', issuedAt: '2026-08-05 15:20' }
    ]
  },
  {
    id: 'APP-20260804-008',
    title: '海洋科普进社区暑期社会实践成果展',
    posterImageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80',
    submittedAt: '2026-08-04 11:15',
    approvedAt: '2026-08-04 15:00',
    qrCodeIssuedAt: '2026-08-04 16:05',
    qrCodeNo: 'QR-20260804-9102',
    issuerName: '校团委（李老师）',
    qrCodeCount: 1,
    orgName: '海洋与地球学院团党委',
    applicantName: '郭文轩',
    contactPhone: '13559203344',
    status: '已发放',
    posterSize: '3 栏',
    postingLocations: [
      {
        areaName: '南光餐厅主干道海报栏 (第 1 - 3 栏)',
        timeRange: '2026-08-05 至 2026-08-07',
        campus: '思明校区',
        boardName: '南光餐厅主干道海报栏',
        spot: '第 1 - 3 栏',
        dates: ['2026-08-05', '2026-08-06', '2026-08-07']
      }
    ],
    qrCodeList: [
      { id: 'qr-005', no: 'QR-20260804-9102', content: 'plmkoijnbhuygtvfrdcxswzaqwxsedc', issuedAt: '2026-08-04 16:05' }
    ]
  }
];

export default function PosterApprovalLeagueModule() {
  const [applications, setApplications] = useState<PosterAppItem[]>(INITIAL_APPLICATIONS);

  // Filter States
  const [searchTitle, setSearchTitle] = useState('');
  const [searchOrg, setSearchOrg] = useState('全部单位');
  const [searchStartDate, setSearchStartDate] = useState('');
  const [searchEndDate, setSearchEndDate] = useState('');

  // Main Segmented Tab: pending (待发放) vs completed (已发放)
  const [activeMainTab, setActiveMainTab] = useState<'pending' | 'completed'>('pending');

  // Modal States
  const [viewingApp, setViewingApp] = useState<PosterAppItem | null>(null);
  const [issuingApp, setIssuingApp] = useState<PosterAppItem | null>(null);

  // Sub-modal State: 新增二维码 Modal
  const [isAddQrModalOpen, setIsAddQrModalOpen] = useState(false);
  const [newQrNo, setNewQrNo] = useState('');
  const [newQrContent, setNewQrContent] = useState('');

  // Helper: parse posting locations
  const parsePostingLocationParts = (loc: PostingLocationItem) => {
    let campus = loc.campus || '思明校区';
    let board = loc.boardName || loc.areaName;
    let dates = loc.timeRange;

    if (loc.dates && loc.dates.length > 0) {
      if (loc.dates.length === 1) {
        dates = loc.dates[0];
      } else {
        const sorted = [...loc.dates].sort();
        dates = `${sorted[0]} 至 ${sorted[sorted.length - 1]}`;
      }
    }

    if (loc.spot) {
      board = `${board} (${loc.spot})`;
    }

    return { campus, board, dates };
  };

  // Helper: Render Status Badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case '待发放':
        return (
          <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200/80 rounded-md font-bold text-[11px] inline-flex items-center gap-1">
            <Clock size={12} />
            待发放二维码
          </span>
        );
      case '已发放':
        return (
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-md font-bold text-[11px] inline-flex items-center gap-1">
            <CheckCircle2 size={12} className="text-emerald-600" />
            已发放二维码
          </span>
        );
      default:
        return <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md font-medium text-[11px]">{status}</span>;
    }
  };

  // Helper: Get Approval Timeline
  const getApprovalTimeline = (app: PosterAppItem) => {
    const isIssued = app.status === '已发放' || !!app.qrCodeIssuedAt;

    return [
      {
        title: '提交申请',
        approver: `${app.orgName} - ${app.applicantName}`,
        time: app.submittedAt,
        status: 'completed',
        comment: '申请已提交，等待各级联合审核'
      },
      {
        title: '三级审核通过',
        approver: '指导老师 / 单位领导 / 学生会',
        time: app.approvedAt,
        status: 'completed',
        comment: '选座排期无冲突，内容合规通过'
      },
      {
        title: '巡检二维码发放（团委）',
        approver: '校团委宣传阵地运营组',
        time: isIssued ? (app.qrCodeIssuedAt || '2026-08-08 17:00') : '待发放',
        status: isIssued ? 'completed' : 'active',
        comment: isIssued ? `防伪巡检二维码已核发 [${app.qrCodeNo || 'QR-20260808-001'}]` : '等候校团委生成并下发巡检二维码'
      }
    ];
  };

  // Search Reset Handler
  const handleReset = () => {
    setSearchTitle('');
    setSearchOrg('全部单位');
    setSearchStartDate('');
    setSearchEndDate('');
  };

  // Trigger Open Issue QR Code Modal
  const handleOpenIssueModal = (app: PosterAppItem) => {
    setIssuingApp(app);
  };

  // Open "新增二维码" Sub-Modal
  const handleOpenAddQrModal = () => {
    const randomNo = `QR-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(100 + Math.random() * 900)}`;
    setNewQrNo(randomNo);
    setNewQrContent(generateRandom32String());
    setIsAddQrModalOpen(true);
  };

  // Handle Query (查询) button in "新增二维码" sub-modal
  const handleQueryQrContent = () => {
    if (!issuingApp) return;
    if (!newQrNo.trim()) {
      const serial = `QR-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(100 + Math.random() * 900)}`;
      setNewQrNo(serial);
    }
    setNewQrContent(generateRandom32String());
  };

  // Handle Submit "发放" in "新增二维码" sub-modal
  const handleConfirmAddQrCode = () => {
    if (!issuingApp) return;

    const finalNo = newQrNo.trim() || `QR-${Date.now().toString().slice(-6)}`;
    const finalContent = newQrContent.trim() || generateRandom32String();
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newQrItem: QrCodeListItem = {
      id: `qr-${Date.now()}`,
      no: finalNo,
      content: finalContent,
      issuedAt: nowStr
    };

    setApplications((prev) =>
      prev.map((item) => {
        if (item.id === issuingApp.id) {
          const updatedList = [...(item.qrCodeList || []), newQrItem];
          return {
            ...item,
            status: '已发放',
            qrCodeIssuedAt: nowStr,
            qrCodeNo: finalNo,
            issuerName: item.issuerName || '校团委（张老师）',
            qrCodeCount: updatedList.length,
            qrCodeList: updatedList
          };
        }
        return item;
      })
    );

    // Update active issuingApp in local state
    setIssuingApp((prev) => {
      if (!prev) return null;
      const updatedList = [...(prev.qrCodeList || []), newQrItem];
      return {
        ...prev,
        status: '已发放',
        qrCodeIssuedAt: nowStr,
        qrCodeNo: finalNo,
        issuerName: prev.issuerName || '校团委（张老师）',
        qrCodeCount: updatedList.length,
        qrCodeList: updatedList
      };
    });

    setIsAddQrModalOpen(false);
  };

  // Handle Main Modal Bottom "发放二维码" action
  const handleMainIssueQrCodeAction = () => {
    if (!issuingApp) return;

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    // If no QR codes exist yet, automatically generate one 32-character random string item
    let currentList = issuingApp.qrCodeList || [];
    if (currentList.length === 0) {
      const defaultNo = `QR-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(100 + Math.random() * 900)}`;
      const defaultItem: QrCodeListItem = {
        id: `qr-${Date.now()}`,
        no: defaultNo,
        content: generateRandom32String(),
        issuedAt: nowStr
      };
      currentList = [defaultItem];
    }

    const firstNo = currentList[0]?.no || `QR-${Date.now().toString().slice(-6)}`;

    setApplications((prev) =>
      prev.map((item) => {
        if (item.id === issuingApp.id) {
          return {
            ...item,
            status: '已发放',
            qrCodeIssuedAt: item.qrCodeIssuedAt || nowStr,
            qrCodeNo: item.qrCodeNo || firstNo,
            issuerName: item.issuerName || '校团委（张老师）',
            qrCodeCount: currentList.length,
            qrCodeList: currentList
          };
        }
        return item;
      })
    );

    setIssuingApp(null);
  };

  // Delete QR Code Item from list
  const handleDeleteQrCode = (qrId: string) => {
    if (!issuingApp) return;

    if (confirm('确定要删除该二维码记录吗？')) {
      setApplications((prev) =>
        prev.map((item) => {
          if (item.id === issuingApp.id) {
            const updatedList = (item.qrCodeList || []).filter((q) => q.id !== qrId);
            const isListEmpty = updatedList.length === 0;
            return {
              ...item,
              status: isListEmpty ? '待发放' : '已发放',
              qrCodeList: updatedList
            };
          }
          return item;
        })
      );

      setIssuingApp((prev) => {
        if (!prev) return null;
        const updatedList = (prev.qrCodeList || []).filter((q) => q.id !== qrId);
        const isListEmpty = updatedList.length === 0;
        return {
          ...prev,
          status: isListEmpty ? '待发放' : '已发放',
          qrCodeList: updatedList
        };
      });
    }
  };

  // Revoke QR Code (from main list table)
  const handleRevokeQrCode = (appId: string) => {
    if (confirm('确定要撤回该巡检二维码吗？撤回后海报将重新标记为待发放状态。')) {
      setApplications((prev) =>
        prev.map((item) =>
          item.id === appId
            ? {
                ...item,
                status: '待发放',
                qrCodeIssuedAt: undefined,
                qrCodeNo: undefined,
                qrCodeList: []
              }
            : item
        )
      );
    }
  };

  // Filtering list
  const pendingApps = applications.filter((app) => app.status === '待发放');
  const completedApps = applications.filter((app) => app.status === '已发放' || !!app.qrCodeIssuedAt);

  const rawList = activeMainTab === 'pending' ? pendingApps : completedApps;

  const currentList = rawList.filter((item) => {
    if (searchTitle && !item.title.toLowerCase().includes(searchTitle.toLowerCase())) {
      return false;
    }
    if (searchOrg !== '全部单位' && item.orgName !== searchOrg) {
      return false;
    }
    if (searchStartDate && item.submittedAt < searchStartDate) {
      return false;
    }
    if (searchEndDate && item.submittedAt > searchEndDate + ' 23:59') {
      return false;
    }
    return true;
  });

  return (
    <div className="p-6 bg-gray-50/60 min-h-screen space-y-6 text-gray-800">
      {/* 1. Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-1.5 h-6 bg-blue-600 rounded-full mr-3 shadow-sm"></div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">
            巡检二维码发放
          </h1>
        </div>
      </div>

      {/* 2. Search Filters Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/80 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* 活动标题 */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 tracking-wide">活动标题</label>
            <input
              type="text"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              placeholder="请输入活动名称..."
              className="w-full bg-gray-50/80 border border-gray-200/60 rounded-xl px-4 py-2.5 text-xs text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>

          {/* 申请单位 */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 tracking-wide">申请单位</label>
            <select
              value={searchOrg}
              onChange={(e) => setSearchOrg(e.target.value)}
              className="w-full bg-gray-50/80 border border-gray-200/60 rounded-xl px-4 py-2.5 text-xs text-gray-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
            >
              <option value="全部单位">全部单位</option>
              <option value="校学生会宣传部">校学生会宣传部</option>
              <option value="计算机科学与技术系">计算机科学与技术系</option>
              <option value="艺术学院青年志愿者协会">艺术学院青年志愿者协会</option>
              <option value="海洋与地球学院团党委">海洋与地球学院团党委</option>
              <option value="厦大音乐社">厦大音乐社</option>
            </select>
          </div>

          {/* 申请时间 */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 tracking-wide">申请时间</label>
            <div className="flex items-center gap-1.5 bg-gray-50/80 border border-gray-200/60 rounded-xl px-3 py-1.5">
              <input
                type="date"
                value={searchStartDate}
                onChange={(e) => setSearchStartDate(e.target.value)}
                className="bg-transparent text-xs text-gray-800 outline-none w-full cursor-pointer"
              />
              <span className="text-gray-400 font-medium text-xs">-</span>
              <input
                type="date"
                value={searchEndDate}
                onChange={(e) => setSearchEndDate(e.target.value)}
                className="bg-transparent text-xs text-gray-800 outline-none w-full cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100/60">
          <button
            onClick={() => {}}
            className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold px-8 py-2.5 rounded-xl text-xs shadow-sm shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center"
          >
            <span>查询</span>
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-100/90 hover:bg-gray-200 active:scale-95 text-gray-600 font-bold px-8 py-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center"
          >
            <span>重置</span>
          </button>
        </div>
      </div>

      {/* 3. Data Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden">
        {/* Tab Bar: 待发放 vs 已发放 */}
        <div className="px-6 py-3.5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
          <div className="bg-gray-100/80 p-1 rounded-xl flex items-center gap-1 border border-gray-200/50">
            {/* Tab 1: 待发放 */}
            <button
              onClick={() => setActiveMainTab('pending')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                activeMainTab === 'pending'
                  ? 'bg-white text-blue-600 shadow-sm border border-gray-100 font-black'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/50'
              }`}
            >
              <span>待发放</span>
              <span className={`px-2 py-0.5 text-[10px] font-black rounded-full transition-colors ${
                activeMainTab === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {pendingApps.length}
              </span>
            </button>

            {/* Tab 2: 已发放 */}
            <button
              onClick={() => setActiveMainTab('completed')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                activeMainTab === 'completed'
                  ? 'bg-white text-blue-600 shadow-sm border border-gray-100 font-black'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/50'
              }`}
            >
              <span>已发放</span>
              <span className={`px-2 py-0.5 text-[10px] font-black rounded-full transition-colors ${
                activeMainTab === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {completedApps.length}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              显示 <strong className="text-gray-900 font-bold">1</strong> 到 <strong className="text-gray-900 font-bold">{currentList.length}</strong>，共 <strong className="text-blue-600 font-bold">{currentList.length}</strong> 条记录
            </span>
            <div className="flex items-center gap-1 ml-2">
              <button disabled className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-300 bg-gray-50 cursor-not-allowed">
                <ChevronLeft size={14} />
              </button>
              <button disabled className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-300 bg-gray-50 cursor-not-allowed">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto relative">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-gray-50/90 text-gray-500 font-bold border-b border-gray-100">
              {activeMainTab === 'pending' ? (
                <tr>
                  <th className="py-4 px-4 whitespace-nowrap sticky left-0 z-20 bg-gray-50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] min-w-[80px]">海报图片</th>
                  <th className="py-4 px-4 whitespace-nowrap min-w-[200px] max-w-[260px]">活动标题</th>
                  <th className="py-4 px-4 whitespace-nowrap min-w-[140px] text-blue-700 bg-blue-50/40">审核通过时间</th>
                  <th className="py-4 px-4 whitespace-nowrap min-w-[140px]">申请时间</th>
                  <th className="py-4 px-4 whitespace-nowrap min-w-[150px]">申请单位</th>
                  <th className="py-4 px-4 whitespace-nowrap min-w-[100px]">申请人</th>
                  <th className="py-4 px-4 whitespace-nowrap min-w-[110px]">申请人类型</th>
                  <th className="py-4 px-4 whitespace-nowrap min-w-[100px]">栏位要求</th>
                  <th className="py-4 px-4 whitespace-nowrap min-w-[340px]">张贴区域和时间</th>
                  <th className="py-4 px-4 whitespace-nowrap text-center sticky right-0 z-20 bg-gray-50 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.06)] min-w-[120px]">操作</th>
                </tr>
              ) : (
                <tr>
                  <th className="py-4 px-4 whitespace-nowrap sticky left-0 z-20 bg-gray-50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] min-w-[80px]">海报图片</th>
                  <th className="py-4 px-4 whitespace-nowrap min-w-[200px] max-w-[260px]">活动标题</th>
                  <th className="py-4 px-4 whitespace-nowrap min-w-[110px]">发放人</th>
                  <th className="py-4 px-4 whitespace-nowrap min-w-[90px]">发放数量</th>
                  <th className="py-4 px-4 whitespace-nowrap min-w-[140px]">二维码发放时间</th>
                  <th className="py-4 px-4 whitespace-nowrap min-w-[140px] text-blue-700 bg-blue-50/40">审核通过时间</th>
                  <th className="py-4 px-4 whitespace-nowrap min-w-[140px]">申请时间</th>
                  <th className="py-4 px-4 whitespace-nowrap min-w-[150px]">申请单位</th>
                  <th className="py-4 px-4 whitespace-nowrap min-w-[100px]">申请人</th>
                  <th className="py-4 px-4 whitespace-nowrap min-w-[110px]">申请人类型</th>
                  <th className="py-4 px-4 whitespace-nowrap min-w-[100px]">栏位要求</th>
                  <th className="py-4 px-4 whitespace-nowrap min-w-[340px]">张贴区域和时间</th>
                  <th className="py-4 px-4 whitespace-nowrap text-center sticky right-0 z-20 bg-gray-50 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.06)] min-w-[120px]">操作</th>
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {currentList.length === 0 ? (
                <tr>
                  <td colSpan={13} className="py-12 text-center text-gray-400">
                    暂无符合条件的记录
                  </td>
                </tr>
              ) : (
                currentList.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                    {/* Poster Image */}
                    <td className="py-3 px-4 sticky left-0 z-10 bg-white group-hover:bg-slate-50 transition-colors shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">
                      <div 
                        onClick={() => setViewingApp(item)}
                        className="w-12 h-16 rounded-lg overflow-hidden border border-gray-200 shadow-sm cursor-pointer group/img relative bg-gray-100"
                        title="点击查看海报与详情"
                      >
                        <img src={item.posterImageUrl} alt={item.title} className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Eye size={14} />
                        </div>
                      </div>
                    </td>

                    {/* Title */}
                    <td className="py-3 px-4 font-bold text-gray-900 text-sm max-w-[240px]">
                      <span className="line-clamp-2">{item.title}</span>
                    </td>

                    {/* Completed Tab Specific Columns */}
                    {activeMainTab === 'completed' && (
                      <>
                        <td className="py-3 px-4 font-medium text-gray-800 whitespace-nowrap">
                          {item.issuerName || '校团委（张老师）'}
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md font-bold text-[11px] border border-blue-100/80">
                            {item.qrCodeList?.length || item.qrCodeCount || 1} 个
                          </span>
                        </td>

                        <td className="py-3 px-4 text-emerald-700 font-bold whitespace-nowrap flex flex-col justify-center">
                          <span>{item.qrCodeIssuedAt || '2026-08-05 15:20'}</span>
                          {item.qrCodeNo && (
                            <span className="text-[10px] text-gray-400 font-mono font-normal">{item.qrCodeNo}</span>
                          )}
                        </td>
                      </>
                    )}

                    {/* 审核通过时间 */}
                    <td className="py-3 px-4 text-blue-700 font-semibold whitespace-nowrap bg-blue-50/10">
                      <div className="flex items-center gap-1">
                        <CheckCircle2 size={13} className="text-blue-600 shrink-0" />
                        <span>{item.approvedAt}</span>
                      </div>
                    </td>

                    {/* Submitted At (申请时间) */}
                    <td className="py-3 px-4 text-gray-500 font-medium whitespace-nowrap">
                      {item.submittedAt}
                    </td>

                    {/* Org Name */}
                    <td className="py-3 px-4 font-medium text-gray-800 whitespace-nowrap">
                      {item.orgName}
                    </td>

                    {/* Applicant Name */}
                    <td className="py-3 px-4 font-medium text-gray-800 whitespace-nowrap">
                      {item.applicantName}
                    </td>

                    {/* Applicant Type */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                        (item.applicantType === '教职工' || item.applicantName?.includes('教授') || item.applicantName?.includes('老师'))
                          ? 'bg-purple-50 text-purple-700 border-purple-200/80'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                      }`}>
                        {item.applicantType || (item.applicantName?.includes('教授') || item.applicantName?.includes('老师') ? '教职工' : '学生')}
                      </span>
                    </td>

                    {/* Poster Size */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md font-bold text-[11px]">
                        {item.posterSize}
                      </span>
                    </td>

                    {/* Locations */}
                    <td className="py-3 px-4">
                      <ul className="space-y-1.5 text-[11px]">
                        {item.postingLocations.map((loc, idx) => {
                          const parts = parsePostingLocationParts(loc);
                          return (
                            <li key={idx} className="flex items-center gap-1.5 whitespace-nowrap">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                              <span className="px-2 py-0.5 rounded-md bg-blue-50/90 text-blue-700 font-bold border border-blue-200/80 whitespace-nowrap shadow-xs">
                                {parts.campus}
                              </span>
                              <span className="px-2 py-0.5 rounded-md bg-slate-100/90 text-slate-800 font-medium border border-slate-200/80 whitespace-nowrap shadow-xs">
                                {parts.board}
                              </span>
                              <span className="px-2 py-0.5 rounded-md bg-emerald-50/90 text-emerald-800 font-semibold border border-emerald-200/80 whitespace-nowrap flex items-center gap-1 shadow-xs">
                                <Clock size={11} className="text-emerald-600 shrink-0" />
                                <span>{parts.dates}</span>
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center whitespace-nowrap sticky right-0 z-10 bg-white group-hover:bg-slate-50 transition-colors shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.06)]">
                      {activeMainTab === 'pending' ? (
                        <button
                          onClick={() => handleOpenIssueModal(item)}
                          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-lg text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 mx-auto"
                        >
                          <QrCode size={13} />
                          <span>发放二维码</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenIssueModal(item)}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1 mx-auto"
                        >
                          <QrCode size={12} />
                          <span>查看二维码</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            显示 <strong className="text-gray-900 font-bold">1</strong> 到 <strong className="text-gray-900 font-bold">{currentList.length}</strong>，共 <strong className="text-blue-600 font-bold">{currentList.length}</strong> 条记录
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium cursor-pointer">
              上一页
            </button>
            <button className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center shadow-sm cursor-pointer">
              1
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium cursor-pointer">
              下一页
            </button>
          </div>
        </div>
      </div>

      {/* Modal 1: 查看海报与申请详情 Modal */}
      {viewingApp && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200 my-auto relative">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100/80 bg-white z-20 shrink-0">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
                  <Eye className="text-blue-600" size={20} />
                  <span>海报张贴申请详情</span>
                </h3>
                {renderStatusBadge(viewingApp.status)}
              </div>
              <button 
                type="button"
                onClick={() => setViewingApp(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs pb-24">
              {/* Left Column: Readonly application form */}
              <div className="lg:col-span-8 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">申请单位</label>
                    <input
                      type="text"
                      disabled
                      value={viewingApp.orgName}
                      className="w-full bg-gray-100/90 border border-gray-200/80 rounded-xl px-3 py-2 text-xs text-gray-700 cursor-not-allowed font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">申请人</label>
                    <input
                      type="text"
                      disabled
                      value={viewingApp.applicantName}
                      className="w-full bg-gray-100/90 border border-gray-200/80 rounded-xl px-3 py-2 text-xs text-gray-700 cursor-not-allowed font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">联系电话</label>
                    <input
                      type="text"
                      disabled
                      value={viewingApp.contactPhone || '13959200001'}
                      className="w-full bg-gray-100/90 border border-gray-200/80 rounded-xl px-3 py-2 text-xs text-gray-700 cursor-not-allowed font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">申请时间</label>
                    <input
                      type="text"
                      disabled
                      value={viewingApp.submittedAt}
                      className="w-full bg-gray-100/90 border border-gray-200/80 rounded-xl px-3 py-2 text-xs text-gray-700 cursor-not-allowed font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">审核通过时间</label>
                    <input
                      type="text"
                      disabled
                      value={viewingApp.approvedAt}
                      className="w-full bg-blue-50/80 border border-blue-200/80 rounded-xl px-3 py-2 text-xs text-blue-900 font-bold cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">活动主题</label>
                  <input
                    type="text"
                    disabled
                    value={viewingApp.title}
                    className="w-full bg-gray-100/90 border border-gray-200/80 rounded-xl px-3 py-2 text-xs text-gray-800 cursor-not-allowed font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">海报效果图</label>
                  <div className="flex items-center gap-4 bg-gray-50/80 border border-gray-200/80 rounded-2xl p-3">
                    <div className="w-20 h-28 rounded-xl overflow-hidden bg-gray-200 border border-gray-300/60 flex-shrink-0 flex items-center justify-center">
                      <img src={viewingApp.posterImageUrl} alt={viewingApp.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-xs">已核准海报排版与图文</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">已终审</span>
                      </div>
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        规格格式：{viewingApp.posterSize}；图文合规无敏感内容，允许生成并打印防伪二维码。
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200/80 rounded-2xl p-4 bg-white space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      <h4 className="font-bold text-gray-900 text-xs">张贴位置和时间</h4>
                    </div>
                    <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                      共 {viewingApp.postingLocations.length} 处排期位置
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-gray-100 bg-gray-50/50 p-3">
                    <ul className="space-y-2 text-[11px]">
                      {viewingApp.postingLocations.map((loc, idx) => {
                        const parts = parsePostingLocationParts(loc);
                        return (
                          <li key={idx} className="flex items-center gap-1.5 whitespace-nowrap p-2 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 ml-1"></span>
                            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-200/80 whitespace-nowrap">
                              {parts.campus}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-medium border border-slate-200 whitespace-nowrap">
                              {parts.board}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200/80 whitespace-nowrap flex items-center gap-1">
                              <Clock size={11} className="text-emerald-600 shrink-0" />
                              <span>{parts.dates}</span>
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right Column: Timeline */}
              <div className="lg:col-span-4 bg-slate-50/90 rounded-2xl p-5 border border-slate-200/70 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-slate-200/80">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-blue-600" />
                      <h4 className="font-bold text-gray-900 text-xs tracking-wide">全流程记录</h4>
                    </div>
                  </div>

                  <div className="relative pl-3 space-y-4 before:absolute before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                    {getApprovalTimeline(viewingApp).map((step, idx) => {
                      let badgeBg = 'bg-slate-200 text-slate-600';
                      let statusTag = <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">待处理</span>;
                      
                      if (step.status === 'completed') {
                        badgeBg = 'bg-emerald-600 text-white';
                        statusTag = <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">已完成</span>;
                      } else if (step.status === 'active') {
                        badgeBg = 'bg-blue-600 text-white animate-pulse';
                        statusTag = <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-bold">待处理</span>;
                      }

                      return (
                        <div key={idx} className="relative flex items-start gap-3 text-left">
                          <div className={`w-5 h-5 rounded-full ${badgeBg} font-bold text-[10px] flex items-center justify-center ring-4 ring-slate-50 z-10 shrink-0`}>
                            {step.status === 'completed' ? '✓' : idx + 1}
                          </div>
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-bold text-gray-900 text-xs">{step.title}</span>
                              {statusTag}
                            </div>
                            <p className="text-[11px] text-gray-600 font-medium">{step.approver}</p>
                            <p className="text-[10px] text-gray-400">{step.time}</p>
                            <div className="bg-white/80 border border-slate-200/60 rounded-lg p-2 text-[10px] text-slate-600 leading-relaxed shadow-2xs">
                              {step.comment}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 text-[11px] text-blue-900 leading-relaxed">
                  <span className="font-bold block mb-1">💡 巡检码发放规则：</span>
                  校团委下发巡检二维码后，申请人可在线下载防伪标签并按要求贴于纸质海报指定区域，以便校园巡检队员现场扫码复核。
                </div>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-gray-200/80 px-6 py-4 z-30 flex items-center justify-between gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">巡检码状态：</span>
                {renderStatusBadge(viewingApp.status)}
              </div>

              <div className="flex items-center gap-3">
                {viewingApp.status === '待发放' && (
                  <button
                    type="button"
                    onClick={() => {
                      const appToIssue = viewingApp;
                      setViewingApp(null);
                      handleOpenIssueModal(appToIssue);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-blue-500/20"
                  >
                    <QrCode size={14} />
                    <span>立即发放二维码</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setViewingApp(null)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-6 py-2.5 rounded-xl text-xs transition-all cursor-pointer"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: “发放二维码”界面 Modal */}
      {issuingApp && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl flex flex-col max-h-[85vh] overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200 my-auto relative">
            
            {/* Header: Strictly "发放二维码" */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white z-20 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-2xs">
                  <QrCode size={20} />
                </div>
                <h3 className="text-lg font-black text-gray-900 tracking-tight">
                  发放二维码
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setIssuingApp(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Container Body - Single column view without left QR image */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs pb-24">
              
              {/* Application Summary Box */}
              <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900">{issuingApp.title}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">
                    审核通过
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-600">
                  <div><strong className="text-gray-700">申请单位：</strong>{issuingApp.orgName}</div>
                  <div><strong className="text-gray-700">申请人：</strong>{issuingApp.applicantName} ({issuingApp.contactPhone || '13959200001'})</div>
                  <div><strong className="text-gray-700">海报规格：</strong>{issuingApp.posterSize}</div>
                  <div><strong className="text-gray-700">审核通过时间：</strong><span className="text-blue-700 font-bold">{issuingApp.approvedAt}</span></div>
                </div>
              </div>

              {/* Section Title "二维码清单" */}
              <div className="space-y-4 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h4 className="font-extrabold text-gray-900 text-sm flex items-center gap-2">
                    <QrCode size={16} className="text-blue-600" />
                    <span>二维码清单</span>
                  </h4>
                  {/* "新增二维码" Button */}
                  <button
                    type="button"
                    onClick={handleOpenAddQrModal}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <Plus size={15} />
                    <span>新增二维码</span>
                  </button>
                </div>

                {/* Notice Prompt text with bold red number */}
                {(() => {
                  const boardCount = issuingApp.postingLocations ? issuingApp.postingLocations.length : 3;
                  return (
                    <div className="bg-amber-50/90 border border-amber-200/80 rounded-xl px-4 py-3 text-xs text-amber-900 font-medium flex items-center gap-2">
                      <AlertCircle size={16} className="text-amber-600 shrink-0" />
                      <span>
                        此申请包含 {boardCount} 个海报张贴栏，需发放 <strong className="font-extrabold text-red-600 text-sm mx-0.5">{boardCount}</strong> 个二维码。
                      </span>
                    </div>
                  );
                })()}

                {/* QR Code List Table */}
                <div className="overflow-x-auto border border-gray-200/80 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200/80">
                      <tr>
                        <th className="py-3 px-4 whitespace-nowrap min-w-[140px]">编号</th>
                        <th className="py-3 px-4 whitespace-nowrap min-w-[260px]">内容</th>
                        <th className="py-3 px-4 whitespace-nowrap min-w-[140px]">发放时间</th>
                        <th className="py-3 px-4 whitespace-nowrap text-center min-w-[80px]">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700 bg-white">
                      {(!issuingApp.qrCodeList || issuingApp.qrCodeList.length === 0) ? (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-gray-400 font-medium">
                            暂未发放二维码，请点击右上角“新增二维码”进行发放
                          </td>
                        </tr>
                      ) : (
                        issuingApp.qrCodeList.map((qr) => (
                          <tr key={qr.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-gray-900 whitespace-nowrap">
                              <span className="px-2 py-1 bg-slate-100 rounded-md border border-slate-200">
                                {qr.no}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono font-semibold text-gray-800 break-all select-all">
                              {qr.content}
                            </td>
                            <td className="py-3 px-4 text-emerald-700 font-bold whitespace-nowrap">
                              {qr.issuedAt}
                            </td>
                            <td className="py-3 px-4 text-center whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => handleDeleteQrCode(qr.id)}
                                className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 rounded-lg font-bold text-xs transition-colors cursor-pointer inline-flex items-center gap-1"
                                title="删除二维码"
                              >
                                <Trash2 size={13} />
                                <span>删除</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>

            {/* Requirement 2: Bottom Footer Actions - "关闭" updated to "发放二维码" */}
            <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-gray-200/80 px-6 py-4 z-30 flex items-center justify-between gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">已发放二维码数量：</span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-black border border-blue-200 text-xs">
                  {issuingApp.qrCodeList ? issuingApp.qrCodeList.length : 0} 个
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleMainIssueQrCodeAction}
                  className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold px-7 py-2.5 rounded-xl text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <QrCode size={15} />
                  <span>发放二维码</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: "新增二维码" Sub-Modal */}
      {isAddQrModalOpen && issuingApp && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-hidden">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200 my-auto relative">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
              <h3 className="text-base font-black text-gray-900 tracking-tight flex items-center gap-2">
                <QrCode size={18} className="text-blue-600" />
                <span>新增二维码</span>
              </h3>
              <button 
                type="button"
                onClick={() => setIsAddQrModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form Fields: 编号、内容 */}
            <div className="p-6 space-y-4 text-xs">
              
              {/* Field 1: 编号 with 查询 Button */}
              <div>
                <label className="block font-bold text-gray-800 text-xs mb-1.5">
                  编号 <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newQrNo}
                    onChange={(e) => setNewQrNo(e.target.value)}
                    placeholder="请输入或自动生成编号..."
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={handleQueryQrContent}
                    className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 rounded-xl font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shrink-0"
                  >
                    <Search size={14} />
                    <span>查询</span>
                  </button>
                </div>
              </div>

              {/* Field 2: 内容 (Requirement 1: 32位随机小写英文字符串) */}
              <div>
                <label className="block font-bold text-gray-800 text-xs mb-1.5">
                  内容（32位随机小写英文字符串） <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={newQrContent}
                  onChange={(e) => setNewQrContent(e.target.value)}
                  placeholder="32位随机小写英文字符串..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-mono font-medium text-gray-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none leading-relaxed tracking-wider"
                />
              </div>
            </div>

            {/* Footer Buttons: 发放 */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAddQrModalOpen(false)}
                className="bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold px-5 py-2 rounded-xl text-xs transition-all cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmAddQrCode}
                className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold px-7 py-2 rounded-xl text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check size={16} />
                <span>发放</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
