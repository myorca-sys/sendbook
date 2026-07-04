export async function getFinalRedirectUrl(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });
    return res.url || url;
  } catch (e) {
    return url;
  }
}

export async function resolveSamehadaku(data: any[]): Promise<any[]> {
  const isSamehadakuUrl = data[0].url && data[0].url.startsWith("ajax://");
  if (!data[0].data_post && !isSamehadakuUrl) return data;

  console.log(`[ClientResolver] Resolving Samehadaku for ${data.length} sources in parallel`);
  const ajaxUrl = `https://v2.samehadaku.how/wp-admin/admin-ajax.php`;
  const baseUrl = `https://v2.samehadaku.how`;

  const promises = data.map(async (source) => {
    try {
      let post, nume, type;
      if (source.url && source.url.startsWith("ajax://")) {
        const parts = source.url.replace("ajax://", "").split("/");
        post = parts[0];
        nume = parts[1];
        type = parts[2];
      } else {
        post = source.data_post;
        nume = source.data_nume;
        type = source.data_type;
      }

      const formData = new URLSearchParams();
      formData.append("action", "player_ajax");
      formData.append("post", post);
      formData.append("nume", nume);
      formData.append("type", type);

      const res = await fetch(ajaxUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "X-Requested-With": "XMLHttpRequest",
          Referer: baseUrl,
        },
        body: formData.toString(),
      });

      if (res.ok) {
        const ajaxHtml = await res.text();
        const iframeMatch = ajaxHtml.match(/src=["'](.*?)["']/i);
        if (iframeMatch && iframeMatch[1]) {
          let videoUrl = iframeMatch[1];

          // WIBUFILE SECOND-STAGE EXTRACTION
          if (videoUrl.toLowerCase().includes("wibufile.com/embed/")) {
            try {
              console.log(`[ClientResolver] Samehadaku: Extracting wibufile embed: ${videoUrl}`);
              const wibuRes = await fetch(videoUrl, {
                headers: {
                  Referer: baseUrl,
                  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                },
              });
              if (wibuRes.ok) {
                const wibuHtml = await wibuRes.text();
                const fileMatch = wibuHtml.match(/["']file["']\s*:\s*["']([^"']+)["']/i);
                if (fileMatch && fileMatch[1]) {
                  videoUrl = fileMatch[1].replace(/\\/g, "");
                  console.log(`[ClientResolver] Samehadaku: wibufile resolved to direct mp4: ${videoUrl}`);
                }
              }
            } catch (wibuErr: any) {
              console.warn(`[ClientResolver] Samehadaku wibufile extraction failed:`, wibuErr.message);
            }
          }

          return {
            label: source.label || source.quality || "Auto",
            src: videoUrl,
            url: videoUrl, // Map to url for sourceMapper compatibility
            quality: source.quality,
          };
        }
      }
    } catch (e: any) {
      console.error(`[ClientResolver] Samehadaku Ajax Resolution Failed for ${source.label}`, e.message);
    }
    return null;
  });

  const results = await Promise.all(promises);
  const resolvedData = results.filter((r) => r !== null) as any[];
  
  return resolvedData.length > 0 ? resolvedData : data;
}
