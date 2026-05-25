import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth";

import appCss from "../styles.css?url";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ROUTE — Smart Waste Coordination" },
      { name: "description", content: "Routing & Operational Updates for Trash Execution. Coordinating waste collection in Bali for a sustainable future." },
      { property: "og:title", content: "ROUTE — Smart Waste Coordination" },
      { name: "twitter:title", content: "ROUTE — Smart Waste Coordination" },
      { property: "og:description", content: "Routing & Operational Updates for Trash Execution. Coordinating waste collection in Bali for a sustainable future." },
      { name: "twitter:description", content: "Routing & Operational Updates for Trash Execution. Coordinating waste collection in Bali for a sustainable future." },

      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" },
    ],
  }),
  shellComponent: ({ children }) => (
    <html lang="en"><head><HeadContent /></head><body>{children}<Scripts /></body></html>
  ),
  component: () => {
    const { queryClient } = Route.useRouteContext();
    return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Outlet />
        </AuthProvider>
      </QueryClientProvider>
    );
  },
});
