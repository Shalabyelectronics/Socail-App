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
import Settings from "./pages/Settings/Settings.jsx";
import UpdateProfileImage from "./components/UpdateProfileImage/UpdateProfileImage.jsx";
import ChangePassword from "./components/ChangePassword/ChangePassword.jsx";
import NotificationsProvider from "./components/NotificationsContext/NotificationsProvider.jsx";
import Notifications from "./pages/Notifications/Notifications.jsx";

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
          path: "notifications",
          element: (
            <AppProtectedRoutes>
              <Notifications />
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
        {
          path: "setting",
          element: (
            <AppProtectedRoutes>
              <Settings />
            </AppProtectedRoutes>
          ),
          children: [
            {
              index: true,
              element: <UpdateProfileImage />,
            },
            {
              path: "update-profile-image",
              element: <UpdateProfileImage />,
            },
            {
              path: "change-password",
              element: <ChangePassword />,
            },
          ],
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
        <NotificationsProvider>
          <ToastContainer />
          <RouterProvider router={routes} />
        </NotificationsProvider>
      </AuthContextProvider>
    </>
  );
}

export default App;
