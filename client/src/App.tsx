import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/ui/theme-provider"
import { Toaster } from "./components/ui/toaster"
import { AuthProvider } from "./contexts/AuthContext"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { Layout } from "./components/Layout"
import { Dashboard } from "./pages/Dashboard"
import { PetDetail } from "./pages/PetDetail"
import { PetForm } from "./pages/PetForm"
import { AIBehavior } from "./pages/AIBehavior"
import { Chat } from "./pages/Chat"
import { Locations } from "./pages/Locations"
import { Schedule } from "./pages/Schedule"
import { AppointmentForm } from "./pages/AppointmentForm"
import { Profile } from "./pages/Profile"
import { BlankPage } from "./pages/BlankPage"
import LostPets from "./pages/LostPets";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="pets/add" element={<PetForm />} />
              <Route path="pets/:id" element={<PetDetail />} />
              <Route path="pets/:id/edit" element={<PetForm />} />
              <Route path="ai-behavior" element={<AIBehavior />} />
              <Route path="chat" element={<Chat />} />
              <Route path="locations" element={<Locations />} />
              <Route path="schedule" element={<Schedule />} />
              <Route path="schedule/add" element={<AppointmentForm />} />
              <Route path="schedule/:id" element={<AppointmentForm />} />
              <Route path="profile" element={<Profile />} />
              <Route path="/lost-pets" element={<LostPets />} />

            </Route>
            <Route path="*" element={<BlankPage />} />
          </Routes>
        </Router>
        <Toaster />
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App