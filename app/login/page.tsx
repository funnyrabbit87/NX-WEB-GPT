import { getServerSession } from "next-auth";
import { LoginPage } from "../components/login";
import { redirect } from "next/navigation";
import { ErrorBoundary } from "../components/error";

export default async function LoginPathPage() {
  const session = await getServerSession();
  if (session?.user?.name) {
    redirect("/");
  }
  return (
    // <ErrorBoundary>
    // <Router>
    <LoginPage />
    // </Router>
    // </ErrorBoundary>
  );
}
