// projetos.js - Página de Projetos
document.addEventListener('DOMContentLoaded', function() {
    
    function configurarFiltros() {
        const botoesFiltro = document.querySelectorAll('.filter-btn');
        const cardsProjetos = document.querySelectorAll('.project-card');
        
        if (botoesFiltro.length > 0) {
            botoesFiltro.forEach(botao => {
                botao.addEventListener('click', function() {
                    const filtro = this.dataset.filter;
                    
                    botoesFiltro.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    
                    cardsProjetos.forEach(card => {
                        if (filtro === 'all' || card.dataset.category === filtro) {
                            card.style.display = 'block';
                            setTimeout(() => {
                                card.style.opacity = '1';
                                card.style.transform = 'scale(1)';
                            }, 100);
                        } else {
                            card.style.opacity = '0';
                            card.style.transform = 'scale(0.8)';
                            setTimeout(() => {
                                card.style.display = 'none';
                            }, 300);
                        }
                    });
                });
            });
        }
    }

    function animarCardsProjetos() {
        const cards = document.querySelectorAll('.project-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
            observer.observe(card);
        });
    }

    function animarPassosVoluntariado() {
        const passos = document.querySelectorAll('.step');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }
            });
        }, { threshold: 0.2 });

        passos.forEach((passo, index) => {
            passo.style.opacity = '0';
            passo.style.transform = index % 2 === 0 ? 'translateX(-50px)' : 'translateX(50px)';
            passo.style.transition = `opacity 0.6s ease ${index * 0.3}s, transform 0.6s ease ${index * 0.3}s`;
            observer.observe(passo);
        });
    }

    function configurarModalDoacao() {
        const botaoDoar = document.querySelector('.btn-primary');
        
        if (botaoDoar) {
            botaoDoar.addEventListener('click', function() {
                const modal = document.createElement('div');
                modal.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                `;
                
                modal.innerHTML = `
                    <div style="background: white; padding: 2rem; border-radius: 10px; max-width: 500px; width: 90%;">
                        <h3>Doação Online</h3>
                        <p>Em breve teremos nosso sistema de doações online disponível!</p>
                        <p>Enquanto isso, você pode fazer sua doação via transferência bancária:</p>
                        <p><strong>Banco: 001 - Agência: 1234 - Conta: 56789-0</strong></p>
                        <button id="fecharModal" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #e74c3c; color: white; border: none; border-radius: 5px; cursor: pointer;">
                            Fechar
                        </button>
                    </div>
                `;
                
                document.body.appendChild(modal);
                
                document.getElementById('fecharModal').addEventListener('click', function() {
                    document.body.removeChild(modal);
                });
                
                modal.addEventListener('click', function(e) {
                    if (e.target === modal) {
                        document.body.removeChild(modal);
                    }
                });
            });
        }
    }

    function iniciarContadorVoluntarios() {
        const contador = document.querySelector('.volunteers-count');
        if (contador) {
            let count = 0;
            const target = parseInt(contador.textContent);
            const timer = setInterval(() => {
                count += Math.ceil(target / 50);
                if (count >= target) {
                    contador.textContent = target + '+';
                    clearInterval(timer);
                } else {
                    contador.textContent = count + '+';
                }
            }, 50);
        }
    }

    function configurarEfeitosHover() {
        const cards = document.querySelectorAll('.project-card, .method');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            });
        });
    }

    function destacarNavegacaoAtiva() {
        const links = document.querySelectorAll('.nav a');
        const paginaAtual = window.location.pathname.split('/').pop();
        
        links.forEach(link => {
            const linkPagina = link.getAttribute('href');
            if (linkPagina === paginaAtual) {
                link.style.fontWeight = 'bold';
                link.style.color = '#2c3e50';
            }
        });
    }

    function inicializar() {
        configurarFiltros();
        animarCardsProjetos();
        animarPassosVoluntariado();
        configurarModalDoacao();
        configurarEfeitosHover();
        destacarNavegacaoAtiva();
        
        if (document.querySelector('.volunteers-count')) {
            iniciarContadorVoluntarios();
        }
    }

    inicializar();

    const estilo = document.createElement('style');
    estilo.textContent = `
        .project-card, .method {
            transition: all 0.3s ease;
        }
        
        .btn {
            transition: all 0.3s ease;
        }
        
        .btn:hover {
            transform: translateY(-2px);
        }
        
        .filter-btn {
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .filter-btn.active {
            background-color: #3498db;
            color: white;
        }
    `;
    document.head.appendChild(estilo);
});