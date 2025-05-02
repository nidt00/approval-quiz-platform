
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RegistrationPendingPage from "./pages/RegistrationPendingPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import CourseManagePage from "./pages/admin/CourseManagePage";
import StudentDashboardPage from "./pages/student/StudentDashboardPage";
import TakeQuizPage from "./pages/student/TakeQuizPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-quiz-background">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/registration-pending" element={<RegistrationPendingPage />} />
                
                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                <Route path="/admin/courses/:courseId" element={<CourseManagePage />} />
                
                {/* Student Routes */}
                <Route path="/student/dashboard" element={<StudentDashboardPage />} />
                <Route path="/student/quiz/:courseId" element={<TakeQuizPage />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
