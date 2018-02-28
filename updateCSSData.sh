#!/bin/bash
function realpath()
{
    f=$@
    if [ -d "$f" ]; then
        base=""
        dir="$f"
    else
        base="/$(basename "$f")"
        dir=$(dirname "$f")
    fi
    dir=$(cd "$dir" && /bin/pwd)
    echo "$dir$base"
}
cd "$(dirname "$(realpath "$0")")";
rm -rf src/formatted-data src/grammars/generated/json
mkdir -p src/formatted-data src/grammars/generated/json
node ./node_modules/nearley/bin/nearleyc.js ./src/grammars/nearley/formalSyntax.ne > ./src/grammars/js/formalSyntax.js || exit 1
node ./src/scripts/updateBasicDataUnits.js || exit 1
node ./src/scripts/formatData.js || exit 1
node ./src/scripts/formatFormalSyntaxes.js || exit 1
node ./src/scripts/formatGrammars.js || exit 1
node ./src/scripts/extractProperties.js || exit 1