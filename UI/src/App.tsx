import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ProjectSettings from './pages/ProjectSettings';
import PageBuilder from './pages/PageBuilder';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/projects/:id/settings" element={<ProjectSettings />} />
        <Route path="/projects/:projectId/builder/:pageId" element={<PageBuilder />} />
      </Routes>
    </Router>
  );
}

export default App;
