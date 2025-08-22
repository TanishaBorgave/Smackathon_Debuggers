// Main Application Logic
class LifeLinkApp {
    constructor() {
        this.currentSection = 'home';
        this.bloodStock = [];
        this.recentRequests = [];
        this.recentDonations = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadInitialData();
        this.setupMobileNavigation();
    }

    setupEventListeners() {
        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('href').substring(1);
                this.showSection(section);
            });
        });

        // Dashboard tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchTab(btn.dataset.tab);
            });
        });

        // Form submissions
        this.setupFormSubmissions();

        // Hash change for navigation
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.substring(1) || 'home';
            this.showSection(hash);
        });

        // Initial section from hash
        const hash = window.location.hash.substring(1) || 'home';
        this.showSection(hash);
    }

    setupMobileNavigation() {
        const navToggle = document.getElementById('navToggle');
        const navMobile = document.getElementById('navMobile');

        if (navToggle && navMobile) {
            navToggle.addEventListener('click', () => {
                navMobile.classList.toggle('show');
            });

            // Close mobile menu when clicking on a link
            navMobile.querySelectorAll('.nav-link, .btn').forEach(item => {
                item.addEventListener('click', () => {
                    navMobile.classList.remove('show');
                });
            });
        }
    }

    setupFormSubmissions() {
        // Donor registration form
        const donateForm = document.getElementById('donateForm');
        if (donateForm) {
            donateForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleDonorRegistration();
            });
        }

        // Blood request form
        const requestForm = document.getElementById('requestForm');
        if (requestForm) {
            requestForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleBloodRequest();
            });
        }

        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionName;
        }

        // Update navigation active state
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionName}`) {
                link.classList.add('active');
            }
        });

        // Update URL hash
        window.location.hash = sectionName;

        // Load section-specific data
        this.loadSectionData(sectionName);
    }

    switchTab(tabName) {
        // Update tab button states
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector('.tab-btn[data-tab="' + tabName + '"]').classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName + 'Tab').classList.add('active');
    }

    loadSectionData(sectionName) {
        switch (sectionName) {
            case 'home':
                this.loadBloodStock();
                break;
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'profile':
                this.loadProfile();
                break;
        }
    }

    async loadInitialData() {
        try {
            await this.loadBloodStock();
            await this.loadDashboard();
        } catch (error) {
            console.error('Error loading initial data:', error);
        }
    }

    async loadBloodStock() {
        try {
            // For demo purposes, using mock data
            // In production, this would come from the API
            this.bloodStock = [
                { bloodType: "A+", units: 45, maxUnits: 100, urgency: "medium", expirationDays: 12 },
                { bloodType: "A-", units: 20, maxUnits: 100, urgency: "high", expirationDays: 8 },
                { bloodType: "B+", units: 65, maxUnits: 100, urgency: "low", expirationDays: 18 },
                { bloodType: "B-", units: 15, maxUnits: 100, urgency: "high", expirationDays: 5 },
                { bloodType: "AB+", units: 30, maxUnits: 100, urgency: "medium", expirationDays: 10 },
                { bloodType: "AB-", units: 12, maxUnits: 100, urgency: "high", expirationDays: 7 },
                { bloodType: "O+", units: 80, maxUnits: 100, urgency: "low", expirationDays: 20 },
                { bloodType: "O-", units: 25, maxUnits: 100, urgency: "medium", expirationDays: 14 }
            ];

            this.renderBloodStock();
        } catch (error) {
            console.error('Error loading blood stock:', error);
            this.showToast('Error loading blood stock data', 'error');
        }
    }

    renderBloodStock() {
        const homeGrid = document.getElementById('bloodStockGrid');
        const dashboardGrid = document.getElementById('dashboardBloodStock');

        if (homeGrid) {
            homeGrid.innerHTML = this.bloodStock.map(stock => this.createBloodStockCard(stock)).join('');
        }

        if (dashboardGrid) {
            dashboardGrid.innerHTML = this.bloodStock.map(stock => this.createBloodStockCard(stock)).join('');
        }

        // Render low stock alerts
        this.renderLowStockAlerts();
    }

    createBloodStockCard(stock) {
        const urgencyClass = `urgency-${stock.urgency}`;
        const urgencyText = stock.urgency.charAt(0).toUpperCase() + stock.urgency.slice(1);
        
        return `
            <div class="blood-stock-card ${urgencyClass}">
                <div class="blood-type">${stock.bloodType}</div>
                <div class="units-info">
                    <div class="current-units">${stock.units}</div>
                    <div class="max-units">/ ${stock.maxUnits} units</div>
                </div>
                <div class="urgency-badge ${stock.urgency}">${urgencyText}</div>
                <div class="expiration-info">
                    Expires in ${stock.expirationDays} days
                </div>
            </div>
        `;
    }

    renderLowStockAlerts() {
        const alertsContainer = document.getElementById('lowStockAlerts');
        if (!alertsContainer) return;

        const lowStockItems = this.bloodStock.filter(stock => stock.urgency === 'high');
        
        if (lowStockItems.length === 0) {
            alertsContainer.innerHTML = '<p class="text-center text-muted">No low stock alerts at this time.</p>';
            return;
        }

        alertsContainer.innerHTML = lowStockItems.map(stock => `
            <div class="low-stock-alert">
                <div class="low-stock-info">
                    <span class="badge danger">${stock.bloodType}</span>
                    <div>
                        <div class="font-medium">Only ${stock.units} units available</div>
                        <div class="text-sm text-muted">${stock.expirationDays} days until expiry</div>
                    </div>
                </div>
                <button class="btn btn-outline btn-sm">
                    <i class="fas fa-bell"></i>
                    Send Alert
                </button>
            </div>
        `).join('');
    }

    async loadDashboard() {
        try {
            // Load mock data for dashboard
            this.recentRequests = [
                {
                    id: "REQ-001",
                    bloodType: "O-",
                    units: 3,
                    urgency: "high",
                    hospital: "City General Hospital",
                    status: "Fulfilled",
                    time: "2 hours ago"
                },
                {
                    id: "REQ-002", 
                    bloodType: "A+",
                    units: 2,
                    urgency: "medium",
                    hospital: "Memorial Medical Center",
                    status: "In Progress",
                    time: "4 hours ago"
                },
                {
                    id: "REQ-003",
                    bloodType: "B-",
                    units: 1,
                    urgency: "high",
                    hospital: "Emergency Care Unit",
                    status: "Pending",
                    time: "6 hours ago"
                },
                {
                    id: "REQ-004",
                    bloodType: "AB+",
                    units: 2,
                    urgency: "low",
                    hospital: "St. Mary's Hospital",
                    status: "Fulfilled",
                    time: "1 day ago"
                }
            ];

            this.recentDonations = [
                {
                    id: "DON-001",
                    donorName: "John Smith",
                    bloodType: "O+",
                    units: 1,
                    location: "Downtown Blood Bank",
                    time: "3 hours ago"
                },
                {
                    id: "DON-002",
                    donorName: "Sarah Johnson",
                    bloodType: "B+",
                    units: 1,
                    location: "City Medical Center",
                    time: "5 hours ago"
                },
                {
                    id: "DON-003",
                    donorName: "Mike Wilson",
                    bloodType: "A-",
                    units: 1,
                    location: "Community Health Center",
                    time: "8 hours ago"
                }
            ];

            this.renderDashboard();
        } catch (error) {
            console.error('Error loading dashboard:', error);
            this.showToast('Error loading dashboard data', 'error');
        }
    }

    renderDashboard() {
        this.renderStatsOverview();
        this.renderRequestsTable();
        this.renderDonationsTable();
    }

    renderStatsOverview() {
        const statsContainer = document.getElementById('statsOverview');
        if (!statsContainer) return;

        const stats = [
            {
                title: "Total Units Available",
                value: "287",
                change: "+12%",
                trend: "up",
                icon: "fas fa-tint",
                color: "text-primary"
            },
            {
                title: "Active Requests",
                value: "8",
                change: "-25%",
                trend: "down",
                icon: "fas fa-chart-line",
                color: "text-warning"
            },
            {
                title: "Today's Donations",
                value: "24",
                change: "+18%",
                trend: "up",
                icon: "fas fa-users",
                color: "text-success"
            },
            {
                title: "Low Stock Alerts",
                value: "3",
                change: "0%",
                trend: "stable",
                icon: "fas fa-exclamation-triangle",
                color: "text-danger"
            }
        ];

        statsContainer.innerHTML = stats.map(stat => `
            <div class="stat-card">
                <div class="flex items-center justify-between">
                    <div>
                        <h4>${stat.title}</h4>
                        <div class="value">${stat.value}</div>
                        <div class="change ${stat.trend === 'up' ? 'positive' : stat.trend === 'down' ? 'negative' : ''}">
                            <i class="fas fa-trending-${stat.trend}"></i>
                            ${stat.change}
                        </div>
                    </div>
                    <div class="p-3 rounded-full bg-primary/10">
                        <i class="${stat.icon} h-6 w-6 ${stat.color}"></i>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderRequestsTable() {
        const tableContainer = document.getElementById('requestsTable');
        if (!tableContainer) return;

        tableContainer.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Request ID</th>
                        <th>Blood Type</th>
                        <th>Units</th>
                        <th>Urgency</th>
                        <th>Hospital</th>
                        <th>Status</th>
                        <th>Time</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.recentRequests.map(request => `
                        <tr>
                            <td class="font-mono text-sm">${request.id}</td>
                            <td>
                                <span class="badge outline">${request.bloodType}</span>
                            </td>
                            <td>${request.units}</td>
                            <td>${this.getUrgencyBadge(request.urgency)}</td>
                            <td class="max-w-xs truncate">${request.hospital}</td>
                            <td>${this.getStatusBadge(request.status)}</td>
                            <td class="text-sm text-muted">${request.time}</td>
                            <td>
                                <button class="btn btn-outline btn-sm">
                                    View Details
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    renderDonationsTable() {
        const tableContainer = document.getElementById('donationsTable');
        if (!tableContainer) return;

        tableContainer.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Donation ID</th>
                        <th>Donor Name</th>
                        <th>Blood Type</th>
                        <th>Units</th>
                        <th>Location</th>
                        <th>Time</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.recentDonations.map(donation => `
                        <tr>
                            <td class="font-mono text-sm">${donation.id}</td>
                            <td class="font-medium">${donation.donorName}</td>
                            <td>
                                <span class="badge outline">${donation.bloodType}</span>
                            </td>
                            <td>${donation.units}</td>
                            <td class="max-w-xs truncate">${donation.location}</td>
                            <td class="text-sm text-muted">${donation.time}</td>
                            <td>
                                <button class="btn btn-outline btn-sm">
                                    <i class="fas fa-check-circle"></i>
                                    Approve
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    getStatusBadge(status) {
        switch (status) {
            case "Fulfilled":
                return '<span class="badge success">Fulfilled</span>';
            case "In Progress":
                return '<span class="badge warning">In Progress</span>';
            case "Pending":
                return '<span class="badge danger">Pending</span>';
            default:
                return '<span class="badge outline">' + status + '</span>';
        }
    }

    getUrgencyBadge(urgency) {
        switch (urgency) {
            case "high":
                return '<span class="badge danger">High</span>';
            case "medium":
                return '<span class="badge warning">Medium</span>';
            case "low":
                return '<span class="badge outline">Low</span>';
            default:
                return '<span class="badge outline">' + urgency + '</span>';
        }
    }

    async loadProfile() {
        const profileContainer = document.getElementById('profileContent');
        if (!profileContainer) return;

        // Check if user is authenticated
        if (!authManager.isAuthenticated()) {
            profileContainer.innerHTML = `
                <div class="text-center">
                    <p>Please log in to view your profile.</p>
                    <button class="btn btn-primary" onclick="app.showSection('login')">
                        Login
                    </button>
                </div>
            `;
            return;
        }

        try {
            // Load user profile data
            const user = authManager.getCurrentUser();
            profileContainer.innerHTML = `
                <div class="profile-info">
                    <h3>Welcome, ${user.name}!</h3>
                    <p>Email: ${user.email}</p>
                    <p>Role: ${user.role}</p>
                </div>
            `;
        } catch (error) {
            console.error('Error loading profile:', error);
            this.showToast('Error loading profile', 'error');
        }
    }

    async handleDonorRegistration() {
        const form = document.getElementById('donateForm');
        const formData = new FormData(form);
        
        try {
            // Validate form data
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                bloodType: formData.get('bloodType'),
                age: formData.get('age'),
                weight: formData.get('weight'),
                gender: formData.get('gender'),
                address: formData.get('address'),
                medicalHistory: formData.get('medicalHistory'),
                lastDonation: formData.get('lastDonation')
            };

            // Basic validation
            if (!data.name || !data.email || !data.bloodType || !data.age || !data.weight || !data.gender) {
                this.showToast('Please fill in all required fields', 'error');
                return;
            }

            if (data.age < 18 || data.age > 65) {
                this.showToast('Age must be between 18 and 65', 'error');
                return;
            }

            if (data.weight < 50) {
                this.showToast('Weight must be at least 50kg', 'error');
                return;
            }

            // In production, this would be sent to the API
            this.showToast('Donor registration submitted successfully!', 'success');
            form.reset();
            
            // Show dashboard
            this.showSection('dashboard');
        } catch (error) {
            console.error('Error submitting donor registration:', error);
            this.showToast('Error submitting registration', 'error');
        }
    }

    async handleBloodRequest() {
        const form = document.getElementById('requestForm');
        const formData = new FormData(form);
        
        try {
            const data = {
                patientName: formData.get('patientName'),
                bloodType: formData.get('bloodType'),
                units: formData.get('units'),
                urgency: formData.get('urgency'),
                hospital: formData.get('hospital'),
                doctor: formData.get('doctor'),
                reason: formData.get('reason'),
                requiredDate: formData.get('requiredDate'),
                contactPhone: formData.get('contactPhone')
            };

            // Basic validation
            if (!data.patientName || !data.bloodType || !data.units || !data.urgency || !data.hospital || !data.reason || !data.requiredDate || !data.contactPhone) {
                this.showToast('Please fill in all required fields', 'error');
                return;
            }

            if (data.units < 1) {
                this.showToast('Units must be at least 1', 'error');
                return;
            }

            // In production, this would be sent to the API
            this.showToast('Blood request submitted successfully!', 'success');
            form.reset();
            
            // Show dashboard
            this.showSection('dashboard');
        } catch (error) {
            console.error('Error submitting blood request:', error);
            this.showToast('Error submitting request', 'error');
        }
    }

    async handleLogin() {
        const form = document.getElementById('loginForm');
        const formData = new FormData(form);
        
        try {
            const email = formData.get('email');
            const password = formData.get('password');

            if (!email || !password) {
                this.showToast('Please fill in all fields', 'error');
                return;
            }

            // In production, this would authenticate with the API
            const success = await authManager.login(email, password);
            
            if (success) {
                this.showToast('Login successful!', 'success');
                this.updateNavigation();
                this.showSection('dashboard');
            } else {
                this.showToast('Invalid credentials', 'error');
            }
        } catch (error) {
            console.error('Error during login:', error);
            this.showToast('Error during login', 'error');
        }
    }

    async handleRegister() {
        const form = document.getElementById('registerForm');
        const formData = new FormData(form);
        
        try {
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                password: formData.get('password'),
                confirmPassword: formData.get('confirmPassword'),
                role: formData.get('role')
            };

            // Basic validation
            if (!data.name || !data.email || !data.password || !data.confirmPassword || !data.role) {
                this.showToast('Please fill in all fields', 'error');
                return;
            }

            if (data.password !== data.confirmPassword) {
                this.showToast('Passwords do not match', 'error');
                return;
            }

            if (data.password.length < 6) {
                this.showToast('Password must be at least 6 characters', 'error');
                return;
            }

            // In production, this would register with the API
            const success = await authManager.register(data);
            
            if (success) {
                this.showToast('Registration successful! Please log in.', 'success');
                form.reset();
                this.showSection('login');
            } else {
                this.showToast('Registration failed', 'error');
            }
        } catch (error) {
            console.error('Error during registration:', error);
            this.showToast('Error during registration', 'error');
        }
    }

    updateNavigation() {
        const navAuth = document.getElementById('navAuth');
        const navActions = document.querySelector('.nav-actions');
        
        if (authManager.isAuthenticated()) {
            if (navAuth) navAuth.style.display = 'none';
            if (navActions) {
                navActions.innerHTML = `
                    <button class="btn btn-outline btn-sm" onclick="app.showSection('profile')">Profile</button>
                    <button class="btn btn-primary btn-sm" onclick="authManager.logout()">Logout</button>
                `;
            }
        } else {
            if (navAuth) navAuth.style.display = 'flex';
            if (navActions) {
                navActions.innerHTML = `
                    <button class="btn btn-outline btn-sm" onclick="app.showSection('request')">Emergency Request</button>
                    <button class="btn btn-primary btn-sm" onclick="app.showSection('donate')">Donate Now</button>
                `;
            }
        }
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="flex items-center justify-between">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        toastContainer.appendChild(toast);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
    }
}

// Global function for navigation (used in HTML onclick)
function showSection(sectionName) {
    if (window.app) {
        window.app.showSection(sectionName);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new LifeLinkApp();
});
