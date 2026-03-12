"use client";

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface CustomUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  tenantId?: string;
  role?: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const actions = [
    {
      label: "New Incident Log",
      path: "/issues",
      uniqueClass: "incident-btn",
    },
    {
      label: "Review Boundaries",
      path: "/issues",
      uniqueClass: "boundaries-btn",
    },
    {
      label: "Sync Identity",
      path: "/settings",
      uniqueClass: "identity-btn",
    },
  ];
  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          className="font-mono text-xs uppercase tracking-[0.5em]"
        >
          Session Established
        </motion.p>
        <h1 className="text-6xl lg:text-8xl font-black uppercase tracking-tight">
          Welcome, <br />
          <span className="text-[var(--accent)] italic">
            {session?.user?.name || "User"}
          </span>
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="border border-[var(--border)] p-12 space-y-8 bg-[var(--card)] relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--accent)]/5 flex items-center justify-center font-black text-4xl opacity-20">
            01
          </div>
          <h2 className="text-4xl font-bold uppercase tracking-tighter">
            System Health
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-[var(--border)] py-4">
              <span className="opacity-50 uppercase text-[10px] font-bold">
                Node Identity
              </span>
              <span className="font-mono">
                TENANT-{(session?.user as CustomUser)?.tenantId?.slice(0, 8) || "..."}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-[var(--border)] py-4">
              <span className="opacity-50 uppercase text-[10px] font-bold">
                Security Boundary
              </span>
              <span className="text-green-500 font-bold tracking-tighter uppercase">
                Strict Isolation
              </span>
            </div>
            <div className="flex justify-between items-center py-4">
              <span className="opacity-50 uppercase text-[10px] font-bold">
                Active Shield
              </span>
              <span className="text-[var(--accent)] font-bold tracking-tighter uppercase">
                Level {(session?.user as CustomUser)?.role || "..."}
              </span>
            </div>
          </div>
        </div>

        <div className="border border-[var(--border)] p-12 bg-[var(--accent)] text-[var(--accent-foreground)] relative overflow-hidden group">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute -bottom-24 -right-24 w-64 h-64 bg-black rounded-full"
          />
          <h2 className="text-4xl font-bold uppercase tracking-tighter relative z-10">
            Quick Actions
          </h2>
          <div className="mt-12 space-y-4 relative z-10">
            {actions.map((item, index) => (
              <button
                key={index}
                onClick={() => router.push(item.path)}
                className={`w-full text-left pl-1 py-4 font-bold uppercase tracking-widest hover:pl-4 transition-all group-hover:bg-black/5 ${item.uniqueClass} ${
                  index !== actions.length - 1 ? "border-b border-black/20" : ""
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
