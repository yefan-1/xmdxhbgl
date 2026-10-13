import React, { useState, useEffect } from 'react';
import { 
  MOCK_ORGANIZATIONS, 
  MOCK_INSPECTORS, 
  MOCK_INSPECTION_LOGS, 
  MOCK_WARNINGS, 
  MOCK_VIOLATION_EVENTS, 
  MOCK_GRAFFITI_THEMES, 
  MOCK_QR_BINDINGS 
} from '../../data/posterGraffitiMock';
import { 
  OrganizationRole, 
  Inspector, 
  InspectionLog,
  ViolationEvent, 
  GraffitiTheme, 
  QRCodeBinding 
} from '../../types/posterGraffitiTypes';
import { 
  ShieldCheck, 
  Users, 
  FileText, 
  AlertTriangle, 
  ShieldAlert, 
  Tag, 
  QrCode, 
  Plus, 
  Check, 
  X, 
  Search, 
  Eye,
  Ban, 
  Send,
  Calendar,
  Building2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  Trash2,
  UserPlus,
  UserCheck,
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
  Info,
  Clock,
  Save,
  CheckCircle2
} from 'lucide-react';

interface PublicSettingsModuleProps {
  subTab?: string;
}

// Data structures for Organization Tree and Role Configuration
interface OrgNode {
  id: string;
  name: string;
  children?: OrgNode[];
}

interface PersonRoleItem {
  id: string;
  name: string;
  workId: string;
  phone: string;
  email?: string;
}

interface OrgRoleConfig {
  counselors: PersonRoleItem[];
  oaSecretaries: PersonRoleItem[];
  deptLeaders: PersonRoleItem[];
}

export interface InspectionTeamMember {
  id: string;
  name: string;
  studentId: string;
  phone: string;
  status: string; // '在岗' | '离岗'
  campus?: string; // '思明校区' | '翔安校区'
}

export interface InspectionTeam {
  id: string;
  campus: string;
  teamName: string;
  leader: string;
  leaderStudentId: string;
  leaderPhone: string;
  activeMemberCount: number;
  members: InspectionTeamMember[];
}

// XMU Organization Tree Dataset (Source: https://www.xmu.edu.cn/sdgl/zzjg.htm)
const XMU_ORG_TREE_DATA: OrgNode[] = [
  {
    id: 'group-1',
    name: '机关部门',
    children: [
      { id: 'org-1-1', name: '学校办公室（党委办公室、校长办公室）' },
      { id: 'org-1-2', name: '纪检监察机构' },
      { id: 'org-1-3', name: '党委组织部 / 党委统战部' },
      { id: 'org-1-4', name: '党委宣传部 / 教师工作部' },
      { id: 'org-1-5', name: '学生工作部（处）/ 团委' },
      { id: 'org-1-6', name: '教务处' },
      { id: 'org-1-7', name: '研究生院' },
      { id: 'org-1-8', name: '科学技术处' },
      { id: 'org-1-9', name: '社会科学处' },
      { id: 'org-1-10', name: '人事处 / 党委教师工作部' },
      { id: 'org-1-11', name: '财务处' },
      { id: 'org-1-12', name: '资产与后勤事务管理处' },
      { id: 'org-1-13', name: '国际合作与交流处（台港澳事务办公室）' },
      { id: 'org-1-14', name: '保卫部（处）' },
      { id: 'org-1-15', name: '实验室与设备管理处' },
      { id: 'org-1-16', name: '基建处' }
    ]
  },
  {
    id: 'group-2',
    name: '人学部',
    children: [
      { id: 'org-2-1', name: '人文学院（中国语言文学系、历史学系、哲学系）' },
      { id: 'org-2-2', name: '新闻传播学院' },
      { id: 'org-2-3', name: '外文学院' },
      { id: 'org-2-4', name: '国学研究院' }
    ]
  },
  {
    id: 'group-3',
    name: '社会科学学部',
    children: [
      { id: 'org-3-1', name: '经济学院' },
      { id: 'org-3-2', name: '王亚南经济研究院' },
      { id: 'org-3-3', name: '管理学院' },
      { id: 'org-3-4', name: '法学院' },
      { id: 'org-3-5', name: '公共事务学院' },
      { id: 'org-3-6', name: '国际关系学院 / 南洋研究院' },
      { id: 'org-3-7', name: '马克思主义学院' },
      { id: 'org-3-8', name: '体育教学部' }
    ]
  },
  {
    id: 'group-4',
    name: '理学部',
    children: [
      { id: 'org-4-1', name: '数学科学学院' },
      { id: 'org-4-2', name: '物理科学与技术学院' },
      { id: 'org-4-3', name: '天文学系' },
      { id: 'org-4-4', name: '化学化工学院' }
    ]
  },
  {
    id: 'group-5',
    name: '工学部',
    children: [
      { id: 'org-5-1', name: '信息学院（计算机科学与技术系、软件工程系、信息与通信工程系）' },
      { id: 'org-5-2', name: '电子科学与技术学院（国家示范性微电子学院）' },
      { id: 'org-5-3', name: '航空航天学院' },
      { id: 'org-5-4', name: '材料学院' },
      { id: 'org-5-5', name: '能源学院' },
      { id: 'org-5-6', name: '建筑与土木工程学院' }
    ]
  },
  {
    id: 'group-6',
    name: '地球科学与技术学部',
    children: [
      { id: 'org-6-1', name: '海洋与地球学院' },
      { id: 'org-6-2', name: '环境与生态学院' },
      { id: 'org-6-3', name: '近海海洋环境科学国家重点实验室' }
    ]
  },
  {
    id: 'group-7',
    name: '医学与生命科学学部',
    children: [
      { id: 'org-7-1', name: '生命科学学院' },
      { id: 'org-7-2', name: '医学院' },
      { id: 'org-7-3', name: '药学院' },
      { id: 'org-7-4', name: '公共卫生学院' }
    ]
  },
  {
    id: 'group-8',
    name: '艺术学部',
    children: [
      { id: 'org-8-1', name: '艺术学院（音乐系、美术系）' },
      { id: 'org-8-2', name: '电影学院' }
    ]
  },
  {
    id: 'group-9',
    name: '直属与附属单位',
    children: [
      { id: 'org-9-1', name: '图书馆' },
      { id: 'org-9-2', name: '档案馆' },
      { id: 'org-9-3', name: '信息网络中心' },
      { id: 'org-9-4', name: '厦门大学附属翔安医院' }
    ]
  },
  {
    id: 'group-10',
    name: '校区与派出机构',
    children: [
      { id: 'org-10-1', name: '翔安校区管委会' },
      { id: 'org-10-2', name: '漳州校区管委会' },
      { id: 'org-10-3', name: '马来西亚分校' }
    ]
  }
];

const INITIAL_ORG_ROLES: Record<string, OrgRoleConfig> = {
  'org-1-5': { // 学生工作部（处）/ 团委
    counselors: [
      { id: 'c-1', name: '张元亮', workId: '352202101', phone: '13859210001', email: 'zhangyl@xmu.edu.cn' },
      { id: 'c-2', name: '李青竹', workId: '352202102', phone: '13859210002', email: 'liqz@xmu.edu.cn' },
      { id: 'c-3', name: '王敏敏', workId: '352202103', phone: '13859210003', email: 'wangmm@xmu.edu.cn' }
    ],
    oaSecretaries: [
      { id: 's-1', name: '陈建国', workId: '352202104', phone: '13959220001', email: 'chenjg@xmu.edu.cn' },
      { id: 's-2', name: '林芳', workId: '352202105', phone: '13959220002', email: 'linf@xmu.edu.cn' }
    ],
    deptLeaders: [
      { id: 'l-1', name: '洪海松', workId: '352202106', phone: '13605920001', email: 'honghs@xmu.edu.cn' },
      { id: 'l-2', name: '廖景华', workId: '352202107', phone: '13605920002', email: 'liaojh@xmu.edu.cn' }
    ]
  },
  'org-5-1': { // 信息学院
    counselors: [
      { id: 'c-4', name: '郑一凡', workId: '352202201', phone: '13759230001', email: 'zhengyf@xmu.edu.cn' },
      { id: 'c-5', name: '蔡胜男', workId: '352202202', phone: '13759230002', email: 'caisn@xmu.edu.cn' }
    ],
    oaSecretaries: [
      { id: 's-3', name: '周晓莉', workId: '352202203', phone: '13959230003', email: 'zhouxl@xmu.edu.cn' }
    ],
    deptLeaders: [
      { id: 'l-3', name: '舒继承', workId: '352202204', phone: '13805920004', email: 'shujc@xmu.edu.cn' },
      { id: 'l-4', name: '刘向阳', workId: '352202205', phone: '13805920005', email: 'liuxy@xmu.edu.cn' }
    ]
  },
  'org-3-1': { // 经济学院
    counselors: [
      { id: 'c-6', name: '刘小龙', workId: '352202301', phone: '13859240001', email: 'liuxl@xmu.edu.cn' },
      { id: 'c-7', name: '孙甜甜', workId: '352202302', phone: '13859240002', email: 'suntt@xmu.edu.cn' }
    ],
    oaSecretaries: [
      { id: 's-4', name: '吴秀华', workId: '352202303', phone: '13959240003', email: 'wuxh@xmu.edu.cn' }
    ],
    deptLeaders: [
      { id: 'l-5', name: '周颖刚', workId: '352202304', phone: '13605920008', email: 'zhouyg@xmu.edu.cn' }
    ]
  }
};

// Approval Role Configuration for Campuses (PUB-08)
interface ApprovalRoleConfig {
  leagueOfficers: PersonRoleItem[]; // 团委审批员
  unionOfficers: PersonRoleItem[];  // 学生会审批员
}

const INITIAL_CAMPUS_APPROVAL_ROLES: Record<string, ApprovalRoleConfig> = {
  'siming': {
    leagueOfficers: [
      { id: 'siming-l-1', name: '李明轩', workId: '352202001', phone: '13859218001', email: 'limx@xmu.edu.cn' },
      { id: 'siming-l-2', name: '张华盛', workId: '352202002', phone: '13859218002', email: 'zhanghs@xmu.edu.cn' }
    ],
    unionOfficers: [
      { id: 'siming-u-1', name: '王嘉尔', workId: '229202101', phone: '13959228001', email: 'wangje@xmu.edu.cn' },
      { id: 'siming-u-2', name: '陈雨欣', workId: '229202102', phone: '13959228002', email: 'chenyx@xmu.edu.cn' }
    ]
  },
  'xiangan': {
    leagueOfficers: [
      { id: 'xiangan-l-1', name: '赵承伟', workId: '352202003', phone: '13759238001', email: 'zhaocw@xmu.edu.cn' }
    ],
    unionOfficers: [
      { id: 'xiangan-u-1', name: '林子涵', workId: '229202103', phone: '13605928001', email: 'linzh@xmu.edu.cn' },
      { id: 'xiangan-u-2', name: '郭浩宇', workId: '229202104', phone: '13605928002', email: 'guohy@xmu.edu.cn' }
    ]
  }
};

// Inspection Rules Form Types & Initial State (PUB-07)
interface InspectionRuleGroup {
  workday: string;
  vacation: string;
  holiday: string;
}

interface InspectionRuleForm {
  simingPoster: InspectionRuleGroup;
  xianganPoster: InspectionRuleGroup;
  furongTunnel: InspectionRuleGroup;
}

const INITIAL_INSPECTION_RULES: InspectionRuleForm = {
  simingPoster: {
    workday: '1天1次',
    vacation: '3天1次',
    holiday: '2天1次'
  },
  xianganPoster: {
    workday: '1天1次',
    vacation: '3天1次',
    holiday: '2天1次'
  },
  furongTunnel: {
    workday: '1天2次',
    vacation: '2天1次',
    holiday: '1天1次'
  }
};

