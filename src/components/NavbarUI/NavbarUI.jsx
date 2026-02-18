import React, { useContext } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  Input,
  Badge,
} from "@heroui/react";
import { LuMessageSquareHeart } from "react-icons/lu";
import { FaBell } from "react-icons/fa";

import socialAppLogo from "../../assets/auth/logo.png";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext/AuthContextProvider";

export default function NavbarUI() {
  const { setToken } = useContext(AuthContext);
  return (
    <Navbar maxWidth="lg">
      <NavbarBrand>
        <img src={socialAppLogo} alt="Socail App logo" width={90} />
        <p className="font-bold text-inherit">Social App</p>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <Input fullWidth={true} label="Search" radius="full" className="" />
      </NavbarContent>

      <NavbarContent as="div" justify="end">
        <NavbarContent justify="end">
          <div className="bg-gray-200 rounded-full size-[40px] cursor-pointer flex justify-center items-center ">
            <Badge color="primary" content="5" size="md">
              <FaBell className="size-[25px]" />
            </Badge>
          </div>
          <div className="bg-gray-200 rounded-full size-[40px] cursor-pointer flex justify-center items-center ">
            <Badge color="primary" content="5" size="md">
              <LuMessageSquareHeart className="size-[25px]" />
            </Badge>
          </div>
        </NavbarContent>
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name="Jason Hughes"
              size="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">zoey@example.com</p>
            </DropdownItem>
            <DropdownItem key="settings">
              <Link className="w-full block" to="/profile">
                My Profile
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
