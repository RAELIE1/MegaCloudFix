// Intercept fetch and XHR at the page level to catch requests
// that may originate from iframes or injected scripts

(function () {
  const TARGET = "megacloud.blog";
  const REPLACE = "megacloud.tv";

  function fixUrl(url) {
    if (typeof url === "string" && url.includes(TARGET)) {
      return url.replace(TARGET, REPLACE);
    }
    return url;
  }

  const originalFetch = window.fetch;
  window.fetch = function (input, init) {
    if (typeof input === "string") {
      input = fixUrl(input);
    } else if (input instanceof Request) {
      input = new Request(fixUrl(input.url), input);
    }
    return originalFetch.call(this, input, init);
  };

  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    return originalOpen.call(this, method, fixUrl(url), ...rest);
  };

  function fixIframe(el) {
    if (el.tagName === "IFRAME") {
      const src = el.getAttribute("src");
      if (src && src.includes(TARGET)) {
        el.setAttribute("src", src.replace(TARGET, REPLACE));
      }
    }
  }

  document.querySelectorAll("iframe").forEach(fixIframe);

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== 1) continue;
        fixIframe(node);
        node.querySelectorAll && node.querySelectorAll("iframe").forEach(fixIframe);
      }
      if (mutation.type === "attributes" && mutation.target.tagName === "IFRAME") {
        fixIframe(mutation.target);
      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["src"],
  });
})();
