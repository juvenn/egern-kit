# Egern Kit

A collection of [Egern](https://egernapp.com) modules — widgets, scripts, and tools.

## Modules

### VPS Usage Widget

Display VPS data usage on iOS home screen and lock screen widgets.

**Supported providers:**
- BandwagonHost (搬瓦工)

**Widget sizes:**

| Size | Description |
|------|-------------|
| Small | Usage, progress bar, percentage, days to reset |
| Medium | + remaining data, reset date |
| Lock screen | Compact: rectangular, circular, inline |

**Features:**
- Color-coded progress bar (green → yellow → red)
- Auto unit conversion (KB/MB/GB/TB)
- Cached fallback when API is unreachable
- Auto refresh every 30 minutes

#### Installation

1. In Egern, go to **Tools → Modules**, tap **+** and add:
   ```
   https://raw.githubusercontent.com/juvenn/egern-kit/main/modules/vps-usage.yaml
   ```
2. Edit the module, add env variables:
   | Key | Value |
   |-----|-------|
   | `VEID` | Your BandwagonHost VPS ID |
   | `API_KEY` | Your BandwagonHost API key |

   > Find these at [KiwiVM Control Panel](https://kiwivm.64clouds.com/main-controls) → API
3. Go to **Analytics** tab → **Widget Gallery**, the widget should appear
4. Long press iOS home screen → add Egern widget → select "bandwagonhost-usage"

## License

MIT
