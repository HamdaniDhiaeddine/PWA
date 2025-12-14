import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { AnimalCard } from '../components/AnimalCard';
import { BottomNav } from '../components/BottomNav';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { BotanicalPattern } from '../components/BotanicalPattern';
// Mock data - would normally come from an API/Context
const pets = [{
  id: 1,
  name: 'Max',
  species: 'Golden Retriever',
  age: '3 yrs',
  image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&auto=format&fit=crop&q=60'
}, {
  id: 2,
  name: 'Luna',
  species: 'Siamese Cat',
  age: '2 yrs',
  image: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?w=600&auto=format&fit=crop&q=60'
}, {
  id: 3,
  name: 'Clover',
  species: 'Holland Lop',
  age: '1 yr',
  image: 'https://images.unsplash.com/photo-1585110396000-c9285742770f?w=600&auto=format&fit=crop&q=60'
}, {
  id: 4,
  name: 'Kiwi',
  species: 'Parrotlet',
  age: '4 yrs',
  image: 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=600&auto=format&fit=crop&q=60'
}];
export function AnimalsList() {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-cream pb-24 relative">
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]">
        <BotanicalPattern />
      </div>

      <header className="pt-12 pb-6 px-6 md:px-12 max-w-7xl mx-auto sticky top-0 bg-cream/80 backdrop-blur-md z-30">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-forest">
              My Pets
            </h1>
            <p className="text-sage mt-1">Manage your animal companions</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-sage" size={20} />
          <input type="text" placeholder="Search pets..." className="w-full bg-white border border-emerald-100 rounded-2xl py-3 pl-12 pr-4 text-forest placeholder:text-sage/60 focus:border-emerald focus:ring-1 focus:ring-emerald outline-none transition-all" />
        </div>
      </header>

      <main className="px-6 md:px-12 max-w-7xl mx-auto">
        {pets.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet, index) => <div key={pet.id} onClick={() => navigate(`/animals/${pet.id}`)} className="cursor-pointer">
                <AnimalCard {...pet} delay={index * 0.1} />
              </div>)}
          </div> : <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-32 h-32 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">🐾</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-forest mb-2">
              No pets yet
            </h3>
            <p className="text-sage max-w-xs mx-auto">
              Add your first animal companion to start tracking their care.
            </p>
          </motion.div>}
      </main>

      <FloatingActionButton onClick={() => navigate('/animals/add')} />
      <BottomNav />
    </div>;
}