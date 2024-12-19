// Script para manipulação do menu
function toggleMenu() {
    const menu = document.getElementById('nav-links');
    menu.classList.toggle('show');
}

// Função para manipular os serviços
document.getElementById('service-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Coleta os dados do formulário
    const clientName = document.getElementById('client-name').value;
    const serviceDescription = document.getElementById('service-description').value;
    const dueDate = document.getElementById('due-date').value;
    const programmingLanguage = document.getElementById('programming-language').value;
    const tool = document.getElementById('tool').value;
    const serverSite = document.getElementById('server-site').value;
    const priority = document.getElementById('priority').value;
    const whatsapp = document.getElementById('whatsapp').value;
    const email = document.getElementById('email').value;

    // Validação básica para garantir que todos os campos foram preenchidos
    if (!clientName || !serviceDescription || !dueDate || !priority || !whatsapp || !email || !programmingLanguage || !tool || !serverSite) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    // Cria o novo item de serviço
    const serviceItem = document.createElement('li');
    serviceItem.classList.add('service-item');
    serviceItem.innerHTML = `
      <p><strong>Cliente:</strong> ${clientName}</p>
      <p><strong>Serviço:</strong> ${serviceDescription}</p>
      <p><strong>Entrega:</strong> ${dueDate}</p>
      <p><strong>Linguagem:</strong> ${programmingLanguage}</p>
      <p><strong>Ferramenta:</strong> ${tool}</p>
      <p><strong>Site do Servidor:</strong> ${serverSite}</p>
      <p><strong>Prioridade:</strong> ${priority}</p>
      <p><strong>WhatsApp:</strong> ${whatsapp}</p>
      <p><strong>E-mail:</strong> ${email}</p>
      <div class="action-buttons">
        <button class="complete-btn" onclick="completeService(this)">Concluir</button>
        <button class="edit-btn" onclick="editService(this)">Editar</button>
        <button class="delete-btn" onclick="deleteService(this)">Excluir</button>
      </div>
    `;
    
    // Adiciona o serviço à lista de pendentes
    document.getElementById('pending-services').appendChild(serviceItem);

    // Adiciona a data ao calendário
    addDateToCalendar(dueDate);

    // Atualiza contagem regressiva
    updateCountdown();

    // Limpa o formulário
    document.getElementById('service-form').reset();
    updateServiceCount();
});

// Função para adicionar uma data ao calendário
function addDateToCalendar(date) {
    const calendar = document.getElementById('calendar-grid');
    const event = document.createElement('div');
    event.classList.add('calendar-event');
    event.innerHTML = `<p>Serviço marcado: ${date}</p>`;
    calendar.appendChild(event);
}

// Função para atualizar a contagem regressiva
function updateCountdown() {
    const dates = Array.from(document.querySelectorAll('.calendar-event p')).map(event => new Date(event.textContent.split(": ")[1]));
    if (dates.length > 0) {
        const now = new Date();
        const nextDate = dates.sort((a, b) => a - b).find(date => date > now);

        if (nextDate) {
            const diffTime = Math.abs(nextDate - now);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            document.getElementById('countdown').textContent = `Próximo serviço em: ${diffDays} dia(s)`;
        } else {
            document.getElementById('countdown').textContent = "Nenhum serviço futuro.";
        }
    }
}

// Função para marcar serviço como concluído
function completeService(button) {
    const serviceItem = button.closest('.service-item');
    document.getElementById('completed-services').appendChild(serviceItem);
    button.textContent = 'Serviço Completo';
    button.setAttribute('disabled', 'true');
    updateServiceCount();
}

