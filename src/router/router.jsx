import { BrowserRouter, Route, Routes } from "react-router-dom";
import VulcanHome from "../pages/VulcanHome"
import VulcanoLogin from "../components/VulcanoLogin";
import VulcanoRegister from "../components/VulcanoRegister";
import Review from "../pages/Review";
import { Page404 } from "../pages/Page404"
import ModuleView from "../pages/ModuleView"
import CoursePage from "../pages/CoursePage"
import UserManagement from "../pages/UserManagement";
import Dashboard from "../pages/Dashboard";

export const MyRoutes = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<VulcanHome />} />
            <Route path="/Login" element={<VulcanoLogin />} />
            <Route path="/Register" element={<VulcanoRegister />} />
            <Route path="/Course" element={<CoursePage />} />
            <Route path="/ModuleView" element={<ModuleView />} />
            <Route path="/Review" element={<Review />} />
            <Route path="/Users" element={<UserManagement />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            {/* Redirección por defecto para el antiguo /layout */}
            <Route path="/layout" element={<Dashboard />} />
            <Route path="*" element={<Page404 />} />
        </Routes>
    </BrowserRouter>
)
