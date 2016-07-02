var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var User = new keystone.List('User');

User.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});


/**
 * Relationships
 */
User.relationship({ path: 'floors', ref: 'Floor', refPath: 'author' });
User.relationship({ path: 'mallservices', ref: 'MallServices', refPath: 'author' });
User.relationship({ path: 'deviceroutes', ref: 'DeviceRoute', refPath: 'author' });
User.relationship({ path: 'floorplans', ref: 'FloorPlan', refPath: 'author' });
User.relationship({ path: 'interactivedevices', ref: 'InteractiveDevices', refPath: 'author' });
User.relationship({ path: 'promotiondetails', ref: 'PromotionDetail', refPath: 'author' });
User.relationship({ path: 'promotions', ref: 'Promotions', refPath: 'author' });
User.relationship({ path: 'shops', ref: 'Shops', refPath: 'author' });
User.relationship({ path: 'shopcategory', ref: 'ShopCategory', refPath: 'author' });
User.relationship({ path: 'shoplists', ref: 'ShopList', refPath: 'author' });
User.relationship({ path: 'videos', ref: 'Videos', refPath: 'author' });

/**
 * Registration
 */
User.defaultColumns = 'name, email, isAdmin';
User.register();
