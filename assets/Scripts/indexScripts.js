function switchToSearchPage() {

    document.body.classList.add('fade-out');

        window.location.href = '/search';
}


function fetchAndDisplayFolders() {
    fetch('/folders')
        .then(response => response.json())
        .then(data => {
            const folderList = document.getElementById('folderList');
            folderList.innerHTML = '';

            data.forEach(folder => {
                const button = document.createElement('button');
                button.textContent = folder;
                button.addEventListener('click', () => setFolderPath(folder));
                folderList.appendChild(button);

            });
        })
        .catch(error => console.error('Error fetching folders:', error));
}


function setFolderPath(folder) {
    fetch('/setFolderPath', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPath: folder }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log(`Új keresési mappa: ${folder}`);
            switchToSearchPage();
        } else {
            console.error('Nem sikerült az új mappát beállítani: ', data.message);
        }
    })
    .catch(error => console.error('Nem sikerült az új mappát beállítani:', error));
}


document.addEventListener('DOMContentLoaded', async () => {
    

    setAllBtn.addEventListener('click', () => {
        setFolderPath("mappa/útvonal");
    });
    

    fetchAndDisplayFolders();

    
    if (sessionStorage.getItem('navigatedBack')) {
        document.body.classList.add('fade-in');
        sessionStorage.removeItem('navigatedBack');
    }

    window.addEventListener('beforeunload', () => {
        sessionStorage.setItem('navigatedBack', 'true');
    });

});