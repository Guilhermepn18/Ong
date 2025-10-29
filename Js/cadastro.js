// cadastro.js - Tudo em um arquivo só
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('volunteer-form');
    
    function aplicarMascaras() {
        const cpf = document.getElementById('cpf');
        cpf.addEventListener('input', function(e) {
            let valor = e.target.value.replace(/\D/g, '');
            if (valor.length > 11) valor = valor.slice(0, 11);
            
            if (valor.length > 9) {
                valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d)/, '$1.$2.$3-$4');
            } else if (valor.length > 6) {
                valor = valor.replace(/(\d{3})(\d{3})(\d)/, '$1.$2.$3');
            } else if (valor.length > 3) {
                valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
            }
            e.target.value = valor;
        });

        const phone = document.getElementById('phone');
        phone.addEventListener('input', function(e) {
            let valor = e.target.value.replace(/\D/g, '');
            if (valor.length > 11) valor = valor.slice(0, 11);
            
            if (valor.length > 6) {
                valor = valor.replace(/(\d{2})(\d{5})(\d)/, '($1) $2-$3');
            } else if (valor.length > 2) {
                valor = valor.replace(/(\d{2})(\d)/, '($1) $2');
            }
            e.target.value = valor;
        });

        const cep = document.getElementById('cep');
        cep.addEventListener('input', function(e) {
            let valor = e.target.value.replace(/\D/g, '');
            if (valor.length > 8) valor = valor.slice(0, 8);
            
            if (valor.length > 5) {
                valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
            }
            e.target.value = valor;
        });
    }


    function validarFormulario() {

        const nome = document.getElementById('fullname').value.trim();
        if (nome.length < 3) {
            alert('Nome deve ter pelo menos 3 caracteres');
            return false;
        }

        const email = document.getElementById('email').value;
        if (!email.includes('@') || !email.includes('.')) {
            alert('Digite um email válido');
            return false;
        }

        const cpf = document.getElementById('cpf').value.replace(/\D/g, '');
        if (cpf.length !== 11) {
            alert('CPF deve ter 11 dígitos');
            return false;
        }

        const telefone = document.getElementById('phone').value.replace(/\D/g, '');
        if (telefone.length < 10) {
            alert('Telefone deve ter pelo menos 10 dígitos');
            return false;
        }

        const dataNascimento = document.getElementById('birthdate').value;
        if (!dataNascimento) {
            alert('Data de nascimento é obrigatória');
            return false;
        }

        const interesses = document.querySelectorAll('input[name="interest"]:checked');
        if (interesses.length === 0) {
            alert('Selecione pelo menos uma forma de contribuição');
            return false;
        }

        return true;
    }


    function configurarContadorCaracteres() {
        const mensagem = document.getElementById('message');
        const contador = document.querySelector('.char-count');
        
        mensagem.addEventListener('input', function() {
            contador.textContent = `${this.value.length}/500 caracteres`;
        });
    }

    function configurarBuscaCEP() {
        const cep = document.getElementById('cep');
        
        cep.addEventListener('blur', async function() {
            const cepLimpo = this.value.replace(/\D/g, '');
            
            if (cepLimpo.length === 8) {
                try {
                    const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
                    const dados = await resposta.json();
                    
                    if (!dados.erro) {
                        document.getElementById('address').value = dados.logradouro;
                        document.getElementById('city').value = dados.localidade;
                        document.getElementById('state').value = dados.uf;
                    }
                } catch (error) {
                    console.log('Erro ao buscar CEP');
                }
            }
        });
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validarFormulario()) {
            alert('Cadastro realizado com sucesso! Obrigado por se juntar à nossa causa!');
            form.reset();
            document.querySelector('.char-count').textContent = '0/500 caracteres';
        }
    });

    aplicarMascaras();
    configurarContadorCaracteres();
    configurarBuscaCEP();
});