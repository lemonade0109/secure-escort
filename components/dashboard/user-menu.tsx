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
import {
  GitPullRequestArrow,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  PersonStandingIcon,
  TrainTrackIcon,
  Hourglass,
  UserIcon,
  AlignHorizontalJustifyCenter,
  ChartBar,
  ClipboardList,
} from "lucide-react";
import { signOutAction } from "@/lib/actions/auth/signout";
import { useFormStatus } from "react-dom";
import { isAdminClient } from "@/lib/admin";

export type UserMenuProps = {
  name?: string | null;
  email?: string | null;
  role?: string | null;
};

function initialsFromName(name?: string | null, email?: string | null) {
  const base = (name?.trim() || email?.trim() || "U").trim();
  const parts = base.split(" ").filter(Boolean);

  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return base.slice(0, 2).toUpperCase();
}

const UserMenu = ({ name, email, role }: UserMenuProps) => {
  const initials = initialsFromName(name, email);
  const userIsAdmin = isAdminClient(email);

  const { pending } = useFormStatus();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="gap-2 px-2 text-white h-9 border-white/10 bg-white/5 hover:bg-white/10 hover:text-white/90"
        >
          <Avatar className="w-6 h-6">
            <AvatarFallback className="bg-white/10 text-[10px] text-white/80">
              {initials}
            </AvatarFallback>
          </Avatar>

          <span className="hidden text-xs sm:inline text-white/80">
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
            <UserIcon className="w-4 h-4 mr-2" />
            Profile
          </Link>
        </DropdownMenuItem>

        {(userIsAdmin || role === "GUARD") && (
          <DropdownMenuItem asChild>
            <Link href="/dashboard" className="cursor-pointer">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </Link>
          </DropdownMenuItem>
        )}

        {role === "GUARD" && (
          <DropdownMenuItem asChild>
            <Link href="/guard/jobs" className="cursor-pointer">
              <AlignHorizontalJustifyCenter className="w-4 h-4 mr-2" />
              My Jobs
            </Link>
          </DropdownMenuItem>
        )}

        {role === "GUARD" && (
          <DropdownMenuItem asChild>
            <Link href="/guard/availability" className="cursor-pointer">
              <Hourglass className="w-4 h-4 mr-2" />
              Working Hours
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild>
          <Link href="/requests" className="cursor-pointer">
            <GitPullRequestArrow className="w-4 h-4 mr-2" />
            Requests
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/tracking" className="cursor-pointer">
            <TrainTrackIcon className="w-4 h-4 mr-2" />
            Tracking
          </Link>
        </DropdownMenuItem>

        {userIsAdmin && (
          <DropdownMenuItem asChild>
            <Link href="/admin/analytics" className="cursor-pointer">
              <ChartBar className="w-4 h-4 mr-2" />
              Analytics
            </Link>
          </DropdownMenuItem>
        )}

        {userIsAdmin && (
          <DropdownMenuItem asChild>
            <Link href="/admin/audit" className="cursor-pointer">
              <ClipboardList className="w-4 h-4 mr-2" />
              Audit Log
            </Link>
          </DropdownMenuItem>
        )}

        {userIsAdmin && (
          <DropdownMenuItem asChild>
            <Link href="/admin/dashboard" className="cursor-pointer">
              <LockKeyhole className="w-4 h-4 mr-2" />
              Admin Dashboard
            </Link>
          </DropdownMenuItem>
        )}

        {userIsAdmin && (
          <DropdownMenuItem asChild>
            <Link href="/admin/guards" className="cursor-pointer">
              <PersonStandingIcon className="w-4 h-4 mr-2" />
              Guards
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator className="bg-white/10" />

        <DropdownMenuItem asChild>
          <form action={signOutAction} className="w-full">
            <button
              type="submit"
              className="flex items-center justify-start gap-2 border-none cursor-pointer rounded-xl hover:bg-white/10 "
              disabled={pending}
            >
              <LogOut className="w-4 h-4 " />
              {pending ? "Signing out..." : "Sign Out"}
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
