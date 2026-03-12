"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserPlus,
  Mail,
  Shield,
  ShieldCheck,
  X,
  Plus,
} from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import apiClient from "@/lib/api-client";

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const InviteSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  role: Yup.string().oneOf(["ADMIN", "USER"]).required("Role is required"),
});

function InviteModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "USER",
    },
    validationSchema: InviteSchema,
    onSubmit: async (values, { setStatus, resetForm }) => {
      try {
        await apiClient.post("/tenant/members", values);
        resetForm();
        onSuccess();
        onClose();
      } catch (err: unknown) {
        const message = (err as { response?: { data?: { error?: string } } }).response?.data?.error || "Failed to invite member";
        setStatus(message);
      }
    },
  });

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-[var(--card)] border border-[var(--border)] w-full max-w-xl p-8 lg:p-12 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/5 flex items-center justify-center font-black text-4xl opacity-10 pointer-events-none transform translate-x-12 -translate-y-12 rotate-12">
          INV
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-[var(--accent)] transition-colors"
        >
          <X size={24} />
        </button>

        <header className="mb-12">
          <div className="flex items-center gap-4 text-[var(--accent)] mb-2">
            <Plus size={16} />
            <span className="font-mono text-xs uppercase tracking-[0.3em]">
              Unit Provisioning
            </span>
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter transform -skew-x-6">
            Invite Agent
          </h2>
        </header>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className={`group border-b transition-colors ${formik.touched.name && formik.errors.name ? "border-red-500" : "border-[var(--border)] focus-within:border-[var(--accent)]"}`}
            >
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-50 block mb-1">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full bg-transparent py-2 text-lg focus:outline-none placeholder:opacity-20"
                placeholder="Agent Name"
              />
            </div>

            <div
              className={`group border-b transition-colors ${formik.touched.email && formik.errors.email ? "border-red-500" : "border-[var(--border)] focus-within:border-[var(--accent)]"}`}
            >
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-50 block mb-1">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full bg-transparent py-2 text-lg focus:outline-none placeholder:opacity-20"
                placeholder="agent@core.sys"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className={`group border-b transition-colors ${formik.touched.password && formik.errors.password ? "border-red-500" : "border-[var(--border)] focus-within:border-[var(--accent)]"}`}
            >
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-50 block mb-1">
                Initial Password
              </label>
              <input
                name="password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full bg-transparent py-2 text-lg focus:outline-none placeholder:opacity-20"
                placeholder="Secure Root"
              />
            </div>

            <div
              className={`group border-b transition-colors ${formik.touched.role && formik.errors.role ? "border-red-500" : "border-[var(--border)] focus-within:border-[var(--accent)]"}`}
            >
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-50 block mb-1">
                Authorization Role
              </label>
              <select
                name="role"
                value={formik.values.role}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full bg-transparent py-2 text-lg focus:outline-none appearance-none"
              >
                <option value="USER" className="bg-[var(--background)]">
                  USER
                </option>
                <option value="ADMIN" className="bg-[var(--background)]">
                  ADMIN
                </option>
              </select>
            </div>
          </div>

          {formik.status && (
            <div className="text-red-500 font-mono text-[10px] uppercase tracking-widest p-4 border border-red-500/30 bg-red-500/5">
              ERROR: {formik.status}
            </div>
          )}

          <div className="pt-8">
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="accent-button w-full py-4 text-xl flex items-center justify-center gap-3"
            >
              <UserPlus size={20} />
              {formik.isSubmitting ? "Provisioning..." : "Provision Agent"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const fetchMembers = async () => {
    try {
      const res = await apiClient.get("/tenant/members");
      setMembers(res.data);
    } catch (error) {
      console.error("Failed to fetch team members", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div className="space-y-12">
      <header className="flex flex-col lg:flex-row justify-between items-end gap-8">
        <div>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-4 text-[var(--accent)] mb-4"
          >
            <Users size={24} />
            <span className="font-mono text-xs uppercase tracking-[0.3em]">
              Identity Registry
            </span>
          </motion.div>
          <motion.h1
            initial={{ letterSpacing: "0.2em" }}
            animate={{ letterSpacing: "-0.05em" }}
            className="text-7xl lg:text-9xl font-black uppercase tracking-tighter leading-none"
          >
            Team
          </motion.h1>
        </div>

        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="accent-button flex items-center gap-2 group px-8 py-4"
        >
          <UserPlus
            size={20}
            className="group-hover:rotate-12 transition-transform"
          />
          Invite Agent
        </button>
      </header>

      {/* Radical Member Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-[var(--border)]">
        <AnimatePresence>
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-64 border-r border-b border-[var(--border)] animate-pulse bg-white/5"
                />
              ))
            : members.map((member, idx) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative p-8 border-r border-b border-[var(--border)] hover:bg-[var(--accent)]/5 transition-all bg-[var(--card)]"
                >
                  {/* Corner Accent */}
                  <div className="absolute top-0 right-0 w-8 h-8 bg-[var(--accent)]/10 group-hover:bg-[var(--accent)] transition-colors clip-path-poly-corner-small" />

                  <div className="flex justify-between items-start mb-8">
                    <div className="p-3 bg-[var(--muted)] border border-[var(--border)] group-hover:border-[var(--accent)] transition-colors">
                      <Users
                        size={24}
                        className="group-hover:text-[var(--accent)] transition-colors"
                      />
                    </div>
                    <span
                      className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest border ${
                        member.role === "ADMIN"
                          ? "border-red-500 text-red-500"
                          : "border-[var(--accent)] text-[var(--accent)]"
                      }`}
                    >
                      {member.role}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold leading-tight mb-2 truncate">
                    {member.name || "Identified Unit"}
                  </h3>
                  <div className="flex items-center gap-2 text-muted-foreground mb-12">
                    <Mail size={12} className="opacity-50" />
                    <span className="text-[10px] font-mono lowercase truncate">
                      {member.email}
                    </span>
                  </div>

                  <div className="flex justify-between items-end mt-auto pt-8 border-t border-[var(--border)]/30">
                    <div className="flex items-center gap-2">
                      {member.role === "ADMIN" ? (
                        <ShieldCheck size={14} className="text-red-500" />
                      ) : (
                        <Shield size={14} className="opacity-30" />
                      )}
                      <span className="text-[8px] font-bold uppercase tracking-widest opacity-50">
                        Clearance Level {member.role === "ADMIN" ? "0" : "1"}
                      </span>
                    </div>
                    <span className="text-[8px] opacity-20 font-mono">
                      JOINED.{new Date(member.createdAt).getFullYear()}
                    </span>
                  </div>
                </motion.div>
              ))}
        </AnimatePresence>
      </div>

      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSuccess={fetchMembers}
      />

      <style jsx>{`
        .clip-path-poly-corner-small {
          clip-path: polygon(100% 0, 100% 100%, 0 0);
        }
      `}</style>
    </div>
  );
}
