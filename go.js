// go.avail.asia — адрес только для личных ссылок подготовленных объявлений
// (CRM, этап 10б, docs/crm/phase10b_invite_app.md §2.0 п.1, §2.4).
//
// Если приложение Avail установлено (и знает этот домен), ссылка
// https://go.avail.asia/i/?k=КОД открывает его сама (Universal Link /
// App Link) — до этой страницы дело не доходит. Если нет — страница сразу
// уводит на сайт: https://avail.asia/i/?k=КОД&…&from=go, со всеми
// параметрами исходной ссылки. Короткая форма /i/КОД (через 404.html) —
// туда же. Кнопка «Уже есть приложение? Открыть» на avail.asia/i/
// добавляет src=page: если мы здесь, приложения нет → noapp=1, и страница
// сайта покажет «Сначала скачайте». .well-known не трогаем (эти файлы
// отдаются как есть, без перенаправлений). Всё остальное — на главную.
// Уводим только на https://avail.asia — чужой адрес сюда не подставить.
(function () {
  "use strict";
  var SITE = "https://avail.asia";
  var path = String(location.pathname || "/");
  if (/^\/\.well-known\//.test(path)) return;
  var short = /^\/i\/([0-9A-Za-z-]{3,32})\/?$/.exec(path);
  var page = /^\/i(\/(index\.html)?)?$/.test(path);
  var q = null;
  try {
    q = new URLSearchParams(location.search || "");
  } catch (e) {
    q = null;
  }
  if (!q || (!short && !page)) {
    location.replace(SITE + "/");
    return;
  }
  var out = new URLSearchParams();
  if (short) out.append("k", short[1]);
  q.forEach(function (v, key) {
    if (key === "from" || key === "noapp" || (short && key === "k")) return;
    out.append(key, v);
  });
  out.append("from", "go");
  if (q.get("src") === "page") out.append("noapp", "1");
  location.replace(SITE + "/i/?" + out.toString());
})();
