import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WelcomeScreen } from "@/components/layout/welcome-screen";

export const rootRoute = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <WelcomeScreen>
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </WelcomeScreen>
  );
}
