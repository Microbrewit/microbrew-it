var bcrypt = require('bcrypt');


exports.setUser = function (userData, callback) {
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(userData.password, salt, function (err, hash) {
				if (err) {
					console.log("error in bcrypt");
				} else {
					console.log(hash);
				}
		});
	});

};