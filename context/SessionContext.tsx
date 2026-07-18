'use client';

import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from "react";
import { loginWithPassword, logout as authLogout } from "../lib/auth/authService";

export type AuthUser = {
	id: string;
	email?: string;
	name?: string;
};

export type SessionContextValue = {
	isAuthenticated: boolean;
	user: AuthUser | null;
	login: (args: { email: string; password: string }) => Promise<void>;
	logout: () => Promise<void>;
};

// Pre-seed with the demo user so the app starts logged in.
const DEMO_USER: AuthUser = {
	id: "EMP-00142",
	email: "mayank.shukla@propvivo.com",
	name: "Mayank Shukla",
};

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: PropsWithChildren) {
	const [user, setUser] = useState<AuthUser | null>(DEMO_USER);
	const isAuthenticated = Boolean(user);

	const login = useCallback(async ({ email, password }: { email: string; password: string }) => {
		const res = await loginWithPassword(email, password);
		const nextUser: AuthUser | null = res.user
			? { id: res.user.id, name: res.user.name, email: res.user.email }
			: null;
		setUser(nextUser);
	}, []);

	const signOut = useCallback(async () => {
		await authLogout();
		setUser(null);
	}, []);

	const value = useMemo<SessionContextValue>(() => ({
		isAuthenticated,
		user,
		login,
		logout: signOut,
	}), [isAuthenticated, login, signOut, user]);

	return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
	const ctx = useContext(SessionContext);
	if (!ctx) throw new Error("useSession must be used within SessionProvider");
	return ctx;
}
