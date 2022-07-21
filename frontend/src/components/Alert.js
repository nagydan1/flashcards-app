import React from 'react';

export default function Alert({ success, alertMessage }) {
  return (
    <div className={`alert alert-${success ? 'success' : 'danger'} mt-3`} role="alert">
      {alertMessage}
    </div>
  );
}
