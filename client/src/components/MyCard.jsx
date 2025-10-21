import React from 'react';
import pic from '../assets/pic.jpg';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Slide } from 'react-toastify';
const API_BASE = 'http://localhost:3002/api';

const MyCard = ({ id, title, url }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('You are not logged in');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/items/deleteUserItem`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ itemId: id }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Item deleted successfully');
        window.location.reload();
      } else {
        toast.error(data.message || 'Failed to delete item');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="relative group w-fit">
      <div className="h-100 p-6" id="cards">
        <div className="bg-white/30 backdrop-blur p-4 w-70 flex flex-col items-center rounded-2xl gap-3 hover:scale-105 transition-all ease-in-out" id="card">
          <img src={url || pic} alt={title} className="w-55 h-60 rounded-2xl object-cover" />

          <div className="flex gap-4">
            <div onClick={() => navigate(`/edit-post/${id}`)}>
              <div className="cursor-pointer border-3 border-black bg-gray-500 pb-[10px] transition-all duration-100 select-none active:pb-0 active:mb-[10px] active:translate-y-[10px]">
                <div className="bg-[#dddddd] border-4 border-white px-2 py-1 active:bg-yellow-400">
                  <span className="text-[1.2em] tracking-wide">Edit</span>
                </div>
              </div>
            </div>

            <div onClick={handleDelete}>
              <div className="cursor-pointer border-3 border-black bg-gray-500 pb-[10px] transition-all duration-100 select-none active:pb-0 active:mb-[10px] active:translate-y-[10px]">
                <div className="bg-[#dddddd] border-4 border-white px-2 py-1 active:bg-yellow-400">
                  <span className="text-[1.2em] tracking-wide">Remove</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCard;
