import type { AdminRoleName } from "./session";

export type Permission =
  | "dashboard:view"
  | "enquiries:view"
  | "enquiries:manage"
  | "content:manage"
  | "media:manage"
  | "settings:manage"
  | "admins:manage";

const matrix: Record<AdminRoleName, Permission[]> = {
  SUPER_ADMIN: ["dashboard:view", "enquiries:view", "enquiries:manage", "content:manage", "media:manage", "settings:manage", "admins:manage"],
  EDITOR: ["dashboard:view", "enquiries:view", "enquiries:manage", "content:manage", "media:manage"],
  VIEWER: ["dashboard:view", "enquiries:view"],
};

export function can(role: AdminRoleName | undefined | null, permission: Permission) {
  return !!role && matrix[role]?.includes(permission);
}

export const roleLabels: Record<AdminRoleName, string> = {
  SUPER_ADMIN: "Super Admin",
  EDITOR: "Editor",
  VIEWER: "Viewer",
};
