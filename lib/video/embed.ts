export type SupportedVideoPlatform = "vk" | "rutube";

export type VideoEmbedResult =
  | {
      ok: true;
      platform: SupportedVideoPlatform;
      embedUrl: string;
      normalizedUrl: string;
      label: string;
    }
  | {
      ok: false;
      reason: string;
    };

function normalizeHost(host: string) {
  return host.replace(/^www\./, "").toLowerCase();
}

function pickQueryValue(value: string | null) {
  return value?.trim() || "";
}

function parseRutube(url: URL): VideoEmbedResult | null {
  const host = normalizeHost(url.hostname);

  if (host !== "rutube.ru") {
    return null;
  }

  const embedMatch = url.pathname.match(/^\/play\/embed\/([a-zA-Z0-9]+)\/?$/);

  if (embedMatch) {
    const accessKey = pickQueryValue(url.searchParams.get("p"));
    const embedUrl = accessKey
      ? `https://rutube.ru/play/embed/${embedMatch[1]}/?p=${encodeURIComponent(accessKey)}`
      : `https://rutube.ru/play/embed/${embedMatch[1]}`;

    return {
      ok: true,
      platform: "rutube",
      embedUrl,
      normalizedUrl: url.toString(),
      label: "RuTube",
    };
  }

  const videoMatch = url.pathname.match(/^\/(?:video|shorts)\/([a-zA-Z0-9]+)\/?$/);

  if (!videoMatch) {
    return {
      ok: false,
      reason: "Для RuTube используйте ссылку на страницу ролика или ссылку на встроенный плеер.",
    };
  }

  const accessKey = pickQueryValue(url.searchParams.get("p"));
  const embedUrl = accessKey
    ? `https://rutube.ru/play/embed/${videoMatch[1]}/?p=${encodeURIComponent(accessKey)}`
    : `https://rutube.ru/play/embed/${videoMatch[1]}`;

  return {
    ok: true,
    platform: "rutube",
    embedUrl,
    normalizedUrl: url.toString(),
    label: "RuTube",
  };
}

function parseVk(url: URL): VideoEmbedResult | null {
  const host = normalizeHost(url.hostname);

  if (!["vk.com", "vkvideo.ru"].includes(host)) {
    return null;
  }

  if (url.pathname.endsWith("/video_ext.php") || url.pathname === "/video_ext.php") {
    const ownerId = pickQueryValue(url.searchParams.get("oid"));
    const videoId = pickQueryValue(url.searchParams.get("id"));
    const hash = pickQueryValue(url.searchParams.get("hash"));
    const quality = pickQueryValue(url.searchParams.get("hd")) || "2";

    if (!ownerId || !videoId) {
      return {
        ok: false,
        reason: "Ссылка VK Видео заполнена не полностью. Нужна корректная ссылка на встроенный плеер.",
      };
    }

    const query = new URLSearchParams({
      oid: ownerId,
      id: videoId,
      hd: quality,
    });

    if (hash) {
      query.set("hash", hash);
    }

    return {
      ok: true,
      platform: "vk",
      embedUrl: `https://vk.com/video_ext.php?${query.toString()}`,
      normalizedUrl: url.toString(),
      label: "VK Видео",
    };
  }

  const pageMatch = url.pathname.match(/^\/video(-?\d+)_([0-9]+)\/?$/);

  if (!pageMatch) {
    return {
      ok: false,
      reason: "Для VK Видео используйте ссылку на встроенный плеер или ссылку из меню «Поделиться».",
    };
  }

  const hash = pickQueryValue(url.searchParams.get("hash"));

  if (!hash) {
    return {
      ok: false,
      reason: "В ссылке VK Видео не хватает служебного параметра доступа. Вставьте ссылку из меню «Поделиться».",
    };
  }

  const query = new URLSearchParams({
    oid: pageMatch[1],
    id: pageMatch[2],
    hash,
    hd: "2",
  });

  return {
    ok: true,
    platform: "vk",
    embedUrl: `https://vk.com/video_ext.php?${query.toString()}`,
    normalizedUrl: url.toString(),
    label: "VK Видео",
  };
}

export function parseVideoUrl(rawUrl: string): VideoEmbedResult {
  if (!rawUrl.trim()) {
    return {
      ok: false,
      reason: "Ссылка на видео не заполнена.",
    };
  }

  try {
    const parsedUrl = new URL(rawUrl.trim());

    const rutubeResult = parseRutube(parsedUrl);
    if (rutubeResult) {
      return rutubeResult;
    }

    const vkResult = parseVk(parsedUrl);
    if (vkResult) {
      return vkResult;
    }

    return {
      ok: false,
      reason: "Поддерживаются только ссылки из VK Видео или RuTube.",
    };
  } catch {
    return {
      ok: false,
      reason: "Не удалось распознать ссылку. Проверьте адрес.",
    };
  }
}
