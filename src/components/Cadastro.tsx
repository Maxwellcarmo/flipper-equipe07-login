import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { validateCPF, formatCPF, validatePassword, validateEmail } from "@/utils/validation";
import { toast } from "sonner";
import logo from "@/assets/logo.jpg";

const Cadastro = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [course, setCourse] = useState("");
  const [userType, setUserType] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({ 
    name: "", 
    email: "", 
    cpf: "", 
    course: "", 
    userType: "", 
    password: "", 
    confirmPassword: "" 
  });

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
    setErrors(prev => ({ ...prev, cpf: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = { 
      name: "", 
      email: "", 
      cpf: "", 
      course: "", 
      userType: "", 
      password: "", 
      confirmPassword: "" 
    };
    
    if (!name.trim()) {
      newErrors.name = "Nome completo é obrigatório";
    }
    
    if (!validateEmail(email)) {
      newErrors.email = "E-mail inválido";
    }
    
    if (!validateCPF(cpf)) {
      newErrors.cpf = "CPF inválido";
    }
    
    if (!course.trim()) {
      newErrors.course = "Curso é obrigatório";
    }
    
    if (!userType) {
      newErrors.userType = "Tipo de usuário é obrigatório";
    }
    
    if (!validatePassword(password)) {
      newErrors.password = "A senha deve ter no mínimo 8 caracteres";
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
    }
    
    if (Object.values(newErrors).some(error => error !== "")) {
      setErrors(newErrors);
      return;
    }
    
    // Salvar dados no localStorage
    const userData = {
      name,
      email,
      cpf: cpf.replace(/\D/g, ''),
      course,
      userType,
      password
    };
    
    // Obter usuários existentes ou criar novo array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Verificar se CPF já existe
    const cpfExists = users.some((user: any) => user.cpf === userData.cpf);
    if (cpfExists) {
      toast.error("CPF já cadastrado!");
      return;
    }
    
    // Adicionar novo usuário
    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));
    
    toast.success("Cadastro realizado com sucesso!");
    
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent to-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-3">
          <div className="flex justify-center">
            <img src={logo} alt="Logo Flipper" className="h-20 w-20 rounded-full" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Criar Conta</CardTitle>
          <CardDescription className="text-center">
            Preencha os dados para se cadastrar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Digite seu nome completo"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors(prev => ({ ...prev, name: "" }));
                }}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors(prev => ({ ...prev, email: "" }));
                }}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

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
              <Label htmlFor="course">Curso</Label>
              <Input
                id="course"
                type="text"
                placeholder="Digite seu curso"
                value={course}
                onChange={(e) => {
                  setCourse(e.target.value);
                  setErrors(prev => ({ ...prev, course: "" }));
                }}
                className={errors.course ? "border-destructive" : ""}
              />
              {errors.course && (
                <p className="text-sm text-destructive">{errors.course}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo de 8 caracteres"
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

            <div className="space-y-2">
              <Label htmlFor="userType">Tipo de Usuário</Label>
              <Select value={userType} onValueChange={(value) => {
                setUserType(value);
                setErrors(prev => ({ ...prev, userType: "" }));
              }}>
                <SelectTrigger className={errors.userType ? "border-destructive" : ""}>
                  <SelectValue placeholder="Selecione o tipo de usuário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aluno">Aluno</SelectItem>
                  <SelectItem value="coordenador">Coordenador</SelectItem>
                  <SelectItem value="administrativo">Administrativo</SelectItem>
                  <SelectItem value="professor">Professor</SelectItem>
                </SelectContent>
              </Select>
              {errors.userType && (
                <p className="text-sm text-destructive">{errors.userType}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Digite a senha novamente"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors(prev => ({ ...prev, confirmPassword: "" }));
                }}
                className={errors.confirmPassword ? "border-destructive" : ""}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/")}
              >
                Voltar
              </Button>
              <Button type="submit" className="flex-1">
                Registrar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Cadastro;
