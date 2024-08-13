var mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


var UserSchema = new mongoose.Schema({
	firstName: {type: String, required: false},
	lastName: {type: String, required: false},
    mobileNo: { type: String, required: true, unique: true },
	password: {type: String, required: false},
	otp: {type: String, required:false},
	deviceId: {type: String, required:false},
	isDeviceIdReset: {type: Boolean, required: false, default: false},
	isMobileVerified: {type: Boolean, required: false, default: false},
	isEmailVerified: {type: Boolean, required: false, default: false},
	status: {type: Boolean, required: false, default: true}
}, {timestamps: true});

// Virtual for user's full name
UserSchema
	.virtual("fullName")
	.get(function () {
		return this.firstName + " " + this.lastName;
	});

	UserSchema.pre('save', async function(next) {
		if (this.isModified('password') || this.isNew) {
			try {
				const salt = await bcrypt.genSalt(10);
				this.password = await bcrypt.hash(this.password, salt);
				next();
			} catch (err) {
				console.log(err);
				next(err);
			}
		} else {
			next();
		}
	});
	
	// Method to compare given password with hashed password
	UserSchema.methods.comparePassword = function(candidatePassword) {
		return bcrypt.compare(candidatePassword, this.password);
	};

module.exports = mongoose.model("User", UserSchema);