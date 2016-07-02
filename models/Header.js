var keystone = require('keystone');
var Types = keystone.Field.Types;

var Header = new keystone.List('Header', {
	label: 'Shopping Mall Company',
	autokey: { from: 'companyName', path: 'slug', unique: true },
	map: { name: 'companyName' },
	searchFields: 'companyName',
	defaultSort: '-createDate',
	sortable: true,
//	drilldown: 'author',
	track: true,
	defaultColumns : 'companyName, state|20%, publishedDate|20%'
});

Header.add(
	{
	companyName:{default:null,label:'Company Name',required:false,type:Types.Text,note:''},
	companyAddress:{default:null,height:150,wysiwyg:true,label:'Company Address',required:false,type:Types.Html,note:''},
	phone:{default:null,label:'Phone',required:false,type:Types.Text,note:''},
	email:{default:null,label:'Email',required:false,type:Types.Email,note:''},
	companyLogo:{ref:'Assets',default:null,label:'Image ',required:false,type:Types.Relationship,note:''},
	companyBanner:{ref:'Assets',default:null,label:'Image ',required:false,type:Types.Relationship,note:''},
	mallLocation:{default:{country:'Canada'}, label:'Mall Location',required:false,type:Types.Location,note:''},
	monday:{default:null,label:'Monday',required:false,type:Types.Text,note:''},
	tuesday:{default:null,label:'Tuesday',required:false,type:Types.Text,note:''},
	wednesday:{default:null,label:'Wednesday',required:false,type:Types.Text,note:''},
	thursday:{default:null,label:'Thursday',required:false,type:Types.Text,note:''},
	friday:{default:null,label:'Friday',required:false,type:Types.Text,note:''},
	saturday:{default:null,label:'Saturday',required:false,type:Types.Text,note:''},
	sunday:{default:null,label:'Sunday',required:false,type:Types.Text,note:''},
	weatherTemprature:{default:null,label:'Weather Temprature',required:false,type:Types.Text,note:''},
	weatherIcons:{ref:'Assets',default:null,label:'Image ',required:false,type:Types.Relationship,note:''},
	weatherStatus:{type:Types.Select,options:[{value:'Sunny',label:'Sunny'},
	{value:'Cloudy',label:'Cloudy'},
	{value:'Partly Cloudy',label:'Partly Cloudy'},
	{value:'Mostly Sunny',label:'Mostly Sunny'},
	{value:'Mostly Sunny',label:'Mostly Sunny'},
	{value:'Rain Showers',label:'Rain Showers'},
	{value:'Rain',label:'Rain'},
	{value:'Sleet',label:'Sleet'},
	{value:'Cleer',label:'Cleer'},
	{value:'Partly Cloudy Evening',label:'Partly Cloudy Evening'},
	{value:'Foggy',label:'Foggy'},
	{value:'Snow',label:'Snow'}]},
	author:{ref:'User',index:true,type:Types.Relationship, label: 'Created By'},
	state:{index:true,default:'draft',type:Types.Select,options:'draft, published, archived', label: 'Status'},
	publishedDate:{index:true,type:Types.Date, label: 'Last Publish Date'},
	createdAt:{index:true,default:Date.now,noedit:true,type:Types.Date,collapse:true, hidden: true},
	changedAt:{index:true,noedit:true,type:Types.Date,collapse:true ,  hidden: true}
   }
);

Header.schema.methods.isPublished = function() {
    return this.state == 'published';
}

Header.schema.pre('save', function(next) {
	if (!this.isModified('changedAt')) {
		this.changedAt = Date.now();
	}
    if ( this.isModified('state') && this.isPublished() ) {  //&& !this.publishedDate
        this.publishedDate = new Date();
    }
    next();
});


Header.register();



