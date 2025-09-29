import { CustomSliderContainerProps } from "../typings/CustomSliderProps";
import { createElement, Fragment, useState, useMemo, useRef, useEffect, useCallback } from "react";
import Big from "big.js";
import "./ui/CustomSlider.css";

function toNum(v: any, fallback = 0): number {
    if (v && typeof v === "object" && typeof v.toNumber === "function") {
        try { return v.toNumber(); } catch { return fallback; }
    }
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
}

function getNumberFromValue(
    type: "static" | "dynamic" | "expression",
    staticVal: Big | undefined,
    dynamicVal?: { value?: Big },
    exprVal?: { value?: Big },
    fallback = 0
): number {
    try {
        switch (type) {
            case "static": return toNum(staticVal, fallback);
            case "dynamic": return toNum(dynamicVal?.value, fallback);
            case "expression": return toNum(exprVal?.value, fallback);
            default: return fallback;
        }
    } catch { return fallback; }
}

const clamp = (n: number, min: number, max: number) => (max < min ? n : Math.min(max, Math.max(min, n)));
const roundToStep = (n: number, step: number, min: number) => (step <= 0 ? n : (min + Math.round((n - min) / step) * step));
const nearestOf = (n: number, arr: number[]) => arr.reduce((b, x) => Math.abs(x - n) < Math.abs(b - n) ? x : b, arr[0] ?? n);
const clamp01 = (p: number) => Math.max(0, Math.min(100, p));
const edgeClass = (pct: number) => (pct < 6 ? "edge-left" : pct > 94 ? "edge-right" : "");

export function posStyle(frac: number): React.CSSProperties {
  const f = Math.max(0, Math.min(1, frac));
  if (f <= 0) return { left: 0 };
  if (f >= 1) return { right: 0 };
  return {
    left: `calc((100% - var(--thumb-total, var(--thumb-size))) * ${f} + (var(--thumb-total, var(--thumb-size)) / 2))`
  } as React.CSSProperties;
}

