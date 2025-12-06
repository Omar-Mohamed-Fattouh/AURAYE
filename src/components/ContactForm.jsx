import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, MapPin, MessageCircleMore, Send, Loader2 } from "lucide-react";
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
    "mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-white focus:outline-none focus:ring-2 focus:ring-white/30";

  return (
    <div className="bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Page header */}
        <header className="mb-10 text-center lg:text-left">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-black">
            Contact
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
            Get in touch with our team
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-slate-500 mx-auto lg:mx-0">
            Questions about your order, AR try-on, or our frames? Send us a message
            and we&apos;ll get back to you within one business day.
          </p>
        </header>

        {/* Layout */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.3fr)] items-start">
          {/* LEFT: Direct support / info */}
          <section className="space-y-6">
            <div className="rounded-2xl bg-white shadow-sm border border-slate-100 p-6 sm:p-7">
              <h2 className="text-base font-semibold text-slate-900">
                Direct support
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Reach us instantly using the details below.
              </p>

              <div className="mt-6 space-y-5">
                {/* Email */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black/10 text-black">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Email
                      </p>
                      <p className="text-sm font-medium text-slate-900">
                        AURAYE@gmail.com
                      </p>
                    </div>
                  </div>
                  <a
                    href="mailto:AURAYE@gmail.com"
                    className="text-xs font-semibold text-black hover:text-black"
                  >
                    Email us
                  </a>
                </div>

                {/* Phone */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black/10 text-black">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Phone
                      </p>
                      <p className="text-sm font-medium text-slate-900">
                        +20 128 468 1320
                      </p>
                    </div>
                  </div>
                  <a
                    href="tel:+201284681320"
                    className="text-xs font-semibold text-black hover:text-black"
                  >
                    Call us
                  </a>
                </div>

                {/* Office */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black/10 text-black">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Office
                      </p>
                      <p className="text-sm font-medium text-slate-900">
                        Ismailia, Egypt
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Sun – Thu · 10:00 – 18:00
                      </p>
                    </div>
                  </div>
                  <a
                    href="#location"
                    className="text-xs font-semibold text-black hover:text-black"
                  >
                    Get directions
                  </a>
                </div>
              </div>
            </div>

            {/* CTA card */}
            <div className="rounded-2xl bg-black text-slate-50 p-6 sm:p-7 space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-800/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white">
                <MessageCircleMore className="w-3.5 h-3.5" />
                Live help
              </div>
              <h3 className="text-lg font-semibold">
                Prefer chatting instead of email?
              </h3>
              <p className="text-sm text-slate-300">
                Open the support bubble in the bottom-right corner and talk to
                us in real time.
              </p>
              <button
                type="button"
                className="mt-1 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-900 hover:black/80 transition"
              >
                Open chat
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </section>

          {/* RIGHT: Form */}
          <section className="rounded-2xl bg-white shadow-sm border border-slate-100 p-6 sm:p-8">
            <h2 className="text-base font-semibold text-slate-900">
              Send us a message
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Fill out the form and we&apos;ll reply to{" "}
              <span className="font-medium">your inbox</span>.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs font-semibold text-slate-600 uppercase tracking-[0.16em]"
                  >
                    Full name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Your full name"
                    {...register("name")}
                    className={inputBase}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email "
                    className="block text-xs font-semibold text-slate-600 uppercase tracking-[0.16em]"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...register("email")}
                    className={inputBase}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-xs font-semibold text-slate-600 uppercase tracking-[0.16em]"
                >
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  placeholder="Question about an order"
                  {...register("subject")}
                  className={inputBase}
                />
                {errors.subject && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-xs font-semibold text-slate-600 uppercase tracking-[0.16em]"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="How can we help you today?"
                  {...register("message")}
                  className={`${inputBase} resize-none`}
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-[11px] text-slate-500">
                  By submitting, you agree to be contacted about your request.
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-black transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send message
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
