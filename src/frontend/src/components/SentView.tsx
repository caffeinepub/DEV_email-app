import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, InboxIcon, RefreshCw, XCircle } from "lucide-react";
import { motion } from "motion/react";
import type { EmailRecord } from "../backend.d";
import { useGetEmailHistory } from "../hooks/useQueries";

function formatDate(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  const date = new Date(ms);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function RecipientList({ addresses }: { addresses: string[] }) {
  if (addresses.length === 0)
    return <span className="text-muted-foreground">—</span>;
  if (addresses.length === 1) return <span>{addresses[0]}</span>;
  return (
    <span>
      {addresses[0]}
      <span className="text-muted-foreground ml-1">
        +{addresses.length - 1} more
      </span>
    </span>
  );
}

function EmailRow({ record, index }: { record: EmailRecord; index: number }) {
  const succeeded = record.status.__kind__ === "sentSuccessfully";

  return (
    <motion.div
      data-ocid={`sent.item.${index + 1}`}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.2 }}
      className="flex items-start gap-4 px-5 py-4 border-b border-border last:border-0 hover:bg-secondary/40 transition-colors"
    >
      <div className="mt-0.5 shrink-0">
        {succeeded ? (
          <CheckCircle2 className="w-4 h-4 text-success" />
        ) : (
          <XCircle className="w-4 h-4 text-destructive" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {record.subject || (
                <span className="italic text-muted-foreground">
                  (No subject)
                </span>
              )}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              To: <RecipientList addresses={record.to} />
              {record.cc.length > 0 && (
                <span className="ml-2">
                  CC: <RecipientList addresses={record.cc} />
                </span>
              )}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <Badge
              variant={succeeded ? "default" : "destructive"}
              className="text-[10px] px-2 py-0"
            >
              {succeeded ? "Sent" : "Failed"}
            </Badge>
            <span className="text-[11px] text-muted-foreground whitespace-nowrap">
              {formatDate(record.timestamp)}
            </span>
          </div>
        </div>

        {!succeeded &&
          record.status.__kind__ === "failed" &&
          record.status.failed && (
            <p className="mt-1.5 text-xs text-destructive bg-destructive/8 rounded px-2 py-1">
              Error: {record.status.failed}
            </p>
          )}

        {record.body && (
          <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {record.body}
          </p>
        )}
      </div>
    </motion.div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-start gap-4 px-5 py-4 border-b border-border">
      <Skeleton className="w-4 h-4 rounded-full mt-0.5 shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <Skeleton className="h-5 w-12 rounded-full" />
    </div>
  );
}

export function SentView() {
  const {
    data: emails,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetEmailHistory();

  const sorted = emails
    ? [...emails].sort((a, b) => (b.timestamp > a.timestamp ? 1 : -1))
    : [];

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-foreground">Sent Mail</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {isLoading
              ? "Loading your sent emails..."
              : `${sorted.length} email${sorted.length !== 1 ? "s" : ""} sent`}
          </p>
        </div>
        <Button
          data-ocid="sent.refresh.button"
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="gap-2"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
        {isLoading && (
          <div data-ocid="sent.loading_state">
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </div>
        )}

        {isError && (
          <div
            data-ocid="sent.error_state"
            className="flex flex-col items-center justify-center py-16 px-6 text-center"
          >
            <XCircle className="w-10 h-10 text-destructive mb-3" />
            <p className="font-medium text-sm">Failed to load emails</p>
            <p className="text-xs text-muted-foreground mt-1">
              Something went wrong. Please try refreshing.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        )}

        {!isLoading && !isError && sorted.length === 0 && (
          <div
            data-ocid="sent.empty_state"
            className="flex flex-col items-center justify-center py-16 px-6 text-center"
          >
            <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-4">
              <InboxIcon className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="font-medium text-sm">No emails sent yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Emails you send will appear here.
            </p>
          </div>
        )}

        {!isLoading && !isError && sorted.length > 0 && (
          <ScrollArea className="max-h-[600px]">
            {sorted.map((record, i) => (
              <EmailRow key={String(record.id)} record={record} index={i} />
            ))}
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
