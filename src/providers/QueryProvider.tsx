"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, { useState } from "react";

export default function QueryProvider({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						networkMode: "always",
						refetchOnWindowFocus: false,
						retry: 0,
						// cache for 5 minutes
						staleTime: 1000 * 5 * 60,
						gcTime: 1000 * 5 * 60,
					},
				},
			})
	);

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}
