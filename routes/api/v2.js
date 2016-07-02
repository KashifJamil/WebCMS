/**
 * Created by Kashif Jamil on 6/16/2016.
 */
var async = require('async'),
	keystone = require('keystone');

var DeviceRoute = keystone.list('DeviceRoute');
var Floor = keystone.list('Floor');
var FloorPlan = keystone.list('FloorPlan');
var Header = keystone.list('Header');
var InteractiveDevices = keystone.list('InteractiveDevices');
var PromotionDetail = keystone.list('PromotionDetail');
var Promotions = keystone.list('Promotions');
var Shop = keystone.list('Shop');
var ShopCategory = keystone.list('ShopCategory');
var ShopList = keystone.list('ShopList');
var Videos = keystone.list('Videos');
var Assets = keystone.list('Assets');

var itemList = [];
var includeAssetList = [];
var includeEntryList = [];
var imageFieldList = ['floorImage', 'companyLogo', 'companyBanner', 'weatherIcons', 'serviceImage', 'promotionImageSmall', 'promotionImageMedium', 'promotionImageLarge', 'videoFile', 'videoPosterImage', 'shopLogo', 'shopBannerImage', 'shopListImage'];
var referenceFieldList = ['promotionDetailId','floorId','deviceId','serviceId','shopId','routeId','shopPromotions','relatedShops','shopCategories','floorPlanIDs'];
var contentTypeOfRerenceFieldList = ['PromotionDetail','Floor','InteractiveDevices','MallServices','Shop','DeviceRoute','Promotions','Shop','ShopCategory','FloorPlan'];

var responseList, itemRecord, field, id, sysField, includeRecord, refField, fieldList, i, j, k, l, includeAssetList;

exports.list = function(req, res) {
	var contentType = req.query["content_type"];
	itemList = [];
	includeAssetList = [];
	includeEntryList = [];
	
	getData (contentType, function (items) {
		if (items != null) {
			var responseList = getRecordList(items, contentType);
			
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Headers", "X-Requested-With");
			res.header("Access-Control-Allow-Headers", "Content-Type");
			res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
			res.header('Content-Type', 'application/json');
			
			if (responseList == null)
				res.apiResponse({'error': 'data fetch error'});
			else 
				res.send(responseList);
			res.end( );
			
		} else {
			res. apiResponse({'Data': 'No data found'});
		}
	});
}

exports.get = function(req, res) {
	var contentType = req.query["content_type"];
	var id = req.params.id;

	getOne (contentType, id, function (item) {
		if (item == null)
			return res.apiResponse({'error': 'data fetch error'});

		var itemRecord = { "sys": { "id": id}, "fields": { } };
		console.log(item);
		for (var j; j < referenceFieldList.length; j++) {

			var field = referenceFieldList[j];
			var id = item[field]._id;
			if (id) {
				var sysField = { "sys" : { "id": id } };
				itemRecord.fields[field] = sysField;
			}
		}

		itemRecord = { "sys": { "id": item._id}, "fields": { } };

		for (var j; j < contentTypeOfRerenceFieldList.length; j++) {

			var field = contentTypeOfRerenceFieldList[j];
			var id = item[field]._id;
			if (id) {
				var sysField = { "sys" : { "id": id } };
				itemRecord.fields[field] = sysField;
			}
		}

		var fieldList = Object.keys(item);
		var filtered = fieldList.filter(isNotAnAssetOrEntry);

		for (var l in filtered) {
			itemRecord.fields[filtered[l]] = item[filtered[l]];
		}

		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.header("Access-Control-Allow-Headers", "Content-Type");
		res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
		res.header('Content-Type', 'application/json');
		res.send(itemRecord);
		res.end( );
	});
}

getData = function(contentType, callback) {

	var HeaderOpts = [ { path: 'companyBanner'}, { path: 'companyLogo'}, { path: 'weatherIcons'} ];
	var FloorOpt = [{ path: 'floorImage'}];
	var FloorPlanOpt = [{ path: 'floorId'}, { path: 'deviceId'}, { path: 'serviceId'}, { path: 'shopId'}, { path: 'routeId'} ];
	var InteractiveDevicesOpt = [{ path: 'floorId'}];
	var MallServicesOpt = [{ path: 'serviceImage'}];
	var PromotionsOpt = [{ path: 'shopId'}, { path: 'promotionImageSmall'}, { path: 'promotionImageMedium'}, { path: 'promotionImageLarge'}, { path: 'promotionDetailId'}, { path: 'videoPosterImage'}];
	var ShopOpt = [{ path: 'shopLogo'}, { path: 'shopBannerImage'}, { path: 'shopPromotions'}, { path: 'relatedShops'}, { path: 'floorId'}];
	var ShopListOpt = [{ path: 'shopId'}, { path: 'shopCategories'}, { path: 'shopListImage'}, { path: 'floorPlanIDs'}];
	var VideosOpt = [ { path: 'videoPosterImage'}];

	switch (contentType) {
		case 'Header':
			Header.model.find().populate(HeaderOpts).exec(function (err, headers) { if (err) callback(null); callback(headers); });
			break;
		case 'Floor' :
			Floor.model.find().populate(FloorOpt).exec(function (err, items) { if (err) callback(null);; callback(items); });
			break;
		case 'FloorPlan' :
			FloorPlan.model.find().populate(FloorPlanOpt).exec(function (err, items) { if (err) callback(null);; callback(items); });
			break;
		case 'InteractiveDevices' :
			InteractiveDevices.model.find().populate(InteractiveDevicesOpt).exec(function (err, items) { if (err) callback(null);; callback(items); });
			break;
		case 'MallServices' :
			MallServices.model.find().populate(MallServicesOpt).exec(function (err, items) { if (err) callback(null);; callback(items); });
			break;
		case 'Promotions' :
			Promotions.model.find().populate(PromotionsOpt).exec(function (err, items) { if (err) callback(null);; callback(items); });
			break;
		case 'Shop' :
			Shop.model.find().populate(ShopOpt).exec(function (err, items) { if (err) callback(null);; callback(items); });
			break;
		case 'ShopList' :
			ShopList.model.find().populate(ShopListOpt).exec(function (err, items) { if (err) callback(null);; callback(items); });
			break;
		case 'Videos' :
			Videos.model.find().populate(VideosOpt).exec(function (err, items) { if (err) callback(null);; callback(items); });
			break;
		case 'Assets':
			Assets.model.find().exec(function (err, items) { if (err) callback(null);; callback(items); });
			break;
		case 'DeviceRoute':
			DeviceRoute.model.find().exec(function (err, items) { if (err) callback(null);; callback(items); });
			break;
		case 'PromotionDetail' :
			PromotionDetail.model.find().exec(function (err, items) { if (err) callback(null);; callback(items); });
			break;
		case 'ShopCategory' :
			ShopCategory.model.find().exec(function (err, items) { if (err) callback(null);; callback(items); });
			break;
		default:
			callback(null);
	}
}

