@builtin "whitespace.ne"

@{%
  const locationMap = require('../../../utils/LocationIndexTracker');
%}

Base -> ( BgLayer _ "," _ ):* FinalBgLayer {% function (data,location) {return { name: 'Base', values: data.filter(Boolean), location }; } %}

BgLayer -> ( BgImage | ( Position ( _ "/" _ BgSize ):? ) | RepeatStyle | Attachment | ( Box ( __ Box ):? ) ) ( __ ( BgImage | ( Position ( _ "/" _ BgSize ):? ) | RepeatStyle | Attachment | ( Box ( __ Box ):? ) ) ):* {% function(data, location) {
  return { name: 'BgLayer', values: data.filter(Boolean), location };
} %}

FinalBgLayer -> ( BgImage | ( Position ( _ "/" _ BgSize ):? ) | RepeatStyle | Attachment | Box | Box | BackgroundColor ) ( __ ( BgImage | ( Position ( _ "/" _ BgSize ):? ) | RepeatStyle | Attachment | Box | Box | BackgroundColor ) ):* {% function(data, location) {
  return { name: 'FinalBgLayer', values: data.filter(Boolean), location };
} %}

BgImage -> ( "none" | Image ) {% function (data,location) { return { name: 'BgImage', values: data.filter(Boolean), location }; } %}

Position -> ( ( ( ( ( ( ( ( ( "left" | "center" ) | "right" ) | "top" ) | "bottom" ) | LengthPercentage ) ) | ( ( ( ( ( "left" | "center" ) | "right" ) | LengthPercentage ) ) __ ( ( ( ( "top" | "center" ) | "bottom" ) | LengthPercentage ) ) ) ) | ( ( ( ( "center" | ( ( ( "left" | "right" ) ) __ LengthPercentage:? ) ) ) __ ( ( "center" | ( ( ( "top" | "bottom" ) ) __ LengthPercentage:? ) ) ) ) | ( ( ( "center" | ( ( ( "top" | "bottom" ) ) __ LengthPercentage:? ) ) ) __ ( ( "center" | ( ( ( "left" | "right" ) ) __ LengthPercentage:? ) ) ) ) ) ) ) {% function (data, location, reject) {
  if(locationMap.location2 !== -1 && location !==  locationMap.location2) {
    return reject;
  }

  locationMap.location2 = location;
  return { name: 'Position', values: data.filter(Boolean), location };
} %}
BgSize -> ( ( ( ( ( LengthPercentage | "auto" ) ) ( __ ( ( LengthPercentage | "auto" ) ) ):? ) | "cover" ) | "contain" ) {% function (data,location) { return { name: 'BgSize', values: data.filter(Boolean), location }; } %}


RepeatStyle -> ( ( "repeat-x" | "repeat-y" ) | ( ( ( ( ( "repeat" | "space" ) | "round" ) | "no-repeat" ) ) ( __ ( ( ( ( "repeat" | "space" ) | "round" ) | "no-repeat" ) ) ):? ) ) {%
function (data, location, reject) {
  if(locationMap.location1 !== -1 && location !==  locationMap.location1) {
    return reject;
  }

  locationMap.location1 = location;
  return { name: 'RepeatStyle', values: data.filter(Boolean), location };
} %}

Attachment -> ( ( "scroll" | "fixed" ) | "local" ) {% function (data,location) { return { name: 'Attachment', values: data.filter(Boolean), location }; } %}


Box -> ( ( "border-box" | "padding-box" ) | "content-box" ) {% function (data,location) { return { name: 'Box', values: data.filter(Boolean), location }; } %}



