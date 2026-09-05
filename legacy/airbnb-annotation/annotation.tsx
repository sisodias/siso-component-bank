// components/ui/component.tsx
import React from 'react';
import { HtmlLabel, Label, Connector, CircleSubject, LineSubject, Annotation, AnnotationLabelProps } from '@visx/annotation';
import { LinePath } from '@visx/shape';
import { ScaleTime, ScaleLinear } from '@visx/scale';

export const orange = '#ff7e67';
export const greens = ['#ecf4f3', '#68b0ab', '#006a71'];

export interface DataPoint {
  date: string;
  value: number;
}

const findNearestDatum = ({
  accessor,
  data,
  scale,
  value,
}: {
  accessor: (d: DataPoint) => number | Date;
  data: DataPoint[];
  scale: ScaleTime<number, number> | ScaleLinear<number, number> | any;
  value: number;
}): DataPoint | null => {
  if (!data || data.length === 0) return null;

  let nearestDatum: DataPoint | null = null;
  let minDiff = Infinity;

  for (const datum of data) {
    const accessorValue = accessor(datum);
    if (accessorValue === undefined || accessorValue === null) continue;

    const scaledValue = scale(accessorValue);
    if (scaledValue === undefined) continue;

    const diff = Math.abs(value - scaledValue);
    if (diff < minDiff) {
      minDiff = diff;
      nearestDatum = datum;
    }
  }
  return nearestDatum;
};

export type VisxAnnotationChartProps = {
  width: number;
  height: number;
  data: DataPoint[];
  xScale: ScaleTime<number, number>;
  yScale: ScaleLinear<number, number>;
  getDate: (d: DataPoint) => Date;
  getStockValue: (d: DataPoint) => number;

  AnnotationComponent: React.ElementType<any>;
  annotationPosition: { x: number; y: number; dx: number; dy: number };
  onAnnotationPositionChange: (
    position: { x: number; y: number; dx: number; dy: number }
  ) => void;
  
  connectorType: 'line' | 'elbow' | 'curve' | undefined;
  labelType: 'svg' | 'html';
  subjectType: 'circle' | 'vertical-line' | 'horizontal-line';
  
  title: string;
  subtitle: string;
  labelWidth: number;
  approxTooltipHeight: number;

  editLabelPosition?: boolean;
  editSubjectPosition?: boolean;
  showAnchorLine?: boolean;
  horizontalAnchor?: AnnotationLabelProps['horizontalAnchor'];
  verticalAnchor?: AnnotationLabelProps['verticalAnchor'];
};

export const Component = ({
  width,
  height,
  data,
  xScale,
  yScale,
  getDate,
  getStockValue,
  AnnotationComponent,
  annotationPosition,
  onAnnotationPositionChange,
  connectorType,
  labelType,
  subjectType,
  title,
  subtitle,
  labelWidth,
  approxTooltipHeight,
  editLabelPosition = true,
  editSubjectPosition = true,
  showAnchorLine = true,
  horizontalAnchor,
  verticalAnchor,
}: VisxAnnotationChartProps) => {
  return (
    <svg width={width} height={height}>
      <rect width={width} height={height} fill={greens[0]} />
      <LinePath
        stroke={greens[2]}
        strokeWidth={2}
        data={data}
        x={(d) => xScale(getDate(d)) ?? 0}
        y={(d) => yScale(getStockValue(d)) ?? 0}
      />
      <AnnotationComponent
        width={width}
        height={height}
        x={annotationPosition.x}
        y={annotationPosition.y}
        dx={annotationPosition.dx}
        dy={annotationPosition.dy}
        canEditLabel={editLabelPosition}
        canEditSubject={editSubjectPosition}
        onDragEnd={({ event, ...nextPosition }: {
          event: any;
          x: number;
          y: number;
          dx: number;
          dy: number;
        }) => {
          const nearestDatum = findNearestDatum({
            accessor: subjectType === 'horizontal-line' ? getStockValue : getDate,
            data,
            scale: subjectType === 'horizontal-line' ? yScale : xScale,
            value: subjectType === 'horizontal-line' ? nextPosition.y : nextPosition.x,
          });
          const x = xScale(getDate(nearestDatum!)) ?? 0;
          const y = yScale(getStockValue(nearestDatum!)) ?? 0;

          const shouldFlipDx =
            (nextPosition.dx > 0 && x + nextPosition.dx + labelWidth > width) ||
            (nextPosition.dx < 0 && x + nextPosition.dx - labelWidth <= 0);
          const shouldFlipDy =
            (nextPosition.dy > 0 && height - (y + nextPosition.dy) < approxTooltipHeight) ||
            (nextPosition.dy < 0 && y + nextPosition.dy - approxTooltipHeight <= 0);
          onAnnotationPositionChange({
            x,
            y,
            dx: (shouldFlipDx ? -1 : 1) * nextPosition.dx,
            dy: (shouldFlipDy ? -1 : 1) * nextPosition.dy,
          });
        }}
      >
        <Connector stroke={orange} type={connectorType} />
        {labelType === 'svg' ? (
          <Label
            backgroundFill="white"
            showAnchorLine={showAnchorLine}
            anchorLineStroke={greens[2]}
            backgroundProps={{ stroke: greens[1] }}
            fontColor={greens[2]}
            horizontalAnchor={horizontalAnchor}
            subtitle={subtitle}
            title={title}
            verticalAnchor={verticalAnchor}
            width={labelWidth}
          />
        ) : (
          <HtmlLabel
            showAnchorLine={showAnchorLine}
            anchorLineStroke={greens[2]}
            horizontalAnchor={horizontalAnchor}
            verticalAnchor={verticalAnchor}
            containerStyle={{
              width: labelWidth,
              background: 'white',
              border: `1px solid ${greens[1]}`,
              borderRadius: 2,
              color: greens[2],
              fontSize: '0.55em',
              lineHeight: '1em',
              padding: '0 0.4em 0 1em',
              fontWeight: 200,
            }}
          >
            <h3 style={{ margin: '1em 0 -0.5em' }}>{title}</h3>
            <p>{subtitle}</p>
          </HtmlLabel>
        )}
        {subjectType === 'circle' && <CircleSubject stroke={orange} />}
        {subjectType !== 'circle' && (
          <LineSubject
            orientation={subjectType === 'vertical-line' ? 'vertical' : 'horizontal'}
            stroke={orange}
            min={0}
            max={subjectType === 'vertical-line' ? height : width}
          />
        )}
      </AnnotationComponent>
    </svg>
  );
};