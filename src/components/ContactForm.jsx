import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema } from "../forms/contactSchema.js";
import { sendContactMessage } from "../api/contactApi";
import { toast } from "sonner";
import { Eye, LocationEditIcon, Mail, Monitor, Phone } from "lucide-react";


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

  return (
    
    <div className="max-w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-[#f6f6f8]">
  <header className="max-w-7xl mx-auto mb-12 text-center sm:text-left">
    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
      Get in Touch
    </h1>
    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
      We'd love to hear from you. Reach out with any questions or feedback.
    </p>
  </header>
  <main className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
    <div className="space-y-12">
      <section className="bg-white p-6 rounded-lg shadow-md">

        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
          Direct Support
        </h2>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-[#f6f6f8]  p-3 rounded-lg">
                <span className="material-symbols-outlined text-primary">
                  <Mail/>
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  Email Address
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  karemmohamed8359@gmail.com
                </p>
              </div>
            </div>
            <a
              className="text-blue-700 font-semibold underline text-sm"
              href="mailto:support@spectra-ar.com"
            >
              Email Us
            </a>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-[#f6f6f8]  p-3 rounded-lg">
                <span className="material-symbols-outlined text-primary">
                  <Phone/>
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  Phone Number
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  +20-1030207733
                </p>
              </div>
            </div>
            <a
              className="text-blue-700 font-semibold underline text-sm"
              href="tel:+15551234567"
            >
              Call Us
            </a>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-[#f6f6f8] dark:bg-slate-800 p-3 rounded-lg">
                <span className="material-symbols-outlined text-primary">
                  <LocationEditIcon/>
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  Office Address
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Ismailia, Egypt
                </p>
              </div>
            </div>
            <a
              className="text-blue-700  font-semibold underline text-sm"
              href="#"
            >
              Get Directions
            </a>
          </div>
        </div>
      </section>
      <section className="bg-white dark:bg-slate-800 p-8 rounded-lg text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="bg-blue-100 dark:bg-slate-700 p-4 rounded-lg flex-shrink-0">
            <span className="material-symbols-outlined text-primary text-4xl">
              <Eye/>
            </span>
          </div>
          <div className="flex-grow">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Experience Our Virtual Try-On
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Use our cutting-edge AR technology to see how frames look on you
              from the comfort of your home. It's the future of eyewear
              shopping.
            </p>
          </div>
        </div>
        <button className="mt-6 w-full sm:w-auto bg-gray-900 dark:bg-slate-900 text-white dark:text-gray-100 font-semibold py-3 px-6 rounded-lg hover:bg-gray-800 dark:hover:bg-slate-700 transition-colors">
          Launch Virtual Mirror
        </button>
      </section>
    </div>
    <div className="bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
        Send Us a Message
      </h2>
      <form
  onSubmit={handleSubmit(onSubmit)}
  className="space-y-6 max-w-2xl mx-auto"
>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    <div>
      <label
        htmlFor="name"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        Full Name
      </label>
      <input
        id="name"
        type="text"
        placeholder="John Doe"
        {...register("name")}
        className="mt-1 block w-full bg-gray-100 dark:bg-slate-700 border-transparent focus:border-primary focus:ring-primary rounded-lg p-2"
      />
      {errors.name && (
        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
      )}
    </div>

    <div>
      <label
        htmlFor="email"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        Email Address
      </label>
      <input
        id="email"
        type="email"
        placeholder="you@example.com"
        {...register("email")}
        className="mt-1 block w-full bg-gray-100 dark:bg-slate-700 border-transparent focus:border-primary focus:ring-primary rounded-lg p-2"
      />
      {errors.email && (
        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
      )}
    </div>
  </div>

  <div>
    <label
      htmlFor="subject"
      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      Subject
    </label>
    <input
      id="subject"
      type="text"
      placeholder="Question about an order"
      {...register("subject")}
      className="mt-1 block w-full bg-gray-100 dark:bg-slate-700 border-transparent focus:border-primary focus:ring-primary rounded-lg p-2"
    />
    {errors.subject && (
      <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
    )}
  </div>

  <div>
    <label
      htmlFor="message"
      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      Message
    </label>
    <textarea
      id="message"
      placeholder="How can we help you today?"
      rows={4}
      {...register("message")}
      className="mt-1 block w-full bg-gray-100 dark:bg-slate-700 border-transparent focus:border-primary focus:ring-primary rounded-lg p-2"
    />
    {errors.message && (
      <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
    )}
  </div>

  <div>
    <button
      type="submit"
      disabled={isSubmitting}
      className="w-full bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-slate-800 transition-colors"
    >
      {isSubmitting ? "Sending..." : "Send Message"}
    </button>
  </div>
</form>

    </div>
  </main>
</div>

  );
}
