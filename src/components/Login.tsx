import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { validateCPF, formatCPF, validateEmail } from "@/utils/validation";
import { toast } from "sonner";
import logo from "@/assets/logo.jpg";

const Login = () => {
  const navigate = useNavigate();
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [errors, setErrors] = useState({ cpf: "", password: "", email: "" });

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
    setErrors(prev => ({ ...prev, cpf: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = { cpf: "", password: "", email: "" };
    
    if (!validateCPF(cpf)) {
      newErrors.cpf = "CPF inválido";
    }
    
    if (!password) {
      newErrors.password = "Senha é obrigatória";
    }
    
    if (newErrors.cpf || newErrors.password) {
      setErrors(newErrors);
      return;
    }
    
    // Verificar credenciais no localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const cleanCPF = cpf.replace(/\D/g, '');
    const user = users.find((u: any) => u.cpf === cleanCPF && u.password === password);
    
    if (!user) {
      toast.error("CPF ou senha inválidos!");
      return;
    }
    
    // Salvar usuário logado
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    toast.success("Login realizado com sucesso!");
    navigate("/perfil");
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(!showForgotPassword);
    setRecoveryEmail("");
    setErrors(prev => ({ ...prev, email: "" }));
  };

  const handleSendRecoveryEmail = () => {
    if (!validateEmail(recoveryEmail)) {
      setErrors(prev => ({ ...prev, email: "E-mail inválido" }));
      return;
    }
    toast.success("E-mail de recuperação enviado!");
    setShowForgotPassword(false);
    setRecoveryEmail("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent to-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-3">
          <div className="flex justify-center">
            <img src={logo} alt="Logo Flipper" className="h-20 w-20 rounded-full" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Flipper</CardTitle>
          <CardDescription className="text-center">
            Entre com suas credenciais para acessar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                type="text"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={handleCPFChange}
                maxLength={14}
                className={errors.cpf ? "border-destructive" : ""}
              />
              {errors.cpf && (
                <p className="text-sm text-destructive">{errors.cpf}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors(prev => ({ ...prev, password: "" }));
                }}
                className={errors.password ? "border-destructive" : ""}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-primary hover:underline"
            >
              Esqueci minha senha
            </button>

            {showForgotPassword && (
              <div className="space-y-2 pt-2 pb-2 border-t">
                <Label htmlFor="recoveryEmail">E-mail para recuperação</Label>
                <Input
                  id="recoveryEmail"
                  type="email"
                  placeholder="Digite seu e-mail cadastrado"
                  value={recoveryEmail}
                  onChange={(e) => {
                    setRecoveryEmail(e.target.value);
                    setErrors(prev => ({ ...prev, email: "" }));
                  }}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
                <Button 
                  type="button" 
                  onClick={handleSendRecoveryEmail}
                  className="w-full"
                  variant="secondary"
                >
                  Enviar senha para e-mail
                </Button>
              </div>
            )}

            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-sm text-muted-foreground text-center">
            Não tem uma conta?
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/cadastro")}
          >
            Cadastrar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
