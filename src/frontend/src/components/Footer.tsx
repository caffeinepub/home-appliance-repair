import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Wrench,
} from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <footer className="bg-foreground text-white pt-12 pb-6" id="contact">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-display font-bold text-lg">HomeCare</span>
                <span
                  className="block text-[10px] uppercase tracking-widest text-accent"
                  style={{ marginTop: "-2px" }}
                >
                  REPAIRS
                </span>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Professional home appliance repair services at your doorstep. LED
              TV, AC, Fridge — we fix it all.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-white/80">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-white/60">
              {[
                "Services",
                "How it Works",
                "Pricing",
                "Book Now",
                "About Us",
              ].map((l) => (
                <li key={l}>
                  <span className="hover:text-accent transition-colors cursor-pointer">
                    {l}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-white/80">
              Our Services
            </h4>
            <ul className="space-y-2 text-sm text-white/60">
              {[
                "LED TV Repair",
                "AC Service & Repair",
                "Refrigerator Repair",
                "Washing Machine",
                "Microwave Oven",
              ].map((s) => (
                <li key={s}>
                  <span className="hover:text-accent transition-colors cursor-pointer">
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-white/80">
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 text-accent flex-shrink-0" />
                <span>8002570011</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 text-accent flex-shrink-0" />
                <span>homecare@gmaul.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-accent flex-shrink-0" />
                <span>Service Patna, Bihar</span>
              </li>
            </ul>
            <div className="flex gap-3 mt-4">
              <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors cursor-pointer">
                <Facebook className="w-4 h-4" />
              </span>
              <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors cursor-pointer">
                <Instagram className="w-4 h-4" />
              </span>
              <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors cursor-pointer">
                <Twitter className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <p>© {year} HomeCare Repairs. All rights reserved.</p>
          <p>
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-accent transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
