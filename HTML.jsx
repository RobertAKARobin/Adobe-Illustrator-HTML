var font = app.textFonts.getByName("LetterGothicStd-Bold"); 
var tracking = -100;
var size = 12;
var tags = [
'!DOCTYPE html',
  'html,/html',
  'head,/head',
  'title,/title',
  'body,/body',
  'header,/header',
  'main,/main',
  'footer,/footer',
  'section,/section,2',
  'div,/div,2',
  'span,/span',
  'h1,/h1',
  'h2,/h2,2',
  'h3,/h3,2',
  'blockquote,/blockquote',
  'p,/p,3',
  'pre,/pre',
  'dl,/dl',
  'dt,/dt,2',
  'dd,/dd,2',
  'ul,/ul',
  'ol,/ol',
  'li,/li,3',
  '<a href="#">,/a',
  'em,/em',
  'strong,/strong',
  'small,/small',
  'q,/q',
  '<img alt="," src="#"/>',
  'br /,,2',
  ];

function walk(collection, closure){
  switch(collection instanceof Array){
    case true:
      for(var x = 0; x < collection.length; x++){
        closure(x, collection[x]);
      }
      break;
    case false:
      for(var x in collection){
        closure(x, collection[x]);
      }
      break;
  }
}

function Tags(tags){
  var instance	  = this;
  this.tags    	  = tags;
  this.all        = [];
  this.groups     = [];
  parse();
  create();
  lines();

  function parse(){
    walk(instance.tags, function(x, tag){
      var tag = tag.split(",");
      if(tag[0] == ""){ return }
      instance.all.push({
        "open" : tag[0],
        "close": tag[1],
        "repeat" : tag[2] ? tag[2] : 1
      })
    })
  }

  function create(){
    var tagNumber = 0;
    walk(instance.all, function(index, tag){
      for(var x = 0; x < tag["repeat"]; x++){
        walk(tag, function(type, value){
          if(!value || type == "repeat"){ return }
          if(value.indexOf("<") == -1  && value.indexOf(">") == -1){
            value = "<" + value + ">";
          }
          tagNumber++;
          var element = app.activeDocument.textFrames.pointText([0,-(tagNumber * size)]);
          element.contents = value;

          var text = element.textRange.characterAttributes;
          text.textFont = font;
          text.tracking = tracking;
          text.size     = size;

          instance.groups.push(element.createOutline());
        })
      }
    })
  }

  function lines(){
    walk(instance.groups, function(index, group){
    })
  }
}

new Tags(tags)
