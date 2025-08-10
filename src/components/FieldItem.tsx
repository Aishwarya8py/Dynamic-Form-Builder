import React from 'react'
import type { FormField } from '@/types/form.types'

export default function FieldItem({
  field, onEdit, onDelete, onMoveUp, onMoveDown, canMoveUp, canMoveDown
}: {
  field: FormField
  onEdit: () => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  canMoveUp: boolean
  canMoveDown: boolean
}) {
  return (
    <div className="field-item">
      <div className="field-header">
        <div>
          <span className="field-title">{field.label}</span>
          {field.required && <span className="chip">Required</span>}
          {field.isDerived && <span className="chip chip-secondary">Derived</span>}
        </div>
        <div className="field-actions">
          <button className="icon-btn" onClick={onMoveUp} disabled={!canMoveUp} title="Move up">⬆️</button>
          <button className="icon-btn" onClick={onMoveDown} disabled={!canMoveDown} title="Move down">⬇️</button>
          <button className="icon-btn" onClick={onEdit} title="Edit field">✏️</button>
          <button className="icon-btn" onClick={onDelete} title="Delete field">🗑️</button>
        </div>
      </div>
      <div className="text-sm text-gray">
        Type: {field.type}
        {field.options && ` • Options: ${field.options.length}`}
        {field.validationRules.length > 0 && ` • Validations: ${field.validationRules.length}`}
      </div>
    </div>
  )
}
