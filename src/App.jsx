import MainLayout from "./Layouts/MainLayout/MainLayout.jsx";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "./Layouts/AuthLayout/AuthLayout";
import NewsFeed from "./pages/NewsFeed/NewsFeed.jsx";
import UserPosts from "./pages/UserPosts/UserPosts.jsx";
import Bookmarks from "./pages/Bookmarks/Bookmarks.jsx";
import NotFound from "./pages/NotFound/NotFound.jsx";
import Login from "./pages/Authentication/Login/Login.jsx";
import Register from "./pages/Authentication/Register/Register.jsx";
import { ToastContainer } from "react-toastify";
import AppProtectedRoutes from "./components/ProtectedRoutes/AppProtectedRoutes.jsx";
import AuthProtextedRoutes from "./components/ProtectedRoutes/AuthProtextedRoutes.jsx";
import AuthContextProvider from "./components/AuthContext/AuthContextProvider.jsx";
import PostDetails from "./components/PostDetails/PostDetails.jsx";

function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: (
            <AppProtectedRoutes>
              <NewsFeed />
            </AppProtectedRoutes>
          ),
        },
        {
          path: "bookmarks",
          element: (
            <AppProtectedRoutes>
              <Bookmarks />
            </AppProtectedRoutes>
          ),
        },
        {
          path: "profile",
          element: (
            <AppProtectedRoutes>
              <UserPosts />
            </AppProtectedRoutes>
          ),
        },
        {
          path: "post/:id",
          element: (
            <AppProtectedRoutes>
              <PostDetails />
            </AppProtectedRoutes>
          ),
        },
        { path: "*", element: <NotFound /> },
      ],
    },
    {
      path: "/",
      element: <AuthLayout />,
      children: [
        {
          path: "login",
          element: (
            <AuthProtextedRoutes>
              <Login />
            </AuthProtextedRoutes>
          ),
        },
        {
          path: "register",
          element: (
            <AuthProtextedRoutes>
              <Register />{" "}
            </AuthProtextedRoutes>
          ),
        },
      ],
    },
  ]);

  return (
    <>
      <AuthContextProvider>
        <ToastContainer />
        <RouterProvider router={routes} />
      </AuthContextProvider>
    </>
  );
}

export default App;
