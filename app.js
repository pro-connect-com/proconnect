// src/App.js
import React, { useEffect, useState } from 'react';
import Navbar from 'Navbar';
import Sidebar from 'Sidebar';
import Footer from 'Footer';

function App() {
  const [jobs, setJobs] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch jobs and user data
  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3001/jobs').then(res => res.json()),
      fetch('http://localhost:3001/user').then(res => res.json())
    ])
    .then(([jobsData, userData]) => {
      setJobs(jobsData);
      setUser(userData);
      setLoading(false);
    })
    .catch(error => {
      console.error("API Error:", error);
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar user={user} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4">
          {loading ? (
            <p className="text-center mt-10">Loading...</p>
          ) : (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1A2E4D]">Jobs for You</h2>
              {jobs.map(job => (
                <div key={job.id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
                  <h3 className="text-xl font-bold text-[#1A2E4D]">{job.title}</h3>
                  <p className="text-[#2ECC71] font-medium">{job.company} • {job.location}</p>
                  <p className="text-[#2ECC71] mb-2">{job.salary}</p>
                  <p className="text-gray-600">{job.description}</p>
                  <button className="mt-3 px-4 py-2 bg-[#2ECC71] text-white rounded hover:bg-[#25a35a]">
                    Quick Apply
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;