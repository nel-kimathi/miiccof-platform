import { getPage } from "@/lib/content";
import { getSponsorshipSettings, getPartnerLogos } from "@/app/admin/settings/actions";
import { SectionRenderer } from "@/components/public/sections";
import { SponsorshipSection } from "@/components/public/sponsorship-section";
import { PartnerLogos } from "@/components/public/partner-logos";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const page = await getPage("home");
  const sponsorshipSettings = await getSponsorshipSettings();
  const partnerLogos = await getPartnerLogos();

  return (
    <>
      {page?.sections.map((section) => {
        if (section.key === "sponsorship-teaser") {
          const cta = (section.metadata as { cta?: { label: string; href: string } } | null)?.cta;
          return (
            <>
              <PartnerLogos key="partner-logos" logos={partnerLogos} />
              <SponsorshipSection
                key={section.id}
                title={section.title ?? "Sponsorship Packages"}
                intro={section.subtitle ?? sponsorshipSettings.sponsorsIntro}
                sponsorshipTiers={sponsorshipSettings.sponsorshipTiers}
                whyPartnerPoints={[]}
                showWhyPartner={false}
                cta={cta}
              />
            </>
          );
        }
        return <SectionRenderer key={section.id} section={section} />;
      })}
    </>
  );
}
