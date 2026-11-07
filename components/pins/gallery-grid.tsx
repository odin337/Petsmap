import Image from "next/image";
import { Camera } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { GalleryImage } from "@/types/pin";

interface GalleryGridProps {
  images: GalleryImage[];
}

export function GalleryGrid({ images }: GalleryGridProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Фотогалерея</CardTitle>
        <CardDescription>Подборка фотографий питомца или специалиста в компактной сетке.</CardDescription>
      </CardHeader>
      <CardContent>
        {images.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image, index) => (
              <figure
                key={image.id}
                className={index === 0 ? "sm:col-span-2 lg:row-span-2" : undefined}
              >
                <div className="relative h-full min-h-48 overflow-hidden rounded-[24px] shadow-[var(--shadow-sm)]">
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              </figure>
            ))}
          </div>
        ) : (
          <div className="flex min-h-40 flex-col items-center justify-center rounded-[24px] border border-dashed border-[var(--border)] bg-white/50 text-center">
            <Camera className="size-6 text-[var(--text-secondary)]" />
            <p className="mt-3 text-sm text-[var(--text-secondary)]">
              Фотографии не добавлены.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
