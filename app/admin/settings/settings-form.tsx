"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { updateSettings, type SponsorshipTier, type PartnerLogo } from "./actions";

const SETTING_FIELDS = [
  { key: "siteName", label: "Site Name", placeholder: "MIICCOF" },
  { key: "siteTagline", label: "Site Tagline", placeholder: "Meru International Investment Conference & Consumer Fair" },
  { key: "contactEmail", label: "Contact Email", placeholder: "secretariat@example.com", type: "email" },
  { key: "supportPhone", label: "Support Phone", placeholder: "+254 ..." },
  { key: "eventStartDate", label: "Event Start Date", type: "date" },
  { key: "eventEndDate", label: "Event End Date", type: "date" },
  { key: "eventLocation", label: "Event Location", placeholder: "Meru, Kenya" },
  { key: "socialFacebook", label: "Facebook URL", placeholder: "https://facebook.com/..." },
  { key: "socialTwitter", label: "Twitter/X URL", placeholder: "https://x.com/..." },
  { key: "socialLinkedIn", label: "LinkedIn URL", placeholder: "https://linkedin.com/..." },
];

function parseTiers(raw: string): SponsorshipTier[] {
  try {
    return JSON.parse(raw) as SponsorshipTier[];
  } catch {
    return [];
  }
}

function parsePoints(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw) as string[];
    return parsed;
  } catch {
    return [];
  }
}

function parseLogos(raw: string): PartnerLogo[] {
  try {
    const parsed = JSON.parse(raw) as PartnerLogo[];
    return parsed;
  } catch {
    return [];
  }
}

export function SettingsForm({ settings }: { settings: Record<string, string> }) {
  const [message, setMessage] = useState<string | null>(null);
  const [sponsorsIntro, setSponsorsIntro] = useState(settings.sponsorsIntro ?? "");
  const [tiers, setTiers] = useState<SponsorshipTier[]>(parseTiers(settings.sponsorshipTiers ?? "[]"));
  const [points, setPoints] = useState<string[]>(parsePoints(settings.whyPartnerPoints ?? "[]"));
  const [logos, setLogos] = useState<PartnerLogo[]>(parseLogos(settings.partnerLogos ?? "[]"));

  async function handleSubmit(formData: FormData) {
    formData.set("sponsorsIntro", sponsorsIntro);
    formData.set("sponsorshipTiers", JSON.stringify(tiers));
    formData.set("whyPartnerPoints", JSON.stringify(points));
    formData.set("partnerLogos", JSON.stringify(logos));
    const result = await updateSettings(formData);
    setMessage(result.error ?? "Settings saved");
    setTimeout(() => setMessage(null), 3000);
  }

  function updateTier(index: number, field: keyof SponsorshipTier, value: string) {
    setTiers((prev) => prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)));
  }

  function addTier() {
    setTiers((prev) => [...prev, { name: "", amount: "", slots: "", position: "" }]);
  }

  function removeTier(index: number) {
    setTiers((prev) => prev.filter((_, i) => i !== index));
  }

  function updatePoint(index: number, value: string) {
    setPoints((prev) => prev.map((p, i) => (i === index ? value : p)));
  }

  function addPoint() {
    setPoints((prev) => [...prev, ""]);
  }

  function removePoint(index: number) {
    setPoints((prev) => prev.filter((_, i) => i !== index));
  }

  function updateLogo(index: number, field: keyof PartnerLogo, value: string) {
    setLogos((prev) => prev.map((l, i) => (i === index ? { ...l, [field]: value } : l)));
  }

  function addLogo() {
    setLogos((prev) => [...prev, { name: "", image: "", href: "" }]);
  }

  function removeLogo(index: number) {
    setLogos((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <form
      action={handleSubmit}
      className="space-y-10"
    >
      {message ? (
        <div className="rounded-lg border bg-accent/10 p-3 text-sm text-accent-foreground">
          {message}
        </div>
      ) : null}

      <div className="space-y-4">
        <h2 className="font-heading text-xl font-semibold text-primary">General Settings</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {SETTING_FIELDS.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key}>{field.label}</Label>
              <Input
                id={field.key}
                name={field.key}
                type={field.type ?? "text"}
                defaultValue={settings[field.key] ?? ""}
                placeholder={field.placeholder}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-heading text-xl font-semibold text-primary">Sponsors & Partners Page</h2>

        <div className="space-y-2">
          <Label htmlFor="sponsorsIntro">Introduction Paragraph</Label>
          <Textarea
            id="sponsorsIntro"
            value={sponsorsIntro}
            onChange={(e) => setSponsorsIntro(e.target.value)}
            rows={4}
            placeholder="Describe the value of partnering with MIICCOF..."
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Sponsorship Tiers</Label>
            <Button type="button" variant="outline" size="sm" onClick={addTier}>
              <Plus className="mr-1 h-4 w-4" />
              Add Tier
            </Button>
          </div>
          <div className="space-y-3">
            {tiers.map((tier, i) => (
              <div key={i} className="grid gap-3 rounded-lg border bg-card p-4 sm:grid-cols-4">
                <Input
                  value={tier.name}
                  onChange={(e) => updateTier(i, "name", e.target.value)}
                  placeholder="Tier name"
                />
                <Input
                  value={tier.amount}
                  onChange={(e) => updateTier(i, "amount", e.target.value)}
                  placeholder="Contribution amount"
                />
                <Input
                  value={tier.slots}
                  onChange={(e) => updateTier(i, "slots", e.target.value)}
                  placeholder="Slots available"
                />
                <div className="flex gap-2">
                  <Input
                    value={tier.position}
                    onChange={(e) => updateTier(i, "position", e.target.value)}
                    placeholder="Partnership position"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTier(i)}
                    aria-label="Remove tier"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Why Partner Points</Label>
            <Button type="button" variant="outline" size="sm" onClick={addPoint}>
              <Plus className="mr-1 h-4 w-4" />
              Add Point
            </Button>
          </div>
          <div className="space-y-2">
            {points.map((point, i) => (
              <div key={i} className="flex gap-2">
                <Textarea
                  value={point}
                  onChange={(e) => updatePoint(i, e.target.value)}
                  rows={2}
                  placeholder="Why partner with MIICCOF..."
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removePoint(i)}
                  aria-label="Remove point"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-heading text-xl font-semibold text-primary">Partner Logos Carousel</h2>
        <p className="text-sm text-muted-foreground">
          Logos shown between the Organising Committee and Sponsorship Packages sections on the homepage. Each logo links to its website in a new tab.
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Logos</Label>
            <Button type="button" variant="outline" size="sm" onClick={addLogo}>
              <Plus className="mr-1 h-4 w-4" />
              Add Logo
            </Button>
          </div>
          <div className="space-y-3">
            {logos.map((logo, i) => (
              <div key={i} className="grid gap-3 rounded-lg border bg-card p-4 sm:grid-cols-3">
                <Input
                  value={logo.name}
                  onChange={(e) => updateLogo(i, "name", e.target.value)}
                  placeholder="Organisation name"
                />
                <Input
                  value={logo.image}
                  onChange={(e) => updateLogo(i, "image", e.target.value)}
                  placeholder="Logo image path, e.g. /images/brands/..."
                />
                <div className="flex gap-2">
                  <Input
                    value={logo.href}
                    onChange={(e) => updateLogo(i, "href", e.target.value)}
                    placeholder="Website URL"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeLogo(i)}
                    aria-label="Remove logo"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Button type="submit">Save Settings</Button>
    </form>
  );
}
