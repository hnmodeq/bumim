import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "@/layouts/RootLayout";
import LoadingScreen from "@/sections/LoadingScreen";


const Home = lazy(() => import("@/pages/Home"));
const About = lazy(() => import("@/pages/About"));
const Portfolio = lazy(() => import("@/pages/Portfolio"));
const ProjectDetails = lazy(() => import("@/pages/ProjectDetails"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const Contact = lazy(() => import("@/pages/Contact"));
const Terms = lazy(() => import("@/pages/Terms"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "portfolio",
                element: <Portfolio />,
            },

            {
                path: "portfolio/:slug",
                element: <ProjectDetails />,
            },
            {
                path: "about",
                element: <About />,
            },
            {
                path: "pricing",
                element: <Pricing />,
            },
            {
                path: "contact",
                element: <Contact />,
            },
            {
                path: "terms",
                element: <Terms />,
            },
            {
                path: "*",
                element: <NotFound />,
            },
        ],
    },
]);

const App = () => {
    return (
        <Suspense fallback={<LoadingScreen />}>
            <RouterProvider router={router} />
        </Suspense>
    );
};

export default App;
