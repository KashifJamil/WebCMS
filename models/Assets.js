var keystone = require('keystone');
var Types = keystone.Field.Types;

var Assets = new keystone.List('Assets', {
	label: 'Asset',
	autokey: { from: 'title', path: 'slug', unique: true },
	map: { name: 'title' },
	searchFields: 'title',
	defaultSort: '-createDate',
	sortable: true,
//	drilldown: 'author',
	track: true,
	defaultColumns : 'title, state|20%, publishedDate|20%'
});

Assets.add(
	{
	title:{default:null,label:'Title',required:false,type:Types.Text,note:''},
	description:{default:null,label:'Description',required:false,type:Types.Text,note:''},
	file:{default:null,select:true,label:'Image',required:false,type:Types.CloudinaryImage,note:'' },
	state:{index:true,default:'draft',type:Types.Select,options:'draft, published, archived', label: 'Status'},
	publishedDate:{index:true,type:Types.Date, label: 'Last Publish Date'},
	author:{ref:'User',index:true,type:Types.Relationship, label: 'Created By', noedit:true, hidden: true},
	createdAt:{index:true,default:Date.now,noedit:true,type:Types.Date,collapse:true, hidden: true},
	changedAt:{index:true,noedit:true,type:Types.Date,collapse:true,  hidden: true}}
);

Assets.schema.methods.isPublished = function() {
    return this.state == 'published';
}

Assets.schema.pre('save', function(next) {
	if (!this.isModified('changedAt')) {
		this.changedAt = Date.now();
	}
    if ( this.isModified('state') && this.isPublished() ) {  //&& !this.publishedDate
        this.publishedDate = new Date();
    }
    next();
});

Assets.relationship({ ref: 'Videos', path: 'videos', refPath: 'videoPosterImage' });
Assets.relationship({ ref: 'Floor', path: 'floor', refPath: 'floorImage' });
Assets.relationship({ ref: 'Header', path: 'companyLogo', refPath: 'companyLogo' });
Assets.relationship({ ref: 'Header', path: 'companyBanner', refPath: 'companyBanner' });
Assets.relationship({ ref: 'Header', path: 'weatherIcons', refPath: 'weatherIcons' });
Assets.relationship({ ref: 'MallServices', path: 'mallservices', refPath: 'serviceImage' });
Assets.relationship({ ref: 'Promotions', path: 'promotionimagesmall', refPath: 'promotionImageSmall' });
Assets.relationship({ ref: 'Promotions', path: 'promotionimagemedium', refPath: 'promotionImageMedium' });
Assets.relationship({ ref: 'Promotions', path: 'promotionimagelarge', refPath: 'promotionImageLarge' });
Assets.relationship({ ref: 'Promotions', path: 'videoposterimage', refPath: 'videoPosterImage' });
Assets.relationship({ ref: 'Shop', path: 'shoplogo', refPath: 'shopLogo' });
Assets.relationship({ ref: 'Shop', path: 'shopbannerimage', refPath: 'shopBannerImage' });
Assets.relationship({ ref: 'ShopList', path: 'shoplistimage', refPath: 'shopListImage' });

Assets.register();

