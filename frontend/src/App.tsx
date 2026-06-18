import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom"
import LoginPage from "./pages/login"
import RegisterPage from "./pages/register"
import Dashboard from "./pages/dashboard"
import Assignments from "./pages/assignments"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SidebarComponent } from "@/components/SidebarComponent"
import { HeaderComponent } from "@/components/HeaderComponent"

function ProtectedRoute() {
  const isAuthenticated = !!localStorage.getItem("authToken") 
  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}

function PublicRoute() {
  const isAuthenticated = !!localStorage.getItem("authToken")
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }
  return <Outlet />
}

function AppLayout() {
  return (
    <SidebarProvider className="h-screen w-screen overflow-hidden">
      <SidebarComponent />
      <SidebarInset className="flex flex-col h-full overflow-y-auto bg-uts-main">
        <HeaderComponent />
        <main className="flex-1 p-8 max-w-[2000px] w-full mx-auto flex flex-col gap-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/assignments" element={<Assignments />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App