import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, PawPrint, Heart, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = [{
    id: 'home',
    icon: Leaf,
    label: 'Home',
    path: '/dashboard'
  }, {
    id: 'pets',
    icon: PawPrint,
    label: 'Pets',
    path: '/animals'
  }, {
    id: 'care',
    icon: Heart,
    label: 'Care',
    path: '/care/add'
  }, {
    id: 'profile',
    icon: User,
    label: 'Profile',
    path: '/settings'
  }];
  // Determine active tab based on current path
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'home';
    if (path.includes('/animals')) return 'pets';
    if (path.includes('/care')) return 'care';
    if (path.includes('/settings')) return 'profile';
    return 'home';
  };
  const activeTab = getActiveTab();
  return <div className="fixed bottom-0 left-0 right-0 bg-cream/95 backdrop-blur-md border-t border-emerald-100 pb-safe z-50">
      <div className="max-w-md mx-auto px-6 h-20 flex items-center justify-between">
        {navItems.map(item => {
        const isActive = activeTab === item.id;
        const Icon = item.icon;
        return <button key={item.id} onClick={() => navigate(item.path)} className="relative flex flex-col items-center justify-center w-16 h-16" aria-label={item.label}>
              {isActive && <motion.div layoutId="nav-bg" className="absolute inset-0 bg-emerald-100/50 rounded-2xl -z-10" initial={false} transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30
          }} />}

              <motion.div whileTap={{
            scale: 1.2,
            rotate: 5
          }} animate={{
            color: isActive ? '#2D5F3F' : '#8BA888',
            scale: isActive ? 1.1 : 1
          }} transition={{
            duration: 0.2
          }}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} fill={isActive ? 'currentColor' : 'none'} fillOpacity={0.2} />
              </motion.div>

              <motion.span animate={{
            opacity: isActive ? 1 : 0,
            y: isActive ? 0 : 4
          }} className="text-[10px] font-bold mt-1 text-emerald">
                {item.label}
              </motion.span>
            </button>;
      })}
      </div>
    </div>;
}