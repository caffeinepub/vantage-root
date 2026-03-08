import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ArrowUpDown,
  Boxes,
  Building2,
  CalendarDays,
  CheckCircle2,
  Circle,
  ClipboardList,
  Clock,
  Eye,
  EyeOff,
  Flame,
  Flower2,
  Leaf,
  ListFilter,
  Lock,
  LogOut,
  Monitor,
  Palette,
  Scissors,
  ShieldAlert,
  ShoppingBag,
  Sprout,
  Store,
  Tag,
  Trash2,
  TreePine,
  User,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import type { ConsultationRequest, VendorApplication } from "../backend.d";
import { Priority, Status, VendorApplicationStatus } from "../backend.d";
import { useActor } from "../hooks/useActor";
import {
  useDeleteConsultationRequest,
  useDeleteVendorApplication,
  useGetAllVendorApplications,
  useGetVendorApplicationCount,
  useUpdateRequestPriority,
  useUpdateRequestStatus,
  useUpdateVendorApplicationStatus,
} from "../hooks/useQueries";

// Hardcoded admin credentials
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "plantly2024";
const SESSION_KEY = "plantly_admin_session";

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

const PRIORITY_ORDER: Record<string, number> = {
  [Priority.high]: 0,
  [Priority.medium]: 1,
  [Priority.low]: 2,
};

const PRIORITY_CYCLE: Record<string, Priority> = {
  [Priority.low]: Priority.medium,
  [Priority.medium]: Priority.high,
  [Priority.high]: Priority.low,
};

const STATUS_ORDER: Record<string, number> = {
  [Status.new_]: 0,
  [Status.inProgress]: 1,
  [Status.completed]: 2,
};

const STATUS_CYCLE: Record<string, Status> = {
  [Status.new_]: Status.inProgress,
  [Status.inProgress]: Status.completed,
  [Status.completed]: Status.new_,
};

function StatusBadge({
  status,
  onClick,
  isPending,
  "data-ocid": dataOcid,
}: {
  status: Status;
  onClick: () => void;
  isPending: boolean;
  "data-ocid"?: string;
}) {
  const styles: Record<string, string> = {
    [Status.new_]:
      "bg-[oklch(0.42_0.12_250/0.25)] text-[oklch(0.78_0.10_250)] border border-[oklch(0.55_0.12_250/0.45)] hover:bg-[oklch(0.42_0.12_250/0.4)]",
    [Status.inProgress]:
      "bg-[oklch(0.55_0.14_65/0.25)] text-[oklch(0.82_0.12_65)] border border-[oklch(0.62_0.14_65/0.45)] hover:bg-[oklch(0.55_0.14_65/0.4)]",
    [Status.completed]:
      "bg-[oklch(0.42_0.12_145/0.25)] text-[oklch(0.75_0.10_145)] border border-[oklch(0.50_0.12_145/0.45)] hover:bg-[oklch(0.42_0.12_145/0.4)]",
  };

  const label =
    status === Status.new_
      ? "New"
      : status === Status.inProgress
        ? "In Progress"
        : "Completed";

  const Icon =
    status === Status.new_
      ? Circle
      : status === Status.inProgress
        ? Clock
        : CheckCircle2;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isPending}
      title="Click to cycle status"
      data-ocid={dataOcid}
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-xs font-sans font-medium transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${styles[status]}`}
    >
      <Icon size={10} />
      {label}
    </button>
  );
}

function PriorityBadge({
  priority,
  onClick,
  isPending,
}: {
  priority: Priority;
  onClick: () => void;
  isPending: boolean;
}) {
  const styles: Record<string, string> = {
    [Priority.high]:
      "bg-[oklch(0.42_0.15_25/0.25)] text-[oklch(0.78_0.14_25)] border border-[oklch(0.55_0.15_25/0.45)] hover:bg-[oklch(0.42_0.15_25/0.4)]",
    [Priority.medium]:
      "bg-[oklch(0.55_0.12_75/0.25)] text-[oklch(0.82_0.10_75)] border border-[oklch(0.62_0.12_75/0.45)] hover:bg-[oklch(0.55_0.12_75/0.4)]",
    [Priority.low]:
      "bg-[oklch(0.42_0.10_155/0.25)] text-[oklch(0.72_0.09_155)] border border-[oklch(0.50_0.10_155/0.45)] hover:bg-[oklch(0.42_0.10_155/0.4)]",
  };

  const label =
    priority === Priority.high
      ? "High"
      : priority === Priority.medium
        ? "Medium"
        : "Low";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isPending}
      title="Click to cycle priority"
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-xs font-sans font-medium transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${styles[priority]}`}
    >
      <Flame size={10} />
      {label}
    </button>
  );
}

