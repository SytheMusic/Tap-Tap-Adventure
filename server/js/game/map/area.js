var cls = require('./../lib/class');
var _ = require('underscore');
var Utils = require('./../utils/utils');
var Messages = require('./../network/packets/message');
var MobData = require('./../utils/data/mobdata');

module.exports = Area = cls.Class.extend({
    init: function (id, x, y, width, height, world) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.world = world;
        this.entities = [];
        this.hasCompletelyRespawned = true;
    },

    _getRandomPositionInsideArea: function () {
        var pos = {};
        var valid = false;

        while (!valid) {
            pos.x = this.x + Utils.randomInt(0, this.width + 1);
            pos.y = this.y + Utils.randomInt(0, this.height + 1);
            valid = this.world.isValidPosition(pos.x, pos.y);
        }
        return pos;
    },
    contains: function(x, y){
        return x >= this.x
        && y >= this.y
        && x < this.x + this.width
        && y < this.y + this.height;
    },
    removeFromArea: function (entity) {
        var i = _.indexOf(_.pluck(this.entities, 'id'), entity.id);
        this.entities.splice(i, 1);

        if (this.isEmpty() && this.hasCompletelyRespawned && this.emptyCallback) {
            this.hasCompletelyRespawned = false;
            this.emptyCallback();
        }
    },
    

    addToArea: function (entity) {
        var Mob = require('./../entity/character/mob/mob');
        if (entity && entity.kind !== null) {
            this.entities.push(entity);
            entity.area = this;
            if (entity instanceof Mob) {
                this.world.addMob(entity);
            }
        }

        if (this.isFull()) {
            this.hasCompletelyRespawned = true;
        }
    },

    setNumberOfEntities: function (nb) {
        this.nbEntities = nb;
    },

    isEmpty: function () {
        return !_.any(this.entities, function (entity) { return !entity.isDead; });
    },

    isFull: function () {
        return !this.isEmpty() && (this.nbEntities === _.size(this.entities));
    },

    onEmpty: function (callback) {
        this.emptyCallback = callback;
    }
});

module.exports = Area;

