const ShorthandPropertyTypeFormatterUtils = require('../../utils/ShorthandPropertyTypeFormatterUtils');
const shorthandIdentToLonghandPropertyMap = require('../../constants/shorthandIdentToLonghandPropertyMap.json');

const BG_LAYER_NODE_NAME = 'BgLayer';
const FINAL_BG_LAYER_NODE_NAME = 'FinalBgLayer';
const BACKGROUND_PROPERTY_NAME = 'background';

module.exports = class BackgroundPropertyFormatter {
  /**
   * Formats a parser tree generated from feeding a shorthand property value to nearley, into an object, mapping
   * longhand property names to their values.
   *
   * @param {string} propertyName - the css property name. For example, 'background'.
   * @param {Object} node - the root node of the nearley parser tree
   * @param {string} value - the property value string. For example, "green center top".
   * @returns {Object} - a mapping between longhand property names to their longhand values.
   */
  static format(propertyName, node, value) {
    const layerPropertyMaps = ShorthandPropertyTypeFormatterUtils
      .filterNodesByName(node, [BG_LAYER_NODE_NAME, FINAL_BG_LAYER_NODE_NAME])
      .sort(({ location: location1 }, { location: location2 }) => location1 - location2)
      .map((layerNode, idx, originalNodeArray) => {
        const layerValueString = idx === originalNodeArray.length - 1
          ? value.slice(layerNode.location)
          : value.slice(layerNode.location, originalNodeArray[idx + 1].location - 1).replace(/,\s*$/, '').trim();

        return BackgroundPropertyFormatter._formatLayer(layerNode, layerValueString);
      });

    return ShorthandPropertyTypeFormatterUtils.mergePropertyMaps(layerPropertyMaps);
  }

  static _formatLayer(layerNode, valueString) {
    const backgroundOrigin = shorthandIdentToLonghandPropertyMap[BACKGROUND_PROPERTY_NAME].Box[0];
    const backgroundClip = shorthandIdentToLonghandPropertyMap[BACKGROUND_PROPERTY_NAME].Box[1];
    const backgroundPosition = shorthandIdentToLonghandPropertyMap[BACKGROUND_PROPERTY_NAME].Position;
    const backgroundSize = shorthandIdentToLonghandPropertyMap[BACKGROUND_PROPERTY_NAME].BgSize;
    const longhandValueMap = Object.entries(
      ShorthandPropertyTypeFormatterUtils.getPropertyNodeMappingCommaSeparatedList(BACKGROUND_PROPERTY_NAME, layerNode)
    )
      .map(([property, node]) => [property, node.location])
      .sort(([, location1], [, location2]) => location1 - location2)
      .map(([property, location], idx, entries) => {
        if (idx === entries.length - 1) {
          return [property, valueString.slice(location - layerNode.location)];
        }

        return [property, valueString.slice(location - layerNode.location, entries[idx + 1][1] - 1)];
      })
      .reduce((longhandMap, [longhandPropertyName, longhandPropertyValue]) => (
        Object.assign({ [longhandPropertyName]: longhandPropertyValue }, longhandMap)
      ), {});

    // The <box> value may be included zero, one, or two times. If included once, it sets both background-origin
    // and background-clip. If it is included twice, the first occurrence sets background-origin, and the second sets
    // background-clip. This logic checks if only one <box> value was encountered. If so, set background-clip to
    // background-origin's value.
    if (longhandValueMap[backgroundOrigin] && !longhandValueMap[backgroundClip]) {
      longhandValueMap[backgroundClip] = longhandValueMap[backgroundOrigin];
    }

    // The <bg-size> value may only be included immediately after <position>, separated with the '/' character,
    // like this: "center/80%". This logic removes the trailing slash we parse out from the background-position
    // property
    if (longhandValueMap[backgroundPosition] && longhandValueMap[backgroundSize]) {
      longhandValueMap[backgroundPosition] = longhandValueMap[backgroundPosition].replace('/', '').trim();
    }

    return longhandValueMap;
  }
};
