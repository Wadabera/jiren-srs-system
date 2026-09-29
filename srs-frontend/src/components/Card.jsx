import React from 'react';

export default function Card({ children, className = '', title, ...props }) {
  return (
    <div className={`card ${className}`.trim()} {...props}>
      {title && <h2 className="card-title" style={{ marginBottom: '20px' }}>{title}</h2>}
      {children}
    </div>
  );
}
