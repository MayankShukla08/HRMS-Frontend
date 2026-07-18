'use client';

import { Provider as ReduxProvider } from "react-redux";
import { PropsWithChildren } from "react";
import { store } from "../store";
import { SessionProvider } from "../context/SessionContext";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }: PropsWithChildren) {
	return (
		<ReduxProvider store={store}>
			<SessionProvider>
				<TooltipProvider delayDuration={300}>
					{children}
				</TooltipProvider>
			</SessionProvider>
		</ReduxProvider>
	);
}
