import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Edit2, Activity, Heart } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { BotanicalPattern } from '../components/BotanicalPattern';
export function AnimalDetails() {
  const navigate = useNavigate();
  const {
    id
  } = useParams();
  // Mock data
  const pet = {
    name: 'Max',
    species: 'Golden Retriever',
    age: '3 yrs',
    gender: 'Male',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&auto=format&fit=crop&q=60',
    health: 'Healthy'
  };
  const careHistory = [{
    id: 1,
    type: 'Vaccination',
    date: 'Oct 15, 2023',
    notes: 'Annual rabies shot',
    completed: true
  }, {
    id: 2,
    type: 'Grooming',
    date: 'Sep 20, 2023',
    notes: 'Full wash and trim',
    completed: true
  }, {
    id: 3,
    type: 'Check-up',
    date: 'Jun 10, 2023',
    notes: 'General wellness exam',
    completed: true
  }];
  return <div className="min-h-screen bg-cream pb-24 relative">
      {/* Hero Image */}
      <div className="relative h-72 w-full">
        <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-cream" />

        <button onClick={() => navigate(-1)} className="absolute top-8 left-6 p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors">
          <ArrowLeft size={24} />
        </button>

        <button onClick={() => navigate(`/animals/${id}/edit`)} className="absolute top-8 right-6 p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors">
          <Edit2 size={20} />
        </button>
      </div>

      <main className="px-6 max-w-7xl mx-auto -mt-12 relative z-10">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100 mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-serif font-bold text-forest">
                {pet.name}
              </h1>
              <p className="text-sage font-medium">
                {pet.species} • {pet.age}
              </p>
            </div>
            <span className="bg-emerald-100 text-emerald px-3 py-1 rounded-full text-sm font-bold">
              {pet.health}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-cream p-4 rounded-2xl flex items-center gap-3">
              <div className="bg-white p-2 rounded-full text-emerald">
                <Activity size={20} />
              </div>
              <div>
                <p className="text-xs text-sage uppercase font-bold tracking-wider">
                  Weight
                </p>
                <p className="font-bold text-forest">32 kg</p>
              </div>
            </div>
            <div className="bg-cream p-4 rounded-2xl flex items-center gap-3">
              <div className="bg-white p-2 rounded-full text-emerald">
                <Heart size={20} />
              </div>
              <div>
                <p className="text-xs text-sage uppercase font-bold tracking-wider">
                  Next Vet
                </p>
                <p className="font-bold text-forest">Nov 12</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mb-6">
          <h2 className="text-2xl font-serif font-bold text-forest mb-4">
            Care History
          </h2>
          <div className="space-y-4">
            {careHistory.map((item, index) => <motion.div key={item.id} initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            delay: index * 0.1
          }} className="bg-white p-4 rounded-2xl border border-emerald-50 flex items-center gap-4">
                <div className="bg-emerald-50 w-12 h-12 rounded-full flex items-center justify-center text-emerald shrink-0">
                  <Calendar size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-forest">{item.type}</h3>
                  <p className="text-sm text-sage">{item.notes}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-emerald bg-emerald-50 px-2 py-1 rounded-lg inline-block mb-1">
                    {item.date}
                  </p>
                </div>
              </motion.div>)}
          </div>
        </div>
      </main>

      <FloatingActionButton onClick={() => navigate('/care/add')} label="Add Care" />
      <BottomNav />
    </div>;
}