import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login        from "../pages/Login";
import Cadastro     from "../pages/Cadastro";
import Dashboard    from "../pages/Dashboard";
import Medicamentos from "../pages/Medicamentos";
import Rotina       from "../pages/Rotina";
import Cuidador     from "../pages/Cuidador";
import Idoso        from "../pages/Idoso";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={<Login />} />
        <Route path="/cadastro"    element={<Cadastro />} />
        <Route path="/dashboard"   element={<Dashboard />} />
        <Route path="/medicamentos" element={<Medicamentos />} />
        <Route path="/rotina"      element={<Rotina />} />
        <Route path="/cuidador"    element={<Cuidador />} />
        <Route path="/idoso"       element={<Idoso />} />
        <Route path="*"            element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}