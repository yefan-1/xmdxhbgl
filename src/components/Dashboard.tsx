import React from 'react';
import { motion } from 'motion/react';
import { Construction } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="h-full w-full" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-8 z-10"
      >
        <div className="w-32 h-32 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-blue-100 rotate-3">
          <Construction size={64} className="text-blue-600 animate-pulse" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl font-black text-gray-900 tracking-tight">
            首页功能正在建设中
          </h1>
          <p className="text-xl text-gray-400 font-medium max-w-lg mx-auto leading-relaxed">
            我们正在为您打造全新的数字化物联工作看板，更多精彩特性即将上线，敬请期待。
          </p>
        </div>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-purple-400/5 rounded-full blur-3xl animate-blob animation-delay-2000" />
    </div>
  );
}
