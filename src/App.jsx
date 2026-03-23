import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AppLayout from "./layout/AppLayout";
import OnboardingPage from "./pages/OnboardingPage";
import Jobs from "./pages/Jobs";
import PostJob from "./pages/PostJob";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
      {
        path: "/jobs",
        element: (
          <ProtectedRoute>
            <Jobs />
          </ProtectedRoute>
        ),
      },
      {
        path: "/post-job",
        element: (
          <ProtectedRoute>
            <PostJob />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/onboarding",
    element: <OnboardingPage />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
