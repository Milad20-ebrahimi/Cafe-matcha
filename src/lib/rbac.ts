export const PERMISSIONS = {
  PRODUCTS_MANAGE: "products.manage",
  ORDERS_MANAGE: "orders.manage",
  USERS_MANAGE: "users.manage",
  COUPONS_MANAGE: "coupons.manage",
  BLOG_MANAGE: "blog.manage",
  SETTINGS_MANAGE: "settings.manage",
  REPORTS_VIEW: "reports.view",
  AUDIT_VIEW: "audit.view",
  DASHBOARD_VIEW: "dashboard.view",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ALL_PERMISSIONS: Permission[] = Object.values(PERMISSIONS);

export type RoleDefinition = {
  key: string;
  name: string;
  description: string;
  permissions: Permission[];
};

export const ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    key: "super_admin",
    name: "مدیر کل",
    description: "دسترسی کامل به تمام بخش‌های پنل مدیریت",
    permissions: ALL_PERMISSIONS,
  },
  {
    key: "content_manager",
    name: "مدیر محتوا",
    description: "مدیریت محصولات، منو، دسته‌بندی‌ها و بلاگ",
    permissions: [
      PERMISSIONS.PRODUCTS_MANAGE,
      PERMISSIONS.BLOG_MANAGE,
      PERMISSIONS.DASHBOARD_VIEW,
    ],
  },
  {
    key: "order_manager",
    name: "مدیر سفارش",
    description: "مدیریت سفارش‌ها، پرداخت‌ها و کدهای تخفیف",
    permissions: [
      PERMISSIONS.ORDERS_MANAGE,
      PERMISSIONS.COUPONS_MANAGE,
      PERMISSIONS.REPORTS_VIEW,
      PERMISSIONS.DASHBOARD_VIEW,
    ],
  },
  {
    key: "staff",
    name: "کارمند",
    description: "مشاهده و پیگیری سفارش‌ها به‌صورت محدود",
    permissions: [PERMISSIONS.ORDERS_MANAGE, PERMISSIONS.DASHBOARD_VIEW],
  },
  {
    key: "customer",
    name: "مشتری",
    description: "کاربر عادی فروشگاه",
    permissions: [],
  },
];

export function roleHasPermission(permissions: string[] | undefined, perm: Permission) {
  if (!permissions) return false;
  return permissions.includes(perm);
}

export function getRoleDefinition(key: string) {
  return ROLE_DEFINITIONS.find((r) => r.key === key);
}

export const ADMIN_ROLE_KEYS = ["super_admin", "content_manager", "order_manager", "staff"];
