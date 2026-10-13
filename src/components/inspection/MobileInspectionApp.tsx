import React, { useState, useEffect, useRef } from 'react';
import { 
  MOCK_INSPECTION_LOGS, 
  MOCK_WARNINGS, 
  MOCK_VIOLATION_EVENTS, 
  MOCK_POSTER_BOARDS, 
  MOCK_QR_BINDINGS 
} from '../../data/posterGraffitiMock';
import { InspectionLog, ViolationEvent, Campus } from '../../types/posterGraffitiTypes';
import { 
  Scan, 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Send, 
  User, 
  History, 
  QrCode, 
  ShieldAlert, 
  Plus, 
  X, 
  Sparkles, 
  Home, 
  ClipboardList, 
  Bot, 
  ArrowLeft, 
  Search, 
  CheckSquare, 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  FileText, 
  Building2, 
  Layers, 
  RefreshCw, 
  AlertCircle,
  Award,
  Calendar,
  Settings,
  Bell,
  HelpCircle,
  ExternalLink,
  LayoutGrid,
  Globe,
  Wrench,
  FileSpreadsheet
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SystemFeatureCatalogModal from '../common/SystemFeatureCatalogModal';

interface MobileInspectionAppProps {
  onBackToLanding?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'xiaojing';
  text: string;
  time: string;
}

export interface InspectionPosterSlot {
  slotName: string;   // 栏位（支持单个或多个，如："1栏位", "1-2栏位", "1栏位、2栏位"）
  qrCode: string;     // 识别二维码代码
  imageUrl: string;   // 海报图片
  posterTitle?: string; // 活动名称
  orgName?: string;     // 使用单位
  postingDates?: string[]; // 张贴日期列表
  startDate?: string;   // 旧字段兼容
  validTo?: string;     // 旧字段兼容
}

export interface TodayTaskItem {
  id: string;
  campus: string;        // 巡检校区
  targetName: string;    // 巡检对象名称
  locationDetail: string; // 详细位置
  inspectorName: string; // 巡检人员
  checkTime?: string;    // 巡检时间
  conclusion?: string;   // 巡检结论
  status: '已巡检' | '未巡检'; // 巡检状态
  notes?: string;
  photoUrl?: string;
  posterSlots?: InspectionPosterSlot[];
}

export default function MobileInspectionApp({ onBackToLanding }: MobileInspectionAppProps) {
  // Bottom Menu Active Tab: 'HOME' | 'TASKS' | 'XIAOJING' | 'PROFILE'
  const [activeTab, setActiveTab] = useState<'HOME' | 'TASKS' | 'XIAOJING' | 'PROFILE'>('HOME');
  const [showFeatureCatalog, setShowFeatureCatalog] = useState(false);

  // Active Inspection Workspace view state (when inspecting an object)
  const [activeInspectionTask, setActiveInspectionTask] = useState<TodayTaskItem | null>(null);
  const [slotRadioStates, setSlotRadioStates] = useState<Record<string, '正常' | '异常'>>({});
  const [itemConclusions, setItemConclusions] = useState<Record<string, '正常' | '异常'>>({});
  const [showOnlineBoardModal, setShowOnlineBoardModal] = useState(false);

  // Abnormal Handling Modal State (巡检结论异常处理弹窗)
  const [showAbnormalModal, setShowAbnormalModal] = useState(false);
  const [abnormalContext, setAbnormalContext] = useState<{
    slotName?: string;
    posterTitle?: string;
    itemText?: string;
    slotKey?: string;
    itemKey?: string;
  }>({});
  const [abnormalHandlingMethod, setAbnormalHandlingMethod] = useState<string>('现场下架/拆除');
  const [abnormalDescription, setAbnormalDescription] = useState<string>('');
  const [abnormalPhotos, setAbnormalPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&q=80'
  ]);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [abnormalSavedToast, setAbnormalSavedToast] = useState(false);

  const handleSelectAbnormal = (
    slotKey: string,
    itemKey?: string,
    contextData?: { slotName?: string; posterTitle?: string; itemText?: string }
  ) => {
    if (itemKey) {
      setItemConclusions(prev => ({ ...prev, [itemKey]: '异常' }));
    }
    setSlotRadioStates(prev => ({ ...prev, [slotKey]: '异常' }));

    setAbnormalContext({
      slotKey,
      itemKey,
      slotName: contextData?.slotName,
      posterTitle: contextData?.posterTitle,
      itemText: contextData?.itemText
    });

    if (contextData?.itemText) {
      setAbnormalDescription(`[${contextData.itemText}] 现场巡检发现异常，现需采取现场整治及整改跟踪。`);
    } else {
      setAbnormalDescription('海报巡检核查发现不符合规范项，需及时处理备案。');
    }
    setShowAbnormalModal(true);
  };

  // Plus Center Floating Menu State
  const [showPlusMenu, setShowPlusMenu] = useState(false);

  // Modal overlays triggered from Plus menu or actions
  const [showScanModal, setShowScanModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // QR Scanning Simulator State
  const [scannedCode, setScannedCode] = useState<string>('');
  const [scanResult, setScanResult] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);

  // Violation Report Form State
  const [reportTitle, setReportTitle] = useState('');
  const [reportType, setReportType] = useState<ViolationEvent['type']>('未加盖印章/二维码');
  const [reportLocation, setReportLocation] = useState('思明校区·群贤楼2号展板');
  const [reportNotes, setReportNotes] = useState('');
  const [reportPhoto, setReportPhoto] = useState<string>('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&q=80');
  const [reportSubmittedSuccess, setReportSubmittedSuccess] = useState(false);

  // Tasks Filter State
  const [taskCampusFilter, setTaskCampusFilter] = useState<string>('全部');
  const [taskStatusFilter, setTaskStatusFilter] = useState<'ALL' | 'PENDING' | 'DONE' | 'OVERDUE'>('ALL');

  // Inspection Logs & Tasks State
  const [logs, setLogs] = useState<InspectionLog[]>(MOCK_INSPECTION_LOGS);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>(['board-siming-1']);

  // Today Inspection Tasks List State
  const [todayTasks, setTodayTasks] = useState<TodayTaskItem[]>([
    {
      id: 'task-101',
      campus: '思明校区',
      targetName: '群贤楼2号宣传展板',
      locationDetail: '群贤楼一楼中厅东侧廊道 2号位置',
      inspectorName: '张强',
      checkTime: '2026-08-11 09:30',
      conclusion: '正常无违规（防伪二维码及印章健全完好）',
      status: '已巡检',
      notes: '现场抽查3张在贴海报，具备有效四级审批防伪印章。',
      photoUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500&q=80',
      posterSlots: [
        {
          slotName: '第一栏到第二栏',
          qrCode: 'XM-POSTER-2026-0881',
          imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
          posterTitle: '2026年厦门大学迎新草地音乐节',
          orgName: '校学生会宣传部',
          postingDates: ['2026-08-08', '2026-08-11', '2026-08-12', '2026-08-13', '2026-08-14', '2026-08-15']
        },
        {
          slotName: '第三栏',
          qrCode: 'XM-POSTER-2026-0882',
          imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80',
          posterTitle: '人工智能与机器人前沿学术讲座',
          orgName: '计算机科学与技术系',
          postingDates: ['2026-08-09', '2026-08-11', '2026-08-12', '2026-08-13']
        },
        {
          slotName: '第四栏到第五栏',
          qrCode: 'XM-POSTER-2026-0883',
          imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&q=80',
          posterTitle: '厦大美育艺术展系列讲座',
          orgName: '艺术学院青年志愿者协会',
          postingDates: ['2026-08-10', '2026-08-11', '2026-08-12', '2026-08-13']
        }
      ]
    },
    {
      id: 'task-102',
      campus: '思明校区',
      targetName: '三家村广场告示栏 A区',
      locationDetail: '三家村学生广场超市入口左侧',
      inspectorName: '张强',
      checkTime: '2026-08-11 11:15',
      conclusion: '发现1张超期海报，已即时清理整改',
      status: '已巡检',
      notes: '现场清理超期3天违规张贴商业宣传单1张。',
      photoUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&q=80',
      posterSlots: [
        {
          slotName: '第一栏到第二栏',
          qrCode: 'XM-POSTER-2026-0884',
          imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&q=80',
          posterTitle: '海洋科考成果分享交流会',
          orgName: '海洋与地球学院团党委',
          postingDates: ['2026-08-10', '2026-08-11', '2026-08-12']
        },
        {
          slotName: '第三栏',
          qrCode: 'XM-POSTER-2026-0885',
          imageUrl: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=600&q=80',
          posterTitle: '“自强不息”校史话剧巡演拉票',
          orgName: '校园话剧社',
          postingDates: ['2026-08-11', '2026-08-12', '2026-08-13']
        }
      ]
    },
    {
      id: 'task-103',
      campus: '思明校区',
      targetName: '芙蓉隧道 0-300米壁画海报区',
      locationDetail: '芙蓉隧道入口至300米壁画展段',
      inspectorName: '张强',
      status: '未巡检',
      posterSlots: [
        {
          slotName: '第一栏到第二栏',
          qrCode: 'XM-POSTER-2026-0886',
          imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
          posterTitle: '毕业季毕业留念主题宣传展',
          orgName: '校团委宣传部',
          postingDates: ['2026-08-08', '2026-08-11', '2026-08-12', '2026-08-13']
        },
        {
          slotName: '第三栏到第四栏',
          qrCode: 'XM-POSTER-2026-0887',
          imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&q=80',
          posterTitle: '芙蓉隧道涂鸦艺术保护倡议',
          orgName: '艺术学院青年志愿者协会',
          postingDates: ['2026-08-09', '2026-08-11', '2026-08-12']
        },
        {
          slotName: '第五栏',
          qrCode: 'XM-POSTER-2026-0888',
          imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&q=80',
          posterTitle: '“厦大记忆”壁画长廊导览',
          orgName: '校史馆与文保协会',
          postingDates: ['2026-08-10', '2026-08-11', '2026-08-12']
        }
      ]
    },
    {
      id: 'task-104',
      campus: '思明校区',
      targetName: '演武场综合体育馆宣讲栏',
      locationDetail: '演武场看台一楼走廊中部',
      inspectorName: '张强',
      status: '未巡检',
      posterSlots: [
        {
          slotName: '第一栏到第二栏',
          qrCode: 'XM-POSTER-2026-0889',
          imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80',
          posterTitle: '厦大新生篮球联赛选拔赛',
          orgName: '体育教学部',
          postingDates: ['2026-08-11', '2026-08-12', '2026-08-13']
        },
        {
          slotName: '第三栏',
          qrCode: 'XM-POSTER-2026-0890',
          imageUrl: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=600&q=80',
          posterTitle: '吉他协会迎新夏日歌会',
          orgName: '吉他协会',
          postingDates: ['2026-08-11', '2026-08-12', '2026-08-13']
        }
      ]
    }
  ]);

  const [selectedTaskDetail, setSelectedTaskDetail] = useState<TodayTaskItem | null>(null);

  // Handle Start Inspection - open the "张贴物巡检" workspace screen
  const handleStartInspection = (task: TodayTaskItem) => {
    setActiveInspectionTask(task);
  };

  // Submit Inspection Result in workspace
  const handleCompleteInspectionSubmit = (taskId: string) => {
    const nowStr = new Date().toISOString().slice(0, 10) + ' ' + new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    setTodayTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: '已巡检',
          checkTime: nowStr,
          inspectorName: '张强',
          conclusion: '正常无违规（现场查验合格）',
          notes: '现场巡查完毕，展面海报齐全，四级防伪印章核验无误。'
        };
      }
      return t;
    }));
    // Update active task status locally as well
    if (activeInspectionTask) {
      setActiveInspectionTask(prev => prev ? {
        ...prev,
        status: '已巡检',
        checkTime: nowStr,
        inspectorName: '张强',
        conclusion: '正常无违规（现场查验合格）'
      } : null);
    }
  };

  // User Duty & Service Area State
  const [isOnDuty, setIsOnDuty] = useState(true);
  const [isServiceAreaExpanded, setIsServiceAreaExpanded] = useState(false);

  // AI Assistant "小景知道" State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'xiaojing',
      text: '你好！我是“小景知道”——厦大巡检智能助手。\n你可以问我关于海报张贴规范、四级审批标准、不干胶防伪印章查验、芙蓉隧道涂鸦报批或违规处理细则等任何问题。',
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat to bottom
  useEffect(() => {
    if (activeTab === 'XIAOJING') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeTab]);

  // Handle Scanning QR Code
  const handleTriggerScan = (codeToScan: string) => {
    setIsScanning(true);
    setScannedCode(codeToScan);
    setScanResult(null);

    setTimeout(() => {
      setIsScanning(false);
      const matched = MOCK_QR_BINDINGS.find(q => q.qrCode === codeToScan);
      if (matched) {
        setScanResult({
          status: 'VALID',
          title: matched.targetTitle,
          org: matched.orgName,
          code: matched.qrCode,
          type: matched.type === 'ADHESIVE_POSTER' ? '海报不干胶防伪印章' : '涂鸦 PVC 铭牌',
          validPeriod: `${matched.validFrom} 至 ${matched.validTo}`,
          isExpired: false
        });
      } else if (codeToScan.includes('EXPIRED')) {
        setScanResult({
          status: 'EXPIRED',
          title: '厦大校园十佳歌手大赛',
          org: '厦门大学吉他协会',
          code: codeToScan,
          type: '海报不干胶防伪印章',
          validPeriod: '2026-07-01 至 2026-07-03',
          isExpired: true
        });
      } else {
        setScanResult({
          status: 'INVALID',
          title: '未获校团委审批授权的非法海报',
          org: '未知社团/外部机构',
          code: codeToScan,
          type: '未知标记',
          validPeriod: '无备案记录',
          isExpired: false
        });
      }
    }, 1000);
  };

  // Handle Check-in task
  const handleTaskCheckIn = (boardId: string, boardName: string) => {
    if (completedTaskIds.includes(boardId)) return;
    setCompletedTaskIds(prev => [...prev, boardId]);
    const newLog: InspectionLog = {
      id: `log-${Date.now()}`,
      inspectorName: '林云飞 (巡检组长)',
      targetType: 'POSTER_BOARD',
      targetName: boardName,
      checkTime: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      result: 'NORMAL',
      notes: '巡检员现场核对完毕，展板无违规覆盖，防伪二维码印章完好。'
    };
    setLogs(prev => [newLog, ...prev]);
  };

  // Handle Report Submit
  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReportSubmittedSuccess(true);
    setTimeout(() => {
      setReportSubmittedSuccess(false);
      setShowReportModal(false);
      setReportTitle('');
      setReportNotes('');
    }, 1500);
  };

  // Handle Send AI Question to 小景知道
  const handleSendChatMessage = async (presetQuestion?: string) => {
    const messageToSend = presetQuestion || chatInput;
    if (!messageToSend.trim() || isChatLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageToSend.trim(),
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    if (!presetQuestion) setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/gemini/xiaojing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageToSend })
      });
      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'xiaojing',
        text: data.text || '小景已收到您的咨询。请在巡检过程中随时核对海报二维码印章信息。',
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('Xiaojing API error:', error);
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'xiaojing',
        text: '规范提示：厦门大学校园海报张贴必须具备四级审批编号，并加盖校团委发放的防伪不干胶二维码印章。张贴期限届满后需在 24 小时内自主清理，巡检员若发现超期海报，可通过【加号】菜单直接拍照提交违规工单。',
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Filter Tasks for TASKS tab
  const filteredTasks = MOCK_POSTER_BOARDS.filter(board => {
    if (taskCampusFilter !== '全部' && board.campus !== taskCampusFilter) return false;
    const isDone = completedTaskIds.includes(board.id);
    const isOverdue = board.id === 'board-siming-2';
    if (taskStatusFilter === 'PENDING' && isDone) return false;
    if (taskStatusFilter === 'DONE' && !isDone) return false;
    if (taskStatusFilter === 'OVERDUE' && !isOverdue) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col items-center">
      
      {/* Mobile Shell Container (Clean white background, no outer dark frame) */}
      <div className="w-full max-w-md min-h-screen bg-white shadow-xl flex flex-col relative pb-6 border-x border-slate-200">
        
        {/* Top Header Bar */}
        {activeInspectionTask ? (
          <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
            <button
              onClick={() => setActiveInspectionTask(null)}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-100 active:bg-slate-200 text-slate-700 transition-colors cursor-pointer shrink-0"
              title="返回"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-base font-extrabold text-slate-900 text-center tracking-wide absolute left-1/2 -translate-x-1/2">
              张贴物巡检
            </h1>
            <button
              onClick={() => setShowScanModal(true)}
              className="px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 active:scale-95 text-indigo-600 font-bold text-xs border border-indigo-100/80 flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
              title="扫描二维码"
            >
              <QrCode size={15} />
              <span className="text-[11px] font-extrabold">扫二维码</span>
            </button>
          </header>
        ) : (
          <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center justify-between shadow-xs">
            {onBackToLanding ? (
              <button
                onClick={onBackToLanding}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 active:bg-slate-200 text-slate-600 transition-colors cursor-pointer shrink-0"
                title="返回系统引导页"
              >
                <ArrowLeft size={18} />
              </button>
            ) : <div className="w-8" />}
            <h1 className="text-sm font-black text-slate-900 text-center tracking-wide">
              张贴物巡检系统
            </h1>
            <button
              onClick={() => setShowFeatureCatalog(true)}
              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 active:scale-95 text-emerald-700 border border-emerald-200 rounded-xl text-[11px] font-black flex items-center gap-1 cursor-pointer transition-all shadow-2xs shrink-0"
              title="查看系统功能清单与下载"
            >
              <FileSpreadsheet size={13} className="text-emerald-600" />
              <span>功能清单</span>
            </button>
          </header>
        )}

        {/* MAIN BODY AREA */}
        {activeInspectionTask ? (
          <main className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* 1、巡检对象信息块（已去掉标题） */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                <h2 className="text-sm font-extrabold text-slate-900 leading-snug">
                  {activeInspectionTask.targetName}
                </h2>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0 inline-flex items-center gap-1.5 ${
                  activeInspectionTask.status === '已巡检'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                    : 'bg-amber-50 text-amber-700 border-amber-200/80'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    activeInspectionTask.status === '已巡检' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`} />
                  {activeInspectionTask.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs pt-0.5">
                <div className="bg-slate-50/80 border border-slate-100/90 rounded-xl p-2.5 space-y-0.5">
                  <span className="text-slate-400 text-[10px] block font-medium">所属校区</span>
                  <span className="font-extrabold text-slate-800">{activeInspectionTask.campus}</span>
                </div>

                <div className="bg-slate-50/80 border border-slate-100/90 rounded-xl p-2.5 space-y-0.5">
                  <span className="text-slate-400 text-[10px] block font-medium">巡检状态</span>
                  <span className={`font-extrabold ${
                    activeInspectionTask.status === '已巡检' ? 'text-emerald-600' : 'text-amber-600'
                  }`}>
                    {activeInspectionTask.status}
                  </span>
                </div>
              </div>

              {/* 详细位置 + 线上海报栏按钮 */}
              <div className="bg-slate-50/80 border border-slate-100/90 rounded-xl p-2.5 text-xs space-y-1.5">
                <span className="text-slate-400 text-[10px] block font-medium">详细位置</span>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-medium text-slate-700 leading-snug flex-1">
                    {activeInspectionTask.locationDetail}
                  </span>
                  <button
                    onClick={() => {
                      try {
                        window.open('#/online-poster-board', '_blank');
                      } catch (e) {
                        console.error(e);
                      }
                      setShowOnlineBoardModal(true);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-[11px] shadow-2xs transition-all cursor-pointer flex items-center gap-1 shrink-0"
                    title="新窗口直接打开线上海报栏界面"
                  >
                    <LayoutGrid size={13} />
                    <span>线上海报栏</span>
                    <ExternalLink size={11} />
                  </button>
                </div>
              </div>
            </div>

            {/* 2、海报清单 */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Layers size={15} className="text-indigo-600" />
                  <span>海报清单</span>
                </h3>
                <span className="text-[10px] text-slate-400 font-medium">
                  按栏目顺序 ({activeInspectionTask.posterSlots?.length || 0})
                </span>
              </div>

              <div className="space-y-3">
                {activeInspectionTask.posterSlots && activeInspectionTask.posterSlots.length > 0 ? (
                  activeInspectionTask.posterSlots.map((slot, index) => {
                    const slotKey = `${activeInspectionTask.id}-${slot.qrCode || index}`;
                    const currentStatus = slotRadioStates[slotKey] || '正常';

                    return (
                      <div 
                        key={index} 
                        className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3 hover:border-indigo-200 transition-all"
                      >
                        {/* 第一行：栏位（多个栏位如：第一栏到第二栏） */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-600 font-extrabold text-[11px] flex items-center justify-center border border-indigo-100/80 shrink-0">
                              {index + 1}
                            </span>
                            <span className="font-extrabold text-slate-900">
                              栏位：{slot.slotName}
                            </span>
                          </div>
                        </div>

                        {/* 第二行：活动名称（去掉标题，直接显示活动名称） */}
                        <div>
                          <h4 className="text-slate-900 font-extrabold text-xs leading-snug">
                            {slot.posterTitle || '毕业季毕业留念主题宣传展'}
                          </h4>
                        </div>

                        {/* 第三行：识别二维码代码（去除前缀标题） */}
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="font-mono font-bold text-indigo-700 bg-indigo-50/90 px-2.5 py-0.5 rounded-md border border-indigo-100/90 text-[11px] inline-flex items-center gap-1.5 shadow-2xs">
                            <QrCode size={13} className="text-indigo-600 shrink-0" />
                            <span>{slot.qrCode}</span>
                          </span>
                        </div>

                        {/* 第四行：使用单位（标签方式显示，不显示标题） */}
                        <div>
                          <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100/90 font-bold text-[11px] inline-block shadow-2xs">
                            {slot.orgName || '校团委宣传部'}
                          </span>
                        </div>

                        {/* 第五行：张贴日期（最多 3 个日期） */}
                        <div className="space-y-1 text-xs">
                          <span className="text-slate-400 text-[11px] block font-medium">张贴日期：</span>
                          <div className="flex flex-wrap gap-1.5">
                            {(slot.postingDates || [
                              '2026-08-09', '2026-08-10', '2026-08-11', '2026-08-12', '2026-08-13'
                            ]).slice(0, 3).map((dateStr, dIndex) => {
                              const isTodayOrFuture = dateStr >= '2026-08-11';
                              return (
                                <span
                                  key={dIndex}
                                  className={`px-2 py-0.5 rounded-md text-[10px] border transition-colors ${
                                    isTodayOrFuture
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200/90 font-extrabold'
                                      : 'bg-slate-100 text-slate-400 border-slate-200/80 font-normal'
                                  }`}
                                >
                                  {dateStr}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        {/* 第六行：海报图片 */}
                        <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-4/3 shadow-2xs">
                          <img 
                            src={slot.imageUrl} 
                            alt={slot.posterTitle || slot.slotName} 
                            className="w-full h-full object-cover" 
                          />
                        </div>

                        {/* 第七行：巡检项目（表格方式显示，标题不换行） */}
                        <div className="space-y-1.5 pt-1">
                          <span className="text-xs font-bold text-slate-800 block">巡检项目</span>
                          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
                            <table className="w-full text-xs text-left border-collapse">
                              <thead>
                                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 text-[11px] whitespace-nowrap">
                                  <th className="py-2 px-2 text-center font-bold whitespace-nowrap w-9">序号</th>
                                  <th className="py-2 px-2 font-bold whitespace-nowrap">项目</th>
                                  <th className="py-2 px-2 text-center font-bold whitespace-nowrap w-28">结论</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 text-[11px]">
                                {[
                                  '是否张贴标识二维码',
                                  '是否超范围张贴',
                                  '内容是否一致',
                                  '是否覆盖/叠贴',
                                  '栏面是否清洁'
                                ].map((itemText, itemIdx) => {
                                  const itemKey = `${slotKey}-item-${itemIdx}`;
                                  const currentConclusion = itemConclusions[itemKey] || '正常';

                                  return (
                                    <tr key={itemIdx} className="hover:bg-slate-50/50 transition-colors">
                                      <td className="py-2 px-2 text-center text-slate-400 font-mono text-[10px] whitespace-nowrap">
                                        {itemIdx + 1}
                                      </td>
                                      <td className="py-2 px-2 font-medium text-slate-700 whitespace-nowrap">
                                        {itemText}
                                      </td>
                                      <td className="py-2 px-2 text-center whitespace-nowrap">
                                        <div className="inline-flex p-0.5 rounded-lg bg-slate-100 border border-slate-200/80 shrink-0">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setItemConclusions(prev => ({ ...prev, [itemKey]: '正常' }));
                                            }}
                                            className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                                              currentConclusion === '正常'
                                                ? 'bg-emerald-600 text-white shadow-xs'
                                                : 'text-slate-500 hover:text-slate-800'
                                            }`}
                                          >
                                            <CheckCircle2 size={11} />
                                            <span>正常</span>
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              handleSelectAbnormal(slotKey, itemKey, {
                                                slotName: slot.slotName,
                                                posterTitle: slot.posterTitle,
                                                itemText
                                              });
                                            }}
                                            className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                                              currentConclusion === '异常'
                                                ? 'bg-rose-600 text-white shadow-xs'
                                                : 'text-slate-500 hover:text-slate-800'
                                            }`}
                                          >
                                            <AlertCircle size={11} />
                                            <span>异常</span>
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* 第八行：巡检结果（总结论） */}
                        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700 whitespace-nowrap">巡检结果：</span>
                          <div className="inline-flex p-0.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                            <button
                              type="button"
                              onClick={() => setSlotRadioStates(prev => ({ ...prev, [slotKey]: '正常' }))}
                              className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                                currentStatus === '正常'
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'text-slate-500 hover:text-slate-800'
                              }`}
                            >
                              <CheckCircle2 size={13} />
                              <span>正常</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                handleSelectAbnormal(slotKey, undefined, {
                                  slotName: slot.slotName,
                                  posterTitle: slot.posterTitle
                                });
                              }}
                              className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                                currentStatus === '异常'
                                  ? 'bg-rose-600 text-white shadow-xs'
                                  : 'text-slate-500 hover:text-slate-800'
                              }`}
                            >
                              <AlertCircle size={13} />
                              <span>异常</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })
                ) : (
                  <div className="bg-white rounded-2xl p-6 text-center text-xs text-slate-400 border border-slate-200">
                    暂无海报清单信息
                  </div>
                )}
              </div>
            </div>

            {/* 底部巡检确认操作 */}
            <div className="pt-2">
              {activeInspectionTask.status === '未巡检' ? (
                <button
                  onClick={() => handleCompleteInspectionSubmit(activeInspectionTask.id)}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-extrabold shadow-md hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 size={16} />
                  <span>完成巡检并提交结果</span>
                </button>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between text-xs text-emerald-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span className="font-bold">巡检已完成（核验合格）</span>
                  </div>
                  <button
                    onClick={() => setActiveInspectionTask(null)}
                    className="px-3 py-1 rounded-xl bg-white border border-emerald-200/80 text-emerald-700 font-bold text-[11px] hover:bg-emerald-100/50 cursor-pointer"
                  >
                    返回列表
                  </button>
                </div>
              )}
            </div>
          </main>
        ) : (
        <main className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* TAB 1: 首页 (HOME) */}
          {activeTab === 'HOME' && (
            <div className="space-y-4">
              
              {/* 第一行：用户信息 Card 1 */}
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                      <img 
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80" 
                        alt="张强" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <span className="w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full absolute bottom-0 right-0" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h2 className="text-base font-extrabold text-slate-900 tracking-tight">张强</h2>
                      {/* 工作状态标签放在名字最右侧 */}
                      <div className="px-3 py-0.5 rounded-full text-xs font-bold border bg-emerald-50/90 text-emerald-600 border-emerald-200/80 inline-flex items-center gap-1.5 flex-shrink-0">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>在岗</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                      智能机械制造学院
                    </p>
                  </div>
                </div>
              </div>

              {/* 第二部分：巡检区域 Card 2 (无展开按钮) */}
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <MapPin size={18} className="text-indigo-600" />
                    <span>巡检区域</span>
                  </div>
                </div>

                <div className="bg-slate-50/90 border border-slate-100/90 rounded-xl p-3 text-xs text-slate-700 font-medium space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                    <span>
                      主要校区：<strong className="text-indigo-600 font-extrabold">思明校区</strong>
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 space-y-1.5 text-[11px] text-slate-600">
                    <p>· <strong className="text-slate-800">芙蓉隧道：</strong> 0 至 300 米</p>
                    <p>· <strong className="text-slate-800">海报栏：</strong> 三家村、白城校门、艺术中心、演武场</p>
                  </div>
                </div>
              </div>

              {/* 快捷操作 (扫码查验 & 违规上报) - 无二级标题，全新按钮样式 */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowScanModal(true)}
                  className="bg-blue-50 hover:bg-blue-100/80 active:scale-98 text-blue-700 border border-blue-200/80 py-3 px-4 rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-2xs cursor-pointer font-extrabold text-xs"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-2xs shrink-0">
                    <Scan size={15} />
                  </div>
                  <span>扫码查验</span>
                </button>

                <button
                  onClick={() => setShowReportModal(true)}
                  className="bg-rose-50 hover:bg-rose-100/80 active:scale-98 text-rose-700 border border-rose-200/80 py-3 px-4 rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-2xs cursor-pointer font-extrabold text-xs"
                >
                  <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-2xs shrink-0">
                    <ShieldAlert size={15} />
                  </div>
                  <span>违规上报</span>
                </button>
              </div>

              {/* 今日巡检任务 */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <ClipboardList size={15} className="text-blue-600" /> 今日巡检任务
                  </h3>
                  <button
                    onClick={() => setActiveTab('TASKS')}
                    className="text-[11px] font-medium text-blue-600 hover:underline cursor-pointer"
                  >
                    巡检记录
                  </button>
                </div>

                <div className="space-y-2.5">
                  {todayTasks.map(task => {
                    const isDone = task.status === '已巡检';
                    return (
                      <div 
                        key={task.id} 
                        className="bg-white border border-slate-200/90 rounded-2xl p-3.5 space-y-2.5 shadow-2xs hover:shadow-xs transition-all"
                      >
                        {/* 第一行：巡检对象名称 (无标题) & 最右侧状态 */}
                        <div className="flex items-center justify-between gap-2 border-b border-slate-100/80 pb-2">
                          <h4 className="text-xs font-extrabold text-slate-900 truncate">
                            {task.targetName}
                          </h4>

                          <div className="flex-shrink-0">
                            {isDone ? (
                              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/80 inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                已巡检
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200/80 inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                未巡检
                              </span>
                            )}
                          </div>
                        </div>

                        {/* 下面一行：校区标签 (无标题) */}
                        <div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-100/80 inline-block">
                            {task.campus}
                          </span>
                        </div>

                        {/* 再下面一行：详细位置 (无标题) */}
                        <div className="text-[11px] text-slate-600 flex items-start gap-1">
                          <MapPin size={12} className="text-slate-400 shrink-0 mt-0.5" />
                          <span className="text-slate-700 font-medium">{task.locationDetail}</span>
                        </div>

                        {/* 如果是已巡检，显示：巡检时间、巡检人员、巡检结论 */}
                        {isDone && (
                          <div className="mt-1 bg-slate-50/90 border border-slate-100 rounded-xl p-2.5 space-y-1.5 text-[11px]">
                            <div className="grid grid-cols-2 gap-2 text-slate-600">
                              <div>
                                <span className="text-slate-400">巡检时间：</span>
                                <span className="text-slate-800 font-medium">{task.checkTime || '2026-08-11 09:30'}</span>
                              </div>
                              <div>
                                <span className="text-slate-400">巡检人员：</span>
                                <span className="text-slate-800 font-medium">{task.inspectorName || '张强'}</span>
                              </div>
                            </div>
                            <div className="pt-1.5 border-t border-slate-200/60">
                              <span className="text-slate-400">巡检结论：</span>
                              <span className="text-emerald-700 font-bold">{task.conclusion || '正常无违规'}</span>
                            </div>
                          </div>
                        )}

                        {/* 底部按钮 */}
                        <div className="flex items-center justify-end pt-1">
                          {isDone ? (
                            /* 已巡检状态：显示【查看明细】按钮 */
                            <button
                              onClick={() => handleStartInspection(task)}
                              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 transition-all cursor-pointer flex items-center gap-1"
                            >
                              <span>查看明细</span>
                              <ChevronRight size={13} />
                            </button>
                          ) : (
                            /* 未巡检状态：显示【开始巡检】按钮 */
                            <button
                              onClick={() => handleStartInspection(task)}
                              className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <Scan size={14} />
                              <span>开始巡检</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: 巡检任务 (TASKS) */}
          {activeTab === 'TASKS' && (
            <div className="space-y-4">
              
              {/* Header Filter */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <ClipboardList size={16} className="text-blue-600" /> 巡检任务清单
                  </h2>
                  <span className="text-[11px] text-slate-500">共 {filteredTasks.length} 项</span>
                </div>

                {/* Campus Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                  {['全部', Campus.SIMING, Campus.XIANGAN, '芙蓉隧道'].map(c => (
                    <button
                      key={c}
                      onClick={() => setTaskCampusFilter(c)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                        taskCampusFilter === c
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>

                {/* Status Tabs */}
                <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-xl text-center text-xs font-medium">
                  <button
                    onClick={() => setTaskStatusFilter('ALL')}
                    className={`py-1.5 rounded-lg transition-all ${
                      taskStatusFilter === 'ALL' ? 'bg-white text-blue-600 font-bold shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    全部
                  </button>
                  <button
                    onClick={() => setTaskStatusFilter('PENDING')}
                    className={`py-1.5 rounded-lg transition-all ${
                      taskStatusFilter === 'PENDING' ? 'bg-white text-blue-600 font-bold shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    待打卡
                  </button>
                  <button
                    onClick={() => setTaskStatusFilter('DONE')}
                    className={`py-1.5 rounded-lg transition-all ${
                      taskStatusFilter === 'DONE' ? 'bg-white text-blue-600 font-bold shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    已完成
                  </button>
                  <button
                    onClick={() => setTaskStatusFilter('OVERDUE')}
                    className={`py-1.5 rounded-lg transition-all ${
                      taskStatusFilter === 'OVERDUE' ? 'bg-white text-amber-700 font-bold shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    预警
                  </button>
                </div>
              </div>

              {/* Task Cards List */}
              <div className="space-y-3">
                {filteredTasks.map(board => {
                  const isDone = completedTaskIds.includes(board.id);
                  const isOverdue = board.id === 'board-siming-2';
                  return (
                    <div 
                      key={board.id} 
                      className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xs font-bold text-slate-900">{board.name}</h3>
                          <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                            <MapPin size={11} className="text-slate-400" /> {board.locationDetail}
                          </p>
                        </div>
                        {isDone ? (
                          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            已完成
                          </span>
                        ) : isOverdue ? (
                          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                            超时未查验
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                            待打卡
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2.5">
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="text-slate-400" /> 截止打卡：今日 18:00
                        </span>
                        <span className="font-mono text-slate-400">{board.campus}</span>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => setShowScanModal(true)}
                          className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1"
                        >
                          <Scan size={14} /> 现场扫码
                        </button>
                        <button
                          onClick={() => handleTaskCheckIn(board.id, board.name)}
                          disabled={isDone}
                          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 ${
                            isDone
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-not-allowed'
                              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                          }`}
                        >
                          <CheckCircle2 size={14} /> {isDone ? '已记录打卡' : '确认打卡'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 3: 小景知道 (XIAOJING) */}
          {activeTab === 'XIAOJING' && (
            <div className="flex flex-col h-[calc(100vh-140px)] space-y-3">
              
              {/* Header Info */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
                  <Bot size={22} />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    小景知道 · 厦大巡检智能助手
                    <Sparkles size={13} className="text-blue-600" />
                  </h2>
                  <p className="text-[10px] text-slate-500">掌握全校海报审批规范、防伪印章核销及巡检细则</p>
                </div>
              </div>

              {/* Chat Messages List */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {chatMessages.map(msg => (
                  <div 
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-[10px] text-slate-400 font-mono">{msg.time}</span>
                      <span className="text-[10px] font-medium text-slate-500">
                        {msg.sender === 'user' ? '我' : '小景助手'}
                      </span>
                    </div>

                    <div 
                      className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-tr-xs shadow-xs'
                          : 'bg-slate-100 text-slate-800 border border-slate-200/80 rounded-tl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isChatLoading && (
                  <div className="flex items-center gap-2 text-xs text-blue-600 font-medium p-2 bg-blue-50 rounded-xl w-max">
                    <RefreshCw size={14} className="animate-spin" /> 小景正在翻阅巡检标准与法规...
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Preset Quick Chips */}
              <div className="space-y-1.5 pt-1">
                <p className="text-[10px] text-slate-400 font-medium">快捷常见疑问：</p>
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                  {[
                    '海报张贴有效期是多少天？',
                    '海报防伪印章盖在什么位置？',
                    '发现未加盖防伪码海报如何处置？',
                    '芙蓉隧道涂鸦报批流程'
                  ].map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendChatMessage(q)}
                      className="px-2.5 py-1 bg-white border border-slate-200 hover:border-blue-300 text-slate-700 text-[11px] rounded-full whitespace-nowrap shadow-2xs hover:bg-blue-50 transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Control */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                  placeholder="向小景咨询巡检规范或审核流程..."
                  className="flex-1 bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none shadow-2xs"
                />
                <button
                  onClick={() => handleSendChatMessage()}
                  disabled={!chatInput.trim() || isChatLoading}
                  className={`p-2 rounded-xl text-white font-bold transition-all ${
                    !chatInput.trim() || isChatLoading
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 shadow-xs'
                  }`}
                >
                  <Send size={16} />
                </button>
              </div>

            </div>
          )}

          {/* TAB 4: 我的 (PROFILE) */}
          {activeTab === 'PROFILE' && (
            <div className="space-y-4">
              
              {/* User Profile Header Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-blue-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md shadow-blue-500/20">
                  林
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-slate-900">林云飞</h2>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      巡检组长
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">工号：229202 · 思明校区责任人</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">厦门大学校学生会 · 宣传部巡检中心</p>
                </div>
              </div>

              {/* Inspection Stats */}
              <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs space-y-2">
                <h3 className="text-xs font-bold text-slate-800">个人巡检绩效考评</h3>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                    <span className="text-lg font-extrabold text-blue-600">142 次</span>
                    <span className="text-[10px] text-slate-500 block">本月巡检打卡</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                    <span className="text-lg font-extrabold text-rose-600">12 件</span>
                    <span className="text-[10px] text-slate-500 block">排查处置违规</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                    <span className="text-lg font-extrabold text-emerald-600">98.5%</span>
                    <span className="text-[10px] text-slate-500 block">核销防伪合规率</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                    <span className="text-lg font-extrabold text-indigo-600">14 天</span>
                    <span className="text-[10px] text-slate-500 block">连续在岗打卡</span>
                  </div>
                </div>
              </div>

              {/* Personal Options List */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs divide-y divide-slate-100 text-xs">
                <button 
                  onClick={() => setActiveTab('HOME')}
                  className="w-full p-3.5 flex items-center justify-between text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <History size={16} className="text-blue-600" />
                    <span>我的巡检打卡历史记录</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-400" />
                </button>

                <button 
                  onClick={() => setShowReportModal(true)}
                  className="w-full p-3.5 flex items-center justify-between text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldAlert size={16} className="text-rose-600" />
                    <span>我提交的违规整改工单</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-400" />
                </button>

                <button 
                  onClick={() => setActiveTab('XIAOJING')}
                  className="w-full p-3.5 flex items-center justify-between text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <HelpCircle size={16} className="text-indigo-600" />
                    <span>巡检标准指南 (问小景)</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-400" />
                </button>

                <button 
                  onClick={() => setShowFeatureCatalog(true)}
                  className="w-full p-3.5 flex items-center justify-between text-slate-800 hover:bg-emerald-50/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <FileSpreadsheet size={16} className="text-emerald-600" />
                    <span className="font-bold group-hover:text-emerald-800 transition-colors">系统全功能清单 (查阅/下载)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-black border border-emerald-200">
                      49项全景
                    </span>
                    <ChevronRight size={16} className="text-slate-400" />
                  </div>
                </button>
              </div>

            </div>
          )}

        </main>
      )}

        {/* PLUS OVERLAY POPUP MENU */}
        <AnimatePresence>
          {showPlusMenu && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowPlusMenu(false)}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40"
              />

              {/* Actions Bottom Sheet */}
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-20 left-4 right-4 max-w-sm mx-auto bg-white border border-slate-200 rounded-3xl p-4 shadow-xl z-50 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-blue-600" /> 巡检快捷操作菜单
                  </h3>
                  <button 
                    onClick={() => setShowPlusMenu(false)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      setShowPlusMenu(false);
                      setShowScanModal(true);
                    }}
                    className="p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all"
                  >
                    <Scan size={22} />
                    <span className="text-[11px] font-bold">扫码查验</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowPlusMenu(false);
                      setShowReportModal(true);
                    }}
                    className="p-3 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all"
                  >
                    <ShieldAlert size={22} />
                    <span className="text-[11px] font-bold">违规上报</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowPlusMenu(false);
                      handleTaskCheckIn('board-siming-1', '群贤楼1号海报栏');
                    }}
                    className="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all"
                  >
                    <CheckCircle2 size={22} />
                    <span className="text-[11px] font-bold">一键打卡</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* QR CODE SCANNER MODAL */}
        <AnimatePresence>
          {showScanModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white border border-slate-200 rounded-3xl w-full max-w-sm p-4 space-y-4 shadow-xl"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <QrCode size={16} className="text-blue-600" /> 防伪不干胶/PVC二维码核验
                  </h3>
                  <button onClick={() => setShowScanModal(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={18} />
                  </button>
                </div>

                {/* Finder Frame */}
                <div className="h-44 bg-slate-900 rounded-2xl relative overflow-hidden flex items-center justify-center border-2 border-dashed border-blue-400">
                  {isScanning ? (
                    <div className="text-center space-y-2 text-white">
                      <Scan size={36} className="text-blue-400 mx-auto animate-bounce" />
                      <p className="text-xs font-bold text-blue-300 animate-pulse">正在解析防伪加密编码...</p>
                    </div>
                  ) : (
                    <div className="text-center space-y-1 text-slate-400 p-4">
                      <QrCode size={36} className="mx-auto text-slate-500" />
                      <p className="text-[11px]">对准防伪印章二维码或点击快捷测试按键</p>
                    </div>
                  )}
                  <div className="absolute left-0 right-0 h-0.5 bg-blue-500 shadow-md shadow-blue-500 animate-pulse top-1/2"></div>
                </div>

                {/* Quick Test Buttons */}
                <div className="space-y-1.5">
                  <p className="text-[10px] text-slate-500 font-medium">模拟扫描测试按键：</p>
                  <div className="grid grid-cols-2 gap-1.5 text-xs font-medium">
                    <button
                      onClick={() => handleTriggerScan('XM-POSTER-2026-0881')}
                      className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left flex items-center justify-between"
                    >
                      <span>海报印章(合规)</span>
                      <span className="text-[9px] font-mono text-emerald-600">0881</span>
                    </button>
                    <button
                      onClick={() => handleTriggerScan('XM-GRAFFITI-2026-012')}
                      className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left flex items-center justify-between"
                    >
                      <span>涂鸦PVC(合规)</span>
                      <span className="text-[9px] font-mono text-emerald-600">0012</span>
                    </button>
                    <button
                      onClick={() => handleTriggerScan('XM-EXPIRED-POSTER-099')}
                      className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left flex items-center justify-between"
                    >
                      <span>超期海报(警告)</span>
                      <span className="text-[9px] font-mono text-amber-600">EXPIRED</span>
                    </button>
                    <button
                      onClick={() => handleTriggerScan('ILLEGAL-CODE-999')}
                      className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left flex items-center justify-between"
                    >
                      <span>未备案(非法)</span>
                      <span className="text-[9px] font-mono text-rose-600">ILLEGAL</span>
                    </button>
                  </div>
                </div>

                {/* Scan Result */}
                {scanResult && (
                  <div className={`p-3 rounded-2xl border space-y-2 text-xs ${
                    scanResult.status === 'VALID'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : scanResult.status === 'EXPIRED'
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}>
                    <div className="flex items-center justify-between font-bold border-b border-black/10 pb-1.5">
                      <span className="flex items-center gap-1">
                        {scanResult.status === 'VALID' && <CheckCircle2 size={16} className="text-emerald-600" />}
                        {scanResult.status === 'EXPIRED' && <AlertTriangle size={16} className="text-amber-600" />}
                        {scanResult.status === 'INVALID' && <ShieldAlert size={16} className="text-rose-600" />}
                        {scanResult.status === 'VALID' ? '审定备案有效 ✅' : scanResult.status === 'EXPIRED' ? '警告：已超期 ⚠️' : '未备案违规作品 🚨'}
                      </span>
                      <span className="font-mono text-[10px] opacity-80">{scanResult.code}</span>
                    </div>
                    <p className="font-bold">{scanResult.title}</p>
                    <p className="text-[11px] opacity-80">申请单位：{scanResult.org}</p>
                    <p className="text-[11px] opacity-80">防伪类型：{scanResult.type}</p>

                    {scanResult.status !== 'VALID' && (
                      <button
                        onClick={() => {
                          setShowScanModal(false);
                          setShowReportModal(true);
                        }}
                        className="w-full py-1.5 bg-rose-600 text-white font-bold rounded-xl text-xs mt-1"
                      >
                        转入违规事件上报
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* VIOLATION REPORT MODAL */}
        <AnimatePresence>
          {showReportModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white border border-slate-200 rounded-3xl w-full max-w-sm p-4 space-y-3 shadow-xl"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <ShieldAlert size={16} className="text-rose-600" /> 违规异常事件上报
                  </h3>
                  <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={18} />
                  </button>
                </div>

                {reportSubmittedSuccess ? (
                  <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-2">
                    <CheckCircle2 size={36} className="text-emerald-600 mx-auto" />
                    <h4 className="text-sm font-bold text-emerald-900">上报成功！</h4>
                    <p className="text-xs text-emerald-700">工单已即时推送到后台【违规事件管理】。</p>
                  </div>
                ) : (
                  <form onSubmit={handleReportSubmit} className="space-y-2.5 text-xs">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">违规名称</label>
                      <input
                        type="text"
                        required
                        value={reportTitle}
                        onChange={(e) => setReportTitle(e.target.value)}
                        placeholder="例：发现群贤楼海报未贴防伪印章"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 outline-none focus:border-rose-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">违规分类</label>
                      <select
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 outline-none focus:border-rose-500"
                      >
                        <option value="未加盖印章/二维码">未加盖印章/二维码</option>
                        <option value="超期未清理">超期未清理</option>
                        <option value="擅自覆盖他人作品">擅自覆盖他人作品</option>
                        <option value="内容与审批不符">内容与审批不符</option>
                        <option value="墙面/展板损坏">墙面/展板损坏</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">现场取证照片</label>
                      <div className="h-28 bg-slate-100 border border-slate-200 rounded-2xl overflow-hidden relative flex items-center justify-center">
                        <img src={reportPhoto} alt="现场" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setReportPhoto(reportPhoto.includes('1581091226825') ? 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500&q=80' : 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&q=80')}
                          className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] text-white flex items-center gap-1"
                        >
                          <Camera size={12} /> 重新拍摄
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">现场补充说明</label>
                      <textarea
                        rows={2}
                        value={reportNotes}
                        onChange={(e) => setReportNotes(e.target.value)}
                        placeholder="请输入现场违规细节说明..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 outline-none focus:border-rose-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 mt-1"
                    >
                      <Send size={15} /> 提交整改通知工单
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* TASK DETAIL MODAL FOR 查看 */}
        <AnimatePresence>
          {selectedTaskDetail && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-xl border border-slate-100 relative"
              >
                <button
                  onClick={() => setSelectedTaskDetail(null)}
                  className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 cursor-pointer"
                >
                  <X size={16} />
                </button>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <ClipboardList size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">巡检任务详情</h3>
                    <span className="text-[10px] text-slate-400">巡检编号：{selectedTaskDetail.id}</span>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 space-y-2 text-xs text-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">巡检校区：</span>
                    <span className="font-semibold text-slate-900">{selectedTaskDetail.campus}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">巡检对象名称：</span>
                    <span className="font-semibold text-slate-900">{selectedTaskDetail.targetName}</span>
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-slate-400 shrink-0">详细位置：</span>
                    <span className="font-semibold text-slate-900 text-right">{selectedTaskDetail.locationDetail}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">巡检状态：</span>
                    <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                      {selectedTaskDetail.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/60">
                    <span className="text-slate-400">巡检时间：</span>
                    <span className="font-medium text-slate-800">{selectedTaskDetail.checkTime || '-'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">巡检人员：</span>
                    <span className="font-medium text-slate-800">{selectedTaskDetail.inspectorName || '-'}</span>
                  </div>
                  <div className="pt-1.5 border-t border-slate-200/60 space-y-1">
                    <span className="text-slate-400 block">巡检结论：</span>
                    <p className="font-semibold text-emerald-800 bg-white p-2 rounded-lg border border-slate-200/70">
                      {selectedTaskDetail.conclusion || '正常无违规'}
                    </p>
                  </div>
                  {selectedTaskDetail.notes && (
                    <div className="pt-1 space-y-1">
                      <span className="text-slate-400 block">现场记录说明：</span>
                      <p className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200/70">
                        {selectedTaskDetail.notes}
                      </p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setSelectedTaskDetail(null)}
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all cursor-pointer"
                >
                  确定并返回
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ONLINE POSTER BOARD MODAL (线上海报栏界面) */}
        <AnimatePresence>
          {showOnlineBoardModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-white rounded-3xl max-w-sm w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-100 relative"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white p-4 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-300 border border-indigo-400/30">
                      <LayoutGrid size={18} />
                    </div>
                    <div>
                      <h3 className="text-xs font-extrabold leading-tight">线上海报栏 (数字发布栏)</h3>
                      <p className="text-[10px] text-indigo-200/80 mt-0.5 truncate max-w-[180px]">
                        {activeInspectionTask?.targetName || '宣传展板云端电子屏'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => {
                        window.open('#/online-poster-board', '_blank');
                      }}
                      className="px-2 py-1 rounded-lg bg-indigo-500/30 hover:bg-indigo-500/50 text-indigo-100 text-[10px] font-bold border border-indigo-400/30 flex items-center gap-1 cursor-pointer transition-all"
                      title="在新窗口独立打开"
                    >
                      <ExternalLink size={11} />
                      <span className="hidden sm:inline">新窗口</span>
                    </button>
                    <button 
                      onClick={() => setShowOnlineBoardModal(false)}
                      className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 overflow-y-auto space-y-3.5 bg-slate-50 flex-1">
                  {/* Location Info Banner */}
                  <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-slate-900">
                        {activeInspectionTask?.targetName}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        实时同步
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin size={12} className="text-indigo-600 shrink-0" />
                      <span>{activeInspectionTask?.locationDetail}</span>
                    </p>
                  </div>

                  {/* Poster Slots Grid */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Globe size={14} className="text-indigo-600" />
                        <span>线上发布海报清单 ({activeInspectionTask?.posterSlots?.length || 0})</span>
                      </h4>
                    </div>

                    <div className="space-y-3">
                      {activeInspectionTask?.posterSlots?.map((slot, sIdx) => (
                        <div key={sIdx} className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-xs">
                            <span className="font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                              栏位：{slot.slotName}
                            </span>
                            <span className="font-mono text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-bold border border-slate-200/80">
                              {slot.qrCode}
                            </span>
                          </div>
                          
                          <div className="flex gap-3">
                            <div className="w-20 h-28 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0 shadow-2xs">
                              <img src={slot.imageUrl} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="space-y-1.5 text-xs flex-1 flex flex-col justify-between py-0.5">
                              <div>
                                <h5 className="font-extrabold text-slate-900 leading-snug line-clamp-2">{slot.posterTitle}</h5>
                                <div className="mt-1">
                                  <span className="text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md font-bold border border-indigo-100 inline-block">
                                    {slot.orgName}
                                  </span>
                                </div>
                              </div>
                              <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[10px]">
                                <span className="text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                  数字备案合格
                                </span>
                                <span className="text-slate-400 font-mono">2026云端发布</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">线上与线下实物展板动态对齐</span>
                  <button
                    onClick={() => setShowOnlineBoardModal(false)}
                    className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all cursor-pointer shadow-xs"
                  >
                    关闭
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ABNORMAL HANDLING MODAL (巡检结论异常处理弹窗) */}
        <AnimatePresence>
          {showAbnormalModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="bg-white rounded-3xl max-w-sm w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-100 relative"
              >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-amber-700 text-white p-4 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white border border-white/30 shrink-0">
                      <AlertTriangle size={18} />
                    </div>
                    <div>
                      <h3 className="text-xs font-extrabold leading-tight">巡检异常处理与取证</h3>
                      <p className="text-[10px] text-rose-100/90 mt-0.5 truncate max-w-[200px]">
                        {abnormalContext.slotName ? `${abnormalContext.slotName} · ${abnormalContext.posterTitle || ''}` : '现场违规异常记录'}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowAbnormalModal(false)}
                    className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-4 overflow-y-auto space-y-3.5 bg-slate-50 flex-1 text-xs">
                  {/* Target Item Context Banner */}
                  {abnormalContext.itemText && (
                    <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-3 flex items-start gap-2 text-rose-900">
                      <AlertCircle size={15} className="text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-extrabold text-[11px] block">异常项目：{abnormalContext.itemText}</span>
                        <span className="text-[10px] text-rose-700/80 block mt-0.5">请录入现场处理建议与现场取证留存图</span>
                      </div>
                    </div>
                  )}

                  {/* 1. 处理方式 */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                    <label className="font-extrabold text-slate-800 flex items-center gap-1.5 text-xs">
                      <Wrench size={14} className="text-rose-600" />
                      <span>处理方式</span>
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        '现场下架/拆除',
                        '限期联系整改',
                        '补办审批手续',
                        '违规上报工单'
                      ].map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setAbnormalHandlingMethod(method)}
                          className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer text-center ${
                            abnormalHandlingMethod === method
                              ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. 异常描述 */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                    <label className="font-extrabold text-slate-800 flex items-center gap-1.5 text-xs">
                      <FileText size={14} className="text-rose-600" />
                      <span>异常描述</span>
                    </label>
                    <textarea
                      rows={3}
                      value={abnormalDescription}
                      onChange={(e) => setAbnormalDescription(e.target.value)}
                      placeholder="请输入现场异常细节描述..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:border-rose-500 focus:bg-white transition-all resize-none"
                    />
                    {/* Quick preset tags */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {['未张贴二维码', '超期未清理', '覆盖他人海报', '与备案不符', '展板表面破损'].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setAbnormalDescription(prev => prev ? `${prev} (${tag})` : tag)}
                          className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] rounded-md border border-slate-200/80 cursor-pointer font-medium transition-colors"
                        >
                          +{tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. 现场图片拍照 */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="font-extrabold text-slate-800 flex items-center gap-1.5 text-xs">
                        <Camera size={14} className="text-rose-600" />
                        <span>现场图片拍照 ({abnormalPhotos.length})</span>
                      </label>
                      <span className="text-[10px] text-slate-400">实时上传取证</span>
                    </div>

                    {/* Photo Preview Grid */}
                    <div className="grid grid-cols-3 gap-2">
                      {abnormalPhotos.map((photo, pIdx) => (
                        <div key={pIdx} className="aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative group shadow-2xs">
                          <img src={photo} alt="现场" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setAbnormalPhotos(prev => prev.filter((_, i) => i !== pIdx))}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-rose-600 transition-colors cursor-pointer"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}

                      {/* Take photo button */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsTakingPhoto(true);
                          setTimeout(() => {
                            const newPhotos = [
                              'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500&q=80',
                              'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80',
                              'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500&q=80'
                            ];
                            const randomPhoto = newPhotos[Math.floor(Math.random() * newPhotos.length)];
                            setAbnormalPhotos(prev => [...prev, randomPhoto]);
                            setIsTakingPhoto(false);
                          }, 600);
                        }}
                        disabled={isTakingPhoto}
                        className="aspect-square rounded-xl border-2 border-dashed border-rose-200 hover:border-rose-400 bg-rose-50/50 hover:bg-rose-50 text-rose-600 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
                      >
                        {isTakingPhoto ? (
                          <div className="w-4 h-4 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Camera size={18} />
                            <span className="text-[10px] font-bold">现场拍照</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-3.5 bg-white border-t border-slate-200 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAbnormalModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition-all cursor-pointer"
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAbnormalModal(false);
                      setAbnormalSavedToast(true);
                      setTimeout(() => setAbnormalSavedToast(false), 2500);
                    }}
                    className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 size={14} />
                    <span>保存异常处置记录</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Abnormal Saved Toast */}
        <AnimatePresence>
          {abnormalSavedToast && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold border border-slate-700"
            >
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>已成功登记异常处理方式与现场取证照片</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* System Feature Catalog Modal */}
        <SystemFeatureCatalogModal 
          isOpen={showFeatureCatalog} 
          onClose={() => setShowFeatureCatalog(false)} 
        />

      </div>
    </div>
  );
}
