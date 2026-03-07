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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ArrowUpDown,
  CalendarDays,
  CheckCircle2,
  Circle,
  ClipboardList,
  Clock,
  Eye,
  EyeOff,
  Flame,
  ListFilter,
  Lock,
  LogOut,
  ShieldAlert,
  Trash2,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import type { ConsultationRequest } from "../backend.d";
import { Priority, Status } from "../backend.d";
import { useActor } from "../hooks/useActor";
import {
  useDeleteConsultationRequest,
  useUpdateRequestPriority,
  useUpdateRequestStatus,
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("date-desc");
  const [deleteTargetId, setDeleteTargetId] = useState<bigint | null>(null);

  const { actor, isFetching: isActorFetching } = useActor();
  const queryClient = useQueryClient();

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
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[oklch(0.58_0.03_140)] text-xs font-sans uppercase tracking-wider mr-1">
                        Sort:
                      </span>
                      <button
                        type="button"
                        data-ocid="admin.sort_date.toggle"
                        onClick={toggleDateSort}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-sans font-medium transition-colors border ${
                          sortMode === "date-desc" || sortMode === "date-asc"
                            ? "bg-[oklch(0.28_0.07_150)] border-[oklch(0.42_0.08_150)] text-[oklch(0.85_0.04_140)]"
                            : "bg-transparent border-[oklch(0.30_0.05_150)] text-[oklch(0.60_0.03_140)] hover:bg-[oklch(0.23_0.06_150)] hover:text-[oklch(0.78_0.04_140)]"
                        }`}
                      >
                        <CalendarDays size={12} />
                        Date
                        {sortMode === "date-desc" && <ArrowDown size={11} />}
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
                        Priority (High → Low)
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
                        Status (New → Completed)
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
