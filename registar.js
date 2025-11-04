document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const cpfInput = document.getElementById('cpf');
    const senhaInput = document.getElementById('senha');
    const confirmaSenhaInput = document.getElementById('confirmaSenha');
    const togglePasswordIcons = document.querySelectorAll('.toggle-password');
    const dolphinLogo = document.getElementById('dolphinLogo'); // Pega a tag <img>

    // Nomes dos arquivos de logo (confirmados por você)
    const CLOSED_EYE_SRC = 'logofechado.jpg'; 
    const OPEN_EYE_SRC = 'logoaberto.jpg'; 

    // --- 1. Máscara de CPF (Mantida) ---
    cpfInput.addEventListener('input', function(e) {
        let value = e.target.value;
        value = value.replace(/\D/g, "");
        
        if (value.length > 3) value = value.substring(0, 3) + '.' + value.substring(3);
        if (value.length > 7) value = value.substring(0, 7) + '.' + value.substring(7);
        if (value.length > 11) value = value.substring(0, 11) + '-' + value.substring(11);

        e.target.value = value;
    });

    // --- 2. Alternância de Visibilidade da Senha E EFEITO GOLFINHO ---
    togglePasswordIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);

            // 1. Alterna o tipo de input
            const isPassword = (passwordInput.type === 'password');
            passwordInput.type = isPassword ? 'text' : 'password';

            // 2. Alterna o ícone de olho
            this.classList.toggle('far'); // remove far-eye
            this.classList.toggle('fas'); // adiciona fas-eye-slash
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');

            // 3. EFEITO DO GOLFINHO: Verifica o estado da SENHA PRINCIPAL
            // Se o campo principal de senha (ID 'senha') estiver visível, o golfinho abre o olho
            // Senão, ele volta para o olho fechado.
            // Isso garante que a logo mude apenas uma vez, independentemente de qual campo de senha seja clicado.
            if (senhaInput.type === 'text' || confirmaSenhaInput.type === 'text') {
                dolphinLogo.src = OPEN_EYE_SRC; // Pelo menos um campo de senha está visível
            } else {
                dolphinLogo.src = CLOSED_EYE_SRC; // Ambos os campos de senha estão ocultos
            }
        });
    });

    // --- 3. Validação de Envio do Formulário e salvamento em localStorage ---
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const cpfRaw = cpfInput.value.replace(/\D/g, ''); // somente números
        const curso = document.getElementById('curso').value.trim();
        const tipoUsuario = document.getElementById('tipoUsuario').value;
        const senha = senhaInput.value;
        const confirma = confirmaSenhaInput.value;

        if (senha !== confirma) {
            alert('Erro: As senhas não coincidem. Por favor, verifique.');
            confirmaSenhaInput.focus();
            return;
        }

        if (senha.length < 8) {
            alert('A senha deve ter no mínimo 8 caracteres.');
            senhaInput.focus();
            return;
        }

        // Carrega lista existente de usuários
        let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');

        // Verifica CPF já cadastrado
        if (usuarios.some(u => u.cpf === cpfRaw)) {
            alert('CPF já cadastrado. Tente fazer login ou recupere a senha.');
            return;
        }

        // Adiciona novo usuário (armazenamos CPF sem formatação)
        usuarios.push({ nome, email, cpf: cpfRaw, curso, tipoUsuario, senha });
        localStorage.setItem('usuarios', JSON.stringify(usuarios));

        alert('Cadastro realizado com sucesso! Você será redirecionado para o login.');
        window.location.href = 'login.html';
    });
    
    // 4. Funcionalidade do Botão Voltar (Mantida)
    const backButton = document.querySelector('.btn-voltar');
    backButton.addEventListener('click', function() {
        alert('Botão "Voltar" acionado! (Ação simulada)');
        // Para voltar para a página anterior, use: window.history.back(); 
    });
});