function searchFiles() {
    const query = document.getElementById('searchQuery').value;
    const startTime = new Date();

    const loadingElement = document.createElement('div');
    loadingElement.classList.add('lds-ripple');
    for (let i = 0; i < 4; i++) {
        const div = document.createElement('div');
        loadingElement.appendChild(div);
    }
    document.body.appendChild(loadingElement);

    fetch(`/searchInFile?q=${query}`)
        .then(response => response.json())
        .then(data => {
            displayResults(data);
            const endTime = new Date();
            const elapsedTime = endTime - startTime;
            console.log(`A fájltartalom keresése ${elapsedTime/1000} mp időt vett igénybe.`);
        })
        .catch(error => {
            console.error('Hiba a fájltartalom keresés során: ', error);
        })
        .finally(() => {

            document.body.removeChild(loadingElement);
        });
}

function searchFileNames() {
    const query = document.getElementById('searchQuery').value;
    const startTime = new Date();

    const loadingElement = document.createElement('div');
    loadingElement.classList.add('lds-ripple');
    for (let i = 0; i < 4; i++) {
        const div = document.createElement('div');
        loadingElement.appendChild(div);
    }
    document.body.appendChild(loadingElement);

    fetch(`/searchInFilename?q=${query}`)
        .then(response => response.json())
        .then(data => {
            displayResults(data);
            const endTime = new Date();
            const elapsedTime = endTime - startTime;
            console.log(`A fájlnevek keresése ${elapsedTime/1000} mp időt vett igénybe.`);
        })
        .catch(error => {
            console.error('Hiba a fájlnévben keresés során: ', error);
        })
        .finally(() => {
            document.body.removeChild(loadingElement);
        });
}

function openFile(fileName) {
    window.open(`/open/${fileName}`, '_blank');
}


function fetchAndDisplayCurrentFolder() {
    fetch('/currentFolder')
        .then(response => response.json())
        .then(data => {
            const currentFolderElement = document.getElementById('currentFolder');
            currentFolderElement.textContent = `Jelenlegi mappa: ${data.folderName}`;
        })
        .catch(error => console.error('Hiba a mappa lekérése során:', error));
}


function displayResults(data) {
    const resultsList = document.getElementById('results');
    let resultsCountElement = document.getElementById('resultsCount');

    if (!resultsCountElement) {
        resultsCountElement = document.createElement('span');
        resultsCountElement.id = 'resultsCount';
        resultsList.insertAdjacentElement('beforebegin', resultsCountElement);
    }

    if (data.length === 0) {
        resultsCountElement.textContent = '(Nincs találat)';
    } else {
        resultsCountElement.textContent = `(${data.length} találat)`;
    }

    resultsList.innerHTML = '';
    data.forEach(file => {
        const linkItem = document.createElement('a');
        linkItem.textContent = file;
        linkItem.href = '#';
        linkItem.onclick = () => openFile(file);
        const listItem = document.createElement('li');
        listItem.appendChild(linkItem);
        resultsList.appendChild(listItem);
    });
}




document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayCurrentFolder();
    searchFilesBtn.addEventListener('click', searchFiles);
    searchFileNamesBtn.addEventListener('click', searchFileNames);
});