import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Activity, Clock, Bell, Heart, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatsCard } from '../components/StatsCard';
import { AnimalCard } from '../components/AnimalCard';
import { BottomNav } from '../components/BottomNav';
import { BotanicalPattern } from '../components/BotanicalPattern';
import { apiService, Animal, CareRecord } from '../utils/api';

export function Dashboard() {
  const navigate = useNavigate();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [careRecords, setCareRecords] = useState<CareRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadData();
    const storedUser = apiService.getStoredUser();
    setUser(storedUser);
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [animalsData, careData] = await Promise.all([
        apiService.getAnimals(),
        apiService.getCareRecords(),
      ]);
      setAnimals(animalsData);
      setCareRecords(careData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    apiService.logout();
    navigate('/login');
  };

  const getTodaySchedule = () => {
    const today = new Date().toDateString();
    return careRecords.filter(
      record => new Date(record.date).toDateString() === today
    );
  };

  const getCompletedToday = () => {
    return getTodaySchedule().length;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center pb-24">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <div className="w-12 h-12 rounded-full border-4 border-emerald-100 border-t-emerald" />
          </div>
          <p className="text-sage">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pb-24 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="fixed top-0 left-0 w-64 h-64 bg-emerald-100/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-jade-light/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      {/* Header Section */}
      <header className="relative pt-12 pb-8 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <motion.div
            initial={{
              opacity: 0,
              x: -20,
            }}
            animate={{
              opacity: 1,
              x:  0,
            }}
            transition={{
              duration: 0.6,
            }}
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-forest mb-2">
              AnimalCare
            </h1>
            <p className="text-sage font-medium">
              {user ? `Welcome, ${user.name}` : 'Nurturing your companions'}
            </p>
          </motion.div>

          <motion.button
            whileHover={{
              scale:  1.05,
            }}
            whileTap={{
              scale: 0.95,
            }}
            onClick={handleLogout}
            className="bg-white p-3 rounded-full shadow-sm border border-emerald-100 text-red-500 hover:bg-red-50 transition-colors duration-300"
            title="Logout"
          >
            <LogOut size={24} />
          </motion.button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <StatsCard
            label="Total Pets"
            value={animals.length. toString()}
            icon={Activity}
            delay={0.1}
          />
          <StatsCard
            label="Care Records"
            value={careRecords.length.toString()}
            icon={Calendar}
            delay={0.2}
          />
          <StatsCard
            label="Today's Tasks"
            value={getTodaySchedule().length.toString()}
            icon={Clock}
            delay={0.3}
          />
          <StatsCard
            label="Health Score"
            value={animals.length > 0 ? '98%' : '—'}
            icon={Heart}
            delay={0.4}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 md: px-12 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-serif font-bold text-forest">Your Pets</h2>
          {animals.length > 0 && (
            <button
              onClick={() => navigate('/animals')}
              className="text-emerald font-medium hover:text-emerald-dark transition-colors"
            >
              View All
            </button>
          )}
        </div>

        {animals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-white rounded-3xl border border-emerald-100"
          >
            <div className="text-6xl mb-4">🐾</div>
            <h3 className="text-2xl font-serif font-bold text-forest mb-2">
              No Pets Yet
            </h3>
            <p className="text-sage mb-6">
              Start by adding your first animal companion
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/animals/add')}
              className="bg-emerald text-white px-6 py-3 rounded-2xl font-semibold hover:bg-emerald-dark transition-colors inline-block"
            >
              Add First Pet
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {animals.slice(0, 4).map((pet, index) => (
              <AnimalCard
                key={pet._id}
                id={pet._id}
                name={pet.name}
                species={pet.species}
                age={calculateAge(pet.dateOfBirth)}
                image="https://images.unsplash.com/photo-1552053831-71594a27632d?  w=600&auto=format&fit=crop&q=60"
                delay={0.2 + index * 0.1}
              />
            ))}
          </div>
        )}

        {/* Today's Schedule Section */}
        {careRecords.length > 0 && (
          <div className="mt-16 mb-8">
            <h2 className="text-3xl font-serif font-bold text-forest mb-6">
              Today's Schedule
            </h2>

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y:  0,
              }}
              transition={{
                delay: 0.6,
              }}
              className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-sm relative overflow-hidden"
            >
              <BotanicalPattern opacity={0.03} />

              <div className="space-y-6 relative z-10">
                {getTodaySchedule().length === 0 ? (
                  <p className="text-center text-sage py-8">
                    No tasks scheduled for today
                  </p>
                ) : (
                  getTodaySchedule()
                    .slice(0, 5)
                    .map((record, i) => (
                      <div key={record._id} className="flex items-center group">
                        <div className="w-24 font-medium text-emerald">
                          {new Date(record.date).toLocaleTimeString(
                            'en-US',
                            {
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )}
                        </div>
                        <div className="flex-1 flex items-center bg-cream/50 p-4 rounded-2xl group-hover:bg-emerald-50 transition-colors duration-300">
                          <div className="w-3 h-3 rounded-full mr-4 bg-jade" />
                          <div>
                            <h4 className="font-serif font-bold text-forest capitalize">
                              {record.careType}
                            </h4>
                            <p className="text-sm text-sage">{record.notes}</p>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </motion.  div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

function calculateAge(dateOfBirth: string): string {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age > 0 ? `${age} yrs` : 'newborn';
}