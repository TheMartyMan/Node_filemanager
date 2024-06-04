const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

const defPath = "mappa";
let folderPath = defPath;

app.use(express.static('../assets'));



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend", 'index.html'));
});

app.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend", 'search.html'));
});

app.get('/folders', (req, res) => {
    const directories = getDirectories(folderPath);
    res.json(directories);
});


app.get('/currentFolder', (req, res) => {
    res.json({ folderName: path.basename(folderPath) });
});


function getDirectories(srcPath) {
    return fs.readdirSync(srcPath)
        .filter(file => fs.statSync(path.join(srcPath, file)).isDirectory());
}

app.post('/setFolderPath', express.json(), (req, res) => {
    let newPath = req.body.newPath;

    if (newPath && fs.existsSync(path.join(defPath, newPath))) {
        folderPath = path.join(defPath, newPath + "/");
        console.log("folderpath: " + folderPath);
        res.json({ success: true });
    } else if (newPath && fs.existsSync(path.join(newPath))) {
        folderPath = newPath;
        console.log("folderpath: " + folderPath);
        res.json({ success: true });
    } else {
        res.status(400).json({ success: false, message: 'Érvénytelen útvonal' });
        console.log("A rossz útvonal: " + folderPath);
    }
});

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach((file) => {
        const filePath = path.join(dirPath, file);
        if (fs.statSync(filePath).isDirectory()) {
            arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
        } else {
            arrayOfFiles.push(filePath);
        }
    });

    return arrayOfFiles;
}



app.get('/searchInFile', (req, res) => {
    const query = req.query.q;
    if (!query) {
        console.log('Nincs megadva keresési feltétel.');
        return res.json([]);
    }

    const allFiles = getAllFiles(folderPath);
    let results = [];
    let fileCount = 0;

    allFiles.forEach((filePath) => {
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            console.log("Fájlban keresés folyamatban...");
            if (content.includes(query)) {
                console.log(`FÁJLON BELÜL - ${query} megtalálható: ${filePath}`);
                results.push(path.relative(folderPath, filePath));
                fileCount++;
                console.log(`Eddig ${fileCount} fájlban találtam meg a keresett szöveget.`);
            }
        } catch (err) {
            console.error(`A fájlt nem lehet olvasni:`, err);
        }
    });
    console.log("A fájlokban való keresés befejeződött.");
    res.json(results);
});



app.get('/searchInFilename', (req, res) => {
    console.log("Fájlnév keresés folyamatban...");
    const query = req.query.q;
    if (!query) {
        console.log('Nincs megadva keresési feltétel.');
        return res.json([]);
    }

    const allFiles = getAllFiles(folderPath);
    let results = [];
    let fileCount = 0;
    allFiles.forEach((filePath) => {
        const fileName = path.basename(filePath);
        if (fileName.includes(query)) {
            console.log(`FÁJLNÉVBEN - Keresési feltétel megtalálva: ${fileName}`);
            results.push(path.relative(folderPath, filePath));
            fileCount++;
            console.log(`Eddig ${fileCount} fájl nevében találtam meg a keresett szöveget.`);
        }
    });
    console.log("A fájlok nevében való keresés befejeződött.");
    
    res.json(results);
});



app.get('/open/*', (req, res) => {
    const filePath = folderPath + req.params[0];
    res.sendFile(filePath);
});



app.listen(port, () => {
    console.log(`A szerver fut: http://localhost:${port}`);
});
