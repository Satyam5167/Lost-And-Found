import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login', { replace: true });
        return;
      }

      const res = await fetch('http://localhost:3002/items', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        alert('Session expired ... please login again');
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
        return;
      }

      const data = await res.json();
      setItems(data);
      setLoading(false);
    };

    load();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-4 bg-white/10 backdrop-blur-md p-4">
      {items.map(item => (
        <Card key={item.id} {...item} />
      ))}
    </div>
  );
};

export default Dashboard;
