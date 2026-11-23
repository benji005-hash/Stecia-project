(function () {
  'use strict';

  /* Mobile navigation */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      nav.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); toggle.focus(); }
    });
    window.matchMedia('(min-width: 861px)').addEventListener('change', function () { setOpen(false); });
  }

  /* Contact form: validate, then open the visitor's email app with the enquiry prefilled */
  var form = document.getElementById('enquiry-form');
  if (!form) return;

  var status = document.getElementById('form-status');
  var rules = {
    name: function (v) { return v.trim().length >= 2 || 'Enter your full name.'; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Enter a valid email address, such as name@example.com.'; },
    phone: function (v) { return v.trim() === '' || /^\+?[0-9\s()-]{7,18}$/.test(v.trim()) || 'Enter a valid phone number, such as +260 97 000 0000.'; },
    service: function (v) { return v !== '' || 'Select the service you need.'; },
    message: function (v) { return v.trim().length >= 10 || 'Describe your project in at least 10 characters.'; }
  };

  function check(field) {
    var input = form.elements[field];
    var wrap = input.closest('.field');
    var result = rules[field](input.value);
    var error = wrap.querySelector('.field__error');
    wrap.classList.toggle('has-error', result !== true);
    input.setAttribute('aria-invalid', String(result !== true));
    error.textContent = result === true ? '' : result;
    return result === true;
  }

  Object.keys(rules).forEach(function (f) {
    form.elements[f].addEventListener('blur', function () { check(f); });
    form.elements[f].addEventListener('input', function () {
      if (form.elements[f].closest('.field').classList.contains('has-error')) check(f);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var firstInvalid = null;
    Object.keys(rules).forEach(function (f) {
      if (!check(f) && !firstInvalid) firstInvalid = form.elements[f];
    });
    if (firstInvalid) { firstInvalid.focus(); return; }

    var v = function (n) { return form.elements[n].value.trim(); };
    var body = 'Name: ' + v('name') + '\nEmail: ' + v('email') +
      (v('phone') ? '\nPhone: ' + v('phone') : '') +
      '\nService: ' + v('service') + '\n\n' + v('message');
    var href = 'mailto:info@steciadigtech.com?subject=' +
      encodeURIComponent('Enquiry: ' + v('service')) + '&body=' + encodeURIComponent(body);

    status.hidden = false;
    status.textContent = 'Your email app should open with the enquiry ready to send. If it does not, email info@steciadigtech.com directly.';
    window.location.href = href;
  });
})();
