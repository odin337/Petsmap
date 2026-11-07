import { Network } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PedigreeTreeData } from "@/types/pin";

interface PedigreeTreeProps {
  pedigree: PedigreeTreeData | null;
}

function canRenderVisualTree(pedigree: PedigreeTreeData | null) {
  return Boolean(
    pedigree &&
      pedigree.generations.length >= 2 &&
      pedigree.generations.every((generation) => generation.entries.length > 0),
  );
}

export function PedigreeTree({ pedigree }: PedigreeTreeProps) {
  const useVisualTree = canRenderVisualTree(pedigree);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Родословная</CardTitle>
        <CardDescription>Родословная отображается по поколениям в удобном для чтения виде.</CardDescription>
      </CardHeader>
      <CardContent>
        {pedigree ? (
          useVisualTree ? (
            <div
              className="grid gap-4 overflow-x-auto pb-2"
              style={{
                gridTemplateColumns: `repeat(${pedigree.generations.length}, minmax(220px, 1fr))`,
              }}
            >
              {pedigree.generations.map((generation, generationIndex) => (
                <section
                  key={generation.label}
                  className={cn(
                    "relative flex min-w-[220px] flex-col gap-3",
                    generationIndex > 0 &&
                      "before:absolute before:-left-2 before:top-14 before:h-px before:w-4 before:bg-[var(--border)]",
                  )}
                >
                  <div className="rounded-full bg-[var(--accent-subtle)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--accent)]">
                    {generation.label}
                  </div>

                  {generation.entries.map((entry) => (
                    <article
                      key={entry.id}
                      className="relative rounded-[24px] border border-white/40 bg-white/85 p-4 shadow-[var(--shadow-sm)] before:absolute before:-left-4 before:top-1/2 before:size-2 before:-translate-y-1/2 before:rounded-full before:bg-[var(--accent)] before:content-['']"
                    >
                      <p className="font-medium text-[var(--text-primary)]">{entry.name}</p>
                      {entry.note ? (
                        <p className="mt-1 text-sm text-[var(--text-secondary)]">{entry.note}</p>
                      ) : null}
                    </article>
                  ))}
                </section>
              ))}
            </div>
          ) : (
            <div className="rounded-[24px] border border-dashed border-[var(--border)] bg-white/50 p-5">
              {pedigree.generations.map((generation) => (
                <div key={generation.label} className="mb-5 last:mb-0">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--accent)]">
                    {generation.label}
                  </h3>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[var(--text-secondary)]">
                    {generation.entries.map((entry) => (
                      <li key={entry.id}>
                        <span className="font-medium text-[var(--text-primary)]">{entry.name}</span>
                        {entry.note ? `, ${entry.note}` : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="flex min-h-40 flex-col items-center justify-center rounded-[24px] border border-dashed border-[var(--border)] bg-white/50 text-center">
            <Network className="size-6 text-[var(--text-secondary)]" />
            <p className="mt-3 text-sm text-[var(--text-secondary)]">
              Данные по родословной не указаны.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
