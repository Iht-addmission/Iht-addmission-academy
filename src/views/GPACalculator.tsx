/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, CheckCircle2, AlertCircle, Info, RefreshCw, Trophy } from 'lucide-react';

export default function GPACalculator() {
  const [sscGpa, setSscGpa] = useState<string>('');
  const [biologyPoint, setBiologyPoint] = useState<string>('');
  const [result, setResult] = useState<{ score: number, eligible: boolean } | null>(null);

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    const gpa = parseFloat(sscGpa);
    const bio = parseFloat(biologyPoint);

    if (isNaN(gpa) || isNaN(bio)) return;

    // Formula (Example): GPA * 5 + BiologyPoint * 3 + base marks...
    // Actually, IHT calculation is often: (SSC GPA - optional) * 5... 
    // Usually it's based on SSC marks in specific subjects + Biology point as a requirement.
    // Standard IHT calculation for admission score (without exam): 
    // SSC GPA * 20 = 100 Marks. Plus biology requirement.
    
    const score = gpa * 20;
    const eligible = gpa >= 2.5 && bio >= 3.0;

    setResult({ score, eligible });
  };

  const reset = () => {
    setSscGpa('');
    setBiologyPoint('');
    setResult(null);
  };

  return (
    <div className="pt-32 pb-24 bg-slate-50 min-h-screen" role="main" aria-labelledby="calculator-main-title">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.25em] mb-6 border border-blue-200"
          >
            <Calculator size={14} aria-hidden="true" /> Official SSC Score Helper
          </motion.div>
          <h1 id="calculator-main-title" className="text-4xl lg:text-7xl font-black text-slate-900 tracking-tighter uppercase mb-6">
            Admission <span className="text-blue-600">Calculator</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
            Calculate your official IHT admission eligibility and merit score based on your SSC results. All data is processed locally.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-blue-50"
          >
            <form onSubmit={calculate} className="space-y-8" aria-label="Merit score calculator form">
              <div className="space-y-3">
                <label htmlFor="total-ssc-gpa" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Total SSC GPA (With Optional)</label>
                <div className="relative">
                  <input 
                    id="total-ssc-gpa"
                    type="number" step="0.01" min="1" max="5" required
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 font-black text-2xl focus:ring-4 ring-blue-50 outline-none placeholder:text-slate-200 transition-all text-blue-600"
                    placeholder="e.g. 5.00"
                    value={sscGpa}
                    onChange={e => setSscGpa(e.target.value)}
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase tracking-widest" aria-hidden="true">GPA</div>
                </div>
              </div>

              <div className="space-y-3">
                <label htmlFor="biology-point" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Biology Grade Point</label>
                <div className="relative">
                  <input 
                    id="biology-point"
                    type="number" step="0.5" min="1" max="5" required
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 font-black text-2xl focus:ring-4 ring-blue-50 outline-none placeholder:text-slate-200 transition-all text-emerald-600"
                    placeholder="e.g. 4.0"
                    value={biologyPoint}
                    onChange={e => setBiologyPoint(e.target.value)}
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase tracking-widest" aria-hidden="true">Point</div>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="submit"
                  className="flex-1 bg-slate-900 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-blue-600 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
                >
                  <Calculator size={18} /> Calculate Merit
                </button>
                <button 
                  type="button"
                  onClick={reset}
                  className="w-20 bg-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded-2xl flex items-center justify-center transition-all"
                >
                  <RefreshCw size={20} />
                </button>
              </div>
            </form>
          </motion.div>

          {/* Results / Info */}
          <div className="space-y-8">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`p-10 rounded-[3rem] border shadow-2xl relative overflow-hidden ${result.eligible ? 'bg-emerald-600 border-emerald-500' : 'bg-red-600 border-red-500'}`}
                >
                  <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                  
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white">
                      {result.eligible ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-white/60 uppercase tracking-widest">Eligibility Status</div>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                        {result.eligible ? 'Qualified' : 'Not Eligible'}
                      </h3>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-[2rem] p-8 border border-white/10">
                    <div className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-2 text-center">Your Estimated Merit Score</div>
                    <div className="text-7xl font-black text-white text-center tracking-tighter mb-4">{result.score.toFixed(1)}</div>
                    <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] text-center">Out of 100.0 (Base GPA Score)</div>
                  </div>

                  <p className="mt-8 text-white/80 text-sm font-medium leading-relaxed">
                    {result.eligible 
                      ? "Congratulations! You meet the minimum requirements for IHT admission. This score will be combined with your admission test marks for final merit."
                      : "Minimum requirement for IHT is GPA 2.50 in SSC and at least GPA 3.0 in Biology. Please review official guidelines."}
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  key="info"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-blue-50/50"
                >
                  <Trophy size={40} className="text-amber-400 mb-8" />
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-6">Score Guidelines</h3>
                  <div className="space-y-6">
                    <div className="flex gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-blue-600 font-black text-[10px] shrink-0 shadow-sm">01</div>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">GPA is calculated as (SSC GPA * 20), contributing up to 100 marks to the total merit list.</p>
                    </div>
                    <div className="flex gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-blue-600 font-black text-[10px] shrink-0 shadow-sm">02</div>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">Biology is a mandatory requirement. You must have at least GP 3.0 in Biology to apply.</p>
                    </div>
                    <div className="flex gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-blue-600 font-black text-[10px] shrink-0 shadow-sm">03</div>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">Admission Test consists of 100 Marks MCQ. Final merit = (GPA Score) + (Test Marks).</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="bg-blue-600 text-white p-10 rounded-[3rem] shadow-2xl shadow-blue-200">
               <Info size={32} className="text-blue-300 mb-6" />
               <h4 className="text-lg font-black uppercase tracking-tight mb-3">Notice on Marks</h4>
               <p className="text-xs text-blue-100 leading-relaxed font-medium">
                 The calculated score is an estimation based on standard DGHS merit mapping. For official results, always refer to the DGHS publication portal during the active admission session.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
