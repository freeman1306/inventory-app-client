import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import NavigationMenu from './components/NavigationMenu';
import TopMenu from './components/TopMenu';
import InstallPWA from './components/InstallPWA';
import LoadingSpinner from './components/LoadingSpinner';
import './i18n';
import './App.css';

// Lazy loading for pages
const Orders = lazy(() => import('./pages/Orders'));
const Products = lazy(() => import('./pages/Products'));

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <LoadingSpinner />;

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

const AppContent: React.FC = () => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Login />;
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-2 p-0">
                    <NavigationMenu />
                </div>
                <div className="col-10">
                    <TopMenu />
                    <Suspense fallback={<LoadingSpinner />}>
                        <Routes>
                            <Route path="/" element={<Orders />} />
                            <Route path="/products" element={<Products />} />
                        </Routes>
                    </Suspense>
                </div>
            </div>
            <InstallPWA />
        </div>
    );
};

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/*"
                        element={
                            <ProtectedRoute>
                                <AppContent />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;