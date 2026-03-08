import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  Ban,
  CheckCircle2,
  Globe,
  Loader2,
  Lock,
  LogOut,
  Monitor,
  Shield,
  ShieldOff,
  Smartphone,
  Tablet,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import type { SessionInfo } from "../backend.d";
import { useActor } from "../hooks/useActor";

const ADMIN_PASSWORD = "plantly2024";
const SESSION_KEY = "plantly_admin_session";

// ── UA parser ─────────────────────────────────────────────────────────────────
function parseUserAgent(ua: string): string {
  if (!ua) return "Unknown Device";
  const browsers = [
    { name: "Edge", pattern: /Edg\/[\d.]+/ },
    { name: "Chrome", pattern: /Chrome\/[\d.]+/ },
    { name: "Firefox", pattern: /Firefox\/[\d.]+/ },
    { name: "Safari", pattern: /Safari\/[\d.]+/ },
  ];
  const oses = [
    { name: "iPhone", pattern: /iPhone/ },
    { name: "iPad", pattern: /iPad/ },
    { name: "Android", pattern: /Android/ },
    { name: "Windows", pattern: /Windows/ },
    { name: "Mac", pattern: /Macintosh|Mac OS X/ },
    { name: "Linux", pattern: /Linux/ },
  ];
  const browser = browsers.find((b) => b.pattern.test(ua))?.name ?? "Browser";
  const os = oses.find((o) => o.pattern.test(ua))?.name ?? "Unknown OS";
  return `${browser} on ${os}`;
}

function getDeviceIcon(ua: string) {
  if (/iPhone|iPad|Android/i.test(ua)) return Smartphone;
  if (/iPad|Tablet/i.test(ua)) return Tablet;
  return Monitor;
}

function formatLoginTime(ns: bigint): string {
  const ms = Number(ns) / 1_000_000;
  return new Date(ms).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTimezone(tz: string): string {
  if (!tz) return "Unknown Location";
  // Convert "America/New_York" → "New York, America"
  const parts = tz.split("/");
  if (parts.length === 2) {
    const city = parts[1].replace(/_/g, " ");
    const region = parts[0].replace(/_/g, " ");
    return `${city}, ${region}`;
  }
  return tz.replace(/_/g, " ");
}

// ── Password confirmation inline form ─────────────────────────────────────────
interface PasswordConfirmProps {
  onConfirm: () => void;
  onCancel: () => void;
  label: string;
  isLoading?: boolean;
}

function PasswordConfirmForm({
  onConfirm,
  onCancel,
  label,
  isLoading = false,
}: PasswordConfirmProps) {
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (pass1 !== pass2) {
      setError("Passwords do not match.");
      return;
    }
    if (pass1 !== ADMIN_PASSWORD) {
      setError("Incorrect admin password.");
      return;
    }
    onConfirm();
  }

  const canSubmit = pass1.length > 0 && pass2.length > 0 && !isLoading;

  return (
    <motion.form
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      onSubmit={handleSubmit}
      data-ocid="sessions.dialog"
      className="mt-3 p-4 rounded-sm border border-[oklch(0.38_0.10_45/0.6)] bg-[oklch(0.16_0.05_150)] space-y-3"
    >
      <p className="text-[oklch(0.78_0.10_45)] font-sans text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
        <Lock size={11} />
        Confirm Password to {label}
      </p>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label
            htmlFor="confirm-pass1"
            className="text-[oklch(0.62_0.03_140)] font-sans text-xs"
          >
            Enter password
          </Label>
          <Input
            id="confirm-pass1"
            data-ocid="sessions.input"
            type="password"
            autoComplete="off"
            placeholder="••••••••••••"
            value={pass1}
            onChange={(e) => {
              setPass1(e.target.value);
              setError("");
            }}
            className="bg-[oklch(0.22_0.055_150)] border-[oklch(0.32_0.05_150)] text-white placeholder:text-[oklch(0.40_0.03_140)] focus:border-[oklch(0.62_0.12_45)] rounded-sm font-sans text-sm h-8"
          />
        </div>
        <div className="space-y-1">
          <Label
            htmlFor="confirm-pass2"
            className="text-[oklch(0.62_0.03_140)] font-sans text-xs"
          >
            Confirm password
          </Label>
          <Input
            id="confirm-pass2"
            data-ocid="sessions.textarea"
            type="password"
            autoComplete="off"
            placeholder="••••••••••••"
            value={pass2}
            onChange={(e) => {
              setPass2(e.target.value);
              setError("");
            }}
            className="bg-[oklch(0.22_0.055_150)] border-[oklch(0.32_0.05_150)] text-white placeholder:text-[oklch(0.40_0.03_140)] focus:border-[oklch(0.62_0.12_45)] rounded-sm font-sans text-sm h-8"
          />
        </div>
      </div>
      {error && (
        <p
          data-ocid="sessions.error_state"
          className="text-[oklch(0.65_0.15_25)] text-xs font-sans flex items-center gap-1"
        >
          <AlertTriangle size={11} />
          {error}
        </p>
      )}
      <div className="flex gap-2 pt-1">
        <Button
          data-ocid="sessions.confirm_button"
          type="submit"
          disabled={!canSubmit}
          size="sm"
          className="bg-[oklch(0.62_0.12_45)] hover:bg-[oklch(0.55_0.12_45)] text-white font-sans text-xs rounded-sm h-7 px-3"
        >
          {isLoading ? (
            <Loader2 size={11} className="animate-spin mr-1" />
          ) : null}
          Confirm
        </Button>
        <Button
          data-ocid="sessions.cancel_button"
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={isLoading}
          className="text-[oklch(0.62_0.03_140)] hover:text-white hover:bg-[oklch(0.25_0.055_150)] font-sans text-xs rounded-sm h-7 px-3"
        >
          Cancel
        </Button>
      </div>
    </motion.form>
  );
}

