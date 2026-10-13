import {
  ApprovalStatus,
  ApplicantRole,
  Campus,
  OrganizationRole,
  Inspector,
  InspectionLog,
  InspectionWarning,
  ViolationEvent,
  GraffitiTheme,
  QRCodeBinding,
  PosterBoard,
  PosterApplication,
  GraffitiArea,
  AreaUsageApplication,
  GraffitiSubmission,
  Murals3DItem
} from '../types/posterGraffitiTypes';

export const MOCK_ORGANIZATIONS: OrganizationRole[] = [
  {
    id: 'org-1',
    orgName: '校学生会宣传部',
    orgType: '学生组织',
    canApplyPoster: true,
    canApplyGraffiti: true,
    counselor: '张明哲 (校团委指导老师)',
    counselorPhone: '13805921001',
    deptLeader: '李伟华 处长',
    studentUnionReviewer: '王小琳 (主审)',
    isBanned: false
  },
  {
    id: 'org-2',
    orgName: '艺术学院青年志愿者协会',
    orgType: '学生组织',
    canApplyPoster: true,
    canApplyGraffiti: true,
    counselor: '陈静 老师',
    counselorPhone: '13805921002',
    deptLeader: '林副院长',
    studentUnionReviewer: '周杰 (副审)',
    isBanned: false
  },
  {
    id: 'org-3',
    orgName: '计算机科学与技术系',
    orgType: '学院党政',
    canApplyPoster: true,
    canApplyGraffiti: true,
    counselor: '郭一凡 (辅导员)',
    counselorPhone: '13805921003',
    deptLeader: '刘主任',
    studentUnionReviewer: '王小琳',
    isBanned: false
  },
  {
    id: 'org-4',
    orgName: '厦门大学吉他协会',
    orgType: '学术社团',
    canApplyPoster: true,
    canApplyGraffiti: false,
    counselor: '蔡老师',
    counselorPhone: '13805921004',
    deptLeader: '社团联合会指导老师',
    studentUnionReviewer: '周杰',
    isBanned: true,
    banReason: '上期海报超期3天未拆除，违反《校园公共区域管理规定》第14条',
    banUntil: '2026-09-30'
  },
  {
    id: 'org-5',
    orgName: '海洋与地球学院团党委',
    orgType: '行政部门',
    canApplyPoster: true,
    canApplyGraffiti: true,
    counselor: '黄美玲 (OA秘书)',
    counselorPhone: '13805921005',
    deptLeader: '郑书记',
    studentUnionReviewer: '王小琳',
    isBanned: false
  }
];

