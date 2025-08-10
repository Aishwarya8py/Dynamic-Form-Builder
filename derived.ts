import type { FormField } from '@/types/form.types';

export function calculateDerivedValue(field: FormField, getValue: (id: string)=>any): string | number {
  if (!field.isDerived || !field.parentFields || !field.derivedFormula) return '';

  let formula = field.derivedFormula;

  field.parentFields.forEach((parentId, index) => {
    const parentValue = getValue(parentId) ?? '';
    formula = formula.replace(`parentField${index + 1}`, String(parentValue));
  });

  try {
    // Simple evaluation for basic math operations
    if (/^[\d\s+\-*/.()]+$/.test(formula)) {
      // eslint-disable-next-line no-eval
      return eval(formula);
    }
    return formula;
  } catch {
    return '';
  }
}
