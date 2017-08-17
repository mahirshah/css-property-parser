@builtin "whitespace.ne"

@{%
  const moo = require("moo");

  const lexer = moo.compile({
    singleTimingFunction: ["linear", "ease", "ease-in", "ease-out", "ease-in-out"],
    none: "none",
    all: "all",
    timeUnit: ["s", "ms"],
    ident: {
      match: /[^0-9-\s][a-zA-Z0-9\-_]*/,
      keywords: {
        singleTimingFunction: ["linear", "ease", "ease-in", "ease-out", "ease-in-out"],
        none: "none",
        all: "all",
        timeUnit: ["s", "ms"]
      }
    },
    number: /(?:\+|\-)?(?:[0-9]+\.[0-9]*)|(?:[0-9]*\.[0-9]+)|(?:[0-9]+)/,
    char: /./,
  });
%}

@lexer lexer

Base -> ( ( SingleTransition _ "," _):* SingleTransition ) {% function (data,location) { return { name: 'Base', values: data.filter(Boolean), location: lexer.index }; } %}
SingleTransition -> ( Time | SingleTransitionTimingFunction | ( ( "none" | SingleTransitionProperty ) ) ) ( __ ( Time | SingleTransitionTimingFunction | ( ( "none" | SingleTransitionProperty ) ) ) ):* {% function (data,location) {
  return { name: 'SingleTransition', values: data.filter(Boolean), location: lexer.index };
} %}
Time -> %number %timeUnit {% function (data,location) { return { name: 'Time', values: data.filter(Boolean), location: lexer.index }; } %}
SingleTransitionTimingFunction -> SingleTimingFunction {% function (data,location) { return { name: 'SingleTransitionTimingFunction', values: data.filter(Boolean), location: lexer.inder }; } %}
SingleTransitionProperty -> ( "all" | CustomIdent ) {% function (data, location) {
  return { name: 'SingleTransitionProperty', values: data.filter(Boolean), location: lexer.index };
} %}
Number -> %number
SingleTimingFunction -> ( ( ( CubicBezierTimingFunction ) | StepTimingFunction ) | FramesTimingFunction )
CubicBezierTimingFunction -> ( "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "cubic-bezier(" _ Number _ "," _ Number _ "," _ Number _ "," _ Number _ ")" )
StepTimingFunction -> ( ( "step-start" | "step-end" ) | ( ( ( ( "steps(" __ Integer ) __ ( ( "," __ ( ( "start" | "end" ) ) ) ):? ) __ ")" ) ) )
FramesTimingFunction -> "frames(" Integer ")"
Integer -> ( ("+" | "-"):?  [0-9]:+ )
CustomIdent -> %ident