export const MOCK_INSPECTORS: Inspector[] = [
  {
    id: 'ins-101',
    name: '林云飞',
    studentId: '22920212204101',
    phone: '18950011234',
    campus: Campus.SIMING,
    assignedBoardIds: ['board-siming-1', 'board-siming-2', 'tunnel-zone-1'],
    status: 'ACTIVE',
    joinedDate: '2025-09-01',
    totalInspections: 142
  },
  {
    id: 'ins-102',
    name: '苏雨桐',
    studentId: '22920212204108',
    phone: '18950015678',
    campus: Campus.SIMING,
    assignedBoardIds: ['board-siming-3', 'tunnel-zone-2'],
    status: 'ACTIVE',
    joinedDate: '2025-09-10',
    totalInspections: 98
  },
  {
    id: 'ins-103',
    name: '张梓豪',
    studentId: '23220212201015',
    phone: '18950019988',
    campus: Campus.XIANGAN,
    assignedBoardIds: ['board-xiangan-1', 'board-xiangan-2'],
    status: 'ACTIVE',
    joinedDate: '2025-10-15',
    totalInspections: 115
  },
  {
    id: 'ins-104',
    name: '陈诗婷',
    studentId: '22920212204120',
    phone: '13850021133',
    campus: Campus.SIMING,
    assignedBoardIds: ['board-siming-1'],
    status: 'ACTIVE',
    joinedDate: '2025-09-12',
    totalInspections: 87
  },
  {
    id: 'ins-105',
    name: '李哲瀚',
    studentId: '23220212202045',
    phone: '13950032244',
    campus: Campus.XIANGAN,
    assignedBoardIds: ['board-xiangan-1'],
    status: 'ACTIVE',
    joinedDate: '2025-10-01',
    totalInspections: 64
  },
  {
    id: 'ins-106',
    name: '刘星雨',
    studentId: '22920212203088',
    phone: '15950043355',
    campus: Campus.SIMING,
    assignedBoardIds: ['board-siming-2', 'tunnel-zone-1'],
    status: 'ACTIVE',
    joinedDate: '2025-09-05',
    totalInspections: 103
  },
  {
    id: 'ins-107',
    name: '王若曦',
    studentId: '23220212205012',
    phone: '18850054466',
    campus: Campus.XIANGAN,
    assignedBoardIds: ['board-xiangan-2'],
    status: 'ACTIVE',
    joinedDate: '2025-10-20',
    totalInspections: 52
  },
  {
    id: 'ins-108',
    name: '赵宇轩',
    studentId: '22920212201099',
    phone: '13750065577',
    campus: Campus.SIMING,
    assignedBoardIds: ['tunnel-zone-2'],
    status: 'DISABLED',
    joinedDate: '2025-08-28',
    totalInspections: 31
  },
  {
    id: 'ins-109',
    name: '钱雅琪',
    studentId: '23220212206034',
    phone: '13650076688',
    campus: Campus.XIANGAN,
    assignedBoardIds: ['board-xiangan-3'],
    status: 'ACTIVE',
    joinedDate: '2025-11-02',
    totalInspections: 76
  },
  {
    id: 'ins-110',
    name: '孙浩然',
    studentId: '22920212207056',
    phone: '18050087799',
    campus: Campus.SIMING,
    assignedBoardIds: ['board-siming-3'],
    status: 'ACTIVE',
    joinedDate: '2025-09-15',
    totalInspections: 92
  },
  {
    id: 'ins-111',
    name: '周思涵',
    studentId: '23220212208021',
    phone: '18150098800',
    campus: Campus.XIANGAN,
    assignedBoardIds: ['board-xiangan-1'],
    status: 'ACTIVE',
    joinedDate: '2025-10-10',
    totalInspections: 48
  },
  {
    id: 'ins-112',
    name: '吴建宇',
    studentId: '22920212209077',
    phone: '18950101122',
    campus: Campus.SIMING,
    assignedBoardIds: ['board-siming-1', 'board-siming-2'],
    status: 'ACTIVE',
    joinedDate: '2025-09-08',
    totalInspections: 110
  },
  {
    id: 'ins-113',
    name: '郑心怡',
    studentId: '23220212210033',
    phone: '13850112233',
    campus: Campus.XIANGAN,
    assignedBoardIds: ['board-xiangan-2'],
    status: 'ACTIVE',
    joinedDate: '2025-10-25',
    totalInspections: 83
  },
  {
    id: 'ins-114',
    name: '王子涵',
    studentId: '22920212211066',
    phone: '13950123344',
    campus: Campus.SIMING,
    assignedBoardIds: ['tunnel-zone-1'],
    status: 'ACTIVE',
    joinedDate: '2025-09-18',
    totalInspections: 95
  },
  {
    id: 'ins-115',
    name: '冯天佑',
    studentId: '23220212212088',
    phone: '15950134455',
    campus: Campus.XIANGAN,
    assignedBoardIds: ['board-xiangan-3'],
    status: 'DISABLED',
    joinedDate: '2025-11-10',
    totalInspections: 24
  },
  {
    id: 'ins-116',
    name: '陈语嫣',
    studentId: '22920212213011',
    phone: '18850145566',
    campus: Campus.SIMING,
    assignedBoardIds: ['board-siming-3', 'tunnel-zone-2'],
    status: 'ACTIVE',
    joinedDate: '2025-09-22',
    totalInspections: 121
  },
  {
    id: 'ins-117',
    name: '褚欣妍',
    studentId: '23220212214044',
    phone: '13750156677',
    campus: Campus.XIANGAN,
    assignedBoardIds: ['board-xiangan-1'],
    status: 'ACTIVE',
    joinedDate: '2025-10-18',
    totalInspections: 69
  },
  {
    id: 'ins-118',
    name: '卫明杰',
    studentId: '22920212215077',
    phone: '13650167788',
    campus: Campus.SIMING,
    assignedBoardIds: ['board-siming-1'],
    status: 'ACTIVE',
    joinedDate: '2025-09-28',
    totalInspections: 78
  },
  {
    id: 'ins-119',
    name: '蒋嘉怡',
    studentId: '23220212216022',
    phone: '18050178899',
    campus: Campus.XIANGAN,
    assignedBoardIds: ['board-xiangan-2'],
    status: 'ACTIVE',
    joinedDate: '2025-11-05',
    totalInspections: 57
  },
  {
    id: 'ins-120',
    name: '沈博文',
    studentId: '22920212217055',
    phone: '18150189900',
    campus: Campus.SIMING,
    assignedBoardIds: ['board-siming-2'],
    status: 'ACTIVE',
    joinedDate: '2025-10-05',
    totalInspections: 89
  },
  {
    id: 'ins-121',
    name: '韩梦洁',
    studentId: '23220212218088',
    phone: '18950191122',
    campus: Campus.XIANGAN,
    assignedBoardIds: ['board-xiangan-3'],
    status: 'ACTIVE',
    joinedDate: '2025-11-12',
    totalInspections: 43
  },
  {
    id: 'ins-122',
    name: '杨子豪',
    studentId: '22920212219033',
    phone: '13850202233',
    campus: Campus.SIMING,
    assignedBoardIds: ['tunnel-zone-1', 'tunnel-zone-2'],
    status: 'ACTIVE',
    joinedDate: '2025-09-11',
    totalInspections: 134
  },
  {
    id: 'ins-123',
    name: '朱诗韵',
    studentId: '23220212220066',
    phone: '13950213344',
    campus: Campus.XIANGAN,
    assignedBoardIds: ['board-xiangan-1'],
    status: 'ACTIVE',
    joinedDate: '2025-10-28',
    totalInspections: 62
  },
  {
    id: 'ins-124',
    name: '秦天宇',
    studentId: '22920212221099',
    phone: '15950224455',
    campus: Campus.SIMING,
    assignedBoardIds: ['board-siming-3'],
    status: 'DISABLED',
    joinedDate: '2025-09-30',
    totalInspections: 18
  },
  {
    id: 'ins-125',
    name: '许佳琪',
    studentId: '23220212222044',
    phone: '18850235566',
    campus: Campus.XIANGAN,
    assignedBoardIds: ['board-xiangan-2'],
    status: 'ACTIVE',
    joinedDate: '2025-11-01',
    totalInspections: 71
  },
  {
    id: 'ins-126',
    name: '何文博',
    studentId: '22920212223077',
    phone: '13750246677',
    campus: Campus.SIMING,
    assignedBoardIds: ['board-siming-1', 'tunnel-zone-2'],
    status: 'ACTIVE',
    joinedDate: '2025-10-12',
    totalInspections: 105
  }
];

