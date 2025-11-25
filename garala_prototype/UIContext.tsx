

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UIContextType, User, Ad, Notification, Shop, Theme, InfoPageKey, Conversation } from './types';

export const UIContext = createContext<UIContextType | undefined>(undefined);

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};

// MOCK Conversations for initial state
const MOCK_CONVERSATIONS_INIT: Conversation[] = [
    {
        id: 'c1',
        participantName: 'Didier M.',
        participantAvatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Didier',
        lastMessage: 'Est-ce que le prix est négociable ?',
        lastMessageDate: '10:30',
        unreadCount: 2,
        adTitle: 'iPhone 13 Pro Max 256Go',
        adImage: 'https://picsum.photos/seed/iphone/200/200',
        adId: '1',
        isOnline: true
    },
    {
        id: 'c2',
        participantName: 'Bangui Auto',
        participantAvatar: 'https://api.dicebear.com/9.x/micah/svg?seed=BanguiAuto',
        lastMessage: 'Vous pouvez passer voir le véhicule demain.',
        lastMessageDate: 'Hier',
        unreadCount: 0,
        adTitle: 'Toyota RAV4 2015',
        adImage: 'https://picsum.photos/seed/car/200/200',
        adId: '2',
    }
];

export const UIProvider: React.FC<{ children: React.ReactNode, value: Omit<UIContextType, 'conversations' | 'unreadMessagesCount' | 'markConversationAsRead'> & { user: User | null } }> = ({ children, value }) => {
    // Local state for conversations to handle read status
    const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS_INIT);

    const unreadMessagesCount = conversations.reduce((acc, curr) => acc + curr.unreadCount, 0);

    const markConversationAsRead = (id: string) => {
        setConversations(prev => prev.map(c => 
            c.id === id ? { ...c, unreadCount: 0 } : c
        ));
    };

    const combinedValue: UIContextType = {
        ...value,
        conversations,
        unreadMessagesCount,
        markConversationAsRead,
    };

    return <UIContext.Provider value={combinedValue}>{children}</UIContext.Provider>;
};