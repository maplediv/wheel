import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CompanyList from './components/CompanyList';
import CompanyDetail from './components/CompanyDetail';
import JobList from './components/JobList';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import NavBar from './components/NavBar';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/companies" element={<CompanyList />} />
          <Route path="/companies/:handle" element={<CompanyDetail />} />
          <Route path="/jobs" element={<JobList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

<Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />


export default App;
