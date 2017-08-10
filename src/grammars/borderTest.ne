@builtin "whitespace.ne"

Exp -> ( A | B | C ) (__ ( A | B | C )):? ( __ ( A | B | C )):?
A -> ( ( "medium" | "thick" ) | "thin" ) {% function (d) { return { name: "A", val: d[0] } } %}
B -> ( "dashed" | "solid" | "double" ) {% function (d) { return { name: "B", val: d[0] } } %}
C -> ( "red" | "blue" | "white" ) {% function (d) { return { name: "C", val: d[0] } } %}