import React from 'react';
import { motion } from 'framer-motion';
import { Download, Moon, Shield, Info, ChevronRight, LogOut, Check } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { BotanicalPattern } from '../components/BotanicalPattern';
import { usePWAInstall } from '../utils/pwaInstall';
export function Settings() {
  const {
    isInstallable,
    isInstalled,
    handleInstall
  } = usePWAInstall();
  const handleInstallClick = async () => {
    if (isInstalled) {
      alert('App is already installed!');
      return;
    }
    if (!isInstallable) {
      alert('Install is not available. Try opening this app in a supported browser.');
      return;
    }
    const success = await handleInstall();
    if (success) {
      alert('App installed successfully!');
    }
  };
  const settingsGroups = [{
    title: 'App Settings',
    items: [{
      icon: Moon,
      label: 'Dark Mode',
      type: 'toggle',
      value: false
    }, {
      icon: isInstalled ? Check : Download,
      label: isInstalled ? 'App Installed' : 'Install App',
      type: 'button',
      action: handleInstallClick,
      disabled: isInstalled
    }]
  }, {
    title: 'Support',
    items: [{
      icon: Shield,
      label: 'Privacy Policy',
      type: 'link'
    }, {
      icon: Info,
      label: 'About AnimalCare',
      type: 'link',
      value: 'v1.0.0'
    }]
  }];
  return <div className="min-h-screen bg-cream pb-24 relative">
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]">
        <BotanicalPattern />
      </div>

      <header className="pt-12 pb-6 px-6 md:px-12 max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-forest">
          Settings
        </h1>
      </header>

      <main className="px-6 md:px-12 max-w-7xl mx-auto space-y-8">
        {settingsGroups.map((group, groupIndex) => <motion.div key={group.title} initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: groupIndex * 0.1
      }}>
            <h2 className="text-sm font-bold text-sage uppercase tracking-wider mb-4 ml-2">
              {group.title}
            </h2>
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-emerald-100">
              {group.items.map((item, index) => <div key={item.label} onClick={item.type === 'button' && !item.disabled ? item.action : undefined} className={`flex items-center justify-between p-5 ${index !== group.items.length - 1 ? 'border-b border-emerald-50' : ''} ${item.type === 'button' && !item.disabled ? 'cursor-pointer hover:bg-emerald-50/50 transition-colors' : item.type === 'link' ? 'cursor-pointer hover:bg-emerald-50/50 transition-colors' : ''} ${item.disabled ? 'opacity-60' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className={`bg-cream p-2.5 rounded-xl ${item.disabled ? 'text-sage' : 'text-emerald'}`}>
                      <item.icon size={20} />
                    </div>
                    <span className="font-medium text-forest">
                      {item.label}
                    </span>
                  </div>

                  {item.type === 'toggle' && <div className="w-12 h-6 bg-emerald-100 rounded-full relative cursor-pointer">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                    </div>}

                  {item.type === 'link' && <div className="flex items-center gap-2">
                      {item.value && <span className="text-sm text-sage">{item.value}</span>}
                      <ChevronRight size={18} className="text-sage" />
                    </div>}

                  {item.type === 'button' && !item.disabled && <ChevronRight size={18} className="text-sage" />}
                </div>)}
            </div>
          </motion.div>)}

        <motion.button initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 0.4
      }} className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors mt-8">
          <LogOut size={20} />
          Sign Out
        </motion.button>
      </main>

      <BottomNav />
    </div>;
}