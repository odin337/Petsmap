import { ImagePlus, UploadCloud } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UploadDropzoneProps {
  title: string;
  description: string;
  actionLabel: string;
  icon?: "image" | "file";
}

export function UploadDropzone({
  title,
  description,
  actionLabel,
  icon = "image",
}: UploadDropzoneProps) {
  const Icon = icon === "image" ? ImagePlus : UploadCloud;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-[28px] border border-dashed border-[var(--border)] bg-white/60 p-6 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[var(--accent-subtle)] text-[var(--accent)]">
            <Icon className="size-6" />
          </div>
          <p className="mt-4 text-sm leading-6 text-[var(--text-secondary)]">
            Перетащите файл в эту область или воспользуйтесь кнопкой загрузки.
          </p>
          <Button variant="outline" className="mt-5">
            {actionLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
