export type ValidationRuleType = 'required' | 'minLength' | 'maxLength' | 'email' | 'password';

export interface ValidationRule {
  type: ValidationRuleType;
  message?: string;
  value?: number;
}

export type FieldType = 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  required?: boolean;
  defaultValue?: string;
  options?: string[];
  validationRules: ValidationRule[];
  isDerived?: boolean;
  parentFields?: string[];
  derivedFormula?: string;
  order: number;
}

export interface Form {
  id: string;
  name: string;
  fields: FormField[];
  createdAt: string;
}
