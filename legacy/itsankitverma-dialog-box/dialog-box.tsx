import React, { useState, ChangeEvent, FC } from 'react';
import { cn } from "../_utils/cn";

export const Component = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('John Doe');
  const [username, setUsername] = useState('@johndoe');

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => setName(e.target.value);
  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSave = () => {
    // Save logic here
    setOpen(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 w-full">
      <button
        type="button"
        onClick={handleOpen}
        className="px-6 py-2 rounded-lg bg-neutral-900 text-white font-medium shadow transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        Edit Profile
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative text-neutral-900 animate-fadeIn">
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 text-2xl focus:outline-none focus:ring-2 focus:ring-neutral-400"
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-1 tracking-tight">Edit profile</h2>
            <p className="text-neutral-500 mb-7 text-sm">Make changes to your profile here. Click save when you're done.</p>
            <form onSubmit={e => { e.preventDefault(); handleSave(); }} autoComplete="off">
              <div className="mb-5">
                <label htmlFor="name" className="block text-sm font-semibold mb-2">Name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-neutral-50 text-neutral-900 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300 focus:outline-none transition"
                  autoComplete="off"
                  required
                />
              </div>
              <div className="mb-8">
                <label htmlFor="username" className="block text-sm font-semibold mb-2">Username</label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-neutral-50 text-neutral-900 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300 focus:outline-none transition"
                  autoComplete="off"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 rounded-lg border border-neutral-300 bg-white text-neutral-700 font-medium hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-neutral-900 text-white font-semibold shadow hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-400 transition"
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
