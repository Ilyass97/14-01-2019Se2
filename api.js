const express = require('express');
const bodyParser = require ('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
let classe = [
    {
        "nome": "Ilyass",
        "cognome": "Benjelloul",
        "dataNascita": "17/07/1997",
        "matricola" : 194212,
    },
    {
        "nome": "Eleonora",
        "cognome": "Miori",
        "dataNascita": "14/02/1997",
        "matricola" : 199999,
    }
];

app.get('/', (req, res) => {
    res.status(200).json('HOMEPAGE');
});

app.get('/classe', (req, res) => {
    res.json(classe);
});

app.get('/classe/nome', (req, res) => {
    const reqNome = req.query.nome;
    //ricerca tramite "filtro"
    let studente = classe.filter(studente => {return studente.nome == (reqNome)});
    //Se lo studente non esiste restituisco errore 404-(Not Found)
    //Altrimenti, se esiste e lo ho trovato restituisco il corso specificato
    if (!studente[0]) {res.status(404).json({message:'Studente non trovato'});}
    else { res.status(200).json(studente[0])};
}); 

//Aggiunta di un nuovo corso 
app.post('/classe/', (req,res) => {
    //Ricevo le informazioni del nuovo studente da aggiungere 
    const studente = {
        nome : req.body.nome,
        cognome: req.body.cognome,
        dataNascita: req.body.data,
        matricola: req.body.matricola
    }
    //Inserisco il nuovo corso e restituisco status 200 assieme al nuovo corso appena aggiunto
    if((typeof(req.body.nome) == "string") && (typeof(req.body.cognome) == "string") && (typeof(req.body.data== "string")) && (!isNaN(req.body.matricola))) {
        classe.push(studente);
        res.status(200).json(studente);
    }      
    else {
        res.status(400).json({message:'Valori non validi'})
    }  
   
});

app.put('/classe/cambia', (req, res) => {
    //Ricevo l'id del corso da cercare
    const reqNome = req.query.nome;
    //Ricerca del corso 
    let studente = classe.filter(studente => {return studente.nome == (reqNome)})[0];

    //Se il corso è diverso da null allora modifico gli attributi
    if(studente != null){
    const index = classe.indexOf(studente);
    const keys =  Object.keys(req.body);

    keys.forEach(key => {
        studente[key] = req.body[key];  
    });
    classe[index] = studente;
     res.status(200).json(classe[index]);
    }
    else{
    res.status(404);
    }
    
});


app.delete('/classe/elimina', (req, res) => {
    //Ricevo dall'utente l'id del corso da eliminare
    const ReqName = req.query.nome;
    //Ricerca di tale corso
    let studente = classe.filter(studente => {
        return studente.nome == ReqName;
    })[0];

    //Se il corso esiste allora lo rimuvo restituendo un messaggio e status200
    if((studente != null)){
        const index = classe.indexOf(studente);
        classe.splice(index, 1);
        res.status(200).json({message: `lo studente è stato cancellato con successo.`});
    }
    
    //Altrimenti, se il corso non esiste restituisco un messaggio di errore con status404
    else{
         res.status(404).json({message: ` non presente nel database`}); 
    }

}); 

module.exports = app;