export const MOCK_INSPECTION_LOGS: InspectionLog[] = [
  {
    id: 'log-001',
    inspectorName: '林云飞',
    targetType: 'POSTER_BOARD',
    campus: '思明校区',
    targetName: '三家村1号张贴栏',
    checkTime: '2026-08-07 14:30',
    result: 'NORMAL',
    notes: '现场海报张贴规范，不干胶二维码清晰无损，无超期张贴行为。'
  },
  {
    id: 'log-002',
    inspectorName: '苏雨桐',
    targetType: 'TUNNEL_ZONE',
    campus: '思明校区',
    targetName: '芙蓉隧道 S-120m~S-125m 墙面',
    checkTime: '2026-08-07 10:15',
    result: 'ABNORMAL',
    notes: '发现墙面局部有未经审批的小型贴纸覆盖，已拍摄并上报违规事件。',
    photoUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&q=80',
    photoUrls: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&q=80',
      'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=500&q=80'
    ],
    actionTaken: '撕下海报',
    actionNotes: '已由巡检员现场撕除未经审批的小贴纸与违规违禁海报，并上报保卫处及违规事件中心作进一步追踪。'
  },
  {
    id: 'log-003',
    inspectorName: '张梓豪',
    targetType: 'POSTER_BOARD',
    campus: '翔安校区',
    targetName: '竞丰餐厅主张贴栏',
    checkTime: '2026-08-06 18:00',
    result: 'NORMAL',
    notes: '日常巡检完毕，所有海报均加盖有效防伪二维码。'
  },
  {
    id: 'log-004',
    inspectorName: '陈诗婷',
    targetType: 'TUNNEL_ZONE',
    campus: '思明校区',
    targetName: '芙蓉隧道 300m~350m 经典墙面',
    checkTime: '2026-08-06 14:20',
    result: 'NORMAL',
    notes: '涂鸦画面保持良好，无破损及违规乱涂乱画现象。'
  },
  {
    id: 'log-005',
    inspectorName: '李哲瀚',
    targetType: 'POSTER_BOARD',
    campus: '樟宜校区',
    targetName: '樟宜教学楼1号宣传栏',
    checkTime: '2026-08-05 16:45',
    result: 'ABNORMAL',
    notes: '发现一张过期未及时清理的海报，已通知申办部门按规定撤下。',
    photoUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=500&q=80',
    photoUrls: [
      'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=500&q=80',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&q=80'
    ],
    actionTaken: '未做任何处理',
    actionNotes: '因属于大型特种材质违规宣传版面，现场无法即时人工撕下，已拍照上报物业管理处安排专业工具拆除。'
  },
  {
    id: 'log-006',
    inspectorName: '刘星雨',
    targetType: 'POSTER_BOARD',
    campus: '漳州校区',
    targetName: '漳州校区北区学子餐厅旁海报栏',
    checkTime: '2026-08-05 09:30',
    result: 'NORMAL',
    notes: '海报完整无遮挡，巡检二维码扫描正常，记录核验通过。'
  },
  {
    id: 'log-007',
    inspectorName: '王若曦',
    targetType: 'POSTER_BOARD',
    campus: '翔安校区',
    targetName: '一期生活区1号宣传栏',
    checkTime: '2026-08-04 17:10',
    result: 'NORMAL',
    notes: '海报均在审批有效期内，现场平整清洁。'
  },
  {
    id: 'log-008',
    inspectorName: '孙浩然',
    targetType: 'TUNNEL_ZONE',
    campus: '思明校区',
    targetName: '芙蓉隧道 N-45m~N-50m 墙面',
    checkTime: '2026-08-04 11:25',
    result: 'NORMAL',
    notes: '主题壁画巡查正常，无非法涂抹。'
  },
  {
    id: 'log-009',
    inspectorName: '钱雅琪',
    targetType: 'POSTER_BOARD',
    campus: '翔安校区',
    targetName: '图书馆正门东侧公告栏',
    checkTime: '2026-08-03 15:40',
    result: 'ABNORMAL',
    notes: '防伪二维码不清晰，已联系宣传部重新打印复核。',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&q=80'
  },
  {
    id: 'log-010',
    inspectorName: '周思涵',
    targetType: 'POSTER_BOARD',
    campus: '思明校区',
    targetName: '南光二广场海报墙',
    checkTime: '2026-08-03 09:50',
    result: 'NORMAL',
    notes: '巡检通过，未见违规宣传物。'
  },
  {
    id: 'log-011',
    inspectorName: '吴建宇',
    targetType: 'TUNNEL_ZONE',
    campus: '思明校区',
    targetName: '芙蓉隧道 中段200m 展区',
    checkTime: '2026-08-02 16:15',
    result: 'NORMAL',
    notes: '艺术涂鸦维护良好，无外来污损。'
  },
  {
    id: 'log-012',
    inspectorName: '郑心怡',
    targetType: 'POSTER_BOARD',
    campus: '樟宜校区',
    targetName: '国际学院公告栏 A区',
    checkTime: '2026-08-02 10:30',
    result: 'NORMAL',
    notes: '双语海报均按规范挂载，印章健全。'
  },
  {
    id: 'log-013',
    inspectorName: '王子涵',
    targetType: 'POSTER_BOARD',
    campus: '漳州校区',
    targetName: '风雨球场西侧宣传栏',
    checkTime: '2026-08-01 14:05',
    result: 'ABNORMAL',
    notes: '发现非校园活动商业海报侵占版面，现场已进行清理并留存记录。',
    photoUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500&q=80'
  },
  {
    id: 'log-014',
    inspectorName: '陈语嫣',
    targetType: 'TUNNEL_ZONE',
    campus: '思明校区',
    targetName: '芙蓉隧道 S-50m 墙面',
    checkTime: '2026-08-01 08:45',
    result: 'NORMAL',
    notes: '早间例行巡视，隧道墙面整体清洁无异样。'
  },
  {
    id: 'log-015',
    inspectorName: '褚欣妍',
    targetType: 'POSTER_BOARD',
    campus: '翔安校区',
    targetName: '德旺图书馆西侧告示栏',
    checkTime: '2026-07-31 17:30',
    result: 'NORMAL',
    notes: '学术讲座海报按序号张贴，无重叠遮挡。'
  },
  {
    id: 'log-016',
    inspectorName: '卫明杰',
    targetType: 'POSTER_BOARD',
    campus: '思明校区',
    targetName: '建南大礼堂主公告栏',
    checkTime: '2026-07-31 11:20',
    result: 'NORMAL',
    notes: '迎新活动海报审批齐备，符合管理要求。'
  },
  {
    id: 'log-017',
    inspectorName: '蒋嘉怡',
    targetType: 'POSTER_BOARD',
    campus: '樟宜校区',
    targetName: '学生活动中心1楼长廊宣传板',
    checkTime: '2026-07-30 16:00',
    result: 'NORMAL',
    notes: '社团纳新海报均具备电子核验扣分码。'
  },
  {
    id: 'log-018',
    inspectorName: '沈博文',
    targetType: 'TUNNEL_ZONE',
    campus: '思明校区',
    targetName: '芙蓉隧道 出口50m 区域',
    checkTime: '2026-07-30 09:15',
    result: 'ABNORMAL',
    notes: '发现墙角有少量喷涂小广告，已上报后勤部门协助处理。',
    photoUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&q=80'
  },
  {
    id: 'log-019',
    inspectorName: '韩梦洁',
    targetType: 'POSTER_BOARD',
    campus: '翔安校区',
    targetName: '学苑餐厅2号海报板',
    checkTime: '2026-07-29 18:20',
    result: 'NORMAL',
    notes: '晚间抽查正常，海报贴合紧密。'
  },
  {
    id: 'log-020',
    inspectorName: '杨子豪',
    targetType: 'POSTER_BOARD',
    campus: '漳州校区',
    targetName: '园区主干道3号展板',
    checkTime: '2026-07-29 13:40',
    result: 'NORMAL',
    notes: '巡检核对完毕，全部合格。'
  },
  {
    id: 'log-021',
    inspectorName: '朱诗韵',
    targetType: 'TUNNEL_ZONE',
    campus: '思明校区',
    targetName: '芙蓉隧道 中段150m 墙面',
    checkTime: '2026-07-28 15:10',
    result: 'NORMAL',
    notes: '校庆主题涂鸦无划痕污损。'
  },
  {
    id: 'log-022',
    inspectorName: '许佳琪',
    targetType: 'POSTER_BOARD',
    campus: '思明校区',
    targetName: '演武田径场东侧海报栏',
    checkTime: '2026-07-28 10:00',
    result: 'NORMAL',
    notes: '体育赛事海报张贴规范，秩序良好。'
  },
  {
    id: 'log-023',
    inspectorName: '何文博',
    targetType: 'POSTER_BOARD',
    campus: '翔安校区',
    targetName: '医学院楼前告示栏',
    checkTime: '2026-07-27 16:50',
    result: 'NORMAL',
    notes: '卫生与健康宣教海报均已核验备案。'
  },
  {
    id: 'log-024',
    inspectorName: '林云飞',
    targetType: 'TUNNEL_ZONE',
    campus: '思明校区',
    targetName: '芙蓉隧道 S-80m 墙面',
    checkTime: '2026-07-27 09:30',
    result: 'NORMAL',
    notes: '现场无异常情况，记录已上传系统。'
  },
  {
    id: 'log-025',
    inspectorName: '苏雨桐',
    targetType: 'POSTER_BOARD',
    campus: '樟宜校区',
    targetName: '图书馆中庭宣传架',
    checkTime: '2026-07-26 14:15',
    result: 'NORMAL',
    notes: '架上宣讲会海报均为最新版本。'
  },
  {
    id: 'log-026',
    inspectorName: '张梓豪',
    targetType: 'POSTER_BOARD',
    campus: '漳州校区',
    targetName: '学林路海报长廊',
    checkTime: '2026-07-26 08:40',
    result: 'NORMAL',
    notes: '海报长廊全段巡检完成，无破损及脱落。'
  }
];

