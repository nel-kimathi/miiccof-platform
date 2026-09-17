import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SiteAccessPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string; error?: string }>;
}) {
  const { returnTo, error } = await searchParams;

  async function grantAccess(formData: FormData) {
    "use server";
    const password = formData.get("password") as string;
    const returnPath = (formData.get("returnTo") as string) || "/";
    const expected = process.env.SITE_ACCESS_PASSWORD?.trim();

    if (!expected || password.trim() !== expected) {
      const url = new URL(returnPath, "https://localhost");
      const redirectUrl = `/site-access?returnTo=${encodeURIComponent(returnPath)}&error=1`;
      redirect(redirectUrl);
    }

    const cookieStore = await cookies();
    cookieStore.set("miiccof_site_access", expected, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    redirect(returnPath);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-primary px-4 text-primary-foreground">
      <div className="w-full max-w-md rounded-2xl bg-primary-foreground/10 p-8 text-center backdrop-blur-sm">
        <h1 className="font-heading text-2xl font-bold">MIICCOF</h1>
        <p className="mt-2 text-sm text-primary-foreground/80">
          This site is private. Please enter the access password to continue.
        </p>
        {error ? (
          <p className="mt-4 rounded bg-destructive/20 px-3 py-2 text-sm text-destructive-foreground">
            Incorrect password. Please try again.
          </p>
        ) : null}
        <form action={grantAccess} className="mt-6 space-y-4">
          <input type="hidden" name="returnTo" value={returnTo ?? "/"} />
          <input
            type="password"
            name="password"
            required
            placeholder="Enter access password"
            className="w-full rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-3 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-accent px-4 py-3 font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
          >
            Access Site
          </button>
        </form>
      </div>
    </div>
  );
}
