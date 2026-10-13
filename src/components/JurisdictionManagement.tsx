import React, { useState, useEffect, useRef } from 'react';
import { 
  Map as MapIcon, 
  Search, 
  Navigation,
  Plus,
  Minus,
  Layers,
  MapPin,
  X,
  FileSpreadsheet,
  Trash2,
  Edit2,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

declare global {
  interface Window {
    qq: any;
  }
}

interface Jurisdiction {
  id: string;
  name: string;
  code: string;
  area: string; // in square meters
  isMarked: boolean;
  lat: number;
  lng: number;
  description: string;
}

const INITIAL_JURISDICTIONS: Jurisdiction[] = [
  {
    id: '1',
    name: '厦门校区',
    code: 'CAMPUS-XM-3512',
    area: '1,280,000',
    isMarked: true,
    lat: 24.6074,
    lng: 118.0831,
    description: '厦门校区主辖区，包含行政教学楼区、图书馆、田径场、学生宿舍区等。'
  },
  {
    id: '2',
    name: '泉州校区',
    code: 'CAMPUS-QZ-3620',
    area: '1,450,000',
    isMarked: true,
    lat: 24.9304,
    lng: 118.6125,
    description: '泉州校区主辖区，包含主校门陈嘉庚纪念堂、承露庄、文学院、生活区。'
  },
  {
    id: '3',
    name: '厦门校区-后勤拓展区',
    code: 'CAMPUS-XM-EXT',
    area: '230,000',
    isMarked: false,
    lat: 24.6150,
    lng: 118.0920,
    description: '后勤基地与拓展规划留用地，目前主要包含临时停车、物流配送点。'
  },
  {
    id: '4',
    name: '泉州校区-高新研发区',
    code: 'CAMPUS-QZ-RD',
    area: '310,000',
    isMarked: true,
    lat: 24.9350,
    lng: 118.6180,
    description: '产学研协同创新基地与高科技实验室集中区。'
  },
  {
    id: '5',
    name: '华文学院辖域',
    code: 'CAMPUS-HW-01',
    area: '180,000',
    isMarked: false,
    lat: 24.5712,
    lng: 118.0984,
    description: '华文校区辖域，主要服务于国际留学生汉语教学与文化交流。'
  }
];

export default function JurisdictionManagement() {
  const [jurisdictions, setJurisdictions] = useState<Jurisdiction[]>(INITIAL_JURISDICTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarPage, setSidebarPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<Jurisdiction | null>(INITIAL_JURISDICTIONS[0]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Jurisdiction Modal state
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newForm, setNewForm] = useState({
    name: '',
    code: '',
    area: '',
    isMarked: true,
    description: '',
    campusOrigin: '厦门校区'
  });

  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const activePolygon = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const pageSize = 5;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 3000);
  };

  useEffect(() => {
    // Mount custom global buttons for Header integration if opened
    const handleOpenNewModal = () => {
      setIsNewModalOpen(true);
    };
    window.addEventListener('open-new-jurisdiction-modal', handleOpenNewModal);
    return () => {
      window.removeEventListener('open-new-jurisdiction-modal', handleOpenNewModal);
    };
  }, []);

  // Initialize Tencent Map
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
          const center = new window.qq.maps.LatLng(24.6074, 118.0831);
          mapInstance.current = new window.qq.maps.Map(mapContainer.current, {
            center: center,
            zoom: 15,
            mapStyleId: 'style1'
          });

          // Draw the selected jurisdiction markers & borders
          updateMapVisuals();
        } catch (e) {
          console.error('Error initializing map for Jurisdiction:', e);
        }
      }
    }
  }, []);

  const clearMapOverlays = () => {
    if (activePolygon.current) {
      activePolygon.current.setMap(null);
      activePolygon.current = null;
    }
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];
  };

  const updateMapVisuals = () => {
    if (!mapInstance.current || !window.qq || !window.qq.maps) return;

    clearMapOverlays();

    // Spawn markers for all domains
    jurisdictions.forEach(item => {
      const pos = new window.qq.maps.LatLng(item.lat, item.lng);
      const isSelected = selectedItem?.id === item.id;
      
      const marker = new window.qq.maps.Marker({
        position: pos,
        map: mapInstance.current,
        title: item.name
      });

      window.qq.maps.event.addListener(marker, 'click', () => {
        handleItemClick(item);
      });

      markersRef.current.push(marker);

      // If active, draw circle or simple domain polygon around it
      if (isSelected && item.isMarked) {
        const polylineCoords = [
          new window.qq.maps.LatLng(item.lat - 0.003, item.lng - 0.004),
          new window.qq.maps.LatLng(item.lat - 0.003, item.lng + 0.004),
          new window.qq.maps.LatLng(item.lat + 0.003, item.lng + 0.004),
          new window.qq.maps.LatLng(item.lat + 0.003, item.lng - 0.004)
        ];

        activePolygon.current = new window.qq.maps.Polygon({
          path: polylineCoords,
          strokeColor: '#3B82F6',
          strokeWeight: 2,
          fillColor: '#3B82F6',
          fillOpacity: 0.15,
          map: mapInstance.current
        });

        mapInstance.current.panTo(pos);
        mapInstance.current.setZoom(15);
      }
    });
  };

  useEffect(() => {
    if (mapLoaded) {
      updateMapVisuals();
    }
  }, [selectedItem, jurisdictions, mapLoaded]);

  const filteredItems = jurisdictions.filter(item => {
    return item.name.includes(searchQuery) || item.code.includes(searchQuery);
  });

  const totalPages = Math.ceil(filteredItems.length / pageSize);
  const paginatedItems = filteredItems.slice((sidebarPage - 1) * pageSize, sidebarPage * pageSize);

  const handleItemClick = (item: Jurisdiction) => {
    setSelectedItem(item);
    if (mapInstance.current && window.qq?.maps) {
      mapInstance.current.panTo(new window.qq.maps.LatLng(item.lat, item.lng));
      mapInstance.current.setZoom(15);
    }
  };

  const panTo = (lat: number, lng: number) => {
    if (mapInstance.current && window.qq?.maps) {
      mapInstance.current.panTo(new window.qq.maps.LatLng(lat, lng));
      mapInstance.current.setZoom(15);
    }
  };

  const handleCreateJurisdiction = () => {
    if (!newForm.name || !newForm.code || !newForm.area) {
      showToast('请完整填写关键信息（名称、位置编码和面积）！');
      return;
    }

    // Set coordinates based on selection
    const isXm = newForm.campusOrigin === '厦门校区';
    const baseLat = isXm ? 24.6074 : 24.9304;
    const baseLng = isXm ? 118.0831 : 118.6125;

    const newJurisdiction: Jurisdiction = {
      id: `${jurisdictions.length + 1}`,
      name: newForm.name,
      code: newForm.code,
      area: Number(newForm.area.replace(/,/g, '')).toLocaleString(),
      isMarked: newForm.isMarked,
      lat: baseLat + (Math.random() - 0.5) * 0.008,
      lng: baseLng + (Math.random() - 0.5) * 0.008,
      description: newForm.description || '无详细描述。'
    };

    setJurisdictions([newJurisdiction, ...jurisdictions]);
    setSelectedItem(newJurisdiction);
    setIsNewModalOpen(false);
    showToast(`辖域 [${newJurisdiction.name}] 创建成功！`);

    // Reset Form
    setNewForm({
      name: '',
      code: '',
      area: '',
      isMarked: true,
      description: '',
      campusOrigin: '厦门校区'
    });
  };

  return (
    <div className="h-full flex flex-col bg-[#F8FAFC]">
      <div className="flex-1 flex overflow-hidden p-6 gap-6">
        {/* Left Sidebar */}
        <div className="w-80 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 flex flex-col overflow-hidden">
          {/* Header Panel */}
          <div className="p-4 border-b border-gray-100 bg-gray-50/20 flex flex-col gap-2 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-gray-800 tracking-wider">辖域资源列表</span>
            </div>
          </div>

          {/* Search Box */}
          <div className="px-4 py-3 border-b border-gray-50 flex flex-col shrink-0">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
              <input 
                type="text" 
                placeholder="搜索辖域名称、位置编码..."
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setSidebarPage(1); }}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-xl text-xs font-bold outline-none border border-transparent focus:border-blue-500 focus:bg-white transition-all font-sans"
              />
            </div>
          </div>

          {/* Jurisdiction List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
            {paginatedItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`w-full group flex flex-col gap-2.5 p-4 rounded-3xl border transition-all text-left relative overflow-hidden ${
                  selectedItem?.id === item.id 
                    ? 'border-blue-600 bg-blue-50/40 shadow-lg shadow-blue-100/10' 
                    : 'border-gray-50 bg-white hover:border-gray-200 hover:shadow-xl'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-gray-900 mb-1 leading-tight truncate flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    {item.name}
                  </p>
                  <div className="space-y-1 mt-1.5 pl-4">
                    <p className="text-[10px] font-mono font-bold text-gray-400 flex items-center gap-1 leading-normal">
                      <span className="text-gray-400 font-medium font-sans">位置编码:</span>
                      <span className="text-gray-800">{item.code}</span>
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1 leading-normal">
                      <span className="text-gray-400 font-medium">辖区面积:</span>
                      <span className="text-orange-600 font-black">{item.area} <span className="text-[9px] font-medium text-gray-400">㎡</span></span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 pl-4 flex-wrap">
                  {item.isMarked ? (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md text-[8px] font-black uppercase tracking-widest border border-emerald-100">
                      已标注
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-500 rounded-md text-[8px] font-black uppercase tracking-widest border border-amber-100">
                      未标注
                    </span>
                  )}
                </div>
              </button>
            ))}

            {filteredItems.length === 0 && (
              <div className="py-20 text-center flex flex-col items-center justify-center">
                <p className="text-xs font-bold text-gray-300">没有查找到符合条件的辖域</p>
              </div>
            )}
          </div>

          {/* Sidebar Pagination */}
          <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-100 flex flex-col gap-3 shrink-0">
            <div className="flex items-center justify-between font-sans">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                第 {sidebarPage} 页 / 共 {totalPages || 1} 页
              </p>
            </div>
            <div className="flex items-center justify-between gap-1 font-sans">
              <button 
                disabled={sidebarPage === 1}
                onClick={() => setSidebarPage(prev => Math.max(1, prev - 1))}
                className="px-2 py-1.5 flex items-center justify-center rounded-lg bg-white border border-gray-100 text-[10px] font-black text-gray-400 disabled:opacity-30 enabled:hover:bg-blue-50 enabled:hover:text-blue-600 transition-all shadow-sm"
              >
                上一页
              </button>
              <div className="flex items-center bg-gray-100/50 p-0.5 rounded-lg">
                {Array.from({ length: Math.min(3, totalPages || 1) }, (_, i) => {
                  let pageNum = sidebarPage;
                  if (sidebarPage === 1) pageNum = i + 1;
                  else if (sidebarPage === totalPages) pageNum = totalPages - (2 - i);
                  else pageNum = sidebarPage + (i - 1);
                  
                  if (pageNum <= 0 || pageNum > totalPages) return null;

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
                disabled={sidebarPage >= totalPages}
                onClick={() => setSidebarPage(prev => Math.min(totalPages, prev + 1))}
                className="px-2 py-1.5 flex items-center justify-center rounded-lg bg-white border border-gray-100 text-[10px] font-black text-gray-400 disabled:opacity-30 enabled:hover:bg-blue-50 enabled:hover:text-blue-600 transition-all shadow-sm"
              >
                下一页
              </button>
            </div>
          </div>
        </div>

        {/* Right Map Area */}
        <div className="flex-1 relative bg-white rounded-3xl border border-gray-100 shadow-xl shadow-blue-900/5 overflow-hidden">
          <div ref={mapContainer} className="absolute inset-0" />

          {/* Map Actions Control Panel */}
          <div className="absolute right-6 top-6 flex flex-col gap-2">
            <div className="bg-white/90 backdrop-blur-md p-1 rounded-2xl shadow-xl border border-white/50 space-y-1">
              <button 
                onClick={() => {
                  if (mapInstance.current) {
                    mapInstance.current.setZoom(mapInstance.current.getZoom() + 1);
                  }
                }}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer"
              >
                <Plus size={20} />
              </button>
              <div className="h-px bg-gray-100 mx-2" />
              <button 
                onClick={() => {
                  if (mapInstance.current) {
                    mapInstance.current.setZoom(mapInstance.current.getZoom() - 1);
                  }
                }}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer"
              >
                <Minus size={20} />
              </button>
            </div>
            <button 
              onClick={() => {
                if (selectedItem) {
                  panTo(selectedItem.lat, selectedItem.lng);
                }
              }}
              className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/90 backdrop-blur-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-xl border border-white/50 cursor-pointer"
              title="复位中心"
            >
              <Navigation size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* New Jurisdiction Modal */}
      <AnimatePresence>
        {isNewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewModalOpen(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-full max-w-lg max-h-[85vh] bg-white relative z-10 flex flex-col shadow-2xl rounded-3xl border border-gray-100 overflow-hidden"
            >
              {/* Modal Title */}
              <div className="p-8 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-100">
                    <Plus size={24} />
                  </div>
                  <h2 className="text-xl font-black text-gray-900 font-sans">新增辖域</h2>
                </div>
                <button 
                  onClick={() => setIsNewModalOpen(false)} 
                  className="w-10 h-10 bg-gray-50 hover:bg-gray-100 text-gray-400 rounded-xl flex items-center justify-center transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form Content */}
              <div className="p-8 flex-1 overflow-y-auto space-y-6 bg-gray-50/20 scroll-smooth pb-12 font-sans">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-1">辖域名称</label>
                  <input 
                    type="text"
                    required
                    placeholder="输入辖域（如：华文二期拓展区、厦门校区主区）"
                    value={newForm.name}
                    onChange={e => setNewForm({ ...newForm, name: e.target.value })}
                    className="w-full px-6 py-4 bg-white border border-gray-100 hover:border-gray-200 focus:border-blue-500 rounded-2xl text-sm font-bold text-gray-700 outline-none transition-all shadow-sm"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-1">位置编码</label>
                  <input 
                    type="text"
                    required
                    placeholder="请输入唯一的辖域代号/位置编码"
                    value={newForm.code}
                    onChange={e => setNewForm({ ...newForm, code: e.target.value })}
                    className="w-full px-6 py-4 bg-white border border-gray-100 hover:border-gray-200 focus:border-blue-500 rounded-2xl text-sm font-bold text-gray-700 outline-none transition-all shadow-sm font-mono"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-1">区域面积 (平方米)</label>
                  <input 
                    type="text"
                    required
                    placeholder="请输入面积 (如: 1,500,000)"
                    value={newForm.area}
                    onChange={e => setNewForm({ ...newForm, area: e.target.value })}
                    className="w-full px-6 py-4 bg-white border border-gray-100 hover:border-gray-200 focus:border-blue-500 rounded-2xl text-sm font-bold text-gray-700 outline-none transition-all shadow-sm"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-1">描述</label>
                  <textarea 
                    rows={4}
                    placeholder="请输入描述信息"
                    value={newForm.description}
                    onChange={e => setNewForm({ ...newForm, description: e.target.value })}
                    className="w-full px-6 py-4 bg-white border border-gray-100 hover:border-gray-200 focus:border-blue-500 rounded-2xl text-sm font-bold text-gray-700 outline-none transition-all shadow-sm resize-none"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-8 border-t border-gray-100 flex items-center justify-end gap-3 bg-white shrink-0 font-sans">
                <button 
                  type="button" 
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-6 py-3.5 bg-gray-50 border border-gray-100 hover:bg-gray-100/50 rounded-2xl text-xs font-black uppercase tracking-wider text-gray-500 transition-all active:scale-95"
                >
                  取消
                </button>
                <button 
                  type="button"
                  onClick={handleCreateJurisdiction}
                  className="px-8 py-3.5 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
                >
                  保存
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Alert popover */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-8 right-8 z-[100] bg-gray-900 border border-gray-800 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold font-sans"
          >
            <div className="w-5 h-5 rounded-full bg-blue-500/15 text-blue-400 flex items-center justify-center">
              <Check size={12} />
            </div>
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
