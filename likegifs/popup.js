document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('gifGrid');

  chrome.storage.local.get({ favGifs: [] }, (data) => {
    if (data.favGifs.length === 0) {
      grid.innerHTML = '<div class="empty">У вас пока нет закрепленных гифок</div>';
      return;
    }

    data.favGifs.forEach(url => {
      const img = document.createElement('img');
      img.src = url;
      img.title = "Нажмите, чтобы скопировать ссылку";
      
      img.addEventListener('click', () => {
        navigator.clipboard.writeText(url).then(() => {
          alert('Ссылка на гифку скопирована!');
        }).catch(err => {
          console.error('Ошибка копирования:', err);
        });
      });

      grid.appendChild(img);
    });
  });
});
