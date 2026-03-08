import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { CustomerUser } from "../backend.d";
import { useActor } from "../hooks/useActor";

const TOKEN_KEY = "plantly_customer_token";

interface CustomerAuthState {
  token: string | null;
  customer: CustomerUser | null;
  isLoading: boolean;
}

interface CustomerAuthContextValue extends CustomerAuthState {
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const CustomerAuthContext = createContext<CustomerAuthContextValue | null>(
  null,
);

export function CustomerAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { actor } = useActor();
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY),
  );
  const [customer, setCustomer] = useState<CustomerUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount + whenever actor/token changes, restore session
  useEffect(() => {
    if (!actor) return;
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    actor
      .getCustomerProfile(stored)
      .then((profile) => {
        if (profile) {
          setToken(stored);
          setCustomer(profile);
        } else {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setCustomer(null);
        }
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setCustomer(null);
      })
      .finally(() => setIsLoading(false));
  }, [actor]);

  const login = useCallback(
    async (newToken: string) => {
      localStorage.setItem(TOKEN_KEY, newToken);
      setToken(newToken);
      if (actor) {
        const profile = await actor.getCustomerProfile(newToken);
        setCustomer(profile ?? null);
      }
    },
    [actor],
  );

  const logout = useCallback(async () => {
    const t = localStorage.getItem(TOKEN_KEY);
    if (t && actor) {
      await actor.logoutCustomer(t).catch(() => {});
    }
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setCustomer(null);
  }, [actor]);

  const refreshProfile = useCallback(async () => {
    const t = localStorage.getItem(TOKEN_KEY);
    if (!t || !actor) return;
    const profile = await actor.getCustomerProfile(t);
    setCustomer(profile ?? null);
  }, [actor]);

  return (
    <CustomerAuthContext.Provider
      value={{ token, customer, isLoading, login, logout, refreshProfile }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) {
    throw new Error("useCustomerAuth must be used within CustomerAuthProvider");
  }
  return ctx;
}
