const handleLogout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

export default handleLogout;

