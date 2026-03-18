# AGENTS.md

## Project Overview

Egern Kit is a collection of modules (widgets, scripts, tools) for [Egern](https://egernapp.com), an iOS network toolkit app.

## Structure

```
modules/
  *.yaml          # Egern module definitions (scriptings + widgets)
  *.js            # Widget/script implementations
```

## Key Concepts

- **Modules** are YAML files declaring `scriptings` and `widgets`
- **Widget scripts** are `generic` type scripts that `export default async function(ctx)` and return a Widget DSL JSON object
- **Widget DSL** uses `type: "widget"` as root, with nested `stack`, `text`, `image`, `spacer`, `date` elements
- Scripts access environment variables via `ctx.env`, HTTP via `ctx.http`, and persistent storage via `ctx.storage`

## Conventions

- Module YAML files group related scripts/widgets by domain (e.g. `vps-usage.yaml`)
- Script files are named by provider (e.g. `bandwagonhost-usage.js`)
- Widgets should support multiple sizes: `systemSmall`, `systemMedium`, and lock screen variants
- Use `ctx.storage` to cache API responses for offline fallback

## References

- Widget DSL: https://egernapp.com/zh-CN/docs/configuration/widgets
- JavaScript API: https://egernapp.com/zh-CN/docs/javascript-api