export const MOCK_WARNINGS: InspectionWarning[] = [
  {
    id: 'warn-01',
    targetName: '思明校区·群贤楼海报栏 B区',
    campus: Campus.SIMING,
    responsibleInspector: '林云飞',
    phone: '18950011234',
    lastCheckTime: '2026-08-05 09:00',
    overdueHours: 30,
    status: 'PENDING',
    createdTime: '2026-08-07 09:00'
  },
  {
    id: 'warn-02',
    targetName: '芙蓉隧道 300m~350m 巡检位',
    campus: Campus.SIMING,
    responsibleInspector: '苏雨桐',
    phone: '18950015678',
    lastCheckTime: '2026-08-05 16:20',
    overdueHours: 22,
    status: 'PENDING',
    createdTime: '2026-08-07 14:20'
  }
];

export const MOCK_VIOLATION_EVENTS: ViolationEvent[] = [
  {
    id: 'vio-2026-001',
    title: '群贤楼海报栏发现未加盖防伪二维码的海报',
    campus: '思明校区',
    targetType: '公共海报栏',
    targetName: '群贤楼2号展板',
    type: '未加盖印章/二维码',
    description: '宣传栏左侧海报未贴防伪二维码且缺少管理部门盖章印记。',
    reportTime: '2026-08-08 14:20',
    reportedBy: '林云飞',
    status: 'PENDING',
    photoUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&q=80',
    rectifyNotice: '请申办单位于24小时内到团委盖章并贴上防伪二维码，否则将予以清除。'
  },
  {
    id: 'vio-2026-002',
    title: '芙蓉隧道210米处涂鸦被擅自喷漆覆盖',
    campus: '思明校区',
    targetType: '芙蓉隧道',
    targetName: '芙蓉隧道 S-210m 侧墙',
    type: '擅自覆盖他人作品',
    description: '发现原有毕业季优秀涂鸦墙面被未经审批的商业喷漆涂抹覆盖。',
    reportTime: '2026-08-08 10:15',
    reportedBy: '苏雨桐',
    status: 'PENDING',
    photoUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500&q=80',
    rectifyNotice: '责令责任社团于48小时内恢复原貌。'
  },
  {
    id: 'vio-2026-003',
    title: '竞丰餐厅3号展板海报超期未清理',
    campus: '翔安校区',
    targetType: '公共海报栏',
    targetName: '竞丰餐厅3号展板',
    type: '超期未清理',
    description: '迎新草地音乐节海报超期展示5天，未按规定自主下架清理。',
    reportTime: '2026-08-07 16:30',
    reportedBy: '陈浩然',
    status: 'PENDING',
    photoUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=500&q=80'
  },
  {
    id: 'vio-2026-004',
    title: '图书馆东侧1号海报栏亚克力防护罩破损',
    campus: '樟宜校区',
    targetType: '公共海报栏',
    targetName: '图书馆东侧1号海报栏',
    type: '墙面/展板损坏',
    description: '海报栏亚克力防护玻璃框架松动受损，存在脱落隐患。',
    reportTime: '2026-08-07 09:00',
    reportedBy: '何文博',
    status: 'PENDING',
    photoUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&q=80'
  },
  {
    id: 'vio-2026-005',
    title: '三家村1号宣传栏海报赞助商业广告超标',
    campus: '思明校区',
    targetType: '公共海报栏',
    targetName: '三家村1号宣传栏',
    type: '内容与审批不符',
    description: '实际张贴海报印有未经预先审批备案的校外商业赞助二维码。',
    reportTime: '2026-08-06 11:20',
    reportedBy: '林云飞',
    status: 'PROCESSED',
    handleTime: '2026-08-06 15:30',
    handleMethod: '撕下海报并通报申办部门',
    handledBy: '张老师 (公共设施管理处)',
    photoUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&q=80'
  },
  {
    id: 'vio-2026-006',
    title: '漳州分馆展示墙局部涂鸦破损覆盖',
    campus: '漳州校区',
    targetType: '芙蓉隧道',
    targetName: '漳州分馆展示墙 80m',
    type: '擅自覆盖他人作品',
    description: '巡检发现展示墙角落涂鸦被非本校社团私下喷涂覆盖。',
    reportTime: '2026-08-05 14:00',
    reportedBy: '周小雅',
    status: 'PROCESSED',
    handleTime: '2026-08-05 17:10',
    handleMethod: '联系相关学院团委协助恢复原貌',
    handledBy: '校团委管理组',
    photoUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500&q=80'
  }
];

