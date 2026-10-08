"use client";

import React, { useState } from "react";
import { Button } from "./Button";
import { Input, Textarea, Select, Label, FormField } from "./Form";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Pastoral Inquiry",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    // Stubbed handler for Supabase integration
    setTimeout(() => {
      setStatus("success");
    }, 600);
  };

  if (status === "success") {
    return (
      <div className="border border-black p-8 sm:p-12 space-y-4 bg-white">
        <div className="font-mono text-xs uppercase tracking-widest text-[#782620]">
          Inquiry Received
        </div>
        <h3 className="font-serif text-2xl sm:text-3xl text-black">
          Thank you for writing to PCEA Kileleshwa.
        </h3>
        <p className="text-sm text-neutral-600 leading-relaxed max-w-lg">
          Your message has been recorded in the parish registry. The Session
          Clerk or Parish Administrator will review your correspondence and
          respond promptly.
        </p>
        <div className="pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFormData({
                name: "",
                email: "",
                phone: "",
                subject: "General Pastoral Inquiry",
                message: "",
              });
              setStatus("idle");
            }}
          >
            Send Another Inquiry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FormField>
          <Label htmlFor="name" required>
            Full Name
          </Label>
          <Input
            id="name"
            name="name"
            required
            placeholder="Jane Doe"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
        </FormField>

        <FormField>
          <Label htmlFor="email" required>
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="jane@example.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FormField>
          <Label htmlFor="phone">Phone Number (Optional)</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+254 700 000 000"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
        </FormField>

        <FormField>
          <Label htmlFor="subject" required>
            Inquiry Department
          </Label>
          <Select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={(e) =>
              setFormData({ ...formData, subject: e.target.value })
            }
          >
            <option value="General Pastoral Inquiry">
              General Pastoral Inquiry
            </option>
            <option value="New Members &amp; Catechism">
              New Members &amp; Catechism
            </option>
            <option value="Marriage &amp; Family Life">
              Marriage &amp; Family Life
            </option>
            <option value="Church School &amp; Youth">
              Church School &amp; Youth
            </option>
            <option value="Parish Administrator">
              Parish Administrator
            </option>
          </Select>
        </FormField>
      </div>

      <FormField>
        <Label htmlFor="message" required>
          Message or Prayer Request
        </Label>
        <Textarea
          id="message"
          name="message"
          rows={6}
          required
          placeholder="Please state how our pastoral team or parish administration may assist you..."
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
        />
      </FormField>

      <div className="pt-2">
        <Button
          type="submit"
          variant="solid"
          size="lg"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Transmitting..." : "Submit Inquiry"}
        </Button>
      </div>
    </form>
  );
}
