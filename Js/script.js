// script.js

// Sistema de Cadastro de Animais
class AnimalManagementSystem {
    constructor() {
        this.animals = JSON.parse(localStorage.getItem('ong_animals')) || [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadAnimals();
        this.updateStatistics();
    }

    setupEventListeners() {
        // Modal de cadastro
        const addAnimalBtn = document.getElementById('addAnimalBtn');
        const modal = document.getElementById('animalModal');
        const closeBtn = document.querySelector('.close-btn');
        const animalForm = document.getElementById('animalForm');

        if (addAnimalBtn) {
            addAnimalBtn.addEventListener('click', () => this.openModal());
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeModal();
            });
        }

        if (animalForm) {
            animalForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Filtros
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.filterAnimals(e.target.dataset.filter));
        });

        // Busca
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.searchAnimals(e.target.value));
        }
    }

    openModal(animal = null) {
        const modal = document.getElementById('animalModal');
        const form = document.getElementById('animalForm');
        const modalTitle = document.getElementById('modalTitle');

        if (animal) {
            // Modo edição
            modalTitle.textContent = 'Editar Animal';
            this.populateForm(animal);
            form.dataset.editId = animal.id;
        } else {
            // Modo cadastro
            modalTitle.textContent = 'Cadastrar Animal';
            form.reset();
            delete form.dataset.editId;
        }

        modal.style.display = 'block';
    }

    closeModal() {
        const modal = document.getElementById('animalModal');
        modal.style.display = 'none';
    }

    populateForm(animal) {
        document.getElementById('animalName').value = animal.name || '';
        document.getElementById('animalSpecies').value = animal.species || '';
        document.getElementById('animalBreed').value = animal.breed || '';
        document.getElementById('animalAge').value = animal.age || '';
        document.getElementById('animalGender').value = animal.gender || '';
        document.getElementById('animalSize').value = animal.size || '';
        document.getElementById('animalHealth').value = animal.health || '';
        document.getElementById('animalTemperament').value = animal.temperament || '';
        document.getElementById('animalDescription').value = animal.description || '';
        document.getElementById('animalNeeds').value = animal.specialNeeds || '';
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const animalData = {
            id: e.target.dataset.editId || Date.now().toString(),
            name: formData.get('name'),
            species: formData.get('species'),
            breed: formData.get('breed'),
            age: formData.get('age'),
            gender: formData.get('gender'),
            size: formData.get('size'),
            health: formData.get('health'),
            temperament: formData.get('temperament'),
            description: formData.get('description'),
            specialNeeds: formData.get('specialNeeds'),
            status: 'disponivel',
            registrationDate: new Date().toISOString(),
            photos: [] // Para futura implementação de upload de fotos
        };

        if (e.target.dataset.editId) {
            this.updateAnimal(animalData);
        } else {
            this.addAnimal(animalData);
        }

        this.closeModal();
    }

    addAnimal(animalData) {
        this.animals.push(animalData);
        this.saveToLocalStorage();
        this.loadAnimals();
        this.updateStatistics();
        this.showNotification('Animal cadastrado com sucesso!', 'success');
    }

    updateAnimal(animalData) {
        const index = this.animals.findIndex(animal => animal.id === animalData.id);
        if (index !== -1) {
            this.animals[index] = { ...this.animals[index], ...animalData };
            this.saveToLocalStorage();
            this.loadAnimals();
            this.updateStatistics();
            this.showNotification('Animal atualizado com sucesso!', 'success');
        }
    }

    deleteAnimal(animalId) {
        if (confirm('Tem certeza que deseja excluir este animal?')) {
            this.animals = this.animals.filter(animal => animal.id !== animalId);
            this.saveToLocalStorage();
            this.loadAnimals();
            this.updateStatistics();
            this.showNotification('Animal excluído com sucesso!', 'success');
        }
    }

    updateAnimalStatus(animalId, newStatus) {
        const animal = this.animals.find(a => a.id === animalId);
        if (animal) {
            animal.status = newStatus;
            this.saveToLocalStorage();
            this.loadAnimals();
            this.updateStatistics();
            this.showNotification(`Status atualizado para: ${newStatus}`, 'success');
        }
    }

    loadAnimals(filteredAnimals = null) {
        const animalsToDisplay = filteredAnimals || this.animals;
        const container = document.getElementById('animalsGrid');
        
        if (!container) return;

        if (animalsToDisplay.length === 0) {
            container.innerHTML = '<div class="no-animals"><p>Nenhum animal encontrado</p></div>';
            return;
        }

        container.innerHTML = animalsToDisplay.map(animal => `
            <div class="animal-card" data-status="${animal.status}">
                <div class="animal-image">
                    <img src="${animal.photos?.[0] || 'assets/placeholder-animal.jpg'}" alt="${animal.name}">
                    <span class="status-badge ${animal.status}">${this.getStatusText(animal.status)}</span>
                </div>
                <div class="animal-info">
                    <h3>${animal.name}</h3>
                    <p><strong>Espécie:</strong> ${animal.species}</p>
                    <p><strong>Raça:</strong> ${animal.breed || 'Não informada'}</p>
                    <p><strong>Idade:</strong> ${animal.age}</p>
                    <p><strong>Porte:</strong> ${animal.size}</p>
                    <p class="animal-description">${animal.description || 'Sem descrição'}</p>
                </div>
                <div class="animal-actions">
                    <button class="btn btn-primary" onclick="animalSystem.viewAnimal('${animal.id}')">
                        Ver Detalhes
                    </button>
                    <button class="btn btn-secondary" onclick="animalSystem.openModal(${JSON.stringify(animal).replace(/'/g, "\\'")})">
                        Editar
                    </button>
                    <button class="btn btn-danger" onclick="animalSystem.deleteAnimal('${animal.id}')">
                        Excluir
                    </button>
                    <select class="status-select" onchange="animalSystem.updateAnimalStatus('${animal.id}', this.value)">
                        <option value="disponivel" ${animal.status === 'disponivel' ? 'selected' : ''}>Disponível</option>
                        <option value="adotado" ${animal.status === 'adotado' ? 'selected' : ''}>Adotado</option>
                        <option value="tratamento" ${animal.status === 'tratamento' ? 'selected' : ''}>Em Tratamento</option>
                        <option value="quarentena" ${animal.status === 'quarentena' ? 'selected' : ''}>Quarentena</option>
                    </select>
                </div>
            </div>
        `).join('');
    }

    viewAnimal(animalId) {
        const animal = this.animals.find(a => a.id === animalId);
        if (animal) {
            // Aqui você pode implementar um modal de visualização detalhada
            const details = `
                Nome: ${animal.name}
                Espécie: ${animal.species}
                Raça: ${animal.breed || 'Não informada'}
                Idade: ${animal.age}
                Sexo: ${animal.gender}
                Porte: ${animal.size}
                Saúde: ${animal.health}
                Temperamento: ${animal.temperament}
                Descrição: ${animal.description || 'Sem descrição'}
                Necessidades Especiais: ${animal.specialNeeds || 'Nenhuma'}
                Status: ${this.getStatusText(animal.status)}
            `;
            alert(details);
        }
    }

    filterAnimals(filter) {
        const animalsGrid = document.getElementById('animalsGrid');
        const animalCards = animalsGrid.querySelectorAll('.animal-card');

        animalCards.forEach(card => {
            if (filter === 'all' || card.dataset.status === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });

        // Atualizar botões ativos
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
    }

    searchAnimals(query) {
        const normalizedQuery = query.toLowerCase().trim();
        
        if (normalizedQuery === '') {
            this.loadAnimals();
            return;
        }

        const filteredAnimals = this.animals.filter(animal => 
            animal.name.toLowerCase().includes(normalizedQuery) ||
            animal.species.toLowerCase().includes(normalizedQuery) ||
            animal.breed.toLowerCase().includes(normalizedQuery) ||
            animal.description.toLowerCase().includes(normalizedQuery)
        );

        this.loadAnimals(filteredAnimals);
    }

    updateStatistics() {
        const total = this.animals.length;
        const available = this.animals.filter(a => a.status === 'disponivel').length;
        const adopted = this.animals.filter(a => a.status === 'adotado').length;
        const treatment = this.animals.filter(a => a.status === 'tratamento').length;
        const quarantine = this.animals.filter(a => a.status === 'quarentena').length;

        // Atualizar elementos de estatísticas se existirem
        const statsElements = {
            'totalAnimals': total,
            'availableAnimals': available,
            'adoptedAnimals': adopted,
            'treatmentAnimals': treatment,
            'quarantineAnimals': quarantine
        };

        Object.keys(statsElements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = statsElements[id];
            }
        });
    }

    getStatusText(status) {
        const statusMap = {
            'disponivel': 'Disponível',
            'adotado': 'Adotado',
            'tratamento': 'Em Tratamento',
            'quarentena': 'Quarentena'
        };
        return statusMap[status] || status;
    }

    saveToLocalStorage() {
        localStorage.setItem('ong_animals', JSON.stringify(this.animals));
    }

    showNotification(message, type = 'info') {
        // Implementação simples de notificação
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            backgroundColor: type === 'success' ? '#4CAF50' : '#2196F3',
            color: 'white',
            borderRadius: '5px',
            zIndex: '1000',
            animation: 'slideIn 0.3s ease'
        });

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Método para exportar dados (futura implementação)
    exportData() {
        const dataStr = JSON.stringify(this.animals, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `animais_ong_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    // Método para importar dados (futura implementação)
    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                this.animals = importedData;
                this.saveToLocalStorage();
                this.loadAnimals();
                this.updateStatistics();
                this.showNotification('Dados importados com sucesso!', 'success');
            } catch (error) {
                this.showNotification('Erro ao importar dados!', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Sistema de Gerenciamento de Voluntários
class VolunteerManagementSystem {
    constructor() {
        this.volunteers = JSON.parse(localStorage.getItem('ong_volunteers')) || [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadVolunteers();
    }

    setupEventListeners() {
        // Similar ao sistema de animais, implementar conforme necessário
    }

    // Implementar métodos similares ao AnimalManagementSystem
}

// Sistema de Agendamento
class SchedulingSystem {
    constructor() {
        this.schedules = JSON.parse(localStorage.getItem('ong_schedules')) || [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSchedules();
    }

    setupEventListeners() {
        // Similar ao sistema de animais, implementar conforme necessário
    }

    // Implementar métodos similares ao AnimalManagementSystem
}

// Inicialização do sistema quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    window.animalSystem = new AnimalManagementSystem();
    window.volunteerSystem = new VolunteerManagementSystem();
    window.schedulingSystem = new SchedulingSystem();
});

// Adicionar estilos CSS para as animações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .notification {
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .status-badge {
        position: absolute;
        top: 10px;
        right: 10px;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: bold;
        color: white;
    }
    
    .status-badge.disponivel { background-color: #4CAF50; }
    .status-badge.adotado { background-color: #2196F3; }
    .status-badge.tratamento { background-color: #FF9800; }
    .status-badge.quarentena { background-color: #F44336; }
    
    .no-animals {
        text-align: center;
        padding: 40px;
        color: #666;
    }
`;
document.head.appendChild(style);