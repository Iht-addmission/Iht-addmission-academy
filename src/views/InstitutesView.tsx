import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Building2, MapPin, CheckCircle2, LayoutGrid, Users, ArrowRight, ShieldCheck, Microscope, Search, Filter, ChevronDown, ListFilter, Globe, GraduationCap, X, SlidersHorizontal, Trash2, Activity, Shield, Award } from 'lucide-react';

import { Institute, Course, DepartmentInfo } from '../types';

import dhakaIhtImg from '../assets/images/regenerated_image_1777921032256.jpg';
import rajshahiIhtImg from '../assets/images/regenerated_image_1777920175521.png';
import boguraIhtImg from '../assets/images/regenerated_image_1777920177187.jpg';
import chattogramIhtImg from '../assets/images/regenerated_image_1777920177962.jpg';
import barishalIhtImg from '../assets/images/regenerated_image_1777920178644.jpg';
import rangpurIhtImg from '../assets/images/regenerated_image_1777920179240.jpg';
import jhenaidahIhtImg from '../assets/images/regenerated_image_1777920179830.jpg';

const INSTITUTE_IMAGES: Record<string, string> = {
  'ssmch-iht': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200',
  'cmh-iht': 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80&w=1200',
  'dhaka-iht': dhakaIhtImg,
  'rajshahi-iht': rajshahiIhtImg,
  'bogura-iht': boguraIhtImg,
  'chattogram-iht': chattogramIhtImg,
  'barishal-iht': barishalIhtImg,
  'rangpur-iht': rangpurIhtImg,
  'jhenaidah-iht': jhenaidahIhtImg,
};

interface InstitutesViewProps {
  onNavigate: (page: string, id?: string) => void;
  initialSearchQuery?: string;
}

const SEAT_RANGES = [
  { id: 'high', label: 'High (40+)', min: 40, max: 1000 },
  { id: 'medium', label: 'Medium (25-40)', min: 25, max: 40 },
  { id: 'low', label: 'Low (<25)', min: 0, max: 25 },
];

const INSTITUTE_TYPES = [
  { id: 'large', label: 'Large (>250)', min: 250, max: 10000 },
  { id: 'medium', label: 'Medium (100-250)', min: 100, max: 250 },
  { id: 'small', label: 'Small (<100)', min: 0, max: 100 },
];

