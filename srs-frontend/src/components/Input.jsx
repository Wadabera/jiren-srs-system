import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, id, error, className = '', type = 'text', options, ...props }, ref) => {
  const commonProps = {
    id,
    ref,
    className: `form-control ${error ? 'is-invalid' : ''} ${className}`.trim(),
    ...props
  };

  let Element = 'input';
  if (type === 'textarea') Element = 'textarea';
  if (type === 'select') Element = 'select';

  return (
    <div className="form-group">
      {label && <label htmlFor={id} className="form-label">{label}</label>}
      
      {type === 'select' ? (
        <select {...commonProps}>
          {options?.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea {...commonProps} />
      ) : (
        <input type={type} {...commonProps} />
      )}
      
      {error && <span className="error-text" style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '5px', display: 'block', fontWeight: 600 }}>{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
