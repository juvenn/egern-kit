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
  if (ratio < 0.6) return "#34D399";
  if (ratio < 0.85) return "#FBBF24";
  return "#F87171";
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
  const pct = Math.min(Math.max(ratio, 0.01), 1);
  return {
    type: "stack",
    direction: "row",
    height: height,
    borderRadius: height / 2,
    backgroundColor: "#FFFFFF1A",
    children: [
      {
        type: "stack",
        flex: pct,
        height: height,
        borderRadius: height / 2,
        backgroundGradient: {
          type: "linear",
          colors: [color, color + "99"],
          startPoint: { x: 0, y: 0 },
          endPoint: { x: 1, y: 0 },
        },
        children: [],
      },
      {
        type: "stack",
        flex: 1 - pct,
        children: [],
      },
    ],
  };
}

// --- Error widget ---

function errorWidget(title, message) {
  return {
    type: "widget",
    padding: 16,
    gap: 8,
    backgroundColor: { light: "#1C1C1E", dark: "#1C1C1E" },
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
            color: "#FBBF24",
            width: 14,
            height: 14,
          },
          {
            type: "text",
            text: title,
            font: { size: "caption1", weight: "semibold" },
            textColor: "#FFFFFF99",
          },
        ],
      },
      { type: "spacer" },
      {
        type: "text",
        text: message,
        font: { size: "caption1" },
        textColor: "#FBBF24",
      },
    ],
  };
}

// --- Layout builders ---

function buildSmall(d, title) {
  const ratio = d.data_counter / d.plan_monthly_data;
  const color = usageColor(ratio);
  const days = daysUntil(d.data_next_reset);

  return {
    type: "widget",
    padding: 16,
    gap: 10,
    backgroundColor: { light: "#1C1C1E", dark: "#1C1C1E" },
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
            width: 14,
            height: 14,
            color: "#FFFFFF99",
          },
          {
            type: "text",
            text: title,
            font: { size: "caption1", weight: "semibold" },
            textColor: "#FFFFFF99",
          },
        ],
      },
      { type: "spacer" },
      // Progress bar
      progressBar(ratio, color, 6),
      // Label (left) + percentage (right)
      {
        type: "stack",
        direction: "row",
        alignItems: "center",
        children: [
          {
            type: "text",
            text: formatBytes(d.data_counter) + " / " + formatBytes(d.plan_monthly_data),
            font: { size: "caption1", weight: "medium" },
            textColor: "#FFFFFFCC",
            maxLines: 1,
            minScale: 0.7,
          },
          { type: "spacer" },
          {
            type: "text",
            text: Math.round(ratio * 100) + "%",
            font: { size: "caption1", weight: "bold", family: "Menlo" },
            textColor: color,
          },
        ],
      },
    ],
  };
}

function buildMedium(d, title) {
  const ratio = d.data_counter / d.plan_monthly_data;
  const color = usageColor(ratio);
  const days = daysUntil(d.data_next_reset);
  const remaining = d.plan_monthly_data - d.data_counter;

  return {
    type: "widget",
    padding: 16,
    gap: 10,
    backgroundColor: { light: "#1C1C1E", dark: "#1C1C1E" },
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
            width: 14,
            height: 14,
            color: "#FFFFFF99",
          },
          {
            type: "text",
            text: title,
            font: { size: "caption1", weight: "semibold" },
            textColor: "#FFFFFF99",
          },
          { type: "spacer" },
      // Progress bar
      progressBar(ratio, color, 6),
      // Label (left) + percentage (right)
      {
        type: "stack",
        direction: "row",
        alignItems: "center",
        children: [
          {
            type: "text",
            text: formatBytes(d.data_counter) + " / " + formatBytes(d.plan_monthly_data) + " · " + days + "d to reset",
            font: { size: "caption1", weight: "medium" },
            textColor: "#FFFFFFCC",
            maxLines: 1,
            minScale: 0.7,
          },
          { type: "spacer" },
          {
            type: "text",
            text: Math.round(ratio * 100) + "%",
            font: { size: "caption1", weight: "bold", family: "Menlo" },
            textColor: color,
          },
        ],
      },
    ],
  };
}

function buildAccessoryRectangular(d, shortTitle) {
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
            text: shortTitle + " " + Math.round(ratio * 100) + "%",
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

function buildAccessoryCircular(d, shortTitle) {
  const ratio = d.data_counter / d.plan_monthly_data;

  return {
    type: "widget",
    padding: 0,
    children: [
      { type: "spacer" },
      {
        type: "text",
        text: Math.round(ratio * 100) + "%",
        font: { size: "title3", weight: "bold", family: "Menlo" },
        textAlign: "center",
      },
      {
        type: "text",
        text: shortTitle,
        font: { size: "caption2" },
        textAlign: "center",
        opacity: 0.6,
      },
      { type: "spacer" },
    ],
  };
}

function buildAccessoryInline(d, shortTitle) {
  const ratio = d.data_counter / d.plan_monthly_data;

  return {
    type: "widget",
    children: [
      {
        type: "text",
        text: shortTitle + " " + Math.round(ratio * 100) + "% | " + formatBytes(d.data_counter),
        font: { size: "caption2" },
      },
    ],
  };
}

// --- Main ---

export default async function (ctx) {
  const veid = ctx.env.BWH_VEID;
  const apiKey = ctx.env.BWH_API_KEY;

  const title = ctx.env.HOST_TITLE || "BandwagonHost";
  const shortTitle = title.substring(0, 3).toUpperCase();

  if (!veid || !apiKey) {
    return errorWidget(title, "Set BWH_VEID & BWH_API_KEY in module env");
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
    ctx.storage.setJSON("bwh_cache_" + veid, {
      data_counter: data.data_counter,
      plan_monthly_data: data.plan_monthly_data,
      data_next_reset: data.data_next_reset,
      ts: Date.now(),
    });
  } catch (e) {
    // Fallback to cache
    const cached = ctx.storage.getJSON("bwh_cache_" + veid);
    if (cached) {
      data = cached;
    } else {
      return errorWidget(title, e.message || "Request failed");
    }
  }

  const family = ctx.widgetFamily;

  switch (family) {
    case "systemMedium":
      return buildMedium(data, title);
    case "accessoryRectangular":
      return buildAccessoryRectangular(data, shortTitle);
    case "accessoryCircular":
      return buildAccessoryCircular(data, shortTitle);
    case "accessoryInline":
      return buildAccessoryInline(data, shortTitle);
    default:
      return buildSmall(data, title);
  }
}
