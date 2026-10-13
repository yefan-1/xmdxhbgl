import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  Layers, 
  Map as MapIcon, 
  Search, 
  ChevronRight, 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  X,
  Layout,
  Grid3X3,
  Box,
  Plus,
  Minus,
  Navigation,
  Scan,
  MoreVertical,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

declare global {
  interface Window {
    qq: any;
  }
}

const SPACES = [
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `b${i + 1}`,
    name: ['行政主楼', '教学楼A栋', '教学楼B栋', '教学楼C栋', 'A区食堂', 'B区食堂', '实验楼', '图书馆', '综合科研楼', '体育馆', '学生中心', '艺术楼', '国际交流中心', '信息中心', '后勤大楼'][i] || `建筑 - ${i + 1}`,
    type: 'building' as const,
    code: `9032312${25 + i}`,
    lat: 24.606 + (i * 0.001),
    lng: 118.083 + (i * 0.0005),
    isLabeled: i % 3 !== 0
  })),
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `l${i + 1}`,
    name: ['主干道', '上弦场', '演武场', '芙蓉湖景区', '情人谷', '五老峰步道', '南普陀边界', '白城沙滩区', '环岛路绿带', '演武大桥', '大学路', '思明南路', '群贤群楼', '建南大会堂', '映雪囊萤'][i] || `空间图层 - ${i + 1}`,
    type: 'layer' as const,
    code: `LYR-${(200 + i)}`,
    lat: 24.604 + (i * 0.0008),
    lng: 118.082 + (i * 0.001),
    isLabeled: i % 4 === 0
  }))
];

