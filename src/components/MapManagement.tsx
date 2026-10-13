import React, { useState, useEffect, useRef } from 'react';
import { 
  Map as MapIcon, 
  Search, 
  Navigation,
  Plus,
  Minus,
  ZoomIn,
  ZoomOut,
  Layers,
  MapPin,
  Building2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

declare global {
  interface Window {
    qq: any;
  }
}

const LOCATIONS = [
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `p${i + 1}`,
    name: ['行政研发大楼', '田径运动场', '郑年锦图书馆', '学生宿舍区', '实验室', '科技楼', '文学院', '化学院', '数学馆', '体育馆', '学生中心', '艺术楼', '国际社区', '信息塔', '后勤中枢'][i] || `地理点 - ${i + 1}`,
    type: 'point' as const,
    code: `MAP-${(100 + i)}`,
    lat: 24.6074 + (i * 0.0005),
    lng: 118.0831 + (i * 0.0008),
    isMarked: i % 4 !== 0
  })),
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `r${i + 1}`,
    name: ['教学区', '休息区', '绿化带', '湖滨公园', '停车场', '交通枢纽', '文化广场', '商业街', '居民区', '工业园', '农业试验田', '林区', '水库区', '景观核心', '边界隔离'][i] || `区域图层 - ${i + 1}`,
    type: 'region' as const,
    code: `REG-${(300 + i)}`,
    lat: 24.6054 + (i * 0.0007),
    lng: 118.0811 + (i * 0.0006),
    isMarked: i % 5 === 0
  }))
];

export default function MapManagement() {
  const [activeTab, setActiveTab] = useState<'point' | 'region'>('point');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarPage, setSidebarPage] = useState(1);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const pageSize = 6;

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

          LOCATIONS.forEach(loc => {
            const pos = new window.qq.maps.LatLng(loc.lat, loc.lng);
            const marker = new window.qq.maps.Marker({
              position: pos,
              map: mapInstance.current,
              title: loc.name
            });

            window.qq.maps.event.addListener(marker, 'click', () => {
              handleItemClick(loc);
            });
          });
        } catch (e) {
          console.error('Error initializing map:', e);
        }
      }
    }
  }, []);

  const filteredItems = LOCATIONS.filter(item => {
    const matchesTab = (activeTab === 'point' && item.type === 'point') || (activeTab === 'region' && item.type === 'region');
    const matchesSearch = item.name.includes(searchQuery);
    return matchesTab && matchesSearch;
  });

  const totalPages = Math.ceil(filteredItems.length / pageSize);
  const paginatedItems = filteredItems.slice((sidebarPage - 1) * pageSize, sidebarPage * pageSize);

  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    if (mapInstance.current) {
      mapInstance.current.panTo(new window.qq.maps.LatLng(item.lat, item.lng));
      mapInstance.current.setZoom(17);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#F8FAFC]">
      <div className="flex-1 flex overflow-hidden p-6 gap-6">
        {/* Left Sidebar */}
        <div className="w-80 bg-white rounded-3xl border border-gray-100 flex flex-col shadow-xl shadow-blue-900/5 overflow-hidden">
          <div className="p-0 bg-white">
            <div className="flex p-2 bg-gray-50 mx-4 my-4 rounded-2xl">
              {[
                { id: 'point', label: '地理点', icon: <MapPin size={14} /> },
                { id: 'region', label: '功能面', icon: <Layers size={14} /> }
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
                  placeholder={`搜索${activeTab === 'point' ? '地理点' : '图层'}...`}
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setSidebarPage(1); }}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar bg-gray-50/10">
            {paginatedItems.map(item => (
              <button 
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`w-full group flex items-start gap-4 p-4 rounded-3xl border transition-all text-left relative overflow-hidden ${
                  selectedItem?.id === item.id 
                    ? 'border-blue-600 bg-blue-50/30' 
                    : 'border-gray-100 bg-white hover:border-blue-200 hover:shadow-xl'
                }`}
              >
                <div className="relative shrink-0">
                  <div className="w-16 h-20 rounded-2xl overflow-hidden group-hover:scale-105 transition-transform">
                    <img 
                      src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=200"
                      className="w-full h-full object-cover"
                      alt={item.name}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {/* NOTE: No Type Label on top of image as requested */}
                </div>
                <div className="flex-1 py-1 flex flex-col h-full min-w-0">
                  <p className={`text-sm font-black mb-1 leading-tight truncate ${selectedItem?.id === item.id ? 'text-blue-600' : 'text-gray-900'}`}>
                    {item.name}
                  </p>
                  <div className="space-y-1">
                    <p className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-tighter">
                      位置编码：{item.code}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-tighter border shadow-sm ${
                      item.isMarked 
                        ? 'bg-emerald-500 text-white border-emerald-400' 
                        : 'bg-amber-500 text-white border-amber-400'
                    }`}>
                      {item.isMarked ? '已标注' : '未标注'}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-100 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  第 {sidebarPage} 页 / 共 {totalPages || 1} 页
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
                  {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
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
                  onClick={() => setSidebarPage(prev => prev + 1)}
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
    </div>
  );
}
