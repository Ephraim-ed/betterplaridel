import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export const rootRoute = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
