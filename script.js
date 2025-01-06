const baseUrl = 'https://kitsu.io/api/edge';

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
    // if (getSearchInfo() === 'anime') {
    //     data.data.sort((a, b) => a.relationships.episodes.data - b.relationships.episodes.data).forEach(res => console.log(res));
    // }
    // else if (getSearchInfo() === 'manga') {
    //     data.data.sort((a, b) => a.relationships.chapters.data - b.relationships.chapters.data).forEach(res => console.log(res));
    // }

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
                      <div class="card-action">
                          <a href="${res.attributes.tba}">Find out more</a>
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
}

// if (getSearchInfo() === 'anime') {
//     data.data.sort((a, b) => a.relationships.episodes.data - b.relationships.episodes.data).forEach(res => console.log(res));
// }
// else if (getSearchInfo() === 'manga') {
//     data.data.sort((a, b) => a.relationships.chapters.data - b.relationships.chapters.data).forEach(res => console.log(res));
// }
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
                  <div class="card-action">
                      <a href="${res.attributes.createdAt}">Find out more</a>
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

function pageLoaded() {
    const form = document.getElementById('search-form');
    form.addEventListener('submit', search);
}

window.addEventListener('load', pageLoaded);


function objToString(obj) {
  let str = '';
  for (const [p, val] of Object.entries(obj)) {
    str += `${p}::${val}\n`;
  }
  return str;
}
