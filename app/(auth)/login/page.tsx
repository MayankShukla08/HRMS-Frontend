'use client';

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "../../../context/SessionContext";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
	return (
		<Suspense fallback={
			<div className="flex min-h-screen items-center justify-center">
				<Loader2 className="animate-spin text-primary" size={28} />
			</div>
		}>
			<LoginForm />
		</Suspense>
	);
}

function LoginForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { login } = useSession();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	async function onSubmit(e: FormEvent) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			await login({ email, password });
			const next = searchParams.get("next") || "/dashboard";
			router.replace(next);
		} catch (err: any) {
			setError(err?.message || "Invalid email or password. Please try again.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="flex min-h-screen bg-muted/40">
			{/* Left decorative panel — hidden on mobile */}
			<div className="hidden lg:flex lg:w-1/2 xl:w-[55%] flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-primary via-blue-600 to-secondary p-12">
				{/* Background circles */}
				<div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/5" />
				<div className="absolute -bottom-32 -right-20 h-[28rem] w-[28rem] rounded-full bg-white/5" />
				<div className="absolute top-1/3 right-8 h-48 w-48 rounded-full bg-white/5" />

				<div className="relative z-10 max-w-md text-white space-y-6">
					{/* Logo mark */}
					<div className="flex items-center gap-3">
						<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm text-white text-xl font-bold">
							H
						</div>
						<span className="text-xl font-semibold tracking-tight">PropVivo HRMS</span>
					</div>

					<div className="space-y-3 pt-4">
						<h2 className="text-4xl font-bold leading-tight">
							Manage your workforce,<br />
							<span className="text-blue-200">effortlessly.</span>
						</h2>
						<p className="text-blue-100 text-base leading-relaxed">
							One platform for attendance, payroll, leave, performance, and more — built for modern teams.
						</p>
					</div>

					{/* Feature pills */}
					<div className="flex flex-wrap gap-2 pt-2">
						{["Attendance", "Payroll", "Leave", "Analytics", "Performance"].map((f) => (
							<span
								key={f}
								className="rounded-full bg-white/15 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm"
							>
								{f}
							</span>
						))}
					</div>
				</div>
			</div>

			{/* Right — form panel */}
			<div className="flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-10">
				{/* Mobile logo */}
				<div className="flex items-center gap-2 mb-8 lg:hidden">
					<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white text-base font-bold">
						H
					</div>
					<span className="text-lg font-semibold tracking-tight">PropVivo HRMS</span>
				</div>

				<div className="w-full max-w-sm space-y-8">
					{/* Heading */}
					<div className="space-y-1">
						<h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome back</h1>
						<p className="text-sm text-muted-foreground">Sign in to your account to continue</p>
					</div>

					{/* Form */}
					<form onSubmit={onSubmit} className="space-y-5" noValidate>
						{/* Email */}
						<div className="space-y-1.5">
							<label htmlFor="email" className="block text-sm font-medium text-foreground">
								Email address
							</label>
							<div className="relative">
								<Mail
									size={16}
									className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
								/>
								<input
									id="email"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									autoComplete="email"
									className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
									placeholder="you@company.com"
								/>
							</div>
						</div>

						{/* Password */}
						<div className="space-y-1.5">
							<div className="flex items-center justify-between">
								<label htmlFor="password" className="block text-sm font-medium text-foreground">
									Password
								</label>
								<button
									type="button"
									className="text-xs text-primary hover:underline focus:outline-none"
								>
									Forgot password?
								</button>
							</div>
							<div className="relative">
								<Lock
									size={16}
									className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
								/>
								<input
									id="password"
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									autoComplete="current-password"
									className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-10 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
									placeholder="••••••••"
								/>
								<button
									type="button"
									onClick={() => setShowPassword((v) => !v)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
									aria-label={showPassword ? "Hide password" : "Show password"}
								>
									{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
								</button>
							</div>
						</div>

						{/* Error banner */}
						{error && (
							<div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/8 px-3.5 py-2.5">
								<span className="mt-px text-destructive text-xs leading-relaxed">{error}</span>
							</div>
						)}

						{/* Submit */}
						<button
							type="submit"
							disabled={loading}
							className="group flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
						>
							{loading ? (
								<>
									<Loader2 size={16} className="animate-spin" />
									Signing in…
								</>
							) : (
								<>
									Sign in
									<ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
								</>
							)}
						</button>
					</form>

					{/* Footer note */}
					<p className="text-center text-xs text-muted-foreground">
						Having trouble signing in?{" "}
						<a href="mailto:support@propvivo.com" className="text-primary hover:underline">
							Contact support
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}
