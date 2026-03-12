"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Filter } from "lucide-react";
import apiClient from "@/lib/api-client";
import CreateIssueModal from "@/components/issues/CreateIssueModal";

interface Issue {
  id: string;
  title: string;
  status: string;
  priority: string;
  category: string;
  createdAt: string;
}

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "OPEN" | "RESOLVED">("ALL");


  const fetchIssues = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/issues");
      setIssues(res.data);
    } catch (error) {
      console.error("Failed to fetch issues", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (issueId: string, newStatus: string) => {
    try {
      await apiClient.patch(`/issues/${issueId}`, { status: newStatus });
      // Optimistic update or refresh
      fetchIssues();
    } catch (error) {
        console.error("Failed to update status", error);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch = 
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (issue.category?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      filterStatus === "ALL" || 
      issue.status === filterStatus;

    return matchesSearch && matchesStatus;
  });



  return (
    <div className="space-y-12">
      {/* Header with Title Brutalism */}
      <header className="flex flex-col lg:flex-row justify-between items-end gap-8">
        <div>
          <motion.h1 
            initial={{ letterSpacing: "0.2em" }}
            animate={{ letterSpacing: "-0.05em" }}
            className="text-7xl lg:text-9xl font-black uppercase tracking-tighter leading-none"
          >
            Issues
          </motion.h1>
          <p className="text-muted-foreground mt-4 text-lg">
            Multi-Tenant Isolation Level: <span className="text-[var(--accent)] font-mono">STRICT</span>
          </p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="accent-button flex items-center gap-2 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" />
          Create New
        </button>
      </header>

      {/* Radical Grid and Search */}
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text" 
            placeholder="Search issues..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--card)] border border-[var(--border)] pl-12 pr-4 py-4 focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>
        
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Filter size={18} />
          </div>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as "ALL" | "OPEN" | "RESOLVED")}
            className="appearance-none bg-[var(--card)] border border-[var(--border)] pl-12 pr-8 py-4 focus:outline-none focus:border-[var(--accent)] transition-colors cursor-pointer font-mono text-xs uppercase tracking-widest"
          >
            <option value="ALL">ALL STATUS</option>
            <option value="OPEN">OPEN ONLY</option>
            <option value="RESOLVED">RESOLVED</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
            ▼
          </div>
        </div>
      </div>


      {/* Issue Cards with Staggered Entrance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
        <AnimatePresence>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 border border-[var(--border)] animate-pulse bg-white/5" />
            ))
          ) : filteredIssues.length === 0 ? (
            <div className="col-span-full py-24 border border-dashed border-[var(--border)] flex flex-col items-center justify-center opacity-30 italic">
               <Search size={48} className="mb-4" />
               <p className="font-mono text-xs uppercase tracking-[0.3em]">No units matching criteria</p>
            </div>
          ) : (
            filteredIssues.map((issue, idx) => (


              <motion.div
                key={issue.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className={`group relative p-8 border border-[var(--border)] transition-all bg-[var(--card)] hover:z-10 ${
                    issue.status === 'RESOLVED' ? 'opacity-60 grayscale-[0.5]' : 'hover:border-[var(--accent)]'
                }`}
              >
                {/* Status Toggle Button (Radical UI) */}
                <button 
                    onClick={() => handleStatusUpdate(issue.id, issue.status === 'RESOLVED' ? 'OPEN' : 'RESOLVED')}
                    className="absolute -top-3 -right-3 w-10 h-10 bg-black border border-[var(--border)] flex items-center justify-center hover:bg-[var(--accent)] hover:text-black transition-all group/status z-20"
                    title={issue.status === 'RESOLVED' ? "Reopen Issue" : "Mark as Resolved"}
                >
                    {issue.status === 'RESOLVED' ? (
                        <div className="w-4 h-4 border-2 border-current rounded-full flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-current rounded-full animate-pulse" />
                        </div>
                    ) : (
                        <Plus className="rotate-45" size={18} />
                    )}
                </button>

                <div className="flex justify-between items-start mb-12">
                  <span className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-50">
                    {issue.status === 'RESOLVED' ? "ARCHIVED" : (issue.category || "General")}
                  </span>
                  <div className={`w-2 h-2 rounded-full ${
                    issue.status === 'RESOLVED' ? 'bg-zinc-500' :
                    issue.priority === 'URGENT' ? 'bg-red-500' : 
                    issue.priority === 'HIGH' ? 'bg-orange-500' : 'bg-green-500'
                  }`} />
                </div>
                
                <h3 className={`text-2xl font-bold leading-tight mb-8 transition-colors ${
                    issue.status === 'RESOLVED' ? 'line-through opacity-40' : 'group-hover:text-[var(--accent)]'
                }`}>
                  {issue.title}
                </h3>
                
                <div className="flex justify-between items-end mt-auto pt-8 border-t border-[var(--border)]/50">
                  <div className="space-y-1">
                    <span className={`font-mono text-[10px] uppercase font-black px-2 py-0.5 border ${
                        issue.status === 'RESOLVED' ? 'border-green-500 text-green-500' : 'border-[var(--accent)] text-[var(--accent)]'
                    }`}>
                        {issue.status}
                    </span>
                  </div>
                  <span className="text-xs opacity-30">
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            ))

          )}
        </AnimatePresence>
      </div>

      <CreateIssueModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchIssues}
      />
    </div>
  );
}
