import React, { useState } from 'react'

export default function SaveDialog({ onSave, onClose }: { onSave: (name:string)=>void, onClose: ()=>void }) {
  const [formName, setFormName] = useState('')
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formName.trim()) { onSave(formName.trim()); setFormName('') }
  }
  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">💾 Save Form</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Form Name</label>
            <input className="form-input" value={formName} onChange={(e)=>setFormName(e.target.value)} placeholder="Enter a name for your form" autoFocus />
          </div>
          <div className="flex gap-1">
            <button type="submit" className="btn" disabled={!formName.trim()}>💾 Save</button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
