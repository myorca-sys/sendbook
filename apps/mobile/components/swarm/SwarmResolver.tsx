import React, { useRef, useState } from "react";
import { View, StyleSheet, Platform, Text } from "react-native";
import { WebView } from "react-native-webview";

const EDGE_API_URL =
  process.env.EXPO_PUBLIC_EDGE_URL ||
  "https://orcanime-api-edge.moehamadhkl.workers.dev";

interface SwarmResolverProps {
  url: string;
  provider: string;
  endpoint: string;
  onSuccess: (localData?: any[]) => void;
  onError: (msg: string) => void;
}

export function SwarmResolver({
  url,
  provider,
  endpoint,
  onSuccess,
  onError,
}: SwarmResolverProps) {
  const webviewRef = useRef<WebView>(null);
  const [bypassing, setBypassing] = useState(true);
  const [isInteractive, setIsInteractive] = useState(false);
  const attempts = useRef(0);

  // Build inject script based on provider/endpoint
  // For kuronime/video_sources: wait 8s for animeku.js to render, then extract video src from DOM
  // For others: send raw HTML to Edge for DREAS parsing
  const isKuronimeVideoSources = provider === 'kuronime' && endpoint === 'video_sources';
  const isSamehadakuVideoSources = provider === 'samehadaku' && endpoint === 'video_sources';

  const injectScript = isKuronimeVideoSources ? `
    (function() {
      const startTime = Date.now();
      const intervalId = setInterval(function() {
        let isChallenge = false;
        try {
          const bodyText = document.body ? document.body.innerText : '';
          isChallenge = bodyText.includes('Just a moment') || bodyText.includes('cf-browser-verification') || bodyText.includes('challenge-running') || document.body.innerHTML.length < 500;
        } catch(e) { isChallenge = true; }

        if (isChallenge) {
          if (Date.now() - startTime > 1500) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: "swarm_challenge_visible" }));
          }
          if (Date.now() - startTime > 20000) {
            clearInterval(intervalId);
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: "swarm_extraction", isChallenge: true }));
          }
          return;
        }

        // 1. Coba cari req_id dari script tag menggunakan regex bebas backslash escape
        let reqId = null;
        try {
          const allScripts = document.querySelectorAll('script');
          for (let i = 0; i < allScripts.length; i++) {
            const text = allScripts[i].textContent || '';
            const match = text.match(/(?:var|let|const) _0x[a-zA-Z0-9]+ *= *["']([A-Za-z0-9+/=]{50,})["']/);
            if (match && match[1]) {
              reqId = match[1];
              break;
            }
          }
        } catch(e) {}

        if (reqId) {
          clearInterval(intervalId);
          
          const targetApi = "https://animeku.org/api/v9/sources";
          fetch(targetApi, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Referer": window.location.href
            },
            body: JSON.stringify({ id: reqId })
          })
          .then(function(res) {
            if (res.ok) return res.json();
            throw new Error("HTTP " + res.status);
          })
          .then(function(json) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: "swarm_extraction",
              isChallenge: false,
              videoSources: [{
                req_id: reqId,
                url: "req_id://" + reqId + "//",
                quality: "Auto",
                type: "iframe",
                provider: "Kuronime",
                __kuronime_prefetched: json
              }]
            }));
          })
          .catch(function(err) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: "swarm_extraction",
              isChallenge: false,
              videoSources: [{
                req_id: reqId,
                url: "req_id://" + reqId + "//",
                quality: "Auto",
                type: "iframe",
                provider: "Kuronime"
              }]
            }));
          });
          return;
        }

        // 2. Fallback jika sudah lewat 3 detik
        if (Date.now() - startTime > 3000) {
          clearInterval(intervalId);
          const videoSources = [];
          
          try {
            const pembed = document.getElementById('pembed');
            if (pembed) {
              const iframes = pembed.querySelectorAll('iframe');
              iframes.forEach(function(iframe) {
                if (iframe.src && iframe.src.startsWith('http')) {
                  videoSources.push({ url: iframe.src, quality: 'Auto', type: 'iframe', provider: 'Kuronime' });
                }
              });
            }
          } catch(e) {}

          if (videoSources.length === 0) {
            try {
              const allScripts = document.querySelectorAll('script');
              allScripts.forEach(function(s) {
                const text = s.textContent || '';
                const hlsMatches = text.match(/https?:\\/\\/[^"' ]+\\.m3u8[^"' ]*/g);
                if (hlsMatches) hlsMatches.forEach(function(u) { videoSources.push({ url: u, quality: 'Auto', type: 'hls', provider: 'Kuronime' }); });
              });
            } catch(e) {}
          }

          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: "swarm_extraction",
            isChallenge: false,
            videoSources: videoSources
          }));
        }
      }, 200);
    })();
    true;
  ` : isSamehadakuVideoSources ? `
    (function() {
      const startTime = Date.now();
      const intervalId = setInterval(async function() {
        let isChallenge = false;
        try {
          const bodyText = document.body ? document.body.innerText : '';
          isChallenge = bodyText.includes('Just a moment') || bodyText.includes('cf-browser-verification') || bodyText.includes('challenge-running') || document.body.innerHTML.length < 500;
        } catch(e) { isChallenge = true; }

        if (isChallenge) {
          if (Date.now() - startTime > 1500) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: "swarm_challenge_visible" }));
          }
          if (Date.now() - startTime > 20000) {
            clearInterval(intervalId);
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: "swarm_extraction", isChallenge: true }));
          }
          return;
        }

        const options = document.querySelectorAll('.east_player_option');
        if (options && options.length > 0) {
          clearInterval(intervalId);
          const rawSources = [];
          try {
            options.forEach(function(opt) {
              const post = opt.getAttribute('data-post');
              const nume = opt.getAttribute('data-nume');
              const type = opt.getAttribute('data-type');
              const labelEl = opt.querySelector('span');
              const label = labelEl ? labelEl.textContent.trim() : 'Server';
              
              if (post && nume) {
                const labelLower = label.toLowerCase();
                const isTrusted = labelLower.includes('kuro') || 
                                  labelLower.includes('wibu') || 
                                  labelLower.includes('pixel') || 
                                  labelLower.includes('drive') || 
                                  labelLower.includes('direct') || 
                                  labelLower.includes('mp4upload');
                
                if (isTrusted) {
                  rawSources.push({ post: post, nume: nume, type: type || '', label: label });
                }
              }
            });

            // Fallback jika tidak ada server terpercaya yang terdeteksi
            if (rawSources.length === 0) {
              options.forEach(function(opt) {
                const post = opt.getAttribute('data-post');
                const nume = opt.getAttribute('data-nume');
                const type = opt.getAttribute('data-type');
                const labelEl = opt.querySelector('span');
                const label = labelEl ? labelEl.textContent.trim() : 'Server';
                if (post && nume) {
                  rawSources.push({ post: post, nume: nume, type: type || '', label: label });
                }
              });
            }
          } catch(e) {}

          if (rawSources.length === 0) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: "swarm_extraction",
              isChallenge: false,
              videoSources: []
            }));
            return;
          }

          const videoSources = [];
          const ajaxUrl = window.location.origin + '/wp-admin/admin-ajax.php';

          const promises = rawSources.map(async function(src) {
            const controller = new AbortController();
            const timeoutId = setTimeout(function() { controller.abort(); }, 3500);

            try {
              const body = 'action=player_ajax&post=' + encodeURIComponent(src.post) + '&nume=' + encodeURIComponent(src.nume) + '&type=' + encodeURIComponent(src.type);
              const res = await fetch(ajaxUrl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'X-Requested-With': 'XMLHttpRequest'
                },
                body: body,
                signal: controller.signal
              });
              
              clearTimeout(timeoutId);
              
              if (res.ok) {
                const ajaxHtml = await res.text();
                const iframeMatch = ajaxHtml.match(/src=["'](.*?)["']/i);
                if (iframeMatch && iframeMatch[1]) {
                  videoSources.push({
                    url: iframeMatch[1],
                    quality: src.label,
                    type: 'iframe',
                    provider: 'Samehadaku'
                  });
                }
              }
            } catch(err) {
              clearTimeout(timeoutId);
              console.error(err);
            }
          });

          await Promise.all(promises);

          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: "swarm_extraction",
            isChallenge: false,
            videoSources: videoSources
          }));
          return;
        }

        if (Date.now() - startTime > 4000) {
          clearInterval(intervalId);
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: "swarm_extraction",
            isChallenge: false,
            videoSources: []
          }));
        }
      }, 200);
    })();
    true;
  ` : `
    setTimeout(async function() {
      let html = "";
      try {
        html = document.documentElement ? document.documentElement.outerHTML : "";
      } catch (e) {}

      const isChallenge = !html || html.length < 500 || html.includes('Just a moment...') || html.includes('cf-browser-verification') || html.includes('cf-please-wait') || html.includes('challenge-running');
      if (isChallenge) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: "swarm_challenge_visible" }));
      }
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: "swarm_extraction", html: html, isChallenge: isChallenge }));
    }, 3000);
    true;
  `;

  const handleMessage = async (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "swarm_challenge_visible") {
        console.log(`[Swarm] Cloudflare Turnstile challenge detected. Showing WebView interactively...`);
        setIsInteractive(true);
        return;
      }

      if (data.type !== "swarm_extraction") {
        // Abaikan postMessage dari script eksternal
        return;
      }

      if (data.isChallenge) {
        attempts.current += 1;
        console.log(
          `[Swarm] [Attempt ${attempts.current}] Cloudflare challenge detected. Waiting for resolution...`,
        );
        if (attempts.current > 5) {
          console.log(`[Swarm] Max attempts reached. Failing.`);
          onError("Gagal menembus proteksi keamanan situs (Timeout).");
        } else {
          // Re-inject after a delay to check again
          setTimeout(() => {
            webviewRef.current?.injectJavaScript(injectScript);
          }, 5000);
        }
        return;
      }

      if (isKuronimeVideoSources || isSamehadakuVideoSources) {
        const { videoSources } = data;
        console.log(`[Swarm] ${provider} DOM extracted ${videoSources?.length || 0} sources.`);

        if (!videoSources || videoSources.length === 0) {
          console.log(`[Swarm] No sources found in DOM. Episode may not be available.`);
          onError("Sumber video tidak tersedia di halaman ini.");
          return;
        }

        // Pemicu sync Edge di latar belakang (fire-and-forget)
        fetch(`${EDGE_API_URL}/api/edge-scrape/swarm`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ provider, endpoint, url, videoSources }),
        }).catch((err) => {
          console.warn("[Swarm] Background Edge cache sync error:", err.message);
        });

        console.log(`[Swarm] ${provider} resolving instantly using locally extracted sources.`);
        setBypassing(false);
        onSuccess(videoSources);
        return;
      }

      // Default mode: send raw HTML to Edge for DREAS parsing
      console.log(
        `[Swarm] Cloudflare bypassed! HTML extracted (${data.html?.length || 0} bytes).`,
      );

      const swarmRes = await fetch(`${EDGE_API_URL}/api/edge-scrape/swarm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          endpoint,
          html: data.html,
          url,
        }),
      });

      const swarmJson = await swarmRes.json();

      if (swarmRes.ok && swarmJson.success) {
        console.log(
          `[Swarm] Contribution accepted! Edge Cache updated (${swarmJson.extracted_items} items).`,
        );
        setBypassing(false);
        onSuccess();
      } else {
        console.log(`[Swarm] Edge rejected contribution:`, swarmJson.error);
        onError(swarmJson.error || "Edge API menolak data Swarm");
      }
    } catch (e: any) {
      console.error(`[Swarm] Message handling error:`, e.message);
      onError(e.message);
    }
  };

  if (!bypassing) return null;

  return (
    <View 
      style={isInteractive ? styles.interactiveContainer : styles.ghostContainer} 
      pointerEvents={isInteractive ? "auto" : "none"}
    >
      {isInteractive && (
        <View style={styles.header}>
          <Text style={styles.headerText}>Selesaikan Tantangan Keamanan</Text>
        </View>
      )}
      <WebView
        ref={webviewRef}
        source={{ uri: url }}
        userAgent={
          Platform.OS === "android"
            ? "Mozilla/5.0 (Linux; Android 13; SM-S901B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36"
            : "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1"
        }
        javaScriptEnabled={true}
        domStorageEnabled={true}
        thirdPartyCookiesEnabled={true}
        sharedCookiesEnabled={true}
        mixedContentMode="always"
        injectedJavaScript={injectScript}
        onMessage={handleMessage}
        onLoadEnd={() => {
          console.log(
            `[Swarm] WebView loaded URL: ${url}. Injecting extraction script...`,
          );
          webviewRef.current?.injectJavaScript(injectScript);
        }}
        onError={(syn) => {
          console.error(
            `[Swarm] ❌ WebView Error:`,
            syn.nativeEvent.description,
          );
          onError("Gagal memuat halaman sumber.");
        }}
        style={isInteractive ? styles.interactiveWebview : styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  ghostContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 1,
    height: 1,
    opacity: 0.01,
    overflow: "hidden",
    zIndex: -999,
  },
  webview: {
    width: 1,
    height: 1,
  },
  interactiveContainer: {
    position: "absolute",
    top: "15%",
    left: "5%",
    width: "90%",
    height: 380,
    backgroundColor: "#0d0c1d",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.15)",
    overflow: "hidden",
    zIndex: 99999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 20,
    flexDirection: "column",
  },
  header: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#16152e",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
  },
  headerText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  interactiveWebview: {
    flex: 1,
    backgroundColor: "#0d0c1d",
  },
});
