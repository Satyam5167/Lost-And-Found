document.addEventListener('DOMContentLoaded', () => {
    const email = document.querySelector('.emailId');
    const password = document.querySelector('.password');
    const login_btn = document.querySelector('.login_btn');
    const create_Name = document.querySelector('.create_Name');
    const create_Email = document.querySelector('.create_Email');
    const create_Phone = document.querySelector('.create_Phone');
    const create_Pass = document.querySelector('.create_Pass');
    const create_CnfPass = document.querySelector('.create_CnfPass');
    const createSignup = document.querySelector('.createSignup');
    const error = document.querySelector('.error');
    const logoutBtn = document.getElementById('logoutBtn');

    const API = 'http://localhost:3002';

    // Token-based fetch wrapper
    async function apiFetch(endpoint, options = {}) {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
                'Authorization': token ? `Bearer ${token}` : ''
            }
        });

        if (res.status === 401) {
            localStorage.removeItem('token');
            alert("Session expired. Please log in again.");
            window.location.href = '/index.html';
        }

        return res.json();
    }

    // Login Handler
    async function authenticate() {
        const emailVal = email.value.trim();
        const passVal = password.value.trim();

        if (!emailVal || !passVal || passVal.length < 6 || !emailVal.includes('@kiit.ac.in')) return;

        if (error) error.style.display = 'none';
        login_btn.innerText = 'Authenticating...';

        try {
            const response = await fetch(`${API}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailVal, password: passVal })
            });

            const data = await response.json();

            if (data.token) {
                localStorage.setItem('token', data.token);
                login_btn.innerText = 'Loading...';
                showDashboard();
            } else {
                throw new Error(data.message || "❌ Failed to authenticate...");
            }
        } catch (err) {
            if (error) {
                error.innerText = err.message;
                error.style.display = 'block';
            }
        } finally {
            login_btn.innerText = 'Submit';
        }
    }

    // Signup Handler
    async function authenticateSignup() {
        const emailVal = create_Email.value.trim();
        const passVal = create_Pass.value.trim();
        const cnfPassVal = create_CnfPass.value.trim();
        const nameVal = create_Name.value.trim();
        const phoneVal = create_Phone.value.trim();

        const isValidEmail = /^[a-zA-Z0-9._%+-]+@kiit\.ac\.in$/.test(emailVal);
        const isValidPass = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/.test(passVal);
        const isPhoneValid = /^[6-9]\d{9}$/.test(phoneVal);

        if (!isValidEmail || !isValidPass || passVal !== cnfPassVal || nameVal.length < 3 || !isPhoneValid) {
            alert("❌ Check email and password again. Password must have 1 uppercase, 1 number, 1 special character, and be at least 6 characters long.");
            return;
        }

        try {
            const response = await fetch(`${API}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: emailVal,
                    password: passVal,
                    phone: phoneVal,
                    name: nameVal
                })
            });

            const data = await response.json();

            if (data.token) {
                localStorage.setItem('token', data.token);
                alert("✅ Registration successful!");
                showDashboard();
            } else {
                throw new Error(data.error || "❌ Registration failed.");
            }
        } catch (err) {
            alert(err.message);
        }
    }

    function showDashboard() {
        window.location.href = "/dashboard.html";
    }

    // Load items on dashboard
    async function loadItems() {
        try {
            const items = await apiFetch('/items');
            const container = document.querySelector('#itemsContainer');
            container.innerHTML = '';

            if (!items || items.length === 0) {
                container.innerHTML = '<p class="text-gray-500">No items found.</p>';
                return;
            }

            items.forEach(item => {
                const card = document.createElement('div');
                card.className = 'bg-white p-4 rounded-xl shadow-md';
                card.innerHTML = `
                    <h3 class="text-lg font-bold">${item.title}</h3>
                    <p class="text-sm text-gray-600">${item.description}</p>
                    <p class="text-xs text-gray-400">${item.location} - ${item.status}</p>
                    <p class="text-xs">${new Date(item.date_reported).toLocaleDateString()}</p>
                `;
                container.appendChild(card);
            });
        } catch (error) {
            alert("Failed to load items.");
            console.error(error);
        }
    }

    // Event Listeners
    if (login_btn) login_btn.addEventListener('click', authenticate);
    if (createSignup) createSignup.addEventListener('click', authenticateSignup);
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.href = '/index.html';
        });
    }

    // Auto-load items only on dashboard
    if (document.querySelector('#itemsContainer')) {
        loadItems();
    }
});
