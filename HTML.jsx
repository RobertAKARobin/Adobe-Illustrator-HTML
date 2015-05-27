var font = {
  face:     app.textFonts.getByName("LetterGothicStd-Bold"), 
  tracking: 0,
  size:     20,
  baseline: -3,
  theight:  UnitValue(.375, "in").as("pt")
};


var tags = [
  [
    "<!DOCTYPE html>",
    "html",
    "head",
    "&lt;",
    "&gt;"
  ],
  [
    "title",
    "body",
    "header",
    "&ne;"
  ],
  [
    "main",
    "footer",
    "<img alt='",
    "' src='#'/>"
  ],
  [
    "section",
    "section",
    "span"
  ],
  [
    "h1",
    "   mailto:robin@magneticHTML.com   ",
    "ol"
  ],
  [
    "h2",
    "<script>alert('Welcome!');</script>",
    "ul"
  ],
  [
    "h2",
    "<style>*{ font-family:'Comic Sans';",
    "li"
  ],
  [
    "h3",
    "position:fixed!important; }</style>",
    "li",
  ],
  [
    "h3",
    "<? echo(T_PAAMAYIM_NEKUDOTAYIM); ?>",
    "li",
  ],
  [
    "dl",
    "&mdash;",
    "&tradem;",
    "&shy;",
    "<!--",
    "-->",
    "dd"
  ],
  [
    "dt",
    "div",
    "div",
    "<br/>",
    "dd"
  ],
  [
    "dt",
    "blockquote",
    "q",
    "&hellip;"
  ],
  [
    "p",
    "marquee",
    "strong",
    "&copy;"
  ],
  [
    "p",
    "blink",
    "pre",
    "&amp;",
    "s"
  ],
  [
    "p",
    "aside",
    "<a href='#'>",
    "</a>",
    "em"
  ]
];

function walk(collection, callback){
  switch(collection instanceof Array){
    case true:
      for(var x = 0; x < collection.length; x++){
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
  place();

  function textBox(value){
    var group     = groups.add(),
      textBox   = group.textFrames.pointText([left, up]),
      textChars = textBox.textRange.characterAttributes,
      bounds,
    border;

    textBox.contents = " " + value + " ";
    textChars.textFont = font.face;
    textChars.tracking = font.tracking;
    textChars.size     = font.size;
    if(/\&/.test(value)){
      textChars.fillColor = rgb(153, 69, 0);
    }else{
      textChars.fillColor= rgb(136, 18, 128);
    }

    bounds = group.geometricBounds;
    border = group.pathItems.rectangle(
      up,
      bounds[0],
      bounds[2] - bounds[0],
      font.theight
    );
    left = bounds[2];
    border.filled = false;
    border.strokeColor = rgb(0, 0, 0);
    border.strokeWidth = 0.001;
  };

  function place(){
    walk(tags, function(rownum, row){
      left = 0;
      walk(row, function(tagnum, tag){
        if(/^[a-zA-Z0-9]*$/.test(tag)){
          textBox("".concat("<",tag,">"));
          textBox("".concat("</",tag,">"));
        }else{
          textBox(tag);
        }
      });
      up = -1 * font.theight * (rownum + 1);
    });
  }
};

new makeTags(tags);