export const MOCK_GRAFFITI_THEMES: GraffitiTheme[] = [
  { id: 'thm-1', name: '毕业季 · 扬帆远航', description: '毕业生告别母校纪念涂鸦专区', activeCount: 28, createdBy: '校团委（张老师）', createdAt: '2026-05-01' },
  { id: 'thm-2', name: '百年校庆 · 嘉庚精神', description: '弘扬嘉庚精神与爱国怀乡传承', activeCount: 19, createdBy: '校团委（李老师）', createdAt: '2026-04-06' },
  { id: 'thm-3', name: '艺术探新 · 青春狂想', description: '美育艺术创作与视觉实验', activeCount: 35, createdBy: '艺术学院团党委', createdAt: '2026-01-15' },
  { id: 'thm-4', name: '前沿科技 · 未来无界', description: '人工智能、海洋探索与学术憧憬', activeCount: 12, createdBy: '校学生会', createdAt: '2026-03-10' }
];

export const MOCK_QR_BINDINGS: QRCodeBinding[] = [
  {
    id: 'qr-b01',
    qrCode: 'XM-POSTER-2026-0881',
    type: 'ADHESIVE_POSTER',
    targetTitle: '2026年厦门大学迎新草地音乐节',
    orgName: '校学生会宣传部',
    validFrom: '2026-08-08',
    validTo: '2026-08-10',
    boundTime: '2026-08-07 16:00',
    status: 'BOUND'
  },
  {
    id: 'qr-b02',
    qrCode: 'XM-GRAFFITI-2026-012',
    type: 'PVC_GRAFFITI',
    targetTitle: '芙蓉隧道《海丝嘉庚号》三维涂鸦',
    orgName: '海洋与地球学院团党委',
    validFrom: '2026-06-01',
    validTo: '2027-06-01',
    boundTime: '2026-05-28 10:30',
    status: 'BOUND'
  }
];

