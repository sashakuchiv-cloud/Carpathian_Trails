document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.querySelector('.trails-swiper');
  if (carousel && window.Swiper) {
    new Swiper(carousel, {
      loop: true,
      spaceBetween: 24,
      speed: 600,
      autoplay: {
        delay: 3500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      navigation: {
        nextEl: '.trail-next',
        prevEl: '.trail-prev',
      },
      pagination: {
        el: '.trail-pagination',
        clickable: true,
      },
      breakpoints: {
        320: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      },
    });
  }

  if (window.Fancybox) {
    Fancybox.bind('[data-fancybox="carpathian-gallery"]', {
      Carousel: { transition: 'fade' },
      Images: { Panzoom: { maxScale: 3 } },
    });
  }

  const typedTarget = document.querySelector('#typed-text');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (typedTarget && window.Typed && !reducedMotion) {
    typedTarget.textContent = '';
    new Typed('#typed-text', {
      strings: [
        'Продуманий маршрут — більше часу для вражень',
        'Свіже повітря й нові краєвиди чекають',
        'Плануйте похід у власному темпі',
      ],
      typeSpeed: 42,
      backSpeed: 24,
      backDelay: 1800,
      loop: true,
    });
  }
});
