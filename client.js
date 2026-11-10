window.__ModuleLoader__.load({
  id: 'dsh-settings-resizer',
  factory: (require) => {
    const React = require('react');
    const h = React.createElement;

    const NS = 'settings.resizer';
    const SECTION_ID = 'settings-resizer';
    const CONFIG_NS = 'settings-resizer';
    const PANEL = 'div[data-shortcut-modal="settings"][role="dialog"]';
    const TAG_ID = 'dsh-settings-resizer/styles';

    const PRESETS = {
      compact: { width: 800, height: 600 },
      default: { width: 800, height: 800 },
      large: { width: 1100, height: 820 },
      wide: { width: 1280, height: 860 }
    };
    const PRESET_KEYS = ['compact', 'default', 'large', 'wide'];
    const DEFAULT = { width: 1100, height: 820, resize: true, rememberDrag: true, preset: 'large' };

    const en = {
      title: 'Settings window size',
      description: 'The settings panel is fixed at 800 × 800, which makes some plugin settings pages cramped. Pick a larger size here, or just drag the bottom-right corner of the settings window.',
      presets: 'Presets',
      presetCompact: 'Compact · 800 × 600',
      presetDefault: 'Original · 800 × 800',
      presetLarge: 'Roomy · 1100 × 820',
      presetWide: 'Wide · 1280 × 860',
      recommended: 'Recommended',
      width: 'Width',
      height: 'Height',
      pixels: 'px',
      apply: 'Apply',
      customHint: 'Enter a custom size, then press Apply.',
      resize: 'Allow dragging the bottom-right corner',
      resizeHint: 'When on, drag the settings window corner to resize it freely.',
      rememberDrag: 'Remember dragged size',
      rememberDragHint: 'On: each drag is saved to your profile config permanently. Off: a drag lasts only this session — a restart restores your saved size without overwriting presets.',
      current: 'Current',
      on: 'drag on',
      off: 'drag off',
      rememberOn: 'drag remembered',
      rememberOff: 'drag not remembered',
      reset: 'Restore 800 × 800',
      note: 'This plugin only changes the size of the settings window. It does not modify DeepSeek Harness itself.',
      persisted: 'Saved to profile config · survives restarts and port changes.',
      sessionOnly: 'Dragged sizes are not saved while remembering is off. Presets, Apply, and this toggle are still saved.',
      invalid: 'Enter a valid size: width 640–2400, height 400–2000.'
    };

    const zh = {
      title: '设置窗口大小',
      description: '设置窗口默认固定为 800 × 800，部分插件设置页会显得拥挤。这里可以把它调大，也可以直接拖动窗口右下角。',
      presets: '预设尺寸',
      presetCompact: '紧凑 · 800 × 600',
      presetDefault: '原始 · 800 × 800',
      presetLarge: '宽松 · 1100 × 820',
      presetWide: '超宽 · 1280 × 860',
      recommended: '推荐',
      width: '宽度',
      height: '高度',
      pixels: 'px',
      apply: '应用',
      customHint: '输入自定义尺寸后点「应用」。',
      resize: '允许拖动右下角调整大小',
      resizeHint: '开启后可直接拖动设置窗口右下角自由改变大小。',
      rememberDrag: '记住拖动后的尺寸',
      rememberDragHint: '开启：每次拖动都永久写入 profile 配置。关闭：拖动只在本次会话有效，重启 DSH 后恢复已保存的尺寸，不会覆盖预设值。',
      current: '当前',
      on: '拖动已开启',
      off: '拖动已关闭',
      rememberOn: '拖动会记住',
      rememberOff: '拖动不记住',
      reset: '恢复 800 × 800',
      note: '本插件只调整设置窗口大小，不修改 DeepSeek Harness 本体。',
      persisted: '已保存到 profile 配置 · 重启、端口变化后仍然生效。',
      sessionOnly: '当前未开启「记住」，拖动尺寸不会被保存；预设、「应用」和本开关仍会保存。',
      invalid: '请填有效数字（宽 640–2400、高 400–2000）。'
    };

    /** Injected CSS. Only the panel rule is cross-cutting; the rest is scoped to our own section. */
    const CSS = `
@media (min-width: 768px) {
  div[data-shortcut-modal="settings"][role="dialog"] {
    width: var(--dshr-width, 1100px);
    height: min(var(--dshr-height, 820px), calc(100vh - 2 * max(24px, var(--dsh-frame-overlay-top, 24px))));
    max-width: calc(100vw - 48px);
    resize: var(--dshr-resize, both);
    overflow: hidden;
  }
}
/* Local aliases point only at theme tokens verified to exist in this build.
   The bg-l1 / bg-l2 aliases are undefined here, and the brand-primary alias
   resolves to pure black/white (not a colour), so neither can be used for a
   high-contrast toggle. state-business-primary is the brand blue in both
   light (#4176e6) and dark (#7aaaff) themes. */
.dshr-root{--dshr-surface:var(--dsw-alias-bg-layer-2,#fff);--dshr-control:var(--dsw-alias-bg-base,#fff);--dshr-track-off:var(--dsw-alias-bg-overlay,#cfd3d6);--dshr-accent:var(--dsw-alias-state-business-primary,#4176e6);--dshr-knob:var(--dsw-static-neutral-00,#fff);--dshr-line:var(--dsw-alias-border-l2,rgba(0,0,0,.1));color:var(--dsw-alias-label-primary);font-size:13px;line-height:1.6;padding:4px 0}
.dshr-root *{box-sizing:border-box}
.dshr-h2{margin:0 0 6px;font-size:16px;font-weight:600;line-height:1.4;color:var(--dsw-alias-label-primary)}
.dshr-lead{margin:0 0 18px;font-size:12px;color:var(--dsw-alias-label-secondary);line-height:1.6}
.dshr-card{border:1px solid var(--dshr-line);background:var(--dshr-surface);border-radius:var(--dsw-radius-md,8px);padding:16px;margin-bottom:16px}
.dshr-label{font-size:12px;font-weight:600;color:var(--dsw-alias-label-primary);margin:0 0 10px}
.dshr-label-sm{font-size:11px;color:var(--dsw-alias-label-secondary);display:block;margin-bottom:4px}
.dshr-presets{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px}
.dshr-preset{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--dshr-line);background:var(--dshr-control);color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;border-radius:var(--dsw-radius-sm,6px);padding:7px 12px;cursor:pointer;transition:background-color .12s,border-color .12s,color .12s}
.dshr-preset:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.dshr-preset.dshr-on{border-color:var(--dshr-accent);color:var(--dshr-accent);background:var(--dshr-surface);font-weight:600}
.dshr-badge{font-size:10px;line-height:1.4;border-radius:999px;padding:1px 6px;background:var(--dsw-alias-interactive-bg-hover);color:var(--dshr-accent)}
.dshr-custom{display:flex;flex-wrap:wrap;align-items:flex-end;gap:12px}
.dshr-field{display:flex;flex-direction:column}
.dshr-input{width:96px;font:inherit;font-size:13px;color:var(--dsw-alias-label-primary);background:var(--dshr-control);border:1px solid var(--dshr-line);border-radius:var(--dsw-radius-sm,6px);padding:6px 8px;outline:none}
.dshr-input:focus{border-color:var(--dshr-accent)}
.dshr-unit{font-size:11px;color:var(--dsw-alias-label-tertiary);margin-top:3px}
.dshr-btn{font:inherit;font-size:12px;border:1px solid var(--dshr-line);background:var(--dshr-control);color:var(--dsw-alias-label-primary);border-radius:var(--dsw-radius-sm,6px);padding:7px 14px;cursor:pointer}
.dshr-btn:hover{background:var(--dsw-alias-interactive-bg-hover)}
.dshr-btn-primary{border-color:var(--dshr-accent);color:var(--dshr-accent)}
.dshr-hint{font-size:11px;color:var(--dsw-alias-label-tertiary);margin:8px 0 0;line-height:1.6}
.dshr-error{font-size:11px;color:var(--dsw-alias-state-error-primary,#ef4444);margin:8px 0 0}
.dshr-row{display:flex;align-items:flex-start;gap:12px;margin-bottom:16px}
.dshr-row-copy{flex:1;min-width:0}
.dshr-row .dshr-label{margin-bottom:2px}
.dshr-switch{flex:none;width:38px;height:22px;border-radius:999px;border:1px solid var(--dsw-alias-border-l3,rgba(0,0,0,.12));background:var(--dshr-track-off);padding:2px;cursor:pointer;display:flex;align-items:center;transition:background-color .15s,border-color .15s;margin-top:2px}
.dshr-switch:focus-visible{outline:2px solid var(--dshr-accent);outline-offset:2px}
.dshr-switch-on{background:var(--dshr-accent);border-color:var(--dshr-accent)}
.dshr-knob{width:16px;height:16px;border-radius:50%;background:var(--dshr-knob);border:1px solid var(--dsw-alias-border-l3,rgba(0,0,0,.12));box-shadow:0 1px 3px rgba(0,0,0,.35);transition:transform .15s}
.dshr-switch-on .dshr-knob{transform:translateX(16px)}
.dshr-foot{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;border-top:1px solid var(--dshr-line);padding-top:14px}
.dshr-status{font-size:12px;color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums}
.dshr-note{font-size:11px;color:var(--dsw-alias-label-tertiary);margin:16px 0 0;line-height:1.6}
`;

    /* ---------- shared, persistent config store (factory scope) ----------
       The Host declares a `Config` of volatile fields under the namespace id
       `settings-resizer`. `configForms.get(CONFIG_NS)` gives us a controller
       whose .mutate() persists into the current profile's cordis.patch.yml.
       That is independent of the browser origin, so the size survives the
       Web GUI port changing on restart. DEFAULT + the CSS var() fallbacks keep
       the window roomy even when the settings service is briefly unavailable. */
    function clamp(raw) {
      const w = Number(raw.width);
      const hh = Number(raw.height);
      return {
        width: Math.min(2400, Math.max(640, Math.round(Number.isFinite(w) && w > 0 ? w : DEFAULT.width))),
        height: Math.min(2000, Math.max(400, Math.round(Number.isFinite(hh) && hh > 0 ? hh : DEFAULT.height))),
        resize: raw.resize !== false,
        rememberDrag: raw.rememberDrag !== false,
        preset: Object.prototype.hasOwnProperty.call(PRESETS, raw.preset) ? raw.preset : 'custom'
      };
    }

    /* Two layers:
       - `saved` is exactly what lives in the profile config (survives restarts).
       - `sessionDrag` is a non-remembered drag: it changes what is on screen for
         this session only and is never written to `saved` or to the profile.
       `current` is the effective state that drives the CSS variables and the UI. */
    let saved = { ...DEFAULT };
    let current = { ...DEFAULT };
    let sessionDrag = null;   // { width, height } or null
    let form = null;          // set in apply() once configForms is resolved
    const listeners = new Set();
    const getSnapshot = () => current;
    function subscribe(fn) {
      listeners.add(fn);
      return () => { listeners.delete(fn); }; // must be a void cleanup, not Set.delete's boolean
    }
    function notify() {
      for (const fn of Array.from(listeners)) {
        try { fn(); } catch (_) { /* ignore a dead subscriber */ }
      }
    }
    function recompute() {
      current = clamp({
        ...saved,
        ...(sessionDrag ? { width: sessionDrag.width, height: sessionDrag.height, preset: 'custom' } : {})
      });
    }
    function applyVars() {
      if (typeof document === 'undefined') return;
      const root = document.documentElement;
      root.style.setProperty('--dshr-width', current.width + 'px');
      root.style.setProperty('--dshr-height', current.height + 'px');
      root.style.setProperty('--dshr-resize', current.resize ? 'both' : 'none');
    }
    /* Fold Host values into `saved` without writing back (avoids a loop).
       A non-remembered drag stays visible across unrelated Host echoes. */
    function replaceFromHost(value) {
      if (!value || typeof value !== 'object') return;
      saved = clamp({ ...DEFAULT, ...value });
      recompute();
      applyVars();
      notify();
    }
    function persistSaved() {
      if (!form) return;
      const ops = ['width', 'height', 'resize', 'rememberDrag', 'preset'].map((field) => ({
        op: 'set', path: [field], value: saved[field]
      }));
      try {
        const result = form.mutate(ops);
        if (result && typeof result.catch === 'function') result.catch(() => {});
      } catch (_) { /* Host unavailable: local value + CSS fallback still apply */ }
    }
    /* An explicit change (preset / Apply / reset / toggle) persists. A call with
       { persist: false } is a non-remembered drag: session-only, never saved. */
    function setConfig(next, opts) {
      const persist = !(opts && opts.persist === false);
      if (persist) {
        saved = clamp({ ...saved, ...next });
        // A drag that was not remembered must not leak into the profile just
        // because another setting was changed afterwards. Only an explicit
        // size change clears it, so the dragged size stays on screen otherwise.
        if (Object.prototype.hasOwnProperty.call(next, 'width') ||
            Object.prototype.hasOwnProperty.call(next, 'height')) {
          sessionDrag = null;
        }
      } else {
        sessionDrag = { width: next.width, height: next.height };
      }
      recompute();
      applyVars();
      notify();
      if (persist) persistSaved();
    }

    function useConfig() {
      const [cfg, setCfg] = React.useState(getSnapshot);
      React.useEffect(() => subscribe(() => setCfg(getSnapshot())), []);
      return cfg;
    }

    const inject = ['slots', 'locale'];

    function apply(ctx) {
      const t = ctx.locale.bind(NS);

      ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'settings-resizer: dictionaries');

      /* 0. Bind the Host config form (soft: missing service must not disable the plugin). */
      ctx.effect(() => {
        let forms;
        try { forms = ctx.configForms || ctx.get('configForms'); } catch (_) { forms = undefined; }
        if (!forms || typeof forms.get !== 'function') return () => {};
        const bound = forms.get(CONFIG_NS);
        if (!bound) return () => {};
        form = bound;
        const read = () => {
          const snap = bound.getSnapshot();
          if (snap && snap.status === 'ready' && snap.value) replaceFromHost(snap.value);
        };
        read();
        const off = bound.subscribe(read);
        return () => {
          if (typeof off === 'function') off();
          if (form === bound) form = null;
        };
      }, 'settings-resizer: profile config form');

      /* 1. Panel CSS + CSS variables, owned by a ctx.effect with full cleanup. */
      ctx.effect(() => {
        if (typeof document === 'undefined') return () => {};
        applyVars();
        let tag = document.querySelector('style[data-plugin-css="' + TAG_ID + '"]');
        if (!tag) {
          tag = document.createElement('style');
          tag.dataset.plugin = 'dsh-settings-resizer';
          tag.dataset.pluginCss = TAG_ID;
          tag.textContent = CSS;
          document.head.appendChild(tag);
        }
        return () => {
          if (tag) tag.remove();
          const root = document.documentElement;
          root.style.removeProperty('--dshr-width');
          root.style.removeProperty('--dshr-height');
          root.style.removeProperty('--dshr-resize');
        };
      }, 'settings-resizer: panel css');

      /* 2. Persist the size after a native "resize: both" drag.
             The browser writes inline width/height; on mouseup we fold those into
             the persisted config, restore the CSS variables, and drop the inline
             styles so the (viewport-clamped) CSS rule governs again. */
      ctx.effect(() => {
        if (typeof document === 'undefined') return () => {};
        const onUp = () => {
          const panel = document.querySelector(PANEL);
          if (!panel) return;
          const iw = panel.style.width;
          const ih = panel.style.height;
          if (!iw && !ih) return; // no drag happened
          const w = parseFloat(iw) || panel.getBoundingClientRect().width;
          const hh = parseFloat(ih) || panel.getBoundingClientRect().height;
          panel.style.removeProperty('width');
          panel.style.removeProperty('height');
          const size = { width: Math.round(w), height: Math.round(hh), preset: 'custom' };
          if (current.rememberDrag) {
            setConfig(size);                 // persist to profile config
          } else {
            setConfig(size, { persist: false }); // session-only, never saved
          }
        };
        document.addEventListener('mouseup', onUp, true);
        return () => document.removeEventListener('mouseup', onUp, true);
      }, 'settings-resizer: drag persistence');

      /* 3. The configuration page in the settings navigation. */
      function ResizerSection() {
        const cfg = useConfig();
        const [w, setW] = React.useState(String(cfg.width));
        const [hh, setH] = React.useState(String(cfg.height));
        const [err, setErr] = React.useState('');
        React.useEffect(() => {
          setW(String(cfg.width));
          setH(String(cfg.height));
        }, [cfg.width, cfg.height]);

        const onApply = () => {
          const nw = Number(w);
          const nh = Number(hh);
          if (!Number.isFinite(nw) || !Number.isFinite(nh) ||
              nw < 640 || nw > 2400 || nh < 400 || nh > 2000) {
            setErr(t('invalid'));
            return;
          }
          setErr('');
          setConfig({ width: nw, height: nh, preset: 'custom' });
        };

        return h('div', { className: 'dshr-root' },
          h('h2', { className: 'dshr-h2' }, t('title')),
          h('p', { className: 'dshr-lead' }, t('description')),

          h('div', { className: 'dshr-card' },
            h('div', { className: 'dshr-label' }, t('presets')),
            h('div', { className: 'dshr-presets' },
              PRESET_KEYS.map((k) => {
                const p = PRESETS[k];
                const on = cfg.preset === k;
                return h('button', {
                  key: k,
                  type: 'button',
                  className: 'dshr-preset' + (on ? ' dshr-on' : ''),
                  'aria-pressed': on ? 'true' : 'false',
                  onClick: () => setConfig({ width: p.width, height: p.height, preset: k })
                },
                  h('span', null, t(k === 'compact' ? 'presetCompact'
                    : k === 'default' ? 'presetDefault'
                    : k === 'large' ? 'presetLarge' : 'presetWide')),
                  k === 'large' ? h('span', { className: 'dshr-badge' }, t('recommended')) : null
                );
              })
            ),
            h('div', { className: 'dshr-custom' },
              h('label', { className: 'dshr-field' },
                h('span', { className: 'dshr-label-sm' }, t('width')),
                h('input', {
                  type: 'number', className: 'dshr-input',
                  value: w, min: 640, max: 2400,
                  'aria-label': t('width'),
                  onChange: (e) => setW(e.target.value)
                }),
                h('span', { className: 'dshr-unit' }, t('pixels'))
              ),
              h('label', { className: 'dshr-field' },
                h('span', { className: 'dshr-label-sm' }, t('height')),
                h('input', {
                  type: 'number', className: 'dshr-input',
                  value: hh, min: 400, max: 2000,
                  'aria-label': t('height'),
                  onChange: (e) => setH(e.target.value)
                }),
                h('span', { className: 'dshr-unit' }, t('pixels'))
              ),
              h('button', {
                type: 'button', className: 'dshr-btn dshr-btn-primary', onClick: onApply
              }, t('apply'))
            ),
            err ? h('p', { className: 'dshr-error' }, err)
                : h('p', { className: 'dshr-hint' }, t('customHint'))
          ),

          h('div', { className: 'dshr-row' },
            h('button', {
              type: 'button', role: 'switch',
              'aria-checked': cfg.resize ? 'true' : 'false',
              'aria-label': t('resize'),
              className: 'dshr-switch' + (cfg.resize ? ' dshr-switch-on' : ''),
              onClick: () => setConfig({ resize: !cfg.resize })
            }, h('span', { className: 'dshr-knob' })),
            h('div', { className: 'dshr-row-copy' },
              h('div', { className: 'dshr-label' }, t('resize')),
              h('p', { className: 'dshr-hint' }, t('resizeHint'))
            )
          ),

          h('div', { className: 'dshr-row' },
            h('button', {
              type: 'button', role: 'switch',
              'aria-checked': cfg.rememberDrag ? 'true' : 'false',
              'aria-label': t('rememberDrag'),
              className: 'dshr-switch' + (cfg.rememberDrag ? ' dshr-switch-on' : ''),
              onClick: () => {
                // Turning "remember" back on adopts a size that was dragged
                // while it was off, so what you see is what gets kept.
                if (!cfg.rememberDrag && sessionDrag) {
                  setConfig({ rememberDrag: true, width: cfg.width, height: cfg.height, preset: 'custom' });
                } else {
                  setConfig({ rememberDrag: !cfg.rememberDrag });
                }
              }
            }, h('span', { className: 'dshr-knob' })),
            h('div', { className: 'dshr-row-copy' },
              h('div', { className: 'dshr-label' }, t('rememberDrag')),
              h('p', { className: 'dshr-hint' }, t('rememberDragHint'))
            )
          ),

          h('div', { className: 'dshr-foot' },
            h('span', { className: 'dshr-status' },
              t('current') + ': ' + cfg.width + ' × ' + cfg.height + ' ' + t('pixels') +
              ' · ' + (cfg.resize ? t('on') : t('off')) +
              ' · ' + (cfg.rememberDrag ? t('rememberOn') : t('rememberOff'))),
            h('button', {
              type: 'button', className: 'dshr-btn',
              onClick: () => setConfig({ ...PRESETS.default, preset: 'default' })
            }, t('reset'))
          ),

          h('p', { className: 'dshr-note' }, t('note')),
          h('p', { className: 'dshr-note' }, cfg.rememberDrag ? t('persisted') : t('sessionOnly'))
        );
      }

      ctx.slots.inject('settings.section', () => ctx.slots.register({
        name: 'settings.section',
        id: SECTION_ID,
        order: 90,
        label: () => t('title'),
        locale: NS
      }, ResizerSection));

      ctx.slots.inject('settings.section.icon', () => ctx.slots.register({
        name: 'settings.section.icon',
        id: SECTION_ID,
        locale: NS
      }, (props) => {
        const size = (props && props.size) || 16;
        return h('svg', {
          width: size, height: size, viewBox: '0 0 16 16',
          fill: 'none', xmlns: 'http://www.w3.org/2000/svg', 'aria-hidden': 'true'
        },
          h('rect', {
            x: 1.5, y: 2.5, width: 10, height: 8, rx: 1.5,
            stroke: 'currentColor', 'stroke-width': 1.2
          }),
          h('path', {
            d: 'M8 12.5h5v-5 M12.5 12.5L8.5 8.5',
            stroke: 'currentColor', 'stroke-width': 1.2,
            'stroke-linecap': 'round', 'stroke-linejoin': 'round'
          })
        );
      }));
    }

    return { inject, apply };
  }
});
