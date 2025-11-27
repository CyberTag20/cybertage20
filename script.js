// ===== SISTEMA DE FEEDBACK SIMPLIFICADO =====
class FeedbackSystem {
  constructor() {
    this.feedbacks = [];
    this.init();
  }

  init() {
    this.loadFeedbacks();
    this.setupForm();
  }

  loadFeedbacks() {
    // Carregar feedbacks do localStorage
    const saved = localStorage.getItem("portfolio-feedbacks");
    this.feedbacks = saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            name: "Cliente Satisfeito",
            feedback:
              "Excelente trabalho! O sistema superou nossas expectativas.",
            rating: 5,
            timestamp: new Date("2024-01-15").getTime(),
          },
          {
            id: 2,
            name: "Parceiro de Projeto",
            feedback: "Profissional muito competente e dedicado. Recomendo!",
            rating: 5,
            timestamp: new Date("2024-02-01").getTime(),
          },
        ];
    this.renderFeedbacks();
  }

  saveFeedbacks() {
    localStorage.setItem("portfolio-feedbacks", JSON.stringify(this.feedbacks));
  }

  renderFeedbacks() {
    const container = document.getElementById("feedbacksList");
    if (!container) return;

    container.innerHTML = this.feedbacks
      .sort((a, b) => b.timestamp - a.timestamp)
      .map((feedback) => this.createFeedbackHTML(feedback))
      .join("");
  }

  createFeedbackHTML(feedback) {
    const date = new Date(feedback.timestamp).toLocaleDateString("pt-BR");
    const stars = "★".repeat(feedback.rating) + "☆".repeat(5 - feedback.rating);
    const userInitial = feedback.name
      ? feedback.name.charAt(0).toUpperCase()
      : "A";

    return `
      <div class="feedback-item" data-feedback-id="${feedback.id}">
        <div class="feedback-header">
          <div class="feedback-user">
            <div class="user-avatar">${userInitial}</div>
            <div class="user-info">
              <h4>${feedback.name || "Anônimo"}</h4>
              <p class="timestamp">${date}</p>
            </div>
          </div>
          <div class="feedback-rating" title="${feedback.rating} estrelas">
            ${stars}
          </div>
        </div>
        <p class="feedback-content">${this.escapeHTML(feedback.feedback)}</p>
      </div>
    `;
  }

  escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  setupForm() {
    const form = document.getElementById("feedback-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSubmit(form);
    });
  }

  async handleSubmit(form) {
    const submitBtn = form.querySelector(".submit-btn");
    const originalText = submitBtn.innerHTML;

    try {
      submitBtn.innerHTML = '<span class="loading-spinner"></span> Enviando...';
      submitBtn.disabled = true;

      const formData = new FormData(form);
      const feedbackData = {
        name: formData.get("name")?.trim() || "Anônimo",
        feedback: formData.get("feedback").trim(),
        rating: parseInt(formData.get("rating")) || 5,
        timestamp: Date.now(),
      };

      if (!feedbackData.feedback) {
        throw new Error("Por favor, digite seu feedback.");
      }

      if (feedbackData.feedback.length < 10) {
        throw new Error("O feedback deve ter pelo menos 10 caracteres.");
      }

      // Simular envio (substitua por API real quando necessário)
      await this.simulateAPICall(feedbackData);

      // Adicionar feedback localmente
      const newFeedback = {
        id: Date.now(),
        ...feedbackData,
      };

      this.feedbacks.unshift(newFeedback);
      this.saveFeedbacks();
      this.renderFeedbacks();

      // Mostrar mensagem de sucesso
      this.showMessage("Feedback enviado com sucesso! Obrigado.", "success");

      // Resetar formulário
      form.reset();
    } catch (error) {
      this.showMessage(error.message, "error");
      console.error("Erro ao enviar feedback:", error);
    } finally {
      // Restaurar botão
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  }

  simulateAPICall(data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Feedback salvo:", data);
        resolve(data);
      }, 1000);
    });
  }

  showMessage(text, type) {
    // Remover mensagens existentes
    const existingMessages = document.querySelectorAll(".feedback-message");
    existingMessages.forEach((msg) => msg.remove());

    // Criar nova mensagem
    const message = document.createElement("div");
    message.className = `feedback-message ${
      type === "success" ? "success-message" : "error-message"
    }`;
    message.textContent = text;
    message.style.animation = "fadeIn 0.3s ease";

    // Adicionar ao formulário
    const form = document.getElementById("feedback-form");
    form.appendChild(message);

    // Remover após 5 segundos
    setTimeout(() => {
      message.style.animation = "fadeOut 0.3s ease";
      setTimeout(() => message.remove(), 300);
    }, 5000);
  }
}

