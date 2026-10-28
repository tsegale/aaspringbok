// Scroll motion: reveals .reveal blocks and draws the route map as they enter the viewport.
// The .js class is set inline in <head>; without it nothing is hidden.
(function () {
  var targets = document.querySelectorAll('.reveal, .route-map');
  if (!targets.length) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

  targets.forEach(function (el) { observer.observe(el); });
})();

// Quote form: validates input, then hands the request to the visitor's email app.
// There is no backend, so the page never claims the request was sent.
(function () {
  var form = document.getElementById('quote-form');
  if (!form) return;

  var RECIPIENT = form.getAttribute('action').replace('mailto:', '');
  var status = document.getElementById('form-status');
  var summary = document.getElementById('form-summary');
  var copyBtn = document.getElementById('copy-summary');
  var copyResult = document.getElementById('copy-result');

  form.setAttribute('novalidate', '');

  var rules = {
    name: function (v) { return v.trim().length > 0; },
    phone: function (v) { return v.replace(/[^0-9]/g, '').length >= 7; },
    email: function (v) { return v.trim() === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); },
    destination: function (v) { return v !== ''; },
    details: function (v) { return v.trim().length > 0; }
  };

  function setError(input, invalid) {
    var field = input.closest('.field');
    field.classList.toggle('has-error', invalid);
    if (invalid) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
  }

  function validate(input) {
    var rule = rules[input.name];
    if (!rule) return true;
    var ok = rule(input.value);
    setError(input, !ok);
    return ok;
  }

  Object.keys(rules).forEach(function (name) {
    var input = form.elements[name];
    input.addEventListener('blur', function () {
      if (input.value !== '' || input.hasAttribute('aria-invalid')) validate(input);
    });
    input.addEventListener('input', function () {
      if (input.hasAttribute('aria-invalid')) validate(input);
    });
  });

  function buildRequest() {
    var f = form.elements;
    var lines = [
      'Quote request from the website',
      '',
      'Name: ' + f.name.value.trim(),
      'Company: ' + (f.company.value.trim() || '-'),
      'Phone: ' + f.phone.value.trim(),
      'Email: ' + (f.email.value.trim() || '-'),
      'Route: Namibia to ' + f.destination.value,
      'Preferred loading date: ' + (f.loading_date.value || '-'),
      '',
      'Load details:',
      f.details.value.trim()
    ];
    return {
      subject: 'Quote request: Namibia to ' + f.destination.value,
      body: lines.join('\n')
    };
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var firstInvalid = null;
    Object.keys(rules).forEach(function (name) {
      var input = form.elements[name];
      if (!validate(input) && !firstInvalid) firstInvalid = input;
    });
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    var request = buildRequest();
    summary.textContent = 'To: ' + RECIPIENT + '\nSubject: ' + request.subject + '\n\n' + request.body;
    status.hidden = false;
    status.focus();

    window.location.href = 'mailto:' + RECIPIENT +
      '?cc=' + encodeURIComponent('admin@aaspringbok.net') +
      '&subject=' + encodeURIComponent(request.subject) +
      '&body=' + encodeURIComponent(request.body);
  });

  copyBtn.addEventListener('click', function () {
    if (!navigator.clipboard) {
      copyResult.textContent = 'Copying is not available in this browser. Select the text above and copy it.';
      return;
    }
    navigator.clipboard.writeText(summary.textContent).then(function () {
      copyResult.textContent = 'Copied.';
    }, function () {
      copyResult.textContent = 'Could not copy. Select the text above and copy it.';
    });
  });
})();
