import React, { useState } from 'react'
import type { Form, FormField } from '@/types/form.types'
import ValidationRuleEditor from './ValidationRuleEditor'

const FIELD_TYPES = {
  text: 'Text',
  number: 'Number',
  textarea: 'Textarea',
  select: 'Select',
  radio: 'Radio',
  checkbox: 'Checkbox',
  date: 'Date'
} as const

export default function FieldDialog({
  field, currentForm, onSave, onClose
}: { field: FormField | null, currentForm: Form, onSave: (data:any)=>void, onClose: ()=>void }) {
  const [fieldType, setFieldType] = useState(field?.type || 'text')
  const [label, setLabel] = useState(field?.label || '')
  const [required, setRequired] = useState<boolean>(field?.required || false)
  const [defaultValue, setDefaultValue] = useState<string>(field?.defaultValue || '')
  const [options, setOptions] = useState<string[]>(field?.options || [''])
  const [validationRules, setValidationRules] = useState<any[]>(field?.validationRules || [])
  const [isDerived, setIsDerived] = useState<boolean>(field?.isDerived || false)
  const [parentFields, setParentFields] = useState<string[]>(field?.parentFields || [])
  const [derivedFormula, setDerivedFormula] = useState<string>(field?.derivedFormula || '')

  const handleAddOption = () => setOptions([...options, ''])
  const handleUpdateOption = (index: number, value: string) => {
    const newOptions = [...options]; newOptions[index] = value; setOptions(newOptions)
  }
  const handleRemoveOption = (index: number) => setOptions(options.filter((_, i) => i !== index))

  const handleAddValidation = () => setValidationRules([...validationRules, { type: 'required', message: 'This field is required' }])
  const handleUpdateValidation = (index: number, updates: any) => {
    const newRules = [...validationRules]; newRules[index] = { ...newRules[index], ...updates }; setValidationRules(newRules)
  }
  const handleRemoveValidation = (index: number) => setValidationRules(validationRules.filter((_, i) => i !== index))

  const handleSave = () => {
    const fieldData: Partial<FormField> = {
      type: fieldType as any,
      label,
      required,
      defaultValue,
      options: ['select','radio'].includes(fieldType) ? options.filter(o => o.trim()) : undefined,
      validationRules,
      isDerived,
      parentFields: isDerived ? parentFields : undefined,
      derivedFormula: isDerived ? derivedFormula : undefined,
    }
    onSave(fieldData)
  }

  const availableParentFields = (currentForm?.fields || []).filter(f => f.id !== field?.id && !f.isDerived)

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">{field ? 'Edit Field' : 'Add New Field'}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Field Type</label>
            <select className="form-input" value={fieldType} onChange={(e)=>setFieldType(e.target.value)}>
              {Object.entries(FIELD_TYPES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Field Label</label>
            <input className="form-input" value={label} onChange={(e)=>setLabel(e.target.value)} placeholder="Enter field label" />
          </div>
        </div>

        <div className="form-group">
          <label className="flex flex-center gap-1">
            <label className="switch">
              <input type="checkbox" checked={required} onChange={(e)=>setRequired(e.target.checked)} />
              <span className="slider"></span>
            </label>
            Required Field
          </label>
        </div>

        {['select','radio'].includes(fieldType) && (
          <div className="form-group">
            <label className="form-label">Options</label>
            {options.map((option, index) => (
              <div key={index} className="flex gap-1 mb-2">
                <input className="form-input" value={option} onChange={(e)=>handleUpdateOption(index, e.target.value)} placeholder={`Option ${index+1}`} />
                <button className="btn btn-danger btn-small" onClick={()=>handleRemoveOption(index)} disabled={options.length===1}>Remove</button>
              </div>
            ))}
            <button className="btn btn-small" onClick={handleAddOption}>Add Option</button>
          </div>
        )}

        <div className="form-group">
          <label className="flex flex-center gap-1">
            <label className="switch">
              <input type="checkbox" checked={isDerived} onChange={(e)=>setIsDerived(e.target.checked)} />
              <span className="slider"></span>
            </label>
            Derived Field
          </label>
        </div>

        {isDerived && (
          <>
            <div className="form-group">
              <label className="form-label">Parent Fields</label>
              <select className="form-input" multiple value={parentFields} onChange={(e)=>{
                const values = Array.from(e.currentTarget.selectedOptions, o => o.value)
                setParentFields(values)
              }}>
                {availableParentFields.map(field => <option key={field.id} value={field.id}>{field.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Derived Formula</label>
              <input className="form-input" value={derivedFormula} onChange={(e)=>setDerivedFormula(e.target.value)} placeholder="e.g., 2024 - parentField1" />
              <div className="text-sm text-gray mt-2">Use parentField1, parentField2, etc. to reference parent fields</div>
            </div>
          </>
        )}

        <div className="form-group">
          <div className="flex flex-between flex-center">
            <label className="form-label">Validation Rules</label>
            <button className="btn btn-small" onClick={handleAddValidation}>Add Validation</button>
          </div>
          {validationRules.map((rule, index) => (
            <ValidationRuleEditor
              key={index}
              rule={rule}
              onUpdate={(updates)=>handleUpdateValidation(index, updates)}
              onRemove={()=>handleRemoveValidation(index)}
            />
          ))}
        </div>

        <div className="flex gap-1 mt-4">
          <button className="btn" onClick={handleSave} disabled={!label.trim()}>{field ? 'Update Field' : 'Add Field'}</button>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
