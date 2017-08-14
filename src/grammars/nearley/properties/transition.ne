@builtin "whitespace.ne"

@{%
  const locationMap = require('../../../utils/LocationIndexTracker');
  var a  = 0;
%}

Base -> ( ( SingleTransition _ "," _):* SingleTransition ) {% function (data,location) { return { name: 'Base', values: data.filter(Boolean), location }; } %}
SingleTransition -> ( Time | SingleTransitionTimingFunction | ( ( "none" | SingleTransitionProperty ) ) ) ( __ ( Time | SingleTransitionTimingFunction | ( ( "none" | SingleTransitionProperty ) ) ) ):* {% function (data,location) {
  console.log('single', location, a++);
  return { name: 'SingleTransition', values: data.filter(Boolean), location };
} %}
Time -> Number TimeUnit {% function (data,location) { return { name: 'Time', values: data.filter(Boolean), location }; } %}
SingleTransitionTimingFunction -> SingleTimingFunction {% function (data,location) { return { name: 'SingleTransitionTimingFunction', values: data.filter(Boolean), location }; } %}
SingleTransitionProperty -> ( "all" | CustomIdent ) {% function (data, location, reject) {
  // since transition property is a custom ident,
  a = 0;
  console.log(a);
  return { name: 'SingleTransitionProperty', values: data.filter(Boolean), location };
} %}
Number -> ( "+" | "-" ):?  ( Number_simple | Number_float )
Number_simple -> [0-9]:+
Number_float -> [0-9]:* "." [0-9]:+
TimeUnit -> ( "ms" | "s" )
SingleTimingFunction -> ( ( ( "linear" | CubicBezierTimingFunction ) | StepTimingFunction ) | FramesTimingFunction )
CubicBezierTimingFunction -> ( "ease" | "ease-in" | "ease-out" | "ease-in-out" | "cubic-bezier(" _ Number _ "," _ Number _ "," _ Number _ "," _ Number _ ")" )
StepTimingFunction -> ( ( "step-start" | "step-end" ) | ( ( ( ( "steps(" __ Integer ) __ ( ( "," __ ( ( "start" | "end" ) ) ) ):? ) __ ")" ) ) )
FramesTimingFunction -> "frames(" Integer ")"
Integer -> ( ("+" | "-"):?  [0-9]:+ )
CustomIdent -> [^0-9-] [a-zA-Z0-9\-_]:*