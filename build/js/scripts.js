// Custom Scripts
// Custom scripts
function initTabs() {
  function initFormTabs(formSelector) {
    const form = document.querySelector(formSelector);
    if (!form) return;

    const tabBtns = form.querySelectorAll('[data-btn]');
    const tabContents = form.querySelectorAll('[data-content]');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabTarget = btn.dataset.btn;

        tabBtns.forEach(btn => btn.classList.remove('active'));
        btn.classList.add('active');

        tabContents.forEach(content => {
          if (content.dataset.content === tabTarget) {
            content.classList.add('active');
          } else {
            content.classList.remove('active');
          }
        });
      });
    });
  }

  initFormTabs('.deposit__form');
  initFormTabs('.withdrawal__form');
}

initTabs();


function initAccordion() {
  const accordionItems = document.querySelectorAll('[data-accordion-item]');

  accordionItems.forEach(item => {
    const title = item.querySelector('[data-accordion-title]');

    title.addEventListener('click', () => {
      accordionItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
      item.classList.toggle('active');
    });
  });
}

initAccordion();

// Инициализация Swiper слайдеров для hero секции
function initHeroSliders() {
  const container = document.querySelector('.hero');

  if (!container) return;
  // Главный слайдер
  const heroSlider = new Swiper('.hero__slider', {
    slidesPerView: 1,
    spaceBetween: 10,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    // effect: 'fade',
    // fadeEffect: {
    //   crossFade: true
    // }
  });

  // Слайдер тиражей
  const tiragesSlider = new Swiper('.hero__tirages-slider', {
    slidesPerView: 1,
    spaceBetween: 10,
    loop: false,
    allowTouchMove: true,
    effect: 'slide'
  });


}

initHeroSliders();

document.addEventListener('DOMContentLoaded', () => {
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const closeModalBtns = document.querySelectorAll('.close-modal-btn');

  openModalBtns.forEach(btn => {

    btn.addEventListener('click', () => {
      const modalId = btn.dataset.modalId;

      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
      } else {
        console.error('Модальное окно не найдено:', modalId);
      }
    });
  });

  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal');
      if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
      } else {
        console.error('Не удалось найти родительское модальное окно');
      }
    });
  });

  window.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal')) {
      event.target.classList.remove('show');
      document.body.style.overflow = '';
    }
  });

  // Закрытие модального окна по Escape
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      const openModal = document.querySelector('.modal.show');
      if (openModal) {
        openModal.classList.remove('show');
        document.body.style.overflow = '';
      }
    }
  });
});



