import React, { useEffect } from 'react'
import { SvgIcon } from './SvgIcon'

export function Panel({ className = '', children, ...props }) {
  return <section className={`panel ${className}`} {...props}>{children}</section>
}

export function PanelHead({ children, right }) {
  return (
    <div className="panel-head">
      <h2>{children}</h2>
      {right}
    </div>
  )
}

export function LoadingState({ label }) {
  return (
    <div className="state-card" role="status">
      <span className="spinner" />
      <span>{label}</span>
    </div>
  )
}

export function Logo({ onClick }) {
  return (
    <button
      className="logo-button"
      onClick={onClick}
      aria-label={onClick ? 'Open sidebar' : 'Flowly home'}
    >
      <span className="logo">
        <i />
        <i />
        <i />
      </span>
    </button>
  )
}

export function Modal({ title, children, onClose }) {
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-head">
          <h2 id="modal-title">{title}</h2>
          <button className="icon-button" onClick={onClose} aria-label="Close">
            <SvgIcon name="close" size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
