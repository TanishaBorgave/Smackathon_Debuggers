// API Utility Functions
class API {
    constructor() {
        this.baseURL = ''; // Empty for same-origin requests
        this.token = localStorage.getItem('token');
    }

    // Set authorization token
    setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
    }

    // Remove token
    removeToken() {
        this.token = null;
        localStorage.removeItem('token');
    }

    // Get headers for requests
    getHeaders(includeAuth = true) {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (includeAuth && this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    // Generic request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: this.getHeaders(options.includeAuth !== false),
            ...options
        };

        try {
            const response = await fetch(url, config);
            
            // Handle unauthorized responses
            if (response.status === 401) {
                this.removeToken();
                window.location.hash = '#login';
                throw new Error('Unauthorized. Please login again.');
            }

            // Parse response
            let data;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            // Handle non-2xx responses
            if (!response.ok) {
                throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
            }

            return data;
        } catch (error) {
            console.error(`API Error (${endpoint}):`, error);
            throw error;
        }
    }

    // GET request
    async get(endpoint, includeAuth = true) {
        return this.request(endpoint, {
            method: 'GET',
            includeAuth
        });
    }

    // POST request
    async post(endpoint, data, includeAuth = true) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
            includeAuth
        });
    }

    // PUT request
    async put(endpoint, data, includeAuth = true) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
            includeAuth
        });
    }

    // PATCH request
    async patch(endpoint, data, includeAuth = true) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data),
            includeAuth
        });
    }

    // DELETE request
    async delete(endpoint, includeAuth = true) {
        return this.request(endpoint, {
            method: 'DELETE',
            includeAuth
        });
    }

    // Authentication endpoints
    async login(credentials) {
        const response = await this.post('/api/auth/login', credentials, false);
        this.setToken(response.token);
        return response;
    }

    async register(userData) {
        const response = await this.post('/api/auth/register', userData, false);
        if (response.token) {
            this.setToken(response.token);
        }
        return response;
    }

    async getProfile() {
        return this.get('/api/auth/profile');
    }

    // Blood stock endpoints
    async getBloodStock() {
        return this.get('/api/stock');
    }

    async getBloodStockSummary() {
        return this.get('/api/stock/summary');
    }

    async getBloodStockByType(bloodType) {
        return this.get(`/api/stock/type/${bloodType}`);
    }

    async addBloodStock(stockData) {
        return this.post('/api/stock', stockData);
    }

    async updateBloodStock(id, updates) {
        return this.put(`/api/stock/${id}`, updates);
    }

    async reserveBloodStock(id, units) {
        return this.post(`/api/stock/${id}/reserve`, { units });
    }

    async getExpiringBloodStock(days) {
        return this.get(`/api/stock/expiring/${days}`);
    }

    // Blood request endpoints
    async getBloodRequests() {
        return this.get('/api/requests');
    }

    async getBloodRequest(id) {
        return this.get(`/api/requests/${id}`);
    }

    async createBloodRequest(requestData) {
        return this.post('/api/requests', requestData);
    }

    async updateBloodRequest(id, updates) {
        return this.put(`/api/requests/${id}`, updates);
    }

    async updateRequestStatus(id, status, notes) {
        return this.patch(`/api/requests/${id}/status`, { status, notes });
    }

    async fulfillBloodRequest(id, fulfillmentData) {
        return this.post(`/api/requests/${id}/fulfill`, fulfillmentData);
    }

    async getUrgentRequests() {
        return this.get('/api/requests/urgent/list');
    }

    async deleteBloodRequest(id) {
        return this.delete(`/api/requests/${id}`);
    }

    // Donor endpoints
    async getDonors() {
        return this.get('/api/donors');
    }

    async getDonor(id) {
        return this.get(`/api/donors/${id}`);
    }

    async getDonorProfile() {
        return this.get('/api/donors/profile/me');
    }

    async updateDonorProfile(updates) {
        return this.put('/api/donors/profile/me', updates);
    }

    async updateDonorEligibility(id, eligibilityData) {
        return this.patch(`/api/donors/${id}/eligibility`, eligibilityData);
    }

    async getDonorsByBloodType(bloodType) {
        return this.get(`/api/donors/blood-type/${bloodType}`);
    }

    async getEligibleDonors() {
        return this.get('/api/donors/eligible/donation');
    }

    async recordDonation(id, donationData) {
        return this.post(`/api/donors/${id}/donation`, donationData);
    }

    async getDonorStats() {
        return this.get('/api/donors/stats/overview');
    }

    async searchDonors(query) {
        return this.get(`/api/donors/search/${encodeURIComponent(query)}`);
    }

    // Utility methods
    async checkConnection() {
        try {
            await this.get('/api/stock/summary', false);
            return true;
        } catch (error) {
            return false;
        }
    }

    // Error handling
    handleError(error) {
        if (error.message.includes('Unauthorized')) {
            // Redirect to login
            window.location.hash = '#login';
        }
        
        // Show toast notification
        if (window.app && window.app.showToast) {
            window.app.showToast(error.message, 'error');
        }
        
        throw error;
    }

    // Retry mechanism for failed requests
    async retryRequest(fn, maxRetries = 3, delay = 1000) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await fn();
            } catch (error) {
                if (i === maxRetries - 1) throw error;
                
                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
            }
        }
    }

    // Batch requests
    async batchRequests(requests) {
        const promises = requests.map(request => {
            const { method, endpoint, data } = request;
            switch (method.toLowerCase()) {
                case 'get':
                    return this.get(endpoint);
                case 'post':
                    return this.post(endpoint, data);
                case 'put':
                    return this.put(endpoint, data);
                case 'patch':
                    return this.patch(endpoint, data);
                case 'delete':
                    return this.delete(endpoint);
                default:
                    throw new Error(`Unsupported HTTP method: ${method}`);
            }
        });

        return Promise.all(promises);
    }

    // Upload file (for future use)
    async uploadFile(endpoint, file, additionalData = {}) {
        const formData = new FormData();
        formData.append('file', file);
        
        // Add additional data
        Object.keys(additionalData).forEach(key => {
            formData.append(key, additionalData[key]);
        });

        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Upload failed');
        }

        return response.json();
    }

    // Download file (for future use)
    async downloadFile(endpoint, filename) {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            headers: this.getHeaders()
        });

        if (!response.ok) {
            throw new Error('Download failed');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }
}

// Create global API instance
window.api = new API();

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API;
}
