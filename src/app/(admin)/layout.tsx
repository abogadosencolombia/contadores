"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React, { ReactNode } from "react";
import { useAuth } from '@/hooks/useAuth';
import Alert from '@/components/ui/alert/Alert';

// Componente para mostrar mientras se carga la autenticación
const AuthLoading = () => (
  <div className="flex justify-center items-center h-screen w-full">
    <div className="text-lg">Verificando autenticación y permisos...</div>
  </div>
);

// Componente para mostrar cuando el acceso es denegado
// Mantenemos el AppHeader para que el usuario pueda navegar a otras secciones o cerrar sesión
const AccessDenied = () => (
    <div className="min-h-screen">
        <AppHeader />
        <div className="p-4 mx-auto max-w-screen-2xl md:p-6 mt-10">
            <Alert variant="error" title="Acceso Denegado">
            No tienes los permisos necesarios para acceder a esta sección. Por favor, contacta a un administrador.
            </Alert>
        </div>
    </div>
);


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { user, isLoading, error } = useAuth();

  // 1. Estado de carga de la autenticación
  if (isLoading) {
    return <AuthLoading />;
  }

  // 2. Si hay error, no hay usuario, o no es admin, denegar acceso
  if (error || !user || !user.roles?.includes('admin')) {
    return <AccessDenied />;
  }

  // 3. Si el usuario es admin, mostrar el layout normal
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      <AppSidebar />
      <Backdrop />
      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AppHeader />
        {/* Page Content */}
        <div className="p-4 mx-auto max-w-screen-2xl md:p-6">{children}</div>
      </div>
    </div>
  );
}