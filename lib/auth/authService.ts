// ─── Mock Auth Service ────────────────────────────────────────────────────────
// Frontend-only demo: no backend, no GraphQL, no REST calls.

export interface LoginResponse {
    accessToken: string;
    refreshToken?: string;
    user?: {
        id: string;
        email?: string;
        name?: string;
    };
}

const DEMO_USER = {
    id: "EMP-00142",
    email: "mayank.shukla@propvivo.com",
    name: "Mayank Shukla",
};

// ─── Login ────────────────────────────────────────────────────────────────────
// Accepts any non-empty credentials. No backend call is made.

export async function loginWithPassword(
    email: string,
    _password: string
): Promise<LoginResponse> {
    // Simulate a brief network delay for realism
    await new Promise((r) => setTimeout(r, 600));

    if (!email.trim()) {
        throw new Error("Please enter your email address.");
    }

    return {
        accessToken: "demo-access-token",
        refreshToken: "demo-refresh-token",
        user: {
            id: DEMO_USER.id,
            email: email.trim() || DEMO_USER.email,
            name: DEMO_USER.name,
        },
    };
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logout(): Promise<void> {
    // No-op in demo mode
}
