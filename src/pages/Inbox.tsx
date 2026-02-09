import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Logo from '@/components/Logo';
import { LogOut, Inbox as InboxIcon, Flame, Sun, Snowflake, Building2, User, Mail, Clock, MessageSquare } from 'lucide-react';

type Contact = {
  id: string;
  nome: string;
  email: string;
  company: string | null;
  role: string | null;
  contact_type: string | null;
  mensagem: string;
  signal: string | null;
  created_at: string;
};

const SIGNAL_CONFIG = {
  hot: {
    label: 'Hot',
    icon: Flame,
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
  warm: {
    label: 'Warm',
    icon: Sun,
    className: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  },
  cold: {
    label: 'Cold',
    icon: Snowflake,
    className: 'bg-sky-500/10 text-sky-600 border-sky-500/20',
  },
} as const;

const SIGNAL_ORDER = { hot: 0, warm: 1, cold: 2 };

const InboxPage = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchContacts = async () => {
      setFetching(true);
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        const sorted = (data as Contact[]).sort((a, b) => {
          const sa = SIGNAL_ORDER[(a.signal as keyof typeof SIGNAL_ORDER) || 'warm'];
          const sb = SIGNAL_ORDER[(b.signal as keyof typeof SIGNAL_ORDER) || 'warm'];
          if (sa !== sb) return sa - sb;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        setContacts(sorted);
      }
      setFetching(false);
    };

    fetchContacts();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  const signalBadge = (signal: string | null) => {
    const key = (signal || 'warm') as keyof typeof SIGNAL_CONFIG;
    const config = SIGNAL_CONFIG[key] || SIGNAL_CONFIG.warm;
    const Icon = config.icon;
    return (
      <Badge variant="outline" className={`gap-1.5 font-medium ${config.className}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate('/form')} className="gap-2">
              <MessageSquare className="w-4 h-4" />
              New Contact
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 text-muted-foreground hover:text-foreground">
              <LogOut className="w-4 h-4" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-3xl mx-auto px-6 py-16">
        {/* Page Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <InboxIcon className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-3xl font-semibold text-foreground tracking-tight">
              Inbox
            </h1>
          </div>
          <p className="text-muted-foreground text-base leading-relaxed max-w-xl">
            Incoming professional contacts, prioritized by signal strength.
          </p>
        </div>

        {fetching ? (
          <div className="flex flex-col items-center gap-4 py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground text-sm">Loading contacts...</p>
          </div>
        ) : contacts.length === 0 ? (
          <Card className="border-border/50 shadow-lg">
            <CardContent className="py-16 flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <InboxIcon className="w-6 h-6 text-muted-foreground" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">No contacts yet</h2>
              <p className="text-muted-foreground text-sm max-w-sm">
                When recruiters reach out through the contact form, their messages will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {contacts.map((contact) => (
              <Card key={contact.id} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  {/* Top row: name + signal */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold text-foreground truncate">
                        {contact.nome}
                      </h3>
                      {contact.company && (
                        <div className="flex items-center gap-1.5 mt-1 text-muted-foreground text-sm">
                          <Building2 className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{contact.company}</span>
                        </div>
                      )}
                    </div>
                    {signalBadge(contact.signal)}
                  </div>

                  {/* Badges row */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {contact.role && (
                      <Badge variant="secondary" className="gap-1.5 font-normal">
                        <User className="w-3 h-3" />
                        {contact.role}
                      </Badge>
                    )}
                    {contact.contact_type && (
                      <Badge variant="outline" className="font-normal text-muted-foreground">
                        {contact.contact_type}
                      </Badge>
                    )}
                  </div>

                  <Separator className="mb-4" />

                  {/* Message preview */}
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                    {contact.mensagem}
                  </p>

                  {/* Footer meta */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3 h-3" />
                      {contact.email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      {formatDate(contact.created_at)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default InboxPage;
