// BandwagonHost Data Usage Widget for Egern
// API: https://api.64clouds.com/v1/getServiceInfo?veid={VEID}&api_key={API_KEY}

const API_BASE = "https://api.64clouds.com/v1/getServiceInfo";

// --- Helpers ---

const Ki = 1024;
const Mi = Ki * 1024;
const Gi = Mi * 1024;
const Ti = Gi * 1024;

function formatBytes(bytes) {
  if (bytes >= Ti) return (bytes / Ti).toFixed(2) + " TB";
  if (bytes >= Gi) return (bytes / Gi).toFixed(2) + " GB";
  if (bytes >= Mi) return (bytes / Mi).toFixed(1) + " MB";
  return (bytes / Ki).toFixed(0) + " KB";
}

function usageColor(ratio) {
  if (ratio < 0.6) return "#34C759";
  if (ratio < 0.85) return "#FF9F0A";
  return "#FF3B30";
}

function daysUntil(timestamp) {
  const now = Date.now() / 1000;
  const diff = timestamp - now;
  return Math.max(0, Math.ceil(diff / 86400));
}

function formatResetDate(timestamp) {
  const d = new Date(timestamp * 1000);
  return (d.getMonth() + 1) + "/" + d.getDate();
}

function progressBar(ratio, color, height) {
  const pct = Math.min(Math.max(ratio, 0), 1);
  const filled = Math.round(pct * 100);
  const empty = 100 - filled;
  const children = [
    {
      type: "stack",
      height: height,
      flex: filled || 1,
      backgroundColor: color,
      borderRadius: height / 2,
      children: [],
    },
  ];
  if (empty > 0) {
    children.push({
      type: "stack",
      height: height,
      flex: empty,
      backgroundColor: "rgba(255,255,255,0.15)",
      borderRadius: height / 2,
      children: [],
    });
  }
  return {
    type: "stack",
    direction: "row",
    gap: 1,
    children,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: height / 2,
  };
}

// --- Error widget ---

function errorWidget(message) {
  return {
    type: "widget",
    padding: 16,
    gap: 8,
    backgroundGradient: {
      type: "linear",
      colors: ["#1A1A2E", "#16213E"],
      startPoint: { x: 0, y: 0 },
      endPoint: { x: 1, y: 1 },
    },
    children: [
      {
        type: "stack",
        direction: "row",
        alignItems: "center",
        gap: 6,
        children: [
          {
            type: "image",
            src: "sf-symbol:exclamationmark.triangle.fill",
            color: "#FF9F0A",
            width: 16,
            height: 16,
          },
          {
            type: "text",
            text: "BandwagonHost",
            font: { size: "headline", weight: "bold" },
            textColor: "#FFFFFF",
          },
        ],
      },
      { type: "spacer" },
      {
        type: "text",
        text: message,
        font: { size: "caption1" },
        textColor: "#FF9F0A",
      },
    ],
  };
}

// --- Layout builders ---

function buildSmall(d) {
  const ratio = d.data_counter / d.plan_monthly_data;
  const color = usageColor(ratio);
  const days = daysUntil(d.data_next_reset);

  return {
    type: "widget",
    padding: 14,
    gap: 6,
    backgroundGradient: {
      type: "linear",
      colors: ["#1A1A2E", "#16213E"],
      startPoint: { x: 0, y: 0 },
      endPoint: { x: 1, y: 1 },
    },
    refreshAfter: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    children: [
      // Header
      {
        type: "stack",
        direction: "row",
        alignItems: "center",
        gap: 6,
        children: [
          {
            type: "image",
            src: "sf-symbol:server.rack",
            color: "#007AFF",
            width: 15,
            height: 15,
          },
          {
            type: "text",
            text: "BandwagonHost",
            font: { size: "subheadline", weight: "bold" },
            textColor: "#FFFFFF",
            maxLines: 1,
          },
        ],
      },
      { type: "spacer" },
      // Usage text
      {
        type: "text",
        text: formatBytes(d.data_counter) + " / " + formatBytes(d.plan_monthly_data),
        font: { size: "callout", weight: "semibold" },
        textColor: "#FFFFFF",
        maxLines: 1,
        minScale: 0.7,
      },
      // Progress bar
      progressBar(ratio, color, 8),
      // Footer: percentage + reset days
      {
        type: "stack",
        direction: "row",
        alignItems: "center",
        children: [
          {
            type: "text",
            text: (ratio * 100).toFixed(1) + "%",
            font: { size: "caption1", weight: "semibold" },
            textColor: color,
          },
          { type: "spacer" },
          {
            type: "text",
            text: days + "d to reset",
            font: { size: "caption1" },
            textColor: "#FFFFFFAA",
          },
        ],
      },
    ],
  };
}

