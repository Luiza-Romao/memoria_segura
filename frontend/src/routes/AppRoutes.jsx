import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Medicamentos from "../pages/Medicamentos";
import Rotina from "../pages/Rotina";
import Cuidador from "../pages/Cuidador";
import Idoso from "../pages/Idoso";

/**
 * Rotas do app.
 * Mudanca: rota "*" cai pro Login para evitar tela em branco em URL invalida.
 */
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/medicamentos" element={<Medicamentos />} />
        <Route path="/rotina" element={<Rotina />} />
        <Route path="/cuidador" element={<Cuidador />} />
        <Route path="/idoso" element={<Idoso />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
