import React from "react"; 
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Mail,
  Phone,
  MapPin,
  MessageCircleMore,
  Send,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { contactSchema } from "../forms/contactSchema";
import { sendContactMessage } from "../api/contactApi";

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await sendContactMessage(data);
      toast.success(res.message || "Message sent successfully!");
      reset();
    } catch (error) {
      toast.error(error.message || "Failed to send message");
    }
  };

  const inputBase =
    "mt-1 block w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white shadow-sm focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/40 placeholder:text-gray-400";

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-black via-neutral-900 to-neutral-800 px-4 py-16 sm:px-6 lg:px-8">
      {/* gradient blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-[-80px] right-[-40px] h-80 w-80 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Header */}
        <motion.header
          className="mb-12 text-center lg:text-left"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-200">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            Contact
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Let’s talk about your{" "}
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              vision
            </span>
          </h1>
          <p className="mt-3 mx-auto max-w-2xl text-sm text-gray-300 sm:text-base lg:mx-0">
            Questions about your order, AR try-on, or frames? Send a message and
            the team will get back to you within one business day.
          </p>
        </motion.header>

        {/* Layout */}
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.35fr)]">
          {/* LEFT: Info + CTA */}
          <motion.section
            className="space-y-6"
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            {/* Contact cards */}
            <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-xl sm:p-7">
              <h2 className="text-base font-semibold text-white">
                Direct support
              </h2>
              <p className="mt-1 text-sm text-gray-300">
                Reach the team using the details below if you prefer not to use
                the form.
              </p>

              <div className="mt-6 space-y-5">
                <ContactRow
                  icon={<Mail className="h-5 w-5" />}
                  label="Email"
                  value="AURAYE@gmail.com"
                  href="mailto:AURAYE@gmail.com"
                  actionLabel="Email us"
                />

                <ContactRow
                  icon={<Phone className="h-5 w-5" />}
                  label="Phone"
                  value="+20 128 468 1320"
                  href="tel:+201284681320"
                  actionLabel="Call us"
                />

                <ContactRow
                  icon={<MapPin className="h-5 w-5" />}
                  label="Office"
                  value="Ismailia, Egypt"
                  sub="Sun – Thu · 10:00 – 18:00"
                  href="#location"
                  actionLabel="Get directions"
                />
              </div>
            </div>

            {/* CTA card */}
            <motion.div
              className="overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-neutral-900 via-neutral-900/90 to-neutral-700 p-6 shadow-xl sm:p-7"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white">
                  <MessageCircleMore className="h-5 w-5" />
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                    Live help
                  </p>
                  <h3 className="text-lg font-semibold text-white">
                    Prefer chatting instead of email?
                  </h3>
                  <p className="text-sm text-gray-300">
                    Open the support bubble in the bottom-right corner and talk
                    to the team in real time.
                  </p>
                  <button
                    type="button"
                    className="mt-1 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-black transition hover:bg-gray-200"
                  >
                    Open chat
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.section>

          {/* RIGHT: Form */}
          <motion.section
            className="overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-2xl sm:p-8"
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Send a message
                </h2>
                <p className="mt-1 text-sm text-gray-300">
                  Fill out the form and a reply will be sent directly to your
                  inbox.
                </p>
              </div>
              <div className="hidden text-right text-xs text-gray-400 sm:block">
                <p className="font-semibold uppercase tracking-[0.16em]">
                  Avg. response
                </p>
                <p className="text-[11px] text-white">~ 1 business day</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label>Full name</Label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Your full name"
                    {...register("name")}
                    className={inputBase}
                  />
                  {errors.name && (
                    <ErrorText>{errors.name.message}</ErrorText>
                  )}
                </div>

                <div>
                  <Label>Email address</Label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...register("email")}
                    className={inputBase}
                  />
                  {errors.email && (
                    <ErrorText>{errors.email.message}</ErrorText>
                  )}
                </div>
              </div>

              <div>
                <Label>Subject</Label>
                <input
                  id="subject"
                  type="text"
                  placeholder="Question about an order, AR try-on..."
                  {...register("subject")}
                  className={inputBase}
                />
                {errors.subject && (
                  <ErrorText>{errors.subject.message}</ErrorText>
                )}
              </div>

              <div>
                <Label>Message</Label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="How can the team help you today?"
                  {...register("message")}
                  className={`${inputBase} resize-none`}
                />
                {errors.message && (
                  <ErrorText>{errors.message.message}</ErrorText>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[11px] text-gray-400">
                  By submitting, you agree to be contacted about your request.
                </p>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black shadow-lg transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send message
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.section>
        </div>
      </div>
    </div>
  );
}

/* Small helper components */

function ContactRow({ icon, label, value, sub, href, actionLabel }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white">
          {icon}
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
            {label}
          </p>
          <p className="text-sm font-medium text-white">{value}</p>
          {sub && <p className="mt-0.5 text-xs text-gray-400">{sub}</p>}
        </div>
      </div>
      {href && actionLabel && (
        <a
          href={href}
          className="text-xs font-semibold text-white hover:text-gray-300"
        >
          {actionLabel}
        </a>
      )}
    </div>
  );
}

function Label({ children }) {
  return (
    <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-300">
      {children}
    </label>
  );
}

function ErrorText({ children }) {
  return <p className="mt-1 text-[11px] text-red-400">{children}</p>;
}
