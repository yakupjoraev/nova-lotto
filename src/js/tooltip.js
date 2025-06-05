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

    // Получаем координаты триггера относительно viewport
    const triggerRect = trigger.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    // Переводим координаты триггера в абсолютные координаты документа
    const triggerAbsolute = {
      top: triggerRect.top + scrollTop,
      left: triggerRect.left + scrollLeft,
      right: triggerRect.right + scrollLeft,
      bottom: triggerRect.bottom + scrollTop,
      width: triggerRect.width,
      height: triggerRect.height
    };

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Получаем размеры тултипа
    tooltip.style.visibility = 'hidden';
    tooltip.style.opacity = '0';
    tooltip.style.display = 'block';
    const tooltipRect = tooltip.getBoundingClientRect();
    tooltip.style.display = '';
    tooltip.style.visibility = '';
    tooltip.style.opacity = '';

    // Определяем доступное пространство с каждой стороны В ОБЛАСТИ ВИДИМОСТИ
    const visibleTriggerTop = Math.max(0, triggerRect.top);
    const visibleTriggerBottom = Math.min(viewportHeight, triggerRect.bottom);
    const visibleTriggerLeft = Math.max(0, triggerRect.left);
    const visibleTriggerRight = Math.min(viewportWidth, triggerRect.right);

    const spaceRight = viewportWidth - visibleTriggerRight;
    const spaceLeft = visibleTriggerLeft;
    const spaceTop = visibleTriggerTop;
    const spaceBottom = viewportHeight - visibleTriggerBottom;

    // Минимальные отступы от краев экрана
    const margin = 8;
    const arrowOffset = 16; // расстояние от триггера до тултипа

    let position = 'right'; // по умолчанию
    let top, left;

    // Определяем оптимальную позицию на основе доступного места в viewport
    if (spaceRight >= tooltipRect.width + arrowOffset + margin) {
      // Размещаем справа
      position = 'right';
      left = triggerAbsolute.right + arrowOffset;
      top = triggerAbsolute.top + (triggerAbsolute.height / 2) - (tooltipRect.height / 2);
    } else if (spaceLeft >= tooltipRect.width + arrowOffset + margin) {
      // Размещаем слева
      position = 'left';
      left = triggerAbsolute.left - tooltipRect.width - arrowOffset;
      top = triggerAbsolute.top + (triggerAbsolute.height / 2) - (tooltipRect.height / 2);
    } else if (spaceBottom >= tooltipRect.height + arrowOffset + margin) {
      // Размещаем снизу
      position = 'bottom';
      left = triggerAbsolute.left + (triggerAbsolute.width / 2) - (tooltipRect.width / 2);
      top = triggerAbsolute.bottom + arrowOffset;
    } else if (spaceTop >= tooltipRect.height + arrowOffset + margin) {
      // Размещаем сверху
      position = 'top';
      left = triggerAbsolute.left + (triggerAbsolute.width / 2) - (tooltipRect.width / 2);
      top = triggerAbsolute.top - tooltipRect.height - arrowOffset;
    } else {
      // Если места мало везде, выбираем лучшую позицию и корректируем в области видимости
      const maxSpace = Math.max(spaceRight, spaceLeft, spaceTop, spaceBottom);

      if (maxSpace === spaceBottom || maxSpace === spaceTop) {
        // Предпочитаем вертикальное размещение
        if (spaceBottom >= spaceTop) {
          position = 'bottom';
          left = triggerAbsolute.left + (triggerAbsolute.width / 2) - (tooltipRect.width / 2);
          top = triggerAbsolute.bottom + arrowOffset;
        } else {
          position = 'top';
          left = triggerAbsolute.left + (triggerAbsolute.width / 2) - (tooltipRect.width / 2);
          top = triggerAbsolute.top - tooltipRect.height - arrowOffset;
        }
      } else {
        // Горизонтальное размещение
        if (spaceRight >= spaceLeft) {
          position = 'right';
          left = triggerAbsolute.right + arrowOffset;
          top = triggerAbsolute.top + (triggerAbsolute.height / 2) - (tooltipRect.height / 2);
        } else {
          position = 'left';
          left = triggerAbsolute.left - tooltipRect.width - arrowOffset;
          top = triggerAbsolute.top + (triggerAbsolute.height / 2) - (tooltipRect.height / 2);
        }
      }
    }

    // Корректируем позицию, чтобы тултип оставался в области видимости
    const maxLeft = scrollLeft + viewportWidth - tooltipRect.width - margin;
    const minLeft = scrollLeft + margin;
    const maxTop = scrollTop + viewportHeight - tooltipRect.height - margin;
    const minTop = scrollTop + margin;

    if (left < minLeft) {
      left = minLeft;
    }
    if (left > maxLeft) {
      left = maxLeft;
    }
    if (top < minTop) {
      top = minTop;
    }
    if (top > maxTop) {
      top = maxTop;
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