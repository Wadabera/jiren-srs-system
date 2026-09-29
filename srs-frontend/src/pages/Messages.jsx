import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Send, Search, MessageSquare, User as UserIcon, MoreVertical, Paperclip, Smile } from 'lucide-react';
import './Messages.css';

export default function Messages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [content, setContent] = useState('');
  const [myId, setMyId] = useState('');
  const chatEndRef = useRef(null);

  const [loading, setLoading] = useState(true);

  const fetchMessages = async (id) => {
    try {
      const msgRes = await api.get(`/messages/${id}`);
      setMessages(msgRes.data);
    } catch (err) { console.error('Poll error:', err); }
  };

  useEffect(() => {
    let interval;
    const load = async () => {
      try {
        setLoading(true);
        const uRes = await api.get('/users/me');
        const userData = uRes.data;
        const role = localStorage.getItem('srs_role');
        
        const id = userData.studentId || userData.teacherId || userData._id;
        setMyId(String(id));

        let allUsers = [];

        if (role === 'director' || role === 'admin') {
          const teachersRes = await api.get('/users/teachers');
          allUsers = teachersRes.data.map(t => ({ id: String(t.teacherId), name: t.fullname, role: 'Teacher' }));
        } else if (role === 'teacher') {
          const [studentsRes, adminsRes] = await Promise.all([
            api.get('/users/students'),
            api.get('/users/directors')
          ]);
          allUsers = [
            ...studentsRes.data.map(s => ({ id: String(s.studentId), name: s.fullname, role: 'Student', grade: s.grade, class: s.class })),
            ...adminsRes.data.map(a => ({ id: String(a._id), name: a.fullname, role: 'Admin' }))
          ];
        } else if (role === 'student') {
          const [teachersRes, adminsRes] = await Promise.all([
            api.get('/users/teachers'),
            api.get('/users/directors')
          ]);
          // Filter teachers to only show those teaching this student's grade and class
          allUsers = [
            ...teachersRes.data
              .filter(t => t.grade === userData.grade && (t.classes && t.classes.includes(userData.class)))
              .map(t => ({ id: String(t.teacherId), name: t.fullname, role: 'Teacher' })),
            ...adminsRes.data.map(a => ({ id: String(a._id), name: a.fullname, role: 'Admin' }))
          ];
        }
        
        setUsers(allUsers.filter(u => String(u.id) !== String(id)));
        await fetchMessages(id);
        setLoading(false);

        interval = setInterval(() => fetchMessages(id), 5000);
      } catch (err) { 
        console.error('CRITICAL ERROR LOADING MESSAGES:', err); 
        setLoading(false);
      }
    };
    load();
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedUser]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim() || !selectedUser) return;
    try {
      const newMsg = {
        senderId: myId,
        senderName: user.fullname,
        senderRole: user.role,
        receiverId: selectedUser.id,
        content
      };
      await api.post('/messages', newMsg);
      setContent('');
      fetchMessages(myId);
    } catch (err) { console.error('Send error:', err); }
  };

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const currentChatMessages = messages.filter(m => 
    selectedUser && (
      (m.senderId === myId && m.receiverId === selectedUser.id) || 
      (m.receiverId === myId && m.senderId === selectedUser.id)
    )
  );

  const getLastMessage = (userId) => {
    const userMsgs = messages.filter(m => m.senderId === userId || m.receiverId === userId);
    if (userMsgs.length === 0) return 'No messages yet';
    const last = userMsgs[userMsgs.length - 1];
    return last.content;
  };

  return (
    <div className="chat-container animate-fade-in">
      
      {/* Sidebar */}
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.8rem', color: 'white', margin: 0 }}>Messages</h2>
            <MoreVertical size={20} style={{ cursor: 'pointer' }} />
          </div>
          <div className="chat-search-wrapper">
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--gray)' }} />
            <input 
              type="text" 
              className="chat-search-input"
              placeholder="Search contacts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="contact-list">
          {loading ? (
             <div style={{ padding: '20px', textAlign: 'center', color: 'var(--primary)' }}>
               <div className="loading-spinner"></div>
               <p style={{ marginTop: '10px', fontWeight: 600 }}>Loading contacts...</p>
             </div>
          ) : filteredUsers.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
              No contacts found
            </div>
          ) : (
            filteredUsers.map(u => (
              <div 
                key={u.id} 
                className={`contact-item ${selectedUser?.id === u.id ? 'active' : ''}`}
                onClick={() => setSelectedUser(u)}
              >
                <div className="contact-avatar">
                  {u.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
                <div className="contact-info">
                  <div className="contact-name">{u.name}</div>
                  <div className="contact-last-msg">{getLastMessage(u.id)}</div>
                </div>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--secondary)', textAlign: 'right' }}>
                  <div>{u.role}</div>
                  {u.grade && <div>Grade {u.grade}-{u.class}</div>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat */}
      <div className="chat-main">
        {!selectedUser ? (
          <div className="empty-chat">
            <div style={{ padding: '40px', borderRadius: '50%', background: 'var(--primary-glow)', marginBottom: '20px' }}>
              <MessageSquare size={80} style={{ color: 'var(--primary)' }} />
            </div>
            <h1>Your Inbox</h1>
            <p style={{ fontSize: '1.2rem', maxWidth: '400px' }}>
              Select a conversation from the left to start chatting with teachers or students.
            </p>
          </div>
        ) : (
          <>
            <div className="chat-header">
               <div className="contact-avatar" style={{ width: '45px', height: '45px' }}>
                  {selectedUser.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
               </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{selectedUser.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: '8px', height: '8px', background: 'var(--success)', borderRadius: '50%' }}></div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray)' }}>Online</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '15px', color: 'var(--gray)' }}>
                  <Search size={20} style={{ cursor: 'pointer' }} />
                  <MoreVertical size={20} style={{ cursor: 'pointer' }} />
                </div>
            </div>

            <div className="chat-messages">
              {currentChatMessages.map(m => {
                const isMine = m.senderId === myId;
                return (
                  <div key={m._id} className={`message-bubble ${isMine ? 'mine' : 'theirs'}`}>
                    {m.content}
                    <div className="message-time">
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>
            
            <div className="chat-input-area">
              <form onSubmit={handleSend} className="chat-input-wrapper">
                <button type="button" className="chat-send-btn" style={{ background: 'transparent', color: 'var(--gray)' }}>
                  <Paperclip size={20} />
                </button>
                <input 
                  type="text"
                  className="chat-input"
                  value={content} 
                  onChange={e=>setContent(e.target.value)} 
                  placeholder="Type a message..." 
                />
                <button type="button" className="chat-send-btn" style={{ background: 'transparent', color: 'var(--gray)' }}>
                  <Smile size={20} />
                </button>
                <button type="submit" className="chat-send-btn">
                  <Send size={20} />
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

