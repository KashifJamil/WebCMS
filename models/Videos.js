var keystone = require('keystone');
var Types = keystone.Field.Types;

var Videos = new keystone.List('Videos', {
	label: 'Videos',
	autokey: { from: 'videoTitle', path: 'slug', unique: true },
	map: { name: 'videoTitle' },
	searchFields: 'videoTitle',
	defaultSort: '-createDate',
	sortable: true,
//	drilldown: 'author',
	track: true,
	defaultColumns : 'videoTitle, state|20%, publishedDate|20%'
});

Videos.add(
	{
	videoTitle:{default:null,label:'Video Title',required:false,type:Types.Text,note:''},
	shortDescription:{default:null,label:'Short Description',required:false,type:Types.Text,note:''},
	videoPurpose:{type:Types.Select,options:[
	{value:'For Home Page',label:'For Home Page'},
	{value:'For Food Court',label:'For Food Court'},
	{value:'For Explore Shops Page',label:'For Explore Shops Page'}]},
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
	changedAt:{index:true,noedit:true,type:Types.Date,collapse:true,  hidden: true}}
);

Videos.schema.methods.isPublished = function() {
    return this.state == 'published';
}

Videos.schema.pre('save', function(next) {
	if (!this.isModified('changedAt')) {
		this.changedAt = Date.now();
	}
    if ( this.isModified('state') && this.isPublished() ) {  //&& !this.publishedDate
        this.publishedDate = new Date();
    }
    next();
});


Videos.register();



