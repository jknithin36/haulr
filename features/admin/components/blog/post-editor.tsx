"use client";

import {
  ArrowLeft01Icon,
  Calendar03Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Panel, StatusBadge } from "@/components/ui/data-display";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ImageField } from "@/features/admin/components/blog/image-field";
import { MarkdownPreview } from "@/features/admin/components/blog/markdown";
import { MarkdownEditor } from "@/features/admin/components/blog/markdown-editor";
import { SearchPreview } from "@/features/admin/components/blog/search-preview";
import { TagInput } from "@/features/admin/components/blog/tag-input";
import { adminUser } from "@/lib/demo-data/admin/admin-user";
import {
  type AdminPost,
  type AdminPostStatus,
  postCategories,
  slugify,
  statusTone,
} from "@/lib/demo-data/admin/blog";
import { formatShortDay } from "@/lib/format";
import { cn } from "@/lib/utils";

type PublishMode = "now" | "schedule" | "draft";

const categoryItems = postCategories.map((c) => ({ value: c, label: c }));
const scheduleTimes = ["6:00 AM", "9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM"];
const timeItems = scheduleTimes.map((t) => ({ value: t, label: t }));
const dayLabel = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
});
const fieldInput = "h-9 bg-background dark:bg-background";
const META_TITLE_MAX = 60;
const META_DESCRIPTION_MAX = 155;

function parseDay(iso?: string) {
  if (!iso) return undefined;
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function Counter({ value, max }: { value: string; max: number }) {
  const over = value.length > max;
  return (
    <span
      className={cn(
        "text-xs font-normal tabular-nums",
        over ? "text-destructive" : "text-muted-foreground",
      )}
    >
      {value.length}/{max}
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="font-medium text-base">{children}</h2>;
}

/** Mounted only while the popover is open, so "today" is read in the browser. */
function ScheduleCalendar({
  selected,
  onSelect,
}: {
  selected?: Date;
  onSelect: (date?: Date) => void;
}) {
  const [today] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  });
  return (
    <Calendar
      mode="single"
      selected={selected}
      onSelect={onSelect}
      disabled={{ before: today }}
      defaultMonth={selected ?? today}
    />
  );
}

