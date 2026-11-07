"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createPinId, formatTitlesInput, parseTitlesInput } from "@/lib/pins";
import { parseVideoUrl } from "@/lib/video/embed";
import { PIN_ROLE_OPTIONS, type GalleryImage, type PedigreeGeneration, type PinRecord } from "@/types/pin";
import { UploadDropzone } from "@/components/pins/upload-dropzone";

interface PinFormProps {
  value: PinRecord;
  onChange: (value: PinRecord) => void;
}

const pedigreeLabels = [
  "Родители",
  "Дедушки и бабушки",
  "Прадедушки и прабабушки",
];

const allowedGalleryHosts = new Set(["images.unsplash.com", "plus.unsplash.com"]);

function buildPedigreeEntries(text: string) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, note] = line.split("|").map((part) => part.trim());

      return {
        id: createPinId(),
        name,
        note: note || undefined,
      };
    })
    .filter((entry) => entry.name);
}

function generationToText(generations: PedigreeGeneration[], label: string) {
  const generation = generations.find((item) => item.label === label);

  if (!generation) {
    return "";
  }

  return generation.entries
    .map((entry) => (entry.note ? `${entry.name} | ${entry.note}` : entry.name))
    .join("\n");
}

function buildGalleryFromText(text: string, seed: string): GalleryImage[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((url, index) => {
      try {
        const parsedUrl = new URL(url);

        if (parsedUrl.protocol !== "https:" || !allowedGalleryHosts.has(parsedUrl.hostname)) {
          return [];
        }

        return [
          {
            id: createPinId(),
            url: parsedUrl.toString(),
            alt: `Фото ${index + 1} для ${seed || "карточки"}`,
          },
        ];
      } catch {
        return [];
      }
    });
}

