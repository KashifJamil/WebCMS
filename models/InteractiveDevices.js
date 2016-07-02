var keystone = require('keystone');
var Types = keystone.Field.Types;

var InteractiveDevices = new keystone.List('InteractiveDevices', {
	label: 'Interactive Device',
	autokey: { from: 'deviceName', path: 'slug', unique: true },
	map: { name: 'deviceName' },
	searchFields: 'deviceName',
	defaultSort: '-createDate',
	sortable: true,
	drilldown: 'author',
	track: true,
	defaultColumns : 'deviceName, state|20%, publishedDate|20%'
});

InteractiveDevices.add(
	{
	deviceName:{default:null,label:'Device Name',required:false,type:Types.Text,note:''},
	floorId:{ref:'Floor',default:null,label:'Floor ID',required:false,type:Types.Relationship,note:''},
	xPosition:{default:null,label:'X Position',required:false,type:Types.Text,note:''},
	yPosition:{default:null,label:'Y Position',required:false,type:Types.Text,note:''},
	author:{ref:'User',index:true,type:Types.Relationship, label: 'Created By'},
	state:{index:true,default:'draft',type:Types.Select,options:'draft, published, archived', label: 'Status'},
	publishedDate:{index:true,type:Types.Date, label: 'Last Publish Date'},
	createdAt:{index:true,default:Date.now,noedit:true,type:Types.Date,collapse:true, hidden: true},
	changedAt:{index:true,noedit:true,type:Types.Date,collapse:true,  hidden: true}}
);

InteractiveDevices.schema.methods.isPublished = function() {
    return this.state == 'published';
}
 
InteractiveDevices.schema.pre('save', function(next) {
	if (!this.isModified('changedAt')) {
		this.changedAt = Date.now();
	}
    if ( this.isModified('state') && this.isPublished() ) {  //&& !this.publishedDate
        this.publishedDate = new Date();
    }
    next();
});


InteractiveDevices.register();



