var keystone = require('keystone');
var Types = keystone.Field.Types;

var Shop = new keystone.List('Shop', {
	label: 'Shop',
	autokey: { from: 'shopName', path: 'slug', unique: true },
	map: { name: 'shopName' },
	searchFields: 'shopName',
	defaultSort: '-createDate',
	sortable: true,
//	drilldown: 'author',
	track: true,
	defaultColumns : 'shopName, state|20%, publishedDate|20%'
});

Shop.add(
	{
	shopName:{default:null,label:'Shop Name',required:true,type:Types.Text,note:''},
	shopLogo:{ref:'Assets',default:null,label:'Image ',required:false,type:Types.Relationship,note:''},
	shopShortContentBlock:{default:null,label:'Shop Short Content Block',required:false,type:Types.Text,note:''},
	shopLongContentBlock: {default:null,height:150, label: 'Shop Long Content Block' , required: false , type: Types.Html, wysiwyg: true , note:''},
	shopBannerImage:{ref:'Assets',default:null,label:'Image ',required:false,type:Types.Relationship,note:''},
	shopPromotions:{many:true,ref:'Promotions',default:null,label:'Shop Promotions',required:false,type:Types.Relationship,note:''},
	relatedShops:{many:true,ref:'Shop',default:null,label:'Related Shops',required:false,type:Types.Relationship,note:''},
	isSale:{default:null,initial:true,label:'Is Sale?',required:false,type:Types.Boolean,note:''},
	saleContentBlock:{default:null,height:150,wysiwyg:true,label:'Sale Content Block',required:false,type:Types.Html,note:''},
	isNewDeals:{default:null,initial:true,label:'Is New Deals?',required:false,type:Types.Boolean,note:''},
	newDealsContentBlock:{default:null,height:150,wysiwyg:true,label:'New Deals Content Block',required:false,type:Types.Html,note:''},
	isPromotion:{default:null,initial:true,label:'Is Promotion?',required:false,type:Types.Boolean,note:''},
	promotionContentBlock:{default:null,height:150,wysiwyg:true,label:'Promotion Content Block',required:false,type:Types.Html,note:''},
	floorId:{ref:'Floor',default:null,label:'Floor',required:false,type:Types.Relationship,note:''},
	state:{index:true,default:'draft',type:Types.Select,options:'draft, published, archived', label: 'Status'},
	publishedDate:{index:true,type:Types.Date, label: 'Last Publish Date'},
	author:{ref:'User',index:true,type:Types.Relationship, label: 'Created By', noedit:true, hidden: true},
	createdAt:{index:true,default:Date.now,noedit:true,type:Types.Date,collapse:true, hidden: true},
	changedAt:{index:true,noedit:true,type:Types.Date,collapse:true,  hidden: true}
	}
);

Shop.schema.methods.isPublished = function() {
    return this.state == 'published';
}

Shop.schema.pre('save', function(next) {
	if (!this.isModified('changedAt')) {
		this.changedAt = Date.now();
	}
    if ( this.isModified('state') && this.isPublished() ) {  //&& !this.publishedDate
        this.publishedDate = new Date();
    }
    next();
});


Shop.relationship({ ref: 'Promotions', path: 'promotions', refPath: 'shopId' });
Shop.relationship({ ref: 'Shop', path: 'shops', refPath: 'relatedShops' });
Shop.relationship({ ref: 'ShopList', path: 'shoplists', refPath: 'shopId' });


Shop.register();



