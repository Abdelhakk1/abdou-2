'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { admin } from '@/lib/admin';
import { contact } from '@/lib/contact';
import { 
  Mail, 
  Phone, 
  Calendar, 
  User,
  ArrowLeft,
  Eye,
  Trash2,
  MessageSquare,
  Clock,
  CheckCircle,
  Reply
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function AdminMessages() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
      return;
    }

    if (user) {
      checkAdminAccess();
    }
  }, [user, loading, router]);

  const checkAdminAccess = async () => {
    try {
      const adminUser = await admin.isAdmin(user!.id);
      if (!adminUser) {
        router.push('/');
        return;
      }
      
      setIsAdmin(true);
      await loadMessages();
    } catch (error) {
      console.error('Error checking admin access:', error);
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      const messageData = await contact.getAllMessages();
      setMessages(messageData || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const handleStatusUpdate = async (messageId: string, status: 'unread' | 'read' | 'replied', notes?: string) => {
    setIsUpdating(true);
    try {
      await contact.updateMessageStatus(messageId, status, notes);
      toast.success('Message status updated successfully');
      await loadMessages();
      if (selectedMessage?.id === messageId) {
        setSelectedMessage({ ...selectedMessage, status, admin_notes: notes });
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update message status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      await contact.deleteMessage(messageId);
      toast.success('Message deleted successfully');
      await loadMessages();
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete message');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      unread: { color: 'bg-yellow-100 text-yellow-800', label: 'Unread', icon: Clock },
      read: { color: 'bg-blue-100 text-blue-800', label: 'Read', icon: Eye },
      replied: { color: 'bg-green-100 text-green-800', label: 'Replied', icon: CheckCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.unread;
    const IconComponent = config.icon;
    
    return (
      <Badge className={`${config.color} border-0 flex items-center`}>
        <IconComponent className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const openMessage = async (message: any) => {
    setSelectedMessage(message);
    setAdminNotes(message.admin_notes || '');
    
    // Mark as read if it's unread
    if (message.status === 'unread') {
      await handleStatusUpdate(message.id, 'read');
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-foreground/70">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost" size="icon">
              <Link href="/admin">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Contact Messages</h1>
              <p className="text-lg text-foreground/70">Manage customer inquiries and messages</p>
            </div>
          </div>
          <div className="text-sm text-foreground/60">
            {messages.filter(m => m.status === 'unread').length} unread messages
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Messages List */}
          <div className="lg:col-span-2">
            {messages.length === 0 ? (
              <Card className="soft-shadow bg-white border-0 text-center">
                <CardContent className="p-12">
                  <MessageSquare className="h-12 w-12 text-foreground/50 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-4">No Messages Yet</h3>
                  <p className="text-foreground/70">
                    Customer messages will appear here when they contact you through the website.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <Card 
                    key={message.id} 
                    className={`soft-shadow hover:elegant-shadow hover-lift transition-all duration-300 border-0 cursor-pointer ${
                      selectedMessage?.id === message.id ? 'ring-2 ring-primary' : ''
                    } ${message.status === 'unread' ? 'bg-blue-50' : 'bg-white'}`}
                    onClick={() => openMessage(message)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-bold text-foreground">{message.name}</h3>
                            {getStatusBadge(message.status)}
                          </div>
                          <p className="text-sm text-foreground/70 mb-2">{message.email}</p>
                          <h4 className="font-semibold text-foreground mb-2">{message.subject}</h4>
                          <p className="text-foreground/70 text-sm line-clamp-2 leading-relaxed">
                            {message.message}
                          </p>
                        </div>
                        <div className="text-right text-xs text-foreground/50 ml-4">
                          {format(new Date(message.created_at), 'MMM d, yyyy')}
                          <br />
                          {format(new Date(message.created_at), 'h:mm a')}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Message Detail */}
          <div>
            {selectedMessage ? (
              <Card className="soft-shadow bg-white border-0 sticky top-8">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Message Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Contact Info */}
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-foreground/50" />
                      <span className="font-semibold">{selectedMessage.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-foreground/50" />
                      <a href={`mailto:${selectedMessage.email}`} className="text-blue-600 hover:underline">
                        {selectedMessage.email}
                      </a>
                    </div>
                    {selectedMessage.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-foreground/50" />
                        <a href={`tel:${selectedMessage.phone}`} className="text-blue-600 hover:underline">
                          {selectedMessage.phone}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-foreground/50" />
                      <span className="text-sm text-foreground/70">
                        {format(new Date(selectedMessage.created_at), 'PPP p')}
                      </span>
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Subject:</h4>
                    <p className="text-foreground/80">{selectedMessage.subject}</p>
                  </div>

                  {/* Message */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Message:</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                        {selectedMessage.message}
                      </p>
                    </div>
                  </div>

                  {/* Status Update */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Status:</h4>
                    <Select
                      value={selectedMessage.status}
                      onValueChange={(value) => handleStatusUpdate(selectedMessage.id, value as any)}
                      disabled={isUpdating}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unread">Unread</SelectItem>
                        <SelectItem value="read">Read</SelectItem>
                        <SelectItem value="replied">Replied</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Admin Notes */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Admin Notes:</h4>
                    <Textarea
                      placeholder="Add internal notes about this message..."
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      className="min-h-[80px]"
                    />
                    <Button
                      onClick={() => handleStatusUpdate(selectedMessage.id, selectedMessage.status, adminNotes)}
                      disabled={isUpdating}
                      className="mt-2 btn-outline w-full"
                    >
                      Save Notes
                    </Button>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button
                      asChild
                      className="flex-1 btn-primary"
                    >
                      <a href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}>
                        <Reply className="h-4 w-4 mr-2" />
                        Reply
                      </a>
                    </Button>
                    <Button
                      onClick={() => handleDelete(selectedMessage.id)}
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="soft-shadow bg-white border-0 text-center">
                <CardContent className="p-12">
                  <MessageSquare className="h-12 w-12 text-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-foreground mb-2">Select a Message</h3>
                  <p className="text-foreground/70">
                    Click on a message from the list to view details and manage it.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}