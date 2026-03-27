"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@kandev/ui/card";
import { Button } from "@kandev/ui/button";
import { Separator } from "@kandev/ui/separator";

function MicrosoftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="9" height="9" fill="#F25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
      <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
      <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
    </svg>
  );
}

export function LoginClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function handleLogin() {
    setLoading(true);
    // Simulate SSO redirect delay
    setTimeout(() => router.push("/"), 800);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center gap-2 pb-2">
          <span className="text-2xl font-bold tracking-tight">KanDev</span>
          <p className="text-sm text-muted-foreground">Sign in to your workspace</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            className="w-full cursor-pointer gap-2"
            size="lg"
            onClick={handleLogin}
            disabled={loading}
            style={{ backgroundColor: "#0078D4", color: "#fff" }}
          >
            <MicrosoftIcon className="h-5 w-5" />
            {loading ? "Redirecting..." : "Sign in with Microsoft"}
          </Button>
          <Separator />
          <p className="text-center text-xs text-muted-foreground">
            Enterprise SSO powered by Azure AD
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
