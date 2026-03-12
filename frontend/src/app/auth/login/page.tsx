"use client";

import React from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export default function LoginPage() {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setStatus }) => {
      setStatus(null);
      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (res?.error) {
        setStatus("Invalid credentials. Try again.");
      } else {
        router.push("/dashboard");
      }
    },
  });

  return (
    <div className="min-h-screen flex bg-mesh overflow-hidden relative selection:bg-[var(--accent)] selection:text-[var(--accent-foreground)]">
      {/* Radical Decorative Tension */}
      <div className="absolute top-0 left-0 w-2 h-full bg-[var(--accent)]" />

      <div className="flex-1 flex items-center justify-center px-6 sm:px-8 relative z-10 py-12">
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="max-w-md w-full"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-6xl sm:text-8xl font-black uppercase tracking-tighter mb-8 sm:mb-12 transform -skew-x-6">
              Login
            </h1>
          </motion.div>

          <form
            onSubmit={formik.handleSubmit}
            className="space-y-6 sm:space-y-8"
          >
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
                autoComplete="email"
                className="w-full bg-transparent py-4 text-xl sm:text-2xl focus:outline-none placeholder:opacity-20"
                placeholder="you@company.com"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-[10px] uppercase font-bold tracking-widest pb-2">
                  {formik.errors.email}
                </div>
              )}
            </div>

            <div
              className={`group border-b transition-colors ${formik.touched.password && formik.errors.password ? "border-red-500" : "border-[var(--border)] focus-within:border-[var(--accent)]"}`}
            >
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-50 block mb-1">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full bg-transparent py-4 text-xl sm:text-2xl focus:outline-none placeholder:opacity-20"
                placeholder="••••••••"
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-[10px] uppercase font-bold tracking-widest pb-2">
                  {formik.errors.password}
                </div>
              )}
            </div>

            {formik.status && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[var(--accent)] font-mono text-xs uppercase tracking-widest border border-[var(--accent)]/30 p-4 bg-[var(--accent)]/5 skew-x-[-4deg]"
              >
                Error: {formik.status}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="accent-button w-full mt-8 sm:mt-12 py-5 sm:py-6 text-xl sm:text-2xl disabled:grayscale transition-all"
            >
              {formik.isSubmitting ? "Authenticating..." : "Authenticate"}
            </button>
          </form>

          <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <Link
              href="/auth/register"
              className="group text-[10px] font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity flex items-center gap-2"
            >
              <span>Create New Identity</span>
              <span className="w-8 h-px bg-[var(--accent)] group-hover:w-12 transition-all" />
            </Link>
            <p className="text-muted-foreground font-mono text-[10px] opacity-40 uppercase text-right">
              System Identity:{" "}
              <span className="text-foreground">RUDRATEK V1</span>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Extreme Asymmetry Decor */}
      <div className="hidden lg:flex w-1/3 bg-[var(--accent)]/5 border-l border-[var(--border)] items-center justify-center relative">
        <div className="absolute inset-0 bg-mesh opacity-20" />
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [45, 135, 45] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="w-64 h-64 border-4 border-[var(--accent)] opacity-20 relative z-10"
        />
        <div className="absolute bottom-12 right-12 text-[80px] font-black text-[var(--border)] opacity-10 select-none leading-none vertical-text uppercase">
          Login
        </div>
      </div>
    </div>
  );
}
