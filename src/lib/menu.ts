import { cacheLife, cacheTag } from "next/cache";
import {
  menuCategories,
  menuItems,
  menuSettings,
  type MenuCategory,
  type MenuItem,
  type MenuSettings,
} from "@/data/menu";

/**
 * Menu data access layer.
 *
 * Components only ever talk to `getMenu()`. Today it reads the local
 * `data/menu.ts`; tomorrow it can fetch from a headless CMS, e.g.
 *
 *   const res = await fetch(`${CMS_URL}/menu`, { headers: { Authorization } });
 *
 * The result is cached and tagged "menu" so a CMS webhook can call
 * `revalidateTag("menu")` whenever an editor changes a price, marks a
 * dish "Hết hôm nay" or switches the season off.
 */

export interface MenuCategoryWithItems extends MenuCategory {
  items: MenuItem[];
}

export interface PublicMenu {
  settings: MenuSettings;
  categories: MenuCategoryWithItems[];
}

/** Rules applied to raw CMS entries before they reach the UI. */
export function isPubliclyVisible(item: MenuItem, settings: MenuSettings): boolean {
  if (!item.available) return false;
  if (item.seasonal && !settings.seasonalEnabled) return false;
  return true;
}

export async function getMenu(): Promise<PublicMenu> {
  "use cache";
  cacheTag("menu");
  cacheLife("hours");

  const categories = menuCategories
    .filter((c) => c.visible)
    .sort((a, b) => a.order - b.order)
    .map((category) => ({
      ...category,
      items: menuItems
        .filter((i) => i.category === category.id && isPubliclyVisible(i, menuSettings))
        .sort((a, b) => a.order - b.order),
    }))
    .filter((c) => c.items.length > 0);

  return { settings: menuSettings, categories };
}

export { formatMenuPrice } from "./format";
