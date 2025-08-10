import React from 'react'

export default function Navbar({ currentRoute, onNavigate }: { currentRoute: string, onNavigate: (r: any)=>void }) {
  return (
    <div className="navbar">
      <div className="navbar-content">
        <h1>🚀 Dynamic Form Builder</h1>
        <div className="nav-buttons">
          <button className={`nav-btn ${currentRoute === 'create' ? 'active' : ''}`} onClick={() => onNavigate('create')}>✏️ Create</button>
          <button className={`nav-btn ${currentRoute === 'preview' ? 'active' : ''}`} onClick={() => onNavigate('preview')}>👁️ Preview</button>
          <button className={`nav-btn ${currentRoute === 'myforms' ? 'active' : ''}`} onClick={() => onNavigate('myforms')}>📋 My Forms</button>
        </div>
      </div>
    </div>
  )
}
