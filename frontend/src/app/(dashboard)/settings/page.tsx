"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings as SettingsIcon, Save, Building2 } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import apiClient from "@/lib/api-client";
import { slugify } from "@/lib/slugify";

const SettingsSchema = Yup.object().shape({
  name: Yup.string().required("Organization name is required"),
  slug: Yup.string().required("Slug is required"),
});

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      slug: "",
    },
    validationSchema: SettingsSchema,
    onSubmit: async (values) => {
      setSaveStatus(null);
      try {
        await apiClient.patch("/tenant/settings", values);
        setSaveStatus("Settings updated successfully");
        setTimeout(() => setSaveStatus(null), 3000);
      } catch {
        setSaveStatus("Failed to update settings");
      }
    },
  });

  const fetchSettings = React.useCallback(async () => {
    try {
      const res = await apiClient.get("/tenant/settings");
      formik.setValues({
        name: res.data.name,
        slug: res.data.slug,
      });
    } catch (error) {
      console.error("Failed to fetch settings", error);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on mount

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Auto-generate slug from company name if it changes
  useEffect(() => {
    const newSlug = slugify(formik.values.name);
    if (formik.values.name && !loading && formik.values.slug !== newSlug) {
      formik.setFieldValue("slug", newSlug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.name, loading, formik.values.slug]);

  if (loading) {
    return (
      <div className="space-y-12 animate-pulse">
        <div className="h-24 bg-white/5 w-1/2" />
        <div className="h-96 bg-white/5 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-4xl">
      <header className="space-y-4">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-4 text-[var(--accent)]"
        >
          <SettingsIcon size={24} />
          <span className="font-mono text-xs uppercase tracking-[0.3em]">
            System Configuration
          </span>
        </motion.div>
        <h1 className="text-6xl lg:text-8xl font-black uppercase tracking-tighter leading-none transform -skew-x-6">
          Settings
        </h1>
      </header>

      <div className="grid grid-cols-1 gap-12">
        <section className="border border-[var(--border)] bg-[var(--card)] p-8 lg:p-12 relative overflow-hidden group">
          {/* Decorative Element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/5 flex items-center justify-center font-black text-4xl opacity-10 pointer-events-none">
            ORG
          </div>

          <div className="flex items-center gap-4 mb-12">
            <Building2 size={20} className="text-[var(--accent)]" />
            <h2 className="text-2xl font-bold uppercase tracking-tight">
              Organization Identity
            </h2>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-8">
            <div
              className={`group border-b transition-colors ${formik.touched.name && formik.errors.name ? "border-red-500" : "border-[var(--border)] focus-within:border-[var(--accent)]"}`}
            >
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-50 block mb-2">
                Organization Name
              </label>
              <input
                name="name"
                type="text"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full bg-transparent py-4 text-2xl focus:outline-none placeholder:opacity-20"
                placeholder="Enterprise Alpha"
              />
              {formik.touched.name && formik.errors.name && (
                <div className="text-red-500 text-[10px] uppercase font-bold tracking-widest pb-2">
                  {formik.errors.name}
                </div>
              )}
            </div>

            <div
              className={`group border-b transition-colors ${formik.touched.slug && formik.errors.slug ? "border-red-500" : "border-[var(--border)] focus-within:border-[var(--accent)]"}`}
            >
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-50 block mb-2">
                Namespace Slug
              </label>
              <input
                name="slug"
                type="text"
                value={formik.values.slug}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                readOnly
                className="w-full bg-transparent py-4 text-2xl focus:outline-none placeholder:opacity-20 font-mono text-[var(--accent)]"
                placeholder="enterprise-alpha"
              />
              <p className="text-[8px] opacity-30 uppercase mt-2">
                Immutable unique identifier used for tenant isolation
              </p>
            </div>

            <div className="pt-8">
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="accent-button flex items-center gap-3 group px-12 py-5 text-xl"
              >
                <Save
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />
                {formik.isSubmitting
                  ? "Synchronizing..."
                  : "Update Configuration"}
              </button>
            </div>
          </form>

          <AnimatePresence>
            {saveStatus && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className={`mt-8 p-4 font-mono text-xs uppercase tracking-widest border border-current ${
                  saveStatus.includes("success")
                    ? "text-green-500 bg-green-500/5"
                    : "text-[var(--accent)] bg-[var(--accent)]/5"
                }`}
              >
                STATUS: {saveStatus}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Informational Section */}
        <section className="border border-[var(--border)] p-12 bg-[var(--muted)]/30 space-y-8 relative overflow-hidden">
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[var(--accent)]/5 rounded-full blur-3xl" />

          <h3 className="text-xl font-bold uppercase tracking-widest flex items-center gap-4">
            <div className="w-8 h-px bg-[var(--accent)]" />
            Security Boundaries
          </h3>

          <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
            Organization changes take effect immediately across all isolated
            nodes. Slug modification is automatically performed based on
            organization name to maintain indexing consistency within the
            RUDRATEK V1 protocol.
          </p>
        </section>
      </div>
    </div>
  );
}