export function PinForm({ value, onChange }: PinFormProps) {
  const titlesValue = formatTitlesInput(value.titles);
  const galleryValue = value.gallery.map((image) => image.url).join("\n");
  const pedigreeGenerations = value.pedigree?.generations ?? [];
  const videoStatus = parseVideoUrl(value.videoUrl);

  function updatePartial(nextValue: Partial<PinRecord>) {
    onChange({
      ...value,
      ...nextValue,
    });
  }

  function updatePedigree(label: string, text: string) {
    const nextGenerations = pedigreeLabels
      .map((generationLabel) => {
        const sourceText =
          generationLabel === label
            ? text
            : generationToText(pedigreeGenerations, generationLabel);
        const entries = buildPedigreeEntries(sourceText);

        if (entries.length === 0) {
          return null;
        }

        return {
          label: generationLabel,
          entries,
        };
      })
      .filter(Boolean) as PedigreeGeneration[];

    updatePartial({
      pedigree: nextGenerations.length > 0 ? { generations: nextGenerations } : null,
    });
  }

  const docName = value.dysplasiaTest?.name ?? "";
  const docUrl = value.dysplasiaTest?.url ?? "";

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="role">Роль / тип</Label>
          <Select value={value.role} onValueChange={(role) => updatePartial({ role: role as PinRecord["role"] })}>
            <SelectTrigger id="role">
              <SelectValue placeholder="Выберите роль" />
            </SelectTrigger>
            <SelectContent>
              {PIN_ROLE_OPTIONS.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="species">Вид</Label>
          <Input
            id="species"
            value={value.species}
            onChange={(event) => updatePartial({ species: event.target.value })}
            placeholder="Например, Собака"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="breed">Порода</Label>
          <Input
            id="breed"
            value={value.breed}
            onChange={(event) => updatePartial({ breed: event.target.value })}
            placeholder="Введите породу"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="petName">Имя питомца</Label>
          <Input
            id="petName"
            value={value.petName}
            onChange={(event) => updatePartial({ petName: event.target.value })}
            placeholder="Например, Северная Аврора"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="birthDate">Дата рождения</Label>
          <Input
            id="birthDate"
            type="date"
            value={value.birthDate}
            onChange={(event) => updatePartial({ birthDate: event.target.value })}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="city">Город</Label>
          <Input
            id="city"
            value={value.city}
            onChange={(event) => updatePartial({ city: event.target.value })}
            placeholder="Например, Москва"
          />
        </div>

        <div className="grid gap-2 md:col-span-2">
          <Label htmlFor="contactName">Контакт / владелец карточки</Label>
          <Input
            id="contactName"
            value={value.contactName}
            onChange={(event) => updatePartial({ contactName: event.target.value })}
            placeholder="Имя заводчика, питомника или специалиста"
          />
        </div>
      </section>

      <section className="grid gap-2">
        <Label htmlFor="description">Описание карточки</Label>
        <Textarea
          id="description"
          value={value.description}
          onChange={(event) => updatePartial({ description: event.target.value })}
          placeholder="Короткая заметка о питомце или специалисте"
        />
      </section>

      <section className="grid gap-2">
        <Label htmlFor="titles">Титулы</Label>
        <Textarea
          id="titles"
          value={titlesValue}
          onChange={(event) => updatePartial({ titles: parseTitlesInput(event.target.value) })}
          placeholder="Каждый титул с новой строки"
        />
      </section>

      <section className="rounded-[28px] border border-white/40 bg-white/60 p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold text-[var(--text-primary)]">Статус</p>
            <p className="text-sm text-[var(--text-secondary)]">
              Если питомца больше нет, в карточке появится заметный мемориальный бейдж.
            </p>
          </div>

          <label className="flex items-center gap-3 rounded-full bg-white/80 px-4 py-3 shadow-[var(--shadow-sm)]">
            <Checkbox
              checked={value.isRainbow}
              onCheckedChange={(checked) => updatePartial({ isRainbow: Boolean(checked) })}
            />
            <span className="text-sm font-medium">Ушёл на радугу</span>
          </label>
        </div>
      </section>

      <section className="grid gap-4">
        <div>
          <h3 className="text-base font-semibold">Родословная</h3>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Введите предков построчно. Для заметки используйте формат <code>Имя | комментарий</code>.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {pedigreeLabels.map((label) => (
            <div key={label} className="grid gap-2">
              <Label htmlFor={label}>{label}</Label>
              <Textarea
                id={label}
                value={generationToText(pedigreeGenerations, label)}
                onChange={(event) => updatePedigree(label, event.target.value)}
                placeholder={`Каждый предок с новой строки${label === "Родители" ? "\nСеверный Арктур | Интерчемпион" : ""}`}
                className="min-h-36"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <UploadDropzone
          title="Тест на дисплазию"
          description="Добавьте файл обследования или укажите ссылку на электронную копию документа."
          actionLabel="Прикрепить документ"
          icon="file"
        />

        <div className="grid gap-4 rounded-[28px] border border-white/40 bg-white/60 p-5">
          <div className="grid gap-2">
            <Label htmlFor="documentName">Название документа</Label>
            <Input
              id="documentName"
              value={docName}
              onChange={(event) =>
                updatePartial({
                  dysplasiaTest:
                    event.target.value || docUrl
                      ? {
                          name: event.target.value || "Результат обследования",
                          url: docUrl,
                          mimeType: "application/pdf",
                          description: value.dysplasiaTest?.description,
                        }
                      : null,
                })
              }
              placeholder="Например, Результат HD-A"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="documentUrl">Ссылка на документ</Label>
            <Input
              id="documentUrl"
              value={docUrl}
              onChange={(event) =>
                updatePartial({
                  dysplasiaTest:
                    docName || event.target.value
                      ? {
                          name: docName || "Результат обследования",
                          url: event.target.value,
                          mimeType: "application/pdf",
                          description: value.dysplasiaTest?.description,
                        }
                      : null,
                })
              }
              placeholder="https://..."
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <UploadDropzone
          title="Фотографии"
          description="Загрузите фотографии или укажите ссылки на изображения для отображения в галерее."
          actionLabel="Загрузить изображения"
          icon="image"
        />

        <div className="grid gap-2 rounded-[28px] border border-white/40 bg-white/60 p-5">
          <Label htmlFor="galleryUrls">Ссылки на изображения</Label>
          <Textarea
            id="galleryUrls"
            value={galleryValue}
            onChange={(event) =>
              updatePartial({
                gallery: buildGalleryFromText(
                  event.target.value,
                  value.petName || value.breed || value.role,
                ),
              })
            }
            placeholder="Одна ссылка на строку"
            className="min-h-40"
          />
          <p className="text-xs leading-5 text-[var(--text-secondary)]">
            Для автоматического показа подходят защищённые ссылки с `images.unsplash.com` и
            `plus.unsplash.com`.
          </p>
        </div>
      </section>

      <section className="grid gap-3 rounded-[28px] border border-white/40 bg-white/60 p-5">
        <div>
          <h3 className="text-base font-semibold">Видео</h3>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Поддерживаются только ссылки из VK Видео и RuTube.
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="videoUrl">Ссылка на видео</Label>
          <Input
            id="videoUrl"
            value={value.videoUrl}
            onChange={(event) => updatePartial({ videoUrl: event.target.value })}
            placeholder="https://rutube.ru/video/... или https://vk.com/video_ext.php?..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          {videoStatus.ok ? (
            <>
              <Badge variant="success" className="gap-2">
                <CheckCircle2 className="size-3.5" />
                {videoStatus.label} распознан
              </Badge>
              <span className="text-[var(--text-secondary)]">Видео готово к показу в карточке.</span>
            </>
          ) : (
            <>
              <Badge variant="warning" className="gap-2">
                <AlertCircle className="size-3.5" />
                Нужна корректная ссылка
              </Badge>
              <span className="text-[var(--text-secondary)]">{videoStatus.reason}</span>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
