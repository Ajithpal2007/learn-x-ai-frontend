// /src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// It's a good practice to keep your global CSS import here
import './App.css';

// Import all the page components with corrected, case-sensitive paths
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MyProfile from './pages/MyProfile';
import Assessments from './pages/Assessments';
import CareerMatches from './pages/CareerMatches';
import MyRoadmap from './pages/MyRoadmap';
import ExplorationHub from './pages/ExplorationHub';
import ResourceLibrary from './pages/ResourceLibrary';
import IndiaDatabases from './pages/IndiaDatabases';
import SkillBuilding from './pages/SkillBuilding';
import AiTools from './pages/AiTools';
import Community from './pages/Community';
import Support from './pages/Support';
import Legal from './pages/Legal';
import Pricing from './pages/Pricing';
import AboutUs from './pages/AboutUs';
import Blog from './pages/Blog';
import ForSchools from './pages/ForSchools';
import ProfileGuidance from './pages/ProfileGuidance';
import AiChatbot from './pages/AiChatbot';
import StudentProfile from './pages/StudentProfile';
import FindAMentor from './pages/FindAMentor';
import EntranceExams from './pages/EntranceExams';
import BoardExamPrep from './pages/BoardExamPrep';
import SavedItems from './pages/SavedItems';
import ExploreColleges from './pages/ExploreColleges';
import ParentsCorner from './pages/ParentsCorner';
import VocationalTraining from './pages/VocationalTraining';
import Webinars from './pages/Webinars';
import Settings from './pages/Settings';
import MyLearningDashboard from './pages/MyLearningDashboard';
import EntrepreneurshipHub from './pages/EntrepreneurshipHub';
import { AuthProvider } from './context/AuthContext'; 


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ======================================== */}
          {/* Public-Facing Pages                    */}
          {/* ======================================== */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          
          {/* ======================================== */}
          {/* Main Application (Dashboard) Pages     */}
          {/* ======================================== */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/assessments" element={<Assessments />} />
          <Route path="/career-matches" element={<CareerMatches />} />
          <Route path="/my-roadmap" element={<MyRoadmap />} />
          <Route path="/exploration-hub" element={<ExplorationHub />} />
          <Route path="/resource-library" element={<ResourceLibrary />} />
          <Route path="/india-databases" element={<IndiaDatabases />} />
          <Route path="/skill-building" element={<SkillBuilding />} />
          <Route path="/ai-tools" element={<AiTools />} />
          <Route path="/community" element={<Community />} />
          <Route path="/student-profile" element={<StudentProfile />} />
          <Route path="/find-a-mentor" element={<FindAMentor />} />
          <Route path="/entrance-exams" element={<EntranceExams />} />
          <Route path="/board-exam-prep" element={<BoardExamPrep />} />
          <Route path="/saved-items" element={<SavedItems />} />
          <Route path="/explore-colleges" element={<ExploreColleges />} />
          <Route path="/parents-corner" element={<ParentsCorner />} />
          <Route path="/vocational-training" element={<VocationalTraining />} />
          <Route path="/webinars" element={<Webinars />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/learning-dashboard" element={<MyLearningDashboard />} />
          <Route path="/entrepreneurship-hub" element={<EntrepreneurshipHub />} />
          
          {/* ======================================== */}
          {/* Informational & Other Pages          */}
          {/* ======================================== */}
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/for-schools" element={<ForSchools />} />
          <Route path="/profile-guidance" element={<ProfileGuidance />} />
          <Route path="/ai-chatbot" element={<AiChatbot />} />
          
          {/* ======================================== */}
          {/* Support & Legal Pages                  */}
          {/* ======================================== */}
          <Route path="/support" element={<Support />} />
          <Route path="/legal" element={<Legal />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;