// Проверка наличия html2pdf
if (!window.html2pdf) {
    console.error('html2pdf.js не загружен.');
} else {
    console.log('html2pdf.js загружен');
}

// Сохраняем contenteditable данные в localStorage
document.querySelectorAll('[contenteditable="true"]').forEach(element => {
    const key = element.getAttribute('data-key');
    if (!key) {
        console.error('data-key отсутствует у элемента:', element);
        return;
    }
    const saved = localStorage.getItem(key);
    if (saved) element.textContent = saved;

    element.addEventListener('input', () => {
        localStorage.setItem(key, element.textContent);
    });
});

// Ripple-эффект
document.querySelectorAll('.ripple').forEach(element => {
    element.addEventListener('click', (e) => {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
        element.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// Скачивание PDF
const downloadBtn = document.getElementById('download-btn');
if (downloadBtn) {
    downloadBtn.addEventListener('click', async () => {
        const resume = document.querySelector('.resume-container');
        if (!resume) return console.error('resume-container не найдена');

        // Очистим анимации перед экспортом
        document.querySelectorAll('.ripple-effect').forEach(el => el.remove());

        // Создаём копию с сохранением стилей
        const wrapper = document.createElement('div');
        wrapper.className = 'pdf-wrapper';
        const clone = resume.cloneNode(true);
        wrapper.appendChild(clone);
        document.body.appendChild(wrapper);

        try {
            await document.fonts.ready; // Ждём подгрузки шрифтов
            console.log('Шрифты загружены, начинаем экспорт');

            const opt = {
                margin: [10, 10, 10, 10],
                filename: 'resume.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 3,
                    useCORS: true,
                    letterRendering: true,
                    backgroundColor: null,
                    logging: true
                },
                jsPDF: {
                    unit: 'pt',
                    format: 'a4',
                    orientation: 'portrait',
                    putOnlyUsedFonts: true,
                    floatPrecision: 16
                }
            };

            // Отладка: проверяем содержимое перед экспортом
            console.log('Содержимое wrapper:', wrapper.outerHTML);
            await html2pdf().set(opt).from(wrapper).save();
            console.log('PDF успешно сохранен');
        } catch (err) {
            console.error('Ошибка при создании PDF:', err);
        } finally {
            wrapper.remove(); // Удаляем временный элемент
        }
    });
} else {
    console.error('Кнопка download-btn не найдена');
}