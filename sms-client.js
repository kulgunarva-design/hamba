(() => {
  const messages = {
    ru: {notice:'Оставьте имя, телефон и желаемый день. Клиника свяжется с вами для подтверждения записи.',preview:'Тестовый режим: SMS не отправлено. Так будет выглядеть заявка на +372 53911527:',accepted:'SMS-сервис принял заявку к отправке. Дождитесь звонка клиники для подтверждения записи.',error:'Не удалось подтвердить отправку. Позвоните в клинику: +372 53911527.',invalid:'Проверьте имя, телефон и дату: день не должен быть в прошлом.',limit:'Слишком много заявок. Позвоните в клинику: +372 53911527.',local:'Для проверки формы запустите локальный сервер и откройте http://localhost:3000.'},
    et: {notice:'Jätke nimi, telefon ja soovitud päev. Kliinik võtab teiega aja kinnitamiseks ühendust.',preview:'Testrežiim: SMS-i ei saadetud. Taotlus numbrile +372 53911527:',accepted:'SMS-teenus võttis taotluse saatmiseks vastu. Oodake kliiniku kõnet aja kinnitamiseks.',error:'Saatmist ei õnnestunud kinnitada. Helistage: +372 53911527.',invalid:'Kontrollige nime, telefoni ja kuupäeva. Päev ei tohi olla minevikus.',limit:'Liiga palju taotlusi. Helistage: +372 53911527.',local:'Käivitage kohalik server ja avage http://localhost:3000.'},
    en: {notice:'Leave your name, phone and preferred day. The clinic will contact you to confirm the appointment.',preview:'Test mode: no SMS was sent. Request preview for +372 53911527:',accepted:'The SMS service accepted your request for sending. Wait for the clinic to call and confirm your appointment.',error:'Sending could not be confirmed. Call the clinic: +372 53911527.',invalid:'Check your name, phone and date. The day cannot be in the past.',limit:'Too many requests. Call the clinic: +372 53911527.',local:'Start the local server and open http://localhost:3000.'}
  };
  const current = () => messages[document.documentElement.lang] || messages.et;
  const notice = () => { const el = document.querySelector('[data-b="notice"]'); if (el) el.textContent = current().notice; };
  notice();
  document.querySelectorAll('.lang').forEach(button => button.addEventListener('click', notice));
  document.addEventListener('submit', async event => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement) || !(form.id === 'booking-form' || form.id === 'quick-booking' || form.closest('dialog'))) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (form.dataset.sending === 'true' || form.dataset.sent === 'true') return;
    const value = selector => form.querySelector(selector)?.value.trim() || '';
    const data = {name:value('[name="name"], #name, #quick-name'),phone:value('[name="phone"], #phone, #quick-phone'),day:value('[name="day"], #date, #quick-date')};
    let status = form.querySelector('.sms-status');
    if (!status) { status = document.createElement('p'); status.className = 'sms-status'; status.setAttribute('role','status'); status.style.whiteSpace = 'pre-wrap'; form.append(status); }
    const t = current();
    if (location.protocol === 'file:') { status.textContent = t.local; return; }
    form.dataset.sending = 'true';
    const button = form.querySelector('[type="submit"]');
    if (button) button.disabled = true;
    status.textContent = '…';
    try {
      const response = await fetch('/api/booking', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:AbortSignal.timeout(20000)});
      const result = await response.json();
      if (!response.ok) { status.textContent = result.error === 'invalid' ? t.invalid : result.error === 'rate_limit' ? t.limit : t.error; return; }
      if (result.mode === 'preview') status.textContent = `${t.preview}\n\n${result.body}`;
      else if (result.mode === 'live' && result.status === 'accepted') { status.textContent = t.accepted; form.dataset.sent = 'true'; }
      else status.textContent = t.error;
    } catch { status.textContent = t.error; }
    finally { form.dataset.sending = 'false'; if (button && form.dataset.sent !== 'true') button.disabled = false; }
  }, true);
})();
