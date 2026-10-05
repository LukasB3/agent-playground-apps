(function () {
  var TOTAL = 5 * 60 * 1000;
  var CIRC = 2 * Math.PI * 54;
  var remaining = TOTAL;
  var endAt = 0;
  var timer = null;

  var timeEl = document.getElementById('time');
  var bar = document.getElementById('bar');
  var startBtn = document.getElementById('start');
  var pauseBtn = document.getElementById('pause');
  var resetBtn = document.getElementById('reset');
  var done = document.getElementById('done');
  var qrBox = document.getElementById('qr');

  function render() {
    var s = Math.ceil(remaining / 1000);
    var text = String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
    timeEl.textContent = text;
    document.title = text + ' - Timer';
    bar.style.strokeDashoffset = String(CIRC * (1 - remaining / TOTAL));
  }

  function stop() {
    clearInterval(timer);
    timer = null;
  }

  function showQr() {
    var qr = qrcode(0, 'M');
    qr.addData('Time is up!');
    qr.make();
    qrBox.innerHTML = qr.createSvgTag({ cellSize: 6, margin: 2, scalable: true });
    done.hidden = false;
  }

  function tick() {
    remaining = Math.max(0, endAt - Date.now());
    render();
    if (remaining === 0) {
      stop();
      startBtn.disabled = true;
      pauseBtn.disabled = true;
      showQr();
    }
  }

  startBtn.addEventListener('click', function () {
    if (timer || remaining === 0) return;
    endAt = Date.now() + remaining;
    timer = setInterval(tick, 200);
    startBtn.disabled = true;
    pauseBtn.disabled = false;
  });

  pauseBtn.addEventListener('click', function () {
    if (!timer) return;
    tick();
    stop();
    startBtn.textContent = 'Resume';
    startBtn.disabled = remaining === 0;
    pauseBtn.disabled = true;
  });

  resetBtn.addEventListener('click', function () {
    stop();
    remaining = TOTAL;
    startBtn.textContent = 'Start';
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    done.hidden = true;
    qrBox.innerHTML = '';
    render();
  });

  render();
})();
