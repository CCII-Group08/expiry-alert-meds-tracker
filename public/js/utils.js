
/**
 * Utility functions for the ExpiryAlert application
 */

// Format date to YYYY-MM-DD
function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

// Format date to readable format (e.g., Jan 1, 2023)
function formatReadableDate(date) {
  if (!date) return '';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
}

// Calculate days between two dates
function daysBetweenDates(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Calculate days until expiry (negative for expired)
function daysUntilExpiry(expiryDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Get expiry status based on days until expiry
function getExpiryStatus(expiryDate) {
  const days = daysUntilExpiry(expiryDate);
  if (days < 0) {
    return 'expired';
  } else if (days <= 30) {
    return 'expiring-soon';
  } else {
    return 'safe';
  }
}

// Create a toast notification
function showToast(type, title, message, duration = 3000) {
  const toastContainer = document.getElementById('toast-container');
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconClass = 'fa-info-circle';
  if (type === 'success') iconClass = 'fa-check-circle';
  if (type === 'error') iconClass = 'fa-exclamation-circle';
  if (type === 'warning') iconClass = 'fa-exclamation-triangle';
  
  toast.innerHTML = `
    <div class="toast-icon">
      <i class="fas ${iconClass}"></i>
    </div>
    <div class="toast-content">
      <h4>${title}</h4>
      <p>${message}</p>
    </div>
  `;
  
  toastContainer.appendChild(toast);
  
  // Remove toast after duration
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      toastContainer.removeChild(toast);
    }, 500);
  }, duration);
}

// Show loading spinner
function showLoading(container, message = 'Loading...') {
  const loadingElement = document.createElement('div');
  loadingElement.className = 'loading-spinner';
  loadingElement.innerHTML = `
    <div class="spinner"></div>
    <p>${message}</p>
  `;
  container.appendChild(loadingElement);
  return loadingElement;
}

// Hide loading spinner
function hideLoading(loadingElement) {
  if (loadingElement && loadingElement.parentNode) {
    loadingElement.parentNode.removeChild(loadingElement);
  }
}

// Simulate email alert (as per requirements, just console log)
function sendEmailAlert(subject, message, recipient = 'admin@example.com') {
  console.log(`EMAIL ALERT to ${recipient}:`);
  console.log(`Subject: ${subject}`);
  console.log(`Message: ${message}`);
  
  // In a real application, this would make an API call to a backend
  // email service, but for this simulation we just log to console.
  return true;
}

// Open modal
function openModal(title, content, actions) {
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const modalFooter = document.getElementById('modal-footer');
  
  modalTitle.textContent = title;
  modalBody.innerHTML = content;
  
  // Clear any previous footer content
  modalFooter.innerHTML = '';
  
  // Add action buttons if provided
  if (actions && Array.isArray(actions)) {
    actions.forEach(action => {
      const button = document.createElement('button');
      button.className = action.class || 'secondary-button';
      button.textContent = action.text;
      button.onclick = action.onClick;
      modalFooter.appendChild(button);
    });
  }
  
  modal.style.display = 'block';
}

// Close modal
function closeModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';
}

// Get current user role from dropdown
function getCurrentUserRole() {
  const roleSelect = document.getElementById('user-role');
  return roleSelect ? roleSelect.value : 'viewer';
}

// Check if user has permission for an action
function hasPermission(action) {
  const role = getCurrentUserRole();
  
  // Permission matrix
  const permissions = {
    admin: ['view', 'add', 'edit', 'delete', 'manage_users', 'export'],
    pharmacist: ['view', 'add', 'edit', 'export'],
    viewer: ['view', 'export']
  };
  
  return permissions[role] && permissions[role].includes(action);
}

// Update UI based on permissions
function updateUIBasedOnPermissions() {
  const role = getCurrentUserRole();
  
  // Hide add/edit buttons for viewers
  if (role === 'viewer') {
    document.querySelectorAll('.admin-only, .edit-button, .delete-button').forEach(el => {
      el.style.display = 'none';
    });
    
    // Disable form inputs
    document.querySelectorAll('input, select, textarea').forEach(el => {
      el.disabled = true;
    });
    
    // Hide add medicine menu item
    const addMedicineLink = document.querySelector('a[data-view="add-medicine"]');
    if (addMedicineLink && addMedicineLink.parentElement) {
      addMedicineLink.parentElement.style.display = 'none';
    }
  } else {
    document.querySelectorAll('.admin-only').forEach(el => {
      el.style.display = role === 'admin' ? 'block' : 'none';
    });
    
    document.querySelectorAll('.edit-button, .delete-button').forEach(el => {
      if (role === 'pharmacist') {
        el.style.display = el.classList.contains('delete-button') ? 'none' : 'flex';
      } else {
        el.style.display = 'flex';
      }
    });
    
    // Enable form inputs
    document.querySelectorAll('input, select, textarea').forEach(el => {
      el.disabled = false;
    });
    
    // Show add medicine menu item
    const addMedicineLink = document.querySelector('a[data-view="add-medicine"]');
    if (addMedicineLink && addMedicineLink.parentElement) {
      addMedicineLink.parentElement.style.display = 'list-item';
    }
  }
}