export function PostEditor({ post }: { post?: AdminPost }) {
  const id = useId();
  const isNew = !post;

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.id ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(post));
  const [category, setCategory] = useState<string | null>(
    post?.category ?? null,
  );
  const [tags, setTags] = useState<string[]>(post?.tags ?? []);
  const [cover, setCover] = useState<string | null>(null);
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [body, setBody] = useState(post?.body ?? "");
  const [metaTitle, setMetaTitle] = useState(post?.title ?? "");
  const [metaDescription, setMetaDescription] = useState(post?.excerpt ?? "");
  const [socialImage, setSocialImage] = useState<string | null>(null);

  const [status, setStatus] = useState<AdminPostStatus>(
    post?.status ?? "Draft",
  );
  const [mode, setMode] = useState<PublishMode>(
    post?.status === "Scheduled" ? "schedule" : "now",
  );
  const [scheduleDate, setScheduleDate] = useState(() =>
    parseDay(post?.scheduledFor),
  );
  const [scheduleTime, setScheduleTime] = useState("9:00 AM");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const snapshot = JSON.stringify([
    title,
    slug,
    category,
    tags,
    cover,
    excerpt,
    body,
    metaTitle,
    metaDescription,
    socialImage,
  ]);
  const [savedSnapshot, setSavedSnapshot] = useState(isNew ? "" : snapshot);
  const [feedback, setFeedback] = useState<string | null>(null);
  const dirty = snapshot !== savedSnapshot;

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 2500);
    return () => clearTimeout(timer);
  }, [feedback]);

  const canSave = title.trim() !== "";
  const canPublish =
    canSave && body.trim() !== "" && (mode !== "schedule" || !!scheduleDate);

  function changeTitle(next: string) {
    setTitle(next);
    if (!slugEdited) setSlug(slugify(next));
    // Keep the meta title in step until someone writes a custom one.
    if (metaTitle === title) setMetaTitle(next);
  }

  function commit(nextStatus: AdminPostStatus, message: string) {
    setStatus(nextStatus);
    setSavedSnapshot(snapshot);
    setFeedback(message);
  }

  function saveDraft() {
    commit(status === "Published" ? "Published" : "Draft", "Saved");
  }

  function publish() {
    if (mode === "draft") return saveDraft();
    if (mode === "schedule" && scheduleDate) {
      return commit(
        "Scheduled",
        `Scheduled for ${formatShortDay(scheduleDate)}, ${scheduleTime}`,
      );
    }
    commit("Published", status === "Published" ? "Updated" : "Published");
  }

  const primaryLabel =
    mode === "draft"
      ? "Save draft"
      : mode === "schedule"
        ? "Schedule"
        : status === "Published"
          ? "Update"
          : "Publish";

  return (
    <div className="flex flex-col">
      <Link
        href="/admin/blog"
        className="mb-4 inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <HugeiconsIcon
          icon={ArrowLeft01Icon}
          strokeWidth={2}
          className="size-4"
        />
        Blog
      </Link>

      <div className="flex flex-col gap-1.5 pb-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl">
            {isNew ? "New post" : "Edit post"}
          </h1>
          {!isNew || savedSnapshot ? (
            <StatusBadge tone={statusTone[status]}>{status}</StatusBadge>
          ) : null}
        </div>
        <p className="text-pretty text-muted-foreground">
          {post
            ? `By ${post.author}${post.date ? ` · ${post.status === "Scheduled" ? "Scheduled for" : "Published"} ${post.date}` : ""}`
            : `Writing as ${adminUser.name}. Nothing goes live until you publish.`}
        </p>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex min-w-0 flex-col gap-8">
          <Panel>
            <FieldGroup className="gap-5">
              <Field>
                <FieldLabel htmlFor={`${id}-title`}>Title</FieldLabel>
                <Input
                  id={`${id}-title`}
                  value={title}
                  onChange={(e) => changeTitle(e.target.value)}
                  placeholder="How to ship a car in winter"
                  className="h-11 bg-background text-lg font-medium md:text-lg dark:bg-background"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor={`${id}-slug`}>Slug</FieldLabel>
                <InputGroup className={fieldInput}>
                  <InputGroupAddon>
                    <InputGroupText>haulr.com/blog/</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    id={`${id}-slug`}
                    value={slug}
                    onChange={(e) => {
                      setSlug(slugify(e.target.value) || e.target.value);
                      setSlugEdited(true);
                    }}
                    onBlur={() => setSlug((s) => slugify(s))}
                    className="pl-0.5"
                  />
                </InputGroup>
              </Field>
              <Field>
                <FieldLabel
                  htmlFor={`${id}-excerpt`}
                  className="w-full justify-between"
                >
                  Excerpt
                  <Counter value={excerpt} max={200} />
                </FieldLabel>
                <Textarea
                  id={`${id}-excerpt`}
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="One or two sentences shown on the blog and in link previews."
                  className="bg-background dark:bg-background"
                />
              </Field>
            </FieldGroup>
          </Panel>

          <section className="flex flex-col gap-4">
            <SectionTitle>Content</SectionTitle>
            <Panel className="p-3 md:p-4">
              <MarkdownEditor
                id={`${id}-body`}
                value={body}
                onChange={setBody}
              />
            </Panel>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <SectionTitle>Search and social</SectionTitle>
              <p className="text-sm text-muted-foreground">
                How the post appears in Google and when it’s shared.
              </p>
            </div>
            <Panel>
              <FieldGroup className="gap-5">
                <Field>
                  <FieldLabel
                    htmlFor={`${id}-meta-title`}
                    className="w-full justify-between"
                  >
                    Meta title
                    <Counter value={metaTitle} max={META_TITLE_MAX} />
                  </FieldLabel>
                  <Input
                    id={`${id}-meta-title`}
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className={fieldInput}
                  />
                </Field>
                <Field>
                  <FieldLabel
                    htmlFor={`${id}-meta-description`}
                    className="w-full justify-between"
                  >
                    Meta description
                    <Counter
                      value={metaDescription}
                      max={META_DESCRIPTION_MAX}
                    />
                  </FieldLabel>
                  <Textarea
                    id={`${id}-meta-description`}
                    rows={3}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    className="bg-background dark:bg-background"
                  />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field>
                    <FieldTitle>Social image</FieldTitle>
                    <ImageField
                      id={`${id}-social`}
                      src={socialImage}
                      onChange={setSocialImage}
                      fallback={cover}
                      label="Add social image"
                      hint={socialImage ? undefined : "Uses the cover if empty"}
                      aspect="aspect-[1200/630]"
                    />
                  </Field>
                  <Field>
                    <FieldTitle>Search result</FieldTitle>
                    <SearchPreview
                      title={metaTitle || title}
                      description={metaDescription}
                      slug={slug}
                    />
                  </Field>
                </div>
              </FieldGroup>
            </Panel>
          </section>
        </div>

        <aside className="flex flex-col gap-8 lg:sticky lg:top-20">
          <section className="flex flex-col gap-4">
            <SectionTitle>Publish</SectionTitle>
            <Panel className="flex flex-col gap-4 p-5 md:p-5">
              <RadioGroup
                aria-label="When to publish"
                value={mode}
                onValueChange={(v) => setMode(v as PublishMode)}
                className="gap-3"
              >
                {(
                  [
                    [
                      "now",
                      status === "Published" ? "Keep published" : "Publish now",
                    ],
                    ["schedule", "Schedule"],
                    ["draft", "Save as draft"],
                  ] as const
                ).map(([value, label]) => (
                  <Field key={value} orientation="horizontal">
                    <RadioGroupItem value={value} id={`${id}-mode-${value}`} />
                    <FieldLabel
                      htmlFor={`${id}-mode-${value}`}
                      className="font-normal"
                    >
                      {label}
                    </FieldLabel>
                  </Field>
                ))}
              </RadioGroup>
              {mode === "schedule" && (
                <div className="flex gap-2">
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger
                      render={
                        <Button
                          variant="outline"
                          className={cn(
                            "h-9 flex-1 justify-start bg-background font-normal",
                            !scheduleDate && "text-muted-foreground",
                          )}
                        />
                      }
                    >
                      <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} />
                      {scheduleDate
                        ? dayLabel.format(scheduleDate)
                        : "Pick a date"}
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <ScheduleCalendar
                        selected={scheduleDate}
                        onSelect={(date) => {
                          setScheduleDate(date);
                          if (date) setCalendarOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <Select
                    items={timeItems}
                    value={scheduleTime}
                    onValueChange={(v) => v && setScheduleTime(v as string)}
                  >
                    <SelectTrigger
                      aria-label="Time"
                      className="w-28 bg-background data-[size=default]:h-9 dark:bg-background"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeItems.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </Panel>
          </section>

          <section className="flex flex-col gap-4">
            <SectionTitle>Details</SectionTitle>
            <Panel className="p-5 md:p-5">
              <FieldGroup className="gap-5">
                <Field>
                  <FieldLabel htmlFor={`${id}-category`}>Category</FieldLabel>
                  <Select
                    items={categoryItems}
                    value={category}
                    onValueChange={(v) => setCategory(v as string | null)}
                  >
                    <SelectTrigger
                      id={`${id}-category`}
                      className="w-full bg-background data-[size=default]:h-9 dark:bg-background"
                    >
                      <SelectValue placeholder="Choose a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryItems.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor={`${id}-tags`}>Tags</FieldLabel>
                  <TagInput id={`${id}-tags`} value={tags} onChange={setTags} />
                </Field>
                <Field>
                  <FieldTitle>Cover image</FieldTitle>
                  <ImageField
                    id={`${id}-cover`}
                    src={cover}
                    onChange={setCover}
                    label="Add cover image"
                    hint={cover ? undefined : "16:9, at least 1600px wide"}
                  />
                </Field>
              </FieldGroup>
            </Panel>
          </section>
        </aside>
      </div>

      <div className="sticky bottom-0 z-10 -mx-4 mt-10 -mb-16 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 bg-background/90 px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
        <output className="flex items-center gap-1.5 text-sm text-muted-foreground">
          {feedback ? (
            <>
              <HugeiconsIcon
                icon={Tick02Icon}
                strokeWidth={2}
                className="size-4 text-emerald-600 dark:text-emerald-400"
              />
              {feedback}
            </>
          ) : dirty ? (
            "Unsaved changes"
          ) : (
            "All changes saved"
          )}
        </output>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => setPreviewOpen(true)}>
            Preview
          </Button>
          {mode !== "draft" && status !== "Published" && (
            <Button variant="outline" disabled={!canSave} onClick={saveDraft}>
              Save draft
            </Button>
          )}
          <Button
            disabled={mode === "draft" ? !canSave : !canPublish}
            onClick={publish}
          >
            {primaryLabel}
          </Button>
        </div>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader className="sr-only">
            <DialogTitle>Post preview</DialogTitle>
            <DialogDescription>
              How the post will look on the blog.
            </DialogDescription>
          </DialogHeader>
          <article className="flex flex-col gap-6 p-2 md:p-6">
            <div className="flex flex-col gap-3">
              {category && (
                <p className="text-sm font-medium text-muted-foreground">
                  {category}
                </p>
              )}
              <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
                {title || "Untitled post"}
              </h1>
              {excerpt && (
                <p className="text-pretty text-lg text-muted-foreground">
                  {excerpt}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                {post?.author ?? adminUser.name}
              </p>
            </div>
            {cover && (
              // biome-ignore lint/performance/noImgElement: local preview of a chosen file (blob URL).
              <img
                src={cover}
                alt=""
                className="aspect-[16/9] w-full rounded-2xl object-cover"
              />
            )}
            <MarkdownPreview source={body} />
          </article>
        </DialogContent>
      </Dialog>
    </div>
  );
}
