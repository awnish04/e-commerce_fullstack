"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Billboard } from "@/shared/types";

interface HeroCarouselProps {
  billboard: Billboard;
}

export default function HeroCarousel({ billboard }: HeroCarouselProps) {
  const slides = billboard.images?.length
    ? billboard.images
    : [{ id: billboard.id, url: billboard.imageUrl, sortOrder: 0 }];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setInterval(() => {
      setCurrent((index) => (index + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrent((index) => (index + 1) % slides.length);
  const previousSlide = () =>
    setCurrent((index) => (index - 1 + slides.length) % slides.length);

  return (
    <section className="relative h-[70vh] min-h-130 w-full overflow-hidden bg-black">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${slide.url})` }}
          aria-hidden={index !== current}
        />
      ))}
      <div className="absolute inset-0 bg-black/35" />
      <div className="relative z-10 flex h-full items-center justify-center px-6 text-center text-white">
        <div>
          <p className="mb-8 text-4xl font-semibold uppercase tracking-[0.18em] sm:text-6xl lg:text-8xl">
            {billboard.label}
          </p>
          <Link
            href="/category"
            className="inline-flex items-center border border-white px-7 py-3 text-sm font-semibold uppercase tracking-[0.16em] transition-colors hover:bg-white hover:text-black"
          >
            Shop now
          </Link>
        </div>
      </div>
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={previousSlide}
            aria-label="Previous hero image"
            className="absolute left-4 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center border border-white/70 text-white transition-colors hover:bg-white hover:text-black"
          >
            <ArrowLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next hero image"
            className="absolute right-4 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center border border-white/70 text-white transition-colors hover:bg-white hover:text-black"
          >
            <ArrowRight className="size-5" />
          </button>
          <div className="absolute bottom-6 right-6 z-20 font-mono text-sm text-white">
            {String(current + 1).padStart(2, "0")} /{" "}
            {String(slides.length).padStart(2, "0")}
          </div>
        </>
      )}
    </section>
  );
}
