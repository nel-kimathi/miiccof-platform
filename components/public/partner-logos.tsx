import { BrandCarousel } from "./brand-carousel";

export type PartnerLogo = {
  name: string;
  image: string;
  href: string;
};

export function PartnerLogos({
  logos,
  title = "Our Partners",
  subtitle = "Organisations partnering with us to make MIICCOF possible.",
}: {
  logos: PartnerLogo[];
  title?: string;
  subtitle?: string;
}) {
  if (!logos.length) return null;

  return (
    <section className="bg-muted/40 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        {title ? (
          <h2 className="font-heading text-center text-2xl font-bold text-primary sm:text-3xl">
            {title}
          </h2>
        ) : null}
        {subtitle ? (
          <p className="mt-2 text-center text-muted-foreground">{subtitle}</p>
        ) : null}
        <div className="mt-8">
          <BrandCarousel brands={logos} />
        </div>
      </div>
    </section>
  );
}
