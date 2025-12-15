import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, AlertCircle } from 'lucide-react';
import { AnimalCard } from '../components/AnimalCard';
import { BottomNav } from '../components/BottomNav';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { BotanicalPattern } from '../components/BotanicalPattern';
import { apiService, Animal } from '../utils/api';

export function AnimalsList() {
  const navigate = useNavigate();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [filteredAnimals, setFilteredAnimals] = useState<Animal[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAnimals();
  }, []);

  useEffect(() => {
    const filtered = animals.filter(
      animal =>
        animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.species.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAnimals(filtered);
  }, [searchTerm, animals]);

  const loadAnimals = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await apiService.getAnimals();
      setAnimals(data);
      setFilteredAnimals(data);
    } catch (err:  any) {
      setError(err.message || 'Failed to load animals');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream pb-24 relative">
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
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-sage"
            size={20}
          />
          <input
            type="text"
            placeholder="Search pets..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-emerald-100 rounded-2xl py-3 pl-12 pr-4 text-forest placeholder:text-sage/60 focus:border-emerald focus:ring-1 focus: ring-emerald outline-none transition-all"
          />
        </div>
      </header>

      <main className="px-6 md:px-12 max-w-7xl mx-auto">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity:  1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700"
          >
            <AlertCircle size={20} />
            <p className="text-sm">{error}</p>
          </motion.div>
        )}

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3]. map(i => (
              <div
                key={i}
                className="h-80 bg-white rounded-3xl animate-pulse border border-emerald-100"
              />
            ))}
          </div>
        ) : filteredAnimals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity:  1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-32 h-32 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">🐾</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-forest mb-2">
              {animals.length === 0 ? 'No pets yet' : 'No results found'}
            </h3>
            <p className="text-sage max-w-xs mx-auto mb-6">
              {animals.length === 0
                ? 'Add your first animal companion to start tracking their care.'
                : 'Try adjusting your search criteria'}
            </p>
            {animals.length === 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate('/animals/add')}
                className="bg-emerald text-white px-6 py-3 rounded-2xl font-semibold hover:bg-emerald-dark transition-colors"
              >
                Add First Pet
              </motion.button>
            )}
          </motion. div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnimals. map((animal, index) => (
              <motion.div
                key={animal._id}
                initial={{ opacity:  0, y: 20 }}
                animate={{ opacity: 1, y:  0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(`/animals/${animal._id}`)}
                className="cursor-pointer"
              >
                <AnimalCard
                  id={animal._id}
                  name={animal.name}
                  species={animal.species}
                  age={calculateAge(animal.dateOfBirth)}
                  image="https://images.unsplash.com/photo-1552053831-71594a27632d? w=600&auto=format&fit=crop&q=60"
                  delay={0}
                />
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <FloatingActionButton onClick={() => navigate('/animals/add')} />
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