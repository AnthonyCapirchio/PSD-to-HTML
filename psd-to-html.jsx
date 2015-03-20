var doc     = activeDocument,    oldPath = activeDocument.path;originalRulerUnits  = preferences.rulerUnits;var mySourceFilePath    = activeDocument.fullName.path + "/",    __NAMES__           = {        cssFile       : 'style.css',        htmlFile      : 'index.html',        imagesFolder  : 'images',        currentFolder : mySourceFilePath.toString().match(/([^\.]+)/)[1],        socketFile    : 'socket.txt'    },    originalRulerUnits  = preferences.rulerUnits,    docRef        = activeDocument,    docWidth      = docRef.width.value,    docHeight       = docRef.height.value,    mySourceFilePath  = activeDocument.fullName.path + "/",    globalWidth = 0,    globalHeight = 0;var htmlDoc = function(config){  this.init(config);};htmlDoc.prototype = {    content:'',  template: '<!DOCTYPE html><html><head><meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"><style type="text/css">/* ======== DEFAULT CSS ======== */body{margin:0;background:transparent;overflow:hidden}img{max-width:100%;display:block;vertical-align:middle;image-rendering:pixelated}a{-webkit-tap-highlight-color:rgba(200,0,0,0.0)}#nb-close{display:block;width:8%;height:8%;position:absolute;top:0;left:0;border:0;background:rgba(0,0,0,0)}#background{display:block;}#container{position:relative;}.absolute{position:absolute;}/* ======== CUSTOM CSS ======== */</style><link rel="stylesheet" type="text/css" href="style.css"></head><body><div><div id="container">{CONTENT}</div></div></body></html>',  init:function(config){    this.name = config.name || 'index.html';    this.path = config.path || '';  },    push:function(str){    this.content += str;  },    save:function(){        var exportString = this.template.replace('{CONTENT}', this.content);    saveFile(__NAMES__.currentFolder + this.path + this.name, exportString);  }}var cssDoc = function(config){  this.init(config);};cssDoc.prototype = {    content:'',  init:function(config){    this.name = config.name || 'style.css';    this.path = config.path || '';  },    push:function(str){    this.content += str;  },    save:function(){    saveFile(__NAMES__.currentFolder + this.path + this.name, this.content);  }}/* create folders     + export      + images */createFolder('export');createFolder('export/images');var htmlDoc = new htmlDoc({path:'export/'});var cssDoc  = new cssDoc({path:'export/'});/* Scan Layers */scanLayerSets(doc);preferences.rulerUnits = originalRulerUnits;function cLayer(layer) {    //alert("layer ID: " + this.layerID);    this.layerWidth     = layer.bounds[2].value - layer.bounds[0].value;    this.layerHeight    = layer.bounds[3].value - layer.bounds[1].value;    // these return object coordinates relative to canvas    this.upperLeftX     = layer.bounds[0].value;    this.upperLeftY     = layer.bounds[1].value;    this.left           = this.upperLeftX;    this.top            = this.upperLeftY;    return this;}function scanLayerSets(el) {  // find plain layers in current group whose names end with .png  for(var j = (el.artLayers.length-1); j >= 0; j--) {    var name = el.artLayers[j].name;    saveLayer(el.layers.getByName(name), name, oldPath, false);  }  htmlDoc.save();  cssDoc.save();}function saveLayer(layer, lname, path, shouldMerge) {  //alert('save layer :: ' + lname);    var layerData   = cLayer(layer),      className   = '';  if(layer.name == 'background'){    globalWidth = layerData.layerWidth;    globalHeight = layerData.layerHeight;  }  else{    className = 'absolute';  }  //alert(layer.name + ' : layerWidth ' + layerData.layerWidth + ' - globalWidth : ' + globalWidth);  htmlDoc.push(['<img src="images/', sanitize(layer.name), '.png" class="',className,'" id="', sanitize(layer.name), '" />'].join(''));  cssDoc.push(['#', sanitize(layer.name), '{' , "\r",          "\t", 'width:', pixelToPercent(globalWidth, layerData.layerWidth), '%;', "\r",          "\t", 'left:', pixelToPercent(globalWidth, left), '%;', "\r",          "\t", 'top:', pixelToPercent(globalHeight, top), '%;', "\r",      '}',"\r"].join(''));  activeDocument.activeLayer = layer;  // création d'un nouveu document à partir du calque actif  dupLayers();    if (shouldMerge === undefined || shouldMerge === true) {    activeDocument.mergeVisibleLayers();  }  activeDocument.trim(TrimType.TRANSPARENT,true,true,true,true);  // enregistrement du fichier de calque isolé   var saveFile= File(path +"/export/images/"+lname+'.png');  SavePNG(saveFile);  // fermeture du fichier de calque isolé  app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);}function createFolder(name){    var folder = new Folder(__NAMES__.currentFolder + name);    if(!folder.exists) folder.create();}function saveFile(path, content){    var file = new File(path);    file.open('w');    file.writeln(content);    file.close();}function pixelToPercent(base, value){  return (value/base)*100;}function sanitize(str){  return str.replace(' ', '-');} function dupLayers() {   var desc143 = new ActionDescriptor();  var ref73 = new ActionReference();  ref73.putClass( charIDToTypeID('Dcmn') );  desc143.putReference( charIDToTypeID('null'), ref73 );  desc143.putString( charIDToTypeID('Nm  '), activeDocument.activeLayer.name );  var ref74 = new ActionReference();  ref74.putEnumerated( charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt') );  desc143.putReference( charIDToTypeID('Usng'), ref74 );  executeAction( charIDToTypeID('Mk  '), desc143, DialogModes.NO );}; function SavePNG(saveFile){    var pngOpts = new ExportOptionsSaveForWeb;     pngOpts.format = SaveDocumentType.PNG    pngOpts.PNG8 = false;     pngOpts.transparency = true;     pngOpts.interlaced = false;     pngOpts.quality = 100;    activeDocument.exportDocument(new File(saveFile),ExportType.SAVEFORWEB,pngOpts); }