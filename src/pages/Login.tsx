import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail } from 'lucide-react';
import { BotanicalPattern } from '../components/BotanicalPattern';
interface LoginProps {
  onLogin: () => void;
}
export function Login({
  onLogin
}: LoginProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login delay
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1000);
  };
  return <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-30">
        <BotanicalPattern />
      </div>
      <div className="fixed top-0 right-0 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="fixed bottom-0 left-0 w-80 h-80 bg-jade-light/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />

      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.6
    }} className="w-full max-w-md bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-emerald-100/50 relative z-10">
        <div className="text-center mb-10">
          <motion.div initial={{
          scale: 0.8,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} transition={{
          delay: 0.2,
          duration: 0.5
        }} className="w-20 h-20 bg-emerald-100 rounded-2xl mx-auto mb-6 flex items-center justify-center rotate-3">
            <span className="text-4xl">🌿</span>
          </motion.div>
          <h1 className="text-4xl font-serif font-bold text-forest mb-2">
            AnimalCare
          </h1>
          <p className="text-sage font-medium">Nurturing your companions</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-forest ml-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-sage" size={20} />
              <input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="w-full bg-cream border-2 border-transparent focus:border-emerald rounded-2xl py-3 pl-12 pr-4 text-forest placeholder:text-sage/60 outline-none transition-all duration-300" />
            </div>
          </div>

          <motion.button whileHover={{
          scale: 1.02
        }} whileTap={{
          scale: 0.98
        }} type="submit" disabled={isLoading} className="w-full bg-emerald text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald/20 flex items-center justify-center gap-2 hover:bg-emerald-dark transition-colors disabled:opacity-70">
            {isLoading ? <span className="animate-pulse">Signing in...</span> : <>
                Sign In <ArrowRight size={20} />
              </>}
          </motion.button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-sage">
            Don't have an account?{' '}
            <button className="text-emerald font-bold hover:underline">
              Sign up
            </button>
          </p>
        </div>
      </motion.div>
    </div>;
}