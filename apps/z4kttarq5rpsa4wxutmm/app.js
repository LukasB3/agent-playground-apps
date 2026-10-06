(function () {
  const LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  const boardEl = document.getElementById('board');
  const statusEl = document.getElementById('status');
  const scores = { X: 0, O: 0, D: 0 };
  const scoreEls = { X: document.getElementById('sx'), O: document.getElementById('so'), D: document.getElementById('sd') };
  let board, turn, over, starter = 'X';

  const cells = [];
  for (let i = 0; i < 9; i++) {
    const b = document.createElement('button');
    b.className = 'cell';
    b.setAttribute('aria-label', 'Cell ' + (i + 1));
    b.addEventListener('click', () => play(i));
    boardEl.appendChild(b);
    cells.push(b);
  }

  function render() {
    cells.forEach((c, i) => {
      c.textContent = board[i] || '';
      c.className = 'cell' + (board[i] ? ' ' + board[i].toLowerCase() : '');
      c.disabled = over || !!board[i];
    });
    document.getElementById('score-x').classList.toggle('active', !over && turn === 'X');
    document.getElementById('score-o').classList.toggle('active', !over && turn === 'O');
    for (const k in scores) scoreEls[k].textContent = scores[k];
  }

  function start() {
    board = Array(9).fill('');
    turn = starter;
    over = false;
    statusEl.textContent = 'Player ' + turn + '’s turn';
    render();
    starter = starter === 'X' ? 'O' : 'X';
  }

  function play(i) {
    if (over || board[i]) return;
    board[i] = turn;
    const line = LINES.find(l => l.every(k => board[k] === turn));
    if (line) {
      over = true;
      scores[turn]++;
      statusEl.textContent = 'Player ' + turn + ' wins! 🎉';
      render();
      line.forEach(k => cells[k].classList.add('win'));
      return;
    }
    if (board.every(Boolean)) {
      over = true;
      scores.D++;
      statusEl.textContent = 'It’s a draw!';
      render();
      return;
    }
    turn = turn === 'X' ? 'O' : 'X';
    statusEl.textContent = 'Player ' + turn + '’s turn';
    render();
  }

  document.getElementById('new').addEventListener('click', start);
  document.getElementById('reset').addEventListener('click', () => {
    scores.X = scores.O = scores.D = 0;
    starter = 'X';
    start();
  });
  start();
})();
