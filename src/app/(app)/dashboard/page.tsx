import { SignOut } from "@/components/auth/sign-out";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-6 shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Dashboard
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            You are signed in as {session.user.email}
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {session.user.image && (
                <img
                  src={session.user.image}
                  alt={`${session.user.name}'s profile`}
                  className="h-12 w-12 rounded-full"
                />
              )}
              <div>
                <h3 className="text-lg font-medium">{session.user.name}</h3>
                <p className="text-sm text-gray-500">{session.user.email}</p>
              </div>
            </div>
            <SignOut />
          </div>
        </div>
      </div>
    </div>
  );
}
