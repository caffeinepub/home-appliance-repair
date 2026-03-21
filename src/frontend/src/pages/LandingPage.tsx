import { Button } from "@/components/ui/button";
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
import {
  ArrowRight,
  CheckCircle,
  Clock,
  DollarSign,
  Phone,
  Shield,
  Star,
  Wrench,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import BookingModal from "../components/BookingModal";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { ApplianceType } from "../hooks/useQueries";

interface LandingPageProps {
  onNavigate: (v: string) => void;
}

const services = [
  {
    appliance: ApplianceType.ledTV,
    icon: "/assets/generated/icon-led-tv.dim_200x200.png",
    emoji: "📺",
    title: "LED TV Repair",
    subtitle: "All brands, all models",
    issues: [
      "No display / black screen",
      "Panel damage / lines on screen",
      "No sound or distorted audio",
      "Remote / software issues",
      "Power not turning on",
    ],
  },
  {
    appliance: ApplianceType.ac,
    icon: "/assets/generated/icon-ac-service.dim_200x200.png",
    emoji: "❄️",
    title: "AC Service & Repair",
    subtitle: "Split, Window & Cassette AC",
    issues: [
      "AC not cooling properly",
      "Water leaking from AC",
      "Compressor not working",
      "Gas refilling / PCB repair",
      "Annual maintenance (AMC)",
    ],
  },
  {
    appliance: ApplianceType.fridge,
    icon: "/assets/generated/icon-fridge.dim_200x200.png",
    emoji: "🧊",
    title: "Refrigerator Repair",
    subtitle: "Single & double door, side-by-side",
    issues: [
      "Fridge not cooling",
      "Ice maker not working",
      "Unusual noise / vibration",
      "Door seal / gasket repair",
      "Temperature control issues",
    ],
  },
];

const features = [
  {
    icon: <CheckCircle className="w-6 h-6" />,
    title: "Expert Technicians",
    desc: "Certified professionals with 5+ years experience",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Same-Day Response",
    desc: "Book before 2 PM, get service the same day",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Genuine Spare Parts",
    desc: "Only OEM or brand-certified parts used",
  },
  {
    icon: <DollarSign className="w-6 h-6" />,
    title: "Transparent Pricing",
    desc: "No hidden charges. Pay only what's quoted.",
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: "4.9★ Customer Rating",
    desc: "Over 10,000 happy customers served",
  },
  {
    icon: <Phone className="w-6 h-6" />,
    title: "24/7 Support",
    desc: "Call or WhatsApp us anytime for help",
  },
];

const steps = [
  {
    num: "01",
    title: "Book Online",
    desc: "Select appliance, describe issue, pick date & time",
  },
  {
    num: "02",
    title: "Technician Assigned",
    desc: "We assign a verified expert near your area",
  },
  {
    num: "03",
    title: "Doorstep Service",
    desc: "Tech arrives at your home, diagnoses & fixes",
  },
  {
    num: "04",
    title: "Pay & Relax",
    desc: "Pay after service is done. Get 30-day warranty",
  },
];

export default function LandingPage({
  onNavigate: _onNavigate,
}: LandingPageProps) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedAppliance, setSelectedAppliance] = useState<ApplianceType>(
    ApplianceType.ledTV,
  );
  const { login, identity } = useInternetIdentity();
  const [quickIssue, setQuickIssue] = useState("");
  const [quickPhone, setQuickPhone] = useState("");
  const [quickDatetime, setQuickDatetime] = useState("");

  const handleBookNow = (appliance?: ApplianceType) => {
    if (!identity) {
      login();
      return;
    }
    if (appliance) setSelectedAppliance(appliance);
    setBookingOpen(true);
  };

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section
        className="relative min-h-[580px] flex items-center"
        style={{
          backgroundImage: `url('/assets/generated/hero-repair-technician.dim_1400x700.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(15,30,55,0.88) 0%, rgba(15,30,55,0.7) 60%, rgba(15,30,55,0.1) 100%)",
          }}
        />
        <div className="relative container mx-auto px-4 max-w-7xl py-20">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block bg-accent text-white text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                🔧 Doorstep Service Available
              </span>
              <h1 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-4">
                Book Home Appliance Repair
                <span className="text-accent"> at Your Doorstep</span>
              </h1>
              <p className="text-white/80 text-lg mb-6">
                LED TV, AC, Fridge — we send expert technicians to your home.
                Fast, reliable, affordable.
                <br />
                <span className="text-white/60 text-sm">
                  Ghar baithe repair — bas ek click mein!
                </span>
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="bg-accent hover:opacity-90 text-white font-bold text-base px-6 shadow-hero"
                  onClick={() => handleBookNow()}
                  data-ocid="hero.primary_button"
                >
                  Book Now / Book Karein <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-foreground font-semibold"
                  onClick={() =>
                    document
                      .getElementById("services")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  data-ocid="hero.secondary_button"
                >
                  View Services
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-primary text-white py-5">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { val: "10,000+", label: "Happy Customers" },
              { val: "500+", label: "Certified Technicians" },
              { val: "4.9★", label: "Average Rating" },
              { val: "Same Day", label: "Service Available" },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-display font-bold text-xl md:text-2xl text-accent">
                  {s.val}
                </p>
                <p className="text-white/70 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground">
              Our Specialities
            </h2>
            <p className="text-muted-foreground mt-2">
              Expert repair for all major home appliances
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((svc, i) => (
              <motion.div
                key={svc.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="bg-card rounded-xl shadow-card border border-border overflow-hidden hover:shadow-hero transition-shadow group"
              >
                <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-6 flex items-center gap-4 border-b border-border">
                  <img
                    src={svc.icon}
                    alt={svc.title}
                    className="w-16 h-16 object-contain rounded-lg"
                  />
                  <div>
                    <h3 className="font-display font-bold text-lg text-foreground uppercase tracking-wide">
                      {svc.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {svc.subtitle}
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <ul className="space-y-2 mb-5">
                    {svc.issues.map((issue) => (
                      <li
                        key={issue}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="text-primary mt-0.5">✓</span>
                        {issue}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => handleBookNow(svc.appliance)}
                    className="w-full bg-primary text-white hover:opacity-90 group-hover:bg-accent transition-colors"
                    data-ocid="services.primary_button"
                  >
                    Book Now {svc.emoji}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us + Quick Booking Form */}
      <section className="py-16 bg-white" id="pricing">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-2">
                Why Choose HomeCare?
              </h2>
              <p className="text-muted-foreground mb-8">
                Trusted by thousands of families across India
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {features.map((f) => (
                  <div key={f.title} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                      {f.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">
                        {f.title}
                      </p>
                      <p className="text-muted-foreground text-xs mt-0.5">
                        {f.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card border border-border rounded-2xl shadow-hero p-7"
            >
              <h3 className="font-display font-bold text-2xl text-foreground mb-1">
                Quick Booking
              </h3>
              <p className="text-muted-foreground text-sm mb-5">
                Fill this form and we'll call you back in 15 minutes
              </p>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="q-appliance">Select Appliance</Label>
                  <Select
                    value={selectedAppliance}
                    onValueChange={(v) =>
                      setSelectedAppliance(v as ApplianceType)
                    }
                  >
                    <SelectTrigger
                      className="mt-1"
                      id="q-appliance"
                      data-ocid="quickbook.select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ApplianceType.ledTV}>
                        📺 LED TV
                      </SelectItem>
                      <SelectItem value={ApplianceType.ac}>
                        ❄️ AC (Air Conditioner)
                      </SelectItem>
                      <SelectItem value={ApplianceType.fridge}>
                        🧊 Refrigerator
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="q-issue">Describe the Problem</Label>
                  <Textarea
                    id="q-issue"
                    value={quickIssue}
                    onChange={(e) => setQuickIssue(e.target.value)}
                    placeholder="Briefly describe the issue..."
                    rows={2}
                    className="mt-1"
                    data-ocid="quickbook.textarea"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="q-datetime">Date & Time</Label>
                    <Input
                      id="q-datetime"
                      type="datetime-local"
                      value={quickDatetime}
                      onChange={(e) => setQuickDatetime(e.target.value)}
                      className="mt-1"
                      data-ocid="quickbook.input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="q-phone">Phone Number</Label>
                    <Input
                      id="q-phone"
                      type="tel"
                      value={quickPhone}
                      onChange={(e) => setQuickPhone(e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      className="mt-1"
                      data-ocid="quickbook.input"
                    />
                  </div>
                </div>
                <Button
                  className="w-full bg-accent text-white font-bold hover:opacity-90 text-base py-5"
                  onClick={() => handleBookNow(selectedAppliance)}
                  data-ocid="quickbook.primary_button"
                >
                  Book Now — Book Karein 🔧
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground">
              How It Works
            </h2>
            <p className="text-muted-foreground mt-2">
              Repair in 4 simple steps
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative bg-card border border-border rounded-xl p-6 text-center shadow-card"
              >
                <div className="w-12 h-12 rounded-full bg-primary text-white font-display font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {step.num}
                </div>
                <h4 className="font-semibold text-foreground mb-1">
                  {step.title}
                </h4>
                <p className="text-muted-foreground text-sm">{step.desc}</p>
                {i < steps.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technician CTA Band */}
      <section className="bg-gradient-to-r from-primary to-primary/80 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Wrench className="w-6 h-6 text-accent" />
                <h3 className="font-display font-bold text-2xl text-white">
                  Are You a Technician?
                </h3>
              </div>
              <p className="text-white/80">
                Join our network of 500+ certified repair professionals. Work on
                your schedule, earn more.
              </p>
              <p className="text-white/60 text-sm mt-1">
                Technician hain? Hamare team mein shamil hon aur zyada kamain!
              </p>
            </div>
            <Button
              size="lg"
              className="bg-accent text-white hover:opacity-90 font-bold whitespace-nowrap shadow-hero"
              onClick={() => login()}
              data-ocid="technician.primary_button"
            >
              Join Our Team →
            </Button>
          </div>
        </div>
      </section>

      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        defaultAppliance={selectedAppliance}
      />
    </main>
  );
}
