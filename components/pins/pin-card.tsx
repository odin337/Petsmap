"use client";

import { CalendarDays, MapPin, PencilLine, PlayCircle, Save, Sparkles, UserRound, XCircle } from "lucide-react";
import { type ComponentType, useMemo, useState } from "react";

import { DocumentLink } from "@/components/pins/document-link";
import { GalleryGrid } from "@/components/pins/gallery-grid";
import { PedigreeTree } from "@/components/pins/pedigree-tree";
import { PinForm } from "@/components/pins/pin-form";
import { RainbowBadge } from "@/components/pins/rainbow-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { normalizePinRecord } from "@/lib/pins";
import { parseVideoUrl } from "@/lib/video/embed";
import { cn } from "@/lib/utils";
import type { PinRecord } from "@/types/pin";

type CardMode = "view" | "edit" | "create";

interface PinCardProps {
  pin: PinRecord | null;
  open: boolean;
  initialMode: Extract<CardMode, "view" | "create">;
  onClose: () => void;
  onSave: (pin: PinRecord) => void;
}

function formatDateLabel(dateValue: string) {
  if (!dateValue) {
    return "Дата не указана";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Дата не указана";
  }

  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function InfoTile({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] bg-white/70 p-4 shadow-[var(--shadow-sm)]">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
        <Icon className="size-4" />
        {label}
      </div>
      <p className="mt-3 text-sm font-medium leading-6 text-[var(--text-primary)]">{value}</p>
    </div>
  );
}

