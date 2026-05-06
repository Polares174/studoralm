import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { GamificationProvider } from "@/hooks/useGamification";
import { NeuroCoinsProvider } from "@/hooks/useNeuroCoins";
import { StudCompanionProvider } from "@/hooks/useStudCompanion";
import { UserProvider } from "@/hooks/useUser";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-semibold text-ink">404</h1>
        <h2 className="mt-3 font-display text-xl font-medium text-foreground">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          O conteúdo que você procura não existe ou foi movido.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-110"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Studora LM" },
      { name: "description", content: "Para Estudantes" },
      { property: "og:title", content: "Studora LM" },
      { name: "twitter:title", content: "Studora LM" },
      { property: "og:description", content: "Para Estudantes" },
      { name: "twitter:description", content: "Para Estudantes" },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/8f201045-0d0a-4d1f-82a3-30af4196a5ff/id-preview-2154ac1e--53c98a95-1b4b-4ccd-a8f4-1d70cc3f0b16.lovable.app-1777419955610.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/8f201045-0d0a-4d1f-82a3-30af4196a5ff/id-preview-2154ac1e--53c98a95-1b4b-4ccd-a8f4-1d70cc3f0b16.lovable.app-1777419955610.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <UserProvider>
      <GamificationProvider>
        <NeuroCoinsProvider>
          <StudCompanionProvider>
            <Outlet />
          </StudCompanionProvider>
        </NeuroCoinsProvider>
      </GamificationProvider>
    </UserProvider>
  );
}
