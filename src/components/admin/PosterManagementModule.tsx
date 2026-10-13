import React, { useState, useEffect } from 'react';
import PosterDetailModal from './PosterDetailModal';
import { 
  MOCK_POSTER_BOARDS, 
  MOCK_POSTER_APPLICATIONS 
} from '../../data/posterGraffitiMock';
import { 
  PosterBoard, 
  ApprovalStatus, 
  ApplicantRole, 
  Campus 
} from '../../types/posterGraffitiTypes';
import { 
  Building2, 
  Plus, 
  Search, 
  Layers, 
  BarChart3, 
  RotateCcw, 
  RotateCw,
  Grid, 
  FileCheck,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Upload,
  Send,
  Download,
  Image as ImageIcon
} from 'lucide-react';

export interface PosterBoardItem {
  id: string;
  imageUrl: string;
  images?: string[];
  name: string;
  campus: string;
  locationDetail: string;
  maxColumns: number;
  status: '开放申请' | '关闭申请';
  inspectorName?: string;
}

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
  status: string; // '待辅导员审批' | '待单位负责人审批' | '待学生会审批' | '待团委审批' | '审批通过' | '审批不通过' | '已撤回'
  posterSize: string;
  postingLocations: PostingLocationItem[];
  contactPhone?: string;
  currentStep?: string;
  myApprovalResult?: '通过' | '不通过';
  myApprovalTime?: string;
}

interface PosterManagementModuleProps {
  subTab?: string;
}

