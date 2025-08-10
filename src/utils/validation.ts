import type { FormField } from '@/types/form.types';

export function validateField(field: FormField, value: any): string {
  for (const rule of field.validationRules) {
    switch (rule.type) {
      case 'required':
        if (
          value === undefined ||
          value === null ||
          (typeof value === 'string' && !value.trim())
        ) {
          return rule.message || 'This field is required';
        }
        break;
      case 'minLength':
        if (value && String(value).length < (rule.value ?? 0)) {
          return rule.message || `Minimum ${rule.value} characters required`;
        }
        break;
      case 'maxLength':
        if (value && String(value).length > (rule.value ?? 0)) {
          return rule.message || `Maximum ${rule.value} characters allowed`;
        }
        break;
      case 'email': {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(String(value))) {
          return rule.message || 'Please enter a valid email';
        }
        break;
      }
      case 'password':
        if (value && (String(value).length < 8 || !/\d/.test(String(value)))) {
          return rule.message || 'Password must be at least 8 characters with a number';
        }
        break;
    }
  }
  return '';
}
