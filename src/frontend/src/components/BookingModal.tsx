import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ApplianceType, useCreateBooking } from "../hooks/useQueries";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  defaultAppliance?: ApplianceType;
}

export default function BookingModal({
  open,
  onClose,
  defaultAppliance,
}: BookingModalProps) {
  const [appliance, setAppliance] = useState<ApplianceType>(
    defaultAppliance || ApplianceType.ledTV,
  );
  const [issue, setIssue] = useState("");
  const [phone, setPhone] = useState("");
  const [datetime, setDatetime] = useState("");
  const [done, setDone] = useState(false);

  const createBooking = useCreateBooking();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issue.trim() || !phone.trim() || !datetime) {
      toast.error("Please fill all fields");
      return;
    }
    const preferredDateTime = BigInt(new Date(datetime).getTime()) * 1_000_000n;
    try {
      await createBooking.mutateAsync({
        appliance,
        issueDescription: issue,
        preferredDateTime,
        contactPhone: phone,
      });
      setDone(true);
      toast.success("Booking confirmed! Our technician will contact you soon.");
    } catch {
      toast.error("Failed to create booking. Please try again.");
    }
  };

  const handleClose = () => {
    setDone(false);
    setIssue("");
    setPhone("");
    setDatetime("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-md" data-ocid="booking.dialog">
        <DialogHeader>
          <DialogTitle className="text-xl font-display font-bold text-foreground">
            Book Repair Service
          </DialogTitle>
        </DialogHeader>

        {done ? (
          <div
            className="py-8 flex flex-col items-center gap-4 text-center"
            data-ocid="booking.success_state"
          >
            <CheckCircle2 className="w-16 h-16 text-green-500" />
            <div>
              <p className="text-lg font-semibold text-foreground">
                Booking Confirmed! ✅
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Aapki booking ho gayi hai. Hamara technician jald hi aapko call
                karega.
              </p>
            </div>
            <Button
              onClick={handleClose}
              className="bg-primary text-white"
              data-ocid="booking.close_button"
            >
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="appliance">Appliance Type / उपकरण चुनें</Label>
              <Select
                value={appliance}
                onValueChange={(v) => setAppliance(v as ApplianceType)}
              >
                <SelectTrigger data-ocid="booking.select" id="appliance">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ApplianceType.ledTV}>📺 LED TV</SelectItem>
                  <SelectItem value={ApplianceType.ac}>
                    ❄️ AC (Air Conditioner)
                  </SelectItem>
                  <SelectItem value={ApplianceType.fridge}>
                    🧊 Refrigerator / Fridge
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="issue">Describe Issue / समस्या बताएं</Label>
              <Textarea
                id="issue"
                placeholder="E.g., TV is not turning on, AC is not cooling, Fridge making noise..."
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                rows={3}
                required
                data-ocid="booking.textarea"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="datetime">
                Preferred Date & Time / पसंदीदा समय
              </Label>
              <Input
                id="datetime"
                type="datetime-local"
                value={datetime}
                onChange={(e) => setDatetime(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                required
                data-ocid="booking.input"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Contact Phone / फोन नंबर</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                data-ocid="booking.input"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                data-ocid="booking.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createBooking.isPending}
                className="bg-primary text-white hover:opacity-90 font-semibold"
                data-ocid="booking.submit_button"
              >
                {createBooking.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Booking...
                  </>
                ) : (
                  "Book Karein / Book Now"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