// ===== FUNÇÕES PARA GERENCIAMENTO DE FEEDBACKS (CONSOLE) =====

// Função para listar todos os feedbacks no console
function listarFeedbacks() {
  const feedbacks = JSON.parse(
    localStorage.getItem("portfolio-feedbacks") || "[]"
  );
  console.log("📝 FEEDBACKS SALVOS:");
  console.log("═".repeat(50));

  if (feedbacks.length === 0) {
    console.log("📭 Nenhum feedback encontrado!");
    return [];
  }

  feedbacks.forEach((fb, index) => {
    console.log(`🔸 ${index + 1}. ID: ${fb.id}`);
    console.log(`   👤 Nome: ${fb.name || "Anônimo"}`);
    console.log(
      `   📅 Data: ${new Date(fb.timestamp).toLocaleString("pt-BR")}`
    );
    console.log(
      `   ⭐ Avaliação: ${"★".repeat(fb.rating)}${"☆".repeat(5 - fb.rating)}`
    );
    console.log(`   💬 Feedback: "${fb.feedback}"`);
    console.log(`   🗑️  Para excluir: excluirFeedback(${fb.id})`);
    console.log("─".repeat(40));
  });

  console.log(`📊 Total: ${feedbacks.length} feedback(s)`);
  return feedbacks;
}

// Função para excluir um feedback pelo ID
function excluirFeedback(id) {
  let feedbacks = JSON.parse(
    localStorage.getItem("portfolio-feedbacks") || "[]"
  );
  const feedbackOriginal = feedbacks.find((fb) => fb.id === id);

  if (!feedbackOriginal) {
    console.log(
      "❌ Feedback não encontrado! Use listarFeedbacks() para ver os IDs disponíveis."
    );
    return false;
  }

  console.log("🚨 CONFIRMAR EXCLUSÃO:");
  console.log(`   ID: ${feedbackOriginal.id}`);
  console.log(`   Nome: ${feedbackOriginal.name || "Anônimo"}`);
  console.log(
    `   Data: ${new Date(feedbackOriginal.timestamp).toLocaleString("pt-BR")}`
  );
  console.log(`   Feedback: "${feedbackOriginal.feedback}"`);

  if (
    confirm(
      `Tem certeza que deseja excluir o feedback de "${
        feedbackOriginal.name || "Anônimo"
      }"?`
    )
  ) {
    feedbacks = feedbacks.filter((fb) => fb.id !== id);
    localStorage.setItem("portfolio-feedbacks", JSON.stringify(feedbacks));

    console.log("✅ Feedback excluído com sucesso!");

    // Atualizar a lista na tela
    if (window.feedbackSystem) {
      window.feedbackSystem.feedbacks = feedbacks;
      window.feedbackSystem.renderFeedbacks();
    }

    return true;
  } else {
    console.log("❕ Exclusão cancelada.");
    return false;
  }
}

// Função para limpar TODOS os feedbacks
function limparTodosFeedbacks() {
  const feedbacks = JSON.parse(
    localStorage.getItem("portfolio-feedbacks") || "[]"
  );

  if (feedbacks.length === 0) {
    console.log("📭 Nenhum feedback para limpar!");
    return;
  }

  console.log("🚨🚨🚨 ATENÇÃO: ISSO EXCLUIRÁ TODOS OS FEEDBACKS! 🚨🚨🚨");
  console.log(`📊 Total de feedbacks que serão excluídos: ${feedbacks.length}`);

  if (
    confirm(
      `🚨 TEM CERTEZA ABSOLUTA que deseja excluir TODOS os ${feedbacks.length} feedbacks? Esta ação NÃO pode ser desfeita!`
    )
  ) {
    localStorage.removeItem("portfolio-feedbacks");
    console.log("✅ Todos os feedbacks foram excluídos!");

    if (window.feedbackSystem) {
      window.feedbackSystem.feedbacks = [];
      window.feedbackSystem.renderFeedbacks();
    }
  } else {
    console.log("❕ Operação cancelada. Feedbacks preservados.");
  }
}

