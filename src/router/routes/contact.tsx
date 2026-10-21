import { useState, type FormEvent } from "react";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";
import { Send } from "@/components/animate-ui/icons/send";
import { AnimateIcon } from "@animate-ui/react/icons";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/landing/page-header";
import { site } from "@/site.config";

export const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: send the form data to your backend or form service.
    setSent(true);
  }

  return (
    <>
      <PageHeader
        title="Get in touch"
        subtitle={`Questions, feedback or partnerships — we'd love to hear from you. Or email ${site.email}.`}
      />
      <section className="container-page pb-24">
        <div className="mx-auto max-w-xl rounded-2xl border border-line bg-surface p-6 sm:p-8">
          {sent ? (
            <p className="text-center text-lg">Thanks! We&apos;ll get back to you soon.</p>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-5">
              <Field label="Name" name="name" />
              <Field label="Email" name="email" type="email" />
              <label className="grid gap-2 text-sm font-medium">
                Message
                <textarea name="message" rows={5} required className="input" />
              </label>
              <AnimateIcon animateOnHover asChild>
                <Button type="submit" size="lg" className="h-11 justify-self-start rounded-full px-6">
                  <Send />
                  Send message
                </Button>
              </AnimateIcon>
            </form>
          )}
        </div>
      </section>
    </>
  );
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <input name={name} type={type} required className="input" />
    </label>
  );
}
