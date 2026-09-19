import type { Metadata } from "next";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";

export const metadata: Metadata = {
  title: "Manage | Eduard Teodor",
  description: "Sign in to manage your website.",
  robots: { index: false, follow: false },
};

export default function Manage() {
  return (
    <>
      <main>
        <section>
          <div className="mt-6 space-y-5">
            <div>
              <input
                type="username"
                name="username"
                id="username"
                autoComplete="username"
                className="block w-full border border-line bg-background p-3 text-foreground"
                placeholder="enter username"
                required
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                id="password"
                autoComplete="current-password"
                className="block w-full border border-line bg-background p-3 text-foreground"
                placeholder="enter password"
                required
              />
            </div>
            <button type="button" aria-describedby="login-status" className="block-button">
              Sign in
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