type SortMode = "date-desc" | "date-asc" | "priority" | "status";

const OCID_DELETE_ROWS = [
  "admin.delete_button.1",
  "admin.delete_button.2",
  "admin.delete_button.3",
] as const;

export default function AdminPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [credError, setCredError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Restore login state if session token exists in localStorage
    return !!localStorage.getItem(SESSION_KEY);
  });
  const [sortMode, setSortMode] = useState<SortMode>("date-desc");
  const [deleteTargetId, setDeleteTargetId] = useState<bigint | null>(null);

  const { actor, isFetching: isActorFetching } = useActor();
  const queryClient = useQueryClient();

  // On actor ready, check if the stored session token is blocked
  useEffect(() => {
    if (!actor || isActorFetching) return;
    const token = localStorage.getItem(SESSION_KEY);
    if (!token) return;
    void actor.isSessionBlocked(token).then((blocked) => {
      if (blocked) {
        localStorage.removeItem(SESSION_KEY);
        setIsLoggedIn(false);
      }
    });
  }, [actor, isActorFetching]);

  const {
    data: requests,
    isLoading: isRequestsLoading,
    isError: isRequestsError,
    refetch: refetchRequests,
  } = useQuery({
    queryKey: ["consultationRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllConsultationRequests();
    },
    enabled: !!actor && !isActorFetching && isLoggedIn,
    retry: false,
  });

  const { data: count } = useQuery({
    queryKey: ["consultationRequestCount"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getConsultationRequestCount();
    },
    enabled: !!actor && !isActorFetching && isLoggedIn,
  });
  const deleteMutation = useDeleteConsultationRequest();
  const priorityMutation = useUpdateRequestPriority();
  const statusMutation = useUpdateRequestStatus();

  const sortedRequests = useMemo(() => {
    if (!requests) return [];
    const arr = [...(requests as ConsultationRequest[])];
    if (sortMode === "date-asc") {
      return arr.sort((a, b) => Number(a.timestamp) - Number(b.timestamp));
    }
    if (sortMode === "date-desc") {
      return arr.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
    }
    if (sortMode === "status") {
      return arr.sort(
        (a, b) => (STATUS_ORDER[a.status] ?? 0) - (STATUS_ORDER[b.status] ?? 0),
      );
    }
    return arr.sort(
      (a, b) =>
        (PRIORITY_ORDER[a.priority] ?? 3) - (PRIORITY_ORDER[b.priority] ?? 3),
    );
  }, [requests, sortMode]);

  function handleCredentialSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCredError("");
    if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Generate a session token and register it with the backend
      const token = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, token);
      if (actor) {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        void actor.registerAdminSession(
          token,
          navigator.userAgent,
          timezone,
          "",
        );
      }
      setIsLoggedIn(true);
      // Invalidate so queries re-run now that isLoggedIn is true
      void queryClient.invalidateQueries({
        queryKey: ["consultationRequests"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["consultationRequestCount"],
      });
    } else {
      setCredError("Incorrect username or password.");
    }
  }

  function handleSignOut() {
    const token = localStorage.getItem(SESSION_KEY);
    if (token && actor) {
      void actor.removeAdminSession(token);
    }
    localStorage.removeItem(SESSION_KEY);
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
    setCredError("");
  }

  function handleDeleteConfirm() {
    if (deleteTargetId === null) return;
    deleteMutation.mutate(deleteTargetId, {
      onSettled: () => setDeleteTargetId(null),
    });
  }

  function handlePriorityClick(req: ConsultationRequest) {
    const next = PRIORITY_CYCLE[req.priority] ?? Priority.medium;
    priorityMutation.mutate({ id: req.id, priority: next });
  }

  function handleStatusClick(req: ConsultationRequest) {
    const next = STATUS_CYCLE[req.status] ?? Status.inProgress;
    statusMutation.mutate({ id: req.id, status: next });
  }

  function toggleDateSort() {
    setSortMode((prev) => (prev === "date-desc" ? "date-asc" : "date-desc"));
  }

  return (
    <div className="min-h-screen bg-[oklch(0.18_0.055_150)] pt-16">
      {/* Delete confirmation dialog */}
      <AlertDialog
        open={deleteTargetId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTargetId(null);
        }}
      >
        <AlertDialogContent
          data-ocid="admin.dialog"
          className="bg-[oklch(0.20_0.055_150)] border-[oklch(0.30_0.05_150)] text-white"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display font-light text-2xl text-white">
              Delete Request?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[oklch(0.65_0.03_140)] font-sans">
              Are you sure you want to delete this request? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="admin.cancel_button"
              className="border-[oklch(0.35_0.05_150)] text-[oklch(0.72_0.04_140)] bg-transparent hover:bg-[oklch(0.25_0.05_150)] hover:text-white font-sans"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="admin.confirm_button"
              onClick={handleDeleteConfirm}
              className="bg-[oklch(0.45_0.18_25)] hover:bg-[oklch(0.40_0.18_25)] text-white font-sans border-0"
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
              <h1 className="font-display text-3xl sm:text-4xl font-light text-white">
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
                <div className="flex items-center gap-2 flex-wrap">
                  <Link
                    to="/admin/sessions"
                    data-ocid="admin.sessions_button"
                    className="inline-flex items-center gap-2 border border-[oklch(0.35_0.05_150)] text-[oklch(0.72_0.04_140)] hover:bg-[oklch(0.23_0.06_150)] hover:text-white rounded-sm font-sans text-sm h-9 px-3 transition-colors"
                  >
                    <Monitor size={14} />
                    Manage Sessions
                  </Link>
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
                </div>
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
              <Tabs defaultValue="requests" className="space-y-6">
                <TabsList
                  data-ocid="admin.tab"
                  className="bg-[oklch(0.20_0.055_150)] border border-[oklch(0.28_0.05_150)] rounded-sm p-1 flex flex-wrap gap-1 h-auto"
                >
                  <TabsTrigger
                    value="requests"
                    data-ocid="admin.requests.tab"
                    className="flex items-center gap-1.5 text-xs font-sans font-medium rounded-sm data-[state=active]:bg-[oklch(0.62_0.12_45)] data-[state=active]:text-white text-[oklch(0.62_0.04_140)] hover:text-white transition-colors px-3 py-2 h-auto"
                  >
                    <ClipboardList size={13} />
                    Consultation Requests
                  </TabsTrigger>
                  <TabsTrigger
                    value="shop"
                    data-ocid="admin.shop.tab"
                    className="flex items-center gap-1.5 text-xs font-sans font-medium rounded-sm data-[state=active]:bg-[oklch(0.62_0.12_45)] data-[state=active]:text-white text-[oklch(0.62_0.04_140)] hover:text-white transition-colors px-3 py-2 h-auto"
                  >
                    <ShoppingBag size={13} />
                    Shop
                  </TabsTrigger>
                  <TabsTrigger
                    value="vendors"
                    data-ocid="admin.vendors.tab"
                    className="flex items-center gap-1.5 text-xs font-sans font-medium rounded-sm data-[state=active]:bg-[oklch(0.62_0.12_45)] data-[state=active]:text-white text-[oklch(0.62_0.04_140)] hover:text-white transition-colors px-3 py-2 h-auto"
                  >
                    <Store size={13} />
                    Vendors
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="requests" className="mt-0">
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
                      <ShieldAlert
                        size={32}
                        className="text-destructive mb-4"
                      />
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

                  {/* Requests: empty state */}
                  {!isRequestsLoading &&
                    !isRequestsError &&
                    requests &&
                    requests.length === 0 && (
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
                    )}

                  {/* Requests: sort + table */}
                  {!isRequestsLoading &&
                    !isRequestsError &&
                    requests &&
                    requests.length > 0 && (
                      <div>
                        {/* Sort bar */}
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          <span className="text-[oklch(0.58_0.03_140)] text-xs font-sans uppercase tracking-wider mr-1">
                            Sort:
                          </span>
                          <button
                            type="button"
                            data-ocid="admin.sort_date.toggle"
                            onClick={toggleDateSort}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-sans font-medium transition-colors border ${
                              sortMode === "date-desc" ||
                              sortMode === "date-asc"
                                ? "bg-[oklch(0.28_0.07_150)] border-[oklch(0.42_0.08_150)] text-[oklch(0.85_0.04_140)]"
                                : "bg-transparent border-[oklch(0.30_0.05_150)] text-[oklch(0.60_0.03_140)] hover:bg-[oklch(0.23_0.06_150)] hover:text-[oklch(0.78_0.04_140)]"
                            }`}
                          >
                            <CalendarDays size={12} />
                            Date
                            {sortMode === "date-desc" && (
                              <ArrowDown size={11} />
                            )}
                            {sortMode === "date-asc" && <ArrowUp size={11} />}
                            {sortMode === "priority" && (
                              <ArrowUpDown size={11} className="opacity-40" />
                            )}
                          </button>
                          <button
                            type="button"
                            data-ocid="admin.sort_priority.toggle"
                            onClick={() => setSortMode("priority")}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-sans font-medium transition-colors border ${
                              sortMode === "priority"
                                ? "bg-[oklch(0.28_0.07_150)] border-[oklch(0.42_0.08_150)] text-[oklch(0.85_0.04_140)]"
                                : "bg-transparent border-[oklch(0.30_0.05_150)] text-[oklch(0.60_0.03_140)] hover:bg-[oklch(0.23_0.06_150)] hover:text-[oklch(0.78_0.04_140)]"
                            }`}
                          >
                            <Flame size={12} />
                            <span className="hidden sm:inline">
                              Priority (High → Low)
                            </span>
                            <span className="sm:hidden">Priority</span>
                          </button>
                          <button
                            type="button"
                            data-ocid="admin.sort_status.toggle"
                            onClick={() => setSortMode("status")}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-sans font-medium transition-colors border ${
                              sortMode === "status"
                                ? "bg-[oklch(0.28_0.07_150)] border-[oklch(0.42_0.08_150)] text-[oklch(0.85_0.04_140)]"
                                : "bg-transparent border-[oklch(0.30_0.05_150)] text-[oklch(0.60_0.03_140)] hover:bg-[oklch(0.23_0.06_150)] hover:text-[oklch(0.78_0.04_140)]"
                            }`}
                          >
                            <ListFilter size={12} />
                            <span className="hidden sm:inline">
                              Status (New → Completed)
                            </span>
                            <span className="sm:hidden">Status</span>
                          </button>
                        </div>

                        {/* Table */}
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
                                  Priority
                                </TableHead>
                                <TableHead className="text-[oklch(0.72_0.04_140)] font-semibold font-sans text-xs uppercase tracking-wider">
                                  Status
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
                                <TableHead className="text-[oklch(0.72_0.04_140)] font-semibold font-sans text-xs uppercase tracking-wider w-10" />
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {sortedRequests.map((req, i) => (
                                <TableRow
                                  key={req.id.toString()}
                                  data-ocid={`admin.row.${i + 1}`}
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
                                    <PriorityBadge
                                      priority={req.priority ?? Priority.low}
                                      onClick={() => handlePriorityClick(req)}
                                      isPending={priorityMutation.isPending}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <StatusBadge
                                      data-ocid={`admin.status_badge.${i + 1}`}
                                      status={req.status ?? Status.new_}
                                      onClick={() => handleStatusClick(req)}
                                      isPending={statusMutation.isPending}
                                    />
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
                                  <TableCell>
                                    <button
                                      type="button"
                                      data-ocid={
                                        OCID_DELETE_ROWS[i] ??
                                        `admin.delete_button.${i + 1}`
                                      }
                                      onClick={() => setDeleteTargetId(req.id)}
                                      title="Delete request"
                                      className="p-1.5 rounded-sm text-[oklch(0.50_0.03_140)] hover:text-[oklch(0.70_0.15_25)] hover:bg-[oklch(0.45_0.15_25/0.15)] transition-colors"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}
                </TabsContent>

                <TabsContent value="shop" className="mt-0">
                  <AdminShopTab />
                </TabsContent>

                <TabsContent value="vendors" className="mt-0">
                  <AdminVendorsTab isLoggedIn={isLoggedIn} />
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Admin Vendors Tab ────────────────────────────────────────────

const VENDOR_STATUS_CYCLE: Record<string, VendorApplicationStatus> = {
  [VendorApplicationStatus.pending]: VendorApplicationStatus.approved,
  [VendorApplicationStatus.approved]: VendorApplicationStatus.rejected,
  [VendorApplicationStatus.rejected]: VendorApplicationStatus.pending,
};

function VendorStatusBadge({
  status,
  onClick,
  isPending: mutPending,
}: {
  status: VendorApplicationStatus;
  onClick: () => void;
  isPending: boolean;
}) {
  const styles: Record<string, string> = {
    [VendorApplicationStatus.pending]:
      "bg-[oklch(0.55_0.14_65/0.2)] text-[oklch(0.82_0.12_65)] border border-[oklch(0.62_0.14_65/0.4)] hover:bg-[oklch(0.55_0.14_65/0.35)]",
    [VendorApplicationStatus.approved]:
      "bg-[oklch(0.42_0.12_145/0.2)] text-[oklch(0.72_0.10_145)] border border-[oklch(0.50_0.12_145/0.4)] hover:bg-[oklch(0.42_0.12_145/0.35)]",
    [VendorApplicationStatus.rejected]:
      "bg-[oklch(0.42_0.15_25/0.2)] text-[oklch(0.75_0.14_25)] border border-[oklch(0.55_0.15_25/0.4)] hover:bg-[oklch(0.42_0.15_25/0.35)]",
  };

  const label =
    status === VendorApplicationStatus.pending
      ? "Pending"
      : status === VendorApplicationStatus.approved
        ? "Approved"
        : "Rejected";

  const Icon =
    status === VendorApplicationStatus.pending
      ? Clock
      : status === VendorApplicationStatus.approved
        ? CheckCircle2
        : XCircle;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={mutPending}
      title="Click to cycle status"
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-xs font-sans font-medium transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${styles[status]}`}
    >
      <Icon size={10} />
      {label}
    </button>
  );
}

