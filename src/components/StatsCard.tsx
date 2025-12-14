import React from 'react';
import { motion } from 'framer-motion';
import { BotanicalPattern } from './BotanicalPattern';
import { BoxIcon } from 'lucide-react';
interface StatsCardProps {
  label: string;
  value: string;
  icon: BoxIcon;
  delay?: number;
}
export function StatsCard({
  label,
  value,
  icon: Icon,
  delay = 0
}: StatsCardProps) {
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5,
    delay
  }} className="relative overflow-hidden bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      <BotanicalPattern opacity={0.03} color="#2D5F3F" />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-sage font-sans text-sm font-medium uppercase tracking-wider mb-1">
            {label}
          </p>
          <h3 className="text-3xl font-serif font-bold text-emerald">
            {value}
          </h3>
        </div>
        <div className="bg-emerald-50 p-3 rounded-full text-emerald">
          <Icon size={24} />
        </div>
      </div>

      {/* Decorative leaf accent */}
      <div className="absolute -bottom-4 -right-4 text-emerald-50 transform rotate-12">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C7.5 2 4 6.5 4 12s4.5 9 8 9 7-4.5 7-9-3.5-9-7-9z" />
        </svg>
      </div>
    </motion.div>;
}