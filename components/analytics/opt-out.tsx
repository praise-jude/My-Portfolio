"use client";

import { useEffect, useState } from "react";
import { NO_TRACK_COOKIE, NO_TRACK_MAX_AGE } from "@/lib/analytics/constants";
import { Button } from "@/components/ui/button";

export function readOptOut() {
  return document.cookie.split("; ").includes(`${NO_TRACK_COOKIE}=1`);
}

export function writeOptOut(optOut: boolean) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = optOut
    ? `${NO_TRACK_COOKIE}=1; Path=/; Max-Age=${NO_TRACK_MAX_AGE}; SameSite=Lax${secure}`
    : `${NO_TRACK_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
}

type Props = {
  optedOutLabel?: string;
  optedInLabel?: string;
};

export function AnalyticsOptOut({
  optedOutLabel = "This browser is excluded from analytics.",
  optedInLabel = "This browser is included in analytics.",
}: Props) {
  const [optedOut, setOptedOut] = useState<boolean | null>(null);

  useEffect(() => {
    // Cookie is only readable in the browser, so sync once after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOptedOut(readOptOut());
  }, []);

  if (optedOut === null) return <p className="text-sm text-muted">Checking analytics preference…</p>;

  return (
    <div className="flex flex-col items-start gap-3 rounded-xl border border-border-subtle bg-surface/60 p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted" role="status">
        {optedOut ? optedOutLabel : optedInLabel}
      </p>
      <Button
        type="button"
        size="sm"
        variant="secondary"
        onClick={() => {
          writeOptOut(!optedOut);
          setOptedOut(!optedOut);
        }}
      >
        {optedOut ? "Include this browser" : "Exclude this browser"}
      </Button>
    </div>
  );
}
