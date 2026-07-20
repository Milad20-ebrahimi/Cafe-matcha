"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ShoppingBag,
  Menu,
  X,
  Leaf,
  User
} from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "خانه" },
  { href: "/menu", label: "منوی کافه" },
  { href: "/shop", label: "فروشگاه" },
  { href: "/#about", label: "داستان ما" },
  { href: "/#contact", label: "رزرو میز" },
];

export default function Header() {
  const  totalCount  = 0;
  const [open, setOpen] = useState(false);

  return (
<header
  className="
    fixed
    top-4
    left-50
    right-50
    z-[999]
    overflow-hidden
    rounded-[3rem]
    border
    border-green-900/10
    bg-[#f8f5ed]/80
    backdrop-blur-xl
    shadow-xl
    isolate
  "
>

      <div
        className="
          mx-auto
          flex
          max-w-7xl
          items-center
          justify-between
          px-6
          py-3
        "
      >

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3"
        >
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              bg-[#355e3b]
              text-white
              shadow-lg
            "
          >
            <Leaf size={22}/>
          </div>

          <div className="leading-tight">
            <h1
              className="
                font-serif
                text-xl
                font-bold
                text-[#203c27]
              "
            >
              کافه ماچا
            </h1>

            <p
              className="
                text-[11px]
                text-[#355e3b]/70
              "
            >
              Cafe & Matcha Store
            </p>
          </div>
        </Link>


        {/* Desktop Menu */}
        <nav
          className="
            hidden
            items-center
            gap-8
            md:flex
          "
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="
                text-sm
                font-medium
                text-[#203c27]/80
                transition
                hover:text-[#d97706]
              "
            >
              {link.label}
            </Link>
          ))}
        </nav>


        {/* Actions */}
        <div className="flex items-center gap-3">

          {/* Login */}
          <Link
            href="/login"
            className="
              hidden
              h-11
              items-center
              gap-2
              rounded-full
              bg-[#d97706]
              px-3.5
              text-sm
              font-medium
              text-white
              transition
              hover:bg-[#b45309]
              hover:scale-105
              md:flex
            "
          >
            <User size={18}/>

          </Link>


          {/* Cart */}
          <Link
            href="/cart"
            className="
              relative
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              bg-[#d97706]
              text-white
              shadow-md
              transition
              hover:bg-[#b45309]
              hover:scale-105
            "
          >
            <ShoppingBag size={21}/>

            {totalCount > 0 && (
              <span
                className="
                  absolute
                  -top-1
                  -left-1
                  flex
                  h-5
                  min-w-5
                  items-center
                  justify-center
                  rounded-full
                  bg-[#3b2415]
                  px-1
                  text-xs
                  text-white
                "
              >
                {totalCount}
              </span>
            )}
          </Link>


          {/* Mobile Button */}
          <button
            onClick={() => setOpen(!open)}
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              bg-white
              text-[#d97706]
              md:hidden
            "
          >
            {open ? <X/> : <Menu/>}
          </button>

        </div>

      </div>


      {/* Mobile Menu */}
      {open && (
        <nav
          className="
            flex
            flex-col
            gap-2
            border-t
            border-green-900/10
            bg-[#f8f5ed]
            rounded-b-[3rem]
            px-5
            py-4
            md:hidden
          "
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="
                rounded-xl
                px-4
                py-3
                text-[#203c27]
                transition
                hover:bg-orange-100
              "
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}

    </header>
  );
}