function buildMedium(d) {
  const ratio = d.data_counter / d.plan_monthly_data;
  const color = usageColor(ratio);
  const days = daysUntil(d.data_next_reset);
  const remaining = d.plan_monthly_data - d.data_counter;

  return {
    type: "widget",
    padding: 14,
    gap: 0,
    backgroundGradient: {
      type: "linear",
      colors: ["#1A1A2E", "#16213E"],
      startPoint: { x: 0, y: 0 },
      endPoint: { x: 1, y: 1 },
    },
    refreshAfter: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    children: [
      // Header
      {
        type: "stack",
        direction: "row",
        alignItems: "center",
        gap: 6,
        children: [
          {
            type: "image",
            src: "sf-symbol:server.rack",
            color: "#007AFF",
            width: 16,
            height: 16,
          },
          {
            type: "text",
            text: "BandwagonHost",
            font: { size: "headline", weight: "bold" },
            textColor: "#FFFFFF",
          },
          { type: "spacer" },
          {
            type: "text",
            text: (ratio * 100).toFixed(1) + "%",
            font: { size: "headline", weight: "bold" },
            textColor: color,
          },
        ],
      },
      { type: "spacer" },
      // Main content: two columns
      {
        type: "stack",
        direction: "row",
        gap: 16,
        alignItems: "end",
        children: [
          // Left: usage info
          {
            type: "stack",
            direction: "column",
            gap: 5,
            flex: 1,
            children: [
              {
                type: "text",
                text: formatBytes(d.data_counter) + " / " + formatBytes(d.plan_monthly_data),
                font: { size: "callout", weight: "semibold" },
                textColor: "#FFFFFF",
                maxLines: 1,
                minScale: 0.7,
              },
              progressBar(ratio, color, 8),
            ],
          },
          // Right: details
          {
            type: "stack",
            direction: "column",
            gap: 3,
            alignItems: "end",
            children: [
              {
                type: "stack",
                direction: "row",
                alignItems: "center",
                gap: 4,
                children: [
                  {
                    type: "image",
                    src: "sf-symbol:arrow.down.circle.fill",
                    color: "#FFFFFFAA",
                    width: 11,
                    height: 11,
                  },
                  {
                    type: "text",
                    text: formatBytes(remaining) + " left",
                    font: { size: "caption1" },
                    textColor: "#FFFFFFAA",
                  },
                ],
              },
              {
                type: "stack",
                direction: "row",
                alignItems: "center",
                gap: 4,
                children: [
                  {
                    type: "image",
                    src: "sf-symbol:clock.arrow.circlepath",
                    color: "#FFFFFFAA",
                    width: 11,
                    height: 11,
                  },
                  {
                    type: "text",
                    text: days + "d (" + formatResetDate(d.data_next_reset) + ")",
                    font: { size: "caption1" },
                    textColor: "#FFFFFFAA",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
}

function buildAccessoryRectangular(d) {
  const ratio = d.data_counter / d.plan_monthly_data;
  const days = daysUntil(d.data_next_reset);

  return {
    type: "widget",
    padding: 0,
    gap: 2,
    children: [
      {
        type: "stack",
        direction: "row",
        alignItems: "center",
        gap: 4,
        children: [
          {
            type: "image",
            src: "sf-symbol:server.rack",
            width: 11,
            height: 11,
          },
          {
            type: "text",
            text: "BWH " + (ratio * 100).toFixed(1) + "%",
            font: { size: "caption1", weight: "bold" },
            maxLines: 1,
          },
        ],
      },
      progressBar(ratio, usageColor(ratio), 4),
      {
        type: "text",
        text: formatBytes(d.data_counter) + "/" + formatBytes(d.plan_monthly_data) + " | " + days + "d",
        font: { size: "caption2" },
        maxLines: 1,
        minScale: 0.8,
      },
    ],
  };
}

function buildAccessoryCircular(d) {
  const ratio = d.data_counter / d.plan_monthly_data;

  return {
    type: "widget",
    padding: 0,
    children: [
      { type: "spacer" },
      {
        type: "text",
        text: (ratio * 100).toFixed(0) + "%",
        font: { size: "title3", weight: "bold" },
        textAlign: "center",
      },
      {
        type: "text",
        text: "BWH",
        font: { size: "caption2" },
        textAlign: "center",
        opacity: 0.6,
      },
      { type: "spacer" },
    ],
  };
}

function buildAccessoryInline(d) {
  const ratio = d.data_counter / d.plan_monthly_data;

  return {
    type: "widget",
    children: [
      {
        type: "text",
        text: "BWH " + (ratio * 100).toFixed(1) + "% | " + formatBytes(d.data_counter),
        font: { size: "caption2" },
      },
    ],
  };
}

// --- Main ---

export default async function (ctx) {
  const veid = ctx.env.BWH_VEID;
  const apiKey = ctx.env.BWH_API_KEY;

  if (!veid || !apiKey) {
    return errorWidget("Set BWH_VEID & BWH_API_KEY in module env");
  }

  let data;
  try {
    const url = API_BASE + "?veid=" + veid + "&api_key=" + apiKey;
    const resp = await ctx.http.get(url, { timeout: 10000 });
    data = await resp.json();

    if (data.error) {
      throw new Error(data.message || "API error");
    }

    // Cache successful response
    ctx.storage.setJSON("bwh_cache", {
      data_counter: data.data_counter,
      plan_monthly_data: data.plan_monthly_data,
      data_next_reset: data.data_next_reset,
      ts: Date.now(),
    });
  } catch (e) {
    // Fallback to cache
    const cached = ctx.storage.getJSON("bwh_cache");
    if (cached) {
      data = cached;
    } else {
      return errorWidget(e.message || "Request failed");
    }
  }

  const family = ctx.widgetFamily;

  switch (family) {
    case "systemMedium":
      return buildMedium(data);
    case "accessoryRectangular":
      return buildAccessoryRectangular(data);
    case "accessoryCircular":
      return buildAccessoryCircular(data);
    case "accessoryInline":
      return buildAccessoryInline(data);
    default:
      return buildSmall(data);
  }
}
