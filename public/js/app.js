
/**
 * Main application script for ExpiryAlert
 */

// App state
const appState = {
  currentView: 'dashboard',
  medicines: [],
  notifications: [],
  currentUserRole: 'admin'
};

// DOM Elements
const elements = {
  sidebar: document.querySelector('.sidebar'),
  mainContent: document.querySelector('.main-content'),
  navLinks: document.querySelectorAll('.navigation a'),
  pageTitle: document.getElementById('page-title'),
  views: document.querySelectorAll('.view'),
  userRoleSelect: document.getElementById('user-role'),
  notificationBadge: document.getElementById('notification-badge'),
  searchInput: document.getElementById('search-input'),
  searchButton: document.getElementById('search-button'),
  alertsContainer: document.getElementById('alerts-container'),
  modalCloseButton: document.querySelector('.close')
};

// Initialize application
async function initApp() {
  try {
    // Set up event listeners
    setupEventListeners();
    
    // Update UI based on initial role
    updateUIBasedOnPermissions();
    
    // Load data and update UI
    await loadDashboard();
    await checkExpiringMedicines();
    
    // Initialize medicine inventory module
    initInventoryModule();
    
    // Initialize reports module
    initReportsModule();
    
    // Initialize barcode module
    initBarcodeModule();
    
    console.log('ExpiryAlert initialized successfully');
  } catch (error) {
    console.error('Error initializing application:', error);
    showToast('error', 'Initialization Error', 'Failed to load application data.');
  }
}

// Setup event listeners
function setupEventListeners() {
  // Navigation links
  elements.navLinks.forEach(link => {
    link.addEventListener('click', handleNavigation);
  });
  
  // User role selection
  elements.userRoleSelect.addEventListener('change', handleRoleChange);
  
  // Search functionality
  elements.searchButton.addEventListener('click', handleSearch);
  elements.searchInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') handleSearch();
  });
  
  // Modal close button
  elements.modalCloseButton.addEventListener('click', closeModal);
  window.addEventListener('click', e => {
    if (e.target === document.getElementById('modal')) {
      closeModal();
    }
  });
}

// Handle navigation between views
function handleNavigation(e) {
  e.preventDefault();
  
  const viewId = e.currentTarget.getAttribute('data-view');
  
  // Check if navigation to add-medicine, and user doesn't have permission
  if (viewId === 'add-medicine' && !hasPermission('add')) {
    showToast('error', 'Access Denied', 'You do not have permission to add medicines.');
    return;
  }
  
  // Update active link
  elements.navLinks.forEach(link => {
    link.classList.remove('active');
  });
  e.currentTarget.classList.add('active');
  
  // Update visible view
  elements.views.forEach(view => {
    view.classList.remove('active');
  });
  document.getElementById(viewId).classList.add('active');
  
  // Update page title
  elements.pageTitle.textContent = e.currentTarget.textContent.trim();
  
  // Update app state
  appState.currentView = viewId;
  
  // Special actions for specific views
  if (viewId === 'inventory') {
    loadInventory();
  } else if (viewId === 'reports') {
    loadReports();
  } else if (viewId === 'add-medicine') {
    resetMedicineForm();
  } else if (viewId === 'dashboard') {
    loadDashboard();
  }
}

// Handle role change
function handleRoleChange(e) {
  appState.currentUserRole = e.target.value;
  updateUIBasedOnPermissions();
  showToast('info', 'Role Changed', `You are now viewing as ${appState.currentUserRole}`);
}

// Handle search
function handleSearch() {
  const searchTerm = elements.searchInput.value.trim().toLowerCase();
  if (!searchTerm) return;
  
  // Navigate to inventory view if not already there
  if (appState.currentView !== 'inventory') {
    const inventoryLink = document.querySelector('a[data-view="inventory"]');
    if (inventoryLink) {
      inventoryLink.click();
    }
  }
  
  // Filter inventory by search term
  filterInventory(searchTerm);
}

// Check for expiring medicines and show notifications
async function checkExpiringMedicines() {
  try {
    const today = new Date();
    
    // Get medicines expiring within 30 days
    const expiringSoon = await API.medicines.getByStatus('expiring-soon');
    const expired = await API.medicines.getByStatus('expired');
    
    // Update notification badge
    const count = expiringSoon.length + expired.length;
    elements.notificationBadge.textContent = count;
    
    // Display alerts
    elements.alertsContainer.innerHTML = '';
    
    // Show expired alert if any
    if (expired.length > 0) {
      const alertHtml = `
        <div class="alert alert-danger">
          <div class="alert-icon">
            <i class="fas fa-exclamation-circle"></i>
          </div>
          <div class="alert-content">
            <h4>Critical: ${expired.length} Expired Medicines</h4>
            <p>There are ${expired.length} medicines that have expired. Please review and take action.</p>
          </div>
        </div>
      `;
      elements.alertsContainer.innerHTML += alertHtml;
      
      // Simulate email alert to admin
      sendEmailAlert(
        'CRITICAL: Expired Medicines Alert',
        `There are ${expired.length} expired medicines in inventory that require immediate attention.`
      );
    }
    
    // Show expiring soon alert if any
    if (expiringSoon.length > 0) {
      const expiringThisWeek = expiringSoon.filter(med => {
        const expiryDate = new Date(med.expiryDate);
        const diffTime = expiryDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      });
      
      if (expiringThisWeek.length > 0) {
        const alertHtml = `
          <div class="alert alert-warning">
            <div class="alert-icon">
              <i class="fas fa-clock"></i>
            </div>
            <div class="alert-content">
              <h4>Warning: ${expiringThisWeek.length} Medicines Expiring This Week</h4>
              <p>There are ${expiringThisWeek.length} medicines that will expire within the next 7 days.</p>
            </div>
          </div>
        `;
        elements.alertsContainer.innerHTML += alertHtml;
        
        // Simulate email alert to staff
        sendEmailAlert(
          'Weekly Expiry Alert',
          `There are ${expiringThisWeek.length} medicines expiring in the next 7 days.`
        );
      }
    }
    
    return { expired, expiringSoon };
  } catch (error) {
    console.error('Error checking expiring medicines:', error);
    showToast('error', 'Error', 'Failed to check for expiring medicines');
    return { expired: [], expiringSoon: [] };
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
