function processFortPortGifs() {
  const gifElements = document.querySelectorAll('img[src*=".gif"], .grid img, [class*="modal"] img');

  gifElements.forEach(gif => {
    const cardElement = gif.parentElement;
    if (!cardElement) return;

    const gridContainer = cardElement.parentElement;
    if (gridContainer && !gridContainer.classList.contains('fp-ordered-grid')) {
      gridContainer.classList.add('fp-ordered-grid');
      gridContainer.style.display = gridContainer.style.display || 'block'; 
    }

    if (!cardElement.querySelector('.fav-gif-btn')) {
      cardElement.style.position = 'relative';

      const btn = document.createElement('button');
      btn.className = 'fav-gif-btn';
      btn.innerHTML = '★';
      btn.title = 'Закрепить сверху';

      const gifUrl = gif.src;
      if (!gifUrl) return;

      chrome.storage.local.get({ favGifs: [] }, (data) => {
        if (data.favGifs.includes(gifUrl)) {
          btn.classList.add('active');
          cardElement.classList.add('fp-fav-card'); // Уменьшаем размер
          cardElement.style.order = "-1"; 
        } else {
          cardElement.classList.remove('fp-fav-card');
          cardElement.style.order = "0";
        }
      });

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        chrome.storage.local.get({ favGifs: [] }, (data) => {
          let favGifs = data.favGifs;

          if (favGifs.includes(gifUrl)) {
            favGifs = favGifs.filter(url => url !== gifUrl);
            btn.classList.remove('active');
            cardElement.classList.remove('fp-fav-card'); // Возвращаем обычный размер
            cardElement.style.order = "0";
          } else {
            favGifs.unshift(gifUrl);
            btn.classList.add('active');
            cardElement.classList.add('fp-fav-card'); // Уменьшаем размер при клике
            cardElement.style.order = "-1"; 
          }

          chrome.storage.local.set({ favGifs });
        });
      });

      cardElement.appendChild(btn);
    }
  });
}

processFortPortGifs();
const observer = new MutationObserver(processFortPortGifs);
observer.observe(document.body, { childList: true, subtree: true });
