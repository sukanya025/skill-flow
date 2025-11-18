import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';

// Import page components
import HomePage from '@/components/pages/HomePage';
import FreelancerDirectory from '@/components/pages/FreelancerDirectory';
import FreelancerProfile from '@/components/pages/FreelancerProfile';
import JobBoard from '@/components/pages/JobBoard';
import JobDetails from '@/components/pages/JobDetails';
import PostJob from '@/components/pages/PostJob';
import ClientMetrics from '@/components/pages/ClientMetrics';
import ReputationLedger from '@/components/pages/ReputationLedger';

// Layout component that includes ScrollToTop
function Layout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "freelancers",
        element: <FreelancerDirectory />,
      },
      {
        path: "freelancer/:id",
        element: <FreelancerProfile />,
      },
      {
        path: "jobs",
        element: <JobBoard />,
      },
      {
        path: "job/:id",
        element: <JobDetails />,
      },
      {
        path: "post-job",
        element: <PostJob />,
      },
      {
        path: "metrics",
        element: <ClientMetrics />,
      },
      {
        path: "reputation",
        element: <ReputationLedger />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_NAME,
});

export default function AppRouter() {
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}
