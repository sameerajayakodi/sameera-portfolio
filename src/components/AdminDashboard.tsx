import React, { useState, useEffect, useRef } from "react";
import { Lock, FileText, Upload, Settings, Home, LogOut, Moon, Sun, Plus, Edit, Trash2 } from "lucide-react";

export default function AdminDashboard({ darkMode, setDarkMode }: { darkMode: boolean, setDarkMode: (d: boolean) => void }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  
  const [articles, setArticles] = useState<any[]>([]);
  const [editingArticle, setEditingArticle] = useState<any>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchArticles();
    }
  }, [isAuthenticated]);

  const fetchArticles = async () => {
    try {
      const res = await fetch("/api/articles");
      const data = await res.json();
      setArticles(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin123") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid credentials");
    }
  };

  const handleUploadCV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    const formData = new FormData();
    formData.append("cv", file);
    
    setUploadStatus("Uploading...");
    try {
      const res = await fetch("/api/admin/cv/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setUploadStatus("CV Uploaded Successfully!");
        setTimeout(() => setUploadStatus(""), 3000);
      } else {
        setUploadStatus("Failed to upload CV.");
      }
    } catch (err) {
      setUploadStatus("Error uploading CV.");
    }
  };
  
  const saveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;
    
    const url = editingArticle.id ? `/api/admin/articles/${editingArticle.id}` : "/api/admin/articles";
    const method = editingArticle.id ? "PUT" : "POST";
    
    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingArticle)
      });
      setEditingArticle(null);
      fetchArticles();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteArticle = async (id: string) => {
    if(!confirm("Are you sure?")) return;
    try {
      await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
      fetchArticles();
    } catch (e) {
      console.error(e);
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 transition-colors">
          <div className="w-full max-w-md p-8 bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-full text-neutral-900 dark:text-white">
                <Lock className="w-6 h-6" />
              </div>
            </div>
            <h2 className="text-2xl font-serif text-center mb-6 text-neutral-900 dark:text-white">Admin Access</h2>
            {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-100 dark:border-red-900/50">{error}</div>}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent outline-none transition-all"
                  placeholder="admin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                Log In
              </button>
            </form>
            <div className="mt-4 text-center">
               <a href="/" className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white underline">Back to site</a>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors text-neutral-900 dark:text-white font-sans">
        <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
            <h1 className="font-serif text-xl font-bold">Admin Dashboard</h1>
            <div className="flex space-x-4 items-center">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <a href="/" className="flex items-center space-x-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white">
                <Home className="w-4 h-4" />
                <span>Back to Site</span>
              </a>
              <button onClick={() => setIsAuthenticated(false)} className="flex items-center space-x-1.5 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 cursor-pointer">
                <LogOut className="w-4 h-4" />
                <span>Log out</span>
              </button>
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Settings & CV */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4 border-b border-neutral-100 dark:border-neutral-800 pb-4">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                <Upload className="w-5 h-5" />
              </div>
              <h2 className="font-semibold text-lg font-serif">Resume Management</h2>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
              Upload your latest CV in PDF format. This replaces the default fallback text.
            </p>
            <div className="flex items-center space-x-4">
              <input type="file" accept="application/pdf" className="hidden" ref={fileInputRef} onChange={handleUploadCV} />
              <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer">
                Select & Upload PDF
              </button>
              {uploadStatus && <span className="text-sm text-emerald-600 dark:text-emerald-400">{uploadStatus}</span>}
            </div>
          </div>
          
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4 border-b border-neutral-100 dark:border-neutral-800 pb-4">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="font-semibold text-lg font-serif">Quick Actions</h2>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
              Manage core configurations or jump to analytical dashboards.
            </p>
            <div className="flex space-x-4">
              <button onClick={() => setEditingArticle({ title: "", content: "", category: "General", readTime: "3 min read", excerpt: "", published: true })} className="flex items-center space-x-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm font-medium rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer border border-neutral-200 dark:border-neutral-700">
                <Plus className="w-4 h-4" />
                <span>New Article</span>
              </button>
            </div>
          </div>
        </div>

        {/* Articles Management */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="font-semibold text-lg font-serif">Articles & Posts</h2>
            </div>
          </div>
          
          {editingArticle ? (
            <div className="p-6 bg-neutral-50 dark:bg-neutral-950/50">
               <h3 className="text-lg font-medium mb-4">{editingArticle.id ? 'Edit Article' : 'Create Article'}</h3>
               <form onSubmit={saveArticle} className="space-y-4 max-w-2xl">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input required type="text" value={editingArticle.title || ""} onChange={e => setEditingArticle({...editingArticle, title: e.target.value})} className="w-full p-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Category</label>
                      <input required type="text" value={editingArticle.category || ""} onChange={e => setEditingArticle({...editingArticle, category: e.target.value})} className="w-full p-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Read Time (e.g. 5 min read)</label>
                      <input required type="text" value={editingArticle.readTime || ""} onChange={e => setEditingArticle({...editingArticle, readTime: e.target.value})} className="w-full p-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Excerpt (Short description)</label>
                    <textarea required rows={2} value={editingArticle.excerpt || ""} onChange={e => setEditingArticle({...editingArticle, excerpt: e.target.value})} className="w-full p-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Content (Markdown supported if rendered)</label>
                    <textarea required rows={8} value={editingArticle.content || ""} onChange={e => setEditingArticle({...editingArticle, content: e.target.value})} className="w-full p-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="published" checked={editingArticle.published} onChange={e => setEditingArticle({...editingArticle, published: e.target.checked})} className="rounded border-neutral-300" />
                    <label htmlFor="published" className="text-sm font-medium">Published</label>
                  </div>
                  <div className="flex space-x-3 pt-2">
                    <button type="submit" className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium rounded-lg hover:bg-neutral-800 transition cursor-pointer">Save Article</button>
                    <button type="button" onClick={() => setEditingArticle(null)} className="px-4 py-2 bg-neutral-200 dark:bg-neutral-800 font-medium rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-700 transition cursor-pointer">Cancel</button>
                  </div>
               </form>
            </div>
          ) : (
            <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {articles.length === 0 ? (
                 <div className="p-8 text-center text-neutral-500 dark:text-neutral-400">
                   No articles found. Create one to get started!
                 </div>
              ) : (
                articles.map(article => (
                  <div key={article.id} className="p-4 sm:p-6 flex justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition">
                    <div>
                      <h3 className="font-medium text-neutral-900 dark:text-white">{article.title}</h3>
                      <div className="flex space-x-3 mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                        <span>{article.date}</span>
                        <span>&bull;</span>
                        <span className={article.published ? "text-emerald-500" : "text-yellow-500"}>
                          {article.published ? "Published" : "Draft"}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={() => setEditingArticle(article)} className="p-2 text-neutral-500 hover:text-blue-600 dark:hover:text-blue-400 bg-neutral-100 dark:bg-neutral-800 rounded-lg transition cursor-pointer" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteArticle(article.id)} className="p-2 text-neutral-500 hover:text-red-600 dark:hover:text-red-400 bg-neutral-100 dark:bg-neutral-800 rounded-lg transition cursor-pointer" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        
        </main>
      </div>
    </>
  );
}
