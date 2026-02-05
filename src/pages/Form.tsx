import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Novo Contato</h1>
          <Button variant="outline" onClick={handleLogout}>Sair</Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mensagem">Mensagem</Label>
            <Textarea
              id="mensagem"
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              required
            />
          </div>

          {message && (
            <p className={`text-sm ${message.includes('Erro') ? 'text-destructive' : 'text-primary'}`}>
              {message}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Form;
