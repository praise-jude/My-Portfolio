type Describable = {
  action: string;
  target_type: string | null;
  target_id: string | null;
  details: Record<string, unknown>;
};

export const ACTION_LABELS: Record<string, string> = {
  login: "Signed in",
  logout: "Signed out",
  login_failed: "Failed sign-in attempt",
  login_rate_limited: "Sign-in blocked by rate limit",
  project_create: "Created project",
  project_update: "Updated project",
  project_publish: "Published project",
  project_unpublish: "Unpublished project",
  project_archive: "Archived project",
  project_restore: "Restored project",
  project_delete: "Permanently deleted project",
  content_update: "Updated content",
  content_reset: "Reset content to default",
  message_read: "Marked message read",
  message_unread: "Marked message unread",
  message_archive: "Archived message",
  message_restore: "Restored message",
  analytics_export: "Exported analytics CSV",
};

export function describeAction(row: Describable) {
  const label = ACTION_LABELS[row.action] ?? row.action;
  const name = typeof row.details?.name === "string" ? row.details.name : null;
  const section = typeof row.details?.section === "string" ? row.details.section : null;
  const target = name ?? section ?? (row.target_type === "message" ? null : row.target_id);
  return target ? `${label}: ${target}` : label;
}
