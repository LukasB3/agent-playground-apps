(function () {
  var $ = function (id) { return document.getElementById(id); };
  var bill = $('bill'), custom = $('custom'), people = $('people'), round = $('round');
  var tipPct = 20;

  function money(n) { return n.toFixed(2); }

  function calc() {
    var b = Math.max(0, parseFloat(bill.value) || 0);
    var p = Math.max(1, Math.floor(parseFloat(people.value) || 1));
    var t = custom.value !== '' ? Math.max(0, parseFloat(custom.value) || 0) : tipPct;
    var tip = b * t / 100;
    var total = b + tip;
    var share = total / p;
    var note = '';
    if (round.checked && b > 0) {
      var up = Math.ceil(share - 1e-9);
      note = 'Rounded up: group pays ' + money(up * p) + ' (extra ' + money(up * p - total) + ' tip).';
      share = up;
    } else if (p > 1 && b > 0) {
      note = 'Tip per person: ' + money(tip / p);
    }
    $('perPerson').textContent = money(share);
    $('tipTotal').textContent = money(tip);
    $('total').textContent = money(round.checked ? share * p : total);
    $('note').textContent = note;
  }

  function setTip(v) {
    tipPct = v;
    Array.prototype.forEach.call($('tips').children, function (b) {
      b.classList.toggle('active', custom.value === '' && Number(b.dataset.tip) === v);
    });
    calc();
  }

  $('tips').addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    custom.value = '';
    setTip(Number(b.dataset.tip));
  });
  custom.addEventListener('input', function () { setTip(tipPct); });
  [bill, people, round].forEach(function (el) { el.addEventListener('input', calc); });
  $('form').addEventListener('submit', function (e) { e.preventDefault(); });
  $('plus').addEventListener('click', function () {
    people.value = (Math.max(1, parseInt(people.value, 10) || 1)) + 1; calc();
  });
  $('minus').addEventListener('click', function () {
    people.value = Math.max(1, (parseInt(people.value, 10) || 1) - 1); calc();
  });
  $('reset').addEventListener('click', function () {
    bill.value = ''; custom.value = ''; people.value = 1; round.checked = false; setTip(20);
  });
  setTip(20);
})();
