import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { createPortal } from 'react-dom';
import { 
  LayoutDashboard, 
  Box, 
  Search, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft,
  ChevronDown,
  Maximize2,
  Info,
  BarChart3,
  List,
  Map as MapIcon,
  Cpu,
  Smartphone,
  Monitor,
  Zap,
  Tag,
  MapPin,
  Calendar,
  X,
  Plus,
  Building2,
  Layers,
  Trash2,
  Eye,
  Filter,
  GripVertical,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import * as THREE from 'three';
import { MOCK_INSTANCES, MOCK_SPECS, MOCK_MODELS } from '../data/mockData';
import Pagination from './ui/Pagination';

interface SpaceModel {
  id: string;
  code: string;
  name: string;
  type: 'building' | 'room';
  image: string;
  description: string;
  isMarked?: boolean;
}

const SIDEBAR_IMAGE = "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=200";

const MOCK_BUILDINGS: SpaceModel[] = Array.from({ length: 30 }).map((_, i) => ({
  id: `b-${i + 1}`,
  code: `903231${225 + i}`,
  name: i === 0 ? '行政研发中心-主楼' : `实验大楼-${i + 1}号楼`,
  type: 'building',
  image: SIDEBAR_IMAGE,
  description: i === 0 ? '华侨大学核心行政区域，包含办公、会议及数字化展厅功能。' : `标准化科研建筑，集成先进实验室设施与协作空间。`,
  isMarked: i % 3 !== 1
}));

const MOCK_ROOMS: SpaceModel[] = Array.from({ length: 30 }).map((_, i) => ({
  id: `r-${i + 1}`,
  code: `903241${335 + i}`,
  name: i === 0 ? '信息大楼-204阶梯教室' : `教学楼-10${i + 1}教室`,
  type: 'room',
  image: SIDEBAR_IMAGE,
  description: i === 0 ? '标准化阶梯教室，可容纳120人，已完成数字化空间扫描。' : `数字化智慧教室，集成环境监测与智能照明。`,
  isMarked: i % 4 !== 1
}));

const MOCK_SPACE_MODELS: SpaceModel[] = [...MOCK_BUILDINGS, ...MOCK_ROOMS];

interface RoomItem {
  id: string;
  name: string;
  roomNumber: string;
  code: string;
  description: string;
}

interface FloorItem {
  floor: number;
  floorName: string;
  rooms: RoomItem[];
}

const BUILDING_FLOORS_DATA: FloorItem[] = [
  {
    floor: 5,
    floorName: '5F 核心决策控制区',
    rooms: [
      { id: 'r501', roomNumber: '501', name: '全景指挥座舱', code: 'P-501', description: '高可视性综合调度室' },
      { id: 'r502', roomNumber: '502', name: '国际会商中心', code: 'P-502', description: '多语种高端会议讨论区' },
      { id: 'r503', roomNumber: '503', name: '露天全息中庭', code: 'P-503', description: '增强现实展示空间' },
      { id: 'r504', roomNumber: '504', name: '备用机房', code: 'P-504', description: '冗余双回路保障机柜区' }
    ]
  },
  {
    floor: 4,
    floorName: '4F 高级协同中心',
    rooms: [
      { id: 'r401', roomNumber: '401', name: '前沿技术论坛', code: 'P-401', description: '学术研讨与技术沙龙区' },
      { id: 'r402', roomNumber: '402', name: '综合行政套间', code: 'P-402', description: '行政办公支持单元' },
      { id: 'r403', roomNumber: '403', name: '云计算机房', code: 'P-403', description: '弹性算力及混合云节点' },
      { id: 'r404', roomNumber: '404', name: '硬件物料库', code: 'P-404', description: '高价值资产硬件存放管理' }
    ]
  },
  {
    floor: 3,
    floorName: '3F 物联网创新极',
    rooms: [
      { id: 'r301', roomNumber: '301', name: '传感器调试舱', code: 'P-301', description: '微电磁干扰传感器标定舱' },
      { id: 'r302', roomNumber: '302', name: '设备标定站', code: 'P-302', description: '自动化检测及质量核准面' },
      { id: 'r303', roomNumber: '303', name: '安全控制机房', code: 'P-303', description: '网络防火墙及专线传输中心' },
      { id: 'r304', roomNumber: '304', name: '休闲咖啡吧', code: 'P-304', description: '技术人员休息与休闲协作区' }
    ]
  },
  {
    floor: 2,
    floorName: '2F 云网研发中心',
    rooms: [
      { id: 'r201', roomNumber: '201', name: '信息系统开发室', code: 'P-201', description: '高计算配置研发工位区' },
      { id: 'r202', roomNumber: '202', name: '网络路由测试区', code: 'P-202', description: '全频段网络交换性能评测站' },
      { id: 'r203', roomNumber: '203', name: '联合会议室', code: 'P-203', description: '中型智能化多人协作会议室' },
      { id: 'r204', roomNumber: '204', name: '储物间', code: 'P-204', description: '通用物料与设备配件储藏' }
    ]
  },
  {
    floor: 1,
    floorName: '1F 科技体验厅',
    rooms: [
      { id: 'r101', roomNumber: '101', name: '智能多媒体大厅', code: 'P-101', description: '多端联控高饱和数字化展示厅' },
      { id: 'r102', roomNumber: '102', name: '中控监测站', code: 'P-102', description: '统一物联网运维监控大屏幕区' },
      { id: 'r103', roomNumber: '103', name: '客户接待区', code: 'P-103', description: '商务来访沟通接待舒适区' },
      { id: 'r104', roomNumber: '104', name: '安全设备房', code: 'P-104', description: '低压配电与核心供水消防监控端' }
    ]
  }
];

const MOCK_SPATIAL_LAYERS = [
  { id: 'lay-1', name: '全域智慧物联感知网图层', code: '903241-NET-01', description: '数字化多联控自适应通信感知网络，节点自动拓扑重组与冗余备份空间层。', image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=600' },
  { id: 'lay-2', name: '高清热力安防监控路由图层', code: '903241-SEC-02', description: '环境高清轨迹覆盖、热成像动态追踪、实时视频网格拓扑覆盖层。', image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=600' },
  { id: 'lay-3', name: '数字孪生双碳能效管理平面', code: '903241-ENG-03', description: '包含高低压配电传感器、中央能耗流诊断、终端高负载回路数字镜像图层。', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600' },
  { id: 'lay-4', name: '微观生态温湿感知测绘图层', code: '903241-ENV-04', description: '集成温湿度感知、高精度光照辐射、空气质量格栅微感应信息感知层。', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=600' }
];

export default function SpaceManagement() {
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  
  // 新空间选择器相关状态
  const [selectedUsageSpace, setSelectedUsageSpace] = useState<{
    image: string;
    name: string;
    code: string;
    type: '建筑' | '空间图层';
  } | null>(null);

  const [isSpaceSelectorOpen, setIsSpaceSelectorOpen] = useState(false);
  const [selectorTab, setSelectorTab] = useState<'building' | 'layer'>('building');
  const [selectorSearch, setSelectorSearch] = useState('');
  
  // 弹窗右侧面板状态
  const [modalSelectedBuilding, setModalSelectedBuilding] = useState<any>(MOCK_BUILDINGS[0]);
  const [modalSelectedLayer, setModalSelectedLayer] = useState<any>(MOCK_SPATIAL_LAYERS[0]);
  const [modalRightTab, setModalRightTab] = useState<'3d' | 'list'>('3d');
  const [modalActiveFloor, setModalActiveFloor] = useState<number | null>(null);

  const [activeTab, setActiveTab] = useState<'list' | 'viewer'>('list');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Sidebar List States
  const [sidebarTab, setSidebarTab] = useState<'building' | 'layer'>('building');
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [sidebarPage, setSidebarPage] = useState(1);
  const sidebarPageSize = 6;

  // New Space Information Modal States
  const [isNewSpaceModalOpen, setIsNewSpaceModalOpen] = useState(false);
  const [newSpaceForm, setNewSpaceForm] = useState({
    type: 'building' as 'building' | 'layer',
    locationInfo: '',
    layerCode: '',
    layerName: '',
    need3D: false,
    description: ''
  });

  // State definitions for custom dynamic indoor mapping (Floors & Rooms lists) inside spatial form
  const [newSpaceFloors, setNewSpaceFloors] = useState<any[]>([
    { id: 'f-1', name: '1楼 (1F)', code: 'FL-01' },
    { id: 'f-2', name: '2楼 (2F)', code: 'FL-02' },
    { id: 'f-3', name: '3楼 (3F)', code: 'FL-03' }
  ]);
  const [newSpaceRooms, setNewSpaceRooms] = useState<Record<string, any[]>>({
    'f-1': [
      { id: 'r-1-1', roomNumber: '101', code: 'RM-101', area: '120.5', usage: '科技展厅' },
      { id: 'r-1-2', roomNumber: '102', code: 'RM-102', area: '85.2', usage: '全景中控区' }
    ],
    'f-2': [
      { id: 'r-2-1', roomNumber: '201', code: 'RM-201', area: '98.0', usage: '物联标定室' },
      { id: 'r-2-2', roomNumber: '202', code: 'RM-202', area: '110.0', usage: '计算终端室' }
    ],
    'f-3': [
      { id: 'r-3-1', roomNumber: '301', code: 'RM-301', area: '150.0', usage: '多功能学术大厅' }
    ]
  });
  const [activeFloorId, setActiveFloorId] = useState<string>('f-1');

  // Addition forms states
  const [isAddingFloor, setIsAddingFloor] = useState(false);
  const [addFloorForm, setAddFloorForm] = useState({ name: '', code: '' });

  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [addRoomForm, setAddRoomForm] = useState({ roomNumber: '', code: '', area: '', usage: '办公室' });
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedRoomIndex, setDraggedRoomIndex] = useState<number | null>(null);

  // Custom persistent state for the dynamic list of space models, to show newly created mock spaces
  const [spaceModels, setSpaceModels] = useState<any[]>(MOCK_SPACE_MODELS);

  // System Toast state
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  };

  const handleAddFloor = () => {
    if (!addFloorForm.name || !addFloorForm.code) {
      showToast('⚠️ 请完整填写楼层名称和位置编码');
      return;
    }
    const newFloorId = `f-${Date.now()}`;
    const newFloor = {
      id: newFloorId,
      name: addFloorForm.name,
      code: addFloorForm.code
    };
    setNewSpaceFloors([...newSpaceFloors, newFloor]);
    setNewSpaceRooms({
      ...newSpaceRooms,
      [newFloorId]: []
    });
    setActiveFloorId(newFloorId);
    setAddFloorForm({ name: '', code: '' });
    setIsAddingFloor(false);
    showToast(`🎉 成功添加楼层 [ ${newFloor.name} ]`);
  };

  const handleDeleteFloor = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const floorItem = newSpaceFloors.find(f => f.id === id);
    const updatedFloors = newSpaceFloors.filter(f => f.id !== id);
    setNewSpaceFloors(updatedFloors);
    
    const updatedRooms = { ...newSpaceRooms };
    delete updatedRooms[id];
    setNewSpaceRooms(updatedRooms);

    if (activeFloorId === id && updatedFloors.length > 0) {
      setActiveFloorId(updatedFloors[0].id);
    }
    
    if (floorItem) {
      showToast(`🗑️ 已成功移除楼层 [ ${floorItem.name} ]`);
    }
  };

  const handleMoveFloor = (index: number, direction: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === newSpaceFloors.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...newSpaceFloors];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    
    setNewSpaceFloors(updated);
    showToast('✨ 楼层顺序已更新');
  };

  const handleAddRoom = () => {
    if (!addRoomForm.roomNumber || !addRoomForm.code) {
      showToast('⚠️ 房间号和位置编码为必填项');
      return;
    }
    const currentRooms = newSpaceRooms[activeFloorId] || [];
    const newRoom = {
      id: `r-${Date.now()}`,
      roomNumber: addRoomForm.roomNumber,
      code: addRoomForm.code,
      area: addRoomForm.area || '0',
      usage: addRoomForm.usage || '办公室'
    };
    setNewSpaceRooms({
      ...newSpaceRooms,
      [activeFloorId]: [...currentRooms, newRoom]
    });
    setAddRoomForm({ roomNumber: '', code: '', area: '', usage: '办公室' });
    setIsAddingRoom(false);
    showToast(`🎉 成功在当前选定楼层创建房间 [ ${newRoom.roomNumber} ]`);
  };

  const handleDeleteRoom = (roomId: string) => {
    const currentRooms = newSpaceRooms[activeFloorId] || [];
    const roomItem = currentRooms.find(r => r.id === roomId);
    setNewSpaceRooms({
      ...newSpaceRooms,
      [activeFloorId]: currentRooms.filter(r => r.id !== roomId)
    });
    if (roomItem) {
      showToast(`🗑️ 已成功删除房间 [ ${roomItem.roomNumber} ]`);
    }
  };

  const handleSaveNewSpace = () => {
    if (newSpaceForm.type === 'building') {
      if (!newSpaceForm.locationInfo) {
        showToast('⚠️ 建筑名称与位置信息为必填项');
        return;
      }
      
      const newBuildingId = `b-${Date.now()}`;
      const newBuilding = {
        id: newBuildingId,
        code: `903230${Math.floor(100 + Math.random() * 900)}`,
        name: newSpaceForm.locationInfo,
        type: 'building' as const,
        image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=200",
        description: '刚刚通过配置态动态创建、精细化3D扫描出的核心数智测绘楼宇。',
        isMarked: true,
        need3D: newSpaceForm.need3D,
        floors: newSpaceFloors,
        rooms: newSpaceRooms
      };

      setSpaceModels([newBuilding, ...spaceModels]);
      showToast(`🎉 成功录入最新建筑实体空间: [ ${newBuilding.name} ]`);
    } else {
      if (!newSpaceForm.layerName || !newSpaceForm.layerCode) {
        showToast('⚠️ 空间图层名称和编码为必填项');
        return;
      }

      const newLayerId = `lay-${Date.now()}`;
      const newLayer = {
        id: newLayerId,
        code: newSpaceForm.layerCode,
        name: newSpaceForm.layerName,
        type: 'room' as const,
        image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=200",
        description: newSpaceForm.description || '自定义数字孪生覆盖测绘图层。',
        isMarked: false
      };

      setSpaceModels([newLayer, ...spaceModels]);
      showToast(`🎉 成功录入新型测绘图层: [ ${newLayer.name} ]`);
    }

    // Reset Form & close
    setNewSpaceForm({
      type: 'building',
      locationInfo: '',
      layerCode: '',
      layerName: '',
      need3D: false,
      description: ''
    });
    setIsNewSpaceModalOpen(false);
  };

  useEffect(() => {
    const handleOpenNewSpace = () => setIsNewSpaceModalOpen(true);
    window.addEventListener('open-new-space-modal', handleOpenNewSpace);
    return () => window.removeEventListener('open-new-space-modal', handleOpenNewSpace);
  }, []);

  const DEPARTMENT_TREE: Record<string, string[]> = {
    '校党政职能部门': [
      '党委办公室/校长办公室',
      '党委组织部/统战部',
      '党委宣传部/教师工作部',
      '党委学生工作部',
      '纪检监察办公室',
      '教务处/实验室与设备管理',
      '研究生院',
      '资产管理处',
      '财务处',
      '信息化建设与管理处',
      '后勤保障部'
    ],
    '教学科研单位': [
      '经济与管理学院',
      '法学院',
      '理学院',
      '信息科学与工程学院',
      '机电及自动化学院',
      '建筑学院',
      '土木工程学院',
      '新闻与传播学院',
      '外国语学院',
      '计算机科学与技术学院'
    ]
  };
  
  // Selection States
  const [selectionType, setSelectionType] = useState<'building' | 'layer'>('building');
  const [tempSelectedBuilding, setTempSelectedBuilding] = useState<SpaceModel | null>(null);
  const [tempSelectedLayer, setTempSelectedLayer] = useState<any>(null);
  const [tempSelectedRoom, setTempSelectedRoom] = useState<any>(null);

  // Modal Visibility States
  const [isMainModalOpen, setIsMainModalOpen] = useState(false);
  const [isBuildingListOpen, setIsBuildingListOpen] = useState(false);
  const [isLayerListOpen, setIsLayerListOpen] = useState(false);
  const [isIndoorSpaceOpen, setIsIndoorSpaceOpen] = useState(false);
  
  const handleConfirmSelection = () => {
    if (selectionType === 'building') {
      if (tempSelectedBuilding && tempSelectedRoom) {
        setSelectedUsageSpace({
          name: `${tempSelectedBuilding.name} - Room #${tempSelectedRoom.roomNumber}`,
          code: tempSelectedRoom.code,
          image: tempSelectedBuilding.image || '',
          type: '建筑'
        });
        setSelectedModelId(tempSelectedBuilding.id);
      }
    } else {
      if (tempSelectedLayer) {
        setSelectedUsageSpace({
          name: tempSelectedLayer.name,
          code: tempSelectedLayer.code,
          image: tempSelectedLayer.image || '',
          type: '空间图层'
        });
        setSelectedModelId(tempSelectedLayer.id);
      }
    }
    setIsMainModalOpen(false);
  };
  
  // Search & Pagination States for Sub-modals
  const [buildingSearchCode, setBuildingSearchCode] = useState('');
  const [buildingSearchName, setBuildingSearchName] = useState('');
  const [buildingModalPage, setBuildingModalPage] = useState(1);
  const buildingPageSize = 5;

  const [layerSearchCode, setLayerSearchCode] = useState('');
  const [layerSearchName, setLayerSearchName] = useState('');
  const [layerModalPage, setLayerModalPage] = useState(1);
  const layerPageSize = 5;

  // New Asset Modal States
  const [isNewAssetModalOpen, setIsNewAssetModalOpen] = useState(false);
  const [isAssetSelectionModalOpen, setIsAssetSelectionModalOpen] = useState(false);
  const [isDeptPickerOpen, setIsDeptPickerOpen] = useState(false);
  const [deptPickerTarget, setDeptPickerTarget] = useState<'newAsset' | 'assetSelSearch' | null>(null);
  const [expandedDepts, setExpandedDepts] = useState<string[]>(['校党政职能部门', '教学科研单位']);
  const [isModelTreeOpen, setIsModelTreeOpen] = useState(false);
  
  // New Asset Form States
  const [newAssetForm, setNewAssetForm] = useState({
    assetId: '',
    physicalModel: '',
    specId: '',
    specName: '',
    purchaseDate: '',
    contractId: '',
    propertyDept: '',
    useDept: '',
    useDate: new Date().toISOString().split('T')[0],
    description: ''
  });

  // Asset Selection Search States
  const [assetSelSearch, setAssetSelSearch] = useState({
    assetId: '',
    modelId: '',
    specName: '',
    contractId: '',
    propertyDept: '',
    supplier: '',
    manufacturer: ''
  });

  const [assetSelPage, setAssetSelPage] = useState(1);
  const assetSelPageSize = 5;

  const [assetSearchQuery, setAssetSearchQuery] = useState('');
  const [physicalModelFilter, setPhysicalModelFilter] = useState('');
  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  
  // Final application selection
  const selectedSpace = spaceModels.find(m => m.id === selectedModelId);

  const paginatedAssets = MOCK_INSTANCES.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Mock statistics
  const stats = {
    totalAssets: 42,
    onlineAssets: 38,
    types: [
      { name: '网络设备', count: 12, icon: <Cpu size={14} /> },
      { name: '监控安防', count: 8, icon: <Zap size={14} /> },
      { name: '办公家电', count: 22, icon: <Monitor size={14} /> },
    ]
  };

  useEffect(() => {
    if (activeTab !== 'viewer' || !canvasRef.current) return;

    // Initialize Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf1f5f9);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, canvasRef.current.clientWidth / canvasRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    canvasRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    // Initial Object
    updateModel(selectedModelId, scene);

    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!canvasRef.current || !rendererRef.current) return;
      camera.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (canvasRef.current && rendererRef.current) {
        canvasRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, [activeTab, selectedModelId]);

  const updateModel = (id: string, scene: THREE.Scene) => {
    // Clear previous objects
    const toRemove: THREE.Object3D[] = [];
    scene.children.forEach(child => {
      if (child instanceof THREE.Mesh || child instanceof THREE.Group) {
        toRemove.push(child);
      }
    });
    toRemove.forEach(child => scene.remove(child));

    const modelGroup = new THREE.Group();
    
    // Create a room structure (classroom space)
    const floorGeo = new THREE.BoxGeometry(10, 0.2, 8);
    const floorMat = new THREE.MeshPhongMaterial({ color: 0x94a3b8 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    modelGroup.add(floor);

    // Walls
    const wallMat = new THREE.MeshPhongMaterial({ color: 0xe2e8f0, transparent: true, opacity: 0.8 });
    const backWallGeo = new THREE.BoxGeometry(10, 4, 0.2);
    const backWall = new THREE.Mesh(backWallGeo, wallMat);
    backWall.position.set(0, 2, -4);
    modelGroup.add(backWall);

    const sideWallGeo = new THREE.BoxGeometry(0.2, 4, 8);
    const leftWall = new THREE.Mesh(sideWallGeo, wallMat);
    leftWall.position.set(-5, 2, 0);
    modelGroup.add(leftWall);

    // Desks (simple rectangles)
    const deskMat = new THREE.MeshPhongMaterial({ color: 0x3b82f6 });
    for (let i = -3; i <= 3; i += 2) {
      for (let j = -1; j <= 2; j += 1.5) {
        const deskGeo = new THREE.BoxGeometry(1, 0.1, 0.6);
        const desk = new THREE.Mesh(deskGeo, deskMat);
        desk.position.set(i, 0.8, j);
        modelGroup.add(desk);
        
        const legGeo = new THREE.BoxGeometry(0.05, 0.8, 0.05);
        const leg = new THREE.Mesh(legGeo, deskMat);
        leg.position.set(i, 0.4, j);
        modelGroup.add(leg);
      }
    }

    scene.add(modelGroup);
  };

  const filteredSidebarItems = (sidebarTab === 'building' 
    ? spaceModels.filter(s => s.type === 'building') 
    : spaceModels.filter(s => s.type === 'room' || s.type === 'layer')
  ).filter(item => 
    item.name.includes(sidebarSearch) || item.code.includes(sidebarSearch)
  );
  const totalSidebarPages = Math.ceil(filteredSidebarItems.length / sidebarPageSize);
  const paginatedSidebarItems = filteredSidebarItems.slice((sidebarPage - 1) * sidebarPageSize, sidebarPage * sidebarPageSize);

  return (
    <div className="h-full flex bg-[#F8F9FA] overflow-hidden relative font-sans">
      {/* Toast Notice banner overlay */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-8 right-8 z-[20000] bg-slate-900 border border-slate-800 text-white rounded-3xl py-4.5 px-6 shadow-2xl flex items-center gap-3 w-80 shadow-black/30"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
              <span className="text-blue-400 font-bold">✨</span>
            </div>
            <div className="flex-1 min-w-0 text-left">
              <h5 className="text-[9px] uppercase font-black tracking-widest text-slate-400 block">系统通知</h5>
              <p className="text-xs font-black text-slate-100 mt-0.5 whitespace-normal break-words leading-tight">{toastMsg}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar - Space Selection & Info */}
      <motion.div 
        animate={{ width: isSidebarExpanded ? 320 : 48 }}
        transition={{ type: 'spring', damping: 25, stiffness: 120 }}
        className="flex-none bg-white border-r border-gray-100 flex flex-col shadow-sm z-20 relative overflow-hidden"
      >
        {/* Collapsed State Sliver */}
        <AnimatePresence>
          {!isSidebarExpanded && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center pt-8 gap-4 bg-white"
            >
              <button 
                onClick={() => setIsSidebarExpanded(true)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all active:scale-90"
                title="展开面板"
              >
                <ChevronRight size={20} />
              </button>
              <div className="[writing-mode:vertical-lr] text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                使用空间
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expanded Content */}
        <div className={`flex-1 flex flex-col min-w-[320px] transition-opacity duration-200 ${isSidebarExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
            <h3 className="text-xs font-black text-gray-900 tracking-wider uppercase">使用空间</h3>
            <button 
              onClick={() => setIsSidebarExpanded(false)}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              title="收起面板"
            >
              <ChevronLeft size={16} />
            </button>
          </div>

          <div className="flex-1 p-6 flex flex-col justify-between overflow-y-auto bg-gray-50/30">
            {selectedUsageSpace === null ? (
              /* Default State: Display a beautiful select button */
               <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 text-center">
                 <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-3xl flex items-center justify-center text-blue-600 mb-6 shadow-md shadow-blue-50">
                    <MapPin size={28} className="stroke-[1.8] text-blue-600" />
                 </div>
                 <h4 className="text-sm font-black text-gray-800 mb-2">未设置资产空间</h4>
                 <p className="text-[11px] text-gray-400 font-medium leading-relaxed mb-8 max-w-[200px]">
                   在开始使用资产前，请先指定资产的目标运行空间
                 </p>
                 <button
                   onClick={() => {
                     // Reset selector states to initial building
                     setSelectorTab('building');
                     setSelectorSearch('');
                     setModalSelectedBuilding(MOCK_BUILDINGS[0]);
                     setModalActiveFloor(null);
                     setModalRightTab('3d');
                     setIsSpaceSelectorOpen(true);
                   }}
                   className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[11px] font-black uppercase tracking-wider shadow-lg shadow-blue-100 active:scale-95 transition-all text-center flex items-center justify-center gap-2"
                 >
                   <Plus size={16} className="stroke-[2.5]" />
                   请选择资产使用空间
                 </button>
               </div>
            ) : (
              /* Selected State: Backfill visualization */
              <div className="space-y-6 flex flex-col h-full justify-between">
                <div className="space-y-5">
                  {/* Space Image Spec */}
                  <div className="relative rounded-3xl overflow-hidden border border-gray-150 aspect-video bg-gray-100 shadow-md">
                     <img 
                       src={selectedUsageSpace.image} 
                       alt={selectedUsageSpace.name} 
                       className="w-full h-full object-cover"
                       referrerPolicy="no-referrer"
                     />
                     <div className="absolute top-3 left-3">
                        <span className="text-[9px] font-black text-white px-2.5 py-1 bg-gray-900/70 backdrop-blur-md rounded-full border border-white/20 tracking-wider">
                           {selectedUsageSpace.type}
                        </span>
                     </div>
                  </div>

                  {/* Details block */}
                  <div className="p-5 bg-white border border-gray-100 rounded-3xl shadow-sm space-y-4">
                     <div className="space-y-1">
                        <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest block">空间名称</label>
                        <p className="text-xs font-black text-gray-900 leading-normal">
                           {selectedUsageSpace.name}
                        </p>
                     </div>

                     <div className="space-y-1">
                        <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest block">位置编码</label>
                        <p className="text-xs font-mono font-bold text-gray-805 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100 break-all leading-relaxed">
                           {selectedUsageSpace.code}
                        </p>
                     </div>

                     <div className="space-y-1">
                        <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest block">运行状态</label>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                           <span className="text-[11px] font-black text-emerald-600">正在提供网络服务</span>
                        </div>
                     </div>
                  </div>
                </div>

                {/* Reselect Button */}
                <button
                  onClick={() => setIsSpaceSelectorOpen(true)}
                  className="w-full py-4 px-6 bg-white border border-gray-150 hover:border-blue-500 text-gray-600 hover:text-blue-600 rounded-2xl text-[11px] font-black uppercase tracking-wider hover:bg-blue-50/20 active:scale-95 transition-all text-center flex items-center justify-center gap-2 shadow-sm"
                >
                   <MapPin size={14} />
                   重选使用空间
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>



      {/* Main Content - Right Panel Tabs */}
      <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
        {/* Tabs */}
        <div className="flex-none px-8 pt-6 bg-white border-b border-gray-100 flex items-center justify-between">
           <div className="flex gap-1">
              <button 
                onClick={() => setActiveTab('list')}
                className={`flex items-center gap-2 px-6 py-3 rounded-t-2xl text-xs font-black uppercase tracking-widest transition-all border-x border-t ${
                  activeTab === 'list' 
                    ? 'bg-[#F8F9FA] text-blue-600 border-gray-100' 
                    : 'bg-transparent text-gray-400 border-transparent hover:bg-gray-50'
                }`}
              >
                <List size={16} />
                资产清单
              </button>
              <button 
                onClick={() => setActiveTab('viewer')}
                className={`flex items-center gap-2 px-6 py-3 rounded-t-2xl text-xs font-black uppercase tracking-widest transition-all border-x border-t ${
                  activeTab === 'viewer' 
                    ? 'bg-[#F8F9FA] text-blue-600 border-gray-100' 
                    : 'bg-transparent text-gray-400 border-transparent hover:bg-gray-50'
                }`}
              >
                <MapIcon size={16} />
                空间布置
              </button>
           </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto bg-[#F8F9FA] p-8 no-scrollbar">
           {activeTab === 'list' ? (
             <div className="flex gap-8 items-start">
               {/* Left Side: Asset Statistics */}
               <div className="w-72 flex-none space-y-6">
                 <section className="space-y-4">
                   <div className="flex items-center gap-2 text-gray-400">
                     <BarChart3 size={14} />
                     <span className="text-[10px] font-black uppercase tracking-widest">关联资产统计</span>
                   </div>
                   <div className="space-y-3">
                     <div className="bg-white border border-gray-100 rounded-3xl p-6 text-gray-900 shadow-sm relative group">
                       <div className="flex items-center justify-between mb-2">
                         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">资产总数</span>
                         <Tag size={16} className="text-blue-500" />
                       </div>
                       <div className="flex items-baseline gap-1">
                         <span className="text-4xl font-black text-gray-900">{stats.totalAssets}</span>
                         <span className="text-xs font-bold text-gray-400">台/项</span>
                       </div>
                       
                       <div className="mt-8 pt-4 border-t border-gray-50 shrink-0">
                         <button 
                           onClick={() => setIsNewAssetModalOpen(true)}
                           className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
                         >
                           <Plus size={14} />
                           新上资产
                         </button>
                       </div>
                     </div>

                     <div className="grid grid-cols-1 gap-3">
                       {stats.types.map((t, idx) => (
                         <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                           <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                               {t.icon}
                             </div>
                             <span className="text-xs font-bold text-gray-700">{t.name}</span>
                           </div>
                           <span className="text-sm font-black text-gray-900 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">{t.count}</span>
                         </div>
                       ))}
                     </div>
                   </div>
                 </section>
               </div>

                 {/* Right Side: Asset List */}
                 <div className="flex-1 space-y-6">
                   <div className="flex items-center gap-4 mb-2">
                     <div className="relative flex-1">
                       <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                       <input 
                         type="text" 
                         placeholder="请输入资产编号..." 
                         value={assetSearchQuery}
                         onChange={e => setAssetSearchQuery(e.target.value)}
                         className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                       />
                     </div>
                     <div className="relative w-48">
                       <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                       <input 
                         type="text" 
                         placeholder="物模型筛选..." 
                         value={physicalModelFilter}
                         onChange={e => setPhysicalModelFilter(e.target.value)}
                         className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                       />
                     </div>
                     <div className="flex items-center gap-2">
                        <button className="px-8 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95">
                          查询
                        </button>
                        <button 
                          onClick={() => {
                            setAssetSearchQuery('');
                            setPhysicalModelFilter('');
                          }}
                          className="px-6 py-2.5 bg-white border border-gray-100 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all active:scale-95"
                        >
                          重置
                        </button>
                     </div>
                   </div>

                  <div className="bg-white rounded-[32px] border border-gray-100 shadow-2xl shadow-black/5 overflow-hidden flex flex-col w-full">
                    <div className="overflow-x-auto relative no-scrollbar">
                      <table className="w-full text-left min-w-[1200px] table-fixed">
                        <thead className="bg-[#FBFCFD] border-b border-gray-50">
                          <tr>
                            <th className="sticky left-0 bg-[#FBFCFD] px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-40 whitespace-nowrap z-20">资产编号</th>
                            <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-48 whitespace-nowrap">所属物模型</th>
                            <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-40 whitespace-nowrap">规格标识</th>
                            <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-56 whitespace-nowrap">规格名称</th>
                            <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-48 whitespace-nowrap">使用登记时间</th>
                            <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-40 whitespace-nowrap">产权部门</th>
                            <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-40 whitespace-nowrap">使用部门</th>
                            <th className="sticky right-0 bg-[#FBFCFD] px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right w-40 whitespace-nowrap z-20">操作</th>
                          </tr>
                        </thead>
                       <tbody className="divide-y divide-gray-50">
                         {paginatedAssets.map(i => {
                           const spec = MOCK_SPECS.find(s => s.id === i.specId);
                           return (
                             <tr key={i.id} className="hover:bg-blue-50/10 transition-colors group">
                               <td className="sticky left-0 bg-white group-hover:bg-gray-50/50 px-8 py-5 font-mono text-xs font-bold text-blue-600 z-10">{i.assetCode}</td>
                               <td className="px-8 py-5 text-sm font-bold text-gray-900">网络交换机模型</td>
                               <td className="px-8 py-5 text-xs text-gray-500 font-mono">{i.specId}</td>
                               <td className="px-8 py-5 text-sm font-bold text-gray-900 border-r border-gray-50">{spec?.name}</td>
                               <td className="px-8 py-5 text-xs text-gray-500 whitespace-nowrap">2024-05-15 10:24</td>
                               <td className="px-8 py-5 text-xs text-gray-500">资产管理部</td>
                               <td className="px-8 py-5 text-xs text-gray-500 border-r border-gray-50">研发中心</td>
                               <td className="sticky right-0 bg-white group-hover:bg-gray-50/50 px-8 py-5 z-10 text-right">
                                 <div className="flex items-center justify-end gap-2">
                                   <button className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-all text-xs font-normal whitespace-nowrap">查看</button>
                                   <button className="px-3 py-1.5 bg-red-50 text-red-500 rounded-md hover:bg-red-100 transition-all text-xs font-normal whitespace-nowrap">移除</button>
                                 </div>
                               </td>
                             </tr>
                           );
                         })}
                       </tbody>
                     </table>
                   </div>
                   
                   <div className="p-4 border-t border-gray-50">
                      <Pagination 
                        currentPage={currentPage}
                        totalItems={MOCK_INSTANCES.length}
                        pageSize={pageSize}
                        onPageChange={setCurrentPage}
                      />
                   </div>
                 </div>
               </div>
             </div>
           ) : (
             <div className="relative h-full w-full rounded-3xl overflow-hidden shadow-2xl shadow-black/5 bg-white flex flex-col">
               <div className="p-4 border-b border-gray-100 bg-white flex justify-end">
                 <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95">
                   <Maximize2 size={16} />
                   打开空间布置系统
                 </button>
               </div>
               <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
                 <img 
                   src="https://img2022.cnblogs.com/blog/800616/202208/800616-20220823162822536-1777176525.png" 
                   alt="Space Layout" 
                   className="max-w-full max-h-full object-contain rounded-2xl shadow-lg shadow-black/5"
                 />
               </div>
             </div>
           )}
        </div>

        {/* Main Space Selection Modal */}
        {/* Space Selector Modal */}
        {isSpaceSelectorOpen && createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-gray-50 w-full max-w-6xl h-[85vh] rounded-[36px] shadow-2xl overflow-hidden flex flex-col relative border border-white/20"
            >
              {/* Head Section */}
              <div className="px-8 py-5 bg-white border-b border-gray-150 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-md shadow-blue-100 font-sans">
                    <MapIcon size={20} className="stroke-[2.2] text-white" />
                  </div>
                  <div className="text-left font-sans">
                    <h2 className="text-sm font-black text-gray-900 tracking-wider uppercase">资产空间选择中心</h2>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Asset Spatial Selection Hub</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsSpaceSelectorOpen(false)} 
                  className="w-10 h-10 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 active:scale-90 transition-all border border-gray-100"
                >
                  <X size={18} className="stroke-[2.5]" />
                </button>
              </div>

              {/* Main Workspace split */}
              <div className="flex-1 flex overflow-hidden font-sans">
                {/* LEFT SIDEBAR: Space list */}
                <div className="w-[360px] bg-white border-r border-gray-150 flex flex-col overflow-hidden">
                  {/* Tabs */}
                  <div className="p-4 border-b border-gray-100 shrink-0">
                    <div className="flex p-1.5 bg-gray-50 rounded-2xl border border-gray-150">
                      <button
                        onClick={() => { setSelectorTab('building'); setSelectorSearch(''); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          selectorTab === 'building' 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        <Building2 size={12} />
                        建筑空间
                      </button>
                      <button
                        onClick={() => { setSelectorTab('layer'); setSelectorSearch(''); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          selectorTab === 'layer' 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        <Layers size={12} />
                        空间图层
                      </button>
                    </div>
                  </div>

                  {/* Search bar */}
                  <div className="px-4 py-3 border-b border-gray-100 shrink-0 font-sans">
                    <div className="relative">
                      <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        value={selectorSearch}
                        onChange={e => setSelectorSearch(e.target.value)}
                        placeholder={`搜索${selectorTab === 'building' ? '建筑名称或位置编码' : '空间图层名称或编码'}...`}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-2xl text-[11px] font-bold outline-none border border-transparent focus:border-blue-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Scrollable list */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/20 font-sans">
                    {selectorTab === 'building' ? (
                      // Buildings list rendering
                      MOCK_BUILDINGS.filter(b => b.name.includes(selectorSearch) || b.code.includes(selectorSearch)).map(item => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setModalSelectedBuilding(item);
                            setModalActiveFloor(null); // Reset floor zoom when building clicked
                          }}
                          className={`w-full text-left p-4 rounded-3xl border transition-all flex items-start gap-3.5 ${
                            modalSelectedBuilding?.id === item.id 
                              ? 'border-blue-600 bg-blue-50/20 shadow-md shadow-blue-50/30' 
                              : 'border-gray-100 bg-white hover:border-blue-200 hover:shadow-lg'
                          }`}
                        >
                          <div className={`p-3.5 rounded-2xl shrink-0 ${modalSelectedBuilding?.id === item.id ? 'text-blue-600 bg-blue-50' : 'bg-gray-50 text-gray-400'}`}>
                            <Building2 size={18} className="stroke-[1.8]" />
                          </div>
                          <div className="flex-1 min-w-0 pr-1 text-left">
                            <h4 className={`text-xs font-black truncate leading-tight ${modalSelectedBuilding?.id === item.id ? 'text-blue-600' : 'text-gray-800'}`}>
                              {item.name}
                            </h4>
                            <p className="text-[10px] font-mono font-bold text-gray-400 mt-1 uppercase tracking-wider block">
                              编码: {item.code}
                            </p>
                          </div>
                        </button>
                      ))
                    ) : (
                      // Layers list rendering
                      MOCK_SPATIAL_LAYERS.filter(l => l.name.includes(selectorSearch) || l.code.includes(selectorSearch)).map(item => (
                        <button
                          key={item.id}
                          onClick={() => setModalSelectedLayer(item)}
                          className={`w-full text-left p-4 rounded-3xl border transition-all flex items-start gap-3.5 ${
                            modalSelectedLayer?.id === item.id 
                              ? 'border-emerald-500 bg-emerald-50/25 shadow-md shadow-emerald-50/30' 
                              : 'border-gray-100 bg-white hover:border-emerald-200 hover:shadow-lg'
                          }`}
                        >
                          <div className={`p-3.5 rounded-2xl shrink-0 ${modalSelectedLayer?.id === item.id ? 'bg-emerald-50 text-emerald-500' : 'bg-gray-50 text-gray-400'}`}>
                            <Layers size={18} className="stroke-[1.8]" />
                          </div>
                          <div className="flex-1 min-w-0 pr-1 text-left font-sans">
                            <h4 className={`text-xs font-black truncate leading-tight ${modalSelectedLayer?.id === item.id ? 'text-emerald-600' : 'text-gray-850'}`}>
                              {item.name}
                            </h4>
                            <p className="text-[10px] font-mono font-bold text-gray-400 mt-1 uppercase tracking-wider block">
                              编码: {item.code}
                            </p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* RIGHT SPACE WORKSPACE: Details, Oblique 3D, Rooms, lists */}
                <div className="flex-1 flex flex-col overflow-hidden bg-gray-50/40">
                  {selectorTab === 'building' ? (
                    // ARCHITECTURAL VIEWPORT: Tabs 3D and Floor space list
                    modalSelectedBuilding ? (
                      <div className="flex-1 flex flex-col overflow-hidden">
                        {/* Sub topbar with right side tabs */}
                        <div className="px-8 py-4.5 bg-white border-b border-gray-150 flex items-center justify-between shrink-0 font-sans">
                          <div className="min-w-0 text-left">
                            <h3 className="text-xs font-black text-gray-900 truncate uppercase tracking-wide">
                              {modalSelectedBuilding.name}
                            </h3>
                            <p className="text-[10px] font-mono text-gray-400 font-bold uppercase mt-0.5 tracking-wider font-sans">
                              位置基点: {modalSelectedBuilding.code}
                            </p>
                          </div>

                          <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-150">
                            <button
                              onClick={() => setModalRightTab('3d')}
                              className={`px-4.5 py-1.8 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
                                modalRightTab === '3d' 
                                  ? 'bg-blue-600 text-white shadow-sm' 
                                  : 'text-gray-400 hover:text-gray-600'
                              }`}
                            >
                              3D示意图
                            </button>
                            <button
                              onClick={() => setModalRightTab('list')}
                              className={`px-4.5 py-1.8 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
                                modalRightTab === 'list' 
                                  ? 'bg-blue-600 text-white shadow-sm' 
                                  : 'text-gray-400 hover:text-gray-600'
                              }`}
                            >
                              空间清单
                            </button>
                          </div>
                        </div>

                        {/* Sub main contents */}
                        <div className="flex-1 overflow-y-auto p-8 font-sans">
                          {modalRightTab === '3d' ? (
                            // 3D Isometric / Oblique Floor stack renderer
                            modalActiveFloor === null ? (
                              // Overall 3D stack view
                              <div className="flex flex-col items-center justify-center min-h-[460px] relative font-sans">
                                <span className="absolute top-4 left-4 text-[10px] font-black tracking-widest text-slate-400 uppercase bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                                   3D 虚拟楼宇视图 (旋转透视)
                                </span>
                                
                                <span className="absolute bottom-4 text-[10px] font-bold text-gray-400 tracking-wider bg-white py-1.5 px-4 rounded-full shadow-sm border border-gray-100">
                                   💡 鼠标悬停可点亮，点击任意楼层展开室内图
                                </span>

                                <div className="relative w-full max-w-lg h-96 flex justify-center items-center p-8 mt-4" style={{ perspective: '1100px' }}>
                                  {BUILDING_FLOORS_DATA.map((floorObj) => {
                                    const f = floorObj.floor;

                                    return (
                                      <motion.div
                                        key={f}
                                        onClick={() => setModalActiveFloor(f)}
                                        whileHover={{ 
                                          zIndex: 50, 
                                          scale: 1.05, 
                                          translateY: -35 - (f - 1) * 35,
                                          boxShadow: '0 20px 40px rgba(59, 130, 246, 0.25)' 
                                        }}
                                        className="absolute w-80 h-36 rounded-3xl cursor-pointer group border flex items-center justify-between px-8 bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-800 border-slate-700/60 shadow-xl"
                                        style={{
                                          transform: `rotateX(60deg) rotateZ(-30deg) translateY(-${(f - 1) * 35}px) translateZ(${(f - 1) * 10}px)`,
                                          transformStyle: 'preserve-3d',
                                          zIndex: f,
                                        }}
                                      >
                                        <div className="flex items-center gap-4 text-white transform-style-preserve-3d" style={{ transform: 'translateZ(10px)' }}>
                                          <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-black tracking-widest text-xs group-hover:bg-blue-500 group-hover:text-white transition-all shadow-glow font-sans">
                                            {f}F
                                          </div>
                                          <div className="text-left font-sans animate-none">
                                            <h4 className="text-xs font-black tracking-wide text-white group-hover:text-blue-300 transition-colors">
                                               {floorObj.floorName.split(' ')[1]}
                                            </h4>
                                            <p className="text-[9px] font-medium text-slate-400 mt-1">
                                               包含 {floorObj.rooms.length} 个数字监测舱
                                            </p>
                                          </div>
                                        </div>

                                        <div className="text-[10px] font-mono text-blue-400 bg-blue-950/40 px-2.5 py-1 rounded-lg border border-blue-900/30 font-black transform-style-preserve-3d" style={{ transform: 'translateZ(10px)' }}>
                                           100% 覆盖
                                        </div>
                                      </motion.div>
                                    );
                                  })}
                                </div>
                              </div>
                            ) : (
                              // Zoomed floor layout room-by-room selection
                              <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                  <button
                                    onClick={() => setModalActiveFloor(null)}
                                    className="flex items-center gap-2 px-4.5 py-2.5 bg-white border border-gray-150 hover:bg-gray-50 text-gray-500 hover:text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-sm"
                                  >
                                    <ChevronLeft size={14} className="stroke-[2.5]" />
                                    返回整体配置堆叠视图
                                  </button>

                                  <div className="text-right font-sans">
                                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-md border border-blue-100">
                                      {modalActiveFloor}F 空间测绘剖面
                                    </span>
                                  </div>
                                </div>

                                <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800 text-white shadow-xl relative overflow-hidden min-h-[360px] flex flex-col justify-center">
                                  {/* Grid background mesh */}
                                  <div className="absolute inset-x-0 inset-y-0 opacity-[0.03] pointer-events-none" 
                                       style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
                                  />

                                  <div className="relative text-center mb-8 font-sans">
                                     <h4 className="text-sm font-black text-slate-100 tracking-wider">
                                       {modalSelectedBuilding.name} - {BUILDING_FLOORS_DATA.find(f => f.floor === modalActiveFloor)?.floorName}
                                     </h4>
                                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                                       请点击空间区块以选定当前资产使用空间
                                     </p>
                                  </div>

                                  {/* Interactive spatial mesh layout */}
                                  <div className="grid grid-cols-2 gap-5 max-w-2xl mx-auto w-full relative z-10 font-sans">
                                    {(BUILDING_FLOORS_DATA.find(f => f.floor === modalActiveFloor)?.rooms || []).map((room) => (
                                      <button
                                        key={room.id}
                                        onClick={() => {
                                          setSelectedUsageSpace({
                                            name: `${modalSelectedBuilding.name} - ${modalActiveFloor}层 - ${room.roomNumber} ${room.name}`,
                                            code: `${modalSelectedBuilding.code}-${room.roomNumber}`,
                                            image: modalSelectedBuilding.image,
                                            type: '建筑'
                                          });
                                          setIsSpaceSelectorOpen(false);
                                        }}
                                        className="p-6 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-blue-500 text-left cursor-pointer group transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 select-none"
                                      >
                                        <div className="flex justify-between items-start mb-3">
                                          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-black group-hover:bg-blue-600 group-hover:text-white transition-all font-sans">
                                            {room.roomNumber}
                                          </div>
                                          <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 font-sans">
                                             在线
                                          </span>
                                        </div>
                                        <h5 className="text-xs font-black text-slate-100 group-hover:text-blue-300 transition-colors">
                                          {room.name}
                                        </h5>
                                        <p className="text-[10px] text-slate-400 mt-1 font-medium leading-normal truncate">
                                          {room.description}
                                        </p>
                                        <div className="mt-4 pt-3.5 border-t border-slate-700/50 flex justify-between items-center text-[9px] font-bold text-slate-500 group-hover:text-slate-400 text-left font-sans">
                                          <span>编码: {room.code}</span>
                                          <span className="text-blue-400 font-black uppercase tracking-wider group-hover:underline">点击选择</span>
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )
                          ) : (
                            // List layout grouping by complete floors catalog
                            <div className="space-y-6">
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-left">
                                 📋 按楼层和房间号快捷列表（点击房间号直接选中）：
                              </p>

                              <div className="space-y-6 font-sans">
                                {BUILDING_FLOORS_DATA.map((floorObj) => (
                                  <div key={floorObj.floor} className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm space-y-4 text-left">
                                    <div className="flex items-center gap-3.5 pb-2.5 border-b border-gray-50">
                                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-black">
                                        {floorObj.floor}F
                                      </div>
                                      <h4 className="text-xs font-black text-gray-950 tracking-wide">
                                        {floorObj.floorName}
                                      </h4>
                                    </div>

                                    <div className="grid grid-cols-4 gap-4">
                                      {floorObj.rooms.map((room) => (
                                        <button
                                          key={room.id}
                                          onClick={() => {
                                            setSelectedUsageSpace({
                                              name: `${modalSelectedBuilding.name} - ${floorObj.floor}F - ${room.roomNumber} ${room.name}`,
                                              code: `${modalSelectedBuilding.code}-${room.roomNumber}`,
                                              image: modalSelectedBuilding.image,
                                              type: '建筑'
                                            });
                                            setIsSpaceSelectorOpen(false);
                                          }}
                                          className="p-4 rounded-xl border border-gray-100 hover:border-blue-500 text-left group hover:bg-blue-50/5 hover:shadow-md transition-all h-full flex flex-col justify-between"
                                        >
                                          <div>
                                            <span className="text-xs font-mono font-black text-blue-650 block mb-1">
                                              #{room.roomNumber}
                                            </span>
                                            <h5 className="text-[10px] font-black text-gray-800 leading-tight block">
                                              {room.name}
                                            </h5>
                                          </div>
                                          <div className="border-t border-gray-50 mt-4 pt-2 text-[8px] font-black text-blue-600 uppercase tracking-widest text-right flex items-center justify-end gap-1 group-hover:underline font-sans">
                                             直连选中
                                          </div>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400 font-sans">
                         <Building2 size={36} className="mb-2.5 text-gray-300" />
                         <p className="text-sm font-bold">请在左侧列表中选择一栋建筑空间</p>
                      </div>
                    )
                  ) : (
                    // SPATIAL LAYER WORKSPACE: Cover overlay, details, metrics
                    modalSelectedLayer ? (
                      <div className="flex-1 flex flex-col overflow-hidden font-sans">
                        <div className="flex-1 overflow-y-auto p-10 flex flex-col items-center justify-center">
                          <div className="w-full max-w-2xl bg-white rounded-[32px] border border-gray-150 shadow-xl overflow-hidden flex flex-col">
                            {/* Layer image illustration cover */}
                            <div className="h-56 relative bg-slate-900 overflow-hidden">
                              <img 
                                src={modalSelectedLayer.image} 
                                alt={modalSelectedLayer.name} 
                                className="w-full h-full object-cover opacity-75"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                              <div className="absolute bottom-6 left-8 flex items-center gap-3.5">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500/25 border border-emerald-500/30 flex items-center justify-center text-emerald-400 backdrop-blur-md">
                                  <Layers size={22} className="stroke-[2]" />
                                </div>
                                <div className="text-left text-white font-sans animate-none">
                                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-900/40">
                                    空间虚拟图层
                                  </span>
                                  <h3 className="text-sm font-black text-white uppercase tracking-wider mt-1.5 leading-none">
                                    {modalSelectedLayer.name}
                                  </h3>
                                </div>
                              </div>
                            </div>

                            {/* Details parameters panel */}
                            <div className="p-8 space-y-6">
                              <div className="grid grid-cols-2 gap-6 font-sans">
                                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col gap-1 text-left">
                                  <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block">三维图层编码</span>
                                  <span className="text-xs font-mono font-bold text-gray-900">{modalSelectedLayer.code}</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col gap-1 text-left">
                                  <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block">物联信号网域</span>
                                  <span className="text-xs font-bold text-gray-900">学校公共IoT网络专网</span>
                                </div>
                              </div>

                              <div className="space-y-2 text-left">
                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block">图层图景描述</span>
                                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                                  {modalSelectedLayer.description} 通过选用此空间图层，所有资产设备的使用将与该专有虚拟物联平面直接绑定。
                                </p>
                              </div>

                              <div className="pt-6 border-t border-gray-100">
                                <button
                                  onClick={() => {
                                    setSelectedUsageSpace({
                                      name: modalSelectedLayer.name,
                                      code: modalSelectedLayer.code,
                                      image: modalSelectedLayer.image,
                                      type: '空间图层'
                                    });
                                    setIsSpaceSelectorOpen(false);
                                  }}
                                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-emerald-100 active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                  <Plus size={16} className="stroke-[2.5]" />
                                  确认选择此空间图层
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
                         <Layers size={36} className="mb-2.5 text-gray-300" />
                         <p className="text-sm font-bold font-sans">请在左侧列表中选择一个空间虚拟图层</p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {isMainModalOpen && createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-8 bg-gray-900/60 backdrop-blur-md">
             <AnimatePresence mode="wait">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col relative"
                >
                   {/* Modal Header */}
                   <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                           <LayoutDashboard size={24} />
                        </div>
                        <div>
                          <h2 className="text-xl font-black text-gray-900 tracking-tight">选择空间位置</h2>
                        </div>
                      </div>
                      <button onClick={() => setIsMainModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:text-red-500 transition-all">
                         <X size={20} />
                      </button>
                   </div>

                   {/* Modal Body */}
                   <div className="p-10 space-y-10">
                      {/* Step 1: Selection Type */}
                      <section className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-1">空间类型</label>
                        <div className="flex gap-4">
                          {[
                            { id: 'building', label: '建筑', icon: <Building2 size={16} /> },
                            { id: 'layer', label: '空间图层', icon: <Layers size={16} /> }
                          ].map(t => (
                            <button
                              key={t.id}
                              onClick={() => {
                                setSelectionType(t.id as any);
                                setTempSelectedBuilding(null);
                                setTempSelectedLayer(null);
                                setTempSelectedRoom(null);
                              }}
                              className={`flex-1 flex items-center justify-center gap-3 py-6 rounded-3xl border-2 transition-all ${
                                selectionType === t.id 
                                  ? 'bg-blue-50 border-blue-600 text-blue-600 shadow-lg shadow-blue-50' 
                                  : 'bg-white border-gray-50 text-gray-400 hover:border-gray-200'
                              }`}
                            >
                              {t.icon}
                              <span className="text-sm font-black uppercase tracking-widest">{t.label}</span>
                            </button>
                          ))}
                        </div>
                      </section>

                      {/* Step 2: Main Selection Button */}
                      <section className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-1">目标单元</label>
                        <div 
                          onClick={() => selectionType === 'building' ? setIsBuildingListOpen(true) : setIsLayerListOpen(true)}
                          className="w-full py-4 px-6 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-between cursor-pointer hover:border-blue-500 hover:bg-white transition-all group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                              {selectionType === 'building' ? <Building2 size={18} /> : <Layers size={18} />}
                            </div>
                            <div>
                              <p className="text-xs font-black text-gray-900">
                                {selectionType === 'building' 
                                  ? (tempSelectedBuilding?.name || '请选择建筑') 
                                  : (tempSelectedLayer?.name || '请选择图层')}
                              </p>
                              {(selectionType === 'building' ? tempSelectedBuilding : tempSelectedLayer) && (
                                <p className="text-[10px] font-mono font-bold text-gray-400 mt-0.5">
                                  {selectionType === 'building' 
                                    ? tempSelectedBuilding?.code 
                                    : tempSelectedLayer?.code}
                                </p>
                              )}
                            </div>
                          </div>
                          <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-500" />
                        </div>
                      </section>

                      {/* Step 3: Indoor Space (Building Only) */}
                      {selectionType === 'building' && tempSelectedBuilding && (
                        <motion.section 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-4"
                        >
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-1">室内空间</label>
                          <div 
                            onClick={() => setIsIndoorSpaceOpen(true)}
                            className="w-full py-4 px-6 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-between cursor-pointer hover:border-blue-500 hover:bg-white transition-all group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                                <Search size={18} />
                              </div>
                              <div>
                                <p className="text-xs font-black text-gray-900">
                                  {tempSelectedRoom?.roomNumber ? `房间 ${tempSelectedRoom.roomNumber}` : '请选择房型/单元'}
                                </p>
                                {tempSelectedRoom && (
                                  <p className="text-[10px] font-mono font-bold text-gray-400 mt-0.5">
                                    {tempSelectedRoom.code} / {tempSelectedRoom.area}㎡
                                  </p>
                                )}
                              </div>
                            </div>
                            <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-500" />
                          </div>
                        </motion.section>
                      )}
                    </div>

                    {/* Modal Footer */}
                    <div className="p-8 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0">
                      <button 
                        onClick={() => setIsMainModalOpen(false)}
                        className="px-10 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-655 transition-all font-sans"
                      >
                        取消
                      </button>
                      <button 
                        disabled={selectionType === 'building' ? (!tempSelectedBuilding || !tempSelectedRoom) : !tempSelectedLayer}
                        onClick={handleConfirmSelection}
                        className="px-12 py-3 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-105 hover:bg-blue-700 active:scale-95 transition-all font-sans disabled:opacity-40 disabled:pointer-events-none"
                      >
                        确认选择
                      </button>
                    </div>
                 </motion.div>
              </AnimatePresence>
            </div>,
            document.body
         )}

         {/* New Space Information Modal */}
         {isNewSpaceModalOpen && createPortal(
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={`bg-white w-full rounded-[40px] shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
                newSpaceForm.type === 'building' ? 'max-w-5xl h-[85vh]' : 'max-w-xl h-auto max-h-[90vh]'
              }`}
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                    <Plus size={20} className="stroke-[2.5]" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-sm font-black text-gray-900 tracking-wider uppercase">新增资产空间信息</h2>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Create New Asset Space Entry</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsNewSpaceModalOpen(false)} 
                  className="w-10 h-10 bg-gray-50 hover:bg-red-50 hover:text-red-500 rounded-xl flex items-center justify-center text-gray-400 transition-all border border-gray-100"
                >
                  <X size={18} className="stroke-[2.5]" />
                </button>
              </div>

              <div className="p-8 flex-1 overflow-y-auto space-y-6 no-scrollbar bg-gray-50/20 text-left">
                {/* Space Type Selector */}
                <div className="space-y-3.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-1">空间主要分类</label>
                  <div className="flex gap-4">
                    {[
                      { id: 'building', label: '建筑楼宇空间', desc: '用于地理、实体建筑整体测绘' },
                      { id: 'layer', label: '虚拟空间图层', desc: '用于广域/物联数字镜像图层划分' }
                    ].map(t => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setNewSpaceForm({...newSpaceForm, type: t.id as any})}
                        className={`flex-1 p-4 rounded-2xl border-2 transition-all text-left flex flex-col gap-1 ${
                          newSpaceForm.type === t.id 
                            ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-100' 
                            : 'bg-white border-gray-150 text-gray-500 hover:border-gray-200 hover:bg-white'
                        }`}
                      >
                        <span className="text-xs font-black uppercase tracking-widest">{t.label}</span>
                        <span className={`text-[9px] font-bold ${newSpaceForm.type === t.id ? 'text-blue-100' : 'text-gray-400'}`}>{t.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {newSpaceForm.type === 'building' ? (
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-1 font-sans">基础位置名称</label>
                    <input 
                      type="text" 
                      placeholder="例如：行政研发大楼、信息工程学院 1号楼..." 
                      className="w-full px-6 py-4 bg-white border border-gray-150 rounded-2xl text-xs font-black outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-sans"
                      value={newSpaceForm.locationInfo}
                      onChange={e => setNewSpaceForm({...newSpaceForm, locationInfo: e.target.value})}
                    />
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-1">空间图层编码</label>
                      <input 
                        type="text" 
                        placeholder="请输入9位纯数字编码..." 
                        className="w-full px-6 py-4 bg-white border border-gray-150 rounded-2xl text-xs font-bold outline-none focus:border-blue-600 transition-all font-sans font-mono"
                        value={newSpaceForm.layerCode}
                        onChange={e => setNewSpaceForm({...newSpaceForm, layerCode: e.target.value})}
                        maxLength={9}
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-1">空间图层名称</label>
                      <input 
                        type="text" 
                        placeholder="请输入图层名称..." 
                        className="w-full px-6 py-4 bg-white border border-gray-150 rounded-2xl text-xs font-black outline-none focus:border-blue-600 transition-all font-sans"
                        value={newSpaceForm.layerName}
                        onChange={e => setNewSpaceForm({...newSpaceForm, layerName: e.target.value})}
                      />
                    </div>
                  </>
                )}

                {/* 3D Modeling Toggle */}
                {newSpaceForm.type === 'building' && (
                  <div className="flex items-center justify-between p-6 bg-white border border-gray-150 rounded-3xl shadow-sm">
                    <div className="space-y-1">
                      <p className="text-xs font-black text-gray-900 font-sans">内部空间是否需要3D建模</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">启用将自动激活楼层智能网格剖面及子舱管理</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setNewSpaceForm({...newSpaceForm, need3D: !newSpaceForm.need3D})}
                      className={`w-14 h-7 rounded-full transition-all relative ${newSpaceForm.need3D ? 'bg-blue-600 shadow-xl shadow-blue-200' : 'bg-gray-200'}`}
                    >
                      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-md ${newSpaceForm.need3D ? 'left-8' : 'left-1'}`} />
                    </button>
                  </div>
                )}

                {/* 3D Mapping internal spaces split table (When building is selected) */}
                {newSpaceForm.type === 'building' && (
                  <div className="space-y-4 mt-6 border-t border-gray-150 pt-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-1 font-sans">内部空间</label>
                      <p className="text-[9px] text-gray-450 font-bold uppercase tracking-wide ml-1">请在下方划分各楼层及房间，支持拖动进行排序</p>
                    </div>

                    <div className="grid grid-cols-12 gap-5 h-[360px] border border-gray-150 rounded-[28px] overflow-hidden bg-white shadow-inner">
                      {/* Left: Floors layout */}
                      <div className="col-span-5 border-r border-gray-150 flex flex-col overflow-hidden bg-gray-50/20">
                        {/* Floor Top control panel */}
                        <div className="p-3 bg-gray-50/80 border-b border-gray-150 flex items-center justify-between shrink-0">
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider font-sans">楼层信息列表</span>
                          <button
                            type="button"
                            onClick={() => setIsAddingFloor(true)}
                            className="px-2.5 py-1.5 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1 hover:bg-blue-700 transition active:scale-95 shadow-sm"
                          >
                            <Plus size={10} className="stroke-[3]" />
                            新增楼层
                          </button>
                        </div>

                        {/* Add floor popup sheet widget inline */}
                        {isAddingFloor && (
                          <div className="p-3 bg-blue-50/40 border-b border-blue-100/60 flex flex-col gap-2 shrink-0 animate-fade-in text-left">
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                placeholder="楼层 e.g. 4楼 (4F)"
                                value={addFloorForm.name}
                                onChange={e => setAddFloorForm({ ...addFloorForm, name: e.target.value })}
                                className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-xl text-[10px] font-bold outline-none focus:border-blue-500 transition-colors"
                              />
                              <input
                                type="text"
                                placeholder="编码 e.g. FL-04"
                                value={addFloorForm.code}
                                onChange={e => setAddFloorForm({ ...addFloorForm, code: e.target.value })}
                                className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-xl text-[10px] font-bold outline-none font-mono focus:border-blue-500 transition-colors"
                              />
                            </div>
                            <div className="flex gap-2 justify-end">
                              <button
                                type="button"
                                onClick={() => setIsAddingFloor(false)}
                                className="px-2.5 py-1 bg-gray-150 hover:bg-gray-200 text-[9px] font-black text-gray-500 rounded-lg transition"
                              >
                                取消
                              </button>
                              <button
                                type="button"
                                onClick={handleAddFloor}
                                className="px-3 py-1 bg-blue-650 hover:bg-blue-700 text-[9px] font-black text-white rounded-lg transition shadow-sm"
                              >
                                添加
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Floor scroll feed */}
                        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
                          {newSpaceFloors.length === 0 ? (
                            <div className="p-8 text-center text-gray-405">
                              <p className="text-[10px] font-bold">请点击右上角新增一个物理楼层</p>
                            </div>
                          ) : (
                            newSpaceFloors.map((fl, idx) => {
                              const isActive = fl.id === activeFloorId;
                              return (
                                <div
                                  key={fl.id}
                                  onClick={() => setActiveFloorId(fl.id)}
                                  draggable
                                  onDragStart={() => setDraggedIndex(idx)}
                                  onDragOver={e => e.preventDefault()}
                                  onDrop={() => {
                                    if (draggedIndex !== null && draggedIndex !== idx) {
                                      const updated = [...newSpaceFloors];
                                      const [draggedItem] = updated.splice(draggedIndex, 1);
                                      updated.splice(idx, 0, draggedItem);
                                      setNewSpaceFloors(updated);
                                      setDraggedIndex(null);
                                      showToast('✨ 楼层顺序已通过拖动手势更新');
                                    }
                                  }}
                                  className={`group flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                                    isActive 
                                      ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/10'
                                      : 'bg-white border-gray-100 hover:border-gray-200 text-gray-700'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 min-w-0 font-sans">
                                    <div className="cursor-grab active:cursor-grabbing text-gray-355 shrink-0">
                                      <GripVertical size={11} className={isActive ? 'text-blue-100' : 'text-gray-400'} />
                                    </div>
                                    <div className="min-w-0 text-left">
                                      <p className={`text-[11px] font-black truncate leading-tight ${isActive ? 'text-white' : 'text-gray-850'}`}>
                                        {fl.name}
                                      </p>
                                      <p className={`text-[9px] font-mono mt-0.5 leading-none block font-semibold ${isActive ? 'text-blue-105' : 'text-gray-400'}`}>
                                        {fl.code}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity shrink-0">
                                    <button
                                      type="button"
                                      onClick={(e) => handleMoveFloor(idx, 'up', e)}
                                      disabled={idx === 0}
                                      className={`p-1 rounded hover:bg-black/5 ${idx === 0 ? 'text-gray-300 opacity-20' : ''}`}
                                    >
                                      <ArrowUp size={10} className="stroke-[2.5]" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => handleMoveFloor(idx, 'down', e)}
                                      disabled={idx === newSpaceFloors.length - 1}
                                      className={`p-1 rounded hover:bg-black/5 ${idx === newSpaceFloors.length - 1 ? 'text-gray-300 opacity-20' : ''}`}
                                    >
                                      <ArrowDown size={10} className="stroke-[2.5]" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => handleDeleteFloor(fl.id, e)}
                                      className={`p-1 rounded hover:bg-rose-500 hover:text-white ${isActive ? 'text-red-100 animate-pulse' : 'text-gray-405'}`}
                                    >
                                      <Trash2 size={10} />
                                    </button>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>

                      {/* Right: Rooms layout of selected Floor */}
                      <div className="col-span-7 flex flex-col overflow-hidden text-left font-sans">
                        {/* Rooms head */}
                        <div className="p-3 bg-gray-50/80 border-b border-gray-150 flex items-center justify-between shrink-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">房间信息列表</span>
                            {newSpaceFloors.find(f => f.id === activeFloorId) && (
                              <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                                {newSpaceFloors.find(f => f.id === activeFloorId)?.name}
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              if (!activeFloorId) {
                                showToast('⚠️ 请先创建或选择一个楼层');
                                return;
                              }
                              setIsAddingRoom(true);
                            }}
                            className="px-2.5 py-1.5 bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1 hover:bg-emerald-700 transition active:scale-95 shadow-sm"
                          >
                            <Plus size={10} className="stroke-[3]" />
                            新增房间
                          </button>
                        </div>

                        {/* Room Adding Widget Inline panel */}
                        {isAddingRoom && (
                          <div className="p-3 bg-emerald-50/40 border-b border-emerald-100 space-y-2 shrink-0 animate-fade-in">
                            <div className="grid grid-cols-4 gap-1.5 text-left font-sans">
                              <div className="space-y-1">
                                <span className="text-[8px] font-black text-emerald-600 block pl-1">房间房号 *</span>
                                <input
                                  type="text"
                                  placeholder="e.g. 101"
                                  value={addRoomForm.roomNumber}
                                  onChange={e => setAddRoomForm({ ...addRoomForm, roomNumber: e.target.value })}
                                  className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold outline-none focus:border-emerald-500"
                                />
                              </div>
                              <div className="space-y-1">
                                <span className="text-[8px] font-black text-emerald-600 block pl-1">位置编码 *</span>
                                <input
                                  type="text"
                                  placeholder="e.g. RM-101"
                                  value={addRoomForm.code}
                                  onChange={e => setAddRoomForm({ ...addRoomForm, code: e.target.value })}
                                  className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold outline-none font-mono focus:border-emerald-500"
                                />
                              </div>
                              <div className="space-y-1">
                                <span className="text-[8px] font-black text-emerald-600 block pl-1">面积(㎡)</span>
                                <input
                                  type="text"
                                  placeholder="e.g. 98.5"
                                  value={addRoomForm.area}
                                  onChange={e => setAddRoomForm({ ...addRoomForm, area: e.target.value })}
                                  className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold outline-none focus:border-emerald-500"
                                />
                              </div>
                              <div className="space-y-1">
                                <span className="text-[8px] font-black text-emerald-600 block pl-1">使用性质</span>
                                <select
                                  value={addRoomForm.usage}
                                  onChange={e => setAddRoomForm({ ...addRoomForm, usage: e.target.value })}
                                  className="w-full px-2 py-1 bg-white border border-gray-200 rounded-lg text-[10px] font-bold outline-none focus:border-emerald-500"
                                >
                                  {['实验室', '大教室', '自习研发舱', '办公室', '总控机房', '电力负荷室', '走廊通廊'].map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            
                            <div className="flex gap-2 justify-end">
                              <button
                                type="button"
                                onClick={() => setIsAddingRoom(false)}
                                className="px-2.5 py-1 bg-gray-150 hover:bg-gray-200 text-[9px] font-black text-gray-500 rounded-lg transition"
                              >
                                取消
                              </button>
                              <button
                                type="button"
                                onClick={handleAddRoom}
                                className="px-3 py-1 bg-emerald-650 hover:bg-emerald-700 text-[9px] font-black text-white rounded-lg transition shadow-sm"
                              >
                                保存房间
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Room Table Grid scroll feed */}
                        <div className="flex-1 overflow-y-auto bg-gray-50/5">
                          {!(newSpaceRooms[activeFloorId]?.length > 0) ? (
                            <div className="p-16 text-center text-gray-400 font-sans">
                              <p className="text-[11px] font-bold text-gray-500">当前楼层尚未录入任何房间空间</p>
                              <p className="text-[9px] text-gray-400 mt-1 uppercase tracking-wide">请点击右上方按钮为此楼层绘制首个数字单元</p>
                            </div>
                          ) : (
                            <table className="w-full text-left border-collapse font-sans">
                              <thead>
                                <tr className="bg-gray-50 sticky top-0 border-b border-gray-150 text-[9px] font-black text-gray-400 uppercase tracking-widest select-none">
                                  <th className="p-3 w-8"></th>
                                  <th className="p-3">房间号</th>
                                  <th className="p-3">位置编码</th>
                                  <th className="p-3 text-right">面积大小</th>
                                  <th className="p-3">使用性质</th>
                                  <th className="p-3 text-center">操作</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(newSpaceRooms[activeFloorId] || []).map((rm, idx) => (
                                  <tr 
                                    key={rm.id} 
                                    className="border-b border-gray-100 hover:bg-slate-50 transition-colors text-[10px] font-bold text-gray-750"
                                    draggable
                                    onDragStart={() => setDraggedRoomIndex(idx)}
                                    onDragOver={e => e.preventDefault()}
                                    onDrop={() => {
                                      if (draggedRoomIndex !== null && draggedRoomIndex !== idx) {
                                        const currentRooms = [...(newSpaceRooms[activeFloorId] || [])];
                                        const [draggedItem] = currentRooms.splice(draggedRoomIndex, 1);
                                        currentRooms.splice(idx, 0, draggedItem);
                                        setNewSpaceRooms({
                                          ...newSpaceRooms,
                                          [activeFloorId]: currentRooms
                                        });
                                        setDraggedRoomIndex(null);
                                        showToast('✨ 房间顺序已通过拖动手势更新');
                                      }
                                    }}
                                  >
                                    <td className="p-3 text-gray-300">
                                      <div className="cursor-grab active:cursor-grabbing">
                                        <GripVertical size={11} className="text-gray-400 select-none" />
                                      </div>
                                    </td>
                                    <td className="p-3">
                                      <span className="px-2 py-0.5 rounded bg-gray-100 border border-gray-150 text-gray-900 font-mono text-[9px] font-bold">
                                        #{rm.roomNumber}
                                      </span>
                                    </td>
                                    <td className="p-3 font-mono text-[9px] text-gray-450">{rm.code}</td>
                                    <td className="p-3 text-right font-mono text-gray-800">{rm.area} ㎡</td>
                                    <td className="p-3">
                                      <span className="bg-emerald-50 text-emerald-800 text-[8px] px-1.5 py-0.5 rounded-full border border-emerald-100 font-black">
                                        {rm.usage}
                                      </span>
                                    </td>
                                    <td className="p-3 text-center animate-fade-in">
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteRoom(rm.id)}
                                        className="p-1 text-gray-405 hover:text-red-500 hover:bg-red-50 rounded transition"
                                      >
                                        <Trash2 size={11} className="stroke-[2.2]" />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {newSpaceForm.type === 'layer' && (
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-1 font-sans">图层图景描述</label>
                    <textarea 
                      placeholder="请输入描述及备注信息（如物联信号网络类型、监测频段等）..." 
                      className="w-full px-6 py-4 bg-white border border-gray-150 rounded-2xl text-xs font-bold outline-none focus:border-blue-600 transition-all min-h-[100px] resize-none font-sans"
                      value={newSpaceForm.description}
                      onChange={e => setNewSpaceForm({...newSpaceForm, description: e.target.value})}
                    />
                  </div>
                )}
              </div>

              <div className="p-8 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0 font-sans">
                <button 
                  type="button"
                  onClick={() => setIsNewSpaceModalOpen(false)} 
                  className="px-10 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-655 transition-all"
                >
                  取消
                </button>
                <button 
                  type="button"
                  onClick={handleSaveNewSpace}
                  className="px-12 py-3 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase font-sans tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all"
                >
                  确认保存
                </button>
              </div>
            </motion.div>
          </div>,
          document.body
        )}

        {/* Building List Modal */}
        {isBuildingListOpen && createPortal(
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-8 bg-gray-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                    <Building2 size={24} />
                  </div>
                  <h2 className="text-xl font-black text-gray-900">建筑列表</h2>
                </div>
                <button onClick={() => setIsBuildingListOpen(false)} className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 flex-1 overflow-y-auto space-y-6 no-scrollbar">
                <div className="flex items-center gap-4">
                  <input 
                    type="text" 
                    placeholder="位置编码..." 
                    value={buildingSearchCode}
                    onChange={e => setBuildingSearchCode(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-gray-50 rounded-xl text-xs font-bold outline-none border border-transparent focus:border-blue-500"
                  />
                  <input 
                    type="text" 
                    placeholder="建筑名称..." 
                    value={buildingSearchName}
                    onChange={e => setBuildingSearchName(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-gray-50 rounded-xl text-xs font-bold outline-none border border-transparent focus:border-blue-500"
                  />
                  <button className="px-8 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest">查询</button>
                </div>
                <div className="border border-gray-100 rounded-[32px] overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-[#FBFCFD] border-b border-gray-100">
                      <tr>
                        <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">位置编码</th>
                        <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">图片</th>
                        <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">建筑名称</th>
                        <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">描述</th>
                        <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {spaceModels.filter(s => s.type === 'building' && s.code.includes(buildingSearchCode) && s.name.toLowerCase().includes(buildingSearchName.toLowerCase())).map(b => (
                        <tr key={b.id} className="hover:bg-blue-50/5 group">
                          <td className="px-8 py-4 font-mono text-xs font-bold text-blue-600">{b.code}</td>
                          <td className="px-8 py-4 text-center">
                            <img src={b.image} className="w-12 h-10 object-cover rounded-lg mx-auto border border-gray-100" />
                          </td>
                          <td className="px-8 py-4 text-xs font-black text-gray-900">{b.name}</td>
                          <td className="px-8 py-4 text-xs text-gray-500 max-w-[200px] truncate">{b.description}</td>
                          <td className="px-8 py-4 text-right">
                            <button 
                              onClick={() => {
                                setTempSelectedBuilding(b);
                                setIsBuildingListOpen(false);
                              }}
                              className="px-6 py-2 bg-blue-600 text-white rounded-lg text-xs font-black uppercase tracking-widest shadow-md hover:bg-blue-700 active:scale-95 transition-all"
                            >
                              选择
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination currentPage={buildingModalPage} totalItems={MOCK_SPACE_MODELS.filter(s => s.type === 'building').length} pageSize={buildingPageSize} onPageChange={setBuildingModalPage} />
              </div>
            </motion.div>
          </div>,
          document.body
        )}

        {/* Layer List Modal */}
        {isLayerListOpen && createPortal(
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-8 bg-gray-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                    <Layers size={24} />
                  </div>
                  <h2 className="text-xl font-black text-gray-900">图层列表</h2>
                </div>
                <button onClick={() => setIsLayerListOpen(false)} className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 flex-1 overflow-y-auto space-y-6 no-scrollbar">
                <div className="flex items-center gap-4">
                  <input 
                    type="text" 
                    placeholder="空间编码..." 
                    value={layerSearchCode}
                    onChange={e => setLayerSearchCode(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-gray-50 rounded-xl text-xs font-bold outline-none border border-transparent focus:border-blue-500"
                  />
                  <input 
                    type="text" 
                    placeholder="图层名称..." 
                    value={layerSearchName}
                    onChange={e => setLayerSearchName(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-gray-50 rounded-xl text-xs font-bold outline-none border border-transparent focus:border-blue-500"
                  />
                  <button className="px-8 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest">查询</button>
                </div>
                <div className="border border-gray-100 rounded-[32px] overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-[#FBFCFD] border-b border-gray-100">
                      <tr>
                        <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">空间编码</th>
                        <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">图层名称</th>
                        <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">描述</th>
                        <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {spaceModels.filter(s => s.type === 'room' && s.code.includes(layerSearchCode) && s.name.toLowerCase().includes(layerSearchName.toLowerCase())).map(l => (
                        <tr key={l.id} className="hover:bg-blue-50/5 group">
                          <td className="px-8 py-4 font-mono text-xs font-bold text-blue-600">{l.code}</td>
                          <td className="px-8 py-4 text-xs font-black text-gray-900">{l.name}</td>
                          <td className="px-8 py-4 text-xs text-gray-500 max-w-[200px] truncate">{l.description}</td>
                          <td className="px-8 py-4 text-right">
                            <button 
                              onClick={() => {
                                setTempSelectedLayer(l);
                                setIsLayerListOpen(false);
                              }}
                              className="px-6 py-2 bg-blue-600 text-white rounded-lg text-xs font-black uppercase tracking-widest shadow-md hover:bg-blue-700 active:scale-95 transition-all"
                            >
                              选择
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination currentPage={layerModalPage} totalItems={MOCK_SPACE_MODELS.filter(s => s.type === 'room').length} pageSize={layerPageSize} onPageChange={setLayerModalPage} />
              </div>
            </motion.div>
          </div>,
          document.body
        )}

        {/* Indoor Space Modal (Floors & Rooms) */}
        {isIndoorSpaceOpen && createPortal(
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-8 bg-gray-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white w-full max-w-4xl max-h-[80vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                    <Box size={24} />
                  </div>
                  <h2 className="text-xl font-black text-gray-900 tracking-tight">室内空间选择</h2>
                </div>
                <button onClick={() => setIsIndoorSpaceOpen(false)} className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 flex-1 overflow-y-auto no-scrollbar space-y-10">
                {[6, 5, 4, 3, 2, 1].map(f => (
                  <section key={f} className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-gray-50 pb-2">
                       <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-black">{f}F</span>
                       <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">{f}层 办公区域</h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                       {[...Array(6)].map((_, i) => {
                         const roomCode = `${f}0${i+1}`;
                         return (
                           <button 
                             key={i}
                             onClick={() => {
                               setTempSelectedRoom({ id: `${f}-${i}`, name: `${f}层-${roomCode}`, floor: f, code: `R-${roomCode}` });
                               setIsIndoorSpaceOpen(false);
                             }}
                             className="p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-blue-500 hover:bg-white hover:shadow-lg transition-all text-left group"
                           >
                              <p className="text-xs font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase">{roomCode}单元</p>
                              <p className="text-[9px] font-mono font-bold text-gray-400 mt-1 uppercase">CODE_{roomCode}</p>
                           </button>
                         );
                       })}
                    </div>
                  </section>
                ))}
              </div>
            </motion.div>
          </div>,
          document.body
        )}

        {/* New Asset Modal */}
        {isNewAssetModalOpen && createPortal(
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-8 bg-gray-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white w-full max-w-3xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                    <Plus size={24} />
                  </div>
                  <h2 className="text-xl font-black text-gray-900">新上资产</h2>
                </div>
                <button onClick={() => setIsNewAssetModalOpen(false)} className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 flex-1 overflow-y-auto space-y-8 no-scrollbar bg-gray-50/20">
                {/* Asset Information Row */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">资产信息</label>
                    <button 
                      onClick={() => setIsAssetSelectionModalOpen(true)}
                      className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all active:scale-95"
                    >
                      选择资产
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-6 bg-white border border-gray-100 rounded-3xl">
                    <div className="space-y-1">
                      <p className="text-[8px] font-black text-gray-300 uppercase">资产编号</p>
                      <p className="text-[11px] font-mono font-bold text-gray-900">{newAssetForm.assetId || '未选择'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] font-black text-gray-300 uppercase">所属物模型</p>
                      <p className="text-[11px] font-bold text-gray-900">{newAssetForm.physicalModel || '未选择'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] font-black text-gray-300 uppercase">规格标识</p>
                      <p className="text-[11px] font-bold text-gray-900">{newAssetForm.specId || '未选择'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] font-black text-gray-300 uppercase">规格名称</p>
                      <p className="text-[11px] font-bold text-gray-900">{newAssetForm.specName || '未选择'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] font-black text-gray-300 uppercase">产权部门</p>
                      <p className="text-[11px] font-bold text-gray-900">{newAssetForm.propertyDept || '未选择'}</p>
                    </div>
                  </div>
                </section>

                {/* Usage Department Row */}
                <section className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">使用部门</label>
                  <button 
                    onClick={() => {
                      setDeptPickerTarget('newAsset');
                      setIsDeptPickerOpen(true);
                    }}
                    className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl text-xs font-bold outline-none flex items-center justify-between hover:bg-gray-50 transition-all font-sans"
                  >
                    <span className={newAssetForm.useDept ? 'text-gray-900' : 'text-gray-400'}>{newAssetForm.useDept || '请点击选择使用部门...'}</span>
                    <ChevronRight size={16} className="text-gray-300" />
                  </button>
                </section>

                {/* Usage Date Row */}
                <section className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">使用日期</label>
                  <input 
                    type="date" 
                    value={newAssetForm.useDate}
                    onChange={e => setNewAssetForm({ ...newAssetForm, useDate: e.target.value })}
                    className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl text-xs font-bold outline-none focus:border-blue-500 transition-all font-sans"
                  />
                </section>

                {/* Usage Description Row */}
                <section className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">使用说明</label>
                  <textarea 
                    placeholder="请输入使用说明..." 
                    value={newAssetForm.description}
                    onChange={e => setNewAssetForm({ ...newAssetForm, description: e.target.value })}
                    className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl text-xs font-bold outline-none focus:border-blue-500 transition-all min-h-[120px] resize-none font-sans"
                  />
                </section>
              </div>

              <div className="p-8 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-4">
                <button onClick={() => setIsNewAssetModalOpen(false)} className="px-10 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 transition-all font-sans">取消</button>
                <button className="px-12 py-3 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all font-sans">保存</button>
              </div>
            </motion.div>
          </div>,
          document.body
        )}

        {/* Asset Selection Sub-Modal */}
        {isAssetSelectionModalOpen && createPortal(
          <div className="fixed inset-0 z-[10001] flex items-center justify-center p-8 bg-gray-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white w-full max-w-6xl max-h-[90vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                    <Search size={24} />
                  </div>
                  <h2 className="text-xl font-black text-gray-900 uppercase">资产选择</h2>
                </div>
                <button onClick={() => setIsAssetSelectionModalOpen(false)} className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 flex-1 overflow-y-auto space-y-6 no-scrollbar bg-gray-50/10">
                {/* Search Filters */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase ml-1">资产编号</label>
                    <input 
                      type="text" 
                      placeholder="资产编号..." 
                      value={assetSelSearch.assetId}
                      onChange={e => setAssetSelSearch({...assetSelSearch, assetId: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-[11px] font-bold outline-none border border-transparent focus:border-blue-500" 
                    />
                  </div>
                  <div className="space-y-1 relative">
                    <label className="text-[9px] font-black text-gray-400 uppercase ml-1">所属物模型</label>
                    <button 
                      onClick={() => setIsModelTreeOpen(!isModelTreeOpen)}
                      className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-[11px] font-bold outline-none border border-transparent focus:border-blue-500 flex items-center justify-between"
                    >
                      <span>{assetSelSearch.modelId ? MOCK_MODELS.find(m => m.id === assetSelSearch.modelId)?.name : '请选择...'}</span>
                      <ChevronDown size={14} className="text-gray-400" />
                    </button>
                    {isModelTreeOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 p-2 max-h-60 overflow-y-auto font-sans">
                        <button 
                          onClick={() => { setAssetSelSearch({...assetSelSearch, modelId: ''}); setIsModelTreeOpen(false); }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg text-xs font-bold text-gray-500"
                        >全部</button>
                        {MOCK_MODELS.map(m => (
                          <button 
                            key={m.id}
                            onClick={() => { setAssetSelSearch({...assetSelSearch, modelId: m.id}); setIsModelTreeOpen(false); }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg text-xs font-bold"
                          >
                            {m.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase ml-1">规格名称</label>
                    <select 
                      value={assetSelSearch.specName}
                      onChange={e => setAssetSelSearch({...assetSelSearch, specName: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-[11px] font-bold outline-none border border-transparent focus:border-blue-500"
                    >
                      <option value="">全部</option>
                      {MOCK_SPECS.filter(s => !assetSelSearch.modelId || s.modelId === assetSelSearch.modelId).map(s => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase ml-1">采购合同编号</label>
                    <input 
                      type="text" 
                      placeholder="合同编号..." 
                      value={assetSelSearch.contractId}
                      onChange={e => setAssetSelSearch({...assetSelSearch, contractId: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-[11px] font-bold outline-none border border-transparent focus:border-blue-500" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase ml-1">产权部门</label>
                    <button 
                      onClick={() => {
                        setDeptPickerTarget('assetSelSearch');
                        setIsDeptPickerOpen(true);
                      }}
                      className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-[11px] font-bold outline-none border border-transparent hover:bg-gray-100 transition-all flex items-center justify-between"
                    >
                      <span className="truncate">{assetSelSearch.propertyDept || '请选择...'}</span>
                      <ChevronRight size={14} className="text-gray-400" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase ml-1">供货商</label>
                    <input 
                      type="text" 
                      placeholder="供货商..." 
                      value={assetSelSearch.supplier}
                      onChange={e => setAssetSelSearch({...assetSelSearch, supplier: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-[11px] font-bold outline-none border border-transparent focus:border-blue-500" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase ml-1">生产厂家</label>
                    <input 
                      type="text" 
                      placeholder="生产厂家..." 
                      value={assetSelSearch.manufacturer}
                      onChange={e => setAssetSelSearch({...assetSelSearch, manufacturer: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-[11px] font-bold outline-none border border-transparent focus:border-blue-500" 
                    />
                  </div>
                  <div className="flex items-end gap-2 px-1">
                    <button className="flex-1 py-2.5 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">查询</button>
                    <button 
                      onClick={() => setAssetSelSearch({
                        assetId: '',
                        modelId: '',
                        specName: '',
                        contractId: '',
                        propertyDept: '',
                        supplier: '',
                        manufacturer: ''
                      })}
                      className="flex-1 py-2.5 bg-white border border-gray-100 text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all font-sans"
                    >重置</button>
                  </div>
                </div>

                {/* Table */}
                <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm flex flex-col">
                  <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left min-w-[1500px] table-fixed">
                      <thead className="bg-[#FBFCFD] border-b border-gray-50">
                        <tr>
                          <th className="sticky left-0 bg-[#FBFCFD] px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest w-40 z-20">资产编号</th>
                          <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest w-48">所属物模型</th>
                          <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest w-32">规格标识</th>
                          <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest w-48">规格名称</th>
                          <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest w-32">采购日期</th>
                          <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest w-40">合同编号</th>
                          <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest w-48">产权部门</th>
                          <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest w-48">供货商</th>
                          <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest w-48">生产厂家</th>
                          <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest w-32">保修截止日</th>
                          <th className="sticky right-0 bg-[#FBFCFD] px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right w-32 z-20">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {MOCK_INSTANCES.slice(0, 10).map(item => {
                          const spec = MOCK_SPECS.find(s => s.id === item.specId);
                          const model = MOCK_MODELS.find(m => m.id === spec?.modelId);
                          return (
                            <tr key={item.id} className="hover:bg-blue-50/5 group font-sans">
                              <td className="sticky left-0 bg-white group-hover:bg-gray-50/50 px-6 py-4 font-mono text-[10px] font-bold text-blue-600 z-10">{item.assetCode}</td>
                              <td className="px-6 py-4 text-[10px] font-black text-gray-900 italic">{model?.name}</td>
                              <td className="px-6 py-4 text-[10px] font-bold text-gray-400 font-mono">SPEC_{item.specId.substring(0,4)}</td>
                              <td className="px-6 py-4 text-[10px] font-black text-gray-700">{spec?.name}</td>
                              <td className="px-6 py-4 text-[10px] font-bold text-gray-500">2023-12-05</td>
                              <td className="px-6 py-4 text-[10px] font-bold text-gray-500">CT-20230882</td>
                              <td className="px-6 py-4 text-[10px] font-black text-blue-900/60 truncate">基建与后勤处</td>
                              <td className="px-6 py-4 text-[10px] font-medium text-gray-400 truncate">戴尔(中国)有限公司</td>
                              <td className="px-6 py-4 text-[10px] font-medium text-gray-400 truncate">戴尔工厂</td>
                              <td className="px-6 py-4 text-[10px] font-bold text-red-400">2026-12-05</td>
                              <td className="sticky right-0 bg-white group-hover:bg-gray-50/50 px-6 py-4 text-right z-10">
                                <button 
                                  onClick={() => {
                                    setNewAssetForm({
                                      ...newAssetForm,
                                      assetId: item.assetCode,
                                      physicalModel: model?.name || '',
                                      specId: spec?.id || '',
                                      specName: spec?.name || '',
                                      purchaseDate: '2023-12-05',
                                      contractId: 'CT-20230882',
                                      propertyDept: '基建与后勤处'
                                    });
                                    setIsAssetSelectionModalOpen(false);
                                  }}
                                  className="px-5 py-1.5 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-md hover:bg-blue-700 active:scale-95 transition-all"
                                >
                                  选择
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-4 border-t border-gray-50 bg-[#FBFCFD]">
                    <Pagination currentPage={assetSelPage} totalItems={30} pageSize={assetSelPageSize} onPageChange={setAssetSelPage} />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>,
          document.body
        )}
        {/* Department Selector Modal */}
        {isDeptPickerOpen && createPortal(
          <div className="fixed inset-0 z-[10002] flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh]"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    <Building2 size={16} />
                  </div>
                  <h3 className="font-bold text-gray-900">选择部门</h3>
                </div>
                <button onClick={() => setIsDeptPickerOpen(false)}><X size={18} className="text-gray-400" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
                {Object.entries(DEPARTMENT_TREE).map(([parent, children]) => (
                  <div key={parent} className="space-y-1">
                    <button 
                      onClick={() => setExpandedDepts(prev => prev.includes(parent) ? prev.filter(p => p !== parent) : [...prev, parent])}
                      className="w-full flex items-center gap-2 p-3 rounded-xl text-sm font-black text-gray-900 hover:bg-gray-50 transition-all uppercase tracking-widest"
                    >
                      {expandedDepts.includes(parent) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      <span>{parent}</span>
                    </button>
                    <AnimatePresence>
                      {expandedDepts.includes(parent) && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="ml-6 space-y-1 overflow-hidden"
                        >
                          {children.map(child => (
                            <button
                              key={child}
                              onClick={() => { 
                                if (deptPickerTarget === 'newAsset') {
                                  setNewAssetForm({...newAssetForm, useDept: child});
                                } else if (deptPickerTarget === 'assetSelSearch') {
                                  setAssetSelSearch({...assetSelSearch, propertyDept: child});
                                }
                                setIsDeptPickerOpen(false); 
                              }}
                              className="w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold transition-all border border-transparent text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                            >
                              {child}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>,
          document.body
        )}
      </div>
    </div>
  );
}
