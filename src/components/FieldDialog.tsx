import React, { useState } from 'react';
import type { Form, FormField, FieldType, ValidationRule } from '@/types/form.types';
import ValidationRuleEditor from './ValidationRuleEditor';

const FIELD_TYPES: Record<FieldType, string> = {
  text: 'Text',
  number: 'Number',
  textarea: 'Textarea',
  select: 'Select',
  radio: 'Radio',
  checkbox: 'Checkbox',
  date: 'Date',
};

// field types that require options list
const OPTION_FIELDS: ReadonlyArray<FieldType> = ['select', 'radio'];

export default function FieldDialog({
  field,
  currentForm,
  onSave,
  onClose,
}: {
  field: FormField | null;
  currentForm: Form;
  onSave: (data: Partial<FormField>) => void;
  onClose: () => void;
}) {
  // ✅ Type the union explicitly
  const [fieldType, setFieldType] = useState<FieldType>(field?.type ?? 'text');
  const [label, setLabel] = useState<string>(field?.label ?? '');
  const [required, setRequired] = useState<boolean>(field?.required ?? false);
  const [defaultValue, setDefaultValue] = useState<string>(field?.defaultValue ?? '');
  const [options, setOptions] = useState<string[]>(field?.options ?? ['']);
  const [validationRules, setValidationRules] = useState<ValidationRule[]>(field?.validationRules ?? []);
  const [isDerived, setIsDerived] = useState<boolean>(field?.isDerived ?? false);
  const [parentFields, setParentFields] = useState<string[]>(field?.parentFields ?? []);
  const [derivedFormula, setDerivedFormula] = useState<string>(field?.derivedFormula ?? '');

  const handleAddOption = () => setOptions((prev) => [...prev, '']);
  const handleUpdateOption = (index: number, value: string) => {
    setOptions((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };
  const handleRemoveOption = (index: number) =>
    setOptions((prev) => prev.filter((_, i) => i !== index));

  const handleAddValidation = () =>
    setValidationRules((prev) => [...prev, { type: 'required', message: 'This field is required' }]);

  const handleUpdateValidation = (index: number, updates: Partial<ValidationRule>) =>
    setValidationRules((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...updates };
      return next;
    });

  const handleRemoveValidation = (index: number) =>
    setValidationRules((prev) => prev.filter((_, i) => i !== index));

  const handleSave = () => {
    const fieldData: Partial<FormField> = {
      type: fieldType,
      label,
      required,
      defaultValue,
      options: OPTION_FIELDS.includes(fieldType) ? options.filter((o) => o.trim()) : undefined,
      validationRules,
      isDerived,
      parentFields: isDerived ? parentFields : undefined,
      derivedFormula: isDerived ? derivedFormula : undefined,
    };
    onSave(fieldData);
  };

  const availableParentFields =
    (currentForm?.fields || []).filter((f) => f.id !== field?.id && !f.isDerived) ?? [];

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">{field ? 'Edit Field' : 'Add New Field'}</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Field Type</label>
            <select
              className="form-input"
              value={fieldType}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                // ✅ cast to FieldType because e.target.value is just string
                setFieldType(e.target.value as FieldType)
              }
            >
              {(Object.keys(FIELD_TYPES) as FieldType[]).map((value) => (
                <option key={value} value={value}>
                  {FIELD_TYPES[value]}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Field Label</label>
            <input
              className="form-input"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Enter field label"
            />
          </div>
        </div>

        <div className="form-group">
          <span className="flex flex-center gap-1">
            <label className="switch">
              <input
                type="checkbox"
                checked={required}
                onChange={(e) => setRequired(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
            Required Field
          </span>
        </div>

        {OPTION_FIELDS.includes(fieldType) && (
          <div className="form-group">
            <label className="form-label">Options</label>
            {options.map((option, index) => (
              <div key={index} className="flex gap-1 mb-2">
                <input
                  className="form-input"
                  value={option}
                  onChange={(e) => handleUpdateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                />
                <button
                  className="btn btn-danger btn-small"
                  onClick={() => handleRemoveOption(index)}
                  disabled={options.length === 1}
                >
                  Remove
                </button>
              </div>
            ))}
            <button className="btn btn-small" onClick={handleAddOption}>
              Add Option
            </button>
          </div>
        )}

        <div className="form-group">
          <span className="flex flex-center gap-1">
            <label className="switch">
              <input
                type="checkbox"
                checked={isDerived}
                onChange={(e) => setIsDerived(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
            Derived Field
          </span>
        </div>

        {isDerived && (
          <>
            <div className="form-group">
              <label className="form-label">Parent Fields</label>
              <select
                className="form-input"
                multiple
                value={parentFields}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const values = Array.from(e.currentTarget.selectedOptions, (o) => o.value);
                  setParentFields(values);
                }}
              >
                {availableParentFields.map((pf) => (
                  <option key={pf.id} value={pf.id}>
                    {pf.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Derived Formula</label>
              <input
                className="form-input"
                value={derivedFormula}
                onChange={(e) => setDerivedFormula(e.target.value)}
                placeholder="e.g., 2024 - parentField1"
              />
              <div className="text-sm text-gray mt-2">
                Use parentField1, parentField2, etc. to reference parent fields
              </div>
            </div>
          </>
        )}

        <div className="form-group">
          <div className="flex flex-between flex-center">
            <label className="form-label">Validation Rules</label>
            <button className="btn btn-small" onClick={handleAddValidation}>
              Add Validation
            </button>
          </div>
          {validationRules.map((rule, index) => (
            <ValidationRuleEditor
              key={index}
              rule={rule}
              onUpdate={(updates) => handleUpdateValidation(index, updates)}
              onRemove={() => handleRemoveValidation(index)}
            />
          ))}
        </div>

        <div className="flex gap-1 mt-4">
          <button className="btn" onClick={handleSave} disabled={!label.trim()}>
            {field ? 'Update Field' : 'Add Field'}
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
