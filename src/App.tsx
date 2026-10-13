import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import MobileInspectionApp from './components/inspection/MobileInspectionApp';
import PublicExhibitionApp from './components/exhibition/PublicExhibitionApp';
import Layout from './components/Layout';

import AdminDashboardOverview from './components/admin/AdminDashboardOverview';
import PublicSettingsModule from './components/admin/PublicSettingsModule';
import PosterManagementModule from './components/admin/PosterManagementModule';
import PosterApprovalLeagueModule from './components/admin/PosterApprovalLeagueModule';
import GraffitiManagementModule from './components/admin/GraffitiManagementModule';
import GraffitiLibraryModule from './components/admin/GraffitiLibraryModule';
import TunnelAreaApprovalModule from './components/admin/TunnelAreaApprovalModule';
import TunnelContentApprovalModule from './components/admin/TunnelContentApprovalModule';

import { 
  LayoutDashboard, 
  FilePlus, 
  MapPin, 
  Paintbrush, 
  Monitor, 
  Glasses, 
  SearchCheck, 
  Siren, 
  ClipboardList, 
  BellRing, 
  UserCog, 
  FileCheck2, 
  QrCode, 
  Stamp, 
  CheckCircle2, 
  LayoutGrid, 
  FolderArchive, 
  Building2, 
  BarChart3, 
  Palette, 
  Library, 
  Milestone, 
  PieChart, 
  Settings, 
  Users2, 
  UserCheck, 
  Tags, 
  SlidersHorizontal 
} from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export default function App() {
  // Master Mode: 'PORTAL' | 'ADMIN' | 'INSPECTION' | 'EXHIBITION'
  const [subsystemMode, setSubsystemMode] = useState<'PORTAL' | 'ADMIN' | 'INSPECTION' | 'EXHIBITION'>('PORTAL');
  const [exhibitionTab, setExhibitionTab] = useState<'3D_TUNNEL' | 'POSTER_GALLERY'>('3D_TUNNEL');

  const handleSelectSubsystem = (mode: 'PORTAL' | 'ADMIN' | 'INSPECTION' | 'EXHIBITION', tab?: '3D_TUNNEL' | 'POSTER_GALLERY') => {
    if (tab) {
      setExhibitionTab(tab);
    }
    setSubsystemMode(mode);
  };

  // Admin Layout Tabs
  const [tabs, setTabs] = useState<Tab[]>([
    { id: 'dashboard', label: '控制台首页', icon: <LayoutDashboard size={16} /> }
  ]);
  const [activeTabId, setActiveTabId] = useState('dashboard');

  const PAGE_MAP: Record<string, { label: string; icon: React.ReactNode; component: React.ReactNode }> = {
    'dashboard': { label: '首页', icon: <LayoutDashboard size={16} />, component: <AdminDashboardOverview onNavigateTab={(id) => handleTabClick(id)} /> },

    // 一级与通用申请/审批项
    'pos-02': { label: '海报张贴申请', icon: <FilePlus size={16} />, component: <PosterManagementModule subTab="POS-02" /> },
    'gra-02': { label: '隧道涂鸦区域申请', icon: <MapPin size={16} />, component: <GraffitiManagementModule subTab="GRA-02" /> },
    'gra-06': { label: '隧道涂鸦内容报批', icon: <Paintbrush size={16} />, component: <GraffitiManagementModule subTab="GRA-06" /> },
    'pos-03': { label: '海报张贴审批', icon: <FileCheck2 size={16} />, component: <PosterManagementModule subTab="POS-03" /> },
    'pos-03-tuanwei': { label: '巡检二维码发放', icon: <QrCode size={16} />, component: <PosterApprovalLeagueModule /> },
    'gra-02-approval': { label: '隧道涂鸦区域审批', icon: <Stamp size={16} />, component: <TunnelAreaApprovalModule /> },
    'gra-06-approval': { label: '隧道涂鸦内容审批', icon: <CheckCircle2 size={16} />, component: <TunnelContentApprovalModule /> },
    'pos-10': { label: '线上海报栏', icon: <Monitor size={16} />, component: <PosterManagementModule subTab="POS-10" /> },
    'gra-15': { label: '线上芙蓉隧道', icon: <Glasses size={16} />, component: <GraffitiManagementModule subTab="GRA-15" /> },

    // 海报张贴管理子项
    'pos-09': { label: '海报库', icon: <FolderArchive size={16} />, component: <PosterManagementModule subTab="POS-09" /> },
    'pos-01': { label: '张贴栏管理', icon: <Building2 size={16} />, component: <PosterManagementModule subTab="POS-01" /> },
    'pos-11': { label: '统计分析', icon: <BarChart3 size={16} />, component: <PosterManagementModule subTab="POS-11" /> },

    // 芙蓉隧道涂鸦管理子项
    'gra-14': { label: '涂鸦作品库', icon: <Library size={16} />, component: <GraffitiLibraryModule /> },
    'gra-01': { label: '涂鸦区域管理', icon: <Milestone size={16} />, component: <GraffitiManagementModule subTab="GRA-01" /> },
    'gra-16': { label: '统计分析', icon: <PieChart size={16} />, component: <GraffitiManagementModule subTab="GRA-16" /> },

    // 巡检管理子项
    'pub-05': { label: '违规事件管理', icon: <Siren size={16} />, component: <PublicSettingsModule subTab="PUB-05" /> },
    'pub-03': { label: '巡检记录', icon: <ClipboardList size={16} />, component: <PublicSettingsModule subTab="PUB-03" /> },
    'pub-04': { label: '巡检预警', icon: <BellRing size={16} />, component: <PublicSettingsModule subTab="PUB-04" /> },
    'pub-02': { label: '巡检员管理', icon: <UserCog size={16} />, component: <PublicSettingsModule subTab="PUB-02" /> },

    // 公共设置子项
    'pub-01': { label: '组织角色设置', icon: <Users2 size={16} />, component: <PublicSettingsModule subTab="PUB-01" /> },
    'pub-08': { label: '审批角色设置', icon: <UserCheck size={16} />, component: <PublicSettingsModule subTab="PUB-08" /> },
    'pub-06': { label: '涂鸦主题管理', icon: <Tags size={16} />, component: <PublicSettingsModule subTab="PUB-06" /> },
    'pub-07': { label: '巡检规则设置', icon: <SlidersHorizontal size={16} />, component: <PublicSettingsModule subTab="PUB-07" /> },

    // 快捷兼容导航项
    'pub-settings': { label: '公共设置', icon: <Settings size={16} />, component: <PublicSettingsModule subTab="PUB-01" /> },
    'pos-mgmt': { label: '海报张贴管理', icon: <LayoutGrid size={16} />, component: <PosterManagementModule subTab="POS-01" /> },
    'gra-mgmt': { label: '芙蓉隧道涂鸦', icon: <Palette size={16} />, component: <GraffitiManagementModule subTab="GRA-01" /> },
    'pos-review': { label: '四级审批工作台', icon: <FileCheck2 size={16} />, component: <PosterManagementModule subTab="POS-03" /> },
  };

  const handleTabClick = (id: string) => {
    if (!tabs.find(t => t.id === id)) {
      const pageInfo = PAGE_MAP[id];
      if (pageInfo) {
        setTabs([...tabs, { id, label: pageInfo.label, icon: pageInfo.icon }]);
      }
    }
    setActiveTabId(id);
  };

  const handleTabClose = (id: string) => {
    if (id === 'dashboard') return;
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    if (activeTabId === id) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    }
  };

  const handleCloseOthers = (id: string) => {
    const tabToKeep = tabs.find(t => t.id === id);
    if (tabToKeep) {
      const dashboardTab = tabs.find(t => t.id === 'dashboard');
      if (dashboardTab && id !== 'dashboard') {
        setTabs([dashboardTab, tabToKeep]);
      } else {
        setTabs([tabToKeep]);
      }
      setActiveTabId(id);
    }
  };

  const handleCloseAll = () => {
    const defaultTabId = 'dashboard';
    const pageInfo = PAGE_MAP[defaultTabId];
    setTabs([{ id: defaultTabId, label: pageInfo.label, icon: pageInfo.icon }]);
    setActiveTabId(defaultTabId);
  };

  const handleMoveTab = (fromIndex: number, toIndex: number) => {
    const newTabs = [...tabs];
    const [movedTab] = newTabs.splice(fromIndex, 1);
    newTabs.splice(toIndex, 0, movedTab);
    setTabs(newTabs);
  };

  // Render Subsystems
  if (subsystemMode === 'PORTAL') {
    return <LandingPage onSelectSubsystem={handleSelectSubsystem} />;
  }

  if (subsystemMode === 'INSPECTION') {
    return <MobileInspectionApp onBackToLanding={() => setSubsystemMode('PORTAL')} />;
  }

  if (subsystemMode === 'EXHIBITION') {
    return <PublicExhibitionApp initialTab={exhibitionTab} onBackToLanding={() => setSubsystemMode('PORTAL')} />;
  }

  // Subsystem 1: Backoffice Admin System
  return (
    <div className="relative h-screen flex flex-col bg-white">
      <div className="flex-1 overflow-hidden">
        <Layout 
          tabs={tabs}
          activeTabId={activeTabId}
          onTabClick={handleTabClick}
          onTabClose={handleTabClose}
          onCloseOthers={handleCloseOthers}
          onCloseAll={handleCloseAll}
          onMoveTab={handleMoveTab}
          onBackToLanding={() => setSubsystemMode('PORTAL')}
        >
          <div className="h-full overflow-y-auto">
            {tabs.map(tab => (
              <div key={tab.id} className={activeTabId === tab.id ? 'block h-full' : 'hidden h-full'}>
                {PAGE_MAP[tab.id]?.component}
              </div>
            ))}
          </div>
        </Layout>
      </div>
    </div>
  );
}
