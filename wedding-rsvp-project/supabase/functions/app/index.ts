const bucket = "wedding-rsvp";
const prefix = "dist";

const contentTypes: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

function extension(pathname: string) {
  const match = pathname.match(/\.[a-z0-9]+$/i);
  return match?.[0].toLowerCase() || ".html";
}

function normalizePath(url: URL) {
  let pathname = decodeURIComponent(url.pathname);
  pathname = pathname.replace(/^\/functions\/v1\/app/, "");
  pathname = pathname.replace(/^\/app/, "");
  if (pathname === "" || pathname === "/") return "/index.html";
  return pathname;
}

async function fetchObject(origin: string, pathname: string) {
  const objectUrl = `${origin}/storage/v1/object/public/${bucket}/${prefix}${pathname}`;
  return fetch(objectUrl);
}

Deno.serve(async (request) => {
  const url = new URL(request.url);
  const pathname = normalizePath(url);
  const response = await fetchObject(url.origin, pathname);
  const fileResponse = response.ok ? response : await fetchObject(url.origin, "/index.html");
  const headers = new Headers();

  headers.set("content-type", contentTypes[extension(response.ok ? pathname : "/index.html")] || "application/octet-stream");
  headers.set("cache-control", pathname.startsWith("/assets/") ? "public, max-age=31536000, immutable" : "no-cache");
  headers.set("access-control-allow-origin", "*");

  return new Response(fileResponse.body, {
    status: fileResponse.ok ? 200 : 404,
    headers,
  });
});
