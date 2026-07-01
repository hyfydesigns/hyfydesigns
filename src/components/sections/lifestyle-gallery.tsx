import Image from "next/image";
import { MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import { sanityFetch } from "@/sanity/client";
import { LIFESTYLE_PHOTOS_QUERY } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import type { LifestylePhotoDoc } from "@/sanity/types";

const fallbackTiles = [
  { location: "Buffalo Bayou", aspect: "aspect-[4/5]", tone: "bg-blue text-cream" },
  { location: "Montrose", aspect: "aspect-[4/3]", tone: "bg-red-tint text-red-deep" },
  { location: "Discovery Green", aspect: "aspect-square", tone: "bg-navy text-cream" },
  { location: "The Heights", aspect: "aspect-[4/3]", tone: "bg-blue-tint text-navy" },
  { location: "East End", aspect: "aspect-[4/5]", tone: "bg-red text-cream" },
  { location: "Downtown", aspect: "aspect-square", tone: "bg-cream-warm text-navy" },
];

export async function LifestyleGallery() {
  const photos = await sanityFetch<LifestylePhotoDoc[]>(
    LIFESTYLE_PHOTOS_QUERY,
    {},
    [],
  );

  return (
    <section className="py-12 sm:py-16 bg-cream-warm/40">
      <Container>
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl">On the streets of H-town.</h2>
          <p className="mt-1 text-ink-600 text-sm">
            Real customers, real neighborhoods.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
          {photos.length > 0
            ? photos.map((p) => (
                <div
                  key={p._id}
                  className={`relative rounded-xl overflow-hidden ${p.aspect}`}
                >
                  <Image
                    src={urlFor(p.image).url()}
                    alt={p.caption ?? p.location}
                    fill
                    sizes="(min-width: 1024px) 33vw, 50vw"
                    className="object-cover"
                  />
                  <LocationPill location={p.location} />
                </div>
              ))
            : fallbackTiles.map((t, i) => (
                <div
                  key={i}
                  className={`relative rounded-xl overflow-hidden ${t.aspect} ${t.tone}`}
                >
                  <LocationPill location={t.location} />
                </div>
              ))}
        </div>
        {photos.length === 0 && (
          <p className="mt-4 text-xs text-ink-400 text-center sm:text-left">
            Add lifestyle photos in Sanity Studio at /studio to replace these
            placeholder tiles.
          </p>
        )}
      </Container>
    </section>
  );
}

function LocationPill({ location }: { location: string }) {
  return (
    <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 inline-flex items-center gap-1 text-[10px] sm:text-xs px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm">
      <MapPin className="h-3 w-3 text-navy" strokeWidth={2.5} />
      <span className="text-navy font-medium">{location}</span>
    </div>
  );
}
