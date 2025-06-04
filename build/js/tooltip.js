class AdaptiveTooltip {
  constructor() {
    this.activeTooltip = null;
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    // Обработчик кликов для открытия тултипов
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-tooltip-trigger]');

      if (trigger) {
        e.preventDefault();
        e.stopPropagation();
        this.toggleTooltip(trigger);
      } else {
        // Закрыть тултип при клике вне его
        this.closeTooltip();
      }
    });

    // Обработчик для кнопок закрытия тултипов
    document.addEventListener('click', (e) => {
      if (e.target.closest('.tooltip__btn')) {
        e.preventDefault();
        e.stopPropagation();
        this.closeTooltip();
      }
    });

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeTooltip();
      }
    });

    // Обновление позиции при изменении размера окна
    window.addEventListener('resize', () => {
      if (this.activeTooltip) {
        this.positionTooltip(this.activeTooltip.trigger, this.activeTooltip.element);
      }
    });
  }

  toggleTooltip(trigger) {
    // Если уже открыт этот тултип, закрываем его
    if (this.activeTooltip && this.activeTooltip.trigger === trigger) {
      this.closeTooltip();
      return;
    }

    // Закрываем предыдущий тултип
    this.closeTooltip();

    // Создаем и показываем новый тултип
    this.showTooltip(trigger);
  }

  showTooltip(trigger) {
    const tooltipId = trigger.dataset.tooltipTrigger;
    const tooltipElement = document.querySelector(`[data-tooltip="${tooltipId}"]`);

    if (!tooltipElement) {
      console.warn(`Тултип с id "${tooltipId}" не найден`);
      return;
    }

    // Позиционируем тултип
    this.positionTooltip(trigger, tooltipElement);

    // Показываем тултип с анимацией
    tooltipElement.classList.add('show');

    // Сохраняем ссылки на активный тултип
    this.activeTooltip = {
      trigger: trigger,
      element: tooltipElement
    };
  }

  positionTooltip(trigger, tooltip) {
    // Сбрасываем все классы позиционирования
    tooltip.classList.remove('tooltip--left', 'tooltip--right', 'tooltip--top', 'tooltip--bottom');

    const triggerRect = trigger.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const tooltipRect = tooltip.getBoundingClientRect();

    // Определяем доступное пространство с каждой стороны
    const spaceRight = viewportWidth - triggerRect.right;
    const spaceLeft = triggerRect.left;
    const spaceTop = triggerRect.top;
    const spaceBottom = viewportHeight - triggerRect.bottom;

    let position = 'right'; // по умолчанию
    let top, left;

    // Определяем оптимальную позицию
    if (spaceRight >= 280) {
      // Размещаем справа
      position = 'right';
      left = triggerRect.right + 12;
      top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
    } else if (spaceLeft >= 280) {
      // Размещаем слева
      position = 'left';
      left = triggerRect.left - tooltipRect.width - 12;
      top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
    } else if (spaceBottom >= 200) {
      // Размещаем снизу
      position = 'bottom';
      left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
      top = triggerRect.bottom + 12;
    } else if (spaceTop >= 200) {
      // Размещаем сверху
      position = 'top';
      left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
      top = triggerRect.top - tooltipRect.height - 12;
    } else {
      // Если места мало, размещаем справа с корректировкой
      position = 'right';
      left = Math.min(triggerRect.right + 12, viewportWidth - tooltipRect.width - 10);
      top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
    }

    // Корректируем позицию, чтобы тултип не выходил за границы экрана
    if (left < 10) {
      left = 10;
    }
    if (left + tooltipRect.width > viewportWidth - 10) {
      left = viewportWidth - tooltipRect.width - 10;
    }
    if (top < 10) {
      top = 10;
    }
    if (top + tooltipRect.height > viewportHeight - 10) {
      top = viewportHeight - tooltipRect.height - 10;
    }

    // Применяем позицию
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    tooltip.classList.add(`tooltip--${position}`);
  }

  closeTooltip() {
    if (this.activeTooltip) {
      this.activeTooltip.element.classList.remove('show');
      this.activeTooltip = null;
    }
  }
}

// Инициализируем тултипы после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  new AdaptiveTooltip();
}); 