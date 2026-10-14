import { getMenu } from "@/lib/menu";
import { Lines, Serif } from "@/components/ui/Typography";
import { MenuExplorer } from "./MenuExplorer";

/** Server component: fetches the (CMS-ready) menu and hands it to the client explorer. */
export async function Menu() {
  const menu = await getMenu();

  return (
    <section id="thuc-don" className="section bg-ink-2" aria-labelledby="menu-title">
      <div className="shell">
        <div className="grid-12 items-end gap-y-8">
          <Lines
            id="menu-title"
            className="t-h1 col-span-12 lg:col-span-8"
            lines={["Thực đơn", "thay đổi", <>theo <Serif>mùa.</Serif></>]}
          />
          <div className="col-span-12 flex flex-col gap-3 lg:col-span-4 lg:items-end lg:pb-3 lg:text-right">
            <p className="t-meta text-accent" data-fade>
              {menu.settings.seasonLabel}
            </p>
            <p className="t-body text-mute lg:ml-auto lg:max-w-xs" data-fade>
              Một thực đơn ngắn, viết lại mỗi khi biển thay đổi.
            </p>
          </div>
        </div>

        <MenuExplorer categories={menu.categories} />

        <p className="t-meta mt-14 max-w-2xl text-mute normal-case tracking-[0.04em]" data-fade>
          {menu.settings.currencyNote}
        </p>
      </div>
    </section>
  );
}
