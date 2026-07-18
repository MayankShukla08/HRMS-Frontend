import { gql } from "@apollo/client";
import { apolloClient } from "@/lib/apolloClient";
import {
    clearAccessToken,
    clearRefreshToken,
    getAccessToken,
    refreshAccessTokenSilently,
    setAccessToken,
    setRefreshToken,
} from "./tokenStorage";

// ─── GraphQL mutation — must match the backend LoginMutation field name exactly ──

const LOGIN_MUTATION = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            data {
                accessToken
                refreshToken
                employeeId
                username
                email
                role
            }
            message
            statusCode
            success
        }
    }
`;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LoginResponse {
    accessToken: string;
    refreshToken?: string;
    user?: {
        id: string;
        email?: string;
        name?: string;
    };
}

// ─── Dummy credentials (remove once real backend auth is wired) ───────────────

const DUMMY_USER = {
    email: "arjun.mehta@propvivo.com",
    password: "2233",
    accessToken: "dummy-access-token-arjun-mehta",
    refreshToken: "dummy-refresh-token-arjun-mehta",
    id: "EMP-00142",
    name: "Arjun Mehta",
};

// ─── Login ────────────────────────────────────────────────────────────────────

export async function loginWithPassword(
    email: string,
    password: string
): Promise<LoginResponse> {
    // ── Dummy flow: bypass GraphQL until backend auth is implemented ──────────
    if (
        email.trim().toLowerCase() === DUMMY_USER.email &&
        password === DUMMY_USER.password
    ) {
        setAccessToken(DUMMY_USER.accessToken);
        setRefreshToken(DUMMY_USER.refreshToken);
        return {
            accessToken: DUMMY_USER.accessToken,
            refreshToken: DUMMY_USER.refreshToken,
            user: {
                id: DUMMY_USER.id,
                email: DUMMY_USER.email,
                name: DUMMY_USER.name,
            },
        };
    }
    // ── Real GraphQL flow (active once backend auth mutation is live) ─────────

    const { data, errors } = await apolloClient.mutate({
        mutation: LOGIN_MUTATION,
        variables: { email, password },
    });

    // Surface GraphQL-level errors (validation, auth, etc.)
    if (errors?.length) {
        throw new Error(errors[0].message);
    }

    const payload = data?.login;

    if (!payload?.success) {
        throw new Error(payload?.message || "Login failed");
    }

    const result = payload.data;

    setAccessToken(result.accessToken);
    if (result.refreshToken) setRefreshToken(result.refreshToken);

    return {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken ?? undefined,
        user: {
            id: result.employeeId ?? result.username ?? "",
            email: result.email ?? undefined,
            name: result.username ?? undefined,
        },
    };
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logout(): Promise<void> {
    clearAccessToken();
    clearRefreshToken();
}

// ─── Authenticated fetch (non-GraphQL REST calls, if any) ────────────────────

export async function fetchWithAuth(
    input: RequestInfo | URL,
    init?: RequestInit,
    retryOn401 = true
): Promise<Response> {
    const withAuth = async (): Promise<Response> => {
        const token = getAccessToken();
        const headers = new Headers(init?.headers || {});
        if (token) headers.set("Authorization", `Bearer ${token}`);
        return fetch(input, { ...init, headers, credentials: "include" });
    };

    let res = await withAuth();

    if (res.status === 401 && retryOn401) {
        const token = await refreshAccessTokenSilently();
        if (token) {
            res = await withAuth();
        }
    }

    return res;
}
