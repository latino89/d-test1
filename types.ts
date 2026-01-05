
export interface User {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  isPremium: boolean;
  location?: { lat: number; lng: number };
}

export interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  category: string;
  status: 'active' | 'assigned' | 'completed';
  customerId: string;
  createdAt: string;
  deliveryPhoto?: string;
}

export interface Offer {
  id: string;
  jobId: string;
  sellerId: string;
  amount: number;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
}

export interface Transaction {
  id: string;
  jobId: string;
  amount: number;
  type: 'payment' | 'subscription';
  date: string;
  method: 'Vipps' | 'Card';
}
