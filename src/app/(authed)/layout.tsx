import { cookies } from "next/headers";
import { ReactNode } from "react";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { redirect } from "next/navigation";
import { SessionProvider } from "@/providers/SessionProvider";
import { User } from "@/types/auth";
import QueryProvider from "@/providers/QueryProvider";

export default async function AuthedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (accessToken === undefined) {
    redirect("/login");
  }

  const userDecoded = jwtDecode<JwtPayload & User>(accessToken);

  const timeInSeconds = new Date().getTime() / 1000;

  if (userDecoded.exp! < timeInSeconds) {
    redirect("/api/clear-session");
  }

  const user: User = {
    name: userDecoded.name,
    email: userDecoded.email,
    profileImage: userDecoded.profileImage,
    role: userDecoded.role,
  };

  return (
    <SessionProvider {...{ user }}>
      <QueryProvider>
        {children}
      </QueryProvider>
    </SessionProvider>
  );
}
