import React, { useState } from 'react'
import type { Form } from '@/types/form.types'
import { validateField } from '@/utils/validation'
import { calculateDerivedValue } from '@/utils/derived'

export default function FormPreview({ currentForm }: { currentForm: Form | null }) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!currentForm) {
    return (
      <div className="empty-state">
        <h2>No Form to Preview</h2>
        <p className="text-gray">Create a form first to see the preview</p>
      </div>
    )
  }

  const getValue = (id: string) => formData[id]

  const handleFieldChange = (fieldId: string, value: any) => {
    const newFormData = { ...formData, [fieldId]: value }
    // Clear error for this field
    setErrors(prev => ({ ...prev, [fieldId]: '' }))

    // Update derived fields
    const derivedFields = currentForm.fields.filter(f => f.isDerived && f.parentFields?.includes(fieldId))
    derivedFields.forEach(df => {
      newFormData[df.id] = calculateDerivedValue(df, getValue)
    })
    setFormData(newFormData)
  }

  const renderField = (field: any) => {
    const value = field.isDerived ? calculateDerivedValue(field, getValue) : (formData[field.id] || '')
    const error = errors[field.id]
    const fieldId = `field-${field.id}`

    const commonProps: any = {
      id: fieldId,
      value,
      onChange: (e: any) => handleFieldChange(field.id, e.target.value),
      className: `form-input ${error ? 'error' : ''}`,
      disabled: !!field.isDerived
    }

    let fieldElement: any
    switch (field.type) {
      case 'text': fieldElement = <input type="text" {...commonProps} />; break
      case 'number': fieldElement = <input type="number" {...commonProps} />; break
      case 'textarea': fieldElement = <textarea {...commonProps} rows={4} />; break
      case 'date': fieldElement = <input type="date" {...commonProps} />; break
      case 'select':
        fieldElement = (
          <select {...commonProps}>
            <option value="">Select an option</option>
            {field.options?.map((option: string) => <option key={option} value={option}>{option}</option>)}
          </select>
        ); break
      case 'radio':
        fieldElement = (
          <div>
            {field.options?.map((option: string) => (
              <label key={option} className="flex flex-center gap-1 mb-2">
                <input type="radio" name={fieldId} value={option} checked={value === option}
                  onChange={(e)=>handleFieldChange(field.id, e.target.value)} disabled={!!field.isDerived} />
                {option}
              </label>
            ))}
          </div>
        ); break
      case 'checkbox':
        fieldElement = (
          <label className="flex flex-center gap-1">
            <input type="checkbox" checked={!!value} onChange={(e)=>handleFieldChange(field.id, e.target.checked)} disabled={!!field.isDerived} />
            {field.label}
          </label>
        ); break
      default:
        fieldElement = <input type="text" {...commonProps} />
    }

    return (
      <div key={field.id} className="form-group">
        {field.type !== 'checkbox' && (
          <label htmlFor={fieldId} className="form-label">
            {field.label}
            {field.required && <span style={{color: 'red'}}>*</span>}
            {field.isDerived && <span className="chip chip-secondary">Auto-calculated</span>}
          </label>
        )}
        {fieldElement}
        {error && <div className="error-message">{error}</div>}
      </div>
    )
  }

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {}
    let hasErrors = false
    currentForm.fields.forEach(field => {
      if (!field.isDerived) {
        const err = validateField(field, formData[field.id])
        if (err) { newErrors[field.id] = err; hasErrors = true }
      }
    })
    setErrors(newErrors)
    if (!hasErrors) {
      alert('✅ Form submitted successfully!\n\nForm Data:\n' + JSON.stringify(formData, null, 2))
    }
  }

  return (
    <div>
      <h2 className="mb-4">Preview: {currentForm.name}</h2>
      <div className="card">
        {currentForm.fields.sort((a,b)=>a.order - b.order).map(renderField)}
        <div className="mt-4">
          <button className="btn" onClick={handleSubmit}>🚀 Submit Form</button>
        </div>
      </div>
    </div>
  )
}
