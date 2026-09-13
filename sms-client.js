// Shared booking handler. The filename is retained for existing page references.
(() => {
  const messages = {
    ru: { invalid: 'Проверьте имя, телефон и дату: день не должен быть в прошлом.', sending: 'Переходим к отправке заявки по email…' },
    et: { invalid: 'Kontrollige nime, telefoni ja kuupäeva. Päev ei tohi olla minevikus.', sending: 'Suundume taotluse saatmisele e-postiga…' },
    en: { invalid: 'Check your name, phone and date. The day cannot be in the past.', sending: 'Continuing to send your request by email…' }
  };
  document.addEventListener('submit', event => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement) || !(form.id === 'booking-form' || form.id === 'quick-booking' || form.closest('dialog'))) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (form.dataset.sending === 'true') return;
    const value = selector => form.querySelector(selector)?.value.trim() || '';
    const name = value('[name="name"], #name, #quick-name');
    const phone = value('[name="phone"], #phone, #quick-phone');
    const day = value('[name="day"], #date, #quick-date');
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Tallinn', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
    const t = messages[document.documentElement.lang] || messages.et;
    let status = form.querySelector('.email-status');
    if (!status) {
      status = document.createElement('p');
      status.className = 'email-status';
      status.setAttribute('role', 'status');
      form.append(status);
    }
    if (!form.reportValidity() || !name || name.length > 80 || /[\r\n]/.test(name) || !/^\+?[\d ()-]{7,25}$/.test(phone) || phone.replace(/\D/g, '').length < 7 || !/^\d{4}-\d{2}-\d{2}$/.test(day) || !Number.isFinite(Date.parse(day)) || new Date(day).toISOString().slice(0, 10) !== day || day < today) {
      status.textContent = t.invalid;
      return;
    }
    const outgoing = document.createElement('form');
    outgoing.method = 'POST';
    outgoing.action = 'https://formsubmit.co/ftordent@mail.ru';
    outgoing.acceptCharset = 'UTF-8';
    outgoing.hidden = true;
    const fields = {
      name, phone, day,
      _subject: 'FTORDENT — новая заявка на приём',
      _template: 'table'
    };
    for (const [key, content] of Object.entries(fields)) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = content;
      outgoing.append(input);
    }
    document.body.append(outgoing);
    status.textContent = t.sending;
    form.dataset.sending = 'true';
    HTMLFormElement.prototype.submit.call(outgoing);
    outgoing.remove();
    // Allow retry if navigation is blocked, and when returning with Back.
    window.setTimeout(() => { delete form.dataset.sending; }, 3000);
  }, true);
  window.addEventListener('pageshow', () => {
    document.querySelectorAll('form[data-sending]').forEach(form => { delete form.dataset.sending; });
  });
})();
