var keystone = require('keystone');
var Types = keystone.Field.Types;

var ShopList = new keystone.List('ShopList', {
	label: 'ShopList',
	autokey: { from: 'shopName', path: 'slug', unique: true },
	map: { name: 'shopName' },
	searchFields: 'shopName',
	defaultSort: '-createDate',
	sortable: true,
//	drilldown: 'author',
	track: true,
	defaultColumns : 'shopName, state|20%, publishedDate|20%'
});

ShopList.add(
	{
	shopName:{default:null,label:'Shop List Name',required:true,type:Types.Text,note:''},
	shopShortDescription:{default:null,label:'Short Description',required:false,type:Types.Text,note:''},
	shopId:{ref:'Shop',default:null, initial:true,label:'Shop',required:false,type:Types.Relationship,note:''},
	shopCategories:{many:true,ref:'ShopCategory',default:null,label:'Shop Categories',required:false,type:Types.Relationship,note:''},
	shopListImage:{ref:'Assets',default:null,label:'Image ',required:false,type:Types.Relationship,note:''},
	ribbonText:{default:null,label:'Ribbon Text',required:false,type:Types.Text,note:''},
	isEndingSoon:{default:null,label:'Is Ending Soon?',required:false,type:Types.Boolean,note:''},
	isFoodCourt:{default:null,label:'Is Food Court?',required:false,type:Types.Boolean,note:''},
	isMostPopular:{default:null,label:'Is Most Popular?',required:false,type:Types.Boolean,note:''},
	isNewDeals:{default:null,label:'Is New Deals?',required:false,type:Types.Boolean,note:''},
	floorPlanIDs:{ref:'FloorPlan',default:null,label:'Floor Plan',required:false,type:Types.Relationship,note:''},
	isActive:{default:null,label:'Is Active?',required:true,type:Types.Boolean,note:''},
	isNeverExpired:{default:null,label:'Is Never Expired?',required:false,type:Types.Boolean,note:'', dependsOn: { isActive: true }},
	expireAfter:{default:Date.now,label:'Expire After',required:false,type:Types.Date,note:'', dependsOn: { isNeverExpired: false }},
	state:{index:true,default:'draft',type:Types.Select,options:'draft, published, archived', label: 'Status'},
	publishedDate:{index:true,type:Types.Date, label: 'Last Publish Date'},
	author:{ref:'User',index:true,type:Types.Relationship, label: 'Created By', noedit:true, hidden: true},
	createdAt:{index:true,default:Date.now,noedit:true,type:Types.Date,collapse:true, hidden: true},
	changedAt:{index:true,noedit:true,type:Types.Date,collapse:true,  hidden: true}}
);

ShopList.schema.methods.isPublished = function() {
    return this.state == 'published';
}

ShopList.schema.pre('save', function(next) {
	if (!this.isModified('changedAt')) {
		this.changedAt = Date.now();
	}
    if ( this.isModified('state') && this.isPublished() ) {  //&& !this.publishedDate
        this.publishedDate = new Date();
    }
    next();
});


ShopList.register();