// Função de ajuda para mostrar comandos disponíveis
function ajudaFeedbacks() {
  console.log("🛠️ COMANDOS DISPONÍVEIS PARA GERENCIAR FEEDBACKS:");
  console.log("═".repeat(60));
  console.log("📋 listarFeedbacks()");
  console.log("   → Mostra todos os feedbacks com seus IDs");
  console.log("");
  console.log("🗑️  excluirFeedback(ID)");
  console.log("   → Exclui um feedback específico pelo ID");
  console.log("   → Exemplo: excluirFeedback(1705587600000)");
  console.log("");
  console.log("🧹 limparTodosFeedbacks()");
  console.log("   → Remove TODOS os feedbacks (CUIDADO!)");
  console.log("");
  console.log("❓ ajudaFeedbacks()");
  console.log("   → Mostra esta mensagem de ajuda");
  console.log("═".repeat(60));
}

// ===== FUNCIONALIDADES DO MODAL DE IMAGENS =====
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImg");
const modalCaption = document.getElementById("modalCaption");
const modalCounter = document.getElementById("modalCounter");
const modalPrev = document.getElementById("modalPrev");
const modalNext = document.getElementById("modalNext");

let currentGallery = "";
let currentIndex = 0;
let currentImages = [];

// Função para abrir o modal
function openModal(element, galleryId) {
  currentGallery = galleryId;
  const gallery = document.getElementById(galleryId);
  currentImages = Array.from(
    gallery.querySelectorAll(".horizontal-gallery-item")
  );
  currentIndex = currentImages.indexOf(element);

  updateModal();
  modal.style.display = "block";

  // Prevenir scroll do body quando modal está aberto
  document.body.style.overflow = "hidden";
}

// Função para atualizar o modal
function updateModal() {
  const currentElement = currentImages[currentIndex];
  const img = currentElement.querySelector("img");
  const title = currentElement.querySelector("h3")?.textContent || "";
  const description = currentElement.querySelector("p")?.textContent || "";

  modalImg.src = img.src;
  modalImg.alt = img.alt;
  modalCaption.innerHTML = `<strong>${title}</strong><br>${description}`;
  modalCounter.textContent = `${currentIndex + 1} / ${currentImages.length}`;

  // Atualizar estado dos botões de navegação
  modalPrev.style.display = currentIndex === 0 ? "none" : "flex";
  modalNext.style.display =
    currentIndex === currentImages.length - 1 ? "none" : "flex";
}

// Navegação para a imagem anterior
modalPrev.addEventListener("click", function () {
  if (currentIndex > 0) {
    currentIndex--;
    updateModal();
  }
});

// Navegação para a próxima imagem
modalNext.addEventListener("click", function () {
  if (currentIndex < currentImages.length - 1) {
    currentIndex++;
    updateModal();
  }
});

// Navegação com teclado
document.addEventListener("keydown", function (event) {
  if (modal.style.display === "block") {
    if (event.key === "ArrowLeft" && currentIndex > 0) {
      currentIndex--;
      updateModal();
    } else if (
      event.key === "ArrowRight" &&
      currentIndex < currentImages.length - 1
    ) {
      currentIndex++;
      updateModal();
    }
  }
});

// Fechar modal ao clicar no X
document.querySelector(".close-modal").onclick = function () {
  modal.style.display = "none";
  document.body.style.overflow = "auto";
};

// Fechar modal ao clicar fora da imagem
modal.onclick = function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
};

// Fechar modal com tecla ESC
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && modal.style.display === "block") {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
});

// Controles de navegação das galerias horizontais
document.querySelectorAll(".gallery-btn").forEach((button) => {
  button.addEventListener("click", function () {
    const galleryId = this.getAttribute("data-gallery");
    const gallery = document.getElementById(galleryId);
    const scrollAmount = 320; // Largura do item + gap

    if (this.classList.contains("prev-btn")) {
      gallery.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      gallery.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  });
});

// Efeito de scanline
const scanline = document.querySelector(".scanline");
setInterval(() => {
  scanline.style.animation = "none";
  setTimeout(() => {
    scanline.style.animation = "scan 8s linear infinite";
  }, 10);
}, 8000);

// Atualizar ano no footer
document.getElementById("year").textContent = new Date().getFullYear();

// Inicializar sistemas quando DOM carregar
document.addEventListener("DOMContentLoaded", () => {
  window.feedbackSystem = new FeedbackSystem();

  console.log("🚀 Site inicializado - Modo visitante ativo");
  console.log(
    "📝 Visitantes podem: Ver conteúdo, enviar feedbacks, navegar galerias"
  );
  console.log("💾 Feedbacks são salvos no localStorage do navegador");
  console.log("");
  console.log("🛠️ COMANDOS DE GERENCIAMENTO DISPONÍVEIS:");
  console.log("   Digite 'ajudaFeedbacks()' no console para ver os comandos");
  console.log(
    "   Ou use: listarFeedbacks(), excluirFeedback(ID), limparTodosFeedbacks()"
  );
});
