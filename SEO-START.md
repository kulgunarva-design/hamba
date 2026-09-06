# Подготовка ftordent.eu к поиску

Подготовлены 15 статических страниц: эстонские в корне, русские в ru/, английские в en/. В исходном HTML есть тексты, уникальные заголовки и описания. Переключатели языка ведут на отдельные страницы; canonical и hreflang указывают на https://ftordent.eu. Созданы sitemap.xml и robots.txt. Разметка Dentist содержит адрес Rahu 34a, Narva, телефон +37253911527 и ftordent@mail.ru.

Поисковые темы (тематический список, а не исследование частотности):

| Страница | Русские фразы | Эстонские фразы |
| --- | --- | --- |
| Главная | стоматология Нарва, стоматолог в Нарве, FTORDENT | hambaarst Narvas, hambakliinik Narvas, FTORDENT |
| Услуги | лечение кариеса Нарва, профилактика зубов Нарва, ортодонтия Нарва | kaariese ravi Narvas, hammaste ennetav hooldus, ortodontia Narvas |
| О клинике | клиника FTORDENT Нарва | FTORDENT hambakliinik |
| Контакты | FTORDENT адрес, стоматология Раху 34а | FTORDENT kontaktid, hambaarst Rahu 34a |
| Запись | запись к стоматологу Нарва | hambaarsti aja broneerimine Narvas |

Перед публикацией подтвердите достоверность существующих на сайте услуг и утверждений об AI-диагностике, микроскопе и оборудовании. Они были в исходном сайте; SEO-подготовка не является их проверкой. Не добавляйте вымышленные отзывы, цены, часы работы или сведения о врачах.

## Публикация и регистрация

1. Разместите публичные HTML, CSS, JS, img/, ru/, en/, robots.txt и sitemap.xml на хостинге, подключите домен ftordent.eu и HTTPS. Файлы .env, server.mjs, START.cmd и инструкции не предназначены для раздачи посетителям. На GitHub Pages обработчик SMS не запускается; SMS ещё не подключены.
2. Проверьте https://ftordent.eu/, /ru/, /en/, /robots.txt и /sitemap.xml. Все должны открываться без входа в аккаунт. Пока сайт только на компьютере, зарегистрировать его для индексации нельзя.
3. В Google Search Console добавьте ресурс типа «Домен»: ftordent.eu. В панели DNS регистратора добавьте выданную Google TXT-запись и подтвердите владение. Затем отправьте https://ftordent.eu/sitemap.xml в разделе Sitemaps и проверьте главную страницу инструментом проверки URL.
4. В Bing Webmaster Tools добавьте сайт и подтвердите владение либо импортируйте подтверждённый ресурс из Google Search Console. Отправьте тот же sitemap.xml.
5. Проверьте отчёты об индексировании после обработки поисковиками. Отправка sitemap не гарантирует включения в индекс или конкретных позиций.

Регистрация в кабинетах поисковиков, настройка DNS, публикация сайта и проверка владения ещё НЕ выполнены.

При редактировании обновляйте страницы во всех трёх языковых версиях, а также используемые словари в app.js, booking.js и встроенном i18n на главной. При добавлении страниц обновляйте sitemap.xml и hreflang. Не заменяйте домен на github.io без согласованного обновления canonical и sitemap.

Источники:
- https://developers.google.com/search/docs/crawling-indexing/special-tags — Google не использует meta keywords для ранжирования.
- https://developers.google.com/search/docs/specialty/international/localized-versions — языковые версии и hreflang.
- https://support.google.com/webmasters/answer/7451001 — отправка sitemap в Google.
- https://www.bing.com/webmasters/help/sitemaps-3b5cf6ed — sitemap в Bing.
