// Generated by CoffeeScript 1.6.3
/*
Some behaviour for the player to play against.
*/


(function() {
  window.AI = (function() {
    function AI(player, other_players, neutral_player) {
      this.player = player;
      this.other_players = other_players;
      this.neutral_player = neutral_player;
      this.defence = 20;
      this.attack = 100;
      this.expand = 20;
      this.updateGeneralStats();
      this.updatePlanetStats();
      this.expansion_unit_buffer = 5;
      this.attack_unit_buffer = 10;
    }

    AI.prototype.tick = function() {
      Schedule.runEvery(80, function() {
        return this.updateGeneralStats();
      }, this);
      Schedule.runEvery(30, function() {
        return this.updatePlanetStats();
      }, this);
      Schedule.runEvery(this.expand, function() {
        return this.makeExpansionMove();
      }, this);
      return Schedule.runEvery(this.attack, function() {
        return this.makeAttackMove();
      }, this);
    };

    AI.prototype.updatePlanetStats = function() {
      var planet, stats_planet, _i, _len, _ref, _results;
      this.planets = [];
      _ref = this.player.getPlanets();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        planet = _ref[_i];
        stats_planet = {};
        stats_planet.nearest_occupied = this.getNearestPlanet(planet, 1);
        stats_planet.nearest_unoccupied = this.getNearestPlanet(planet, 2);
        stats_planet.nearest_friendly = this.getNearestPlanet(planet, 3);
        stats_planet.nearby_units = this.getNearbyUnits(planet, this.player);
        stats_planet.planet = planet;
        _results.push(this.planets.push(stats_planet));
      }
      return _results;
    };

    AI.prototype.updateGeneralStats = function() {
      return this.stats = {
        TOTAL_UNITS: 0
      };
    };

    AI.prototype.getNearestPlanet = function(planet, type) {
      var candidate_players, distance, i, min_distance, n, nearest_planet, other_planet, other_planets, other_player, owner, winning_planet, winning_player, _i, _j, _len, _len1;
      min_distance = false;
      nearest_planet = false;
      owner = false;
      candidate_players = [];
      if (type === 2) {
        candidate_players = [this.neutral_player];
      }
      if (type === 1) {
        candidate_players = _.filter(this.other_players, function(player) {
          return player !== this.neutral_player;
        }, this);
      }
      if (type === 3) {
        candidate_players = [this.player];
      }
      for (n = _i = 0, _len = candidate_players.length; _i < _len; n = ++_i) {
        other_player = candidate_players[n];
        other_planets = other_player.getPlanets();
        for (i = _j = 0, _len1 = other_planets.length; _j < _len1; i = ++_j) {
          other_planet = other_planets[i];
          if (other_planet === planet) {
            continue;
          }
          distance = other_planet.getPosition().distanceFrom(planet.getPosition());
          if (min_distance === false || distance < min_distance) {
            min_distance = distance;
            nearest_planet = i;
            owner = n;
          }
        }
      }
      winning_player = candidate_players[owner] || false;
      winning_planet = winning_player ? winning_player.getPlanets()[nearest_planet] : false;
      return {
        'planet': winning_planet,
        'player': winning_player
      };
    };

    AI.prototype.getNearbyUnits = function(planet, player) {
      var max_distance, nearbyUnits, unit, _i, _len, _ref;
      nearbyUnits = new UnitCollection();
      max_distance = planet.getPosition().getR() + Planet.MAX_PLANET_RADIUS + Planet.UNIT_DISTANCE_FROM_PLANET + Planet.UNIT_DISTANCE_FROM_PLANET_VARIANCE;
      _ref = player.getUnits().getAll();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        unit = _ref[_i];
        if (unit.getPosition().distanceFrom(planet.getPosition()) <= max_distance) {
          nearbyUnits.add(unit);
        }
      }
      return nearbyUnits;
    };

    AI.prototype.makeExpansionMove = function() {
      var planet, _i, _len, _ref, _results;
      if (this.neutral_player.getPlanets().length === 0) {
        return;
      }
      _ref = this.planets;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        planet = _ref[_i];
        if (!(planet.nearby_units.count() > Ownership.UNIT_COVERAGE_REQUIREMENT + this.expansion_unit_buffer)) {
          continue;
        }
        if (false === planet.nearest_unoccupied) {
          break;
        }
        _results.push(planet.nearby_units.sendTo(planet.nearest_unoccupied.planet.getPosition()));
      }
      return _results;
    };

    AI.prototype.makeAttackMove = function() {
      var planet, required_units, total_defence, victim, _i, _len, _ref, _results;
      _ref = this.planets;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        planet = _ref[_i];
        victim = planet.nearest_occupied;
        if (false === victim.planet) {
          continue;
        }
        total_defence = this.getNearbyUnits(victim.planet, victim.player).count();
        required_units = total_defence + this.attack_unit_buffer + Ownership.UNIT_COVERAGE_REQUIREMENT;
        required_units = required_units / Math.pow(this.player.getPlanets().length, 2);
        if (planet.nearby_units.count() >= required_units) {
          _results.push(planet.nearby_units.sendTo(victim.planet.getPosition()));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    AI.prototype.makeDefenceMove = function() {};

    return AI;

  })();

}).call(this);