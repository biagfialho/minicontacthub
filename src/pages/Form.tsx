import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import Logo from '@/components/Logo';
import { LogOut, Send, CheckCircle2 } from 'lucide-react';

const ROLE_OPTIONS = [
  { value: 'recruiter', label: 'Recruiter' },
  { value: 'hiring_manager', label: 'Hiring Manager' },
  { value: 'tech_lead', label: 'Tech Lead' },
  { value: 'hr_people_ops', label: 'HR / People Ops' },
  { value: 'other', label: 'Other' },
];

const CONTACT_TYPE_OPTIONS = [
  { value: 'recruiting', label: 'Recruiting opportunity' },
  { value: 'exploratory', label: 'Exploratory conversation' },
  { value: 'networking', label: 'Networking' },
  { value: 'partnership', label: 'Partnership' },
];

const Form = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [contactType, setContactType] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSaving(true);

    const finalRole = role === 'other' ? customRole : ROLE_OPTIONS.find(r => r.value === role)?.label || role;

    try {
      const { error: dbError } = await supabase.from('contacts').insert({
        user_id: user?.id,
        nome,
        email,
        mensagem,
        company,
        role: finalRole,
        contact_type: CONTACT_TYPE_OPTIONS.find(c => c.value === contactType)?.label || contactType,
      });

      if (dbError) throw dbError;

      await supabase.functions.invoke('send-webhook', {
        body: { nome, email, mensagem, company, role: finalRole, contact_type: contactType }
      });

      setSubmitted(true);
    } catch (error: any) {
      console.error('Save error:', error);
      setErrorMsg('Unable to send your message. Please try again later.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size="sm" />
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 text-muted-foreground hover:text-foreground">
            <LogOut className="w-4 h-4" />
            Sign out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-16">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-foreground tracking-tight leading-tight">
            Let's start a professional conversation.
          </h1>
          <p className="mt-3 text-muted-foreground text-base leading-relaxed max-w-xl">
            Recruiters and hiring managers can reach me directly through this channel. This space is designed to prioritize meaningful professional opportunities.
          </p>
        </div>

        {submitted ? (
          <Card className="border-border/50 shadow-lg">
            <CardContent className="py-16 flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Thank you for reaching out.
              </h2>
              <p className="text-muted-foreground text-sm max-w-sm">
                Your message has been received and will be reviewed. Expect a response within a reasonable timeframe.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSubmitted(false);
                  setNome('');
                  setEmail('');
                  setCompany('');
                  setRole('');
                  setCustomRole('');
                  setContactType('');
                  setMensagem('');
                }}
              >
                Send another message
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-border/50 shadow-lg">
            <CardContent className="pt-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Row: Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="nome" className="text-sm font-medium">
                      Full Name
                    </Label>
                    <Input
                      id="nome"
                      placeholder="Your full name"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                </div>

                {/* Company */}
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-sm font-medium">
                    Company / Organization
                  </Label>
                  <Input
                    id="company"
                    placeholder="Where you work"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                {/* Row: Role + Contact Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Role / Position
                    </Label>
                    <Select value={role} onValueChange={setRole} required>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Type of Contact
                    </Label>
                    <Select value={contactType} onValueChange={setContactType} required>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="What brings you here" />
                      </SelectTrigger>
                      <SelectContent>
                        {CONTACT_TYPE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Conditional: Custom role */}
                {role === 'other' && (
                  <div className="space-y-2">
                    <Label htmlFor="customRole" className="text-sm font-medium">
                      Please specify your role
                    </Label>
                    <Input
                      id="customRole"
                      placeholder="e.g. VP of Engineering"
                      value={customRole}
                      onChange={(e) => setCustomRole(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                )}

                <Separator className="my-2" />

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="mensagem" className="text-sm font-medium">
                    Message
                  </Label>
                  <Textarea
                    id="mensagem"
                    placeholder="Share a bit about the opportunity, context, or reason for reaching out."
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    required
                    className="min-h-[140px] resize-none"
                  />
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive">{errorMsg}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 font-medium gap-2"
                  disabled={saving || !role || !contactType}
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          All messages are reviewed personally. Your information is kept confidential.
        </p>
      </main>
    </div>
  );
};

export default Form;
