const baseUrl = 'https://kitsu.io/api/edge';

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems, options);
  });

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
    searchResults.innerHTML = data.data.map(res => {
        return `
        <div class="row">
            <div class="col s12 m7">
                <div class="card">
                    <div class="card-image">
                        <img src="${res.attributes.posterImage.original}">
                    </div>
                    <div class="card-content">
                        <span class="card-title">${res.attributes.canonicalTitle}</span>
                        <p>${res.attributes.synopsis}</p>
                    </div>
                    <div class="card-action">
                        <a href="${res.attributes.tba}">Find out more</a>
                    </div>
                </div>
            </div>
        </div>
        `       
    }).join('');
}

function updateCharactersDom(data) {
    // if (getSearchInfo() === 'anime') {
    //     data.data.sort((a, b) => a.relationships.episodes.data - b.relationships.episodes.data).forEach(res => console.log(res));
    // }
    // else if (getSearchInfo() === 'manga') {
    //     data.data.sort((a, b) => a.relationships.chapters.data - b.relationships.chapters.data).forEach(res => console.log(res));
    // }

    const searchResults = document.getElementById('search-results');
    searchResults.innerHTML = data.data.map(res => {
        return `
        <div class="row">
            <div class="col s12 m7">
                <div class="card">
                    <div class="card-image">
                        <img src="${res.attributes.image}">
                    </div>
                    <div class="card-content">
                        <span class="card-title">${res.attributes.name}</span>
                        <p>${res.attributes.description}</p>
                    </div>
                    <div class="card-action">
                        <a href="${res.attributes.createdAt}">Find out more</a>
                    </div>
                </div>
            </div>
        </div>
        `        
    }).join('');
}

function pageLoaded() {
    const form = document.getElementById('search-form');
    form.addEventListener('submit', search);
}

window.addEventListener('load', pageLoaded);