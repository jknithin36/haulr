"use client";

import {
  Copy01Icon,
  Delete02Icon,
  Edit02Icon,
  MoreHorizontalIcon,
  News01Icon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { EmptyState, StatusBadge } from "@/components/ui/data-display";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  recordTable,
  tabScroller,
} from "@/features/admin/components/table-styles";
import {
  type AdminPost,
  type AdminPostStatus,
  adminPosts,
  postCounts,
  statusTone,
} from "@/lib/demo-data/admin/blog";
import { formatNumber } from "@/lib/format";

type Filter = "all" | AdminPostStatus;

const tabs: { value: Filter; label: string; count?: number }[] = [
  { value: "all", label: "All posts" },
  { value: "Published", label: "Published", count: postCounts.Published },
  { value: "Draft", label: "Drafts", count: postCounts.Draft },
  { value: "Scheduled", label: "Scheduled", count: postCounts.Scheduled },
];

function editHref(post: AdminPost) {
  return `/admin/blog/${post.id}`;
}

function PostMenu({
  post,
  onDuplicate,
  onDelete,
}: {
  post: AdminPost;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Actions for ${post.title}`}
            className="data-popup-open:bg-muted"
          />
        }
      >
        <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem render={<Link href={editHref(post)} />}>
          <HugeiconsIcon icon={Edit02Icon} strokeWidth={2} />
          Edit
        </DropdownMenuItem>
        {post.status === "Published" && (
          <DropdownMenuItem render={<Link href="/blog" />}>
            <HugeiconsIcon icon={ViewIcon} strokeWidth={2} />
            View
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={onDuplicate}>
          <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={onDelete}>
          <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function duplicateId(post: AdminPost, existing: AdminPost[]) {
  const base = `${post.id.replace(/-copy(-\d+)?$/, "")}-copy`;
  let id = base;
  for (let n = 2; existing.some((p) => p.id === id); n++) id = `${base}-${n}`;
  return id;
}

export function BlogView() {
  const [posts, setPosts] = useState(adminPosts);
  const [filter, setFilter] = useState<Filter>("all");
  const [deleting, setDeleting] = useState<AdminPost | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const visible =
    filter === "all" ? posts : posts.filter((p) => p.status === filter);

  function duplicate(post: AdminPost) {
    setPosts((prev) => {
      const copy: AdminPost = {
        ...post,
        id: duplicateId(post, prev),
        title: `Copy of ${post.title}`,
        status: "Draft",
        views: null,
        date: null,
        scheduledFor: undefined,
      };
      const index = prev.findIndex((p) => p.id === post.id);
      return [...prev.slice(0, index + 1), copy, ...prev.slice(index + 1)];
    });
  }

  function menu(post: AdminPost) {
    return (
      <PostMenu
        post={post}
        onDuplicate={() => duplicate(post)}
        onDelete={() => {
          setDeleting(post);
          setConfirmOpen(true);
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className={tabScroller}>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <TabsList
            aria-label="Filter posts"
            className="group-data-horizontal/tabs:h-9"
          >
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="px-3">
                {tab.label}
                {tab.count !== undefined && (
                  <span className="text-muted-foreground tabular-nums">
                    {tab.count}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={News01Icon}
          title="No posts here"
          description="Posts you add will show up in this list."
        />
      ) : (
        <>
          <div className={recordTable.panel}>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className={recordTable.head}>Title</TableHead>
                  <TableHead className={recordTable.head}>Category</TableHead>
                  <TableHead className={recordTable.head}>Author</TableHead>
                  <TableHead className={recordTable.head}>Status</TableHead>
                  <TableHead className={`${recordTable.head} text-right`}>
                    Views
                  </TableHead>
                  <TableHead className={recordTable.head}>Date</TableHead>
                  <TableHead className={`${recordTable.head} w-12`}>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((post) => (
                  <TableRow key={post.id} className={recordTable.row}>
                    <TableCell
                      className={`${recordTable.cell} max-w-80 whitespace-normal`}
                    >
                      <Link
                        href={editHref(post)}
                        className="font-medium text-pretty hover:underline hover:underline-offset-4"
                      >
                        {post.title}
                      </Link>
                    </TableCell>
                    <TableCell
                      className={`${recordTable.cell} text-muted-foreground`}
                    >
                      {post.category}
                    </TableCell>
                    <TableCell className={recordTable.cell}>
                      {post.author}
                    </TableCell>
                    <TableCell className={recordTable.cell}>
                      <StatusBadge tone={statusTone[post.status]}>
                        {post.status}
                      </StatusBadge>
                    </TableCell>
                    <TableCell
                      className={`${recordTable.cell} text-right tabular-nums`}
                    >
                      {post.views === null ? (
                        <span className="text-muted-foreground">—</span>
                      ) : (
                        formatNumber(post.views)
                      )}
                    </TableCell>
                    <TableCell
                      className={`${recordTable.cell} text-muted-foreground tabular-nums`}
                    >
                      {post.date ?? "—"}
                    </TableCell>
                    <TableCell className="px-2 py-2 text-right">
                      {menu(post)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <ul className="flex flex-col gap-2 md:hidden">
            {visible.map((post) => (
              <li
                key={post.id}
                className="flex flex-col gap-3 rounded-2xl bg-muted/50 p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={editHref(post)}
                    className="pt-1 font-medium text-pretty"
                  >
                    {post.title}
                  </Link>
                  <div className="-mr-1.5 -mt-0.5 shrink-0">{menu(post)}</div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {post.category} · {post.author}
                </p>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <StatusBadge tone={statusTone[post.status]}>
                    {post.status}
                  </StatusBadge>
                  <span className="text-muted-foreground tabular-nums">
                    {[
                      post.views !== null &&
                        `${formatNumber(post.views)} views`,
                      post.date,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              “{deleting?.title}” will be removed
              {deleting?.status === "Published" ? " from the blog" : ""}. This
              can’t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogCancel
              variant="destructive"
              onClick={() => {
                const target = deleting;
                if (target)
                  setPosts((prev) => prev.filter((p) => p.id !== target.id));
              }}
            >
              Delete post
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
