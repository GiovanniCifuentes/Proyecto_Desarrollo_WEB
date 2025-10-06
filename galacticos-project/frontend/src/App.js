import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import CustomNavbar from './components/common/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Eventos from './pages/Eventos';
import EventoDetalle from './pages/EventoDetalle';
import Reservas from './pages/Reservas';
import Perfil from './pages/Perfil';
import AdminEventos from './pages/admin/AdminEventos';
import AdminColas from './pages/admin/AdminColas';
import NotFound from './pages/NotFound';
import ReservaEvento from './pages/ReservaEvento';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <CustomNavbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/eventos" element={<Eventos />} />
            <Route path="/eventos/:id" element={<EventoDetalle />} />
            
            {/* Rutas protegidas */}
            <Route 
              path="/reservas" 
              element={
                <ProtectedRoute>
                  <Reservas />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/perfil" 
              element={
                <ProtectedRoute>
                  <Perfil />
                </ProtectedRoute>
              } 
            />
            
            {/* Rutas de administración */}
            <Route 
              path="/admin/eventos" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminEventos />
                </ProtectedRoute>
              } 
            />
            <Route
  path="/eventos/:id/reservar"
  element={
    <ProtectedRoute>
      <ReservaEvento />
    </ProtectedRoute>
  }
/>
            <Route 
              path="/admin/colas" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminColas />
                </ProtectedRoute>
              } 
            />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
