import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Para redireccionar al usuario después del login
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${backendUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Datos de respuesta en login:", data); // Debug: imprime la respuesta completa

        // Guarda el token y el nombre en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('nombre', data.nombre);
        localStorage.setItem('userId', data.id);

        alert('Inicio de sesión exitoso');

        // Actualizar manualmente la Navbar al iniciar sesión
        const updateUserEvent = new Event('storage');
        window.dispatchEvent(updateUserEvent);

        // Redirigir al inicio
        navigate('/inicio');
      } else {
        const errorData = await response.json();
        alert(`Error en el inicio de sesión: ${errorData.error || 'Credenciales incorrectas'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error en la conexión con el servidor');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingresa tu email"
              required
            />
          </div>
          <div className="input-group">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
        </form>
        <p className="text-footer">
          ¿No tienes una cuenta? <Link to="/registro">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;