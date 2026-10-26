import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Settings, 
  Box, 
  Layers, 
  Cpu, 
  Map as MapIcon, 
  ChevronRight, 
  ChevronLeft,
  ChevronDown,
  Bell,
  User,
  Search,
  Database,
  Workflow,
  X,
  Plus,
  Scan,
  Trash2,
  Home,
  LayoutDashboard,
  Activity,
  Menu,
  LogOut,
  Star,
  ExternalLink,
  Sparkles,
  Bot,
  MessageSquare,
  CornerDownLeft,
  Folder,
  History,
  Info,
  Upload,
  Edit3,
  Check,
  Lock,
  Shield,
  Download,
  ArrowLeft,
  ShieldCheck,
  Building2,
  Palette,
  Users,
  FileText,
  AlertTriangle,
  ShieldAlert,
  Tag,
  QrCode,
  Grid,
  FileCheck,
  Eye,
  BarChart3,
  MapPin,
  UserCheck,
  FilePlus,
  Paintbrush,
  Monitor,
  Glasses,
  SearchCheck,
  Siren,
  ClipboardList,
  BellRing,
  UserCog,
  FileCheck2,
  Stamp,
  CheckCircle2,
  LayoutGrid,
  FolderArchive,
  Library,
  Milestone,
  Users2,
  Tags,
  SlidersHorizontal,
  FileSpreadsheet
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SystemFeatureCatalogModal from './common/SystemFeatureCatalogModal';
import { BACKEND_PRD_DOCUMENT_MD } from '../data/backendPrdDocument';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number | string;
  children?: NavItem[];
}

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface LayoutProps {
  children: React.ReactNode;
  tabs: Tab[];
  activeTabId: string;
  onTabClick: (id: string) => void;
  onTabClose: (id: string) => void;
  onCloseOthers: (id: string) => void;
  onCloseAll: () => void;
  onMoveTab: (fromIndex: number, toIndex: number) => void;
  onBackToLanding?: () => void;
}

export interface SystemRole {
  id: string;
  name: string;
}

export const SYSTEM_ROLES: SystemRole[] = [
  { id: 'counselor_sec', name: '辅导员/OA 秘书' },
  { id: 'unit_leader', name: '单位负责人' },
  { id: 'student_union', name: '学生会负责人' },
  { id: 'youth_league', name: '校团委' },
  { id: 'faculty', name: '教职工' },
  { id: 'student', name: '学生' },
];

const COMMON_APPLY_ITEMS: NavItem[] = [
  { id: 'dashboard', label: '首页', icon: <LayoutDashboard size={20} /> },
  { id: 'pos-02', label: '海报张贴申请', icon: <FilePlus size={20} /> },
  { id: 'gra-02', label: '隧道涂鸦区域申请', icon: <MapPin size={20} /> },
  { id: 'gra-06', label: '隧道涂鸦内容报批', icon: <Paintbrush size={20} /> },
];

const COMMON_ONLINE_ITEMS: NavItem[] = [
  { id: 'pos-10', label: '线上海报栏', icon: <Monitor size={20} /> },
  { id: 'gra-15', label: '线上芙蓉隧道', icon: <Glasses size={20} /> },
];

const INSPECTION_GROUP: NavItem = {
  id: 'inspection-mgmt-group',
  label: '巡检管理',
  icon: <SearchCheck size={20} />,
  children: [
    { id: 'pub-05', label: '违规事件管理', icon: <Siren size={16} /> },
    { id: 'pub-03', label: '巡检记录', icon: <ClipboardList size={16} /> },
    { id: 'pub-04', label: '巡检预警', icon: <BellRing size={16} /> },
    { id: 'pub-02', label: '巡检员管理', icon: <UserCog size={16} /> }
  ]
};

const ROLE_NAV_MAP: Record<string, NavItem[]> = {
  // 辅导员/OA 秘书
  'counselor_sec': [
    ...COMMON_APPLY_ITEMS,
    { id: 'pos-03', label: '海报张贴审批', icon: <FileCheck2 size={20} />, badge: 3 },
    { id: 'gra-02-approval', label: '隧道涂鸦区域审批', icon: <Stamp size={20} />, badge: 2 },
    { id: 'gra-06-approval', label: '隧道涂鸦内容审批', icon: <CheckCircle2 size={20} />, badge: 5 },
    ...COMMON_ONLINE_ITEMS,
  ],

  // 单位负责人
  'unit_leader': [
    ...COMMON_APPLY_ITEMS,
    { id: 'pos-03', label: '海报张贴审批', icon: <FileCheck2 size={20} />, badge: 3 },
    { id: 'pos-03-tuanwei', label: '巡检二维码发放', icon: <QrCode size={20} />, badge: 3 },
    { id: 'gra-02-approval', label: '隧道涂鸦区域审批', icon: <Stamp size={20} />, badge: 2 },
    { id: 'gra-06-approval', label: '隧道涂鸦内容审批', icon: <CheckCircle2 size={20} />, badge: 5 },
    ...COMMON_ONLINE_ITEMS,
  ],

  // 学生会负责人
  'student_union': [
    ...COMMON_APPLY_ITEMS,
    { id: 'pos-03', label: '海报张贴审批', icon: <FileCheck2 size={20} />, badge: 3 },
    { id: 'pos-03-tuanwei', label: '巡检二维码发放', icon: <QrCode size={20} />, badge: 3 },
    INSPECTION_GROUP,
    ...COMMON_ONLINE_ITEMS,
  ],

  // 校团委
  'youth_league': [
    ...COMMON_APPLY_ITEMS,
    {
      id: 'poster-mgmt-group',
      label: '海报张贴管理',
      icon: <LayoutGrid size={20} />,
      children: [
        { id: 'pos-03', label: '海报张贴审批', icon: <FileCheck2 size={16} />, badge: 3 },
        { id: 'pos-03-tuanwei', label: '巡检二维码发放', icon: <QrCode size={16} />, badge: 3 },
        { id: 'pos-10', label: '线上海报栏', icon: <Monitor size={16} /> },
        { id: 'pos-09', label: '海报库', icon: <FolderArchive size={16} /> },
        { id: 'pos-01', label: '张贴栏管理', icon: <Building2 size={16} /> }
      ]
    },
    {
      id: 'graffiti-mgmt-group',
      label: '芙蓉隧道涂鸦管理',
      icon: <Palette size={20} />,
      children: [
        { id: 'gra-02-approval', label: '隧道涂鸦区域审批', icon: <Stamp size={16} />, badge: 2 },
        { id: 'gra-06-approval', label: '隧道涂鸦内容审批', icon: <CheckCircle2 size={16} />, badge: 5 },
        { id: 'gra-14', label: '涂鸦作品库', icon: <Library size={16} /> },
        { id: 'gra-01', label: '涂鸦区域管理', icon: <Milestone size={16} /> },
        { id: 'gra-15', label: '线上芙蓉隧道', icon: <Glasses size={16} /> }
      ]
    },
    INSPECTION_GROUP,
    {
      id: 'pub-settings-group',
      label: '公共设置',
      icon: <Settings size={20} />,
      children: [
        { id: 'pub-01', label: '组织角色设置', icon: <Users2 size={16} /> },
        { id: 'pub-08', label: '审批角色设置', icon: <UserCheck size={16} /> },
        { id: 'pub-06', label: '涂鸦主题管理', icon: <Tags size={16} /> },
        { id: 'pub-07', label: '巡检规则设置', icon: <SlidersHorizontal size={16} /> }
      ]
    }
  ],

  // 教职工
  'faculty': [
    ...COMMON_APPLY_ITEMS,
    ...COMMON_ONLINE_ITEMS,
  ],

  // 学生
  'student': [
    ...COMMON_APPLY_ITEMS,
    ...COMMON_ONLINE_ITEMS,
  ]
};

interface SearchGuideItem {
  id: string;
  type: 'menu' | 'function';
  title: string;
  category: string;
  description: string;
  iconName: string;
  guideTitle: string;
  guideText: string;
  targetTabId?: string;
}

