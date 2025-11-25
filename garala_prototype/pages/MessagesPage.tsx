
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, MoreVertical, Image, Send, Mic, Smile, Calendar, StopCircle, Play, Pause, Trash2, Paperclip, ShieldAlert, Flag, Ban, X } from 'lucide-react';
import { useUI } from '../UIContext';
import { Conversation, Message } from '../types';

// Mock Messages Data
const MOCK_MESSAGES: Record<string, Message[]> = {
    'c1': [
        { id: 'm0', senderId: 'system', senderName: 'System', content: 'Début de la conversation pour "iPhone 13 Pro Max"', date: '10:24', isRead: true, isMe: false, type: 'system', timestamp: Date.now() - 100000 },
        { id: 'm1', senderId: 'other', senderName: 'Didier M.', content: 'Bonjour, votre iPhone est toujours dispo ?', date: '10:25', isRead: true, isMe: false, type: 'text', timestamp: Date.now() - 90000 },
        { id: 'm2', senderId: 'me', senderName: 'Moi', content: 'Bonjour, oui toujours disponible.', date: '10:26', isRead: true, isMe: true, type: 'text', timestamp: Date.now() - 80000 },
        { id: 'm3', senderId: 'other', senderName: 'Didier M.', content: 'Est-ce que le prix est négociable ?', date: '10:30', isRead: false, isMe: false, type: 'text', timestamp: Date.now() - 70000 },
    ]
};

interface MessagesPageProps {
    onChatOpen?: (isOpen: boolean) => void;
}

