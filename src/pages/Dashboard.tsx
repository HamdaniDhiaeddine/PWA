import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Activity, Clock, Bell, Heart } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import { AnimalCard } from '../components/AnimalCard';
import { BottomNav } from '../components/BottomNav';
import { BotanicalPattern } from '../components/BotanicalPattern';
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
export function Dashboard() {
  return <div className="min-h-screen bg-cream pb-24 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="fixed top-0 left-0 w-64 h-64 bg-emerald-100/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-jade-light/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      {/* Header Section */}
      <header className="relative pt-12 pb-8 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <motion.div initial={{
          opacity: 0,
          x: -20
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.6
        }}>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-forest mb-2">
              AnimalCare
            </h1>
            <p className="text-sage font-medium">Nurturing your companions</p>
          </motion.div>

          <motion.button whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }} className="bg-white p-3 rounded-full shadow-sm border border-emerald-100 text-emerald hover:bg-emerald hover:text-white transition-colors duration-300">
            <Bell size={24} />
          </motion.button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <StatsCard label="Total Pets" value="4" icon={Activity} delay={0.1} />
          <StatsCard label="Appointments" value="2" icon={Calendar} delay={0.2} />
          <StatsCard label="Daily Care" value="100%" icon={Clock} delay={0.3} />
          <StatsCard label="Health Score" value="98%" icon={Heart} delay={0.4} />
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-serif font-bold text-forest">
            Your Pets
          </h2>
          <button className="text-emerald font-medium hover:text-emerald-dark transition-colors">
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pets.map((pet, index) => <AnimalCard key={pet.id} {...pet} delay={0.2 + index * 0.1} />)}
        </div>

        {/* Upcoming Schedule Section */}
        <div className="mt-16 mb-8">
          <h2 className="text-3xl font-serif font-bold text-forest mb-6">
            Today's Schedule
          </h2>

          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.6
        }} className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-sm relative overflow-hidden">
            <BotanicalPattern opacity={0.03} />

            <div className="space-y-6 relative z-10">
              {[{
              time: '09:00 AM',
              title: 'Morning Feeding',
              pet: 'All Pets',
              completed: true
            }, {
              time: '02:30 PM',
              title: 'Vet Appointment',
              pet: 'Max',
              completed: false
            }, {
              time: '05:00 PM',
              title: 'Evening Walk',
              pet: 'Max',
              completed: false
            }].map((item, i) => <div key={i} className="flex items-center group">
                  <div className={`w-24 font-medium ${item.completed ? 'text-sage line-through' : 'text-emerald'}`}>
                    {item.time}
                  </div>
                  <div className="flex-1 flex items-center bg-cream/50 p-4 rounded-2xl group-hover:bg-emerald-50 transition-colors duration-300">
                    <div className={`w-3 h-3 rounded-full mr-4 ${item.completed ? 'bg-sage' : 'bg-jade'}`} />
                    <div>
                      <h4 className={`font-serif font-bold ${item.completed ? 'text-sage' : 'text-forest'}`}>
                        {item.title}
                      </h4>
                      <p className="text-sm text-sage">{item.pet}</p>
                    </div>
                  </div>
                </div>)}
            </div>
          </motion.div>
        </div>
      </main>

      <BottomNav />
    </div>;
}