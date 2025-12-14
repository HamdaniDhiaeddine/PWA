import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
interface AnimalCardProps {
  name: string;
  species: string;
  image: string;
  age: string;
  delay?: number;
}
export function AnimalCard({
  name,
  species,
  image,
  age,
  delay = 0
}: AnimalCardProps) {
  return <motion.div initial={{
    opacity: 0,
    scale: 0.95
  }} animate={{
    opacity: 1,
    scale: 1
  }} whileHover={{
    y: -8,
    transition: {
      duration: 0.3
    }
  }} transition={{
    duration: 0.5,
    delay
  }} className="group relative bg-white rounded-3xl overflow-hidden shadow-lg shadow-emerald-900/5 border border-emerald-100/50">
      {/* Image Container with Organic Shape Mask */}
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-emerald-900/10 z-10 group-hover:bg-transparent transition-colors duration-500" />
        <img src={image} alt={name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out" />

        {/* Decorative Frame Overlay */}
        <div className="absolute inset-0 border-[12px] border-white/30 z-20 rounded-3xl pointer-events-none" />

        <button className="absolute top-4 right-4 z-30 bg-white/80 backdrop-blur-sm p-2.5 rounded-full text-emerald hover:bg-emerald hover:text-white transition-colors duration-300 shadow-sm" aria-label={`Like ${name}`}>
          <Heart size={18} />
        </button>
      </div>

      <div className="p-6 relative">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-24 h-24 opacity-10 pointer-events-none">
          <svg viewBox="0 0 100 100" fill="#2D5F3F">
            <path d="M50 0 C20 0 0 20 0 50 C0 80 20 100 50 100 C80 100 100 80 100 50 C100 20 80 0 50 0 Z M50 90 C30 90 10 70 10 50 C10 30 30 10 50 10 C70 10 90 30 90 50 C90 70 70 90 50 90 Z" />
          </svg>
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-end mb-2">
            <h3 className="text-2xl font-serif font-bold text-forest group-hover:text-emerald transition-colors duration-300">
              {name}
            </h3>
            <span className="text-sm font-medium text-emerald bg-emerald-50 px-3 py-1 rounded-full">
              {age}
            </span>
          </div>
          <p className="text-sage font-sans font-medium">{species}</p>

          <div className="mt-4 pt-4 border-t border-emerald-50 flex justify-between items-center">
            <span className="text-xs font-semibold tracking-wider text-emerald-light uppercase">
              Next Checkup
            </span>
            <span className="text-sm font-medium text-forest">Oct 24</span>
          </div>
        </div>
      </div>
    </motion.div>;
}