import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Image from "next/image";
import * as motion from "framer-motion/client";
import { ArrowRight, Shield, Zap, Globe } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Modern Issue Tracking Protocol",
  description:
    "Experience the next generation of issue tracking with absolute isolation and a radical design system. Built for elite development teams.",
};

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans overflow-hidden selection:bg-[var(--accent)] selection:text-[var(--accent-foreground)] relative bg-mesh">
      {/* Radical Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[var(--accent)]/5 to-transparent skew-x-12 transform origin-top-right border-l border-[var(--border)] -z-0" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 border border-[var(--accent)]/20 rotate-45 -z-0" />

      <main className="relative z-10 flex flex-col justify-center px-8 lg:px-24 w-full max-w-7xl mx-auto py-24">
        {/* Nav / Brand Header */}
        <header className="absolute top-10 left-8 lg:left-24 flex items-center gap-6">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 135 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 relative overflow-hidden rounded-full border border-[var(--border)] bg-[var(--accent)]/5 shadow-2xl"
          >
            <Image
              src="/logo.png"
              alt="RUDRATEK V1"
              fill
              className="p-1 object-contain -rotate-[135deg] rounded-full"
            />
          </motion.div>
          <span className="font-mono text-xs uppercase tracking-[0.4em] font-black opacity-50">
            System.V1//RUDRATEK
          </span>
        </header>

        <div className="space-y-12 max-w-4xl">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "circOut" }}
          >
            <h1 className="text-[12vw] lg:text-[10rem] font-black uppercase tracking-tighter leading-[0.8] mb-8">
              RADICAL
              <br />
              <span className="text-[var(--accent)] drop-shadow-[4px_4px_0px_#fff]">
                CONTROL
              </span>
            </h1>

            <div className="flex flex-col lg:flex-row gap-12 items-start lg:items-end">
              <p className="text-xl lg:text-3xl font-medium max-w-2xl leading-tight border-l-8 border-[var(--accent)] pl-8 py-2">
                A premium multi-tenant issue tracking platform with{" "}
                <span className="italic opacity-50">
                  AI-driven categorization
                </span>{" "}
                and brutalist data isolation.
              </p>

              <div className="flex flex-wrap gap-4">
                {[
                  { icon: Shield, label: "STRICT_ISOLATION" },
                  { icon: Zap, label: "GEMINI_2.0" },
                  { icon: Globe, label: "TENANT_AUTH" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--muted)] border border-[var(--border)] font-mono text-[10px] uppercase tracking-widest"
                  >
                    <item.icon size={12} className="text-[var(--accent)]" />
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6"
          >
            {session ? (
              <Link
                href="/dashboard"
                className="accent-button flex items-center gap-4 text-2xl px-12 py-6"
              >
                ENTER COMMAND CENTER <ArrowRight size={24} />
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="accent-button flex items-center gap-4 text-2xl px-12 py-6 group"
                >
                  INITIALIZE ACCESS{" "}
                  <ArrowRight
                    size={24}
                    className="group-hover:translate-x-2 transition-transform"
                  />
                </Link>
                <Link
                  href="/auth/register"
                  className="border-4 border-[var(--border)] hover:border-[var(--accent)] transition-colors px-12 py-6 text-2xl font-black uppercase tracking-tighter"
                >
                  CREATE TENANT
                </Link>
              </>
            )}
          </motion.div>
        </div>

        {/* GEO-Optimized Section: Protocol Specifications */}
        <section className="py-24 border-t border-[var(--border)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <div className="flex items-center gap-4 mb-16 text-[var(--accent)]">
            <Globe size={24} />
            <span className="font-mono text-xs uppercase tracking-[0.3em]">
              Protocol Specifications
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <h2 className="text-5xl font-black uppercase tracking-tighter leading-none transform -skew-x-6">
                What is{" "}
                <span className="text-[var(--accent)]">RUDRATEK V1</span>?
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                RUDRATEK V1 is a{" "}
                <span className="text-white">
                  secure, multi-tenant issue tracking protocol
                </span>{" "}
                designed for elite engineering teams who demand technical
                excellence and radical design. It ensures absolute data
                isolation between tenants while providing AI-driven
                categorization for maximum productivity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border border-[var(--border)] p-6 group hover:border-[var(--accent)] transition-colors">
                <h3 className="font-bold uppercase tracking-tight mb-2">
                  Multi-Tenancy
                </h3>
                <p className="text-xs text-muted-foreground opacity-70 leading-relaxed uppercase">
                  Isolated database schemas ensuring zero cross-tenant leakage.
                </p>
              </div>
              <div className="border border-[var(--border)] p-6 group hover:border-[var(--accent)] transition-colors">
                <h3 className="font-bold uppercase tracking-tight mb-2">
                  AI-Powered
                </h3>
                <p className="text-xs text-muted-foreground opacity-70 leading-relaxed uppercase">
                  Automated issue analysis and categorization via the Gemini
                  protocol.
                </p>
              </div>
              <div className="border border-[var(--border)] p-6 group hover:border-[var(--accent)] transition-colors">
                <h3 className="font-bold uppercase tracking-tight mb-2">
                  Radical UI
                </h3>
                <p className="text-xs text-muted-foreground opacity-70 leading-relaxed uppercase">
                  High-contrast brutalist design optimized for focused deep
                  work.
                </p>
              </div>
              <div className="border border-[var(--border)] p-6 group hover:border-[var(--accent)] transition-colors">
                <h3 className="font-bold uppercase tracking-tight mb-2">
                  Open Scale
                </h3>
                <p className="text-xs text-muted-foreground opacity-70 leading-relaxed uppercase">
                  Built on a modular architecture ready for massive
                  synchronization.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Data */}
        <footer className="mt-32 pt-12 border-t border-[var(--border)]/30 flex flex-col md:flex-row justify-between gap-8 opacity-30 font-mono text-[10px] uppercase tracking-[0.3em]">
          <div className="flex gap-12">
            <span>Lat: 28.6139° N</span>
            <span>Lng: 77.2090° E</span>
          </div>
          <div className="flex gap-12">
            <span>Uptime: 99.99%</span>
            <span>Build: Stable_0312</span>
          </div>
          <span>&copy; 2026 RUDRATEK_LABS</span>
        </footer>
      </main>
    </div>
  );
}
