"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import Link from "next/link";
import { LogOut, Settings, UserIcon } from "lucide-react";
import { signOutAction } from "@/lib/actions/auth/signout";
import { useFormStatus } from "react-dom";

export type UserMenuProps = {
  name?: string | null;
  email?: string | null;
};

function initialsFromName(name?: string | null, email?: string | null) {
  const base = (name?.trim() || email?.trim() || "U").trim();
  const parts = base.split(" ").filter(Boolean);

  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return base.slice(0, 2).toUpperCase();
}

const UserMenu = ({ name, email }: UserMenuProps) => {
  const initials = initialsFromName(name, email);

  const { pending } = useFormStatus();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-9 gap-2 border-white/10 bg-white/5 px-2 text-white hover:bg-white/10 hover:text-white/90"
        >
          <Avatar className="h-6 w-6">
            <AvatarFallback className="bg-white/10 text-[10px] text-white/80">
              {initials}
            </AvatarFallback>
          </Avatar>

          <span className="hidden sm:inline text-xs text-white/80">
            {name?.split(" ")[0] || "Account"}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 border-white/10 bg-[#0b1020] text-white"
      >
        <DropdownMenuLabel className="space-y-0.5">
          <div className="font-medium">{name || "User"}</div>
          <div className="text-xs text-white/70">{email || ""}</div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-white/10" />

        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <UserIcon className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-white/10" />

        <DropdownMenuItem asChild>
          <form action={signOutAction} className="w-full">
            <button
              type="submit"
              className="rounded-xl border-none cursor-pointer items-center hover:bg-white/10 gap-2 flex justify-start "
              disabled={pending}
            >
              <LogOut className=" h-4 w-4" />
              {pending ? "Signing out..." : "Sign Out"}
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