const MOCK_BUILDING_RESOURCES = [
  { code: '903231225', name: '行政主楼', type: '办公大楼', img: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=200' },
  { code: '903231226', name: '教学楼A栋', type: '教学设施', img: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200' },
  { code: '903231227', name: '图书馆', type: '文化场馆', img: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=200' },
  { code: '903231228', name: '综合科研楼', type: '实验研发', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=200' },
  { code: '903231229', name: '学生中心', type: '生活服务', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=200' },
];

export default function SpatialModeling() {
  const [activeTab, setActiveTab] = useState<'building' | 'layer'>('building');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpace, setSelectedSpace] = useState<any>(null);
  const [viewLevel, setViewLevel] = useState<'map' | 'floor' | 'room'>('map');
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<'model' | 'units'>('model');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [sidebarPage, setSidebarPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUnmodeledModalOpen, setIsUnmodeledModalOpen] = useState(false);
  const [isBuildingSelectOpen, setIsBuildingSelectOpen] = useState(false);
  
  // New Spatial Info Form State
  const [formData, setFormData] = useState({
    type: 'building',
    location: '',
    locationName: '',
    locationImg: '',
    code: '',
    name: '',
    needs3D: false,
    description: ''
  });

  // Floor and Room states for New Spatial Info inside Spatial Modeling
  const [newSpaceFloors, setNewSpaceFloors] = useState<any[]>([
    { id: 'f-1', name: '1楼 (1F)', code: '100000001' },
    { id: 'f-2', name: '2楼 (2F)', code: '100000002' },
    { id: 'f-3', name: '3楼 (3F)', code: '100000003' }
  ]);
  const [newSpaceRooms, setNewSpaceRooms] = useState<Record<string, any[]>>({
    'f-1': [
      { id: 'r-1-1', roomNumber: '101', code: '200000101', area: '120.5', usage: '科技展厅' },
      { id: 'r-1-2', roomNumber: '102', code: '200000102', area: '85.2', usage: '专控中控区' }
    ],
    'f-2': [
      { id: 'r-2-1', roomNumber: '201', code: '200000201', area: '98.0', usage: '物联标室' },
      { id: 'r-2-2', roomNumber: '202', code: '200000202', area: '110.0', usage: '计算终端' }
    ],
    'f-3': [
      { id: 'r-3-1', roomNumber: '301', code: '200000301', area: '150.0', usage: '多功能学术厅' }
    ]
  });
  const [activeFloorId, setActiveFloorId] = useState<string>('f-1');

  // Addition form states for newly mapped spaces
  const [isAddingFloor, setIsAddingFloor] = useState(false);
  const [addFloorForm, setAddFloorForm] = useState({ name: '', code: '' });

  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [addRoomForm, setAddRoomForm] = useState({ roomNumber: '', code: '', area: '', usage: '办公室' });
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedRoomIndex, setDraggedRoomIndex] = useState<number | null>(null);

  // Toast status notice state
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
    if (!/^\d{9}$/.test(addFloorForm.code)) {
      showToast('⚠️ 楼层位置编码必须为9位纯数字');
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
    if (!/^\d{9}$/.test(addRoomForm.code)) {
      showToast('⚠️ 房间位置编码必须为9位纯数字');
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

  const [buildingSearch, setBuildingSearch] = useState({
    code: '',
    name: '',
    type: ''
  });

  const [unmodeledSearch, setUnmodeledSearch] = useState({
    code: '',
    name: '',
    type: ''
  });

  const [unmodeledPage, setUnmodeledPage] = useState(1);

  useEffect(() => {
    const handleOpenModal = () => setIsAddModalOpen(true);
    const handleOpenUnmodeled = () => setIsUnmodeledModalOpen(true);
    window.addEventListener('open-new-space-modal', handleOpenModal);
    window.addEventListener('open-unmodeled-modal', handleOpenUnmodeled);
    return () => {
      window.removeEventListener('open-new-space-modal', handleOpenModal);
      window.removeEventListener('open-unmodeled-modal', handleOpenUnmodeled);
    };
  }, []);

  const sidebarPageSize = 6;
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    if (document.getElementById('qq-map-script')) {
      if (window.qq && window.qq.maps) {
        setMapLoaded(true);
        if (!mapInstance.current && mapContainer.current) {
          initMapInstance();
        }
      }
      return;
    }

    const script = document.createElement('script');
    script.id = 'qq-map-script';
    script.src = 'https://map.qq.com/api/js?v=2.exp&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&callback=initMap';
    script.async = true;
    document.body.appendChild(script);

    (window as any).initMap = () => {
      initMapInstance();
      setMapLoaded(true);
    };

    function initMapInstance() {
      if (mapContainer.current && !mapInstance.current) {
        try {
          const center = new window.qq.maps.LatLng(24.606, 118.083);
          mapInstance.current = new window.qq.maps.Map(mapContainer.current, {
            center: center,
            zoom: 16,
            mapStyleId: 'style1'
          });

          // Add Markers for SPACES
          SPACES.forEach(space => {
            const pos = new window.qq.maps.LatLng(space.lat, space.lng);
            const marker = new window.qq.maps.Marker({
              position: pos,
              map: mapInstance.current,
              title: space.name
            });

            window.qq.maps.event.addListener(marker, 'click', () => {
              handleSpaceClick(space);
            });
          });
        } catch (e) {
          console.error('Error initializing map:', e);
        }
      }
    }
  }, []);

  const filteredSpaces = SPACES.filter(s => {
    const matchesTab = s.type === activeTab;
    const matchesSearch = s.name.includes(searchQuery);
    return matchesTab && matchesSearch;
  });

  const totalSidebarPages = Math.ceil(filteredSpaces.length / sidebarPageSize);
  const paginatedSidebarItems = filteredSpaces.slice((sidebarPage - 1) * sidebarPageSize, sidebarPage * sidebarPageSize);

  const handleSpaceClick = (space: any) => {
    if (mapInstance.current) {
      mapInstance.current.panTo(new window.qq.maps.LatLng(space.lat, space.lng));
    }
    // If it's a building, open the viewer
    if (space.type === 'building') {
      setSelectedSpace(space);
      setViewLevel('floor');
      setSelectedFloor(1);
    }
  };

  const handleFloorClick = (floor: number) => {
    setSelectedFloor(floor);
    setViewLevel('room');
  };

  const closeViewer = () => {
    setSelectedSpace(null);
    setViewLevel('map');
    setSelectedFloor(null);
    setSelectedRoom(null);
  };

  return (
    <div className="h-full flex flex-col bg-[#F8FAFC]">
      {/* Toast Notice Banner */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-8 right-8 z-[20000] bg-slate-900 border border-slate-800 text-white rounded-3xl py-4.5 px-6 shadow-2xl flex items-center gap-3 w-85 shadow-black/30 text-left"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
              <span className="text-blue-400 font-bold">✨</span>
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="text-[9px] uppercase font-black tracking-widest text-slate-400 block">系统通知</h5>
              <p className="text-xs font-black text-slate-100 mt-0.5 whitespace-normal break-words leading-tight">{toastMsg}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex-1 flex overflow-hidden p-6 gap-6">
        {/* Left Sidebar */}
        <div className="w-80 bg-white rounded-[2.5rem] border border-gray-100 flex flex-col shadow-xl shadow-blue-900/5 overflow-hidden">
          <div className="p-0 border-b border-gray-50 bg-white">
            {/* Sync Tab Style with Map Management (MapBuild) */}
            <div className="flex p-2 bg-gray-50 mx-4 my-4 rounded-2xl">
              {[
                { id: 'building', label: '建筑', icon: <Building2 size={14} /> },
                { id: 'layer', label: '空间图层', icon: <Layers size={14} /> }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id as any); setSidebarPage(1); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    activeTab === tab.id 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="px-4 py-3 border-t border-gray-50 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                <input 
                  type="text" 
                  placeholder={`搜索${activeTab === 'building' ? '建筑' : '空间图层'}...`}
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setSidebarPage(1); }}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar bg-gray-50/10">
            {paginatedSidebarItems.map(space => (
              <button 
                key={space.id}
                onClick={() => handleSpaceClick(space)}
                className={`w-full group flex items-start gap-4 p-4 rounded-3xl border transition-all text-left relative overflow-hidden ${
                  selectedSpace?.id === space.id 
                    ? 'border-blue-600 bg-blue-50/30' 
                    : 'border-gray-100 bg-white hover:border-blue-200 hover:shadow-xl'
                }`}
              >
                <div className="relative shrink-0">
                  <div className="w-16 h-20 rounded-2xl overflow-hidden group-hover:scale-105 transition-transform">
                    <img 
                      src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=200"
                      className="w-full h-full object-cover"
                      alt={space.name}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
                <div className="flex-1 py-1 flex flex-col h-full min-w-0">
                  <p className={`text-sm font-black mb-1 leading-tight truncate ${selectedSpace?.id === space.id ? 'text-blue-600' : 'text-gray-900'}`}>
                    {space.name}
                  </p>
                  <div className="space-y-1">
                    <div className="flex flex-col gap-0.5 opacity-80">
                      <p className="text-[9px] font-mono font-bold text-blue-600 uppercase tracking-tighter">
                        位置编码：{space.code || (Math.floor(100000000 + (parseInt(space.id.slice(1))) * 12345))}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {/* Labeled Status Badge - Moved here */}
                    <div className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-tighter border shadow-sm ${
                      space.isLabeled 
                        ? 'bg-emerald-500 text-white border-emerald-400' 
                        : 'bg-amber-500 text-white border-amber-400'
                    }`}>
                      {space.isLabeled ? '已建模' : '未建模'}
                    </div>

                    {space.type === 'layer' && (
                      <span className="text-[8px] font-black uppercase tracking-widest text-violet-600 bg-violet-50 px-2 py-0.5 rounded-md border border-violet-100">
                        空间图层
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Sync Pagination Style with Map Management */}
          <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-100 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  第 {sidebarPage} 页 / 共 {totalSidebarPages || 1} 页
                </p>
              </div>
              <div className="flex items-center justify-between gap-1">
                <button 
                  disabled={sidebarPage === 1}
                  onClick={() => setSidebarPage(prev => prev - 1)}
                  className="px-2 py-1.5 flex items-center justify-center rounded-lg bg-white border border-gray-100 text-[10px] font-black text-gray-400 disabled:opacity-30 enabled:hover:bg-blue-50 enabled:hover:text-blue-600 transition-all shadow-sm"
                >
                  上一页
                </button>
                <div className="flex items-center bg-gray-100/50 p-0.5 rounded-lg">
                  {Array.from({ length: Math.min(3, totalSidebarPages) }, (_, i) => {
                    let pageNum = sidebarPage;
                    if (sidebarPage === 1) pageNum = i + 1;
                    else if (sidebarPage === totalSidebarPages) pageNum = totalSidebarPages - (2 - i);
                    else pageNum = sidebarPage + (i - 1);
                    
                    if (pageNum <= 0 || pageNum > totalSidebarPages) return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setSidebarPage(pageNum)}
                        className={`w-7 h-7 rounded-md text-[10px] font-black transition-all ${sidebarPage === pageNum ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'text-gray-400 hover:text-blue-600'}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button 
                  disabled={sidebarPage >= totalSidebarPages}
                  onClick={() => setSidebarPage(prev => prev + 1)}
                  className="px-2 py-1.5 flex items-center justify-center rounded-lg bg-white border border-gray-100 text-[10px] font-black text-gray-400 disabled:opacity-30 enabled:hover:bg-blue-50 enabled:hover:text-blue-600 transition-all shadow-sm"
                >
                  下一页
                </button>
              </div>
            </div>
        </div>

        {/* Right Area: Tencent Map View */}
        <div className="flex-1 relative bg-white rounded-3xl border border-gray-100 shadow-xl shadow-blue-900/5 overflow-hidden group">
          <div ref={mapContainer} className="absolute inset-0" />

          {/* Overlays */}
          <div className="absolute top-8 left-8 flex flex-col gap-2">
             <div className="p-1 bg-white/90 backdrop-blur rounded-xl border border-gray-100 shadow-xl flex items-center gap-1">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-200">2D</button>
                <button className="px-4 py-2 hover:bg-gray-50 text-gray-400 rounded-lg text-[10px] font-black uppercase tracking-widest">3D</button>
                <button className="px-4 py-2 hover:bg-gray-50 text-gray-400 rounded-lg text-[10px] font-black uppercase tracking-widest">卫星</button>
             </div>
          </div>

          <div className="absolute right-6 top-6 flex flex-col gap-2">
             <div className="bg-white/90 backdrop-blur-md p-1 rounded-2xl shadow-xl border border-white/50 space-y-1">
                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                  <Plus size={20} />
                </button>
                <div className="h-px bg-gray-100 mx-2" />
                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                  <Minus size={20} />
                </button>
             </div>
             <button className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/90 backdrop-blur-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-xl border border-white/50">
                <Navigation size={20} />
             </button>
          </div>

          {/* Space Viewer Modal Overlay */}
          <AnimatePresence>
            {selectedSpace && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-gray-900/60 backdrop-blur-md">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 30 }}
                  className="bg-white w-full max-w-5xl h-[80vh] rounded-[48px] shadow-2xl overflow-hidden flex flex-col relative"
                >
                  <button 
                    onClick={closeViewer}
                    className="absolute top-8 right-8 w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center transition-all z-20"
                  >
                    <X size={24} />
                  </button>

                  <div className="flex-1 flex overflow-hidden">
                    <AnimatePresence mode="wait">
                      {viewLevel === 'room' && selectedRoom ? (
                        <motion.div 
                          key="room-info"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="w-[380px] border-r border-gray-50 p-10 space-y-10 overflow-y-auto no-scrollbar shrink-0 relative"
                        >
                          <div className="sticky top-0 bg-white pb-6 z-10">
                            <button 
                              onClick={() => setViewLevel('floor')}
                              className="flex items-center gap-2 text-sm font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors"
                            >
                              <ChevronRight className="rotate-180" size={18} />
                              返回楼栋模型
                            </button>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="w-12 h-12 rounded-2xl bg-cyan-600 text-white flex items-center justify-center">
                              <Layout size={24} />
                            </div>
                            <div>
                              <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">房间详情 - {selectedRoom.name}</h2>
                              <p className="text-xs font-black text-cyan-600 font-mono tracking-widest mt-1">位置编码: {selectedRoom.code}</p>
                            </div>
                          </div>

                          <div className="space-y-6">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2">房间配置信息</h4>
                            <div className="grid grid-cols-1 gap-6">
                              {[
                                { label: '位置编码', value: selectedRoom.code },
                                { label: '门牌号', value: selectedRoom.name },
                                { label: '面积', value: selectedRoom.area },
                                { label: '功能类型', value: selectedRoom.type }
                              ].map(stat => (
                                <div key={stat.label} className="flex flex-col gap-1">
                                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</span>
                                  <span className="text-sm font-black text-gray-900">{stat.value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div 
                          key="building-info"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="w-[380px] border-r border-gray-50 p-10 space-y-10 overflow-y-auto no-scrollbar shrink-0"
                        >
                          <div className="space-y-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
                              <Building2 size={24} />
                            </div>
                            <div>
                              <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">{selectedSpace.name}</h2>
                              <p className="text-xs font-black text-blue-600 font-mono tracking-widest mt-1">位置编码: {selectedSpace.code}</p>
                            </div>
                          </div>

                          <div className="space-y-6">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2">基础配置信息</h4>
                            <div className="grid grid-cols-1 gap-4">
                              {[
                                { label: '建筑楼层', value: '地上 6 层 / 地下 1 层' },
                                { label: '房间总数', value: '42 间' },
                                { label: '建筑总面积', value: '12,400 m²' }
                              ].map(stat => (
                                <div key={stat.label} className="flex flex-col gap-1">
                                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</span>
                                  <span className="text-sm font-black text-gray-900">{stat.value}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">楼层清单</h4>
                            </div>
                            <div className="space-y-2">
                              {[6, 5, 4, 3, 2, 1].map(f => (
                                <button 
                                  key={f}
                                  onClick={() => {
                                    setSelectedFloor(f);
                                    setActiveDetailTab('units');
                                  }}
                                  className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-[11px] font-black border bg-gray-50 text-gray-400 border-transparent hover:border-blue-100 hover:bg-white hover:text-blue-600 transition-all shadow-sm shadow-transparent hover:shadow-blue-900/5 group/fl"
                                >
                                  <span>地上{['一', '二', '三', '四', '五', '六'][f-1]}楼</span>
                                  <span className="px-2 py-0.5 rounded-lg text-[9px] bg-gray-200 text-gray-500 group-hover/fl:bg-blue-100 group-hover/fl:text-blue-600">8 间</span>
                                </button>
                              ))}
                              <div className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-[11px] font-black border bg-gray-50 text-gray-400 opacity-60">
                                <span>地下一楼</span>
                                <span className="px-2 py-0.5 rounded-lg text-[9px] bg-gray-200 text-gray-500">10 间</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Right Panel */}
                    <div className="flex-1 bg-[#050B1C] relative overflow-hidden flex flex-col">
                      <AnimatePresence mode="wait">
                        {viewLevel === 'room' ? (
                          <motion.div 
                            key="room-view"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-1 flex items-center justify-center p-20 relative bg-[#EEF2F7]"
                          >
                             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.05)_0%,_transparent_70%)] opacity-50"></div>
                             
                             <div className="relative w-full h-full bg-white rounded-[64px] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex items-center justify-center">
                                <img 
                                  src="https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&q=80&w=800"
                                  alt="Room 3D Model"
                                  className="max-w-[120%] max-h-[120%] object-contain scale-110"
                                  referrerPolicy="no-referrer"
                                />
                             </div>
                          </motion.div>
                        ) : (
                          <motion.div 
                            key="building-view"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-1 flex items-center justify-center p-12 relative"
                          >
                            <div className="absolute top-10 left-1/2 -translate-x-1/2 z-20 flex bg-gray-900/40 backdrop-blur-md p-1 rounded-2xl border border-white/10">
                               {[
                                 { id: 'model', label: '模型图' },
                                 { id: 'units', label: '空间单元清单' }
                               ].map(tab => (
                                 <button
                                   key={tab.id}
                                   onClick={() => setActiveDetailTab(tab.id as any)}
                                   className={`px-6 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${
                                     activeDetailTab === tab.id 
                                      ? 'bg-blue-600 text-white shadow-lg' 
                                      : 'text-gray-400 hover:text-white'
                                   }`}
                                 >
                                   {tab.label}
                                 </button>
                               ))}
                            </div>

                            <div className="flex-1 flex flex-col pt-24 overflow-hidden text-white/50 text-[10px] uppercase font-black tracking-[0.3em] items-center justify-center">
                               {activeDetailTab === 'model' ? (
                                 <div className="relative group cursor-pointer" onClick={() => setViewLevel('room')}>
                                    <div className="absolute inset-0 bg-blue-600/20 blur-[120px] rounded-full scale-150 group-hover:scale-175 transition-transform duration-700"></div>
                                    <img 
                                      src="https://img2022.cnblogs.com/blog/800616/202208/800616-20220823162822536-1777176525.png"
                                      className="relative z-10 max-h-[50vh] object-contain drop-shadow-[0_0_50px_rgba(37,99,235,0.4)]"
                                      alt="3D Building"
                                      referrerPolicy="no-referrer"
                                    />
                                    <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 flex items-center gap-2 group-hover:gap-4 transition-all duration-500">
                                       <span className="w-12 h-px bg-white/20"></span>
                                       <span>点击进入楼层详情</span>
                                       <span className="w-12 h-px bg-white/20"></span>
                                    </div>
                                 </div>
                               ) : (
                                  <div className="w-full h-full p-10 bg-white grid grid-cols-4 gap-4 overflow-y-auto no-scrollbar">
                                     {[...Array(24)].map((_, i) => (
                                       <button 
                                          key={i} 
                                          onClick={() => setViewLevel('room')}
                                          className="p-6 rounded-3xl bg-gray-50 border border-transparent hover:border-blue-100 hover:bg-blue-50 transition-all text-left group"
                                       >
                                          <p className="text-base font-black text-gray-900 group-hover:text-blue-600">{101 + i}B</p>
                                          <p className="text-[10px] font-bold text-gray-400 mt-1">位置编码: 0009231{i}</p>
                                       </button>
                                     ))}
                                  </div>
                               )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="absolute bottom-10 right-10 flex items-center gap-3">
                        <button className="w-12 h-12 rounded-2xl bg-white shadow-xl flex items-center justify-center text-gray-400 hover:text-blue-600 transition-all border border-gray-100">
                           <ZoomIn size={20} />
                        </button>
                        <button className="w-12 h-12 rounded-2xl bg-white shadow-xl flex items-center justify-center text-gray-400 hover:text-blue-600 transition-all border border-gray-100">
                           <ZoomOut size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Add Spatial Info Modal */}
          <AnimatePresence>
            {isAddModalOpen && (
              <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-md">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className={`bg-white w-full rounded-[40px] shadow-2xl overflow-hidden flex flex-col p-8 gap-5 relative transition-all duration-300 ${
                    formData.type === 'building' ? 'max-w-5xl h-[85vh]' : 'max-w-lg h-auto max-h-[90vh]'
                  }`}
                >
                  <button 
                    onClick={() => setIsAddModalOpen(false)}
                    className="absolute top-8 right-8 w-10 h-10 rounded-xl bg-gray-50 text-gray-400 hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center transition-all z-10"
                  >
                    <X size={20} />
                  </button>

                  <div className="space-y-1 shrink-0 text-left">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">新增空间信息</h2>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-6 pr-1 no-scrollbar text-left">
                    {/* Type Choice */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">类型</label>
                      <div className="flex p-1.5 bg-gray-100 rounded-2xl gap-2">
                        {[
                          { id: 'building', label: '建筑', icon: <Building2 size={14} /> },
                          { id: 'layer', label: '空间图层', icon: <Layers size={14} /> }
                        ].map(t => (
                          <button
                            key={t.id}
                            onClick={() => setFormData({ ...formData, type: t.id })}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black transition-all ${
                              formData.type === t.id 
                                ? 'bg-white text-blue-600 shadow-sm' 
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                          >
                            {t.icon}
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Conditional Fields: Location (for Building) */}
                    {formData.type === 'building' && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">位置信息</label>
                        <button 
                          onClick={() => setIsBuildingSelectOpen(true)}
                          className="w-full flex items-center justify-between px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold outline-none hover:bg-gray-100 transition-all text-left"
                        >
                          {formData.location ? (
                            <div className="flex items-center gap-3">
                              <img src={formData.locationImg} className="w-6 h-8 rounded-md object-cover" alt="" referrerPolicy="no-referrer" />
                              <div>
                                <p className="text-gray-900">{formData.locationName}</p>
                                <p className="text-[10px] text-gray-400">编码: {formData.location}</p>
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400">点击选择建筑位置...</span>
                          )}
                          <ChevronRight size={14} className="text-gray-300" />
                        </button>
                      </div>
                    )}

                    {/* Common / Conditional Fields */}
                    {formData.type === 'layer' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">空间图层编码</label>
                          <input 
                            type="text" 
                            placeholder="LAY-XXX"
                            value={formData.code}
                            onChange={e => setFormData({ ...formData, code: e.target.value })}
                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold font-mono outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">空间图层名称</label>
                          <input 
                            type="text" 
                            placeholder="输入图层描述名称"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">描述</label>
                          <textarea 
                            rows={3}
                            placeholder="填写空间图层的功能描述及使用范围..."
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* 3D Modeling Needed Toggle */}
                    <div className="flex items-center justify-between p-5 bg-blue-50/30 rounded-3xl border border-blue-100/50">
                       <h4 className="text-xs font-black text-gray-900">内部空间是否需要3D建模</h4>
                       <button 
                        onClick={() => setFormData({ ...formData, needs3D: !formData.needs3D })}
                        className={`w-12 h-6 rounded-full transition-all relative ${formData.needs3D ? 'bg-blue-600' : 'bg-gray-200'}`}
                       >
                         <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all ${formData.needs3D ? 'translate-x-6' : 'translate-x-0'}`} />
                       </button>
                    </div>

                    {/* Floor and Room mapping split table (When type is building) */}
                    {formData.type === 'building' && (
                      <div className="space-y-4 mt-6 border-t border-gray-200 pt-6">
                        <div className="space-y-1 text-left">
                          <label className="text-xs font-black uppercase tracking-wider text-gray-400 block ml-1 font-sans">内部空间</label>
                          <p className="text-xs text-gray-450 font-semibold uppercase tracking-wide ml-1">请在下方划分各楼层及房间，支持拖动进行排序</p>
                        </div>

                        <div className="grid grid-cols-12 gap-5 h-[340px] rounded-[28px] overflow-hidden bg-white shadow-sm border border-gray-200">
                          {/* Left: Floors layout */}
                          <div className="col-span-5 border-r border-gray-200 flex flex-col overflow-hidden bg-gray-50/20">
                            {/* Floor Top control panel */}
                            <div className="p-3 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between shrink-0">
                              <span className="text-xs font-black text-gray-500 uppercase tracking-wider font-sans">楼层信息列表</span>
                              <button
                                type="button"
                                onClick={() => setIsAddingFloor(true)}
                                className="px-2.5 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1 hover:bg-blue-700 transition active:scale-95 shadow-sm"
                              >
                                <Plus size={12} className="stroke-[3]" />
                                新增楼层
                              </button>
                            </div>

                            {/* Add floor overlay modal */}
                            {isAddingFloor && (
                              <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
                                <div className="bg-white rounded-[32px] p-8 shadow-2xl w-full max-w-sm border border-gray-100 text-left space-y-6 animate-fade-in relative">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setIsAddingFloor(false);
                                      setAddFloorForm({ name: '', code: '' });
                                    }}
                                    className="absolute top-6 right-6 w-8 h-8 rounded-full bg-gray-50 text-gray-400 hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center transition"
                                  >
                                    <X size={16} />
                                  </button>

                                  <div>
                                    <h3 className="text-base font-black text-gray-900 tracking-tight">新增物理楼层</h3>
                                    <p className="text-xs text-gray-450 mt-1.5 font-semibold">位置编码须为9位纯数字</p>
                                  </div>

                                  <div className="space-y-4">
                                    <div className="space-y-1.5">
                                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">楼层名称 *</label>
                                      <input
                                        type="text"
                                        placeholder="e.g. 4楼 (4F)"
                                        value={addFloorForm.name}
                                        onChange={e => setAddFloorForm({ ...addFloorForm, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold outline-none focus:border-blue-500 transition-all font-sans"
                                      />
                                    </div>
                                    <div className="space-y-1.5">
                                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">位置编码 (9位纯数字) *</label>
                                      <input
                                        type="text"
                                        placeholder="e.g. 100000004"
                                        value={addFloorForm.code}
                                        onChange={e => {
                                          const val = e.target.value.replace(/\D/g, '').slice(0, 9);
                                          setAddFloorForm({ ...addFloorForm, code: val });
                                        }}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold font-mono outline-none focus:border-blue-500 transition-all"
                                      />
                                    </div>
                                  </div>

                                  <div className="flex gap-3 pt-2 justify-end">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setIsAddingFloor(false);
                                        setAddFloorForm({ name: '', code: '' });
                                      }}
                                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-xs font-black text-gray-600 rounded-xl transition"
                                    >
                                      取消
                                    </button>
                                    <button
                                      type="button"
                                      onClick={handleAddFloor}
                                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-black text-white rounded-xl transition shadow-md shadow-blue-500/10"
                                    >
                                      确认添加
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Floor scroll feed */}
                            <div className="flex-1 overflow-y-auto p-2 space-y-1.5 no-scrollbar">
                              {newSpaceFloors.length === 0 ? (
                                <div className="p-8 text-center text-gray-400">
                                  <p className="text-xs font-bold">请点击右上角新增一个物理楼层</p>
                                </div>
                              ) : (
                                newSpaceFloors.map((fl, idx) => {
                                  const isActive = fl.id === activeFloorId;
                                  const roomCount = (newSpaceRooms[fl.id] || []).length;
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
                                        <div className="cursor-grab active:cursor-grabbing text-gray-300 shrink-0">
                                          <GripVertical size={13} className={isActive ? 'text-blue-100' : 'text-gray-400'} />
                                        </div>
                                        <div className="min-w-0 text-left">
                                          <p className={`text-xs font-black truncate leading-tight ${isActive ? 'text-white' : 'text-gray-850'}`}>
                                            {fl.name}
                                          </p>
                                          <p className={`text-[10px] font-mono mt-0.5 leading-none block font-semibold ${isActive ? 'text-blue-100' : 'text-gray-400'}`}>
                                            {fl.code}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-1.5 shrink-0">
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                                          isActive ? 'bg-blue-500 text-blue-105' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                          {roomCount} 间
                                        </span>

                                        <div className="flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                          <button
                                            type="button"
                                            onClick={(e) => handleMoveFloor(idx, 'up', e)}
                                            disabled={idx === 0}
                                            className={`p-1 rounded hover:bg-black/5 ${idx === 0 ? 'text-gray-300 opacity-20' : ''}`}
                                          >
                                            <ArrowUp size={11} className="stroke-[2.5]" />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={(e) => handleMoveFloor(idx, 'down', e)}
                                            disabled={idx === newSpaceFloors.length - 1}
                                            className={`p-1 rounded hover:bg-black/5 ${idx === newSpaceFloors.length - 1 ? 'text-gray-300 opacity-20' : ''}`}
                                          >
                                            <ArrowDown size={11} className="stroke-[2.5]" />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={(e) => handleDeleteFloor(fl.id, e)}
                                            className={`p-1 rounded hover:bg-rose-500 hover:text-white ${isActive ? 'text-red-100 animate-pulse' : 'text-gray-400'}`}
                                          >
                                            <Trash2 size={11} />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </div>
                              {/* Right: Rooms layout of selected Floor */}
                          <div className="col-span-7 flex flex-col overflow-hidden text-left font-sans bg-white/50">
                            {/* Rooms head */}
                            <div className="p-3 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between shrink-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-xs font-black text-gray-500 uppercase tracking-widest whitespace-nowrap">房间信息列表</span>
                                {newSpaceFloors.find(f => f.id === activeFloorId) && (
                                  <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
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
                                className="px-2.5 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1 hover:bg-emerald-700 transition active:scale-95 shadow-sm"
                              >
                                <Plus size={12} className="stroke-[3]" />
                                新增房间
                              </button>
                            </div>

                            {/* Room Adding Overlay Modal */}
                            {isAddingRoom && (
                              <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
                                <div className="bg-white rounded-[32px] p-8 shadow-2xl w-full max-w-md border border-gray-100 text-left space-y-6 animate-fade-in relative">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setIsAddingRoom(false);
                                      setAddRoomForm({ roomNumber: '', code: '', area: '', usage: '办公室' });
                                    }}
                                    className="absolute top-6 right-6 w-8 h-8 rounded-full bg-gray-50 text-gray-400 hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center transition"
                                  >
                                    <X size={16} />
                                  </button>

                                  <div>
                                    <h3 className="text-base font-black text-gray-900 tracking-tight">新增房间单元</h3>
                                    <p className="text-xs text-gray-450 mt-1.5 font-semibold">
                                      选定楼层：
                                      <span className="px-2.5 py-0.5 ml-1.5 bg-blue-50 border border-blue-100 rounded text-blue-600 font-extrabold uppercase">
                                        {newSpaceFloors.find(f => f.id === activeFloorId)?.name || '未知楼层'}
                                      </span>
                                    </p>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5 col-span-2">
                                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">房间号 *</label>
                                      <input
                                        type="text"
                                        placeholder="e.g. 101"
                                        value={addRoomForm.roomNumber}
                                        onChange={e => setAddRoomForm({ ...addRoomForm, roomNumber: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold outline-none focus:border-emerald-500 transition-all font-sans"
                                      />
                                    </div>
                                    <div className="space-y-1.5">
                                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">位置编码 (9位纯数字) *</label>
                                      <input
                                        type="text"
                                        placeholder="e.g. 200000101"
                                        value={addRoomForm.code}
                                        onChange={e => {
                                          const val = e.target.value.replace(/\D/g, '').slice(0, 9);
                                          setAddRoomForm({ ...addRoomForm, code: val });
                                        }}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold font-mono outline-none focus:border-emerald-500 transition-all"
                                      />
                                    </div>
                                    <div className="space-y-1.5">
                                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">面积 (㎡) *</label>
                                      <input
                                        type="text"
                                        placeholder="e.g. 98.5"
                                        value={addRoomForm.area}
                                        onChange={e => setAddRoomForm({ ...addRoomForm, area: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold outline-none focus:border-emerald-500 transition-all"
                                      />
                                    </div>
                                    <div className="space-y-1.5 col-span-2">
                                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">空间性质 *</label>
                                      <select
                                        value={addRoomForm.usage}
                                        onChange={e => setAddRoomForm({ ...addRoomForm, usage: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold outline-none focus:border-emerald-500 transition-all text-left"
                                      >
                                        {['实验室', '大教室', '自习研发舱', '办公室', '总控机房', '电力负荷室', '走廊通廊'].map(opt => (
                                          <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>

                                  <div className="flex gap-3 pt-2 justify-end">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setIsAddingRoom(false);
                                        setAddRoomForm({ roomNumber: '', code: '', area: '', usage: '办公室' });
                                      }}
                                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-xs font-black text-gray-600 rounded-xl transition"
                                    >
                                      取消
                                    </button>
                                    <button
                                      type="button"
                                      onClick={handleAddRoom}
                                      className="px-4 py-2 bg-emerald-650 hover:bg-emerald-700 text-xs font-black text-white rounded-xl transition shadow-md shadow-emerald-500/10"
                                    >
                                      确认保存
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Room Table Grid scroll feed */}
                            <div className="flex-1 overflow-y-auto no-scrollbar bg-gray-50/5">
                              {!(newSpaceRooms[activeFloorId]?.length > 0) ? (
                                <div className="p-8 text-center text-gray-400 font-sans">
                                  <p className="text-xs font-bold text-gray-500">当前楼层尚未录入任何房间</p>
                                  <p className="text-xs text-gray-450 mt-1 uppercase tracking-wide">请点击右上方按钮为此楼层设计首个单元</p>
                                </div>
                              ) : (
                                <table className="w-full text-left border-collapse font-sans text-sm">
                                  <thead>
                                    <tr className="bg-gray-50 sticky top-0 border-b border-gray-200 text-sm font-bold text-gray-550 uppercase tracking-wider select-none">
                                      <th className="p-3 w-8"></th>
                                      <th className="p-3">房间号</th>
                                      <th className="p-3">位置编码</th>
                                      <th className="p-3 text-right">面积</th>
                                      <th className="p-3">性质</th>
                                      <th className="p-3 text-center">操作</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {(newSpaceRooms[activeFloorId] || []).map((rm, idx) => (
                                      <tr 
                                        key={rm.id} 
                                        className="border-b border-gray-100 hover:bg-slate-50/80 transition-colors text-sm font-semibold text-gray-700"
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
                                            <GripVertical size={13} className="text-gray-400 select-none" />
                                          </div>
                                        </td>
                                        <td className="p-3">
                                          <span className="px-2 py-0.5 rounded bg-gray-100 border border-gray-200 text-gray-900 font-mono text-sm font-bold">
                                            #{rm.roomNumber}
                                          </span>
                                        </td>
                                        <td className="p-3 font-mono text-sm text-gray-500">{rm.code}</td>
                                        <td className="p-3 text-right font-mono text-gray-800">{rm.area} ㎡</td>
                                        <td className="p-3">
                                          <span className="bg-emerald-50 text-emerald-800 text-sm px-2.5 py-1 rounded border border-emerald-100 font-bold">
                                            {rm.usage}
                                          </span>
                                        </td>
                                        <td className="p-3 text-center">
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteRoom(rm.id)}
                                            className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-55 rounded transition"
                                          >
                                            <Trash2 size={13} className="stroke-[2.2]" />
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
                  </div>

                  <div className="flex gap-4 shrink-0 border-t border-gray-100 pt-4">
                    <button 
                      onClick={() => setIsAddModalOpen(false)}
                      className="flex-1 py-4 bg-gray-100 text-gray-900 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
                    >
                      取消
                    </button>
                    <button 
                      onClick={() => setIsAddModalOpen(false)}
                      className="flex-1 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all hover:shadow-xl"
                    >
                      保存
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Building Selection Modal */}
          <AnimatePresence>
            {isBuildingSelectOpen && (
              <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-md">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="bg-white w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col p-8 gap-6 relative"
                >
                  <button 
                    onClick={() => setIsBuildingSelectOpen(false)}
                    className="absolute top-8 right-8 w-10 h-10 rounded-xl bg-gray-50 text-gray-400 hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center transition-all z-10"
                  >
                    <X size={20} />
                  </button>

                  <div className="space-y-1">
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">选择建筑资源</h2>
                  </div>

                  {/* Search Area */}
                  <div className="p-6 bg-gray-50 rounded-3xl grid grid-cols-4 gap-4 items-end">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">位置编码</label>
                      <input 
                        type="text" 
                        placeholder="输入编码..."
                        value={buildingSearch.code}
                        onChange={e => setBuildingSearch({ ...buildingSearch, code: e.target.value })}
                        className="w-full px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">建筑名称</label>
                      <input 
                        type="text" 
                        placeholder="输入名称..."
                        value={buildingSearch.name}
                        onChange={e => setBuildingSearch({ ...buildingSearch, name: e.target.value })}
                        className="w-full px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">功能类型</label>
                      <select 
                        value={buildingSearch.type}
                        onChange={e => setBuildingSearch({ ...buildingSearch, type: e.target.value })}
                        className="w-full px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                      >
                        <option value="">全部</option>
                        <option value="办公">办公</option>
                        <option value="教学">教学</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setBuildingSearch({ code: '', name: '', type: '' })}
                        className="py-2.5 px-6 bg-white border border-gray-200 text-gray-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all"
                      >
                        重置
                      </button>
                      <button className="py-2.5 px-6 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
                        查询
                      </button>
                    </div>
                  </div>

                  {/* Table Area */}
                  <div className="flex-1 border border-gray-100 rounded-3xl overflow-hidden flex flex-col">
                    <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 grid grid-cols-[120px_60px_1fr_120px_80px] gap-4">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">位置编码</span>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">图片</span>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">建筑名称</span>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">功能类型</span>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">操作</span>
                    </div>
                    <div className="overflow-y-auto max-h-[300px] flex-1 no-scrollbar">
                      {MOCK_BUILDING_RESOURCES.map(res => (
                        <div key={res.code} className="px-6 py-4 border-b border-gray-50 grid grid-cols-[120px_60px_1fr_120px_80px] gap-4 items-center group hover:bg-blue-50/30 transition-colors">
                          <span className="text-xs font-mono font-bold text-gray-500">{res.code}</span>
                          <img src={res.img} className="w-10 h-10 rounded-lg object-cover" alt="" referrerPolicy="no-referrer" />
                          <span className="text-xs font-black text-gray-900">{res.name}</span>
                          <span className="text-xs font-bold text-gray-400">{res.type}</span>
                          <div className="flex justify-center">
                            <button 
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  location: res.code,
                                  locationName: res.name,
                                  locationImg: res.img
                                });
                                setIsBuildingSelectOpen(false);
                              }}
                              className="px-3 py-1.5 bg-white border border-gray-200 text-[10px] font-black text-blue-600 rounded-lg hover:border-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                            >
                              选择
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Unmodeled Spaces Modal */}
          <AnimatePresence>
            {isUnmodeledModalOpen && (
              <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-md">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col p-8 gap-8 relative"
                >
                  <button 
                    onClick={() => setIsUnmodeledModalOpen(false)}
                    className="absolute top-8 right-8 w-10 h-10 rounded-xl bg-gray-50 text-gray-400 hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center transition-all z-10"
                  >
                    <X size={20} />
                  </button>

                  <div className="space-y-6 pt-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                        <Scan size={24} strokeWidth={3} />
                      </div>
                      <div className="space-y-0.5">
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">未建模空间清单</h2>
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">待处理的空间资源统计与检索</p>
                      </div>
                    </div>
                    
                    {/* Stats Header */}
                    <div className="grid grid-cols-3 gap-6">
                      {[
                        { label: '未建模总数', value: 20, color: 'blue', icon: <Scan size={16} /> },
                        { label: '未建模建筑数', value: 12, color: 'blue', icon: <Building2 size={16} /> },
                        { label: '未建模空间图层数', value: 8, color: 'blue', icon: <Layers size={16} /> },
                      ].map(stat => (
                        <div key={stat.label} className="relative overflow-hidden group px-6 py-5 rounded-[2rem] bg-white border border-blue-100 shadow-xl shadow-blue-900/5 hover:border-blue-600 transition-all">
                          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            {stat.icon}
                          </div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                          <p className="text-3xl font-black text-blue-600 tracking-tighter">{stat.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Search Area */}
                  <div className="p-6 bg-gray-50 rounded-[32px] grid grid-cols-[1fr_1fr_1fr_auto] gap-6 items-end">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">位置编码</label>
                      <input 
                        type="text" 
                        placeholder="输入编码..."
                        value={unmodeledSearch.code}
                        onChange={e => setUnmodeledSearch({ ...unmodeledSearch, code: e.target.value })}
                        className="w-full px-5 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">名称</label>
                      <input 
                        type="text" 
                        placeholder="输入名称..."
                        value={unmodeledSearch.name}
                        onChange={e => setUnmodeledSearch({ ...unmodeledSearch, name: e.target.value })}
                        className="w-full px-5 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">类型</label>
                      <select 
                        value={unmodeledSearch.type}
                        onChange={e => setUnmodeledSearch({ ...unmodeledSearch, type: e.target.value })}
                        className="w-full px-5 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                      >
                        <option value="">全部类型</option>
                        <option value="building">建筑</option>
                        <option value="layer">图层</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setUnmodeledSearch({ code: '', name: '', type: '' })}
                        className="py-3 px-8 bg-white border border-gray-200 text-gray-500 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all"
                      >
                        重置
                      </button>
                      <button className="py-3 px-8 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
                        查询
                      </button>
                    </div>
                  </div>

                  {/* List Area */}
                  <div className="flex-1 min-h-[300px] flex flex-col border border-blue-50 rounded-[32px] overflow-hidden shadow-sm">
                    <div className="bg-blue-600 px-8 py-5 grid grid-cols-[1fr_1.5fr_1fr] gap-8">
                       <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">位置编码</span>
                       <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">名称</span>
                       <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">类型</span>
                    </div>
                    <div className="flex-1 overflow-y-auto no-scrollbar">
                       {SPACES.filter(s => !s.isLabeled)
                        .filter(s => s.code.includes(unmodeledSearch.code) && s.name.includes(unmodeledSearch.name) && (unmodeledSearch.type === '' || s.type === unmodeledSearch.type))
                        .slice((unmodeledPage - 1) * 5, unmodeledPage * 5)
                        .map(item => (
                          <div key={item.id} className="px-8 py-4 border-b border-gray-50 grid grid-cols-[1fr_1.5fr_1fr] gap-8 items-center hover:bg-blue-50/20 transition-colors">
                             <span className="text-xs font-mono font-bold text-blue-600">{item.code}</span>
                             <span className="text-xs font-black text-gray-900">{item.name}</span>
                             <span>
                               <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                                  item.type === 'building' 
                                    ? 'bg-blue-50 text-blue-600 border-blue-100' 
                                    : 'bg-violet-50 text-violet-600 border-violet-100'
                               }`}>
                                 {item.type === 'building' ? '建筑' : '空间图层'}
                               </span>
                             </span>
                          </div>
                       ))}
                    </div>
                    {/* Pagination */}
                    <div className="px-8 py-4 bg-gray-50/50 flex items-center justify-between">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                         第 {unmodeledPage} 页 / 共 {Math.ceil(SPACES.filter(s => !s.isLabeled).length / 5)} 页
                       </p>
                       <div className="flex gap-1">
                         <button 
                           disabled={unmodeledPage === 1}
                           onClick={() => setUnmodeledPage(p => p - 1)}
                           className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-[10px] font-black text-gray-400 hover:text-blue-600 disabled:opacity-30 transition-all shadow-sm"
                         >
                           上一页
                         </button>
                         <button 
                           disabled={unmodeledPage >= Math.ceil(SPACES.filter(s => !s.isLabeled).length / 5)}
                           onClick={() => setUnmodeledPage(p => p + 1)}
                           className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-[10px] font-black text-gray-400 hover:text-blue-600 disabled:opacity-30 transition-all shadow-sm"
                         >
                           下一页
                         </button>
                       </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
