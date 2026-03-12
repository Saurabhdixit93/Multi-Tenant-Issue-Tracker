"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { LayoutDashboard, Ticket, Users, Settings, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Issues", href: "/issues", icon: Ticket },
  { label: "Team", href: "/team", icon: Users },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-mesh">
      {/* Radical Vertical Nav */}
      <aside className="w-24 lg:w-32 border-r border-[var(--border)] flex flex-col items-center py-12 sticky top-0 h-screen z-50 bg-[var(--background)]">
        <Link href="/" className="mb-24">
          <motion.div
            initial={{ rotate: 0, opacity: 0 }}
            animate={{ rotate: 45, opacity: 1 }}
            whileHover={{ scale: 1.1, rotate: 90 }}
            className="relative w-16 h-16 overflow-hidden rounded-full border border-[var(--border)] bg-[var(--accent)]/10 flex items-center justify-center shadow-2xl"
          >
            <Image
              src="/logo.png"
              alt="RUDRATEK V1"
              fill
              className="p-1 object-contain -rotate-45 rounded-full"
            />
          </motion.div>
        </Link>

        <nav className="flex-1 space-y-12">
          {NAV_ITEMS.map((item, idx) => (
            <motion.div
              key={item.href}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link
                href={item.href}
                className={`flex flex-col items-center gap-2 group transition-colors ${
                  pathname === item.href
                    ? "text-[var(--accent)]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />
                <span className="text-[10px] uppercase font-bold tracking-widest hidden lg:block">
                  {item.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </nav>

        <button
          onClick={() => signOut()}
          className="mt-auto text-muted-foreground hover:text-[var(--accent)] transition-colors"
        >
          <LogOut size={20} />
        </button>
      </aside>

      {/* Main Content with Asymmetric Tension */}
      <main className="flex-1 p-8 lg:p-16 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl"
        >
          {children}
        </motion.div>

        {/* Background Geometric Tension Decor */}
        <div className="absolute top-0 right-0 w-1/2 h-full -z-10 bg-gradient-to-l from-[#111111]/50 to-transparent skew-x-12 transform origin-top-right border-l border-[#333]/20 sm:block hidden" />
      </main>
    </div>
  );
}