export const MOCK_POSTER_BOARDS: PosterBoard[] = [
  {
    id: 'board-siming-1',
    name: '思明校区·三家村1号张贴栏',
    campus: Campus.SIMING,
    locationDetail: '思明校区三家村广场东侧演武路口',
    totalColumns: 6,
    status: 'ACTIVE',
    inspectorName: '林云飞',
    columns: [
      { colIndex: 1, isOccupied: true, currentPosterId: 'pos-1', currentPosterTitle: '迎新草地音乐节', orgName: '校学生会宣传部', validTo: '2026-08-10' },
      { colIndex: 2, isOccupied: true, currentPosterId: 'pos-1', currentPosterTitle: '迎新草地音乐节', orgName: '校学生会宣传部', validTo: '2026-08-10' },
      { colIndex: 3, isOccupied: false },
      { colIndex: 4, isOccupied: true, currentPosterId: 'pos-2', currentPosterTitle: '人工智能与机器人前沿讲座', orgName: '计算机科学与技术系', validTo: '2026-08-09' },
      { colIndex: 5, isOccupied: false },
      { colIndex: 6, isOccupied: false }
    ]
  },
  {
    id: 'board-siming-2',
    name: '思明校区·群贤楼主海报栏',
    campus: Campus.SIMING,
    locationDetail: '群贤楼群中庭广场立柱区',
    totalColumns: 6,
    status: 'ACTIVE',
    inspectorName: '林云飞',
    columns: [
      { colIndex: 1, isOccupied: true, currentPosterId: 'pos-3', currentPosterTitle: '厦大美育艺术展', orgName: '艺术学院青年志愿者协会', validTo: '2026-08-11' },
      { colIndex: 2, isOccupied: false },
      { colIndex: 3, isOccupied: false },
      { colIndex: 4, isOccupied: false },
      { colIndex: 5, isOccupied: false },
      { colIndex: 6, isOccupied: false }
    ]
  },
  {
    id: 'board-xiangan-1',
    name: '翔安校区·竞丰餐厅前张贴栏',
    campus: Campus.XIANGAN,
    locationDetail: '翔安校区竞丰餐厅正门广场西侧',
    totalColumns: 6,
    status: 'ACTIVE',
    inspectorName: '张梓豪',
    columns: [
      { colIndex: 1, isOccupied: true, currentPosterId: 'pos-4', currentPosterTitle: '海洋科考成果分享会', orgName: '海洋与地球学院团党委', validTo: '2026-08-09' },
      { colIndex: 2, isOccupied: false },
      { colIndex: 3, isOccupied: false },
      { colIndex: 4, isOccupied: false },
      { colIndex: 5, isOccupied: false },
      { colIndex: 6, isOccupied: false }
    ]
  },
  {
    id: 'board-siming-3',
    name: '思明校区·芙蓉餐厅侧栏',
    campus: Campus.SIMING,
    locationDetail: '芙蓉餐厅一楼门口宣传廊',
    totalColumns: 6,
    status: 'DISABLED',
    disableReason: '展框修缮维护与防雨罩升级施工',
    estimatedRestoreDate: '2026-08-15',
    inspectorName: '苏雨桐',
    columns: Array.from({ length: 6 }).map((_, i) => ({ colIndex: i + 1, isOccupied: false }))
  }
];

