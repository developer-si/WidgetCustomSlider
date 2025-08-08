import { CustomSliderPreviewProps/* , MarksPreviewType */ } from "../typings/CustomSliderProps";
import { hidePropertiesIn } from "@mendix/pluggable-widgets-tools";

export type Platform = "web" | "desktop";

export type Properties = PropertyGroup[];

type PropertyGroup = {
    caption: string;
    propertyGroups?: PropertyGroup[];
    properties?: Property[];
};

type Property = {
    key: string;
    caption: string;
    description?: string;
    objectHeaders?: string[]; // used for customizing object grids
    objects?: ObjectProperties[];
    properties?: Property[];
};

type ObjectProperties = {
    properties: PropertyGroup[];
    captions?: string[]; // used for customizing object grids
};

export type Problem = {
    property?: string; // key of the property, at which the problem exists
    severity?: "error" | "warning" | "deprecation"; // default = "error"
    message: string; // description of the problem
    studioMessage?: string; // studio-specific message, defaults to message
    url?: string; // link with more information about the problem
    studioUrl?: string; // studio-specific link
};

type BaseProps = {
    type: "Image" | "Container" | "RowLayout" | "Text" | "DropZone" | "Selectable" | "Datasource";
    grow?: number; // optionally sets a growth factor if used in a layout (default = 1)
};

type ImageProps = BaseProps & {
    type: "Image";
    document?: string; // svg image
    data?: string; // base64 image
    property?: object; // widget image property object from Values API
    width?: number; // sets a fixed maximum width
    height?: number; // sets a fixed maximum height
};

type ContainerProps = BaseProps & {
    type: "Container" | "RowLayout";
    children: PreviewProps[]; // any other preview element
    borders?: boolean; // sets borders around the layout to visually group its children
    borderRadius?: number; // integer. Can be used to create rounded borders
    backgroundColor?: string; // HTML color, formatted #RRGGBB
    borderWidth?: number; // sets the border width
    padding?: number; // integer. adds padding around the container
};

type RowLayoutProps = ContainerProps & {
    type: "RowLayout";
    columnSize?: "fixed" | "grow"; // default is fixed
};

type TextProps = BaseProps & {
    type: "Text";
    content: string; // text that should be shown
    fontSize?: number; // sets the font size
    fontColor?: string; // HTML color, formatted #RRGGBB
    bold?: boolean;
    italic?: boolean;
};

type DropZoneProps = BaseProps & {
    type: "DropZone";
    property: object; // widgets property object from Values API
    placeholder: string; // text to be shown inside the dropzone when empty
    showDataSourceHeader?: boolean; // true by default. Toggles whether to show a header containing information about the datasource
};

type SelectableProps = BaseProps & {
    type: "Selectable";
    object: object; // object property instance from the Value API
    child: PreviewProps; // any type of preview property to visualize the object instance
};

type DatasourceProps = BaseProps & {
    type: "Datasource";
    property: object | null; // datasource property object from Values API
    child?: PreviewProps; // any type of preview property component (optional)
};

export type PreviewProps =
    | ImageProps
    | ContainerProps
    | RowLayoutProps
    | TextProps
    | DropZoneProps
    | SelectableProps
    | DatasourceProps