export function CustomSlider(props: CustomSliderContainerProps) {
    const {
        orientation, rangeMode,
        minValueType, minStaticValue, minDynamicValue, minExpressionValue,
        maxValueType, maxStaticValue, maxDynamicValue, maxExpressionValue,
        stepValueType, stepStaticValue, stepDynamicValue, stepExpressionValue,
        sliderValueType, sliderStaticValue, sliderDynamicValue, sliderExpressionValue,
        sliderShowTooltip, sliderTooltipType, sliderTooltipTemplate, sliderTooltipPosition, sliderTooltipAlwaysVisible,
        lowerValueType, lowerStaticValue, lowerDynamicValue, lowerExpressionValue,
        upperValueType, upperStaticValue, upperDynamicValue, upperExpressionValue,
        minShowTooltip, minTooltipType, minTooltipTemplate, minTooltipPosition,
        maxShowTooltip, maxTooltipType, maxTooltipTemplate, maxTooltipPosition,
        marks,
        showTicks, tickInterval, snapToTicks, snapToMarks, debounceMs,
        trackColor, trackBackgroundColor, thumbColor, thumbSize, trackThickness, customClass,
        onChange, onChangeEnd,
        ariaLabel, ariaLabelledBy
    } = props;

    const min = useMemo(() => getNumberFromValue(minValueType, minStaticValue, minDynamicValue, minExpressionValue, 0), [minValueType, minStaticValue, minDynamicValue, minExpressionValue]);
    const max = useMemo(() => getNumberFromValue(maxValueType, maxStaticValue, maxDynamicValue, maxExpressionValue, 100), [maxValueType, maxStaticValue, maxDynamicValue, maxExpressionValue]);
    const step = useMemo(() => Math.max(0, getNumberFromValue(stepValueType, stepStaticValue, stepDynamicValue, stepExpressionValue, 1)), [stepValueType, stepStaticValue, stepDynamicValue, stepExpressionValue]);
    const tickInt = useMemo(() => toNum(tickInterval, 0), [tickInterval]);

    const singleInit = useMemo(() => clamp(getNumberFromValue(sliderValueType, sliderStaticValue, sliderDynamicValue, sliderExpressionValue, min), min, max), [sliderValueType, sliderStaticValue, sliderDynamicValue, sliderExpressionValue, min, max]);
    const lowerInit = useMemo(() => clamp(getNumberFromValue(lowerValueType ?? "static", lowerStaticValue, lowerDynamicValue, lowerExpressionValue, min), min, max), [lowerValueType, lowerStaticValue, lowerDynamicValue, lowerExpressionValue, min, max]);
    const upperInit = useMemo(() => clamp(getNumberFromValue(upperValueType ?? "static", upperStaticValue, upperDynamicValue, upperExpressionValue, max), min, max), [upperValueType, upperStaticValue, upperDynamicValue, upperExpressionValue, min, max]);

    const [single, setSingle] = useState<number>(singleInit);
    const [lower, setLower] = useState<number>(Math.min(lowerInit, upperInit));
    const [upper, setUpper] = useState<number>(Math.max(lowerInit, upperInit));
    const isVertical = orientation === "vertical";

    useEffect(() => setSingle(singleInit), [singleInit]);
    useEffect(() => { setLower(Math.min(lowerInit, upperInit)); setUpper(Math.max(lowerInit, upperInit)); }, [lowerInit, upperInit]);

    const debounceRef = useRef<number | undefined>(undefined);
    const triggerOnChange = useCallback(() => {
        if (!onChange?.canExecute) return;
        if (debounceMs && debounceMs > 0) {
            window.clearTimeout(debounceRef.current);
            debounceRef.current = window.setTimeout(() => onChange.execute(), debounceMs);
        } else {
            onChange.execute();
        }
    }, [onChange, debounceMs]);
    const triggerOnEnd = useCallback(() => { if (onChangeEnd?.canExecute) onChangeEnd.execute(); }, [onChangeEnd]);

    const markPositions = useMemo<number[]>(() => {
        if (!marks?.length) return [];
        const out: number[] = [];
        for (const m of marks) {
            const p = getNumberFromValue((m as any).positionType, (m as any).positionStatic, (m as any).positionDynamic, (m as any).positionExpression, min);
            if (!Number.isNaN(p)) out.push(clamp(p, min, max));
        }
        return out;
    }, [marks, min, max]);

    const nearestSnap = useCallback((n: number) => {
        let t = roundToStep(n, step, min);
        if (showTicks && snapToTicks && tickInt > 0) {
            const ticks: number[] = [];
            for (let x = min; x <= max + 1e-9; x += tickInt) ticks.push(roundToStep(x, step || tickInt, min));
            t = nearestOf(t, ticks);
        }
        if (snapToMarks && markPositions.length) {
            const m = nearestOf(t, markPositions);
            t = Math.abs(m - n) < Math.abs(t - n) ? m : t;
        }
        return clamp(t, min, max);
    }, [step, min, max, showTicks, snapToTicks, tickInt, snapToMarks, markPositions]);

    const commitSingle = useCallback((v: number) => { if (sliderValueType === "dynamic" && props.sliderDynamicValue?.setValue) props.sliderDynamicValue.setValue(new Big(v)); }, [sliderValueType, props.sliderDynamicValue]);

    const onSingle = useCallback((e: any) => { const v = nearestSnap(clamp(Number(e.target.value), min, max)); setSingle(v); commitSingle(v); triggerOnChange(); }, [nearestSnap, min, max, commitSingle, triggerOnChange]);

    const getTooltipText = useCallback((type: "value" | "customText", tpl?: { value?: string }, v?: number) => {
        if (type === "customText") return tpl?.value ?? "";
        if (typeof v === "number") return String(v);
        return rangeMode ? `${lower} - ${upper}` : String(single);
    }, [rangeMode, lower, upper, single]);

    const percent = useCallback((v: number) => (max === min ? 0 : ((v - min) / (max - min)) * 100), [min, max]);
    const pctMin = clamp01(percent(min)), pctMax = clamp01(percent(max));
    const pctSingle = clamp01(percent(single));
    const centerPosClass = sliderTooltipPosition === "bottom" ? "bottom" : "top";

    const fracOf = useCallback((v: number) => (max === min ? 0 : Math.max(0, Math.min(1, (v - min) / (max - min)))), [min, max]);
    const fSingle = fracOf(single);

    const rootClass = [
        "custom-slider-container",
        customClass || "",
        isVertical ? "vertical" : "horizontal",
        rangeMode ? "range" : "single"
    ].filter(Boolean).join(" ");

    const cssVars: any = {
        "--track-color": trackColor || "#3EA2F7",
        "--track-bg": trackBackgroundColor || "#cce5ff",
        "--thumb-color": thumbColor || "#ffffff",
        "--thumb-size": (thumbSize ?? 24) + "px",
        "--track-thickness": (trackThickness ?? 8) + "px"
    };

    const ticks = useMemo(() => {
        if (!showTicks || tickInt <= 0 || max <= min) return [];
        const out: number[] = [];
        for (let x = min; x <= max + 1e-9; x += tickInt) out.push(clamp(x, min, max));
        return out;
    }, [showTicks, tickInt, min, max]);

    return (
        <div className={rootClass} style={cssVars} aria-label={ariaLabel} aria-labelledby={ariaLabelledBy}>
            <div className="slider-wrapper">
                <div className="slider-track">
                    {!rangeMode ? (
                        <div className="slider-fill" style={{ left: 0, width: "100%" }}/>
                    ) :
                        (
                            <div>
                            </div>
                        )}

                    {!rangeMode ? (
                        <input
                            type="range"
                            className="slider-input"
                            min={min} max={max} step={step || 0.000001}
                            value={single}
                            onChange={onSingle}
                            onMouseUp={triggerOnEnd} onTouchEnd={triggerOnEnd}
                            aria-valuemin={min} aria-valuemax={max} aria-valuenow={single}
                            aria-orientation={isVertical ? "vertical" : "horizontal"}
                        />
                    ) : (
                        <Fragment>

                        </Fragment>
                    )}

                    {marks?.map((m, i) => {
                        const p = clamp(getNumberFromValue((m as any).positionType, (m as any).positionStatic, (m as any).positionDynamic, (m as any).positionExpression, min), min, max);
                        const pct = clamp01(percent(p));
                        const frac = (pct / 100);
                        const label =
                            (m as any).labelType === "static" ? ((m as any).labelStatic ?? "") :
                                (m as any).labelType === "dynamic" ? ((m as any).labelDynamic?.value ?? "") :
                                    ((m as any).labelExpression?.value ?? "");

                        return (
                            <div key={i} className="slider-mark" style={posStyle(frac)}>
                                <div className="mark-dot" />
                                {label ? <div className="mark-label">{label}</div> : null}
                            </div>
                        );
                    })}

                    {ticks.map((t, i) => {
                        const frac = clamp01(percent(t)) / 100;
                        return <div key={`tick-${i}`} className="slider-tick" style={posStyle(frac)} />;
                    })}

                    {minShowTooltip && (
                        <div className={`slider-tooltip visible ${minTooltipPosition === "bottom" ? "bottom" : "top"} ${edgeClass(pctMin)}`}
                            style={posStyle(0)}>
                            {getTooltipText(minTooltipType as any, minTooltipTemplate, min)}
                        </div>
                    )}
                    {maxShowTooltip && (
                        <div className={`slider-tooltip visible ${maxTooltipPosition === "bottom" ? "bottom" : "top"} ${edgeClass(pctMax)}`}
                            style={posStyle(1)}>
                            {getTooltipText(maxTooltipType as any, maxTooltipTemplate, max)}
                        </div>
                    )}

                    {!rangeMode && sliderShowTooltip && (
                        <div className={`slider-tooltip central ${sliderTooltipAlwaysVisible ? "visible" : ""} ${centerPosClass} ${edgeClass(pctSingle)}`}
                            style={posStyle(fSingle)}>
                            {getTooltipText(sliderTooltipType as any, sliderTooltipTemplate, single)}
                        </div>
                    )}
                    {rangeMode && sliderShowTooltip && (
                        <Fragment>

                        </Fragment>
                    )}
                </div>
            </div>
        </div>
    );
}