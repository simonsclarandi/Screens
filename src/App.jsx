import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import RolesScreen from './views/roles/RolesScreen';
import UsersScreen from './views/usuarios/UsersScreen';
import PermissionsScreen from './views/permisos/PermissionsScreen';

// Componentes temporales para evitar errores hasta que los creemos
const Placeholder = ({ name }) => <div className="p-4 text-gray-600 italic">Pantalla de {name} en construcción...</div>;

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/roles" />} />
          <Route path="/roles" element={<RolesScreen />} />
          <Route path="/permisos" element={<PermissionsScreen />} />
          <Route path="/usuarios" element={<UsersScreen />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;