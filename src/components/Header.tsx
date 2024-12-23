"use client";
import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { useClickOutside } from "@/hooks/useClickOutside";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

interface HeaderProps {
  onHamburgerClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHamburgerClick }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const { data: session } = useSession();
  const [profilePicture, setProfilePicture] = useState("/default-profile.png");

  useEffect(() => {
    const checkFileExists = async () => {
      if (session?.user?.profilePicture) {
        const response = await fetch(
          `/api/file-exists?file=${session.user.profilePicture}`,
        );
        const data = await response.json();
        if (data.exists) {
          setProfilePicture(session.user.profilePicture);
        } else {
          setProfilePicture("/default-profile.png");
        }
      }
    };

    checkFileExists();
  }, [session]);

  const closeDropdown = () => setDropdownOpen(false);
  const dropdownRef = useClickOutside(closeDropdown);
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <header className="flex items-center justify-between bg-lightGray p-4 text-darkGray shadow md:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onHamburgerClick}
          className="text-darkGray md:hidden"
          aria-label="Open Sidebar"
        >
          <FaBars size={24} />
        </button>
        <h1 className="text-lg font-semibold sm:text-xl md:text-2xl">
          FinDash
        </h1>
      </div>

      <div className="flex flex-row items-center gap-4">
        <Image
          src={profilePicture}
          alt="Zdjęcie profilowe"
          width={40}
          height={40}
          className="h-10 w-10 rounded-full"
        />
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded px-4 py-2 text-sm font-semibold text-darkGray hover:bg-gray-200"
          >
            {session?.user?.name}
            <IoMdArrowDropdown size={20} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 z-40 mt-2 w-48 rounded bg-white p-2 shadow-lg">
              <ul className="text-sm">
                <li>
                  <button
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                    onClick={() => alert("Przejście do profilu")}
                  >
                    Mój profil
                  </button>
                </li>
                <li>
                  <button
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                    onClick={() => alert("Przejście do ustawień")}
                  >
                    Ustawienia
                  </button>
                </li>
                <li>
                  <button
                    className="block w-full px-4 py-2 text-left text-mutedRed hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    Wyloguj się
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
