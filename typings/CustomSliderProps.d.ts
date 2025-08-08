/**
 * This file was generated from CustomSlider.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { DynamicValue, EditableValue } from "mendix";
import { Big } from "big.js";

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
}

export interface CustomSliderContainerProps {
    name: string;
    tabIndex?: number;
    id: string;
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
    marks: MarksType[];
}

export interface CustomSliderPreviewProps {
    readOnly: boolean;
    renderMode: "design" | "xray" | "structure";
    translate: (text: string) => string;
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
    marks: MarksPreviewType[];
}
