import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Edit2, Activity, Heart, AlertCircle, Trash2 } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { BotanicalPattern } from '../components/BotanicalPattern';
import { apiService, Animal, CareRecord } from '../utils/api';

export function AnimalDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [animal, setAnimal] = useState<Animal | null>(null);
  const [careHistory, setCareHistory] = useState<CareRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');

      const [animalData, careData] = await Promise.all([
        apiService.getAnimal(id! ),
        apiService.getCareRecords(id),
      ]);

      setAnimal(animalData);
      setCareHistory(careData. sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ));
    } catch (err:  any) {
      setError(err.message || 'Failed to load animal details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAnimal = async () => {
    if (! window.confirm('Are you sure you want to delete this animal?')) {
      return;
    }

    try {
      await apiService.deleteAnimal(id!);
      navigate('/animals');
    } catch (err: any) {
      setError('Failed to delete animal');
    }
  };

  const handleDeleteCareRecord = async (recordId: string) => {
    if (!window.confirm('Delete this care record?')) {
      return;
    }

    try {
      await apiService.deleteCareRecord(recordId);
      setCareHistory(careHistory.filter(r => r._id !== recordId));
    } catch (err: any) {
      alert('Failed to delete care record');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center pb-24">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <div className="w-12 h-12 rounded-full border-4 border-emerald-100 border-t-emerald" />
          </div>
          <p className="text-sage">Loading animal details...</p>
        </div>
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center pb-24">
        <div className="text-center">
          <div className="text-6xl mb-4">😿</div>
          <h2 className="text-2xl font-serif font-bold text-forest mb-2">Animal not found</h2>
          <p className="text-sage mb-6">This animal doesn't exist or has been deleted</p>
          <button
            onClick={() => navigate('/animals')}
            className="bg-emerald text-white px-6 py-3 rounded-2xl font-semibold hover:bg-emerald-dark transition-colors"
          >
            Back to Pets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pb-24 relative">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity:  1, y: 0 }}
          className="fixed top-4 left-4 right-4 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 z-50"
        >
          <AlertCircle size={20} className="flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </motion.div>
      )}

      {/* Hero Image */}
      <div className="relative h-72 w-full">
        <img
          src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&auto=format&fit=crop&q=60"
          alt={animal.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-cream" />

        <button
          onClick={() => navigate(-1)}
          className="absolute top-8 left-6 p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors z-10"
        >
          <ArrowLeft size={24} />
        </button>

        <button
          onClick={() => navigate(`/animals/${id}/edit`)}
          className="absolute top-8 right-6 p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover: bg-white/30 transition-colors z-10"
        >
          <Edit2 size={20} />
        </button>
      </div>

      <main className="px-6 max-w-7xl mx-auto -mt-12 relative z-10">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y:  0,
          }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100 mb-8"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-serif font-bold text-forest">
                {animal.name}
              </h1>
              <p className="text-sage font-medium">
                {animal.species} • {calculateAge(animal.dateOfBirth)}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleDeleteAnimal}
              className="bg-red-50 text-red-500 p-3 rounded-full hover:bg-red-100 transition-colors"
              title="Delete animal"
            >
              <Trash2 size={20} />
            </motion. button>
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
                <p className="font-bold text-forest">{animal.weight} kg</p>
              </div>
            </div>

            <div className="bg-cream p-4 rounded-2xl flex items-center gap-3">
              <div className="bg-white p-2 rounded-full text-emerald">
                <Heart size={20} />
              </div>
              <div>
                <p className="text-xs text-sage uppercase font-bold tracking-wider">
                  Breed
                </p>
                <p className="font-bold text-forest">{animal.breed}</p>
              </div>
            </div>

            {animal.color && (
              <div className="bg-cream p-4 rounded-2xl flex items-center gap-3">
                <div className="bg-white p-2 rounded-full text-emerald">
                  <span className="text-xl">🎨</span>
                </div>
                <div>
                  <p className="text-xs text-sage uppercase font-bold tracking-wider">
                    Color
                  </p>
                  <p className="font-bold text-forest">{animal.color}</p>
                </div>
              </div>
            )}

            {animal.lastCheckup && (
              <div className="bg-cream p-4 rounded-2xl flex items-center gap-3">
                <div className="bg-white p-2 rounded-full text-emerald">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-xs text-sage uppercase font-bold tracking-wider">
                    Last Checkup
                  </p>
                  <p className="font-bold text-forest">
                    {new Date(animal.lastCheckup).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>

          {animal.medicalHistory && (
            <div className="mt-6 pt-6 border-t border-emerald-50">
              <h3 className="font-bold text-forest mb-3">Medical History</h3>
              <p className="text-sage text-sm">{animal.medicalHistory}</p>
            </div>
          )}

          {animal.vaccinations && animal.vaccinations.length > 0 && (
            <div className="mt-6 pt-6 border-t border-emerald-50">
              <h3 className="font-bold text-forest mb-3">Vaccinations</h3>
              <div className="flex flex-wrap gap-2">
                {animal.vaccinations.map((vaccine, idx) => (
                  <span
                    key={idx}
                    className="bg-emerald-50 text-emerald px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {vaccine}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Care History Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-serif font-bold text-forest">Care History</h2>
            {careHistory.length > 0 && (
              <span className="text-sm font-medium text-sage bg-emerald-50 px-3 py-1 rounded-full">
                {careHistory.length} records
              </span>
            )}
          </div>

          {careHistory.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 bg-white rounded-3xl border border-emerald-100"
            >
              <div className="text-4xl mb-3">📋</div>
              <p className="text-sage">No care records yet.  Start tracking care activities!</p>
            </motion. div>
          ) : (
            <div className="space-y-4">
              {careHistory.map((item, index) => (
                <motion. div
                  key={item._id}
                  initial={{
                    opacity: 0,
                    x: -20,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: index * 0.1,
                  }}
                  className="bg-white p-4 rounded-2xl border border-emerald-50 flex items-start justify-between"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="bg-emerald-50 w-12 h-12 rounded-full flex items-center justify-center text-emerald shrink-0">
                      <Calendar size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-forest capitalize">
                        {item.careType}
                      </h3>
                      <p className="text-sm text-sage">{item.notes}</p>
                      <p className="text-xs text-emerald font-medium mt-2">
                        {new Date(item.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleDeleteCareRecord(item._id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                    title="Delete care record"
                  >
                    <Trash2 size={16} />
                  </motion. button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <FloatingActionButton
        onClick={() => navigate(`/care/add? animalId=${id}`)}
        label="Add Care"
      />
      <BottomNav />
    </div>
  );
}

function calculateAge(dateOfBirth:  string): string {
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