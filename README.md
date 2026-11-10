# Settings resizer

一个独立的 Harness 插件，让「设置」窗口变成可配置、可拖动调整大小，
专门解决固定 800 × 800 布局导致部分插件设置页内容拥挤的问题。

## 它做什么

- 注入一段只作用于 `div[data-shortcut-modal="settings"][role="dialog"]` 的 CSS，
  用可配置的宽/高覆盖设置外壳固定的 `800px` 尺寸（不修改 DSH 本体）。
- 默认采用 `1100 × 820` 的「宽松」预设，直接缓解拥挤；也可选择
  `800 × 800`（原始）、`800 × 600`（紧凑）、`1280 × 860`（超宽）或自定义尺寸。
- 提供「允许拖动右下角」开关：开启后面板右下角出现原生 resize 手柄，
  拖动即自由调整。
- 提供「记住拖动后的尺寸」开关（默认开启）：决定拖动结果是否写入
  profile 配置永久保留，还是只在本次会话有效。
- 在设置里新增一个「窗口大小」分区用于配置。

## 尺寸记忆写入 profile 配置

尺寸不再存浏览器 `localStorage`（DSH Web 端口每次启动可能变化，按 origin
隔离的 localStorage 会丢失）。改为走 Host 官方 settings 域：

- Host `index.js` 用 `@deepseek-ai/schemastery` 声明 `Config`，五个字段
  `width / height / resize / rememberDrag / preset` 都标 `.volatile()`，并在 `apply`
  中通过 `ctx.inject(['settings'], ...)` 注册 `settings.configure({auto:false}, ctx.fiber)`。
- 命名空间 id = `cordis.patch.yml` 行的 `id`，即 `settings-resizer`。
- Client 用 `configForms.get('settings-resizer')` 读快照、订阅变化，
  用 `form.mutate([...5 字段])` 一次原子写入。Host 把值持久化到当前 profile
  的 `cordis.patch.yml` 中 `- id: settings-resizer` 行的 `config:`。
- 因此重启、端口漂移、换浏览器后尺寸都保留；配置随 profile 走。
- 软获取 `ctx.get('configForms')`：服务短暂不可用时插件仍激活，
  CSS 的 `var(--dshr-width, 1100px)` 兜底保证窗口保持 1100 × 820。

## 「记住拖动后的尺寸」开关

状态分两层，互不污染：

- `saved`：与 profile 配置完全一致的值，重启存活。
- `sessionDrag`：仅在「记住 = 关」时产生的临时尺寸，**永不写入 `saved` /
  profile**。`current` 是二者合并后的有效状态，驱动 CSS 变量与界面。

行为：

- **记住 = 开（默认）**：每次拖动都写回 profile 配置，永久保留；预设、
  自定义「应用」、恢复 800 × 800、各开关本身也一律写入配置。
- **记住 = 关**：拖动只改变本次会话显示，重启 DSH 后恢复已保存
  尺寸，不会覆盖预设或自定义值（同一会话内关闭再打开设置面板仍保持
  临时尺寸，因为 CSS 变量挂在 `documentElement` 上）。之后切回
  「记住 = 开」时，会把当前屏幕上的临时尺寸一并采纳为要记住的值
  （所见即所得）。
- 单纯切换这个开关不会把之前的临时拖动尺寸泄漏进 profile：只有一次
  显式改变宽 / 高才会清空 `sessionDrag`。

## 实现约束

- 通过官方插槽 `settings.section` 注册配置页，用 `ctx.effect` 管理
  `<style>` 与事件监听并返回 cleanup。
- 样式只引用 `--dsw-alias-*` / `--dsw-static-*` / `--dsw-radius-*` 主题令牌；
  不 `require` 任何 Harness Client 包，不写 `document.body`，不动 `#root`。
- 开关轨道用品牌蓝 `--dsw-alias-state-business-primary`（亮色 `#4176e6` /
  暗色 `#7aaaff`）+ 白色旋钮；OFF 用实心灰槽 `--dsw-alias-bg-overlay`。
  不用 `--dsw-alias-brand-primary`（本版是纯黑白）与
  `--dsw-alias-bg-l1` / `bg-l2`（本版未定义），避免在两种主题下都看不清。
- 仅在 `@media (min-width: 768px)` 生效，移动端铺满视口的原有逻辑保持不变。
- 若未来宿主不再带 `data-shortcut-modal="settings"`，CSS 自然失效且无害。
- Host `index.js` 用 `@deepseek-ai/schemastery` 声明 `Config`，该依赖已在
  `package.json` 的 `dependencies` 中固定为 `3.18.4`。从 GitHub 源码安装
  （`dsh plugin --profile <name> add github:dreamxjy/dsh-settings-resizer`）时，
  pnpm 会把这个依赖装进插件自己的 `node_modules`，Host 即可解析。
- 只有用 `link:`（本地目录软链）方式安装时，Node ESM 按 realpath 解析会
  绕过 profile 的 `node_modules` 树，才需要目录内的 `node_modules/@deepseek-ai`
  软链（见下）。

## 安装

用预构建的 release tarball 安装（推荐，体积最小、无需构建）：

```sh
dsh plugin --profile <name> add "https://github.com/dreamxjy/dsh-settings-resizer/releases/download/v1.2.4/dsh-settings-resizer-1.2.4.tgz"
```

也可以从 GitHub 源码安装（依赖会自动解析）：

```sh
dsh plugin --profile <name> add github:dreamxjy/dsh-settings-resizer
```

或通过 `plugin_manager` 的 `install_bundle` 安装本目录（绝对路径）。
安装/更新后可能需要完全重启 DeepSeek Harness 才会加载新的 Host 模块。

> 从本仓库全新 clone 后，若以 `link:`（本地目录软链）方式安装，Node ESM 会按
> realpath 从仓库目录解析 `@deepseek-ai/schemastery`，而该目录不在 profile 的
> `node_modules` 树内，Host 会报 `ERR_MODULE_NOT_FOUND`。此时在仓库目录补一个
> 指向 profile 作用域的软链即可（该软链已在 `.gitignore` 中排除）：
>
> ```sh
> mkdir -p node_modules
> ln -s "$HOME/.dsh/profiles/desktop/node_modules/@deepseek-ai" node_modules/@deepseek-ai
> ```
>
> 若改用以 tarball/npm 包形式安装（依赖被打进包内），则无需这一步。
