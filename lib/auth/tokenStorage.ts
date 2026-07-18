// ─── Token Storage Stubs ──────────────────────────────────────────────────────
// Frontend-only demo: all token functions are no-ops.

export function getAccessToken(): string | null { return null; }
export function setAccessToken(_token: string): void {}
export function clearAccessToken(): void {}

export function getRefreshToken(): string | null { return null; }
export function setRefreshToken(_token: string): void {}
export function clearRefreshToken(): void {}

export async function refreshAccessTokenSilently(): Promise<string | null> {
    return null;
}
