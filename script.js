/* ===================================================
   LIONLOBS — Premium JavaScript v3.0 OTIMIZADO
   Performance First — Sem Travamentos
   =================================================== */

'use strict';

// ===== UTILITÁRIOS =====
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ===== HEADER SCROLL =====
(function initHeader() {
  const header = $('#header');
  if (!header) return;

  let ticking = false;
  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        header.classList.toggle('scrolled', window.scrollY > 60);
        ticking = false;
      });
      ticking = true;
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ===== MENU MOBILE =====
(function initMobileMenu() {
  const toggle = $('#menuToggle');
  const menu   = $('#navMenu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  $$('.nav-link', menu).forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('click', e => {
    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
})();

// ===== MODAL DE LOGIN =====
(function initLogin() {
  const overlay   = $('#loginOverlay');
  const btnLogin  = $('#btnLogin');
  const btnClose  = $('#loginClose');
  const footerBtn = $('#footerLogin');
  if (!overlay) return;

  const openModal = () => {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  const closeModal = () => {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  btnLogin?.addEventListener('click', openModal);
  footerBtn?.addEventListener('click', e => { e.preventDefault(); openModal(); });
  btnClose?.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
})();

// ===== TOAST NOTIFICATION =====
function showToast(message, type = 'info') {
  const existing = $('.ll-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'll-toast';
  toast.style.cssText = `
    position: fixed;
    bottom: 32px;
    right: 32px;
    background: ${type === 'success' ? 'linear-gradient(135deg, #a68354, #cea973)' : '#1f1c1d'};
    color: ${type === 'success' ? '#1f1c1d' : '#fff'};
    padding: 16px 24px;
    border-radius: 12px;
    font-size: 0.9rem;
    font-weight: 600;
    box-shadow: 0 8px 30px rgba(0,0,0,0.4);
    z-index: 99999;
    transform: translateY(20px);
    opacity: 0;
    transition: all 0.4s ease;
    max-width: 320px;
    border: 1px solid rgba(206,169,115,0.3);
  `;
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
  });

  setTimeout(() => {
    toast.style.transform = 'translateY(20px)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// ===== FADE IN ON SCROLL (IntersectionObserver) =====
(function initFadeIn() {
  const elements = $$('.fade-in, .fade-in-left, .fade-in-right');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const siblings = [...entry.target.parentElement.children];
        const index = siblings.indexOf(entry.target);
        const delay = Math.min(index * 80, 400);

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
})();

// ===== CONTADORES ANIMADOS =====
(function initCounters() {
  const counters = $$('.result-num[data-target]');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 2000;
    const start    = performance.now();

    const update = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      el.textContent = Math.floor(ease * target);
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

// ===== FAQ ACCORDION =====
(function initFAQ() {
  const items = $$('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn = item.querySelector('.faq-q');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
})();

// ===== SMOOTH SCROLL =====
(function initSmoothScroll() {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = $(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      const headerH = $('#header')?.offsetHeight || 80;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

// ===== ACTIVE NAV LINK =====
(function initActiveNav() {
  const sections = $$('section[id]');
  const links    = $$('.nav-link[href^="#"]');
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-80px 0px -60% 0px'
  });

  sections.forEach(s => observer.observe(s));
})();

// ===== FORMULÁRIO DE CONTATO =====
(function initContactForm() {
  const form = $('#contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const btn  = form.querySelector('button[type="submit"]');
    const span = btn.querySelector('span');

    const nome = form.querySelector('input[type="text"]')?.value || 'Cliente';
    const whatsapp = form.querySelector('input[type="tel"]')?.value || '';
    const email = form.querySelector('input[type="email"]')?.value || '';
    const servico = form.querySelector('select')?.value || 'Serviço não especificado';
    const mensagem = form.querySelector('textarea')?.value || '';

    const textoWhatsApp = `Olá LionLobs!\n\nMeu nome é ${nome}\nWhatsApp: ${whatsapp}\nE-mail: ${email}\n\nServiço de Interesse: ${servico}\n\nMensagem: ${mensagem}`;
    const mensagemCodificada = encodeURIComponent(textoWhatsApp);
    const linkWhatsApp = `https://wa.me/5548984380321?text=${mensagemCodificada}`;

    btn.disabled = true;
    if (span) span.textContent = 'Redirecionando...';

    setTimeout(() => {
      window.open(linkWhatsApp, '_blank');
      btn.disabled = false;
      if (span) span.textContent = 'Enviar Mensagem';
      form.reset();
      showToast('Abrindo WhatsApp com sua mensagem pronta!', 'success');
    }, 800);
  });
})();

// ===== NEWSLETTER =====
(function initNewsletter() {
  const btn = $('.newsletter button');
  const inp = $('.newsletter input');
  if (!btn || !inp) return;

  btn.addEventListener('click', () => {
    const email = inp.value.trim();
    if (!email || !email.includes('@')) {
      showToast('Por favor, insira um e-mail válido.');
      return;
    }
    inp.value = '';
    showToast('Inscrição realizada com sucesso! Confira seu e-mail.', 'success');
  });
})();

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  console.log('%c🦁 LionLobs — Site Premium v3.0 OTIMIZADO', 'color: #cea973; font-size: 14px; font-weight: bold;');
});

// ===== CHATBOT IA =====
(function initAIChatbot() {
  const floatBtn = $('#aiFloatBtn');
  const chatbot = $('#aiChatbot');
  const closeBtn = $('#aiClose');
  const input = $('#aiInput');
  const sendBtn = $('#aiSend');
  const messagesContainer = $('#aiMessages');
  const quickReplies = $$('.ai-quick-btn');

  if (!floatBtn || !chatbot) return;

  const aiResponses = {
    'Quais são seus serviços?': 'Oferecemos edição profissional de vídeos, gerenciamento completo de redes sociais, identidade visual e branding, landing pages premium, tráfego pago estratégico, e consultoria em neuromarketing. Qual desses serviços te interessa?',
    'Qual é o valor dos pacotes?': 'Nossos pacotes variam de acordo com o serviço. Temos opções desde 1 vídeo editado até planos mensais com 16 vídeos/mês. Para valores específicos, recomendo falar com nosso especialista via WhatsApp!',
    'Como funciona o suporte?': 'Oferecemos suporte diário via WhatsApp em todos os nossos planos. Você terá acesso direto ao nosso time para tirar dúvidas, solicitar ajustes e acompanhar seus projetos em tempo real.',
    'Falar com um especialista': 'Ótimo! Vou conectá-lo com nosso especialista. Clique no botão "Acessar via WhatsApp" para falar diretamente conosco. Estamos prontos para ajudar!'
  };

  floatBtn.addEventListener('click', () => {
    chatbot.classList.add('active');
    input.focus();
  });

  closeBtn.addEventListener('click', () => {
    chatbot.classList.remove('active');
  });

  document.addEventListener('click', e => {
    if (!chatbot.contains(e.target) && !floatBtn.contains(e.target) && !e.target.closest('.ai-quick-btn')) {
      chatbot.classList.remove('active');
    }
  });

  const sendMessage = () => {
    const text = input.value.trim();
    if (!text) return;

    const userMsg = document.createElement('div');
    userMsg.className = 'ai-message ai-message-user';
    userMsg.innerHTML = `<div class="ai-message-content">${escapeHtml(text)}</div>`;
    messagesContainer.appendChild(userMsg);

    input.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    setTimeout(() => {
      const response = aiResponses[text] || getDefaultResponse(text);
      const botMsg = document.createElement('div');
      botMsg.className = 'ai-message ai-message-bot';
      botMsg.innerHTML = `<div class="ai-message-content">${response}</div>`;
      messagesContainer.appendChild(botMsg);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      input.focus();
    }, 600);
  };

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  });

  quickReplies.forEach(btn => {
    btn.addEventListener('click', () => {
      const question = btn.dataset.question;
      input.value = question;
      setTimeout(() => {
        input.focus();
        sendMessage();
      }, 100);
    });
  });

  function getDefaultResponse(userInput) {
    const lower = userInput.toLowerCase();
    
    if (lower.includes('preço') || lower.includes('valor') || lower.includes('custa')) {
      return 'Temos opções de pacotes para todos os orçamentos! Desde edição de vídeos individuais até planos mensais completos. Fale com nosso especialista para um orçamento personalizado.';
    }
    if (lower.includes('video') || lower.includes('edição')) {
      return 'Nossa edição de vídeos inclui roteiro pronto, edição profissional e legendas otimizadas. Temos pacotes de 1 a 16 vídeos por mês!';
    }
    if (lower.includes('rede') || lower.includes('social') || lower.includes('instagram') || lower.includes('tiktok')) {
      return 'Gerenciamos suas redes sociais com conteúdo profissional, design, legendas e postagens no melhor horário. Suporte diário incluído!';
    }
    if (lower.includes('contato') || lower.includes('whatsapp') || lower.includes('telefone')) {
      return 'Você pode nos contatar via WhatsApp (48) 98438-0321 ou email lionlobs@gmail.com. Resposta em até 2 horas!';
    }
    if (lower.includes('obrigado') || lower.includes('vlw') || lower.includes('thanks')) {
      return 'De nada! Fico feliz em ajudar. Tem mais alguma dúvida?';
    }
    
    return 'Ótima pergunta! Para uma resposta mais detalhada, recomendo falar com nosso especialista via WhatsApp. Estamos sempre prontos para ajudar!';
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  floatBtn.addEventListener('click', () => {
    setTimeout(() => input.focus(), 300);
  });
})();
