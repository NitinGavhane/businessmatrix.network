"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Search, Crown, Mail, Phone, MapPin, Building2, Tag, CheckCircle, Calendar, Download, Key, Ban, Trash2 } from "lucide-react";

type Requirement = {
  id: string;
  type: "GIVE" | "ASK";
  category: string;
  description: string;
  tags: string[];
  isActive: boolean;
  createdAt: string;
};

type BusinessProfile = {
  id: string;
  companyName: string;
  type: string;
  description: string | null;
  location: string | null;
  verified: boolean;
  ownerName: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  category: string | null;
  website: string | null;
  contactPerson: string | null;
  yearsActive: number | null;
  turnover: string | null;
  scale: string | null;
  keyMarkets: string[];
  certifications: string[];
  productsServices: string | null;
  buyingProducts: string[];
  sellingProducts: string[];
  requirements: Requirement[];
};

type DirectoryUser = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: string;
  isPremium: boolean;
  premiumExpiresAt: string | null;
  suspended: boolean;
  createdAt: string;
  profile: BusinessProfile | null;
};

const premiumDurations = [
  { key: "1m", label: "1 Month" },
  { key: "3m", label: "3 Months" },
  { key: "6m", label: "6 Months" },
  { key: "1y", label: "1 Year" },
];

function csvEscape(val: string | null | undefined): string {
  if (!val) return "";
  const s = String(val);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function downloadCSV(users: DirectoryUser[]) {
  const headers = [
    "Name", "Email", "Phone", "Role", "Suspended", "Premium", "Premium Expiry",
    "Company", "Type", "Category", "Location", "City", "State", "Country",
    "Owner", "Contact Person", "Description", "Products & Services",
    "Years Active", "Scale", "Turnover", "Website", "Verified",
    "Key Markets", "Certifications", "Buying Products", "Selling Products",
    "Joined Date",
  ];

  const rows = users.map((u) => [
    u.name, u.email, u.phone, u.role,
    u.suspended ? "Yes" : "No",
    u.isPremium ? "Yes" : "No",
    u.premiumExpiresAt ? new Date(u.premiumExpiresAt).toLocaleDateString() : "",
    u.profile?.companyName, u.profile?.type, u.profile?.category,
    u.profile?.location, u.profile?.city, u.profile?.state, u.profile?.country,
    u.profile?.ownerName, u.profile?.contactPerson,
    u.profile?.description, u.profile?.productsServices,
    u.profile?.yearsActive?.toString(), u.profile?.scale, u.profile?.turnover,
    u.profile?.website, u.profile?.verified ? "Yes" : "No",
    u.profile?.keyMarkets?.join("; "),
    u.profile?.certifications?.join("; "),
    u.profile?.buyingProducts?.join("; "),
    u.profile?.sellingProducts?.join("; "),
    new Date(u.createdAt).toLocaleDateString(),
  ].map(csvEscape));

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `businessmatrix-users-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<DirectoryUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pickerUserId, setPickerUserId] = useState<string | null>(null);
  const [resetUserId, setResetUserId] = useState<string | null>(null);
  const [resetPassword, setResetPassword] = useState("");
  const [resetMsg, setResetMsg] = useState("");
  const [suspendConfirmId, setSuspendConfirmId] = useState<string | null>(null);
  const [suspendValue, setSuspendValue] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const fetchUsers = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("search", q);
      const res = await fetch(`/api/directory/admin/users?${params}`);
      const data = await res.json();
      setUsers(data.users || []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(search);
  }, [fetchUsers, search]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerUserId(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleTogglePremium = async (userId: string, duration?: string) => {
    const res = await fetch(`/api/directory/admin/users/${userId}/toggle-premium`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ duration }),
    });
    if (res.ok) {
      const data = await res.json();
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, isPremium: data.isPremium, premiumExpiresAt: data.premiumExpiresAt }
            : u
        )
      );
    }
    setPickerUserId(null);
  };

  const handleResetPassword = async (userId: string) => {
    if (!resetPassword || resetPassword.length < 6) {
      setResetMsg("Password must be at least 6 characters");
      return;
    }
    const res = await fetch(`/api/directory/admin/users/${userId}/reset-password`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: resetPassword }),
    });
    if (res.ok) {
      setResetMsg("Password updated successfully!");
      setResetPassword("");
      setTimeout(() => { setResetUserId(null); setResetMsg(""); }, 1500);
    } else {
      const err = await res.json();
      setResetMsg(err.error || "Failed to reset password");
    }
  };

  const handleSuspend = async (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, suspended: !u.suspended } : u))
    );
    try {
      await fetch(`/api/directory/admin/users/${userId}/suspend`, { method: "PATCH" });
    } catch (err) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, suspended: !u.suspended } : u))
      );
    }
  };

  const handleDelete = async (userId: string) => {
    setDeleting(true);
    const res = await fetch(`/api/directory/admin/users/${userId}/delete`, { method: "DELETE" });
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    }
    setDeleting(false);
    setDeleteConfirmId(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(search);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Users</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => downloadCSV(users)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
          >
            <Download size={14} /> Download CSV
          </button>
          <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
            {users.length} user{users.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <form onSubmit={handleSearch} className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name, email, phone, company, type, location, category, requirements..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
        />
      </form>

      {loading && (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-slate-100 rounded-2xl" />
          ))}
        </div>
      )}

      {!loading && users.length === 0 && (
        <div className="text-center py-20">
          <Building2 size={40} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 font-bold">No users found</p>
        </div>
      )}

      {!loading && users.length > 0 && (
        <div className="space-y-3">
          {users.map((user) => (
            <div key={user.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div
                className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors"
                onClick={() => setExpandedId(expandedId === user.id ? null : user.id)}
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black shrink-0">
                    {user.name ? user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() : "??"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-black text-slate-900 text-sm truncate">{user.name || "Unnamed"}</span>
                      {user.role === "ADMIN" && (
                        <span className="text-[9px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">Admin</span>
                      )}
                      {user.suspended && (
                        <span className="text-[9px] font-black uppercase tracking-widest text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">Suspended</span>
                      )}
                      {user.isPremium && (
                        <Crown size={13} className="text-amber-500 shrink-0" />
                      )}
                      {user.profile?.verified && (
                        <CheckCircle size={13} className="text-emerald-500 shrink-0" />
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-3 mt-0.5 text-xs text-slate-400 truncate">
                      {user.email && <span className="truncate">{user.email}</span>}
                      {user.profile?.companyName && (
                        <span className="flex items-center gap-1 truncate">
                          <Building2 size={11} className="shrink-0" /> <span className="truncate">{user.profile.companyName}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2">
                  {user.premiumExpiresAt && (
                    <span className="text-[9px] text-slate-400 font-medium hidden sm:inline">
                      Exp: {new Date(user.premiumExpiresAt).toLocaleDateString()}
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">{new Date(user.createdAt).toLocaleDateString()}</span>
                  <div className="relative" ref={pickerRef}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (user.isPremium) {
                          handleTogglePremium(user.id);
                        } else {
                          setPickerUserId(pickerUserId === user.id ? null : user.id);
                        }
                      }}
                      className={`relative w-10 h-5 sm:w-11 sm:h-6 rounded-full transition-all duration-200 ${
                        user.isPremium ? "bg-amber-400" : "bg-slate-200"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                          user.isPremium ? "translate-x-[18px] sm:translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                    {pickerUserId === user.id && (
                      <div className="absolute right-0 top-full mt-1 z-50 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 min-w-[140px]">
                        {premiumDurations.map((d) => (
                          <button
                            key={d.key}
                            onClick={(e) => { e.stopPropagation(); handleTogglePremium(user.id, d.key); }}
                            className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                          >
                            {d.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {expandedId === user.id && user.profile && (
                <div className="px-5 pb-5 border-t border-slate-100 pt-4 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <InfoField icon={Building2} label="Company" value={user.profile.companyName} />
                    <InfoField icon={Tag} label="Type" value={user.profile.type} />
                    <InfoField icon={MapPin} label="Location" value={[user.profile.city, user.profile.state, user.profile.country].filter(Boolean).join(", ") || user.profile.location} />
                    <InfoField icon={Mail} label="Contact Person" value={user.profile.contactPerson} />
                    <InfoField icon={Phone} label="Owner" value={user.profile.ownerName} />
                    <InfoField icon={Calendar} label="Years Active" value={user.profile.yearsActive ? `${user.profile.yearsActive} years` : null} />
                    <InfoField icon={Tag} label="Category" value={user.profile.category} />
                    <InfoField icon={Tag} label="Scale" value={user.profile.scale} />
                    <InfoField icon={Tag} label="Turnover" value={user.profile.turnover} />
                  </div>

                  {user.profile.website && (
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Website</p>
                      <a href={user.profile.website} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-indigo-600 hover:underline">{user.profile.website}</a>
                    </div>
                  )}

                  {user.profile.productsServices && (
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Products & Services</p>
                      <p className="text-xs text-slate-700">{user.profile.productsServices}</p>
                    </div>
                  )}

                  {user.profile.description && (
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Description</p>
                      <p className="text-xs text-slate-700">{user.profile.description}</p>
                    </div>
                  )}

                  {user.profile.keyMarkets.length > 0 && (
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Key Markets</p>
                      <div className="flex flex-wrap gap-1.5">
                        {user.profile.keyMarkets.map((m) => (
                          <span key={m} className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{m}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {user.profile.buyingProducts.length > 0 && (
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Buying Products</p>
                      <div className="flex flex-wrap gap-1.5">
                        {user.profile.buyingProducts.map((p) => (
                          <span key={p} className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{p}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {user.profile.sellingProducts.length > 0 && (
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Selling Products</p>
                      <div className="flex flex-wrap gap-1.5">
                        {user.profile.sellingProducts.map((p) => (
                          <span key={p} className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{p}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {user.profile.certifications.length > 0 && (
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Certifications</p>
                      <div className="flex flex-wrap gap-1.5">
                        {user.profile.certifications.map((c) => (
                          <span key={c} className="text-[10px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">{c}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {user.profile.requirements.length > 0 && (
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                        Requirements ({user.profile.requirements.length})
                      </p>
                      <div className="space-y-2">
                        {user.profile.requirements.map((req) => (
                          <div key={req.id} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
                                req.type === "GIVE" ? "bg-emerald-100 text-emerald-700" : "bg-indigo-100 text-indigo-700"
                              }`}>
                                {req.type}
                              </span>
                              <span className="text-[10px] font-bold text-slate-500">{req.category}</span>
                              {!req.isActive && (
                                <span className="text-[9px] font-bold text-slate-400">(Inactive)</span>
                              )}
                            </div>
                            <p className="text-xs text-slate-700">{req.description}</p>
                            {req.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {req.tags.map((t) => (
                                  <span key={t} className="text-[9px] text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">{t}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-1.5 sm:gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); setResetUserId(user.id); setResetPassword(""); setResetMsg(""); }}
                      className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-[10px] sm:text-xs font-bold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 transition-all"
                    >
                      <Key size={12} className="sm:w-[13px] sm:h-[13px]" /> Reset Password
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSuspendConfirmId(user.id); setSuspendValue(user.suspended); }}
                      className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-[10px] sm:text-xs font-bold border transition-all ${
                        user.suspended
                          ? "text-emerald-600 hover:bg-emerald-50 border-emerald-200 hover:border-emerald-300"
                          : "text-amber-600 hover:bg-amber-50 border-slate-200 hover:border-amber-200"
                      }`}
                    >
                      <Ban size={12} className="sm:w-[13px] sm:h-[13px]" /> {user.suspended ? "Unsuspend" : "Suspend"}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(user.id); }}
                      className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-[10px] sm:text-xs font-bold text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-all"
                    >
                      <Trash2 size={12} className="sm:w-[13px] sm:h-[13px]" /> Delete
                    </button>
                  </div>
                </div>
              )}

              {expandedId === user.id && !user.profile && (
                <div className="px-5 pb-5 border-t border-slate-100 pt-4 space-y-4">
                  <p className="text-xs text-slate-400 text-center py-4">No business profile submitted yet</p>
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-1.5 sm:gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); setResetUserId(user.id); setResetPassword(""); setResetMsg(""); }}
                      className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-[10px] sm:text-xs font-bold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 transition-all"
                    >
                      <Key size={12} className="sm:w-[13px] sm:h-[13px]" /> Reset Password
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSuspendConfirmId(user.id); setSuspendValue(user.suspended); }}
                      className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-[10px] sm:text-xs font-bold border transition-all ${
                        user.suspended
                          ? "text-emerald-600 hover:bg-emerald-50 border-emerald-200 hover:border-emerald-300"
                          : "text-amber-600 hover:bg-amber-50 border-slate-200 hover:border-amber-200"
                      }`}
                    >
                      <Ban size={12} className="sm:w-[13px] sm:h-[13px]" /> {user.suspended ? "Unsuspend" : "Suspend"}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(user.id); }}
                      className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-[10px] sm:text-xs font-bold text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-all"
                    >
                      <Trash2 size={12} className="sm:w-[13px] sm:h-[13px]" /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {resetUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm" onClick={() => { setResetUserId(null); setResetMsg(""); }}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-black text-slate-900 mb-1">Reset Password</h3>
            <p className="text-xs text-slate-500 mb-5">Enter a new password for this user.</p>
            {resetMsg && (
              <div className={`mb-4 p-3 rounded-xl text-xs font-bold text-center border ${
                resetMsg.includes("successfully")
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-rose-50 text-rose-700 border-rose-200"
              }`}>
                {resetMsg}
              </div>
            )}
            <input
              type="text"
              value={resetPassword}
              onChange={(e) => setResetPassword(e.target.value)}
              placeholder="New password (min 6 characters)"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setResetUserId(null); setResetMsg(""); }}
                className="flex-1 py-3 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleResetPassword(resetUserId)}
                className="flex-1 py-3 rounded-xl text-xs font-bold text-white transition-all"
                style={{ background: 'var(--brand-primary)' }}
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

      {suspendConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm" onClick={() => setSuspendConfirmId(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <Ban size={24} className="text-amber-600" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2 text-center">
              {suspendValue ? "Unsuspend User Account?" : "Suspend User Account?"}
            </h3>
            <p className="text-xs text-slate-500 text-center mb-6 leading-relaxed">
              {suspendValue
                ? "This will restore access for this user. They will be able to sign in and use the platform normally."
                : "This will prevent the user from signing in and accessing the platform until unsuspended."}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setSuspendConfirmId(null)}
                className="flex-1 py-3 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={async () => { await handleSuspend(suspendConfirmId); setSuspendConfirmId(null); }}
                className={`flex-1 py-3 rounded-xl text-xs font-bold text-white transition-all ${
                  suspendValue
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-amber-600 hover:bg-amber-700"
                }`}
              >
                {suspendValue ? "Unsuspend" : "Suspend"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm" onClick={() => { if (!deleting) setDeleteConfirmId(null); }}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-rose-600" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2 text-center">Delete User Account?</h3>
            <p className="text-xs text-slate-500 text-center mb-6 leading-relaxed">
              This action cannot be undone. All user data including their profile, requirements, and messages will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                disabled={deleting}
                className="flex-1 py-3 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={deleting}
                className="flex-1 py-3 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-all disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoField({ icon: Icon, label, value }: { icon: any; label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2">
      <Icon size={13} className="text-slate-400 mt-0.5 shrink-0" />
      <div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-xs font-medium text-slate-700">{value}</p>
      </div>
    </div>
  );
}
