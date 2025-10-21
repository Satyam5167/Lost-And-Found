const handleLogout = () => {
  // Remove authentication token
  localStorage.removeItem('token');

  // Reset greeting flag
  localStorage.setItem('greetingShown', 'false');

  // Redirect to login page
  window.location.href = '/login';
};

export default handleLogout;
