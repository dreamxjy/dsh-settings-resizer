import z from "@deepseek-ai/schemastery";

/**
 * Host half of the settings resizer bundle.
 *
 * Declaring a `Config` of volatile fields exposes a `settings-resizer`
 * namespace through the Host settings service. The Client reads and writes it
 * with `configForms.get('settings-resizer')`, which persists each change into
 * the current profile's cordis.patch.yml. Unlike browser localStorage, that
 * survives restarts and the changing localhost port of the Web GUI.
 *
 * The namespace id is the cordis.patch.yml row id (`settings-resizer`), so the
 * Client and this schema must agree on the five field names below.
 */
export const Config = z.object({
  width: z.number().default(1100).volatile(),
  height: z.number().default(820).volatile(),
  resize: z.boolean().default(true).volatile(),
  rememberDrag: z.boolean().default(true).volatile(),
  preset: z.string().default('large').volatile()
});

export function apply(ctx) {
  ctx.inject(["settings"], (child) => {
    child.effect(() => child.settings.configure({ auto: false }, ctx.fiber));
  });
}
