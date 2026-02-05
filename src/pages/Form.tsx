import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Logo from '@/components/Logo';
import { LogOut, Send } from 'lucide-react';

const Form = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setSaving(true);

    try {
      // Save to database
      const { error: dbError } = await supabase.from('contacts').insert({
        user_id: user?.id,
        nome,
        email,
        mensagem
      });

      if (dbError) throw dbError;

      // Send to webhook
      await supabase.functions.invoke('send-webhook', {
        body: { nome, email, mensagem }
      });

      setMessage('Contato salvo com sucesso!');
      setNome('');
      setEmail('');
      setMensagem('');
    } catch (error: any) {
      setMessage('Erro ao salvar: ' + error.message);
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
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="sm" />
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 text-muted-foreground hover:text-foreground">
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-12">
        <Card className="border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Novo Contato</CardTitle>
            <CardDescription>
              Preencha as informações abaixo para adicionar um novo contato
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-sm font-medium">
                  Nome
                </Label>
                <Input
                  id="nome"
                  placeholder="Nome completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mensagem" className="text-sm font-medium">
                  Mensagem
                </Label>
                <Textarea
                  id="mensagem"
                  placeholder="Digite sua mensagem..."
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  required
                  className="min-h-[120px] resize-none"
                />
              </div>

              {message && (
                <div className={`p-3 rounded-lg border ${
                  message.includes('Erro') 
                    ? 'bg-destructive/10 border-destructive/20' 
                    : 'bg-primary/10 border-primary/20'
                }`}>
                  <p className={`text-sm ${message.includes('Erro') ? 'text-destructive' : 'text-primary'}`}>
                    {message}
                  </p>
                </div>
              )}

              <Button type="submit" className="w-full h-11 font-medium gap-2" disabled={saving}>
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Salvar Contato
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Form;
