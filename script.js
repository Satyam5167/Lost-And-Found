document.addEventListener('DOMContentLoaded', () => {
    const email = document.querySelector('.emailId');
    const password = document.querySelector('.password');
    const login_btn = document.querySelector('.login_btn');
    const newAcc_btn = document.querySelector('.newAcc_btn');
    const create_Name = document.querySelector('.create_Name');
    const create_Email = document.querySelector('.create_Email');
    const create_Phone = document.querySelector('.create_Phone');
    const create_Pass = document.querySelector('.create_Pass');
    const create_CnfPass = document.querySelector('.create_CnfPass');
    const createSignup = document.querySelector('.createSignup');
    const error = document.querySelector('.error');

    let token = localStorage.getItem('token');
    let isLoading = false;
    let isAuthenticating = false;
    let isRegistration = false;
    const apiBase = '/';

    const authBtn = login_btn;

    async function authenticate() {
        const emailVal = email.value;
        const passVal = password.value;

        if (
            isLoading ||
            isAuthenticating ||
            !emailVal ||
            !passVal ||
            passVal.length < 6 ||
            !emailVal.includes('@kiit.ac.in')
        ) return;

        if (error) error.style.display = 'none';
        isAuthenticating = true;
        authBtn.innerText = 'Authenticating...';

        try {
            const response = await fetch(`http://localhost:3002/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailVal, password: passVal })
            });

            const data = await response.json();

            if (data.token) {
                token = data.token;
                localStorage.setItem('token', token);
                authBtn.innerText = 'Loading...';
                showDashboard();
            } else {
                throw Error('❌ Failed to authenticate...');
            }
        } catch (err) {
            if (error) {
                error.innerText = err.message;
                error.style.display = 'block';
            }
        } finally {
            authBtn.innerText = 'Submit';
            isAuthenticating = false;
        }
    }


    
    async function authenticateSignup() {
        const emailVal = create_Email.value;
        const passVal = create_Pass.value;
        const cnfPassVal = create_CnfPass.value;
        const nameVal = create_Name.value;
        const phoneVal = create_Phone.value;

        const isValidEmail = /^[a-zA-Z0-9._%+-]+@kiit\.ac\.in$/.test(emailVal);
        const isValidPass = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/.test(passVal);
        const isPhoneValid = /^[6-9]\d{9}$/.test(phoneVal);

        if (
            isLoading ||
            !isValidEmail ||
            !isValidPass ||
            passVal !== cnfPassVal ||
            nameVal.length < 3 ||
            !isPhoneValid
        ) {
            alert("❌ Check email and password again. Password must have 1 uppercase, 1 number, 1 special character, and be at least 6 characters long.");
            return;
        }

        try {
            const response = await fetch('http://localhost:3002/auth/register', {
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
                token = data.token;
                localStorage.setItem('token', token);
                alert("✅ Registration successful!");
                showDashboard();
            } else {
                throw new Error("❌ Registration failed.");
            }
        } catch (err) {
            alert(err.message);
        }
    }

    function showDashboard() {
        console.log("Redirecting to dashboard...");
    }

    if (login_btn) login_btn.addEventListener('click', authenticate);
    if (createSignup) createSignup.addEventListener('click', authenticateSignup);
});
