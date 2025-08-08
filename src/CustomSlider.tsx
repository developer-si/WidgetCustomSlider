import { CustomSliderContainerProps } from "../typings/CustomSliderProps";
import { createElement, useState, useEffect, useRef } from "react";
import Big from "big.js";

import "./ui/CustomSlider.css";

export function CustomSlider(props: CustomSliderContainerProps) {
    const {
        minValueType,
        minStaticValue,
        minDynamicValue,
        minExpressionValue,
        minShowTooltip,
        minTooltipType,
        minTooltipPosition,
        minTooltipTemplate,

        maxValueType,
        maxStaticValue,
        maxDynamicValue,
        maxExpressionValue,
        maxShowTooltip,
        maxTooltipType,
        maxTooltipPosition,
        maxTooltipTemplate,

        stepValueType,
        stepStaticValue,
        stepDynamicValue,
        stepExpressionValue,

        sliderValueType,
        sliderStaticValue,
        sliderDynamicValue,
        sliderExpressionValue,
        sliderShowTooltip,
        sliderTooltipType,
        sliderTooltipTemplate,
        sliderTooltipAlwaysVisible,

        marks
    } = props;

    const getValueFromProp = (
        type: "static" | "dynamic" | "expression",
        staticVal: Big,
        dynamicVal?: { value?: Big },
        exprVal?: { value?: Big }
    ) => {
        switch (type) {
            case "static":
                return staticVal.toNumber();
            case "dynamic":
                return dynamicVal?.value?.toNumber() ?? 0;
            case "expression":
                return exprVal?.value?.toNumber() ?? 0;
            default:
                return 0;
        }
    };

    const min = getValueFromProp(minValueType, minStaticValue ?? new Big(0), minDynamicValue, minExpressionValue);
    const max = getValueFromProp(maxValueType, maxStaticValue ?? new Big(100), maxDynamicValue, maxExpressionValue);
    const step = getValueFromProp(stepValueType, stepStaticValue ?? new Big(1), stepDynamicValue, stepExpressionValue);
    const value = getValueFromProp(sliderValueType, sliderStaticValue ?? new Big(0), sliderDynamicValue, sliderExpressionValue);

    const [internalValue, setInternalValue] = useState<number>(value);
    const sliderRef = useRef<HTMLInputElement>(null);
    const [tooltipLeft, setTooltipLeft] = useState<number>(0);

    useEffect(() => {
        setInternalValue(value);
    }, [value]);

    useEffect(() => {
        updateTooltipPosition();
    }, [internalValue]);

    const updateTooltipPosition = () => {
        if (sliderRef.current) {
            const { offsetWidth } = sliderRef.current;
            const percent = max !== min ? (internalValue - min) / (max - min) : 0;
            const left = percent * offsetWidth;
            setTooltipLeft(left);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = Number(e.target.value);
        setInternalValue(newVal);
        if (sliderValueType === "dynamic") {
            sliderDynamicValue?.setValue?.(new Big(newVal));
        }
    };

    const getTooltipText = (type: string, template?: { value?: string }): string => {
        if (type === "customText") {
            return template?.value ?? "";
        }
        return internalValue.toFixed(2);
    };

    return (
        <div className="custom-slider-container">
            <div className="slider-wrapper">
                <div className="slider-track">
                    <input
                        ref={sliderRef}
                        type="range"
                        min={min}
                        max={max}
                        step={step}
                        value={internalValue}
                        onChange={handleChange}
                        className="slider-input"
                    />

                    {marks?.map((mark, idx) => {
                        const pos = getValueFromProp(
                            mark.positionType,
                            mark.positionStatic ?? new Big(0),
                            mark.positionDynamic,
                            mark.positionExpression
                        );

                        const label =
                            mark.labelType === "static"
                                ? mark.labelStatic
                                : mark.labelType === "dynamic"
                                    ? mark.labelDynamic?.value ?? ""
                                    : mark.labelExpression?.value ?? "";

                        const left = max !== min ? ((pos - min) / (max - min)) * 100 : 0;

                        return (
                            <div
                                key={idx}
                                className="slider-mark"
                                style={{ left: `${left}%` }}
                            >
                                <div className="mark-dot" />
                                <div className="mark-label">{label}</div>
                            </div>
                        );
                    })}

                    {sliderShowTooltip && (
                        <div
                            className={`slider-tooltip central ${sliderTooltipAlwaysVisible ? "visible" : ""}`}
                            style={{ left: tooltipLeft }}
                        >
                            {getTooltipText(sliderTooltipType, sliderTooltipTemplate)}
                        </div>
                    )}
                </div>
            </div>


            <div className="slider-labels">
                {minShowTooltip && (
                    <span>
                        <div
                            className="slider-tooltip visible"
                            style={{
                                position: "absolute",
                                transform: "translateX(-50%)",
                                ...(minTooltipPosition === "bottom" ? { bottom: "-20px" } : { top: "11px" })
                            }}
                        >
                            {getTooltipText(minTooltipType, minTooltipTemplate)}
                        </div>
                    </span>
                )}
                {maxShowTooltip && (
                    <span>
                        <div
                            className="slider-tooltip visible"
                            style={{
                                position: "absolute",
                                transform: "translateX(-50%)",
                                ...(maxTooltipPosition === "bottom" ? { bottom: "-20px" } : { top: "11px" })
                            }}
                        >
                            {getTooltipText(maxTooltipType, maxTooltipTemplate)}
                        </div>
                    </span>
                )}
            </div>
        </div>
    );
}
