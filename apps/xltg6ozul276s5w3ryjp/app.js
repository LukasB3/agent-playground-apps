(function () {
  const LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  const boardEl = document.getElementById('board');
  const statusEl = document.getElementById('status');
  const scores = { X: 0, O: 0, D: 0 };
  let cells, board, current, over, starter = 'X';

  for (let i = 0; i < 9; i++) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'cell';
    b.setAttribute('aria-label', 'Feld ' + (i + 1));
    b.addEventListener('click', () => play(i));
    boardEl.appendChild(b);
  }
  cells = boardEl.children;

  function showTurn() {
    statusEl.textContent = 'Spieler ' + current + ' ist am Zug';
    document.getElementById('score-x').classList.toggle('active', current === 'X' && !over);
    document.getElementById('score-o').classList.toggle('active', current === 'O' && !over);
  }

  function newRound() {
    board = Array(9).fill('');
    over = false;
    current = starter;
    starter = starter === 'X' ? 'O' : 'X';
    for (const c of cells) { c.textContent = ''; c.disabled = false; c.className = 'cell'; }
    showTurn();
  }

  function updateScores() {
    document.getElementById('sx').textContent = scores.X;
    document.getElementById('so').textContent = scores.O;
    document.getElementById('sd').textContent = scores.D;
  }

  function play(i) {
    if (over || board[i]) return;
    board[i] = current;
    cells[i].textContent = current;
    cells[i].classList.add(current.toLowerCase());
    cells[i].disabled = true;
    const line = LINES.find(l => l.every(k => board[k] === current));
    if (line) {
      over = true;
      line.forEach(k => cells[k].classList.add('win'));
      scores[current]++;
      statusEl.textContent = 'Spieler ' + current + ' gewinnt! 🎉';
    } else if (board.every(Boolean)) {
      over = true;
      scores.D++;
      statusEl.textContent = 'Unentschieden!';
    } else {
      current = current === 'X' ? 'O' : 'X';
      showTurn();
      return;
    }
    for (const c of cells) c.disabled = true;
    updateScores();
    document.getElementById('score-x').classList.remove('active');
    document.getElementById('score-o').classList.remove('active');
  }

  document.getElementById('again').addEventListener('click', newRound);
  document.getElementById('reset').addEventListener('click', () => {
    scores.X = scores.O = scores.D = 0;
    updateScores();
    starter = 'X';
    newRound();
  });
  newRound();
})();
