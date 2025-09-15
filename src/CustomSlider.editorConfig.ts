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

const hideByType = (
    keysToHide: Array<keyof CustomSliderPreviewProps>,
    type: "static" | "dynamic" | "expression",
    staticKey: keyof CustomSliderPreviewProps,
    dynKey: keyof CustomSliderPreviewProps,
    exprKey: keyof CustomSliderPreviewProps
) => {
    switch (type) {
        case "static":
            keysToHide.push(dynKey, exprKey);
            break;
        case "dynamic":
            keysToHide.push(staticKey, exprKey);
            break;
        case "expression":
            keysToHide.push(staticKey, dynKey);
            break;
    }
};

const num = (v: any, d = 0): number =>
    typeof v === "number" && !Number.isNaN(v) && Number.isFinite(v) ? v : d;

const isEmpty = (s?: string | null) => !s || s.trim().length === 0;

export function getProperties(
    values: CustomSliderPreviewProps,
    defaultProperties: Properties
): Properties {
    const keysToHide: Array<keyof CustomSliderPreviewProps> = [];

    if (!values.rangeMode) {
        keysToHide.push(
            "lowerValueType",
            "lowerStaticValue",
            "lowerDynamicValue",
            "lowerExpressionValue",
            "upperValueType",
            "upperStaticValue",
            "upperDynamicValue",
            "upperExpressionValue"
        );
    }

    hideByType(keysToHide, values.minValueType, "minStaticValue", "minDynamicValue", "minExpressionValue");
    hideByType(keysToHide, values.maxValueType, "maxStaticValue", "maxDynamicValue", "maxExpressionValue");
    hideByType(keysToHide, values.stepValueType, "stepStaticValue", "stepDynamicValue", "stepExpressionValue");
    hideByType(keysToHide, values.sliderValueType, "sliderStaticValue", "sliderDynamicValue", "sliderExpressionValue");

    if (values.rangeMode) {
        hideByType(keysToHide, values.lowerValueType, "lowerStaticValue", "lowerDynamicValue", "lowerExpressionValue");
        hideByType(keysToHide, values.upperValueType, "upperStaticValue", "upperDynamicValue", "upperExpressionValue");
    }

    if (!values.sliderShowTooltip) {
        keysToHide.push("sliderTooltipType", "sliderTooltipTemplate", "sliderTooltipPosition", "sliderTooltipAlwaysVisible");
    } else if (values.sliderTooltipType !== "customText") {
        keysToHide.push("sliderTooltipTemplate");
    }

    if (!values.minShowTooltip) {
        keysToHide.push("minTooltipType", "minTooltipTemplate", "minTooltipPosition", "minTooltipAlwaysVisible");
    } else if (values.minTooltipType !== "customText") {
        keysToHide.push("minTooltipTemplate");
    }

    if (!values.maxShowTooltip) {
        keysToHide.push("maxTooltipType", "maxTooltipTemplate", "maxTooltipPosition", "maxTooltipAlwaysVisible");
    } else if (values.maxTooltipType !== "customText") {
        keysToHide.push("maxTooltipTemplate");
    }

    if (!values.showTicks) {
        keysToHide.push("tickInterval", "snapToTicks");
    }

    try {
        if (Array.isArray(values.marks) && values.marks.length) {
            const markGroup = defaultProperties
                .find(pg => pg.caption === "Marks")
                ?.properties?.find(p => p.key === "marks");

            values.marks.forEach((mark: any, index: number) => {
                const localHide: string[] = [];
                switch (mark.positionType) {
                    case "static":
                        localHide.push("positionDynamic", "positionExpression");
                        break;
                    case "dynamic":
                        localHide.push("positionStatic", "positionExpression");
                        break;
                    case "expression":
                        localHide.push("positionStatic", "positionDynamic");
                        break;
                }
                switch (mark.labelType) {
                    case "static":
                        localHide.push("labelDynamic", "labelExpression");
                        break;
                    case "dynamic":
                        localHide.push("labelStatic", "labelExpression");
                        break;
                    case "expression":
                        localHide.push("labelStatic", "labelDynamic");
                        break;
                }

                const markObj = markGroup?.objects?.[index];
                if (markObj?.properties) {
                    const groups: PropertyGroup[] = markObj.properties.map(g => ({
                        caption: g.caption,
                        properties: g.properties
                    }));
                    hidePropertiesIn(groups, mark, localHide as any);
                }
            });
        }
    } catch {
    }

    hidePropertiesIn(defaultProperties, values, keysToHide);
    return defaultProperties;
}