export default function PublicSettingsModule({ subTab = 'PUB-01' }: PublicSettingsModuleProps) {
  const [activeTab, setActiveTab] = useState(subTab);

  useEffect(() => {
    if (subTab) {
      setActiveTab(subTab);
    }
  }, [subTab]);

  // Inspection Rules State (PUB-07)
  const [inspectionRules, setInspectionRules] = useState<InspectionRuleForm>(INITIAL_INSPECTION_RULES);
  const [saveToast, setSaveToast] = useState<boolean>(false);

  const handleSaveInspectionRules = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 4000);
  };
  
  // Organization Role Tree and Role Configuration States
  const [selectedOrgId, setSelectedOrgId] = useState<string>('org-1-5');
  const [expandedGroupIds, setExpandedGroupIds] = useState<Set<string>>(
    new Set(['group-1', 'group-2', 'group-3', 'group-4', 'group-5', 'group-6', 'group-7', 'group-8', 'group-9', 'group-10'])
  );
  const [treeSearchKeyword, setTreeSearchKeyword] = useState<string>('');
  const [orgRolesMap, setOrgRolesMap] = useState<Record<string, OrgRoleConfig>>(INITIAL_ORG_ROLES);

  // Campus Approval Roles States (PUB-08)
  const [activeCampus, setActiveCampus] = useState<'siming' | 'xiangan'>('siming');
  const [campusRolesMap, setCampusRolesMap] = useState<Record<string, ApprovalRoleConfig>>(INITIAL_CAMPUS_APPROVAL_ROLES);

  const [addApprovalModal, setAddApprovalModal] = useState<{
    isOpen: boolean;
    campusKey: 'siming' | 'xiangan';
    roleType: 'leagueOfficers' | 'unionOfficers';
    roleTitle: string;
  }>({
    isOpen: false,
    campusKey: 'siming',
    roleType: 'leagueOfficers',
    roleTitle: '团委审批员'
  });

  // Add person modal state
  const [addPersonModal, setAddPersonModal] = useState<{
    isOpen: boolean;
    roleType: 'counselors' | 'oaSecretaries' | 'deptLeaders';
    roleTitle: string;
  }>({
    isOpen: false,
    roleType: 'counselors',
    roleTitle: '辅导员'
  });

  const [newPersonName, setNewPersonName] = useState('');
  const [newPersonWorkId, setNewPersonWorkId] = useState('');
  const [newPersonPhone, setNewPersonPhone] = useState('');
  const [newPersonEmail, setNewPersonEmail] = useState('');

  // States for other sub-tabs
  const [orgs, setOrgs] = useState<OrganizationRole[]>(MOCK_ORGANIZATIONS);
  const [inspectors, setInspectors] = useState<Inspector[]>(MOCK_INSPECTORS);
  const [violations, setViolations] = useState<ViolationEvent[]>(MOCK_VIOLATION_EVENTS);
  const [themes, setThemes] = useState<GraffitiTheme[]>(MOCK_GRAFFITI_THEMES);
  const [qrBindings, setQrBindings] = useState<QRCodeBinding[]>(MOCK_QR_BINDINGS);

  // PUB-05 违规事件管理 States
  const [vioSubTab, setVioSubTab] = useState<'PENDING' | 'PROCESSED'>('PENDING');
  const [vioCampusInput, setVioCampusInput] = useState<string>('ALL');
  const [vioTargetTypeInput, setVioTargetTypeInput] = useState<string>('ALL');
  const [vioTargetNameInput, setVioTargetNameInput] = useState<string>('');
  const [vioTypeInput, setVioTypeInput] = useState<string>('ALL');
  const [vioReportStartTimeInput, setVioReportStartTimeInput] = useState<string>('');
  const [vioReportEndTimeInput, setVioReportEndTimeInput] = useState<string>('');
  const [appliedVioFilter, setAppliedVioFilter] = useState({
    campus: 'ALL',
    targetType: 'ALL',
    targetName: '',
    type: 'ALL',
    reportStartTime: '',
    reportEndTime: ''
  });

  const [vioCurrentPage, setVioCurrentPage] = useState<number>(1);
  const [vioPageSize, setVioPageSize] = useState<number>(10);

  // Modals for PUB-05
  const [handlingVio, setHandlingVio] = useState<ViolationEvent | null>(null);
  const [isTruthfulInput, setIsTruthfulInput] = useState<'情况属实' | '情况不属实'>('情况属实');
  const [verifiedConclusionInput, setVerifiedConclusionInput] = useState<'不按要求张贴' | '篡改内容' | '未申报张贴'>('不按要求张贴');
  const [verifiedFactNotesInput, setVerifiedFactNotesInput] = useState<string>('');
  const [processResultInput, setProcessResultInput] = useState<'不处理' | '发整改通知书' | '加入申请黑名单'>('发整改通知书');
  const [viewingVio, setViewingVio] = useState<ViolationEvent | null>(null);

  // Modals for other sub-tabs
  const [banningOrg, setBanningOrg] = useState<OrganizationRole | null>(null);
  const [banReasonInput, setBanReasonInput] = useState('');
  
  const [rectifyingViolation, setRectifyingViolation] = useState<ViolationEvent | null>(null);
  const [rectifyNoticeInput, setRectifyNoticeInput] = useState('');

  // Inspection Team Management States (PUB-02: 巡检员管理/巡检班组)
  const [teams, setTeams] = useState<InspectionTeam[]>([
    {
      id: 'team-01',
      campus: '思明校区',
      teamName: '思明海报巡检一组',
      leader: '林云飞',
      leaderStudentId: '352202688',
      leaderPhone: '18950011234',
      activeMemberCount: 12,
      members: [
        { id: 'm-1', name: '林云飞', studentId: '352202688', phone: '18950011234', status: '在岗', campus: '思明校区' },
        { id: 'm-2', name: '苏雨桐', studentId: '352202689', phone: '18950015678', status: '在岗', campus: '思明校区' },
        { id: 'm-3', name: '王嘉伟', studentId: '352202690', phone: '18950019988', status: '离岗', campus: '翔安校区' }
      ]
    },
    {
      id: 'team-02',
      campus: '思明校区',
      teamName: '芙蓉隧道巡检班组',
      leader: '苏雨桐',
      leaderStudentId: '352202689',
      leaderPhone: '18950015678',
      activeMemberCount: 8,
      members: [
        { id: 'm-4', name: '苏雨桐', studentId: '352202689', phone: '18950015678', status: '在岗', campus: '思明校区' },
        { id: 'm-5', name: '许佳琪', studentId: '352202695', phone: '18850235566', status: '在岗', campus: '思明校区' }
      ]
    },
    {
      id: 'team-03',
      campus: '翔安校区',
      teamName: '翔安一期巡检班组',
      leader: '陈诗婷',
      leaderStudentId: '352202701',
      leaderPhone: '18850022334',
      activeMemberCount: 15,
      members: [
        { id: 'm-6', name: '陈诗婷', studentId: '352202701', phone: '18850022334', status: '在岗', campus: '翔安校区' },
        { id: 'm-7', name: '张梓豪', studentId: '352202702', phone: '13850033441', status: '在岗', campus: '翔安校区' }
      ]
    },
    {
      id: 'team-04',
      campus: '漳州校区',
      teamName: '漳州园区巡检班组',
      leader: '刘星雨',
      leaderStudentId: '352202710',
      leaderPhone: '13750033445',
      activeMemberCount: 6,
      members: [
        { id: 'm-8', name: '刘星雨', studentId: '352202710', phone: '13750033445', status: '在岗', campus: '思明校区' }
      ]
    },
    {
      id: 'team-05',
      campus: '樟宜校区',
      teamName: '樟宜综合巡检班组',
      leader: '李哲瀚',
      leaderStudentId: '352202720',
      leaderPhone: '13650044556',
      activeMemberCount: 5,
      members: [
        { id: 'm-9', name: '李哲瀚', studentId: '352202720', phone: '13650044556', status: '在岗', campus: '翔安校区' }
      ]
    }
  ]);

  const [teamSearchCampus, setTeamSearchCampus] = useState<string>('ALL');
  const [teamSearchName, setTeamSearchName] = useState<string>('');

  const [appliedTeamSearch, setAppliedTeamSearch] = useState({
    campus: 'ALL',
    teamName: ''
  });

  const [teamCurrentPage, setTeamCurrentPage] = useState<number>(1);
  const [teamPageSize, setTeamPageSize] = useState<number>(10);

  const handleSearchTeam = () => {
    setAppliedTeamSearch({
      campus: teamSearchCampus,
      teamName: teamSearchName
    });
    setTeamCurrentPage(1);
  };

  const handleResetTeamSearch = () => {
    setTeamSearchCampus('ALL');
    setTeamSearchName('');
    setAppliedTeamSearch({
      campus: 'ALL',
      teamName: ''
    });
    setTeamCurrentPage(1);
  };

  const filteredTeams = teams.filter(team => {
    if (appliedTeamSearch.campus !== 'ALL' && team.campus !== appliedTeamSearch.campus) return false;
    if (appliedTeamSearch.teamName.trim() !== '' && !team.teamName.includes(appliedTeamSearch.teamName.trim())) return false;
    return true;
  });

  const totalTeamItems = filteredTeams.length;
  const totalTeamPages = Math.max(1, Math.ceil(totalTeamItems / teamPageSize));
  const validTeamCurrentPage = Math.min(teamCurrentPage, totalTeamPages);
  const paginatedTeams = filteredTeams.slice(
    (validTeamCurrentPage - 1) * teamPageSize,
    validTeamCurrentPage * teamPageSize
  );

  // Modals for PUB-02
  const [viewingTeam, setViewingTeam] = useState<InspectionTeam | null>(null);
  const [editingTeam, setEditingTeam] = useState<InspectionTeam | null>(null);
  const [managingTeamMembers, setManagingTeamMembers] = useState<InspectionTeam | null>(null);
  const [showAddTeamModal, setShowAddTeamModal] = useState<boolean>(false);

  // Form states for Add Team & Leader Selection
  const [newTeamCampus, setNewTeamCampus] = useState<string>('思明校区');
  const [newTeamName, setNewTeamName] = useState<string>('');
  const [newTeamLeader, setNewTeamLeader] = useState<string>('');
  const [newTeamLeaderStudentId, setNewTeamLeaderStudentId] = useState<string>('');
  const [newTeamLeaderPhone, setNewTeamLeaderPhone] = useState<string>('');
  const [showSelectLeaderModal, setShowSelectLeaderModal] = useState<boolean>(false);

  // Mock candidates for leader selection
  const MOCK_LEADER_CANDIDATES = [
    { name: '林云飞', studentId: '352202688', phone: '18950011234', campus: '思明校区' },
    { name: '苏雨桐', studentId: '352202689', phone: '18950015678', campus: '思明校区' },
    { name: '陈诗婷', studentId: '352202701', phone: '18850022334', campus: '翔安校区' },
    { name: '张梓豪', studentId: '352202702', phone: '13850033441', campus: '翔安校区' },
    { name: '刘星雨', studentId: '352202710', phone: '13750033445', campus: '漳州校区' },
    { name: '李哲瀚', studentId: '352202720', phone: '13650044556', campus: '樟宜校区' },
  ];

  // States for 巡检成员管理 Modal
  const [memberSearchCampus, setMemberSearchCampus] = useState<string>('ALL');
  const [memberSearchStudentId, setMemberSearchStudentId] = useState<string>('');
  const [memberSearchName, setMemberSearchName] = useState<string>('');
  const [memberSearchStatus, setMemberSearchStatus] = useState<string>('ALL');

  const [appliedMemberSearch, setAppliedMemberSearch] = useState({
    campus: 'ALL',
    studentId: '',
    name: '',
    status: 'ALL'
  });

  const handleSearchMembers = () => {
    setAppliedMemberSearch({
      campus: memberSearchCampus,
      studentId: memberSearchStudentId.trim(),
      name: memberSearchName.trim(),
      status: memberSearchStatus
    });
  };

  const handleResetMemberSearch = () => {
    setMemberSearchCampus('ALL');
    setMemberSearchStudentId('');
    setMemberSearchName('');
    setMemberSearchStatus('ALL');
    setAppliedMemberSearch({
      campus: 'ALL',
      studentId: '',
      name: '',
      status: 'ALL'
    });
  };

  // Sub-modals inside 巡检成员管理
  const [showAddInspectorModal, setShowAddInspectorModal] = useState<boolean>(false);
  const [inspectorFormStudentId, setInspectorFormStudentId] = useState<string>('');
  const [inspectorFormName, setInspectorFormName] = useState<string>('');
  const [inspectorFormPhone, setInspectorFormPhone] = useState<string>('');
  const [inspectorFormStatus, setInspectorFormStatus] = useState<'在岗' | '离岗'>('在岗');
  const [inspectorFormCampus, setInspectorFormCampus] = useState<'思明校区' | '翔安校区'>('思明校区');

  const [viewingMemberDetails, setViewingMemberDetails] = useState<InspectionTeamMember | null>(null);

  const handleQueryStudentInfo = () => {
    if (!inspectorFormStudentId.trim()) return;
    const sid = inspectorFormStudentId.trim();

    const mockStudents: Record<string, { name: string; phone: string }> = {
      '352202688': { name: '林云飞', phone: '18950011234' },
      '352202689': { name: '苏雨桐', phone: '18950015678' },
      '352202701': { name: '陈诗婷', phone: '18850022334' },
      '352202702': { name: '张梓豪', phone: '13850033441' },
      '352202710': { name: '刘星雨', phone: '13750033445' },
      '352202720': { name: '李哲瀚', phone: '13650044556' },
      '22920212204101': { name: '林云飞', phone: '18950011234' },
      '22920212204108': { name: '苏雨桐', phone: '18950015678' },
      '23220212201015': { name: '张梓豪', phone: '18950019988' },
    };

    if (mockStudents[sid]) {
      setInspectorFormName(mockStudents[sid].name);
      setInspectorFormPhone(mockStudents[sid].phone);
    } else {
      const suffix = sid.length >= 4 ? sid.slice(-4) : sid;
      setInspectorFormName(`学生${suffix}`);
      setInspectorFormPhone(`1385922${suffix.padStart(4, '0')}`);
    }
  };

  const handleSaveNewInspector = () => {
    if (!managingTeamMembers) return;
    if (!inspectorFormStudentId.trim()) {
      alert('请输入学号');
      return;
    }
    if (!inspectorFormName.trim()) {
      alert('请先输入学号并点击“查询”按钮带出学生姓名');
      return;
    }

    const newM: InspectionTeamMember = {
      id: `m-${Date.now()}`,
      studentId: inspectorFormStudentId.trim(),
      name: inspectorFormName.trim(),
      phone: inspectorFormPhone.trim() || '13800000000',
      status: inspectorFormStatus,
      campus: inspectorFormCampus
    };

    const updatedMembers = [newM, ...(managingTeamMembers.members || [])];
    const updatedTeam = {
      ...managingTeamMembers,
      members: updatedMembers,
      activeMemberCount: updatedMembers.filter(m => m.status === '在岗').length
    };

    setManagingTeamMembers(updatedTeam);
    setTeams(prev => prev.map(t => t.id === updatedTeam.id ? updatedTeam : t));
    setShowAddInspectorModal(false);
    setInspectorFormStudentId('');
    setInspectorFormName('');
    setInspectorFormPhone('');
    setInspectorFormStatus('在岗');
    setInspectorFormCampus('思明校区');
  };

  const handleToggleMemberStatus = (memberId: string) => {
    if (!managingTeamMembers) return;
    const updatedMembers = (managingTeamMembers.members || []).map(m => {
      if (m.id === memberId) {
        return {
          ...m,
          status: m.status === '在岗' ? '离岗' : '在岗'
        };
      }
      return m;
    });

    const updatedTeam = {
      ...managingTeamMembers,
      members: updatedMembers,
      activeMemberCount: updatedMembers.filter(m => m.status === '在岗').length
    };
    setManagingTeamMembers(updatedTeam);
    setTeams(prev => prev.map(t => t.id === updatedTeam.id ? updatedTeam : t));
  };

  const handleSaveMemberManagement = () => {
    if (!managingTeamMembers) return;
    setTeams(prev => prev.map(t => t.id === managingTeamMembers.id ? managingTeamMembers : t));
    setManagingTeamMembers(null);
  };

  const handleAddTeam = () => {
    if (!newTeamName.trim() || !newTeamLeader.trim()) return;
    const leaderSid = newTeamLeaderStudentId.trim() || ('352202' + Math.floor(1000 + Math.random() * 9000));
    const newTeamItem: InspectionTeam = {
      id: `team-${Date.now()}`,
      campus: newTeamCampus,
      teamName: newTeamName.trim(),
      leader: newTeamLeader.trim(),
      leaderStudentId: leaderSid,
      leaderPhone: newTeamLeaderPhone.trim(),
      activeMemberCount: 1,
      members: [
        {
          id: `m-${Date.now()}`,
          name: newTeamLeader.trim(),
          studentId: leaderSid,
          phone: newTeamLeaderPhone.trim() || '13800138000',
          status: '在岗',
          campus: newTeamCampus as any
        }
      ]
    };
    setTeams(prev => [newTeamItem, ...prev]);
    setShowAddTeamModal(false);
    setNewTeamName('');
    setNewTeamLeader('');
    setNewTeamLeaderStudentId('');
    setNewTeamLeaderPhone('');
  };

  const handleUpdateTeam = () => {
    if (!editingTeam) return;
    setTeams(prev => prev.map(t => t.id === editingTeam.id ? editingTeam : t));
    setEditingTeam(null);
  };

  // Inspection Log States (PUB-03)
  const [logTargetTypeInput, setLogTargetTypeInput] = useState<string>('ALL');
  const [logCampusInput, setLogCampusInput] = useState<string>('ALL');
  const [logDateStartInput, setLogDateStartInput] = useState<string>('');
  const [logDateEndInput, setLogDateEndInput] = useState<string>('');
  const [logResultInput, setLogResultInput] = useState<string>('ALL');
  const [logInspectorInput, setLogInspectorInput] = useState<string>('');

  const [appliedLogFilter, setAppliedLogFilter] = useState({
    targetType: 'ALL',
    campus: 'ALL',
    dateStart: '',
    dateEnd: '',
    result: 'ALL',
    inspector: ''
  });

  const [logCurrentPage, setLogCurrentPage] = useState<number>(1);
  const [logPageSize, setLogPageSize] = useState<number>(10);

  const [viewingLog, setViewingLog] = useState<InspectionLog | null>(null);

  const handleSearchLog = () => {
    setAppliedLogFilter({
      targetType: logTargetTypeInput,
      campus: logCampusInput,
      dateStart: logDateStartInput,
      dateEnd: logDateEndInput,
      result: logResultInput,
      inspector: logInspectorInput
    });
    setLogCurrentPage(1);
  };

  const handleResetLogFilter = () => {
    setLogTargetTypeInput('ALL');
    setLogCampusInput('ALL');
    setLogDateStartInput('');
    setLogDateEndInput('');
    setLogResultInput('ALL');
    setLogInspectorInput('');
    setAppliedLogFilter({
      targetType: 'ALL',
      campus: 'ALL',
      dateStart: '',
      dateEnd: '',
      result: 'ALL',
      inspector: ''
    });
    setLogCurrentPage(1);
  };

  // Inspection Warning States (PUB-04)
  const [warnCampusInput, setWarnCampusInput] = useState<string>('ALL');
  const [warnTargetTypeInput, setWarnTargetTypeInput] = useState<string>('ALL');
  const [warnTypeInput, setWarnTypeInput] = useState<string>('ALL');

  const [appliedWarnFilter, setAppliedWarnFilter] = useState({
    campus: 'ALL',
    targetType: 'ALL',
    warningType: 'ALL'
  });

  const [warnCurrentPage, setWarnCurrentPage] = useState<number>(1);
  const [warnPageSize, setWarnPageSize] = useState<number>(10);

  const handleSearchWarn = () => {
    setAppliedWarnFilter({
      campus: warnCampusInput,
      targetType: warnTargetTypeInput,
      warningType: warnTypeInput
    });
    setWarnCurrentPage(1);
  };

  const handleResetWarnFilter = () => {
    setWarnCampusInput('ALL');
    setWarnTargetTypeInput('ALL');
    setWarnTypeInput('ALL');
    setAppliedWarnFilter({
      campus: 'ALL',
      targetType: 'ALL',
      warningType: 'ALL'
    });
    setWarnCurrentPage(1);
  };

  const warningDataset = [
    {
      id: 'warn-01',
      campus: '思明校区',
      targetType: '公共区域海报栏',
      targetName: '思明校区·群贤楼海报栏 B区',
      lastCheckTime: '2026-08-05 09:00',
      overdueHours: '1.25 天',
      warningType: '超时未巡检',
      responsibleInspector: '林云飞',
      phone: '18950011234'
    },
    {
      id: 'warn-02',
      campus: '思明校区',
      targetType: '芙蓉隧道',
      targetName: '芙蓉隧道 300m~350m 巡检位',
      lastCheckTime: '2026-08-05 16:20',
      overdueHours: '0.9 天',
      warningType: '即将超过巡检时间',
      responsibleInspector: '苏雨桐',
      phone: '18950015678'
    },
    {
      id: 'warn-03',
      campus: '翔安校区',
      targetType: '公共区域海报栏',
      targetName: '竞丰餐厅主张贴栏',
      lastCheckTime: '2026-08-03 11:00',
      overdueHours: '3.0 天',
      warningType: '超时未巡检',
      responsibleInspector: '陈诗婷',
      phone: '18850022334'
    },
    {
      id: 'warn-04',
      campus: '漳州校区',
      targetType: '公共区域海报栏',
      targetName: '漳州校区北区学子餐厅旁海报栏',
      lastCheckTime: '2026-08-04 14:30',
      overdueHours: '2.0 天',
      warningType: '超时未巡检',
      responsibleInspector: '刘星雨',
      phone: '13750033445'
    },
    {
      id: 'warn-05',
      campus: '樟宜校区',
      targetType: '公共区域海报栏',
      targetName: '樟宜教学楼1号宣传栏',
      lastCheckTime: '2026-08-02 10:15',
      overdueHours: '4.0 天',
      warningType: '超时未巡检',
      responsibleInspector: '李哲瀚',
      phone: '13650044556'
    },
    {
      id: 'warn-06',
      campus: '思明校区',
      targetType: '公共区域海报栏',
      targetName: '演武田径场东侧海报栏',
      lastCheckTime: '2026-08-05 18:00',
      overdueHours: '0.8 天',
      warningType: '即将超过巡检时间',
      responsibleInspector: '许佳琪',
      phone: '18850235566'
    },
    {
      id: 'warn-07',
      campus: '思明校区',
      targetType: '芙蓉隧道',
      targetName: '芙蓉隧道 700m~800m 毕业涂鸦墙',
      lastCheckTime: '2026-08-03 16:00',
      overdueHours: '2.8 天',
      warningType: '超时未巡检',
      responsibleInspector: '钱雅琪',
      phone: '13650076688'
    }
  ];

  const filteredWarnings = warningDataset.filter(warn => {
    if (appliedWarnFilter.campus !== 'ALL' && warn.campus !== appliedWarnFilter.campus) return false;
    if (appliedWarnFilter.targetType !== 'ALL' && warn.targetType !== appliedWarnFilter.targetType) return false;
    if (appliedWarnFilter.warningType !== 'ALL' && warn.warningType !== appliedWarnFilter.warningType) return false;
    return true;
  });

  const totalWarnItems = filteredWarnings.length;
  const totalWarnPages = Math.max(1, Math.ceil(totalWarnItems / warnPageSize));
  const validWarnCurrentPage = Math.min(warnCurrentPage, totalWarnPages);
  const paginatedWarnings = filteredWarnings.slice(
    (validWarnCurrentPage - 1) * warnPageSize,
    validWarnCurrentPage * warnPageSize
  );

  // Theme management states (PUB-06)
  const [searchThemeName, setSearchThemeName] = useState('');
  const [appliedSearchThemeName, setAppliedSearchThemeName] = useState('');
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [editingTheme, setEditingTheme] = useState<GraffitiTheme | null>(null);
  const [themeFormName, setThemeFormName] = useState('');
  const [themeFormDesc, setThemeFormDesc] = useState('');
  const [themeCurrentPage, setThemeCurrentPage] = useState(1);
  const [themePageSize, setThemePageSize] = useState(5);

  // Helper to find node by id
  const findOrgNode = (nodes: OrgNode[], id: string): OrgNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findOrgNode(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedNode = findOrgNode(XMU_ORG_TREE_DATA, selectedOrgId) || XMU_ORG_TREE_DATA[0].children![4];

  // Helper to get or generate org role config
  const getOrgRoleConfig = (id: string): OrgRoleConfig => {
    if (orgRolesMap[id]) return orgRolesMap[id];
    return {
      counselors: [
        { id: `c-gen-1-${id}`, name: '陈辅导', workId: `352${Math.floor(100000 + Math.random() * 800000)}`, phone: '13859201001', email: 'counselor1@xmu.edu.cn' },
        { id: `c-gen-2-${id}`, name: '林辅导', workId: `352${Math.floor(100000 + Math.random() * 800000)}`, phone: '13859201002', email: 'counselor2@xmu.edu.cn' }
      ],
      oaSecretaries: [
        { id: `s-gen-1-${id}`, name: '黄秘书', workId: `352${Math.floor(100000 + Math.random() * 800000)}`, phone: '13959202001', email: 'secretary@xmu.edu.cn' }
      ],
      deptLeaders: [
        { id: `l-gen-1-${id}`, name: '郭主任', workId: `352${Math.floor(100000 + Math.random() * 800000)}`, phone: '13605903001', email: 'leader@xmu.edu.cn' }
      ]
    };
  };

  const activeRoleConfig = getOrgRoleConfig(selectedOrgId);

  // Toggle tree group expand
  const toggleGroupExpand = (groupId: string) => {
    setExpandedGroupIds(prev => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  // Add person handler
  const handleAddPersonToRole = () => {
    if (!newPersonName.trim()) return;
    const newPerson: PersonRoleItem = {
      id: `person-${Date.now()}`,
      name: newPersonName.trim(),
      workId: newPersonWorkId.trim() || `352${Math.floor(100000 + Math.random() * 800000)}`,
      phone: newPersonPhone.trim() || '13859200000',
      email: newPersonEmail.trim() || `${newPersonName.trim()}@xmu.edu.cn`
    };

    setOrgRolesMap(prev => {
      const currentConfig = prev[selectedOrgId] || getOrgRoleConfig(selectedOrgId);
      const currentList = currentConfig[addPersonModal.roleType] || [];
      return {
        ...prev,
        [selectedOrgId]: {
          ...currentConfig,
          [addPersonModal.roleType]: [...currentList, newPerson]
        }
      };
    });

    setNewPersonName('');
    setNewPersonWorkId('');
    setNewPersonPhone('');
    setNewPersonEmail('');
    setAddPersonModal({ isOpen: false, roleType: 'counselors', roleTitle: '辅导员' });
  };

  // Remove person handler
  const handleRemovePersonFromRole = (roleType: 'counselors' | 'oaSecretaries' | 'deptLeaders', personId: string) => {
    setOrgRolesMap(prev => {
      const currentConfig = prev[selectedOrgId] || getOrgRoleConfig(selectedOrgId);
      const currentList = currentConfig[roleType] || [];
      return {
        ...prev,
        [selectedOrgId]: {
          ...currentConfig,
          [roleType]: currentList.filter(p => p.id !== personId)
        }
      };
    });
  };

  // Campus Approval Role Handlers (PUB-08)
  const handleAddApprovalPerson = () => {
    if (!newPersonName.trim()) return;
    const newPerson: PersonRoleItem = {
      id: `approval-${Date.now()}`,
      name: newPersonName.trim(),
      workId: newPersonWorkId.trim() || `352${Math.floor(100000 + Math.random() * 800000)}`,
      phone: newPersonPhone.trim() || '13859200000',
      email: newPersonEmail.trim() || `${newPersonName.trim()}@xmu.edu.cn`
    };

    setCampusRolesMap(prev => {
      const currentCampusConfig = prev[addApprovalModal.campusKey] || { leagueOfficers: [], unionOfficers: [] };
      const currentList = currentCampusConfig[addApprovalModal.roleType] || [];
      return {
        ...prev,
        [addApprovalModal.campusKey]: {
          ...currentCampusConfig,
          [addApprovalModal.roleType]: [...currentList, newPerson]
        }
      };
    });

    setNewPersonName('');
    setNewPersonWorkId('');
    setNewPersonPhone('');
    setNewPersonEmail('');
    setAddApprovalModal(prev => ({ ...prev, isOpen: false }));
  };

  const handleRemoveApprovalPerson = (campusKey: 'siming' | 'xiangan', roleType: 'leagueOfficers' | 'unionOfficers', personId: string) => {
    setCampusRolesMap(prev => {
      const currentCampusConfig = prev[campusKey] || { leagueOfficers: [], unionOfficers: [] };
      const currentList = currentCampusConfig[roleType] || [];
      return {
        ...prev,
        [campusKey]: {
          ...currentCampusConfig,
          [roleType]: currentList.filter(p => p.id !== personId)
        }
      };
    });
  };

  // Ban Org
  const handleConfirmBan = () => {
    if (!banningOrg) return;
    setOrgs(prev => prev.map(o => o.id === banningOrg.id ? { ...o, isBanned: true, banReason: banReasonInput, banUntil: '2026-12-31' } : o));
    setBanningOrg(null);
    setBanReasonInput('');
  };

  const handleUnban = (id: string) => {
    setOrgs(prev => prev.map(o => o.id === id ? { ...o, isBanned: false, banReason: undefined } : o));
  };

  // Rectify Violation
  const handleSendRectifyNotice = () => {
    if (!rectifyingViolation) return;
    setViolations(prev => prev.map(v => v.id === rectifyingViolation.id ? {
      ...v,
      status: 'RECTIFYING',
      rectifyNotice: rectifyNoticeInput,
      rectifyDeadline: '24小时内'
    } : v));
    setRectifyingViolation(null);
    setRectifyNoticeInput('');
  };

  const handleCloseViolation = (id: string) => {
    setViolations(prev => prev.map(v => v.id === id ? { ...v, status: 'CLOSED' } : v));
  };

  // PUB-05 Search & Handling
  const handleSearchVio = () => {
    setAppliedVioFilter({
      campus: vioCampusInput,
      targetType: vioTargetTypeInput,
      targetName: vioTargetNameInput,
      type: vioTypeInput,
      reportStartTime: vioReportStartTimeInput,
      reportEndTime: vioReportEndTimeInput
    });
    setVioCurrentPage(1);
  };

  const handleResetVioSearch = () => {
    setVioCampusInput('ALL');
    setVioTargetTypeInput('ALL');
    setVioTargetNameInput('');
    setVioTypeInput('ALL');
    setVioReportStartTimeInput('');
    setVioReportEndTimeInput('');
    setAppliedVioFilter({
      campus: 'ALL',
      targetType: 'ALL',
      targetName: '',
      type: 'ALL',
      reportStartTime: '',
      reportEndTime: ''
    });
    setVioCurrentPage(1);
  };

  const handleConfirmProcessVio = () => {
    if (!handlingVio) return;
    const now = new Date();
    const formattedNow = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setViolations(prev => prev.map(v => v.id === handlingVio.id ? {
      ...v,
      status: 'PROCESSED',
      handleTime: formattedNow,
      handleMethod: processResultInput,
      handledBy: '张老师 (公共设施管理处)',
      isTruthful: isTruthfulInput,
      verifiedConclusion: verifiedConclusionInput,
      verifiedFactNotes: verifiedFactNotesInput,
      processResult: processResultInput,
      description: v.description || v.title || ''
    } : v));

    setHandlingVio(null);
  };

  // PUB-05 Filtered violations
  const filteredViolations = violations.filter(vio => {
    // Tab filter
    if (vioSubTab === 'PENDING') {
      if (vio.status === 'PROCESSED' || vio.status === 'CLOSED') return false;
    } else {
      if (vio.status !== 'PROCESSED' && vio.status !== 'CLOSED') return false;
    }

    // Campus filter
    if (appliedVioFilter.campus !== 'ALL') {
      const itemCampus = vio.campus || (vio.location?.includes('思明') ? '思明校区' : vio.location?.includes('翔安') ? '翔安校区' : vio.location?.includes('漳州') ? '漳州校区' : vio.location?.includes('樟宜') ? '樟宜校区' : '');
      if (itemCampus !== appliedVioFilter.campus) return false;
    }

    // Target type filter
    if (appliedVioFilter.targetType !== 'ALL') {
      if (vio.targetType !== appliedVioFilter.targetType) return false;
    }

    // Target name filter
    if (appliedVioFilter.targetName.trim()) {
      const term = appliedVioFilter.targetName.trim().toLowerCase();
      const matchName = (vio.targetName || '').toLowerCase().includes(term);
      const matchLoc = (vio.location || '').toLowerCase().includes(term);
      const matchTitle = (vio.title || '').toLowerCase().includes(term);
      if (!matchName && !matchLoc && !matchTitle) return false;
    }

    // Type filter
    if (appliedVioFilter.type !== 'ALL') {
      if (vio.type !== appliedVioFilter.type) return false;
    }

    // Report time date range filter
    if (appliedVioFilter.reportStartTime.trim()) {
      const itemDate = (vio.reportTime || '').slice(0, 10);
      if (itemDate < appliedVioFilter.reportStartTime.trim()) return false;
    }
    if (appliedVioFilter.reportEndTime.trim()) {
      const itemDate = (vio.reportTime || '').slice(0, 10);
      if (itemDate > appliedVioFilter.reportEndTime.trim()) return false;
    }

    return true;
  });

  const totalVioItems = filteredViolations.length;
  const totalVioPages = Math.ceil(totalVioItems / vioPageSize) || 1;
  const paginatedViolations = filteredViolations.slice(
    (vioCurrentPage - 1) * vioPageSize,
    vioCurrentPage * vioPageSize
  );

  const pendingVioCount = violations.filter(v => v.status !== 'PROCESSED' && v.status !== 'CLOSED').length;
  const processedVioCount = violations.filter(v => v.status === 'PROCESSED' || v.status === 'CLOSED').length;

  // Inspector Handlers (PUB-02)
  const getStatusLabel = (st: string) => {
    if (st === 'ACTIVE' || st === '在岗') return '在岗';
    return '离岗';
  };

  // Theme Handlers (PUB-06)
  const handleOpenAddThemeModal = () => {
    setEditingTheme(null);
    setThemeFormName('');
    setThemeFormDesc('');
    setShowThemeModal(true);
  };

  const handleOpenEditThemeModal = (thm: GraffitiTheme) => {
    setEditingTheme(thm);
    setThemeFormName(thm.name);
    setThemeFormDesc(thm.description);
    setShowThemeModal(true);
  };

  const handleSaveTheme = () => {
    if (!themeFormName.trim()) return;

    if (editingTheme) {
      setThemes(prev =>
        prev.map(t =>
          t.id === editingTheme.id
            ? {
                ...t,
                name: themeFormName.trim(),
                description: themeFormDesc.trim() || '校级审定涂鸦主题分类'
              }
            : t
        )
      );
    } else {
      const nowStr = new Date().toISOString().split('T')[0];
      const newTheme: GraffitiTheme = {
        id: `thm-${Date.now()}`,
        name: themeFormName.trim(),
        description: themeFormDesc.trim() || '校级审定涂鸦主题分类',
        createdBy: '校团委（张老师）',
        createdAt: nowStr,
        activeCount: 0
      };
      setThemes(prev => [newTheme, ...prev]);
    }

    setShowThemeModal(false);
    setThemeFormName('');
    setThemeFormDesc('');
    setEditingTheme(null);
    setThemeCurrentPage(1);
  };

  const handleDeleteTheme = (id: string, name: string) => {
    if (confirm(`确定要删除主题“${name}”吗？`)) {
      setThemes(prev => prev.filter(t => t.id !== id));
      setThemeCurrentPage(1);
    }
  };

  const handleSearchTheme = () => {
    setAppliedSearchThemeName(searchThemeName.trim());
    setThemeCurrentPage(1);
  };

  const handleResetThemeSearch = () => {
    setSearchThemeName('');
    setAppliedSearchThemeName('');
    setThemeCurrentPage(1);
  };

  const filteredThemes = themes.filter(thm => {
    if (appliedSearchThemeName && !thm.name.toLowerCase().includes(appliedSearchThemeName.toLowerCase())) {
      return false;
    }
    return true;
  });

  const totalThemeItems = filteredThemes.length;
  const totalThemePages = Math.ceil(totalThemeItems / themePageSize) || 1;
  const validThemeCurrentPage = Math.min(themeCurrentPage, totalThemePages);
  const paginatedThemes = filteredThemes.slice(
    (validThemeCurrentPage - 1) * themePageSize,
    validThemeCurrentPage * themePageSize
  );

  // Filter logic for Inspection Logs (PUB-03)
  const filteredLogs = MOCK_INSPECTION_LOGS.filter(log => {
    const { targetType, campus, dateStart, dateEnd, result, inspector } = appliedLogFilter;

    // 1. 巡检对象类型
    if (targetType !== 'ALL') {
      if (targetType === 'TUNNEL_ZONE') {
        if (log.targetType !== 'TUNNEL_ZONE' && !log.targetName.includes('芙蓉隧道')) return false;
      } else if (targetType === 'POSTER_BOARD') {
        if (log.targetType !== 'POSTER_BOARD' && !log.targetName.includes('张贴栏') && !log.targetName.includes('宣传栏')) return false;
      }
    }

    // 2. 巡检校区
    if (campus !== 'ALL') {
      const logCampusName = log.campus || (log.targetName.includes('思明') ? '思明校区' : log.targetName.includes('翔安') ? '翔安校区' : log.targetName.includes('樟宜') ? '樟宜校区' : log.targetName.includes('漳州') ? '漳州校区' : '思明校区');
      if (logCampusName !== campus) return false;
    }

    // 3. 巡检时间范围
    const logDate = log.checkTime.split(' ')[0];
    if (dateStart && logDate < dateStart) {
      return false;
    }
    if (dateEnd && logDate > dateEnd) {
      return false;
    }

    // 4. 巡检结论
    if (result !== 'ALL') {
      if (result === 'NORMAL' && log.result !== 'NORMAL' && log.result !== '正常' && log.result !== '正常确认') return false;
      if (result === 'ABNORMAL' && log.result !== 'ABNORMAL' && log.result !== '异常' && log.result !== '发现异常') return false;
    }

    // 5. 巡检员
    if (inspector.trim() && !log.inspectorName.toLowerCase().includes(inspector.trim().toLowerCase())) {
      return false;
    }

    return true;
  });

  const totalLogItems = filteredLogs.length;
  const totalLogPages = Math.ceil(totalLogItems / logPageSize) || 1;
  const validLogCurrentPage = Math.min(logCurrentPage, totalLogPages);
  const paginatedLogs = filteredLogs.slice(
    (validLogCurrentPage - 1) * logPageSize,
    validLogCurrentPage * logPageSize
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header title for sub-tabs */}
      {activeTab === 'PUB-01' ? (
        <div className="flex items-center justify-between pb-2 border-b border-gray-100/80">
          <div className="flex items-center">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full mr-3 shadow-sm"></div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">
              组织角色设置
            </h1>
          </div>
        </div>
      ) : activeTab === 'PUB-08' ? (
        <div className="flex items-center justify-between pb-2 border-b border-gray-100/80">
          <div className="flex items-center">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full mr-3 shadow-sm"></div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">
              审批角色设置
            </h1>
          </div>
        </div>
      ) : activeTab === 'PUB-03' ? (
        <div className="flex items-center justify-between pb-2 border-b border-gray-100/80">
          <div className="flex items-center">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full mr-3 shadow-sm"></div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">
              巡检记录
            </h1>
          </div>
        </div>
      ) : activeTab === 'PUB-07' ? (
        <div className="flex items-center justify-between pb-2 border-b border-gray-100/80">
          <div className="flex items-center">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full mr-3 shadow-sm"></div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">
              巡检规则设置
            </h1>
          </div>
        </div>
      ) : activeTab === 'PUB-06' ? (
        <div className="flex items-center justify-between pb-2 border-b border-gray-100/80">
          <div className="flex items-center">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full mr-3 shadow-sm"></div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">
              涂鸦主题管理
            </h1>
          </div>
          <button
            type="button"
            onClick={handleOpenAddThemeModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={14} />
            <span>新建涂鸦主题</span>
          </button>
        </div>
      ) : activeTab === 'PUB-02' ? (
        <div className="flex items-center justify-between pb-2 border-b border-gray-100/80">
          <div className="flex items-center">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full mr-3 shadow-sm"></div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">
              巡检员管理
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setShowAddTeamModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={14} />
            <span>新增巡检班组</span>
          </button>
        </div>
      ) : activeTab === 'PUB-04' ? (
        <div className="flex items-center justify-between pb-2 border-b border-gray-100/80">
          <div className="flex items-center">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full mr-3 shadow-sm"></div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">
              巡检预警
            </h1>
          </div>
        </div>
      ) : activeTab === 'PUB-05' ? (
        <div className="flex items-center justify-between pb-2 border-b border-gray-100/80">
          <div className="flex items-center">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full mr-3 shadow-sm"></div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">
              违规事件管理
            </h1>
          </div>
        </div>
      ) : (
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="text-base font-black text-gray-900">公共设置模块</h2>
              <p className="text-xs text-gray-400">配置巡检人员、预警监控、违规下发及巡检规则设置</p>
            </div>
          </div>

          {/* Sub-tab pills */}
          <div className="flex items-center gap-1.5 bg-gray-50 p-1.5 rounded-xl border border-gray-100 overflow-x-auto no-scrollbar">
            {[
              { id: 'PUB-01', label: '组织角色设置', icon: <ShieldCheck size={14} /> },
              { id: 'PUB-08', label: '审批角色设置', icon: <UserCheck size={14} /> },
              { id: 'PUB-02', label: '巡检员管理', icon: <Users size={14} /> },
              { id: 'PUB-03', label: '巡检记录', icon: <FileText size={14} /> },
              { id: 'PUB-04', label: '巡检预警', icon: <AlertTriangle size={14} /> },
              { id: 'PUB-05', label: '违规事件管理', icon: <ShieldAlert size={14} /> },
              { id: 'PUB-06', label: '涂鸦主题管理', icon: <Tag size={14} /> },
              { id: 'PUB-07', label: '巡检规则设置', icon: <QrCode size={14} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
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

      {/* PUB-01: 组织角色设置 (2 Column Layout) */}
      {activeTab === 'PUB-01' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* 左侧：组织结构树 (Source: https://www.xmu.edu.cn/sdgl/zzjg.htm) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Building2 size={16} className="text-blue-600" />
                <h3 className="font-bold text-gray-900 text-sm">组织结构</h3>
              </div>
            </div>

            {/* 搜索框 */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={14} />
              <input
                type="text"
                value={treeSearchKeyword}
                onChange={e => setTreeSearchKeyword(e.target.value)}
                placeholder="搜索部门 / 学院名称..."
                className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-gray-400"
              />
              {treeSearchKeyword && (
                <button
                  onClick={() => setTreeSearchKeyword('')}
                  className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* 树结构列表 */}
            <div className="max-h-[680px] overflow-y-auto space-y-1.5 pr-1 text-xs">
              {XMU_ORG_TREE_DATA.map(group => {
                const isGroupExpanded = expandedGroupIds.has(group.id);
                const filteredChildren = group.children?.filter(c => 
                  !treeSearchKeyword || c.name.toLowerCase().includes(treeSearchKeyword.toLowerCase())
                ) || [];

                if (treeSearchKeyword && filteredChildren.length === 0 && !group.name.toLowerCase().includes(treeSearchKeyword.toLowerCase())) {
                  return null;
                }

                return (
                  <div key={group.id} className="space-y-1">
                    {/* 顶级节点 / 学部分组 */}
                    <button
                      onClick={() => toggleGroupExpand(group.id)}
                      className="w-full flex items-center justify-between p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-800 font-bold transition-colors cursor-pointer text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        {isGroupExpanded ? (
                          <ChevronDown size={14} className="text-gray-500 shrink-0" />
                        ) : (
                          <ChevronRight size={14} className="text-gray-500 shrink-0" />
                        )}
                        {isGroupExpanded ? (
                          <FolderOpen size={15} className="text-blue-600 shrink-0" />
                        ) : (
                          <Folder size={15} className="text-blue-500 shrink-0" />
                        )}
                        <span className="truncate">{group.name}</span>
                      </div>
                      <span className="text-[10px] bg-white text-gray-500 px-1.5 py-0.5 rounded-md border border-gray-200 font-semibold shrink-0">
                        {group.children?.length || 0}
                      </span>
                    </button>

                    {/* 子节点列表 */}
                    {isGroupExpanded && (
                      <div className="pl-4 space-y-1 border-l-2 border-gray-100 ml-3 my-1">
                        {filteredChildren.map(child => {
                          const isSelected = selectedOrgId === child.id;
                          const childRoles = getOrgRoleConfig(child.id);
                          const totalPersons = childRoles.counselors.length + childRoles.oaSecretaries.length + childRoles.deptLeaders.length;

                          return (
                            <button
                              key={child.id}
                              onClick={() => setSelectedOrgId(child.id)}
                              className={`w-full text-left p-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer group border ${
                                isSelected
                                  ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-sm shadow-blue-500/20'
                                  : 'bg-white text-gray-700 hover:bg-blue-50/50 hover:text-blue-600 border-transparent hover:border-blue-100'
                              }`}
                            >
                              <span className="truncate pr-2">{child.name}</span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-md shrink-0 font-bold transition-colors ${
                                isSelected
                                  ? 'bg-white/20 text-white'
                                  : 'bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-700'
                              }`}>
                                {totalPersons} 人
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 右侧：角色设置界面 (包括：辅导员、OA 秘书、单位负责人。这些都可以多个人。) */}
          <div className="lg:col-span-8 space-y-5">
            {/* 当前选中单位 Header 卡片 */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
                <div>
                  <h2 className="text-base font-black text-gray-900">
                    {selectedNode.name}
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-xl border border-gray-100 font-bold">
                    辅导员: <strong className="text-blue-600">{activeRoleConfig.counselors.length}</strong> 人
                  </span>
                  <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-xl border border-gray-100 font-bold">
                    OA 秘书: <strong className="text-blue-600">{activeRoleConfig.oaSecretaries.length}</strong> 人
                  </span>
                  <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-xl border border-gray-100 font-bold">
                    单位负责人: <strong className="text-blue-600">{activeRoleConfig.deptLeaders.length}</strong> 人
                  </span>
                </div>
              </div>

              {/* 三个角色设置板块：1. 辅导员 2. OA 秘书 3. 单位负责人 */}
              <div className="space-y-5 pt-2">
                {/* 1. 辅导员 */}
                <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="text-blue-600" size={18} />
                      <h4 className="font-bold text-gray-900 text-sm">辅导员</h4>
                      <span className="px-2 py-0.5 bg-blue-100/80 text-blue-700 font-black text-[10px] rounded-full">
                        {activeRoleConfig.counselors.length} 人
                      </span>
                    </div>
                    <button
                      onClick={() => setAddPersonModal({ isOpen: true, roleType: 'counselors', roleTitle: '辅导员' })}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
                    >
                      <UserPlus size={14} />
                      <span>添加辅导员</span>
                    </button>
                  </div>

                  {/* 人员卡片网格 */}
                  {activeRoleConfig.counselors.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {activeRoleConfig.counselors.map(person => (
                        <div key={person.id} className="bg-white p-3 rounded-xl border border-gray-200/80 shadow-2xs space-y-1.5 relative group hover:border-blue-300 transition-all">
                          <div className="flex items-center justify-between">
                            <span className="font-black text-gray-900 text-xs">{person.name}</span>
                            <button
                              onClick={() => handleRemovePersonFromRole('counselors', person.id)}
                              className="text-gray-300 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                              title="移除人员"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                          <div className="text-[11px] text-gray-500 space-y-0.5">
                            <p className="flex items-center gap-1 text-[10px] text-gray-600 font-medium">
                              <span className="text-gray-400">工号/学号:</span> {person.workId}
                            </p>
                            <p className="flex items-center gap-1 text-[10px] text-gray-600 font-medium truncate">
                              <Phone size={10} className="text-gray-400 shrink-0" />
                              <span>{person.phone}</span>
                            </p>
                            {person.email && (
                              <p className="flex items-center gap-1 text-[10px] text-gray-600 font-medium truncate">
                                <Mail size={10} className="text-gray-400 shrink-0" />
                                <span>{person.email}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white/80 p-4 rounded-xl border border-dashed border-gray-200 text-center text-xs text-gray-400 font-medium">
                      暂未添加辅导员，点击右上角按钮添加人员
                    </div>
                  )}
                </div>

                {/* 2. OA 秘书 */}
                <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Briefcase className="text-indigo-600" size={18} />
                      <h4 className="font-bold text-gray-900 text-sm">OA 秘书</h4>
                      <span className="px-2 py-0.5 bg-indigo-100/80 text-indigo-700 font-black text-[10px] rounded-full">
                        {activeRoleConfig.oaSecretaries.length} 人
                      </span>
                    </div>
                    <button
                      onClick={() => setAddPersonModal({ isOpen: true, roleType: 'oaSecretaries', roleTitle: 'OA 秘书' })}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-sm shadow-indigo-500/20 transition-all cursor-pointer"
                    >
                      <UserPlus size={14} />
                      <span>添加 OA 秘书</span>
                    </button>
                  </div>

                  {/* 人员卡片网格 */}
                  {activeRoleConfig.oaSecretaries.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {activeRoleConfig.oaSecretaries.map(person => (
                        <div key={person.id} className="bg-white p-3 rounded-xl border border-gray-200/80 shadow-2xs space-y-1.5 relative group hover:border-indigo-300 transition-all">
                          <div className="flex items-center justify-between">
                            <span className="font-black text-gray-900 text-xs">{person.name}</span>
                            <button
                              onClick={() => handleRemovePersonFromRole('oaSecretaries', person.id)}
                              className="text-gray-300 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                              title="移除人员"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                          <div className="text-[11px] text-gray-500 space-y-0.5">
                            <p className="flex items-center gap-1 text-[10px] text-gray-600 font-medium">
                              <span className="text-gray-400">工号/学号:</span> {person.workId}
                            </p>
                            <p className="flex items-center gap-1 text-[10px] text-gray-600 font-medium truncate">
                              <Phone size={10} className="text-gray-400 shrink-0" />
                              <span>{person.phone}</span>
                            </p>
                            {person.email && (
                              <p className="flex items-center gap-1 text-[10px] text-gray-600 font-medium truncate">
                                <Mail size={10} className="text-gray-400 shrink-0" />
                                <span>{person.email}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white/80 p-4 rounded-xl border border-dashed border-gray-200 text-center text-xs text-gray-400 font-medium">
                      暂未添加 OA 秘书，点击右上角按钮添加人员
                    </div>
                  )}
                </div>

                {/* 3. 单位负责人 */}
                <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserCheck className="text-emerald-600" size={18} />
                      <h4 className="font-bold text-gray-900 text-sm">单位负责人</h4>
                      <span className="px-2 py-0.5 bg-emerald-100/80 text-emerald-700 font-black text-[10px] rounded-full">
                        {activeRoleConfig.deptLeaders.length} 人
                      </span>
                    </div>
                    <button
                      onClick={() => setAddPersonModal({ isOpen: true, roleType: 'deptLeaders', roleTitle: '单位负责人' })}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-sm shadow-emerald-500/20 transition-all cursor-pointer"
                    >
                      <UserPlus size={14} />
                      <span>添加单位负责人</span>
                    </button>
                  </div>

                  {/* 人员卡片网格 */}
                  {activeRoleConfig.deptLeaders.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {activeRoleConfig.deptLeaders.map(person => (
                        <div key={person.id} className="bg-white p-3 rounded-xl border border-gray-200/80 shadow-2xs space-y-1.5 relative group hover:border-emerald-300 transition-all">
                          <div className="flex items-center justify-between">
                            <span className="font-black text-gray-900 text-xs">{person.name}</span>
                            <button
                              onClick={() => handleRemovePersonFromRole('deptLeaders', person.id)}
                              className="text-gray-300 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                              title="移除人员"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                          <div className="text-[11px] text-gray-500 space-y-0.5">
                            <p className="flex items-center gap-1 text-[10px] text-gray-600 font-medium">
                              <span className="text-gray-400">工号/学号:</span> {person.workId}
                            </p>
                            <p className="flex items-center gap-1 text-[10px] text-gray-600 font-medium truncate">
                              <Phone size={10} className="text-gray-400 shrink-0" />
                              <span>{person.phone}</span>
                            </p>
                            {person.email && (
                              <p className="flex items-center gap-1 text-[10px] text-gray-600 font-medium truncate">
                                <Mail size={10} className="text-gray-400 shrink-0" />
                                <span>{person.email}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white/80 p-4 rounded-xl border border-dashed border-gray-200 text-center text-xs text-gray-400 font-medium">
                      暂未添加单位负责人，点击右上角按钮添加人员
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PUB-08: 审批角色设置 (思明校区 / 翔安校区) */}
      {activeTab === 'PUB-08' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* 左侧：校区 Tab 切换 */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <Building2 size={16} className="text-blue-600" />
              <h3 className="font-bold text-gray-900 text-sm">校区选择</h3>
            </div>

            <div className="space-y-2">
              {[
                { id: 'siming', name: '思明校区', subText: '主校区宣发审批' },
                { id: 'xiangan', name: '翔安校区', subText: '翔安校区宣发审批' }
              ].map(campus => {
                const isSelected = activeCampus === campus.id;
                const config = campusRolesMap[campus.id] || { leagueOfficers: [], unionOfficers: [] };
                const totalCount = config.leagueOfficers.length + config.unionOfficers.length;

                return (
                  <button
                    key={campus.id}
                    onClick={() => setActiveCampus(campus.id as 'siming' | 'xiangan')}
                    className={`w-full text-left p-3.5 rounded-2xl text-xs transition-all cursor-pointer flex items-center justify-between border ${
                      isSelected
                        ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-sm shadow-blue-500/20'
                        : 'bg-white text-gray-700 hover:bg-blue-50/50 hover:text-blue-600 border-gray-200/80 hover:border-blue-100'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="font-black text-sm">{campus.name}</div>
                      <div className={`text-[10px] ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>
                        {campus.subText}
                      </div>
                    </div>
                    <span className={`text-[10px] px-2.5 py-1 rounded-lg font-bold shrink-0 ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {totalCount} 人
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 右侧：当前校区的审批角色配置 (团委审批员、学生会审批员) */}
          <div className="lg:col-span-9 space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <span>{activeCampus === 'siming' ? '思明校区' : '翔安校区'}</span>
                  <span className="text-xs font-normal text-gray-400">| 审批角色配置</span>
                </h2>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-xl border border-blue-100 font-bold">
                    团委审批员: <strong>{(campusRolesMap[activeCampus] || { leagueOfficers: [] }).leagueOfficers.length}</strong> 人
                  </span>
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-xl border border-purple-100 font-bold">
                    学生会审批员: <strong>{(campusRolesMap[activeCampus] || { unionOfficers: [] }).unionOfficers.length}</strong> 人
                  </span>
                </div>
              </div>

              {/* 板块 1: 团委审批员 */}
              <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="text-blue-600" size={18} />
                    <h4 className="font-bold text-gray-900 text-sm">团委审批员</h4>
                    <span className="px-2 py-0.5 bg-blue-100/80 text-blue-700 font-black text-[10px] rounded-full">
                      {(campusRolesMap[activeCampus] || { leagueOfficers: [] }).leagueOfficers.length} 人
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setNewPersonName('');
                      setNewPersonWorkId('');
                      setNewPersonPhone('');
                      setNewPersonEmail('');
                      setAddApprovalModal({
                        isOpen: true,
                        campusKey: activeCampus,
                        roleType: 'leagueOfficers',
                        roleTitle: '团委审批员'
                      });
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
                  >
                    <UserPlus size={14} />
                    <span>添加团委审批员</span>
                  </button>
                </div>

                {(campusRolesMap[activeCampus] || { leagueOfficers: [] }).leagueOfficers.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {(campusRolesMap[activeCampus] || { leagueOfficers: [] }).leagueOfficers.map(person => (
                      <div key={person.id} className="bg-white p-3 rounded-xl border border-gray-200/80 shadow-2xs space-y-1.5 relative group hover:border-blue-300 transition-all">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-gray-900 text-xs">{person.name}</span>
                          <button
                            onClick={() => handleRemoveApprovalPerson(activeCampus, 'leagueOfficers', person.id)}
                            className="text-gray-300 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                            title="移除人员"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                        <div className="text-[11px] text-gray-500 space-y-0.5">
                          <p className="flex items-center gap-1 text-[10px] text-gray-600 font-medium">
                            <span className="text-gray-400">工号/学号:</span> {person.workId}
                          </p>
                          <p className="flex items-center gap-1 text-[10px] text-gray-600 font-medium truncate">
                            <Phone size={10} className="text-gray-400 shrink-0" />
                            <span>{person.phone}</span>
                          </p>
                          {person.email && (
                            <p className="flex items-center gap-1 text-[10px] text-gray-600 font-medium truncate">
                              <Mail size={10} className="text-gray-400 shrink-0" />
                              <span>{person.email}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white/80 p-4 rounded-xl border border-dashed border-gray-200 text-center text-xs text-gray-400 font-medium">
                    暂未添加团委审批员，点击右上角按钮添加人员
                  </div>
                )}
              </div>

              {/* 板块 2: 学生会审批员 */}
              <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="text-purple-600" size={18} />
                    <h4 className="font-bold text-gray-900 text-sm">学生会审批员</h4>
                    <span className="px-2 py-0.5 bg-purple-100/80 text-purple-700 font-black text-[10px] rounded-full">
                      {(campusRolesMap[activeCampus] || { unionOfficers: [] }).unionOfficers.length} 人
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setNewPersonName('');
                      setNewPersonWorkId('');
                      setNewPersonPhone('');
                      setNewPersonEmail('');
                      setAddApprovalModal({
                        isOpen: true,
                        campusKey: activeCampus,
                        roleType: 'unionOfficers',
                        roleTitle: '学生会审批员'
                      });
                    }}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-sm shadow-purple-500/20 transition-all cursor-pointer"
                  >
                    <UserPlus size={14} />
                    <span>添加学生会审批员</span>
                  </button>
                </div>

                {(campusRolesMap[activeCampus] || { unionOfficers: [] }).unionOfficers.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {(campusRolesMap[activeCampus] || { unionOfficers: [] }).unionOfficers.map(person => (
                      <div key={person.id} className="bg-white p-3 rounded-xl border border-gray-200/80 shadow-2xs space-y-1.5 relative group hover:border-purple-300 transition-all">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-gray-900 text-xs">{person.name}</span>
                          <button
                            onClick={() => handleRemoveApprovalPerson(activeCampus, 'unionOfficers', person.id)}
                            className="text-gray-300 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                            title="移除人员"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                        <div className="text-[11px] text-gray-500 space-y-0.5">
                          <p className="flex items-center gap-1 text-[10px] text-gray-600 font-medium">
                            <span className="text-gray-400">工号/学号:</span> {person.workId}
                          </p>
                          <p className="flex items-center gap-1 text-[10px] text-gray-600 font-medium truncate">
                            <Phone size={10} className="text-gray-400 shrink-0" />
                            <span>{person.phone}</span>
                          </p>
                          {person.email && (
                            <p className="flex items-center gap-1 text-[10px] text-gray-600 font-medium truncate">
                              <Mail size={10} className="text-gray-400 shrink-0" />
                              <span>{person.email}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white/80 p-4 rounded-xl border border-dashed border-gray-200 text-center text-xs text-gray-400 font-medium">
                    暂未添加学生会审批员，点击右上角按钮添加人员
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: 添加审批角色人员 (团委审批员 / 学生会审批员) */}
      {addApprovalModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-5 animate-in fade-in zoom-in-95 duration-200 my-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus size={18} className="text-blue-600" />
                <h3 className="font-black text-gray-900 text-sm">
                  添加【{addApprovalModal.roleTitle}】人员
                </h3>
              </div>
              <button
                onClick={() => setAddApprovalModal(prev => ({ ...prev, isOpen: false }))}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="text-xs bg-blue-50/80 text-blue-800 p-3 rounded-xl border border-blue-100/80 space-y-1">
              <p className="font-bold">所属校区：{addApprovalModal.campusKey === 'siming' ? '思明校区' : '翔安校区'}</p>
              <p className="text-[11px] text-blue-600">添加后该人员将拥有【{addApprovalModal.roleTitle}】的跨单位宣传审核审批权限</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">人员姓名 <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={newPersonName}
                  onChange={e => setNewPersonName(e.target.value)}
                  placeholder="请输入人员姓名 (例：李伟)"
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">工号 / 学号</label>
                <input
                  type="text"
                  value={newPersonWorkId}
                  onChange={e => setNewPersonWorkId(e.target.value)}
                  placeholder="请输入教工号或学号 (例：352202888)"
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">联系手机</label>
                <input
                  type="text"
                  value={newPersonPhone}
                  onChange={e => setNewPersonPhone(e.target.value)}
                  placeholder="请输入手机号码 (例：13859200000)"
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">电子邮箱</label>
                <input
                  type="email"
                  value={newPersonEmail}
                  onChange={e => setNewPersonEmail(e.target.value)}
                  placeholder="请输入电子邮箱 (例：liwei@xmu.edu.cn)"
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white bg-gray-50/50"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setAddApprovalModal(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleAddApprovalPerson}
                disabled={!newPersonName.trim()}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                确认添加
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: 添加角色人员 (针对 辅导员 / OA 秘书 / 单位负责人) */}
      {addPersonModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-5 animate-in fade-in zoom-in-95 duration-200 my-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus size={18} className="text-blue-600" />
                <h3 className="font-black text-gray-900 text-sm">
                  添加【{addPersonModal.roleTitle}】人员
                </h3>
              </div>
              <button
                onClick={() => setAddPersonModal(prev => ({ ...prev, isOpen: false }))}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="text-xs bg-blue-50/80 text-blue-800 p-3 rounded-xl border border-blue-100/80 space-y-1">
              <p className="font-bold">所属单位：{selectedNode.name}</p>
              <p className="text-[11px] text-blue-600">添加后将赋予该人员【{addPersonModal.roleTitle}】的审批核查或签发管理权限</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">人员姓名 <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={newPersonName}
                  onChange={e => setNewPersonName(e.target.value)}
                  placeholder="请输入人员姓名 (例：张建华)"
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">工号 / 学号</label>
                <input
                  type="text"
                  value={newPersonWorkId}
                  onChange={e => setNewPersonWorkId(e.target.value)}
                  placeholder="请输入教工号或学号 (例：352202688)"
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">联系手机</label>
                <input
                  type="text"
                  value={newPersonPhone}
                  onChange={e => setNewPersonPhone(e.target.value)}
                  placeholder="请输入手机号码 (例：13859200000)"
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">电子邮箱</label>
                <input
                  type="email"
                  value={newPersonEmail}
                  onChange={e => setNewPersonEmail(e.target.value)}
                  placeholder="请输入电子邮箱 (例：zhangjh@xmu.edu.cn)"
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white bg-gray-50/50"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setAddPersonModal(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleAddPersonToRole}
                disabled={!newPersonName.trim()}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                确认添加
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PUB-02: 巡检员管理 (巡检班组) */}
      {activeTab === 'PUB-02' && (
        <div className="space-y-4">
          {/* Search Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              {/* 工作校区 */}
              <div className="space-y-1.5">
                <label className="block text-gray-500 font-bold">工作校区</label>
                <select
                  value={teamSearchCampus}
                  onChange={e => setTeamSearchCampus(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-medium cursor-pointer"
                >
                  <option value="ALL">全部</option>
                  <option value="思明校区">思明校区</option>
                  <option value="翔安校区">翔安校区</option>
                  <option value="漳州校区">漳州校区</option>
                  <option value="樟宜校区">樟宜校区</option>
                </select>
              </div>

              {/* 班组名称 */}
              <div className="space-y-1.5">
                <label className="block text-gray-500 font-bold">班组名称</label>
                <input
                  type="text"
                  value={teamSearchName}
                  onChange={e => setTeamSearchName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSearchTeam(); }}
                  placeholder="请输入班组名称..."
                  className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={handleSearchTeam}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1 cursor-pointer"
              >
                <Search size={13} />
                <span>查询</span>
              </button>
              <button
                type="button"
                onClick={handleResetTeamSearch}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <span>重置</span>
              </button>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/90 text-gray-600 font-bold border-b border-gray-100">
                  <tr>
                    <th className="py-3.5 px-4 min-w-[110px]">工作校区</th>
                    <th className="py-3.5 px-4 min-w-[160px]">班组名称</th>
                    <th className="py-3.5 px-4 min-w-[110px]">负责人</th>
                    <th className="py-3.5 px-4 min-w-[120px]">学号</th>
                    <th className="py-3.5 px-4 min-w-[110px]">在岗成员数</th>
                    <th className="py-3.5 px-4 text-center min-w-[220px]">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {paginatedTeams.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-gray-400 font-medium">
                        暂无符合条件的巡检班组数据
                      </td>
                    </tr>
                  ) : (
                    paginatedTeams.map(team => (
                      <tr key={team.id} className="hover:bg-blue-50/20 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-gray-900">{team.campus}</td>
                        <td className="py-3.5 px-4 font-bold text-blue-600">{team.teamName}</td>
                        <td className="py-3.5 px-4 text-gray-800 font-bold">{team.leader}</td>
                        <td className="py-3.5 px-4 font-mono font-medium text-gray-700">{team.leaderStudentId || '352202688'}</td>
                        <td className="py-3.5 px-4 font-bold text-gray-900">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                            {team.activeMemberCount} 人在岗
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => setViewingTeam(team)}
                              className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200/80 rounded-xl font-bold text-xs shadow-2xs transition-all cursor-pointer"
                            >
                              查看
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingTeam({ ...team })}
                              className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200/80 rounded-xl font-bold text-xs shadow-2xs transition-all cursor-pointer"
                            >
                              编辑
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setManagingTeamMembers({ ...team });
                                handleResetMemberSearch();
                              }}
                              className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200/80 rounded-xl font-bold text-xs shadow-2xs transition-all cursor-pointer"
                            >
                              成员管理
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="px-4 py-3 bg-gray-50/60 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3 text-xs text-gray-600">
              <div className="flex items-center gap-3">
                <span>显示 <strong className="text-gray-900 font-bold">{totalTeamItems > 0 ? (validTeamCurrentPage - 1) * teamPageSize + 1 : 0}</strong> 到 <strong className="text-gray-900 font-bold">{Math.min(validTeamCurrentPage * teamPageSize, totalTeamItems)}</strong> 条，共 <strong className="text-blue-600 font-bold">{totalTeamItems}</strong> 条记录</span>
                <div className="flex items-center gap-1.5">
                  <span>每页</span>
                  <select
                    value={teamPageSize}
                    onChange={e => {
                      setTeamPageSize(Number(e.target.value));
                      setTeamCurrentPage(1);
                    }}
                    className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs outline-none focus:border-blue-500 font-medium cursor-pointer"
                  >
                    <option value={5}>5 条</option>
                    <option value={10}>10 条</option>
                    <option value={20}>20 条</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={validTeamCurrentPage <= 1}
                  onClick={() => setTeamCurrentPage(prev => Math.max(1, prev - 1))}
                  className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title="上一页"
                >
                  <ChevronLeft size={14} />
                </button>

                {Array.from({ length: totalTeamPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setTeamCurrentPage(page)}
                    className={`min-w-[28px] h-7 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      page === validTeamCurrentPage
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={validTeamCurrentPage >= totalTeamPages}
                  onClick={() => setTeamCurrentPage(prev => Math.min(totalTeamPages, prev + 1))}
                  className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title="下一页"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PUB-03: 巡检记录 */}
      {activeTab === 'PUB-03' && (
        <div className="space-y-4">
          {/* 查询条件区域 */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100/80">
              <Search size={16} className="text-blue-600" />
              <h3 className="text-xs font-black text-gray-800">查询条件</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              {/* 巡检对象类型 */}
              <div className="space-y-1.5">
                <label className="block text-gray-500 font-bold">巡检对象类型</label>
                <select
                  value={logTargetTypeInput}
                  onChange={(e) => setLogTargetTypeInput(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 transition-all font-medium text-gray-800 outline-none cursor-pointer"
                >
                  <option value="ALL">全部</option>
                  <option value="TUNNEL_ZONE">芙蓉隧道</option>
                  <option value="POSTER_BOARD">公共海报栏</option>
                </select>
              </div>

              {/* 巡检校区 */}
              <div className="space-y-1.5">
                <label className="block text-gray-500 font-bold">巡检校区</label>
                <select
                  value={logCampusInput}
                  onChange={(e) => setLogCampusInput(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 transition-all font-medium text-gray-800 outline-none cursor-pointer"
                >
                  <option value="ALL">全部</option>
                  <option value="思明校区">思明校区</option>
                  <option value="翔安校区">翔安校区</option>
                  <option value="樟宜校区">樟宜校区</option>
                  <option value="漳州校区">漳州校区</option>
                </select>
              </div>

              {/* 巡检时间 */}
              <div className="space-y-1.5">
                <label className="block text-gray-500 font-bold">巡检时间</label>
                <div className="flex items-center gap-1">
                  <input
                    type="date"
                    value={logDateStartInput}
                    onChange={(e) => setLogDateStartInput(e.target.value)}
                    className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 transition-all text-xs font-mono text-gray-800 outline-none cursor-pointer"
                  />
                  <span className="text-gray-400 font-bold">-</span>
                  <input
                    type="date"
                    value={logDateEndInput}
                    onChange={(e) => setLogDateEndInput(e.target.value)}
                    className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 transition-all text-xs font-mono text-gray-800 outline-none cursor-pointer"
                  />
                </div>
              </div>

              {/* 巡检结论 */}
              <div className="space-y-1.5">
                <label className="block text-gray-500 font-bold">巡检结论</label>
                <select
                  value={logResultInput}
                  onChange={(e) => setLogResultInput(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 transition-all font-medium text-gray-800 outline-none cursor-pointer"
                >
                  <option value="ALL">全部</option>
                  <option value="NORMAL">正常</option>
                  <option value="ABNORMAL">异常</option>
                </select>
              </div>

              {/* 巡检员 */}
              <div className="space-y-1.5">
                <label className="block text-gray-500 font-bold">巡检员</label>
                <input
                  type="text"
                  placeholder="输入巡检员姓名"
                  value={logInspectorInput}
                  onChange={(e) => setLogInspectorInput(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 transition-all font-medium text-gray-800 outline-none"
                />
              </div>
            </div>

            {/* 查询与重置按钮 */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100/80">
              <button
                type="button"
                onClick={handleResetLogFilter}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                重置
              </button>
              <button
                type="button"
                onClick={handleSearchLog}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Search size={14} />
                <span>查询</span>
              </button>
            </div>
          </div>

          {/* 巡检记录列表数据表格 */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="overflow-x-auto relative border border-gray-100 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-gray-50/90 text-gray-500 font-bold border-b border-gray-100">
                  <tr>
                    <th className="py-4 px-4 whitespace-nowrap sticky left-0 z-20 bg-gray-50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] min-w-[150px]">巡检时间</th>
                    <th className="py-4 px-4 whitespace-nowrap min-w-[120px]">巡检对象类型</th>
                    <th className="py-4 px-4 whitespace-nowrap min-w-[110px]">巡检校区</th>
                    <th className="py-4 px-4 whitespace-nowrap min-w-[200px]">巡检对象</th>
                    <th className="py-4 px-4 whitespace-nowrap min-w-[100px]">巡检结论</th>
                    <th className="py-4 px-4 whitespace-nowrap min-w-[100px]">巡检员</th>
                    <th className="py-4 px-4 text-center whitespace-nowrap sticky right-0 z-20 bg-gray-50 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.06)] min-w-[100px]">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {paginatedLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-gray-400">
                        暂无符合条件的巡检记录
                      </td>
                    </tr>
                  ) : (
                    paginatedLogs.map((log) => {
                      const objectTypeLabel = log.targetType === 'TUNNEL_ZONE' || log.targetName.includes('芙蓉隧道') ? '芙蓉隧道' : '公共海报栏';
                      const campusLabel = log.campus || (log.targetName.includes('思明') ? '思明校区' : log.targetName.includes('翔安') ? '翔安校区' : log.targetName.includes('樟宜') ? '樟宜校区' : log.targetName.includes('漳州') ? '漳州校区' : '思明校区');
                      const isNormal = log.result === 'NORMAL' || log.result === '正常' || log.result === '正常确认';

                      return (
                        <tr key={log.id} className="hover:bg-blue-50/30 transition-colors group">
                          <td className="py-3 px-4 whitespace-nowrap font-mono text-gray-600 sticky left-0 z-10 bg-white group-hover:bg-slate-50 transition-colors shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">
                            {log.checkTime}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                              objectTypeLabel === '芙蓉隧道'
                                ? 'bg-purple-50 text-purple-700 border-purple-200/80'
                                : 'bg-blue-50 text-blue-700 border-blue-200/80'
                            }`}>
                              {objectTypeLabel}
                            </span>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap font-medium text-gray-800">
                            {campusLabel}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap font-bold text-gray-900">
                            {log.targetName}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                              isNormal
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                                : 'bg-rose-50 text-rose-700 border-rose-200/80'
                            }`}>
                              {isNormal ? '正常' : '异常'}
                            </span>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap font-bold text-gray-800">
                            {log.inspectorName}
                          </td>
                          <td className="py-3 px-4 text-center whitespace-nowrap sticky right-0 z-10 bg-white group-hover:bg-slate-50 transition-colors shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.06)]">
                            <button
                              onClick={() => setViewingLog(log)}
                              className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold transition-all flex items-center gap-1 mx-auto cursor-pointer"
                            >
                              <Eye size={13} />
                              <span>查看</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
              <div className="flex items-center gap-3">
                <span>显示 <strong className="text-gray-900 font-bold">{totalLogItems > 0 ? (validLogCurrentPage - 1) * logPageSize + 1 : 0}</strong> 到 <strong className="text-gray-900 font-bold">{Math.min(validLogCurrentPage * logPageSize, totalLogItems)}</strong> 条，共 <strong className="text-blue-600 font-bold">{totalLogItems}</strong> 条记录</span>
                <div className="flex items-center gap-1.5">
                  <span>每页</span>
                  <select
                    value={logPageSize}
                    onChange={e => {
                      setLogPageSize(Number(e.target.value));
                      setLogCurrentPage(1);
                    }}
                    className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs outline-none focus:border-blue-500 font-medium cursor-pointer"
                  >
                    <option value={5}>5 条</option>
                    <option value={10}>10 条</option>
                    <option value={20}>20 条</option>
                    <option value={50}>50 条</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  disabled={validLogCurrentPage <= 1}
                  onClick={() => setLogCurrentPage(prev => Math.max(1, prev - 1))}
                  className="px-3 py-1.5 rounded-xl border border-gray-200/80 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 font-bold transition-all cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft size={14} />
                  <span>上一页</span>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalLogPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setLogCurrentPage(page)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        validLogCurrentPage === page
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-gray-600 hover:bg-gray-100 border border-gray-200/60'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  disabled={validLogCurrentPage >= totalLogPages}
                  onClick={() => setLogCurrentPage(prev => Math.min(totalLogPages, prev + 1))}
                  className="px-3 py-1.5 rounded-xl border border-gray-200/80 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 font-bold transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>下一页</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PUB-04: 巡检预警 */}
      {activeTab === 'PUB-04' && (
        <div className="space-y-4">
          {/* Search Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              {/* 校区 */}
              <div className="space-y-1.5">
                <label className="block text-gray-500 font-bold">校区</label>
                <select
                  value={warnCampusInput}
                  onChange={e => setWarnCampusInput(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-medium cursor-pointer"
                >
                  <option value="ALL">全部</option>
                  <option value="思明校区">思明校区</option>
                  <option value="翔安校区">翔安校区</option>
                  <option value="漳州校区">漳州校区</option>
                  <option value="樟宜校区">樟宜校区</option>
                </select>
              </div>

              {/* 巡检对象类型 */}
              <div className="space-y-1.5">
                <label className="block text-gray-500 font-bold">巡检对象类型</label>
                <select
                  value={warnTargetTypeInput}
                  onChange={e => setWarnTargetTypeInput(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-medium cursor-pointer"
                >
                  <option value="ALL">全部</option>
                  <option value="芙蓉隧道">芙蓉隧道</option>
                  <option value="公共区域海报栏">公共区域海报栏</option>
                </select>
              </div>

              {/* 预警类型 */}
              <div className="space-y-1.5">
                <label className="block text-gray-500 font-bold">预警类型</label>
                <select
                  value={warnTypeInput}
                  onChange={e => setWarnTypeInput(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-medium cursor-pointer"
                >
                  <option value="ALL">全部</option>
                  <option value="即将超过巡检时间">即将超过巡检时间</option>
                  <option value="超时未巡检">超时未巡检</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={handleSearchWarn}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1 cursor-pointer"
              >
                <Search size={13} />
                <span>查询</span>
              </button>
              <button
                type="button"
                onClick={handleResetWarnFilter}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <span>重置</span>
              </button>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/90 text-gray-600 font-bold border-b border-gray-100">
                  <tr>
                    <th className="py-3.5 px-4 min-w-[100px]">校区</th>
                    <th className="py-3.5 px-4 min-w-[130px]">巡检对象类型</th>
                    <th className="py-3.5 px-4 min-w-[180px]">巡检对象</th>
                    <th className="py-3.5 px-4 min-w-[140px]">最后一次巡检时间</th>
                    <th className="py-3.5 px-4 min-w-[110px]">未巡检时长</th>
                    <th className="py-3.5 px-4 min-w-[130px]">预警类型</th>
                    <th className="py-3.5 px-4 text-center min-w-[120px]">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {paginatedWarnings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-gray-400 font-medium">
                        暂无符合条件的巡检预警数据
                      </td>
                    </tr>
                  ) : (
                    paginatedWarnings.map(warn => (
                      <tr key={warn.id} className="hover:bg-blue-50/20 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-gray-900">{warn.campus}</td>
                        <td className="py-3.5 px-4 text-gray-700 font-medium">{warn.targetType}</td>
                        <td className="py-3.5 px-4 font-bold text-gray-900">{warn.targetName}</td>
                        <td className="py-3.5 px-4 text-gray-500 font-mono">{warn.lastCheckTime}</td>
                        <td className="py-3.5 px-4 text-rose-600 font-bold font-mono">{warn.overdueHours}</td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                            warn.warningType === '即将超过巡检时间'
                              ? 'bg-amber-50 text-amber-600 border-amber-200'
                              : 'bg-rose-50 text-rose-600 border-rose-200'
                          }`}>
                            {warn.warningType}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => alert(`已向巡检员 ${warn.responsibleInspector}（${warn.phone}）发送催促巡检通知！`)}
                            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-lg font-bold text-xs shadow-xs transition-all cursor-pointer inline-flex items-center gap-1"
                          >
                            <Send size={13} />
                            <span>催促巡检</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="px-4 py-3 bg-gray-50/60 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3 text-xs text-gray-600">
              <div className="flex items-center gap-3">
                <span>显示 <strong className="text-gray-900 font-bold">{totalWarnItems > 0 ? (validWarnCurrentPage - 1) * warnPageSize + 1 : 0}</strong> 到 <strong className="text-gray-900 font-bold">{Math.min(validWarnCurrentPage * warnPageSize, totalWarnItems)}</strong> 条，共 <strong className="text-blue-600 font-bold">{totalWarnItems}</strong> 条记录</span>
                <div className="flex items-center gap-1.5">
                  <span>每页</span>
                  <select
                    value={warnPageSize}
                    onChange={e => {
                      setWarnPageSize(Number(e.target.value));
                      setWarnCurrentPage(1);
                    }}
                    className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs outline-none focus:border-blue-500 font-medium cursor-pointer"
                  >
                    <option value={5}>5 条</option>
                    <option value={10}>10 条</option>
                    <option value={20}>20 条</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={validWarnCurrentPage <= 1}
                  onClick={() => setWarnCurrentPage(prev => Math.max(1, prev - 1))}
                  className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title="上一页"
                >
                  <ChevronLeft size={14} />
                </button>

                {Array.from({ length: totalWarnPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setWarnCurrentPage(page)}
                    className={`min-w-[28px] h-7 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      page === validWarnCurrentPage
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={validWarnCurrentPage >= totalWarnPages}
                  onClick={() => setWarnCurrentPage(prev => Math.min(totalWarnPages, prev + 1))}
                  className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title="下一页"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PUB-05: 违规事件管理 */}
      {activeTab === 'PUB-05' && (
        <div className="space-y-4">
          {/* 查询条件 */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* 校区 */}
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">校区</label>
                <select
                  value={vioCampusInput}
                  onChange={e => setVioCampusInput(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-gray-50/50 focus:outline-none focus:border-blue-500 font-medium"
                >
                  <option value="ALL">全部校区</option>
                  <option value="思明校区">思明校区</option>
                  <option value="翔安校区">翔安校区</option>
                  <option value="漳州校区">漳州校区</option>
                  <option value="樟宜校区">樟宜校区</option>
                </select>
              </div>

              {/* 违规对象类型 */}
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">违规对象类型</label>
                <select
                  value={vioTargetTypeInput}
                  onChange={e => setVioTargetTypeInput(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-gray-50/50 focus:outline-none focus:border-blue-500 font-medium"
                >
                  <option value="ALL">全部类型</option>
                  <option value="公共海报栏">公共海报栏</option>
                  <option value="芙蓉隧道">芙蓉隧道</option>
                </select>
              </div>

              {/* 违规对象 */}
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">违规对象</label>
                <input
                  type="text"
                  value={vioTargetNameInput}
                  onChange={e => setVioTargetNameInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSearchVio(); }}
                  placeholder="请输入违规对象..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-gray-50/50 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              {/* 违规类型 */}
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">违规类型</label>
                <select
                  value={vioTypeInput}
                  onChange={e => setVioTypeInput(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-gray-50/50 focus:outline-none focus:border-blue-500 font-medium"
                >
                  <option value="ALL">全部违规类型</option>
                  <option value="未加盖印章/二维码">未加盖印章/二维码</option>
                  <option value="超期未清理">超期未清理</option>
                  <option value="擅自覆盖他人作品">擅自覆盖他人作品</option>
                  <option value="内容与审批不符">内容与审批不符</option>
                  <option value="墙面/展板损坏">墙面/展板损坏</option>
                </select>
              </div>

              {/* 上报时间 (时间段) */}
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-gray-600 mb-1">上报时间时间段</label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={vioReportStartTimeInput}
                    onChange={e => setVioReportStartTimeInput(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-gray-50/50 focus:outline-none focus:border-blue-500 font-medium text-gray-800"
                  />
                  <span className="text-gray-400 font-bold text-xs shrink-0">至</span>
                  <input
                    type="date"
                    value={vioReportEndTimeInput}
                    onChange={e => setVioReportEndTimeInput(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-gray-50/50 focus:outline-none focus:border-blue-500 font-medium text-gray-800"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={handleSearchVio}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1 cursor-pointer"
              >
                <Search size={13} />
                <span>查询</span>
              </button>
              <button
                type="button"
                onClick={handleResetVioSearch}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <span>重置</span>
              </button>
            </div>
          </div>

          {/* 选项卡 (Tab) - 新样式且“已处理”无角标 */}
          <div className="inline-flex p-1 bg-gray-100/80 rounded-2xl border border-gray-200/60 shadow-2xs">
            <button
              type="button"
              onClick={() => { setVioSubTab('PENDING'); setVioCurrentPage(1); }}
              className={`px-5 py-2 font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                vioSubTab === 'PENDING'
                  ? 'bg-white text-blue-600 shadow-xs font-black'
                  : 'text-gray-600 hover:text-gray-900 font-semibold'
              }`}
            >
              <span>待处理</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                vioSubTab === 'PENDING' ? 'bg-rose-500 text-white shadow-2xs' : 'bg-rose-100 text-rose-700'
              }`}>
                {pendingVioCount}
              </span>
            </button>
            <button
              type="button"
              onClick={() => { setVioSubTab('PROCESSED'); setVioCurrentPage(1); }}
              className={`px-5 py-2 font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                vioSubTab === 'PROCESSED'
                  ? 'bg-white text-blue-600 shadow-xs font-black'
                  : 'text-gray-600 hover:text-gray-900 font-semibold'
              }`}
            >
              <span>已处理</span>
            </button>
          </div>

          {/* 表格数据 */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/90 text-gray-600 font-bold border-b border-gray-100">
                  {vioSubTab === 'PENDING' ? (
                    <tr>
                      <th className="py-3.5 px-4 min-w-[90px]">校区</th>
                      <th className="py-3.5 px-4 min-w-[110px]">违规对象类型</th>
                      <th className="py-3.5 px-4 min-w-[140px]">违规对象</th>
                      <th className="py-3.5 px-4 min-w-[130px]">违规类型</th>
                      <th className="py-3.5 px-4 min-w-[200px]">异常描述</th>
                      <th className="py-3.5 px-4 min-w-[130px]">上报时间</th>
                      <th className="py-3.5 px-4 min-w-[100px]">上报人员</th>
                      <th className="py-3.5 px-4 text-center min-w-[90px]">操作</th>
                    </tr>
                  ) : (
                    <tr>
                      <th className="py-3.5 px-4 min-w-[90px]">校区</th>
                      <th className="py-3.5 px-4 min-w-[110px]">违规对象类型</th>
                      <th className="py-3.5 px-4 min-w-[140px]">违规对象</th>
                      <th className="py-3.5 px-4 min-w-[130px]">违规类型</th>
                      <th className="py-3.5 px-4 min-w-[180px]">异常描述</th>
                      <th className="py-3.5 px-4 min-w-[130px]">处理时间</th>
                      <th className="py-3.5 px-4 min-w-[140px]">处理方式</th>
                      <th className="py-3.5 px-4 min-w-[120px]">处理人员</th>
                      <th className="py-3.5 px-4 min-w-[130px]">上报时间</th>
                      <th className="py-3.5 px-4 min-w-[100px]">上报人员</th>
                      <th className="py-3.5 px-4 text-center min-w-[90px]">操作</th>
                    </tr>
                  )}
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {paginatedViolations.length === 0 ? (
                    <tr>
                      <td colSpan={vioSubTab === 'PENDING' ? 8 : 11} className="py-12 text-center text-gray-400 font-medium">
                        暂无相关违规事件数据
                      </td>
                    </tr>
                  ) : (
                    paginatedViolations.map(vio => (
                      <tr key={vio.id} className="hover:bg-blue-50/20 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-gray-900">{vio.campus}</td>
                        <td className="py-3.5 px-4 font-medium text-gray-800">{vio.targetType}</td>
                        <td className="py-3.5 px-4 font-bold text-gray-900">{vio.targetName}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200/80">
                            {vio.type}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-gray-600 max-w-xs leading-relaxed">
                          {vio.description || vio.title}
                        </td>

                        {vioSubTab === 'PROCESSED' && (
                          <>
                            <td className="py-3.5 px-4 font-mono text-gray-500">{vio.handleTime || '-'}</td>
                            <td className="py-3.5 px-4 font-bold text-emerald-700">{vio.handleMethod || '撕下海报'}</td>
                            <td className="py-3.5 px-4 font-medium text-gray-800">{vio.handledBy || '张老师'}</td>
                          </>
                        )}

                        <td className="py-3.5 px-4 font-mono text-gray-500">{vio.reportTime}</td>
                        <td className="py-3.5 px-4 font-medium text-gray-800">{vio.reportedBy}</td>

                        <td className="py-3.5 px-4 text-center">
                          {vioSubTab === 'PENDING' ? (
                            <button
                              type="button"
                              onClick={() => {
                                setHandlingVio(vio);
                                setIsTruthfulInput(vio.isTruthful || '情况属实');
                                setVerifiedConclusionInput((vio.verifiedConclusion as any) || '不按要求张贴');
                                setVerifiedFactNotesInput(vio.verifiedFactNotes || '');
                                setProcessResultInput((vio.processResult as any) || '发整改通知书');
                              }}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-xl text-xs shadow-sm transition-all cursor-pointer"
                            >
                              处理
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setViewingVio(vio)}
                              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-700 font-bold rounded-xl text-xs transition-all cursor-pointer"
                            >
                              查看
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* 分页 */}
            <div className="px-4 py-3 bg-gray-50/60 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3 text-xs text-gray-600">
              <div className="flex items-center gap-3">
                <span>共 <strong className="text-gray-900 font-bold">{totalVioItems}</strong> 条记录</span>
                <div className="flex items-center gap-1.5">
                  <span>每页</span>
                  <select
                    value={vioPageSize}
                    onChange={e => {
                      setVioPageSize(Number(e.target.value));
                      setVioCurrentPage(1);
                    }}
                    className="px-2 py-1 border border-gray-200 rounded-lg text-xs bg-white font-medium focus:outline-none"
                  >
                    <option value={10}>10 条</option>
                    <option value={20}>20 条</option>
                    <option value={50}>50 条</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span>第 <strong className="text-gray-900 font-bold">{vioCurrentPage}</strong> / {totalVioPages} 页</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setVioCurrentPage(p => Math.max(1, p - 1))}
                    disabled={vioCurrentPage === 1}
                    className="p-1 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 transition-colors cursor-pointer"
                    title="上一页"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setVioCurrentPage(p => Math.min(totalVioPages, p + 1))}
                    disabled={vioCurrentPage >= totalVioPages}
                    className="p-1 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 transition-colors cursor-pointer"
                    title="下一页"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PUB-06: 涂鸦主题管理 */}
      {activeTab === 'PUB-06' && (
        <div className="space-y-4">
          {/* 查询条件卡片 */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-[280px]">
              <div className="relative flex-1 max-w-sm">
                <input
                  type="text"
                  value={searchThemeName}
                  onChange={e => setSearchThemeName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSearchTheme(); }}
                  placeholder="请输入主题名称..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 bg-gray-50/50"
                />
                <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSearchTheme}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1 cursor-pointer"
              >
                <Search size={13} />
                <span>查询</span>
              </button>
              <button
                type="button"
                onClick={handleResetThemeSearch}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <span>重置</span>
              </button>
            </div>
          </div>

          {/* 列表表格 */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/90 text-gray-600 font-bold border-b border-gray-100">
                  <tr>
                    <th className="py-3.5 px-4 min-w-[160px]">主题名称</th>
                    <th className="py-3.5 px-4 min-w-[240px]">主题说明</th>
                    <th className="py-3.5 px-4 min-w-[120px]">创建人</th>
                    <th className="py-3.5 px-4 min-w-[120px]">创建时间</th>
                    <th className="py-3.5 px-4 text-center min-w-[120px]">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {paginatedThemes.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-gray-400 font-medium">
                        暂无符合条件的涂鸦主题数据
                      </td>
                    </tr>
                  ) : (
                    paginatedThemes.map(thm => (
                      <tr key={thm.id} className="hover:bg-blue-50/20 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-gray-900">{thm.name}</td>
                        <td className="py-3.5 px-4 text-gray-600 max-w-md leading-relaxed">{thm.description}</td>
                        <td className="py-3.5 px-4 text-gray-700 font-medium">{thm.createdBy || '校团委（张老师）'}</td>
                        <td className="py-3.5 px-4 text-gray-500 font-mono">{thm.createdAt}</td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEditThemeModal(thm)}
                              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                            >
                              编辑
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteTheme(thm.id, thm.name)}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg font-bold text-xs transition-colors cursor-pointer"
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

            {/* 分页控件 */}
            <div className="px-4 py-3 bg-gray-50/60 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3 text-xs text-gray-600">
              <div className="flex items-center gap-3">
                <span>共 <strong className="text-gray-900 font-bold">{totalThemeItems}</strong> 条记录</span>
                <div className="flex items-center gap-1.5">
                  <span>每页</span>
                  <select
                    value={themePageSize}
                    onChange={e => {
                      setThemePageSize(Number(e.target.value));
                      setThemeCurrentPage(1);
                    }}
                    className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs outline-none focus:border-blue-500 font-medium cursor-pointer"
                  >
                    <option value={5}>5 条</option>
                    <option value={10}>10 条</option>
                    <option value={20}>20 条</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={validThemeCurrentPage <= 1}
                  onClick={() => setThemeCurrentPage(prev => Math.max(1, prev - 1))}
                  className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title="上一页"
                >
                  <ChevronLeft size={14} />
                </button>

                {Array.from({ length: totalThemePages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setThemeCurrentPage(page)}
                    className={`min-w-[28px] h-7 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      page === validThemeCurrentPage
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={validThemeCurrentPage >= totalThemePages}
                  onClick={() => setThemeCurrentPage(prev => Math.min(totalThemePages, prev + 1))}
                  className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title="下一页"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PUB-07: 巡检规则设置 */}
      {activeTab === 'PUB-07' && (
        <div className="space-y-6">
          {saveToast && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2 font-bold text-xs">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                <span>巡检规则设置已成功保存！</span>
              </div>
              <button onClick={() => setSaveToast(false)} className="text-emerald-600 hover:text-emerald-800 p-1 cursor-pointer">
                <X size={16} />
              </button>
            </div>
          )}

          <div className="space-y-6">
            {/* 1. 思明校区海报巡检频率 */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                  <Building2 size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">思明校区海报巡检频率</h3>
                  <p className="text-xs text-gray-400">配置思明校区内宣传海报在不同时段的巡检要求</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                {/* 工作日 */}
                <div className="space-y-1.5 bg-gray-50/70 p-4 rounded-xl border border-gray-100">
                  <label className="block text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <Clock size={14} className="text-blue-600" />
                    <span>工作日</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={inspectionRules.simingPoster.workday}
                    onChange={e => setInspectionRules(prev => ({
                      ...prev,
                      simingPoster: { ...prev.simingPoster, workday: e.target.value }
                    }))}
                    placeholder="例如: 1天1次"
                    className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-500 shadow-2xs"
                  />
                  <div className="flex flex-wrap gap-1 pt-1">
                    {['1天1次', '1天2次', '2天1次'].map(preset => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setInspectionRules(prev => ({
                          ...prev,
                          simingPoster: { ...prev.simingPoster, workday: preset }
                        }))}
                        className="px-2 py-0.5 bg-white hover:bg-blue-50 hover:text-blue-600 border border-gray-200 rounded-md text-[10px] text-gray-500 transition-colors cursor-pointer"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 寒暑假 */}
                <div className="space-y-1.5 bg-gray-50/70 p-4 rounded-xl border border-gray-100">
                  <label className="block text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <Calendar size={14} className="text-amber-600" />
                    <span>寒暑假</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={inspectionRules.simingPoster.vacation}
                    onChange={e => setInspectionRules(prev => ({
                      ...prev,
                      simingPoster: { ...prev.simingPoster, vacation: e.target.value }
                    }))}
                    placeholder="例如: 3天1次"
                    className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-500 shadow-2xs"
                  />
                  <div className="flex flex-wrap gap-1 pt-1">
                    {['2天1次', '3天1次', '1周1次'].map(preset => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setInspectionRules(prev => ({
                          ...prev,
                          simingPoster: { ...prev.simingPoster, vacation: preset }
                        }))}
                        className="px-2 py-0.5 bg-white hover:bg-blue-50 hover:text-blue-600 border border-gray-200 rounded-md text-[10px] text-gray-500 transition-colors cursor-pointer"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 国家法定节假日 */}
                <div className="space-y-1.5 bg-gray-50/70 p-4 rounded-xl border border-gray-100">
                  <label className="block text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-purple-600" />
                    <span>国家法定节假日</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={inspectionRules.simingPoster.holiday}
                    onChange={e => setInspectionRules(prev => ({
                      ...prev,
                      simingPoster: { ...prev.simingPoster, holiday: e.target.value }
                    }))}
                    placeholder="例如: 2天1次"
                    className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-500 shadow-2xs"
                  />
                  <div className="flex flex-wrap gap-1 pt-1">
                    {['1天1次', '2天1次', '3天1次'].map(preset => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setInspectionRules(prev => ({
                          ...prev,
                          simingPoster: { ...prev.simingPoster, holiday: preset }
                        }))}
                        className="px-2 py-0.5 bg-white hover:bg-blue-50 hover:text-blue-600 border border-gray-200 rounded-md text-[10px] text-gray-500 transition-colors cursor-pointer"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. 翔安校区海报巡检频率 */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold shrink-0">
                  <Building2 size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">翔安校区海报巡检频率</h3>
                  <p className="text-xs text-gray-400">配置翔安校区内宣传海报在不同时段的巡检要求</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                {/* 工作日 */}
                <div className="space-y-1.5 bg-gray-50/70 p-4 rounded-xl border border-gray-100">
                  <label className="block text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <Clock size={14} className="text-blue-600" />
                    <span>工作日</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={inspectionRules.xianganPoster.workday}
                    onChange={e => setInspectionRules(prev => ({
                      ...prev,
                      xianganPoster: { ...prev.xianganPoster, workday: e.target.value }
                    }))}
                    placeholder="例如: 1天1次"
                    className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-500 shadow-2xs"
                  />
                  <div className="flex flex-wrap gap-1 pt-1">
                    {['1天1次', '1天2次', '2天1次'].map(preset => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setInspectionRules(prev => ({
                          ...prev,
                          xianganPoster: { ...prev.xianganPoster, workday: preset }
                        }))}
                        className="px-2 py-0.5 bg-white hover:bg-blue-50 hover:text-blue-600 border border-gray-200 rounded-md text-[10px] text-gray-500 transition-colors cursor-pointer"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 寒暑假 */}
                <div className="space-y-1.5 bg-gray-50/70 p-4 rounded-xl border border-gray-100">
                  <label className="block text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <Calendar size={14} className="text-amber-600" />
                    <span>寒暑假</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={inspectionRules.xianganPoster.vacation}
                    onChange={e => setInspectionRules(prev => ({
                      ...prev,
                      xianganPoster: { ...prev.xianganPoster, vacation: e.target.value }
                    }))}
                    placeholder="例如: 3天1次"
                    className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-500 shadow-2xs"
                  />
                  <div className="flex flex-wrap gap-1 pt-1">
                    {['2天1次', '3天1次', '1周1次'].map(preset => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setInspectionRules(prev => ({
                          ...prev,
                          xianganPoster: { ...prev.xianganPoster, vacation: preset }
                        }))}
                        className="px-2 py-0.5 bg-white hover:bg-blue-50 hover:text-blue-600 border border-gray-200 rounded-md text-[10px] text-gray-500 transition-colors cursor-pointer"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 国家法定节假日 */}
                <div className="space-y-1.5 bg-gray-50/70 p-4 rounded-xl border border-gray-100">
                  <label className="block text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-purple-600" />
                    <span>国家法定节假日</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={inspectionRules.xianganPoster.holiday}
                    onChange={e => setInspectionRules(prev => ({
                      ...prev,
                      xianganPoster: { ...prev.xianganPoster, holiday: e.target.value }
                    }))}
                    placeholder="例如: 2天1次"
                    className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-500 shadow-2xs"
                  />
                  <div className="flex flex-wrap gap-1 pt-1">
                    {['1天1次', '2天1次', '3天1次'].map(preset => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setInspectionRules(prev => ({
                          ...prev,
                          xianganPoster: { ...prev.xianganPoster, holiday: preset }
                        }))}
                        className="px-2 py-0.5 bg-white hover:bg-blue-50 hover:text-blue-600 border border-gray-200 rounded-md text-[10px] text-gray-500 transition-colors cursor-pointer"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. 芙蓉隧道巡检频率 */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold shrink-0">
                  <Tag size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">芙蓉隧道巡检频率</h3>
                  <p className="text-xs text-gray-400">配置芙蓉隧道涂鸦墙面及涂鸦作品在不同时段的巡检要求</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                {/* 工作日 */}
                <div className="space-y-1.5 bg-gray-50/70 p-4 rounded-xl border border-gray-100">
                  <label className="block text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <Clock size={14} className="text-blue-600" />
                    <span>工作日</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={inspectionRules.furongTunnel.workday}
                    onChange={e => setInspectionRules(prev => ({
                      ...prev,
                      furongTunnel: { ...prev.furongTunnel, workday: e.target.value }
                    }))}
                    placeholder="例如: 1天2次"
                    className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-500 shadow-2xs"
                  />
                  <div className="flex flex-wrap gap-1 pt-1">
                    {['1天1次', '1天2次', '2天1次'].map(preset => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setInspectionRules(prev => ({
                          ...prev,
                          furongTunnel: { ...prev.furongTunnel, workday: preset }
                        }))}
                        className="px-2 py-0.5 bg-white hover:bg-blue-50 hover:text-blue-600 border border-gray-200 rounded-md text-[10px] text-gray-500 transition-colors cursor-pointer"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 寒暑假 */}
                <div className="space-y-1.5 bg-gray-50/70 p-4 rounded-xl border border-gray-100">
                  <label className="block text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <Calendar size={14} className="text-amber-600" />
                    <span>寒暑假</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={inspectionRules.furongTunnel.vacation}
                    onChange={e => setInspectionRules(prev => ({
                      ...prev,
                      furongTunnel: { ...prev.furongTunnel, vacation: e.target.value }
                    }))}
                    placeholder="例如: 2天1次"
                    className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-500 shadow-2xs"
                  />
                  <div className="flex flex-wrap gap-1 pt-1">
                    {['1天1次', '2天1次', '3天1次'].map(preset => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setInspectionRules(prev => ({
                          ...prev,
                          furongTunnel: { ...prev.furongTunnel, vacation: preset }
                        }))}
                        className="px-2 py-0.5 bg-white hover:bg-blue-50 hover:text-blue-600 border border-gray-200 rounded-md text-[10px] text-gray-500 transition-colors cursor-pointer"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 国家法定节假日 */}
                <div className="space-y-1.5 bg-gray-50/70 p-4 rounded-xl border border-gray-100">
                  <label className="block text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-purple-600" />
                    <span>国家法定节假日</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={inspectionRules.furongTunnel.holiday}
                    onChange={e => setInspectionRules(prev => ({
                      ...prev,
                      furongTunnel: { ...prev.furongTunnel, holiday: e.target.value }
                    }))}
                    placeholder="例如: 1天1次"
                    className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-500 shadow-2xs"
                  />
                  <div className="flex flex-wrap gap-1 pt-1">
                    {['1天1次', '1天2次', '2天1次'].map(preset => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setInspectionRules(prev => ({
                          ...prev,
                          furongTunnel: { ...prev.furongTunnel, holiday: preset }
                        }))}
                        className="px-2 py-0.5 bg-white hover:bg-blue-50 hover:text-blue-600 border border-gray-200 rounded-md text-[10px] text-gray-500 transition-colors cursor-pointer"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 底部保存按钮 */}
          <div className="pt-2 flex items-center justify-end">
            <button
              type="button"
              onClick={handleSaveInspectionRules}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save size={16} />
              <span>保存巡检规则设置</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal: Ban Org */}
      {banningOrg && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-rose-600">违规组织禁申设置 (PUB-01)</h3>
            <p className="text-xs text-gray-600">您正在禁止 <strong>{banningOrg.orgName}</strong> 提交海报及涂鸦申请。</p>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">违规原因 (必填)</label>
              <textarea
                rows={3}
                value={banReasonInput}
                onChange={(e) => setBanReasonInput(e.target.value)}
                placeholder="请输入违规条款与禁止原因..."
                className="w-full border border-gray-200 rounded-xl p-3 text-xs outline-none focus:border-rose-500"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setBanningOrg(null)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold">
                取消
              </button>
              <button onClick={handleConfirmBan} className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold">
                确认执行禁申
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: 处理违规事件 */}
      {handlingVio && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <ShieldAlert className="text-blue-600" size={18} />
                <h3 className="font-black text-gray-900 text-base">处理违规事件</h3>
              </div>
              <button
                type="button"
                onClick={() => setHandlingVio(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200/60 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6 text-xs text-gray-700 overflow-y-auto flex-1">
              {/* 上报信息 */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="px-3 py-1 rounded-xl bg-blue-600 text-white font-black text-xs shadow-2xs flex items-center gap-1.5">
                    <FileText size={13} className="text-blue-100" />
                    <span>上报信息</span>
                  </div>
                  <div className="h-px bg-gradient-to-r from-blue-200 via-gray-200 to-transparent flex-1"></div>
                </div>
                <div className="divide-y divide-gray-100">
                  {/* 1. 校区 */}
                  <div className="py-2.5 flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="w-32 text-gray-500 font-bold shrink-0">校区</span>
                    <span className="font-bold text-gray-900 flex-1">{handlingVio.campus}</span>
                  </div>
                  {/* 2. 违规对象类型 */}
                  <div className="py-2.5 flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="w-32 text-gray-500 font-bold shrink-0">违规对象类型</span>
                    <span className="font-bold text-gray-900 flex-1">{handlingVio.targetType}</span>
                  </div>
                  {/* 3. 违规对象 */}
                  <div className="py-2.5 flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="w-32 text-gray-500 font-bold shrink-0">违规对象</span>
                    <span className="font-bold text-gray-900 flex-1">{handlingVio.targetName}</span>
                  </div>
                  {/* 4. 上报人 */}
                  <div className="py-2.5 flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="w-32 text-gray-500 font-bold shrink-0">上报人</span>
                    <span className="font-medium text-gray-900 flex-1">{handlingVio.reportedBy}</span>
                  </div>
                  {/* 5. 上报时间 */}
                  <div className="py-2.5 flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="w-32 text-gray-500 font-bold shrink-0">上报时间</span>
                    <span className="font-mono text-gray-700 flex-1">{handlingVio.reportTime}</span>
                  </div>
                  {/* 6. 违规类型 */}
                  <div className="py-2.5 flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="w-32 text-gray-500 font-bold shrink-0">违规类型</span>
                    <div className="flex-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        {handlingVio.type}
                      </span>
                    </div>
                  </div>
                  {/* 7. 现场情况说明 */}
                  <div className="py-2.5 flex flex-col sm:flex-row sm:items-start gap-2">
                    <span className="w-32 text-gray-500 font-bold shrink-0 pt-0.5">现场情况说明</span>
                    <p className="font-medium text-gray-800 leading-relaxed flex-1">
                      {handlingVio.description || handlingVio.title}
                    </p>
                  </div>
                  {/* 8. 现场图片 */}
                  <div className="py-2.5 flex flex-col sm:flex-row sm:items-start gap-2">
                    <span className="w-32 text-gray-500 font-bold shrink-0 pt-1">现场图片</span>
                    <div className="flex-1">
                      {handlingVio.photoUrl ? (
                        <a href={handlingVio.photoUrl} target="_blank" rel="noreferrer" className="inline-block group">
                          <img
                            src={handlingVio.photoUrl}
                            alt="现场照片"
                            className="w-24 h-24 object-cover rounded-xl border border-gray-200 group-hover:opacity-90 shadow-2xs transition-all"
                          />
                          <span className="text-[10px] text-blue-600 font-bold block mt-1 hover:underline">点击查看原图</span>
                        </a>
                      ) : (
                        <span className="text-gray-400 font-medium">暂无现场图片</span>
                      )}
                    </div>
                  </div>
                  {/* 9. 现场处理措施 */}
                  <div className="py-2.5 flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="w-32 text-gray-500 font-bold shrink-0">现场处理措施</span>
                    <span className="font-bold text-emerald-700 flex-1">
                      {handlingVio.siteAction || '撕下海报'}
                    </span>
                  </div>
                  {/* 10. 现场处理说明 */}
                  <div className="py-2.5 flex flex-col sm:flex-row sm:items-start gap-2">
                    <span className="w-32 text-gray-500 font-bold shrink-0 pt-0.5">现场处理说明</span>
                    <p className="font-medium text-gray-800 leading-relaxed flex-1">
                      {handlingVio.siteNotes || '巡检人员已现场查验，并取证记录。'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 处理意见 */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="px-3 py-1 rounded-xl bg-indigo-600 text-white font-black text-xs shadow-2xs flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-indigo-100" />
                    <span>处理意见</span>
                  </div>
                  <div className="h-px bg-gradient-to-r from-indigo-200 via-gray-200 to-transparent flex-1"></div>
                </div>
                <div className="divide-y divide-gray-100">
                  {/* 1. 是否属实 */}
                  <div className="py-3 flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="w-32 font-bold text-gray-700 shrink-0">
                      是否属实 <span className="text-rose-500">*</span>
                    </span>
                    <div className="flex items-center gap-6 flex-1">
                      {(['情况属实', '情况不属实'] as const).map(opt => (
                        <label key={opt} className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                          <input
                            type="radio"
                            name="isTruthful"
                            value={opt}
                            checked={isTruthfulInput === opt}
                            onChange={() => setIsTruthfulInput(opt)}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 2. 核定违规结论 */}
                  <div className="py-3 flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="w-32 font-bold text-gray-700 shrink-0">
                      核定违规结论 <span className="text-rose-500">*</span>
                    </span>
                    <div className="flex-1">
                      <select
                        value={verifiedConclusionInput}
                        onChange={e => setVerifiedConclusionInput(e.target.value as any)}
                        className="w-full max-w-sm px-3.5 py-2 border border-gray-200 rounded-xl text-xs bg-white font-bold text-gray-900 focus:outline-none focus:border-blue-500 shadow-2xs cursor-pointer"
                      >
                        <option value="不按要求张贴">不按要求张贴</option>
                        <option value="篡改内容">篡改内容</option>
                        <option value="未申报张贴">未申报张贴</option>
                      </select>
                    </div>
                  </div>

                  {/* 3. 核定事实说明 */}
                  <div className="py-3 flex flex-col sm:flex-row sm:items-start gap-2">
                    <span className="w-32 font-bold text-gray-700 shrink-0 pt-2">核定事实说明</span>
                    <div className="flex-1">
                      <textarea
                        rows={3}
                        value={verifiedFactNotesInput}
                        onChange={e => setVerifiedFactNotesInput(e.target.value)}
                        placeholder="请输入核定事实说明..."
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs bg-white font-medium text-gray-800 focus:outline-none focus:border-blue-500 shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* 4. 处理结果 */}
                  <div className="py-3 flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="w-32 font-bold text-gray-700 shrink-0">
                      处理结果 <span className="text-rose-500">*</span>
                    </span>
                    <div className="flex items-center gap-5 flex-wrap flex-1">
                      {(['不处理', '发整改通知书', '加入申请黑名单'] as const).map(opt => (
                        <label key={opt} className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                          <input
                            type="radio"
                            name="processResult"
                            value={opt}
                            checked={processResultInput === opt}
                            onChange={() => setProcessResultInput(opt)}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-gray-50/80 border-t border-gray-100 flex items-center justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setHandlingVio(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmProcessVio}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                确认处理
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: 查看已处理违规事件 */}
      {viewingVio && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="text-blue-600" size={18} />
                <h3 className="font-black text-gray-900 text-base">违规事件详情 (已处理)</h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingVio(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200/60 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6 text-xs text-gray-700 overflow-y-auto flex-1">
              {/* 上报信息 */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="px-3 py-1 rounded-xl bg-blue-600 text-white font-black text-xs shadow-2xs flex items-center gap-1.5">
                    <FileText size={13} className="text-blue-100" />
                    <span>上报信息</span>
                  </div>
                  <div className="h-px bg-gradient-to-r from-blue-200 via-gray-200 to-transparent flex-1"></div>
                </div>
                <div className="divide-y divide-gray-100">
                  <div className="py-2.5 flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="w-32 text-gray-500 font-bold shrink-0">校区</span>
                    <span className="font-bold text-gray-900 flex-1">{viewingVio.campus}</span>
                  </div>
                  <div className="py-2.5 flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="w-32 text-gray-500 font-bold shrink-0">违规对象类型</span>
                    <span className="font-bold text-gray-900 flex-1">{viewingVio.targetType}</span>
                  </div>
                  <div className="py-2.5 flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="w-32 text-gray-500 font-bold shrink-0">违规对象</span>
                    <span className="font-bold text-gray-900 flex-1">{viewingVio.targetName}</span>
                  </div>
                  <div className="py-2.5 flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="w-32 text-gray-500 font-bold shrink-0">上报人</span>
                    <span className="font-medium text-gray-900 flex-1">{viewingVio.reportedBy}</span>
                  </div>
                  <div className="py-2.5 flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="w-32 text-gray-500 font-bold shrink-0">上报时间</span>
                    <span className="font-mono text-gray-700 flex-1">{viewingVio.reportTime}</span>
                  </div>
                  <div className="py-2.5 flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="w-32 text-gray-500 font-bold shrink-0">违规类型</span>
                    <div className="flex-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        {viewingVio.type}
                      </span>
                    </div>
                  </div>
                  <div className="py-2.5 flex flex-col sm:flex-row sm:items-start gap-2">
                    <span className="w-32 text-gray-500 font-bold shrink-0 pt-0.5">现场情况说明</span>
                    <p className="font-medium text-gray-800 leading-relaxed flex-1">
                      {viewingVio.description || viewingVio.title}
                    </p>
                  </div>
                  <div className="py-2.5 flex flex-col sm:flex-row sm:items-start gap-2">
                    <span className="w-32 text-gray-500 font-bold shrink-0 pt-1">现场图片</span>
                    <div className="flex-1">
                      {viewingVio.photoUrl ? (
                        <a href={viewingVio.photoUrl} target="_blank" rel="noreferrer" className="inline-block group">
                          <img
                            src={viewingVio.photoUrl}
                            alt="现场照片"
                            className="w-24 h-24 object-cover rounded-xl border border-gray-200 group-hover:opacity-90 shadow-2xs transition-all"
                          />
                          <span className="text-[10px] text-blue-600 font-bold block mt-1 hover:underline">点击查看原图</span>
                        </a>
                      ) : (
                        <span className="text-gray-400 font-medium">暂无现场图片</span>
                      )}
                    </div>
                  </div>
                  <div className="py-2.5 flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="w-32 text-gray-500 font-bold shrink-0">现场处理措施</span>
                    <span className="font-bold text-emerald-700 flex-1">
                      {viewingVio.siteAction || '撕下海报'}
                    </span>
                  </div>
                  <div className="py-2.5 flex flex-col sm:flex-row sm:items-start gap-2">
                    <span className="w-32 text-gray-500 font-bold shrink-0 pt-0.5">现场处理说明</span>
                    <p className="font-medium text-gray-800 leading-relaxed flex-1">
                      {viewingVio.siteNotes || '巡检人员已现场查验，并取证记录。'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 处理意见 */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="px-3 py-1 rounded-xl bg-indigo-600 text-white font-black text-xs shadow-2xs flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-indigo-100" />
                    <span>处理意见</span>
                  </div>
                  <div className="h-px bg-gradient-to-r from-indigo-200 via-gray-200 to-transparent flex-1"></div>
                </div>
                <div className="divide-y divide-gray-100">
                  <div className="py-2.5 flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="w-32 text-gray-500 font-bold shrink-0">是否属实</span>
                    <span className="font-bold text-gray-900 flex-1">{viewingVio.isTruthful || '情况属实'}</span>
                  </div>
                  <div className="py-2.5 flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="w-32 text-gray-500 font-bold shrink-0">核定违规结论</span>
                    <span className="font-bold text-rose-700 flex-1">{viewingVio.verifiedConclusion || '不按要求张贴'}</span>
                  </div>
                  <div className="py-2.5 flex flex-col sm:flex-row sm:items-start gap-2">
                    <span className="w-32 text-gray-500 font-bold shrink-0 pt-0.5">核定事实说明</span>
                    <p className="font-medium text-gray-800 leading-relaxed flex-1">
                      {viewingVio.verifiedFactNotes || viewingVio.description || '情况核实无误'}
                    </p>
                  </div>
                  <div className="py-2.5 flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="w-32 text-gray-500 font-bold shrink-0">处理结果</span>
                    <span className="font-bold text-blue-700 flex-1">{viewingVio.processResult || viewingVio.handleMethod || '发整改通知书'}</span>
                  </div>
                  <div className="py-2.5 flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="w-32 text-gray-500 font-bold shrink-0">处理时间</span>
                    <span className="font-mono font-bold text-gray-900 flex-1">{viewingVio.handleTime || '-'}</span>
                  </div>
                  <div className="py-2.5 flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="w-32 text-gray-500 font-bold shrink-0">处理人员</span>
                    <span className="font-bold text-gray-900 flex-1">{viewingVio.handledBy || '张老师 (公共设施管理处)'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-gray-50/80 border-t border-gray-100 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setViewingVio(null)}
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold text-xs transition-all cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Rectify Notice */}
      {rectifyingViolation && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-amber-600">下发整改通知书 (PUB-05)</h3>
            <p className="text-xs text-gray-600">针对：<strong>{rectifyingViolation.title}</strong></p>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">整改要求与期限</label>
              <textarea
                rows={3}
                value={rectifyNoticeInput}
                onChange={(e) => setRectifyNoticeInput(e.target.value)}
                placeholder="请输入限期整改细则..."
                className="w-full border border-gray-200 rounded-xl p-3 text-xs outline-none focus:border-amber-500"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setRectifyingViolation(null)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold">
                取消
              </button>
              <button onClick={handleSendRectifyNotice} className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold">
                确认发送整改通知
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New / Edit Theme */}
      {showThemeModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-gray-900">
                {editingTheme ? '编辑涂鸦主题' : '新建涂鸦主题'}
              </h3>
              <button
                type="button"
                onClick={() => setShowThemeModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1.5">
                  主题名称 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={themeFormName}
                  onChange={(e) => setThemeFormName(e.target.value)}
                  placeholder="请输入主题名称 (例：毕业季 · 扬帆远航)"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-blue-500 focus:bg-white bg-gray-50/50"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1.5">
                  主题说明
                </label>
                <textarea
                  rows={3}
                  value={themeFormDesc}
                  onChange={(e) => setThemeFormDesc(e.target.value)}
                  placeholder="请输入主题说明..."
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-blue-500 focus:bg-white bg-gray-50/50"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowThemeModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveTheme}
                disabled={!themeFormName.trim()}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                {editingTheme ? '保存修改' : '确认创建'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 巡检记录详情 Modal */}
      {viewingLog && (() => {
        const isAbnormal = viewingLog.result === 'ABNORMAL' || viewingLog.result === '异常' || viewingLog.result === '异常告警';
        const campusVal = viewingLog.campus || (viewingLog.targetName.includes('思明') ? '思明校区' : viewingLog.targetName.includes('翔安') ? '翔安校区' : viewingLog.targetName.includes('樟宜') ? '樟宜校区' : viewingLog.targetName.includes('漳州') ? '漳州校区' : '思明校区');
        const targetTypeVal = viewingLog.targetType === 'TUNNEL_ZONE' || viewingLog.targetName.includes('芙蓉隧道') ? '芙蓉隧道' : '公共海报栏';
        const photosList = viewingLog.photoUrls && viewingLog.photoUrls.length > 0
          ? viewingLog.photoUrls
          : (viewingLog.photoUrl ? [viewingLog.photoUrl] : []);

        return (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden space-y-0">
              {/* Header */}
              <div className="px-6 py-4 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <FileText className="text-blue-600" size={18} />
                  <h3 className="font-black text-gray-900 text-base">巡检记录详情</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setViewingLog(null)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200/60 transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Content - 严格按一行一个字段顺序显示 */}
              <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs text-gray-700">
                {/* 1. 巡检校区 */}
                <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
                  <span className="text-gray-500 font-bold">巡检校区</span>
                  <span className="font-bold text-gray-900 text-sm">{campusVal}</span>
                </div>

                {/* 2. 巡检对象类型 */}
                <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
                  <span className="text-gray-500 font-bold">巡检对象类型</span>
                  <span className="font-bold text-gray-900 text-sm">{targetTypeVal}</span>
                </div>

                {/* 3. 巡检对象 */}
                <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
                  <span className="text-gray-500 font-bold">巡检对象</span>
                  <span className="font-bold text-gray-900 text-sm">{viewingLog.targetName}</span>
                </div>

                {/* 4. 巡检员 */}
                <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
                  <span className="text-gray-500 font-bold">巡检员</span>
                  <span className="font-bold text-gray-900 text-sm">{viewingLog.inspectorName}</span>
                </div>

                {/* 5. 巡检时间 */}
                <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
                  <span className="text-gray-500 font-bold">巡检时间</span>
                  <span className="font-mono font-bold text-gray-900 text-sm">{viewingLog.checkTime}</span>
                </div>

                {/* 6. 巡检结论 */}
                <div className="flex flex-col gap-1.5 pb-3 border-b border-gray-100">
                  <span className="text-gray-500 font-bold">巡检结论</span>
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${
                      isAbnormal
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {isAbnormal ? '异常' : '正常'}
                    </span>
                  </div>
                </div>

                {/* 7. 现场情况说明 */}
                <div className="flex flex-col gap-1.5 pb-3 border-b border-gray-100">
                  <span className="text-gray-500 font-bold">现场情况说明</span>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/80 text-gray-800 font-medium leading-relaxed">
                    {viewingLog.notes || '无'}
                  </div>
                </div>

                {/* 8. 现场图片 (支持多张) */}
                <div className="flex flex-col gap-1.5 pb-3 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-bold">现场图片</span>
                    {photosList.length > 0 && (
                      <span className="text-[11px] font-bold text-gray-400">共 {photosList.length} 张图片</span>
                    )}
                  </div>
                  {photosList.length > 0 ? (
                    <div className={`grid gap-2 w-full ${photosList.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                      {photosList.map((url, idx) => (
                        <div key={idx} className="relative rounded-xl overflow-hidden border border-gray-200 bg-black/5 aspect-4/3 group">
                          <img
                            src={url}
                            alt={`现场图片 ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute bottom-1.5 right-1.5 px-2 py-0.5 bg-black/60 text-white rounded-md text-[10px] font-bold backdrop-blur-xs">
                            图片 {idx + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/80 text-gray-400 font-medium italic">
                      暂无现场图片
                    </div>
                  )}
                </div>

                {/* 9 & 10：仅在巡检结论为“异常”时显示 */}
                {isAbnormal && (
                  <>
                    {/* 9. 现场处理措施 */}
                    <div className="flex flex-col gap-1.5 pb-3 border-b border-gray-100">
                      <span className="text-rose-600 font-bold">现场处理措施</span>
                      <div>
                        <span className={`inline-block px-3 py-1 rounded-xl text-xs font-bold border ${
                          (viewingLog.actionTaken === '撕下海报')
                            ? 'bg-amber-50 text-amber-800 border-amber-200/90'
                            : (viewingLog.actionTaken === '未做任何处理')
                            ? 'bg-gray-100 text-gray-700 border-gray-300'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}>
                          {viewingLog.actionTaken || '撕下海报'}
                        </span>
                      </div>
                    </div>

                    {/* 10. 现场处理说明 */}
                    <div className="flex flex-col gap-1.5 pb-3">
                      <span className="text-rose-600 font-bold">现场处理说明</span>
                      <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100 text-rose-900 font-medium leading-relaxed">
                        {viewingLog.actionNotes || '巡检员已完成现场拍照留存存证，并按规定同步上报公共设施管理处跟进。'}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-3 bg-gray-50/80 border-t border-gray-100 flex justify-end shrink-0">
                <button
                  type="button"
                  onClick={() => setViewingLog(null)}
                  className="px-5 py-2 bg-gray-200 hover:bg-gray-300 active:scale-95 text-gray-700 rounded-xl font-bold text-xs transition-all cursor-pointer"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* PUB-02 Modals */}
      {/* 1. 查看巡检班组 Modal */}
      {viewingTeam && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>巡检班组详情</span>
              </h3>
              <button
                type="button"
                onClick={() => setViewingTeam(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400 font-medium block mb-0.5">工作校区</span>
                  <span className="font-bold text-gray-900 text-sm">{viewingTeam.campus}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-medium block mb-0.5">班组名称</span>
                  <span className="font-bold text-blue-600 text-sm">{viewingTeam.teamName}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-medium block mb-0.5">班组负责人</span>
                  <span className="font-bold text-gray-900">{viewingTeam.leader}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-medium block mb-0.5">负责人电话</span>
                  <span className="font-mono text-gray-800">{viewingTeam.leaderPhone || '未填写'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-400 font-medium block mb-0.5">在岗成员数</span>
                  <span className="font-bold text-emerald-600">{viewingTeam.activeMemberCount} 人在岗</span>
                </div>
              </div>

              <div>
                <span className="text-gray-500 font-bold block mb-2">班组成员列表 ({viewingTeam.members?.length || 0})</span>
                <div className="border border-gray-100 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 font-bold text-gray-600">
                      <tr>
                        <th className="py-2 px-3">姓名</th>
                        <th className="py-2 px-3">学号</th>
                        <th className="py-2 px-3">联系电话</th>
                        <th className="py-2 px-3">状态</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(viewingTeam.members || []).map(m => (
                        <tr key={m.id}>
                          <td className="py-2 px-3 font-bold text-gray-800">{m.name}</td>
                          <td className="py-2 px-3 font-mono text-gray-600">{m.studentId}</td>
                          <td className="py-2 px-3 font-mono text-gray-600">{m.phone}</td>
                          <td className="py-2 px-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                              {m.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="px-6 py-3 bg-gray-50/80 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingTeam(null)}
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. 编辑巡检班组 Modal */}
      {editingTeam && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>编辑巡检班组</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingTeam(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-gray-600 font-bold mb-1">工作校区</label>
                <select
                  value={editingTeam.campus}
                  onChange={e => setEditingTeam({ ...editingTeam, campus: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-800 outline-none focus:bg-white focus:border-blue-500 cursor-pointer"
                >
                  <option value="思明校区">思明校区</option>
                  <option value="翔安校区">翔安校区</option>
                  <option value="漳州校区">漳州校区</option>
                  <option value="樟宜校区">樟宜校区</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-600 font-bold mb-1">班组名称</label>
                <input
                  type="text"
                  value={editingTeam.teamName}
                  onChange={e => setEditingTeam({ ...editingTeam, teamName: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-800 outline-none focus:bg-white focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-bold mb-1">负责人姓名</label>
                <input
                  type="text"
                  value={editingTeam.leader}
                  onChange={e => setEditingTeam({ ...editingTeam, leader: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-800 outline-none focus:bg-white focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-bold mb-1">负责人电话</label>
                <input
                  type="text"
                  value={editingTeam.leaderPhone}
                  onChange={e => setEditingTeam({ ...editingTeam, leaderPhone: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-800 outline-none focus:bg-white focus:border-blue-500"
                />
              </div>
            </div>
            <div className="px-6 py-3 bg-gray-50/80 border-t border-gray-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingTeam(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleUpdateTeam}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                保存修改
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. 巡检成员管理 Modal */}
      {managingTeamMembers && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span>巡检成员管理</span>
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setManagingTeamMembers(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
              {/* 当前班组信息 (独立信息块) */}
              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    <span className="font-black text-xs text-blue-900">当前班组信息</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100/80 text-blue-700">
                    {managingTeamMembers.campus}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-xs text-gray-700">
                  <div>
                    <span className="text-gray-500 font-medium block text-[11px]">班组名称</span>
                    <span className="font-bold text-gray-900">{managingTeamMembers.teamName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium block text-[11px]">班组负责人</span>
                    <span className="font-bold text-gray-900">{managingTeamMembers.leader} <span className="font-mono text-gray-500 text-[11px]">({managingTeamMembers.leaderStudentId || '352202688'})</span></span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium block text-[11px]">联系电话</span>
                    <span className="font-mono font-medium text-gray-800">{managingTeamMembers.leaderPhone || '18950011234'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium block text-[11px]">在岗 / 总人数</span>
                    <span className="font-bold text-emerald-600">{managingTeamMembers.activeMemberCount || 0} / {managingTeamMembers.members?.length || 0} 人</span>
                  </div>
                </div>
              </div>

              {/* 第一行为查询条件：工作校区、学号、姓名、状态 (在岗、离岗) */}
              <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-100/90 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-gray-500 font-bold mb-1">工作校区</label>
                    <select
                      value={memberSearchCampus}
                      onChange={e => setMemberSearchCampus(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="ALL">全部校区</option>
                      <option value="思明校区">思明校区</option>
                      <option value="翔安校区">翔安校区</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-500 font-bold mb-1">学号</label>
                    <input
                      type="text"
                      placeholder="请输入学号..."
                      value={memberSearchStudentId}
                      onChange={e => setMemberSearchStudentId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-mono text-gray-800 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-500 font-bold mb-1">姓名</label>
                    <input
                      type="text"
                      placeholder="请输入姓名..."
                      value={memberSearchName}
                      onChange={e => setMemberSearchName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-500 font-bold mb-1">状态</label>
                    <select
                      value={memberSearchStatus}
                      onChange={e => setMemberSearchStatus(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="ALL">全部状态</option>
                      <option value="在岗">在岗</option>
                      <option value="离岗">离岗</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1 border-t border-gray-200/60">
                  <button
                    type="button"
                    onClick={handleResetMemberSearch}
                    className="px-4 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    重置
                  </button>
                  <button
                    type="button"
                    onClick={handleSearchMembers}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Search size={13} />
                    <span>查询</span>
                  </button>
                </div>
              </div>

              {/* “新增巡检员”按钮放到左侧和“巡检人员列表”互换 */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setInspectorFormStudentId('');
                    setInspectorFormName('');
                    setInspectorFormPhone('');
                    setInspectorFormStatus('在岗');
                    setInspectorFormCampus('思明校区');
                    setShowAddInspectorModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>新增巡检员</span>
                </button>
                <span className="font-bold text-gray-800 text-xs">
                  巡检人员列表 ({
                    (managingTeamMembers.members || []).filter(m => {
                      const { campus, studentId, name, status } = appliedMemberSearch;
                      if (campus !== 'ALL' && (m.campus || managingTeamMembers.campus) !== campus) return false;
                      if (studentId && !m.studentId.includes(studentId)) return false;
                      if (name && !m.name.includes(name)) return false;
                      if (status !== 'ALL' && m.status !== status) return false;
                      return true;
                    }).length
                  } 人)
                </span>
              </div>

              {/* Members List Table */}
              <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-2xs bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 font-bold text-gray-600 border-b border-gray-100">
                    <tr>
                      <th className="py-3 px-4">学号</th>
                      <th className="py-3 px-4">姓名</th>
                      <th className="py-3 px-4">联系电话</th>
                      <th className="py-3 px-4">状态</th>
                      <th className="py-3 px-4">工作校区</th>
                      <th className="py-3 px-4 text-center min-w-[150px]">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(() => {
                      const displayedMembers = (managingTeamMembers.members || []).filter(m => {
                        const { campus, studentId, name, status } = appliedMemberSearch;
                        if (campus !== 'ALL' && (m.campus || managingTeamMembers.campus) !== campus) return false;
                        if (studentId && !m.studentId.includes(studentId)) return false;
                        if (name && !m.name.includes(name)) return false;
                        if (status !== 'ALL' && m.status !== status) return false;
                        return true;
                      });

                      if (displayedMembers.length === 0) {
                        return (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-gray-400 font-medium">
                              暂无符合条件的巡检员记录
                            </td>
                          </tr>
                        );
                      }

                      return displayedMembers.map(m => (
                        <tr key={m.id} className="hover:bg-gray-50/60 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-gray-900">{m.studentId}</td>
                          <td className="py-3 px-4 font-bold text-gray-800">{m.name}</td>
                          <td className="py-3 px-4 font-mono text-gray-600">{m.phone}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                              m.status === '在岗'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {m.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-700 font-medium">{m.campus || managingTeamMembers.campus || '思明校区'}</td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => setViewingMemberDetails(m)}
                                className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                              >
                                查看
                              </button>
                              <button
                                type="button"
                                onClick={() => handleToggleMemberStatus(m.id)}
                                className={`px-2.5 py-1 border rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                                  m.status === '在岗'
                                    ? 'bg-amber-50 hover:bg-amber-100 text-amber-600 border-amber-200'
                                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-200'
                                }`}
                              >
                                {m.status === '在岗' ? '离岗' : '在岗'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-modal: 新增巡检员 Modal */}
      {showAddInspectorModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-60">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>新增巡检员</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddInspectorModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {/* 学号 + 查询按钮 */}
              <div>
                <label className="block text-gray-600 font-bold mb-1">
                  学号 <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inspectorFormStudentId}
                    onChange={e => setInspectorFormStudentId(e.target.value)}
                    placeholder="请输入学号 (如: 352202688)..."
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs text-gray-800 outline-none focus:bg-white focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleQueryStudentInfo}
                    disabled={!inspectorFormStudentId.trim()}
                    className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 disabled:opacity-50 font-bold rounded-xl text-xs transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Search size={13} />
                    <span>查询</span>
                  </button>
                </div>
              </div>

              {/* 姓名 (不可编辑) */}
              <div>
                <label className="block text-gray-600 font-bold mb-1">
                  姓名 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={inspectorFormName}
                  readOnly
                  disabled
                  placeholder="点击学号旁“查询”自动带出"
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-xl text-xs text-gray-700 font-bold cursor-not-allowed"
                />
              </div>

              {/* 联系电话 */}
              <div>
                <label className="block text-gray-600 font-bold mb-1">联系电话</label>
                <input
                  type="text"
                  value={inspectorFormPhone}
                  onChange={e => setInspectorFormPhone(e.target.value)}
                  placeholder="查询后可自动带出或手动修改"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono text-gray-800 outline-none focus:bg-white focus:border-blue-500"
                />
              </div>

              {/* 状态 */}
              <div>
                <label className="block text-gray-600 font-bold mb-1">状态</label>
                <select
                  value={inspectorFormStatus}
                  onChange={e => setInspectorFormStatus(e.target.value as '在岗' | '离岗')}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 outline-none focus:bg-white focus:border-blue-500 cursor-pointer"
                >
                  <option value="在岗">在岗</option>
                  <option value="离岗">离岗</option>
                </select>
              </div>

              {/* 工作校区 (包括：思明校区、翔安校区) */}
              <div>
                <label className="block text-gray-600 font-bold mb-1">工作校区</label>
                <select
                  value={inspectorFormCampus}
                  onChange={e => setInspectorFormCampus(e.target.value as '思明校区' | '翔安校区')}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 outline-none focus:bg-white focus:border-blue-500 cursor-pointer"
                >
                  <option value="思明校区">思明校区</option>
                  <option value="翔安校区">翔安校区</option>
                </select>
              </div>
            </div>

            <div className="px-6 py-3 bg-gray-50/80 border-t border-gray-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddInspectorModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveNewInspector}
                disabled={!inspectorFormStudentId.trim() || !inspectorFormName.trim()}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-modal: 查看巡检员详情 */}
      {viewingMemberDetails && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-60">
          <div className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>巡检员详细信息</span>
              </h3>
              <button
                type="button"
                onClick={() => setViewingMemberDetails(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-3 text-xs text-gray-700">
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="font-bold text-gray-500">学号：</span>
                <span className="font-mono font-bold text-gray-900">{viewingMemberDetails.studentId}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="font-bold text-gray-500">姓名：</span>
                <span className="font-bold text-gray-900">{viewingMemberDetails.name}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="font-bold text-gray-500">联系电话：</span>
                <span className="font-mono text-gray-900">{viewingMemberDetails.phone}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="font-bold text-gray-500">状态：</span>
                <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                  viewingMemberDetails.status === '在岗'
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                    : 'bg-amber-50 text-amber-600 border border-amber-200'
                }`}>
                  {viewingMemberDetails.status}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="font-bold text-gray-500">工作校区：</span>
                <span className="font-bold text-gray-900">{viewingMemberDetails.campus || '思明校区'}</span>
              </div>
            </div>

            <div className="px-6 py-3 bg-gray-50/80 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingMemberDetails(null)}
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. 新增巡检班组 Modal */}
      {showAddTeamModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>新增巡检班组</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddTeamModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-gray-600 font-bold mb-1">工作校区</label>
                <select
                  value={newTeamCampus}
                  onChange={e => setNewTeamCampus(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-800 outline-none focus:bg-white focus:border-blue-500 cursor-pointer"
                >
                  <option value="思明校区">思明校区</option>
                  <option value="翔安校区">翔安校区</option>
                  <option value="漳州校区">漳州校区</option>
                  <option value="樟宜校区">樟宜校区</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-600 font-bold mb-1">班组名称 *</label>
                <input
                  type="text"
                  placeholder="如：芙蓉隧道巡检二组"
                  value={newTeamName}
                  onChange={e => setNewTeamName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-800 outline-none focus:bg-white focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-bold mb-1">班组负责人 *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    placeholder="点击右侧“选择”按钮选择负责人"
                    value={newTeamLeader ? `${newTeamLeader}${newTeamLeaderStudentId ? ` (${newTeamLeaderStudentId})` : ''}` : ''}
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-800 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSelectLeaderModal(true)}
                    className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 font-bold rounded-xl text-xs transition-colors cursor-pointer shrink-0"
                  >
                    选择
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-600 font-bold mb-1">负责人联系电话</label>
                <input
                  type="text"
                  placeholder="如：13800138000"
                  value={newTeamLeaderPhone}
                  onChange={e => setNewTeamLeaderPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-800 outline-none focus:bg-white focus:border-blue-500"
                />
              </div>
            </div>
            <div className="px-6 py-3 bg-gray-50/80 border-t border-gray-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddTeamModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleAddTeam}
                disabled={!newTeamName.trim() || !newTeamLeader.trim()}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                确认创建
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-modal: 选择班组负责人 */}
      {showSelectLeaderModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-60">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>选择班组负责人</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowSelectLeaderModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-4 space-y-2 text-xs max-h-72 overflow-y-auto">
              {MOCK_LEADER_CANDIDATES.map(candidate => (
                <div
                  key={candidate.studentId}
                  className="p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/40 flex items-center justify-between transition-all cursor-pointer"
                  onClick={() => {
                    setNewTeamLeader(candidate.name);
                    setNewTeamLeaderStudentId(candidate.studentId);
                    setNewTeamLeaderPhone(candidate.phone);
                    setShowSelectLeaderModal(false);
                  }}
                >
                  <div>
                    <div className="font-bold text-gray-900 text-sm">
                      {candidate.name} <span className="font-mono text-xs text-gray-500">({candidate.studentId})</span>
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      校区：{candidate.campus} | 电话：{candidate.phone}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-2xs cursor-pointer"
                  >
                    选择
                  </button>
                </div>
              ))}
            </div>

            <div className="px-6 py-3 bg-gray-50/80 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowSelectLeaderModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
