import React from 'react'

export default function ValidationRuleEditor({ rule, onUpdate, onRemove }: { rule: any, onUpdate: (u:any)=>void, onRemove: ()=>void }) {
  const validationTypes = [
    { value: 'required', label: 'Required' },
    { value: 'minLength', label: 'Min Length' },
    { value: 'maxLength', label: 'Max Length' },
    { value: 'email', label: 'Email Format' },
    { value: 'password', label: 'Password Strength' }
  ]
  return (
    <div className="card">
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Validation Type</label>
          <select className="form-input" value={rule.type} onChange={(e)=>onUpdate({ type: e.target.value })}>
            {validationTypes.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
          </select>
        </div>
        {['minLength','maxLength'].includes(rule.type) && (
          <div className="form-group">
            <label className="form-label">Value</label>
            <input className="form-input" type="number" value={rule.value || ''} onChange={(e)=>onUpdate({ value: parseInt(e.target.value) })} />
          </div>
        )}
      </div>
      <div className="form-group">
        <label className="form-label">Error Message</label>
        <input className="form-input" value={rule.message || ''} onChange={(e)=>onUpdate({ message: e.target.value })} placeholder="Custom error message" />
      </div>
      <button className="btn btn-danger btn-small" onClick={onRemove}>Remove Rule</button>
    </div>
  )
}
