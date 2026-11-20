/* VitalPath Care Group — News Center renderer.
 *
 * Reads the story store from news-data.js (window.VITALPATH_NEWS),
 * sorts stories newest first by dateISO, and renders them into the
 * two lane sections of vitalpath-news.html / medical-news.html:
 *   #news-florida  <- stories with lane "florida"
 *   #news-national <- stories with lane "national"
 * It also fills #news-edition-line with the latest story's date.
 *
 * Story text is inserted with textContent only — never as HTML —
 * and the data model carries no link or URL field, so the rendered
 * news content can contain no outbound doors.
 */
(function () {
  var stories = (window.VITALPATH_NEWS || []).slice().sort(function (a, b) {
    if (a.dateISO === b.dateISO) return 0;
    return a.dateISO < b.dateISO ? 1 : -1;
  });

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function renderStory(story) {
    var card = el("article", "card story");
    card.appendChild(el("p", "meta", story.dateDisplay));
    card.appendChild(el("h3", null, story.headline));
    (story.body || []).forEach(function (paragraph) {
      card.appendChild(el("p", null, paragraph));
    });
    card.appendChild(el("p", "story-source", story.source));
    return card;
  }

  function fillLane(elementId, lane) {
    var host = document.getElementById(elementId);
    if (!host) return;
    stories
      .filter(function (story) { return story.lane === lane; })
      .forEach(function (story) { host.appendChild(renderStory(story)); });
  }

  fillLane("news-florida", "florida");
  fillLane("news-national", "national");

  var editionLine = document.getElementById("news-edition-line");
  if (editionLine && stories.length) {
    editionLine.textContent =
      "Latest edition: " + stories[0].dateDisplay + " · " + stories.length + " stories";
  }
})();
