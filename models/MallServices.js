var keystone = require('keystone');
var Types = keystone.Field.Types;

var MallServices = new keystone.List('MallServices', {
	label: 'Mall Services',
	autokey: { from: 'serviceName', path: 'slug', unique: true },
	map: { name: 'serviceName' },
	searchFields: 'serviceName',
	defaultSort: '-createDate',
	sortable: true,
//	drilldown: 'author',
	track: true,
	defaultColumns : 'serviceName, state|20%, publishedDate|20%'
});

MallServices.add(
	{
	serviceName:{default:null,label:'Service Name',required:false,type:Types.Text,note:''},
	serviceShortDescription:{default:null,label:'Service Short Description',required:false,type:Types.Text,note:''},
	serviceLongDescription:{default:null,height:150,wysiwyg:true,label:'Service Long Description',required:false,type:Types.Html,note:''},
	serviceImage:{ref:'Assets',default:null,label:'Image ',required:false,type:Types.Relationship,note:''},
	author:{ref:'User',index:true,type:Types.Relationship, label: 'Created By'},
	state:{index:true,default:'draft',type:Types.Select,options:'draft, published, archived', label: 'Status'},
	publishedDate:{index:true,type:Types.Date, label: 'Last Publish Date'},
	createdAt:{index:true,default:Date.now,noedit:true,type:Types.Date,collapse:true, hidden: true},
	changedAt:{index:true,noedit:true,type:Types.Date,collapse:true,  hidden: true}
	}
);

MallServices.schema.methods.isPublished = function() {
    return this.state == 'published';
}

MallServices.schema.pre('save', function(next) {
	if (!this.isModified('changedAt')) {
		this.changedAt = Date.now();
	}
    if ( this.isModified('state') && this.isPublished() ) {  //&& !this.publishedDate
        this.publishedDate = new Date();
    }
    next();
});

MallServices.relationship({ ref: 'FloorPlan', path: 'floorplans', refPath: 'serviceId' });

MallServices.register();