export default function PosterManagementModule({ subTab = 'POS-02' }: PosterManagementModuleProps) {
  const [activeTab, setActiveTab] = useState(subTab);

  useEffect(() => {
    if (subTab) {
      setActiveTab(subTab);
    }
  }, [subTab]);

  const isApprovalMode = activeTab === 'POS-03' || subTab === 'POS-03';
  const isBoardManagement = activeTab === 'POS-01' || subTab === 'POS-01';
  const isPosterLibrary = activeTab === 'POS-09' || subTab === 'POS-09';
  const isOnlineBoard = activeTab === 'POS-10' || subTab === 'POS-10';
  const isAnalytics = activeTab === 'POS-11' || subTab === 'POS-11';

  // Initial Mock Boards Data
  const INITIAL_BOARDS: PosterBoardItem[] = [
    {
      id: 'board-1',
      imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=600&q=80',
      name: '三家村 1 号张贴栏',
      campus: '思明校区',
      locationDetail: '思明校区三家村广场东侧演武路口',
      maxColumns: 6,
      status: '开放申请',
      inspectorName: '林云飞'
    },
    {
      id: 'board-2',
      imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80',
      name: '三家村 2 号张贴栏',
      campus: '思明校区',
      locationDetail: '思明校区三家村广场西侧学生活动中心前',
      maxColumns: 6,
      status: '开放申请',
      inspectorName: '林云飞'
    },
    {
      id: 'board-3',
      imageUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=600&q=80',
      name: '芙蓉餐厅侧栏',
      campus: '思明校区',
      locationDetail: '思明校区芙蓉园区芙蓉二宿舍楼下连廊',
      maxColumns: 4,
      status: '开放申请',
      inspectorName: '苏雨桐'
    },
    {
      id: 'board-4',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80',
      name: '群贤楼主海报栏',
      campus: '思明校区',
      locationDetail: '思明校区主楼群群贤楼大厅右侧入口',
      maxColumns: 8,
      status: '开放申请',
      inspectorName: '林云飞'
    },
    {
      id: 'board-5',
      imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80',
      name: '竞丰餐厅前张贴栏',
      campus: '翔安校区',
      locationDetail: '翔安校区竞丰食堂正门广场两侧',
      maxColumns: 6,
      status: '开放申请',
      inspectorName: '张梓豪'
    },
    {
      id: 'board-6',
      imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80',
      name: '南光餐厅主干道海报栏',
      campus: '思明校区',
      locationDetail: '思明校区南光园区主干道旁',
      maxColumns: 4,
      status: '关闭申请',
      inspectorName: '苏雨桐'
    }
  ];

  const [boards, setBoards] = useState<PosterBoardItem[]>(INITIAL_BOARDS);

  // Filter & Pagination States for Board Management (POS-01)
  const [boardSearchName, setBoardSearchName] = useState('');
  const [boardSearchCampus, setBoardSearchCampus] = useState('全部校区');
  const [boardSearchStatus, setBoardSearchStatus] = useState('全部状态');
  const [boardPage, setBoardPage] = useState(1);
  const [boardPageSize, setBoardPageSize] = useState(5);

  // Online Poster Board State (POS-10)
  const [onlineCampus, setOnlineCampus] = useState('思明校区');
  const [onlineBoardId, setOnlineBoardId] = useState('board-1');
  const [isOnlineRefreshing, setIsOnlineRefreshing] = useState(false);
  const [isOnlineInfoCollapsed, setIsOnlineInfoCollapsed] = useState(true);
  const [selectedOnlinePoster, setSelectedOnlinePoster] = useState<{
    id: string;
    title: string;
    orgName: string;
    imageUrl: string;
    dateRange?: string;
  } | null>(null);

  // Mock Online Posters Dataset
  const MOCK_ONLINE_POSTERS_MAP: Record<string, Array<{
    id: string;
    title: string;
    orgName: string;
    imageUrl: string;
    dateRange: string;
  }>> = {
    'board-1': [
      {
        id: 'p1',
        title: '2026年厦门大学迎新草地音乐节',
        orgName: '校学生会宣传部',
        imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
        dateRange: '2026.08.10 - 08.16'
      },
      {
        id: 'p2',
        title: '“自强不息”校史话剧巡演拉票宣传',
        orgName: '艺术学院青年志愿者协会',
        imageUrl: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=600&q=80',
        dateRange: '2026.08.09 - 08.15'
      },
      {
        id: 'p3',
        title: '全校羽毛球联赛总决赛宣传',
        orgName: '体育学部',
        imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80',
        dateRange: '2026.08.08 - 08.14'
      },
      {
        id: 'p4',
        title: '“青创杯”大学生创新创业大赛报名',
        orgName: '创新创业学院',
        imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80',
        dateRange: '2026.08.07 - 08.13'
      }
    ],
    'board-2': [
      {
        id: 'p5',
        title: '校园歌手大赛半决赛热演',
        orgName: '校广播电台',
        imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80',
        dateRange: '2026.08.11 - 08.18'
      },
      {
        id: 'p6',
        title: '厦大电影协会周末展映周',
        orgName: '电影学院',
        imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80',
        dateRange: '2026.08.10 - 08.17'
      },
      {
        id: 'p7',
        title: '外语角英语沙龙活动招募',
        orgName: '外文学院',
        imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80',
        dateRange: '2026.08.09 - 08.15'
      }
    ],
    'board-3': [
      {
        id: 'p8',
        title: '美食文化节美食品鉴交流会',
        orgName: '后勤集团饮食中心',
        imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80',
        dateRange: '2026.08.12 - 08.18'
      },
      {
        id: 'p9',
        title: '跳蚤市场毕业季爱心义卖',
        orgName: '青年志愿者协会',
        imageUrl: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb9?w=600&q=80',
        dateRange: '2026.08.10 - 08.16'
      }
    ],
    'board-4': [
      {
        id: 'p10',
        title: '人工智能与机器人前沿学术讲座',
        orgName: '计算机科学与技术系',
        imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80',
        dateRange: '2026.08.11 - 08.17'
      },
      {
        id: 'p11',
        title: '国家重点实验室开放日学术论坛',
        orgName: '物理科学与技术学院',
        imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80',
        dateRange: '2026.08.10 - 08.16'
      },
      {
        id: 'p12',
        title: '近海海洋环境科学研讨会',
        orgName: '海洋与地球学院团党委',
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
        dateRange: '2026.08.08 - 08.14'
      },
      {
        id: 'p13',
        title: '人文名家学术讲座第 42 期',
        orgName: '人文学院',
        imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&q=80',
        dateRange: '2026.08.09 - 08.15'
      }
    ],
    'board-5': [
      {
        id: 'p14',
        title: '翔安校区星空露天电影放映会',
        orgName: '翔安校区管委会',
        imageUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&q=80',
        dateRange: '2026.08.12 - 08.19'
      },
      {
        id: 'p15',
        title: '生命科学前沿突破名家论坛',
        orgName: '生命科学学院',
        imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&q=80',
        dateRange: '2026.08.10 - 08.16'
      }
    ],
    'board-6': [
      {
        id: 'p16',
        title: '心理健康月“阳光心态”主题沙龙',
        orgName: '心理咨询中心',
        imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80',
        dateRange: '2026.08.11 - 08.17'
      }
    ]
  };

  const triggerOnlineRefresh = () => {
    setIsOnlineRefreshing(true);
    setTimeout(() => {
      setIsOnlineRefreshing(false);
    }, 350);
  };

  const handleOnlineCampusChange = (campus: string) => {
    setOnlineCampus(campus);
    const validBoards = boards.filter(b => b.campus === campus);
    if (!validBoards.some(b => b.id === onlineBoardId)) {
      setOnlineBoardId(validBoards.length > 0 ? validBoards[0].id : '');
    }
    triggerOnlineRefresh();
  };

  const handleOnlineBoardChange = (boardId: string) => {
    setOnlineBoardId(boardId);
    triggerOnlineRefresh();
  };

  // Modals for Board Management
  const [showNewBoardModal, setShowNewBoardModal] = useState(false);
  const [editingBoard, setEditingBoard] = useState<PosterBoardItem | null>(null);
  const [viewingBoard, setViewingBoard] = useState<PosterBoardItem | null>(null);

  // Status confirm modal states for Board Management
  const [statusConfirmBoard, setStatusConfirmBoard] = useState<PosterBoardItem | null>(null);
  const [targetStatus, setTargetStatus] = useState<'开放申请' | '关闭申请' | null>(null);
  const [closeReason, setCloseReason] = useState('');

  // Form Fields for Board Management Modal
  const [boardFormName, setBoardFormName] = useState('');
  const [boardFormCampus, setBoardFormCampus] = useState('思明校区');
  const [boardFormLocation, setBoardFormLocation] = useState('');
  const [boardFormMaxColumns, setBoardFormMaxColumns] = useState(6);
  const [boardFormStatus, setBoardFormStatus] = useState<'开放申请' | '关闭申请'>('开放申请');
  const [boardFormImages, setBoardFormImages] = useState<string[]>([]);
  const [boardFormInspector, setBoardFormInspector] = useState('林云飞');

  const handleOpenNewBoard = () => {
    setEditingBoard(null);
    setBoardFormName('');
    setBoardFormCampus('思明校区');
    setBoardFormLocation('');
    setBoardFormMaxColumns(6);
    setBoardFormStatus('开放申请');
    setBoardFormImages(['https://images.unsplash.com/photo-1577495508048-b635879837f1?w=600&q=80']);
    setBoardFormInspector('林云飞');
    setShowNewBoardModal(true);
  };

  const handleOpenEditBoard = (b: PosterBoardItem) => {
    setEditingBoard(b);
    setBoardFormName(b.name);
    setBoardFormCampus(b.campus);
    setBoardFormLocation(b.locationDetail);
    setBoardFormMaxColumns(b.maxColumns);
    setBoardFormStatus(b.status);
    setBoardFormImages(b.images && b.images.length > 0 ? b.images : [b.imageUrl].filter(Boolean));
    setBoardFormInspector(b.inspectorName || '林云飞');
    setShowNewBoardModal(true);
  };

  const handleBoardImagesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files: File[] = Array.from(e.target.files);
    files.forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setBoardFormImages(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleRemoveBoardImage = (indexToRemove: number) => {
    setBoardFormImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSaveBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardFormName.trim()) {
      alert('请填写张贴栏名称');
      return;
    }
    if (!boardFormLocation.trim()) {
      alert('请填写详细位置');
      return;
    }

    const primaryImg = boardFormImages.length > 0 
      ? boardFormImages[0] 
      : 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=600&q=80';

    if (editingBoard) {
      setBoards(prev => prev.map(item => item.id === editingBoard.id ? {
        ...item,
        name: boardFormName,
        campus: boardFormCampus,
        locationDetail: boardFormLocation,
        maxColumns: boardFormMaxColumns,
        status: boardFormStatus,
        imageUrl: primaryImg,
        images: boardFormImages.length > 0 ? boardFormImages : [primaryImg],
        inspectorName: boardFormInspector
      } : item));
    } else {
      const newBoardItem: PosterBoardItem = {
        id: `board-${Date.now()}`,
        name: boardFormName,
        campus: boardFormCampus,
        locationDetail: boardFormLocation,
        maxColumns: boardFormMaxColumns,
        status: boardFormStatus,
        imageUrl: primaryImg,
        images: boardFormImages.length > 0 ? boardFormImages : [primaryImg],
        inspectorName: boardFormInspector
      };
      setBoards(prev => [newBoardItem, ...prev]);
    }

    setShowNewBoardModal(false);
  };

  const handleOpenStatusConfirm = (board: PosterBoardItem, status: '开放申请' | '关闭申请') => {
    setStatusConfirmBoard(board);
    setTargetStatus(status);
    setCloseReason('');
  };

  const handleConfirmStatusChange = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!statusConfirmBoard || !targetStatus) return;

    if (targetStatus === '关闭申请' && !closeReason.trim()) {
      alert('请填写关闭原因');
      return;
    }

    setBoards(prev => prev.map(b => {
      if (b.id === statusConfirmBoard.id) {
        return { ...b, status: targetStatus };
      }
      return b;
    }));

    setStatusConfirmBoard(null);
    setTargetStatus(null);
    setCloseReason('');
  };

  const filteredBoards = boards.filter(b => {
    if (boardSearchName && !b.name.includes(boardSearchName) && !b.locationDetail.includes(boardSearchName)) {
      return false;
    }
    if (boardSearchCampus !== '全部校区' && b.campus !== boardSearchCampus) {
      return false;
    }
    if (boardSearchStatus !== '全部状态' && b.status !== boardSearchStatus) {
      return false;
    }
    return true;
  });

  const totalBoardItems = filteredBoards.length;
  const totalBoardPages = Math.ceil(totalBoardItems / boardPageSize) || 1;
  const paginatedBoards = filteredBoards.slice(
    (boardPage - 1) * boardPageSize,
    boardPage * boardPageSize
  );

  // Initial Mock Data according to user requirements
  const INITIAL_POSTER_APPS: PosterAppItem[] = [
    {
      id: 'pos-app-1001',
      title: '2026年厦门大学迎新草地音乐节',
      posterImageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
      submittedAt: '2026-08-07 14:30',
      orgName: '校学生会宣传部',
      applicantName: '陈立群',
      applicantType: '学生',
      status: '待辅导员审批',
      posterSize: '2 栏',
      postingLocations: [
        { areaName: '思明校区三家村 1 号张贴栏 第 3 列', timeRange: '2026-08-10' },
        { areaName: '思明校区芙蓉餐厅侧栏 第 1 列', timeRange: '2026-08-11' }
      ],
      contactPhone: '13959200001'
    },
    {
      id: 'pos-app-1002',
      title: '人工智能与机器人前沿学术讲座',
      posterImageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80',
      submittedAt: '2026-08-07 11:20',
      orgName: '计算机科学与技术系',
      applicantName: '王建军 教授',
      applicantType: '教职工',
      status: '待单位负责人审批',
      posterSize: '1 栏',
      postingLocations: [
        { areaName: '思明校区群贤楼主海报栏 第 2 列', timeRange: '2026-08-11' }
      ],
      contactPhone: '13959200002'
    },
    {
      id: 'pos-app-1003',
      title: '“自强不息”校史话剧巡演拉票宣传',
      posterImageUrl: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=600&q=80',
      submittedAt: '2026-08-06 16:45',
      orgName: '艺术学院青年志愿者协会',
      applicantName: '李梦琪',
      applicantType: '学生',
      status: '待学生会审批',
      posterSize: '2 栏',
      postingLocations: [
        { areaName: '思明校区三家村 2 号张贴栏 第 5 列', timeRange: '2026-08-09' }
      ],
      contactPhone: '13959200003'
    },
    {
      id: 'pos-app-1004',
      title: '海洋科考成果展与知识竞赛',
      posterImageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&q=80',
      submittedAt: '2026-08-06 09:15',
      orgName: '海洋与地球学院团党委',
      applicantName: '黄美玲',
      applicantType: '教职工',
      status: '待团委审批',
      posterSize: '3 栏',
      postingLocations: [
        { areaName: '翔安校区竞丰餐厅前张贴栏 第 1 列', timeRange: '2026-08-12' }
      ],
      contactPhone: '13959200004'
    },
    {
      id: 'pos-app-1005',
      title: '百年校庆嘉庚精神读书交流会',
      posterImageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80',
      submittedAt: '2026-08-05 10:30',
      orgName: '厦门大学吉他协会',
      applicantName: '张宇轩',
      applicantType: '学生',
      status: '审批通过',
      posterSize: '1 栏',
      postingLocations: [
        { areaName: '思明校区三家村 1 号张贴栏 第 1 列', timeRange: '2026-08-08' }
      ],
      contactPhone: '13959200005',
      myApprovalResult: '通过',
      myApprovalTime: '2026-08-06 11:20'
    },
    {
      id: 'pos-app-1006',
      title: '校园摇滚乐队破冰演唱会宣传',
      posterImageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80',
      submittedAt: '2026-08-04 15:00',
      orgName: '厦大音乐社',
      applicantName: '刘星宇',
      applicantType: '学生',
      status: '审批不通过',
      posterSize: '2 栏',
      postingLocations: [
        { areaName: '思明校区芙蓉餐厅侧栏 第 4 列', timeRange: '2026-08-07' }
      ],
      contactPhone: '13959200006',
      myApprovalResult: '不通过',
      myApprovalTime: '2026-08-05 14:10'
    },
    {
      id: 'pos-app-1007',
      title: '外文学院学术沙龙暨外文诗歌朗诵会',
      posterImageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&q=80',
      submittedAt: '2026-08-03 09:30',
      orgName: '外文学院团党委',
      applicantName: '赵若琳',
      applicantType: '教职工',
      status: '待团委审批',
      posterSize: '1 栏',
      postingLocations: [
        { areaName: '思明校区群贤楼主海报栏 第 3 列', timeRange: '2026-08-10' }
      ],
      contactPhone: '13959200007',
      myApprovalResult: '通过',
      myApprovalTime: '2026-08-04 16:50'
    }
  ];

  const [applications, setApplications] = useState<PosterAppItem[]>(INITIAL_POSTER_APPS);

  // Filter States
  const [searchTitle, setSearchTitle] = useState('');
  const [searchOrg, setSearchOrg] = useState('全部单位');
  const [searchStartDate, setSearchStartDate] = useState('');
  const [searchEndDate, setSearchEndDate] = useState('');

  // Poster Library Filter States (POS-09)
  const [libCampus, setLibCampus] = useState('全部校区');
  const [libBoard, setLibBoard] = useState('全部海报栏');
  const [libOrg, setLibOrg] = useState('全部单位');
  const [libStartDate, setLibStartDate] = useState('');
  const [libEndDate, setLibEndDate] = useState('');
  const [libTitle, setLibTitle] = useState('');
  const [libPage, setLibPage] = useState(1);
  const [libPageSize, setLibPageSize] = useState(5);

  const handleLibReset = () => {
    setLibCampus('全部校区');
    setLibBoard('全部海报栏');
    setLibOrg('全部单位');
    setLibStartDate('');
    setLibEndDate('');
    setLibTitle('');
    setLibPage(1);
  };

  // Main Tab State: 'pending' | 'completed'
  const [activeMainTab, setActiveMainTab] = useState<'pending' | 'completed'>('pending');

  // Modals
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [viewingApp, setViewingApp] = useState<PosterAppItem | null>(null);
  const [reviewingApp, setReviewingApp] = useState<PosterAppItem | null>(null);
  const [approvalDecision, setApprovalDecision] = useState<'同意' | '不同意'>('同意');
  const [approvalOpinion, setApprovalOpinion] = useState<string>('同意申请，海报尺寸与宣发内容符合校园阵地管理规定。');
  const [approvalError, setApprovalError] = useState<string>('');

  // New Application Form State
  const [formOrg, setFormOrg] = useState('校学生会宣传部');
  const [formApplicant, setFormApplicant] = useState('张三 (宣传部负责人)');
  const [formPhone, setFormPhone] = useState('13800138000');
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPosterImageUrl, setFormPosterImageUrl] = useState('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80');
  const [formSize, setFormSize] = useState('2 栏');

  // Location Items State for New Application Form
  interface FormLocationItem {
    id: string;
    campus: string;
    boardName: string;
    spot: string;
    startDate: string;
    endDate: string;
  }

  const [formLocations, setFormLocations] = useState<FormLocationItem[]>([
    {
      id: 'loc-1',
      campus: '思明校区',
      boardName: '三家村 1 号张贴栏',
      spot: '第 1-2 栏',
      startDate: '2026-08-10',
      endDate: '2026-08-12'
    }
  ]);

  // Sub-modal state for location setting
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [editingLocId, setEditingLocId] = useState<string | null>(null);
  const [locCampus, setLocCampus] = useState('思明校区');
  const [locBoard, setLocBoard] = useState('三家村 1 号张贴栏');
  
  // Interactive Grid Matrix States for "新增张贴位置"
  const [locSelectedDates, setLocSelectedDates] = useState<string[]>(['2026-08-10', '2026-08-11', '2026-08-12']);
  const [locStartCol, setLocStartCol] = useState<number>(1);
  const [hoveredRowDate, setHoveredRowDate] = useState<string | null>(null);
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);

  // Helper: parse column requirement count (1, 2, 3, or 4)
  const getNeededColsCount = (sizeStr: string): number => {
    if (sizeStr.includes('1')) return 1;
    if (sizeStr.includes('2')) return 2;
    if (sizeStr.includes('3')) return 3;
    if (sizeStr.includes('4')) return 4;
    return 2;
  };

  // Helper: generate next 20 days array
  const getNext20Days = (): string[] => {
    const dates: string[] = [];
    const baseDate = new Date(2026, 7, 8); // 2026-08-08
    for (let i = 0; i < 20; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      dates.push(`${yyyy}-${mm}-${dd}`);
    }
    return dates;
  };

  // Helper: get grid cell status for mock visual
  const getGridCellStatus = (dateStr: string, colNum: number, boardName: string): '空闲' | '申请占位中' | '使用中' => {
    const dayNum = parseInt(dateStr.slice(-2), 10);
    if ((dayNum === 13 || dayNum === 14) && (colNum === 3 || colNum === 4)) return '使用中';
    if ((dayNum === 18 || dayNum === 19) && colNum === 1) return '使用中';
    if (dayNum === 15 && colNum === 2) return '申请占位中';
    if (dayNum === 22 && colNum === 3) return '申请占位中';
    return '空闲';
  };

  // Toggle single date in grid selection
  const toggleDateSelection = (dateStr: string) => {
    setLocSelectedDates(prev => {
      if (prev.includes(dateStr)) {
        return prev.filter(d => d !== dateStr);
      } else {
        if (prev.length >= 3) {
          alert('最多只能申请 3 天。');
          return prev;
        }
        return [...prev, dateStr];
      }
    });
  };

  // Open add location modal
  const handleOpenAddLocation = () => {
    setEditingLocId(null);
    setLocCampus('思明校区');
    setLocBoard('三家村 1 号张贴栏');
    setLocStartCol(1);
    setLocSelectedDates(['2026-08-10', '2026-08-11', '2026-08-12']);
    setShowLocationModal(true);
  };

  // Open edit location modal
  const handleEditLocation = (item: FormLocationItem) => {
    setEditingLocId(item.id);
    setLocCampus(item.campus);
    setLocBoard(item.boardName);
    const match = item.spot.match(/(\d+)/);
    const startC = match ? parseInt(match[1], 10) : 1;
    setLocStartCol(startC);
    setLocSelectedDates([item.startDate, item.endDate].filter(Boolean));
    setShowLocationModal(true);
  };

  // Delete location item
  const handleDeleteLocation = (id: string) => {
    setFormLocations(prev => prev.filter(item => item.id !== id));
  };

  // Save location modal item
  const handleSaveLocationItem = () => {
    if (locSelectedDates.length === 0) {
      alert('请在视图表格中选择要预订的日期');
      return;
    }
    const sorted = [...locSelectedDates].sort();
    const startDate = sorted[0];
    const endDate = sorted[sorted.length - 1];
    const neededCols = getNeededColsCount(formSize);
    const spotStr = neededCols === 1
      ? `第 ${locStartCol} 栏`
      : `第 ${locStartCol} - ${locStartCol + neededCols - 1} 栏`;

    if (editingLocId) {
      setFormLocations(prev => prev.map(item => item.id === editingLocId ? {
        ...item,
        campus: locCampus,
        boardName: locBoard,
        spot: spotStr,
        startDate,
        endDate
      } : item));
    } else {
      const newItem: FormLocationItem = {
        id: `loc-${Date.now()}`,
        campus: locCampus,
        boardName: locBoard,
        spot: spotStr,
        startDate,
        endDate
      };
      setFormLocations(prev => [...prev, newItem]);
    }
    setShowLocationModal(false);
  };

  // Reset Search
  const handleReset = () => {
    setSearchTitle('');
    setSearchOrg('全部单位');
    setSearchStartDate('');
    setSearchEndDate('');
  };

  // Revoke Action
  const handleRevoke = (id: string) => {
    if (confirm('确认撤回该海报张贴申请？撤回后可在已完成列表中查看或重新发起申请。')) {
      setApplications(prev => prev.map(app => app.id === id ? { ...app, status: '已撤回' } : app));
    }
  };

  // Submit New App
  const handleSubmitNewApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (formLocations.length === 0) {
      alert('请至少添加一个张贴位置');
      return;
    }
    const newApp: PosterAppItem = {
      id: `pos-app-${Date.now()}`,
      title: formTitle || '厦大校园海报活动',
      posterImageUrl: formPosterImageUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
      submittedAt: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-').slice(0, 16),
      orgName: formOrg,
      applicantName: formApplicant || '申请人',
      status: '待辅导员审批',
      posterSize: formSize,
      postingLocations: formLocations.map(loc => ({
        areaName: `${loc.campus}${loc.boardName} ${loc.spot}`,
        timeRange: `${loc.startDate} ~ ${loc.endDate}`
      })),
      contactPhone: formPhone || '13800000000'
    };
    setApplications([newApp, ...applications]);
    setShowApplyModal(false);
    setFormTitle('');
    setFormDesc('');
    setFormApplicant('');
    setFormPhone('');
    setActiveMainTab('pending');
  };

  // Approval Handlers
  const handleSubmitApprovalForm = () => {
    if (!reviewingApp) return;

    if (approvalDecision === '不同意' && !approvalOpinion.trim()) {
      setApprovalError('选择“不同意”时，审批意见必须填写！');
      return;
    }

    const timeStr = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-').slice(0, 16);
    const resultStr = approvalDecision === '同意' ? '通过' : '不通过';

    setApplications(prev => prev.map(item => {
      if (item.id === reviewingApp.id) {
        return {
          ...item,
          status: approvalDecision === '同意' ? '审批通过' : '审批不通过',
          myApprovalResult: resultStr,
          myApprovalTime: timeStr
        };
      }
      return item;
    }));

    setReviewingApp(null);
    setApprovalError('');
    alert(approvalDecision === '同意' ? '审批已提交：通过！' : '审批已提交：不通过 (已驳回)！');
  };

  const handleRevokeApproval = (appId: string) => {
    const itemToRevoke = applications.find(a => a.id === appId);
    if (window.confirm(`确认要撤回对“${itemToRevoke?.title || '该海报申请'}”的审批结论吗？撤回后该申请将重新回到待审批列表。`)) {
      setApplications(prev => prev.map(item => {
        if (item.id === appId) {
          return {
            ...item,
            status: '待辅导员审批',
            myApprovalResult: undefined,
            myApprovalTime: undefined
          };
        }
        return item;
      }));
      alert('已成功撤回审批结论，申请已重新回到待审批列表！');
    }
  };

  // Filtered List
  const filteredApps = applications.filter(app => {
    if (searchTitle && !app.title.includes(searchTitle) && !app.orgName.includes(searchTitle) && !app.applicantName.includes(searchTitle)) {
      return false;
    }
    if (searchOrg !== '全部单位' && !app.orgName.includes(searchOrg)) {
      return false;
    }
    if (searchStartDate && app.submittedAt < searchStartDate) {
      return false;
    }
    if (searchEndDate && app.submittedAt > searchEndDate + ' 23:59') {
      return false;
    }
    return true;
  });

  // Pending vs Completed Lists
  const pendingStatusList = ['待辅导员审批', '待单位负责人审批', '待学生会审批', '待团委审批'];
  
  const pendingApps = filteredApps.filter(a => {
    if (isApprovalMode) {
      return !a.myApprovalResult;
    }
    return pendingStatusList.includes(a.status);
  });

  const completedApps = filteredApps.filter(a => {
    if (isApprovalMode) {
      return !!a.myApprovalResult;
    }
    return !pendingStatusList.includes(a.status);
  });

  const currentList = activeMainTab === 'pending' ? pendingApps : completedApps;

  // Render Status Badge Helpers (According to Requirement 5)
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case '待辅导员审批':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            待辅导员审批
          </span>
        );
      case '待单位负责人审批':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            待单位负责人审批
          </span>
        );
      case '待学生会审批':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
            待学生会审批
          </span>
        );
      case '待团委审批':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
            待团委审批
          </span>
        );
      case '审批通过':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            审批通过
          </span>
        );
      case '审批不通过':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            审批不通过
          </span>
        );
      case '已撤回':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
            已撤回
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-700 border border-gray-200">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
            {status}
          </span>
        );
    }
  };

  // Helper to handle withdraw application
  const handleWithdrawApp = (appId: string) => {
    if (window.confirm('确定要撤回该海报张贴申请吗？撤回后系统将自动释放所预订的栏位。')) {
      setApplications(prev => prev.map(item => {
        if (item.id === appId) {
          return { ...item, status: '已撤回' };
        }
        return item;
      }));
      setViewingApp(null);
      alert('已成功撤回申请！');
    }
  };

  // Helper to get approval timeline nodes for viewingApp
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

  // Helper to parse location into 3 parts: 位置(Campus), 张贴栏(Board), 日期列表(Dates)
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

  if (isOnlineBoard) {
    const onlineAvailableBoards = boards.filter(b => b.campus === onlineCampus);

    let currentOnlinePosters: Array<{
      id: string;
      title: string;
      orgName: string;
      imageUrl: string;
      dateRange: string;
    }> = [];

    currentOnlinePosters = MOCK_ONLINE_POSTERS_MAP[onlineBoardId] || [];

    const fourColumnPosters = [
      currentOnlinePosters[0] || null,
      currentOnlinePosters[1] || null,
      currentOnlinePosters[2] || null,
      currentOnlinePosters[3] || null,
    ];

    const currentBoardInfo = boards.find(b => b.id === onlineBoardId) || onlineAvailableBoards[0] || boards[0];

    return (
      <div className="p-6 bg-gray-50/60 min-h-screen space-y-6 text-gray-800">
        {/* 1. 页头 Header: 标题为：线上海报栏，不要二级标题，标题最右侧添加“刷新”按钮 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full mr-3 shadow-sm"></div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">
              线上海报栏
            </h1>
          </div>
          <button
            onClick={triggerOnlineRefresh}
            className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-medium px-4 py-2 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2 text-xs cursor-pointer"
          >
            <RotateCw size={14} className={isOnlineRefreshing ? "animate-spin" : ""} />
            <span>刷新</span>
          </button>
        </div>

        {/* 2. 查询条件：第一行为所属校区，第二行为海报栏，均使用单选方式，联动且变化时刷新 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100/80 space-y-4">
          {/* 第一行：所属校区（仅保留 思明校区、翔安校区） */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-700 w-20 shrink-0">所属校区：</span>
            <div className="flex flex-wrap items-center gap-2">
              {['思明校区', '翔安校区'].map(campus => (
                <label
                  key={campus}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 border ${
                    onlineCampus === campus
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                      : 'bg-gray-50 text-gray-600 border-gray-200/80 hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="onlineCampusRadio"
                    checked={onlineCampus === campus}
                    onChange={() => handleOnlineCampusChange(campus)}
                    className="hidden"
                  />
                  <span>{campus}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 第二行：海报栏（去掉全部海报栏） */}
          <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
            <span className="text-xs font-bold text-gray-700 w-20 shrink-0">海报栏：</span>
            <div className="flex flex-wrap items-center gap-2">
              {onlineAvailableBoards.map(board => (
                <label
                  key={board.id}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 border ${
                    onlineBoardId === board.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                      : 'bg-gray-50 text-gray-600 border-gray-200/80 hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="onlineBoardRadio"
                    checked={onlineBoardId === board.id}
                    onChange={() => handleOnlineBoardChange(board.id)}
                    className="hidden"
                  />
                  <span>{board.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* 3. 内容区域：左侧线上海报拼图，右侧海报栏信息（支持侧边收起/展开，默认收起） */}
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 items-start transition-opacity duration-200 ${isOnlineRefreshing ? 'opacity-60' : 'opacity-100'}`}>
          {/* 左侧：线上海报拼图 */}
          <div className={`${isOnlineInfoCollapsed ? 'lg:col-span-12' : 'lg:col-span-8'} bg-white rounded-2xl p-5 shadow-sm border border-gray-100/80 space-y-4 transition-all duration-300`}>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                <h3 className="font-bold text-gray-900 text-sm">
                  {onlineCampus} &gt; {currentBoardInfo.name}
                </h3>
              </div>

              {/* 侧边收起/展开按钮 */}
              <button
                onClick={() => setIsOnlineInfoCollapsed(prev => !prev)}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 active:scale-95 text-blue-600 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-blue-100"
              >
                <Building2 size={14} />
                <span>{isOnlineInfoCollapsed ? '展开海报栏信息' : '收起海报栏信息'}</span>
                {isOnlineInfoCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
              </button>
            </div>

            {/* 模拟 4 列，一列一张海报 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 min-h-[420px]">
              {[0, 1, 2, 3].map(colIdx => {
                const poster = fourColumnPosters[colIdx];
                return (
                  <div key={colIdx} className="flex flex-col h-full bg-slate-50/70 rounded-2xl p-3 border border-slate-200/80 shadow-2xs group hover:border-blue-300 transition-all">
                    {/* 列标头（已去掉使用状态标签） */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 bg-slate-200/80 text-slate-700 font-black text-[10px] rounded-md">
                        第 {colIdx + 1} 列
                      </span>
                    </div>

                    {poster ? (
                      <div className="flex-1 flex flex-col justify-between space-y-2">
                        {/* 海报卡片图片 */}
                        <div 
                          onClick={() => setSelectedOnlinePoster(poster)}
                          className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-900 border border-gray-200 shadow-sm group-hover:shadow-md transition-all cursor-pointer"
                        >
                          <img src={poster.imageUrl} alt={poster.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2.5 text-white">
                            <span className="text-[10px] font-bold text-blue-300">{poster.orgName}</span>
                            <p className="text-xs font-bold line-clamp-2 leading-tight">{poster.title}</p>
                          </div>
                        </div>

                        {/* 海报信息 */}
                        <div 
                          onClick={() => setSelectedOnlinePoster(poster)}
                          className="space-y-1 text-xs pt-1 cursor-pointer"
                        >
                          <h4 className="font-bold text-gray-900 text-xs line-clamp-1 leading-snug hover:text-blue-600 transition-colors" title={poster.title}>
                            {poster.title}
                          </h4>
                          <p className="text-[11px] text-gray-500 font-medium truncate">{poster.orgName}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-4 text-center text-gray-400 my-auto min-h-[220px]">
                        <Plus size={24} className="text-gray-300 mb-1" />
                        <span className="text-xs font-bold text-gray-400">栏位空闲</span>
                        <span className="text-[10px] text-gray-400 mt-1">可提交张贴申请</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 右侧：海报栏信息（根据 isOnlineInfoCollapsed 控制展开/收起，默认收起） */}
          {!isOnlineInfoCollapsed && (
            <div className="lg:col-span-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100/80 space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Building2 className="text-blue-600" size={18} />
                  <h3 className="font-bold text-gray-900 text-sm">海报栏信息</h3>
                </div>
                <button
                  onClick={() => setIsOnlineInfoCollapsed(true)}
                  className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                  title="收起信息"
                >
                  <X size={16} />
                </button>
              </div>

              {/* 海报栏实景图 */}
              <div className="w-full h-36 rounded-xl overflow-hidden border border-gray-200 shadow-xs relative bg-gray-100">
                <img src={currentBoardInfo.imageUrl} alt={currentBoardInfo.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 px-2.5 py-0.5 bg-black/60 backdrop-blur-sm text-white font-bold text-[10px] rounded-md">
                  {currentBoardInfo.campus}
                </div>
              </div>

              {/* 信息项列表（已去掉“责任巡检员”） */}
              <div className="space-y-3 text-xs">
                <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                  <span className="text-gray-400 block text-[11px] font-medium mb-0.5">张贴栏名称</span>
                  <span className="text-gray-900 font-bold text-sm">{currentBoardInfo.name}</span>
                </div>

                <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                  <span className="text-gray-400 block text-[11px] font-medium mb-0.5">详细位置</span>
                  <span className="text-gray-800 font-medium leading-relaxed">{currentBoardInfo.locationDetail}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                    <span className="text-gray-400 block text-[11px] font-medium mb-0.5">最大栏位</span>
                    <span className="text-gray-900 font-black text-sm">{currentBoardInfo.maxColumns} 栏</span>
                  </div>
                  <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                    <span className="text-gray-400 block text-[11px] font-medium mb-0.5">在贴海报</span>
                    <span className="text-blue-600 font-black text-sm">{currentOnlinePosters.length} 张</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 海报明细信息 Modal (黑色透明背景，最大化显示) */}
        {selectedOnlinePoster && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-hidden">
            <div className="bg-white rounded-3xl w-[96vw] h-[94vh] max-w-[1500px] shadow-2xl flex flex-col overflow-hidden border border-gray-100/20 animate-in fade-in zoom-in-95 duration-200 relative">
              {/* Header: 活动主题直接变成标题 */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white shrink-0">
                <h3 className="text-lg font-black text-gray-900 truncate pr-4" title={selectedOnlinePoster.title}>
                  {selectedOnlinePoster.title}
                </h3>
                <button
                  type="button"
                  onClick={() => setSelectedOnlinePoster(null)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
                  title="关闭"
                >
                  <X size={22} />
                </button>
              </div>

              {/* 第二行：用标签的方式显示申报单位名称（去掉申报单位标题，最右侧显示下载按钮） */}
              <div className="flex items-center justify-between gap-3 px-6 py-3 border-b border-gray-100 bg-gray-50/60 shrink-0">
                <span className="px-3.5 py-1.5 bg-blue-50 text-blue-700 border border-blue-200/80 rounded-lg font-bold text-xs shadow-2xs">
                  {selectedOnlinePoster.orgName}
                </span>
                <a
                  href={selectedOnlinePoster.imageUrl}
                  download={`${selectedOnlinePoster.title}.jpg`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm shadow-blue-500/20 transition-all cursor-pointer shrink-0"
                >
                  <Download size={14} />
                  <span>下载</span>
                </a>
              </div>

              {/* 下面是海报大图：展示全、最大化显示 */}
              <div className="flex-1 min-h-0 p-4 bg-gray-900/5 flex items-center justify-center overflow-hidden">
                <img
                  src={selectedOnlinePoster.imageUrl}
                  alt={selectedOnlinePoster.title}
                  className="w-full h-full object-contain rounded-xl shadow-md"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (isPosterLibrary) {
    // Filtered Applications for Poster Library
    const filteredLibApps = applications.filter(app => {
      // 校区
      if (libCampus !== '全部校区') {
        const matchCampus = app.postingLocations.some(loc => {
          const parts = parsePostingLocationParts(loc);
          return parts.campus === libCampus;
        });
        if (!matchCampus) return false;
      }

      // 海报栏
      if (libBoard !== '全部海报栏') {
        const matchBoard = app.postingLocations.some(loc => {
          const parts = parsePostingLocationParts(loc);
          return parts.board.includes(libBoard) || loc.areaName.includes(libBoard);
        });
        if (!matchBoard) return false;
      }

      // 申请单位
      if (libOrg !== '全部单位' && !app.orgName.includes(libOrg)) {
        return false;
      }

      // 张贴时间
      if (libStartDate) {
        const hasAfter = app.postingLocations.some(loc => {
          const parts = parsePostingLocationParts(loc);
          return parts.dates >= libStartDate || loc.timeRange >= libStartDate || app.submittedAt >= libStartDate;
        });
        if (!hasAfter) return false;
      }
      if (libEndDate) {
        const hasBefore = app.postingLocations.some(loc => {
          const parts = parsePostingLocationParts(loc);
          return parts.dates <= libEndDate + ' 23:59' || loc.timeRange <= libEndDate || app.submittedAt <= libEndDate + ' 23:59';
        });
        if (!hasBefore) return false;
      }

      // 活动标题
      if (libTitle && !app.title.includes(libTitle) && !app.applicantName.includes(libTitle)) {
        return false;
      }

      return true;
    });

    const totalLibItems = filteredLibApps.length;
    const totalLibPages = Math.ceil(totalLibItems / libPageSize) || 1;
    const paginatedLibApps = filteredLibApps.slice((libPage - 1) * libPageSize, libPage * libPageSize);

    return (
      <div className="p-6 bg-gray-50/60 min-h-screen space-y-6 text-gray-800">
        {/* 1. 页头 Header: 标题为：海报库，不要二级标题，去掉标题最右侧的按钮 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full mr-3 shadow-sm"></div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">
              海报库
            </h1>
          </div>
        </div>

        {/* 2. 查询条件：校区、海报栏、申请单位、张贴时间、活动标题 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/80 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* 校区 */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 tracking-wide">校区</label>
              <select
                value={libCampus}
                onChange={(e) => {
                  setLibCampus(e.target.value);
                  setLibPage(1);
                }}
                className="w-full bg-gray-50/80 border border-gray-200/60 rounded-xl px-3 py-2.5 text-xs text-gray-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer font-medium"
              >
                <option value="全部校区">全部校区</option>
                <option value="思明校区">思明校区</option>
                <option value="翔安校区">翔安校区</option>
                <option value="樟宜校区">樟宜校区</option>
                <option value="漳州校区">漳州校区</option>
              </select>
            </div>

            {/* 海报栏 */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 tracking-wide">海报栏</label>
              <select
                value={libBoard}
                onChange={(e) => {
                  setLibBoard(e.target.value);
                  setLibPage(1);
                }}
                className="w-full bg-gray-50/80 border border-gray-200/60 rounded-xl px-3 py-2.5 text-xs text-gray-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer font-medium"
              >
                <option value="全部海报栏">全部海报栏</option>
                {boards.map(b => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>

            {/* 申请单位 */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 tracking-wide">申请单位</label>
              <select
                value={libOrg}
                onChange={(e) => {
                  setLibOrg(e.target.value);
                  setLibPage(1);
                }}
                className="w-full bg-gray-50/80 border border-gray-200/60 rounded-xl px-3 py-2.5 text-xs text-gray-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer font-medium"
              >
                <option value="全部单位">全部单位</option>
                <option value="校学生会宣传部">校学生会宣传部</option>
                <option value="计算机科学与技术系">计算机科学与技术系</option>
                <option value="艺术学院青年志愿者协会">艺术学院青年志愿者协会</option>
                <option value="海洋与地球学院团党委">海洋与地球学院团党委</option>
                <option value="厦大音乐社">厦大音乐社</option>
                <option value="创新创业学院">创新创业学院</option>
                <option value="物理科学与技术学院">物理科学与技术学院</option>
                <option value="生命科学学院">生命科学学院</option>
              </select>
            </div>

            {/* 张贴时间 */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 tracking-wide">张贴时间</label>
              <div className="flex items-center gap-1 bg-gray-50/80 border border-gray-200/60 rounded-xl px-2 py-1.5">
                <input
                  type="date"
                  value={libStartDate}
                  onChange={(e) => { setLibStartDate(e.target.value); setLibPage(1); }}
                  className="bg-transparent text-xs text-gray-800 outline-none w-full cursor-pointer"
                />
                <span className="text-gray-400 font-medium text-xs">-</span>
                <input
                  type="date"
                  value={libEndDate}
                  onChange={(e) => { setLibEndDate(e.target.value); setLibPage(1); }}
                  className="bg-transparent text-xs text-gray-800 outline-none w-full cursor-pointer"
                />
              </div>
            </div>

            {/* 活动标题 */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 tracking-wide">活动标题</label>
              <input
                type="text"
                value={libTitle}
                onChange={(e) => { setLibTitle(e.target.value); setLibPage(1); }}
                placeholder="请输入活动标题..."
                className="w-full bg-gray-50/80 border border-gray-200/60 rounded-xl px-3 py-2 text-xs text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium"
              />
            </div>
          </div>

          {/* 底部分隔与查询/重置按钮 */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100/60">
            <button
              onClick={() => setLibPage(1)}
              className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold px-8 py-2.5 rounded-xl text-xs shadow-sm shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center"
            >
              <span>查询</span>
            </button>
            <button
              onClick={handleLibReset}
              className="bg-gray-100/90 hover:bg-gray-200 active:scale-95 text-gray-600 font-bold px-8 py-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center"
            >
              <span>重置</span>
            </button>
          </div>
        </div>

        {/* 3. 列表 Table: 海报图片、活动标题、申请单位、张贴区域和时间。操作区域为：查看。 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden">
          <div className="px-6 py-3.5 border-b border-gray-100 flex items-center justify-between bg-white">
            <span className="text-xs text-gray-500 font-medium">
              共 <strong className="text-blue-600 font-bold">{totalLibItems}</strong> 张海报记录
            </span>
          </div>

          <div className="overflow-x-auto relative">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-gray-50/90 text-gray-500 font-bold border-b border-gray-200/80">
                <tr>
                  <th className="py-3.5 px-4 whitespace-nowrap min-w-[90px] w-[90px]">
                    海报图片
                  </th>
                  <th className="py-3.5 px-4 whitespace-nowrap min-w-[180px]">活动标题</th>
                  <th className="py-3.5 px-4 whitespace-nowrap min-w-[140px]">申请单位</th>
                  <th className="py-3.5 px-4 whitespace-nowrap min-w-[110px]">申请日期</th>
                  <th className="py-3.5 px-4 whitespace-nowrap min-w-[100px]">申请人</th>
                  <th className="py-3.5 px-4 whitespace-nowrap min-w-[110px]">申请人类型</th>
                  <th className="py-3.5 px-4 whitespace-nowrap min-w-[280px]">张贴区域和时间</th>
                  <th className="py-3.5 px-4 text-center whitespace-nowrap min-w-[100px] w-[100px]">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {paginatedLibApps.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-400">
                      暂无符合条件的海报数据
                    </td>
                  </tr>
                ) : (
                  paginatedLibApps.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/40 transition-colors group">
                      {/* 海报图片 */}
                      <td className="py-3 px-4">
                        <div 
                          onClick={() => setViewingApp(item)}
                          className="w-12 h-16 rounded-lg overflow-hidden border border-gray-200 shadow-2xs cursor-pointer group/img relative bg-gray-100"
                          title="点击查看详情"
                        >
                          <img src={item.posterImageUrl} alt={item.title} className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-300" />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <Eye size={14} />
                          </div>
                        </div>
                      </td>

                      {/* 活动标题 */}
                      <td className="py-3 px-4 font-bold text-gray-900 text-sm">
                        {item.title}
                      </td>

                      {/* 申请单位 */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200/80 rounded-md font-bold text-[11px]">
                          {item.orgName}
                        </span>
                      </td>

                      {/* 申请日期 */}
                      <td className="py-3 px-4 whitespace-nowrap font-mono text-gray-600 text-xs">
                        {item.submittedAt ? item.submittedAt.split(' ')[0] : '--'}
                      </td>

                      {/* 申请人 */}
                      <td className="py-3 px-4 whitespace-nowrap font-bold text-gray-800 text-xs">
                        {item.applicantName || '--'}
                      </td>

                      {/* 申请人类型 */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          (item.applicantType === '教职工' || item.applicantName?.includes('教授') || item.applicantName?.includes('老师'))
                            ? 'bg-purple-50 text-purple-700 border-purple-200/80'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                        }`}>
                          {item.applicantType || (item.applicantName?.includes('教授') || item.applicantName?.includes('老师') ? '教职工' : '学生')}
                        </span>
                      </td>

                      {/* 张贴区域和时间 */}
                      <td className="py-3 px-4">
                        <ul className="list-disc pl-4 space-y-1.5 text-[11px]">
                          {item.postingLocations.map((loc, idx) => {
                            const parts = parsePostingLocationParts(loc);
                            return (
                              <li key={idx} className="marker:text-blue-500">
                                <div className="inline-flex flex-wrap items-center gap-1.5 text-[11px]">
                                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200/80">
                                    {parts.campus}
                                  </span>
                                  <span className="text-gray-800 font-semibold bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                                    {parts.board}
                                  </span>
                                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80">
                                    {parts.dates}
                                  </span>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </td>

                      {/* 操作: 查看 */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => setViewingApp(item)}
                          className="px-4 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1 mx-auto"
                        >
                          <Eye size={13} />
                          <span>查看</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 分页组件 Pagination */}
          {totalLibItems > 0 && (
            <div className="px-6 py-3.5 border-t border-gray-100 bg-gray-50/40 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3 text-gray-500">
                <span>
                  显示第 <strong className="text-gray-800 font-bold">{(libPage - 1) * libPageSize + 1}</strong> 到 <strong className="text-gray-800 font-bold">{Math.min(libPage * libPageSize, totalLibItems)}</strong> 条，共 <strong className="text-blue-600 font-bold">{totalLibItems}</strong> 条记录
                </span>
                <div className="flex items-center gap-1.5 ml-2 border-l border-gray-200 pl-3">
                  <span className="text-gray-400">每页</span>
                  <select
                    value={libPageSize}
                    onChange={(e) => {
                      setLibPageSize(Number(e.target.value));
                      setLibPage(1);
                    }}
                    className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-bold text-gray-700 outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value={5}>5 条</option>
                    <option value={10}>10 条</option>
                    <option value={20}>20 条</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setLibPage(p => Math.max(1, p - 1))}
                  disabled={libPage === 1}
                  className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                >
                  <ChevronLeft size={14} />
                  <span>上一页</span>
                </button>

                <div className="flex items-center gap-1 px-1">
                  {Array.from({ length: totalLibPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setLibPage(pageNum)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          libPage === pageNum
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
                  onClick={() => setLibPage(p => Math.min(totalLibPages, p + 1))}
                  disabled={libPage === totalLibPages}
                  className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                >
                  <span>下一页</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal: 查看详情 (独立组件 PosterDetailModal) */}
        <PosterDetailModal item={viewingApp} onClose={() => setViewingApp(null)} />
      </div>
    );
  }

  if (isBoardManagement) {
    return (
      <div className="p-6 bg-gray-50/60 min-h-screen space-y-6 text-gray-800">
        {/* 1. 页头 Header: 标题为“张贴栏管理”，无二级标题，最右侧“新建张贴栏”按钮 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full mr-3 shadow-sm"></div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">
              张贴栏管理
            </h1>
          </div>
          <button
            onClick={handleOpenNewBoard}
            className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-medium px-5 py-2.5 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2 text-sm cursor-pointer"
          >
            <Plus size={16} />
            <span>新建张贴栏</span>
          </button>
        </div>

        {/* 2. 查询条件 Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/80 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* 张贴栏名称 */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 tracking-wide">张贴栏名称</label>
              <input
                type="text"
                value={boardSearchName}
                onChange={(e) => setBoardSearchName(e.target.value)}
                placeholder="请输入张贴栏名称..."
                className="w-full bg-gray-50/80 border border-gray-200/60 rounded-xl px-4 py-2.5 text-xs text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>

            {/* 所属校区 */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 tracking-wide">所属校区</label>
              <select
                value={boardSearchCampus}
                onChange={(e) => setBoardSearchCampus(e.target.value)}
                className="w-full bg-gray-50/80 border border-gray-200/60 rounded-xl px-4 py-2.5 text-xs text-gray-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
              >
                <option value="全部校区">全部校区</option>
                <option value="思明校区">思明校区</option>
                <option value="翔安校区">翔安校区</option>
                <option value="樟宜校区">樟宜校区</option>
                <option value="漳州校区">漳州校区</option>
              </select>
            </div>

            {/* 状态 */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 tracking-wide">状态</label>
              <select
                value={boardSearchStatus}
                onChange={(e) => setBoardSearchStatus(e.target.value)}
                className="w-full bg-gray-50/80 border border-gray-200/60 rounded-xl px-4 py-2.5 text-xs text-gray-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
              >
                <option value="全部状态">全部状态</option>
                <option value="开放申请">开放申请</option>
                <option value="关闭申请">关闭申请</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100/60">
            <button
              onClick={() => {}}
              className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold px-8 py-2.5 rounded-xl text-xs shadow-sm shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center"
            >
              <span>查询</span>
            </button>
            <button
              onClick={() => {
                setBoardSearchName('');
                setBoardSearchCampus('全部校区');
                setBoardSearchStatus('全部状态');
              }}
              className="bg-gray-100/90 hover:bg-gray-200 active:scale-95 text-gray-600 font-bold px-8 py-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center"
            >
              <span>重置</span>
            </button>
          </div>
        </div>

        {/* 3. 列表 Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden">
          <div className="px-6 py-3.5 border-b border-gray-100 flex items-center justify-between bg-white">
            <span className="text-xs text-gray-500 font-medium">
              共 <strong className="text-blue-600 font-bold">{totalBoardItems}</strong> 个张贴栏
            </span>
          </div>

          <div className="overflow-x-auto relative">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-gray-50/90 text-gray-500 font-bold border-b border-gray-200/80">
                <tr>
                  {/* 第一列固定：图片 */}
                  <th className="sticky left-0 z-20 bg-gray-50 py-3.5 px-4 whitespace-nowrap min-w-[90px] w-[90px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] border-b border-gray-200/80">
                    图片
                  </th>
                  <th className="py-3.5 px-4 whitespace-nowrap min-w-[180px]">张贴栏名称</th>
                  <th className="py-3.5 px-4 whitespace-nowrap min-w-[120px]">所属校区</th>
                  <th className="py-3.5 px-4 whitespace-nowrap min-w-[260px]">详细位置</th>
                  <th className="py-3.5 px-4 whitespace-nowrap min-w-[100px]">最大栏位</th>
                  <th className="py-3.5 px-4 whitespace-nowrap min-w-[120px]">状态</th>
                  {/* 最后一列固定：操作 */}
                  <th className="sticky right-0 z-20 bg-gray-50 py-3.5 px-4 text-center whitespace-nowrap min-w-[210px] w-[210px] shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.06)] border-b border-gray-200/80">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {paginatedBoards.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400">
                      暂无符合条件的张贴栏数据
                    </td>
                  </tr>
                ) : (
                  paginatedBoards.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/40 transition-colors group">
                      {/* 第一列固定：图片 */}
                      <td className="sticky left-0 z-10 bg-white group-hover:bg-blue-50/40 py-3 px-4 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] transition-colors">
                        <div 
                          onClick={() => setViewingBoard(item)}
                          className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 shadow-2xs cursor-pointer group/img relative bg-gray-100"
                          title="点击查看详情"
                        >
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-300" />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <Eye size={14} />
                          </div>
                        </div>
                      </td>

                      {/* 张贴栏名称 */}
                      <td className="py-3 px-4 font-bold text-gray-900 text-sm">
                        {item.name}
                      </td>

                      {/* 所属校区 */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200/80 rounded-md font-bold text-[11px]">
                          {item.campus}
                        </span>
                      </td>

                      {/* 详细位置 */}
                      <td className="py-3 px-4 text-gray-600 font-medium max-w-[280px]">
                        {item.locationDetail}
                      </td>

                      {/* 最大栏位 */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md font-bold text-[11px]">
                          {item.maxColumns} 栏
                        </span>
                      </td>

                      {/* 状态 */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {item.status === '开放申请' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            开放申请
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                            关闭申请
                          </span>
                        )}
                      </td>

                      {/* 最后一列固定：操作 */}
                      <td className="sticky right-0 z-10 bg-white group-hover:bg-blue-50/40 py-3 px-4 text-center whitespace-nowrap shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.06)] transition-colors">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setViewingBoard(item)}
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-bold text-xs transition-all cursor-pointer"
                          >
                            查看
                          </button>
                          <button
                            onClick={() => handleOpenEditBoard(item)}
                            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg font-bold text-xs transition-all cursor-pointer"
                          >
                            编辑
                          </button>
                          {item.status === '开放申请' ? (
                            <button
                              onClick={() => handleOpenStatusConfirm(item, '关闭申请')}
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg font-bold text-xs transition-all cursor-pointer"
                            >
                              关闭申请
                            </button>
                          ) : (
                            <button
                              onClick={() => handleOpenStatusConfirm(item, '开放申请')}
                              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg font-bold text-xs transition-all cursor-pointer"
                            >
                              开放申请
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 分页组件 Pagination */}
          {totalBoardItems > 0 && (
            <div className="px-6 py-3.5 border-t border-gray-100 bg-gray-50/40 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3 text-gray-500">
                <span>
                  显示第 <strong className="text-gray-800 font-bold">{(boardPage - 1) * boardPageSize + 1}</strong> 到 <strong className="text-gray-800 font-bold">{Math.min(boardPage * boardPageSize, totalBoardItems)}</strong> 条，共 <strong className="text-blue-600 font-bold">{totalBoardItems}</strong> 条记录
                </span>
                <div className="flex items-center gap-1.5 ml-2 border-l border-gray-200 pl-3">
                  <span className="text-gray-400">每页</span>
                  <select
                    value={boardPageSize}
                    onChange={(e) => {
                      setBoardPageSize(Number(e.target.value));
                      setBoardPage(1);
                    }}
                    className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-bold text-gray-700 outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value={5}>5 条</option>
                    <option value={10}>10 条</option>
                    <option value={20}>20 条</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setBoardPage(p => Math.max(1, p - 1))}
                  disabled={boardPage === 1}
                  className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                >
                  <ChevronLeft size={14} />
                  <span>上一页</span>
                </button>

                <div className="flex items-center gap-1 px-1">
                  {Array.from({ length: totalBoardPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setBoardPage(pageNum)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          boardPage === pageNum
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
                  onClick={() => setBoardPage(p => Math.min(totalBoardPages, p + 1))}
                  disabled={boardPage === totalBoardPages}
                  className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                >
                  <span>下一页</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 4. Modals */}
        {showNewBoardModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200 my-auto">
              {/* 1. Modal Title */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
                <h3 className="text-lg font-black text-gray-900">
                  {editingBoard ? '编辑张贴栏' : '新建张贴栏'}
                </h3>
                <button
                  onClick={() => setShowNewBoardModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* 2. Modal Form Fields */}
              <form onSubmit={handleSaveBoard} className="p-6 overflow-y-auto space-y-4 text-xs">
                {/* 1. 张贴栏名称 */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1.5">
                    张贴栏名称 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={boardFormName}
                    onChange={(e) => setBoardFormName(e.target.value)}
                    placeholder="请输入张贴栏名称，如：三家村3号张贴栏"
                    className="w-full bg-gray-50 border border-gray-200/80 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                  />
                </div>

                {/* 2. 所属校区 */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1.5">
                    所属校区 <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={boardFormCampus}
                    onChange={(e) => setBoardFormCampus(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200/80 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer font-medium"
                  >
                    <option value="思明校区">思明校区</option>
                    <option value="翔安校区">翔安校区</option>
                    <option value="樟宜校区">樟宜校区</option>
                    <option value="漳州校区">漳州校区</option>
                  </select>
                </div>

                {/* 3. 详细位置 */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1.5">
                    详细位置 <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={boardFormLocation}
                    onChange={(e) => setBoardFormLocation(e.target.value)}
                    placeholder="请输入详细地理位置说明..."
                    className="w-full bg-gray-50 border border-gray-200/80 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none font-medium"
                  />
                </div>

                {/* 4. 最大栏位 */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1.5">
                    最大栏位 <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={boardFormMaxColumns}
                    onChange={(e) => setBoardFormMaxColumns(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200/80 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer font-medium"
                  >
                    {[2, 4, 6, 8, 10, 12].map(n => (
                      <option key={n} value={n}>{n} 栏</option>
                    ))}
                  </select>
                </div>

                {/* 5. 开放状态 */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1.5">
                    开放状态 <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-6 py-1">
                    <label className="flex items-center gap-2 cursor-pointer font-medium">
                      <input
                        type="radio"
                        name="boardStatus"
                        checked={boardFormStatus === '开放申请'}
                        onChange={() => setBoardFormStatus('开放申请')}
                        className="accent-blue-600 w-4 h-4 cursor-pointer"
                      />
                      <span className="text-emerald-700 font-bold">开放申请</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-medium">
                      <input
                        type="radio"
                        name="boardStatus"
                        checked={boardFormStatus === '关闭申请'}
                        onChange={() => setBoardFormStatus('关闭申请')}
                        className="accent-blue-600 w-4 h-4 cursor-pointer"
                      />
                      <span className="text-gray-600 font-bold">关闭申请</span>
                    </label>
                  </div>
                </div>

                {/* 6. 图片 (可以上传多张) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block font-bold text-gray-700">
                      图片 <span className="text-gray-400 font-normal text-[11px] ml-1">(支持多张图片)</span>
                    </label>
                    <span className="text-[11px] text-gray-400">已选 {boardFormImages.length} 张</span>
                  </div>

                  <div className="grid grid-cols-4 gap-3 bg-gray-50/80 p-3 rounded-2xl border border-gray-200/60">
                    {boardFormImages.map((imgUrl, idx) => (
                      <div key={idx} className="relative group rounded-xl overflow-hidden aspect-square border border-gray-200 bg-white shadow-2xs">
                        <img src={imgUrl} alt={`pic-${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveBoardImage(idx)}
                          className="absolute top-1 right-1 w-5 h-5 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm cursor-pointer"
                          title="删除图片"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}

                    {/* Upload button */}
                    <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500 bg-white hover:bg-blue-50/50 flex flex-col items-center justify-center cursor-pointer transition-all text-gray-400 hover:text-blue-600 group">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleBoardImagesSelect}
                        className="hidden"
                      />
                      <Plus size={20} className="group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold mt-1">上传图片</span>
                    </label>
                  </div>
                </div>

                {/* 3. Footer: 保存 和 取消 按钮 */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowNewBoardModal(false)}
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-bold cursor-pointer transition-all text-xs active:scale-95"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl font-bold cursor-pointer transition-all text-xs shadow-sm shadow-blue-500/20"
                  >
                    保存
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 状态切换确认弹窗 */}
        {statusConfirmBoard && targetStatus && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200 my-auto">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
                <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                  {targetStatus === '关闭申请' ? (
                    <>
                      <AlertCircle size={18} className="text-rose-500" />
                      <span>关闭海报张贴栏提示</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={18} className="text-emerald-500" />
                      <span>开放海报张贴栏提示</span>
                    </>
                  )}
                </h3>
                <button
                  onClick={() => {
                    setStatusConfirmBoard(null);
                    setTargetStatus(null);
                    setCloseReason('');
                  }}
                  className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleConfirmStatusChange} className="p-6 space-y-4 text-xs">
                <p className="text-sm font-medium text-gray-700 leading-relaxed">
                  {targetStatus === '关闭申请'
                    ? '关闭后，师生将无法提交张贴申请。确认关闭？'
                    : '开放后，师生将可以提交张贴申请。确认开放？'}
                </p>

                {targetStatus === '关闭申请' && (
                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">
                      关闭原因 <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={closeReason}
                      onChange={(e) => setCloseReason(e.target.value)}
                      placeholder="请输入关闭原因..."
                      className="w-full bg-gray-50 border border-gray-200/80 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none font-medium"
                    />
                  </div>
                )}

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      setStatusConfirmBoard(null);
                      setTargetStatus(null);
                      setCloseReason('');
                    }}
                    className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-bold cursor-pointer transition-all text-xs active:scale-95"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className={`px-6 py-2 rounded-xl font-bold cursor-pointer transition-all text-xs text-white active:scale-95 shadow-sm ${
                      targetStatus === '关闭申请'
                        ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20'
                        : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                    }`}
                  >
                    确定
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {viewingBoard && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200 my-auto">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <Building2 className="text-blue-600" size={20} />
                  <span>张贴栏详情</span>
                </h3>
                <button
                  onClick={() => setViewingBoard(null)}
                  className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4 text-xs">
                <div className="w-full h-48 rounded-2xl overflow-hidden border border-gray-200 shadow-xs">
                  <img src={viewingBoard.imageUrl} alt={viewingBoard.name} className="w-full h-full object-cover" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <span className="text-gray-400 block text-[11px] font-medium">张贴栏名称</span>
                    <span className="text-gray-900 font-bold text-sm">{viewingBoard.name}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <span className="text-gray-400 block text-[11px] font-medium">所属校区</span>
                    <span className="text-blue-600 font-bold text-sm">{viewingBoard.campus}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl col-span-2">
                    <span className="text-gray-400 block text-[11px] font-medium">详细位置</span>
                    <span className="text-gray-800 font-medium text-xs">{viewingBoard.locationDetail}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <span className="text-gray-400 block text-[11px] font-medium">最大栏位</span>
                    <span className="text-gray-900 font-bold text-sm">{viewingBoard.maxColumns} 栏</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <span className="text-gray-400 block text-[11px] font-medium">状态</span>
                    <span className={`font-bold text-sm ${viewingBoard.status === '开放申请' ? 'text-emerald-600' : 'text-gray-500'}`}>
                      {viewingBoard.status}
                    </span>
                  </div>
                  {viewingBoard.inspectorName && (
                    <div className="bg-gray-50 p-3 rounded-xl col-span-2">
                      <span className="text-gray-400 block text-[11px] font-medium">责任巡检员</span>
                      <span className="text-gray-800 font-bold text-xs">{viewingBoard.inspectorName}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 flex items-center justify-end border-t border-gray-100">
                  <button
                    onClick={() => setViewingBoard(null)}
                    className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    关闭
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50/60 min-h-screen space-y-6 text-gray-800">
      {/* 1. 页头 Header: 纯线条竖标 + 粗体标题（无二级标题），右侧发起申请按钮 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-1.5 h-6 bg-blue-600 rounded-full mr-3 shadow-sm"></div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">
            {isApprovalMode ? '海报张贴审批' : '海报张贴申请'}
          </h1>
        </div>
        {!isApprovalMode && (
          <button
            onClick={() => setShowApplyModal(true)}
            className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-medium px-5 py-2.5 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2 text-sm cursor-pointer"
          >
            <Plus size={16} />
            <span>发起海报张贴申请</span>
          </button>
        )}
      </div>

      {/* 2. 查询条件 Card (1:1 对齐附件样式: 标题在上，输入框在下) */}
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

        {/* 底部分隔与查询/重置按钮（1:1 对齐图片样式） */}
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

      {/* 3. 数据列表 Card (包含 2 个 Tab 与数据表格) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden">
        {/* Tab 标头栏 */}
        <div className="px-6 py-3.5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
          {/* Segmented Tab */}
          <div className="bg-gray-100/80 p-1 rounded-xl flex items-center gap-1 border border-gray-200/50">
            <button
              onClick={() => setActiveMainTab('pending')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                activeMainTab === 'pending'
                  ? 'bg-white text-blue-600 shadow-sm border border-gray-100 font-black'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/50'
              }`}
            >
              <span>{isApprovalMode ? '待审批' : '审批中'}</span>
              <span className={`px-2 py-0.5 text-[10px] font-black rounded-full transition-colors ${
                activeMainTab === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {pendingApps.length}
              </span>
            </button>

            <button
              onClick={() => setActiveMainTab('completed')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                activeMainTab === 'completed'
                  ? 'bg-white text-blue-600 shadow-sm border border-gray-100 font-black'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/50'
              }`}
            >
              <span>{isApprovalMode ? '已审批' : '已完成'}</span>
              {!isApprovalMode && (
                <span className={`px-2 py-0.5 text-[10px] font-black rounded-full transition-colors ${
                  activeMainTab === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {completedApps.length}
                </span>
              )}
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

        {/* 表格内容区域 - 第一列和最后一列固定 */}
        <div className="overflow-x-auto relative">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-gray-50/90 text-gray-500 font-bold border-b border-gray-100">
              {isApprovalMode ? (
                activeMainTab === 'pending' ? (
                  // 待审批列表字段：海报图片、活动标题、申请时间、申请单位、申请人、申请人类型、栏位要求、张贴区域和时间，操作
                  <tr>
                    <th className="py-4 px-4 whitespace-nowrap sticky left-0 z-20 bg-gray-50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] min-w-[80px]">海报图片</th>
                    <th className="py-4 px-4 whitespace-nowrap min-w-[200px] max-w-[260px]">活动标题</th>
                    <th className="py-4 px-4 whitespace-nowrap min-w-[140px]">申请时间</th>
                    <th className="py-4 px-4 whitespace-nowrap min-w-[150px]">申请单位</th>
                    <th className="py-4 px-4 whitespace-nowrap min-w-[100px]">申请人</th>
                    <th className="py-4 px-4 whitespace-nowrap min-w-[110px]">申请人类型</th>
                    <th className="py-4 px-4 whitespace-nowrap min-w-[100px]">栏位要求</th>
                    <th className="py-4 px-4 whitespace-nowrap min-w-[340px]">张贴区域和时间</th>
                    <th className="py-4 px-4 whitespace-nowrap text-center sticky right-0 z-20 bg-gray-50 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.06)] min-w-[100px]">操作</th>
                  </tr>
                ) : (
                  // 已审批列表字段：海报图片、活动标题、我的审批结论、我的审批时间、当前申请状态、申请时间、申请单位、申请人、申请人类型、栏位要求、张贴区域和时间，操作
                  <tr>
                    <th className="py-4 px-4 whitespace-nowrap sticky left-0 z-20 bg-gray-50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] min-w-[80px]">海报图片</th>
                    <th className="py-4 px-4 whitespace-nowrap min-w-[200px] max-w-[260px]">活动标题</th>
                    <th className="py-4 px-4 whitespace-nowrap min-w-[120px]">我的审批结论</th>
                    <th className="py-4 px-4 whitespace-nowrap min-w-[140px]">我的审批时间</th>
                    <th className="py-4 px-4 whitespace-nowrap min-w-[140px]">当前申请状态</th>
                    <th className="py-4 px-4 whitespace-nowrap min-w-[140px]">申请时间</th>
                    <th className="py-4 px-4 whitespace-nowrap min-w-[150px]">申请单位</th>
                    <th className="py-4 px-4 whitespace-nowrap min-w-[100px]">申请人</th>
                    <th className="py-4 px-4 whitespace-nowrap min-w-[110px]">申请人类型</th>
                    <th className="py-4 px-4 whitespace-nowrap min-w-[100px]">栏位要求</th>
                    <th className="py-4 px-4 whitespace-nowrap min-w-[340px]">张贴区域和时间</th>
                    <th className="py-4 px-4 whitespace-nowrap text-center sticky right-0 z-20 bg-gray-50 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.06)] min-w-[160px]">操作</th>
                  </tr>
                )
              ) : (
                // 标准海报张贴申请列表字段
                <tr>
                  <th className="py-4 px-4 whitespace-nowrap sticky left-0 z-20 bg-gray-50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] min-w-[80px]">海报图片</th>
                  <th className="py-4 px-4 whitespace-nowrap min-w-[200px] max-w-[260px]">活动标题</th>
                  <th className="py-4 px-4 whitespace-nowrap min-w-[140px]">审批状态</th>
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
                    暂无符合条件的申请记录
                  </td>
                </tr>
              ) : (
                currentList.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                    {/* 1. 海报图片 (固定左侧) */}
                    <td className="py-3 px-4 sticky left-0 z-10 bg-white group-hover:bg-slate-50 transition-colors shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">
                      <div 
                        onClick={() => setViewingApp(item)}
                        className="w-12 h-16 rounded-lg overflow-hidden border border-gray-200 shadow-sm cursor-pointer group/img relative bg-gray-100"
                        title="点击查看大图"
                      >
                        <img src={item.posterImageUrl} alt={item.title} className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Eye size={14} />
                        </div>
                      </div>
                    </td>

                    {/* 2. 活动标题 */}
                    <td className="py-3 px-4 font-bold text-gray-900 text-sm max-w-[240px]">
                      <span className="line-clamp-2">{item.title}</span>
                    </td>

                    {/* 如果是审批模式的已审批页 */}
                    {isApprovalMode && activeMainTab === 'completed' && (
                      <>
                        {/* 3. 我的审批结论 */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          {item.myApprovalResult === '通过' ? (
                            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md font-bold text-[11px] inline-flex items-center gap-1">
                              <CheckCircle2 size={12} className="text-emerald-600" />
                              <span>同意 (通过)</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-md font-bold text-[11px] inline-flex items-center gap-1">
                              <X size={12} className="text-rose-600" />
                              <span>拒绝 (不通过)</span>
                            </span>
                          )}
                        </td>

                        {/* 4. 我的审批时间 */}
                        <td className="py-3 px-4 text-gray-500 font-medium whitespace-nowrap">
                          {item.myApprovalTime || '2026-08-07 16:30'}
                        </td>

                        {/* 5. 当前申请状态 */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          {renderStatusBadge(item.status)}
                        </td>
                      </>
                    )}

                    {/* 如果是非审批模式下，显示审批状态 */}
                    {!isApprovalMode && (
                      <td className="py-3 px-4 whitespace-nowrap">
                        {renderStatusBadge(item.status)}
                      </td>
                    )}

                    {/* 申请时间 */}
                    <td className="py-3 px-4 text-gray-500 font-medium whitespace-nowrap">
                      {item.submittedAt}
                    </td>

                    {/* 申请单位 */}
                    <td className="py-3 px-4 font-medium text-gray-800 whitespace-nowrap">
                      {item.orgName}
                    </td>

                    {/* 申请人 */}
                    <td className="py-3 px-4 font-medium text-gray-800 whitespace-nowrap">
                      {item.applicantName}
                    </td>

                    {/* 申请人类型 */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                        (item.applicantType === '教职工' || item.applicantName?.includes('教授') || item.applicantName?.includes('老师'))
                          ? 'bg-purple-50 text-purple-700 border-purple-200/80'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                      }`}>
                        {item.applicantType || (item.applicantName?.includes('教授') || item.applicantName?.includes('老师') ? '教职工' : '学生')}
                      </span>
                    </td>

                    {/* 栏位要求 */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md font-bold text-[11px]">
                        {item.posterSize}
                      </span>
                    </td>

                    {/* 张贴区域和时间（无序列表显示：一条目一行，含三个要素标签） */}
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

                    {/* 操作区域 (固定右侧) */}
                    <td className="py-3 px-4 text-center whitespace-nowrap sticky right-0 z-10 bg-white group-hover:bg-slate-50 transition-colors shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.06)]">
                      {isApprovalMode ? (
                        activeMainTab === 'pending' ? (
                          <button
                            onClick={() => {
                              setReviewingApp(item);
                              setApprovalDecision('同意');
                              setApprovalOpinion('同意申请，海报尺寸与宣发内容符合校园阵地管理规定。');
                              setApprovalError('');
                            }}
                            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-lg text-xs shadow-xs transition-all cursor-pointer"
                          >
                            审批
                          </button>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setViewingApp(item)}
                              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-bold text-xs transition-all cursor-pointer"
                            >
                              查看
                            </button>
                            <button
                              onClick={() => handleRevokeApproval(item.id)}
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center gap-1"
                            >
                              <RotateCcw size={12} />
                              <span>撤回审批</span>
                            </button>
                          </div>
                        )
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setViewingApp(item)}
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-bold text-xs transition-all cursor-pointer"
                          >
                            查看
                          </button>
                          {activeMainTab === 'pending' && item.status !== '已撤回' && (
                            <button
                              onClick={() => handleRevoke(item.id)}
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg font-bold text-xs transition-all cursor-pointer"
                            >
                              撤回
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 底部 Footer */}
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

      {/* Modal 1: 发起海报张贴申请 */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200 my-auto relative">
            
            {/* Header: Title strictly "海报张贴申请" */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100/80 bg-white z-20 shrink-0">
              <h3 className="text-lg font-black text-gray-900 tracking-tight">
                海报张贴申请
              </h3>
              <button 
                type="button"
                onClick={() => setShowApplyModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form Container with scrollable body and sticky overlay footer */}
            <form onSubmit={handleSubmitNewApp} className="flex-1 flex flex-col overflow-hidden relative">
              <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs pb-24">
                
                {/* Left Column: Form Fields */}
                <div className="lg:col-span-8 space-y-4">
                  
                  {/* 1. 申请单位, 申请人 (不能修改), 联系电话 */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        申请单位 <span className="text-gray-400 font-normal">(只读)</span>
                      </label>
                      <input
                        type="text"
                        disabled
                        value={formOrg}
                        className="w-full bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-500 cursor-not-allowed outline-none font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        申请人 <span className="text-gray-400 font-normal">(只读)</span>
                      </label>
                      <input
                        type="text"
                        disabled
                        value={formApplicant}
                        className="w-full bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-500 cursor-not-allowed outline-none font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        联系电话 <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        placeholder="138xxxxxxxx"
                        className="w-full bg-gray-50/80 border border-gray-200/80 rounded-xl px-3 py-2 text-xs text-gray-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* 2. 活动主题（单独一行） */}
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      活动主题 <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="例：2026年草地音乐节"
                      className="w-full bg-gray-50/80 border border-gray-200/80 rounded-xl px-3 py-2 text-xs text-gray-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                    />
                  </div>

                  {/* 3. 活动说明 */}
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      活动说明
                    </label>
                    <textarea
                      rows={2}
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      placeholder="请输入活动简要说明及主要内容..."
                      className="w-full bg-gray-50/80 border border-gray-200/80 rounded-xl px-3 py-2 text-xs text-gray-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                    />
                  </div>

                  {/* 4. 栏位要求（放到活动说明下面，单选框：1 栏、2 栏、3 栏、4 栏） */}
                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5">
                      栏位要求 <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {['1 栏', '2 栏', '3 栏', '4 栏'].map((option) => (
                        <label
                          key={option}
                          onClick={() => setFormSize(option)}
                          className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                            formSize === option
                              ? 'bg-blue-50/90 border-blue-500 text-blue-700 ring-2 ring-blue-100 shadow-xs'
                              : 'bg-gray-50/80 border-gray-200/80 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <input
                            type="radio"
                            name="formSizeRadio"
                            value={option}
                            checked={formSize === option}
                            onChange={() => setFormSize(option)}
                            className="accent-blue-600 cursor-pointer"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 5. 海报效果图 */}
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      海报效果图
                    </label>
                    <div className="flex items-center gap-4 bg-gray-50/80 border border-gray-200/80 rounded-2xl p-3">
                      <div className="w-16 h-20 rounded-xl overflow-hidden bg-gray-200 border border-gray-300/60 flex-shrink-0 flex items-center justify-center">
                        {formPosterImageUrl ? (
                          <img src={formPosterImageUrl} alt="海报预览" className="w-full h-full object-cover" />
                        ) : (
                          <Upload size={20} className="text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const url = prompt('请输入海报图片URL，或使用默认示例：', formPosterImageUrl);
                              if (url) setFormPosterImageUrl(url);
                            }}
                            className="bg-white border border-gray-200/80 hover:bg-gray-100 px-3 py-1.5 rounded-lg font-bold text-gray-700 shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <Upload size={13} className="text-blue-600" />
                            <span>上传/替换图片</span>
                          </button>
                        </div>
                        <p className="text-[11px] text-gray-500 leading-relaxed">
                          支持 JPG/PNG 格式，图片须清晰可辨，且内容与实际张贴物完全一致。若提交材料与实际不符，团委有权撤下相关海报。
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 6. 张贴位置和时间 */}
                  <div className="border border-gray-200/80 rounded-2xl p-4 bg-white space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                        <h4 className="font-bold text-gray-900 text-xs">张贴位置和时间</h4>
                      </div>
                      <button
                        type="button"
                        onClick={handleOpenAddLocation}
                        className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow-sm shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Plus size={14} />
                        <span>新增张贴位置</span>
                      </button>
                    </div>

                    {/* 位置与时间列表表格 */}
                    <div className="overflow-x-auto rounded-xl border border-gray-100 bg-gray-50/50">
                      <table className="w-full text-left text-[11px]">
                        <thead className="bg-gray-100/70 text-gray-500 font-bold border-b border-gray-200/60">
                          <tr>
                            <th className="py-2.5 px-3">校区</th>
                            <th className="py-2.5 px-3">海报栏</th>
                            <th className="py-2.5 px-3">张贴位</th>
                            <th className="py-2.5 px-3">张贴日期</th>
                            <th className="py-2.5 px-3 text-center">操作</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                          {formLocations.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="py-6 text-center text-gray-400 italic">
                                暂无张贴位置，请点击“新增张贴位置”进行添加
                              </td>
                            </tr>
                          ) : (
                            formLocations.map((item) => (
                              <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                                <td className="py-2.5 px-3 font-medium text-gray-800">{item.campus}</td>
                                <td className="py-2.5 px-3 text-gray-700">{item.boardName}</td>
                                <td className="py-2.5 px-3 font-bold text-blue-600">{item.spot}</td>
                                <td className="py-2.5 px-3 text-gray-600 font-semibold">{item.startDate}</td>
                                <td className="py-2.5 px-3 text-center">
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => handleEditLocation(item)}
                                      className="text-blue-600 hover:text-blue-800 font-bold cursor-pointer transition-colors"
                                    >
                                      编辑
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteLocation(item.id)}
                                      className="text-rose-600 hover:text-rose-800 font-bold cursor-pointer transition-colors"
                                    >
                                      删除
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>

                {/* Right Column: 审批流程图 */}
                <div className="lg:col-span-4 bg-slate-50/90 rounded-2xl p-5 border border-slate-200/70 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200/80">
                      <FileCheck size={16} className="text-blue-600" />
                      <h4 className="font-bold text-gray-900 text-xs tracking-wide">审批流程图</h4>
                    </div>

                    <div className="relative pl-3 space-y-5 before:absolute before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                      
                      {/* Step 1 */}
                      <div className="relative flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center ring-4 ring-slate-50 z-10">
                          1
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 block text-xs">提交海报张贴申请</span>
                          <p className="text-[11px] text-gray-500 mt-0.5">申请人填写信息并绑定张贴位置与时间</p>
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="relative flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 font-bold text-[10px] flex items-center justify-center ring-4 ring-slate-50 z-10">
                          2
                        </div>
                        <div>
                          <span className="font-bold text-gray-800 block text-xs">辅导员审批</span>
                          <p className="text-[11px] text-gray-500 mt-0.5">审查活动真实性、意识形态与合规性</p>
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="relative flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 font-bold text-[10px] flex items-center justify-center ring-4 ring-slate-50 z-10">
                          3
                        </div>
                        <div>
                          <span className="font-bold text-gray-800 block text-xs">单位负责人审批</span>
                          <p className="text-[11px] text-gray-500 mt-0.5">确认组织承办资质与单位盖章备案</p>
                        </div>
                      </div>

                      {/* Step 4 */}
                      <div className="relative flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 font-bold text-[10px] flex items-center justify-center ring-4 ring-slate-50 z-10">
                          4
                        </div>
                        <div>
                          <span className="font-bold text-gray-800 block text-xs">学生会审批</span>
                          <p className="text-[11px] text-gray-500 mt-0.5">海报栏位排期冲突核查与规格复核</p>
                        </div>
                      </div>

                      {/* Step 5 */}
                      <div className="relative flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 font-bold text-[10px] flex items-center justify-center ring-4 ring-slate-50 z-10">
                          5
                        </div>
                        <div>
                          <span className="font-bold text-gray-800 block text-xs">校团委终审与发码</span>
                          <p className="text-[11px] text-gray-500 mt-0.5">终审通过并生成海报核销二维码</p>
                        </div>
                      </div>

                    </div>
                  </div>

                  <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 text-[11px] text-blue-900 leading-relaxed">
                    <span className="font-bold block mb-1">💡 须知事项：</span>
                    审核通过后请下载专属电子二维码，并打印附于海报右下角，未贴码海报将被管理员清理。
                  </div>
                </div>

              </div>

              {/* Bottom Sticky Overlay Footer (遮罩住表单内容) */}
              <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-gray-200/80 px-6 py-4 z-30 flex items-center justify-end gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold px-6 py-2.5 rounded-xl text-xs transition-all cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold px-8 py-2.5 rounded-xl text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  发起申请
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Sub-Modal: 新增张贴位置（视图选择排期） */}
      {showLocationModal && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200 my-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-20">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <h3 className="text-base font-bold text-gray-900">
                  {editingLocId ? '编辑张贴位置' : '新增张贴位置'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLocationModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
              
              {/* Top Selectors: 校区 & 海报栏 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/80 p-4 rounded-2xl border border-gray-200/60">
                <div>
                  <label className="block font-bold text-gray-700 mb-1.5">校区</label>
                  <select
                    value={locCampus}
                    onChange={(e) => setLocCampus(e.target.value)}
                    className="w-full bg-white border border-gray-200/80 rounded-xl px-3 py-2 text-xs text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer font-medium"
                  >
                    <option value="思明校区">思明校区</option>
                    <option value="翔安校区">翔安校区</option>
                    <option value="樟宜校区">樟宜校区</option>
                    <option value="漳州校区">漳州校区</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1.5">海报栏</label>
                  <select
                    value={locBoard}
                    onChange={(e) => setLocBoard(e.target.value)}
                    className="w-full bg-white border border-gray-200/80 rounded-xl px-3 py-2 text-xs text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer font-medium"
                  >
                    <option value="三家村 1 号张贴栏">三家村 1 号张贴栏</option>
                    <option value="三家村 2 号张贴栏">三家村 2 号张贴栏</option>
                    <option value="芙蓉餐厅侧栏">芙蓉餐厅侧栏</option>
                    <option value="群贤楼主海报栏">群贤楼主海报栏</option>
                    <option value="竞丰餐厅前张贴栏">竞丰餐厅前张贴栏</option>
                    <option value="南光餐厅主干道海报栏">南光餐厅主干道海报栏</option>
                  </select>
                </div>
              </div>

              {/* Requirement & Legend Bar */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-3 bg-blue-50/60 border border-blue-100 p-3 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-blue-900">栏位需求：</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-bold text-[11px]">
                      {formSize} (需连续 {getNeededColsCount(formSize)} 个栏位)
                    </span>
                  </div>

                  {/* Status Legend */}
                  <div className="flex items-center gap-3 text-[11px] font-medium text-gray-600">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span> 已选中
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-sm bg-emerald-100 border border-emerald-400"></span> 可预订
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-sm bg-emerald-50 border border-emerald-300"></span>
                      <span className="text-emerald-600 font-medium">空闲</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-sm bg-amber-100 border border-amber-300"></span> 申请占位
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-sm bg-rose-200 border border-rose-300"></span> 使用中
                    </span>
                  </div>
                </div>

                {/* Notice Tip under 栏位需求 */}
                <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-2.5 px-3 text-[11px] text-amber-900 leading-relaxed flex items-start gap-2">
                  <AlertCircle size={15} className="text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    最多可选择 <strong>3 天</strong>。建议选择连续日期；若选择非连续日期，需在间隔时段自行撤下海报，并于后续申请时段重新张贴。
                  </span>
                </div>

                {/* 在提示栏后面展示已选位置列表，一个位置一行记录，带序号、校区、张贴栏位置、张贴栏位、日期、取消选择按钮 */}
                {locSelectedDates.length > 0 && (
                  <div className="border border-blue-200 bg-blue-50/40 rounded-2xl p-3 space-y-2 shadow-xs animate-in fade-in duration-200">
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                        <h5 className="font-bold text-blue-950 text-xs">已选位置</h5>
                        <span className="text-[11px] text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full font-medium">
                          共 {locSelectedDates.length} 条记录
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setLocSelectedDates([])}
                        className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-100/60 px-2 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <X size={13} />
                        <span>清空所有</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-blue-200/80 bg-white">
                      <table className="w-full text-left text-[11px]">
                        <thead className="bg-blue-100/60 text-blue-900 font-bold border-b border-blue-200/80">
                          <tr>
                            <th className="py-2 px-3 text-center w-12">序号</th>
                            <th className="py-2 px-3">校区</th>
                            <th className="py-2 px-3">张贴栏位置</th>
                            <th className="py-2 px-3">张贴栏位</th>
                            <th className="py-2 px-3">日期</th>
                            <th className="py-2 px-3 text-center w-20">操作</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-100/80 text-gray-800">
                          {[...locSelectedDates].sort().map((dateStr, idx) => {
                            const neededCols = getNeededColsCount(formSize);
                            const colText = neededCols === 1
                              ? `第 ${locStartCol} 栏`
                              : `第 ${locStartCol} - ${locStartCol + neededCols - 1} 栏`;

                            return (
                              <tr key={dateStr} className="hover:bg-blue-50/50 transition-colors">
                                <td className="py-2 px-3 text-center font-bold text-blue-700">{idx + 1}</td>
                                <td className="py-2 px-3 font-medium text-gray-900">{locCampus}</td>
                                <td className="py-2 px-3 text-gray-700">{locBoard}</td>
                                <td className="py-2 px-3 text-blue-600 font-semibold">{colText}</td>
                                <td className="py-2 px-3 font-semibold text-gray-800">{dateStr}</td>
                                <td className="py-2 px-3 text-center">
                                  <button
                                    type="button"
                                    onClick={() => toggleDateSelection(dateStr)}
                                    title="取消选择"
                                    className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2 py-0.5 rounded-md font-bold transition-colors cursor-pointer text-[11px]"
                                  >
                                    <X size={12} />
                                    <span>取消</span>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Matrix Grid View (纵坐标为日期 - 后20天, 横坐标为栏位: 第一栏 ~ 第四栏) */}
              <div className="border border-gray-200/80 rounded-2xl overflow-hidden bg-white shadow-xs">
                <div className="max-h-[380px] overflow-y-auto">
                  <table className="w-full text-center border-collapse">
                    <thead className="bg-gray-100/90 text-gray-700 font-bold text-[11px] sticky top-0 z-10 border-b border-gray-200">
                      <tr>
                        <th className="py-2.5 px-3 border-r border-gray-200 bg-gray-100 text-left pl-4 w-32">张贴日期</th>
                        <th className="py-2.5 px-2 border-r border-gray-200 w-1/4">第一栏</th>
                        <th className="py-2.5 px-2 border-r border-gray-200 w-1/4">第二栏</th>
                        <th className="py-2.5 px-2 border-r border-gray-200 w-1/4">第三栏</th>
                        <th className="py-2.5 px-2 w-1/4">第四栏</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-[11px]">
                      {getNext20Days().map((dateStr) => {
                        const isDateSelected = locSelectedDates.includes(dateStr);
                        const isHoveredRow = hoveredRowDate === dateStr;
                        const neededCols = getNeededColsCount(formSize);

                        return (
                          <tr
                            key={dateStr}
                            onMouseLeave={() => {
                              setHoveredRowDate(null);
                              setHoveredCol(null);
                            }}
                            className={`transition-colors ${isDateSelected ? 'bg-emerald-50/40' : 'hover:bg-gray-50/80'}`}
                          >
                            <td className="py-2 px-3 border-r border-gray-100 font-bold text-gray-700 text-left pl-4 whitespace-nowrap bg-gray-50/50">
                              <span>{dateStr}</span>
                            </td>

                            {[1, 2, 3, 4].map((colNum) => {
                              const cellStatus = getGridCellStatus(dateStr, colNum, locBoard);
                              
                              // Active starting column for hovered or selected
                              const activeStartCol = isHoveredRow && hoveredCol !== null
                                ? Math.min(hoveredCol, 4 - neededCols + 1)
                                : locStartCol;

                              const isInCoveredCols = colNum >= activeStartCol && colNum < activeStartCol + neededCols;
                              const isCoveredStart = colNum === activeStartCol;

                              // Check if any required adjacent cell is occupied
                              let isRangeOccupied = false;
                              for (let k = activeStartCol; k < activeStartCol + neededCols; k++) {
                                if (getGridCellStatus(dateStr, k, locBoard) !== '空闲') {
                                  isRangeOccupied = true;
                                }
                              }

                              let cellContent;
                              let cellBg = 'bg-white text-gray-500 hover:bg-gray-50';

                              if (cellStatus === '使用中') {
                                cellBg = 'bg-rose-100/90 text-rose-700 font-bold border border-rose-200/80 cursor-not-allowed';
                                cellContent = <span className="text-[10px]">使用中</span>;
                              } else if (cellStatus === '申请占位中') {
                                cellBg = 'bg-amber-50 text-amber-600 font-medium cursor-not-allowed';
                                cellContent = <span className="text-[10px]">申请占位</span>;
                              } else {
                                // Free cell
                                if (isDateSelected && isInCoveredCols) {
                                  cellBg = 'bg-emerald-500 text-white font-bold shadow-xs';
                                  cellContent = (
                                    <span className="text-[10px] flex items-center justify-center gap-0.5">
                                      {isCoveredStart ? `已预订 (${neededCols}栏)` : '✓'}
                                    </span>
                                  );
                                } else if (isHoveredRow && isInCoveredCols) {
                                  if (isRangeOccupied) {
                                    cellBg = 'bg-rose-50 text-rose-500 font-bold border border-rose-200';
                                    cellContent = <span className="text-[10px]">冲突不可订</span>;
                                  } else {
                                    cellBg = 'bg-emerald-100/90 text-emerald-800 font-bold border border-emerald-400';
                                    cellContent = (
                                      <span className="text-[10px] flex items-center justify-center gap-0.5">
                                        {isCoveredStart ? `可预订 (${neededCols}栏)` : '可预订'}
                                      </span>
                                    );
                                  }
                                } else {
                                  cellContent = <span className="text-[10px] text-emerald-600 font-medium">空闲</span>;
                                }
                              }

                              return (
                                <td
                                  key={colNum}
                                  onMouseEnter={() => {
                                    setHoveredRowDate(dateStr);
                                    setHoveredCol(colNum);
                                  }}
                                  onClick={() => {
                                    if (cellStatus !== '空闲' || isRangeOccupied) return;
                                    setLocStartCol(activeStartCol);
                                    toggleDateSelection(dateStr);
                                  }}
                                  className={`py-2 px-1 border-r border-gray-100 transition-all cursor-pointer select-none ${cellBg}`}
                                >
                                  {cellContent}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>



            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-white sticky bottom-0 z-20">
              <button
                type="button"
                onClick={() => setShowLocationModal(false)}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-bold cursor-pointer transition-colors"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveLocationItem}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold cursor-pointer transition-colors shadow-sm"
              >
                保存
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modal 2: 查看详情 (海报张贴申请详情) */}
      {viewingApp && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200 my-auto relative">
            
            {/* Header: Title strictly "海报张贴申请详情" */}
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

            {/* Container with scrollable body and sticky overlay footer */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs pb-24">
              
              {/* Left Column: Form Fields (Readonly, identical layout to "海报张贴申请") */}
              <div className="lg:col-span-8 space-y-4">
                
                {/* 1. 申请单位, 申请人, 联系电话 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      申请单位 <span className="text-gray-400 font-normal">(只读)</span>
                    </label>
                    <input
                      type="text"
                      disabled
                      value={viewingApp.orgName}
                      className="w-full bg-gray-100/90 border border-gray-200/80 rounded-xl px-3 py-2 text-xs text-gray-700 cursor-not-allowed font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      申请人 <span className="text-gray-400 font-normal">(只读)</span>
                    </label>
                    <input
                      type="text"
                      disabled
                      value={viewingApp.applicantName}
                      className="w-full bg-gray-100/90 border border-gray-200/80 rounded-xl px-3 py-2 text-xs text-gray-700 cursor-not-allowed font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      联系电话 <span className="text-gray-400 font-normal">(只读)</span>
                    </label>
                    <input
                      type="text"
                      disabled
                      value={viewingApp.contactPhone || '13959200001'}
                      className="w-full bg-gray-100/90 border border-gray-200/80 rounded-xl px-3 py-2 text-xs text-gray-700 cursor-not-allowed font-medium"
                    />
                  </div>
                </div>

                {/* 2. 活动主题 */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    活动主题 <span className="text-gray-400 font-normal">(只读)</span>
                  </label>
                  <input
                    type="text"
                    disabled
                    value={viewingApp.title}
                    className="w-full bg-gray-100/90 border border-gray-200/80 rounded-xl px-3 py-2 text-xs text-gray-800 cursor-not-allowed font-medium"
                  />
                </div>

                {/* 3. 活动说明 */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    活动说明 <span className="text-gray-400 font-normal">(只读)</span>
                  </label>
                  <textarea
                    rows={2}
                    disabled
                    value={`关于开展“${viewingApp.title}”校园海报宣传展示工作的申请。宣传内容积极健康，遵循校园宣传阵地管理规范。`}
                    className="w-full bg-gray-100/90 border border-gray-200/80 rounded-xl px-3 py-2 text-xs text-gray-700 cursor-not-allowed resize-none font-medium"
                  />
                </div>

                {/* 4. 栏位要求 (只读选框) */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1.5">
                    栏位要求 <span className="text-gray-400 font-normal">(只读)</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {['1 栏', '2 栏', '3 栏', '4 栏'].map((option) => {
                      const isSelected = viewingApp.posterSize === option || viewingApp.posterSize?.startsWith(option.charAt(0));
                      return (
                        <div
                          key={option}
                          className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold ${
                            isSelected
                              ? 'bg-blue-50/90 border-blue-500 text-blue-700 ring-2 ring-blue-100 shadow-xs'
                              : 'bg-gray-100/70 border-gray-200/70 text-gray-400'
                          }`}
                        >
                          <input
                            type="radio"
                            disabled
                            checked={isSelected}
                            className="accent-blue-600"
                          />
                          <span>{option}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 5. 海报效果图 */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    海报效果图 <span className="text-gray-400 font-normal">(只读)</span>
                  </label>
                  <div className="flex items-center gap-4 bg-gray-50/80 border border-gray-200/80 rounded-2xl p-3">
                    <div className="w-16 h-20 rounded-xl overflow-hidden bg-gray-200 border border-gray-300/60 flex-shrink-0 flex items-center justify-center">
                      <img src={viewingApp.posterImageUrl} alt={viewingApp.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-xs">已提交海报高清晰预览图</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">已核验</span>
                      </div>
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        规格格式：{viewingApp.posterSize}；排版规范符合规定，版权信息及主办单位标注清晰。
                      </p>
                    </div>
                  </div>
                </div>

                {/* 6. 张贴位置和时间 */}
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

                  {/* 位置与时间无序列表 */}
                  <div className="overflow-x-auto rounded-xl border border-gray-100 bg-gray-50/50 p-3">
                    <ul className="space-y-2 text-[11px]">
                      {viewingApp.postingLocations.map((loc, idx) => {
                        const parts = parsePostingLocationParts(loc);
                        return (
                          <li key={idx} className="flex items-center gap-1.5 whitespace-nowrap p-2 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 ml-1"></span>
                            {/* 1. 位置 */}
                            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-200/80 whitespace-nowrap">
                              {parts.campus}
                            </span>
                            {/* 2. 张贴栏 */}
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-medium border border-slate-200 whitespace-nowrap">
                              {parts.board}
                            </span>
                            {/* 3. 日期列表 */}
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

              {/* Right Column: 过程记录 */}
              <div className="lg:col-span-4 bg-slate-50/90 rounded-2xl p-5 border border-slate-200/70 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-slate-200/80">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-blue-600" />
                      <h4 className="font-bold text-gray-900 text-xs tracking-wide">过程记录</h4>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium bg-white px-2 py-0.5 rounded-md border border-slate-200/80">
                      时序追踪
                    </span>
                  </div>

                  <div className="relative pl-3 space-y-4 before:absolute before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                    {getApprovalTimeline(viewingApp).map((step, idx) => {
                      let badgeBg = 'bg-slate-200 text-slate-600';
                      let statusTag = <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">待处理</span>;
                      
                      if (step.status === 'completed') {
                        badgeBg = 'bg-emerald-600 text-white';
                        statusTag = <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">已通过</span>;
                      } else if (step.status === 'active') {
                        badgeBg = 'bg-blue-600 text-white animate-pulse';
                        statusTag = <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-bold">审批中</span>;
                      } else if (step.status === 'rejected') {
                        badgeBg = 'bg-rose-600 text-white';
                        statusTag = <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded font-bold">未通过</span>;
                      } else if (step.status === 'withdrawn') {
                        badgeBg = 'bg-amber-500 text-white';
                        statusTag = <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">已撤回</span>;
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
                  <span className="font-bold block mb-1">💡 审讯流向指引：</span>
                  从提交至核发，全流程受排期资源算法约束。若申请人主动发起撤回，排期额度将实时归还公用池。
                </div>
              </div>

            </div>

            {/* Bottom Sticky Overlay Footer */}
            <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-gray-200/80 px-6 py-4 z-30 flex items-center justify-between gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">当前流程状态：</span>
                {renderStatusBadge(viewingApp.status)}
              </div>

              <div className="flex items-center gap-3">
                {viewingApp.status !== '已撤回' && (
                  <button
                    type="button"
                    onClick={() => handleWithdrawApp(viewingApp.id)}
                    className="bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md shadow-rose-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCcw size={14} />
                    <span>撤回申请</span>
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

      {/* 5. Modal: 审批海报张贴申请 Modal */}
      {reviewingApp && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <div className="bg-white rounded-3xl max-w-6xl w-full shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200 my-auto relative">
            
            {/* Header: Title strictly "海报张贴审批" */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100/80 bg-white z-20 shrink-0">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
                  <CheckCircle2 className="text-blue-600" size={20} />
                  <span>海报张贴审批</span>
                </h3>
                {renderStatusBadge(reviewingApp.status)}
              </div>
              <button 
                type="button"
                onClick={() => setReviewingApp(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Container with scrollable body */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
              
              {/* 1. Left Column: 申请表单只读信息 (5/12 宽度) */}
              <div className="lg:col-span-5 space-y-4">
                
                {/* 1. 申请单位, 申请人, 联系电话 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      申请单位 <span className="text-gray-400 font-normal">(只读)</span>
                    </label>
                    <input
                      type="text"
                      disabled
                      value={reviewingApp.orgName}
                      className="w-full bg-gray-100/90 border border-gray-200/80 rounded-xl px-3 py-2 text-xs text-gray-700 cursor-not-allowed font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      申请人 <span className="text-gray-400 font-normal">(只读)</span>
                    </label>
                    <input
                      type="text"
                      disabled
                      value={reviewingApp.applicantName}
                      className="w-full bg-gray-100/90 border border-gray-200/80 rounded-xl px-3 py-2 text-xs text-gray-700 cursor-not-allowed font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      联系电话 <span className="text-gray-400 font-normal">(只读)</span>
                    </label>
                    <input
                      type="text"
                      disabled
                      value={reviewingApp.contactPhone || '13959200001'}
                      className="w-full bg-gray-100/90 border border-gray-200/80 rounded-xl px-3 py-2 text-xs text-gray-700 cursor-not-allowed font-medium"
                    />
                  </div>
                </div>

                {/* 2. 活动主题 */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    活动主题 <span className="text-gray-400 font-normal">(只读)</span>
                  </label>
                  <input
                    type="text"
                    disabled
                    value={reviewingApp.title}
                    className="w-full bg-gray-100/90 border border-gray-200/80 rounded-xl px-3 py-2 text-xs text-gray-800 cursor-not-allowed font-medium"
                  />
                </div>

                {/* 3. 活动说明 */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    活动说明 <span className="text-gray-400 font-normal">(只读)</span>
                  </label>
                  <textarea
                    rows={2}
                    disabled
                    value={`关于开展“${reviewingApp.title}”校园海报宣传展示工作的申请。宣传内容积极健康，遵循校园宣传阵地管理规范。`}
                    className="w-full bg-gray-100/90 border border-gray-200/80 rounded-xl px-3 py-2 text-xs text-gray-700 cursor-not-allowed resize-none font-medium"
                  />
                </div>

                {/* 4. 栏位要求 (只读选框) */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1.5">
                    栏位要求 <span className="text-gray-400 font-normal">(只读)</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {['1 栏', '2 栏', '3 栏', '4 栏'].map((option) => {
                      const isSelected = reviewingApp.posterSize === option || reviewingApp.posterSize?.startsWith(option.charAt(0));
                      return (
                        <div
                          key={option}
                          className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold ${
                            isSelected
                              ? 'bg-blue-50/90 border-blue-500 text-blue-700 ring-2 ring-blue-100 shadow-xs'
                              : 'bg-gray-100/70 border-gray-200/70 text-gray-400'
                          }`}
                        >
                          <input
                            type="radio"
                            disabled
                            checked={isSelected}
                            className="accent-blue-600"
                          />
                          <span>{option}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 5. 海报效果图 */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    海报效果图 <span className="text-gray-400 font-normal">(只读)</span>
                  </label>
                  <div className="flex items-center gap-4 bg-gray-50/80 border border-gray-200/80 rounded-2xl p-3">
                    <div className="w-16 h-20 rounded-xl overflow-hidden bg-gray-200 border border-gray-300/60 flex-shrink-0 flex items-center justify-center">
                      <img src={reviewingApp.posterImageUrl} alt={reviewingApp.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-xs">已提交海报高清晰预览图</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">已核验</span>
                      </div>
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        规格格式：{reviewingApp.posterSize}；排版规范符合规定，版权信息及主办单位标注清晰。
                      </p>
                    </div>
                  </div>
                </div>

                {/* 6. 张贴位置和时间 */}
                <div className="border border-gray-200/80 rounded-2xl p-4 bg-white space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      <h4 className="font-bold text-gray-900 text-xs">张贴位置和时间</h4>
                    </div>
                    <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                      共 {reviewingApp.postingLocations.length} 处排期位置
                    </span>
                  </div>

                  {/* 位置与时间无序列表 */}
                  <div className="overflow-x-auto rounded-xl border border-gray-100 bg-gray-50/50 p-3">
                    <ul className="space-y-2 text-[11px]">
                      {reviewingApp.postingLocations.map((loc, idx) => {
                        const parts = parsePostingLocationParts(loc);
                        return (
                          <li key={idx} className="flex items-center gap-1.5 whitespace-nowrap p-2 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 ml-1"></span>
                            {/* 1. 位置 */}
                            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-200/80 whitespace-nowrap">
                              {parts.campus}
                            </span>
                            {/* 2. 张贴栏 */}
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-medium border border-slate-200 whitespace-nowrap">
                              {parts.board}
                            </span>
                            {/* 3. 日期列表 */}
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

              {/* 2. Middle Column: 我的审批 信息块 (4/12 宽度) */}
              <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-blue-200/80 shadow-xs flex flex-col justify-between space-y-4 ring-1 ring-blue-50">
                <div>
                  <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-blue-600" />
                      <h4 className="font-bold text-gray-900 text-xs tracking-wide">我的审批</h4>
                    </div>
                    <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                      待处理
                    </span>
                  </div>

                  <div className="space-y-4">
                    {/* 审批结论 (单选框: 同意、不同意) */}
                    <div>
                      <label className="block font-bold text-gray-800 text-xs mb-2">
                        审批结论 <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex items-center gap-3">
                        <label className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border font-bold text-xs cursor-pointer transition-all ${
                          approvalDecision === '同意' 
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-100 shadow-2xs' 
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}>
                          <input
                            type="radio"
                            name="approvalDecision"
                            value="同意"
                            checked={approvalDecision === '同意'}
                            onChange={() => {
                              setApprovalDecision('同意');
                              if (approvalError) setApprovalError('');
                            }}
                            className="accent-emerald-600"
                          />
                          <span>同意</span>
                        </label>

                        <label className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border font-bold text-xs cursor-pointer transition-all ${
                          approvalDecision === '不同意' 
                            ? 'bg-rose-50 border-rose-500 text-rose-700 ring-2 ring-rose-100 shadow-2xs' 
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}>
                          <input
                            type="radio"
                            name="approvalDecision"
                            value="不同意"
                            checked={approvalDecision === '不同意'}
                            onChange={() => {
                              setApprovalDecision('不同意');
                              if (approvalError) setApprovalError('');
                            }}
                            className="accent-rose-600"
                          />
                          <span>不同意</span>
                        </label>
                      </div>
                    </div>

                    {/* 审批意见 */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block font-bold text-gray-800 text-xs">
                          审批意见 {approvalDecision === '不同意' ? <span className="text-rose-500">*</span> : <span className="text-gray-400 font-normal">(可选)</span>}
                        </label>
                      </div>
                      <textarea
                        rows={5}
                        value={approvalOpinion}
                        onChange={(e) => {
                          setApprovalOpinion(e.target.value);
                          if (approvalError) setApprovalError('');
                        }}
                        placeholder={approvalDecision === '不同意' ? '选择“不同意”时，必须填写审批意见...' : '请填写您的审批意见或处理建议...'}
                        className={`w-full bg-gray-50/90 border rounded-xl p-3 text-xs text-gray-800 focus:bg-white focus:ring-2 outline-none transition-all resize-none font-medium ${
                          approvalError ? 'border-rose-400 ring-2 ring-rose-100' : 'border-gray-200/90 focus:border-blue-500 focus:ring-blue-100'
                        }`}
                      />
                      {approvalError && (
                        <p className="text-[11px] font-bold text-rose-500 flex items-center gap-1 mt-1.5 animate-in fade-in">
                          <AlertCircle size={13} className="shrink-0" />
                          <span>{approvalError}</span>
                        </p>
                      )}
                    </div>

                    {/* 表单按钮: 提交 */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleSubmitApprovalForm}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Send size={14} />
                        <span>提交</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Right Column: 过程记录 信息块 (3/12 宽度) */}
              <div className="lg:col-span-3 bg-slate-50/90 rounded-2xl p-4 sm:p-5 border border-slate-200/70 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-slate-200/80">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-blue-600" />
                      <h4 className="font-bold text-gray-900 text-xs tracking-wide">过程记录</h4>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium bg-white px-2 py-0.5 rounded-md border border-slate-200/80">
                      时序追踪
                    </span>
                  </div>

                  <div className="relative pl-3 space-y-4 before:absolute before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                    {getApprovalTimeline(reviewingApp).map((step, idx) => {
                      let badgeBg = 'bg-slate-200 text-slate-600';
                      let statusTag = <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">待处理</span>;
                      
                      if (step.status === 'completed') {
                        badgeBg = 'bg-emerald-600 text-white';
                        statusTag = <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">已通过</span>;
                      } else if (step.status === 'active') {
                        badgeBg = 'bg-blue-600 text-white animate-pulse';
                        statusTag = <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-bold">审批中</span>;
                      } else if (step.status === 'rejected') {
                        badgeBg = 'bg-rose-600 text-white';
                        statusTag = <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded font-bold">未通过</span>;
                      } else if (step.status === 'withdrawn') {
                        badgeBg = 'bg-amber-500 text-white';
                        statusTag = <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">已撤回</span>;
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
                  <span className="font-bold block mb-1">💡 审讯流向指引：</span>
                  从提交至核发，全流程受排期资源算法约束。若申请人主动发起撤回，排期额度将实时归还公用池。
                </div>
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}