Image -> ( ( ( ( ( Url | ImageFunc ) | ImageSetFunc ) | ElementFunc ) | CrossFadeFunc ) | Gradient )
Url -> ( "url(" [^)]:* ")" )
ImageFunc -> "image(" _ ( ImageFunc_inner1 | ImageFunc_inner2 | ImageFunc_inner3 ) _ ")"
ImageFunc_inner1 -> ( Image | String )
ImageFunc_inner2 -> Color
ImageFunc_inner3 -> ( Image | String ) _  "," _ Color
ImageSetFunc -> ( ( "image-set(" __ ( ( ImageSetOption _ "," _):* ImageSetOption ) ) __ ")" )
ElementFunc -> ( ( "element(" __ IdSelector ) __ ")" )
CrossFadeFunc -> ( ( ( ( "cross-fade(" __ CfMixingImage ) __ "," ) __ CfFinalImage:? ) __ ")" )
Gradient -> ( ( ( LinearGradientFunc | RepeatingLinearGradientFunc ) | RadialGradientFunc ) | RepeatingRadialGradientFunc )
String -> ( ['"]  [^'"]:*  ['"]  )
Color -> ( ( ( ( ( ( ( RgbFunc | RgbaFunc ) | HslFunc ) | HslaFunc ) | HexColor ) | NamedColor ) | "currentcolor" ) | DeprecatedSystemColor )
RgbFunc -> "rgb(" _ ( ( ( Percentage __ Percentage __ Percentage ) | ( Integer __ Integer __ Integer ) ( _ "/" _ AlphaValue ):? ) |  ( ( Percentage _ "," _ Percentage _ "," _ Percentage ) | ( Integer _ "," _ Integer _ "," _ Integer ) ( _ "," _ AlphaValue ):? ) ) _ ")"
RgbaFunc -> "rgba(" _ ( ( ( Percentage __ Percentage __ Percentage ) | ( Integer __ Integer __ Integer ) ( _ "/" _ AlphaValue ):? ) |  ( ( Percentage _ "," _ Percentage _ "," _ Percentage ) | ( Integer _ "," _ Integer _ "," _ Integer ) ( _ "," _ AlphaValue ):? ) ) _ ")"
HslFunc -> "hsl(" _ ( ( Hue __ Percentage __ Percentage ( _ "/" _ AlphaValue ):? ) | ( Hue _ "," _ Percentage _ "," _ Percentage ( _ "," _ AlphaValue ):? ) ) _ ")"
HslaFunc -> "hsla(" _ ( ( Hue __ Percentage __ Percentage ( _ "/" _ AlphaValue ):? ) | ( Hue _ "," _ Percentage _ "," _ Percentage ( _ "," _ AlphaValue ):? ) ) _ ")"
HexColor -> ( "#" ( HexColor_eight | HexColor_six | HexColor_four | HexColor_three ) )
HexColor_three -> HexColor_hexDigit HexColor_hexDigit HexColor_hexDigit
HexColor_four -> HexColor_hexDigit HexColor_hexDigit HexColor_hexDigit HexColor_hexDigit
HexColor_six -> HexColor_hexDigit HexColor_hexDigit HexColor_hexDigit HexColor_hexDigit HexColor_hexDigit HexColor_hexDigit
HexColor_eight -> HexColor_hexDigit HexColor_hexDigit HexColor_hexDigit HexColor_hexDigit HexColor_hexDigit HexColor_hexDigit HexColor_hexDigit HexColor_hexDigit
HexColor_hexDigit -> [0-9A-Fa-f]
NamedColor -> ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( "transparent" | "aliceblue" ) | "antiquewhite" ) | "aqua" ) | "aquamarine" ) | "azure" ) | "beige" ) | "bisque" ) | "black" ) | "blanchedalmond" ) | "blue" ) | "blueviolet" ) | "brown" ) | "burlywood" ) | "cadetblue" ) | "chartreuse" ) | "chocolate" ) | "coral" ) | "cornflowerblue" ) | "cornsilk" ) | "crimson" ) | "cyan" ) | "darkblue" ) | "darkcyan" ) | "darkgoldenrod" ) | "darkgray" ) | "darkgreen" ) | "darkgrey" ) | "darkkhaki" ) | "darkmagenta" ) | "darkolivegreen" ) | "darkorange" ) | "darkorchid" ) | "darkred" ) | "darksalmon" ) | "darkseagreen" ) | "darkslateblue" ) | "darkslategray" ) | "darkslategrey" ) | "darkturquoise" ) | "darkviolet" ) | "deeppink" ) | "deepskyblue" ) | "dimgray" ) | "dimgrey" ) | "dodgerblue" ) | "firebrick" ) | "floralwhite" ) | "forestgreen" ) | "fuchsia" ) | "gainsboro" ) | "ghostwhite" ) | "gold" ) | "goldenrod" ) | "gray" ) | "green" ) | "greenyellow" ) | "grey" ) | "honeydew" ) | "hotpink" ) | "indianred" ) | "indigo" ) | "ivory" ) | "khaki" ) | "lavender" ) | "lavenderblush" ) | "lawngreen" ) | "lemonchiffon" ) | "lightblue" ) | "lightcoral" ) | "lightcyan" ) | "lightgoldenrodyellow" ) | "lightgray" ) | "lightgreen" ) | "lightgrey" ) | "lightpink" ) | "lightsalmon" ) | "lightseagreen" ) | "lightskyblue" ) | "lightslategray" ) | "lightslategrey" ) | "lightsteelblue" ) | "lightyellow" ) | "lime" ) | "limegreen" ) | "linen" ) | "magenta" ) | "maroon" ) | "mediumaquamarine" ) | "mediumblue" ) | "mediumorchid" ) | "mediumpurple" ) | "mediumseagreen" ) | "mediumslateblue" ) | "mediumspringgreen" ) | "mediumturquoise" ) | "mediumvioletred" ) | "midnightblue" ) | "mintcream" ) | "mistyrose" ) | "moccasin" ) | "navajowhite" ) | "navy" ) | "oldlace" ) | "olive" ) | "olivedrab" ) | "orange" ) | "orangered" ) | "orchid" ) | "palegoldenrod" ) | "palegreen" ) | "paleturquoise" ) | "palevioletred" ) | "papayawhip" ) | "peachpuff" ) | "peru" ) | "pink" ) | "plum" ) | "powderblue" ) | "purple" ) | "rebeccapurple" ) | "red" ) | "rosybrown" ) | "royalblue" ) | "saddlebrown" ) | "salmon" ) | "sandybrown" ) | "seagreen" ) | "seashell" ) | "sienna" ) | "silver" ) | "skyblue" ) | "slateblue" ) | "slategray" ) | "slategrey" ) | "snow" ) | "springgreen" ) | "steelblue" ) | "tan" ) | "teal" ) | "thistle" ) | "tomato" ) | "turquoise" ) | "violet" ) | "wheat" ) | "white" ) | "whitesmoke" ) | "yellow" ) | "yellowgreen" )
DeprecatedSystemColor -> ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( ( "ActiveBorder" | "ActiveCaption" ) | "AppWorkspace" ) | "Background" ) | "ButtonFace" ) | "ButtonHighlight" ) | "ButtonShadow" ) | "ButtonText" ) | "CaptionText" ) | "GrayText" ) | "Highlight" ) | "HighlightText" ) | "InactiveBorder" ) | "InactiveCaption" ) | "InactiveCaptionText" ) | "InfoBackground" ) | "InfoText" ) | "Menu" ) | "MenuText" ) | "Scrollbar" ) | "ThreeDDarkShadow" ) | "ThreeDFace" ) | "ThreeDHighlight" ) | "ThreeDLightShadow" ) | "ThreeDShadow" ) | "Window" ) | "WindowFrame" ) | "WindowText" )
Integer -> ( ("+" | "-"):?  [0-9]:+ )
Percentage -> Number "%"
AlphaValue -> ( Number | Percentage )
Number -> ( "+" | "-" ):?  ( Number_simple | Number_float )
Number_simple -> [0-9]:+
Number_float -> [0-9]:* "." [0-9]:+
Hue -> ( Number | Angle )
Angle -> Number AngleUnit
AngleUnit -> ( "deg" | "grad" | "rad" | "turn" )
ImageSetOption -> ( ( ( Image | String ) ) __ Resolution )
Resolution -> Number ResolutionUnit
ResolutionUnit -> ( "dpcm" | "dpi" | "dppx" )
IdSelector -> ( "#" [^ ]:+ )
CfMixingImage -> ( ( Percentage:? __ Image ) | ( Image ( __ Percentage:? ):? ) )
CfFinalImage -> ( Image | Color )
LinearGradientFunc -> ( ( "linear-gradient(" __ ( ( Angle | ( "to" __ SideOrCorner ) ) ):? ColorStopList ) __ ")" )
RepeatingLinearGradientFunc -> ( ( "repeating-linear-gradient(" __ ( ( Angle | ( "to" __ SideOrCorner ) ) ):? ColorStopList ) __ ")" )
RadialGradientFunc -> ( ( ( "radial-gradient(" __ ( ( EndingShape | Size ) ( __ ( EndingShape | Size ) ):* ):? ) __ ( ( "at" __ Position ) ):? ColorStopList ) __ ")" )
RepeatingRadialGradientFunc -> ( ( ( "repeating-radial-gradient(" __ ( ( EndingShape | Size ) ( __ ( EndingShape | Size ) ):* ):? ) __ ( ( "at" __ Position ) ):? ColorStopList ) __ ")" )
SideOrCorner -> ( ( ( "left" | "right" ) ) | ( ( "top" | "bottom" ) ) ) ( __ ( ( ( "left" | "right" ) ) | ( ( "top" | "bottom" ) ) ) ):*
ColorStopList -> ( ColorStop _ "," _ ColorStop ( _ "," _ ColorStop ):* )
ColorStop -> ( Color __ LengthPercentage:? )
LengthPercentage -> ( Length | Percentage )
Length -> ( Length_numberWithUnit | "0" )
Length_numberWithUnit -> Number LengthUnit
LengthUnit -> ( "ch" | "cm" | "em" | "ex" | "fr" | "in" | "mm" | "pc" | "pt" | "px" | "q" | "rem" | "vh" | "vmax" | "vmin" | "vw" )
EndingShape -> ( "circle" | "ellipse" )
Size -> ( ( ( ( ( "closest-side" | "farthest-side" ) | "closest-corner" ) | "farthest-corner" ) | Length ) | ( LengthPercentage __ LengthPercentage ) )
BackgroundColor -> Color {% function (data,location) { return { name: 'BackgroundColor', values: data.filter(Boolean), location }; } %}