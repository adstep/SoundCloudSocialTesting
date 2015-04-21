var sets = require('simplesets');

var UserPrototype = {
	// Adds a track to the list of user added tracks
	addTrack: function(track) {
		this._addedTracks.push(track);
	}
};

exports.User = function (p_name, p_id) {
	this.name = p_name;
	this.id = p_id;
	this._addedTracks = [];
}

exports.User.prototype = UserPrototype;

var RoomPrototype = {
	// Adds a user to the room
	addUser: function (user) {
		if(this._state.users.has(user)) {
			this._onChange(null, 'User already exists in room!');
		} else {
			console.log(user.name);
			this._state.users.add(user);
			this._onChange(this._state, null);
		}
	},

	// Removes a user from the room
	removeUser: function (user) {
		if(this._state.users.has(user)) {
			this._state.users.remove(user);
			this._onChange(this._state, null);
		} else {
			this._onChange(null, 'User didn\'t exist in room!');
		}
	},

	// Adds user's vote to boot the current song
	// if there is a song in the track queue
	// If the boot count gets over ceil(half of the
	// users in the room) then the next track
	// is requested and boot votes are cleared.
	bootTrack: function (user) {
		if(this._state.bootVotes.has(user.id)) {
			this._onChange(null, 'User already voted to boot!');
		} else if(!this._state.trackQueue.isEmpty()) {
			this._state.bootVotes.add(user.id);

			if(this._state.bootVotes.size >=
			   Math.ceil(this._state.users.size / 2)) {
				nextTrack()
			}

			this._onChange(this._state, null);
		}
	},

	// Adds the track to the room's track queue
	addTrack: function (user, track) {
		this.trackQueue.enqueue(track);
		this._onChange(state, null);
	},

	// Removes the head of the room's track queue
	// and clears any votes for the song.
	nextTrack: function () {
		this.bootVotes.clear();

		if(this.trackQueue.isEmpty()) {
			this._onChange(null, 'TrackQueue is empty!');
		} else {
			this.trackQueue.dequeue();
			this._onChange(state, null);
		}
	}
}

/**
 * Room handles all relevant information for an individual
 * SoundCloudSocial session and any operations that can be
 * performed to change session's state. 
 *  
 * @constructor
 */
exports.Room = function(p_name, p_id, p_onChange) {
	// Public
	this.id = p_id;
	this._state = new RoomState(p_name);
	this._onChange = p_onChange;
};

exports.Room.prototype = RoomPrototype;

/**
 * RoomState represents the current state of a room 
 * and is intended to be passed to clients for them
 * to update the views accordingly.
 * @constructor
 */
function RoomState(p_name) {
	this.name = p_name;
	this.lastAction = "";
	this.users = new sets.Set();
	this.trackQueue = new Queue();
	this.bootVotes = new sets.Set();
}

function Queue(){
  var queue  = [];
  var offset = 0;

  this.getLength = function(){
    return (queue.length - offset);
  }

  this.isEmpty = function(){
    return (queue.length == 0);
  }

  this.enqueue = function(item){
    queue.push(item);
  }

  this.dequeue = function(){
    if (queue.length == 0) return undefined;

    var item = queue[offset];

    if (++ offset * 2 >= queue.length){
      queue  = queue.slice(offset);
      offset = 0;
    }

    return item;
  }

  this.peek = function(){
    return (queue.length > 0 ? queue[offset] : undefined);
  }
}