const SEARCH_GUIDE_ITEMS: SearchGuideItem[] = [
  {
    id: 'dashboard',
    type: 'menu',
    title: '控制台首页 (主控大屏)',
    category: '系统首页',
    description: '纵揽全校张贴栏占用、芙蓉隧道 3D 涂鸦分布、巡检打卡与违规预警。',
    iconName: 'home',
    guideTitle: '🧭 控制台首页操作指引',
    guideText: '欢迎使用主控大屏，此页面包含全局实时状态监测面板，点击数据卡片或快捷入口可快速跳转对应模块。',
    targetTabId: 'dashboard'
  },
  {
    id: 'pub-01',
    type: 'menu',
    title: '组织角色管理 (公共设置)',
    category: '公共设置',
    description: '管理社团、学院团委、学生会及审批账号，支持违规封禁与恢复。',
    iconName: 'sparkles',
    guideTitle: '🛡️ 组织角色与权限配置指引',
    guideText: '针对全校申请单位与审批人员进行统一全生命周期角色管理。',
    targetTabId: 'pub-01'
  },
  {
    id: 'pos-03',
    type: 'menu',
    title: '四级审批工作台 (海报张贴管理)',
    category: '海报管理',
    description: '辅导员初审 -> 部门领导审核 -> 学生会审批 -> 团委终审全闭环。',
    iconName: 'layers',
    guideTitle: '📋 海报四级审批工作台指引',
    guideText: '在线审查选座信息与海报设计，审核通过后自动下发防伪不干胶二维码。',
    targetTabId: 'pos-03'
  },
  {
    id: 'pos-03-tuanwei',
    type: 'menu',
    title: '巡检二维码发放',
    category: '海报管理',
    description: '校团委海报巡检二维码核发与管理工作台。',
    iconName: 'layers',
    guideTitle: '📋 巡检二维码发放工作台指引',
    guideText: '校团委海报巡检防伪二维码发放页面，在线审查选座与下发核销码。',
    targetTabId: 'pos-03-tuanwei'
  },
  {
    id: 'gra-01',
    type: 'menu',
    title: '涂鸦区域管理 (芙蓉隧道涂鸦)',
    category: '芙蓉隧道',
    description: '以 5cm 为最小单位精确标记 1.1 公里芙蓉隧道两侧墙面。',
    iconName: 'box',
    guideTitle: '🎨 芙蓉隧道涂鸦区域管理指引',
    guideText: '精准标定涂鸦墙面编号，关联单位 1 年期使用权与 PVC 永固二维码铭牌。',
    targetTabId: 'gra-01'
  },
  {
    id: 'feature-catalog',
    type: 'function',
    title: '系统全功能清单下载 (Excel/CSV/Markdown)',
    category: '全景清单',
    description: '汇总全系统三大子系统、15个业务块、49项全景功能清单，支持下载为标准 Excel/CSV 表格与 Markdown 文档。',
    iconName: 'database',
    guideTitle: '📋 系统全功能清单查阅与导出',
    guideText: '点击“查看并下载清单”按钮，支持多格式无损导出及一键复制，满足立项申报与运维对账需求。',
    targetTabId: 'dashboard'
  }
];