export function getProperties(
    _values: CustomSliderPreviewProps,
    defaultProperties: Properties /* , target: Platform*/
): Properties {

    const keysToHide: Array<keyof CustomSliderPreviewProps> = [];

    switch (_values.minValueType) {
        case "static":
            keysToHide.push("minDynamicValue", "minExpressionValue");
            break;
        case "dynamic":
            keysToHide.push("minStaticValue", "minExpressionValue");
            break;
        case "expression":
            keysToHide.push("minStaticValue", "minDynamicValue");
            break;
    }

    switch (_values.maxValueType) {
        case "static":
            keysToHide.push("maxDynamicValue", "maxExpressionValue");
            break;
        case "dynamic":
            keysToHide.push("maxStaticValue", "maxExpressionValue");
            break;
        case "expression":
            keysToHide.push("maxStaticValue", "maxDynamicValue");
            break;
    }

    switch (_values.stepValueType) {
        case "static":
            keysToHide.push("stepDynamicValue", "stepExpressionValue");
            break;
        case "dynamic":
            keysToHide.push("stepStaticValue", "stepExpressionValue");
            break;
        case "expression":
            keysToHide.push("stepStaticValue", "stepDynamicValue");
            break;
    }

    switch (_values.sliderValueType) {
        case "static":
            keysToHide.push("sliderDynamicValue", "sliderExpressionValue");
            break;
        case "dynamic":
            keysToHide.push("sliderStaticValue", "sliderExpressionValue");
            break;
        case "expression":
            keysToHide.push("sliderStaticValue", "sliderDynamicValue");
            break;
    }

    if (_values.sliderShowTooltip === false) {
        keysToHide.push("sliderTooltipType", "sliderTooltipTemplate", "sliderTooltipPosition", "sliderTooltipAlwaysVisible");
    }

    if (_values.minShowTooltip === false) {
        keysToHide.push("minTooltipType", "minTooltipTemplate", "minTooltipPosition", "minTooltipAlwaysVisible");
    }

    if (_values.maxShowTooltip === false) {
        keysToHide.push("maxTooltipType", "maxTooltipTemplate", "maxTooltipPosition", "maxTooltipAlwaysVisible");
    }

    if (_values.sliderTooltipType !== "customText") {
        keysToHide.push("sliderTooltipTemplate");
    }

    if (_values.minTooltipType !== "customText") {
        keysToHide.push("minTooltipTemplate");
    }

    if (_values.maxTooltipType !== "customText") {
        keysToHide.push("maxTooltipTemplate");
    }

    // if (Array.isArray(_values.marks)) {
    //     const markProp = defaultProperties.find(p => p.caption === "Marks");
    //     const marksGroup = markProp?.properties?.find(p => p.key === "marks");

    //     _values.marks.forEach((mark, index) => {
    //         const keysToHide: (keyof MarksPreviewType)[] = [];

    //         switch (mark.positionType) {
    //             case "static":
    //                 keysToHide.push("positionDynamic", "positionExpression");
    //                 break;
    //             case "dynamic":
    //                 keysToHide.push("positionStatic", "positionExpression");
    //                 break;
    //             case "expression":
    //                 keysToHide.push("positionStatic", "positionDynamic");
    //                 break;
    //         }

    //         switch (mark.labelType) {
    //             case "static":
    //                 keysToHide.push("labelDynamic", "labelExpression");
    //                 break;
    //             case "dynamic":
    //                 keysToHide.push("labelStatic", "labelExpression");
    //                 break;
    //             case "expression":
    //                 keysToHide.push("labelStatic", "labelDynamic");
    //                 break;
    //         }

    //         const markObject = marksGroup?.objects?.[index];
    //         if (markObject?.properties) {
    //             markObject.properties.forEach(group => {
    //                 if (group.properties) {
    //                     const fakeGroup: PropertyGroup = {
    //                         caption: group.caption,
    //                         properties: group.properties
    //                     };
    //                     hidePropertiesIn([fakeGroup], mark, keysToHide);
    //                 }
    //             });
    //         }
    //     });
    // }


    hidePropertiesIn(defaultProperties, _values, keysToHide);
    // Do the values manipulation here to control the visibility of properties in Studio and Studio Pro conditionally.
    /* Example
    if (values.myProperty === "custom") {
        delete defaultProperties.properties.myOtherProperty;
    }
    */
    return defaultProperties;
}

export function check(_values: CustomSliderPreviewProps): Problem[] {
    const errors: Problem[] = [];

    if (_values.sliderTooltipType === "customText" && !_values.sliderTooltipTemplate?.trim()) {
        errors.push({
            property: "sliderTooltipTemplate",
            severity: "error",
            message: "The main slider tooltip is in custom mode, but no text has been provided."
        });
    }

    if (_values.minTooltipType === "customText" && !_values.minTooltipTemplate?.trim()) {
        errors.push({
            property: "minTooltipTemplate",
            severity: "error",
            message: "The minimum tooltip is in custom mode, but no text has been provided."
        });
    }

    if (_values.maxTooltipType === "customText" && !_values.maxTooltipTemplate?.trim()) {
        errors.push({
            property: "maxTooltipTemplate",
            severity: "error",
            message: "The maximum tooltip is in custom mode, but no text has been provided."
        });
    }
    return errors;
}



// export function getPreview(values: CustomSliderPreviewProps, isDarkMode: boolean, version: number[]): PreviewProps {
//     // Customize your pluggable widget appearance for Studio Pro.
//     return {
//         type: "Container",
//         children: []
//     }
// }

// export function getCustomCaption(values: CustomSliderPreviewProps, platform: Platform): string {
//     return "CustomSlider";
// }
