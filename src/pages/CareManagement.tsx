import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, FileText } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { BotanicalPattern } from '../components/BotanicalPattern';
export function CareManagement() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: '',
    date: '',
    notes: '',
    completed: false
  });
  return <div className="min-h-screen bg-cream pb-24 relative">
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]">
        <BotanicalPattern />
      </div>

      <header className="pt-8 pb-4 px-6 sticky top-0 bg-cream/90 backdrop-blur-md z-30 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-emerald-50 text-forest transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-serif font-bold text-forest">
          Add Care Record
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
        navigate(-1);
      }}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-forest ml-1">
              Care Type
            </label>
            <select className="w-full bg-white border border-emerald-100 rounded-2xl py-3 px-4 text-forest focus:border-emerald focus:ring-1 focus:ring-emerald outline-none transition-all appearance-none" value={formData.type} onChange={e => setFormData({
            ...formData,
            type: e.target.value
          })}>
              <option value="">Select type...</option>
              <option value="vaccination">Vaccination</option>
              <option value="grooming">Grooming</option>
              <option value="checkup">Veterinary Check-up</option>
              <option value="medication">Medication</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-forest ml-1">Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-sage" size={20} />
              <input type="date" value={formData.date} onChange={e => setFormData({
              ...formData,
              date: e.target.value
            })} className="w-full bg-white border border-emerald-100 rounded-2xl py-3 pl-12 pr-4 text-forest focus:border-emerald focus:ring-1 focus:ring-emerald outline-none transition-all" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-forest ml-1">
              Notes
            </label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 text-sage" size={20} />
              <textarea rows={4} value={formData.notes} onChange={e => setFormData({
              ...formData,
              notes: e.target.value
            })} className="w-full bg-white border border-emerald-100 rounded-2xl py-3 pl-12 pr-4 text-forest focus:border-emerald focus:ring-1 focus:ring-emerald outline-none transition-all resize-none" placeholder="Add details about the care provided..." />
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-emerald-100">
            <input type="checkbox" id="completed" checked={formData.completed} onChange={e => setFormData({
            ...formData,
            completed: e.target.checked
          })} className="w-5 h-5 text-emerald rounded focus:ring-emerald border-gray-300" />
            <label htmlFor="completed" className="text-forest font-medium">
              Mark as completed
            </label>
          </div>

          <div className="pt-6">
            <button type="submit" className="w-full bg-emerald text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald/20 hover:bg-emerald-dark transition-colors">
              Save Record
            </button>
          </div>
        </motion.form>
      </main>

      <BottomNav />
    </div>;
}