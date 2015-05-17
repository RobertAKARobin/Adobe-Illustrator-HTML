var font = {
  face:     app.textFonts.getByName("LetterGothicStd-Bold"), 
  tracking: -100,
  size:     12
};
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
  'a href="#",/a',
  'em,/em',
  'strong,/strong',
  'small,/small',
  'q,/q',
  '<img alt="," src="#"/>',
  'br /,,1',
  ];

function walk(collection, callback){
  switch(collection instanceof Array){
    case true:
      for(var x = collection.length - 1; x >= 0; x--){
        callback(x, collection[x]);
      };
      break;
    case false:
      for(var x in collection){
        callback(x, collection[x]);
      };
      break;
  };
};

function rgb(r, g, b){
  color = new RGBColor();
  color.red = r;
  color.green = g;
  color.blue = b;
  return color;
};

function pad(value){
  var multiple      = 3,
      padString     = " ",
      value         = padString + value + padString,
      paddingNeeded = multiple - (value.length % multiple),
      paddingRight  = Math.round(paddingNeeded / 2),
      paddingLeft   = paddingNeeded - paddingRight;
  if(paddingNeeded % multiple === 0){
    return value;
  }else{
    return Array(paddingLeft + 1).join(padString) + value + Array(paddingRight + 1).join(padString);
  };
};

function makeTags(tags){
  var tags    = tags,
      all     = [],
      layer   = app.activeDocument.activeLayer,
      groups  = layer.groupItems,
      left    = 0,
      up      = 0;
  parse();
  place();

  function parse(){
    walk(tags, function(x, tag){
      var tag = tag.split(",");
      if(tag[0] == ""){
        return;
      }
      all.push({
        open : tag[0],
        close: tag[1],
        repeat : tag[2] ? tag[2] : 1
      });
    });
    all = all.sort(function(a, b){
      return a.open.length - b.open.length;
    });
  };

  function textBox(parent, value, startX, startY){
    var group     = parent.groupItems.add(),
        textBox   = group.textFrames.pointText([startX, startY]),
        textChars = textBox.textRange.characterAttributes,
        bounds,
        border;

    textBox.contents = value;
    textChars.textFont = font.face;
    textChars.tracking = font.tracking;
    textChars.size     = font.size;

    bounds = group.geometricBounds;
    border = group.pathItems.rectangle(
        bounds[1],
        bounds[0],
        bounds[2] - bounds[0],
        UnitValue(.5, "cm").as("pt")
        );
    left = bounds[2];
    border.filled = false;
    border.strokeColor = rgb(255, 0, 0);
    border.strokeWidth = 0.001;
  };


  function place(){
    walk(all, function(index, tag){
      for(var x = tag["repeat"] - 1; x >= 0; x--){
        var pair = groups.add();
        walk(tag, function(type, value){
          if(!value || type == "repeat"){
            return;
          }
          if(value.indexOf("<") == -1  && value.indexOf(">") == -1){
            value = "<" + value + ">";
          }
          value = " " + value + " ";

          if(type === "open"){
            up = up - UnitValue(.5, "cm").as("pt");
            left = 0;
          }
          textBox(pair, value, left, up);
        });
      };
    });
  };
};

new makeTags(tags);
