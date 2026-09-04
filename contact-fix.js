const contactLocations={et:'Narva, Eesti',en:'Narva, Estonia',ru:'Нарва, Эстония'};
function setContactLocation(){const language=localStorage.getItem('ftordent-language')||'et';document.querySelectorAll('[data-i18n="address"]').forEach(item=>item.textContent=contactLocations[language]);}
setContactLocation();document.querySelectorAll('.lang').forEach(button=>button.addEventListener('click',setContactLocation));
