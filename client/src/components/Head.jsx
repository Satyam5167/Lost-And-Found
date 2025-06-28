import React from 'react';
import { useNavigate, useLoaderData } from 'react-router-dom';

const Head = () => {
  const navigate = useNavigate();
  const user = useLoaderData(); // { name,email, phone ... }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 text-yellow-400 w-10/12 mx-auto h-96 flex flex-col items-center">
      <h2 className="text-9xl font-bold mb-4" onClick={() => navigate('/home')}>
        Trackit Back
      </h2>
      <p className="text-4xl">
        {user?.name
          ? `Welcome, ${user.name} to Traceit Back...`
          : 'Welcome to Traceit Back...'}
      </p>
      <button
        className="mt-8 rounded-xl p-2 hover:bg-yellow-300 hover:text-black border bg-black/40"
        onClick={() => navigate('/dashboard')}
      >
        Drive through
      </button>
    </div>
  );
};

export default Head;
