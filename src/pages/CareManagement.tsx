import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Calendar, FileText, AlertCircle } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { BotanicalPattern } from '../components/BotanicalPattern';
import { apiService, Animal } from '../utils/api';

export function CareManagement() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const animalIdFromParams = searchParams.get('animalId');

  const [formData, setFormData] = useState({
    animalId: animalIdFromParams || '',
    careType: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    completedBy: '',
  });

  const [animals, setAnimals] = useState<Animal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAnimals();
  }, []);

  const loadAnimals = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getAnimals();
      setAnimals(data);
    } catch (err:  any) {
      setError('Failed to load animals');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      if (! formData.animalId || !formData.careType) {
        setError('Please select an animal and care type');
        setIsSaving(false);
        return;
      }

      const careData = {
        animalId:  formData.animalId,
        careType: formData.careType as any,
        date: new Date(formData.date).toISOString(),
        notes: formData.notes,
        completedBy: formData.completedBy || undefined,
      };

      await apiService.createCareRecord(careData);
      navigate('/animals');
    } catch (err: any) {
      setError(err.message || 'Failed to save care record');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center pb-24">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <div className="w-12 h-12 rounded-full border-4 border-emerald-100 border-t-emerald" />
          </div>
          <p className="text-sage">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pb-24 relative">
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]">
        <BotanicalPattern />
      </div>

      <header className="pt-8 pb-4 px-6 sticky top-0 bg-cream/90 backdrop-blur-md z-30 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-emerald-50 text-forest transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-serif font-bold text-forest">
          Add Care Record
        </h1>
      </header>

      <main className="px-6 max-w-2xl mx-auto pt-4">
        <motion.form
          initial={{
            opacity:  0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="space-y-6"
          onSubmit={handleSubmit}
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity:  1, y: 0 }}
              className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700"
            >
              <AlertCircle size={20} className="flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </motion.div>
          )}

          {/* Select Animal */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-forest ml-1">
              Select Animal <span className="text-red-500">*</span>
            </label>
            <select
              name="animalId"
              value={formData.animalId}
              onChange={handleChange}
              className="w-full bg-white border border-emerald-100 rounded-2xl py-3 px-4 text-forest focus:border-emerald focus:ring-1 focus:ring-emerald outline-none transition-all appearance-none"
            >
              <option value="">Choose an animal...</option>
              {animals.map(animal => (
                <option key={animal._id} value={animal._id}>
                  {animal.name} ({animal.species})
                </option>
              ))}
            </select>
          </div>

          {/* Care Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-forest ml-1">
              Care Type <span className="text-red-500">*</span>
            </label>
            <select
              name="careType"
              value={formData.careType}
              onChange={handleChange}
              className="w-full bg-white border border-emerald-100 rounded-2xl py-3 px-4 text-forest focus:border-emerald focus:ring-1 focus:ring-emerald outline-none transition-all appearance-none"
            >
              <option value="">Select type...</option>
              <option value="feeding">Feeding</option>
              <option value="grooming">Grooming</option>
              <option value="exercise">Exercise</option>
              <option value="medication">Medication</option>
              <option value="veterinary">Veterinary</option>
            </select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-forest ml-1">Date</label>
            <div className="relative">
              <Calendar
                className="absolute left-4 top-1/2 -translate-y-1/2 text-sage"
                size={20}
              />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full bg-white border border-emerald-100 rounded-2xl py-3 pl-12 pr-4 text-forest focus:border-emerald focus: ring-1 focus:ring-emerald outline-none transition-all"
              />
            </div>
          </div>

          {/* Completed By */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-forest ml-1">
              Completed By
            </label>
            <input
              type="text"
              name="completedBy"
              value={formData.completedBy}
              onChange={handleChange}
              placeholder="e.g.  John, Veterinarian"
              className="w-full bg-white border border-emerald-100 rounded-2xl py-3 px-4 text-forest focus: border-emerald focus:ring-1 focus:ring-emerald outline-none transition-all"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-forest ml-1">Notes</label>
            <div className="relative">
              <FileText
                className="absolute left-4 top-4 text-sage"
                size={20}
              />
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full bg-white border border-emerald-100 rounded-2xl py-3 pl-12 pr-4 text-forest focus:border-emerald focus: ring-1 focus:ring-emerald outline-none transition-all resize-none"
                placeholder="Add details about the care provided..."
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="pt-6 flex gap-4">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(-1)}
              className="flex-1 bg-white border border-emerald-100 text-forest font-bold py-4 rounded-2xl hover:bg-emerald-50 transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSaving}
              className="flex-1 bg-emerald text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald/20 hover:bg-emerald-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Record'}
            </motion. button>
          </div>
        </motion.form>
      </main>

      <BottomNav />
    </div>
  );
}