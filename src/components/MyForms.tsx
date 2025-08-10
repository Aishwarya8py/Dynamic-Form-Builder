import React from 'react'
import type { Form } from '@/types/form.types'

export default function MyForms({ savedForms, onLoadForm, onNavigate }: { savedForms: Form[], onLoadForm: (id:string)=>void, onNavigate: (r:any)=>void }) {
  if (savedForms.length === 0) {
    return (
      <div className="empty-state">
        <h2>No Saved Forms</h2>
        <p className="text-gray mb-4">Create your first form to get started</p>
        <button className="btn" onClick={() => onNavigate('create')}>✨ Create Form</button>
      </div>
    )
  }

  return (
    <div>
      <h2 className="mb-4">My Forms ({savedForms.length})</h2>
      <div className="grid grid-3">
        {savedForms.map((form) => (
          <div key={form.id} className="card">
            <h3 className="field-title mb-2">{form.name}</h3>
            <div className="text-sm text-gray mb-2">
              <div>📅 Created: {new Date(form.createdAt).toLocaleDateString()}</div>
              <div>📝 Fields: {form.fields.length}</div>
              <div>✅ Required: {form.fields.filter(f => f.required).length}</div>
              <div>🔄 Derived: {form.fields.filter(f => f.isDerived).length}</div>
            </div>
            <button className="btn" onClick={() => onLoadForm(form.id)} style={{ width: '100%' }}>👁️ Preview Form</button>
          </div>
        ))}
      </div>
    </div>
  )
}
