var League = (function () {
  var players = [],
      playerLookup = {},
      matches = [],
      matchLookup = {},
      containers = {},
      activePlayer = null;

  function setPlayers(thesePlayers) {
    players = thesePlayers;
    players.forEach(function (player) {
      playerLookup[player.id] = player;
      player.history = [];
      player.wins = player.losses = 0;
    });
  }

  function setMatches(theseMatches) {
    matches = theseMatches;
    matches.forEach(function (match) {
      var winner = playerLookup[match.winner_id],
          loser = playerLookup[match.loser_id];
      matchLookup[match.id] = match;
      winner.history.push({
        result: 'W', opponent: loser, match: match
      });
      winner.wins += 1;
      loser.history.push({
        result: 'L', opponent: winner, match: match
      });
      loser.losses += 1;
    });
  }

  function make(tag, options) {
    var element = document.createElement(tag);
    [ 'id', 'className', 'innerHTML' ].forEach(function (property) {
      if (property in options) {
        element[property] = options[property];
      }
    });
    if ('parent' in options) {
      options.parent.appendChild(element);
    }
    return element;
  }

  function addClass(element, name) {
    if (element.className) {
      element.className += ' ' + name;
    } else {
      element.className = name;
    }
  }

  function removeClass(element, name) {
    var names = element.className.split(/\s+/),
        newNames = [],
        i;
    for (i = 0; i < names.length; ++i) {
      if (names[i] !== name) {
        newNames.push(names[i]);
      }
    }
    element.className = newNames.join(' ');
  }

  function clickPlayer() {
    var player = this.player,
        spotlight = containers.spotlight;
    if (activePlayer !== null) {
      removeClass(activePlayer.element, 'active');
    }
    activePlayer = player;
    addClass(activePlayer.element, 'active');
    spotlight.innerHTML = '';
    make('div', { className: 'player', parent: spotlight,
        innerHTML: player.name });
    make('div', { className: 'record', parent: spotlight,
        innerHTML: player.wins + '-' + player.losses + '<br>' });
    player.history.forEach(function (match) {
      var container = make('div', { className: 'match', parent: spotlight });
      make('div', { parent: container,
          className: 'result ' + (match.result == 'W' ? 'win' : 'loss'),
          innerHTML: match.result });
      make('div', { className: 'opponent', parent: container,
          innerHTML: match.opponent.name });
    });
  }

  function load() {
    containers.wrapper = make('div', { id: 'wrapper',
        parent: document.body });
    containers.players = make('div', { id: 'players',
        parent: containers.wrapper });
    containers.spotlight = make('div', { id: 'spotlight',
        parent: containers.wrapper });
    players.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      } else if (a.name == b.name) {
        return 0;
      }
      return 1;
    });
    players.forEach(function (player) {
      var element = make('div', { className: 'player',
          innerHTML: player.name,
          parent: containers.players });
      player.element = element;
      element.player = player;
      element.onclick = clickPlayer;
      containers.players.appendChild(element);
    });
    //players[Math.floor(Math.random() * players.length)].element.onclick();
    players[0].element.onclick();
  }

  return {
    setPlayers: setPlayers,
    setMatches: setMatches,
    load: load
  };
})();

onload = League.load;
