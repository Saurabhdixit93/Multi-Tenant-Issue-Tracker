"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { slugify } from "@/lib/slugify";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  companyName: Yup.string().required("Organization name is required"),
  companySlug: Yup.string().required("Slug is required"),
});

export default function RegisterPage() {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      companyName: "",
      companySlug: "",
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setStatus }) => {
      setStatus(null);
      try {
        await axios.post(`${API_URL}/auth/register`, values);
        router.push("/auth/login");
      } catch (err: unknown) {
        setStatus(
          (err as { response?: { data?: { error?: string } } }).response?.data
            ?.error || "Registration failed",
        );
      }
    },
  });

  // Auto-generate slug from company name
  useEffect(() => {
    formik.setFieldValue("companySlug", slugify(formik.values.companyName));
  }, [formik.values.companyName, formik.setFieldValue, formik]);

  return (
    <div className="min-h-screen flex bg-mesh overflow-hidden relative selection:bg-[var(--accent)] selection:text-[var(--accent-foreground)]">
      {/* Radical Decorative Tension */}
      <div className="absolute top-0 right-0 w-2 h-full bg-[var(--accent)]" />

      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 relative z-10 py-12">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center"
        >
          <div className="space-y-8 lg:space-y-12 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-none transform skew-x-6">
                Join the <br />{" "}
                <span className="text-[var(--accent)] underline decoration-4 underline-offset-8">
                  Isolation
                </span>
              </h1>
            </motion.div>
            <p className="text-muted-foreground text-xs sm:text-sm uppercase tracking-[0.2em] font-medium max-w-sm mx-auto lg:mx-0">
              Deploy your multi-tenant infrastructure in seconds. Experience
              absolute data sovereignty.
            </p>

            <div className="hidden lg:block pt-12">
              <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest opacity-30">
                <div className="w-12 h-px bg-foreground" />
                <span>Protocol v1.0.4</span>
                <div className="w-12 h-px bg-foreground" />
              </div>
            </div>
          </div>

          <div className="relative">
            {/* Background Decorative Element */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-[var(--accent)]/5 rounded-full blur-3xl -z-10" />

            <form
              onSubmit={formik.handleSubmit}
              className="space-y-8 bg-[var(--card)] p-8 sm:p-12 border border-[var(--border)] relative glassmorphism"
            >
              {/* Corner Detail */}
              <div className="absolute top-0 left-0 w-6 h-6 bg-[var(--accent)] clip-path-poly-corner" />

              <div className="space-y-6 sm:space-y-8">
                <div className="grid grid-cols-1 gap-6">
                  {/* Name Input */}
                  <div
                    className={`group border-b transition-colors ${formik.touched.name && formik.errors.name ? "border-red-500" : "border-[var(--border)] focus-within:border-[var(--accent)]"}`}
                  >
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-50 block mb-1">
                      Full Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      placeholder="Identify yourself"
                      className="w-full bg-transparent py-3 text-lg focus:outline-none placeholder:opacity-20"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>

                  {/* Email Input */}
                  <div
                    className={`group border-b transition-colors ${formik.touched.email && formik.errors.email ? "border-red-500" : "border-[var(--border)] focus-within:border-[var(--accent)]"}`}
                  >
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-50 block mb-1">
                      Email Address
                    </label>
                    <input
                      name="email"
                      type="email"
                      placeholder="Entry point"
                      className="w-full bg-transparent py-3 text-lg focus:outline-none placeholder:opacity-20"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>

                  {/* Password Input */}
                  <div
                    className={`group border-b transition-colors ${formik.touched.password && formik.errors.password ? "border-red-500" : "border-[var(--border)] focus-within:border-[var(--accent)]"}`}
                  >
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-50 block mb-1">
                      Password
                    </label>
                    <input
                      name="password"
                      type="password"
                      placeholder="Access core"
                      className="w-full bg-transparent py-3 text-lg focus:outline-none placeholder:opacity-20"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                </div>

                <div className="pt-8 sm:pt-12 border-t border-[var(--border)]/30">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {/* Organization Input */}
                    <div
                      className={`group border-b transition-colors ${formik.touched.companyName && formik.errors.companyName ? "border-red-500" : "border-[var(--border)] focus-within:border-[var(--accent)]"}`}
                    >
                      <label className="text-[10px] font-bold uppercase tracking-widest opacity-50 block mb-1">
                        Organization
                      </label>
                      <input
                        name="companyName"
                        type="text"
                        placeholder="Entity Name"
                        className="w-full bg-transparent py-3 text-lg focus:outline-none placeholder:opacity-20"
                        value={formik.values.companyName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>

                    {/* Slug Input */}
                    <div
                      className={`group border-b transition-colors ${formik.touched.companySlug && formik.errors.companySlug ? "border-red-500" : "border-[var(--border)] focus-within:border-[var(--accent)]"}`}
                    >
                      <label className="text-[10px] font-bold uppercase tracking-widest opacity-50 block mb-1">
                        Namespace Slug
                      </label>
                      <input
                        name="companySlug"
                        type="text"
                        placeholder="slug-path"
                        className="w-full bg-transparent py-3 text-lg focus:outline-none placeholder:opacity-20 font-mono text-[var(--accent)]"
                        value={formik.values.companySlug}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        readOnly // Slug is auto-generated
                      />
                    </div>
                  </div>
                </div>
              </div>

              {formik.status && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[var(--accent)] font-mono text-[10px] uppercase tracking-widest border border-[var(--accent)]/30 p-4 bg-[var(--accent)]/5 skew-x-[-4deg]"
                >
                  REJECTED: {formik.status}
                </motion.p>
              )}

              <div className="space-y-6 pt-4">
                <button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="accent-button w-full py-5 text-xl relative overflow-hidden group/btn"
                >
                  <span className="relative z-10">
                    {formik.isSubmitting
                      ? "Provisioning..."
                      : "Initialize Instance"}
                  </span>
                  <div className="absolute inset-0 bg-foreground/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                </button>

                <div className="flex justify-between items-center">
                  <Link
                    href="/auth/login"
                    className="group text-[10px] font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity flex items-center gap-2"
                  >
                    <span className="w-8 h-px bg-[var(--accent)] group-hover:w-12 transition-all" />
                    <span>Back to Core</span>
                  </Link>
                  <span className="text-[8px] font-mono opacity-20 uppercase">
                    Rudratek Terminal
                  </span>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .glassmorphism {
          backdrop-filter: blur(10px);
          background: rgba(13, 13, 13, 0.8);
        }
        .clip-path-poly-corner {
          clip-path: polygon(0 0, 100% 0, 0 100%);
        }
      `}</style>
    </div>
  );
}
