(function () {
  const presets = [10, 15, 18, 20, 25];
  let tipPct = 15;

  const bill = document.getElementById('bill');
  const custom = document.getElementById('custom');
  const people = document.getElementById('people');
  const chips = document.getElementById('chips');
  const error = document.getElementById('error');
  const perRow = document.getElementById('per-row');

  const fmt = n => '$' + n.toFixed(2);

  presets.forEach(p => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = p + '%';
    b.dataset.pct = p;
    chips.appendChild(b);
  });

  function markChips() {
    chips.querySelectorAll('button').forEach(b => {
      b.setAttribute('aria-pressed', String(!custom.value && Number(b.dataset.pct) === tipPct));
    });
  }

  function update() {
    error.textContent = '';
    let b = parseFloat(bill.value);
    if (bill.value !== '' && (isNaN(b) || b < 0)) {
      error.textContent = 'Enter a valid, non-negative bill amount.';
      b = 0;
    }
    if (isNaN(b)) b = 0;

    let pct = tipPct;
    if (custom.value !== '') {
      pct = parseFloat(custom.value);
      if (isNaN(pct) || pct < 0) pct = 0;
    }
    let n = Math.floor(parseFloat(people.value));
    if (!(n >= 1)) n = 1;

    const tip = Math.round(b * pct) / 100;
    const total = b + tip;
    document.getElementById('tip').textContent = fmt(tip);
    document.getElementById('total').textContent = fmt(total);
    perRow.hidden = n === 1;
    document.getElementById('per').textContent = fmt(total / n);
    markChips();
  }

  chips.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    tipPct = Number(b.dataset.pct);
    custom.value = '';
    update();
  });
  [bill, custom, people].forEach(el => el.addEventListener('input', update));
  document.getElementById('form').addEventListener('submit', e => e.preventDefault());
  update();
})();
