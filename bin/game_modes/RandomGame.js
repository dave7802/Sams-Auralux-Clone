// Generated by CoffeeScript 1.6.3
/*
Create a completely random game.
*/


(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.RandomGame = (function(_super) {
    __extends(RandomGame, _super);

    function RandomGame() {
      _ref = RandomGame.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    RandomGame.prototype.setupGameplay = function() {
      var green_player, purple_player, red_player;
      this.neutral_player = new NeutralPlayer(Game.PLAYER_COLORS.BLACK);
      this.human_player = new Player(Game.PLAYER_COLORS.BLUE);
      red_player = new Player(Game.PLAYER_COLORS.RED);
      green_player = new Player(Game.PLAYER_COLORS.GREEN);
      purple_player = new Player(Game.PLAYER_COLORS.PURPLE);
      this.players = [this.neutral_player, red_player, green_player, this.human_player, purple_player];
      this.combat_players = [red_player, this.human_player, green_player, purple_player];
      _.invoke(this.combat_players, 'createRandomPlanets', 0);
      return this.neutral_player.createRandomPlanets(this.combat_players.length * 3);
    };

    return RandomGame;

  })(Game);

}).call(this);
