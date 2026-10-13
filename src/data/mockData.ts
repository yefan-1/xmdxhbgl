import { 
  IoTModel, 
  IoTProductSpec, 
  IoTInstance, 
  SpatialNode, 
  ModelCategory, 
  EntityStatus, 
  AssetStatus 
} from "../types";

const ITEM_NAMES = [
  "照明灯", "办公桌", "人体工学椅", "高清投影仪", "温度传感器", "湿度计", 
  "多功能打印机", "咖啡机", "智能插座", "空气净化器", "电子白板", "文件柜", 
  "会议桌", "饮水机", "智能门锁", "监控摄像头", "排气扇", "烟雾报警器",
  "路由器", "投影幕布", "储物篮", "显示器支架", "碎纸机", "灭火器",
  "窗帘控制器", "指纹考勤机", "沙发", "茶几", "加湿器", "配电箱"
];

export const CATEGORIES_HIERARCHY: Record<string, Record<string, string[]>> = {
  '信息类': {
    '环境信息': ['天气', '温度', '光照', '湿度', 'PM2.5', 'PM10', '风速'],
    '系统信息': ['会议室预约系统', '教务排课系统', '会议室巡检系统', '教室巡检系统']
  },
  '实体类': {
    '基础家具': ['桌子', '椅子'],
    '网络通信': ['网络设备'],
    '基础电气': ['灯', '门', '监控', '电器']
  }
};

const CATEGORIES_LIST = Object.values(CATEGORIES_HIERARCHY).flatMap(sub => Object.values(sub).flat());

export const MOCK_SUPPLIERS = Array.from({ length: 15 }).map((_, i) => ({
  id: `sup-${i + 1}`,
  name: i % 2 === 0 ? `华研电子科技（集团）有限公司 ${i + 1}` : `陈建国（个体工商户） ${i + 1}`,
  identifier: `SUP_ID_${1000 + i}`,
  type: i % 2 === 0 ? '企业' : '个人',
  certificateType: i % 2 === 0 ? '统一社会信用代码' : '身份证',
  certificateNumber: i % 2 === 0 ? `91350200MA32${i}XXXX` : `35020419880101${i}XXX`,
  address: `福建省厦门市思明区 ${i + 1} 号大厦`,
  contact: `负责人 ${i + 1}`,
  phone: `138${i}000${i}000`.padEnd(11, '0')
}));

export const MOCK_MODELS: IoTModel[] = Array.from({ length: 60 }).map((_, i) => {
  const category = CATEGORIES_LIST[i % CATEGORIES_LIST.length];
  return {
    id: `m${i + 1}`,
    name: `${category} 监测单元 ${i + 1}`,
    identifier: `MODEL_${1000 + i}`,
    category: category,
    status: EntityStatus.ACTIVE,
    description: `${category}的基础管理模型，包含状态监测与基本属性定义。`,
    updatedAt: "2024-03-20",
    isModeled: i % 3 === 0
  };
});

export const MOCK_SPECS: IoTProductSpec[] = MOCK_MODELS.flatMap((model, idx) => {
  // Ensure each model in "Information" category has 3-5 specs
  const count = (model.category === '环境信息' || model.category === '系统信息' || CATEGORIES_LIST.slice(9).includes(model.category)) 
    ? 3 + (idx % 3) 
    : 2;
  
  return Array.from({ length: count }).map((_, i) => ({
    id: `spec-${model.id}-${i}`,
    modelId: model.id,
    name: `${model.name} ${['极速版', '稳健型', '企业级', '标准型', 'Ultra'][i % 5]}`,
    manufacturer: ["华瑞通讯", "远景科技", "博世IOT", "西门子数字"][i % 4],
    modelNumber: `SERIES-${1000 + i}`,
    version: `V${i + 1}.0`,
    status: EntityStatus.ACTIVE,
    updatedAt: "2024-03-25",
    description: `这是针对 ${model.name} 模型研发的第 ${i + 1} 代高性能规格实现。`
  }));
});

export const MOCK_INSTANCES: IoTInstance[] = Array.from({ length: 1200 }).map((_, i) => {
  const spec = MOCK_SPECS[i % MOCK_SPECS.length];
  return {
    id: `ins${i + 1}`,
    assetCode: `${903230000 + i}`,
    specId: spec.id,
    status: [AssetStatus.IN_USE, AssetStatus.AVAILABLE, AssetStatus.MAINTENANCE][i % 3],
    location: i % 2 === 0 ? `A栋, ${1 + (i % 5)}层, 办公室` : `B栋, 1层, 实验室`,
    owner: ["张三", "李四", "王五", "赵六", "陈七"][i % 5],
    purchaseDate: "2024-01-15",
    lastMaintenance: i % 4 === 0 ? "2024-03-01" : "2024-01-15"
  };
});

export const MOCK_SPATIAL_TREE: SpatialNode[] = [
  { id: "root", name: "智慧园区", type: "building", parentId: null, level: 0 },
  { id: "b1", name: "创新大楼", type: "building", parentId: "root", level: 1 },
  { id: "b1f1", name: "1层", type: "floor", parentId: "b1", level: 2 },
  { id: "b1f1r101", name: "101 车间", type: "room", parentId: "b1f1", level: 3 },
  { id: "b1f1r102", name: "大堂区域", type: "room", parentId: "b1f1", level: 3 },
  { id: "b1f2", name: "2层", type: "floor", parentId: "b1", level: 2 },
  { id: "b1f2r201", name: "数据中心", type: "room", parentId: "b1f2", level: 3 },
];
