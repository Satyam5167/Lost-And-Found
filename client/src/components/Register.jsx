import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NET from 'vanta/src/vanta.net';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [otp, setOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState('');

  if (typeof window !== 'undefined' && !document.vantaRegisterInit) {
    const vantaDiv = document.getElementById('vanta');
    if (vantaDiv) {
      NET({ el: '#vanta' });
      document.vantaRegisterInit = true;
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { name, email, phone, password, confirmPassword } = form;

    if (
      registering ||
      !name ||
      !email.includes('@') ||
      !phone ||
      password.length < 6 ||
      password !== confirmPassword
    ) {
      setError('❌ Invalid input or passwords do not match');
      return;
    }

    setRegistering(true);
    setError('');

    try {
      if (!showOtpField) {
        const otpRes = await fetch('http://localhost:3002/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        const otpData = await otpRes.json();
        if (!otpRes.ok) throw new Error(otpData.error || 'Failed to send OTP');

        setShowOtpField(true);
        setRegistering(false);
        return;
      }

      const verifyRes = await fetch('http://localhost:3002/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.error || 'Invalid OTP');

      const res = await fetch('http://localhost:3002/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });

      if (res.status === 409) {
        setError('User is already registered.');
        return;
      }

      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        navigate('/');
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="overflow-x-hidden min-h-screen flex flex-col items-center pt-6" id="vanta">
      <img src="/mainlogo.png" className="h-20 rounded-2xl hover:shadow-yellow-glow" />

      <div className="flex flex-col justify-center p-8 gap-4 group rounded-xl w-96 hover:shadow-md mt-10 bg-white/60 backdrop-blur">

        {error && (
          <div className="text-red-500 text-center">
            {error}
            {error.includes('already') && (
              <div className="mt-2">
                <a href="/login" className="text-blue-600 underline">
                  Go to Login
                </a>
              </div>
            )}
          </div>
        )}

        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="placeholder:text-white h-14 w-full border p-3 rounded-xl"
          required
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="placeholder:text-white h-14 w-full border p-3 rounded-xl"
          required
        />
        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="placeholder:text-white h-14 w-full border p-3 rounded-xl"
          required
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={handleChange}
          className="placeholder:text-white h-14 border p-3 rounded-xl"
          required
        />
        <input
          name="confirmPassword"
          placeholder="Confirm Password"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          className="placeholder:text-white h-14 border p-3 rounded-xl"
          required
        />

        {showOtpField && (
          <>
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="placeholder:text-white h-14 border p-3 rounded-xl"
              required
            />
            <button
              onClick={async () => {
                try {
                  const otpRes = await fetch('http://localhost:3002/send-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: form.email }),
                  });
                  const otpData = await otpRes.json();
                  if (!otpRes.ok) throw new Error(otpData.error || 'Failed to resend OTP');
                  alert('✅ OTP resent to your email.');
                } catch (err) {
                  alert(err.message);
                }
              }}
              className="bg-blue-500 rounded-xl text-white p-3 w-full"
            >
              Resend OTP
            </button>
          </>
        )}

        <button
          onClick={handleSubmit}
          className="bg-green-500 rounded-xl text-white p-3 w-full"
          disabled={registering}
        >
          {registering
            ? 'Processing...'
            : showOtpField
            ? 'Verify & Create Account'
            : 'Send OTP'}
        </button>
      </div>
    </div>
  );
};

export default Register;