export function check(values: CustomSliderPreviewProps): Problem[] {
    const errors: Problem[] = [];

    const min =
        values.minValueType === "static" ? num(values.minStaticValue, 0) : undefined;
    const max =
        values.maxValueType === "static" ? num(values.maxStaticValue, 100) : undefined;
    const step =
        values.stepValueType === "static" ? num(values.stepStaticValue, 1) : undefined;

    if (values.sliderShowTooltip && values.sliderTooltipType === "customText" && isEmpty(values.sliderTooltipTemplate)) {
        errors.push({
            property: "sliderTooltipTemplate",
            severity: "error",
            message: "The main slider tooltip is in custom mode, but no text has been provided."
        });
    }
    if (values.minShowTooltip && values.minTooltipType === "customText" && isEmpty(values.minTooltipTemplate)) {
        errors.push({
            property: "minTooltipTemplate",
            severity: "error",
            message: "The minimum tooltip is in custom mode, but no text has been provided."
        });
    }
    if (values.maxShowTooltip && values.maxTooltipType === "customText" && isEmpty(values.maxTooltipTemplate)) {
        errors.push({
            property: "maxTooltipTemplate",
            severity: "error",
            message: "The maximum tooltip is in custom mode, but no text has been provided."
        });
    }

    if (min !== undefined && max !== undefined) {
        if (max <= min) {
            errors.push({
                property: "maxStaticValue",
                severity: "error",
                message: "Maximum value must be greater than minimum value."
            });
        }
        if (step !== undefined) {
            if (step <= 0) {
                errors.push({
                    property: "stepStaticValue",
                    severity: "error",
                    message: "Step size must be greater than 0."
                });
            } else {
                const range = max - min;
                if (range > 0) {
                    const div = range / step;
                    if (Math.abs(div - Math.round(div)) > 1e-9) {
                        errors.push({
                            property: "stepStaticValue",
                            severity: "warning",
                            message: "The range (max - min) is not evenly divisible by the step value."
                        });
                    }
                }
            }
        }
    }

    if (values.rangeMode && min !== undefined && max !== undefined) {
        const lower =
            values.lowerValueType === "static" ? num(values.lowerStaticValue, min) : undefined;
        const upper =
            values.upperValueType === "static" ? num(values.upperStaticValue, max) : undefined;

        if (lower !== undefined && (lower < min || lower > max)) {
            errors.push({
                property: "lowerStaticValue",
                severity: "error",
                message: "Lower value must be within [min, max]."
            });
        }
        if (upper !== undefined && (upper < min || upper > max)) {
            errors.push({
                property: "upperStaticValue",
                severity: "error",
                message: "Upper value must be within [min, max]."
            });
        }
        if (lower !== undefined && upper !== undefined && lower > upper) {
            errors.push({
                property: "upperStaticValue",
                severity: "error",
                message: "Upper value must be greater than or equal to lower value."
            });
        }
    }

    if (values.showTicks) {
        const ti = num(values.tickInterval, 0);
        if (values.snapToTicks && ti <= 0) {
            errors.push({
                property: "tickInterval",
                severity: "warning",
                message: "Snap to ticks is enabled but Tick interval is 0. Set a positive Tick interval."
            });
        }
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