// Função para editar um serviço
function editService(button) {
    const serviceItem = button.closest('.service-item');
    const details = Array.from(serviceItem.querySelectorAll('p')).map(p => p.textContent.split(": ")[1]);

    // Preenche o formulário com os dados do serviço
    document.getElementById('client-name').value = details[0];
    document.getElementById('service-description').value = details[1];
    document.getElementById('due-date').value = details[2];
    document.getElementById('programming-language').value = details[3];
    document.getElementById('tool').value = details[4];
    document.getElementById('server-site').value = details[5];
    document.getElementById('priority').value = details[6];

    // Restaura o botão de adicionar serviço
    document.querySelector('button[type="submit"]').textContent = 'Salvar Alterações';
}

// Função para excluir um serviço
function deleteService(button) {
    const serviceItem = button.closest('.service-item');
    serviceItem.remove();
    updateServiceCount();
}

// Função para atualizar a contagem de serviços
function updateServiceCount() {
    const totalServices = document.getElementById('pending-services').children.length + document.getElementById('completed-services').children.length;
    document.getElementById('total-services').textContent = totalServices;

    const completedCount = document.getElementById('completed-services').children.length;
    document.getElementById('completed-count').textContent = completedCount;

    const pendingCount = document.getElementById('pending-services').children.length;
    document.getElementById('pending-count').textContent = pendingCount;
}

// Função para renderizar o calendário
document.addEventListener("DOMContentLoaded", () => {
    const calendarContainer = document.getElementById("calendar-grid");
    const currentMonthEl = document.getElementById("current-month");
    const prevMonthBtn = document.getElementById("prev-month");
    const nextMonthBtn = document.getElementById("next-month");
    const countdownEl = document.getElementById("next-service-countdown");

    let currentDate = new Date();

    const renderCalendar = () => {
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        currentMonthEl.textContent = firstDay.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
        calendarContainer.innerHTML = "";

        // Preencher os dias em branco antes do primeiro dia do mês
        for (let i = 0; i < firstDay.getDay(); i++) {
            const emptyDay = document.createElement("div");
            emptyDay.className = "calendar-day";
            calendarContainer.appendChild(emptyDay);
        }

        // Preencher os dias do mês
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const dayEl = document.createElement("div");
            dayEl.className = "calendar-day";
            dayEl.textContent = day;

            // Destacar dias com eventos
            const events = JSON.parse(localStorage.getItem('events') || '{}');
            if (events[dateStr]) {
                dayEl.classList.add("event");
                dayEl.title = events[dateStr];
            }

            calendarContainer.appendChild(dayEl);
        }

        updateCountdown();
    };

    const updateCountdown = () => {
        const today = new Date().setHours(0, 0, 0, 0);
        const events = JSON.parse(localStorage.getItem('events') || '{}');
        const upcomingEvent = Object.keys(events)
            .map(date => new Date(date))
            .find(eventDate => eventDate >= today);

        if (upcomingEvent) {
            const daysLeft = Math.ceil((upcomingEvent - today) / (1000 * 60 * 60 * 24));
            countdownEl.textContent = `Próximo evento: ${events[upcomingEvent.toISOString().split("T")[0]]} em ${daysLeft} dia(s).`;
        } else {
            countdownEl.textContent = "Sem eventos futuros.";
        }
    };

    prevMonthBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    renderCalendar();
});
// Selecionar todos os botões de emissão de nota
const issueButtons = document.querySelectorAll('.issue-invoice-btn');
const hideButtons = document.querySelectorAll('.hide-invoice-btn');

// Função para gerar a nota fiscal
issueButtons.forEach(button => {
    button.addEventListener('click', function () {
        // Exibir a nota fiscal
        const invoiceDetails = this.nextElementSibling;
        invoiceDetails.style.display = 'block';

        // Adicionar a data de emissão
        const invoiceDate = invoiceDetails.querySelector('#invoice-date');
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('pt-BR');
        invoiceDate.textContent = formattedDate;
    });
});

// Função para esconder a nota fiscal
hideButtons.forEach(button => {
    button.addEventListener('click', function () {
        // Esconder a nota fiscal
        const invoiceDetails = this.closest('.service-details');
        invoiceDetails.style.display = 'none';
    });
});
