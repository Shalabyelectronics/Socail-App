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
import { Bookmark } from "lucide-react";

import socialAppLogo from "../../assets/auth/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext/AuthContextProvider";
import { FeedContext } from "../FeedContext/FeedContextProvider";

export default function NavbarUI() {
  const { setToken, user, userPhoto } = useContext(AuthContext);
  const { bookmarkCount } = useContext(FeedContext);
  const navigate = useNavigate();

  const handleNavigateToBookmarks = () => {
    navigate("/bookmarks");
  };
  return (
    <Navbar maxWidth="xl">
      <NavbarBrand>
        <img src={socialAppLogo} alt="Socail App logo" width={90} />
        <p className="hidden md:block font-bold text-inherit">Social App</p>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <Input fullWidth={true} label="Search" radius="full" className="" />
      </NavbarContent>

      <NavbarContent as="div" justify="end">
        <NavbarContent justify="end">
          <div className="bg-gray-200 rounded-full size-[40px] cursor-pointer flex justify-center items-center ">
            <Badge color="primary" content="5" size="md">
              <FaBell className="size-[20px] sm:size-[22px]" />
            </Badge>
          </div>
          <div className="bg-gray-200 rounded-full size-[40px] cursor-pointer flex justify-center items-center ">
            <Badge color="primary" content="5" size="md">
              <LuMessageSquareHeart className="text-gray-700 size-[20px] sm:size-[22px]" />
            </Badge>
          </div>
          <button
            type="button"
            onClick={handleNavigateToBookmarks}
            className="bg-gray-200 rounded-full size-[40px] cursor-pointer flex justify-center items-center hover:bg-gray-300 transition-colors"
            aria-label="View bookmarked posts"
          >
            <Badge color="primary" content={bookmarkCount} size="md">
              <Bookmark size={22} className="text-gray-700" />
            </Badge>
          </button>
        </NavbarContent>
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            {user?.photo ? (
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
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
