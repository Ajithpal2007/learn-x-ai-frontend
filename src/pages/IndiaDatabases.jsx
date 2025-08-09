// /src/pages/IndiaDatabases.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// --- MOCK DATA for Scholarships ---
// This data is used until a backend endpoint for scholarships is created.
const scholarshipsData = [
  { id: 1, name: 'Post-Matric Scholarship for Minorities', provider: 'Government', field: 'All', amount: 'Up to ₹10,000/yr' },
  { id: 2, name: 'HDFC Bank Parivartan\'s Scholarship', provider: 'Private', field: 'All', amount: 'Up to ₹75,000' },
  { id: 3, name: 'L\'Oréal India For Young Women in Science', provider: 'Private', field: 'Science', amount: '₹2,50,000' },
];

// --- UI Component: CollegeRow ---
const CollegeRow = ({ college }) => (
    <div className="grid grid-cols-10 gap-4 items-center p-4 border-b border-gray-200 last:border-b-0 hover:bg-primary/5 transition-colors">
      <div className="col-span-4 flex items-center gap-4">
        <div>
          <p className="font-bold text-dark">{college.name}</p>
          <p className="text-sm text-gray-500">{college.location}</p>
        </div>
      </div>
      <div className="col-span-2 text-center">
        <p className="font-semibold text-primary">#{college.nirf_ranking}</p>
        <p className="text-xs text-gray-500">NIRF Rank</p>
      </div>
      <div className="col-span-2 text-center">
        <p className="font-semibold text-primary">{college.fees}</p>
        <p className="text-xs text-gray-500">Avg. Fees</p>
      </div>
      <div className="col-span-2 text-center">
        <a 
            href={college.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary/10 text-primary font-semibold py-2 px-5 rounded-lg hover:bg-primary/20 transition-colors"
        >
            View
        </a>
      </div>
    </div>
);

// --- UI Component: ScholarshipRow ---
const ScholarshipRow = ({ scholarship }) => (
    <div className="grid grid-cols-10 gap-4 items-center p-4 border-b border-gray-200 last:border-b-0 hover:bg-secondary/5 transition-colors">
      <div className="col-span-4 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold ${scholarship.provider === 'Government' ? 'bg-orange-500' : 'bg-secondary'}`}>
            {scholarship.provider.charAt(0)}
        </div>
        <div>
            <p className="font-bold text-dark">{scholarship.name}</p>
            <p className="text-sm text-gray-500">{scholarship.provider}</p>
        </div>
      </div>
      <div className="col-span-2 text-center">
        <p className="font-semibold text-dark">{scholarship.field}</p>
        <p className="text-xs text-gray-500">Field</p>
      </div>
      <div className="col-span-2 text-center">
        <p className="font-semibold text-secondary">{scholarship.amount}</p>
        <p className="text-xs text-gray-500">Amount</p>
      </div>
      <div className="col-span-2 text-center">
        <button className="bg-secondary/10 text-secondary font-semibold py-2 px-5 rounded-lg hover:bg-secondary/20 transition-colors">Apply</button>
      </div>
    </div>
);


function IndiaDatabases() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  
  const [currentTab, setCurrentTab] = useState('colleges');
  const [filters, setFilters] = useState({ collegeSearch: '', stream: 'All Streams', scholarshipSearch: '', provider: 'all' });

  // State for storing fetched college data, loading, and errors
  const [colleges, setColleges] = useState([]);
  const [loadingColleges, setLoadingColleges] = useState(true);
  const [errorColleges, setErrorColleges] = useState('');

  // Fetch college data from the backend when the component mounts
  useEffect(() => {
    const fetchColleges = async () => {
        setLoadingColleges(true);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/colleges`, config);
            setColleges(data);
        } catch (err) {
            setErrorColleges('Failed to load the list of colleges.');
        } finally {
            setLoadingColleges(false);
        }
    };
    fetchColleges();
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleFilterChange = (key, value) => setFilters(prev => ({...prev, [key]: value}));

  // Filtering for colleges is performed on the live data from the state
  const filteredColleges = colleges.filter(c => 
    c.name.toLowerCase().includes(filters.collegeSearch.toLowerCase()) && 
    (filters.stream === 'All Streams' || c.stream === filters.stream)
  );
  
  // Filtering for scholarships is performed on the mock data
  const filteredScholarships = scholarshipsData.filter(s => 
    s.name.toLowerCase().includes(filters.scholarshipSearch.toLowerCase()) &&
    (filters.provider === 'all' || s.provider === filters.provider)
  );

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <div className="flex h-screen bg-light-gray">
      <Sidebar isOpen={isSidebarOpen} />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        <Header title="India-Specific Databases" onToggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
            <h1 className="text-4xl font-bold text-dark mb-2">Indian Education Hub</h1>
            <p className="text-gray-600 mb-8">Your curated guide to top colleges and scholarships across India.</p>

            <div className="flex border-b border-gray-200 mb-6">
                <button onClick={() => setCurrentTab('colleges')} className={`px-6 py-3 font-semibold ${currentTab === 'colleges' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}>College Database</button>
                <button onClick={() => setCurrentTab('scholarships')} className={`px-6 py-3 font-semibold ${currentTab === 'scholarships' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}>Scholarship Finder</button>
            </div>
            
            <AnimatePresence mode="wait">
                <motion.div key={currentTab} variants={contentVariants} initial="hidden" animate="visible" exit="exit">
                    {currentTab === 'colleges' && (
                    <>
                        <section className="bg-white p-4 rounded-xl shadow-md mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input type="text" value={filters.collegeSearch} onChange={(e) => handleFilterChange('collegeSearch', e.target.value)} className="md:col-span-2 w-full p-3 border border-gray-200 rounded-lg" placeholder="Search by college name..."/>
                            <select value={filters.stream} onChange={(e) => handleFilterChange('stream', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                <option>All Streams</option><option>Engineering</option><option>Medical</option><option>Commerce</option>
                            </select>
                        </section>
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            {loadingColleges && <p className="p-4 text-center text-gray-500">Loading colleges...</p>}
                            {errorColleges && <p className="p-4 text-center text-red-500">{errorColleges}</p>}
                            {!loadingColleges && !errorColleges && filteredColleges.map((c) => <CollegeRow key={c._id} college={c} />)}
                        </div>
                    </>
                    )}

                    {currentTab === 'scholarships' && (
                    <>
                        <section className="bg-white p-4 rounded-xl shadow-md mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input type="text" value={filters.scholarshipSearch} onChange={(e) => handleFilterChange('scholarshipSearch', e.target.value)} className="md:col-span-2 w-full p-3 border border-gray-200 rounded-lg" placeholder="Search by scholarship name..."/>
                            <select value={filters.provider} onChange={(e) => handleFilterChange('provider', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                <option value="all">All Providers</option><option value="Government">Government</option><option value="Private">Private</option>
                            </select>
                        </section>
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            {filteredScholarships.map((s) => <ScholarshipRow key={s.id} scholarship={s} />)}
                        </div>
                    </>
                    )}
                </motion.div>
            </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default IndiaDatabases;