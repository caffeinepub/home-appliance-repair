import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Plus, RefreshCw, XCircle } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Booking } from "../backend";
import BookingModal from "../components/BookingModal";
import {
  ApplianceType,
  BookingStatus,
  useCancelMyBooking,
  useMyBookings,
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

export default function CustomerDashboard() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const { data: bookings, isLoading, refetch } = useMyBookings();
  const cancelMutation = useCancelMyBooking();

  const handleCancel = async (id: bigint) => {
    try {
      await cancelMutation.mutateAsync(id);
      toast.success("Booking cancelled successfully");
    } catch {
      toast.error("Failed to cancel booking");
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 max-w-4xl py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl text-foreground">
              My Bookings
            </h1>
            <p className="text-muted-foreground mt-1">
              Aapki repair bookings — track status here
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              data-ocid="dashboard.button"
            >
              <RefreshCw className="w-4 h-4 mr-1" /> Refresh
            </Button>
            <Button
              className="bg-primary text-white hover:opacity-90"
              onClick={() => setBookingOpen(true)}
              data-ocid="dashboard.primary_button"
            >
              <Plus className="w-4 h-4 mr-1" /> Book New Service
            </Button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-4" data-ocid="dashboard.loading_state">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        ) : !bookings || bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-card rounded-2xl border border-border"
            data-ocid="dashboard.empty_state"
          >
            <div className="text-6xl mb-4">🔧</div>
            <h3 className="font-semibold text-xl text-foreground">
              No bookings yet
            </h3>
            <p className="text-muted-foreground mt-2 mb-6">
              Abhi tak koi booking nahi hai. Pehli repair book karein!
            </p>
            <Button
              className="bg-primary text-white hover:opacity-90"
              onClick={() => setBookingOpen(true)}
              data-ocid="dashboard.primary_button"
            >
              <Plus className="w-4 h-4 mr-1" /> Book Your First Service
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking: Booking, idx: number) => {
              const cfg = statusConfig[booking.status];
              const canCancel = booking.status === BookingStatus.pending;
              return (
                <motion.div
                  key={String(booking.id)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-card border border-border rounded-xl p-5 shadow-card hover:shadow-hero transition-shadow"
                  data-ocid={`dashboard.item.${idx + 1}`}
                >
                  <div className="flex items-start justify-between gap-4">
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
                          #{String(booking.id)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {booking.issueDescription}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />{" "}
                          {formatDate(booking.preferredDateTime)}
                        </span>
                        <span>📞 {booking.contactPhone}</span>
                      </div>
                    </div>
                    {canCancel && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-destructive text-destructive hover:bg-destructive hover:text-white flex-shrink-0"
                        onClick={() => handleCancel(booking.id)}
                        disabled={cancelMutation.isPending}
                        data-ocid={`dashboard.delete_button.${idx + 1}`}
                      >
                        <XCircle className="w-4 h-4 mr-1" /> Cancel
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </main>
  );
}