export function InstitutesView({ onNavigate, initialSearchQuery = '' }: InstitutesViewProps) {
  const { t, i18n } = useTranslation();
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  const t_lang = (en: string | undefined, bn?: string) => {
    if (i18n.language === 'bn') return bn || en || '';
    return en || '';
  };
  
  // Advanced Filter States
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedDepts, setSelectedDepts] = useState<string[]>([]);
  const [selectedSeatRanges, setSelectedSeatRanges] = useState<string[]>([]);
  const [selectedInstTypes, setSelectedInstTypes] = useState<string[]>([]);
  const [deptSearchTerm, setDeptSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'none' | 'high' | 'low'>('none');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    Promise.all([fetchInstitutes(), fetchCourses()]).then(([insts, crs]) => {
      setInstitutes(insts);
      setCourses(crs);
      setLoading(false);
    });
  }, []);

  const getInstTotal = (inst: Institute): number => {
    const seatValues = Object.values(inst.seats);
    return seatValues.reduce<number>((sum, val: any) => {
      const seats = typeof val === 'object' && val !== null ? val.seats : Number(val);
      return sum + (Number(seats) || 0);
    }, 0);
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedLocations([]);
    setSelectedDepts([]);
    setSelectedSeatRanges([]);
    setSelectedInstTypes([]);
    setSortOrder('none');
  };

  const toggleSelection = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    setList(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const filteredInstitutes = institutes.filter(inst => {
    const totalSeats = getInstTotal(inst);
    const locationName = inst.location.split(', ').pop() || '';
    
    const matchesSearch = 
      inst.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (inst.nameBn && inst.nameBn.toLowerCase().includes(searchQuery.toLowerCase())) ||
      inst.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inst.locationBn && inst.locationBn.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(locationName);
    
    const matchesDept = selectedDepts.length === 0 || selectedDepts.some(d => Object.keys(inst.seats).includes(d));

    const matchesInstType = selectedInstTypes.length === 0 || selectedInstTypes.some(typeId => {
      const type = INSTITUTE_TYPES.find(t => t.id === typeId);
      return type && totalSeats >= type.min && totalSeats < type.max;
    });

    const matchesSeatRange = selectedSeatRanges.length === 0 || selectedSeatRanges.some(rangeId => {
      const range = SEAT_RANGES.find(r => r.id === rangeId);
      if (!range) return false;

      // Enhance: If departments are selected, only check seat range against those departments
      const deptsToCheck = selectedDepts.length > 0 
        ? Object.entries(inst.seats).filter(([id]) => selectedDepts.includes(id))
        : Object.entries(inst.seats);

      return deptsToCheck.some(([_, val]) => {
        const s = typeof val === 'object' && val !== null ? (val as DepartmentInfo).seats : Number(val);
        return s >= range.min && s < range.max;
      });
    });

    return matchesSearch && matchesLocation && matchesDept && matchesInstType && matchesSeatRange;
  }).sort((a, b) => {
    if (sortOrder === 'high') return getInstTotal(b) - getInstTotal(a);
    if (sortOrder === 'low') return getInstTotal(a) - getInstTotal(b);
    return 0;
  });

  const locations = ([...new Set(institutes.map(i => i.location.split(', ').pop() || ''))] as string[]).sort();

  const totalSeatsByDept = courses.reduce((acc, course) => {
    acc[course.id] = institutes.reduce((sum: number, inst) => {
      const val = inst.seats[course.id];
      const seats = typeof val === 'object' && val !== null ? (val as DepartmentInfo).seats : Number(val);
      return sum + (seats || 0);
    }, 0);
    return acc;
  }, {} as Record<string, number>);

  const totalSeatsOverall = Object.values(totalSeatsByDept).reduce((sum: number, val) => sum + (val as number), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pb-24" role="main" aria-labelledby="institutes-title">
      <h1 id="institutes-title" className="sr-only">Institutes Explorer</h1>
      {/* Search Header */}
      <div className="pt-24 pb-8 border-b border-slate-100 bg-white/50 backdrop-blur-xl sticky top-0 z-40 mb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            <div className="flex-1 w-full relative group">
              <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 px-6 py-4 rounded-[2rem] focus-within:ring-4 ring-blue-50 transition-all">
                <Search size={24} className="text-slate-400" aria-hidden="true" />
                <input 
                  type="text" 
                  placeholder={t('institutesView.searchPlaceholder')} 
                  className="w-full bg-transparent font-bold text-slate-900 outline-none placeholder:text-slate-300"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  aria-label="Search institutes by name or location"
                />
              </div>
            </div>
            
            <div className="flex gap-3 w-full lg:w-auto">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all ${isSidebarOpen ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' : 'bg-white border border-slate-100 text-slate-600 hover:bg-slate-50'}`}
                aria-expanded={isSidebarOpen}
                aria-controls="filters-sidebar"
                aria-label="Toggle filters"
              >
                <SlidersHorizontal size={18} aria-hidden="true" /> {t('institutesView.filters')}
                {(selectedLocations.length + selectedDepts.length + selectedSeatRanges.length + selectedInstTypes.length) > 0 && (
                  <span className="bg-white text-blue-600 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                    {selectedLocations.length + selectedDepts.length + selectedSeatRanges.length + selectedInstTypes.length}
                  </span>
                )}
              </button>
              
              <button 
                onClick={() => setSortOrder(prev => prev === 'none' ? 'high' : prev === 'high' ? 'low' : 'none')}
                className={`flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all ${sortOrder !== 'none' ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-200' : 'bg-white border border-slate-100 text-slate-600 hover:bg-slate-50'}`}
                aria-label={`Sort by seats: ${sortOrder === 'none' ? 'none' : sortOrder === 'high' ? 'high to low' : 'low to high'}`}
              >
                <ListFilter size={18} aria-hidden="true" />
                {sortOrder === 'none' ? t('institutesView.sort') : sortOrder === 'high' ? t('institutesView.seatsHigh') : t('institutesView.seatsLow')}
              </button>
            </div>
          </div>

          {/* Active Filter Chips */}
          <div className="mt-6 flex flex-wrap gap-2">
            <AnimatePresence mode="popLayout">
              {selectedLocations.map(loc => (
                <motion.button
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  key={`chip-loc-${loc}`}
                  onClick={() => toggleSelection(selectedLocations, setSelectedLocations, loc)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-100 hover:bg-blue-100 transition-colors"
                >
                  <MapPin size={12} /> {loc} <X size={12} />
                </motion.button>
              ))}
              {selectedDepts.map(dept => (
                <motion.button
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  key={`chip-dept-${dept}`}
                  onClick={() => toggleSelection(selectedDepts, setSelectedDepts, dept)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-purple-100 hover:bg-purple-100 transition-colors"
                >
                  <Microscope size={12} /> {dept.toUpperCase()} <X size={12} />
                </motion.button>
              ))}
              {selectedSeatRanges.map(rangeId => {
                const range = SEAT_RANGES.find(r => r.id === rangeId);
                return (
                  <motion.button
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    key={`chip-range-${rangeId}`}
                    onClick={() => toggleSelection(selectedSeatRanges, setSelectedSeatRanges, rangeId)}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-orange-100 hover:bg-orange-100 transition-colors"
                  >
                    <Activity size={12} /> {range?.label} <X size={12} />
                  </motion.button>
                );
              })}
              {selectedInstTypes.map(typeId => {
                const type = INSTITUTE_TYPES.find(t => t.id === typeId);
                return (
                  <motion.button
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    key={`chip-type-${typeId}`}
                    onClick={() => toggleSelection(selectedInstTypes, setSelectedInstTypes, typeId)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100 hover:bg-emerald-100 transition-colors"
                  >
                    <Building2 size={12} /> {type?.label} <X size={12} />
                  </motion.button>
                );
              })}
              {(selectedLocations.length + selectedDepts.length + selectedSeatRanges.length + selectedInstTypes.length) > 0 && (
                <motion.button
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={handleReset}
                  className="text-[9px] font-black text-red-500 uppercase tracking-[0.2em] px-4 py-2 hover:bg-red-50 rounded-full transition-colors"
                >
                  {t('institutesView.resetFilters')}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12">
        {/* Sidebar Filter Panel */}
        <div id="filters-sidebar" className={`lg:block ${isSidebarOpen ? 'block' : 'hidden'}`} role="complementary" aria-label="Filters">
          <div className="sticky top-40 space-y-8 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-2xl shadow-blue-50/50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-black text-slate-900 uppercase tracking-widest text-[10px]">{t('institutesView.advancedExplorer')}</h3>
              <button onClick={handleReset} className="text-slate-400 hover:text-red-500 transition-colors" aria-label="Reset all filters">
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </div>

            {/* Location Section */}
            <div className="space-y-4">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">{t('institutesView.location')}</p>
              <div className="flex flex-wrap gap-2">
                {locations.map(loc => (
                  <button
                    key={loc}
                    onClick={() => toggleSelection(selectedLocations, setSelectedLocations, loc)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-tight transition-all border ${selectedLocations.includes(loc) ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-white'}`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* Department Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('institutesView.department')}</p>
                {selectedDepts.length > 0 && (
                  <button 
                    onClick={() => setSelectedDepts([])}
                    className="text-[8px] font-black text-red-500 uppercase tracking-widest hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="relative group">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text"
                  placeholder="Find Dept..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-10 pr-4 text-[10px] font-bold outline-none focus:ring-2 ring-blue-100 transition-all"
                  onChange={(e) => {
                    const term = e.target.value.toLowerCase();
                    setDeptSearchTerm(term);
                  }}
                />
              </div>
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2 scrollbar-hide">
                {courses.filter(c => c.id.toLowerCase().includes(deptSearchTerm) || t_lang(c.title, c.titleBn).toLowerCase().includes(deptSearchTerm)).map(course => (
                  <button
                    key={course.id}
                    onClick={() => toggleSelection(selectedDepts, setSelectedDepts, course.id)}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${selectedDepts.includes(course.id) ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-white'}`}
                  >
                    <span className="truncate mr-2">{course.id.toUpperCase()}</span>
                    {selectedDepts.includes(course.id) && <CheckCircle2 size={12} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Seat Range Section */}
            <div className="space-y-4">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">{t('institutesView.seatRange')}</p>
              <div className="space-y-2">
                {SEAT_RANGES.map(range => (
                  <button
                    key={range.id}
                    onClick={() => toggleSelection(selectedSeatRanges, setSelectedSeatRanges, range.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${selectedSeatRanges.includes(range.id) ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-white'}`}
                  >
                    {range.label}
                    {selectedSeatRanges.includes(range.id) && <CheckCircle2 size={12} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Institute Type Section */}
            <div className="space-y-4">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">{t('institutesView.instituteSize')}</p>
              <div className="space-y-2">
                {INSTITUTE_TYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => toggleSelection(selectedInstTypes, setSelectedInstTypes, type.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${selectedInstTypes.includes(type.id) ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-white'}`}
                  >
                    {type.label}
                    {selectedInstTypes.includes(type.id) && <CheckCircle2 size={12} />}
                  </button>
                ))}
              </div>
            </div>
            
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="w-full bg-slate-900 text-white py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl"
            >
              {t('institutesView.applyFilters')}
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="space-y-12">
          {/* Warning Banner */}
          <div className="bg-amber-50 border border-amber-200 p-6 rounded-[2.5rem] flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-black text-amber-900 uppercase text-[10px] tracking-wider mb-1">Subject Code Protection</h4>
              <p className="text-amber-800 text-[10px] font-bold leading-relaxed opacity-80 uppercase italic">
                Never confuse subject codes with seat numbers. codes are IDs; Seats are capacities.
              </p>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-10">
            {filteredInstitutes.length > 0 ? (
              filteredInstitutes.map((inst, idx) => {
                const instTotal = getInstTotal(inst);
                return (
                  <motion.div
                    key={inst.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => onNavigate('institute-detail', inst.id)}
                    className="bg-white/60 backdrop-blur-xl rounded-[4rem] border border-white/80 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden group hover:border-blue-400 hover:shadow-[0_40px_80px_-20px_rgba(37,99,235,0.15)] transition-all duration-700 cursor-pointer relative active:scale-[0.98]"
                  >
                    <div className="h-80 relative overflow-hidden">
                      <img 
                        src={INSTITUTE_IMAGES[inst.id] || inst.image || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200'} 
                        alt={inst.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3000ms] ease-out" 
                        referrerPolicy="no-referrer"
                      />
                      {/* Interactive Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-700"></div>
                      
                      {/* Premium Badge */}
                      <div className="absolute top-6 right-6 flex flex-col items-end gap-2">
                         <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-xl">
                            Govt. Institute
                         </div>
                         {inst.id === 'cmh-iht' && (
                            <div className="bg-emerald-600/90 backdrop-blur-md text-white px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-xl border border-white/10 flex items-center gap-1.5">
                               <Shield size={10} /> Military
                            </div>
                         )}
                         {inst.id === 'ssmch-iht' && (
                            <div className="bg-amber-600/90 backdrop-blur-md text-white px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-xl border border-white/10 flex items-center gap-1.5">
                               <Award size={10} /> Legacy
                            </div>
                         )}
                      </div>

                      <div className="absolute bottom-10 left-10 right-10 transform group-hover:-translate-y-2 transition-all duration-700">
                        <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.25em] mb-4 border border-white/10 shadow-lg shadow-blue-500/20">
                          <GraduationCap size={14} aria-hidden="true" /> SMF Standard
                        </div>
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-[1.1] line-clamp-2 drop-shadow-2xl mb-2">{t_lang(inst.name, inst.nameBn)}</h3>
                        <div className="flex items-center gap-2 text-blue-200/80 font-black text-[10px] uppercase tracking-widest">
                           <MapPin size={14} className="text-blue-400" />
                           {t_lang(inst.location, inst.locationBn)}
                        </div>
                      </div>
                    </div>

                    <div className="p-10 pt-12 relative">
                      {/* Accent Decorative Element */}
                      <div className="absolute top-0 right-12 w-20 h-2 bg-blue-600 rounded-b-xl group-hover:h-4 transition-all duration-500"></div>

                      <div className="flex items-center justify-between mb-8">
                        <div>
                           <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Live Registration Status</div>
                           <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                              <span className="text-xs font-black text-slate-900 uppercase">Admission Active</span>
                           </div>
                        </div>
                        <div className="text-right">
                           <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Capacity</div>
                           <div className="text-2xl font-black text-blue-600 tracking-tighter">{formatNumber(instTotal)} <span className="text-[10px] text-slate-300 font-bold ml-1">SEATS</span></div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2.5">
                         {Object.entries(inst.seats).slice(0, 4).map(([deptId, info]) => {
                           const seats = typeof info === 'object' && info !== null ? (info as DepartmentInfo).seats : info;
                           return (
                             <div key={deptId} className="flex-1 min-w-[80px] p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group-hover:bg-white group-hover:border-blue-100 transition-all flex flex-col items-center">
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">{deptId.toUpperCase()}</span>
                                <span className="text-sm font-black text-slate-900">{formatNumber(seats as number)}</span>
                             </div>
                           );
                         })}
                         {Object.keys(inst.seats).length > 4 && (
                           <div className="flex items-center justify-center px-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform">
                             +{Object.keys(inst.seats).length - 4} More
                           </div>
                         )}
                      </div>
                      
                      <div className="mt-10 flex items-center justify-between">
                         <div className="flex -space-x-3">
                            {[1, 2, 3].map(i => (
                               <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center">
                                  <Users size={16} className="text-slate-300" />
                               </div>
                            ))}
                            <div className="w-10 h-10 rounded-full border-4 border-white bg-blue-50 flex items-center justify-center text-[10px] font-black text-blue-600">+1k</div>
                         </div>
                         <button className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest group/more">
                           Course Matrix <ArrowRight size={16} className="group-hover/more:translate-x-1 transition-transform" />
                         </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full py-40 text-center bg-white rounded-[4rem] border border-dashed border-slate-200">
                 <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search size={40} />
                 </div>
                 <h4 className="text-xl font-black text-slate-900 uppercase tracking-widest mb-2">{t('institutesView.noInstitutes')}</h4>
                 <p className="text-slate-400 text-sm font-medium">{t('institutesView.adjustSearch')}</p>
                 <button 
                  onClick={handleReset}
                  className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-95"
                 >
                   {t('institutesView.resetFilters')}
                 </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
