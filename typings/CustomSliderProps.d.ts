/**
 * This file was generated from CustomSlider.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { ActionValue, DynamicValue, EditableValue } from "mendix";
import { Big } from "big.js";

export type OrientationEnum = "horizontal" | "vertical";

export type MinValueTypeEnum = "static" | "dynamic" | "expression";

export type MinTooltipTypeEnum = "value" | "customText";

export type MinTooltipPositionEnum = "top" | "bottom";

export type MaxValueTypeEnum = "static" | "dynamic" | "expression";

export type MaxTooltipTypeEnum = "value" | "customText";

export type MaxTooltipPositionEnum = "top" | "bottom";

export type StepValueTypeEnum = "static" | "dynamic" | "expression";

export type SliderValueTypeEnum = "static" | "dynamic" | "expression";

export type SliderTooltipTypeEnum = "value" | "customText";

export type SliderTooltipPositionEnum = "top" | "bottom";

export type LowerValueTypeEnum = "static" | "dynamic" | "expression";

export type UpperValueTypeEnum = "static" | "dynamic" | "expression";

export type PositionTypeEnum = "static" | "dynamic" | "expression";

export type LabelTypeEnum = "static" | "dynamic" | "expression";

export interface MarksType {
    positionType: PositionTypeEnum;
    positionStatic: Big;
    positionDynamic?: EditableValue<Big>;
    positionExpression?: DynamicValue<Big>;
    labelType: LabelTypeEnum;
    labelStatic: string;
    labelDynamic?: EditableValue<string>;
    labelExpression?: DynamicValue<string>;
    markColor: string;
    markClass: string;
}

export interface MarksPreviewType {
    positionType: PositionTypeEnum;
    positionStatic: number | null;
    positionDynamic: string;
    positionExpression: string;
    labelType: LabelTypeEnum;
    labelStatic: string;
    labelDynamic: string;
    labelExpression: string;
    markColor: string;
    markClass: string;
}

export interface CustomSliderContainerProps {
    name: string;
    tabIndex?: number;
    id: string;
    orientation: OrientationEnum;
    rangeMode: boolean;
    minValueType: MinValueTypeEnum;
    minStaticValue: Big;
    minDynamicValue?: EditableValue<Big>;
    minExpressionValue?: DynamicValue<Big>;
    minShowTooltip: boolean;
    minTooltipType: MinTooltipTypeEnum;
    minTooltipTemplate?: DynamicValue<string>;
    minTooltipPosition: MinTooltipPositionEnum;
    minTooltipAlwaysVisible: boolean;
    maxValueType: MaxValueTypeEnum;
    maxStaticValue: Big;
    maxDynamicValue?: EditableValue<Big>;
    maxExpressionValue?: DynamicValue<Big>;
    maxShowTooltip: boolean;
    maxTooltipType: MaxTooltipTypeEnum;
    maxTooltipTemplate?: DynamicValue<string>;
    maxTooltipPosition: MaxTooltipPositionEnum;
    maxTooltipAlwaysVisible: boolean;
    stepValueType: StepValueTypeEnum;
    stepStaticValue: Big;
    stepDynamicValue?: EditableValue<Big>;
    stepExpressionValue?: DynamicValue<Big>;
    sliderValueType: SliderValueTypeEnum;
    sliderStaticValue: Big;
    sliderDynamicValue?: EditableValue<Big>;
    sliderExpressionValue?: DynamicValue<Big>;
    sliderShowTooltip: boolean;
    sliderTooltipType: SliderTooltipTypeEnum;
    sliderTooltipTemplate?: DynamicValue<string>;
    sliderTooltipPosition: SliderTooltipPositionEnum;
    sliderTooltipAlwaysVisible: boolean;
    lowerValueType: LowerValueTypeEnum;
    lowerStaticValue: Big;
    lowerDynamicValue?: EditableValue<Big>;
    lowerExpressionValue?: DynamicValue<Big>;
    upperValueType: UpperValueTypeEnum;
    upperStaticValue: Big;
    upperDynamicValue?: EditableValue<Big>;
    upperExpressionValue?: DynamicValue<Big>;
    marks: MarksType[];
    showTicks: boolean;
    tickInterval: Big;
    snapToTicks: boolean;
    debounceMs: number;
    snapToMarks: boolean;
    trackColor: string;
    trackBackgroundColor: string;
    thumbColor: string;
    markColorGlobal: string;
    thumbSize: number;
    trackThickness: number;
    customClass: string;
    onChange?: ActionValue;
    onChangeEnd?: ActionValue;
    ariaLabel: string;
    ariaLabelledBy: string;
}

export interface CustomSliderPreviewProps {
    readOnly: boolean;
    renderMode: "design" | "xray" | "structure";
    translate: (text: string) => string;
    orientation: OrientationEnum;
    rangeMode: boolean;
    minValueType: MinValueTypeEnum;
    minStaticValue: number | null;
    minDynamicValue: string;
    minExpressionValue: string;
    minShowTooltip: boolean;
    minTooltipType: MinTooltipTypeEnum;
    minTooltipTemplate: string;
    minTooltipPosition: MinTooltipPositionEnum;
    minTooltipAlwaysVisible: boolean;
    maxValueType: MaxValueTypeEnum;
    maxStaticValue: number | null;
    maxDynamicValue: string;
    maxExpressionValue: string;
    maxShowTooltip: boolean;
    maxTooltipType: MaxTooltipTypeEnum;
    maxTooltipTemplate: string;
    maxTooltipPosition: MaxTooltipPositionEnum;
    maxTooltipAlwaysVisible: boolean;
    stepValueType: StepValueTypeEnum;
    stepStaticValue: number | null;
    stepDynamicValue: string;
    stepExpressionValue: string;
    sliderValueType: SliderValueTypeEnum;
    sliderStaticValue: number | null;
    sliderDynamicValue: string;
    sliderExpressionValue: string;
    sliderShowTooltip: boolean;
    sliderTooltipType: SliderTooltipTypeEnum;
    sliderTooltipTemplate: string;
    sliderTooltipPosition: SliderTooltipPositionEnum;
    sliderTooltipAlwaysVisible: boolean;
    lowerValueType: LowerValueTypeEnum;
    lowerStaticValue: number | null;
    lowerDynamicValue: string;
    lowerExpressionValue: string;
    upperValueType: UpperValueTypeEnum;
    upperStaticValue: number | null;
    upperDynamicValue: string;
    upperExpressionValue: string;
    marks: MarksPreviewType[];
    showTicks: boolean;
    tickInterval: number | null;
    snapToTicks: boolean;
    debounceMs: number | null;
    snapToMarks: boolean;
    trackColor: string;
    trackBackgroundColor: string;
    thumbColor: string;
    markColorGlobal: string;
    thumbSize: number | null;
    trackThickness: number | null;
    customClass: string;
    onChange: {} | null;
    onChangeEnd: {} | null;
    ariaLabel: string;
    ariaLabelledBy: string;
}
