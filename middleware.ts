import { NextResponse } from "next/server";

// Frontend-only demo: no auth gate. All routes are publicly accessible.
export function middleware() {
	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!_next|favicon.ico|public|api).*)"],
};
