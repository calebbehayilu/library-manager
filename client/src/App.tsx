import { BrowserRouter as Router, Routes, Route } from "react-router";
import { LoginPage } from "./pages/login";
import { AuthProvider } from "./auth/auth-context";
import { ProtectedRoute } from "./auth/protected-route";
import { Layout } from "./components/layout";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
