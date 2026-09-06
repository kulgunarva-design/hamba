const contactLocations={et:'Rahu 34a, Narva, Eesti',en:'Rahu 34a, Narva, Estonia',ru:'Раху 34а, Нарва, Эстония'};
function setContactLocation(){const language=localStorage.getItem('ftordent-language')||'et';document.querySelectorAll('[data-i18n="address"]').forEach(item=>item.textContent=contactLocations[language]);}
setContactLocation();document.querySelectorAll('.lang').forEach(button=>button.addEventListener('click',setContactLocation));