function VendorDetailSheet({
  vendor,
  open,
  onClose,
}: {
  vendor: VendorApplication | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!vendor) return null;

  const rows: Array<{ label: string; value: string | boolean }> = [
    { label: "Business Name", value: vendor.businessName },
    { label: "Business Type", value: vendor.businessType },
    { label: "Years in Business", value: vendor.yearsInBusiness },
    { label: "Business Description", value: vendor.businessDescription },
    { label: "Owner Name", value: vendor.ownerName },
    { label: "Email", value: vendor.email },
    { label: "Phone", value: vendor.phone },
    { label: "Address", value: vendor.addressLine },
    { label: "City", value: vendor.city },
    { label: "State", value: vendor.state },
    { label: "Country", value: vendor.country },
    { label: "Pincode", value: vendor.pincode },
    { label: "Product Types", value: vendor.productTypes },
    { label: "Categories", value: vendor.categories },
    { label: "Approx. Products", value: vendor.approxProducts },
    { label: "GST Number", value: vendor.gstNumber || "—" },
    {
      label: "Offers Shipping",
      value: vendor.offersShipping ? "Yes" : "No",
    },
    {
      label: "Offers Local Delivery",
      value: vendor.offersLocalDelivery ? "Yes" : "No",
    },
    { label: "Serviceable Areas", value: vendor.serviceableAreas },
  ];

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        data-ocid="admin.vendors.sheet"
        className="bg-[oklch(0.18_0.055_150)] border-[oklch(0.28_0.05_150)] text-white w-full sm:max-w-xl overflow-y-auto"
      >
        <SheetHeader className="mb-6">
          <SheetTitle className="font-display text-2xl font-light text-white">
            Vendor Application #{vendor.id.toString()}
          </SheetTitle>
        </SheetHeader>
        <div className="space-y-4">
          {rows.map(({ label, value }) => (
            <div
              key={label}
              className="border-b border-[oklch(0.25_0.05_150)] pb-3"
            >
              <p className="text-[oklch(0.50_0.025_140)] font-sans text-xs uppercase tracking-wider mb-0.5">
                {label}
              </p>
              <p className="text-[oklch(0.85_0.025_140)] font-sans text-sm break-words">
                {String(value) || "—"}
              </p>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function AdminVendorsTab({ isLoggedIn }: { isLoggedIn: boolean }) {
  const { actor, isFetching: isActorFetching } = useActor();
  const [deleteTargetId, setDeleteTargetId] = useState<bigint | null>(null);
  const [detailVendor, setDetailVendor] = useState<VendorApplication | null>(
    null,
  );

  const {
    data: vendors,
    isLoading,
    isError,
    refetch,
  } = useGetAllVendorApplications();

  const { data: vendorCount } = useGetVendorApplicationCount();

  const statusMutation = useUpdateVendorApplicationStatus();
  const deleteMutation = useDeleteVendorApplication();

  // Re-enable queries now that we're in the vendors tab and logged in
  // (they already have enabled: isLoggedIn from the hook, so this is fine)
  void actor;
  void isActorFetching;

  const stats = useMemo(() => {
    if (!vendors) return { total: 0, pending: 0, approved: 0, rejected: 0 };
    const arr = vendors as VendorApplication[];
    return {
      total: arr.length,
      pending: arr.filter((v) => v.status === VendorApplicationStatus.pending)
        .length,
      approved: arr.filter((v) => v.status === VendorApplicationStatus.approved)
        .length,
      rejected: arr.filter((v) => v.status === VendorApplicationStatus.rejected)
        .length,
    };
  }, [vendors]);

  function formatDate(timestamp: bigint) {
    const ms = Number(timestamp) / 1_000_000;
    return new Date(ms).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function handleStatusClick(vendor: VendorApplication) {
    const next =
      VENDOR_STATUS_CYCLE[vendor.status] ?? VendorApplicationStatus.pending;
    statusMutation.mutate({ id: vendor.id, status: next });
  }

  function handleDeleteConfirm() {
    if (deleteTargetId === null) return;
    deleteMutation.mutate(deleteTargetId, {
      onSettled: () => setDeleteTargetId(null),
    });
  }

  if (!isLoggedIn) return null;

  return (
    <div className="space-y-6">
      {/* Delete dialog */}
      <AlertDialog
        open={deleteTargetId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTargetId(null);
        }}
      >
        <AlertDialogContent
          data-ocid="admin.vendors.dialog"
          className="bg-[oklch(0.20_0.055_150)] border-[oklch(0.30_0.05_150)] text-white"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display font-light text-2xl text-white">
              Delete Application?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[oklch(0.65_0.03_140)] font-sans">
              Are you sure you want to delete this vendor application? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="admin.vendors.cancel_button"
              className="border-[oklch(0.35_0.05_150)] text-[oklch(0.72_0.04_140)] bg-transparent hover:bg-[oklch(0.25_0.05_150)] hover:text-white font-sans"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="admin.vendors.confirm_button"
              onClick={handleDeleteConfirm}
              className="bg-[oklch(0.45_0.18_25)] hover:bg-[oklch(0.40_0.18_25)] text-white font-sans border-0"
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Detail sheet */}
      <VendorDetailSheet
        vendor={detailVendor}
        open={detailVendor !== null}
        onClose={() => setDetailVendor(null)}
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Total Applications",
            value: vendorCount?.toString() ?? stats.total.toString(),
            icon: ClipboardList,
            color: "oklch(0.62_0.10_45)",
          },
          {
            label: "Pending",
            value: stats.pending.toString(),
            icon: Clock,
            color: "oklch(0.78_0.12_65)",
          },
          {
            label: "Approved",
            value: stats.approved.toString(),
            icon: CheckCircle2,
            color: "oklch(0.70_0.10_145)",
          },
          {
            label: "Rejected",
            value: stats.rejected.toString(),
            icon: XCircle,
            color: "oklch(0.68_0.14_25)",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="p-4 bg-[oklch(0.20_0.055_150)] border border-[oklch(0.28_0.05_150)] rounded-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon size={14} style={{ color }} />
              <p className="text-[oklch(0.55_0.03_140)] font-sans text-xs uppercase tracking-wider">
                {label}
              </p>
            </div>
            <p className="font-display text-2xl font-light text-white">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div data-ocid="admin.vendors.loading_state" className="space-y-3">
          {["sk1", "sk2", "sk3"].map((sk) => (
            <Skeleton
              key={sk}
              className="h-14 w-full bg-[oklch(0.23_0.06_150)] rounded-sm"
            />
          ))}
        </div>
      )}

      {/* Error */}
      {!isLoading && isError && (
        <div
          data-ocid="admin.vendors.error_state"
          className="flex flex-col items-center py-16 text-center"
        >
          <ShieldAlert size={32} className="text-destructive mb-4" />
          <h2 className="font-display text-2xl font-light text-white mb-2">
            Error Loading Vendors
          </h2>
          <p className="text-[oklch(0.65_0.03_140)] text-sm font-sans mb-4">
            Unable to fetch vendor applications. Please try again.
          </p>
          <Button
            variant="outline"
            onClick={() => void refetch()}
            className="border-[oklch(0.35_0.05_150)] text-[oklch(0.82_0.025_140)] hover:bg-[oklch(0.23_0.06_150)] rounded-sm"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && vendors && vendors.length === 0 && (
        <div
          data-ocid="admin.vendors.empty_state"
          className="flex flex-col items-center py-24 text-center"
        >
          <Store size={36} className="text-[oklch(0.45_0.04_140)] mb-5" />
          <h3 className="font-display text-2xl font-light text-white mb-2">
            No Vendor Applications Yet
          </h3>
          <p className="text-[oklch(0.60_0.03_140)] font-sans text-sm">
            Vendor applications will appear here once submitted.
          </p>
          <Button
            asChild
            className="mt-6 bg-[oklch(0.62_0.12_45)] hover:bg-[oklch(0.55_0.12_45)] text-white font-semibold rounded-sm"
          >
            <Link to="/sell-with-us">View Sell With Us Page</Link>
          </Button>
        </div>
      )}

      {/* Table */}
      {!isLoading && !isError && vendors && vendors.length > 0 && (
        <div className="overflow-x-auto rounded-sm border border-[oklch(0.28_0.05_150)]">
          <Table data-ocid="admin.vendors.table">
            <TableHeader>
              <TableRow className="border-[oklch(0.28_0.05_150)] bg-[oklch(0.20_0.055_150)] hover:bg-[oklch(0.20_0.055_150)]">
                <TableHead className="text-[oklch(0.72_0.04_140)] font-semibold font-sans text-xs uppercase tracking-wider">
                  ID
                </TableHead>
                <TableHead className="text-[oklch(0.72_0.04_140)] font-semibold font-sans text-xs uppercase tracking-wider">
                  Business
                </TableHead>
                <TableHead className="text-[oklch(0.72_0.04_140)] font-semibold font-sans text-xs uppercase tracking-wider">
                  Owner
                </TableHead>
                <TableHead className="text-[oklch(0.72_0.04_140)] font-semibold font-sans text-xs uppercase tracking-wider">
                  Email
                </TableHead>
                <TableHead className="text-[oklch(0.72_0.04_140)] font-semibold font-sans text-xs uppercase tracking-wider">
                  Type
                </TableHead>
                <TableHead className="text-[oklch(0.72_0.04_140)] font-semibold font-sans text-xs uppercase tracking-wider">
                  City
                </TableHead>
                <TableHead className="text-[oklch(0.72_0.04_140)] font-semibold font-sans text-xs uppercase tracking-wider">
                  Status
                </TableHead>
                <TableHead className="text-[oklch(0.72_0.04_140)] font-semibold font-sans text-xs uppercase tracking-wider">
                  Submitted
                </TableHead>
                <TableHead className="text-[oklch(0.72_0.04_140)] font-semibold font-sans text-xs uppercase tracking-wider w-20">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(vendors as VendorApplication[]).map((v, i) => (
                <TableRow
                  key={v.id.toString()}
                  data-ocid={`admin.vendors.row.${i + 1}`}
                  onClick={() => setDetailVendor(v)}
                  className="border-[oklch(0.25_0.05_150)] hover:bg-[oklch(0.22_0.055_150)] transition-colors cursor-pointer"
                >
                  <TableCell className="text-[oklch(0.55_0.03_140)] font-sans text-xs">
                    #{v.id.toString()}
                  </TableCell>
                  <TableCell className="text-white font-sans text-sm font-medium">
                    {v.businessName}
                  </TableCell>
                  <TableCell className="text-[oklch(0.75_0.04_140)] font-sans text-sm">
                    {v.ownerName}
                  </TableCell>
                  <TableCell className="text-[oklch(0.65_0.03_140)] font-sans text-sm truncate max-w-[160px]">
                    {v.email}
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-[oklch(0.35_0.06_150)] text-[oklch(0.82_0.025_140)] hover:bg-[oklch(0.35_0.06_150)] text-xs font-sans rounded-sm border-0">
                      {v.businessType}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[oklch(0.65_0.03_140)] font-sans text-sm">
                    {v.city}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <VendorStatusBadge
                      status={v.status}
                      onClick={() => handleStatusClick(v)}
                      isPending={statusMutation.isPending}
                    />
                  </TableCell>
                  <TableCell className="text-[oklch(0.55_0.03_140)] font-sans text-xs whitespace-nowrap">
                    {formatDate(v.submittedAt)}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setDetailVendor(v)}
                        title="View details"
                        className="p-1.5 rounded-sm text-[oklch(0.50_0.03_140)] hover:text-[oklch(0.72_0.08_150)] hover:bg-[oklch(0.28_0.06_150/0.5)] transition-colors"
                      >
                        <Building2 size={14} />
                      </button>
                      <button
                        type="button"
                        data-ocid={`admin.vendors.delete_button.${i + 1}`}
                        onClick={() => setDeleteTargetId(v.id)}
                        title="Delete application"
                        className="p-1.5 rounded-sm text-[oklch(0.50_0.03_140)] hover:text-[oklch(0.70_0.15_25)] hover:bg-[oklch(0.45_0.15_25/0.15)] transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// ─── Admin Shop Tab ───────────────────────────────────────────────
const SHOP_CATEGORIES = [
  {
    icon: Flower2,
    label: "Indoor Plants",
    desc: "Manage indoor plant listings and availability",
    count: 0,
  },
  {
    icon: TreePine,
    label: "Outdoor Plants",
    desc: "Manage outdoor plant and garden listings",
    count: 0,
  },
  {
    icon: Leaf,
    label: "Pots & Planters",
    desc: "Manage planter collections and designer pots",
    count: 0,
  },
  {
    icon: Sprout,
    label: "Seeds",
    desc: "Manage seed varieties and seed kit listings",
    count: 0,
  },
  {
    icon: Scissors,
    label: "Gardening Tools",
    desc: "Manage tool sets and equipment listings",
    count: 0,
  },
  {
    icon: Palette,
    label: "Decor & Accessories",
    desc: "Manage decorative items and accessories",
    count: 0,
  },
];

function AdminShopTab() {
  return (
    <div className="space-y-6">
      {/* Notice banner */}
      <div className="flex items-start gap-3 p-4 bg-[oklch(0.55_0.14_65/0.12)] border border-[oklch(0.62_0.14_65/0.3)] rounded-sm">
        <Boxes
          size={18}
          className="text-[oklch(0.78_0.10_65)] shrink-0 mt-0.5"
        />
        <div>
          <p className="text-[oklch(0.88_0.06_65)] font-sans text-sm font-medium">
            Product & Vendor Management — Coming Soon
          </p>
          <p className="text-[oklch(0.65_0.04_65)] font-sans text-sm mt-0.5">
            Full product listings, vendor management, and inventory controls
            will be available in a future update. The shop categories below are
            ready for activation.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Products", value: "0", icon: Tag },
          { label: "Active Vendors", value: "0", icon: User },
          { label: "Pending Applications", value: "0", icon: ClipboardList },
          { label: "Categories", value: "6", icon: ShoppingBag },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="p-4 bg-[oklch(0.20_0.055_150)] border border-[oklch(0.28_0.05_150)] rounded-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon size={14} className="text-[oklch(0.62_0.10_45)]" />
              <p className="text-[oklch(0.55_0.03_140)] font-sans text-xs uppercase tracking-wider">
                {label}
              </p>
            </div>
            <p className="font-display text-2xl font-light text-white">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Category cards */}
      <div>
        <h3 className="text-[oklch(0.72_0.04_140)] font-sans text-sm font-medium mb-4">
          Shop Categories
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SHOP_CATEGORIES.map(({ icon: Icon, label, desc, count }) => (
            <div
              key={label}
              className="flex items-start gap-3 p-4 bg-[oklch(0.20_0.055_150)] border border-[oklch(0.28_0.05_150)] rounded-sm hover:border-[oklch(0.40_0.08_150)] transition-colors"
            >
              <div className="w-9 h-9 rounded-sm bg-[oklch(0.62_0.12_45/0.12)] border border-[oklch(0.62_0.12_45/0.2)] flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-[oklch(0.70_0.10_45)]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-white font-sans text-sm font-medium">
                    {label}
                  </p>
                  <Badge className="bg-[oklch(0.25_0.05_150)] text-[oklch(0.55_0.03_140)] hover:bg-[oklch(0.25_0.05_150)] text-xs font-sans rounded-sm border border-[oklch(0.32_0.05_150)]">
                    {count} items
                  </Badge>
                </div>
                <p className="text-[oklch(0.50_0.03_140)] font-sans text-xs mt-1">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
