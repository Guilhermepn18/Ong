// main.js - Página Inicial
document.addEventListener('DOMContentLoaded', function() {
    
    function configurarScrollSuave() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    function configurarAnimacaoScroll() {
        const elementos = document.querySelectorAll('.about, .contact');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1
        });

        elementos.forEach(elemento => {
            elemento.style.opacity = '0';
            elemento.style.transform = 'translateY(20px)';
            elemento.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(elemento);
        });
    }

    function configurarEfeitosHover() {
        const botoes = document.querySelectorAll('.btn');
        
        botoes.forEach(botao => {
            botao.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            });
            
            botao.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            });
        });
    }

    function iniciarContadores() {
        const estatisticas = [
            { elemento: '.voluntarios-count', valor: 500 },
            { elemento: '.projetos-count', valor: 25 },
            { elemento: '.comunidades-count', valor: 50 }
        ];

        estatisticas.forEach(estatistica => {
            const elemento = document.querySelector(estatistica.elemento);
            if (elemento) {
                let contador = 0;
                const incremento = estatistica.valor / 50;
                const timer = setInterval(() => {
                    contador += incremento;
                    if (contador >= estatistica.valor) {
                        elemento.textContent = estatistica.valor + '+';
                        clearInterval(timer);
                    } else {
                        elemento.textContent = Math.floor(contador) + '+';
                    }
                }, 30);
            }
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
        configurarScrollSuave();
        configurarAnimacaoScroll();
        configurarEfeitosHover();
        destacarNavegacaoAtiva();
        
        if (document.querySelector('.voluntarios-count')) {
            iniciarContadores();
        }
    }

    inicializar();

    const estilo = document.createElement('style');
    estilo.textContent = `
        .btn {
            transition: all 0.3s ease;
        }
        
        .nav a {
            transition: color 0.3s ease;
        }
        
        .nav a:hover {
            color: #3498db;
        }
        
        .social-links a {
            transition: transform 0.3s ease;
        }
        
        .social-links a:hover {
            transform: scale(1.1);
        }
    `;
    document.head.appendChild(estilo);
});