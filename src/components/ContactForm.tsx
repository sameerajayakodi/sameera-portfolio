import React, { useState } from "react";
import { Mail, Send, CheckCircle, AlertCircle, Phone, MapPin, Sparkles } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus("error");
      setFeedback("Please fill out all required fields: Name, Email, and Message.");
      return;
    }

    setStatus("submitting");

    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Submission failed");
        return res.json();
      })
      .then((data) => {
        setStatus("success");
        setFeedback(data.message || "Thank you! Sameera's team has received your message.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      })
      .catch((err) => {
        console.error("Submission Error:", err);
        setStatus("error");
        setFeedback("Failed to deliver your message. Please try again later!");
      });
  };

  return (
    <section id="contact-section" className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/1 sm:p-8 lg:p-12 animate-fadeIn">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Information Grid Column */}
        <div className="space-y-6 lg:col-span-5">
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-normal text-neutral-900 dark:text-white">
              Let's Collaborate
            </h2>
            <p className="text-xs text-neutral-500 dark:text-zinc-500 leading-relaxed font-light">
              Have an open vacancy, freelance project, or simply want to chat about AI automation workflows? Drop a line, and Sameera will get back to you!
            </p>
          </div>

          <div className="space-y-4 pt-4 text-sm text-neutral-600 dark:text-neutral-300">
            <div className="flex items-start space-x-3">
              <div className="rounded-lg bg-neutral-100 dark:bg-white/5 border dark:border-white/10 p-2 text-zinc-650 dark:text-zinc-300">
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-neutral-450">Email Address</h4>
                <a href="mailto:sameerajayakodi456@gmail.com" className="text-sm font-light text-neutral-850 dark:text-zinc-300 hover:text-neutral-950 dark:hover:text-white transition">
                  sameerajayakodi456@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="rounded-lg bg-neutral-100 dark:bg-white/5 border dark:border-white/10 p-2 text-zinc-650 dark:text-zinc-300">
                <Phone className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-neutral-450">Contact Number</h4>
                <a href="tel:+94770309842" className="text-sm font-light text-neutral-850 dark:text-zinc-300 hover:text-neutral-950 dark:hover:text-white transition">
                  +94 770 309 842
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="rounded-lg bg-neutral-100 dark:bg-white/5 border dark:border-white/10 p-2 text-zinc-650 dark:text-zinc-300">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-neutral-450">Office Location</h4>
                <p className="text-sm font-light text-neutral-850 dark:text-zinc-300">Homagama, Sri Lanka</p>
              </div>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="rounded-lg bg-neutral-50 p-4 border border-neutral-100 dark:bg-white/2 dark:border-white/10">
            <span className="flex items-center space-x-1.5 text-[10px] font-mono uppercase tracking-widest text-neutral-600 dark:text-zinc-350">
              <Sparkles className="h-3.5 w-3.5 text-zinc-400" />
              <span>Durable Storage Integration</span>
            </span>
            <p className="mt-1 text-xs text-neutral-500 dark:text-zinc-500 leading-normal font-light">
              Submitting this form stores your message on our central servers. You can view your submissions live in the **Live Stats** dashboard!
            </p>
          </div>
        </div>

        {/* Contact Form Grid Column */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-450 dark:text-zinc-500">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50/50 px-3.5 py-2.5 text-sm focus:border-neutral-950 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-sophisticated-bg dark:focus:bg-neutral-950 dark:text-neutral-100"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-450 dark:text-zinc-500">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50/50 px-3.5 py-2.5 text-sm focus:border-neutral-950 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-sophisticated-bg dark:focus:bg-neutral-950 dark:text-neutral-100"
                />
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-450 dark:text-zinc-500">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Job Inquiry / Project Idea"
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50/50 px-3.5 py-2.5 text-sm focus:border-neutral-950 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-sophisticated-bg dark:focus:bg-neutral-950 dark:text-neutral-100"
              />
            </div>

            {/* Message */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-450 dark:text-zinc-500">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Hi Sameera, I loved your portfolio! We have a software role open..."
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50/50 px-3.5 py-2.5 text-sm focus:border-neutral-950 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-sophisticated-bg dark:focus:bg-neutral-950 dark:text-neutral-100"
              />
            </div>

            {/* Status alerts */}
            {status === "success" && (
              <div className="flex items-center space-x-2 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-xs font-semibold text-zinc-800 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 animate-fadeIn">
                <CheckCircle className="h-5 w-5 text-zinc-500 shrink-0" />
                <span>{feedback}</span>
              </div>
            )}

            {status === "error" && (
              <div className="flex items-center space-x-2 rounded-lg border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-800 dark:border-red-950/20 dark:bg-red-950/10 dark:text-red-400 animate-fadeIn">
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                <span>{feedback}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === "submitting"}
              className="flex w-full items-center justify-center space-x-2 rounded-lg border border-neutral-950 bg-neutral-950 py-3.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-850 transition disabled:opacity-50 dark:border-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 cursor-pointer"
            >
              <Send className="h-4 w-4" />
              <span>{status === "submitting" ? "Sending inquiry..." : "Send Message"}</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
