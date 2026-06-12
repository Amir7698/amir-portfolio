browser.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type !== "fetch-abadis") return;

  const word = encodeURIComponent(msg.word.trim().toLowerCase());
  const url = `https://abadis.ir/entofa/${word}/`;

  return fetch(url)
    .then(r => r.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      const results = [];

      // Each user suggestion is a div.cmt
      // Attributes: f=author, l=likes, d=dislikes
      // Inner text = definition
      doc.querySelectorAll("div.cmt").forEach(el => {
        const author = el.getAttribute("f") || "";
        const likes  = el.getAttribute("l") || "0";
        const dislikes = el.getAttribute("d") || "0";

        // Get text content, strip <br> and trim
        const definition = el.textContent.trim().replace(/\s+/g, " ");

        if (definition.length > 0) {
          results.push({ author, definition, likes, dislikes });
        }
      });

      return { results: results.slice(0, 10), url };
    })
    .catch(err => ({ error: err.message, url: `https://abadis.ir/entofa/${word}/` }));
});
