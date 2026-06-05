import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginPage from "./pages/login"
import RegisterPage from "./pages/register"
import Dashboard from "./pages/dashboard"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/pages/dashboard"
          element={
            <SidebarProvider className="h-screen w-screen overflow-hidden">
              <AppSidebar />
              <div className="flex flex-col flex-1 h-full overflow-y-auto bg-uts-main">
                <AppHeader />
                <main className="flex-1 p-8 max-w-[1600px] w-full mx-auto flex flex-col gap-6">
                  <Dashboard />
                </main>
              </div>
            </SidebarProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App