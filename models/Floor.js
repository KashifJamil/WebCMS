var keystone = require('keystone');
var Types = keystone.Field.Types;

var Floor = new keystone.List('Floor', {
	label: 'Floor',
	autokey: { from: 'floorName', path: 'slug', unique: true },
	map: { name: 'floorName' },
	searchFields: 'floorName',
	defaultSort: '-createDate',
	sortable: true,
//	drilldown: 'author',
	track: true,
	defaultColumns : 'floorName, state|20%, publishedDate|20%'
});

Floor.add(
	{
	floorName:{default:null,label:'Floor Name',required:false,type:Types.Text,note:'e.g. First floor'},
	floorImage:{ref:'Assets',default:null,label:'Image ',required:false,type:Types.Relationship,note:''},
	author:{ref:'User',index:true,type:Types.Relationship, label: 'Created By'},
	state:{index:true,default:'draft',type:Types.Select,options:'draft, published, archived', label: 'Status'},
	publishedDate:{index:true,type:Types.Date, label: 'Last Publish Date'},
	createdAt:{index:true,default:Date.now,noedit:true,type:Types.Date,collapse:true, hidden: true},
	changedAt:{index:true,noedit:true,type:Types.Date,collapse:true,  hidden: true}}
);

Floor.schema.methods.isPublished = function() {
    return this.state == 'published';
}
 
Floor.schema.pre('save', function(next) {
	if (!this.isModified('changedAt')) {
		this.changedAt = Date.now();
	}
    if ( this.isModified('state') && this.isPublished() ) {  //&& !this.publishedDate
        this.publishedDate = new Date();
    }
    next();
});

Floor.relationship({ ref: 'FloorPlan', path: 'floorplans', refPath: 'floorId' });
Floor.relationship({ ref: 'InteractiveDevices', path: 'interactivedevices', refPath: 'floorId' });
Floor.relationship({ ref: 'Shop', path: 'shops', refPath: 'floorId' });

Floor.register();
