const baseUrl = 'https://kitsu.io/api/edge';
let initialContent = '';

function getSearchInfo() {
  const selectedInfo = document.getElementById('search-info').value;
  return selectedInfo;
}

function search() {
  event.preventDefault();

  const form = new FormData(this);
  const query = form.get('website-search');

  if (getSearchInfo() === 'anime' || getSearchInfo() === 'manga') {
    requestUrl = `${baseUrl}/${getSearchInfo()}?filter[text]=${query}`;

    fetch(requestUrl)
      .then(res => res.json())
      .then(updateAnimeMangaDom)
      .catch(error => console.warn(error.message));
  }
  else if (getSearchInfo() === 'characters') {
    requestUrl = `${baseUrl}/${getSearchInfo()}?filter[name]=${query}`;

    fetch(requestUrl)
      .then(res => res.json())
      .then(updateCharactersDom)
      .catch(error => console.warn(error.message));
  }
}

function updateAnimeMangaDom(data) {
  const searchResults = document.getElementById('search-results');

  const animeAndMangaByCategories = data.data
    .reduce((acc, anime) => {
      const { type } = anime;
      if (acc[type] === undefined) acc[type] = [];
      acc[type].push(anime);
      return acc;
    }, {});

  searchResults.innerHTML = Object.keys(animeAndMangaByCategories).map(key => {
    const animeAndMangaHTML = animeAndMangaByCategories[key].map(res => {
      return `
              <div class="subcontainer">
                  <div class="card">
                      <div class="card-image">
                          <img src="${res.attributes.posterImage.original}">
                      </div>
                      <div class="card-content">
                          <span class="card-title"><b>${res.attributes.canonicalTitle}</b></span>
                          <p class="card-description">${res.attributes.synopsis}</p>
                      </div>
                  </div>
              </div>
          `
    }).join('');

    return `
        <section>
            <h3>${key.toUpperCase()}</h3>
            <div class="created-row">${animeAndMangaHTML}</div>
        </section>
    `
  }).join('');

  createBackButton();
}

function updateCharactersDom(data) {
  const searchResults = document.getElementById('search-results');

  const charactersByCategories = data.data
    .reduce((acc, character) => {
      const { type } = character;
      if (acc[type] === undefined) acc[type] = [];
      acc[type].push(character);
      return acc;
    }, {});

  searchResults.innerHTML = Object.keys(charactersByCategories).map(key => {
    const charactersHTML = charactersByCategories[key].map(res => {
      let image = getImageIfExists(res);

      return `
          <div class="subcontainer">
              <div class="card">
                  <div class="card-image">
                      <img src="${image}" alt="${image}">
                  </div>
                  <div class="card-content">
                      <span class="card-title"><b>${res.attributes.name}</b></span>
                      <p class="card-description">${res.attributes.description}</p>
                  </div>
              </div>
          </div>
      `
    }).join('');

    return `
        <section>
            <h3>${key.toUpperCase()}</h3>
            <div class="created-row">${charactersHTML}</div>
        </section>
    `
  }).join('');

  createBackButton();
}

function getImageIfExists(res) {
  const images = res.attributes.image;
  let image = null;

  if (images === null) {
    image = "Image not found";
  } else {
    image = images.original;
  }

  return image;
}

function getInitialData() {
  const animeRequest = fetch(`${baseUrl}/anime?sort=popularityRank&page[limit]=10`);
  const mangaRequest = fetch(`${baseUrl}/manga?sort=popularityRank&page[limit]=10`);
  const charactersRequest = fetch(`${baseUrl}/characters?page[limit]=10`);

  Promise.all([animeRequest, mangaRequest, charactersRequest])
    .then(responses => Promise.all(responses.map(res => res.json())))
    .then(([animeData, mangaData, characterData]) => {
      updateInitialContent(animeData, mangaData, characterData);
    })
    .catch(error => console.warn("Error fetching initial data:", error.message));
}

function updateInitialContent(animeData, mangaData, characterData) {
  const searchResults = document.getElementById('search-results');

  const animeHTML = animeData.data.map(res => {
    return `
            <div class="subcontainer">
                <div class="card">
                    <div class="card-image">
                        <img src="${res.attributes.posterImage.original}" alt="Anime Poster">
                    </div>
                    <div class="card-content">
                        <span class="card-title"><b>${res.attributes.canonicalTitle}</b></span>
                        <p>${res.attributes.synopsis}</p>
                    </div>
                </div>
            </div>
        `;
  }).join('');

  const mangaHTML = mangaData.data.map(res => {
    return `
            <div class="subcontainer">
                <div class="card">
                    <div class="card-image">
                        <img src="${res.attributes.posterImage.original}" alt="Manga Poster">
                    </div>
                    <div class="card-content">
                        <span class="card-title"><b>${res.attributes.canonicalTitle}</b></span>
                        <p>${res.attributes.synopsis}</p>
                    </div>
                </div>
            </div>
        `;
  }).join('');

  const charactersHTML = characterData.data.map(res => {
    const image = res.attributes.image ? res.attributes.image.original : 'Image not available';
    return `
            <div class="subcontainer">
                <div class="card">
                    <div class="card-image">
                        <img src="${image}" alt="Character Image">
                    </div>
                    <div class="card-content">
                        <span class="card-title"><b>${res.attributes.name}</b></span>
                        <p>${res.attributes.description || "No description available."}</p>
                    </div>
                </div>
            </div>
        `;
  }).join('');

  initialContent = `
        <section>
            <h3>Popular Anime</h3>
            <div class="created-row">${animeHTML}</div>
        </section>
        <section>
            <h3>Popular Manga</h3>
            <div class="created-row">${mangaHTML}</div>
        </section>
        <section>
            <h3>Popular Characters</h3>
            <div class="created-row">${charactersHTML}</div>
        </section>`;

  searchResults.innerHTML = initialContent;
}

function pageLoaded() {
  const form = document.getElementById('search-form');
  form.addEventListener('submit', search);

  const backButton = document.getElementById('back-button');
  if (backButton) {
    backButton.addEventListener('click', goBack);
  }

  getInitialData();
}

window.addEventListener('load', pageLoaded);

function createBackButton() {
  let backButton = document.getElementById('back-button');

  if (!backButton) {
    backButton = document.createElement('button');
    backButton.id = 'back-button';
    backButton.className = 'back-button';
    backButton.textContent = '❮';

    backButton.addEventListener('click', goBack);

    const searchResults = document.getElementById('search-results');

    const firstHeading = searchResults.querySelector('h3');

    if (firstHeading) {
      firstHeading.insertAdjacentElement('beforebegin', backButton);
    } else {
      searchResults.insertAdjacentElement('afterbegin', backButton);
    }
  }

  backButton.style.display = 'block';
}

function goBack() {
  const searchResults = document.getElementById('search-results');
  const searchInfo = document.getElementById('search-info');
  const searchInput = document.getElementById('website-search');

  searchResults.innerHTML = initialContent;
  searchInfo.value = searchInfo.options[0].value;
  searchInput.value = '';
}
