'use client';

import * as React from 'react';
import { RotateCcw, Plus, Trash2, Layers, GripVertical, ChevronDown, Check, X, CalendarIcon, Loader2 } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format } from 'date-fns';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

// ============================================================================
// Types
// ============================================================================

export type Combinator = 'and' | 'or';

export type OperatorType =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'notContains'
  | 'startsWith'
  | 'endsWith'
  | 'isEmpty'
  | 'isNotEmpty'
  | 'greaterThan'
  | 'lessThan'
  | 'greaterThanOrEquals'
  | 'lessThanOrEquals'
  | 'between'
  | 'in'
  | 'notIn'
  | 'isNull'
  | 'isNotNull'
  | 'before'
  | 'after'
  | 'inTheLastDays'
  | 'inTheNextDays';

interface Operator {
  name: OperatorType;
  label: string;
  requiresValue?: boolean;
  valueCount?: 1 | 2;
}

export type FieldType = 'text' | 'number' | 'select' | 'multiselect' | 'date' | 'boolean';

export interface FieldOption {
  value: string;
  label: string;
}

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  group?: string;
  operators?: OperatorType[];
  options?: FieldOption[] | 'loading';
  placeholder?: string;
}

export interface Rule {
  id: string;
  type: 'rule';
  field: string;
  operator: OperatorType;
  value: string | string[] | null;
  secondValue?: string | null;
}

