var keystone = require('keystone');
var Types = keystone.Field.Types;

var DeviceRoute = new keystone.List('DeviceRoute', {
	label: 'Device Route',
	autokey: { from: 'routeName', path: 'slug', unique: true },
	map: { name: 'routeName' },
	searchFields: 'routeName',
	defaultSort: '-createDate',
	sortable: true,
//	drilldown: 'author',
	track: true,
	defaultColumns : 'routeName, author|20%, state|20% , publishedDate|20%'
});

DeviceRoute.add(
	{
	routeName:{default:null,label:'Device Route Name',required:false,type:Types.Text,note:'e.g. Device#1Floor#Path#'},
	pathDetails:{default:null,height:150,wysiwyg:true,label:'Path Details',required:false,type:Types.Textarea,note:'Generated path details'},
	state:{index:true,default:'draft',type:Types.Select,options:'draft, published, archived', label: 'Status'},
	publishedDate:{index:true,type:Types.Date, label: 'Last Publish Date'},
	author:{ref:'User',index:true,type:Types.Relationship, label: 'Created By', noedit:true, hidden: true},
	createdAt:{index:true,default:Date.now,noedit:true,type:Types.Date,collapse:true, hidden: true},
	changedAt:{index:true,noedit:true,type:Types.Date,collapse:true,  hidden: true}}
);

DeviceRoute.schema.methods.isPublished = function() {
    return this.state == 'published';
}

 
DeviceRoute.schema.pre('save', function(next) {
//	 this.author = this.user._id;
	if (!this.isModified('changedAt')) {
		this.changedAt = Date.now();
	}
    if ( this.isModified('state') && this.isPublished() ) {  //&& !this.publishedDate
        this.publishedDate = new Date();
    }
    next();
});

DeviceRoute.relationship({ ref: 'FloorPlan', path: 'floorplans', refPath: 'deviceRoute' });


DeviceRoute.register();