// ── Types ──────────────────────────────────────────────────────────────────────
type PendingAction =
  | { type: "logout-single"; token: string }
  | { type: "block-single"; token: string }
  | { type: "logout-bulk"; tokens: string[] }
  | { type: "block-bulk"; tokens: string[] };

// ── Main page ──────────────────────────────────────────────────────────────────
export default function SessionsPage() {
  const navigate = useNavigate();
  const { actor, isFetching: isActorFetching } = useActor();
  const queryClient = useQueryClient();
  const currentToken = localStorage.getItem(SESSION_KEY) ?? "";

  // Redirect if not logged in
  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) {
      void navigate({ to: "/admin" });
    }
  }, [navigate]);

  const [selectedTokens, setSelectedTokens] = useState<Set<string>>(new Set());
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(
    null,
  );

  // ── Queries ──────────────────────────────────────────────────────────────────
  const {
    data: sessions,
    isLoading: sessionsLoading,
    isError: sessionsError,
    refetch: refetchSessions,
  } = useQuery<SessionInfo[]>({
    queryKey: ["adminSessions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAdminSessions();
    },
    enabled: !!actor && !isActorFetching,
    retry: false,
  });

  const {
    data: blockedTokens,
    isLoading: blockedLoading,
    refetch: refetchBlocked,
  } = useQuery<string[]>({
    queryKey: ["blockedSessions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBlockedSessions();
    },
    enabled: !!actor && !isActorFetching,
    retry: false,
  });

  async function refetchAll() {
    await Promise.all([refetchSessions(), refetchBlocked()]);
  }

  // ── Mutations ────────────────────────────────────────────────────────────────
  const logoutMutation = useMutation({
    mutationFn: async (tokens: string[]) => {
      if (!actor) throw new Error("No actor");
      await Promise.all(tokens.map((t) => actor.removeAdminSession(t)));
    },
    onSuccess: async (_, tokens) => {
      void queryClient.invalidateQueries({ queryKey: ["adminSessions"] });
      if (tokens.includes(currentToken)) {
        localStorage.removeItem(SESSION_KEY);
        void navigate({ to: "/admin" });
      } else {
        await refetchAll();
      }
    },
  });

  const blockMutation = useMutation({
    mutationFn: async (tokens: string[]) => {
      if (!actor) throw new Error("No actor");
      await Promise.all(tokens.map((t) => actor.blockSession(t)));
    },
    onSuccess: async (_, tokens) => {
      void queryClient.invalidateQueries({ queryKey: ["adminSessions"] });
      void queryClient.invalidateQueries({ queryKey: ["blockedSessions"] });
      if (tokens.includes(currentToken)) {
        localStorage.removeItem(SESSION_KEY);
        void navigate({ to: "/admin" });
      } else {
        await refetchAll();
      }
    },
  });

  const unblockMutation = useMutation({
    mutationFn: async (token: string) => {
      if (!actor) throw new Error("No actor");
      return actor.unblockSession(token);
    },
    onSuccess: async () => {
      void queryClient.invalidateQueries({ queryKey: ["blockedSessions"] });
      await refetchBlocked();
    },
  });

  const isActionLoading =
    logoutMutation.isPending ||
    blockMutation.isPending ||
    unblockMutation.isPending;

  // ── Selection helpers ────────────────────────────────────────────────────────
  const allTokens = useMemo(
    () => (sessions ?? []).map((s) => s.token),
    [sessions],
  );

  function toggleSelect(token: string) {
    setSelectedTokens((prev) => {
      const next = new Set(prev);
      if (next.has(token)) next.delete(token);
      else next.add(token);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedTokens.size === allTokens.length) {
      setSelectedTokens(new Set());
    } else {
      setSelectedTokens(new Set(allTokens));
    }
  }

  // ── Confirm handler ──────────────────────────────────────────────────────────
  function handleConfirm() {
    if (!pendingAction) return;
    const action = pendingAction;
    setPendingAction(null);
    setSelectedTokens(new Set());

    if (action.type === "logout-single") {
      logoutMutation.mutate([action.token]);
    } else if (action.type === "block-single") {
      blockMutation.mutate([action.token]);
    } else if (action.type === "logout-bulk") {
      logoutMutation.mutate(action.tokens);
    } else if (action.type === "block-bulk") {
      blockMutation.mutate(action.tokens);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[oklch(0.18_0.055_150)] pt-16">
      {/* Header */}
      <div className="bg-[oklch(0.14_0.04_150)] border-b border-[oklch(0.25_0.05_150)] py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/admin"
            data-ocid="sessions.link"
            className="inline-flex items-center gap-2 text-[oklch(0.72_0.04_140)] hover:text-[oklch(0.62_0.12_45)] text-sm font-sans transition-colors mb-4"
          >
            <ArrowLeft size={14} />
            Back to Admin Panel
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-sm bg-[oklch(0.62_0.12_45/0.15)] flex items-center justify-center flex-shrink-0">
              <Shield size={20} className="text-[oklch(0.62_0.12_45)]" />
            </div>
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-light text-white">
                Manage Sessions
              </h1>
              <p className="text-[oklch(0.62_0.04_140)] text-sm font-sans mt-0.5">
                Devices logged into the admin panel
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        {/* ── Active Sessions ───────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <h2 className="font-display text-2xl font-light text-white flex items-center gap-2">
              <Monitor
                size={18}
                className="text-[oklch(0.62_0.12_45)] flex-shrink-0"
              />
              Active Sessions
              {sessions && sessions.length > 0 && (
                <Badge className="bg-[oklch(0.28_0.07_150)] text-[oklch(0.78_0.04_140)] text-xs font-sans rounded-sm border border-[oklch(0.35_0.06_150)] hover:bg-[oklch(0.28_0.07_150)] ml-1">
                  {sessions.length}
                </Badge>
              )}
            </h2>
            {sessions && sessions.length > 0 && (
              <button
                type="button"
                data-ocid="sessions.toggle"
                onClick={toggleSelectAll}
                className="text-[oklch(0.60_0.03_140)] hover:text-[oklch(0.78_0.04_140)] text-xs font-sans transition-colors underline underline-offset-2"
              >
                {selectedTokens.size === allTokens.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
            )}
          </div>

          {/* Bulk action toolbar */}
          <AnimatePresence>
            {selectedTokens.size > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden mb-4"
              >
                <div className="bg-[oklch(0.20_0.055_150)] border border-[oklch(0.32_0.07_45/0.5)] rounded-sm px-4 py-3 flex items-center gap-3 flex-wrap">
                  <span className="text-[oklch(0.78_0.10_45)] text-xs font-sans font-semibold">
                    {selectedTokens.size} device
                    {selectedTokens.size !== 1 ? "s" : ""} selected
                  </span>
                  <div className="flex gap-2 ml-auto">
                    <Button
                      data-ocid="sessions.secondary_button"
                      size="sm"
                      variant="outline"
                      disabled={isActionLoading}
                      onClick={() =>
                        setPendingAction({
                          type: "logout-bulk",
                          tokens: [...selectedTokens],
                        })
                      }
                      className="border-[oklch(0.35_0.05_150)] text-[oklch(0.72_0.04_140)] hover:bg-[oklch(0.25_0.055_150)] hover:text-white rounded-sm font-sans text-xs h-7 flex items-center gap-1.5"
                    >
                      <LogOut size={11} />
                      Log Out Selected
                    </Button>
                    <Button
                      data-ocid="sessions.delete_button"
                      size="sm"
                      disabled={isActionLoading}
                      onClick={() =>
                        setPendingAction({
                          type: "block-bulk",
                          tokens: [...selectedTokens],
                        })
                      }
                      className="bg-[oklch(0.40_0.15_25/0.85)] hover:bg-[oklch(0.45_0.15_25)] text-[oklch(0.90_0.08_25)] rounded-sm font-sans text-xs h-7 flex items-center gap-1.5 border border-[oklch(0.50_0.15_25/0.5)]"
                    >
                      <Ban size={11} />
                      Block Selected
                    </Button>
                  </div>
                </div>

                {/* Bulk password confirm */}
                <AnimatePresence>
                  {(pendingAction?.type === "logout-bulk" ||
                    pendingAction?.type === "block-bulk") && (
                    <PasswordConfirmForm
                      label={
                        pendingAction.type === "logout-bulk"
                          ? "Log Out Selected"
                          : "Block Selected"
                      }
                      onConfirm={handleConfirm}
                      onCancel={() => setPendingAction(null)}
                      isLoading={isActionLoading}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sessions list */}
          {sessionsLoading && (
            <div data-ocid="sessions.loading_state" className="space-y-3">
              {[1, 2, 3].map((n) => (
                <Skeleton
                  key={n}
                  className="h-20 w-full bg-[oklch(0.22_0.055_150)] rounded-sm"
                />
              ))}
            </div>
          )}

          {!sessionsLoading && sessionsError && (
            <div
              data-ocid="sessions.error_state"
              className="flex flex-col items-center py-12 text-center border border-[oklch(0.28_0.05_150)] rounded-sm bg-[oklch(0.20_0.055_150)]"
            >
              <AlertTriangle
                size={28}
                className="text-[oklch(0.62_0.15_25)] mb-3"
              />
              <p className="text-white font-sans text-sm mb-3">
                Unable to load sessions
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => void refetchSessions()}
                className="border-[oklch(0.35_0.05_150)] text-[oklch(0.72_0.04_140)] hover:bg-[oklch(0.25_0.055_150)] rounded-sm font-sans text-xs"
              >
                Retry
              </Button>
            </div>
          )}

          {!sessionsLoading && !sessionsError && sessions?.length === 0 && (
            <div
              data-ocid="sessions.empty_state"
              className="flex flex-col items-center py-12 text-center border border-[oklch(0.28_0.05_150)] rounded-sm bg-[oklch(0.20_0.055_150)]"
            >
              <Monitor size={28} className="text-[oklch(0.40_0.04_140)] mb-3" />
              <p className="text-[oklch(0.65_0.03_140)] font-sans text-sm">
                No active sessions found.
              </p>
            </div>
          )}

          {!sessionsLoading &&
            !sessionsError &&
            sessions &&
            sessions.length > 0 && (
              <div data-ocid="sessions.list" className="space-y-3">
                {sessions.map((session, i) => {
                  const isCurrentDevice = session.token === currentToken;
                  const DeviceIcon = getDeviceIcon(session.deviceInfo);
                  const isSelected = selectedTokens.has(session.token);
                  const isThisActionPending =
                    pendingAction?.type === "logout-single" &&
                    pendingAction.token === session.token;
                  const isThisBlockPending =
                    pendingAction?.type === "block-single" &&
                    pendingAction.token === session.token;

                  return (
                    <motion.div
                      key={session.token}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      data-ocid={`sessions.item.${i + 1}`}
                    >
                      <div
                        className={`rounded-sm border transition-colors ${
                          isSelected
                            ? "border-[oklch(0.50_0.10_45/0.7)] bg-[oklch(0.21_0.06_150)]"
                            : "border-[oklch(0.28_0.05_150)] bg-[oklch(0.20_0.055_150)]"
                        } ${isCurrentDevice ? "ring-1 ring-[oklch(0.55_0.12_45/0.35)]" : ""}`}
                      >
                        <div className="p-4 flex items-start gap-3">
                          {/* Checkbox */}
                          <div className="pt-0.5">
                            <Checkbox
                              data-ocid={`sessions.checkbox.${i + 1}`}
                              checked={isSelected}
                              onCheckedChange={() =>
                                toggleSelect(session.token)
                              }
                              className="border-[oklch(0.38_0.05_150)] data-[state=checked]:bg-[oklch(0.62_0.12_45)] data-[state=checked]:border-[oklch(0.62_0.12_45)]"
                            />
                          </div>

                          {/* Device icon */}
                          <div className="w-9 h-9 rounded-sm bg-[oklch(0.25_0.06_150)] flex items-center justify-center flex-shrink-0">
                            <DeviceIcon
                              size={18}
                              className="text-[oklch(0.65_0.04_140)]"
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="text-white font-sans text-sm font-medium">
                                {parseUserAgent(session.deviceInfo)}
                              </span>
                              {isCurrentDevice && (
                                <Badge className="bg-[oklch(0.55_0.12_45/0.25)] text-[oklch(0.78_0.10_45)] border border-[oklch(0.62_0.12_45/0.4)] hover:bg-[oklch(0.55_0.12_45/0.25)] text-xs font-sans rounded-sm">
                                  This device
                                </Badge>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[oklch(0.60_0.03_140)] font-sans">
                              {session.timezone && (
                                <span className="flex items-center gap-1">
                                  <Globe size={10} className="flex-shrink-0" />
                                  {formatTimezone(session.timezone)}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Monitor size={10} className="flex-shrink-0" />
                                Logged in {formatLoginTime(session.loginTime)}
                              </span>
                              {session.ipHint && (
                                <span className="flex items-center gap-1 text-[oklch(0.55_0.03_140)]">
                                  IP: {session.ipHint}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                            <button
                              type="button"
                              data-ocid={`sessions.secondary_button.${i + 1}`}
                              onClick={() =>
                                setPendingAction({
                                  type: "logout-single",
                                  token: session.token,
                                })
                              }
                              disabled={isActionLoading}
                              title="Log out this device"
                              className="p-1.5 rounded-sm text-[oklch(0.55_0.03_140)] hover:text-[oklch(0.78_0.04_140)] hover:bg-[oklch(0.28_0.06_150)] transition-colors disabled:opacity-40"
                            >
                              <LogOut size={14} />
                            </button>
                            <button
                              type="button"
                              data-ocid={`sessions.delete_button.${i + 1}`}
                              onClick={() =>
                                setPendingAction({
                                  type: "block-single",
                                  token: session.token,
                                })
                              }
                              disabled={isActionLoading}
                              title="Block this device"
                              className="p-1.5 rounded-sm text-[oklch(0.55_0.03_140)] hover:text-[oklch(0.70_0.15_25)] hover:bg-[oklch(0.45_0.15_25/0.15)] transition-colors disabled:opacity-40"
                            >
                              <Ban size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Per-session password confirm */}
                        <AnimatePresence>
                          {(isThisActionPending || isThisBlockPending) && (
                            <div className="px-4 pb-4">
                              <PasswordConfirmForm
                                label={
                                  isThisActionPending
                                    ? "Log Out"
                                    : "Block Device"
                                }
                                onConfirm={handleConfirm}
                                onCancel={() => setPendingAction(null)}
                                isLoading={isActionLoading}
                              />
                            </div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
        </section>

        {/* ── Blocked Devices ──────────────────────────────────────────────── */}
        <section>
          <h2 className="font-display text-2xl font-light text-white flex items-center gap-2 mb-5">
            <ShieldOff
              size={18}
              className="text-[oklch(0.65_0.15_25)] flex-shrink-0"
            />
            Blocked Devices
            {blockedTokens && blockedTokens.length > 0 && (
              <Badge className="bg-[oklch(0.40_0.15_25/0.2)] text-[oklch(0.75_0.12_25)] text-xs font-sans rounded-sm border border-[oklch(0.50_0.15_25/0.35)] hover:bg-[oklch(0.40_0.15_25/0.2)] ml-1">
                {blockedTokens.length}
              </Badge>
            )}
          </h2>

          {blockedLoading && (
            <div className="space-y-2">
              {[1, 2].map((n) => (
                <Skeleton
                  key={n}
                  className="h-14 w-full bg-[oklch(0.22_0.055_150)] rounded-sm"
                />
              ))}
            </div>
          )}

          {!blockedLoading &&
            (!blockedTokens || blockedTokens.length === 0) && (
              <div
                data-ocid="sessions.blocked.empty_state"
                className="flex items-center gap-3 py-8 justify-center border border-[oklch(0.26_0.04_150)] rounded-sm bg-[oklch(0.19_0.05_150)]"
              >
                <CheckCircle2
                  size={18}
                  className="text-[oklch(0.55_0.10_145)]"
                />
                <p className="text-[oklch(0.62_0.03_140)] font-sans text-sm">
                  No blocked devices
                </p>
              </div>
            )}

          {!blockedLoading && blockedTokens && blockedTokens.length > 0 && (
            <div className="space-y-2">
              {blockedTokens.map((token, i) => (
                <motion.div
                  key={token}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  data-ocid={`sessions.blocked.item.${i + 1}`}
                  className="flex items-center gap-3 p-3 rounded-sm border border-[oklch(0.38_0.10_25/0.35)] bg-[oklch(0.19_0.05_150)]"
                >
                  <Ban
                    size={14}
                    className="text-[oklch(0.60_0.13_25)] flex-shrink-0"
                  />
                  <span className="text-[oklch(0.58_0.03_140)] font-mono text-xs flex-1 min-w-0 truncate">
                    {token.length > 24
                      ? `${token.slice(0, 12)}…${token.slice(-8)}`
                      : token}
                  </span>
                  <Button
                    data-ocid={`sessions.save_button.${i + 1}`}
                    size="sm"
                    variant="outline"
                    disabled={unblockMutation.isPending}
                    onClick={() => unblockMutation.mutate(token)}
                    className="border-[oklch(0.35_0.07_145/0.7)] text-[oklch(0.68_0.08_145)] hover:bg-[oklch(0.30_0.08_145/0.25)] hover:text-[oklch(0.80_0.10_145)] rounded-sm font-sans text-xs h-7 px-3 flex items-center gap-1.5"
                  >
                    {unblockMutation.isPending ? (
                      <Loader2 size={10} className="animate-spin" />
                    ) : (
                      <Shield size={10} />
                    )}
                    Unblock
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Footer note */}
        <p className="text-[oklch(0.45_0.03_140)] font-sans text-xs text-center pb-4">
          Blocking a device logs it out immediately and prevents future logins
          from that session token.
        </p>
      </div>
    </div>
  );
}