export const MOCK_POSTER_APPLICATIONS: PosterApplication[] = [
  {
    id: 'pos-app-1001',
    title: '2026年厦门大学迎新草地音乐节',
    applicantName: '陈立群',
    applicantRole: ApplicantRole.STUDENT,
    orgName: '校学生会宣传部',
    contactPhone: '13959200001',
    posterImageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
    boardIds: ['board-siming-1'],
    selectedColumns: [{ boardId: 'board-siming-1', colIndices: [1, 2] }],
    posterSize: 'A1',
    startDate: '2026-08-08',
    endDate: '2026-08-10',
    daysCount: 3,
    status: ApprovalStatus.APPROVED,
    currentStep: '审批通过（已发防伪二维码）',
    approvalLogs: [
      { step: '辅导员初审', reviewer: '张明哲', action: 'APPROVED', comment: '活动内容积极健康，符合要求。', timestamp: '2026-08-06 10:00' },
      { step: '部门领导审核', reviewer: '李伟华 处长', action: 'APPROVED', comment: '同意场地使用申请。', timestamp: '2026-08-06 14:20' },
      { step: '学生会审批', reviewer: '王小琳', action: 'APPROVED', comment: '排期无冲突，准予选座。', timestamp: '2026-08-06 16:00' },
      { step: '团委终审', reviewer: '林团委书记', action: 'APPROVED', comment: '终审通过，颁发不干胶防伪二维码 XM-POSTER-2026-0881。', timestamp: '2026-08-07 09:30' }
    ],
    qrCode: 'XM-POSTER-2026-0881',
    submittedAt: '2026-08-06 09:00'
  },
  {
    id: 'pos-app-1002',
    title: '人工智能与机器人前沿学术讲座',
    applicantName: '王建军 教授',
    applicantRole: ApplicantRole.FACULTY,
    orgName: '计算机科学与技术系',
    contactPhone: '13959200002',
    posterImageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80',
    boardIds: ['board-siming-1'],
    selectedColumns: [{ boardId: 'board-siming-1', colIndices: [4] }],
    posterSize: 'A2',
    startDate: '2026-08-08',
    endDate: '2026-08-09',
    daysCount: 2,
    status: ApprovalStatus.APPROVED,
    currentStep: '审批通过（已发防伪二维码）',
    approvalLogs: [
      { step: 'OA秘书初审', reviewer: '郭一凡', action: 'APPROVED', comment: '学术讲座备案完成。', timestamp: '2026-08-06 11:00' },
      { step: '部门领导审核', reviewer: '刘主任', action: 'APPROVED', comment: '同意公示。', timestamp: '2026-08-06 15:00' },
      { step: '学生会审批', reviewer: '周杰', action: 'APPROVED', comment: '准予张贴。', timestamp: '2026-08-06 17:10' },
      { step: '团委终审', reviewer: '林团委书记', action: 'APPROVED', comment: '核准发码。', timestamp: '2026-08-07 10:00' }
    ],
    qrCode: 'XM-POSTER-2026-0882',
    submittedAt: '2026-08-06 10:15'
  },
  {
    id: 'pos-app-1003',
    title: '“自强不息”校史话剧巡演拉票宣传',
    applicantName: '李梦琪',
    applicantRole: ApplicantRole.STUDENT,
    orgName: '艺术学院青年志愿者协会',
    contactPhone: '13959200003',
    posterImageUrl: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=600&q=80',
    boardIds: ['board-siming-2'],
    selectedColumns: [{ boardId: 'board-siming-2', colIndices: [1] }],
    posterSize: 'A1',
    startDate: '2026-08-09',
    endDate: '2026-08-11',
    daysCount: 3,
    status: ApprovalStatus.COUNSELOR_APPROVED,
    currentStep: '部门领导审核中',
    approvalLogs: [
      { step: '辅导员初审', reviewer: '陈静 老师', action: 'APPROVED', comment: '初审合格。', timestamp: '2026-08-07 11:30' }
    ],
    submittedAt: '2026-08-07 10:00'
  }
];

export const MOCK_GRAFFITI_AREAS: GraffitiArea[] = [
  {
    id: 'area-tunnel-101',
    sectionCode: 'S-120m ~ S-125m',
    side: 'LEFT',
    meterStart: 120,
    meterEnd: 125,
    status: 'OCCUPIED',
    currentOwnerOrg: '艺术学院青年志愿者协会',
    ownershipValidTo: '2027-05-30'
  },
  {
    id: 'area-tunnel-102',
    sectionCode: 'S-210m ~ S-215m',
    side: 'RIGHT',
    meterStart: 210,
    meterEnd: 215,
    status: 'OCCUPIED',
    currentOwnerOrg: '海洋与地球学院团党委',
    ownershipValidTo: '2027-06-01'
  },
  {
    id: 'area-tunnel-103',
    sectionCode: 'S-340m ~ S-345m',
    side: 'LEFT',
    meterStart: 340,
    meterEnd: 345,
    status: 'AVAILABLE'
  },
  {
    id: 'area-tunnel-104',
    sectionCode: 'S-510m ~ S-515m',
    side: 'RIGHT',
    meterStart: 510,
    meterEnd: 515,
    status: 'AVAILABLE'
  }
];

export const MOCK_AREA_APPLICATIONS: AreaUsageApplication[] = [
  {
    id: 'area-app-01',
    applicantName: '张宇轩',
    orgName: '计算机科学与技术系',
    applicantRole: ApplicantRole.STUDENT,
    phone: '13700001111',
    areaId: 'area-tunnel-103',
    sectionCode: 'S-340m ~ S-345m',
    usagePlan: '拟打造“代码与艺术”主题墙，展现厦大信息学子对AI与前沿科技的艺术畅想。',
    applyTermYears: 1,
    status: ApprovalStatus.COUNSELOR_APPROVED,
    submittedAt: '2026-08-06 14:00',
    approvalLogs: [
      { step: '辅导员初审', reviewer: '郭一凡', action: 'APPROVED', comment: '方案详实，符合隧道美化宗旨。', timestamp: '2026-08-07 09:00' }
    ]
  }
];

