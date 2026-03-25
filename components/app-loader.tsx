"use client";

import { useUserStore } from "@/store/user-store";
import Loading from "./loading";

export default function AppLoader({ children }: { children: React.ReactNode }) {
  const { isLoading } = useUserStore();

  if (isLoading) {
    return (
      <Loading/>
    );
  }

  return <>{children}</>;
}