getOne = function(contentType, id, callback) {
	switch (contentType) {
		case 'Assets':
			Assets.model.findById(id).exec(function (err, items) { if (err) callback(null);; callback(items); });
			break;
		case 'DeviceRoute':
			break;
		case 'Header':
			Header.model.findById(id).exec(function (err, items) { if (err) callback(null);; callback(items); });
			break;
		case 'Floor' :
			Floor.model.findById(id).exec(function(err, items) { if (err) callback(null);; callback(items); });
			break;
		case 'FloorPlan' :
			FloorPlan.model.findById(id).exec(function(err, items) { if (err) callback(null);; callback(items); });
			break;
		case 'InteractiveDevices' :
			InteractiveDevices.model.findById(id).exec(function(err, items) { if (err) callback(null);; callback(items); });
			break;
		case 'MallServices' :
			MallServices.model.findById(id).exec(function(err, items) { if (err) callback(null);; callback(items); });
			break;
		case 'PromotionDetail' :
			PromotionDetail.model.findById(id).exec(function(err, items) { if (err) callback(null);; callback(items); });
			break;
		case 'Promotions' :
			Promotions.model.findById(id).exec(function(err, items) { if (err) callback(null);; callback(items); });
			break;
		case 'Shop' :
			Shop.model.findById(id).exec(function(err, items) { if (err) callback(null);; callback(items); });
			break;
		case 'ShopCategory' :
			ShopCategory.model.findById(id).exec(function(err, items) { if (err) callback(null);; callback(items); });
			break;
		case 'ShopList' :
			ShopList.model.findById(id).exec(function(err, items) { if (err) callback(null);; callback(items); });
			break;
		case 'Videos' :
			Videos.model.findById(id).exec(function(err, items) { if (err) callback(null);; callback(items); });
			break;
		default:
			callback(null);
	}
}

function getRecordList(items, contentType) {
	responseList =  { "total": 0, "items": [], "includes": { "Entry": [ ], "Asset": [ ] } };

	for (i=0; i < items.length; i++) {

		var item  = JSON.parse(JSON.stringify(items[i]));
//		console.log(item);
		
		itemRecord = { "sys": { "id": item._id}, "fields": { } };
		for (j=0; j < imageFieldList.length; j++) {

			field = imageFieldList[j];
			if (item[field]) {
				id = item[field]._id;
				sysField = { "sys" : { "id": id } };
				itemRecord.fields[field] = sysField;
				console.log(sysField);
				console.log(itemRecord.fields);
				includeRecord = { "sys": { "id": id}, "fields": { } };
				refField = JSON.parse(JSON.stringify(item[field]));

				fieldList = Object.keys(refField);
				for (k in fieldList) {
					includeRecord.fields[fieldList[k]] = refField[fieldList[k]];
				}
				includeAssetList.push(includeRecord);
				console.log('Ref image item included');
			}
		}

		for (j=0; j < referenceFieldList.length; j++) {

			field = referenceFieldList[j];
			if (item[field]) {
				id = item[field]._id;
				sysField = { "sys" : { "id": id } };
				itemRecord.fields[field] = sysField;

				includeRecord = { "sys": { "id": id}, "fields": { } };
				refField = JSON.parse(JSON.stringify(item[field]));

				fieldList = Object.keys(refField);

				for (k in fieldList) {
					includeRecord.fields[fieldList[k]] = refField[fieldList[k]];
				}
				includeEntryList.push(includeRecord);
				console.log('Ref content item included');
			}
		}
		fieldList = Object.keys(item);
		filtered = fieldList.filter(isNotAnAssetOrEntry);
		console.log(filtered);
		for (l in filtered) {
			console.log(item[filtered[l]]);
			itemRecord.fields[filtered[l]] = item[filtered[l]];
		}

		itemList.push(itemRecord);
		console.log('Content item included');
	}
	responseList.total = items.length;
	responseList.items = itemList;
	responseList.includes.Asset = includeAssetList;
	responseList.includes.Entry = includeEntryList;
	console.log('response list is long gone');
	return responseList;
}

function isNotAnAssetOrEntry(value) {
	if (!isInArray(value, imageFieldList)) {
		if (!isInArray(value, referenceFieldList)) {
			return value;
		}
	}
}

function isInArray(value, array) {
	return array.indexOf(value) > -1;
}

