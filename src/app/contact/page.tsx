"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const contactMethods = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "Email",
      value: "hello@managermatt.io",
      href: "mailto:hello@managermatt.io",
      description: "Best for detailed project inquiries",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "Schedule a Call",
      value: "30-min discovery call",
      href: "https://calendly.com/managermatt/discovery",
      description: "Talk through your project live",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
          />
        </svg>
      ),
      title: "Twitter/X",
      value: "@ManagerMattLLC",
      href: "https://twitter.com/managermattllc",
      description: "Quick questions and updates",
    },
  ];

  // Build mailto link with form data
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(formState.subject || "New Project Inquiry");
    const body = encodeURIComponent(
      `Name: ${formState.name}\nEmail: ${formState.email}\n\n${formState.message}`
    );
    window.location.href = `mailto:hello@managermatt.io?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 md:py-24 bg-page">
          <div className="container-wide mx-auto px-6 text-center">
            <h1 className="text-h1 text-foreground mb-4">Get in Touch</h1>
            <p className="text-body-lg text-secondary-custom max-w-2xl mx-auto">
              Have a project in mind? Let&apos;s talk about it.
              I respond to every message within 24 hours.
            </p>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-12 bg-subtle">
          <div className="container-wide mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {contactMethods.map((method, index) => (
                <a
                  key={index}
                  href={method.href}
                  target={method.href.startsWith("http") ? "_blank" : undefined}
                  rel={method.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="bg-surface rounded-xl p-6 border border-border-default hover:border-accent/30 transition-colors group"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent/20 transition-colors">
                      {method.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{method.title}</h3>
                      <p className="text-body-sm text-accent">{method.value}</p>
                    </div>
                  </div>
                  <p className="text-body-sm text-secondary-custom">
                    {method.description}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16 md:py-24 bg-page">
          <div className="container-wide mx-auto px-6">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-h2 text-foreground mb-4">Send a Message</h2>
                <p className="text-body text-secondary-custom">
                  Fill out the form and it&apos;ll open your email client ready to send.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-body-sm font-medium text-foreground mb-2"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formState.name}
                      onChange={(e) =>
                        setFormState({ ...formState, name: e.target.value })
                      }
                      className="w-full h-11 px-4 rounded-lg border border-border-default bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-body-sm font-medium text-foreground mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formState.email}
                      onChange={(e) =>
                        setFormState({ ...formState, email: e.target.value })
                      }
                      className="w-full h-11 px-4 rounded-lg border border-border-default bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-body-sm font-medium text-foreground mb-2"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={formState.subject}
                    onChange={(e) =>
                      setFormState({ ...formState, subject: e.target.value })
                    }
                    className="w-full h-11 px-4 rounded-lg border border-border-default bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-body-sm font-medium text-foreground mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    value={formState.message}
                    onChange={(e) =>
                      setFormState({ ...formState, message: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-border-default bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-12 bg-accent text-white rounded-lg font-medium hover:bg-accent-hover transition-colors flex items-center justify-center gap-2"
                >
                  Open in Email Client
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>

                <p className="text-center text-body-sm text-secondary-custom">
                  Or email directly at{" "}
                  <a href="mailto:hello@managermatt.io" className="text-accent hover:underline">
                    hello@managermatt.io
                  </a>
                </p>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
