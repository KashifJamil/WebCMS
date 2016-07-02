var keystone = require('keystone');
var Types = keystone.Field.Types;

var ShopCategory = new keystone.List('ShopCategory', {
	label: 'ShopCategory',
	autokey: { from: 'categoryName', path: 'slug', unique: true },
	map: { name: 'categoryName' },
	searchFields: 'categoryName',
	defaultSort: '-createDate',
	sortable: true,
//	drilldown: 'author',
	track: true,
	defaultColumns : 'categoryName, state|20%, publishedDate|20%'
});

ShopCategory.add(
	{
	categoryName:{default:null,label:'Category Name',required:false,type:Types.Text,note:''},
	state:{index:true,default:'draft',type:Types.Select,options:'draft, published, archived', label: 'Status'},
	publishedDate:{index:true,type:Types.Date, label: 'Last Publish Date'},
	author:{ref:'User',index:true,type:Types.Relationship, label: 'Created By', noedit:true, hidden: true},
	createdAt:{index:true,default:Date.now,noedit:true,type:Types.Date,collapse:true, hidden: true},
	changedAt:{index:true,noedit:true,type:Types.Date,collapse:true,  hidden: true}}
);

ShopCategory.schema.methods.isPublished = function() {
    return this.state == 'published';
}
 
ShopCategory.schema.pre('save', function(next) {
	if (!this.isModified('changedAt')) {
		this.changedAt = Date.now();
	}
    if ( this.isModified('state') && this.isPublished() ) {  //&& !this.publishedDate
        this.publishedDate = new Date();
    }
    next();
});


ShopCategory.register();



