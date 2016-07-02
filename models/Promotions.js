var keystone = require('keystone');
var Types = keystone.Field.Types;

var Promotions = new keystone.List('Promotions', {
	label: 'Promotions',
	autokey: { from: 'promotionTitle', path: 'slug', unique: true },
	map: { name: 'promotionTitle' },
	searchFields: 'promotionTitle',
	defaultSort: '-createDate',
	sortable: true,
	drilldown: 'shopId',
	track: true,
	defaultColumns : 'promotionTitle, state|20%, publishedDate|20%'
});

Promotions.add(
	{
	promotionTitle:{default:null,label:'Promotion Title',required:false,type:Types.Text,note:''},
	promotionShortDescription:{default:null,label:'Promotion Short Description',required:false,type:Types.Text,note:''},
	promotionPurpose:{type:Types.Select,options:[
	{value:'For Home Page',label:'For Home Page'},
	{value:'For Shop Page',label:'For Shop Page'},
	{value:'For Food Court',label:'For Food Court'},
	{value:'For Shop Explore Page',label:'For Shop Explore Page'}]},
	isForMarketing:{default:null,label:'Is For Marketing?',required:false,type:Types.Boolean,note:''},
	shopId:{many:true,ref:'Shop',default:null,label:'Shop',required:false,type:Types.Relationship,note:''},
	promotionImageSmall:{ref:'Assets',default:null,label:'Image ',required:false,type:Types.Relationship,note:''},
	promotionImageMedium:{ref:'Assets',default:null,label:'Image ',required:false,type:Types.Relationship,note:''},
	promotionImageLarge:{ref:'Assets',default:null,label:'Image ',required:false,type:Types.Relationship,note:''},
	promotionDetailId:{many:true,ref:'PromotionDetail',default:null,label:'Promotion Detail',required:false,type:Types.Relationship,note:''},
	ribbonText:{default:null,label:'Ribbon Text',required:false,type:Types.Text,note:''},
	isVideo:{default:null,label:'Is Video?',required:false,type:Types.Boolean,note:''},
	videoUrl:{default:null,label:'Video URL',required:false,type:Types.Url,note:'', dependsOn: { isVideo: true }},
	videoFile:{
		type: Types.LocalFile,
		dest: '/data/files',
		prefix: '/files/',
		filename: function(item, file){
			return item.id + '.' + file.extension
		}
	},
	videoPosterImage:{ref:'Assets',default:null,label:'Image ',required:false,type:Types.Relationship,note:''},
	isActive:{default:null,label:'Is Active?',required:false,type:Types.Boolean,note:''},
	isNeverExpired:{default:null,label:'Is Never Expired?',required:false,type:Types.Boolean,note:'', dependsOn: { isActive: true }},
	expireAfter:{default:Date.now,label:'Expire After',required:false,type:Types.Date,note:'', dependsOn: { isNeverExpired: false }},
	state:{index:true,default:'draft',type:Types.Select,options:'draft, published, archived', label: 'Status'},
	publishedDate:{index:true,type:Types.Date, label: 'Last Publish Date'},
	author:{ref:'User',index:true,type:Types.Relationship, label: 'Created By', noedit:true, hidden: true},
	createdAt:{index:true,default:Date.now,noedit:true,type:Types.Date,collapse:true, hidden: true},
	changedAt:{index:true,noedit:true,type:Types.Date,collapse:true,  hidden: true}
  }
);

Promotions.schema.methods.isPublished = function() {
    return this.state == 'published';
}

Promotions.schema.pre('save', function(next) {
	if (!this.isModified('changedAt')) {
		this.changedAt = Date.now();
	}
    if ( this.isModified('state') && this.isPublished() ) {  //&& !this.publishedDate
        this.publishedDate = new Date();
    }
    next();
});

Promotions.relationship({ ref: 'Shop', path: 'shops', refPath: 'shopPromotions' });


Promotions.register();



