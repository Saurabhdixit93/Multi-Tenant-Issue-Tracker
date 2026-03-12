import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "Secure Access Login",
  description: "Authenticate into your secure node at RUDRATEK V1.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <React.Fragment>{children}</React.Fragment>;
}
