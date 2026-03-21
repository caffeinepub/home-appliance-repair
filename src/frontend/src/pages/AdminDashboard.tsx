import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Flag, Play, RefreshCw, XCircle } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Booking } from "../backend";
import {
  ApplianceType,
  BookingStatus,
  useAdminCancelBooking,
  useAllBookings,
  useUpdateStatus,
} from "../hooks/useQueries";

const statusConfig: Record<
  BookingStatus,
  { label: string; className: string }
> = {
  [BookingStatus.pending]: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  [BookingStatus.accepted]: {
    label: "Accepted",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  [BookingStatus.inProgress]: {
    label: "In Progress",
    className: "bg-orange-100 text-orange-800 border-orange-200",
  },
  [BookingStatus.completed]: {
    label: "Completed",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  [BookingStatus.cancelled]: {
    label: "Cancelled",
    className: "bg-gray-100 text-gray-600 border-gray-200",
  },
};

const applianceLabels: Record<ApplianceType, string> = {
  [ApplianceType.ledTV]: "📺 LED TV",
  [ApplianceType.ac]: "❄️ AC",
  [ApplianceType.fridge]: "🧊 Fridge",
};

function formatDate(ts: bigint) {
  return new Date(Number(ts / 1_000_000n)).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminDashboard() {
  const { data: bookings, isLoading, refetch } = useAllBookings();
  const updateStatus = useUpdateStatus();
  const adminCancel = useAdminCancelBooking();
  const [activeTab, setActiveTab] = useState("all");

  const filtered =
    bookings?.filter((b) => {
      if (activeTab === "all") return true;
      return b.status === activeTab;
    }) ?? [];

  const counts = {
    all: bookings?.length ?? 0,
    [BookingStatus.pending]:
      bookings?.filter((b) => b.status === BookingStatus.pending).length ?? 0,
    [BookingStatus.accepted]:
      bookings?.filter((b) => b.status === BookingStatus.accepted).length ?? 0,
    [BookingStatus.inProgress]:
      bookings?.filter((b) => b.status === BookingStatus.inProgress).length ??
      0,
    [BookingStatus.completed]:
      bookings?.filter((b) => b.status === BookingStatus.completed).length ?? 0,
    [BookingStatus.cancelled]:
      bookings?.filter((b) => b.status === BookingStatus.cancelled).length ?? 0,
  };

  const act = async (fn: () => Promise<unknown>, msg: string) => {
    try {
      await fn();
      toast.success(msg);
    } catch {
      toast.error("Action failed. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 max-w-6xl py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display font-bold text-3xl text-foreground">
              Admin / Technician Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage all service bookings
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            data-ocid="admin.button"
          >
            <RefreshCw className="w-4 h-4 mr-1" /> Refresh
          </Button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {[
            { label: "Total", key: "all", color: "text-foreground" },
            {
              label: "Pending",
              key: BookingStatus.pending,
              color: "text-yellow-600",
            },
            {
              label: "Accepted",
              key: BookingStatus.accepted,
              color: "text-blue-600",
            },
            {
              label: "In Progress",
              key: BookingStatus.inProgress,
              color: "text-orange-500",
            },
            {
              label: "Completed",
              key: BookingStatus.completed,
              color: "text-green-600",
            },
          ].map((c) => (
            <div
              key={c.key}
              className="bg-card border border-border rounded-xl p-4 text-center shadow-card"
            >
              <p className={`font-display font-bold text-2xl ${c.color}`}>
                {counts[c.key as keyof typeof counts]}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{c.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs + Bookings */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 flex-wrap h-auto gap-1">
            <TabsTrigger value="all" data-ocid="admin.tab">
              All ({counts.all})
            </TabsTrigger>
            <TabsTrigger value={BookingStatus.pending} data-ocid="admin.tab">
              Pending ({counts[BookingStatus.pending]})
            </TabsTrigger>
            <TabsTrigger value={BookingStatus.accepted} data-ocid="admin.tab">
              Accepted ({counts[BookingStatus.accepted]})
            </TabsTrigger>
            <TabsTrigger value={BookingStatus.inProgress} data-ocid="admin.tab">
              In Progress ({counts[BookingStatus.inProgress]})
            </TabsTrigger>
            <TabsTrigger value={BookingStatus.completed} data-ocid="admin.tab">
              Completed ({counts[BookingStatus.completed]})
            </TabsTrigger>
            <TabsTrigger value={BookingStatus.cancelled} data-ocid="admin.tab">
              Cancelled ({counts[BookingStatus.cancelled]})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {isLoading ? (
              <div className="space-y-3" data-ocid="admin.loading_state">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-36 rounded-xl" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div
                className="text-center py-16 bg-card rounded-2xl border border-border"
                data-ocid="admin.empty_state"
              >
                <div className="text-5xl mb-3">📋</div>
                <p className="text-muted-foreground">
                  No bookings in this category.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map((booking: Booking, idx: number) => {
                  const cfg = statusConfig[booking.status];
                  return (
                    <motion.div
                      key={String(booking.id)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="bg-card border border-border rounded-xl p-5 shadow-card"
                      data-ocid={`admin.item.${idx + 1}`}
                    >
                      <div className="flex flex-col md:flex-row gap-4">
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-semibold text-foreground">
                              {applianceLabels[booking.appliance]}
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.className}`}
                            >
                              {cfg.label}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Booking #{String(booking.id)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {booking.issueDescription}
                          </p>
                          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                            <span>📞 {booking.contactPhone}</span>
                            <span>
                              🕒 Preferred:{" "}
                              {formatDate(booking.preferredDateTime)}
                            </span>
                            <span>
                              📅 Created: {formatDate(booking.createdAt)}
                            </span>
                            <span
                              className="font-mono truncate max-w-[180px]"
                              title={booking.customer.toString()}
                            >
                              👤 {booking.customer.toString().slice(0, 16)}...
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap md:flex-col gap-2 items-start md:items-end justify-end shrink-0">
                          {booking.status === BookingStatus.pending && (
                            <Button
                              size="sm"
                              className="bg-primary text-white hover:opacity-90"
                              disabled={updateStatus.isPending}
                              onClick={() =>
                                act(
                                  () =>
                                    updateStatus.mutateAsync({
                                      id: booking.id,
                                      status: BookingStatus.accepted,
                                    }),
                                  "Booking accepted!",
                                )
                              }
                              data-ocid={`admin.edit_button.${idx + 1}`}
                            >
                              <CheckCircle className="w-3.5 h-3.5 mr-1" />{" "}
                              Accept
                            </Button>
                          )}
                          {booking.status === BookingStatus.accepted && (
                            <Button
                              size="sm"
                              className="bg-accent text-white hover:opacity-90"
                              disabled={updateStatus.isPending}
                              onClick={() =>
                                act(
                                  () =>
                                    updateStatus.mutateAsync({
                                      id: booking.id,
                                      status: BookingStatus.inProgress,
                                    }),
                                  "Job started!",
                                )
                              }
                              data-ocid={`admin.edit_button.${idx + 1}`}
                            >
                              <Play className="w-3.5 h-3.5 mr-1" /> Start Job
                            </Button>
                          )}
                          {booking.status === BookingStatus.inProgress && (
                            <Button
                              size="sm"
                              className="bg-green-600 text-white hover:opacity-90"
                              disabled={updateStatus.isPending}
                              onClick={() =>
                                act(
                                  () =>
                                    updateStatus.mutateAsync({
                                      id: booking.id,
                                      status: BookingStatus.completed,
                                    }),
                                  "Job completed!",
                                )
                              }
                              data-ocid={`admin.edit_button.${idx + 1}`}
                            >
                              <Flag className="w-3.5 h-3.5 mr-1" /> Complete
                            </Button>
                          )}
                          {booking.status !== BookingStatus.cancelled &&
                            booking.status !== BookingStatus.completed && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-destructive text-destructive hover:bg-destructive hover:text-white"
                                disabled={adminCancel.isPending}
                                onClick={() =>
                                  act(
                                    () => adminCancel.mutateAsync(booking.id),
                                    "Booking cancelled.",
                                  )
                                }
                                data-ocid={`admin.delete_button.${idx + 1}`}
                              >
                                <XCircle className="w-3.5 h-3.5 mr-1" /> Cancel
                              </Button>
                            )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
