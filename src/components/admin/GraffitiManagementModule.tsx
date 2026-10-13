import React, { useState, useEffect, useRef } from 'react';
import { 
  MOCK_GRAFFITI_AREAS, 
  MOCK_AREA_APPLICATIONS, 
  MOCK_GRAFFITI_SUBMISSIONS, 
  MOCK_3D_MURALS,
  MOCK_ORGANIZATIONS
} from '../../data/posterGraffitiMock';
import { 
  GraffitiArea, 
  AreaUsageApplication, 
  GraffitiSubmission, 
  ApprovalStatus 
} from '../../types/posterGraffitiTypes';
import Tunnel3DView from '../exhibition/Tunnel3DView';
import { 
  Palette, 
  Plus, 
  FileCheck, 
  Layers, 
  Eye, 
  BarChart3, 
  CheckCircle2, 
  QrCode, 
  MapPin, 
  Sparkles,
  Heart,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  UserCheck,
  UserMinus,
  X,
  Building2,
  Calendar,
  Search,
  RotateCcw,
  Undo2,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Phone,
  Filter,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Sliders,
  Check,
  Upload
} from 'lucide-react';

export interface LocationApplicationPending {
  id: string;
  location: string;             // 使用位置（起止）
  applyTime: string;            // 申请时间
  applicantOrg: string;         // 申请单位
  applicantName: string;        // 申请人
  status: '待辅导员审批' | '待单位负责人审批' | '待团委审批';
  usageStartDate: string;       // 申请使用开始时间
  usageEndDate: string;         // 申请使用结束时间
  usagePlan?: string;           // 申请用途/计划描述
  contactPhone?: string;        // 联系电话
}

export interface LocationApplicationCompleted {
  id: string;
  location: string;             // 使用位置（起止）
  usageStartDate: string;       // 申请使用开始时间
  usageEndDate: string;         // 申请使用结束时间
  status: '审批通过' | '审批不通过';
  approverName: string;         // 审批人
  approveTime: string;          // 审批时间
  applyTime: string;            // 申请时间
  applicantOrg: string;         // 申请单位
  applicantName: string;        // 申请人
  usagePlan?: string;           // 申请用途/计划描述
  approveComment?: string;      // 审批意见
}

export interface GraffitiContentPendingItem {
  id: string;
  imageUrl: string;
  title: string;              // 主题
  location: string;           // 涂鸦位置（起止）
  applyTime: string;          // 申请时间
  applicantOrg: string;       // 申请单位
  applicantName: string;      // 申请人
  contactPhone?: string;
  usagePlan?: string;
  status: '待辅导员审批' | '待单位负责人审批' | '待团委审批';
}

export interface GraffitiContentCompletedItem {
  id: string;
  imageUrl: string;
  title: string;              // 主题
  location: string;           // 涂鸦位置（起止）
  status: '审批通过' | '已驳回'; // 审批状态
  approveTime: string;        // 审批时间
  applyTime: string;          // 申请时间
  applicantOrg: string;       // 申请单位
  applicantName: string;      // 申请人
  approverName?: string;
  approveComment?: string;
  usagePlan?: string;
}

interface CustomTunnelArea {
  id: string;
  sectionCode: string;
  side: 'LEFT' | 'RIGHT';
  startM: number;
  endM: number;
  status: 'OCCUPIED' | 'AVAILABLE' | 'PENDING_RESERVATION';
  currentOwnerOrg?: string;
  validFrom: string;
  validTo: string;
}

interface GraffitiManagementModuleProps {
  subTab?: string;
}

