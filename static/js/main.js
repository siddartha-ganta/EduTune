// Main JavaScript for EduTune Application

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApplication();
});

// Initialize all application components
function initializeApplication() {
    initializeFormValidation();
    initializeFileUpload();
    initializeTooltips();
    initializeTabs();
    initializeCharts();
}

// Form validation and enhancement
function initializeFormValidation() {
    // Add custom validation for numeric inputs
    const numericInputs = document.querySelectorAll('input[type="number"]');
    numericInputs.forEach(input => {
        input.addEventListener('input', function() {
            validateNumericInput(this);
        });
    });

    // Add form submission handlers
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
                showAlert('Please fill in all required fields correctly.', 'danger');
            } else {
                showLoadingState(this);
            }
        });
    });
}

// Validate numeric input based on constraints
function validateNumericInput(input) {
    const value = parseFloat(input.value);
    const min = parseFloat(input.getAttribute('min'));
    const max = parseFloat(input.getAttribute('max'));
    
    // Remove any existing validation classes
    input.classList.remove('is-valid', 'is-invalid');
    
    if (isNaN(value)) {
        return;
    }
    
    if ((min !== null && value < min) || (max !== null && value > max)) {
        input.classList.add('is-invalid');
        showFieldError(input, `Value must be between ${min || 'any'} and ${max || 'any'}`);
    } else {
        input.classList.add('is-valid');
        hideFieldError(input);
    }
}

// Show field-specific error message
function showFieldError(input, message) {
    let errorDiv = input.parentNode.querySelector('.invalid-feedback');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        input.parentNode.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
}

// Hide field-specific error message
function hideFieldError(input) {
    const errorDiv = input.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Validate entire form
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('is-invalid');
            isValid = false;
        } else {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
        }
    });
    
    return isValid;
}

// File upload enhancement
function initializeFileUpload() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            handleFileSelection(this);
        });
        
        // Add drag and drop functionality
        const parentDiv = input.closest('.mb-3, .mb-4');
        if (parentDiv) {
            addDragDropToElement(parentDiv, input);
        }
    });
}

// Handle file selection and validation
function handleFileSelection(input) {
    const file = input.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
        showAlert('Please select a CSV file.', 'danger');
        input.value = '';
        return;
    }
    
    // Validate file size (16MB max)
    const maxSize = 16 * 1024 * 1024;
    if (file.size > maxSize) {
        showAlert('File size must be less than 16MB.', 'danger');
        input.value = '';
        return;
    }
    
    // Show file info
    showFileInfo(input, file);
}

// Show file information
function showFileInfo(input, file) {
    let infoDiv = input.parentNode.querySelector('.file-info');
    if (!infoDiv) {
        infoDiv = document.createElement('div');
        infoDiv.className = 'file-info small text-muted mt-2';
        input.parentNode.appendChild(infoDiv);
    }
    
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    infoDiv.innerHTML = `
        <i class="fas fa-file-csv text-success me-1"></i>
        <strong>${file.name}</strong> (${sizeInMB} MB)
    `;
}

// Add drag and drop functionality
function addDragDropToElement(element, input) {
    element.style.position = 'relative';
    
    element.addEventListener('dragover', function(e) {
        e.preventDefault();
        element.classList.add('bg-light', 'border-primary');
    });
    
    element.addEventListener('dragleave', function(e) {
        e.preventDefault();
        element.classList.remove('bg-light', 'border-primary');
    });
    
    element.addEventListener('drop', function(e) {
        e.preventDefault();
        element.classList.remove('bg-light', 'border-primary');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            input.files = files;
            handleFileSelection(input);
        }
    });
}

// Initialize Bootstrap tooltips
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Initialize tab functionality
function initializeTabs() {
    const tabLinks = document.querySelectorAll('[data-bs-toggle="tab"]');
    tabLinks.forEach(tab => {
        tab.addEventListener('shown.bs.tab', function(e) {
            // Store active tab in localStorage
            localStorage.setItem('activeTab', e.target.getAttribute('data-bs-target'));
        });
    });
    
    // Restore active tab from localStorage
    const activeTab = localStorage.getItem('activeTab');
    if (activeTab) {
        const tabTrigger = document.querySelector(`[data-bs-target="${activeTab}"]`);
        if (tabTrigger) {
            const tab = new bootstrap.Tab(tabTrigger);
            tab.show();
        }
    }
}

// Initialize charts and visualizations
function initializeCharts() {
    // Add smooth scrolling to anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Show loading state for forms
function showLoadingState(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
        
        // Store original text for restoration
        submitBtn.setAttribute('data-original-text', originalText);
        
        // Restore button state after 30 seconds (timeout)
        setTimeout(() => {
            restoreButtonState(submitBtn);
        }, 30000);
    }
}

// Restore button to original state
function restoreButtonState(button) {
    const originalText = button.getAttribute('data-original-text');
    if (originalText) {
        button.innerHTML = originalText;
        button.disabled = false;
        button.removeAttribute('data-original-text');
    }
}

// Show alert messages
function showAlert(message, type = 'info') {
    const alertContainer = document.createElement('div');
    alertContainer.className = `alert alert-${type} alert-dismissible fade show`;
    alertContainer.innerHTML = `
        <i class="fas fa-${getAlertIcon(type)} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Insert alert at the top of the main container
    const mainContainer = document.querySelector('main.container');
    if (mainContainer) {
        mainContainer.insertBefore(alertContainer, mainContainer.firstChild);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            if (alertContainer.parentNode) {
                alertContainer.remove();
            }
        }, 5000);
    }
}

// Get appropriate icon for alert type
function getAlertIcon(type) {
    const icons = {
        'success': 'check-circle',
        'danger': 'exclamation-triangle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Utility function to format numbers
function formatNumber(num, decimals = 2) {
    return Number(num).toFixed(decimals);
}

// Utility function to copy text to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showAlert('Copied to clipboard!', 'success');
    }).catch(() => {
        showAlert('Failed to copy to clipboard.', 'danger');
    });
}

// Add copy functionality to code blocks or results
function addCopyButtons() {
    const codeBlocks = document.querySelectorAll('pre, .copy-target');
    codeBlocks.forEach(block => {
        const copyBtn = document.createElement('button');
        copyBtn.className = 'btn btn-sm btn-outline-secondary copy-btn';
        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
        copyBtn.onclick = () => copyToClipboard(block.textContent);
        
        block.style.position = 'relative';
        block.appendChild(copyBtn);
    });
}

// Initialize performance monitoring
function initializePerformanceMonitoring() {
    // Monitor page load time
    window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Page load time: ${loadTime}ms`);
    });
    
    // Monitor API response times (if applicable)
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const start = performance.now();
        return originalFetch.apply(this, args).then(response => {
            const end = performance.now();
            console.log(`API call took ${end - start}ms`);
            return response;
        });
    };
}

// Error handling for unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    showAlert('An unexpected error occurred. Please try again.', 'danger');
});

// Error handling for general JavaScript errors
window.addEventListener('error', function(event) {
    console.error('JavaScript error:', event.error);
    showAlert('An unexpected error occurred. Please refresh the page.', 'danger');
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateNumericInput,
        validateForm,
        formatNumber,
        showAlert
    };
}
