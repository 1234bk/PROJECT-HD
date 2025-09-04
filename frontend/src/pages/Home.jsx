import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

import { useAuth } from "../contexts/AuthContext";
import { Trash2, PlusCircle, Check, Pencil } from "lucide-react"; // icons
import api, { setAuthToken } from "../api/axios";
import {  Navigate, useNavigate } from "react-router-dom";
import logo from './../assets/icon.png';
import img from './../assets/container.png';



export default function Home() {
    const navigate = useNavigate();
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [notesUpdated, setNotesUpdated] = useState(false);

  useEffect(() => {
     if(!user) return;
   const fetchNotes = async () => {
      try {
        
        const token = localStorage.getItem("token"); // get token
    const res = await api.get("/note", {
      headers: { Authorization: `Bearer ${token}` }
    });
        setNotes(res.data);
        console.log("notes at home",res.data);
      } catch (err) {
        console.error(err);
      }
    };
    //  fetchUser();
    fetchNotes();
}, [user,notesUpdated]); // empty array → runs only once on page load/refresh


  // Create note
  const handleCreateNote = async () => {
    if (!newNote.trim()) return;
    try {
    const token = localStorage.getItem("token");
    const res = await api.post("/note/add", 
      { content: newNote },
      { headers: { Authorization: `Bearer ${token}` } }
    );
      setNotes([res.data.note, ...notes]);
        setNotesUpdated(prev => !prev);
      setNewNote("");
      setIsCreating(false);
    } catch (err) {
      console.error(err);
    }
  };
// router.get("/", getNotes);  //working
// router.put("/:id", updateNote);



  // Delete note
  const handleDelete = async (id) => {
    try {
    const token = localStorage.getItem("token");
    await api.delete(`/note/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
      setNotes(notes.filter((n) => n._id !== id));
        setNotesUpdated(prev => !prev);
    } catch (err) {
      console.error(err);
    }
  };

  // Edit note
  const handleEdit = (id, content) => {
    setEditingId(id);
    setEditContent(content);
  };

  // Save edited note
  const handleSaveEdit = async (id) => {
    if (!editContent.trim()) return;
    try {
    const token = localStorage.getItem("token");
    const res = await api.put(`/note/${id}`, 
      { content: editContent },
      { headers: { Authorization: `Bearer ${token}` } }
    );
      setNotes(notes.map((n) => (n._id === id ? res.data : n)));
        setNotesUpdated(prev => !prev);
      setEditingId(null);
      setEditContent("");
    } catch (err) {
      console.error(err);
    }
  };

  
   const handlesignout = () => {
  localStorage.removeItem("token"); // remove JWT
  setAuthToken(null);
  navigate("/signin");
};


  return (
    // <div className="min-h-screen bg-white flex flex-col items-center p-4">
    //   {/* Header */}
    //   <div className="w-full max-w-md flex justify-between items-center mb-6">
    //      <img src={logo} alt="HD" className="w-[32px] h-[32px]" />
           
    //     <h1 className="text-lg font-semibold">Dashboard</h1>
    //     <button 
    //     onClick={handlesignout}
    //     className="text-blue-600 hover:underline">Sign Out</button>
    //   </div>

    //   {/* User Card */}
    //   <div className="w-full max-w-md border rounded-lg shadow-sm p-4 mb-4">
    //     <p className="font-semibold text-gray-800">
    //       Welcome, {user?.name || "Guest"} !
    //     </p>
    //     <p className="text-gray-500 text-sm">Email: {user?.email}</p>
    //   </div>

    //   {/* Create Note Section */}
    //   <div className="w-full max-w-md mb-6">
    //     {isCreating ? (
    //       <div className="flex items-center gap-2">
    //         <input
    //           type="text"
    //           value={newNote}
    //           onChange={(e) => setNewNote(e.target.value)}
    //           placeholder="Write your note..."
    //           className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
    //         />
    //         <button
    //           onClick={handleCreateNote}
    //           className="bg-blue-600 text-white p-2 rounded-md"
    //         >
    //           <Check size={20} />
    //         </button>
    //       </div>
    //     ) : (
    //       <button
    //         onClick={() => setIsCreating(true)}
    //         className="w-full bg-blue-600 text-white py-2 rounded-md font-medium flex justify-center items-center gap-2"
    //       >
    //         <PlusCircle size={20} /> Create Note
    //       </button>
    //     )}
    //   </div>

    //   {/* Notes List */}
    //   <div className="w-full max-w-md">
    //     <h2 className="font-medium mb-2">Notes</h2>
    //     <div className="space-y-2">
    //       {notes.length > 0 ? (
    //         notes.map((note) => (
    //           <div
    //             key={note._id}
    //             className="flex justify-between items-center border rounded-md p-3"
    //           >
    //             {editingId === note._id ? (
    //               <div className="flex items-center gap-2 w-full">
    //                 <input
    //                   type="text"
    //                   value={editContent}
    //                   onChange={(e) => setEditContent(e.target.value)}
    //                   className="flex-1 border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
    //                 />
    //                 <button
    //                   onClick={() => handleSaveEdit(note._id)}
    //                   className="text-green-600"
    //                 >
    //                   <Check size={18} />
    //                 </button>
    //               </div>
    //             ) : (
    //               <>
    //                 <span>{note.content}</span>
    //                 <div className="flex items-center gap-3">
    //                   <button
    //                     onClick={() => handleEdit(note._id, note.content)}
    //                     className="text-gray-500 hover:text-blue-500"
    //                   >
    //                     <Pencil size={18} />
    //                   </button>
    //                   <button
    //                     onClick={() => handleDelete(note._id)}
    //                     className="text-gray-500 hover:text-red-500"
    //                   >
    //                     <Trash2 size={18} />
    //                   </button>
    //                 </div>
    //               </>
    //             )}
    //           </div>
    //         ))
    //       ) : (
    //         <p className="text-gray-500">No notes yet.</p>
    //       )}
    //     </div>
    //   </div>
    // </div>



    

<div className="min-h-screen flex flex-col lg:flex-row font-inter">
  {/* Left: Form */}
 
  <div className="min-h-screen bg-white flex flex-col items-center w-full lg:w-[40%] p-4 font-inter">
  {/* Header */}
  <div className="w-full mt-2  max-w-4xl flex justify-between items-center mb-6">
    <div className="flex items-center gap-4">
      <img src={logo} alt="HD" className="w-[32px] h-[32px]" />
      <h1 className="text-xl font-semibold">Dashboard</h1>
    </div>
    <button
      onClick={handlesignout}
      className="text-blue-600 underline"
    >
      Sign Out
    </button>
  </div>

  {/* User Card */}
  
  <div className="w-full max-w-md bg-white mt-5 lg:mt-15 rounded-lg shadow-xl border border-gray-300 p-5 mb-6">
  <p className="text-xl mb-5 font-bold text-black">
    Welcome, {user?.name }!
  </p>
  <p className="text-sm mb-2 text-gray-600">Email: {user?.email}</p>
</div>

  {/* Create Note Section */}
  <div className="w-full max-w-md mb-6">
    {isCreating ? (
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Write your note..."
          className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleCreateNote}
          className="bg-[#367AFF] text-white p-2 rounded-md"
        >
          <Check size={20} />
        </button>
      </div>
    ) : (
      <button
        onClick={() => setIsCreating(true)}
        className="w-full mt-2 bg-[#367AFF] text-white py-3 rounded-md font-medium flex justify-center items-center gap-2"
      >
         Create Note
      </button>
    )}
  </div>

  {/* Notes List */}
  <div className="w-full max-w-md">
    <div className="flex justify-between items-center mb-2">
      <h2 className="font-medium">Notes</h2>
     
    </div>
    <div className="space-y-2">
      {notes.length > 0 ? (
        notes.map((note) => (
          <div
            key={note._id}
            className="flex justify-between items-center border rounded-lg shadow-lg  border-gray-300  p-3"
          >
            {editingId === note._id ? (
              <div className="flex items-center gap-2 w-full">
                <input
                  type="text"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="flex-1 border rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={() => handleSaveEdit(note._id)}
                  className="text-green-600"
                >
                  <Check size={18} />
                </button>
              </div>
            ) : (
              <>
                <span>{note.content}</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleEdit(note._id, note.content)}
                    className="text-gray-500 hover:text-blue-500"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500">No notes yet.</p>
      )}
    </div>
  </div>
</div>


  {/* Right: Image */}
  <div className="hidden h-screen  lg:flex flex-[2] p-[12px]">
  <div className="w-full rounded-lg overflow-hidden">
    <img
      src={img} // replace with your imported image
      alt="Side Illustration"
      className="w-full  object-cover"
    />
  </div>
</div>
</div>

  );
}