export default function Layout({ 
  children, 
  tabs, 
  activeTabId, 
  onTabClick, 
  onTabClose, 
  onCloseOthers, 
  onCloseAll,
  onMoveTab,
  onBackToLanding
}: LayoutProps) {
  const [isFeatureCatalogOpen, setIsFeatureCatalogOpen] = useState(false);

  const handleDirectDownloadPrd = () => {
    const blob = new Blob([BACKEND_PRD_DOCUMENT_MD], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const timestamp = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `厦门大学海报与芙蓉隧道涂鸦管理系统_后台管理系统业务逻辑需求说明书_${timestamp}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  const [expandedGroups, setExpandedGroups] = useState<string[]>([
    'poster-mgmt-group',
    'graffiti-mgmt-group',
    'inspection-mgmt-group',
    'pub-settings-group'
  ]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, tabId: string } | null>(null);

  // Role Selector State
  const [currentRole, setCurrentRole] = useState<SystemRole>(SYSTEM_ROLES[0]);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  // Compute visible navigation items based on active role
  const visibleNavItems = useMemo(() => {
    return ROLE_NAV_MAP[currentRole.id] || ROLE_NAV_MAP['counselor_sec'];
  }, [currentRole]);

  // Auto expand groups when role changes
  useEffect(() => {
    const items = ROLE_NAV_MAP[currentRole.id] || [];
    const groupIds = items.filter(i => i.children && i.children.length > 0).map(i => i.id);
    setExpandedGroups(groupIds);
  }, [currentRole]);

  // Tab scroll states
  const tabContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (tabContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabContainerRef.current;
      setCanScrollLeft(scrollLeft > 1);
      // Use math max/round or a small threshold to avoid subpixel layout problems
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
    }
  };

  useEffect(() => {
    // Timeout or microtask to wait for layout/DOM elements to render
    const timer = setTimeout(() => {
      checkScroll();
    }, 100);
    window.addEventListener('resize', checkScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkScroll);
    };
  }, [tabs, activeTabId]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (tabContainerRef.current) {
      const container = tabContainerRef.current;
      const scrollAmount = 240;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // User Personal Center Panel States
  const [isUserCenterOpen, setIsUserCenterOpen] = useState(false);
  const [activeUserTab, setActiveUserTab] = useState('personal-info'); // personal-info, favorites, files, logs, about

  const [userInfo, setUserInfo] = useState({
    name: '李慢慢',
    phone: '138-0013-8000',
    email: 'xiexin.email@gmail.com',
    dept: '系统架构与空间智能实验室',
    role: '系统主官 / 超级管理员',
    staffId: 'SYS-9527',
  });
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editedPhone, setEditedPhone] = useState(userInfo.phone);
  const [editedEmail, setEditedEmail] = useState(userInfo.email);
  const [editedName, setEditedName] = useState(userInfo.name);

  // Pagination states for different tabs (10 items per page)
  const [favPage, setFavPage] = useState(1);
  const [filePage, setFilePage] = useState(1);
  const [logPage, setLogPage] = useState(1);

  // Mocking 30 favorites (Category, Date, Title, targetTab)
  const [favorites, setFavorites] = useState(() => {
    const modules = ['地图管理', '点位标注', '空间规则', '材质渲染', '模型仿真', '司法边界'];
    const tabs = ['map-mgmt', 'map-build', 'space-mgmt', 'spatial-modeling', 'model-mgmt', 'jurisdiction-mgmt'];
    return Array.from({ length: 30 }, (_, i) => ({
      id: `fav-${i + 1}`,
      category: modules[i % modules.length],
      date: `22026-06-${String(10 - Math.floor(i / 3)).padStart(2, '0')} ${String(10 + (i % 12)).padStart(2, '0')}:${String(15 + (i * 13) % 45).padStart(2, '0')}:${String(20 + (i * 7) % 39).padStart(2, '0')}`.replace('22026', '2026'),
      title: `空间模型及三维分析拓扑网络第 ${i + 1} 号配置方案`,
      targetTab: tabs[i % tabs.length]
    }));
  });

  // Mocking 30 files (Source Module, Filename, Creation Time, File Size)
  const [myFiles, setMyFiles] = useState(() => {
    const modules = ['点位标注', '空间规则', '材质渲染', '模型仿真', '司法边界', '地图管理'];
    const extensions = ['glb', 'geojson', 'xlsx', 'obj', 'json', 'fbx'];
    return Array.from({ length: 30 }, (_, i) => {
      const ext = extensions[i % extensions.length];
      const name = `spatial_modeling_layer_${i + 1}.${ext}`;
      const sizeMb = (1.5 + (i * 2.3) % 20).toFixed(1);
      return {
        id: `file-${i + 1}`,
        module: modules[i % modules.length],
        name: name,
        date: `2026-06-${String(10 - Math.floor(i / 4)).padStart(2, '0')} ${String(9 + (i % 14)).padStart(2, '0')}:${String(10 + (i * 17) % 50).padStart(2, '0')}:${String(11 + (i * 11) % 48).padStart(2, '0')}`,
        size: `${sizeMb} MB`
      };
    });
  });

  const [simulatedUploading, setSimulatedUploading] = useState(false);

  // Mocking 30 login logs (Login Time, IP Address, Type)
  const loginLogs = Array.from({ length: 30 }, (_, i) => {
    const types = ['密码登录', '免密快捷登录', '密钥硬锁鉴权', '统一单点登录(SSO)'];
    const ips = ['180.173.12.92', '114.242.23.10', '218.19.140.231', '124.78.225.14', '222.73.144.11', '101.231.112.54'];
    return {
      id: `log-${i + 1}`,
      time: `2026-06-${String(10 - Math.floor(i / 4)).padStart(2, '0')} ${String(11 + (i % 11)).padStart(2, '0')}:${String(14 + (i * 11) % 45).padStart(2, '0')}:${String(12 + (i * 9) % 47).padStart(2, '0')}`,
      ip: ips[i % ips.length],
      type: types[i % types.length]
    };
  });

  const handleSaveInfo = () => {
    setUserInfo({
      ...userInfo,
      name: editedName,
      phone: editedPhone,
      email: editedEmail,
    });
    setIsEditingInfo(false);
  };

  // Quick state overrides for AI Chat and Search Guide Dropdown
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<SearchGuideItem | null>(null);

  const filteredGuideItems = SEARCH_GUIDE_ITEMS.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const [isAiQaOpen, setIsAiQaOpen] = useState(false);
  const [aiChatHistory, setAiChatHistory] = useState<Array<{role: 'user' | 'model', content: string}>>([
    { role: 'model', content: '您好！我是集成于系统底座的 **AI 助理** 🧠。我已为您深度对接本系统中的：\n\n- 🌟 **九维数据建档**（支持必填项红星标记与流式防漏底自适应折叠表格）\n- 🗺️ **3D 地图构建**（点位矢量空间透视标注）\n- 📐 **空间单元管理**（高维几何漫反射网格模型解析）\n- 🤝 **跨辖域数据校验**（双端周期合法性核对）\n\n您可以直接输入具体的业务操作疑问，或点击下方内置了语义图谱的快捷指令：' }
  ]);
  const [aiInputText, setAiInputText] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  const handleAiTrigger = (text: string) => {
    setAiInputText(text);
    setTimeout(() => {
      setAiChatHistory(prev => [...prev, { role: 'user', content: text }]);
      setIsAiThinking(true);
      
      const responseText = 
        text.includes("校验") || text.includes("时间") || text.includes("周期")
          ? "要在【菜单一】中执行起止生效周期校验：具体配置于表单里的【字段三】。因为它是核心验证指标，填入的开始/结束生效日期将在前端核验周期，当到期后列表将友好地弹出防漏档提示。"
          : text.includes("3D") || text.includes("三维") || text.includes("高维") || text.includes("网格") || text.includes("模型")
          ? "三维模型管理：在【菜单一】的列表中可以找到高级【建模】操作。表单内置了【字段九 (文件上传)】，支持拖拽和手动选取 OBJ、FBX、GLB 三维多边形矢量文件，导入后由底座系统自动进行渲染展现。"
          : text.includes("折叠") || text.includes("横向") || text.includes("表格") || text.includes("极宽")
          ? "多维自适应列表：在极宽视图下为绝缘数据不折行漏底，最左侧【字段一】与最右侧【操作栏】均采用了【sticky】固顶属性，覆盖高纯白不透遮色，中间的字段（二至十列）支持流畅无级横向滚动。"
          : "感谢咨询！关于系统相关的数据录入规则与透视映射，您可以通过点击顶部的【智能搜索引擎】来查看完整的界面操作图谱。如有其它问题，系统主官【李慢慢】将持续为您提供高强度解答。";

      setTimeout(() => {
        setIsAiThinking(false);
        setAiChatHistory(prev => [...prev, { role: 'model', content: responseText }]);
      }, 1200);
      setAiInputText('');
    }, 100);
  };

  const handleSendAiMessage = () => {
    if (!aiInputText.trim()) return;
    const text = aiInputText;
    setAiChatHistory(prev => [...prev, { role: 'user', content: text }]);
    setIsAiThinking(true);
    setAiInputText('');

    setTimeout(() => {
      setIsAiThinking(false);
      const responseText = 
        text.includes("校验") || text.includes("时间") || text.includes("周期")
          ? "要在【菜单一】中执行起止生效周期校验：具体配置于表单里的【字段三】。因为它是核心验证指标，填入的开始/结束生效日期将在前端核验周期，当到期后列表将友好地弹出防漏档提示。"
          : text.includes("3D") || text.includes("三维") || text.includes("高维") || text.includes("网格") || text.includes("模型")
          ? "三维模型管理：在【菜单一】的列表中可以找到高级【建模】操作。表单内置了【字段九 (文件上传)】，支持拖拽和手动选取 OBJ、FBX、GLB 三维多边形矢量文件，导入后由底座系统自动进行渲染展现。"
          : text.includes("折叠") || text.includes("横向") || text.includes("表格") || text.includes("极宽")
          ? "多维自适应列表：在极宽视图下为绝缘数据不折行漏底，最左侧【字段一】与最右侧【操作栏】均采用了【sticky】固顶属性，覆盖高纯白不透遮色，中间的字段（二至十列）支持流畅无级横向滚动。"
          : "您好 [李慢慢]！关于『" + text + "』的问答我们已检索收录入底座库。请点击本页顶端的大型【智能搜索引擎】拉起最直观的操作指示导学，或在此面板输入其它技术、配置类查询。";

      setAiChatHistory(prev => [...prev, { role: 'model', content: responseText }]);
    }, 1000);
  };

  const getBreadcrumbs = () => {
    const activeTab = tabs.find(t => t.id === activeTabId);
    const crumbs: { label: string; icon?: React.ReactNode }[] = [];
    
    const findInItems = (items: NavItem[], targetId: string): boolean => {
      for (const item of items) {
        if (item.id === targetId) {
          crumbs.push({ label: item.label, icon: item.icon });
          return true;
        }
        if (item.children && findInItems(item.children, targetId)) {
          crumbs.unshift({ label: item.label, icon: item.icon });
          return true;
        }
      }
      return false;
    };

    findInItems(visibleNavItems, activeTabId);
    
    // If we only have the leaf and it's not the first one, ensure we don't have duplicates if findInItems handles it
    // Actually findInItems pushes the label and then unshifts parents.
    // If activeTab is home/dashboard, it might not be in NAV_ITEMS children directly if it's top level.
    if (crumbs.length === 0 && activeTab) {
        crumbs.push({ label: activeTab.label, icon: activeTab.icon });
    }

    return crumbs;
  };

  const toggleGroup = (id: string, hasChildren: boolean) => {
    if (!hasChildren) {
      onTabClick(id);
      return;
    }
    if (isCollapsed) {
      setIsCollapsed(false);
      if (!expandedGroups.includes(id)) {
        setExpandedGroups([...expandedGroups, id]);
      }
      return;
    }
    setExpandedGroups(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleContextMenu = (e: React.MouseEvent, tabId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, tabId });
  };

  const closeContextMenu = () => setContextMenu(null);

  // Close context menu on click outside
  React.useEffect(() => {
    window.addEventListener('click', closeContextMenu);
    return () => window.removeEventListener('click', closeContextMenu);
  }, []);

  const getItemBadgeCount = (item: NavItem): number => {
    if (typeof item.badge === 'number') return item.badge;
    if (typeof item.badge === 'string') return parseInt(item.badge, 10) || 0;
    if (item.children && item.children.length > 0) {
      return item.children.reduce((acc, child) => acc + getItemBadgeCount(child), 0);
    }
    return 0;
  };

  const renderNavItem = (item: NavItem, level: number = 0) => {
    const hasChildren = !!item.children?.length;
    const isActive = activeTabId === item.id || (hasChildren && item.children?.some(c => activeTabId === c.id || c.children?.some(cc => activeTabId === cc.id)));
    const isExpanded = expandedGroups.includes(item.id);
    const badgeCount = getItemBadgeCount(item);

    return (
      <div key={item.id} className="space-y-1">
        <button 
          onClick={() => toggleGroup(item.id, hasChildren)}
          className={`flex items-center justify-between p-3 rounded-xl text-sm transition-all group relative overflow-hidden ${
            isCollapsed 
              ? 'w-full justify-center px-0' 
              : level > 0 
                ? 'ml-4 w-[calc(100%-1rem)]' 
                : 'w-full'
          } ${
            isActive && !hasChildren
              ? 'bg-blue-50 text-blue-600 border border-blue-100 shadow-sm' 
              : 'text-gray-500 hover:bg-gray-100/50 hover:text-blue-600'
          }`}
          title={isCollapsed ? `${item.label}${badgeCount > 0 ? ` (${badgeCount})` : ''}` : ''}
        >
          <div className="flex items-center gap-3 overflow-hidden z-10 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              <div className={`${isActive && !hasChildren ? 'text-blue-600' : isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'} transition-colors`}>
                {React.cloneElement(item.icon as React.ReactElement, { size: 16 })}
              </div>
              {isCollapsed && badgeCount > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[16px] h-[16px] px-1 bg-rose-500 text-white font-black text-[9px] rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {badgeCount > 99 ? '99+' : badgeCount}
                </span>
              )}
            </div>
            {!isCollapsed && (
              <span className={`truncate ${isActive ? 'font-black' : 'font-bold'} text-sm`}>
                {item.label}
              </span>
            )}
          </div>

          {!isCollapsed && (
            <div className="flex items-center gap-1.5 shrink-0 z-10">
              {badgeCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-rose-500 text-white shadow-xs">
                  {badgeCount > 99 ? '99+' : badgeCount}
                </span>
              )}
              {hasChildren && (
                <ChevronDown 
                  size={14} 
                  className={`transition-transform duration-300 ${isExpanded ? '' : '-rotate-90'} ${isActive ? 'text-blue-600' : 'opacity-50'} flex-shrink-0`} 
                />
              )}
            </div>
          )}

          {!isCollapsed && !hasChildren && activeTabId === item.id && (
            <motion.div 
               layoutId="active-indicator"
               className="absolute left-0 w-1.5 h-6 bg-blue-600 rounded-r-full" 
            />
          )}
        </button>
        
        <AnimatePresence>
          {!isCollapsed && isExpanded && item.children && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              {item.children.map(child => renderNavItem(child, level + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans text-gray-900 overflow-hidden">
      {/* Sidebar - Dark Theme */}
      <aside 
        id="sidebar"
        className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 relative z-30 shadow-xl shadow-black/5`}
      >
        <div className={`p-6 border-b border-gray-50 flex items-center bg-blue-600`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className={`w-8 h-8 bg-white text-blue-600 rounded-lg flex items-center justify-center transition-all shadow-lg`}>
              <Workflow size={20} />
            </div>
            {!isCollapsed && <span className="font-black text-base tracking-tight whitespace-nowrap text-white">厦门大学海报涂鸦系统</span>}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {visibleNavItems.map(item => renderNavItem(item))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 z-20 relative">
          <div className="flex items-center gap-4 flex-1">
            {/* Sidebar Toggle */}
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-blue-600 transition-all"
              title={isCollapsed ? "展开" : "收起"}
            >
              <Menu size={20} />
            </button>

            <div id="search-bar" className="relative w-80 z-40">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="搜索菜单或功能以查看引导..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none text-gray-700 font-bold placeholder:text-gray-400 hover:bg-gray-100/40"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-400 hover:text-gray-600"
                >
                  <X size={12} />
                </button>
              )}

              {/* Guide Dropdown List under the Search box */}
              <AnimatePresence>
                {isSearchFocused && (
                  <>
                    <div 
                      className="fixed inset-0 z-40 bg-transparent" 
                      onClick={() => {
                        setTimeout(() => setIsSearchFocused(false), 200);
                      }}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-11 left-0 right-0 max-h-80 overflow-y-auto bg-white rounded-2xl border border-gray-100 shadow-xl z-50 p-2 space-y-1 no-scrollbar text-left"
                    >
                      <div className="p-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/50 rounded-lg">
                        💡 点击下方菜单或功能，快速拉起指引
                      </div>
                      {filteredGuideItems.length === 0 ? (
                        <div className="py-6 px-4 text-center text-xs font-semibold text-gray-400">
                          没有找到相关的菜单或功能 🔍
                        </div>
                      ) : (
                        filteredGuideItems.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setSelectedGuide(item);
                              setIsSearchFocused(false);
                            }}
                            className="w-full text-left p-3 hover:bg-blue-50/40 rounded-xl flex items-start gap-3 transition-colors group cursor-pointer"
                          >
                            <div className="w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-blue-50 text-gray-500 group-hover:text-blue-600 flex items-center justify-center flex-shrink-0 transition-colors">
                              {item.iconName === 'home' && <Home size={15} />}
                              {item.iconName === 'box' && <Box size={15} />}
                              {item.iconName === 'layers' && <Layers size={15} />}
                              {item.iconName === 'sparkles' && <Sparkles size={15} />}
                              {item.iconName === 'database' && <Database size={15} />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between">
                                <p className="text-xs font-bold text-gray-800 group-hover:text-blue-600 truncate transition-colors">
                                  {item.title}
                                </p>
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 uppercase tracking-wider scale-90">
                                  {item.category}
                                </span>
                              </div>
                              <p className="text-[10px] font-normal text-gray-400 truncate mt-0.5">
                                {item.description}
                              </p>
                            </div>
                          </button>
                        ))
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {onBackToLanding && (
              <button
                onClick={onBackToLanding}
                className="px-3.5 py-1.5 bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-700 border border-gray-200/80 hover:border-blue-200 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer shadow-sm"
                title="引导页"
              >
                <ArrowLeft size={14} />
                <span>引导页</span>
              </button>
            )}

            {/* 系统全功能清单下载与查阅按钮 */}
            <button
              onClick={() => setIsFeatureCatalogOpen(true)}
              className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/90 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer shadow-xs group"
              title="查看并下载系统完整功能清单 (Excel/CSV/Markdown)"
            >
              <FileSpreadsheet size={14} className="text-emerald-600 group-hover:scale-110 transition-transform" />
              <span>功能清单下载</span>
            </button>

            {/* 后台系统业务逻辑需求说明书 (PRD.md) 直接下载按钮 */}
            <button
              onClick={handleDirectDownloadPrd}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200/90 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer shadow-xs group"
              title="导出完整的《后台管理系统业务逻辑需求说明书 (PRD.md)》，纯业务逻辑，直接指导后端开发"
            >
              <FileText size={14} className="text-indigo-600 group-hover:scale-110 transition-transform" />
              <span>导出业务PRD (MD)</span>
            </button>

            {/* 后台系统角色选择下拉框 */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 rounded-xl font-bold text-xs transition-all flex items-center gap-2 active:scale-95 cursor-pointer shadow-sm group"
                title="切换后台系统角色视角"
              >
                <ShieldCheck size={14} className="text-blue-600 group-hover:scale-110 transition-transform" />
                <span className="font-black text-blue-800">{currentRole.name}</span>
                <ChevronDown size={14} className={`text-blue-500 transition-transform duration-200 ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isRoleDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsRoleDropdownOpen(false)} 
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      className="absolute top-11 left-0 w-60 bg-white rounded-xl border border-gray-100 shadow-xl z-50 p-1.5 space-y-0.5 text-left"
                    >
                      {SYSTEM_ROLES.map((role) => {
                        const isSelected = currentRole.id === role.id;
                        return (
                          <button
                            key={role.id}
                            onClick={() => {
                              setCurrentRole(role);
                              setIsRoleDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                              isSelected 
                                ? 'bg-blue-600 text-white font-black shadow-sm' 
                                : 'text-gray-700 hover:bg-gray-100/80 hover:text-blue-600'
                            }`}
                          >
                            <span>{role.name}</span>
                            {isSelected && <Check size={14} className="text-white flex-shrink-0" />}
                          </button>
                        );
                      })}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* AI知识库问答 - 只显示图标 */}
            <div id="ai-qa" className="relative">
              <button 
                onClick={() => setIsAiQaOpen(true)}
                className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg shadow-blue-100 hover:shadow-xl transition-all active:scale-95 group"
                title="AI知识库智能问答系统"
              >
                <Sparkles size={18} className="group-hover:rotate-12 transition-transform text-white animate-pulse" />
              </button>
            </div>

            <button className="relative text-gray-400 hover:text-gray-600 transition-colors">
              <Bell size={18} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-6 w-[1px] bg-gray-100"></div>

            {/* 用户信息 */}
            <div id="user-profile" className="flex items-center gap-4">
              <div 
                onClick={() => {
                  setIsUserCenterOpen(true);
                  setActiveUserTab('personal-info');
                }}
                className="flex items-center gap-3 cursor-pointer group"
                title="点击打开个人中心"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-blue-100 group-hover:scale-105 transition-transform flex-shrink-0">
                  <User size={20} />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-sm font-bold text-gray-900 leading-none group-hover:text-blue-600 transition-colors">{userInfo.name}</p>
                </div>
              </div>
              <button 
                className="w-9 h-9 bg-rose-50/50 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-100 hover:border-rose-500 rounded-xl flex items-center justify-center shadow-sm shadow-rose-50/20 hover:shadow-md transition-all duration-200 active:scale-95 group cursor-pointer"
                onClick={() => alert('正在退出系统...')}
                title="安全退出系统"
              >
                <LogOut size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </header>

        {/* Tab Bar - New Style */}
        <div className="flex-none flex flex-col bg-gray-50/50 relative overflow-hidden select-none">
          <div className="border-b border-gray-100 flex items-center bg-gray-50/30">
            {/* Left Scroll Button - Always Visible */}
            <button 
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              className="flex-shrink-0 w-10 h-11 flex items-center justify-center border-r border-gray-100 bg-white text-gray-400 hover:text-blue-600 hover:bg-gray-50 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed"
              title="向左滚动"
            >
              <div className="p-1 rounded-md hover:bg-gray-100 transition-colors flex items-center justify-center">
                <ChevronLeft size={15} className="stroke-[2.5]" />
              </div>
            </button>

            <div 
              ref={tabContainerRef}
              onScroll={checkScroll}
              className="px-4 flex items-center gap-1 pt-2 overflow-x-auto no-scrollbar scroll-smooth flex-1 h-11"
            >
              <AnimatePresence>
                {tabs.map((tab, idx) => (
                  <motion.div
                    layout
                    key={tab.id}
                    onContextMenu={(e) => handleContextMenu(e, tab.id)}
                    className={`relative flex items-center gap-2 px-6 py-2.5 rounded-t-xl text-[11px] font-bold cursor-pointer transition-all border-x border-t min-w-[130px] max-w-[200px] group ${
                      activeTabId === tab.id 
                        ? 'bg-white text-gray-900 border-gray-100 z-10' 
                        : 'bg-transparent text-gray-400 border-transparent hover:bg-gray-100/50'
                    }`}
                    onClick={() => onTabClick(tab.id)}
                  >
                    <span className={`${activeTabId === tab.id ? 'text-blue-600' : 'text-gray-400'}`}>{tab.icon}</span>
                    <span className="truncate flex-1 select-none font-sans">{tab.label}</span>
                    {tab.id !== 'dashboard' && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); onTabClose(tab.id); }}
                        className={`p-0.5 rounded-full hover:bg-red-50 hover:text-red-500 transition-all ${activeTabId === tab.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                      >
                        <X size={12} />
                      </button>
                    )}
                    {activeTabId === tab.id && (
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-600" />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Right Scroll Button - Always Visible */}
            <button 
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              className="flex-shrink-0 w-10 h-11 flex items-center justify-center border-l border-gray-100 bg-white text-gray-400 hover:text-blue-600 hover:bg-gray-50 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed"
              title="向右滚动"
            >
              <div className="p-1 rounded-md hover:bg-gray-100 transition-colors flex items-center justify-center">
                <ChevronLeft size={15} className="rotate-180 stroke-[2.5]" />
              </div>
            </button>
          </div>
        </div>

        {/* Breadcrumbs - Tag Style */}
        <div className="flex-none px-8 py-4 flex items-center justify-between bg-[#F8F9FA] border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white border border-gray-200 rounded-lg text-blue-600 shadow-sm">
              <Home size={14} />
            </div>
            <ChevronRight size={14} className="text-gray-300" />
            {getBreadcrumbs().map((crumb, i, arr) => (
              <React.Fragment key={crumb.label}>
                <div className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-sm transition-all flex items-center gap-1.5 ${
                  i === arr.length - 1 
                    ? 'bg-white text-gray-500 border border-gray-100' 
                    : 'bg-white text-gray-400 border border-gray-100 hover:text-gray-600 cursor-pointer'
                }`}>
                  {crumb.icon && (
                    <span className="text-blue-500 flex-shrink-0 flex items-center">
                      {React.cloneElement(crumb.icon as React.ReactElement, { size: 12 })}
                    </span>
                  )}
                  <span>{crumb.label}</span>
                </div>
                {i < arr.length - 1 && <ChevronRight size={14} className="text-gray-300" />}
              </React.Fragment>
            ))}
          </div>

          {activeTabId === 'jurisdiction-mgmt' && (
            <div className="flex items-center gap-3">
              <button 
                id="btn-open-new-jurisdiction-modal"
                onClick={() => window.dispatchEvent(new CustomEvent('open-new-jurisdiction-modal'))}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 group font-sans font-black"
              >
                <Plus size={14} className="group-hover:rotate-90 transition-transform" />
                新增辖域
              </button>
            </div>
          )}

          {activeTabId === 'map-build' && (
            <div className="flex items-center gap-3">
              <button 
                id="btn-open-unmarked-modal"
                onClick={() => window.dispatchEvent(new CustomEvent('open-unmarked-modal'))}
                className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-100 text-amber-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-amber-100 transition-all active:scale-95 group font-sans"
              >
                <Scan size={14} className="group-hover:scale-110 transition-transform" />
                未标注位置 (30)
              </button>
              <button 
                id="btn-open-list-query-modal"
                onClick={() => window.dispatchEvent(new CustomEvent('open-list-query-modal'))}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95 group font-sans"
              >
                <Search size={14} className="group-hover:scale-110 transition-transform" />
                列表查询
              </button>
              <button 
                id="btn-open-new-map-modal"
                onClick={() => window.dispatchEvent(new CustomEvent('open-new-map-modal'))}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 group"
              >
                <Plus size={14} className="group-hover:rotate-90 transition-transform" />
                新增标注
              </button>
              <button id="btn-open-external-annotation" className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95 group">
                <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                打开地图标注系统
              </button>
            </div>
          )}

          {activeTabId === 'space-mgmt' && (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('open-unmodeled-modal'))}
                className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-100 text-amber-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-amber-100 transition-all active:scale-95 group font-sans"
              >
                <Scan size={14} className="group-hover:scale-110 transition-transform" />
                未建模空间 (20)
              </button>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('open-new-space-modal'))}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 group font-sans"
              >
                <Plus size={14} className="group-hover:rotate-90 transition-transform" />
                新增空间信息
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 text-gray-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 hover:text-gray-900 transition-all active:scale-95 group font-sans">
                <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                打开空间建模系统
              </button>
            </div>
          )}
        </div>

        {/* Right Click Menu */}
        <AnimatePresence>
          {contextMenu && (
            <>
              <div className="fixed inset-0 z-[100]" onClick={closeContextMenu} />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{ top: contextMenu.y, left: contextMenu.x }}
                className="fixed z-[101] bg-white border border-gray-100 rounded-xl shadow-2xl py-2 min-w-[140px]"
              >
                <button onClick={() => { onTabClose(contextMenu.tabId); closeContextMenu(); }} className="w-full text-left px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 flex items-center gap-2">
                  <X size={14} /> 关闭当前
                </button>
                <button onClick={() => { onCloseOthers(contextMenu.tabId); closeContextMenu(); }} className="w-full text-left px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 flex items-center gap-2">
                  <Layers size={14} /> 关闭其他
                </button>
                <button onClick={() => { onCloseAll(); closeContextMenu(); }} className="w-full text-left px-4 py-2 text-xs font-bold text-red-500 hover:bg-gray-100 flex items-center gap-2">
                  <Trash2 size={14} /> 关闭所有
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto bg-[#F8F9FA]">
          {children}
        </div>
      </main>

      {/* Selected Guide Detail Card Backdrop & Frame */}
      <AnimatePresence>
        {selectedGuide && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/45 backdrop-blur-sm pointer-events-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl p-7 max-w-md w-full border border-gray-100 flex flex-col relative mx-4"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedGuide(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"
                title="关闭引导"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
                  {selectedGuide.iconName === 'home' && <Home size={18} />}
                  {selectedGuide.iconName === 'box' && <Box size={18} />}
                  {selectedGuide.iconName === 'layers' && <Layers size={18} />}
                  {selectedGuide.iconName === 'sparkles' && <Sparkles size={18} />}
                  {selectedGuide.iconName === 'database' && <Database size={18} />}
                </div>
                <div>
                  <h4 className="text-sm font-black text-gray-900 tracking-tight">
                    {selectedGuide.guideTitle}
                  </h4>
                  <p className="text-[10px] text-blue-600 font-bold tracking-wider uppercase">{selectedGuide.category}</p>
                </div>
              </div>

              {/* Guide steps / content */}
              <div className="bg-slate-50/70 border border-slate-100 p-4.5 rounded-2xl mb-5 text-gray-600">
                <p className="text-xs font-semibold leading-relaxed font-sans whitespace-pre-line text-left">
                  {selectedGuide.guideText}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between border-t border-gray-50 pt-4.5">
                <button 
                  onClick={() => setSelectedGuide(null)}
                  className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
                >
                  关闭
                </button>
                {selectedGuide.id === 'feature-catalog' ? (
                  <button 
                    onClick={() => {
                      setIsFeatureCatalogOpen(true);
                      setSelectedGuide(null);
                    }}
                    className="px-4.5 py-2 text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-100 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>打开功能清单并下载</span>
                    <ChevronRight size={14} />
                  </button>
                ) : selectedGuide.targetTabId ? (
                  <button 
                    onClick={() => {
                      onTabClick(selectedGuide.targetTabId);
                      setSelectedGuide(null);
                    }}
                    className="px-4.5 py-2 text-xs font-black bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>激活并跳转该模块</span>
                    <ChevronRight size={14} />
                  </button>
                ) : null}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI知识库智能问答 (AI Q&A Slider Drawer Panel) */}
      <AnimatePresence>
        {isAiQaOpen && (
          <div className="fixed inset-0 z-[200] flex justify-end">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAiQaOpen(false)}
              className="absolute inset-0 bg-gray-950/40 backdrop-blur-sm"
            />
            {/* Drawer */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col border-l border-gray-100 z-10"
            >
              <div className="p-6 border-b border-gray-150 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/15 text-white flex items-center justify-center shadow-inner">
                    <Sparkles size={20} className="animate-pulse text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black tracking-wider text-white">AI 知识库智能问答</h3>
                    <p className="text-[10px] opacity-80 font-semibold tracking-wider uppercase">系统专职助推辅导专家</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAiQaOpen(false)}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar bg-slate-50/50">
                {aiChatHistory.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black text-gray-400 capitalize">
                        {msg.role === 'user' ? '李慢慢' : 'AI 机器人助手'}
                      </span>
                    </div>
                    <div 
                      className={`p-4 rounded-2xl text-[11px] leading-relaxed max-w-[85%] font-semibold shadow-sm whitespace-pre-wrap font-sans ${
                        msg.role === 'user' 
                          ? 'bg-blue-600 text-white rounded-tr-none' 
                          : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isAiThinking && (
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] font-black text-gray-400 mb-1">AI 机器人助手</span>
                    <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Prompt Questions */}
              <div className="p-4 bg-white border-t border-gray-100 space-y-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                  <Bot size={12} className="text-blue-500" />
                  <span>🔍 点选下方热门知识推荐</span>
                </p>
                <div className="flex flex-col gap-2">
                  {[
                    "如何修改单/双端生效周期？",
                    "怎样建立高维3D网格模型？",
                    "数据横向折叠表格要怎么控制？"
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAiTrigger(p)}
                      className="text-[11px] font-bold text-gray-650 bg-gray-50 border border-gray-100 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 px-3.5 py-2 rounded-xl transition-all text-left flex items-center justify-between cursor-pointer"
                    >
                      <span>{p}</span>
                      <ChevronRight size={12} className="text-gray-300 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Input Box */}
              <div className="p-4 border-t border-gray-100 bg-white">
                <div className="relative flex items-center bg-gray-50 rounded-2xl border border-gray-100 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all overflow-hidden">
                  <input
                    type="text"
                    value={aiInputText}
                    onChange={(e) => setAiInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSendAiMessage();
                      }
                    }}
                    placeholder="请输入业务疑问，回车或点右侧发送"
                    className="flex-1 bg-transparent px-4 py-3.5 text-xs outline-none text-gray-700 font-bold placeholder:text-gray-400"
                  />
                  <button 
                    onClick={handleSendAiMessage}
                    className="p-2 mr-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md active:scale-95 transition-all shrink-0 cursor-pointer"
                  >
                    <CornerDownLeft size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isUserCenterOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsUserCenterOpen(false);
                setIsEditingInfo(false);
              }}
              className="absolute inset-0 bg-transparent"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-4xl h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10"
            >
              {/* Header */}
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white z-10">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-3 font-sans text-left">
                    <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                    个人中心
                  </h2>
                </div>
                <button 
                  onClick={() => {
                    setIsUserCenterOpen(false);
                    setIsEditingInfo(false);
                  }}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
                  title="关闭"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Main Container */}
              <div className="flex flex-1 overflow-hidden min-h-0">
                {/* Left Tabs Sidebar */}
                <div className="w-56 border-r border-gray-100 bg-gray-50/50 p-4 flex flex-col justify-between select-none">
                  <div className="space-y-1.5">
                    {[
                      { id: 'personal-info', label: '个人信息', icon: <User size={15} /> },
                      { id: 'favorites', label: '我的收藏', icon: <Star size={15} /> },
                      { id: 'files', label: '我的文件', icon: <Folder size={15} /> },
                      { id: 'logs', label: '登录日志', icon: <History size={15} /> },
                      { id: 'about', label: '关于我们', icon: <Info size={15} /> },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveUserTab(tab.id);
                          setIsEditingInfo(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4.5 py-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          activeUserTab === tab.id
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                            : 'text-gray-500 hover:bg-gray-100/70 hover:text-blue-600'
                        }`}
                      >
                        <span className={activeUserTab === tab.id ? 'text-white' : 'text-gray-400'}>
                          {tab.icon}
                        </span>
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right Content Pane */}
                <div className="flex-1 overflow-y-auto p-8 bg-white flex flex-col min-h-0">
                  {/* Tab 1: 个人信息 */}
                  {activeUserTab === 'personal-info' && (
                    <div className="space-y-6 text-left">
                      <div className="flex items-center gap-5">
                        <div className="relative group">
                          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-105 relative overflow-hidden">
                            <span className="text-3xl font-black">{userInfo.name[0]}</span>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-base font-black text-gray-900">{userInfo.name}</h4>
                          <p className="text-xs text-blue-600 font-bold mt-1">{userInfo.role}</p>
                          <p className="text-xs text-gray-400 mt-0.5 font-semibold">{userInfo.dept}</p>
                        </div>
                      </div>

                      <div className="border border-gray-100 rounded-2xl overflow-hidden bg-gray-50/10 p-5 space-y-5">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                          <span className="text-sm font-bold text-gray-800">基本信息</span>
                          {!isEditingInfo ? (
                            <button
                              onClick={() => {
                                setEditedName(userInfo.name);
                                setEditedPhone(userInfo.phone);
                                setEditedEmail(userInfo.email);
                                setIsEditingInfo(true);
                              }}
                              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 size={12} /> 编辑配置
                            </button>
                          ) : (
                            <div className="flex items-center gap-3">
                              <button
                                onClick={handleSaveInfo}
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-black flex items-center gap-1 cursor-pointer"
                              >
                                <Check size={12} /> 保存
                              </button>
                              <button
                                onClick={() => setIsEditingInfo(false)}
                                className="text-xs font-bold text-gray-400 hover:text-gray-650 cursor-pointer"
                              >
                                取消
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="space-y-4">
                          {/* 姓名 */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-400 tracking-wide">
                              系统称谓
                            </label>
                            {isEditingInfo ? (
                              <input
                                type="text"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm font-sans"
                              />
                            ) : (
                              <div className="px-4 py-2.5 bg-gray-50/50 border border-gray-100 rounded-xl text-sm font-bold text-gray-700">
                                {userInfo.name}
                              </div>
                            )}
                          </div>

                          {/* 配属部门 */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-400 tracking-wide">
                              配属部门
                            </label>
                            <div className="px-4 py-2.5 bg-gray-50/50 border border-gray-100 rounded-xl text-sm font-bold text-gray-700">
                              {userInfo.dept}
                            </div>
                          </div>

                          {/* 主控工号 */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-400 tracking-wide">
                              主控工号 (ID)
                            </label>
                            <div className="px-4 py-2.5 bg-gray-50/50 border border-gray-100 rounded-xl text-sm font-mono font-bold text-gray-700">
                              {userInfo.staffId}
                            </div>
                          </div>

                          {/* 联络电话 */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-400 tracking-wide">
                              联络电话
                            </label>
                            {isEditingInfo ? (
                              <input
                                type="text"
                                value={editedPhone}
                                onChange={(e) => setEditedPhone(e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm font-mono"
                              />
                            ) : (
                              <div className="px-4 py-2.5 bg-gray-50/50 border border-gray-100 rounded-xl text-sm font-bold font-mono text-gray-700">
                                {userInfo.phone}
                              </div>
                            )}
                          </div>

                          {/* 电子邮箱 */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-400 tracking-wide">
                              电子邮箱
                            </label>
                            {isEditingInfo ? (
                              <input
                                type="text"
                                value={editedEmail}
                                onChange={(e) => setEditedEmail(e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm font-mono"
                              />
                            ) : (
                              <div className="px-4 py-2.5 bg-gray-50/50 border border-gray-100 rounded-xl text-sm font-bold font-mono text-gray-700">
                                {userInfo.email}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 2: 我的收藏 */}
                  {activeUserTab === 'favorites' && (() => {
                    const pageSize = 10;
                    const totalItems = favorites.length;
                    const totalPages = Math.ceil(totalItems / pageSize);
                    const activeFavPage = Math.min(favPage, Math.max(1, totalPages));
                    const startIndex = (activeFavPage - 1) * pageSize;
                    const paginatedFavs = favorites.slice(startIndex, startIndex + pageSize);

                    return (
                      <div className="flex-1 flex flex-col justify-between text-left min-h-0">
                        <div className="space-y-4 flex-1 flex flex-col min-h-0">
                          <div className="flex items-center justify-between shrink-0">
                            <h4 className="text-sm font-bold text-gray-950 font-sans">
                              我的收藏 ({totalItems})
                            </h4>
                          </div>

                          <div className="border border-gray-100 rounded-2xl overflow-y-auto bg-white shadow-sm flex-1">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead className="sticky top-0 bg-white z-10 shrink-0">
                                <tr className="bg-gray-50 border-b border-gray-150 font-semibold text-gray-400">
                                  <th className="px-4 py-3 font-sans w-24">收藏模块</th>
                                  <th className="px-4 py-3 font-sans w-40">收藏时间</th>
                                  <th className="px-4 py-3 font-sans">收藏内容</th>
                                  <th className="px-4 py-3 font-sans text-right w-28">操作</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100/60 font-sans text-gray-700">
                                {paginatedFavs.length === 0 ? (
                                  <tr>
                                    <td colSpan={4} className="py-12 text-center text-gray-400 font-bold">
                                      暂无已收藏项
                                    </td>
                                  </tr>
                                ) : (
                                  paginatedFavs.map((fav) => (
                                    <tr key={fav.id} className="hover:bg-gray-50/50 transition-colors">
                                      <td className="px-4 py-3">
                                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100/50 text-[10px] font-bold">
                                          {fav.category}
                                        </span>
                                      </td>
                                      <td className="px-4 py-3 font-mono text-gray-400 text-[11px]">
                                        {fav.date}
                                      </td>
                                      <td className="px-4 py-3 font-semibold text-gray-750 truncate max-w-[280px]" title={fav.title}>
                                        {fav.title}
                                      </td>
                                      <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                          <button
                                            onClick={() => {
                                              setIsUserCenterOpen(false);
                                              onTabClick(fav.targetTab);
                                            }}
                                            className="px-2.5 py-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                                          >
                                            查看
                                          </button>
                                          <button
                                            onClick={() => {
                                              const updated = favorites.filter((item) => item.id !== fav.id);
                                              setFavorites(updated);
                                              const newTotalPages = Math.ceil(updated.length / pageSize);
                                              if (activeFavPage > newTotalPages && newTotalPages > 0) {
                                                setFavPage(newTotalPages);
                                              }
                                            }}
                                            className="px-2.5 py-1 text-[11px] font-bold text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
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

                        {/* Pagination footer */}
                        {totalPages > 1 && (
                          <div className="flex items-center justify-between px-1 py-4 border-t border-gray-100 mt-4 shrink-0">
                            <p className="text-xs text-gray-400">
                              显示第 {startIndex + 1} 到 {Math.min(activeFavPage * pageSize, totalItems)} 条，共 {totalItems} 条记录
                            </p>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setFavPage(prev => Math.max(prev - 1, 1))}
                                disabled={activeFavPage === 1}
                                className="px-2.5 py-1 bg-white border border-gray-200 text-xs font-bold text-gray-650 rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors cursor-pointer"
                              >
                                上一页
                              </button>
                              {Array.from({ length: totalPages }, (_, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setFavPage(idx + 1)}
                                  className={`w-7 h-7 flex items-center justify-center text-xs font-semibold rounded cursor-pointer ${
                                    activeFavPage === idx + 1
                                      ? 'bg-blue-600 text-white shadow-sm'
                                      : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
                                  }`}
                                >
                                  {idx + 1}
                                </button>
                              ))}
                              <button
                                onClick={() => setFavPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={activeFavPage === totalPages}
                                className="px-2.5 py-1 bg-white border border-gray-200 text-xs font-bold text-gray-655 rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors cursor-pointer"
                              >
                                下一页
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Tab 3: 我的文件 */}
                  {activeUserTab === 'files' && (() => {
                    const pageSize = 10;
                    const totalItems = myFiles.length;
                    const totalPages = Math.ceil(totalItems / pageSize);
                    const activeFilePage = Math.min(filePage, Math.max(1, totalPages));
                    const startIndex = (activeFilePage - 1) * pageSize;
                    const paginatedFiles = myFiles.slice(startIndex, startIndex + pageSize);

                    return (
                      <div className="flex-1 flex flex-col justify-between text-left min-h-0">
                        <div className="space-y-4 flex-1 flex flex-col min-h-0">
                          <div className="flex items-center justify-between shrink-0">
                            <h4 className="text-sm font-bold text-gray-950 font-sans">
                              我的文件 ({totalItems})
                            </h4>
                          </div>

                          <div className="border border-gray-100 rounded-2xl overflow-y-auto bg-white shadow-sm flex-1">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead className="sticky top-0 bg-white z-10 shrink-0">
                                <tr className="bg-gray-50 border-b border-gray-150 font-semibold text-gray-400">
                                  <th className="px-4 py-3 font-sans w-24">产生模块</th>
                                  <th className="px-4 py-3 font-sans">文件名</th>
                                  <th className="px-4 py-3 font-sans w-36">创建时间</th>
                                  <th className="px-4 py-3 font-sans w-24">文件大小</th>
                                  <th className="px-4 py-3 font-sans text-right w-28">操作</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100/60 font-sans text-gray-700">
                                {paginatedFiles.length === 0 ? (
                                  <tr>
                                    <td colSpan={5} className="py-12 text-center text-gray-400 font-bold">
                                      暂无文件记录
                                    </td>
                                  </tr>
                                ) : (
                                  paginatedFiles.map((file) => (
                                    <tr key={file.id} className="hover:bg-gray-50/50 transition-colors">
                                      <td className="px-4 py-3">
                                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold">
                                          {file.module}
                                        </span>
                                      </td>
                                      <td className="px-4 py-3 font-medium text-gray-750 truncate max-w-[200px]" title={file.name}>
                                        {file.name}
                                      </td>
                                      <td className="px-4 py-3 font-mono text-gray-400 text-[11px]">
                                        {file.date}
                                      </td>
                                      <td className="px-4 py-3 font-mono text-gray-500 text-[11px]">
                                        {file.size}
                                      </td>
                                      <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                          <button
                                            onClick={() => {
                                              const blob = new Blob([`Mock design document binary for: ${file.name}`], { type: 'text/plain' });
                                              const url = URL.createObjectURL(blob);
                                              const a = document.createElement('a');
                                              a.href = url;
                                              a.download = file.name;
                                              document.body.appendChild(a);
                                              a.click();
                                              document.body.removeChild(a);
                                              URL.revokeObjectURL(url);
                                            }}
                                            className="px-2.5 py-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-55 rounded-md transition-colors cursor-pointer"
                                          >
                                            下载
                                          </button>
                                          <button
                                            onClick={() => {
                                              const updated = myFiles.filter((item) => item.id !== file.id);
                                              setMyFiles(updated);
                                              const newTotalPages = Math.ceil(updated.length / pageSize);
                                              if (activeFilePage > newTotalPages && newTotalPages > 0) {
                                                setFilePage(newTotalPages);
                                              }
                                            }}
                                            className="px-2.5 py-1 text-[11px] font-bold text-red-500 hover:text-red-700 hover:bg-red-55 rounded-md transition-colors cursor-pointer"
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

                        {/* Pagination footer */}
                        {totalPages > 1 && (
                          <div className="flex items-center justify-between px-1 py-4 border-t border-gray-100 mt-4 shrink-0">
                            <p className="text-xs text-gray-400">
                              显示第 {startIndex + 1} 到 {Math.min(activeFilePage * pageSize, totalItems)} 条，共 {totalItems} 条记录
                            </p>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setFilePage(prev => Math.max(prev - 1, 1))}
                                disabled={activeFilePage === 1}
                                className="px-2.5 py-1 bg-white border border-gray-200 text-xs font-bold text-gray-650 rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors cursor-pointer"
                              >
                                上一页
                              </button>
                              {Array.from({ length: totalPages }, (_, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setFilePage(idx + 1)}
                                  className={`w-7 h-7 flex items-center justify-center text-xs font-semibold rounded cursor-pointer ${
                                    activeFilePage === idx + 1
                                      ? 'bg-blue-600 text-white shadow-sm'
                                      : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
                                  }`}
                                >
                                  {idx + 1}
                                </button>
                              ))}
                              <button
                                onClick={() => setFilePage(prev => Math.min(prev + 1, totalPages))}
                                disabled={activeFilePage === totalPages}
                                className="px-2.5 py-1 bg-white border border-gray-200 text-xs font-bold text-gray-655 rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors cursor-pointer"
                              >
                                下一页
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Tab 4: 登录日志 */}
                  {activeUserTab === 'logs' && (() => {
                    const pageSize = 10;
                    const totalItems = loginLogs.length;
                    const totalPages = Math.ceil(totalItems / pageSize);
                    const activeLogPage = Math.min(logPage, Math.max(1, totalPages));
                    const startIndex = (activeLogPage - 1) * pageSize;
                    const paginatedLogs = loginLogs.slice(startIndex, startIndex + pageSize);

                    return (
                      <div className="flex-1 flex flex-col justify-between text-left min-h-0">
                        <div className="space-y-4 flex-1 flex flex-col min-h-0">
                          <div className="flex items-center justify-between shrink-0">
                            <h4 className="text-sm font-bold text-gray-950 font-sans">
                              登录日志 ({totalItems})
                            </h4>
                          </div>

                          <div className="border border-gray-100 rounded-2xl overflow-y-auto bg-white shadow-sm flex-1">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead className="sticky top-0 bg-white z-10 shrink-0">
                                <tr className="bg-gray-50 border-b border-gray-150 font-semibold text-gray-400">
                                  <th className="px-4 py-3 font-sans w-48">登录时间</th>
                                  <th className="px-4 py-3 font-sans">IP 地址</th>
                                  <th className="px-4 py-3 font-sans text-right w-44">类型</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100/60 font-sans text-gray-700">
                                {paginatedLogs.map((log) => (
                                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-4 py-3 font-mono text-gray-650 text-[11px]">
                                      {log.time}
                                    </td>
                                    <td className="px-4 py-3 font-mono text-gray-600 font-semibold">
                                      {log.ip}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-bold">
                                        {log.type}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Pagination footer */}
                        {totalPages > 1 && (
                          <div className="flex items-center justify-between px-1 py-4 border-t border-gray-100 mt-4 shrink-0">
                            <p className="text-xs text-gray-400">
                              显示第 {startIndex + 1} 到 {Math.min(activeLogPage * pageSize, totalItems)} 条，共 {totalItems} 条记录
                            </p>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setLogPage(prev => Math.max(prev - 1, 1))}
                                disabled={activeLogPage === 1}
                                className="px-2.5 py-1 bg-white border border-gray-200 text-xs font-bold text-gray-650 rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors cursor-pointer"
                              >
                                上一页
                              </button>
                              {Array.from({ length: totalPages }, (_, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setLogPage(idx + 1)}
                                  className={`w-7 h-7 flex items-center justify-center text-xs font-semibold rounded cursor-pointer ${
                                    activeLogPage === idx + 1
                                      ? 'bg-blue-600 text-white shadow-sm'
                                      : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
                                  }`}
                                >
                                  {idx + 1}
                                </button>
                              ))}
                              <button
                                onClick={() => setLogPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={activeLogPage === totalPages}
                                className="px-2.5 py-1 bg-white border border-gray-200 text-xs font-bold text-gray-655 rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors cursor-pointer"
                              >
                                下一页
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Tab 5: 关于我们 */}
                  {activeUserTab === 'about' && (
                    <div className="space-y-4 text-left flex-1 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg font-black shrink-0 relative overflow-hidden">
                            <Workflow size={24} />
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-gray-900 leading-tight">空间智能管理底座系统</h4>
                            <p className="text-[10px] text-gray-400 font-mono mt-0.5">Spatial Intelligence Management Base System</p>
                          </div>
                        </div>

                        <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                          本系统作为全生命周期三维空间拓扑底座，内置精细化空间规划，多源材质文件解析及双端日期安全核检防御，支持无限制无排版渗漏的极宽冻结表格渲染。为辖区空间协同提供高纬度运算支撑。
                        </p>

                        <div className="grid grid-cols-2 gap-3 mt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                          {[
                            { label: '主控程序版本', value: 'v3.8.2-Enterprise 商业版' },
                            { label: '系统底座特征', value: '高性能 WebGL 多边形渲染' },
                            { label: '运行支持环境', value: 'Vite 5 / React 18 / Tailwind' },
                            { label: '安全防御模块', value: '端到端空间拓扑数据拦截防护' },
                          ].map((item, idx) => (
                            <div key={idx} className="p-3 bg-gray-50/50 border border-gray-100 rounded-xl">
                              <span className="text-[10px] text-gray-400 font-bold block mb-0.5">{item.label}</span>
                              <span className="text-[11px] text-gray-700 font-black">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-gray-100 pt-4 flex items-center justify-between text-[10px] text-gray-400 font-bold">
                        <span>© 2026 Lab Enterprise. All Rights Reserved.</span>
                        <div className="flex items-center gap-3">
                          <a href="#" className="hover:text-blue-500 transition-colors">使用协议</a>
                          <span>|</span>
                          <a href="#" className="hover:text-blue-500 transition-colors">隐私保护</a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* System Feature Catalog Modal */}
      <SystemFeatureCatalogModal 
        isOpen={isFeatureCatalogOpen} 
        onClose={() => setIsFeatureCatalogOpen(false)} 
      />
    </div>
  );
}
