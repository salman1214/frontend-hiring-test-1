import './App.css'
import React, {lazy} from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import Home from './pages/Home';
const Home = lazy(() => import('./pages/Home'))
import Login from './pages/Login';
import { AuthProvider } from './Context/AuthContext';
import Navbar from './components/Navbar';

function App() {
  const routes = [
    {
      path: '/',
      element: <Home />
    },
    {
      path: '/login',
      element: <Login />
    }
  ]
  return (
    <Router>
      <AuthProvider>
        <div>
          <Navbar />
          <Routes>
            {routes.map((route, index) => (
              <Route key={index} {...route} />
            ))}
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
