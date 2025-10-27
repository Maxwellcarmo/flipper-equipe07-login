import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCPF } from "@/utils/validation";
import logo from "@/assets/logo.jpg";

interface UserData {
  name: string;
  email: string;
  cpf: string;
  course: string;
  userType: string;
  password: string;
}

const userTypeLabels: { [key: string]: string } = {
  aluno: "Aluno",
  coordenador: "Coordenador",
  administrativo: "Administrativo",
  professor: "Professor"
};

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      navigate("/");
      return;
    }
    setUserData(JSON.parse(currentUser));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate("/");
  };

  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent to-background p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="space-y-3">
          <div className="flex justify-center">
            <img src={logo} alt="Logo Flipper" className="h-20 w-20 rounded-full" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Perfil do Usuário</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground">Nome Completo</h3>
              <p className="text-lg font-medium">{userData.name}</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground">CPF (Credencial de Acesso)</h3>
              <p className="text-lg font-medium">{formatCPF(userData.cpf)}</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground">E-mail</h3>
              <p className="text-lg font-medium">{userData.email}</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground">Curso</h3>
              <p className="text-lg font-medium">{userData.course}</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground">Nível de Acesso</h3>
              <p className="text-lg font-medium">{userTypeLabels[userData.userType] || userData.userType}</p>
            </div>
          </div>

          <Button 
            onClick={handleLogout}
            className="w-full"
            variant="outline"
          >
            Sair
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
