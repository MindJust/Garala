
import React from 'react';
import { Bell, Check, Info, AlertCircle, CheckCircle, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../UIContext';

export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationRead } = useUI();
  const navigate = useNavigate();

  const getIcon = (type: string) => {
      switch(type) {
          case 'success': return <CheckCircle size={20} className="text-green-500" />;
          case 'alert': return <AlertCircle size={20} className="text-red-500" />;
          default: return <Info size={20} className="text-blue-500" />;
      }
  };

  return (
    <div className="min-h-screen bg-[#f5f6f7] py-6 pb-24">
      <div className="max-w-md mx-auto px-4">
        
        <div className="flex items-center gap-3 mb-6">
            <button 
                onClick={() => navigate(-1)} 
                className="p-2 -ml-2 bg-white rounded-full shadow-sm text-gray-900 hover:bg-gray-50 transition-colors"
            >
                <ChevronLeft size={24} />
            </button>
            <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <Bell className="text-garala-500" size={24} />
                Notifications
            </h1>
        </div>

        {notifications.length > 0 ? (
            <div className="space-y-3">
                {notifications.map(notif => (
                    <div 
                        key={notif.id} 
                        onClick={() => markNotificationRead(notif.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${notif.read ? 'bg-white border-gray-100 opacity-70' : 'bg-white border-garala-200 shadow-sm'}`}
                    >
                        {!notif.read && (
                            <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-bl-xl"></div>
                        )}
                        <div className="flex gap-4">
                            <div className={`mt-1 flex-shrink-0 ${notif.read ? 'opacity-50' : ''}`}>
                                {getIcon(notif.type)}
                            </div>
                            <div>
                                <h3 className={`font-bold text-gray-900 ${notif.read ? 'font-medium' : ''}`}>{notif.title}</h3>
                                <p className="text-sm text-gray-600 mt-1 leading-relaxed">{notif.message}</p>
                                <p className="text-xs text-gray-400 mt-2">{notif.date}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-20 text-gray-400">
                <Bell size={48} className="mx-auto mb-4 opacity-20" />
                <p>Aucune notification pour le moment.</p>
            </div>
        )}
      </div>
    </div>
  );
};
