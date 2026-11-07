import { FileText, ShieldCheck } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DysplasiaDocument } from "@/types/pin";

interface DocumentLinkProps {
  document: DysplasiaDocument | null;
}

export function DocumentLink({ document }: DocumentLinkProps) {
  if (!document) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Тест на дисплазию</CardTitle>
          <CardDescription>Документ с результатом обследования не добавлен.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  let safeUrl: string | null = null;

  try {
    const parsedUrl = new URL(document.url);
    safeUrl = ["http:", "https:"].includes(parsedUrl.protocol) ? parsedUrl.toString() : null;
  } catch {
    safeUrl = null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Тест на дисплазию</CardTitle>
        <CardDescription>Результат обследования доступен для просмотра в отдельном окне.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--accent-subtle)] text-[var(--accent)]">
            <FileText className="size-5" />
          </div>
          <div>
            <p className="font-medium text-[var(--text-primary)]">{document.name}</p>
            <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
              {document.description || "Результат обследования доступен для просмотра и скачивания."}
            </p>
          </div>
        </div>

        {safeUrl ? (
          <a
            href={safeUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-3 text-sm font-medium text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--accent-hover)]"
          >
            <ShieldCheck className="size-4" />
            Скачать / посмотреть результат
          </a>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-200 px-4 py-3 text-sm font-medium text-slate-500">
            <ShieldCheck className="size-4" />
            Некорректная ссылка на документ
          </span>
        )}
      </CardContent>
    </Card>
  );
}
