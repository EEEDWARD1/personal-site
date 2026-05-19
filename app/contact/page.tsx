"use client";

import { FormEvent, useState } from "react";
import Card from "@/components/ui/card";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name"));
    const email = String(formData.get("email"));
    const message = String(formData.get("message"));
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    setStatus("sending");

    if (serviceId && templateId && publicKey) {
      try {
        const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service_id: serviceId,
            template_id: templateId,
            user_id: publicKey,
            template_params: {
              from_name: name,
              reply_to: email,
              message,
            },
          }),
        });

        if (!response.ok) throw new Error("EmailJS rejected the message.");
        setStatus("sent");
        form.reset();
        return;
      } catch {
        setStatus("error");
        return;
      }
    }

    const subject = encodeURIComponent(
      `Portfolio enquiry from ${name}`,
    );
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`,
    );

    window.location.href = `mailto:hello@eduardteodor.co.uk?subject=${subject}&body=${body}`;
    setStatus("sent");
    form.reset();
  }

  return (
    <main className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
      <Card>
        <h1 className="text-4xl">Contact</h1>
        <p className="mt-4">
          For roles, collaborations, freelance work, or project questions, send
          a message and I will reply from my inbox.
        </p>
        <div className="mt-6 grid gap-3 text-sm font-semibold">
          <a href="https://github.com/EEEDWARD1" className="text-teal-700">
            github.com/EEEDWARD1
          </a>
          <a href="https://www.linkedin.com" className="text-teal-700">
            LinkedIn
          </a>
          <a href="mailto:hello@eduardteodor.co.uk" className="text-teal-700">
            hello@eduardteodor.co.uk
          </a>
        </div>
      </Card>

      <Card>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <label>
            Name
            <input name="name" autoComplete="name" required />
          </label>
          <label>
            Email
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            Message
            <textarea name="message" rows={8} required />
          </label>
          <button type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Sending..." : "Send message"}
          </button>
          {status === "sent" ? (
            <p className="text-sm text-teal-700">
              Message sent. If EmailJS is not configured, your email client
              should open with the message ready.
            </p>
          ) : null}
          {status === "error" ? (
            <p className="text-sm text-red-700">
              Something went wrong. Please email directly instead.
            </p>
          ) : null}
        </form>
      </Card>
    </main>
  );
}
