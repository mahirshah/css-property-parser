@builtin "whitespace.ne"

Base ->  ( ( ( ( ( ( ( ( FontStyle | FontVariantCss21 | FontWeight | FontStretch ) ( __ ( FontStyle | FontVariantCss21 | FontWeight | FontStretch ) ):* ):? __ FontSize ) | FontSize ) ( ( _ "/" _ LineHeight ) ):? ) __ FontFamily ) ) | "caption"  | "icon"  | "menu"  | "message-box"  | "small-caption"  | "status-bar" ) {% function (data,location) { return { name: 'Base', values: data.filter(Boolean), location }; } %}
FontStyle -> ( ( "normal" | "italic" ) | "oblique" ) {% function (data,location) { return { name: 'FontStyle', values: data.filter(Boolean), location }; } %}
FontVariantCss21 -> ( ( "normal" | "small-caps" ) ) {% function (data,location) { return { name: 'FontVariantCss21', values: data.filter(Boolean), location }; } %}
FontWeight -> ( ( ( ( ( ( ( ( ( ( ( ( "normal" | "bold" ) | "bolder" ) | "lighter" ) | "100" ) | "200" ) | "300" ) | "400" ) | "500" ) | "600" ) | "700" ) | "800" ) | "900" ) {% function (data,location) { return { name: 'FontWeight', values: data.filter(Boolean), location }; } %}
FontStretch -> ( ( ( ( ( ( ( ( "normal" | "ultra-condensed" ) | "extra-condensed" ) | "condensed" ) | "semi-condensed" ) | "semi-expanded" ) | "expanded" ) | "extra-expanded" ) | "ultra-expanded" ) {% function (data,location) { return { name: 'FontStretch', values: data.filter(Boolean), location }; } %}
FontSize -> ( ( AbsoluteSize | RelativeSize ) | LengthPercentage ) {% function (data,location) { return { name: 'FontSize', values: data.filter(Boolean), location }; } %}
LineHeight -> ( ( ( "normal" | Number ) | Length ) | Percentage ) {% function (data,location) { return { name: 'LineHeight', values: data.filter(Boolean), location }; } %}
FontFamily -> ( ( ( ( FamilyName | GenericFamily ) ) _ "," _):* ( ( FamilyName | GenericFamily ) ) ) {% function (data,location) { return { name: 'FontFamily', values: data.filter(Boolean), location }; } %}
AbsoluteSize -> ( ( ( ( ( ( "xx-small" | "x-small" ) | "small" ) | "medium" ) | "large" ) | "x-large" ) | "xx-large" )
RelativeSize -> ( "larger" | "smaller" )
LengthPercentage -> ( Length | Percentage )
Length -> ( Length_numberWithUnit | "0" )
Length_numberWithUnit -> Number LengthUnit
Percentage -> Number "%"
Number -> ( "+" | "-" ):?  ( Number_simple | Number_float )
Number_simple -> [0-9]:+
Number_float -> [0-9]:* "." [0-9]:+
LengthUnit -> ( "ch" | "cm" | "em" | "ex" | "fr" | "in" | "mm" | "pc" | "pt" | "px" | "q" | "rem" | "vh" | "vmax" | "vmin" | "vw" )
FamilyName -> ( String | ( CustomIdent ( __ CustomIdent ):* ) )
GenericFamily -> ( ( ( ( "serif" | "sans-serif" ) | "cursive" ) | "fantasy" ) | "monospace" )
String -> ( ['"]  [^'"]:*  ['"]  )
CustomIdent -> [^0-9-] [a-zA-Z0-9\-_]:* 