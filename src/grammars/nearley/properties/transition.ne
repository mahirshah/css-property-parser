@builtin "whitespace.ne"

@{%
  const moo = require("moo");

  const lexer = moo.compile({
    singleTimingFunction: ["linear", "ease", "ease-in", "ease-out", "ease-in-out"],
    none: "none",
    all: "all",
    functionStart: /[a-zA-Z\-]+\(/,
    ident: {
      match: /[a-zA-Z_][a-zA-Z0-9\-_]*/,
      keywords: {
        singleTimingFunction: ["linear", "ease", "ease-in", "ease-out", "ease-in-out"],
        none: "none",
        all: "all",
        timeUnit: ["s", "ms"]
      }
    },
    timeUnit: ["s", "ms"],
    number: /(?:\+|\-)?(?:[0-9]+\.[0-9]*)|(?:[0-9]*\.[0-9]+)/,
    integer: /(?:\+|\-)?[0-9]+/,
    char: /./,
  });
%}

@lexer lexer

Base -> ( ( SingleTransition _ "," _):* SingleTransition ) {% function (data,location) { return { name: 'Base', values: data.filter(Boolean), location: lexer.index }; } %}
SingleTransition -> ( Time | SingleTransitionTimingFunction | ( ( "none" | SingleTransitionProperty ) ) ) ( __ ( Time | SingleTransitionTimingFunction | ( ( "none" | SingleTransitionProperty ) ) ) ):* {% function (data,location) {
  return { name: 'SingleTransition', values: data.filter(Boolean), location: lexer.index };
} %}
Time -> Number %timeUnit {% function (data,location) { return { name: 'Time', values: data.filter(Boolean), location: lexer.index }; } %}
SingleTransitionTimingFunction -> SingleTimingFunction {% function (data,location) { return { name: 'SingleTransitionTimingFunction', values: data.filter(Boolean), location: lexer.inder }; } %}
SingleTransitionProperty -> ( "all" | CustomIdent ) {% function (data, location) {
  return { name: 'SingleTransitionProperty', values: data.filter(Boolean), location: lexer.index };
} %}
Number -> ( %number | %integer )
SingleTimingFunction -> ( ( ( CubicBezierTimingFunction ) | StepTimingFunction ) | FramesTimingFunction )
CubicBezierTimingFunction -> ( "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "cubic-bezier(" _ Number _ "," _ Number _ "," _ Number _ "," _ Number _ ")" )
StepTimingFunction -> ( ( "step-start" | "step-end" ) | ( ( ( ( "steps(" _ Integer ) _ ( ( "," _ ( ( "start" | "end" ) ) ) ):? ) _ ")" ) ) )
FramesTimingFunction -> "frames(" _ Integer _ ")"
Integer -> %integer
CustomIdent -> %ident
