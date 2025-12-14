import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Camera, Upload } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { BotanicalPattern } from '../components/BotanicalPattern';
export function AddEditAnimal() {
  const navigate = useNavigate();
  const {
    id
  } = useParams();
  const isEditMode = Boolean(id);
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    age: '',
    gender: '',
    image: null as string | null
  });
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };
  return <div className="min-h-screen bg-cream pb-24 relative">
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]">
        <BotanicalPattern />
      </div>

      <header className="pt-8 pb-4 px-6 sticky top-0 bg-cream/90 backdrop-blur-md z-30 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-emerald-50 text-forest transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-serif font-bold text-forest">
          {isEditMode ? 'Edit Animal' : 'Add New Animal'}
        </h1>
      </header>

      <main className="px-6 max-w-2xl mx-auto pt-4">
        <motion.form initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="space-y-6" onSubmit={e => {
        e.preventDefault();
        navigate('/animals');
      }}>
          {/* Photo Upload */}
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-white border-2 border-dashed border-emerald-200 flex items-center justify-center overflow-hidden">
                {formData.image ? <img src={formData.image} alt="Preview" className="w-full h-full object-cover" /> : <Camera className="text-sage" size={32} />}
              </div>
              <label className="absolute bottom-0 right-0 bg-emerald text-white p-2.5 rounded-full shadow-lg cursor-pointer hover:bg-emerald-dark transition-colors">
                <Upload size={16} />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-forest ml-1">
                Name
              </label>
              <input type="text" required value={formData.name} onChange={e => setFormData({
              ...formData,
              name: e.target.value
            })} className="w-full bg-white border border-emerald-100 rounded-2xl py-3 px-4 text-forest focus:border-emerald focus:ring-1 focus:ring-emerald outline-none transition-all" placeholder="Pet's name" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-forest ml-1">
                  Species
                </label>
                <select className="w-full bg-white border border-emerald-100 rounded-2xl py-3 px-4 text-forest focus:border-emerald focus:ring-1 focus:ring-emerald outline-none transition-all appearance-none" value={formData.species} onChange={e => setFormData({
                ...formData,
                species: e.target.value
              })}>
                  <option value="">Select...</option>
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="bird">Bird</option>
                  <option value="rabbit">Rabbit</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-forest ml-1">
                  Gender
                </label>
                <select className="w-full bg-white border border-emerald-100 rounded-2xl py-3 px-4 text-forest focus:border-emerald focus:ring-1 focus:ring-emerald outline-none transition-all appearance-none" value={formData.gender} onChange={e => setFormData({
                ...formData,
                gender: e.target.value
              })}>
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-forest ml-1">
                Age
              </label>
              <input type="text" value={formData.age} onChange={e => setFormData({
              ...formData,
              age: e.target.value
            })} className="w-full bg-white border border-emerald-100 rounded-2xl py-3 px-4 text-forest focus:border-emerald focus:ring-1 focus:ring-emerald outline-none transition-all" placeholder="e.g. 2 years" />
            </div>
          </div>

          <div className="pt-6">
            <button type="submit" className="w-full bg-emerald text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald/20 hover:bg-emerald-dark transition-colors">
              {isEditMode ? 'Save Changes' : 'Add Animal'}
            </button>
          </div>
        </motion.form>
      </main>

      <BottomNav />
    </div>;
}