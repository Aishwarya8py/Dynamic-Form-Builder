import React from 'react'
import FieldItem from './FieldItem'
import FieldDialog from './FieldDialog'
import type { Form } from '@/types/form.types'

export default function FormBuilder({
  currentForm,
  onCreateNew,
  onAddField,
  onUpdateField,
  onDeleteField,
  onMoveField,
  onSave,
}: {
  currentForm: Form | null
  onCreateNew: () => void
  onAddField: (data: any) => void
  onUpdateField: (id: string, updates: any) => void
  onDeleteField: (id: string) => void
  onMoveField: (id: string, dir: 'up'|'down') => void
  onSave: () => void
}) {
  const [showFieldDialog, setShowFieldDialog] = React.useState(false)
  const [editingField, setEditingField] = React.useState<any>(null)

  if (!currentForm) {
    return (
      <div className="empty-state">
        <h2>Create Your First Form</h2>
        <p className="text-gray mb-4">Start building dynamic forms with custom fields and validations</p>
        <button className="btn" onClick={onCreateNew}>✨ Start Building</button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-between flex-center mb-4">
        <h2>Form Builder</h2>
        <div className="flex gap-1">
          <button className="btn" onClick={() => { setEditingField(null); setShowFieldDialog(true) }}>➕ Add Field</button>
          <button className="btn btn-secondary" onClick={onSave} disabled={currentForm.fields.length === 0}>💾 Save Form</button>
        </div>
      </div>

      {currentForm.fields.length === 0 ? (
        <div className="empty-state"><p>No fields added yet. Click "Add Field" to get started.</p></div>
      ) : (
        <div>
          {currentForm.fields
            .sort((a, b) => a.order - b.order)
            .map((field) => (
              <FieldItem
                key={field.id}
                field={field}
                onEdit={() => { setEditingField(field); setShowFieldDialog(true) }}
                onDelete={() => onDeleteField(field.id)}
                onMoveUp={() => onMoveField(field.id, 'up')}
                onMoveDown={() => onMoveField(field.id, 'down')}
                canMoveUp={field.order > 0}
                canMoveDown={field.order < currentForm.fields.length - 1}
              />
            ))}
        </div>
      )}

      {showFieldDialog && (
        <FieldDialog
          field={editingField}
          currentForm={currentForm}
          onSave={(fieldData) => {
            if (editingField) { onUpdateField(editingField.id, fieldData) }
            else { onAddField(fieldData) }
            setShowFieldDialog(false)
            setEditingField(null)
          }}
          onClose={() => { setShowFieldDialog(false); setEditingField(null) }}
        />
      )}
    </div>
  )
}
