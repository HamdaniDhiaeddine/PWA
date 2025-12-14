import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
interface FloatingActionButtonProps {
  onClick: () => void;
  icon?: React.ElementType;
  label?: string;
}
export function FloatingActionButton({
  onClick,
  icon: Icon = Plus,
  label
}: FloatingActionButtonProps) {
  return <motion.button onClick={onClick} whileHover={{
    scale: 1.05
  }} whileTap={{
    scale: 0.95
  }} className="fixed bottom-24 right-6 bg-emerald text-white p-4 rounded-full shadow-lg shadow-emerald/30 z-40 flex items-center justify-center gap-2" aria-label={label || 'Add new'}>
      <Icon size={24} strokeWidth={2.5} />
      {label && <span className="font-medium pr-1">{label}</span>}
    </motion.button>;
}