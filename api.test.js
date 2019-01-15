const request = require('supertest');
const app = require ('./api');

test('app module should be defined', () => {
    expect(app).toBeDefined();
});

test('GET / should return 200', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
   
});

test('GET / should return 404 if a non-existent URL is inserted', async () => {
    const response = await request(app).get('/something');
    expect(response.statusCode).toBe(404);
});

test('GET /classe --> status would be 200', async () => {
    const res = await request(app).get('/classe')
    expect(res.statusCode).toBe(200);
});

test('GET /classe/nome --> restituisce uno studente particolare', async () => {
    //Richiesta dello studente specificato
    const res = await request(app).get('/classe/nome/?nome=Eleonora');
    //L'api dovrebbe restituire status(200) perchè il corso esiste
    expect(res.statusCode).toBe(200);
    //Controllo se il corso è definito, l'id sia corretto e i vari attributi restituiti correttamente
    const studente = res.body;
    expect(studente).toBeDefined();
    expect(studente.cognome).toEqual("Miori");
    expect(studente.nome).toEqual("Eleonora");
    expect(studente.dataNascita).toEqual("14/02/1997");

});

  test('GET /classe/nome --> restituisce 404', async () => {
    //Richiesta dello studente specificato
    const res = await request(app).get('/classe/nome?nome=E');
    //L'api dovrebbe restituire status(404) perchè il corso esiste
    expect(res.statusCode).toBe(404);
  
  });

  describe('POST /classe/', function() {
    it('---> Restituisce status 200 con aggiunta corso eseguita con successo', async (done) => {
        //Mando una richiesta con un nuovo studente da aggiungere e mi aspetto che l'aggiunta avvenga con successo (status-200)
        request(app)
            .post('/classe/')
            .send({
                nome: "Tamara",
                cognome: "Simoni",
                dataNascita: "12/12/12",
                matricola: 21345 })
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err, res) {
                if(err) return done(err);
                done();
            });
    });
    it('---> Restituisce status 400 perche sbaglio un dato', async (done) => {
        //Mando una richiesta con un nuovo studente da aggiungere e mi aspetto che l'aggiunta avvenga con successo (status-200)
        request(app)
            .post('/classe/')
            .send({
                nome: 667,
                cognome: "Simoni",
                dataNascita: "12/12/12",
                matricola: 21345 })
            .set('Accept', 'application/json')
            .expect(400)
            .end(function(err, res) {
                if(err) return done(err);
                done();
            });
    });
});

describe('PUT /classe/cambia', () =>
{
    it('--> Aggiorno i dati e restituisce 200 con i nuovi dati aggiornati', async (done) => {
        
        var studente = {
            nome: 'Ester',
            cognome: "Tambutini",
            dataNascita: "20/08/1999"
        };

        //Richiedo la modifica e mi aspetto che avvenga con successo
        const res = await request(app)
            .put('/classe/cambia/?nome=Ilyass')
            .send(studente)
            .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
            if(err) return done(err);
            done();
        });
    });

    it('--> Aggiorno i dati e restituisce 404', async () => {
        
        var studente = {
            nome: 'Ester',
            cognome: "Tambutini",
            dataNascita: "20/08/1999"

        };

        //Richiedo la modifica e mi aspetto che avvenga con successo
        const res = await request(app)
            .put('/classe/cambia/?nome=ElllaNonEsiste')
            .send(studente)
            .set('Accept', 'application/json')
        .expect(404)
        .end(function(err, res) {
            if(err) return done(err);
            done();
        });
        

    });
});

//Verifico il corretto funzionamento quando elimino uno studente esistente o inesistente
describe('DELETE /classe/elimina', () => {
    //Elimino uno studente esistente e mi aspetto che lo status sia 200
    it('--->  restituisce stato 200 con esame cancellato', function(done) {
        request(app)
            .delete('/classe/elimina?nome=Eleonora')
            .expect(200)
            .end(function(err, res) {
                if(err) return done(err);
                done();
            }); 
    }); 
    
    //Elimino uno studente assumendo che non esiste e mi aspetto che lo status sia 404
    it('---> restituisce stato 404 perche cerco di cancellare oggetto inesistente', function(done){
        request(app)
        .del('/classe/elimina?nome=Eleonora667')
        .expect(404)
        .end(function(err, res) {
            if(err) return done(err);
            done();
        }); 
    });
 });