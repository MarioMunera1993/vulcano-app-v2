// ============================================================
// Layout.jsx
// ------------------------------------------------------------
// Página principal a la que llega el usuario después del login
// exitoso. Tiene tres zonas en el sidebar izquierdo:
//
//   ZONA SUPERIOR → Foto de perfil + nombre + username
//   ZONA MEDIA    → Botón "Cursos" (navega a /Course)
//   ZONA INFERIOR → "Modificar Perfil" y "Cerrar sesión"
//
// Los datos del usuario se leen de localStorage.
// Cuando el usuario hizo login, guardamos el objeto User
// completo que devolvió el backend. Aquí lo recuperamos.
// ============================================================

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Layout.css";
import EditProfileModal from "../../components/EditProfileModal";
import { getUserById } from "../../services/api";

const Layout = ({ children }) => {
  const navigate = useNavigate();

  // ----------------------------------------------------------
  // PASO 1: Estado para los datos del usuario
  // ----------------------------------------------------------
  const [user, setUser] = useState(() => {
    const userRaw = localStorage.getItem("user");
    return userRaw ? JSON.parse(userRaw) : null;
  });

  // ----------------------------------------------------------
  // PASO 2: useEffect para leer de la base de datos (BD)
  // ----------------------------------------------------------
  useEffect(() => {
    if (user && user.id) {
      getUserById(user.id)
        .then((freshUser) => {
          setUser(freshUser);
          localStorage.setItem("user", JSON.stringify(freshUser));
        })
        .catch((err) => {
          console.error("Error al sincronizar con la BD:", err);
        });
    } else {
      navigate("/Login");
    }
  }, []);

  // Extraemos los datos del perfil con valores por defecto (fallbacks)
  const firstName  = user?.profile?.firstName       || "Usuario";
  const lastName   = user?.profile?.lastName        || "";
  // Traducimos el rol de inglés (BD) a español (Display)
  const roleDisplay = user?.role === "ADMIN" ? "ADMINISTRADOR" : "USUARIO";
  const profilePic = user?.profile?.profilePictureUrl || null;

  // ----------------------------------------------------------
  // PASO 3: Estado para mostrar/ocultar el modal de edición
  // ----------------------------------------------------------
  const [showEditModal, setShowEditModal] = useState(false);

  // ----------------------------------------------------------
  // handleLogout: Limpia la sesión y redirige al Login
  // ----------------------------------------------------------
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/Login");
  };

  // ----------------------------------------------------------
  // handleProfileUpdated: Callback que llama el modal al guardar
  // ----------------------------------------------------------
  const handleProfileUpdated = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setShowEditModal(false);
  };

  return (
    <div className="layout-container">
      <aside className="layout-sidebar">
        <div 
          className="sidebar-profile" 
          onClick={() => navigate("/Dashboard")}
          style={{ cursor: "pointer" }}
          title="Ir al Inicio"
        >
          {profilePic ? (
            <img
              src={profilePic}
              alt={`Foto de perfil de ${firstName}`}
              className="sidebar-avatar"
            />
          ) : (
            <div className="sidebar-avatar-placeholder">👤</div>
          )}
          <p className="sidebar-name">{firstName} {lastName}</p>
          <p className="sidebar-role">{roleDisplay}</p>
        </div>

        <nav className="sidebar-nav">
          <button
            className="sidebar-nav-btn"
            onClick={() => navigate("/Dashboard")}
          >
            <span className="btn-icon">🏠</span>
            Inicio
          </button>

          <button
            className="sidebar-nav-btn"
            onClick={() => navigate("/Course")}
          >
            <span className="btn-icon">📚</span>
            Cursos
          </button>

          {/* Opción solo para Administradores */}
          {user?.role === "ADMIN" && (
            <button
              className="sidebar-nav-btn"
              onClick={() => navigate("/Users")}
            >
              <span className="btn-icon">👥</span>
              Usuarios
            </button>
          )}
        </nav>

        <div className="sidebar-footer">
          <button
            className="sidebar-footer-btn"
            onClick={() => setShowEditModal(true)}
          >
            <span>✏️</span>
            Modificar Perfil
          </button>

          <button
            className="sidebar-footer-btn danger"
            onClick={handleLogout}
          >
            <span>🚪</span>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="layout-content-area">
        {children}
      </main>

      {showEditModal && user && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onSaved={handleProfileUpdated}
        />
      )}
    </div>
  );
};

export default Layout;
