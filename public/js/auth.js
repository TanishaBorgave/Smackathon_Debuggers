// Authentication Utility Functions
class Auth {
    constructor() {
        this.token = localStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user'));
        this.isAuthenticated = !!this.token;
    }

    // Login user
    async login(credentials) {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();

            if (response.ok) {
                this.setAuth(data.token, data.user);
                return { success: true, data };
            } else {
                return { success: false, error: data.message || 'Login failed' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Network error. Please try again.' };
        }
    }

    // Register user
    async register(userData) {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (response.ok) {
                // Auto-login after successful registration
                if (data.token) {
                    this.setAuth(data.token, data.user);
                }
                return { success: true, data };
            } else {
                return { success: false, error: data.message || 'Registration failed' };
            }
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: 'Network error. Please try again.' };
        }
    }

    // Logout user
    logout() {
        this.clearAuth();
        window.location.hash = '#home';
        
        // Show logout message
        if (window.app && window.app.showToast) {
            window.app.showToast('Logged out successfully', 'success');
        }
    }

    // Set authentication data
    setAuth(token, user) {
        this.token = token;
        this.user = user;
        this.isAuthenticated = true;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Update navigation
        if (window.app && window.app.updateNavigation) {
            window.app.updateNavigation(true);
        }
    }

    // Clear authentication data
    clearAuth() {
        this.token = null;
        this.user = null;
        this.isAuthenticated = false;
        
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Update navigation
        if (window.app && window.app.updateNavigation) {
            window.app.updateNavigation(false);
        }
    }

    // Get current user
    getCurrentUser() {
        return this.user;
    }

    // Check if user is authenticated
    isUserAuthenticated() {
        return this.isAuthenticated && !!this.token;
    }

    // Get user role
    getUserRole() {
        return this.user?.role || 'guest';
    }

    // Check if user has specific role
    hasRole(role) {
        return this.getUserRole() === role;
    }

    // Check if user is admin
    isAdmin() {
        return this.hasRole('admin');
    }

    // Check if user is donor
    isDonor() {
        return this.hasRole('donor');
    }

    // Check if user is hospital staff
    isHospital() {
        return this.hasRole('hospital');
    }

    // Validate token
    async validateToken() {
        if (!this.token) {
            return false;
        }

        try {
            const response = await fetch('/api/auth/profile', {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.user = data.user;
                localStorage.setItem('user', JSON.stringify(data.user));
                return true;
            } else {
                this.clearAuth();
                return false;
            }
        } catch (error) {
            console.error('Token validation error:', error);
            this.clearAuth();
            return false;
        }
    }

    // Refresh token (if needed in future)
    async refreshToken() {
        // Implementation for token refresh if needed
        console.log('Token refresh not implemented yet');
        return false;
    }

    // Check authentication status on page load
    async checkAuthStatus() {
        if (this.token) {
            const isValid = await this.validateToken();
            if (!isValid) {
                this.clearAuth();
            }
        }
        
        return this.isUserAuthenticated();
    }

    // Require authentication for protected routes
    requireAuth(redirectTo = '#login') {
        if (!this.isUserAuthenticated()) {
            window.location.hash = redirectTo;
            if (window.app && window.app.showToast) {
                window.app.showToast('Please login to access this page', 'warning');
            }
            return false;
        }
        return true;
    }

    // Require specific role for protected routes
    requireRole(role, redirectTo = '#home') {
        if (!this.isUserAuthenticated()) {
            this.requireAuth();
            return false;
        }

        if (!this.hasRole(role)) {
            window.location.hash = redirectTo;
            if (window.app && window.app.showToast) {
                window.app.showToast('Access denied. Insufficient permissions.', 'error');
            }
            return false;
        }

        return true;
    }

    // Get authorization header
    getAuthHeader() {
        return this.token ? { 'Authorization': `Bearer ${this.token}` } : {};
    }

    // Update user profile
    async updateProfile(updates) {
        try {
            const response = await fetch('/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeader()
                },
                body: JSON.stringify(updates)
            });

            const data = await response.json();

            if (response.ok) {
                // Update local user data
                this.user = { ...this.user, ...updates };
                localStorage.setItem('user', JSON.stringify(this.user));
                return { success: true, data };
            } else {
                return { success: false, error: data.message || 'Profile update failed' };
            }
        } catch (error) {
            console.error('Profile update error:', error);
            return { success: false, error: 'Network error. Please try again.' };
        }
    }

    // Change password
    async changePassword(currentPassword, newPassword) {
        try {
            const response = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeader()
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, data };
            } else {
                return { success: false, error: data.message || 'Password change failed' };
            }
        } catch (error) {
            console.error('Password change error:', error);
            return { success: false, error: 'Network error. Please try again.' };
        }
    }

    // Forgot password
    async forgotPassword(email) {
        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, data };
            } else {
                return { success: false, error: data.message || 'Password reset failed' };
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            return { success: false, error: 'Network error. Please try again.' };
        }
    }

    // Reset password
    async resetPassword(token, newPassword) {
        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token,
                    newPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, data };
            } else {
                return { success: false, error: data.message || 'Password reset failed' };
            }
        } catch (error) {
            console.error('Reset password error:', error);
            return { success: false, error: 'Network error. Please try again.' };
        }
    }

    // Auto-login if token exists
    async autoLogin() {
        if (this.token) {
            const isValid = await this.validateToken();
            if (isValid) {
                return true;
            }
        }
        return false;
    }

    // Get user permissions
    getUserPermissions() {
        const role = this.getUserRole();
        const permissions = {
            guest: [],
            donor: ['view_profile', 'edit_profile', 'submit_requests', 'view_requests'],
            hospital: ['view_stock', 'manage_stock', 'view_requests', 'fulfill_requests'],
            admin: ['all']
        };

        return permissions[role] || [];
    }

    // Check if user has specific permission
    hasPermission(permission) {
        const permissions = this.getUserPermissions();
        return permissions.includes('all') || permissions.includes(permission);
    }

    // Session timeout handling
    setupSessionTimeout(timeoutMinutes = 60) {
        if (this.sessionTimeoutId) {
            clearTimeout(this.sessionTimeoutId);
        }

        this.sessionTimeoutId = setTimeout(() => {
            this.showSessionTimeoutWarning();
        }, timeoutMinutes * 60 * 1000);
    }

    // Show session timeout warning
    showSessionTimeoutWarning() {
        if (window.app && window.app.showToast) {
            window.app.showToast('Your session will expire soon. Please save your work.', 'warning');
        }
    }

    // Extend session
    extendSession() {
        this.setupSessionTimeout();
    }

    // Clear session timeout
    clearSessionTimeout() {
        if (this.sessionTimeoutId) {
            clearTimeout(this.sessionTimeoutId);
            this.sessionTimeoutId = null;
        }
    }
}

// Create global auth instance
window.auth = new Auth();

// Initialize authentication on page load
document.addEventListener('DOMContentLoaded', async () => {
    await window.auth.checkAuthStatus();
});

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Auth;
}
