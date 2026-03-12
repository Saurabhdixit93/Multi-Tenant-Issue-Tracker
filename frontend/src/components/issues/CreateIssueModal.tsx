"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import apiClient from "@/lib/api-client";

interface CreateIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateIssueModal({ isOpen, onClose, onSuccess }: CreateIssueModalProps) {
  const [form, setForm] = useState({ title: "", description: "", priority: "MEDIUM" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      await apiClient.post("/issues", form);
      onSuccess();
      onClose();
      setForm({ title: "", description: "", priority: "MEDIUM" });
    } catch (err: unknown) {
      setError((err as { response?: { data?: { error?: string } } }).response?.data?.error || "Failed to create issue");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            aria-hidden="true"
          />

          {/* Slide-in Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[28rem] md:w-[32rem] lg:max-w-xl bg-[var(--background)] border-l border-[var(--border)] z-[101] flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Create New Issue"
          >
            {/* Fixed Header */}
            <div className="flex items-center justify-between px-6 sm:px-8 lg:px-12 pt-6 sm:pt-8 pb-4 border-b border-[var(--border)] shrink-0">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tighter">
                New <span className="text-[var(--accent)]">Incident</span>
              </h2>
              <button 
                onClick={onClose} 
                className="p-2 rounded-md text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close modal"
              >
                <X size={22} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 sm:px-8 lg:px-12 py-6 sm:py-8">
              <form id="create-issue-form" onSubmit={handleSubmit} className="space-y-8">
                {/* Title */}
                <div className="group border-b border-[var(--border)] focus-within:border-[var(--accent)] transition-colors">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-50 block mb-2">
                    Issue Title
                  </label>
                  <input 
                    type="text" 
                    value={form.title}
                    onChange={(e) => setForm({...form, title: e.target.value})}
                    className="w-full bg-transparent py-3 sm:py-4 text-lg sm:text-2xl focus:outline-none placeholder:opacity-20"
                    placeholder="Brief summary of the issue"
                    required
                    autoFocus
                  />
                </div>

                {/* Description */}
                <div className="group border-b border-[var(--border)] focus-within:border-[var(--accent)] transition-colors">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-50 block mb-2">
                    Description
                  </label>
                  <textarea 
                    value={form.description}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                    className="w-full bg-transparent py-3 sm:py-4 text-base sm:text-lg focus:outline-none min-h-[120px] sm:min-h-[150px] resize-y placeholder:opacity-20"
                    placeholder="Provide full technical context..."
                    rows={4}
                  />
                </div>

                {/* Priority */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-50 block mb-4">
                    Severity Level
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(["LOW", "MEDIUM", "HIGH", "URGENT"] as const).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setForm({...form, priority: level})}
                        className={`py-3 px-2 text-xs font-mono uppercase tracking-wider border transition-all ${
                          form.priority === level
                            ? level === "URGENT"
                              ? "bg-red-500/20 border-red-500 text-red-400"
                              : level === "HIGH"
                              ? "bg-orange-500/20 border-orange-500 text-orange-400"
                              : level === "MEDIUM"
                              ? "bg-yellow-500/20 border-yellow-500 text-yellow-400"
                              : "bg-green-500/20 border-green-500 text-green-400"
                            : "border-[var(--border)] text-muted-foreground hover:border-[var(--accent)]/50"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <p className="text-red-400 font-mono text-xs uppercase tracking-widest">
                    Error: {error}
                  </p>
                )}
              </form>
            </div>

            {/* Sticky Footer */}
            <div className="shrink-0 px-6 sm:px-8 lg:px-12 py-4 sm:py-6 border-t border-[var(--border)] bg-[var(--background)]">
              <p className="text-[10px] font-mono opacity-30 leading-relaxed mb-4">
                AI AGENT: [GEMINI-PRO] IS READY TO CATEGORIZE UPON SUBMISSION. 
                STRICT TENANT ISOLATION IS ENFORCED.
              </p>
              <button 
                type="submit"
                form="create-issue-form"
                disabled={isSubmitting}
                className="accent-button w-full py-4 sm:py-5 text-lg sm:text-xl disabled:opacity-50 transition-opacity"
              >
                {isSubmitting ? "PROCESSING..." : "LOG INCIDENT"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