export interface RuleGroup {
  id: string;
  type: 'group';
  combinator: Combinator;
  rules: (Rule | RuleGroup)[];
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_OPERATORS: Record<FieldType, OperatorType[]> = {
  text: ['equals', 'notEquals', 'contains', 'notContains', 'startsWith', 'endsWith', 'isEmpty', 'isNotEmpty'],
  number: ['equals', 'notEquals', 'greaterThan', 'lessThan', 'greaterThanOrEquals', 'lessThanOrEquals', 'between', 'isEmpty', 'isNotEmpty'],
  select: ['equals', 'notEquals', 'isNull', 'isNotNull'],
  multiselect: ['in', 'notIn', 'isEmpty', 'isNotEmpty'],
  date: ['equals', 'notEquals', 'before', 'after', 'between', 'inTheLastDays', 'inTheNextDays', 'isNull', 'isNotNull'],
  boolean: ['equals', 'notEquals']
};

const OPERATORS: Record<OperatorType, Operator> = {
  equals: { name: 'equals', label: 'equals', requiresValue: true },
  notEquals: { name: 'notEquals', label: 'does not equal', requiresValue: true },
  contains: { name: 'contains', label: 'contains', requiresValue: true },
  notContains: { name: 'notContains', label: 'does not contain', requiresValue: true },
  startsWith: { name: 'startsWith', label: 'starts with', requiresValue: true },
  endsWith: { name: 'endsWith', label: 'ends with', requiresValue: true },
  isEmpty: { name: 'isEmpty', label: 'is empty', requiresValue: false },
  isNotEmpty: { name: 'isNotEmpty', label: 'is not empty', requiresValue: false },
  greaterThan: { name: 'greaterThan', label: 'is greater than', requiresValue: true },
  lessThan: { name: 'lessThan', label: 'is less than', requiresValue: true },
  greaterThanOrEquals: { name: 'greaterThanOrEquals', label: 'is greater than or equal to', requiresValue: true },
  lessThanOrEquals: { name: 'lessThanOrEquals', label: 'is less than or equal to', requiresValue: true },
  between: { name: 'between', label: 'is between', requiresValue: true, valueCount: 2 },
  in: { name: 'in', label: 'is any of', requiresValue: true },
  notIn: { name: 'notIn', label: 'is none of', requiresValue: true },
  isNull: { name: 'isNull', label: 'is unknown', requiresValue: false },
  isNotNull: { name: 'isNotNull', label: 'is known', requiresValue: false },
  before: { name: 'before', label: 'is before', requiresValue: true },
  after: { name: 'after', label: 'is after', requiresValue: true },
  inTheLastDays: { name: 'inTheLastDays', label: 'in the last', requiresValue: true },
  inTheNextDays: { name: 'inTheNextDays', label: 'in the next', requiresValue: true }
};

// ============================================================================
// Utility Functions
// ============================================================================

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

function createEmptyRule(id: string, field?: Field): Rule {
  const defaultOperator = field ? (DEFAULT_OPERATORS[field.type]?.[0] ?? 'equals') : 'equals';
  return {
    id,
    type: 'rule',
    field: field?.name ?? '',
    operator: defaultOperator,
    value: field?.type === 'multiselect' ? [] : null
  };
}

function createEmptyGroup(id: string, combinator: Combinator = 'and'): RuleGroup {
  return { id, type: 'group', combinator, rules: [] };
}

function getOperatorsForField(field: Field | undefined): OperatorType[] {
  if (!field) return DEFAULT_OPERATORS.text;
  return field.operators ?? DEFAULT_OPERATORS[field.type] ?? DEFAULT_OPERATORS.text;
}

function getOperatorValueCount(operator: OperatorType): 1 | 2 {
  return OPERATORS[operator]?.valueCount ?? 1;
}

function getFieldByName(fields: Field[], name: string): Field | undefined {
  return fields.find((f) => f.name === name);
}

function groupFieldsByCategory(fields: Field[]): Map<string, Field[]> {
  const grouped = new Map<string, Field[]>();
  fields.forEach((field) => {
    const group = field.group ?? 'General';
    const existing = grouped.get(group) ?? [];
    grouped.set(group, [...existing, field]);
  });
  return grouped;
}

function isValidRule(rule: Rule, fields: Field[]): boolean {
  if (!rule.field) return false;
  const field = getFieldByName(fields, rule.field);
  if (!field) return false;
  if (!OPERATORS[rule.operator]?.requiresValue) return true;
  if (rule.value === null || rule.value === '' || (Array.isArray(rule.value) && rule.value.length === 0)) return false;
  if (getOperatorValueCount(rule.operator) === 2 && !rule.secondValue) return false;
  return true;
}

function isValidGroup(group: RuleGroup, fields: Field[]): boolean {
  if (group.rules.length === 0) return false;
  return group.rules.every((item) => {
    if (item.type === 'rule') return isValidRule(item, fields);
    return isValidGroup(item, fields);
  });
}

function countRules(group: RuleGroup): number {
  return group.rules.reduce((count, item) => {
    if (item.type === 'rule') return count + 1;
    return count + countRules(item);
  }, 0);
}

// ============================================================================
// Value Editor Components
// ============================================================================

function DatePicker({ value, onChange, disabled }: { value: string | null; onChange: (value: string | null) => void; disabled?: boolean }) {
  const [open, setOpen] = React.useState(false);
  const date = value ? new Date(value) : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' disabled={disabled} className={cn('h-8 w-36 justify-start gap-2 px-2.5 text-left font-normal', !date && 'text-muted-foreground')}>
          <CalendarIcon className='h-3.5 w-3.5' />
          {date ? format(date, 'MMM d, yyyy') : 'Pick date'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          mode='single'
          selected={date}
          onSelect={(d) => {
            onChange(d ? d.toISOString().split('T')[0] : null);
            setOpen(false);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

function SingleSelect({ field, value, onChange, disabled }: { field: Field; value: string | null; onChange: (value: string | null) => void; disabled?: boolean }) {
  const [open, setOpen] = React.useState(false);
  const isLoading = field.options === 'loading';
  const options: FieldOption[] = isLoading || !field.options || typeof field.options === 'string' ? [] : field.options;
  const selectedOption = options.find((o) => o.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' role='combobox' aria-expanded={open} disabled={disabled || isLoading} className={cn('h-8 w-36 justify-between gap-1 px-2.5 font-normal', !value && 'text-muted-foreground')}>
          {isLoading ? <Loader2 className='h-3.5 w-3.5 animate-spin' /> : (
            <>
              <span className='truncate'>{selectedOption?.label ?? 'Select...'}</span>
              <ChevronDown className='h-3.5 w-3.5 shrink-0 opacity-50' />
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-36 p-1' align='start'>
        <div className='max-h-48 overflow-y-auto'>
          {options.length === 0 ? (
            <p className='text-muted-foreground p-2 text-center text-xs'>No options</p>
          ) : (
            options.map((option) => (
              <button
                key={option.value}
                onClick={() => { onChange(option.value); setOpen(false); }}
                className={cn('hover:bg-accent flex w-full items-center rounded-sm px-2 py-1.5 text-sm', value === option.value && 'bg-accent')}>
                <Check className={cn('mr-2 h-3.5 w-3.5', value === option.value ? 'opacity-100' : 'opacity-0')} />
                {option.label}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function MultiSelect({ field, value, onChange, disabled }: { field: Field; value: string[]; onChange: (value: string[]) => void; disabled?: boolean }) {
  const [open, setOpen] = React.useState(false);
  const isLoading = field.options === 'loading';
  const options: FieldOption[] = isLoading || !field.options || typeof field.options === 'string' ? [] : field.options;

  const handleSelect = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  return (
    <div className='flex items-center gap-1'>
      {value.length > 0 && (
        <div className='flex flex-wrap gap-1'>
          {value.map((v) => {
            const option = options.find((o) => o.value === v);
            return (
              <Badge key={v} variant='secondary' className='h-6 gap-0.5 pr-0.5 text-xs'>
                {option?.label ?? v}
                <button onClick={() => onChange(value.filter((x) => x !== v))} className='hover:bg-muted rounded p-0.5' disabled={disabled}>
                  <X className='h-3 w-3' />
                </button>
              </Badge>
            );
          })}
        </div>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant='outline' size='sm' disabled={disabled || isLoading} className='h-8 w-8 p-0'>
            {isLoading ? <Loader2 className='h-3.5 w-3.5 animate-spin' /> : <ChevronDown className='h-3.5 w-3.5' />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-32 p-1' align='start'>
          <div className='max-h-48 overflow-y-auto'>
            {options.length === 0 ? (
              <p className='text-muted-foreground p-2 text-center text-xs'>No options</p>
            ) : (
              options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={cn('hover:bg-accent flex w-full items-center rounded-sm px-2 py-1.5 text-sm', value.includes(option.value) && 'bg-accent')}>
                  <Check className={cn('mr-2 h-3.5 w-3.5', value.includes(option.value) ? 'opacity-100' : 'opacity-0')} />
                  {option.label}
                </button>
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function BooleanSwitch({ value, onChange, disabled }: { value: string | null; onChange: (value: string | null) => void; disabled?: boolean }) {
  const isChecked = value === 'true';
  return (
    <div className='flex items-center gap-2'>
      <Switch checked={isChecked} onCheckedChange={(checked) => onChange(checked ? 'true' : 'false')} disabled={disabled} />
      <span className='text-muted-foreground text-xs'>{isChecked ? 'Yes' : 'No'}</span>
    </div>
  );
}

function ValueEditor({ field, operator, value, secondValue, onChange, disabled }: {
  field: Field;
  operator: OperatorType;
  value: string | string[] | null;
  secondValue?: string | null;
  onChange: (value: string | string[] | null, secondValue?: string | null) => void;
  disabled?: boolean;
}) {
  const valueCount = getOperatorValueCount(operator);

  if (['isEmpty', 'isNotEmpty', 'isNull', 'isNotNull'].includes(operator)) return null;

  if (['inTheLastDays', 'inTheNextDays'].includes(operator)) {
    return (
      <div className='flex items-center gap-1.5'>
        <Input type='number' min={1} placeholder='0' value={value?.toString() ?? ''} onChange={(e) => onChange(e.target.value)} disabled={disabled} className='h-8 w-20' />
        <span className='text-muted-foreground text-xs'>days</span>
      </div>
    );
  }

  if (valueCount === 2) {
    if (field.type === 'date') {
      return (
        <div className='flex items-center gap-1.5'>
          <DatePicker value={value?.toString() ?? null} onChange={(v) => onChange(v, secondValue)} disabled={disabled} />
          <span className='text-muted-foreground text-xs'>to</span>
          <DatePicker value={secondValue ?? null} onChange={(v) => onChange(value, v)} disabled={disabled} />
        </div>
      );
    }
    return (
      <div className='flex items-center gap-1.5'>
        <Input type={field.type === 'number' ? 'number' : 'text'} placeholder='Min' value={value?.toString() ?? ''} onChange={(e) => onChange(e.target.value, secondValue)} disabled={disabled} className='h-8 w-24' />
        <span className='text-muted-foreground text-xs'>to</span>
        <Input type={field.type === 'number' ? 'number' : 'text'} placeholder='Max' value={secondValue ?? ''} onChange={(e) => onChange(value, e.target.value)} disabled={disabled} className='h-8 w-24' />
      </div>
    );
  }

  if (field.type === 'date') return <DatePicker value={value?.toString() ?? null} onChange={(v) => onChange(v)} disabled={disabled} />;
  if (field.type === 'select') return <SingleSelect field={field} value={value?.toString() ?? null} onChange={onChange} disabled={disabled} />;
  if (field.type === 'multiselect' || ['in', 'notIn'].includes(operator)) return <MultiSelect field={field} value={Array.isArray(value) ? value : value ? [value] : []} onChange={onChange} disabled={disabled} />;
  if (field.type === 'boolean') return <BooleanSwitch value={value?.toString() ?? null} onChange={onChange} disabled={disabled} />;
  if (field.type === 'number') return <Input type='number' placeholder={field.placeholder ?? '0'} value={value?.toString() ?? ''} onChange={(e) => onChange(e.target.value)} disabled={disabled} className='h-8 w-36' />;

  return <Input type='text' placeholder={field.placeholder ?? 'Enter value...'} value={value?.toString() ?? ''} onChange={(e) => onChange(e.target.value)} disabled={disabled} className='h-8 w-36' />;
}

// ============================================================================
// Field & Operator Selectors
// ============================================================================

function FieldSelector({ fields, groupedFields, value, onChange, disabled }: {
  fields: Field[];
  groupedFields: Map<string, Field[]>;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const selectedField = fields.find((f) => f.name === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' role='combobox' aria-expanded={open} disabled={disabled} className={cn('h-8 min-w-24 justify-between gap-1 px-2 font-normal', !value && 'text-muted-foreground')}>
          <span className='truncate'>{selectedField?.label ?? 'Field'}</span>
          <ChevronDown className='h-3.5 w-3.5 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-44 p-1' align='start'>
        <div className='max-h-64 overflow-y-auto'>
          {Array.from(groupedFields.entries()).map(([group, groupFields]) => (
            <div key={group}>
              {groupedFields.size > 1 && <div className='text-muted-foreground px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider'>{group}</div>}
              {groupFields.map((field) => (
                <button
                  key={field.name}
                  onClick={() => { onChange(field.name); setOpen(false); }}
                  className={cn('hover:bg-accent flex w-full items-center rounded-sm px-2 py-1.5 text-sm', value === field.name && 'bg-accent')}>
                  <Check className={cn('mr-2 h-3.5 w-3.5', value === field.name ? 'opacity-100' : 'opacity-0')} />
                  {field.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function OperatorSelector({ operators, value, onChange, disabled }: { operators: OperatorType[]; value: OperatorType; onChange: (value: OperatorType) => void; disabled?: boolean }) {
  const [open, setOpen] = React.useState(false);
  const selectedOperator = OPERATORS[value];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' role='combobox' aria-expanded={open} disabled={disabled} className='h-8 min-w-20 justify-between gap-1 px-2 font-normal'>
          <span className='truncate'>{selectedOperator?.label ?? value}</span>
          <ChevronDown className='h-3.5 w-3.5 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-40 p-1' align='start'>
        <div className='max-h-64 overflow-y-auto'>
          {operators.map((op) => (
            <button
              key={op}
              onClick={() => { onChange(op); setOpen(false); }}
              className={cn('hover:bg-accent flex w-full items-center rounded-sm px-2 py-1.5 text-sm', value === op && 'bg-accent')}>
              <Check className={cn('mr-2 h-3.5 w-3.5', value === op ? 'opacity-100' : 'opacity-0')} />
              {OPERATORS[op]?.label ?? op}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ============================================================================
// Rule Row Component
// ============================================================================

function RuleRow({ rule, fields, onUpdate, onRemove, disabled }: {
  rule: Rule;
  fields: Field[];
  onUpdate: (updates: Partial<Rule>) => void;
  onRemove: () => void;
  disabled?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: rule.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const currentField = getFieldByName(fields, rule.field);
  const operators = getOperatorsForField(currentField);
  const groupedFields = React.useMemo(() => groupFieldsByCategory(fields), [fields]);

  const handleFieldChange = (fieldName: string) => {
    const newField = getFieldByName(fields, fieldName);
    const newOperators = getOperatorsForField(newField);
    const newOperator = newOperators.includes(rule.operator) ? rule.operator : newOperators[0];
    onUpdate({ field: fieldName, operator: newOperator, value: newField?.type === 'multiselect' ? [] : null, secondValue: null });
  };

  const handleOperatorChange = (operator: OperatorType) => {
    onUpdate({ operator, value: currentField?.type === 'multiselect' || ['in', 'notIn'].includes(operator) ? [] : null, secondValue: null });
  };

  return (
    <div ref={setNodeRef} style={style} className={cn('group/rule flex items-center gap-2 transition-all duration-200', isDragging && 'opacity-90', disabled && 'opacity-50 pointer-events-none')}>
      <button {...attributes} {...listeners} className='text-muted-foreground hover:text-foreground shrink-0 cursor-grab p-0.5 transition-colors active:cursor-grabbing'>
        <GripVertical className='h-4 w-4' />
      </button>
      <div className={cn('flex min-w-0 flex-1 items-center gap-2 rounded-lg border bg-card p-2.5', 'hover:border-primary/30', isDragging && 'shadow-lg border-primary/50')}>
        <FieldSelector fields={fields} groupedFields={groupedFields} value={rule.field} onChange={handleFieldChange} disabled={disabled} />
        <OperatorSelector operators={operators} value={rule.operator} onChange={handleOperatorChange} disabled={disabled} />
        {currentField && <ValueEditor field={currentField} operator={rule.operator} value={rule.value} secondValue={rule.secondValue} onChange={(v, sv) => onUpdate({ value: v, secondValue: sv })} disabled={disabled} />}
        <Button variant='ghost' size='icon-sm' onClick={onRemove} disabled={disabled} className='text-muted-foreground hover:text-destructive ml-auto h-7 w-7'>
          <Trash2 className='h-3.5 w-3.5' />
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// Rule Group Component
// ============================================================================

function RuleGroupComponent({
  group,
  fields,
  onChange,
  onRemove,
  isRoot = false,
  depth = 0,
  disabled
}: {
  group: RuleGroup;
  fields: Field[];
  onChange: (group: RuleGroup) => void;
  onRemove?: () => void;
  isRoot?: boolean;
  depth?: number;
  disabled?: boolean;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: group.id, disabled: isRoot });
  const style = !isRoot ? { transform: CSS.Transform.toString(transform), transition } : undefined;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = group.rules.findIndex((item) => item.id === active.id);
      const newIndex = group.rules.findIndex((item) => item.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        onChange({ ...group, rules: arrayMove(group.rules, oldIndex, newIndex) });
      }
    }
  };

  const handleAddRule = () => {
    onChange({ ...group, rules: [...group.rules, createEmptyRule(generateId(), fields[0])] });
  };

  const handleAddGroup = () => {
    const newGroup = createEmptyGroup(generateId());
    newGroup.rules.push(createEmptyRule(generateId(), fields[0]));
    onChange({ ...group, rules: [...group.rules, newGroup] });
  };

  const groupContent = (
    <div
      className={cn(
        'flex-1 rounded-lg border transition-all duration-200',
        isRoot
          ? 'border-border bg-muted/30'
          : 'border-primary/30 bg-primary/5',
        isDragging && 'shadow-lg border-primary/50',
        disabled && 'opacity-50 pointer-events-none'
      )}
    >
      <div className='flex items-center gap-2 p-3'>
        <div className='border-input inline-flex h-7 items-center overflow-hidden rounded-md border text-xs'>
          <button
            onClick={() => onChange({ ...group, combinator: 'and' })}
            disabled={disabled}
            className={cn('h-full px-2.5 font-medium transition-colors', group.combinator === 'and' ? 'bg-primary text-primary-foreground' : 'bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground')}
          >
            AND
          </button>
          <div className='bg-border h-full w-px' />
          <button
            onClick={() => onChange({ ...group, combinator: 'or' })}
            disabled={disabled}
            className={cn('h-full px-2.5 font-medium transition-colors', group.combinator === 'or' ? 'bg-primary text-primary-foreground' : 'bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground')}
          >
            OR
          </button>
        </div>
        <span className='text-muted-foreground text-[11px]'>{group.combinator === 'and' ? 'all match' : 'any match'}</span>
        {!isRoot && onRemove && (
          <Button variant='ghost' size='icon-sm' onClick={onRemove} disabled={disabled} className='text-muted-foreground hover:text-destructive ml-auto h-6 w-6'>
            <Trash2 className='h-3.5 w-3.5' />
          </Button>
        )}
      </div>

      <div className='space-y-2 p-3 pt-0'>
        {group.rules.length === 0 ? (
          <div className='border-border flex flex-col items-center justify-center rounded-lg border border-dashed py-8'>
            <p className='text-muted-foreground mb-3 text-sm'>No conditions added yet</p>
            <Button variant='outline' size='sm' onClick={handleAddRule} disabled={disabled}>
              <Plus className='mr-1.5 h-3.5 w-3.5' />
              Add condition
            </Button>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={group.rules.map((r) => r.id)} strategy={verticalListSortingStrategy}>
              <div className='space-y-2'>
                {group.rules.map((item, index) => (
                  <React.Fragment key={item.id}>
                    {index > 0 && (
                      <div className='flex items-center gap-2 py-1'>
                        <div className='bg-border h-px flex-1' />
                        <span className={cn('text-[10px] font-semibold uppercase tracking-wider', group.combinator === 'and' ? 'text-primary' : 'text-amber-600 dark:text-amber-400')}>{group.combinator}</span>
                        <div className='bg-border h-px flex-1' />
                      </div>
                    )}
                    {item.type === 'rule' ? (
                      <RuleRow rule={item} fields={fields} onUpdate={(updates) => onChange({ ...group, rules: group.rules.map((r) => r.id === item.id && r.type === 'rule' ? { ...r, ...updates } : r) })} onRemove={() => onChange({ ...group, rules: group.rules.filter((r) => r.id !== item.id) })} disabled={disabled} />
                    ) : (
                      <RuleGroupComponent group={item} fields={fields} onChange={(newGroup) => onChange({ ...group, rules: group.rules.map((r) => r.id === item.id ? newGroup : r) })} onRemove={() => onChange({ ...group, rules: group.rules.filter((r) => r.id !== item.id) })} depth={depth + 1} disabled={disabled} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {group.rules.length > 0 && (
          <div className='flex items-center gap-2 pt-2'>
            <Button variant='outline' size='sm' onClick={handleAddRule} disabled={disabled} className='h-8'>
              <Plus className='mr-1.5 h-3.5 w-3.5' />
              Add condition
            </Button>
            <Button variant='outline' size='sm' onClick={handleAddGroup} disabled={disabled} className='h-8'>
              <Layers className='mr-1.5 h-3.5 w-3.5' />
              Add group
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  if (!isRoot) {
    return (
      <div ref={setNodeRef} style={style} className={cn('flex items-start gap-2', isDragging && 'opacity-90')}>
        <button {...attributes} {...listeners} className='text-muted-foreground hover:text-foreground mt-3 shrink-0 cursor-grab p-0.5 transition-colors active:cursor-grabbing'>
          <GripVertical className='h-4 w-4' />
        </button>
        {groupContent}
      </div>
    );
  }

  return groupContent;
}

// ============================================================================
// Main QueryBuilder Component
// ============================================================================

interface QueryBuilderProps {
  value?: RuleGroup;
  defaultValue?: RuleGroup;
  onChange?: (value: RuleGroup) => void;
  fields: Field[];
  disabled?: boolean;
  showHeader?: boolean;
  className?: string;
}

export function QueryBuilder({ value, defaultValue, onChange, fields, disabled = false, showHeader = true, className }: QueryBuilderProps) {
  const [internalValue, setInternalValue] = React.useState<RuleGroup>(() => {
    return value ?? defaultValue ?? createEmptyGroup(generateId());
  });

  const currentValue = value ?? internalValue;
  const isValid = isValidGroup(currentValue, fields);
  const ruleCount = countRules(currentValue);

  const handleChange = React.useCallback(
    (newValue: RuleGroup) => {
      if (!value) setInternalValue(newValue);
      onChange?.(newValue);
    },
    [value, onChange]
  );

  const handleReset = () => handleChange(createEmptyGroup(generateId()));

  return (
    <TooltipProvider>
      <div className={cn('space-y-3', className)}>
        {showHeader && (
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <h3 className='text-sm font-medium'>Conditions</h3>
              {ruleCount > 0 && (
                <Badge variant='secondary' className='text-xs'>
                  {ruleCount} {ruleCount === 1 ? 'rule' : 'rules'}
                </Badge>
              )}
              {ruleCount > 0 && (
                <Badge variant={isValid ? 'default' : 'secondary'} className='text-xs'>
                  {isValid ? 'Valid' : 'Incomplete'}
                </Badge>
              )}
            </div>
            {ruleCount > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant='ghost' size='sm' onClick={handleReset} disabled={disabled} className='h-7 text-xs'>
                    <RotateCcw className='mr-1.5 h-3 w-3' />
                    Reset
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Clear all conditions</TooltipContent>
              </Tooltip>
            )}
          </div>
        )}
        <RuleGroupComponent group={currentValue} fields={fields} onChange={handleChange} isRoot disabled={disabled} />
      </div>
    </TooltipProvider>
  );
}

export default QueryBuilder;
