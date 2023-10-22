"use client";

import { signOut } from "next-auth/react";
import Locale from "../locales";
export default function LogoutPage() {
  return (
    <span
      onClick={() => {
        signOut();
      }}
    >
      {Locale.Login.Logout}
    </span>
  );
}
