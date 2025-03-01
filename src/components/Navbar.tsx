import Image from "next/image";
import Link from "next/link";
import React from "react";
import Logo from "../../public/Vybe.png";
import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";
import { currentUser } from "@clerk/nextjs/server";
import { syncUser } from "@/actions/user.action";

const Navbar = async () => {
  const user = await currentUser();
  if (user) await syncUser();

  return (
    <nav className="sticky top-0  w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3 ">
            <Link href="/" className="flex items-center gap-2 ">
              <Image
                src={Logo}
                alt="Vybe"
                width={60}
                height={60}
                className="rounded-full  shadow-lg transition-transform duration-300 hover:scale-105"
              />
              <span className="text-2xl font-semibold text-primary font-mono tracking-widest">
                Vybe
              </span>
            </Link>
          </div>

          <DesktopNavbar />
          <MobileNavbar />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
