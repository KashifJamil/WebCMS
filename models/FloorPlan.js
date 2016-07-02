var keystone = require('keystone');
var Types = keystone.Field.Types;

var FloorPlan = new keystone.List('FloorPlan', {
	label: 'Floor Plan',
	autokey: { from: 'floorPlanName', path: 'slug', unique: true },
	map: { name: 'floorPlanName' },
	searchFields: 'floorPlanName',
	defaultSort: '-createDate',
	sortable: true,
	drilldown: 'floorId',
	track: true,
	defaultColumns : 'floorPlanName, state|20%, publishedDate|20%'
});

FloorPlan.add(
	{
	floorPlanName:{default:null,label:'Floor Plan',required:false,type:Types.Text,note:''},
	floorId:{ref:'Floor',default:null,label:'Floor',required:false,type:Types.Relationship,note:''},
	deviceId: {ref:'InteractiveDevices',default:null,label:'Device',required:false,type:Types.Relationship,note:''},
	serviceId:{ref:'MallServices',default:null,label:'Service',required:false,type:Types.Relationship,note:''},
	shopId:{ref:'Shop',default:null,label:'Shop',required:false,type:Types.Relationship,note:''},
	routeId:{ref:'DeviceRoute',default:null,label:'Route',required:false,type:Types.Relationship,note:''},
	xPosition:{default:null,label:'Shop/Service X Position',required:false,type:Types.Text,note:''},
	yPosition:{default:null,label:'Shop/Service Y Position',required:false,type:Types.Text,note:''},
	author:{ref:'User',index:true,type:Types.Relationship, label: 'Created By'},
	state:{index:true,default:'draft',type:Types.Select,options:'draft, published, archived', label: 'Status'},
	publishedDate:{index:true,type:Types.Date, label: 'Last Publish Date'},
	createdAt:{index:true,default:Date.now,noedit:true,type:Types.Date,collapse:true, hidden: true},
	changedAt:{index:true,noedit:true,type:Types.Date,collapse:true,  hidden: true}
	}
);

FloorPlan.schema.methods.isPublished = function() {
    return this.state == 'published';
}

FloorPlan.schema.pre('save', function(next) {
	if (!this.isModified('changedAt')) {
		this.changedAt = Date.now();
	}
    if ( this.isModified('state') && this.isPublished() ) {  //&& !this.publishedDate
        this.publishedDate = new Date();
    }
    next();
});


FloorPlan.register();



