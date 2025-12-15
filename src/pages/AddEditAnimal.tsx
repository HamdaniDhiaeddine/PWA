import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Camera, Upload, AlertCircle } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { BotanicalPattern } from '../components/BotanicalPattern';
import { apiService, Animal } from '../utils/api';

export function AddEditAnimal() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    dateOfBirth: '',
    weight: '',
    color: '',
    medicalHistory: '',
    vaccinations: '',
    image: null as File | null,        // ← CHANGED: File object
    imagePreview: null as string | null, // ← NEW: Preview only
  });

  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode && id) {
      loadAnimal();
    }
  }, [id, isEditMode]);

  const loadAnimal = async () => {
  try {
    setIsLoading(true);
    const animal = await apiService.getAnimal(id!);
    setFormData({
      name: animal.name,
      species: animal.species,
      breed: animal.breed,
      dateOfBirth: animal.dateOfBirth.split('T')[0],
      weight: animal.weight.toString(),
      color: animal.color || '',
      medicalHistory: animal.medicalHistory || '',
      vaccinations: Array.isArray(animal.vaccinations) ? animal.vaccinations.join(', ') : '',
      image: null,
      imagePreview: animal.imageUrl ? `http://localhost:5000${animal.imageUrl}` : null,  // ← FIX: Full URL
    });
  } catch (err: any) {
    setError('Failed to load animal data');
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

  // ← UPDATED: Handle actual file + preview
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imagePreview: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
      
      // Store File for upload
      setFormData(prev => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSaving(true);
  setError('');

  try {
    if (!formData.name || !formData.breed || !formData.dateOfBirth || !formData.weight) {
      setError('Please fill in all required fields');
      setIsSaving(false);
      return;
    }

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('species', formData.species);
    submitData.append('breed', formData.breed);
    submitData.append('dateOfBirth', formData.dateOfBirth);
    submitData.append('weight', formData.weight);
    submitData.append('color', formData.color || '');
    submitData.append('medicalHistory', formData.medicalHistory || '');
    
    // ← FIX: Parse vaccinations properly for backend
    const vaccinationsArray = formData.vaccinations
      .split(',')
      .map(v => v.trim())
      .filter(v => v);
    submitData.append('vaccinations', JSON.stringify(vaccinationsArray));

    if (formData.image) {
      submitData.append('image', formData.image);
    }

    console.log('Submitting FormData...'); // DEBUG

    if (isEditMode && id) {
      await apiService.updateAnimal(id!, submitData);
    } else {
      await apiService.createAnimal(submitData);
    }

    navigate('/animals');
  } catch (err: any) {
    console.error('Submit error:', err);
    setError(err.message || 'Failed to save animal');
  } finally {
    setIsSaving(false);
  }
};


  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
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
          {isEditMode ? 'Edit Animal' : 'Add New Animal'}
        </h1>
      </header>

      <main className="px-6 max-w-2xl mx-auto pt-4">
        <motion.form
          initial={{
            opacity: 0,
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
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700"
            >
              <AlertCircle size={20} className="flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </motion.div>
          )}

          {/* ← UPDATED: Image Preview */}
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-white border-2 border-dashed border-emerald-200 flex items-center justify-center overflow-hidden">
                {formData.imagePreview ? (
                  <img
                    src={formData.imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="text-sage" size={32} />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-emerald text-white p-2.5 rounded-full shadow-lg cursor-pointer hover:bg-emerald-dark transition-colors">
                <Upload size={16} />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>

          {/* Rest of your form fields - NO CHANGES NEEDED */}
          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-forest ml-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-white border border-emerald-100 rounded-2xl py-3 px-4 text-forest focus:border-emerald focus:ring-1 focus:ring-emerald outline-none transition-all"
                placeholder="Pet's name"
              />
            </div>

            {/* Species and Breed */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-forest ml-1">
                  Species <span className="text-red-500">*</span>
                </label>
                <select
                  name="species"
                  value={formData.species}
                  onChange={handleChange}
                  className="w-full bg-white border border-emerald-100 rounded-2xl py-3 px-4 text-forest focus:border-emerald focus:ring-1 focus:ring-emerald outline-none transition-all appearance-none"
                >
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Bird">Bird</option>
                  <option value="Rabbit">Rabbit</option>
                  <option value="Hamster">Hamster</option>
                  <option value="Guinea Pig">Guinea Pig</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-forest ml-1">
                  Breed <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="breed"
                  required
                  value={formData.breed}
                  onChange={handleChange}
                  className="w-full bg-white border border-emerald-100 rounded-2xl py-3 px-4 text-forest focus:border-emerald focus:ring-1 focus:ring-emerald outline-none transition-all"
                  placeholder="e.g. Golden Retriever"
                />
              </div>
            </div>

            {/* Date of Birth and Weight */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-forest ml-1">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  required
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full bg-white border border-emerald-100 rounded-2xl py-3 px-4 text-forest focus:border-emerald focus:ring-1 focus:ring-emerald outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-forest ml-1">
                  Weight (kg) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="weight"
                  required
                  step="0.1"
                  min="0"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full bg-white border border-emerald-100 rounded-2xl py-3 px-4 text-forest focus:border-emerald focus:ring-1 focus:ring-emerald outline-none transition-all"
                  placeholder="0.0"
                />
              </div>
            </div>

            {/* Color */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-forest ml-1">Color</label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-full bg-white border border-emerald-100 rounded-2xl py-3 px-4 text-forest focus:border-emerald focus:ring-1 focus:ring-emerald outline-none transition-all"
                placeholder="e.g. Brown, Golden, Black and White"
              />
            </div>

            {/* Medical History */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-forest ml-1">
                Medical History
              </label>
              <textarea
                name="medicalHistory"
                value={formData.medicalHistory}
                onChange={handleChange}
                className="w-full bg-white border border-emerald-100 rounded-2xl py-3 px-4 text-forest focus:border-emerald focus:ring-1 focus:ring-emerald outline-none transition-all resize-none"
                placeholder="Any health conditions or notes..."
                rows={3}
              />
            </div>

            {/* Vaccinations */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-forest ml-1">
                Vaccinations (comma-separated)
              </label>
              <textarea
                name="vaccinations"
                value={formData.vaccinations}
                onChange={handleChange}
                className="w-full bg-white border border-emerald-100 rounded-2xl py-3 px-4 text-forest focus:border-emerald focus:ring-1 focus:ring-emerald outline-none transition-all resize-none"
                placeholder="e.g. Rabies, DHPP, Bordetella"
                rows={2}
              />
            </div>
          </div>

          {/* Submit Button */}
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
              {isSaving ? 'Saving...' : isEditMode ? 'Save Changes' : 'Add Animal'}
            </motion.button>
          </div>
        </motion.form>
      </main>

      <BottomNav />
    </div>
  );
}
