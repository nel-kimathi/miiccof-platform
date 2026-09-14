import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import type { SponsorshipTier } from "@/app/admin/settings/actions";

export function SponsorshipSection({
  title = "Sponsorship Packages",
  intro,
  sponsorshipTiers,
  whyPartnerPoints = [],
  showWhyPartner = true,
  cta,
}: {
  title?: string;
  intro?: string;
  sponsorshipTiers: SponsorshipTier[];
  whyPartnerPoints?: string[];
  showWhyPartner?: boolean;
  cta?: { label: string; href: string };
}) {
  return (
    <section className="bg-secondary/60 px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="font-heading text-center text-3xl font-bold text-primary sm:text-4xl">
          {title}
        </h2>

        {intro ? (
          <p className="mx-auto mt-4 max-w-4xl text-center leading-relaxed text-muted-foreground">
            {intro}
          </p>
        ) : null}

        <div className="mt-10 flex flex-wrap justify-center gap-6">
          {sponsorshipTiers.map((tier, i) => (
            <Card
              key={i}
              className="w-full max-w-sm border-t-4 border-t-accent text-center transition-shadow hover:shadow-lg sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
            >
              <CardHeader>
                <CardTitle className="text-xl font-bold text-primary">
                  {tier.name}
                </CardTitle>
                <p className="mt-1 text-2xl font-bold text-accent">{tier.amount}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm font-semibold text-muted-foreground">
                  {tier.slots}
                </p>
                <p className="text-sm text-muted-foreground">{tier.position}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {showWhyPartner && whyPartnerPoints.length > 0 ? (
          <div className="mt-16 rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-10">
            <h3 className="font-heading text-center text-2xl font-bold text-primary sm:text-3xl">
              Why Partner
            </h3>
            <ul className="mx-auto mt-6 grid max-w-4xl gap-4 sm:grid-cols-2">
              {whyPartnerPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span className="text-sm leading-relaxed text-muted-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {cta ? (
          <div className="mt-10 flex justify-center">
            <Button render={<Link href={cta.href} />}>{cta.label}</Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
