import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Map as MapIcon, 
  Layers as LayersIcon, 
  MapPin, 
  Box, 
  Plus,
  LayoutDashboard, 
  ChevronRight,
  Maximize2,
  Navigation,
  X,
  Scan,
  MoreVertical,
  Search,
  ChevronLeft
} from 'lucide-react';
import { createPortal } from 'react-dom';

declare global {
  interface Window {
    qq: any;
  }
}

const TYPES_POOL = [
  '教学楼', '图书馆', '田径场', '宿舍楼', '食堂', '自习室', '实验室', '体育馆', 
  '行政楼', '停车场', '湖泊', '草坪', '校门', '篮球场', '便利店'
];

// Generate 30 mock records for each
const LOCATIONS = Array.from({ length: 30 }, (_, i) => ({
  id: `${i + 1}`,
  code: `9032312${(21 + i).toString().padStart(2, '0')}`,
  name: i === 0 ? '行政研发大楼' : i === 1 ? '田径运动场' : i === 2 ? '郑年锦图书馆' : i === 3 ? '学生宿舍区' : `地点区块_${i + 1}`,
  type: TYPES_POOL[i % TYPES_POOL.length],
  lat: 24.6074 + (Math.random() - 0.5) * 0.01,
  lng: 118.0831 + (Math.random() - 0.5) * 0.01,
  img: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=200',
  isMarked: i % 5 !== 0, // Some unmarked for variety
  hasStreetView: i % 4 !== 0, // Street view build status tag
  campus: i % 2 === 0 ? '厦门校区' : '泉州校区'
}));

const LAYERS = Array.from({ length: 30 }, (_, i) => ({
  id: `layer-${i + 1}`,
  name: i % 5 === 0 ? '教学区' : i % 5 === 1 ? '运动区' : i % 5 === 2 ? '办公区' : i % 5 === 3 ? '生活区' : '公共区',
  active: i === 0,
  code: `100${(100000 + i).toString()}`,
  isMarked: i % 4 !== 0,
  campus: i % 2 === 0 ? '厦门校区' : '泉州校区'
}));

const BUILDINGS_3D = Array.from({ length: 30 }, (_, i) => ({
  id: `3d-${i + 1}`,
  code: `9032312${(25 + i).toString().padStart(2, '0')}`,
  name: i === 0 ? '陈嘉庚纪念堂' : i === 1 ? '信息大楼' : `3D建筑_${i + 1}`,
  lat: 24.6064 + (Math.random() - 0.5) * 0.01,
  lng: 118.0831 + (Math.random() - 0.5) * 0.01,
  img: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=200',
  isMarked: i % 6 !== 0,
  campus: i % 2 === 0 ? '厦门校区' : '泉州校区'
}));

const LOCATION_TYPES = {
  '教学科研类': ['教学楼', '实验楼', '图书馆', '教室', '实验室', '机房', '自习室', '报告厅'],
  '文体活动类': ['礼堂', '体育馆', '田径场', '篮球场', '足球场', '排球场', '网球场', '游泳馆', '健身房'],
  '生活服务类': ['宿舍楼', '学生公寓', '食堂', '餐厅', '医务室', '校医院', '心理咨询室', '超市', '便利店', '书店', '快递驿站', '银行网点'],
  '行政安保类': ['行政楼', '办公楼', '门卫室', '保卫处'],
  '交通配套类': ['停车场', '车棚', '充电桩'],
  '自然生态类': ['湖泊', '河流', '水库', '池塘', '溪流', '湿地', '山丘', '树林', '草地'],
  '景观与公共空间类': ['林荫道', '花坛', '草坪', '广场', '校门', '围墙', '假山', '喷泉', '观景台']
};

