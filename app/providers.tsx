'use client';

import { Provider as ReduxProvider } from "react-redux";
import { ApolloProvider } from "@apollo/client/react";
import { PropsWithChildren } from "react";
import { store } from "../store";
import { apolloClient } from "../lib/apolloClient";
import { SessionProvider } from "../context/SessionContext";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }: PropsWithChildren) {
	return (
		<ReduxProvider store={store}>
			<ApolloProvider client={apolloClient}>
				<SessionProvider>
					<TooltipProvider delayDuration={300}>
						{children}
					</TooltipProvider>
				</SessionProvider>
			</ApolloProvider>
		</ReduxProvider>
	);
}


