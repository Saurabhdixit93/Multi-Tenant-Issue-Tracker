import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Protocol Membership Registration",
  description:
    "Initialize your tenant node and start tracking with RUDRATEK V1.",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <React.Fragment>{children}</React.Fragment>;
}
