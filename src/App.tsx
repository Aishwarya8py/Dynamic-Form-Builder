import React, { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import FormBuilder from '@/components/FormBuilder'
import FormPreview from '@/components/FormPreview'
import MyForms from '@/components/MyForms'
import SaveDialog from '@/components/SaveDialog'
import type { Form } from '@/types/form.types'

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<'create'|'preview'|'myforms'>('create')
  const [currentForm, setCurrentForm] = useState<Form|null>(null)
  const [savedForms, setSavedForms] = useState<Form[]>([])
  const [showSaveDialog, setShowSaveDialog] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('formBuilderForms')
    if (saved) {
      try { setSavedForms(JSON.parse(saved)) } catch {}
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('formBuilderForms', JSON.stringify(savedForms))
  }, [savedForms])

  const createNewForm = () => {
    setCurrentForm({
      id: Date.now().toString(),
      name: 'Untitled Form',
      fields: [],
      createdAt: new Date().toISOString()
    })
  }

  const addField = (fieldData: any) => {
    setCurrentForm(prev => {
      const base = prev ?? {
        id: Date.now().toString(),
        name: 'Untitled Form',
        fields: [],
        createdAt: new Date().toISOString()
      }
      const newField = {
        ...fieldData,
        id: Date.now().toString(),
        order: base.fields.length || 0
      }
      return { ...base, fields: [...base.fields, newField] }
    })
  }

  const updateField = (fieldId: string, updates: any) => {
    setCurrentForm(prev => prev ? ({
      ...prev,
      fields: prev.fields.map(f => f.id === fieldId ? { ...f, ...updates } : f)
    }) : prev)
  }

  const deleteField = (fieldId: string) => {
    setCurrentForm(prev => prev ? ({ ...prev, fields: prev.fields.filter(f => f.id !== fieldId) }) : prev)
  }

  const moveField = (fieldId: string, direction: 'up'|'down') => {
    setCurrentForm(prev => {
      if (!prev) return prev
      const fields = [...prev.fields]
      const index = fields.findIndex(f => f.id === fieldId)
      if (direction === 'up' && index > 0) [fields[index], fields[index-1]] = [fields[index-1], fields[index]]
      if (direction === 'down' && index < fields.length - 1) [fields[index], fields[index+1]] = [fields[index+1], fields[index]]
      fields.forEach((f, i) => f.order = i)
      return { ...prev, fields }
    })
  }

  const saveForm = (formName: string) => {
    if (!currentForm || !formName.trim()) return
    const formToSave: Form = { ...currentForm, name: formName, createdAt: new Date().toISOString() }
    setSavedForms(prev => [...prev, formToSave])
    setCurrentForm(formToSave)
    setShowSaveDialog(false)
  }

  const loadForm = (formId: string) => {
    const form = savedForms.find(f => f.id === formId)
    if (form) { setCurrentForm(form); setCurrentRoute('preview') }
  }

  return (
    <div className="app-container">
      <Navbar currentRoute={currentRoute} onNavigate={setCurrentRoute} />
      <div className="main-content">
        {currentRoute === 'create' && (
          <FormBuilder
            currentForm={currentForm}
            onCreateNew={createNewForm}
            onAddField={addField}
            onUpdateField={updateField}
            onDeleteField={deleteField}
            onMoveField={moveField}
            onSave={() => setShowSaveDialog(true)}
          />
        )}
        {currentRoute === 'preview' && <FormPreview currentForm={currentForm} />}
        {currentRoute === 'myforms' && <MyForms savedForms={savedForms} onLoadForm={loadForm} onNavigate={setCurrentRoute} />}
      </div>
      {showSaveDialog && <SaveDialog onSave={saveForm} onClose={() => setShowSaveDialog(false)} />}
    </div>
  )
}
