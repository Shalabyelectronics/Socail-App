import React, { useContext } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  Input,
  Badge,
  Skeleton,
} from "@heroui/react";
import { LuMessageSquareHeart } from "react-icons/lu";
import { FaBell } from "react-icons/fa";
import { Bookmark, Users, House } from "lucide-react";

import socialAppLogo from "../../assets/auth/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext/AuthContextProvider";
import { FeedContext } from "../FeedContext/FeedContextProvider";
import { NotificationsContext } from "../NotificationsContext/NotificationsProvider";
export default function NavbarUI() {
  const { setToken, user, userPhoto } = useContext(AuthContext);
  const { unreadCount, isUnreadCountLoading } =
    useContext(NotificationsContext);
  const { bookmarkCount, isBookmarkCountLoading } = useContext(FeedContext);
  const navigate = useNavigate();

  const handleNavigateToBookmarks = () => {
    navigate("/bookmarks", { replace: true });
  };
  const handleNavigateToNotifications = () => {
    navigate("/notifications", { replace: true });
  };
  const handleNavigateToHome = () => {
    navigate("/", { replace: true });
  };
  return (
    <Navbar maxWidth="xl">
      <Link to="/" className="cursor-pointer">
        <NavbarBrand>
          <img src={socialAppLogo} alt="Socail App logo" width={90} />
          <p className="hidden md:block font-bold text-inherit">Social App</p>
        </NavbarBrand>
      </Link>
      {/* Maybe later I can Activate this feature to let user search about posts  */}
      {/* <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <Input fullWidth={true} label="Search" radius="full" className="" />
      </NavbarContent> */}

      <NavbarContent as="div" justify="end">
        <NavbarContent justify="end">
          <button
            type="button"
            onClick={handleNavigateToHome}
            aria-label="Go to news feed"
            className="bg-gray-200 rounded-full size-10 cursor-pointer flex justify-center items-center hover:bg-gray-300 transition-colors"
          >
            <House size={22} className="text-gray-700" />
          </button>
          <button
            type="button"
            onClick={handleNavigateToNotifications}
            aria-label="view notifications page"
            className="bg-gray-200 rounded-full size-10 cursor-pointer flex justify-center items-center "
          >
            {isUnreadCountLoading ? (
              <Skeleton className="w-5 h-5 rounded-full" />
            ) : (
              <Badge color="primary" content={unreadCount} size="md">
                <FaBell className="size-5 sm:size-5.5" />
              </Badge>
            )}
          </button>
          {/* Maybe later we can activate it if users can send message to each others */}
          {/* <div className="bg-gray-200 rounded-full size-[40px] cursor-pointer flex justify-center items-center ">
            <Badge color="primary" content="5" size="md">
              <LuMessageSquareHeart className="text-gray-700 size-[20px] sm:size-[22px]" />
            </Badge>
          </div> */}
          <button
            type="button"
            onClick={handleNavigateToBookmarks}
            className="bg-gray-200 rounded-full size-10 cursor-pointer flex justify-center items-center hover:bg-gray-300 transition-colors"
            aria-label="View bookmarked posts"
          >
            {isBookmarkCountLoading ? (
              <Skeleton className="w-5 h-5 rounded-full" />
            ) : (
              <Badge color="primary" content={bookmarkCount} size="md">
                <Bookmark size={22} className="text-gray-700" />
              </Badge>
            )}
          </button>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <button
                type="button"
                className="bg-gray-200 rounded-full size-10 cursor-pointer flex justify-center items-center hover:bg-gray-300 transition-colors"
                aria-label="View connections"
              >
                <Users size={22} className="text-gray-700" />
              </button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Connections" variant="flat">
              <DropdownItem key="following">
                <Link
                  className="w-full flex items-center justify-between gap-3"
                  to="/following"
                >
                  <span>Following</span>
                  <span className="bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 px-2 py-0.5 rounded-full text-xs font-semibold">
                    {user?.followingCount || 0}
                  </span>
                </Link>
              </DropdownItem>
              <DropdownItem key="followers">
                <Link
                  className="w-full flex items-center justify-between gap-3"
                  to="/followers"
                >
                  <span>Followers</span>
                  <span className="bg-secondary-100 text-secondary-700 dark:bg-secondary-900 dark:text-secondary-300 px-2 py-0.5 rounded-full text-xs font-semibold">
                    {user?.followersCount || 0}
                  </span>
                </Link>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            {user?.photo ? (
              <Avatar
                isBordered
                as="button"
                className="transition-transform cursor-pointer"
                color="secondary"
                name={user?.name || "User"}
                size="sm"
                src={userPhoto}
              />
            ) : (
              <Skeleton className="w-8 h-8 rounded-full" />
            )}
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="user email account" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">
                {user?.email || "user@example.com"}
              </p>
            </DropdownItem>
            <DropdownItem key="setting">
              <Link className="w-full block" to="/setting">
                Setting
              </Link>
            </DropdownItem>
            <DropdownItem key="profile">
              <Link className="w-full block" to="/profile">
                My Profile
              </Link>
            </DropdownItem>
            <DropdownItem key="Newfeed">
              <Link className="w-full block" to="/">
                News Feed
              </Link>
            </DropdownItem>
            <DropdownItem
              key="logout"
              color="danger"
              onClick={() => setToken(null)}
            >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}