export const MOCK_GRAFFITI_SUBMISSIONS: GraffitiSubmission[] = [
  {
    id: 'gra-sub-01',
    title: '《我爱你厦大 · 毕业季限定》',
    areaId: 'area-tunnel-101',
    sectionCode: 'S-120m ~ S-125m',
    side: 'LEFT',
    themeId: 'thm-1',
    themeName: '毕业季 · 扬帆远航',
    applicantName: '陈静',
    orgName: '艺术学院青年志愿者协会',
    artistTeam: '2022级油画系毕业创作组',
    artworkImageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&q=80',
    creationStartDate: '2026-05-10',
    creationEndDate: '2026-05-20',
    status: ApprovalStatus.APPROVED,
    qrCode: 'XM-PVC-GRAFFITI-2026-001',
    submittedAt: '2026-05-01 10:00',
    likesCount: 1420,
    approvalLogs: [
      { step: '辅导员初审', reviewer: '陈静 老师', action: 'APPROVED', comment: '推荐展示。', timestamp: '2026-05-02 09:00' },
      { step: '部门领导审核', reviewer: '林副院长', action: 'APPROVED', comment: '同意创作。', timestamp: '2026-05-03 11:00' },
      { step: '团委终审', reviewer: '校团委管理组', action: 'APPROVED', comment: '批准并核发PVC永久二维码。', timestamp: '2026-05-04 15:30' }
    ]
  },
  {
    id: 'gra-sub-02',
    title: '《海丝嘉庚号 · 星辰大海》',
    areaId: 'area-tunnel-102',
    sectionCode: 'S-210m ~ S-215m',
    side: 'RIGHT',
    themeId: 'thm-2',
    themeName: '百年校庆 · 嘉庚精神',
    applicantName: '黄美玲',
    orgName: '海洋与地球学院团党委',
    artistTeam: '科考船青年先锋队',
    artworkImageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80',
    creationStartDate: '2026-06-01',
    creationEndDate: '2026-06-15',
    status: ApprovalStatus.APPROVED,
    qrCode: 'XM-PVC-GRAFFITI-2026-002',
    submittedAt: '2026-05-20 16:00',
    likesCount: 2380,
    approvalLogs: [
      { step: '辅导员初审', reviewer: '黄美玲', action: 'APPROVED', comment: '海洋元素独具特色。', timestamp: '2026-05-21 10:00' },
      { step: '团委终审', reviewer: '校团委管理组', action: 'APPROVED', comment: '予以发码。', timestamp: '2026-05-22 14:00' }
    ]
  }
];

export const MOCK_3D_MURALS: Murals3DItem[] = [
  {
    id: 'mural-3d-1',
    title: '《我爱你厦大 · 毕业季》',
    artist: '2022级艺术学院毕业生',
    orgName: '艺术学院青年志愿者协会',
    theme: '毕业季 · 扬帆远航',
    side: 'LEFT',
    meterPosition: 120,
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&q=80',
    year: '2026',
    likes: 3520,
    description: '厦大芙蓉隧道最负盛名的经典打卡地，满载对母校的深情寄语与永恒记忆。',
    qrCode: 'XM-PVC-GRAFFITI-2026-001'
  },
  {
    id: 'mural-3d-2',
    title: '《海丝嘉庚号 · 蓝海征途》',
    artist: '海洋与地球学院先锋队',
    orgName: '海洋与地球学院团党委',
    theme: '百年校庆 · 嘉庚精神',
    side: 'RIGHT',
    meterPosition: 210,
    imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80',
    year: '2026',
    likes: 2190,
    description: '致敬陈嘉庚先生倾资兴学宏愿，描绘深海科考与蓝色梦想的新篇章。',
    qrCode: 'XM-PVC-GRAFFITI-2026-002'
  },
  {
    id: 'mural-3d-3',
    title: '《Hello World · 算力星图》',
    artist: '计算机系极客俱乐部',
    orgName: '计算机科学与技术系',
    theme: '前沿科技 · 未来无界',
    side: 'LEFT',
    meterPosition: 350,
    imageUrl: 'https://images.unsplash.com/photo-1561055657-b9e0bf0fa360?w=800&q=80',
    year: '2025',
    likes: 1840,
    description: '将二进制代码与星系漩涡融为一体，彰显科技与人文的交织碰撞。',
    qrCode: 'XM-PVC-GRAFFITI-2025-089'
  },
  {
    id: 'mural-3d-4',
    title: '《凤凰花开 · 光影厦大》',
    artist: '摄影与视觉艺术协会',
    orgName: '校学生会宣传部',
    theme: '艺术探新 · 青春狂想',
    side: 'RIGHT',
    meterPosition: 480,
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
    year: '2026',
    likes: 2910,
    description: '六月凤凰花开满演武场，火红的花海与嘉庚建筑相互辉映，如诗如画。',
    qrCode: 'XM-PVC-GRAFFITI-2026-042'
  }
];