export default function GraffitiManagementModule({ subTab = 'GRA-01' }: GraffitiManagementModuleProps) {
  const [activeTab, setActiveTab] = useState(subTab);

  useEffect(() => {
    if (subTab) {
      setActiveTab(subTab);
    }
  }, [subTab]);

  // States
  const [areas, setAreas] = useState<GraffitiArea[]>(MOCK_GRAFFITI_AREAS);
  const [areaApps, setAreaApps] = useState<AreaUsageApplication[]>(MOCK_AREA_APPLICATIONS);
  const [graffitiSubs, setGraffitiSubs] = useState<GraffitiSubmission[]>(MOCK_GRAFFITI_SUBMISSIONS);

  // GRA-01 Tunnel Wall Visualization state
  const [wallSide, setWallSide] = useState<'LEFT' | 'RIGHT'>('LEFT');
  const [zoomScale, setZoomScale] = useState<number>(100); // Zoom level percentage (50% - 200%)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Mouse Drag Scroll for Viewport
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!viewportRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - viewportRef.current.offsetLeft);
    setScrollLeftState(viewportRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !viewportRef.current) return;
    e.preventDefault();
    const x = e.pageX - viewportRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    viewportRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Full 50m Tunnel Wall Coverage Data with 5cm Gaps (0.05m gaps)
  const [wallAreas, setWallAreas] = useState<CustomTunnelArea[]>([
    // LEFT WALL
    {
      id: 'area-left-1',
      sectionCode: 'K12+300.00 ~ K12+309.95',
      side: 'LEFT',
      startM: 0,
      endM: 9.95,
      status: 'AVAILABLE',
      validFrom: '2026年09月01日',
      validTo: '2027年08月31日'
    },
    {
      id: 'area-left-2',
      sectionCode: 'K12+310.00 ~ K12+319.95',
      side: 'LEFT',
      startM: 10.00,
      endM: 19.95,
      status: 'OCCUPIED',
      currentOwnerOrg: '艺术学院青年志愿者协会',
      validFrom: '2026年09月01日',
      validTo: '2027年08月31日'
    },
    {
      id: 'area-left-3',
      sectionCode: 'K12+320.00 ~ K12+331.95',
      side: 'LEFT',
      startM: 20.00,
      endM: 31.95,
      status: 'AVAILABLE',
      validFrom: '2026年09月01日',
      validTo: '2027年08月31日'
    },
    {
      id: 'area-left-4',
      sectionCode: 'K12+332.00 ~ K12+341.95',
      side: 'LEFT',
      startM: 32.00,
      endM: 41.95,
      status: 'OCCUPIED',
      currentOwnerOrg: '计算机科学与技术系',
      validFrom: '2026年03月15日',
      validTo: '2027年03月14日'
    },
    {
      id: 'area-left-5',
      sectionCode: 'K12+342.00 ~ K12+350.00',
      side: 'LEFT',
      startM: 42.00,
      endM: 50.00,
      status: 'AVAILABLE',
      validFrom: '2026年09月01日',
      validTo: '2027年08月31日'
    },

    // RIGHT WALL
    {
      id: 'area-right-1',
      sectionCode: 'K12+300.00 ~ K12+312.00',
      side: 'RIGHT',
      startM: 0,
      endM: 12.00,
      status: 'OCCUPIED',
      currentOwnerOrg: '海洋与地球学院团党委',
      validFrom: '2026年06月01日',
      validTo: '2027年05月31日'
    },
    {
      id: 'area-right-2',
      sectionCode: 'K12+312.05 ~ K12+324.95',
      side: 'RIGHT',
      startM: 12.05,
      endM: 24.95,
      status: 'AVAILABLE',
      validFrom: '2026年09月01日',
      validTo: '2027年08月31日'
    },
    {
      id: 'area-right-3',
      sectionCode: 'K12+325.00 ~ K12+337.95',
      side: 'RIGHT',
      startM: 25.00,
      endM: 37.95,
      status: 'OCCUPIED',
      currentOwnerOrg: '厦门大学吉他协会',
      validFrom: '2026年10月01日',
      validTo: '2027年09月30日'
    },
    {
      id: 'area-right-4',
      sectionCode: 'K12+338.00 ~ K12+350.00',
      side: 'RIGHT',
      startM: 38.00,
      endM: 50.00,
      status: 'AVAILABLE',
      validFrom: '2026年09月01日',
      validTo: '2027年08月31日'
    }
  ]);

  // Modal States
  const [assigningArea, setAssigningArea] = useState<CustomTunnelArea | null>(null);
  const [assignOrgName, setAssignOrgName] = useState<string>(MOCK_ORGANIZATIONS[0]?.orgName || '校学生会宣传部');
  const [assignValidFrom, setAssignValidFrom] = useState<string>('2026年09月01日');
  const [assignValidTo, setAssignValidTo] = useState<string>('2027年08月31日');

  const [revokingArea, setRevokingArea] = useState<CustomTunnelArea | null>(null);

  // Confirm Assign Usage
  const handleConfirmAssign = () => {
    if (!assigningArea) return;
    setWallAreas(prev => prev.map(item => {
      if (item.id === assigningArea.id) {
        return {
          ...item,
          status: 'OCCUPIED',
          currentOwnerOrg: assignOrgName,
          validFrom: assignValidFrom,
          validTo: assignValidTo
        };
      }
      return item;
    }));
    setAssigningArea(null);
  };

  // Confirm Revoke Usage
  const handleConfirmRevoke = () => {
    if (!revokingArea) return;
    setWallAreas(prev => prev.map(item => {
      if (item.id === revokingArea.id) {
        return {
          ...item,
          status: 'AVAILABLE',
          currentOwnerOrg: undefined
        };
      }
      return item;
    }));
    setRevokingArea(null);
  };

  // GRA-02 Location Application States
  const [appTab, setAppTab] = useState<'PENDING' | 'COMPLETED'>('PENDING');
  const [searchOrg, setSearchOrg] = useState('');
  const [searchStartDate, setSearchStartDate] = useState('');
  const [searchEndDate, setSearchEndDate] = useState('');

  // Pagination states
  const [pendingPage, setPendingPage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);
  const pageSize = 10;

  // Pending List Data (18 records)
  const [pendingApps, setPendingApps] = useState<LocationApplicationPending[]>([
    {
      id: 'APP-P-001',
      location: 'K12+300.00 ~ K12+309.95 (左壁)',
      applyTime: '2026-08-08 09:30',
      applicantOrg: '艺术学院青年志愿者协会',
      applicantName: '陈立华',
      status: '待辅导员审批',
      usageStartDate: '2026-09-01',
      usageEndDate: '2027-08-31',
      usagePlan: '迎接 2026 级新生与厦大建校 105 周年主题涂鸦壁画创作',
      contactPhone: '13800138001'
    },
    {
      id: 'APP-P-002',
      location: 'K12+320.00 ~ K12+331.95 (左壁)',
      applyTime: '2026-08-06 14:15',
      applicantOrg: '校学生会宣传部',
      applicantName: '林海波',
      status: '待单位负责人审批',
      usageStartDate: '2026-09-01',
      usageEndDate: '2027-08-31',
      usagePlan: '厦大校园文化与五四精神主题长卷',
      contactPhone: '13905920002'
    },
    {
      id: 'APP-P-003',
      location: 'K12+312.05 ~ K12+324.95 (右壁)',
      applyTime: '2026-08-04 11:20',
      applicantOrg: '厦门大学吉他协会',
      applicantName: '张思琪',
      status: '待团委审批',
      usageStartDate: '2026-10-01',
      usageEndDate: '2027-09-30',
      usagePlan: '音乐与青春·草地音乐节涂鸦展壁',
      contactPhone: '13705920003'
    },
    {
      id: 'APP-P-004',
      location: 'K12+332.00 ~ K12+41.95 (左壁)',
      applyTime: '2026-08-03 16:40',
      applicantOrg: '计算机科学与技术系',
      applicantName: '郭一凡',
      status: '待辅导员审批',
      usageStartDate: '2026-09-15',
      usageEndDate: '2027-09-14',
      usagePlan: '人工智能与未来计算主题涂鸦艺术展',
      contactPhone: '13600120004'
    },
    {
      id: 'APP-P-005',
      location: 'K12+325.00 ~ K12+337.95 (右壁)',
      applyTime: '2026-08-03 10:10',
      applicantOrg: '海洋与地球学院团党委',
      applicantName: '黄美玲',
      status: '待单位负责人审批',
      usageStartDate: '2026-09-01',
      usageEndDate: '2027-08-31',
      usagePlan: '深蓝梦想——海洋科考与生态环境保护宣传墙',
      contactPhone: '13500130005'
    },
    {
      id: 'APP-P-006',
      location: 'K12+342.00 ~ K12+350.00 (左壁)',
      applyTime: '2026-08-02 15:25',
      applicantOrg: '厦大音乐社',
      applicantName: '刘宇翔',
      status: '待团委审批',
      usageStartDate: '2026-09-10',
      usageEndDate: '2027-09-09',
      usagePlan: '交响青春——厦大新年音乐会宣传涂鸦',
      contactPhone: '13800140006'
    },
    {
      id: 'APP-P-007',
      location: 'K12+338.00 ~ K12+350.00 (右壁)',
      applyTime: '2026-08-02 09:00',
      applicantOrg: '建筑与土木工程学院',
      applicantName: '王建勋',
      status: '待辅导员审批',
      usageStartDate: '2026-09-20',
      usageEndDate: '2027-09-19',
      usagePlan: '空间之美——古建筑保护与现代设计展览壁画',
      contactPhone: '13900150007'
    },
    {
      id: 'APP-P-008',
      location: 'K12+351.00 ~ K12+360.00 (左壁)',
      applyTime: '2026-08-01 17:30',
      applicantOrg: '物理科学与技术学院',
      applicantName: '赵天宇',
      status: '待单位负责人审批',
      usageStartDate: '2026-09-01',
      usageEndDate: '2027-08-31',
      usagePlan: '量子探秘——物理百年发展历程科普墙',
      contactPhone: '13700160008'
    },
    {
      id: 'APP-P-009',
      location: 'K12+361.00 ~ K12+372.00 (右壁)',
      applyTime: '2026-08-01 13:15',
      applicantOrg: '人文学院学生会',
      applicantName: '周雨欣',
      status: '待团委审批',
      usageStartDate: '2026-09-05',
      usageEndDate: '2027-09-04',
      usagePlan: '诗意厦大——古典诗词与嘉庚精神主题壁画',
      contactPhone: '13600170009'
    },
    {
      id: 'APP-P-010',
      location: 'K12+373.00 ~ K12+382.00 (左壁)',
      applyTime: '2026-07-31 11:00',
      applicantOrg: '新闻传播学院',
      applicantName: '孙家豪',
      status: '待辅导员审批',
      usageStartDate: '2026-09-01',
      usageEndDate: '2027-08-31',
      usagePlan: '光影记录——新媒体时代的新闻伦理与时代视角',
      contactPhone: '13500180010'
    },
    {
      id: 'APP-P-011',
      location: 'K12+383.00 ~ K12+392.00 (右壁)',
      applyTime: '2026-07-30 08:45',
      applicantOrg: '生命科学学院团委',
      applicantName: '吴子涵',
      status: '待单位负责人审批',
      usageStartDate: '2026-09-15',
      usageEndDate: '2027-09-14',
      usagePlan: '万物生辉——生物多样性科普与绿色环保展',
      contactPhone: '13800190011'
    },
    {
      id: 'APP-P-012',
      location: 'K12+393.00 ~ K12+402.00 (左壁)',
      applyTime: '2026-07-29 16:20',
      applicantOrg: '经济学院青年志愿者协会',
      applicantName: '郑一鸣',
      status: '待团委审批',
      usageStartDate: '2026-10-01',
      usageEndDate: '2027-09-30',
      usagePlan: '诚信金融与公益奉献主题长廊涂鸦',
      contactPhone: '13900200012'
    },
    {
      id: 'APP-P-013',
      location: 'K12+403.00 ~ K12+412.00 (右壁)',
      applyTime: '2026-07-28 10:05',
      applicantOrg: '法学院辩论社',
      applicantName: '高明远',
      status: '待辅导员审批',
      usageStartDate: '2026-09-01',
      usageEndDate: '2027-08-31',
      usagePlan: '正义之光——法治文化宣传与全国辩论赛成果展',
      contactPhone: '13700210013'
    },
    {
      id: 'APP-P-014',
      location: 'K12+413.00 ~ K12+422.00 (左壁)',
      applyTime: '2026-07-27 15:50',
      applicantOrg: '管理学院学生会',
      applicantName: '韩婷婷',
      status: '待单位负责人审批',
      usageStartDate: '2026-09-10',
      usageEndDate: '2027-09-09',
      usagePlan: '创新创业——商界先锋与领导力训练营壁画',
      contactPhone: '13600220014'
    },
    {
      id: 'APP-P-015',
      location: 'K12+423.00 ~ K12+432.00 (右壁)',
      applyTime: '2026-07-26 09:30',
      applicantOrg: '材料学院团党委',
      applicantName: '宋佳林',
      status: '待团委审批',
      usageStartDate: '2026-09-01',
      usageEndDate: '2027-08-31',
      usagePlan: '材料微观世界——纳米结构艺术微观壁画',
      contactPhone: '13500230015'
    },
    {
      id: 'APP-P-016',
      location: 'K12+433.00 ~ K12+442.00 (左壁)',
      applyTime: '2026-07-25 14:10',
      applicantOrg: '外国语学院英美文学社',
      applicantName: '钱少华',
      status: '待辅导员审批',
      usageStartDate: '2026-09-20',
      usageEndDate: '2027-09-19',
      usagePlan: '多元文化交流——世界文学名著经典场景涂鸦',
      contactPhone: '13800240016'
    },
    {
      id: 'APP-P-017',
      location: 'K12+443.00 ~ K12+452.00 (右壁)',
      applyTime: '2026-07-24 11:25',
      applicantOrg: '化学化工学院志愿者协会',
      applicantName: '许正伟',
      status: '待单位负责人审批',
      usageStartDate: '2026-09-01',
      usageEndDate: '2027-08-31',
      usagePlan: '元素之彩——化学元素周期表与绿色化学墙',
      contactPhone: '13900250017'
    },
    {
      id: 'APP-P-018',
      location: 'K12+453.00 ~ K12+462.00 (左壁)',
      applyTime: '2026-07-23 16:00',
      applicantOrg: '数学科学学院学术部',
      applicantName: '姜若溪',
      status: '待团委审批',
      usageStartDate: '2026-10-01',
      usageEndDate: '2027-09-30',
      usagePlan: '数学之美——分形几何与黄金分割涂鸦创作',
      contactPhone: '13700260018'
    }
  ]);

  // Completed List Data (18 records)
  const [completedApps, setCompletedApps] = useState<LocationApplicationCompleted[]>([
    {
      id: 'APP-C-001',
      location: 'K12+310.00 ~ K12+319.95 (左壁)',
      usageStartDate: '2026-09-01',
      usageEndDate: '2027-08-31',
      status: '审批通过',
      approverName: '校团委书记 (李建国)',
      approveTime: '2026-08-05 16:30',
      applyTime: '2026-08-01 10:00',
      applicantOrg: '计算机科学与技术系',
      applicantName: '王五',
      usagePlan: '图灵的梦想——数字图灵与人工智能涂鸦展',
      approveComment: '计划周全，符合芙蓉隧道涂鸦管理规范，同意通过。'
    },
    {
      id: 'APP-C-002',
      location: 'K12+300.00 ~ K12+312.00 (右壁)',
      usageStartDate: '2026-06-01',
      usageEndDate: '2027-05-31',
      status: '审批通过',
      approverName: '海洋学院党委书记 (赵强)',
      approveTime: '2026-05-28 11:00',
      applyTime: '2026-05-20 15:40',
      applicantOrg: '海洋与地球学院团党委',
      applicantName: '刘梦梅',
      usagePlan: '蓝海长歌——海洋保护与生态科普涂鸦',
      approveComment: '主题鲜明，富有教育意义，审批通过。'
    },
    {
      id: 'APP-C-003',
      location: 'K12+342.00 ~ K12+350.00 (左壁)',
      usageStartDate: '2026-09-01',
      usageEndDate: '2027-08-31',
      status: '审批不通过',
      approverName: '艺术学院辅导员 (周海)',
      approveTime: '2026-07-28 09:20',
      applyTime: '2026-07-25 18:10',
      applicantOrg: '校园动漫社',
      applicantName: '高天',
      usagePlan: '未审定商业动漫形象展示',
      approveComment: '草案含有未授权商业形象，不符合校园文化创作要求，不予通过。'
    },
    {
      id: 'APP-C-004',
      location: 'K12+338.00 ~ K12+350.00 (右壁)',
      usageStartDate: '2026-10-01',
      usageEndDate: '2027-09-30',
      status: '审批通过',
      approverName: '校团委学生工作处 (孙老师)',
      approveTime: '2026-07-15 14:00',
      applyTime: '2026-07-10 09:00',
      applicantOrg: '厦门大学户外运动协会',
      applicantName: '郭嘉',
      usagePlan: '无声勇士——户外攀岩与探险纪念墙',
      approveComment: '审核通过。'
    },
    {
      id: 'APP-C-005',
      location: 'K12+351.00 ~ K12+360.00 (右壁)',
      usageStartDate: '2026-09-15',
      usageEndDate: '2027-09-14',
      status: '审批通过',
      approverName: '建筑学院党委 (周主任)',
      approveTime: '2026-07-15 14:20',
      applyTime: '2026-07-12 09:50',
      applicantOrg: '建筑与土木工程学院',
      applicantName: '周长青',
      usagePlan: '空间韵律——校园建筑结构手绘壁画',
      approveComment: '审批通过。'
    },
    {
      id: 'APP-C-006',
      location: 'K12+361.00 ~ K12+370.00 (左壁)',
      usageStartDate: '2026-09-01',
      usageEndDate: '2027-08-31',
      status: '审批不通过',
      approverName: '辅导员 (郭一凡)',
      approveTime: '2026-07-10 10:45',
      applyTime: '2026-07-08 16:15',
      applicantOrg: '心理学社',
      applicantName: '冯杰',
      usagePlan: '情感宣泄抽象涂鸦',
      approveComment: '方案色彩与图案较为沉闷，建议修改后重新报送。'
    },
    {
      id: 'APP-C-007',
      location: 'K12+371.00 ~ K12+380.00 (右壁)',
      usageStartDate: '2026-10-01',
      usageEndDate: '2027-09-30',
      status: '审批通过',
      approverName: '物理学院副院长 (陈教授)',
      approveTime: '2026-07-05 11:30',
      applyTime: '2026-07-01 13:20',
      applicantOrg: '物理科学与技术学院',
      applicantName: '郑振宇',
      usagePlan: '宇宙探索——星系与黑洞科普艺术墙',
      approveComment: '非常具有科普教育价值，同意通过。'
    },
    {
      id: 'APP-C-008',
      location: 'K12+381.00 ~ K12+390.00 (左壁)',
      usageStartDate: '2026-09-01',
      usageEndDate: '2027-08-31',
      status: '审批通过',
      approverName: '人文学院党委 (王书记)',
      approveTime: '2026-06-28 15:10',
      applyTime: '2026-06-25 10:40',
      applicantOrg: '人文学院学生会',
      applicantName: '沈静',
      usagePlan: '文学的长河——中外文学史经典图景',
      approveComment: '构图典雅，符合人文学院风格，同意。'
    },
    {
      id: 'APP-C-009',
      location: 'K12+391.00 ~ K12+400.00 (右壁)',
      usageStartDate: '2026-09-05',
      usageEndDate: '2027-09-04',
      status: '审批通过',
      approverName: '新闻学院党委 (林书记)',
      approveTime: '2026-06-20 17:00',
      applyTime: '2026-06-18 14:00',
      applicantOrg: '新闻传播学院',
      applicantName: '褚明',
      usagePlan: '定格时代——摄影作品与纪实涂鸦展',
      approveComment: '方案切实可行，准予通过。'
    },
    {
      id: 'APP-C-010',
      location: 'K12+401.00 ~ K12+410.00 (左壁)',
      usageStartDate: '2026-09-01',
      usageEndDate: '2027-08-31',
      status: '审批不通过',
      approverName: '校团委终审 (刘老师)',
      approveTime: '2026-06-15 09:30',
      applyTime: '2026-06-12 11:20',
      applicantOrg: '魔术社',
      applicantName: '卫豪',
      usagePlan: '奇幻魔术解密壁画',
      approveComment: '安全隐患提示不明确，暂不审批。'
    },
    {
      id: 'APP-C-011',
      location: 'K12+411.00 ~ K12+420.00 (右壁)',
      usageStartDate: '2026-09-10',
      usageEndDate: '2027-09-09',
      status: '审批通过',
      approverName: '生科学院党委 (蒋书记)',
      approveTime: '2026-06-10 16:45',
      applyTime: '2026-06-08 15:30',
      applicantOrg: '生命科学学院团委',
      applicantName: '蒋小梅',
      usagePlan: '基因的秘密——DNA双螺旋与生命演化图',
      approveComment: '同意通过。'
    },
    {
      id: 'APP-C-012',
      location: 'K12+421.00 ~ K12+430.00 (左壁)',
      usageStartDate: '2026-09-01',
      usageEndDate: '2027-08-31',
      status: '审批通过',
      approverName: '经院辅导员 (曾老师)',
      approveTime: '2026-06-05 11:15',
      applyTime: '2026-06-02 09:00',
      applicantOrg: '经济学院青年志愿者协会',
      applicantName: '沈伟',
      usagePlan: '绿色金融与可持续发展长廊',
      approveComment: '符合要求，予以批准。'
    },
    {
      id: 'APP-C-013',
      location: 'K12+431.00 ~ K12+440.00 (右壁)',
      usageStartDate: '2026-10-01',
      usageEndDate: '2027-09-30',
      status: '审批通过',
      approverName: '法学院党委 (彭书记)',
      approveTime: '2026-05-30 14:50',
      applyTime: '2026-05-26 16:10',
      applicantOrg: '法学院辩论社',
      applicantName: '杨睿',
      usagePlan: '法学百年——宪法精神与公平正义宣传画',
      approveComment: '同意备案。'
    },
    {
      id: 'APP-C-014',
      location: 'K12+441.00 ~ K12+450.00 (左壁)',
      usageStartDate: '2026-09-01',
      usageEndDate: '2027-08-31',
      status: '审批不通过',
      approverName: '管院指导老师 (朱老师)',
      approveTime: '2026-05-22 10:20',
      applyTime: '2026-05-19 13:45',
      applicantOrg: '创业实践社',
      applicantName: '朱成',
      usagePlan: '商业招商合作宣传海报',
      approveComment: '严禁发布任何带有商业赞助二维码的内容，不予通过。'
    },
    {
      id: 'APP-C-015',
      location: 'K12+451.00 ~ K12+460.00 (右壁)',
      usageStartDate: '2026-09-15',
      usageEndDate: '2027-09-14',
      status: '审批通过',
      approverName: '材院党委 (秦书记)',
      approveTime: '2026-05-15 15:30',
      applyTime: '2026-05-12 10:15',
      applicantOrg: '材料学院团党委',
      applicantName: '秦明',
      usagePlan: '强国之基——高分子新材料前沿技术科普画',
      approveComment: '同意。'
    },
    {
      id: 'APP-C-016',
      location: 'K12+461.00 ~ K12+470.00 (左壁)',
      usageStartDate: '2026-09-01',
      usageEndDate: '2027-08-31',
      status: '审批通过',
      approverName: '外院党委 (尤书记)',
      approveTime: '2026-05-08 11:00',
      applyTime: '2026-05-05 14:20',
      applicantOrg: '外国语学院英美文学社',
      applicantName: '尤静',
      usagePlan: '世界和平与语言之桥涂鸦墙',
      approveComment: '通过。'
    },
    {
      id: 'APP-C-017',
      location: 'K12+471.00 ~ K12+480.00 (右壁)',
      usageStartDate: '2026-09-01',
      usageEndDate: '2027-08-31',
      status: '审批通过',
      approverName: '化院党委 (严书记)',
      approveTime: '2026-04-28 16:20',
      applyTime: '2026-04-25 09:30',
      applicantOrg: '化学化工学院志愿者协会',
      applicantName: '严子航',
      usagePlan: '化学反应的奇迹——多彩显色反应手绘壁画',
      approveComment: '通过。'
    },
    {
      id: 'APP-C-018',
      location: 'K12+481.00 ~ K12+490.00 (左壁)',
      usageStartDate: '2026-10-01',
      usageEndDate: '2027-09-30',
      status: '审批不通过',
      approverName: '校团委终审 (刘老师)',
      approveTime: '2026-04-18 10:00',
      applyTime: '2026-04-15 11:50',
      applicantOrg: '动漫社',
      applicantName: '金博',
      usagePlan: '日系同人二次元文化展示',
      approveComment: '主题不符合学校主流校园文化导向，不予通过。'
    }
  ]);

  // GRA-06 隧道涂鸦内容报批 States
  const [contentTab, setContentTab] = useState<'PENDING' | 'COMPLETED'>('PENDING');
  const [contentSearchTheme, setContentSearchTheme] = useState('');
  const [contentSearchOrg, setContentSearchOrg] = useState('全部单位');
  const [contentSearchStartDate, setContentSearchStartDate] = useState('');
  const [contentSearchEndDate, setContentSearchEndDate] = useState('');

  const [contentPendingPage, setContentPendingPage] = useState(1);
  const [contentCompletedPage, setContentCompletedPage] = useState(1);
  const contentPageSize = 5;

  const [showCreateContentModal, setShowCreateContentModal] = useState(false);
  const [newContentTitle, setNewContentTitle] = useState('凤凰花开的季节');
  const [newContentImageUrl, setNewContentImageUrl] = useState('https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400');
  const [newContentUsagePlan, setNewContentUsagePlan] = useState('展现毕业季凤凰花开之景，传递对母校的热爱与祝福。');
  const [newContentLocation, setNewContentLocation] = useState('K12+300.00 ~ K12+315.00 (左壁)');
  const [newContentPhone, setNewContentPhone] = useState('13800138001');

  const [viewingContentItem, setViewingContentItem] = useState<GraffitiContentPendingItem | GraffitiContentCompletedItem | null>(null);
  const [withdrawingContentItem, setWithdrawingContentItem] = useState<GraffitiContentPendingItem | null>(null);

  const [contentPendingList, setContentPendingList] = useState<GraffitiContentPendingItem[]>([
    {
      id: 'APP-C-001',
      imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400',
      title: '凤凰花开的季节',
      location: 'K12+300.00 ~ K12+315.00 (左壁)',
      applyTime: '2026-08-09 10:15',
      applicantOrg: '艺术学院青年志愿者协会',
      applicantName: '张伟',
      contactPhone: '13800138001',
      usagePlan: '展现毕业季凤凰花开之景，传递对母校的热爱与祝福。',
      status: '待辅导员审批'
    },
    {
      id: 'APP-C-002',
      imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400',
      title: '星辰大海·致敬科研',
      location: 'K12+316.00 ~ K12+328.00 (左壁)',
      applyTime: '2026-08-09 09:40',
      applicantOrg: '海洋与地球学院团党委',
      applicantName: '李思涵',
      contactPhone: '13905920002',
      usagePlan: '深海探测与蓝色海洋科普手绘长卷。',
      status: '待单位负责人审批'
    },
    {
      id: 'APP-C-003',
      imageUrl: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400',
      title: '代码与未来：AI时代',
      location: 'K12+330.00 ~ K12+345.00 (右壁)',
      applyTime: '2026-08-08 16:20',
      applicantOrg: '计算机科学与技术系',
      applicantName: '陈宇航',
      contactPhone: '13600120004',
      usagePlan: '人工智能、代码字符与未来科技融合艺术创作。',
      status: '待团委审批'
    },
    {
      id: 'APP-C-004',
      imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400',
      title: '摇滚不熄·青春留声',
      location: 'K12+350.00 ~ K12+362.00 (左壁)',
      applyTime: '2026-08-08 14:10',
      applicantOrg: '厦大音乐社',
      applicantName: '周杰',
      contactPhone: '13705920003',
      usagePlan: '音乐节吉他与流动的五线谱主题涂鸦。',
      status: '待辅导员审批'
    },
    {
      id: 'APP-C-005',
      imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400',
      title: '嘉庚精神·百年传承',
      location: 'K12+365.00 ~ K12+380.00 (右壁)',
      applyTime: '2026-08-08 11:30',
      applicantOrg: '校学生会宣传部',
      applicantName: '林雨婷',
      contactPhone: '13500130005',
      usagePlan: '纪念校史与传承嘉庚爱国奉献精神主题墙。',
      status: '待单位负责人审批'
    },
    {
      id: 'APP-C-006',
      imageUrl: 'https://images.unsplash.com/photo-1579783928621-6a03e6eb72a1?w=400',
      title: '绿色低碳·美丽校园',
      location: 'K12+382.00 ~ K12+395.00 (左壁)',
      applyTime: '2026-08-07 17:05',
      applicantOrg: '环境与生态学院社团',
      applicantName: '王浩然',
      contactPhone: '13800140006',
      usagePlan: '环保垃圾分类与低碳绿色文明校园手绘。',
      status: '待团委审批'
    },
    {
      id: 'APP-C-007',
      imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400',
      title: '光影记忆·毕业季',
      location: 'K12+400.00 ~ K12+412.00 (右壁)',
      applyTime: '2026-08-07 15:45',
      applicantOrg: '新闻传播学院摄影协会',
      applicantName: '赵欣怡',
      contactPhone: '13900150007',
      usagePlan: '相机胶片与建南礼堂毕业合影定格纪念。',
      status: '待辅导员审批'
    },
    {
      id: 'APP-C-008',
      imageUrl: 'https://images.unsplash.com/photo-1578926375605-eaf7559b1458?w=400',
      title: '梦回海上丝绸之路',
      location: 'K12+415.00 ~ K12+430.00 (左壁)',
      applyTime: '2026-08-07 10:20',
      applicantOrg: '历史文化学院研究生会',
      applicantName: '孙健',
      contactPhone: '13700160008',
      usagePlan: '古代福船航海历史文化长卷涂鸦。',
      status: '待单位负责人审批'
    },
    {
      id: 'APP-C-009',
      imageUrl: 'https://images.unsplash.com/photo-1508898578281-774ac4893c0c?w=400',
      title: '篮球狂热·迎新联赛',
      location: 'K12+432.00 ~ K12+445.00 (右壁)',
      applyTime: '2026-08-06 18:30',
      applicantOrg: '校体育舞蹈与篮球协会',
      applicantName: '吴磊',
      contactPhone: '13800170009',
      usagePlan: '热血篮球运动剪影与迎新杯口号涂鸦。',
      status: '待辅导员审批'
    },
    {
      id: 'APP-C-010',
      imageUrl: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=400',
      title: '诗与远方·人文之光',
      location: 'K12+448.00 ~ K12+460.00 (左壁)',
      applyTime: '2026-08-06 14:15',
      applicantOrg: '人文学院文学社',
      applicantName: '郑雅琪',
      contactPhone: '13900180010',
      usagePlan: '经典诗词水墨风格与现代文字涂鸦艺术。',
      status: '待团委审批'
    },
    {
      id: 'APP-C-011',
      imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400',
      title: '漫绘青春·动漫社展示',
      location: 'K12+462.00 ~ K12+475.00 (右壁)',
      applyTime: '2026-08-06 09:50',
      applicantOrg: '厦大动漫同好会',
      applicantName: '刘畅',
      contactPhone: '13700190011',
      usagePlan: '次元同人艺术插画与嘉年华宣传形象。',
      status: '待辅导员审批'
    },
    {
      id: 'APP-C-012',
      imageUrl: 'https://images.unsplash.com/photo-1550684847-75bdda21cc95?w=400',
      title: '数理之美·几何构想',
      location: 'K12+478.00 ~ K12+490.00 (左壁)',
      applyTime: '2026-08-05 16:40',
      applicantOrg: '数学科学学院学生会',
      applicantName: '徐晨',
      contactPhone: '13600200012',
      usagePlan: '黄金分割与三维几何分形构图。',
      status: '待单位负责人审批'
    },
    {
      id: 'APP-C-013',
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400',
      title: '越野之魂·户外挑战',
      location: 'K12+492.00 ~ K12+505.00 (右壁)',
      applyTime: '2026-08-05 11:25',
      applicantOrg: '户外攀岩与越野协会',
      applicantName: '黄明',
      contactPhone: '13500210013',
      usagePlan: '高山仰止与攀登挑战精神墙画。',
      status: '待团委审批'
    },
    {
      id: 'APP-C-014',
      imageUrl: 'https://images.unsplash.com/photo-1582562124811-c091b7d0a68f?w=400',
      title: '国风古韵·汉服文化',
      location: 'K12+508.00 ~ K12+520.00 (左壁)',
      applyTime: '2026-08-05 08:30',
      applicantOrg: '国学社与汉服文化协会',
      applicantName: '朱婷婷',
      contactPhone: '13800220014',
      usagePlan: '传统服饰华纹与古韵礼仪长廊。',
      status: '待辅导员审批'
    },
    {
      id: 'APP-C-015',
      imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400',
      title: '音符飘扬·管弦合奏',
      location: 'K12+522.00 ~ K12+535.00 (右壁)',
      applyTime: '2026-08-04 15:10',
      applicantOrg: '交响乐团学生分部',
      applicantName: '胡晓峰',
      contactPhone: '13900230015',
      usagePlan: '管弦合奏跃动音符与新年音乐会主题。',
      status: '待单位负责人审批'
    },
    {
      id: 'APP-C-016',
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400',
      title: '医者仁心·健康校园',
      location: 'K12+538.00 ~ K12+550.00 (左壁)',
      applyTime: '2026-08-04 10:05',
      applicantOrg: '医学院青年志愿者服务队',
      applicantName: '高洁',
      contactPhone: '13700240016',
      usagePlan: '急救知识科普与关爱生命健康长廊。',
      status: '待团委审批'
    },
    {
      id: 'APP-C-017',
      imageUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=400',
      title: '无偿献血·爱心接力',
      location: 'K12+552.00 ~ K12+565.00 (右壁)',
      applyTime: '2026-08-03 16:50',
      applicantOrg: '校红十字会学生分会',
      applicantName: '蔡博',
      contactPhone: '13600250017',
      usagePlan: '红十字公益与献血救人爱心接力壁画。',
      status: '待辅导员审批'
    },
    {
      id: 'APP-C-018',
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400',
      title: '创客未来·科技成果展',
      location: 'K12+568.00 ~ K12+580.00 (左壁)',
      applyTime: '2026-08-03 09:15',
      applicantOrg: '创新创业社团联合会',
      applicantName: '邓嘉豪',
      contactPhone: '13500260018',
      usagePlan: '创客大脑与机器人科技竞赛风采壁画。',
      status: '待单位负责人审批'
    }
  ]);

  const [contentCompletedList, setContentCompletedList] = useState<GraffitiContentCompletedItem[]>([
    {
      id: 'APP-CC-001',
      imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400',
      title: '白鹭飞翔·厦大印象',
      location: 'K12+300.00 ~ K12+312.00 (左壁)',
      status: '审批通过',
      approveTime: '2026-08-07 16:30',
      applyTime: '2026-08-05 09:10',
      applicantOrg: '艺术学院青年志愿者协会',
      applicantName: '张伟',
      approverName: '校团委 · 刘老师',
      usagePlan: '以校鸟白鹭与演武大桥为画面核心，展示特区大学风采。'
    },
    {
      id: 'APP-CC-002',
      imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400',
      title: '商业广告侵权违规图案',
      location: 'K12+315.00 ~ K12+325.00 (右壁)',
      status: '已驳回',
      approveTime: '2026-08-06 11:20',
      applyTime: '2026-08-04 14:00',
      applicantOrg: '校外合作赞助社团',
      applicantName: '马超',
      approverName: '辅导员 · 张老师',
      approveComment: '涂鸦方案中包含未经许可的校外商业赞助Logo，违背校园文化管理规定。',
      usagePlan: '拟展示品牌推广与商业活动二维码。'
    },
    {
      id: 'APP-CC-003',
      imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400',
      title: '迎新涂鸦展·梦启芙蓉',
      location: 'K12+328.00 ~ K12+340.00 (左壁)',
      status: '审批通过',
      approveTime: '2026-08-06 09:45',
      applyTime: '2026-08-03 11:30',
      applicantOrg: '校学生会宣传部',
      applicantName: '林雨婷',
      approverName: '校团委 · 刘老师',
      usagePlan: '欢迎 2026 级新生入校，记录青春追梦路。'
    },
    {
      id: 'APP-CC-004',
      imageUrl: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400',
      title: '深海探测·蓝海征途',
      location: 'K12+342.00 ~ K12+355.00 (右壁)',
      status: '审批通过',
      approveTime: '2026-08-05 17:10',
      applyTime: '2026-08-02 10:15',
      applicantOrg: '海洋与地球学院团党委',
      applicantName: '李思涵',
      approverName: '校团委 · 刘老师',
      usagePlan: '“嘉庚”号科考船与深海潜水器手绘壁画。'
    },
    {
      id: 'APP-CC-005',
      imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400',
      title: '图案版面排期重叠方案',
      location: 'K12+358.00 ~ K12+370.00 (左壁)',
      status: '已驳回',
      approveTime: '2026-08-05 14:00',
      applyTime: '2026-08-01 16:45',
      applicantOrg: '校乒乓球协会',
      applicantName: '崔健',
      approverName: '学生会排期组 · 王思齐',
      approveComment: '拟申请的墙面时段已有重大活动排期覆盖，请调整涂鸦位置后再提交。',
      usagePlan: '乒乓球比赛宣传招贴手绘。'
    },
    {
      id: 'APP-CC-006',
      imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400',
      title: '计算机系三十周年纪念壁画',
      location: 'K12+372.00 ~ K12+385.00 (右壁)',
      status: '审批通过',
      approveTime: '2026-08-04 15:20',
      applyTime: '2026-07-31 09:00',
      applicantOrg: '计算机科学与技术系',
      applicantName: '陈宇航',
      approverName: '校团委 · 刘老师',
      usagePlan: '计算机系建系 30 周年回顾与代码画卷。'
    },
    {
      id: 'APP-CC-007',
      imageUrl: 'https://images.unsplash.com/photo-1579783928621-6a03e6eb72a1?w=400',
      title: '不符合主流审美粗暴图层',
      location: 'K12+388.00 ~ K12+400.00 (左壁)',
      status: '已驳回',
      approveTime: '2026-08-03 10:30',
      applyTime: '2026-07-30 15:20',
      applicantOrg: '个人涂鸦爱好者联盟',
      applicantName: '彭飞',
      approverName: '单位负责人 · 李书记',
      approveComment: '设计图稿缺乏美感，画面杂乱且无明确主题，不建议在主干道展示。',
      usagePlan: '抽象涂鸦构图。'
    },
    {
      id: 'APP-CC-008',
      imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400',
      title: '古典乐赏析·高山流水',
      location: 'K12+402.00 ~ K12+415.00 (右壁)',
      status: '审批通过',
      approveTime: '2026-08-02 16:40',
      applyTime: '2026-07-29 11:10',
      applicantOrg: '厦大音乐社',
      applicantName: '周杰',
      approverName: '校团委 · 刘老师',
      usagePlan: '古典民族乐器与水墨乐符交融手绘。'
    },
    {
      id: 'APP-CC-009',
      imageUrl: 'https://images.unsplash.com/photo-1578926375605-eaf7559b1458?w=400',
      title: '绿色低碳·环教同行',
      location: 'K12+418.00 ~ K12+430.00 (左壁)',
      status: '审批通过',
      approveTime: '2026-08-01 11:15',
      applyTime: '2026-07-28 14:30',
      applicantOrg: '环境与生态学院社团',
      applicantName: '王浩然',
      approverName: '校团委 · 刘老师',
      usagePlan: '绿色生态地球与碳中和普及艺术手绘。'
    },
    {
      id: 'APP-CC-010',
      imageUrl: 'https://images.unsplash.com/photo-1508898578281-774ac4893c0c?w=400',
      title: '光影艺术·校史长廊',
      location: 'K12+432.00 ~ K12+445.00 (右壁)',
      status: '审批通过',
      approveTime: '2026-07-31 17:00',
      applyTime: '2026-07-27 10:00',
      applicantOrg: '新闻传播学院摄影协会',
      applicantName: '赵欣怡',
      approverName: '校团委 · 刘老师',
      usagePlan: '历代厦大学子镜头下的校园美景手绘呈献。'
    },
    {
      id: 'APP-CC-011',
      imageUrl: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=400',
      title: '诗歌节·心之所向',
      location: 'K12+448.00 ~ K12+460.00 (左壁)',
      status: '审批通过',
      approveTime: '2026-07-30 14:20',
      applyTime: '2026-07-26 16:15',
      applicantOrg: '人文学院文学社',
      applicantName: '郑雅琪',
      approverName: '校团委 · 刘老师',
      usagePlan: '三行诗金句与古风小插画手绘。'
    },
    {
      id: 'APP-CC-012',
      imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400',
      title: '未按规定盖章公函退回',
      location: 'K12+462.00 ~ K12+475.00 (右壁)',
      status: '已驳回',
      approveTime: '2026-07-29 09:30',
      applyTime: '2026-07-25 11:40',
      applicantOrg: '未注册学生社团',
      applicantName: '曾强',
      approverName: '辅导员 · 审验室',
      approveComment: '申请表格未加盖学院盖章，且申请人非在校注册学生，驳回申请。',
      usagePlan: '涂鸦社团宣传招新墙。'
    },
    {
      id: 'APP-CC-013',
      imageUrl: 'https://images.unsplash.com/photo-1550684847-75bdda21cc95?w=400',
      title: '数学之美·分形艺术',
      location: 'K12+478.00 ~ K12+490.00 (左壁)',
      status: '审批通过',
      approveTime: '2026-07-28 15:50',
      applyTime: '2026-07-24 08:50',
      applicantOrg: '数学科学学院学生会',
      applicantName: '徐晨',
      approverName: '校团委 · 刘老师',
      usagePlan: '分形几何与黄金螺线艺术涂鸦。'
    },
    {
      id: 'APP-CC-014',
      imageUrl: 'https://images.unsplash.com/photo-1582562124811-c091b7d0a68f?w=400',
      title: '汉服汉韵·礼仪之邦',
      location: 'K12+492.00 ~ K12+505.00 (右壁)',
      status: '审批通过',
      approveTime: '2026-07-27 10:10',
      applyTime: '2026-07-23 13:20',
      applicantOrg: '国学社与汉服文化协会',
      applicantName: '朱婷婷',
      approverName: '校团委 · 刘老师',
      usagePlan: '中华四大名锦与传统衣冠画卷。'
    },
    {
      id: 'APP-CC-015',
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400',
      title: '越野征途·无惧无畏',
      location: 'K12+508.00 ~ K12+520.00 (左壁)',
      status: '审批通过',
      approveTime: '2026-07-26 16:00',
      applyTime: '2026-07-22 09:30',
      applicantOrg: '户外攀岩与越野协会',
      applicantName: '黄明',
      approverName: '校团委 · 刘老师',
      usagePlan: '攀岩剪影与无畏挑战风貌。'
    },
    {
      id: 'APP-CC-016',
      imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400',
      title: '交响华章·放飞梦想',
      location: 'K12+522.00 ~ K12+535.00 (右壁)',
      status: '审批通过',
      approveTime: '2026-07-25 11:40',
      applyTime: '2026-07-21 14:10',
      applicantOrg: '交响乐团学生分部',
      applicantName: '胡晓峰',
      approverName: '校团委 · 刘老师',
      usagePlan: '指挥棒下的浩瀚音符长卷。'
    },
    {
      id: 'APP-CC-017',
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400',
      title: '医者仁心·大爱无疆',
      location: 'K12+538.00 ~ K12+550.00 (左壁)',
      status: '审批通过',
      approveTime: '2026-07-24 14:15',
      applyTime: '2026-07-20 10:05',
      applicantOrg: '医学院青年志愿者服务队',
      applicantName: '高洁',
      approverName: '校团委 · 刘老师',
      usagePlan: '致敬白衣天使与健康生活宣教手绘。'
    },
    {
      id: 'APP-CC-018',
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400',
      title: '创客先锋·科技潮涌',
      location: 'K12+552.00 ~ K12+565.00 (右壁)',
      status: '审批通过',
      approveTime: '2026-07-23 09:20',
      applyTime: '2026-07-19 15:40',
      applicantOrg: '创新创业社团联合会',
      applicantName: '邓嘉豪',
      approverName: '校团委 · 刘老师',
      usagePlan: '三维打印、智能芯片与创客蓝图。'
    }
  ]);

  const handleContentFilterReset = () => {
    setContentSearchTheme('');
    setContentSearchOrg('全部单位');
    setContentSearchStartDate('');
    setContentSearchEndDate('');
    setContentPendingPage(1);
    setContentCompletedPage(1);
  };

  const filteredContentPendingList = contentPendingList.filter(item => {
    if (contentSearchTheme && !item.title.toLowerCase().includes(contentSearchTheme.toLowerCase())) return false;
    if (contentSearchOrg && contentSearchOrg !== '全部单位' && item.applicantOrg !== contentSearchOrg) return false;
    if (contentSearchStartDate && item.applyTime < contentSearchStartDate) return false;
    if (contentSearchEndDate && item.applyTime > contentSearchEndDate + ' 23:59:59') return false;
    return true;
  });

  const filteredContentCompletedList = contentCompletedList.filter(item => {
    if (contentSearchTheme && !item.title.toLowerCase().includes(contentSearchTheme.toLowerCase())) return false;
    if (contentSearchOrg && contentSearchOrg !== '全部单位' && item.applicantOrg !== contentSearchOrg) return false;
    if (contentSearchStartDate && item.applyTime < contentSearchStartDate) return false;
    if (contentSearchEndDate && item.applyTime > contentSearchEndDate + ' 23:59:59') return false;
    return true;
  });

  const paginatedContentPendingList = filteredContentPendingList.slice(
    (contentPendingPage - 1) * contentPageSize,
    contentPendingPage * contentPageSize
  );

  const paginatedContentCompletedList = filteredContentCompletedList.slice(
    (contentCompletedPage - 1) * contentPageSize,
    contentCompletedPage * contentPageSize
  );

  const handleConfirmContentWithdraw = () => {
    if (!withdrawingContentItem) return;
    setContentPendingList(prev => prev.filter(item => item.id !== withdrawingContentItem.id));
    setWithdrawingContentItem(null);
  };

  const handleCreateContentSubmit = () => {
    if (!newContentTitle.trim()) {
      alert('请选择涂鸦主题');
      return;
    }
    if (!newContentUsagePlan.trim()) {
      alert('请输入创作计划与构想说明');
      return;
    }
    if (!newContentPhone.trim()) {
      alert('请输入联系电话');
      return;
    }

    const newItem: GraffitiContentPendingItem = {
      id: `APP-C-${String(contentPendingList.length + 101).padStart(3, '0')}`,
      imageUrl: newContentImageUrl || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400',
      title: newContentTitle,
      location: newContentLocation,
      applyTime: new Date().toISOString().replace('T', ' ').slice(0, 16),
      applicantOrg: '艺术学院青年志愿者协会',
      applicantName: '张伟',
      contactPhone: newContentPhone,
      usagePlan: newContentUsagePlan,
      status: '待辅导员审批'
    };

    setContentPendingList(prev => [newItem, ...prev]);
    setShowCreateContentModal(false);
    setContentTab('PENDING');
    setContentPendingPage(1);
  };

  // Modals for GRA-02
  // Modals for GRA-02
  const [showCreateAppModal, setShowCreateAppModal] = useState(false);
  const [showAddLocationModal, setShowAddLocationModal] = useState(false);
  const [viewingPendingItem, setViewingPendingItem] = useState<LocationApplicationPending | null>(null);
  const [viewingCompletedItem, setViewingCompletedItem] = useState<LocationApplicationCompleted | null>(null);
  const [withdrawingItem, setWithdrawingItem] = useState<LocationApplicationPending | null>(null);

  // New Application Form State
  const [newAppOrg, setNewAppOrg] = useState('校学生会宣传部');
  const [newAppName, setNewAppName] = useState('张三');
  const [newAppPhone, setNewAppPhone] = useState('');
  const [newAppPlan, setNewAppPlan] = useState('');

  // 申请区域列表
  const [appRegionsList, setAppRegionsList] = useState<Array<{ id: string; location: string; startDate: string; endDate: string }>>([
    { id: 'reg-1', location: 'K12+300.00 ~ K12+309.95 (左壁)', startDate: '2026-09-01', endDate: '2027-08-31' }
  ]);

  // "新增位置" Modal State
  const [addLocStartDate, setAddLocStartDate] = useState('2026-09-01');
  const [addLocEndDate, setAddLocEndDate] = useState('2027-08-31');
  const [addLocWallSide, setAddLocWallSide] = useState<'LEFT' | 'RIGHT'>('LEFT');
  const [addLocZoom, setAddLocZoom] = useState(100);
  const [addLocSearching, setAddLocSearching] = useState(false);

  // Modal Canvas & Mouse Drag References
  const addLocCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const addLocViewportRef = useRef<HTMLDivElement | null>(null);
  const [addLocIsDragging, setAddLocIsDragging] = useState(false);
  const [addLocStartX, setAddLocStartX] = useState(0);
  const [addLocScrollLeft, setAddLocScrollLeft] = useState(0);

  const handleAddLocMouseDown = (e: React.MouseEvent) => {
    if (!addLocViewportRef.current) return;
    setAddLocIsDragging(true);
    setAddLocStartX(e.pageX - addLocViewportRef.current.offsetLeft);
    setAddLocScrollLeft(addLocViewportRef.current.scrollLeft);
  };

  const handleAddLocMouseMove = (e: React.MouseEvent) => {
    if (!addLocIsDragging || !addLocViewportRef.current) return;
    e.preventDefault();
    const x = e.pageX - addLocViewportRef.current.offsetLeft;
    const walk = (x - addLocStartX) * 1.5;
    addLocViewportRef.current.scrollLeft = addLocScrollLeft - walk;
  };

  const handleAddLocMouseUpOrLeave = () => {
    setAddLocIsDragging(false);
  };

  const handleRemoveRegion = (id: string) => {
    setAppRegionsList(prev => prev.filter(item => item.id !== id));
  };

  const handleQueryAvailableRegions = () => {
    setAddLocSearching(true);
    setTimeout(() => {
      setAddLocSearching(false);
    }, 300);
  };

  // "申请区域大小设置" Modal State
  const [showSizeSettingModal, setShowSizeSettingModal] = useState(false);
  const [targetAreaForSetting, setTargetAreaForSetting] = useState<CustomTunnelArea | null>(null);
  const [reqRegionLength, setReqRegionLength] = useState<number>(3); // 2m ~ 5m

  const handleOpenSizeSetting = (area: CustomTunnelArea) => {
    setTargetAreaForSetting(area);
    const maxAvail = parseFloat((area.endM - area.startM).toFixed(1));
    const defaultLen = Math.min(5, Math.max(2, maxAvail));
    setReqRegionLength(defaultLen);
    setShowSizeSettingModal(true);
  };

  const handleSaveSizeSetting = () => {
    if (!targetAreaForSetting) return;

    const startM = targetAreaForSetting.startM;
    const endM = targetAreaForSetting.endM;
    const side = targetAreaForSetting.side;
    const reqLen = reqRegionLength;

    const actualReqEndM = Math.min(endM, parseFloat((startM + reqLen).toFixed(2)));

    // Start mileage calculation
    const startKmTotal = (startMileage / 100) + startM;
    const startKm = Math.floor(startKmTotal / 1000);
    const startm = startKmTotal % 1000;
    const startCodeStr = `K${startKm}+${startm.toFixed(2).padStart(6, '0')}`;

    // End mileage calculation for requested portion
    const endKmTotal = (startMileage / 100) + actualReqEndM;
    const endKm = Math.floor(endKmTotal / 1000);
    const endm = endKmTotal % 1000;
    const endCodeStr = `K${endKm}+${endm.toFixed(2).padStart(6, '0')}`;

    const reqSectionCode = `${startCodeStr} ~ ${endCodeStr}`;

    // Pending Area
    const pendingArea: CustomTunnelArea = {
      id: `area-pending-${Date.now()}`,
      sectionCode: reqSectionCode,
      side: side,
      startM: startM,
      endM: actualReqEndM,
      status: 'PENDING_RESERVATION',
      validFrom: addLocStartDate,
      validTo: addLocEndDate
    };

    // Update wallAreas state
    setWallAreas(prev => {
      const newAreas: CustomTunnelArea[] = [];
      for (const a of prev) {
        if (a.id === targetAreaForSetting.id) {
          newAreas.push(pendingArea);
          if (endM - actualReqEndM >= 0.1) {
            const remStartM = parseFloat((actualReqEndM + 0.05).toFixed(2));
            const remStartKmTotal = (startMileage / 100) + remStartM;
            const rKm = Math.floor(remStartKmTotal / 1000);
            const rm = remStartKmTotal % 1000;
            const remStartCodeStr = `K${rKm}+${rm.toFixed(2).padStart(6, '0')}`;

            const remEndKmTotal = (startMileage / 100) + endM;
            const reKm = Math.floor(remEndKmTotal / 1000);
            const rem = remEndKmTotal % 1000;
            const remEndCodeStr = `K${reKm}+${rem.toFixed(2).padStart(6, '0')}`;

            newAreas.push({
              id: `area-rem-${Date.now()}`,
              sectionCode: `${remStartCodeStr} ~ ${remEndCodeStr}`,
              side: side,
              startM: remStartM,
              endM: endM,
              status: 'AVAILABLE',
              validFrom: addLocStartDate,
              validTo: addLocEndDate
            });
          }
        } else {
          newAreas.push(a);
        }
      }
      return newAreas;
    });

    // Add to appRegionsList
    const newReg = {
      id: `reg-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      location: `${reqSectionCode} (${side === 'LEFT' ? '左壁' : '右壁'})`,
      startDate: addLocStartDate,
      endDate: addLocEndDate
    };
    setAppRegionsList(prev => [...prev, newReg]);

    setShowSizeSettingModal(false);
    setTargetAreaForSetting(null);
  };

  // Filtered lists
  const filteredPendingList = pendingApps.filter(item => {
    const matchOrg = !searchOrg || item.applicantOrg.toLowerCase().includes(searchOrg.toLowerCase()) || item.applicantName.toLowerCase().includes(searchOrg.toLowerCase());
    const matchStart = !searchStartDate || item.applyTime >= searchStartDate;
    const matchEnd = !searchEndDate || item.applyTime <= searchEndDate + ' 23:59';
    return matchOrg && matchStart && matchEnd;
  });

  const filteredCompletedList = completedApps.filter(item => {
    const matchOrg = !searchOrg || item.applicantOrg.toLowerCase().includes(searchOrg.toLowerCase()) || item.applicantName.toLowerCase().includes(searchOrg.toLowerCase()) || item.approverName.toLowerCase().includes(searchOrg.toLowerCase());
    const matchStart = !searchStartDate || item.applyTime >= searchStartDate;
    const matchEnd = !searchEndDate || item.applyTime <= searchEndDate + ' 23:59';
    return matchOrg && matchStart && matchEnd;
  });

  const handleFilterSearch = () => {
    setPendingPage(1);
    setCompletedPage(1);
  };

  const handleFilterReset = () => {
    setSearchOrg('');
    setSearchStartDate('');
    setSearchEndDate('');
    setPendingPage(1);
    setCompletedPage(1);
  };

  const handleCreateAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppName.trim()) return;

    const primaryLocation = appRegionsList.length > 0
      ? appRegionsList.map(r => r.location).join('; ')
      : '未分配区域';
    const primaryStartDate = appRegionsList.length > 0 ? appRegionsList[0].startDate : '2026-09-01';
    const primaryEndDate = appRegionsList.length > 0 ? appRegionsList[0].endDate : '2027-08-31';

    const newItem: LocationApplicationPending = {
      id: `APP-P-${Date.now().toString().slice(-4)}`,
      location: primaryLocation,
      applyTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
      applicantOrg: newAppOrg,
      applicantName: newAppName,
      status: '待辅导员审批',
      usageStartDate: primaryStartDate,
      usageEndDate: primaryEndDate,
      usagePlan: newAppPlan || '无特殊备注',
      contactPhone: newAppPhone || '13800000000'
    };

    setPendingApps(prev => [newItem, ...prev]);
    setShowCreateAppModal(false);
    setNewAppName('');
    setNewAppPhone('');
    setNewAppPlan('');
  };

  const handleConfirmWithdraw = () => {
    if (!withdrawingItem) return;
    setPendingApps(prev => prev.filter(item => item.id !== withdrawingItem.id));
    setWithdrawingItem(null);
  };

  // GRA-01 Tunnel Ruler Configuration (Horizontal)
  const startMileage = 12300; // K12+300.00
  const totalMeters = 50; // 50 meters tunnel segment
  const stepsPerMeter = 10; // 10cm step
  const totalSteps = totalMeters * stepsPerMeter; // 500 steps
  const baseStepWidth = 14; // Base 14px per 10cm
  const stepWidth = baseStepWidth * (zoomScale / 100); // Scaled width per step
  const totalWidth = totalSteps * stepWidth; // Scaled total width
  const rulerHeight = 36;

  useEffect(() => {
    if (activeTab !== 'GRA-01') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = totalWidth * dpr;
    canvas.height = rulerHeight * dpr;
    canvas.style.width = `${totalWidth}px`;
    canvas.style.height = `${rulerHeight}px`;

    ctx.scale(dpr, dpr);

    // Clear background - Light theme
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, totalWidth, rulerHeight);

    // Bottom horizontal separator line
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, rulerHeight - 0.5);
    ctx.lineTo(totalWidth, rulerHeight - 0.5);
    ctx.stroke();

    // Draw ticks & mileage labels
    for (let i = 0; i <= totalSteps; i++) {
      const x = i * stepWidth + 0.5;
      const isMeterMark = i % 10 === 0;

      const currentMeterOffset = i * 0.1;
      const totalMeterValue = (startMileage / 100) + currentMeterOffset;
      const km = Math.floor(totalMeterValue / 1000);
      const m = totalMeterValue % 1000;
      const mileageStr = `K${km}+${m.toFixed(2).padStart(6, '0')}`;

      if (isMeterMark) {
        // 1m mark: Bold vertical tick & highlighted label
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, 10);
        ctx.lineTo(x, rulerHeight - 1);
        ctx.stroke();

        ctx.font = 'bold 10px "JetBrains Mono", monospace, ui-monospace';
        ctx.fillStyle = '#1e293b';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(mileageStr, x + 4, 10);
      } else {
        // 10cm mark: Short tick
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, 22);
        ctx.lineTo(x, rulerHeight - 1);
        ctx.stroke();
      }
    }
  }, [activeTab, wallSide, totalSteps, stepWidth, rulerHeight, totalWidth, startMileage]);

  // Modal Canvas Drawing Effect for "新增位置"
  useEffect(() => {
    if (!showAddLocationModal) return;
    const canvas = addLocCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const addLocStepWidth = baseStepWidth * (addLocZoom / 100);
    const addLocTotalWidth = totalSteps * addLocStepWidth;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = addLocTotalWidth * dpr;
    canvas.height = rulerHeight * dpr;
    canvas.style.width = `${addLocTotalWidth}px`;
    canvas.style.height = `${rulerHeight}px`;

    ctx.scale(dpr, dpr);

    // Clear background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, addLocTotalWidth, rulerHeight);

    // Bottom horizontal separator line
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, rulerHeight - 0.5);
    ctx.lineTo(addLocTotalWidth, rulerHeight - 0.5);
    ctx.stroke();

    // Draw ticks & mileage labels
    for (let i = 0; i <= totalSteps; i++) {
      const x = i * addLocStepWidth + 0.5;
      const isMeterMark = i % 10 === 0;

      const currentMeterOffset = i * 0.1;
      const totalMeterValue = (startMileage / 100) + currentMeterOffset;
      const km = Math.floor(totalMeterValue / 1000);
      const m = totalMeterValue % 1000;
      const mileageStr = `K${km}+${m.toFixed(2).padStart(6, '0')}`;

      if (isMeterMark) {
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, 10);
        ctx.lineTo(x, rulerHeight - 1);
        ctx.stroke();

        ctx.font = 'bold 10px "JetBrains Mono", monospace, ui-monospace';
        ctx.fillStyle = '#1e293b';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(mileageStr, x + 4, 10);
      } else {
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, 22);
        ctx.lineTo(x, rulerHeight - 1);
        ctx.stroke();
      }
    }
  }, [showAddLocationModal, addLocWallSide, addLocZoom, totalSteps, rulerHeight, startMileage, baseStepWidth]);

  // Review Modal
  const [reviewingGraffiti, setReviewingGraffiti] = useState<GraffitiSubmission | null>(null);
  const [reviewComment, setReviewComment] = useState('');

  const handleReviewGraffitiAction = (action: 'APPROVED' | 'REJECTED') => {
    if (!reviewingGraffiti) return;

    let nextStatus = reviewingGraffiti.status;
    let qr = reviewingGraffiti.qrCode;

    if (action === 'REJECTED') {
      nextStatus = ApprovalStatus.REJECTED;
    } else {
      nextStatus = ApprovalStatus.APPROVED;
      qr = `XM-PVC-GRAFFITI-2026-${Math.floor(100 + Math.random() * 900)}`;
    }

    setGraffitiSubs(prev => prev.map(g => g.id === reviewingGraffiti.id ? {
      ...g,
      status: nextStatus,
      qrCode: qr,
      approvalLogs: [
        ...g.approvalLogs,
        { step: '团委终审', reviewer: '校团委管理组', action: action, comment: reviewComment || '同意创作并发码。', timestamp: new Date().toLocaleString('zh-CN') }
      ]
    } : g));

    setReviewingGraffiti(null);
    setReviewComment('');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Module Navigation (Hidden for GRA-01, GRA-02, GRA-06 and GRA-15 per requirements) */}
      {activeTab !== 'GRA-01' && activeTab !== 'GRA-02' && activeTab !== 'GRA-06' && activeTab !== 'GRA-15' && (
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Palette size={20} />
            </div>
            <div>
              <h2 className="text-base font-black text-gray-900">芙蓉隧道涂鸦管理模块</h2>
              <p className="text-xs text-gray-400">区域编号、使用权申办、涂鸦作品审核、3D 实时流控与作品库</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-gray-50 p-1.5 rounded-xl border border-gray-100 overflow-x-auto no-scrollbar">
            {[
              { id: 'GRA-01', label: '涂鸦区域管理', icon: <MapPin size={14} /> },
              { id: 'GRA-02', label: '区域使用权申请与审批', icon: <FileCheck size={14} /> },
              { id: 'GRA-06', label: '涂鸦创作申请与三级审批', icon: <Palette size={14} /> },
              { id: 'GRA-14', label: '涂鸦作品库', icon: <Layers size={14} /> },
              { id: 'GRA-15', label: '实时线上 3D 涂鸦', icon: <Eye size={14} /> },
              { id: 'GRA-16', label: '统计分析', icon: <BarChart3 size={14} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* GRA-01: 涂鸦区域管理 */}
      {activeTab === 'GRA-01' && (
        <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col font-sans">
          {/* Header */}
          <div className="flex flex-col bg-white border-b border-gray-200 shrink-0 px-6 py-3.5 gap-3">
            {/* Top Row: Title on Left, Zoom Slider + Theme Color Button on Far Right */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h1 className="text-base font-bold text-gray-900 tracking-wide font-sans">涂鸦区域管理</h1>

              <div className="flex items-center gap-3 ml-auto">
                {/* 缩放控制：缩小 / 拖拽进度条 / 放大 */}
                <div className="flex items-center gap-2 bg-slate-100/90 px-3 py-1.5 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setZoomScale(s => Math.max(50, s - 10))}
                    className="p-1 text-gray-600 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs font-medium"
                    title="缩小"
                  >
                    <ZoomOut size={14} />
                    <span>缩小</span>
                  </button>

                  <input
                    type="range"
                    min={50}
                    max={200}
                    step={5}
                    value={zoomScale}
                    onChange={(e) => setZoomScale(Number(e.target.value))}
                    className="w-28 accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                  />

                  <span className="text-xs font-mono font-bold text-indigo-600 min-w-[38px] text-center">
                    {zoomScale}%
                  </span>

                  <button
                    type="button"
                    onClick={() => setZoomScale(s => Math.min(200, s + 10))}
                    className="p-1 text-gray-600 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs font-medium"
                    title="放大"
                  >
                    <ZoomIn size={14} />
                    <span>放大</span>
                  </button>
                </div>

                {/* 重新划分按钮：最右侧，主题色 */}
                <button
                  type="button"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <RefreshCw size={14} />
                  <span>重新划分</span>
                </button>
              </div>
            </div>

            {/* Bottom Row: 左壁 / 右壁 在下一行头部，全新分段按钮样式 */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-2.5">
              <div className="inline-flex items-center gap-1 p-1 bg-slate-100/90 rounded-xl border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setWallSide('LEFT')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    wallSide === 'LEFT'
                      ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/80 font-black'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${wallSide === 'LEFT' ? 'bg-indigo-600' : 'bg-slate-300'}`} />
                  <span>左壁</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWallSide('RIGHT')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    wallSide === 'RIGHT'
                      ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/80 font-black'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${wallSide === 'RIGHT' ? 'bg-indigo-600' : 'bg-slate-300'}`} />
                  <span>右壁</span>
                </button>
              </div>

              <span className="text-xs text-slate-400 font-mono">
                当前显示：芙蓉隧道 - {wallSide === 'LEFT' ? '左侧墙面' : '右侧墙面'} (10cm 划分度)
              </span>
            </div>
          </div>

          {/* Horizontally Scrollable Viewport Container with Drag-to-Scroll support */}
          <div
            ref={viewportRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className={`w-full overflow-x-auto overflow-y-hidden relative bg-slate-100 p-4 border-t border-gray-100 select-none ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            <div
              className="relative rounded-xl overflow-hidden border border-slate-300 shadow-inner bg-white flex flex-col"
              style={{ width: `${totalWidth}px` }}
            >
              {/* Top Horizontal Mileage Ruler Canvas */}
              <div className="w-full bg-slate-50 border-b border-slate-200 shrink-0 sticky top-0 z-20">
                <canvas ref={canvasRef} className="block" />
              </div>

              {/* Half-Tunnel Visual Elevation Area */}
              <div
                className="relative w-full flex flex-col"
                style={{ height: '380px' }}
              >
                {/* 1. Tunnel Roof / Vaulted Ceiling Section (50px) */}
                <div className="h-[50px] w-full bg-gradient-to-b from-slate-300 via-slate-200 to-slate-100 border-b border-slate-300/80 relative flex items-center overflow-hidden shrink-0">
                  {/* Vaulted Arch Contour Pattern & Lights */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-200/60 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Arch Rib Beams & Tunnel Ceiling Lights every 5m (700px) */}
                  {Array.from({ length: Math.floor(totalMeters / 5) + 1 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="absolute top-0 bottom-0 flex flex-col items-center justify-between"
                      style={{ left: `${idx * 50 * stepWidth}px` }}
                    >
                      {/* Vertical concrete rib beam */}
                      <div className="w-1.5 h-full bg-slate-400/40 border-x border-slate-300/60" />
                      {/* Ceiling Light fixture */}
                      <div className="absolute top-2 -translate-x-1/2 left-1/2 w-4 h-2 bg-amber-200 border border-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                    </div>
                  ))}

                  <div className="absolute left-4 top-2 text-[10px] font-mono text-slate-500 font-semibold bg-slate-200/80 px-2 py-0.5 rounded border border-slate-300">
                    芙蓉隧道 {wallSide === 'LEFT' ? '左壁' : '右壁'} - 拱顶视角 (按住鼠标可左右拖动)
                  </div>
                </div>

                {/* 2. Main Wall Grid Area */}
                <div
                  className="flex-1 w-full relative"
                  style={{
                    backgroundColor: '#f8fafc',
                    backgroundImage: `
                      repeating-linear-gradient(
                        to right,
                        #94a3b8 0px,
                        #94a3b8 1.5px,
                        transparent 1.5px,
                        transparent ${stepWidth * 10}px
                      ),
                      repeating-linear-gradient(
                        to right,
                        #e2e8f0 0px,
                        #e2e8f0 1px,
                        transparent 1px,
                        transparent ${stepWidth}px
                      )
                    `
                  }}
                >
                  {/* Render regions on wall for current wallSide */}
                  {wallAreas
                    .filter(area => area.side === wallSide)
                    .map((area) => {
                      const leftPx = area.startM * 10 * stepWidth;
                      const lengthM = area.endM - area.startM;
                      const widthPx = lengthM * 10 * stepWidth;

                      return (
                        <div
                          key={area.id}
                          className="absolute top-3 bottom-3 rounded-xl border p-3 flex flex-col justify-between transition-all shadow-sm hover:shadow-md"
                          style={{
                            left: `${leftPx}px`,
                            width: `${widthPx}px`,
                            backgroundColor: area.status === 'OCCUPIED' ? 'rgba(238, 242, 255, 0.95)' : 'rgba(236, 253, 245, 0.95)',
                            borderColor: area.status === 'OCCUPIED' ? '#c7d2fe' : '#a7f3d0'
                          }}
                        >
                          {/* Card Header: Section Code & Status Badge */}
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono font-bold text-xs bg-white text-indigo-700 px-2.5 py-1 rounded-md border border-indigo-200 shadow-2xs truncate">
                              {area.sectionCode}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                              area.status === 'OCCUPIED' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                            }`}>
                              {area.status === 'OCCUPIED' ? '已有归属' : '无主空闲'}
                            </span>
                          </div>

                          {/* Card Middle: Button for Assign or Revoke */}
                          <div className="my-auto py-1 flex justify-center">
                            {area.status === 'AVAILABLE' ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setAssigningArea(area);
                                }}
                                className="w-full py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                              >
                                <UserCheck size={14} />
                                <span>分配使用权</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setRevokingArea(area);
                                }}
                                className="w-full py-1.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold text-xs rounded-lg shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                              >
                                <UserMinus size={14} />
                                <span>收回使用权</span>
                              </button>
                            )}
                          </div>

                          {/* Card Bottom: Org Name / Status, Length, and Usage Period Date Range */}
                          <div className="space-y-1 text-xs text-gray-700 bg-white/90 p-2 rounded-lg border border-gray-100 shadow-2xs">
                            <p className="font-bold text-gray-900 truncate">
                              {area.status === 'OCCUPIED' ? `归属：${area.currentOwnerOrg}` : '可申请使用权'}
                            </p>
                            <p className="text-[11px] font-mono text-gray-600">
                              长度：{lengthM.toFixed(2)} m ({Math.round(lengthM * 100)} cm)
                            </p>
                            <p className="text-[11px] text-indigo-600 font-medium">
                              使用期限：{area.validFrom} 至 {area.validTo}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* 3. Tunnel Sidewalk Curb & Road Surface Floor */}
                <div className="h-[45px] w-full bg-slate-700 border-t-2 border-slate-500 relative flex flex-col justify-between shrink-0 overflow-hidden">
                  <div
                    className="h-2 w-full border-b border-slate-600"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(45deg, #f59e0b, #f59e0b 10px, #1e293b 10px, #1e293b 20px)'
                    }}
                  />
                  <div className="flex-1 bg-slate-800 flex items-center justify-center relative">
                    <span className="text-[10px] font-mono text-slate-400 font-medium">
                      芙蓉隧道-{wallSide === 'LEFT' ? '左壁' : '右壁'} 侧步道与车道基底 (按住拖拽左右查看)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal: 分配使用权 */}
          {assigningArea && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-md overflow-hidden font-sans animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-50/50">
                  <div className="flex items-center gap-2 text-indigo-600">
                    <Building2 size={18} />
                    <h3 className="font-bold text-gray-900 text-sm">分配涂鸦区域使用权</h3>
                  </div>
                  <button
                    onClick={() => setAssigningArea(null)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                    <div className="text-xs text-slate-500">目标区域桩号</div>
                    <div className="font-mono font-bold text-indigo-600 text-sm">{assigningArea.sectionCode}</div>
                    <div className="text-xs text-slate-600">
                      长度：{(assigningArea.endM - assigningArea.startM).toFixed(2)}m (间隔 5cm 独立区块)
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 block">选择被授权单位/社团</label>
                    <select
                      value={assignOrgName}
                      onChange={(e) => setAssignOrgName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {MOCK_ORGANIZATIONS.map(org => (
                        <option key={org.id} value={org.orgName}>{org.orgName} ({org.orgType})</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 block">生效起始日期</label>
                      <input
                        type="text"
                        value={assignValidFrom}
                        onChange={(e) => setAssignValidFrom(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-mono text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="YYYY年MM月DD日"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 block">截止日期</label>
                      <input
                        type="text"
                        value={assignValidTo}
                        onChange={(e) => setAssignValidTo(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-mono text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="YYYY年MM月DD日"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setAssigningArea(null)}
                    className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmAssign}
                    className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    确认分配
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal: 收回使用权 */}
          {revokingArea && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-md overflow-hidden font-sans animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-rose-50/50">
                  <div className="flex items-center gap-2 text-rose-600">
                    <UserMinus size={18} />
                    <h3 className="font-bold text-gray-900 text-sm">收回区域使用权</h3>
                  </div>
                  <button
                    onClick={() => setRevokingArea(null)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="p-6 space-y-3">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    您确定要收回以下涂鸦区域的使用权吗？收回后该区域将重新变更为<span className="font-bold text-emerald-600">“无主空闲”</span>状态，可重新分配。
                  </p>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">区域桩号：</span>
                      <span className="font-mono font-bold text-indigo-600">{revokingArea.sectionCode}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">当前归属单位：</span>
                      <span className="font-bold text-gray-800">{revokingArea.currentOwnerOrg}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">原使用期限：</span>
                      <span className="font-mono text-gray-700">{revokingArea.validFrom} 至 {revokingArea.validTo}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setRevokingArea(null)}
                    className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmRevoke}
                    className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    确认收回
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* GRA-02: 隧道涂鸦区域申请 */}
      {activeTab === 'GRA-02' && (
        <div className="w-full space-y-5 font-sans text-gray-800">
          {/* 1. Header: 纯线条竖标 + 粗体标题（无二级标题），右侧“发起涂鸦位置申请”按钮 */}
          <div className="bg-white rounded-2xl border border-gray-100/80 shadow-sm px-6 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full mr-3 shadow-sm"></div>
              <h1 className="text-xl font-black text-gray-900 tracking-tight">
                隧道涂鸦区域申请
              </h1>
            </div>

            <button
              type="button"
              onClick={() => setShowCreateAppModal(true)}
              className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-medium px-5 py-2.5 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2 text-sm cursor-pointer"
            >
              <Plus size={16} />
              <span>发起涂鸦位置申请</span>
            </button>
          </div>

          {/* 2. 查询条件 Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/80 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* 申请单位 */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 tracking-wide">申请单位</label>
                <input
                  type="text"
                  value={searchOrg}
                  onChange={(e) => {
                    setSearchOrg(e.target.value);
                    setPendingPage(1);
                    setCompletedPage(1);
                  }}
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
                    value={searchStartDate}
                    onChange={(e) => {
                      setSearchStartDate(e.target.value);
                      setPendingPage(1);
                      setCompletedPage(1);
                    }}
                    className="bg-transparent text-xs text-gray-800 outline-none w-full cursor-pointer"
                  />
                  <span className="text-gray-400 font-medium text-xs">-</span>
                  <input
                    type="date"
                    value={searchEndDate}
                    onChange={(e) => {
                      setSearchEndDate(e.target.value);
                      setPendingPage(1);
                      setCompletedPage(1);
                    }}
                    className="bg-transparent text-xs text-gray-800 outline-none w-full cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* 查询与重置按钮 */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100/60">
              <button
                type="button"
                onClick={handleFilterSearch}
                className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold px-8 py-2.5 rounded-xl text-xs shadow-sm shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center"
              >
                <span>查询</span>
              </button>
              <button
                type="button"
                onClick={handleFilterReset}
                className="bg-gray-100/90 hover:bg-gray-200 active:scale-95 text-gray-600 font-bold px-8 py-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center"
              >
                <span>重置</span>
              </button>
            </div>
          </div>

          {/* 3. 数据列表 Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden">
            {/* Tab 标头栏 */}
            <div className="px-6 py-3.5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4 bg-white">
              {/* Segmented Tab */}
              <div className="bg-gray-100/80 p-1 rounded-xl flex items-center gap-1 border border-gray-200/50">
                <button
                  type="button"
                  onClick={() => { setAppTab('PENDING'); setPendingPage(1); }}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                    appTab === 'PENDING'
                      ? 'bg-white text-blue-600 shadow-sm border border-gray-100 font-black'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/50'
                  }`}
                >
                  <span>审批中</span>
                  <span className={`px-2 py-0.5 text-[10px] font-black rounded-full transition-colors ${
                    appTab === 'PENDING' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {filteredPendingList.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => { setAppTab('COMPLETED'); setCompletedPage(1); }}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                    appTab === 'COMPLETED'
                      ? 'bg-white text-blue-600 shadow-sm border border-gray-100 font-black'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/50'
                  }`}
                >
                  <span>已完成</span>
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                <span>共 <strong className="text-blue-600 font-bold">{appTab === 'PENDING' ? filteredPendingList.length : filteredCompletedList.length}</strong> 条记录</span>
              </div>
            </div>

            {/* 表格主体：固定第一列与最后一列，中间列横向滚动 */}
            <div className="overflow-x-auto relative">
              {appTab === 'PENDING' ? (
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-gray-50/90 text-gray-500 font-bold border-b border-gray-200/80">
                    <tr>
                      {/* 第一列固定 */}
                      <th className="sticky left-0 z-20 bg-gray-50 py-3.5 px-4 whitespace-nowrap min-w-[220px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] border-b border-gray-200/80">
                        使用位置（起止）
                      </th>
                      <th className="py-3.5 px-4 whitespace-nowrap min-w-[140px]">申请时间</th>
                      <th className="py-3.5 px-4 whitespace-nowrap min-w-[180px]">申请单位</th>
                      <th className="py-3.5 px-4 whitespace-nowrap min-w-[120px]">申请人</th>
                      <th className="py-3.5 px-4 whitespace-nowrap min-w-[150px]">审批状态</th>
                      <th className="py-3.5 px-4 whitespace-nowrap min-w-[140px]">申请使用开始时间</th>
                      <th className="py-3.5 px-4 whitespace-nowrap min-w-[140px]">申请使用结束时间</th>
                      {/* 最后一列固定 */}
                      <th className="sticky right-0 z-20 bg-gray-50 py-3.5 px-4 text-center whitespace-nowrap min-w-[140px] shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.06)] border-b border-gray-200/80">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                    {filteredPendingList.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-gray-400">
                          暂无相关审批中的申请数据
                        </td>
                      </tr>
                    ) : (
                      filteredPendingList
                        .slice((pendingPage - 1) * pageSize, pendingPage * pageSize)
                        .map((item) => (
                          <tr key={item.id} className="hover:bg-blue-50/40 transition-colors group">
                            {/* 第一列固定 */}
                            <td className="sticky left-0 z-10 bg-white group-hover:bg-blue-50/40 py-3.5 px-4 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] transition-colors font-mono font-bold text-blue-600 whitespace-nowrap">
                              {item.location}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-gray-500 whitespace-nowrap">{item.applyTime}</td>
                            <td className="py-3.5 px-4 font-bold text-gray-900 whitespace-nowrap">{item.applicantOrg}</td>
                            <td className="py-3.5 px-4 text-gray-800 whitespace-nowrap">{item.applicantName}</td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                                item.status === '待辅导员审批'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200/80'
                                  : item.status === '待单位负责人审批'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200/80'
                                  : 'bg-purple-50 text-purple-700 border border-purple-200/80'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  item.status === '待辅导员审批'
                                    ? 'bg-amber-500 animate-pulse'
                                    : item.status === '待单位负责人审批'
                                    ? 'bg-blue-500 animate-pulse'
                                    : 'bg-purple-500 animate-pulse'
                                }`} />
                                {item.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-gray-600 whitespace-nowrap">{item.usageStartDate}</td>
                            <td className="py-3.5 px-4 font-mono text-gray-600 whitespace-nowrap">{item.usageEndDate}</td>
                            {/* 最后一列固定 */}
                            <td className="sticky right-0 z-10 bg-white group-hover:bg-blue-50/40 py-3.5 px-4 text-center whitespace-nowrap shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.06)] transition-colors">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setViewingPendingItem(item)}
                                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-bold text-xs transition-all cursor-pointer"
                                >
                                  查看
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setWithdrawingItem(item)}
                                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg font-bold text-xs transition-all cursor-pointer"
                                >
                                  撤回
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-gray-50/90 text-gray-500 font-bold border-b border-gray-200/80">
                    <tr>
                      {/* 第一列固定 */}
                      <th className="sticky left-0 z-20 bg-gray-50 py-3.5 px-4 whitespace-nowrap min-w-[220px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] border-b border-gray-200/80">
                        使用位置（起止）
                      </th>
                      <th className="py-3.5 px-4 whitespace-nowrap min-w-[140px]">申请使用开始时间</th>
                      <th className="py-3.5 px-4 whitespace-nowrap min-w-[140px]">申请使用结束时间</th>
                      <th className="py-3.5 px-4 whitespace-nowrap min-w-[120px]">审批状态</th>
                      <th className="py-3.5 px-4 whitespace-nowrap min-w-[140px]">审批时间</th>
                      <th className="py-3.5 px-4 whitespace-nowrap min-w-[140px]">申请时间</th>
                      <th className="py-3.5 px-4 whitespace-nowrap min-w-[180px]">申请单位</th>
                      <th className="py-3.5 px-4 whitespace-nowrap min-w-[120px]">申请人</th>
                      {/* 最后一列固定 */}
                      <th className="sticky right-0 z-20 bg-gray-50 py-3.5 px-4 text-center whitespace-nowrap min-w-[100px] shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.06)] border-b border-gray-200/80">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                    {filteredCompletedList.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-12 text-center text-gray-400">
                          暂无相关已完成的申请数据
                        </td>
                      </tr>
                    ) : (
                      filteredCompletedList
                        .slice((completedPage - 1) * pageSize, completedPage * pageSize)
                        .map((item) => (
                          <tr key={item.id} className="hover:bg-blue-50/40 transition-colors group">
                            {/* 第一列固定 */}
                            <td className="sticky left-0 z-10 bg-white group-hover:bg-blue-50/40 py-3.5 px-4 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] transition-colors font-mono font-bold text-blue-600 whitespace-nowrap">
                              {item.location}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-gray-600 whitespace-nowrap">{item.usageStartDate}</td>
                            <td className="py-3.5 px-4 font-mono text-gray-600 whitespace-nowrap">{item.usageEndDate}</td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                                item.status === '审批通过'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200/80'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  item.status === '审批通过' ? 'bg-emerald-500' : 'bg-rose-500'
                                }`} />
                                {item.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-gray-500 whitespace-nowrap">{item.approveTime}</td>
                            <td className="py-3.5 px-4 font-mono text-gray-500 whitespace-nowrap">{item.applyTime}</td>
                            <td className="py-3.5 px-4 font-bold text-gray-900 whitespace-nowrap">{item.applicantOrg}</td>
                            <td className="py-3.5 px-4 text-gray-800 whitespace-nowrap">{item.applicantName}</td>
                            {/* 最后一列固定 */}
                            <td className="sticky right-0 z-10 bg-white group-hover:bg-blue-50/40 py-3.5 px-4 text-center whitespace-nowrap shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.06)] transition-colors">
                              <button
                                type="button"
                                onClick={() => setViewingCompletedItem(item)}
                                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-bold text-xs transition-all cursor-pointer"
                              >
                                查看
                              </button>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination Controls */}
            {(() => {
              const totalCount = appTab === 'PENDING' ? filteredPendingList.length : filteredCompletedList.length;
              const currentPage = appTab === 'PENDING' ? pendingPage : completedPage;
              const setCurrentPage = appTab === 'PENDING' ? setPendingPage : setCompletedPage;
              const totalPages = Math.ceil(totalCount / pageSize) || 1;

              return (
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3 bg-white">
                  <div className="text-xs text-gray-500 font-medium">
                    显示第 <strong className="text-gray-900 font-bold">{totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong> 到 <strong className="text-gray-900 font-bold">{Math.min(currentPage * pageSize, totalCount)}</strong> 条，共 <strong className="text-blue-600 font-bold">{totalCount}</strong> 条记录
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
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
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <span>下一页</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

          {/* Modal 1: 发起涂鸦位置申请 */}
          {showCreateAppModal && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-5xl overflow-hidden font-sans animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-50/50">
                  <div className="flex items-center gap-2 text-blue-600">
                    <FileText size={18} />
                    <h3 className="font-bold text-gray-900 text-sm">发起涂鸦位置申请</h3>
                  </div>
                  <button
                    onClick={() => setShowCreateAppModal(false)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleCreateAppSubmit} className="p-6 max-h-[85vh] overflow-y-auto font-sans">
                  {/* 两列网格布局：左侧表单 + 右侧审批流程图 */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* 左侧：表单内容 */}
                    <div className="lg:col-span-8 space-y-4">
                      {/* Row 1: 申请单位（不可编辑） */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-gray-700 block">申请单位 *</label>
                          <span className="text-[11px] text-gray-400 font-normal">(只读)</span>
                        </div>
                        <input
                          type="text"
                          readOnly
                          disabled
                          value={newAppOrg || '校学生会宣传部'}
                          className="w-full px-3.5 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 outline-none cursor-not-allowed"
                        />
                      </div>

                      {/* Row 2: 申请人姓名（不可编辑） */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-gray-700 block">申请人姓名 *</label>
                          <span className="text-[11px] text-gray-400 font-normal">(只读)</span>
                        </div>
                        <input
                          type="text"
                          readOnly
                          disabled
                          value={newAppName || '张三'}
                          className="w-full px-3.5 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 outline-none cursor-not-allowed"
                        />
                      </div>

                      {/* Row 3: 联系电话 */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 block">联系电话 *</label>
                        <input
                          type="text"
                          required
                          value={newAppPhone}
                          onChange={(e) => setNewAppPhone(e.target.value)}
                          placeholder="请输入联系电话"
                          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono text-gray-800 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                      </div>

                      {/* Row 4: 使用计划说明 */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 block">使用计划说明</label>
                        <textarea
                          rows={3}
                          value={newAppPlan}
                          onChange={(e) => setNewAppPlan(e.target.value)}
                          placeholder="请详细说明涂鸦创作的使用计划、主题构想及活动背景..."
                          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none transition-all"
                        />
                      </div>

                      {/* Row 5: 申请区域 */}
                      <div className="space-y-2 pt-2 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                            <MapPin size={14} className="text-blue-600" />
                            <span>申请区域</span>
                            <span className="text-gray-400 font-normal">({appRegionsList.length} 个)</span>
                          </label>

                          <button
                            type="button"
                            onClick={() => setShowAddLocationModal(true)}
                            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Plus size={14} />
                            <span>新增位置</span>
                          </button>
                        </div>

                        <div className="border border-gray-200/80 rounded-xl overflow-hidden bg-white shadow-2xs">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200/80">
                              <tr>
                                <th className="py-2.5 px-3">使用位置（起止）</th>
                                <th className="py-2.5 px-3">长度</th>
                                <th className="py-2.5 px-3">使用开始时间</th>
                                <th className="py-2.5 px-3">使用结束时间</th>
                                <th className="py-2.5 px-3 text-center w-16">操作</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                              {appRegionsList.length === 0 ? (
                                <tr>
                                  <td colSpan={5} className="py-6 text-center text-gray-400 text-xs">
                                    暂无选择的涂鸦位置，请点击顶部“新增位置”按钮进行选择
                                  </td>
                                </tr>
                              ) : (
                                appRegionsList.map((region) => {
                                  const matches = region.location.match(/K\d+\+(\d+(?:\.\d+)?)\s*~\s*K\d+\+(\d+(?:\.\d+)?)/);
                                  let lenStr = '9.95';
                                  if (matches && matches[1] && matches[2]) {
                                    lenStr = Math.abs(parseFloat(matches[2]) - parseFloat(matches[1])).toFixed(2);
                                  }
                                  return (
                                    <tr key={region.id} className="hover:bg-blue-50/30 transition-colors">
                                      <td className="py-2.5 px-3 font-mono font-bold text-blue-600">
                                        {region.location}
                                      </td>
                                      <td className="py-2.5 px-3 font-mono font-bold text-blue-700 whitespace-nowrap">
                                        {lenStr} 米
                                      </td>
                                      <td className="py-2.5 px-3 font-mono text-gray-600">
                                        {region.startDate}
                                      </td>
                                      <td className="py-2.5 px-3 font-mono text-gray-600">
                                        {region.endDate}
                                      </td>
                                      <td className="py-2.5 px-3 text-center">
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveRegion(region.id)}
                                          className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                                        >
                                          <Trash2 size={12} />
                                          <span>删除</span>
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    {/* 右侧：审批流程图（时间轴式） */}
                    <div className="lg:col-span-4 bg-slate-50/90 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between self-stretch shadow-2xs">
                      <div>
                        <div className="flex items-center gap-2 mb-4 pb-2.5 border-b border-slate-200/70">
                          <FileText className="text-blue-600 shrink-0" size={15} />
                          <h4 className="text-xs font-bold text-slate-900">审批流程图</h4>
                        </div>

                        {/* 时间轴容器 */}
                        <div className="relative pl-1 my-2">
                          {/* 贯穿时间轴的垂直连接线 */}
                          <div className="absolute left-[13px] top-3 bottom-3 w-0.5 bg-slate-200/90 z-0"></div>

                          <div className="space-y-4">
                            {/* 节点 1 */}
                            <div className="flex items-start gap-3 relative z-10">
                              <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0 shadow-xs shadow-blue-500/30 ring-4 ring-slate-50">
                                1
                              </div>
                              <div className="pt-0.5">
                                <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                                  <span>提交涂鸦位置申请</span>
                                </div>
                                <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">申请人填写信息并绑定涂鸦使用区域与期限</div>
                              </div>
                            </div>

                            {/* 节点 2 */}
                            <div className="flex items-start gap-3 relative z-10">
                              <div className="w-6 h-6 rounded-full bg-white border-2 border-slate-300 text-slate-600 text-[11px] font-bold flex items-center justify-center shrink-0 shadow-2xs ring-4 ring-slate-50">
                                2
                              </div>
                              <div className="pt-0.5">
                                <div className="text-xs font-bold text-slate-800">辅导员审批</div>
                                <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">审查活动真实性、意识形态与合规性</div>
                              </div>
                            </div>

                            {/* 节点 3 */}
                            <div className="flex items-start gap-3 relative z-10">
                              <div className="w-6 h-6 rounded-full bg-white border-2 border-slate-300 text-slate-600 text-[11px] font-bold flex items-center justify-center shrink-0 shadow-2xs ring-4 ring-slate-50">
                                3
                              </div>
                              <div className="pt-0.5">
                                <div className="text-xs font-bold text-slate-800">单位负责人审批</div>
                                <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">确认组织承办资质与单位盖章备案</div>
                              </div>
                            </div>

                            {/* 节点 4 */}
                            <div className="flex items-start gap-3 relative z-10">
                              <div className="w-6 h-6 rounded-full bg-white border-2 border-slate-300 text-slate-600 text-[11px] font-bold flex items-center justify-center shrink-0 shadow-2xs ring-4 ring-slate-50">
                                4
                              </div>
                              <div className="pt-0.5">
                                <div className="text-xs font-bold text-slate-800">学生会审批</div>
                                <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">涂鸦位置排期冲突核查与占用天数复核</div>
                              </div>
                            </div>

                            {/* 节点 5 */}
                            <div className="flex items-start gap-3 relative z-10">
                              <div className="w-6 h-6 rounded-full bg-white border-2 border-slate-300 text-slate-600 text-[11px] font-bold flex items-center justify-center shrink-0 shadow-2xs ring-4 ring-slate-50">
                                5
                              </div>
                              <div className="pt-0.5">
                                <div className="text-xs font-bold text-slate-800">校团委终审与发码</div>
                                <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">终审通过并生成涂鸦位置核销二维码</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 须知事项 */}
                      <div className="mt-4 p-3 bg-blue-50/90 border border-blue-100 rounded-xl text-xs text-blue-950">
                        <div className="flex items-center gap-1.5 font-bold text-blue-900 mb-1">
                          <Sparkles size={13} className="text-blue-600 shrink-0" />
                          <span>须知事项：</span>
                        </div>
                        <p className="text-[11px] text-blue-800/90 leading-relaxed">
                          审核通过后请下载专属电子二维码，并打印附于涂鸦位置现场，未贴码涂鸦将被管理员清理。
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 mt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setShowCreateAppModal(false)}
                      className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                    >
                      提交申请
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal 1.5: 新增位置 */}
          {showAddLocationModal && (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-5xl overflow-hidden font-sans animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-50/50 shrink-0">
                  <div className="flex items-center gap-2 text-blue-600">
                    <MapPin size={18} />
                    <h3 className="font-bold text-gray-900 text-sm">新增位置</h3>
                  </div>
                  <button
                    onClick={() => setShowAddLocationModal(false)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-5 font-sans">
                  {/* 第一行：使用开始时间、使用结束时间、查询可用区域按钮 */}
                  <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-gray-700 whitespace-nowrap">使用开始时间：</label>
                      <input
                        type="date"
                        value={addLocStartDate}
                        onChange={(e) => setAddLocStartDate(e.target.value)}
                        className="px-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs font-mono font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-gray-700 whitespace-nowrap">使用结束时间：</label>
                      <input
                        type="date"
                        value={addLocEndDate}
                        onChange={(e) => setAddLocEndDate(e.target.value)}
                        className="px-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs font-mono font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleQueryAvailableRegions}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Search size={14} />
                      <span>查询可用区域</span>
                    </button>
                  </div>

                  {/* 隧道图示 (一致于“路段区域管理”界面) */}
                  <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col font-sans">
                    {/* Toolbar */}
                    <div className="flex flex-col bg-white border-b border-gray-200 shrink-0 px-5 py-3 gap-3">
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="inline-flex items-center gap-1 p-1 bg-slate-100/90 rounded-xl border border-slate-200/80">
                          <button
                            type="button"
                            onClick={() => setAddLocWallSide('LEFT')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                              addLocWallSide === 'LEFT'
                                ? 'bg-white text-blue-600 shadow-xs border border-slate-200/80 font-black'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${addLocWallSide === 'LEFT' ? 'bg-blue-600' : 'bg-slate-300'}`} />
                            <span>左壁</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setAddLocWallSide('RIGHT')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                              addLocWallSide === 'RIGHT'
                                ? 'bg-white text-blue-600 shadow-xs border border-slate-200/80 font-black'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${addLocWallSide === 'RIGHT' ? 'bg-blue-600' : 'bg-slate-300'}`} />
                            <span>右壁</span>
                          </button>
                        </div>

                        <span className="text-xs text-slate-400 font-mono">
                          当前显示：芙蓉隧道 - {addLocWallSide === 'LEFT' ? '左侧墙面' : '右侧墙面'} (10cm 划分度)
                        </span>

                        <div className="flex items-center gap-2 bg-slate-100/90 px-3 py-1.5 rounded-xl border border-slate-200 ml-auto">
                          <button
                            type="button"
                            onClick={() => setAddLocZoom(s => Math.max(50, s - 10))}
                            className="p-1 text-gray-600 hover:text-blue-600 hover:bg-white rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs font-medium"
                            title="缩小"
                          >
                            <ZoomOut size={14} />
                          </button>
                          <input
                            type="range"
                            min={50}
                            max={200}
                            step={5}
                            value={addLocZoom}
                            onChange={(e) => setAddLocZoom(Number(e.target.value))}
                            className="w-24 accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                          />
                          <span className="text-xs font-mono font-bold text-blue-600 min-w-[36px] text-center">
                            {addLocZoom}%
                          </span>
                          <button
                            type="button"
                            onClick={() => setAddLocZoom(s => Math.min(200, s + 10))}
                            className="p-1 text-gray-600 hover:text-blue-600 hover:bg-white rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs font-medium"
                            title="放大"
                          >
                            <ZoomIn size={14} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Scrollable Viewport Container */}
                    <div
                      ref={addLocViewportRef}
                      onMouseDown={handleAddLocMouseDown}
                      onMouseMove={handleAddLocMouseMove}
                      onMouseUp={handleAddLocMouseUpOrLeave}
                      onMouseLeave={handleAddLocMouseUpOrLeave}
                      className={`w-full overflow-x-auto overflow-y-hidden relative bg-slate-100 p-4 border-t border-gray-100 select-none ${
                        addLocIsDragging ? 'cursor-grabbing' : 'cursor-grab'
                      } ${addLocSearching ? 'opacity-50 pointer-events-none transition-opacity' : ''}`}
                    >
                      <div
                        className="relative rounded-xl overflow-hidden border border-slate-300 shadow-inner bg-white flex flex-col"
                        style={{ width: `${totalSteps * baseStepWidth * (addLocZoom / 100)}px` }}
                      >
                        {/* Mileage Ruler Canvas */}
                        <div className="w-full bg-slate-50 border-b border-slate-200 shrink-0 sticky top-0 z-20">
                          <canvas ref={addLocCanvasRef} className="block" />
                        </div>

                        {/* Tunnel Visual Elevation Area */}
                        <div
                          className="relative w-full flex flex-col"
                          style={{ height: '340px' }}
                        >
                          {/* Tunnel Roof */}
                          <div className="h-[45px] w-full bg-gradient-to-b from-slate-300 via-slate-200 to-slate-100 border-b border-slate-300/80 relative flex items-center overflow-hidden shrink-0">
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-200/60 via-transparent to-transparent pointer-events-none" />
                            {Array.from({ length: Math.floor(totalMeters / 5) + 1 }).map((_, idx) => (
                              <div
                                key={idx}
                                className="absolute top-0 bottom-0 flex flex-col items-center justify-between"
                                style={{ left: `${idx * 50 * baseStepWidth * (addLocZoom / 100)}px` }}
                              >
                                <div className="w-1.5 h-full bg-slate-400/40 border-x border-slate-300/60" />
                                <div className="absolute top-2 -translate-x-1/2 left-1/2 w-4 h-2 bg-amber-200 border border-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                              </div>
                            ))}
                            <div className="absolute left-4 top-2 text-[10px] font-mono text-slate-500 font-semibold bg-slate-200/80 px-2 py-0.5 rounded border border-slate-300">
                              芙蓉隧道 {addLocWallSide === 'LEFT' ? '左壁' : '右壁'} - 拱顶视角 (按住鼠标可左右拖动)
                            </div>
                          </div>

                          {/* Main Wall Grid Area */}
                          <div
                            className="flex-1 w-full relative"
                            style={{
                              backgroundColor: '#f8fafc',
                              backgroundImage: `
                                repeating-linear-gradient(
                                  to right,
                                  #94a3b8 0px,
                                  #94a3b8 1.5px,
                                  transparent 1.5px,
                                  transparent ${baseStepWidth * (addLocZoom / 100) * 10}px
                                ),
                                repeating-linear-gradient(
                                  to right,
                                  #e2e8f0 0px,
                                  #e2e8f0 1px,
                                  transparent 1px,
                                  transparent ${baseStepWidth * (addLocZoom / 100)}px
                                )
                              `
                            }}
                          >
                            {wallAreas
                              .filter(area => area.side === addLocWallSide)
                              .map((area) => {
                                const addLocStepWidth = baseStepWidth * (addLocZoom / 100);
                                const leftPx = area.startM * 10 * addLocStepWidth;
                                const lengthM = area.endM - area.startM;
                                const widthPx = lengthM * 10 * addLocStepWidth;

                                return (
                                  <div
                                    key={area.id}
                                    className="absolute top-3 bottom-3 rounded-xl border p-3 flex flex-col justify-between transition-all shadow-sm hover:shadow-md"
                                    style={{
                                      left: `${leftPx}px`,
                                      width: `${widthPx}px`,
                                      backgroundColor: area.status === 'OCCUPIED' ? 'rgba(238, 242, 255, 0.95)' : area.status === 'PENDING_RESERVATION' ? 'rgba(254, 243, 199, 0.95)' : 'rgba(236, 253, 245, 0.95)',
                                      borderColor: area.status === 'OCCUPIED' ? '#c7d2fe' : area.status === 'PENDING_RESERVATION' ? '#fcd34d' : '#a7f3d0'
                                    }}
                                  >
                                    <div className="flex items-center justify-between gap-2">
                                      <span className="font-mono font-bold text-xs bg-white text-blue-700 px-2.5 py-1 rounded-md border border-blue-200 shadow-2xs truncate">
                                        {area.sectionCode}
                                      </span>
                                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                                        area.status === 'OCCUPIED' ? 'bg-indigo-100 text-indigo-700' : area.status === 'PENDING_RESERVATION' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-700'
                                      }`}>
                                        {area.status === 'OCCUPIED' ? '已有归属' : area.status === 'PENDING_RESERVATION' ? '申请占位中' : '可申请'}
                                      </span>
                                    </div>

                                    {/* Action Button */}
                                    <div className="my-auto py-1 flex justify-center">
                                      {area.status === 'AVAILABLE' ? (
                                        <button
                                          type="button"
                                          onClick={() => handleOpenSizeSetting(area)}
                                          className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                                        >
                                          <UserCheck size={14} />
                                          <span>申请使用权</span>
                                        </button>
                                      ) : area.status === 'PENDING_RESERVATION' ? (
                                        <span className="text-xs text-amber-700 font-bold py-1 flex items-center gap-1">
                                          <Clock size={12} />
                                          <span>申请占位中</span>
                                        </span>
                                      ) : (
                                        <span className="text-xs text-indigo-400 font-bold py-1">
                                          归属：{area.currentOwnerOrg}
                                        </span>
                                      )}
                                    </div>

                                    {/* Card Info */}
                                    <div className="space-y-1 text-xs text-gray-700 bg-white/90 p-2 rounded-lg border border-gray-100 shadow-2xs">
                                      <p className="font-bold text-gray-900 truncate">
                                        {area.status === 'OCCUPIED' ? `归属：${area.currentOwnerOrg}` : area.status === 'PENDING_RESERVATION' ? '申请占位中' : '可申请使用权'}
                                      </p>
                                      <p className="text-[11px] font-mono text-gray-600">
                                        长度：{lengthM.toFixed(2)} m ({Math.round(lengthM * 100)} cm)
                                      </p>
                                      <p className="text-[11px] text-blue-600 font-medium">
                                        使用期限：{addLocStartDate} 至 {addLocEndDate}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>

                          {/* Sidewalk & Floor */}
                          <div className="h-[40px] w-full bg-slate-700 border-t-2 border-slate-500 relative flex flex-col justify-between shrink-0 overflow-hidden">
                            <div
                              className="h-2 w-full border-b border-slate-600"
                              style={{
                                backgroundImage: 'repeating-linear-gradient(45deg, #f59e0b, #f59e0b 10px, #1e293b 10px, #1e293b 20px)'
                              }}
                            />
                            <div className="flex-1 bg-slate-800 flex items-center justify-center relative">
                              <span className="text-[10px] font-mono text-slate-400 font-medium">
                                芙蓉隧道-{addLocWallSide === 'LEFT' ? '左壁' : '右壁'} 侧步道与车道基底 (按住拖拽左右查看)
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer with Selection Info & Confirm Button */}
                <div className="flex items-center justify-between px-6 py-3.5 bg-gray-50 border-t border-gray-200 shrink-0 gap-4">
                  <div className="flex items-center gap-2 text-xs bg-blue-50/80 border border-blue-200/80 text-blue-900 px-3.5 py-2 rounded-xl flex-1 max-w-3xl overflow-hidden shadow-2xs">
                    <MapPin size={15} className="text-blue-600 shrink-0" />
                    <span className="font-bold shrink-0">已选择：</span>
                    <span className="font-mono text-blue-700 font-semibold truncate">
                      {appRegionsList.length > 0
                        ? appRegionsList.map(r => r.location).join('； ')
                        : '暂未选择位置'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAddLocationModal(false)}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <Check size={16} />
                    <span>确认位置</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal 1.6: 申请区域大小设置 */}
          {showSizeSettingModal && targetAreaForSetting && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[60] flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-md overflow-hidden font-sans animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-50/50">
                  <div className="flex items-center gap-2 text-blue-600">
                    <Sliders size={18} />
                    <h3 className="font-bold text-gray-900 text-sm">申请区域大小设置</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSizeSettingModal(false)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="p-6 space-y-5">
                  <div className="bg-blue-50/60 border border-blue-100 p-3.5 rounded-xl text-xs space-y-1 font-sans">
                    <p className="text-gray-600">目标大区：<span className="font-mono font-bold text-blue-700">{targetAreaForSetting.sectionCode}</span></p>
                    <p className="text-gray-600">最大可用长度：<span className="font-mono font-bold text-gray-800">{(targetAreaForSetting.endM - targetAreaForSetting.startM).toFixed(2)} 米</span></p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-700">申请区域长度 (米)</label>
                      <span className="text-sm font-mono font-black text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                        {reqRegionLength.toFixed(1)} 米
                      </span>
                    </div>

                    <div className="space-y-1">
                      <input
                        type="range"
                        min={2}
                        max={5}
                        step={0.5}
                        value={reqRegionLength}
                        onChange={(e) => setReqRegionLength(Number(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                      />
                      <div className="flex justify-between text-[11px] font-mono text-gray-400 px-0.5">
                        <span>2.0 米 (最小)</span>
                        <span>3.5 米</span>
                        <span>5.0 米 (最大)</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200/70 p-3 rounded-xl text-xs text-amber-800">
                    <p className="font-medium">
                      确认后，原图中从起点起 <span className="font-mono font-bold">{reqRegionLength.toFixed(1)}m</span> 的区域将标识为 <span className="font-bold underline">申请占位中</span>，并自动添加到申请区域列表中。
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowSizeSettingModal(false)}
                      className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                    >
                      取消
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveSizeSetting}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                    >
                      保存
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal: 查看涂鸦位置申请详情 (审批中 / 已完成) */}
          {(viewingPendingItem || viewingCompletedItem) && (() => {
            const item = viewingPendingItem || viewingCompletedItem;
            if (!item) return null;
            const isPending = !!viewingPendingItem;
            const closeDetailModal = () => {
              setViewingPendingItem(null);
              setViewingCompletedItem(null);
            };

            const statusStr = item.status || '';

            let step2State: 'passed' | 'active' | 'pending' = 'pending';
            let step3State: 'passed' | 'active' | 'pending' = 'pending';
            let step4State: 'passed' | 'active' | 'pending' = 'pending';
            let step5State: 'passed' | 'active' | 'pending' | 'rejected' = 'pending';

            if (statusStr === '待辅导员审批') {
              step2State = 'active';
            } else if (statusStr === '待单位负责人审批') {
              step2State = 'passed';
              step3State = 'active';
            } else if (statusStr === '待团委审批') {
              step2State = 'passed';
              step3State = 'passed';
              step4State = 'active';
            } else if (statusStr === '审批通过') {
              step2State = 'passed';
              step3State = 'passed';
              step4State = 'passed';
              step5State = 'passed';
            } else if (statusStr === '已驳回') {
              step2State = 'passed';
              step3State = 'passed';
              step4State = 'passed';
              step5State = 'rejected';
            }

            return (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-5xl overflow-hidden font-sans animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-50/50 shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                        <Eye size={20} />
                      </div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900 text-base">涂鸦位置申请详情</h3>
                        <span className={`px-3 py-0.5 rounded-full text-xs font-bold ${
                          statusStr === '审批通过'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : statusStr === '已驳回'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {statusStr}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={closeDetailModal}
                      className="p-1.5 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Body: Left Form Fields + Right Approval Process */}
                  <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white font-sans">
                    {/* Left Column: Form Info (Matching 发起涂鸦位置申请) */}
                    <div className="lg:col-span-7 space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-gray-500 block">申请单位 (只读)</label>
                          <div className="px-3.5 py-2.5 bg-gray-100/70 border border-gray-200/80 rounded-xl text-xs font-bold text-gray-800 truncate">
                            {item.applicantOrg}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-gray-500 block">申请人 (只读)</label>
                          <div className="px-3.5 py-2.5 bg-gray-100/70 border border-gray-200/80 rounded-xl text-xs font-bold text-gray-800 truncate">
                            {item.applicantName}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-gray-500 block">联系电话 (只读)</label>
                          <div className="px-3.5 py-2.5 bg-gray-100/70 border border-gray-200/80 rounded-xl text-xs font-mono font-bold text-gray-800 truncate">
                            {'contactPhone' in item && item.contactPhone ? item.contactPhone : '13859200888'}
                          </div>
                        </div>
                      </div>

                      {/* 使用计划说明 (只读) */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-gray-500 block">使用计划说明 (只读)</label>
                        <div className="p-3.5 bg-gray-100/70 border border-gray-200/80 rounded-xl text-xs text-gray-700 leading-relaxed font-normal min-h-[90px]">
                          {'usagePlan' in item && item.usagePlan
                            ? item.usagePlan
                            : '关于开展“芙蓉隧道涂鸦艺术提升展”校园文化宣传工作的申请。宣传内容积极健康，遵循校园宣传阵地管理规范，负责后期墙面维护与退场清理。'}
                        </div>
                      </div>

                      {/* 申请位置和时间 (只读) */}
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                            <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
                            <span>申请位置和时间</span>
                          </div>
                          <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 font-bold rounded-full text-[11px]">
                            共 1 处申请位置
                          </span>
                        </div>

                        <div className="border border-gray-200/80 rounded-xl p-3.5 bg-gray-50/50 space-y-2.5">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-1 bg-blue-100 text-blue-800 font-bold rounded-lg text-xs">
                                思明校区
                              </span>
                              <span className="font-mono font-bold text-xs text-gray-900">
                                芙蓉隧道 {item.location}
                              </span>
                            </div>
                            <div className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-bold rounded-lg text-xs flex items-center gap-1.5">
                              <Clock size={13} />
                              <span>{item.usageStartDate} 至 {item.usageEndDate}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Approval Timeline (过程记录) */}
                    <div className="lg:col-span-5 bg-slate-50/80 border border-gray-200/80 rounded-2xl p-4 space-y-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between pb-3 border-b border-gray-200/80">
                          <div className="flex items-center gap-2 font-bold text-gray-900 text-xs">
                            <Clock size={15} className="text-blue-600" />
                            <span>过程记录</span>
                          </div>
                          <span className="px-2.5 py-0.5 bg-white border border-gray-200 text-gray-500 font-bold text-[10px] rounded-md shadow-2xs">
                            时序追踪
                          </span>
                        </div>

                        {/* Timeline list */}
                        <div className="relative pl-6 space-y-4 pt-3 border-l-2 border-gray-200 ml-3">
                          {/* Step 1 */}
                          <div className="relative">
                            <span className="absolute -left-[31px] top-0.5 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[11px] shadow-xs">
                              <Check size={13} />
                            </span>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs text-gray-900">提交涂鸦位置申请</span>
                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-md">已通过</span>
                              </div>
                              <p className="text-[11px] text-gray-500">{item.applicantName} ({item.applicantOrg})</p>
                              <p className="text-[10px] font-mono text-gray-400">{item.applyTime}</p>
                              <div className="bg-white border border-gray-200/70 p-2 rounded-xl text-[11px] text-gray-600">
                                已提交涂鸦位置申请及计划，等待辅导员审核。
                              </div>
                            </div>
                          </div>

                          {/* Step 2 */}
                          <div className="relative">
                            <span className={`absolute -left-[31px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                              step2State === 'passed' ? 'bg-emerald-500 text-white' : step2State === 'active' ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 'bg-gray-200 text-gray-500'
                            }`}>
                              {step2State === 'passed' ? <Check size={13} /> : '2'}
                            </span>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs text-gray-900">辅导员审批</span>
                                <span className={`px-2 py-0.5 font-bold text-[10px] rounded-md ${
                                  step2State === 'passed' ? 'bg-emerald-100 text-emerald-800' : step2State === 'active' ? 'bg-blue-100 text-blue-800 animate-pulse' : 'bg-gray-100 text-gray-500'
                                }`}>
                                  {step2State === 'passed' ? '已通过' : step2State === 'active' ? '审批中' : '待处理'}
                                </span>
                              </div>
                              <p className="text-[11px] text-gray-500">辅导员 · 张明远老师</p>
                              {step2State === 'passed' && <p className="text-[10px] font-mono text-gray-400">{item.applyTime} 15:10</p>}
                              <div className="bg-white border border-gray-200/70 p-2 rounded-xl text-[11px] text-gray-600">
                                {step2State === 'passed' ? '活动内容审核真实合法，主题符合校园规范。' : step2State === 'active' ? '辅导员正在审查活动真实性与合规性...' : '等待前置环节完成'}
                              </div>
                            </div>
                          </div>

                          {/* Step 3 */}
                          <div className="relative">
                            <span className={`absolute -left-[31px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                              step3State === 'passed' ? 'bg-emerald-500 text-white' : step3State === 'active' ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 'bg-gray-200 text-gray-500'
                            }`}>
                              {step3State === 'passed' ? <Check size={13} /> : '3'}
                            </span>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs text-gray-900">单位负责人审批</span>
                                <span className={`px-2 py-0.5 font-bold text-[10px] rounded-md ${
                                  step3State === 'passed' ? 'bg-emerald-100 text-emerald-800' : step3State === 'active' ? 'bg-blue-100 text-blue-800 animate-pulse' : 'bg-gray-100 text-gray-500'
                                }`}>
                                  {step3State === 'passed' ? '已通过' : step3State === 'active' ? '审批中' : '待处理'}
                                </span>
                              </div>
                              <p className="text-[11px] text-gray-500">单位负责人 · 李建国 书记</p>
                              {step3State === 'passed' && <p className="text-[10px] font-mono text-gray-400">{item.applyTime} 16:30</p>}
                              <div className="bg-white border border-gray-200/70 p-2 rounded-xl text-[11px] text-gray-600">
                                {step3State === 'passed' ? '单位审核同意，报送校团委排期。' : step3State === 'active' ? '正在进行单位负责人审批...' : '等待前置环节完成'}
                              </div>
                            </div>
                          </div>

                          {/* Step 4 */}
                          <div className="relative">
                            <span className={`absolute -left-[31px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                              step4State === 'passed' ? 'bg-emerald-500 text-white' : step4State === 'active' ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 'bg-gray-200 text-gray-500'
                            }`}>
                              {step4State === 'passed' ? <Check size={13} /> : '4'}
                            </span>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs text-gray-900">学生会排期复核</span>
                                <span className={`px-2 py-0.5 font-bold text-[10px] rounded-md ${
                                  step4State === 'passed' ? 'bg-emerald-100 text-emerald-800' : step4State === 'active' ? 'bg-blue-100 text-blue-800 animate-pulse' : 'bg-gray-100 text-gray-500'
                                }`}>
                                  {step4State === 'passed' ? '已通过' : step4State === 'active' ? '审批中' : '待处理'}
                                </span>
                              </div>
                              <p className="text-[11px] text-gray-500">学生会涂鸦管理组 · 王思齐</p>
                              <div className="bg-white border border-gray-200/70 p-2 rounded-xl text-[11px] text-gray-600">
                                {step4State === 'passed' ? '墙面对应时段无排期重叠。' : step4State === 'active' ? '正在复核墙面排期冲突...' : '等待前置环节完成'}
                              </div>
                            </div>
                          </div>

                          {/* Step 5 */}
                          <div className="relative">
                            <span className={`absolute -left-[31px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                              step5State === 'passed' ? 'bg-emerald-500 text-white' : step5State === 'rejected' ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-500'
                            }`}>
                              {step5State === 'passed' ? <Check size={13} /> : step5State === 'rejected' ? <X size={13} /> : '5'}
                            </span>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs text-gray-900">校团委终审与发码</span>
                                <span className={`px-2 py-0.5 font-bold text-[10px] rounded-md ${
                                  step5State === 'passed' ? 'bg-emerald-100 text-emerald-800' : step5State === 'rejected' ? 'bg-rose-100 text-rose-800' : 'bg-gray-100 text-gray-500'
                                }`}>
                                  {step5State === 'passed' ? '已通过' : step5State === 'rejected' ? '已驳回' : '待处理'}
                                </span>
                              </div>
                              <p className="text-[11px] text-gray-500">校团委团宣传部 · 刘老师</p>
                              {(step5State === 'passed' || step5State === 'rejected') && (
                                <p className="text-[10px] font-mono text-gray-400">{'approveTime' in item ? item.approveTime : item.applyTime}</p>
                              )}
                              <div className="bg-white border border-gray-200/70 p-2 rounded-xl text-[11px] text-gray-600">
                                {step5State === 'passed' ? '终审通过，已准予进场涂鸦创作。' : step5State === 'rejected' ? '申请驳回：' + ('approveComment' in item && item.approveComment ? item.approveComment : '活动申请不符合阶段安排。') : '等待前置环节完成'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between px-6 py-3.5 bg-gray-50 border-t border-gray-100 shrink-0">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-gray-500 font-medium">当前流程状态：</span>
                      <span className={`px-3 py-1 rounded-full font-bold text-xs ${
                        statusStr === '审批通过'
                          ? 'bg-emerald-100 text-emerald-800'
                          : statusStr === '已驳回'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {statusStr}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {isPending && (
                        <button
                          type="button"
                          onClick={() => {
                            setWithdrawingItem(viewingPendingItem);
                            setViewingPendingItem(null);
                          }}
                          className="px-5 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <RotateCcw size={14} />
                          <span>撤回申请</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={closeDetailModal}
                        className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs rounded-xl transition-all cursor-pointer"
                      >
                        关闭
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Modal 4: 撤回确认 */}
          {withdrawingItem && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-md overflow-hidden font-sans animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-rose-50/50">
                  <div className="flex items-center gap-2 text-rose-600">
                    <Undo2 size={18} />
                    <h3 className="font-bold text-gray-900 text-sm">撤回涂鸦位置申请</h3>
                  </div>
                  <button
                    onClick={() => setWithdrawingItem(null)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="p-6 space-y-3">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    您确定要撤回以下申请吗？撤回后该申请将从审批流程中移除。
                  </p>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">申请位置：</span>
                      <span className="font-mono font-bold text-indigo-600">{withdrawingItem.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">申请单位：</span>
                      <span className="font-bold text-gray-800">{withdrawingItem.applicantOrg}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">当前阶段：</span>
                      <span className="font-bold text-amber-600">{withdrawingItem.status}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setWithdrawingItem(null)}
                    className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmWithdraw}
                    className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    确认撤回
                  </button>
                </div>
              </div>
            </div>
          )}

      {/* GRA-06: 隧道涂鸦内容报批 */}
      {activeTab === 'GRA-06' && (
        <div className="space-y-6">
          {/* 1. Header: 纯线条竖标 + 粗体标题（无二级标题），最右侧添加“发起涂鸦内容报批申请”按钮 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full mr-3 shadow-sm"></div>
              <h1 className="text-xl font-black text-gray-900 tracking-tight">
                隧道涂鸦内容报批
              </h1>
            </div>
            <button
              type="button"
              onClick={() => setShowCreateContentModal(true)}
              className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-sm shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus size={16} />
              <span>发起涂鸦内容报批申请</span>
            </button>
          </div>

          {/* 2. 查询条件 Card (1:1 样式对齐海报张贴申请: 标题在上，输入框在下) */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/80 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* 涂鸦主题 */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 tracking-wide">涂鸦主题</label>
                <input
                  type="text"
                  value={contentSearchTheme}
                  onChange={(e) => { setContentSearchTheme(e.target.value); setContentPendingPage(1); setContentCompletedPage(1); }}
                  placeholder="请输入涂鸦主题..."
                  className="w-full bg-gray-50/80 border border-gray-200/60 rounded-xl px-4 py-2.5 text-xs text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>

              {/* 申请单位 */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 tracking-wide">申请单位</label>
                <select
                  value={contentSearchOrg}
                  onChange={(e) => { setContentSearchOrg(e.target.value); setContentPendingPage(1); setContentCompletedPage(1); }}
                  className="w-full bg-gray-50/80 border border-gray-200/60 rounded-xl px-4 py-2.5 text-xs text-gray-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                >
                  <option value="全部单位">全部单位</option>
                  <option value="艺术学院青年志愿者协会">艺术学院青年志愿者协会</option>
                  <option value="海洋与地球学院团党委">海洋与地球学院团党委</option>
                  <option value="计算机科学与技术系">计算机科学与技术系</option>
                  <option value="校学生会宣传部">校学生会宣传部</option>
                  <option value="环境与生态学院社团">环境与生态学院社团</option>
                  <option value="人文学院文学社">人文学院文学社</option>
                  <option value="户外攀岩与越野协会">户外攀岩与越野协会</option>
                  <option value="交响乐团学生分部">交响乐团学生分部</option>
                  <option value="医学院青年志愿者服务队">医学院青年志愿者服务队</option>
                </select>
              </div>

              {/* 申请时间 */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 tracking-wide">申请时间</label>
                <div className="flex items-center gap-1.5 bg-gray-50/80 border border-gray-200/60 rounded-xl px-3 py-1.5">
                  <input
                    type="date"
                    value={contentSearchStartDate}
                    onChange={(e) => { setContentSearchStartDate(e.target.value); setContentPendingPage(1); setContentCompletedPage(1); }}
                    className="bg-transparent text-xs text-gray-800 outline-none w-full cursor-pointer"
                  />
                  <span className="text-gray-400 font-medium text-xs">-</span>
                  <input
                    type="date"
                    value={contentSearchEndDate}
                    onChange={(e) => { setContentSearchEndDate(e.target.value); setContentPendingPage(1); setContentCompletedPage(1); }}
                    className="bg-transparent text-xs text-gray-800 outline-none w-full cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* 底部分隔与查询/重置按钮（1:1 对齐海报张贴申请） */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100/60">
              <button
                type="button"
                onClick={() => {}}
                className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold px-8 py-2.5 rounded-xl text-xs shadow-sm shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center"
              >
                <span>查询</span>
              </button>
              <button
                type="button"
                onClick={handleContentFilterReset}
                className="bg-gray-100/90 hover:bg-gray-200 active:scale-95 text-gray-600 font-bold px-8 py-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center"
              >
                <span>重置</span>
              </button>
            </div>
          </div>

          {/* 3. 数据列表 Card (包含 2 个 Tab 与数据表格，1:1 对齐海报张贴申请样式) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden">
            {/* Tab 标头栏 */}
            <div className="px-6 py-3.5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
              {/* Segmented Tab */}
              <div className="bg-gray-100/80 p-1 rounded-xl flex items-center gap-1 border border-gray-200/50">
                <button
                  type="button"
                  onClick={() => { setContentTab('PENDING'); setContentPendingPage(1); }}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                    contentTab === 'PENDING'
                      ? 'bg-white text-blue-600 shadow-sm border border-gray-100 font-black'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/50'
                  }`}
                >
                  <span>待审批</span>
                  <span className={`px-2 py-0.5 text-[10px] font-black rounded-full transition-colors ${
                    contentTab === 'PENDING' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {filteredContentPendingList.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => { setContentTab('COMPLETED'); setContentCompletedPage(1); }}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                    contentTab === 'COMPLETED'
                      ? 'bg-white text-blue-600 shadow-sm border border-gray-100 font-black'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/50'
                  }`}
                >
                  <span>已审批</span>
                  {/* 已审批的不要显示角标 */}
                </button>
              </div>

              {/* 右侧记录统计与翻页 */}
              {contentTab === 'PENDING' ? (
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    显示 <strong className="text-gray-900 font-bold">{filteredContentPendingList.length > 0 ? (contentPendingPage - 1) * contentPageSize + 1 : 0}</strong> 到 <strong className="text-gray-900 font-bold">{Math.min(contentPendingPage * contentPageSize, filteredContentPendingList.length)}</strong>，共 <strong className="text-blue-600 font-bold">{filteredContentPendingList.length}</strong> 条记录
                  </span>
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      type="button"
                      disabled={contentPendingPage === 1}
                      onClick={() => setContentPendingPage(p => Math.max(1, p - 1))}
                      className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:text-gray-300 disabled:bg-gray-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      type="button"
                      disabled={contentPendingPage >= Math.ceil(filteredContentPendingList.length / contentPageSize)}
                      onClick={() => setContentPendingPage(p => p + 1)}
                      className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:text-gray-300 disabled:bg-gray-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    显示 <strong className="text-gray-900 font-bold">{filteredContentCompletedList.length > 0 ? (contentCompletedPage - 1) * contentPageSize + 1 : 0}</strong> 到 <strong className="text-gray-900 font-bold">{Math.min(contentCompletedPage * contentPageSize, filteredContentCompletedList.length)}</strong>，共 <strong className="text-blue-600 font-bold">{filteredContentCompletedList.length}</strong> 条记录
                  </span>
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      type="button"
                      disabled={contentCompletedPage === 1}
                      onClick={() => setContentCompletedPage(p => Math.max(1, p - 1))}
                      className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:text-gray-300 disabled:bg-gray-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      type="button"
                      disabled={contentCompletedPage >= Math.ceil(filteredContentCompletedList.length / contentPageSize)}
                      onClick={() => setContentCompletedPage(p => p + 1)}
                      className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:text-gray-300 disabled:bg-gray-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 表格内容区域 - 第一列和最后一列固定 */}
            <div className="overflow-x-auto relative">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-gray-50/90 text-gray-500 font-bold border-b border-gray-100">
                  {contentTab === 'PENDING' ? (
                    <tr>
                      <th className="py-4 px-4 whitespace-nowrap sticky left-0 z-20 bg-gray-50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] min-w-[80px]">草图/稿样</th>
                      <th className="py-4 px-4 whitespace-nowrap min-w-[160px]">主题</th>
                      <th className="py-4 px-4 whitespace-nowrap min-w-[220px]">涂鸦位置（起止）</th>
                      <th className="py-4 px-4 whitespace-nowrap min-w-[140px]">申请时间</th>
                      <th className="py-4 px-4 whitespace-nowrap min-w-[160px]">申请单位</th>
                      <th className="py-4 px-4 whitespace-nowrap min-w-[100px]">申请人</th>
                      <th className="py-4 px-4 whitespace-nowrap min-w-[130px]">审批状态</th>
                      <th className="py-4 px-4 whitespace-nowrap text-center sticky right-0 z-20 bg-gray-50 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.06)] min-w-[140px]">操作</th>
                    </tr>
                  ) : (
                    <tr>
                      <th className="py-4 px-4 whitespace-nowrap sticky left-0 z-20 bg-gray-50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] min-w-[80px]">草图/稿样</th>
                      <th className="py-4 px-4 whitespace-nowrap min-w-[160px]">主题</th>
                      <th className="py-4 px-4 whitespace-nowrap min-w-[220px]">涂鸦位置（起止）</th>
                      <th className="py-4 px-4 whitespace-nowrap min-w-[120px]">审批状态</th>
                      <th className="py-4 px-4 whitespace-nowrap min-w-[140px]">审批时间</th>
                      <th className="py-4 px-4 whitespace-nowrap min-w-[140px]">申请时间</th>
                      <th className="py-4 px-4 whitespace-nowrap min-w-[160px]">申请单位</th>
                      <th className="py-4 px-4 whitespace-nowrap min-w-[100px]">申请人</th>
                      <th className="py-4 px-4 whitespace-nowrap text-center sticky right-0 z-20 bg-gray-50 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.06)] min-w-[100px]">操作</th>
                    </tr>
                  )}
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {contentTab === 'PENDING' ? (
                    paginatedContentPendingList.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-gray-400">
                          暂无待审批的记录
                        </td>
                      </tr>
                    ) : (
                      paginatedContentPendingList.map(item => (
                        <tr key={item.id} className="hover:bg-gray-50/60 transition-colors group">
                          <td className="py-3 px-4 sticky left-0 z-10 bg-white group-hover:bg-gray-50/60 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">
                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 shrink-0 bg-gray-100">
                              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                          </td>
                          <td className="py-3 px-4 font-bold text-gray-900 text-sm">
                            {item.title}
                          </td>
                          <td className="py-3 px-4 font-mono text-gray-600">
                            {item.location}
                          </td>
                          <td className="py-3 px-4 text-gray-500 font-medium whitespace-nowrap">
                            {item.applyTime}
                          </td>
                          <td className="py-3 px-4 font-medium text-gray-800 whitespace-nowrap">
                            {item.applicantOrg}
                          </td>
                          <td className="py-3 px-4 font-medium whitespace-nowrap">
                            {item.applicantName}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/80 inline-flex items-center gap-1">
                              <Clock size={12} className="text-amber-600" />
                              <span>{item.status}</span>
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center whitespace-nowrap sticky right-0 z-10 bg-white group-hover:bg-gray-50/60 transition-colors shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.06)]">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => setViewingContentItem(item)}
                                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-bold text-xs transition-all cursor-pointer"
                              >
                                查看
                              </button>
                              <button
                                type="button"
                                onClick={() => setWithdrawingContentItem(item)}
                                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg font-bold text-xs transition-all cursor-pointer"
                              >
                                撤回
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )
                  ) : (
                    paginatedContentCompletedList.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-12 text-center text-gray-400">
                          暂无已审批的记录
                        </td>
                      </tr>
                    ) : (
                      paginatedContentCompletedList.map(item => (
                        <tr key={item.id} className="hover:bg-gray-50/60 transition-colors group">
                          <td className="py-3 px-4 sticky left-0 z-10 bg-white group-hover:bg-gray-50/60 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">
                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 shrink-0 bg-gray-100">
                              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                          </td>
                          <td className="py-3 px-4 font-bold text-gray-900 text-sm">
                            {item.title}
                          </td>
                          <td className="py-3 px-4 font-mono text-gray-600">
                            {item.location}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border inline-flex items-center gap-1 ${
                              item.status === '审批通过'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}>
                              {item.status === '审批通过' ? (
                                <CheckCircle size={12} className="text-emerald-600" />
                              ) : (
                                <XCircle size={12} className="text-rose-600" />
                              )}
                              <span>{item.status}</span>
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-500 font-medium whitespace-nowrap">
                            {item.approveTime}
                          </td>
                          <td className="py-3 px-4 text-gray-500 font-medium whitespace-nowrap">
                            {item.applyTime}
                          </td>
                          <td className="py-3 px-4 font-medium text-gray-800 whitespace-nowrap">
                            {item.applicantOrg}
                          </td>
                          <td className="py-3 px-4 font-medium whitespace-nowrap">
                            {item.applicantName}
                          </td>
                          <td className="py-3 px-4 text-center whitespace-nowrap sticky right-0 z-10 bg-white group-hover:bg-gray-50/60 transition-colors shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.06)]">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => setViewingContentItem(item)}
                                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-bold text-xs transition-all cursor-pointer"
                              >
                                查看
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom Pagination Controls */}
            {(() => {
              const totalCount = contentTab === 'PENDING' ? filteredContentPendingList.length : filteredContentCompletedList.length;
              const currentPage = contentTab === 'PENDING' ? contentPendingPage : contentCompletedPage;
              const setCurrentPage = contentTab === 'PENDING' ? setContentPendingPage : setContentCompletedPage;
              const totalPages = Math.ceil(totalCount / contentPageSize) || 1;

              return (
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3 bg-white">
                  <div className="text-xs text-gray-500 font-medium">
                    显示第 <strong className="text-gray-900 font-bold">{totalCount === 0 ? 0 : (currentPage - 1) * contentPageSize + 1}</strong> 到 <strong className="text-gray-900 font-bold">{Math.min(currentPage * contentPageSize, totalCount)}</strong> 条，共 <strong className="text-blue-600 font-bold">{totalCount}</strong> 条记录
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
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
                            type="button"
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
                      type="button"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <span>下一页</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* GRA-06 发起涂鸦内容报批申请 Modal */}
      {showCreateContentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-2">
                <Palette className="text-blue-600" size={18} />
                <h3 className="text-sm font-bold text-gray-900">涂鸦内容报批申请</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateContentModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body: 表单（左侧） + 审批流程（右侧，缩小宽度并展示时间轴图） */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* 左侧：表单（遵循一行一个字段规范） */}
                <div className="lg:col-span-8 space-y-4">
                  {/* 字段 1: 涂鸦主题（下拉选择） */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                      <span>涂鸦主题</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={newContentTitle}
                      onChange={(e) => setNewContentTitle(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer font-medium"
                    >
                      <option value="凤凰花开的季节">凤凰花开的季节</option>
                      <option value="海浪与星辰·艺术季">海浪与星辰·艺术季</option>
                      <option value="科技与未来·创客前沿">科技与未来·创客前沿</option>
                      <option value="生态厦门·绿色家园">生态厦门·绿色家园</option>
                      <option value="青春无悔·毕业留念">青春无悔·毕业留念</option>
                      <option value="嘉庚精神·百年传承">嘉庚精神·百年传承</option>
                      <option value="漫绘青春·动漫文化展示">漫绘青春·动漫文化展示</option>
                    </select>
                  </div>

                  {/* 字段 2: 涂鸦草图/稿样 */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                      <span>涂鸦草图/稿样</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <div className="border border-dashed border-gray-300 bg-gray-50/70 hover:bg-gray-50 rounded-xl p-4 flex flex-col items-center justify-center transition-all">
                      {newContentImageUrl ? (
                        <div className="flex flex-col items-center justify-center gap-2.5 w-full">
                          <div className="relative group w-full max-w-md h-36 rounded-xl overflow-hidden border border-gray-200 shadow-2xs bg-gray-100">
                            <img src={newContentImageUrl} alt="草图预览" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-white text-xs font-bold bg-black/60 px-3 py-1.5 rounded-lg backdrop-blur-xs">稿样草图已选择</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const imgs = [
                                'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400',
                                'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400',
                                'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400',
                                'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400'
                              ];
                              const next = imgs[(imgs.indexOf(newContentImageUrl) + 1) % imgs.length];
                              setNewContentImageUrl(next);
                            }}
                            className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Upload size={13} />
                            <span>重新上传 / 替换稿样文件</span>
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => setNewContentImageUrl('https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400')}
                          className="text-center py-5 cursor-pointer w-full"
                        >
                          <Upload size={28} className="mx-auto text-blue-500 mb-2" />
                          <p className="text-xs text-gray-700 font-bold">点击上传或将稿样文件拖拽至此处</p>
                          <p className="text-[11px] text-gray-400 mt-1">支持 JPG, PNG, WEBP 等格式，建议分辨率不低于 1920x1080</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 字段 3: 创作计划与构想说明 */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                      <span>创作计划与构想说明</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={newContentUsagePlan}
                      onChange={(e) => setNewContentUsagePlan(e.target.value)}
                      placeholder="请详细说明创作计划、整体构想、设计意图及绘制人员安排..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium resize-none"
                    />
                  </div>

                  {/* 字段 4: 涂鸦位置（起止）（下拉选择，先显示总长度，单位米） */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                        <span>涂鸦位置（起止）</span>
                        <span className="text-rose-500">*</span>
                      </label>
                      {(() => {
                        const matches = newContentLocation.match(/K\d+\+(\d+(?:\.\d+)?)\s*~\s*K\d+\+(\d+(?:\.\d+)?)/);
                        let lenStr = '15.00';
                        if (matches && matches[1] && matches[2]) {
                          lenStr = Math.abs(parseFloat(matches[2]) - parseFloat(matches[1])).toFixed(2);
                        }
                        return (
                          <div className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200/80 flex items-center gap-1 shadow-2xs">
                            <span className="text-gray-500 font-normal">总长度：</span>
                            <span>{lenStr} 米</span>
                          </div>
                        );
                      })()}
                    </div>
                    <select
                      value={newContentLocation}
                      onChange={(e) => setNewContentLocation(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer font-medium"
                    >
                      <option value="K12+300.00 ~ K12+315.00 (左壁)">K12+300.00 ~ K12+315.00 (左壁) 【总长度：15.00 米】</option>
                      <option value="K12+316.00 ~ K12+328.00 (左壁)">K12+316.00 ~ K12+328.00 (左壁) 【总长度：12.00 米】</option>
                      <option value="K12+330.00 ~ K12+345.00 (右壁)">K12+330.00 ~ K12+345.00 (右壁) 【总长度：15.00 米】</option>
                      <option value="K12+350.00 ~ K12+362.00 (左壁)">K12+350.00 ~ K12+362.00 (左壁) 【总长度：12.00 米】</option>
                      <option value="K12+365.00 ~ K12+380.00 (右壁)">K12+365.00 ~ K12+380.00 (右壁) 【总长度：15.00 米】</option>
                      <option value="K12+382.00 ~ K12+395.00 (左壁)">K12+382.00 ~ K12+395.00 (左壁) 【总长度：13.00 米】</option>
                      <option value="K12+400.00 ~ K12+412.00 (右壁)">K12+400.00 ~ K12+412.00 (右壁) 【总长度：12.00 米】</option>
                    </select>
                  </div>

                  {/* 字段 5: 申请单位（不可编辑） */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                      <span>申请单位</span>
                      <span className="text-[11px] text-gray-400 font-normal">(只读)</span>
                    </label>
                    <input
                      type="text"
                      readOnly
                      disabled
                      value="艺术学院青年志愿者协会"
                      className="w-full bg-gray-100 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-600 font-bold outline-none cursor-not-allowed"
                    />
                  </div>

                  {/* 字段 6: 申请人（不可编辑） */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                      <span>申请人</span>
                      <span className="text-[11px] text-gray-400 font-normal">(只读)</span>
                    </label>
                    <input
                      type="text"
                      readOnly
                      disabled
                      value="张伟"
                      className="w-full bg-gray-100 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-600 font-bold outline-none cursor-not-allowed"
                    />
                  </div>

                  {/* 字段 7: 联系电话 */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                      <span>联系电话</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={newContentPhone}
                      onChange={(e) => setNewContentPhone(e.target.value)}
                      placeholder="请输入联系电话，例如：13800138001"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* 右侧：审批流程图（宽度调小一点，采用标准的连线时间轴图） */}
                <div className="lg:col-span-4 bg-slate-50/90 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between self-stretch shadow-2xs">
                  <div>
                    <div className="flex items-center gap-2 mb-4 pb-2.5 border-b border-slate-200/70">
                      <FileText className="text-blue-600 shrink-0" size={15} />
                      <h4 className="text-xs font-bold text-slate-900">审批流程图</h4>
                    </div>

                    {/* 时间轴容器 */}
                    <div className="relative pl-1 my-2">
                      {/* 贯穿时间轴的垂直连接线 */}
                      <div className="absolute left-[13px] top-3 bottom-3 w-0.5 bg-slate-200/90 z-0"></div>

                      <div className="space-y-4">
                        {/* 节点 1 */}
                        <div className="flex items-start gap-3 relative z-10">
                          <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0 shadow-xs shadow-blue-500/30 ring-4 ring-slate-50">
                            1
                          </div>
                          <div className="pt-0.5">
                            <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                              <span>提交涂鸦内容报批申请</span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">申请人填写信息并绑定涂鸦位置与起止</div>
                          </div>
                        </div>

                        {/* 节点 2 */}
                        <div className="flex items-start gap-3 relative z-10">
                          <div className="w-6 h-6 rounded-full bg-white border-2 border-slate-300 text-slate-600 text-[11px] font-bold flex items-center justify-center shrink-0 shadow-2xs ring-4 ring-slate-50">
                            2
                          </div>
                          <div className="pt-0.5">
                            <div className="text-xs font-bold text-slate-800">辅导员审批</div>
                            <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">审查活动真实性、意识形态与合规性</div>
                          </div>
                        </div>

                        {/* 节点 3 */}
                        <div className="flex items-start gap-3 relative z-10">
                          <div className="w-6 h-6 rounded-full bg-white border-2 border-slate-300 text-slate-600 text-[11px] font-bold flex items-center justify-center shrink-0 shadow-2xs ring-4 ring-slate-50">
                            3
                          </div>
                          <div className="pt-0.5">
                            <div className="text-xs font-bold text-slate-800">单位负责人审批</div>
                            <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">确认组织承办资质与单位盖章备案</div>
                          </div>
                        </div>

                        {/* 节点 4 */}
                        <div className="flex items-start gap-3 relative z-10">
                          <div className="w-6 h-6 rounded-full bg-white border-2 border-slate-300 text-slate-600 text-[11px] font-bold flex items-center justify-center shrink-0 shadow-2xs ring-4 ring-slate-50">
                            4
                          </div>
                          <div className="pt-0.5">
                            <div className="text-xs font-bold text-slate-800">学生会审批</div>
                            <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">涂鸦栏位排期冲突核查与规格复核</div>
                          </div>
                        </div>

                        {/* 节点 5 */}
                        <div className="flex items-start gap-3 relative z-10">
                          <div className="w-6 h-6 rounded-full bg-white border-2 border-slate-300 text-slate-600 text-[11px] font-bold flex items-center justify-center shrink-0 shadow-2xs ring-4 ring-slate-50">
                            5
                          </div>
                          <div className="pt-0.5">
                            <div className="text-xs font-bold text-slate-800">校团委终审与发码</div>
                            <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">终审通过并生成涂鸦核销二维码</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 须知事项 */}
                  <div className="mt-4 p-3 bg-blue-50/90 border border-blue-100 rounded-xl text-xs text-blue-950">
                    <div className="flex items-center gap-1.5 font-bold text-blue-900 mb-1">
                      <Sparkles size={13} className="text-blue-600 shrink-0" />
                      <span>须知事项：</span>
                    </div>
                    <p className="text-[11px] text-blue-800/90 leading-relaxed">
                      审核通过后请下载专属电子二维码，并打印附于涂鸦右下角，未贴码涂鸦将被管理员清理。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCreateContentModal(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleCreateContentSubmit}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
              >
                发起申请
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GRA-06 查看界面 Modal */}
      {viewingContentItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-2">
                <FileText className="text-indigo-600" size={18} />
                <h3 className="text-sm font-bold text-gray-900">涂鸦内容报批详情</h3>
                <span className={`ml-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  viewingContentItem.status === '审批通过'
                    ? 'bg-emerald-100 text-emerald-800'
                    : viewingContentItem.status === '已驳回'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {viewingContentItem.status}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setViewingContentItem(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body: Two columns layout - Left: Application Info, Right: Approval Records */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              {/* Left Column: 申请信息 (一致于发起涂鸦申请表单) */}
              <div className="space-y-4 pr-0 md:pr-2">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Palette size={16} className="text-indigo-600" />
                  <h4 className="text-xs font-bold text-gray-900">申请信息</h4>
                </div>

                {/* Image Preview */}
                <div className="space-y-1">
                  <label className="text-[11px] text-gray-500 font-medium">涂鸦草图/稿样</label>
                  <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                    <img
                      src={viewingContentItem.imageUrl}
                      alt={viewingContentItem.title}
                      className="w-full h-44 object-cover"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-400 block text-[11px]">涂鸦主题</span>
                    <p className="font-bold text-gray-800 mt-0.5">{viewingContentItem.title}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">申请时间</span>
                    <p className="font-mono text-gray-700 mt-0.5">{viewingContentItem.applyTime}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-400 block text-[11px]">涂鸦位置（起止）</span>
                    <p className="font-mono font-bold text-indigo-700 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100/60 mt-0.5">
                      {viewingContentItem.location}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">申请单位</span>
                    <p className="font-medium text-gray-800 mt-0.5">{viewingContentItem.applicantOrg}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">申请人</span>
                    <p className="font-medium text-gray-800 mt-0.5">{viewingContentItem.applicantName}</p>
                  </div>
                  {'contactPhone' in viewingContentItem && viewingContentItem.contactPhone && (
                    <div>
                      <span className="text-gray-400 block text-[11px]">联系电话</span>
                      <p className="font-mono text-gray-700 mt-0.5">{viewingContentItem.contactPhone}</p>
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-gray-400 block text-[11px] mb-1">创作计划与构想说明</span>
                  <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs text-gray-700 leading-relaxed">
                    {viewingContentItem.usagePlan || '拟在指定隧道墙面进行主题涂鸦手绘创作，弘扬积极健康校园文化。'}
                  </div>
                </div>
              </div>

              {/* Right Column: 审批记录 */}
              <div className="space-y-4 pt-4 md:pt-0 md:pl-6">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                  <FileCheck size={16} className="text-indigo-600" />
                  <h4 className="text-xs font-bold text-gray-900">审批记录</h4>
                </div>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                  {/* Step 1: 提交申请 */}
                  <div className="relative">
                    <span className="absolute -left-[31px] top-0.5 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[11px]">
                      <Check size={13} />
                    </span>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-gray-900">发起涂鸦内容报批</span>
                        <span className="px-2 py-0.5 font-bold text-[10px] rounded-md bg-emerald-100 text-emerald-800">
                          已完成
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500">{viewingContentItem.applicantOrg} · {viewingContentItem.applicantName}</p>
                      <p className="text-[10px] font-mono text-gray-400">{viewingContentItem.applyTime}</p>
                      <div className="bg-white border border-gray-200/70 p-2 rounded-xl text-[11px] text-gray-600">
                        提交涂鸦创作方案、稿样草图及位置报批材料。
                      </div>
                    </div>
                  </div>

                  {/* Step 2: 辅导员审核 */}
                  <div className="relative">
                    <span className={`absolute -left-[31px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                      viewingContentItem.status === '审批通过' || viewingContentItem.status === '已驳回' || viewingContentItem.status === '待单位负责人审批' || viewingContentItem.status === '待团委审批'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-blue-600 text-white ring-4 ring-blue-100'
                    }`}>
                      {viewingContentItem.status === '待辅导员审批' ? '2' : <Check size={13} />}
                    </span>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-gray-900">辅导员审批</span>
                        <span className={`px-2 py-0.5 font-bold text-[10px] rounded-md ${
                          viewingContentItem.status === '待辅导员审批'
                            ? 'bg-blue-100 text-blue-800 animate-pulse'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {viewingContentItem.status === '待辅导员审批' ? '审批中' : '已通过'}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500">辅导员 · 张老师</p>
                      <div className="bg-white border border-gray-200/70 p-2 rounded-xl text-[11px] text-gray-600">
                        {viewingContentItem.status === '待辅导员审批'
                          ? '正在审核涂鸦创作主题是否符合学生思政要求...'
                          : '作品主题积极向上，符合校园艺术表达规范。'}
                      </div>
                    </div>
                  </div>

                  {/* Step 3: 单位负责人审批 */}
                  <div className="relative">
                    <span className={`absolute -left-[31px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                      viewingContentItem.status === '审批通过' || viewingContentItem.status === '已驳回' || viewingContentItem.status === '待团委审批'
                        ? 'bg-emerald-500 text-white'
                        : viewingContentItem.status === '待单位负责人审批'
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {viewingContentItem.status === '待辅导员审批' || viewingContentItem.status === '待单位负责人审批' ? '3' : <Check size={13} />}
                    </span>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-gray-900">单位负责人审批</span>
                        <span className={`px-2 py-0.5 font-bold text-[10px] rounded-md ${
                          viewingContentItem.status === '待单位负责人审批'
                            ? 'bg-blue-100 text-blue-800 animate-pulse'
                            : viewingContentItem.status === '待辅导员审批'
                            ? 'bg-gray-100 text-gray-500'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {viewingContentItem.status === '待单位负责人审批' ? '审批中' : viewingContentItem.status === '待辅导员审批' ? '待处理' : '已通过'}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500">学院党委/单位负责人 · 李书记</p>
                      <div className="bg-white border border-gray-200/70 p-2 rounded-xl text-[11px] text-gray-600">
                        {viewingContentItem.status === '待单位负责人审批'
                          ? '正在对涂鸦图案草图及单位盖章文件进行复核...'
                          : viewingContentItem.status === '待辅导员审批'
                          ? '等待前置环节完成'
                          : '同意申请单位作品报批方案。'}
                      </div>
                    </div>
                  </div>

                  {/* Step 4: 校团委终审 */}
                  <div className="relative">
                    <span className={`absolute -left-[31px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                      viewingContentItem.status === '审批通过'
                        ? 'bg-emerald-500 text-white'
                        : viewingContentItem.status === '已驳回'
                        ? 'bg-rose-500 text-white'
                        : viewingContentItem.status === '待团委审批'
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {viewingContentItem.status === '审批通过' ? <Check size={13} /> : viewingContentItem.status === '已驳回' ? <X size={13} /> : '4'}
                    </span>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-gray-900">校团委终审</span>
                        <span className={`px-2 py-0.5 font-bold text-[10px] rounded-md ${
                          viewingContentItem.status === '审批通过'
                            ? 'bg-emerald-100 text-emerald-800'
                            : viewingContentItem.status === '已驳回'
                            ? 'bg-rose-100 text-rose-800'
                            : viewingContentItem.status === '待团委审批'
                            ? 'bg-blue-100 text-blue-800 animate-pulse'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {viewingContentItem.status === '审批通过'
                            ? '已通过'
                            : viewingContentItem.status === '已驳回'
                            ? '已驳回'
                            : viewingContentItem.status === '待团委审批'
                            ? '审批中'
                            : '待处理'}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500">
                        {'approverName' in viewingContentItem && viewingContentItem.approverName
                          ? viewingContentItem.approverName
                          : '校团委宣传部 · 刘老师'}
                      </p>
                      {'approveTime' in viewingContentItem && viewingContentItem.approveTime && (
                        <p className="text-[10px] font-mono text-gray-400">{viewingContentItem.approveTime}</p>
                      )}
                      <div className="bg-white border border-gray-200/70 p-2 rounded-xl text-[11px] text-gray-600">
                        {viewingContentItem.status === '审批通过'
                          ? '准予在指定隧道墙面位置进行涂鸦创作。'
                          : viewingContentItem.status === '已驳回'
                          ? ('approveComment' in viewingContentItem && viewingContentItem.approveComment ? viewingContentItem.approveComment : '方案退回重修。')
                          : viewingContentItem.status === '待团委审批'
                          ? '校团委正在对涂鸦最终稿样进行终审...'
                          : '等待前置环节完成'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end px-6 py-3 border-t border-gray-100 bg-gray-50/50">
              <button
                type="button"
                onClick={() => setViewingContentItem(null)}
                className="px-4 py-1.5 text-xs font-bold text-gray-600 hover:text-gray-800 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-2xs transition-all cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GRA-06 撤回确认 Modal */}
      {withdrawingContentItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="p-2.5 bg-amber-50 rounded-xl">
                <Undo2 size={20} />
              </div>
              <h3 className="text-sm font-bold text-gray-900">确认撤回涂鸦内容报批？</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              您确定要撤回主题为<strong className="text-gray-900 mx-1">“{withdrawingContentItem.title}”</strong>的涂鸦报批申请吗？撤回后将终止当前的审批流程。
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setWithdrawingContentItem(null)}
                className="px-3.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmContentWithdraw}
                className="px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                确认撤回
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GRA-14: 历史作品库 */}
      {activeTab === 'GRA-14' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-black text-gray-900">芙蓉隧道历年经典涂鸦典藏库 (GRA-14)</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {MOCK_3D_MURALS.map(mural => (
              <div key={mural.id} className="border border-gray-100 rounded-2xl overflow-hidden bg-gray-50/50 p-3 space-y-2">
                <img src={mural.imageUrl} alt={mural.title} className="w-full h-32 object-cover rounded-xl" />
                <h4 className="text-xs font-bold text-gray-900">{mural.title}</h4>
                <p className="text-[10px] text-gray-500">{mural.artist}</p>
                <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1 border-t border-gray-200">
                  <span className="text-rose-500 font-bold flex items-center gap-0.5"><Heart size={10} className="fill-rose-500" /> {mural.likes}</span>
                  <span className="font-mono text-emerald-600">PVC验证 ✅</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GRA-15: 实时线上 3D 涂鸦 */}
      {activeTab === 'GRA-15' && (
        <div className="w-full">
          <Tunnel3DView />
        </div>
      )}

      {/* GRA-16: 统计分析 */}
      {activeTab === 'GRA-16' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-black text-gray-900">芙蓉隧道涂鸦多维统计分析 (GRA-16)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-900">
              <span className="text-xs text-indigo-500 font-bold block">现存审定涂鸦墙面</span>
              <strong className="text-2xl font-black mt-1 block">840 处</strong>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-900">
              <span className="text-xs text-emerald-500 font-bold block">PVC 二维码核发率</span>
              <strong className="text-2xl font-black mt-1 block">100 %</strong>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-amber-900">
              <span className="text-xs text-amber-500 font-bold block">公众线上点赞交互</span>
              <strong className="text-2xl font-black mt-1 block">12.8 万次</strong>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewingGraffiti && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-gray-900">涂鸦作品三级审核 (GRA-09)</h3>
            <p className="text-xs text-gray-600">作品名称：<strong>{reviewingGraffiti.title}</strong></p>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">审核意见</label>
              <textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="请输入意见..."
                className="w-full border border-gray-200 rounded-xl p-3 text-xs outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => handleReviewGraffitiAction('REJECTED')} className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold">
                退回方案
              </button>
              <button onClick={() => handleReviewGraffitiAction('APPROVED')} className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold">
                终审通过并颁发 PVC 铭牌码
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
