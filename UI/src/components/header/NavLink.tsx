"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink = ({ href, children }: NavLinkProps) => {
  const pathname = usePathname();

  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={clsx(
        "no-underline text-slate-700 hover:text-blue-600 transition-all",
        isActive ? "font-bold text-xl" : "font-semibold text-lg",
      )}
    >
      {children}
    </Link>
  );
};

export default NavLink;
