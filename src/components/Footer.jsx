import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-16 pb-10 border-t border-white/10">
      <div className="container mx-auto px-6">
        
        {/* TOP SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">

          {/* BRAND + ABOUT */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-widest">AURAYE</h2>
            <p className="text-white/60 leading-relaxed text-sm">
              Premium eyewear with modern design & AR Try-On technology.
              Discover a new way to choose your perfect pair.
            </p>

            {/* SOCIAL ICONS */}
            <div className="flex gap-4 pt-3">
              <SocialIcon Icon={Facebook} href="#" />
              <SocialIcon Icon={Instagram} href="#" />
              <SocialIcon Icon={Twitter} href="#" />
              <SocialIcon Icon={Linkedin} href="#" />
              <SocialIcon Icon={Youtube} href="#" />
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <FooterLink to="/products">Products</FooterLink>
            <FooterLink to="/try">AR Try-On</FooterLink>
            <FooterLink to="/about">About Us</FooterLink>
            <FooterLink to="/contact">Contact</FooterLink>
            <FooterLink to="/faq">FAQs</FooterLink>
          </div>

          {/* CUSTOMER SUPPORT */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <FooterLink to="/shipping">Shipping & Delivery</FooterLink>
            <FooterLink to="/refunds">Returns Policy</FooterLink>
            <FooterLink to="/track">Track Order</FooterLink>
            <FooterLink to="/privacy">Privacy Policy</FooterLink>
            <FooterLink to="/terms">Terms & Conditions</FooterLink>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-white/60 text-sm mb-4">
              Subscribe to our newsletter for new arrivals & exclusive offers.
            </p>

            <form className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-md bg-white/10 text-white placeholder-white/40 outline-none border border-white/20 focus:border-white/40 transition"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-white text-black font-semibold rounded-md hover:bg-white/90 transition"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* CONTACT INFO */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-white/80">
            <ContactRow Icon={Mail} text="support@auraye.com" />
            <ContactRow Icon={Phone} text="+20 111 222 3333" />
            <ContactRow Icon={MapPin} text="123 Cairo, Egypt" />
          </div>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="text-center text-white/40 text-sm">
          © {new Date().getFullYear()} AURAYE. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

/* COMPONENTS */
function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      className="block text-sm text-white/70 hover:text-white transition py-1"
    >
      {children}
    </Link>
  );
}

function SocialIcon({ Icon, href }) {
  return (
    <a
      href={href}
      className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
      target="_blank"
      rel="noreferrer"
    >
      <Icon size={18} />
    </a>
  );
}

function ContactRow({ Icon, text }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={16} className="text-white/60" />
      <span>{text}</span>
    </div>
  );
}
