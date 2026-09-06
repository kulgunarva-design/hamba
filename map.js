(() => {
  const labels = {
    et:{title:'Kuidas meid leida',route:'Ava teekond Google Mapsis',frame:'Kaart: FTORDENT, Rahu 34a, Narva'},
    ru:{title:'Как нас найти',route:'Построить маршрут',frame:'Карта: FTORDENT, Rahu 34a, Нарва'},
    en:{title:'How to find us',route:'Get directions',frame:'Map: FTORDENT, Rahu 34a, Narva'}
  };
  function translateMap() {
    const text = labels[document.documentElement.lang] || labels.et;
    document.querySelectorAll('[data-map]').forEach(el => { el.textContent = text[el.dataset.map]; });
    document.querySelectorAll('.clinic-map iframe').forEach(el => { el.title = text.frame; });
  }
  translateMap();
  document.querySelectorAll('.lang').forEach(button => button.addEventListener('click', translateMap));
})();
