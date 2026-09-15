"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  FolderKanbanIcon,
  PencilIcon,
  PlusIcon,
  StarIcon,
  TrashIcon,
} from "lucide-react";
import { deleteProject, reorderProjects, setProjectFeatured } from "@/lib/profile/portfolio-actions";
import { storagePublicUrl } from "@/lib/storage";
import type { OwnProject } from "@/lib/db/portfolio";
import type { ServiceRow, SoftwareRow } from "@/lib/db/profiles";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProjectForm } from "@/components/profile/project-form";

export function PortfolioManager({
  projects,
  services,
  software,
}: {
  projects: OwnProject[];
  services: ServiceRow[];
  software: SoftwareRow[];
}) {
  const t = useTranslations("portfolio");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<OwnProject | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  function refresh() {
    router.refresh();
  }

  function openAdd() {
    setEditing(null);
    setOpen(true);
  }

  function openEdit(p: OwnProject) {
    setEditing(p);
    setOpen(true);
  }

  function run(id: string, fn: () => Promise<{ ok: boolean; error?: string }>) {
    setBusyId(id);
    setError(null);
    fn().then((result) => {
      setBusyId(null);
      if (!result.ok) setError(result.error ?? "updateFailed");
      else refresh();
    });
  }

  function handleDelete(id: string) {
    run(id, () => deleteProject(id));
  }

  function handleFeature(p: OwnProject) {
    run(p.id, () => setProjectFeatured(p.id, !p.is_featured));
  }

  function move(id: string, dir: -1 | 1) {
    const index = projects.findIndex((p) => p.id === id);
    const target = index + dir;
    if (index < 0 || target < 0 || target >= projects.length) return;
    const next = [...projects];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    run(id, () => reorderProjects(next.map((p) => p.id)));
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button onClick={openAdd} />}>
            <PlusIcon className="size-4" aria-hidden />
            {t("addProject")}
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>{t(editing ? "editProject" : "addProject")}</DialogTitle>
              <DialogDescription>{t("projectHint")}</DialogDescription>
            </DialogHeader>
            <ProjectForm
              project={editing ?? undefined}
              services={services}
              software={software}
              onDone={() => {
                setOpen(false);
                setEditing(null);
                refresh();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{t(`errors.${error}`)}</AlertDescription>
        </Alert>
      )}

      {projects.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed p-10 text-center">
          <FolderKanbanIcon className="size-10 text-muted-foreground" aria-hidden />
          <p className="text-sm text-muted-foreground">{t("empty")}</p>
          <Button variant="outline" size="sm" onClick={openAdd}>
            <PlusIcon className="size-4" aria-hidden />
            {t("addProject")}
          </Button>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {projects.map((p, i) => {
            const thumbnail = storagePublicUrl("portfolio", p.thumbnail_path);
            return (
              <li
                key={p.id}
                className="flex flex-col gap-3 rounded-xl border p-3 sm:flex-row sm:items-center"
              >
                <div className="flex h-20 w-full shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted sm:w-32">
                  {thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumbnail} alt="" className="size-full object-cover" />
                  ) : (
                    <FolderKanbanIcon className="size-6 text-muted-foreground" aria-hidden />
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate text-sm font-semibold">{p.title}</span>
                    {p.is_featured && (
                      <Badge variant="secondary" className="gap-1">
                        <StarIcon className="size-3" aria-hidden />
                        {t("featured")}
                      </Badge>
                    )}
                    {p.status !== "published" && (
                      <Badge variant="outline">{t(`status.${p.status}`)}</Badge>
                    )}
                  </div>
                  {(p.category || p.client) && (
                    <p className="truncate text-xs text-muted-foreground">
                      {[p.category ? t(`categories.${p.category}`) : null, p.client]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={t("moveUp")}
                    disabled={i === 0 || busyId === p.id}
                    onClick={() => move(p.id, -1)}
                  >
                    <ArrowUpIcon className="size-4" aria-hidden />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={t("moveDown")}
                    disabled={i === projects.length - 1 || busyId === p.id}
                    onClick={() => move(p.id, 1)}
                  >
                    <ArrowDownIcon className="size-4" aria-hidden />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={p.is_featured ? t("unfeature") : t("feature")}
                    disabled={busyId === p.id}
                    onClick={() => handleFeature(p)}
                    className={p.is_featured ? "text-amber-500" : undefined}
                  >
                    <StarIcon
                      className="size-4"
                      aria-hidden
                      fill={p.is_featured ? "currentColor" : "none"}
                    />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={t("editProject")}
                    onClick={() => openEdit(p)}
                  >
                    <PencilIcon className="size-4" aria-hidden />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={t("deleteProject")}
                    disabled={busyId === p.id}
                    onClick={() => handleDelete(p.id)}
                  >
                    <TrashIcon className="size-4" aria-hidden />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
