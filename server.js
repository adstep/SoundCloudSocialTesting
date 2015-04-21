var architecture = require('./architecture.js'),
	Room = architecture.Room,
	User = architecture.User;

var onChange = function(data, error) {
	if(data != null) {
		console.log(data);
	}

	if(error != null) {
		console.log(error);
	}
}

var room = new Room('ohnose', 1, onChange);
var user = new User('adam', 1);



room.addUser(user);
room.removeUser(user);