var keystone = require('keystone');
var Types = keystone.Field.Types;

var PromotionDetail = new keystone.List('PromotionDetail', {
	label: 'Promotion Detail',
	autokey: { from: 'promotionTitle', path: 'slug', unique: true },
	map: { name: 'promotionTitle' },
	searchFields: 'promotionTitle',
	defaultSort: '-createDate',
	sortable: true,
//	drilldown: 'author',
	track: true,
	defaultColumns : 'promotionTitle, state|20%, publishedDate|20%'
});

PromotionDetail.add(
	{
	promotionTitle:{default:null,label:'Promotion Title',required:false,type:Types.Text,note:''},
	promotionLongContentBlock:{default:null,label:'Promotion Long Content Block',required:false,type:Types.Html, wysiwyg: true,note:''},
	author:{ref:'User',index:true,type:Types.Relationship, label: 'Created By'},
	state:{index:true,default:'draft',type:Types.Select,options:'draft, published, archived', label: 'Status'},
	publishedDate:{index:true,type:Types.Date, label: 'Last Publish Date'},
	createdAt:{index:true,default:Date.now,noedit:true,type:Types.Date,collapse:true, hidden: true},
	changedAt:{index:true,noedit:true,type:Types.Date,collapse:true,  hidden: true}}
);

PromotionDetail.schema.methods.isPublished = function() {
    return this.state == 'published';
}
 
PromotionDetail.schema.pre('save', function(next) {
	if (!this.isModified('changedAt')) {
		this.changedAt = Date.now();
	}
    if ( this.isModified('state') && this.isPublished() ) {  //&& !this.publishedDate
        this.publishedDate = new Date();
    }
    next();
});


PromotionDetail.relationship({ ref: 'Promotions', path: 'promotions', refPath: 'promotionDetailId' });

PromotionDetail.register();



