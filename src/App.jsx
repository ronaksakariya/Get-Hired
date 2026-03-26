import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AppLayout from "./layout/AppLayout";
import OnboardingPage from "./pages/OnboardingPage";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import PostJob from "./pages/PostJob";
import MyApplications from "./pages/MyApplications";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
      {
        path: "/jobs",
        element: <Jobs />,
      },
      {
        path: "/job/:id",
        element: <JobDetails />,
      },
      {
        path: "/post-job",
        element: (
          <ProtectedRoute allowedRole="recruiter">
            <PostJob />
          </ProtectedRoute>
        ),
      },
      {
        path: "/my-applications",
        element: (
          <ProtectedRoute allowedRole="candidate">
            <MyApplications />
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
