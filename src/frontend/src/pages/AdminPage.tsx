import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ClipboardList,
  Eye,
  EyeOff,
  Lock,
  LogOut,
  ShieldAlert,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { ConsultationRequest } from "../backend.d";
import {
  useGetAllConsultationRequests,
  useGetConsultationRequestCount,
} from "../hooks/useQueries";

// Hardcoded admin credentials
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "vantageroot2024";

function formatDate(timestamp: bigint) {
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function labelBalcony(v: string) {
  return v === "small" ? "Small" : v === "medium" ? "Medium" : "Large";
}
function labelSunlight(v: string) {
  return v === "fullSun"
    ? "Full Sun"
    : v === "partialShade"
      ? "Partial Shade"
      : "Full Shade";
}
function labelStyle(v: string) {
  return v.charAt(0).toUpperCase() + v.slice(1);
}

const OCID_ROWS = ["admin.row.1", "admin.row.2", "admin.row.3"] as const;

export default function AdminPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [credError, setCredError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const {
    data: requests,
    isLoading: isRequestsLoading,
    isError: isRequestsError,
    refetch: refetchRequests,
  } = useGetAllConsultationRequests();

  const { data: count } = useGetConsultationRequestCount();

  function handleCredentialSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCredError("");
    if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
    } else {
      setCredError("Incorrect username or password.");
    }
  }

  function handleSignOut() {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
    setCredError("");
  }

  return (
    <div className="min-h-screen bg-[oklch(0.18_0.055_150)] pt-16">
      {/* Header */}
      <div className="bg-[oklch(0.14_0.04_150)] border-b border-[oklch(0.25_0.05_150)] py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/"
            data-ocid="admin.link"
            className="inline-flex items-center gap-2 text-[oklch(0.72_0.04_140)] hover:text-[oklch(0.62_0.12_45)] text-sm font-sans transition-colors mb-4"
          >
            <ArrowLeft size={14} />
            Back to Home
          </Link>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-display text-4xl font-light text-white">
                Admin Panel
              </h1>
              <p className="text-[oklch(0.62_0.04_140)] text-sm font-sans mt-1">
                Consultation request management
              </p>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              {count !== undefined && isLoggedIn && (
                <div className="bg-[oklch(0.23_0.06_150)] border border-[oklch(0.30_0.05_150)] rounded-sm px-6 py-3 flex items-center gap-3">
                  <ClipboardList
                    size={18}
                    className="text-[oklch(0.62_0.12_45)]"
                  />
                  <div>
                    <p className="text-2xl font-display font-light text-white leading-tight">
                      {count.toString()}
                    </p>
                    <p className="text-xs text-[oklch(0.60_0.03_140)] font-sans">
                      Total Requests
                    </p>
                  </div>
                </div>
              )}
              {isLoggedIn && (
                <Button
                  data-ocid="admin.secondary_button"
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="border-[oklch(0.35_0.05_150)] text-[oklch(0.72_0.04_140)] hover:bg-[oklch(0.23_0.06_150)] hover:text-white rounded-sm font-sans flex items-center gap-2"
                >
                  <LogOut size={14} />
                  Sign Out
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          {/* Login form — shown when not yet authenticated */}
          {!isLoggedIn && (
            <motion.div
              key="login-form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <div className="w-16 h-16 rounded-full bg-[oklch(0.62_0.12_45/0.15)] flex items-center justify-center mb-6">
                <Lock size={28} className="text-[oklch(0.62_0.12_45)]" />
              </div>
              <h2 className="font-display text-3xl font-light text-white mb-2 text-center">
                Admin Login
              </h2>
              <p className="text-[oklch(0.65_0.03_140)] font-sans mb-8 text-center max-w-sm">
                Enter your admin credentials to access the dashboard.
              </p>

              <form
                onSubmit={handleCredentialSubmit}
                className="w-full max-w-sm space-y-4"
              >
                <div className="space-y-1.5">
                  <Label
                    htmlFor="admin-username"
                    className="text-[oklch(0.72_0.04_140)] font-sans text-sm flex items-center gap-2"
                  >
                    <User size={13} />
                    Username
                  </Label>
                  <Input
                    id="admin-username"
                    data-ocid="admin.input"
                    type="text"
                    autoComplete="username"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setCredError("");
                    }}
                    className="bg-[oklch(0.22_0.055_150)] border-[oklch(0.32_0.05_150)] text-white placeholder:text-[oklch(0.45_0.03_140)] focus:border-[oklch(0.62_0.12_45)] rounded-sm font-sans text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="admin-password"
                    className="text-[oklch(0.72_0.04_140)] font-sans text-sm flex items-center gap-2"
                  >
                    <Lock size={13} />
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="admin-password"
                      data-ocid="admin.textarea"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setCredError("");
                      }}
                      className="bg-[oklch(0.22_0.055_150)] border-[oklch(0.32_0.05_150)] text-white placeholder:text-[oklch(0.45_0.03_140)] focus:border-[oklch(0.62_0.12_45)] rounded-sm font-sans text-sm pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[oklch(0.55_0.03_140)] hover:text-[oklch(0.72_0.04_140)] transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {credError && (
                  <p
                    data-ocid="admin.error_state"
                    className="text-[oklch(0.65_0.15_25)] text-sm font-sans"
                  >
                    {credError}
                  </p>
                )}

                <Button
                  data-ocid="admin.submit_button"
                  type="submit"
                  disabled={!username.trim() || !password}
                  className="w-full bg-[oklch(0.62_0.12_45)] hover:bg-[oklch(0.55_0.12_45)] text-white font-semibold rounded-sm"
                >
                  Sign In
                </Button>
              </form>
            </motion.div>
          )}

          {/* Dashboard — shown when logged in */}
          {isLoggedIn && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              {/* Loading state */}
              {isRequestsLoading && (
                <div data-ocid="admin.loading_state" className="space-y-3">
                  {["sk1", "sk2", "sk3", "sk4", "sk5"].map((sk) => (
                    <Skeleton
                      key={sk}
                      className="h-14 w-full bg-[oklch(0.23_0.06_150)] rounded-sm"
                    />
                  ))}
                </div>
              )}

              {/* Error state */}
              {!isRequestsLoading && isRequestsError && (
                <div
                  data-ocid="admin.error_state"
                  className="flex flex-col items-center py-20 text-center"
                >
                  <ShieldAlert size={32} className="text-destructive mb-4" />
                  <h2 className="font-display text-2xl font-light text-white mb-2">
                    Error Loading Data
                  </h2>
                  <p className="text-[oklch(0.65_0.03_140)] text-sm font-sans mb-4">
                    Unable to fetch consultation requests. Please try again.
                  </p>
                  <Button
                    data-ocid="admin.secondary_button"
                    variant="outline"
                    onClick={() => void refetchRequests()}
                    className="border-[oklch(0.35_0.05_150)] text-[oklch(0.82_0.025_140)] hover:bg-[oklch(0.23_0.06_150)] rounded-sm"
                  >
                    Retry
                  </Button>
                </div>
              )}

              {/* Requests table or empty state */}
              {!isRequestsLoading &&
                !isRequestsError &&
                requests &&
                (requests.length === 0 ? (
                  <div
                    data-ocid="admin.empty_state"
                    className="flex flex-col items-center py-24 text-center"
                  >
                    <ClipboardList
                      size={36}
                      className="text-[oklch(0.45_0.04_140)] mb-5"
                    />
                    <h3 className="font-display text-2xl font-light text-white mb-2">
                      No Requests Yet
                    </h3>
                    <p className="text-[oklch(0.60_0.03_140)] font-sans text-sm">
                      Consultation requests will appear here once submitted.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-sm border border-[oklch(0.28_0.05_150)]">
                    <Table data-ocid="admin.table">
                      <TableHeader>
                        <TableRow className="border-[oklch(0.28_0.05_150)] bg-[oklch(0.20_0.055_150)] hover:bg-[oklch(0.20_0.055_150)]">
                          <TableHead className="text-[oklch(0.72_0.04_140)] font-semibold font-sans text-xs uppercase tracking-wider">
                            ID
                          </TableHead>
                          <TableHead className="text-[oklch(0.72_0.04_140)] font-semibold font-sans text-xs uppercase tracking-wider">
                            Name
                          </TableHead>
                          <TableHead className="text-[oklch(0.72_0.04_140)] font-semibold font-sans text-xs uppercase tracking-wider">
                            Email
                          </TableHead>
                          <TableHead className="text-[oklch(0.72_0.04_140)] font-semibold font-sans text-xs uppercase tracking-wider">
                            Phone
                          </TableHead>
                          <TableHead className="text-[oklch(0.72_0.04_140)] font-semibold font-sans text-xs uppercase tracking-wider">
                            Size
                          </TableHead>
                          <TableHead className="text-[oklch(0.72_0.04_140)] font-semibold font-sans text-xs uppercase tracking-wider">
                            Sunlight
                          </TableHead>
                          <TableHead className="text-[oklch(0.72_0.04_140)] font-semibold font-sans text-xs uppercase tracking-wider">
                            Style
                          </TableHead>
                          <TableHead className="text-[oklch(0.72_0.04_140)] font-semibold font-sans text-xs uppercase tracking-wider">
                            Message
                          </TableHead>
                          <TableHead className="text-[oklch(0.72_0.04_140)] font-semibold font-sans text-xs uppercase tracking-wider">
                            Date
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(requests as ConsultationRequest[]).map((req, i) => (
                          <TableRow
                            key={req.id.toString()}
                            data-ocid={OCID_ROWS[i] ?? `admin.row.${i + 1}`}
                            className="border-[oklch(0.25_0.05_150)] hover:bg-[oklch(0.22_0.055_150)] transition-colors"
                          >
                            <TableCell className="text-[oklch(0.55_0.03_140)] font-sans text-xs">
                              #{req.id.toString()}
                            </TableCell>
                            <TableCell className="text-white font-sans text-sm font-medium">
                              {req.name}
                            </TableCell>
                            <TableCell className="text-[oklch(0.75_0.04_140)] font-sans text-sm">
                              {req.email}
                            </TableCell>
                            <TableCell className="text-[oklch(0.65_0.03_140)] font-sans text-sm">
                              {req.phone ?? "—"}
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-[oklch(0.35_0.06_150)] text-[oklch(0.82_0.025_140)] hover:bg-[oklch(0.35_0.06_150)] text-xs font-sans rounded-sm">
                                {labelBalcony(req.balconySize)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-[oklch(0.50_0.09_80/0.3)] text-[oklch(0.82_0.05_80)] hover:bg-[oklch(0.50_0.09_80/0.3)] text-xs font-sans rounded-sm border border-[oklch(0.55_0.09_80/0.4)]">
                                {labelSunlight(req.sunlightExposure)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-[oklch(0.62_0.12_45/0.2)] text-[oklch(0.75_0.10_45)] hover:bg-[oklch(0.62_0.12_45/0.2)] text-xs font-sans rounded-sm border border-[oklch(0.62_0.12_45/0.35)]">
                                {labelStyle(req.stylePreference)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-[oklch(0.65_0.03_140)] font-sans text-sm max-w-[180px] truncate">
                              {req.message || "—"}
                            </TableCell>
                            <TableCell className="text-[oklch(0.55_0.03_140)] font-sans text-xs whitespace-nowrap">
                              {formatDate(req.timestamp)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