export function PinCard({ pin, open, initialMode, onClose, onSave }: PinCardProps) {
  const [mode, setMode] = useState<CardMode>(initialMode);
  const [draft, setDraft] = useState<PinRecord | null>(pin);

  const parsedVideo = useMemo(() => parseVideoUrl(draft?.videoUrl ?? ""), [draft?.videoUrl]);

  if (!draft) {
    return null;
  }

  const handleSave = () => {
    const normalized = normalizePinRecord(draft);
    setDraft(normalized);
    onSave(normalized);
    setMode("view");
  };

  const isEditing = mode === "edit" || mode === "create";

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="border-none bg-transparent p-0 shadow-none">
        <DialogHeader className="sr-only">
          <DialogTitle>
            {draft.role} {draft.breed}
          </DialogTitle>
          <DialogDescription>Карточка участника клуба на интерактивной карте.</DialogDescription>
        </DialogHeader>

        <div className="glass-panel max-h-[92dvh] overflow-y-auto overscroll-contain rounded-[32px] border border-white/40">
          <div className="relative overflow-hidden border-b border-white/40 bg-linear-to-br from-white via-white/88 to-[var(--accent-subtle)] p-5 sm:p-6">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-[var(--accent)]/10 blur-3xl" />
            <div className="relative flex flex-col gap-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>{draft.species || "Вид не указан"}</Badge>
                    <Badge variant="secondary">{draft.city || "Город не указан"}</Badge>
                    {draft.isRainbow ? <RainbowBadge /> : null}
                  </div>

                  {mode === "view" ? (
                    <div className="space-y-3">
                      <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
                        {draft.role}
                      </h1>
                      <h2 className="text-lg font-semibold text-[var(--accent)] sm:text-xl">
                        {draft.breed || "Порода не указана"}
                      </h2>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
                        {mode === "create" ? "Новая карточка" : "Редактирование карточки"}
                      </p>
                      <p className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
                        {draft.petName || draft.contactName || "Сведения о карточке"}
                      </p>
                    </div>
                  )}

                  <div className="max-w-2xl">
                    <p className="text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
                      {draft.description || "Описание не добавлено."}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {mode === "view" ? (
                    <Button variant="secondary" size="lg" onClick={() => setMode("edit")}>
                      <PencilLine className="size-4" />
                      Редактировать
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline" size="lg" onClick={() => {
                        if (initialMode === "create") {
                          onClose();
                          return;
                        }

                        setDraft(pin);
                        setMode("view");
                      }}>
                        <XCircle className="size-4" />
                        Отменить
                      </Button>
                      <Button size="lg" onClick={handleSave}>
                        <Save className="size-4" />
                        Сохранить
                      </Button>
                    </>
                  )}
                </div>
              </div>

            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="grid gap-6">
              {isEditing ? (
                <PinForm value={draft} onChange={setDraft} />
              ) : (
                <>
                  <section className="grid gap-3 md:grid-cols-3">
                    <InfoTile
                      icon={UserRound}
                      label="Имя питомца"
                      value={draft.petName || "Не указано"}
                    />
                    <InfoTile
                      icon={CalendarDays}
                      label="Дата рождения"
                      value={formatDateLabel(draft.birthDate)}
                    />
                    <InfoTile
                      icon={MapPin}
                      label="Контакт"
                      value={draft.contactName || "Не указано"}
                    />
                  </section>

                  <div className="grid gap-6">
                  <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
                    <Card className="bg-white/74">
                      <CardHeader>
                        <CardTitle>Краткий профиль</CardTitle>
                        <CardDescription>
                          Базовая информация для быстрого знакомства с карточкой.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-4 sm:grid-cols-2">
                        <InfoTile icon={Sparkles} label="Роль" value={draft.role} />
                        <InfoTile icon={Sparkles} label="Вид" value={draft.species || "Не указано"} />
                        <InfoTile icon={MapPin} label="Город" value={draft.city || "Не указано"} />
                        <InfoTile
                          icon={MapPin}
                          label="Координаты"
                          value={`${draft.location.lat.toFixed(4)}, ${draft.location.lng.toFixed(4)}`}
                        />
                      </CardContent>
                    </Card>

                    <Card className="bg-white/74">
                      <CardHeader>
                        <CardTitle>Титулы</CardTitle>
                        <CardDescription>Награды и регалии питомца собраны в отдельный список.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {draft.titles.length > 0 ? (
                          <ul className="space-y-3 text-sm leading-6 text-[var(--text-secondary)]">
                            {draft.titles.map((title) => (
                              <li
                                key={title}
                                className="rounded-2xl bg-white/80 px-4 py-3 text-[var(--text-primary)] shadow-[var(--shadow-sm)]"
                              >
                                {title}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-[var(--text-secondary)]">
                            Титулы не указаны.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </section>

                  <DocumentLink document={draft.dysplasiaTest} />

                  <PedigreeTree pedigree={draft.pedigree} />

                  <GalleryGrid images={draft.gallery} />

                  <Card className="bg-white/74">
                    <CardHeader>
                      <CardTitle>Видео</CardTitle>
                      <CardDescription>
                        Видео отображается по ссылкам из VK Видео и RuTube.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {parsedVideo.ok ? (
                        <div className="grid gap-4">
                          <div className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)]">
                            <PlayCircle className="size-4" />
                            {parsedVideo.label}
                          </div>
                          <div className="overflow-hidden rounded-[28px] border border-white/40 bg-black shadow-[var(--shadow-md)]">
                            <div className="aspect-video">
                              <iframe
                                src={parsedVideo.embedUrl}
                                title={`Видео: ${draft.petName || draft.breed || draft.role}`}
                                className="h-full w-full"
                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                allowFullScreen
                                referrerPolicy="strict-origin-when-cross-origin"
                                sandbox="allow-scripts allow-same-origin allow-presentation"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={cn(
                            "rounded-[24px] border border-dashed p-5 text-sm leading-6",
                            draft.videoUrl
                              ? "border-amber-300 bg-amber-50 text-amber-900"
                              : "border-[var(--border)] bg-white/60 text-[var(--text-secondary)]",
                          )}
                        >
                          {draft.videoUrl
                            ? parsedVideo.reason
                            : "Ссылка на видео не указана."}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Separator />

                  <div className="flex items-center justify-between rounded-[28px] bg-white/55 px-5 py-4 text-sm text-[var(--text-secondary)]">
                    <span>Координаты метки</span>
                    <span className="font-medium text-[var(--text-primary)] tabular-nums">
                      {draft.location.lat.toFixed(4)}, {draft.location.lng.toFixed(4)}
                    </span>
                  </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