// --- RENDER MESSAGE BUBBLE ---
const MessageBubble: React.FC<{ msg: Message }> = ({ msg }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const toggleAudio = () => {
        if (audioRef.current) {
            if (isPlaying) audioRef.current.pause();
            else audioRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className={`flex w-full ${msg.type === 'system' ? 'justify-center my-2' : msg.isMe ? 'justify-end' : 'justify-start'}`}>
            {msg.type === 'system' ? (
                <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">{msg.content}</span>
            ) : (
                <div 
                    className={`max-w-[75%] rounded-2xl shadow-sm relative overflow-hidden ${
                        msg.isMe 
                        ? 'bg-garala-500 text-white rounded-tr-none' 
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-none'
                    }`}
                >
                    {/* IMAGE */}
                    {msg.type === 'image' && (
                        <img src={msg.image} alt="shared" className="w-full h-auto max-h-64 object-cover" />
                    )}
                    
                    {/* AUDIO */}
                    {msg.type === 'audio' && (
                        <div className="flex items-center gap-3 p-3 min-w-[160px]">
                            <button onClick={toggleAudio} className={`p-2 rounded-full ${msg.isMe ? 'bg-white text-garala-500' : 'bg-gray-100 dark:bg-gray-700'}`}>
                                {isPlaying ? <Pause size={16} fill="currentColor"/> : <Play size={16} fill="currentColor"/>}
                            </button>
                            <div className="flex-grow h-1 bg-current opacity-30 rounded-full overflow-hidden">
                                <div className={`h-full bg-current ${isPlaying ? 'animate-pulse' : ''}`} style={{ width: '50%' }}></div>
                            </div>
                            <span className="text-xs font-medium">00:{msg.audioDuration || 0}</span>
                            <audio ref={audioRef} src={msg.audio} onEnded={() => setIsPlaying(false)} className="hidden" />
                        </div>
                    )}
                    
                    {/* MEETING */}
                    {msg.type === 'meeting' && (
                            <div className="p-3 border-l-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 text-gray-800 dark:text-gray-200">
                                <div className="flex items-center gap-2 font-bold mb-1">
                                    <Calendar size={16} /> Rendez-vous
                                </div>
                                <p className="text-sm">Date: {msg.meetingDetails?.date}</p>
                                <p className="text-sm">Heure: {msg.meetingDetails?.time}</p>
                                <button className="mt-2 text-xs bg-black text-white px-3 py-1 rounded-lg font-bold w-full">
                                    Ajouter à l'agenda
                                </button>
                            </div>
                    )}

                    {/* TEXT */}
                    {msg.type === 'text' && (
                        <div className="p-3">
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        </div>
                    )}

                    {/* METADATA */}
                    <span className={`text-[10px] block text-right px-2 pb-1 ${msg.isMe ? 'text-white/70' : 'text-gray-400'}`}>
                        {msg.date}
                        {msg.isMe && (
                            <span className="ml-1">{msg.isRead ? '• Lu' : '• Distribué'}</span>
                        )}
                    </span>
                </div>
            )}
        </div>
    );
};

export const MessagesPage: React.FC<MessagesPageProps> = ({ onChatOpen }) => {
    const navigate = useNavigate();
    const { user, offlineMode, showToast, conversations, markConversationAsRead } = useUI();
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [menuOpen, setMenuOpen] = useState(false);
    
    // Audio Recording State
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<any>(null);

    // File Input Ref
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Update header state when entering/leaving chat
    useEffect(() => {
        if (onChatOpen) {
            onChatOpen(!!selectedConversation);
        }
        if (selectedConversation) {
            // Load messages for this conversation
            setMessages(MOCK_MESSAGES[selectedConversation.id] || []);
            setMenuOpen(false);
            // Mark as read globally
            markConversationAsRead(selectedConversation.id);
        }
    }, [selectedConversation]);

    // Cleanup: Ensure nav is visible when unmounting
    useEffect(() => {
        return () => {
             if (onChatOpen) onChatOpen(false);
        }
    }, []);

    // Audio Timer Logic
    useEffect(() => {
        if (isRecording) {
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => {
                    if (prev >= 60) {
                        stopRecording();
                        return 60;
                    }
                    return prev + 1;
                });
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
            setRecordingTime(0);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [isRecording]);

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#f5f6f7] dark:bg-black">
                 <button 
                    onClick={() => navigate(-1)} 
                    className="absolute top-6 left-6 p-2 bg-white dark:bg-gray-800 rounded-full text-gray-900 dark:text-white"
                >
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Connectez-vous</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Vous devez être connecté pour accéder à vos messages.</p>
                <button onClick={() => navigate('/login')} className="bg-garala-500 text-white px-6 py-3 rounded-xl font-bold">Se connecter</button>
            </div>
        );
    }

    const scrollToBottom = () => {
        const container = document.getElementById('messages-container');
        if (container) container.scrollTop = container.scrollHeight;
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // --- ACTION HANDLERS ---

    const handleSendMessage = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (offlineMode) { showToast("Connexion requise", "error"); return; }
        if (!inputText.trim()) return;

        const newMessage: Message = {
            id: 'm_' + Date.now(),
            senderId: user.id,
            senderName: user.name,
            senderAvatar: user.avatar,
            content: inputText,
            date: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            isRead: false,
            isMe: true,
            type: 'text',
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, newMessage]);
        setInputText('');
        
        // Mock Reply
        setTimeout(() => {
             const reply: Message = {
                id: 'm_r_' + Date.now(),
                senderId: 'other',
                senderName: selectedConversation?.participantName || 'User',
                content: "D'accord, c'est noté !",
                date: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                isRead: true,
                isMe: false,
                type: 'text',
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, reply]);
        }, 2000);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (offlineMode) { showToast("Mode hors ligne", "error"); return; }
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const imgUrl = URL.createObjectURL(file);
            
            const newMessage: Message = {
                id: 'm_img_' + Date.now(),
                senderId: user.id,
                senderName: user.name,
                senderAvatar: user.avatar,
                image: imgUrl,
                date: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                isRead: false,
                isMe: true,
                type: 'image',
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, newMessage]);
            showToast("Image envoyée", "success");
        }
    };

    const startRecording = async () => {
        if (offlineMode) { showToast("Mode hors ligne", "error"); return; }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
                const audioUrl = URL.createObjectURL(audioBlob);
                
                const newMessage: Message = {
                    id: 'm_audio_' + Date.now(),
                    senderId: user.id,
                    senderName: user.name,
                    audio: audioUrl,
                    audioDuration: recordingTime,
                    date: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                    isRead: false,
                    isMe: true,
                    type: 'audio',
                    timestamp: Date.now()
                };
                setMessages(prev => [...prev, newMessage]);
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error(err);
            showToast("Microphone inaccessible", "error");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleScheduleMeeting = () => {
        if (offlineMode) { showToast("Mode hors ligne", "error"); return; }
        
        const meetingDate = new Date();
        meetingDate.setDate(meetingDate.getDate() + 1); // Tomorrow
        meetingDate.setHours(14, 0, 0);

        const meetingLink = `data:text/calendar;charset=utf8,BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0ASUMMARY:Rendez-vous Garala avec ${selectedConversation?.participantName}%0ADTSTART:${meetingDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z%0ADTEND:${new Date(meetingDate.getTime() + 3600000).toISOString().replace(/[-:]/g, '').split('.')[0]}Z%0ALOCATION:Garala%0ADESCRIPTION:Discussion pour ${selectedConversation?.adTitle}%0AEND:VEVENT%0AEND:VCALENDAR`;
        
        const newMessage: Message = {
            id: 'm_meet_' + Date.now(),
            senderId: user.id,
            senderName: user.name,
            content: "Je propose un rendez-vous.",
            date: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            isRead: false,
            isMe: true,
            type: 'meeting',
            meetingDetails: {
                date: "Demain",
                time: "14:00",
                location: "Lieu à définir"
            },
            timestamp: Date.now()
        };
        
        setMessages(prev => [...prev, newMessage]);
        window.open(meetingLink, '_blank');
    };

    const handleReport = (type: 'report' | 'block') => {
        if (offlineMode) { showToast("Mode hors ligne", "error"); return; }
        showToast(type === 'block' ? "Utilisateur bloqué" : "Utilisateur signalé à la modération", "success");
        setMenuOpen(false);
        if (type === 'block') navigate('/messages');
    };

    // --- CHAT VIEW ---
    if (selectedConversation) {
        return (
            <div className="fixed inset-0 bg-[#efeae2] dark:bg-[#0a0a0a] flex flex-col z-[60]">
                {/* Chat Header */}
                <div className="bg-white dark:bg-gray-900 p-3 flex items-center justify-between shadow-sm border-b border-gray-100 dark:border-gray-800 z-30">
                    <div className="flex items-center gap-3 flex-grow min-w-0" onClick={() => selectedConversation.adId && navigate(`/ad/${selectedConversation.adId}`)}>
                        <button 
                            onClick={(e) => { e.stopPropagation(); setSelectedConversation(null); }} 
                            className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <div className="relative flex-shrink-0">
                            <img src={selectedConversation.participantAvatar} alt="" className="w-10 h-10 rounded-full bg-gray-200 object-cover" />
                            {selectedConversation.isOnline && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                            )}
                        </div>
                        <div className="cursor-pointer">
                            <h3 className="font-bold text-gray-900 dark:text-white leading-tight truncate">{selectedConversation.participantName}</h3>
                            {selectedConversation.adTitle && (
                                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                    {selectedConversation.adImage && (
                                        <img src={selectedConversation.adImage} className="w-4 h-4 rounded object-cover" alt="mini" />
                                    )}
                                    <span className="truncate max-w-[150px]">{selectedConversation.adTitle}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="relative">
                        <button 
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                        >
                            <MoreVertical size={20} />
                        </button>
                        
                        {menuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in zoom-in duration-200">
                                <button onClick={handleScheduleMeeting} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                    <Calendar size={16} /> Rendez-vous
                                </button>
                                <button onClick={() => handleReport('report')} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-orange-600">
                                    <Flag size={16} /> Signaler
                                </button>
                                <button onClick={() => handleReport('block')} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-red-600">
                                    <Ban size={16} /> Bloquer
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Messages Area */}
                <div id="messages-container" className="flex-grow p-4 space-y-3 overflow-y-auto overscroll-contain pb-24">
                    {messages.map((msg) => (
                        <MessageBubble key={msg.id} msg={msg} />
                    ))}
                </div>

                {/* Input Area (Fixed at Bottom) */}
                <div className="bg-white dark:bg-gray-900 p-2 md:p-3 border-t border-gray-100 dark:border-gray-800 sticky bottom-0 z-30 pb-safe">
                    {isRecording ? (
                         <div className="flex items-center justify-between px-4 py-3 bg-red-50 dark:bg-red-900/20 rounded-2xl animate-pulse">
                             <div className="flex items-center gap-2 text-red-500 font-bold">
                                 <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                                 00:{recordingTime.toString().padStart(2, '0')} / 00:60
                             </div>
                             <button onClick={stopRecording} className="text-red-600 font-bold text-sm uppercase">Arrêter & Envoyer</button>
                         </div>
                    ) : (
                        <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                            <input 
                                type="file" 
                                ref={fileInputRef}
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                            <button 
                                type="button" 
                                onClick={() => fileInputRef.current?.click()}
                                className="p-3 text-gray-400 hover:text-garala-500 dark:hover:text-garala-400 transition-colors"
                            >
                                <Image size={24} />
                            </button>
                            
                            <div className="flex-grow bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center px-4 py-2 min-h-[48px]">
                                <input 
                                    type="text" 
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="Message..."
                                    className="bg-transparent border-none w-full focus:ring-0 text-gray-900 dark:text-white placeholder-gray-500 p-1 max-h-32"
                                />
                            </div>

                            {inputText.trim() ? (
                                <button 
                                    type="submit"
                                    className="p-3 bg-garala-500 text-white rounded-full shadow-md hover:bg-garala-600 transition-colors active:scale-90"
                                >
                                    <Send size={20} className="ml-0.5" />
                                </button>
                            ) : (
                                <button 
                                    type="button" 
                                    onClick={startRecording}
                                    className="p-3 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full hover:bg-red-100 hover:text-red-500 transition-colors"
                                >
                                    <Mic size={20} />
                                </button>
                            )}
                        </form>
                    )}
                </div>
            </div>
        );
    }

    // --- LIST VIEW ---
    return (
        <div className="min-h-screen bg-[#f5f6f7] dark:bg-black pb-24">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-10 p-4 border-b border-gray-100 dark:border-gray-800">
                     <div className="flex items-center gap-3 mb-4">
                        <button 
                            onClick={() => navigate('/')} 
                            className="p-2 -ml-2 bg-gray-50 dark:bg-gray-800 rounded-full shadow-sm text-gray-900 dark:text-white hover:bg-gray-100 transition-colors"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Messages</h1>
                    </div>
                    
                    <div className="relative">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Rechercher une conversation..." 
                            className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border-none rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-garala-500"
                        />
                    </div>
                </div>

                {/* List */}
                <div className="p-2">
                    {conversations.map((conv) => (
                        <button 
                            key={conv.id}
                            onClick={() => setSelectedConversation(conv)}
                            className="w-full p-4 hover:bg-white dark:hover:bg-gray-900 rounded-2xl transition-colors flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 last:border-none"
                        >
                            <div className="relative flex-shrink-0">
                                <img src={conv.participantAvatar} alt="" className="w-14 h-14 rounded-full bg-gray-200 object-cover" />
                                {conv.isOnline && (
                                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#f5f6f7] dark:border-black"></div>
                                )}
                            </div>
                            
                            <div className="flex-grow text-left min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-gray-900 dark:text-white truncate">{conv.participantName}</h3>
                                    <span className={`text-xs font-medium ${conv.unreadCount > 0 ? 'text-garala-500' : 'text-gray-400'}`}>
                                        {conv.lastMessageDate}
                                    </span>
                                </div>
                                <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'font-bold text-gray-800 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>
                                    {conv.lastMessage}
                                </p>
                                {conv.adTitle && (
                                    <p className="text-[10px] text-gray-400 mt-1 truncate bg-gray-100 dark:bg-gray-800 inline-block px-2 py-0.5 rounded-md">
                                        {conv.adTitle}
                                    </p>
                                )}
                            </div>

                            {conv.unreadCount > 0 && (
                                <div className="w-6 h-6 bg-garala-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 animate-pulse">
                                    {conv.unreadCount}
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