export default function MapBuild() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const activePolygon = useRef<any>(null);
  const [activeTab, setActiveTab] = useState<'positions' | 'layers'>('positions');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [locationsList, setLocationsList] = useState(LOCATIONS);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [selectedCampus, setSelectedCampus] = useState('厦门校区');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 3000);
  };
  
  // Sidebar states
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<{ level: 'all' | 'category' | 'subtype'; name: string }>({ level: 'all', name: '' });
  const [isTreeDropdownOpen, setIsTreeDropdownOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    '教学科研类': true, // Keep first expanded for immediate visibility
  });
  const [sidebarPage, setSidebarPage] = useState(1);
  const pageSize = 6;

  // Helper counters
  const getTypeCount = (type: string) => {
    return locationsList.filter(l => l.type === type && (!l.campus || l.campus === selectedCampus)).length;
  };

  const getCategoryCount = (cat: string) => {
    const types = LOCATION_TYPES[cat as keyof typeof LOCATION_TYPES] || [];
    return locationsList.filter(l => types.includes(l.type) && (!l.campus || l.campus === selectedCampus)).length;
  };

  const filteredLocations = locationsList.filter(l => {
    if (l.campus && l.campus !== selectedCampus) return false;
    const matchSearch = l.name.includes(sidebarSearch) || l.code.includes(sidebarSearch);
    if (!matchSearch) return false;
    if (selectedTypeFilter.level === 'all') return true;
    if (selectedTypeFilter.level === 'category') {
      const types = LOCATION_TYPES[selectedTypeFilter.name as keyof typeof LOCATION_TYPES] || [];
      return types.includes(l.type);
    }
    return l.type === selectedTypeFilter.name;
  });

  const getFilteredItems = () => {
    if (activeTab === 'positions') {
      return filteredLocations;
    } else {
      return LAYERS.filter(l => (!l.campus || l.campus === selectedCampus) && (l.name.includes(sidebarSearch) || l.code.includes(sidebarSearch)));
    }
  };

  // Unmarked List Modal States
  const [isUnmarkedModalOpen, setIsUnmarkedModalOpen] = useState(false);
  const [unmarkedSearch, setUnmarkedSearch] = useState({ code: '', name: '', type: '' });
  const [unmarkedPage, setUnmarkedPage] = useState(1);
  const unmarkedPageSize = 10;

  // List Query Modal States
  const [isListQueryModalOpen, setIsListQueryModalOpen] = useState(false);
  const [listQuerySearch, setListQuerySearch] = useState({ code: '', name: '', type: '', isMarked: '' });
  const [listQueryPage, setListQueryPage] = useState(1);
  const listQueryPageSize = 10;
  
  // New Map Info Modal States
  const [isNewMapModalOpen, setIsNewMapModalOpen] = useState(false);
  const [newMapForm, setNewMapForm] = useState({
    type: 'point',
    code: '',
    name: '',
    locationCategory: '',
    usePurpose: '',
    tagType: '',
    need3D: false,
    images: [] as string[],
    description: ''
  });

  const handleSaveNewLocation = () => {
    if (!newMapForm.code || !newMapForm.name) {
      showToast('请填写位置编码与名称！');
      return;
    }
    
    if (newMapForm.type === 'point' && !newMapForm.usePurpose) {
      showToast('请选择位置类型！');
      return;
    }

    const newObj = {
      id: `${locationsList.length + 1}`,
      code: newMapForm.code,
      name: newMapForm.name,
      type: newMapForm.usePurpose || '未知类型',
      lat: 24.6074 + (Math.random() - 0.5) * 0.01,
      lng: 118.0831 + (Math.random() - 0.5) * 0.01,
      img: newMapForm.images[0] || 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=200',
      isMarked: true,
      hasStreetView: Math.random() > 0.5,
      campus: selectedCampus
    };

    setLocationsList([newObj, ...locationsList]);
    setIsNewMapModalOpen(false);
    
    // Add marker to map
    if (mapInstance.current && window.qq && window.qq.maps) {
      try {
        const pos = new window.qq.maps.LatLng(newObj.lat, newObj.lng);
        const marker = new window.qq.maps.Marker({
          position: pos,
          map: mapInstance.current,
          title: newObj.name
        });
        window.qq.maps.event.addListener(marker, 'click', () => {
          if (mapInstance.current) {
            mapInstance.current.panTo(pos);
            mapInstance.current.setZoom(17);
          }
        });
        mapInstance.current.panTo(pos);
        mapInstance.current.setZoom(16);
      } catch (e) {
        console.error('Error adding new marker:', e);
      }
    }

    showToast(`位置 [${newObj.name}] 保存并标注成功！`);
    
    // reset form
    setNewMapForm({
      type: 'point',
      code: '',
      name: '',
      locationCategory: '',
      usePurpose: '',
      tagType: '',
      need3D: false,
      images: [] as string[],
      description: ''
    });
  };

  useEffect(() => {
    const handleOpenNewMap = () => setIsNewMapModalOpen(true);
    const handleOpenUnmarked = () => setIsUnmarkedModalOpen(true);
    const handleOpenListQuery = () => setIsListQueryModalOpen(true);
    window.addEventListener('open-new-map-modal', handleOpenNewMap);
    window.addEventListener('open-unmarked-modal', handleOpenUnmarked);
    window.addEventListener('open-list-query-modal', handleOpenListQuery);
    return () => {
      window.removeEventListener('open-new-map-modal', handleOpenNewMap);
      window.removeEventListener('open-unmarked-modal', handleOpenUnmarked);
      window.removeEventListener('open-list-query-modal', handleOpenListQuery);
    };
  }, []);

  const [layers, setLayers] = useState([
    { id: 'edu', name: '教学区', active: true, color: '#3B82F6', coords: [
      { lat: 24.6074, lng: 118.0811 }, { lat: 24.6094, lng: 118.0811 }, { lat: 24.6094, lng: 118.0831 }, { lat: 24.6074, lng: 118.0831 }
    ]},
    { id: 'sports', name: '运动区', active: false, color: '#10B981', coords: [
      { lat: 24.6094, lng: 118.0791 }, { lat: 24.6114, lng: 118.0791 }, { lat: 24.6114, lng: 118.0811 }, { lat: 24.6094, lng: 118.0811 }
    ]},
    { id: 'office', name: '办公区', active: false, color: '#F59E0B', coords: [
      { lat: 24.6054, lng: 118.0831 }, { lat: 24.6074, lng: 118.0831 }, { lat: 24.6074, lng: 118.0851 }, { lat: 24.6054, lng: 118.0851 }
    ]},
    { id: 'living', name: '生活区', active: false, color: '#8B5CF6', coords: [
      { lat: 24.6114, lng: 118.0821 }, { lat: 24.6134, lng: 118.0821 }, { lat: 24.6134, lng: 118.0841 }, { lat: 24.6114, lng: 118.0841 }
    ]},
    { id: 'public', name: '公共区', active: false, color: '#EF4444', coords: [
      { lat: 24.6034, lng: 118.0851 }, { lat: 24.6054, lng: 118.0851 }, { lat: 24.6054, lng: 118.0871 }, { lat: 24.6034, lng: 118.0871 }
    ]},
  ]);

  useEffect(() => {
    if (mapLoaded && mapInstance.current) {
      const activeLayer = layers.find(l => l.active);
      if (activeLayer) {
        drawRegion(activeLayer);
      }
    }
  }, [mapLoaded, layers]);

  const drawRegion = (layer: any) => {
    if (!mapInstance.current) return;
    
    if (activePolygon.current) {
      activePolygon.current.setMap(null);
    }

    const path = layer.coords.map((c: any) => new window.qq.maps.LatLng(c.lat, c.lng));
    
    activePolygon.current = new window.qq.maps.Polygon({
      path: path,
      strokeColor: layer.color,
      strokeWeight: 2,
      fillColor: layer.color,
      fillOpacity: 0.3,
      map: mapInstance.current
    });
  };

  const toggleLayer = (layerId: string) => {
    setLayers(prev => prev.map(l => ({ ...l, active: l.id === layerId })));
  };

  useEffect(() => {
    // Avoid multiple script additions
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
    script.onerror = (err) => {
      console.error('Tencent Maps script failed to load', err);
    };
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

          // 绘制校园边界 (模拟)
          const path = [
             new window.qq.maps.LatLng(24.613, 118.078),
             new window.qq.maps.LatLng(24.613, 118.088),
             new window.qq.maps.LatLng(24.602, 118.088),
             new window.qq.maps.LatLng(24.602, 118.078)
          ];
          new window.qq.maps.Polyline({
            path: path,
            strokeColor: '#3B82F6',
            strokeWeight: 2,
            strokeDashStyle: 'dash',
            map: mapInstance.current
          });
        } catch (e) {
          console.error('Error initializing map:', e);
        }
      }
    }

    return () => {
      // Don't remove script strictly if we want to preserve it, but cleaning up global is good
      // (window as any).initMap = undefined;
    };
  }, []);

  const panTo = (lat: number, lng: number) => {
    if (mapInstance.current) {
      mapInstance.current.panTo(new window.qq.maps.LatLng(lat, lng));
      mapInstance.current.setZoom(17);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#F8FAFC]">
      <div className="flex-1 flex overflow-hidden p-6 gap-6">
        {/* Left Sidebar */}
        <div className="w-80 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 flex flex-col overflow-hidden">
          {/* Campus Selector Dropdown */}
          <div className="p-4 border-b border-gray-100 bg-gray-50/20 flex flex-col shrink-0">
            <div className="relative">
              <select
                value={selectedCampus}
                onChange={e => {
                  const val = e.target.value;
                  setSelectedCampus(val);
                  showToast(`已成功切换至: ${val}`);
                  if (val === '厦门校区') {
                    panTo(24.6074, 118.0831);
                  } else {
                    panTo(24.9304, 118.6125);
                  }
                }}
                className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-800 outline-none focus:border-blue-600 hover:border-gray-200 transition-all font-sans appearance-none shadow-sm cursor-pointer"
              >
                <option value="厦门校区">厦门校区</option>
                <option value="泉州校区">泉州校区</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex p-2 bg-gray-100/50">
            {[
              { id: 'positions', label: '位置', icon: <MapPin size={14} /> },
              { id: 'layers', label: '地理图层', icon: <LayersIcon size={14} /> },
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

          {/* Search Box */}
          <div className="px-4 py-3 border-b border-gray-50 flex flex-col gap-2 shrink-0">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
              <input 
                type="text" 
                placeholder={`搜索${activeTab === 'positions' ? '位置' : '地理图层'}...`}
                value={sidebarSearch}
                onChange={e => { setSidebarSearch(e.target.value); setSidebarPage(1); }}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-xl text-xs font-bold outline-none border border-transparent focus:border-blue-500 focus:bg-white transition-all font-sans"
              />
            </div>
            {activeTab === 'positions' && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsTreeDropdownOpen(!isTreeDropdownOpen)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-left text-gray-700 flex items-center justify-between hover:bg-white focus:bg-white focus:border-blue-500 transition-all font-sans cursor-pointer focus:outline-none"
                >
                  <span className="truncate">
                    {selectedTypeFilter.level === 'all' && '所有'}
                    {selectedTypeFilter.level === 'category' && `分类: ${selectedTypeFilter.name} (${getCategoryCount(selectedTypeFilter.name)})`}
                    {selectedTypeFilter.level === 'subtype' && `类型: ${selectedTypeFilter.name} (${getTypeCount(selectedTypeFilter.name)})`}
                  </span>
                  <span className="pointer-events-none text-gray-400">
                    <svg className={`fill-current h-4 w-4 transform transition-transform ${isTreeDropdownOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </span>
                </button>
                
                {isTreeDropdownOpen && (
                  <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 z-40" onClick={() => setIsTreeDropdownOpen(false)} />
                    {/* Custom Tree List Popover */}
                    <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-100 shadow-2xl z-50 max-h-72 overflow-y-auto font-sans p-2 divide-y divide-gray-50 no-scrollbar">
                      {/* Standard All Level Option */}
                      <div className="py-1">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedTypeFilter({ level: 'all', name: '' });
                            setIsTreeDropdownOpen(false);
                            setSidebarPage(1);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-between ${
                            selectedTypeFilter.level === 'all' ? 'bg-blue-50 text-blue-600' : 'text-gray-900 hover:bg-gray-50'
                          }`}
                        >
                          <span>所有</span>
                          <span className="text-[10px] font-mono opacity-65">{locationsList.length}</span>
                        </button>
                      </div>

                      {/* Nesting Categories Trees */}
                      <div className="py-1.5 space-y-1">
                        {Object.entries(LOCATION_TYPES).map(([category, types]) => {
                          const catCount = getCategoryCount(category);
                          const isExpanded = expandedCategories[category];
                          const isSelectedCat = selectedTypeFilter.level === 'category' && selectedTypeFilter.name === category;

                          return (
                            <div key={category} className="space-y-0.5">
                              {/* Level 1 Category item node */}
                              <div 
                                className={`w-full flex items-center justify-between rounded-xl px-2 py-1 transition-all text-left ${
                                  isSelectedCat ? 'bg-blue-50/70 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
                                  }}
                                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors shrink-0 text-gray-400 focus:outline-none"
                                >
                                  <svg className={`w-3 h-3 transform transition-transform ${isExpanded ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                  </svg>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedTypeFilter({ level: 'category', name: category });
                                    setIsTreeDropdownOpen(false);
                                    setSidebarPage(1);
                                  }}
                                  className="flex-1 text-left px-1 py-0.5 text-xs font-bold leading-tight truncate focus:outline-none cursor-pointer"
                                >
                                  {category}
                                </button>
                                <span className="text-[10px] font-mono opacity-65 font-bold tracking-tight px-1 shrink-0">{catCount}</span>
                              </div>

                              {/* Level 2 Subtypes nodes indented */}
                              {isExpanded && (
                                <div className="pl-6 border-l border-gray-100/60 ml-3.5 space-y-0.5 py-0.5">
                                  {types.map(t => {
                                    const subCount = getTypeCount(t);
                                    const isSelectedSub = selectedTypeFilter.level === 'subtype' && selectedTypeFilter.name === t;

                                    return (
                                      <button
                                        key={t}
                                        type="button"
                                        onClick={() => {
                                          setSelectedTypeFilter({ level: 'subtype', name: t });
                                          setIsTreeDropdownOpen(false);
                                          setSidebarPage(1);
                                        }}
                                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-all flex items-center justify-between font-sans ${
                                          isSelectedSub 
                                            ? 'bg-blue-600 text-white font-extrabold shadow-sm' 
                                            : 'text-gray-500 hover:bg-gray-50 font-medium'
                                        }`}
                                      >
                                        <span className="truncate">{t}</span>
                                        <span className={`text-[9px] font-mono opacity-65 ${isSelectedSub ? 'text-white' : 'text-gray-400'}`}>{subCount}</span>
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
                  </>
                )}
              </div>
            )}
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            <AnimatePresence mode="wait">
              {activeTab === 'positions' && (
                <motion.div
                  key="positions"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-3"
                >
                  {filteredLocations
                    .slice((sidebarPage - 1) * pageSize, sidebarPage * pageSize)
                    .map(loc => (
                      <button
                        key={loc.id}
                        onClick={() => panTo(loc.lat, loc.lng)}
                        className="w-full group flex items-start gap-4 p-4 rounded-3xl border border-gray-100 bg-white hover:border-blue-200 hover:shadow-xl transition-all text-left relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <MoreVertical size={14} className="text-gray-300" />
                        </div>

                        <div className="relative shrink-0">
                          <img 
                            src={loc.img} 
                            alt={loc.name} 
                            className="w-16 h-20 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex-1 py-1 flex flex-col h-full min-w-0">
                          <p className="text-sm font-black text-gray-900 mb-1 leading-tight truncate">{loc.name}</p>
                          <div className="mb-2 space-y-0.5">
                            <p className="text-[10px] font-bold text-gray-500 truncate flex items-center gap-1 leading-normal">
                              <span className="text-gray-400 font-medium">位置类型:</span>
                              <span className="text-blue-600 font-extrabold">{loc.type}</span>
                            </p>
                            <p className="text-[10px] font-mono font-bold text-gray-500 truncate flex items-center gap-1 leading-normal">
                              <span className="text-gray-400 font-medium">编码:</span>
                              <span>{loc.code}</span>
                            </p>
                          </div>
                          
                          <div className="mt-auto flex items-center gap-1.5 flex-wrap">
                             {!loc.isMarked ? (
                               <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-50 text-gray-400 rounded-md text-[8px] font-black uppercase tracking-widest border border-gray-100">
                                 未标注
                               </span>
                             ) : (
                               <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md text-[8px] font-black uppercase tracking-widest border border-emerald-100">
                                 已标注
                               </span>
                             )}

                             {loc.hasStreetView ? (
                               <span className="flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-[8px] font-black uppercase tracking-widest border border-indigo-100">
                                 已置街景
                               </span>
                             ) : (
                               <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-500 rounded-md text-[8px] font-black uppercase tracking-widest border border-amber-100">
                                 未置街景
                               </span>
                             )}
                          </div>
                        </div>
                      </button>
                    ))}
                </motion.div>
              )}

              {activeTab === 'layers' && (
                <motion.div
                  key="layers"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-2"
                >
                  {LAYERS.filter(l => l.name.includes(sidebarSearch) || l.code.includes(sidebarSearch))
                    .slice((sidebarPage - 1) * pageSize, sidebarPage * pageSize)
                    .map(layer => (
                      <button
                        key={layer.id}
                        onClick={() => setLayers(prev => prev.map(l => ({ ...l, active: l.id === layer.id })))}
                        className={`w-full flex flex-col p-4 rounded-3xl border transition-all space-y-3 ${
                          layer.id === layers.find(l => l.active)?.id 
                            ? 'bg-blue-100/30 border-blue-200 text-blue-600 shadow-lg shadow-blue-100/20' 
                            : 'bg-white border-gray-100 text-gray-400 hover:border-blue-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <LayersIcon size={16} />
                            <span className={`text-sm font-black ${layer.id === layers.find(l => l.active)?.id ? 'text-blue-600' : 'text-gray-900'}`}>{layer.name}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] font-mono font-bold uppercase tracking-widest opacity-60 truncate">
                            {layer.code}
                          </p>
                          {!layer.isMarked ? (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-50 text-gray-400 rounded-md text-[8px] font-black uppercase tracking-widest border border-gray-100">
                               未标注
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md text-[8px] font-black uppercase tracking-widest border border-emerald-100">
                               已标注
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                </motion.div>
              )}

              {activeTab === '3d' && (
                <motion.div
                  key="3d"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-3"
                >
                  {BUILDINGS_3D.filter(b => b.name.includes(sidebarSearch) || b.code.includes(sidebarSearch))
                    .slice((sidebarPage - 1) * pageSize, sidebarPage * pageSize)
                    .map(b => (
                      <button
                        key={b.id}
                        onClick={() => panTo(b.lat, b.lng)}
                        className="w-full group flex items-start gap-4 p-4 rounded-3xl border border-gray-100 bg-white hover:border-blue-200 hover:shadow-xl transition-all text-left relative"
                      >
                        <div className="relative shrink-0">
                          <img 
                            src={b.img} 
                            alt={b.name} 
                            className="w-16 h-20 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex-1 py-1 flex flex-col h-full min-w-0">
                          <p className="text-sm font-black text-gray-900 mb-1 leading-tight truncate">{b.name}</p>
                          <div className="mb-2">
                             <p className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-tighter truncate">
                               位置编码：{b.code}
                             </p>
                          </div>
                          
                          <div className="mt-auto flex items-center gap-2">
                             {!b.isMarked ? (
                               <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-50 text-gray-400 rounded-md text-[8px] font-black uppercase tracking-widest border border-gray-100">
                                 未标注
                               </span>
                             ) : (
                               <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md text-[8px] font-black uppercase tracking-widest border border-emerald-100">
                                 已标注
                               </span>
                             )}
                          </div>
                        </div>
                      </button>
                    ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar Pagination */}
          <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-100 flex flex-col gap-3 shrink-0">
            <div className="flex items-center justify-between font-sans">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                第 {sidebarPage} 页 / 共 {Math.ceil(getFilteredItems().length / pageSize)} 页
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
                {Array.from({ length: Math.min(3, Math.ceil(getFilteredItems().length / pageSize)) }, (_, i) => {
                  const totalPages = Math.ceil(getFilteredItems().length / pageSize);
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
                disabled={sidebarPage >= Math.ceil(getFilteredItems().length / pageSize)}
                onClick={() => setSidebarPage(prev => Math.min(Math.ceil(getFilteredItems().length / pageSize), prev + 1))}
                className="px-2 py-1.5 flex items-center justify-center rounded-lg bg-white border border-gray-100 text-[10px] font-black text-gray-400 disabled:opacity-30 enabled:hover:bg-blue-50 enabled:hover:text-blue-600 transition-all shadow-sm"
              >
                下一页
              </button>
            </div>
          </div>
        </div>

        {/* Right Map Area */}
        <div className="flex-1 relative bg-white rounded-3xl border border-gray-100 shadow-xl shadow-blue-900/5 overflow-hidden">
          <div ref={mapContainer} className="w-full h-full" />
          
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
        </div>
      </div>

      {/* New Map Info Modal */}
      {isNewMapModalOpen && createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-8 bg-gray-900/60 backdrop-blur-md">
           <motion.div 
             initial={{ opacity: 0, scale: 0.9, y: 30 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             className="bg-white w-full max-w-xl max-h-[80vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
           >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                    <Plus size={24} />
                  </div>
                  <h2 className="text-xl font-black text-gray-900">新增标注</h2>
                </div>
                <button onClick={() => setIsNewMapModalOpen(false)} className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 flex-1 overflow-y-auto space-y-6 no-scrollbar bg-gray-50/20">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-1">所属校区</label>
                  <input 
                    type="text" 
                    readOnly 
                    disabled 
                    value={selectedCampus}
                    className="w-full px-6 py-4 bg-gray-100/50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-500 outline-none transition-all font-sans cursor-not-allowed"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-1">类型</label>
                  <div className="flex gap-4">
                    {[
                      { id: 'point', label: '点坐标' },
                      { id: 'layer', label: '地理图层' }
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={() => setNewMapForm({...newMapForm, type: t.id})}
                        className={`flex-1 py-4 rounded-2xl border-2 transition-all font-black uppercase text-xs tracking-widest ${
                          newMapForm.type === t.id 
                            ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-100' 
                            : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-1">
                    {newMapForm.type === 'point' ? '位置编码' : '图层编码'}
                  </label>
                  <input 
                    type="text" 
                    placeholder="请输入编码..." 
                    className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:border-blue-600 transition-all font-sans"
                    value={newMapForm.code}
                    onChange={e => setNewMapForm({...newMapForm, code: e.target.value})}
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-1">名称</label>
                  <input 
                    type="text" 
                    placeholder="请输入管理名称..." 
                    className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:border-blue-600 transition-all font-sans"
                    value={newMapForm.name}
                    onChange={e => setNewMapForm({...newMapForm, name: e.target.value})}
                  />
                </div>

                {newMapForm.type === 'point' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-1">位置类型</label>
                        <select 
                          className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:border-blue-600 transition-all font-sans appearance-none"
                          value={newMapForm.locationCategory}
                          onChange={e => {
                            const cat = e.target.value;
                            setNewMapForm({
                              ...newMapForm,
                              locationCategory: cat,
                              usePurpose: cat ? (LOCATION_TYPES[cat as keyof typeof LOCATION_TYPES]?.[0] || '') : ''
                            });
                          }}
                        >
                          <option value="">请选择一类...</option>
                          {Object.keys(LOCATION_TYPES).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-4">
                        <div className="h-[15px]" />
                        <select 
                          disabled={!newMapForm.locationCategory}
                          className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:border-blue-600 transition-all font-sans appearance-none disabled:opacity-55"
                          value={newMapForm.usePurpose}
                          onChange={e => setNewMapForm({...newMapForm, usePurpose: e.target.value})}
                        >
                          <option value="">请选择具体类型...</option>
                          {newMapForm.locationCategory && LOCATION_TYPES[newMapForm.locationCategory as keyof typeof LOCATION_TYPES]?.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-1">编码牌类型</label>
                      <select 
                        className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:border-blue-600 transition-all font-sans appearance-none"
                        value={newMapForm.tagType}
                        onChange={e => setNewMapForm({...newMapForm, tagType: e.target.value})}
                      >
                        <option value="">不设置编码牌</option>
                        <option value="建筑外墙牌">建筑外墙牌</option>
                        <option value="楼道信息牌">楼道信息牌</option>
                        <option value="房间门牌">房间门牌</option>
                        <option value="园林植物挂牌">园林植物挂牌</option>
                        <option value="园林植物立牌">园林植物立牌</option>
                        <option value="标签贴纸">标签贴纸</option>
                        <option value="硅胶手环">硅胶手环</option>
                        <option value="大厅导览立牌">大厅导览立牌</option>
                        <option value="桌面立牌">桌面立牌</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-3xl">
                      <div className="space-y-1">
                        <p className="text-sm font-black text-gray-900">是否需要构建街景</p>
                      </div>
                      <button 
                        onClick={() => setNewMapForm({...newMapForm, need3D: !newMapForm.need3D})}
                        className={`w-14 h-7 rounded-full transition-all relative ${newMapForm.need3D ? 'bg-blue-600 shadow-lg shadow-blue-100' : 'bg-gray-200'}`}
                      >
                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${newMapForm.need3D ? 'left-8' : 'left-1'}`} />
                      </button>
                    </div>
                  </>
                )}

                {newMapForm.type === 'point' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between ml-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">图片展示 (最多9张)</label>
                      <span className="text-[10px] font-bold text-gray-300">{newMapForm.images.length}/9</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {newMapForm.images.map((img, index) => (
                        <div key={index} className="aspect-square bg-gray-100 rounded-2xl relative group overflow-hidden">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          <button 
                            onClick={() => setNewMapForm({...newMapForm, images: newMapForm.images.filter((_, i) => i !== index)})}
                            className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                      {newMapForm.images.length < 9 && (
                        <button className="aspect-square bg-white border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-300 hover:border-blue-400 hover:text-blue-400 transition-all">
                          <Plus size={24} />
                          <span className="text-[10px] font-black uppercase tracking-wider">上传图片</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block ml-1">描述（可选）</label>
                  <textarea 
                    placeholder="请输入描述信息..." 
                    className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:border-blue-600 transition-all min-h-[100px] resize-none font-sans"
                    value={newMapForm.description}
                    onChange={e => setNewMapForm({...newMapForm, description: e.target.value})}
                  />
                </div>
              </div>

              <div className="p-8 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-4 shrink-0">
                <button onClick={() => setIsNewMapModalOpen(false)} className="px-10 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-all font-sans">取消</button>
                <button onClick={handleSaveNewLocation} className="px-12 py-3 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all font-sans">保存</button>
              </div>
           </motion.div>
        </div>,
        document.body
      )}

      {/* Unmarked Positions Modal */}
      {isUnmarkedModalOpen && createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-8 bg-gray-900/60 backdrop-blur-md">
           <motion.div 
             initial={{ opacity: 0, scale: 0.9, y: 30 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             className="bg-white w-full max-w-5xl h-[85vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col font-sans"
           >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                    <Scan size={28} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900">未标注位置列表</h2>
                  </div>
                </div>
                <button onClick={() => setIsUnmarkedModalOpen(false)} className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all">
                  <X size={24} />
                </button>
              </div>

              {/* Statistics Section */}
              <div className="p-8 grid grid-cols-4 gap-6 bg-gray-50/30">
                {[
                  { label: '未标注总数', value: (locationsList.filter(l => !l.isMarked).length + LAYERS.filter(l => !l.isMarked).length + BUILDINGS_3D.filter(b => !b.isMarked).length), color: 'text-gray-900', bg: 'bg-white' },
                  { label: '位置未标注', value: locationsList.filter(l => !l.isMarked).length, color: 'text-blue-600', bg: 'bg-blue-50/50' },
                  { label: '地理图层未标注', value: LAYERS.filter(l => !l.isMarked).length, color: 'text-emerald-600', bg: 'bg-emerald-50/50' },
                  { label: '3D未建模', value: BUILDINGS_3D.filter(b => !b.isMarked).length, color: 'text-violet-600', bg: 'bg-violet-50/50' }
                ].map((stat, i) => (
                  <div key={i} className={`p-6 rounded-[32px] border border-gray-100 shadow-sm ${stat.bg} flex flex-col gap-1`}>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                    <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Modal Search Filters */}
              <div className="px-8 py-6 border-y border-gray-50 flex items-center gap-6">
                <div className="flex-[2] space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">位置编码</label>
                  <div className="relative">
                    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input 
                      type="text" 
                      placeholder="搜索编码..." 
                      value={unmarkedSearch.code}
                      onChange={e => { setUnmarkedSearch(prev => ({...prev, code: e.target.value})); setUnmarkedPage(1); }}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-2xl text-xs font-bold outline-none border border-transparent focus:border-blue-600 focus:bg-white transition-all font-sans" 
                    />
                  </div>
                </div>
                <div className="flex-[2] space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">位置名称</label>
                  <div className="relative">
                    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input 
                      type="text" 
                      placeholder="搜索名称..." 
                      value={unmarkedSearch.name}
                      onChange={e => { setUnmarkedSearch(prev => ({...prev, name: e.target.value})); setUnmarkedPage(1); }}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-2xl text-xs font-bold outline-none border border-transparent focus:border-blue-600 focus:bg-white transition-all font-sans" 
                    />
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">类型</label>
                  <select 
                    className="w-full px-6 py-3 bg-gray-50 border border-transparent rounded-2xl text-xs font-bold outline-none focus:border-blue-600 focus:bg-white transition-all font-sans appearance-none"
                    value={unmarkedSearch.type}
                    onChange={e => { setUnmarkedSearch(prev => ({...prev, type: e.target.value})); setUnmarkedPage(1); }}
                  >
                    <option value="">全部类型</option>
                    <option value="位置">位置</option>
                    <option value="地理图层">地理图层</option>
                    <option value="3D">3D</option>
                  </select>
                </div>
                <div className="flex items-end h-full pt-6 gap-3">
                  <button className="px-8 py-3 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all font-sans shadow-lg shadow-blue-100">
                    查询
                  </button>
                  <button 
                    onClick={() => { setUnmarkedSearch({ code: '', name: '', type: '' }); setUnmarkedPage(1); }}
                    className="px-8 py-3 bg-gray-100 text-gray-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-200 hover:text-gray-900 transition-all font-sans"
                  >
                    重置
                  </button>
                </div>
              </div>

              {/* Modal Table Content */}
              <div className="flex-1 overflow-y-auto p-8 no-scrollbar bg-gray-50/10">
                <div className="border border-gray-100 rounded-[32px] overflow-hidden bg-white shadow-sm">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50/50 border-b border-gray-50">
                      <tr>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">位置编码</th>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">位置名称</th>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">类型</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {(() => {
                        const allUnmarked = [
                          ...locationsList.filter(l => !l.isMarked).map(i => ({ code: i.code, name: i.name, type: '位置', color: 'bg-blue-50 text-blue-600 border-blue-100' })),
                          ...LAYERS.filter(l => !l.isMarked).map(i => ({ code: i.code, name: i.name, type: '地理图层', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' })),
                          ...BUILDINGS_3D.filter(b => !b.isMarked).map(i => ({ code: i.code, name: i.name, type: '3D', color: 'bg-violet-50 text-violet-600 border-violet-100' }))
                        ].filter(i => 
                          i.code.includes(unmarkedSearch.code) && 
                          i.name.includes(unmarkedSearch.name) &&
                          (unmarkedSearch.type === '' || i.type === unmarkedSearch.type)
                        );

                        return allUnmarked.slice((unmarkedPage - 1) * unmarkedPageSize, unmarkedPage * unmarkedPageSize).map((item, idx) => (
                          <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-8 py-5 text-[11px] font-mono font-bold text-gray-600">{item.code}</td>
                            <td className="px-8 py-5 text-xs font-black text-gray-900">{item.name}</td>
                            <td className="px-8 py-5">
                              <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${item.color}`}>
                                {item.type}
                              </span>
                            </td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Modal Pagination */}
              <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    显示 {Math.min((unmarkedPage - 1) * unmarkedPageSize + 1, (locationsList.filter(l => !l.isMarked).length + LAYERS.filter(l => !l.isMarked).length + BUILDINGS_3D.filter(b => !b.isMarked).length))} 到 {Math.min(unmarkedPage * unmarkedPageSize, (locationsList.filter(l => !l.isMarked).length + LAYERS.filter(l => !l.isMarked).length + BUILDINGS_3D.filter(b => !b.isMarked).length))} 条，共 {(locationsList.filter(l => !l.isMarked).length + LAYERS.filter(l => !l.isMarked).length + BUILDINGS_3D.filter(b => !b.isMarked).length)} 条
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    disabled={unmarkedPage === 1}
                    onClick={() => setUnmarkedPage(prev => prev - 1)}
                    className="px-6 py-2.5 bg-white border border-gray-100 text-gray-500 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30 enabled:hover:bg-blue-600 enabled:hover:text-white transition-all shadow-sm font-sans"
                  >
                    上一页
                  </button>
                  <div className="flex items-center">
                    {Array.from({ length: Math.ceil((locationsList.filter(l => !l.isMarked).length + LAYERS.filter(l => !l.isMarked).length + BUILDINGS_3D.filter(b => !b.isMarked).length) / unmarkedPageSize) }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        onClick={() => setUnmarkedPage(p)}
                        className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${unmarkedPage === p ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-gray-400 hover:text-blue-600'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <button 
                    disabled={unmarkedPage >= Math.ceil((locationsList.filter(l => !l.isMarked).length + LAYERS.filter(l => !l.isMarked).length + BUILDINGS_3D.filter(b => !b.isMarked).length) / unmarkedPageSize)}
                    onClick={() => setUnmarkedPage(prev => prev + 1)}
                    className="px-8 py-2.5 bg-white border border-gray-100 text-gray-500 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30 enabled:hover:bg-blue-600 enabled:hover:text-white transition-all shadow-sm font-sans"
                  >
                    下一页
                  </button>
                </div>
              </div>
           </motion.div>
        </div>,
        document.body
      )}

      {/* Location List Query Modal */}
      {isListQueryModalOpen && createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-8 bg-gray-900/60 backdrop-blur-md">
           <motion.div 
             initial={{ opacity: 0, scale: 0.9, y: 30 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             className="bg-white w-full max-w-5xl h-[85vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col font-sans"
           >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                    <Search size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900">地图位置与图层列表查询</h2>
                    <p className="text-xs text-gray-400 mt-0.5">支持对系统中的所有点坐标、地理图层与3D建模等实体进行统一的高级表格查询与定位定位</p>
                  </div>
                </div>
                <button onClick={() => setIsListQueryModalOpen(false)} className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all">
                  <X size={24} />
                </button>
              </div>

              {/* Modal Search Filters */}
              <div className="px-8 py-6 border-b border-gray-50 flex items-center gap-4 shrink-0 bg-gray-50/20">
                <div className="flex-1 space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">编码</label>
                  <div className="relative">
                    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input 
                      type="text" 
                      placeholder="模糊搜索编码..." 
                      value={listQuerySearch.code}
                      onChange={e => { setListQuerySearch(prev => ({...prev, code: e.target.value})); setListQueryPage(1); }}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold outline-none focus:border-blue-600 transition-all font-sans" 
                    />
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">名称</label>
                  <div className="relative">
                    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input 
                      type="text" 
                      placeholder="模糊搜索名称..." 
                      value={listQuerySearch.name}
                      onChange={e => { setListQuerySearch(prev => ({...prev, name: e.target.value})); setListQueryPage(1); }}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold outline-none focus:border-blue-600 transition-all font-sans" 
                    />
                  </div>
                </div>
                <div className="w-48 space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">数据类型</label>
                  <select 
                    className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold outline-none focus:border-blue-600 transition-all font-sans appearance-none"
                    value={listQuerySearch.type}
                    onChange={e => { setListQuerySearch(prev => ({...prev, type: e.target.value})); setListQueryPage(1); }}
                  >
                    <option value="">全部数据 (位置/地理图层/3D)</option>
                    <option value="位置">位置</option>
                    <option value="地理图层">地理图层</option>
                    <option value="3D">3D</option>
                  </select>
                </div>
                <div className="w-40 space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">标注状态</label>
                  <select 
                    className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold outline-none focus:border-blue-600 transition-all font-sans appearance-none"
                    value={listQuerySearch.isMarked}
                    onChange={e => { setListQuerySearch(prev => ({...prev, isMarked: e.target.value})); setListQueryPage(1); }}
                  >
                    <option value="">全部状态</option>
                    <option value="marked">已标注</option>
                    <option value="unmarked">未标注</option>
                  </select>
                </div>
                <div className="flex items-end h-full pt-6 gap-2">
                  <button 
                    onClick={() => { setListQuerySearch({ code: '', name: '', type: '', isMarked: '' }); setListQueryPage(1); }}
                    className="px-6 py-3 bg-gray-100 text-gray-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-all font-sans border border-gray-200/50"
                  >
                    重置
                  </button>
                </div>
              </div>

              {/* Modal Table Content */}
              <div className="flex-1 overflow-y-auto p-8 no-scrollbar bg-gray-50/10">
                <div className="border border-gray-100 rounded-[32px] overflow-hidden bg-white shadow-sm flex flex-col">
                  <table className="w-full text-left font-sans">
                    <thead className="bg-gray-50/50 border-b border-gray-50">
                      <tr>
                        <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">编码</th>
                        <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">实体名称</th>
                        <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">实体分类</th>
                        <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">标注状态</th>
                        <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right border-b border-gray-100 font-sans">地图操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {(() => {
                        const allData = [
                          ...locationsList.map(i => ({ id: i.id, code: i.code, name: i.name, type: '位置', color: 'bg-blue-50 text-blue-600 border-blue-100', isMarked: i.isMarked, lat: i.lat, lng: i.lng })),
                          ...LAYERS.map(i => ({ id: i.id, code: i.code, name: i.name, type: '地理图层', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', isMarked: i.isMarked, lat: 24.6074, lng: 118.0831 })),
                          ...BUILDINGS_3D.map(i => ({ id: i.id, code: i.code, name: i.name, type: '3D', color: 'bg-violet-50 text-violet-600 border-violet-100', isMarked: i.isMarked, lat: i.lat, lng: i.lng }))
                        ].filter(i => {
                          const matchesCode = i.code.includes(listQuerySearch.code);
                          const matchesName = i.name.includes(listQuerySearch.name);
                          const matchesType = listQuerySearch.type === '' || i.type === listQuerySearch.type;
                          const matchesMarked = listQuerySearch.isMarked === '' || 
                            (listQuerySearch.isMarked === 'marked' && i.isMarked) || 
                            (listQuerySearch.isMarked === 'unmarked' && !i.isMarked);
                          return matchesCode && matchesName && matchesType && matchesMarked;
                        });

                        const paginated = allData.slice((listQueryPage - 1) * listQueryPageSize, listQueryPage * listQueryPageSize);

                        if (paginated.length === 0) {
                          return (
                            <tr>
                              <td colSpan={5} className="text-center py-12 text-gray-400 text-xs font-semibold">
                                没有找到匹配的数据记录
                              </td>
                            </tr>
                          );
                        }

                        return paginated.map((item, idx) => (
                          <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                            <td className="px-8 py-4 text-xs font-mono font-bold text-gray-500">{item.code}</td>
                            <td className="px-8 py-4 text-xs font-extrabold text-gray-900">{item.name}</td>
                            <td className="px-8 py-4">
                              <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${item.color}`}>
                                {item.type}
                              </span>
                            </td>
                            <td className="px-8 py-4">
                              {item.isMarked ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  已标注
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                  未标注
                                </span>
                              )}
                            </td>
                            <td className="px-8 py-4 text-right">
                              <button 
                                onClick={() => {
                                  panTo(item.lat, item.lng);
                                  setIsListQueryModalOpen(false);
                                  showToast(`已成功在地图中为您定位到: ${item.name}`);
                                }}
                                className="px-4 py-1.5 bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                              >
                                定位标注
                              </button>
                            </td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Modal Pagination */}
              <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between shrink-0 font-sans">
                {(() => {
                  const allDataCount = [
                    ...locationsList,
                    ...LAYERS,
                    ...BUILDINGS_3D
                  ].filter(i => {
                    const matchesCode = i.code.includes(listQuerySearch.code);
                    const matchesName = i.name.includes(listQuerySearch.name);
                    const matchesType = listQuerySearch.type === '' || (i.type === listQuerySearch.type || (listQuerySearch.type === '地理图层' && LAYERS.some(l => l.id === i.id)));
                    const matchesMarked = listQuerySearch.isMarked === '' || 
                      (listQuerySearch.isMarked === 'marked' && i.isMarked) || 
                      (listQuerySearch.isMarked === 'unmarked' && !i.isMarked);
                    const actualType = locationsList.some(l => l.id === i.id) ? '位置' : LAYERS.some(l => l.id === i.id) ? '地理图层' : '3D';
                    const matchesRealType = listQuerySearch.type === '' || actualType === listQuerySearch.type;
                    return matchesCode && matchesName && matchesRealType && matchesMarked;
                  }).length;

                  const totalPages = Math.max(1, Math.ceil(allDataCount / listQueryPageSize));

                  return (
                    <>
                      <div className="flex items-center gap-4">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          显示 {(listQueryPage - 1) * listQueryPageSize + 1} 到 {Math.min(listQueryPage * listQueryPageSize, allDataCount)} 条，共 {allDataCount} 条记录
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          disabled={listQueryPage === 1}
                          onClick={() => setListQueryPage(prev => Math.max(1, prev - 1))}
                          className="px-6 py-2.5 bg-white border border-gray-100 text-gray-500 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30 enabled:hover:bg-blue-600 enabled:hover:text-white transition-all shadow-sm font-sans"
                        >
                          上一页
                        </button>
                        <div className="flex items-center">
                          {Array.from({ length: totalPages }).map((_, i) => i + 1).filter(p => Math.abs(p - listQueryPage) <= 2 || p === 1 || p === totalPages).map((p, pIdx, arr) => {
                            const showEllipsis = pIdx > 0 && p - arr[pIdx - 1] > 1;
                            return (
                              <React.Fragment key={p}>
                                {showEllipsis && <span className="px-2 text-gray-400 text-xs font-bold font-sans">...</span>}
                                <button
                                  onClick={() => setListQueryPage(p)}
                                  className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${listQueryPage === p ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-gray-400 hover:text-blue-600'}`}
                                >
                                  {p}
                                </button>
                              </React.Fragment>
                            );
                          })}
                        </div>
                        <button 
                          disabled={listQueryPage >= totalPages}
                          onClick={() => setListQueryPage(prev => Math.min(totalPages, prev + 1))}
                          className="px-8 py-2.5 bg-white border border-gray-100 text-gray-500 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30 enabled:hover:bg-blue-600 enabled:hover:text-white transition-all shadow-sm font-sans"
                        >
                          下一页
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
           </motion.div>
        </div>,
        document.body
      )}

      {toastMsg && (
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-8 right-8 z-[20000] bg-slate-900 border border-slate-800 text-white rounded-3xl py-4.5 px-6 shadow-2xl flex items-center gap-3 w-85 shadow-black/30 text-left"
        >
          <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
            <span className="text-blue-400 font-extrabold text-sm font-mono">!</span>
          </div>
          <p className="text-xs font-black text-slate-100 mt-0.5 whitespace-normal break-words leading-tight">{toastMsg}</p>
        </motion.div>
      )}
    </div>
  );
}

function Minus({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}
