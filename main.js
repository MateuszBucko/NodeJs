var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors')
var port = 8080;
var fs = require("fs");
var jsonBooks = fs.readFileSync("books.json");
var jsonAuthors = fs.readFileSync("authors.json");
var authors = JSON.parse(jsonAuthors);
var books = JSON.parse(jsonBooks);
var bookId = 1;
var authorId = 1;
var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

    
app.set('view engine', 'jade');

app.get('/', function(req, res){
  res.render("index");
});

//funkcje znajdowania

//znajdz ksiazke
function findBook(id) {
    for (var i = 0; i < books.length; i++) {
        if (books[i].id == id) {
            return books[i];
        }
    }
    return null;
}

//znajdz autora
function findAuthor(id) {
    for (var i = 0; i < authors.length; i++) {
        if (authors[i].id == id) {
            return authors[i];
        }
    }
    return null;
}



//funkcje usuwania

//usun ksiazke
function removeBook(id) {
    var bookIndex = 0;
    for (var i = 0; i < books.length; i++) {
        if (books[i].id == id) {
            bookIndex = i;
        }
    }
    books.splice(bookIndex, 1);
}

//usun autora
function removeAuthor(id) {
    var authorIndex = 0;
    for (var i = 0; i < authors.length; i++) {
        if (authors[i].id == id) {
            authorIndex = i;
        }
    }
    authors.splice(authorIndex, 1);
}

//operacje GET
app.get('/authors/:id', function (request, response) {
    console.log('Getting a authors with id ' + request.params.id);
    var author = findAuthor(parseInt(request.params.id, 10));
    if (author === null) {
        response.send(404);
    }
    else {
        response.json(author);
    }
});
// pobranie wszystkich autorów
app.get('/authors',function(request,response){
	console.log('Pobieranie autorów - GET');
	response.json(authors);
});

app.get('/books/:id', function (request, response) {
    console.log('Getting a book with id ' + request.params.id);
    var book = findBook(parseInt(request.params.id, 10));
    console.log(parseInt(request.params.id, 10));
    if (book === null) {
        response.send(404);
    }
    else {
        response.json(book);
    }
});


// pobranie wszystkich ksiazek
app.get('/books',function(request,response){
	console.log('Pobieranie ksi¹¿ek - GET');
	response.json(books);
});


//operacje POST

// dodanie ksi¹¿ki
app.post('/books', function(request,response){
	var book = request.body;
	console.log("Wstawianie ksi¹¿ki z zapytania: " + JSON.stringify(book));
	book.id = bookId++;
	books.push(book);
	response.send(book);
})

// dodanie autora
app.post('/authors', function(request,response){
	var author = request.body;
	console.log("Wstawienie autora z zapytania: " + JSON.stringify(author));
	author.id = authorId++;
	authors.push(author);
	reponse.send(author);
});


//operacje PUT

//update ksia¿ki
app.put('/books/:id',function(request,response){
	var book = request.body;
	console.log("Uaktualnianie ksi¹¿ki z zapytania: " + JSON.stringify(book));
	var currentBook = findBook(parseInt(request.params.id,10));
	if(currentBook == null){
		//zrzucamy b³¹d
		reponse.send(404);
	}
	else{
		currentBook.isbn = book.isbn;
		currentBook.title = book.title;
		currentBook.title_en = book.title_en;
		currentBook.publisher = book.publisher;
		currentBook.category = book.category;
		currentBook.quanity = book.quanity;
		currentBook.description = book.description;
		currentBook.add_date = book.add_date;
		currentBook.authors = book.authors;
		console.log("Zakoñczono uaktualnianie ksi¹¿ki");
	}
});

//update autora
app.put('/authors/:id',function(request,response){
	var author = request.body;
	console.log("Uaktualnianie ksi¹¿ki z zapytania: " + JSON.stringify(author));
	var currentAuthor = findAuthor(parseInt(request.params.id,10));
	if (currentAuthor === null) {
        response.send(404);
    }
	else{
		currentAuthor.name = author.name;
		currentAuthor.surname = author.surname;
		console.log("Zakoñczono uaktualnianie autora");
	}
});


//operacje DELETE

//usuwanie ksi¹¿ki
app.delete('/books/:id',function(request,response){
	console.log("Próba usuniêcia ksi¹¿ki z id: " + parseInt(request.params.id, 10));
	var book = findBook(parseInt(request.params.id, 10));
    if (book === null) {
        console.log('Nie mo¿na znaleŸæ tej ksi¹¿ki');
        response.send(404);
    }
    else {
        console.log('Usuwanie ksi¹¿ki o id: ' + request.params.id);
        removeBook(parseInt(request.params.id, 10));
        response.send(book);
    }
});

//usuwnaie autora
app.delete('/authors/:id',function(request,response){
	console.log("Próba usuniêcia autora z id: " + parseInt(request.params.id, 10));
	var author = findAuthor(parseInt(request.params.id,10));
	if(author === null){
		console.log('Nie mo¿na znaleŸæ tego autora');
		response.send(404);
	}
	else{
		console.log("Usuwanie autora o id: "+ request.params.id);
		removeAuthor(parseInt(request.params.id,10));
		response.send(author);
	}
});


app.listen(port, function(){
  console.log('web server listening on port ' + port);
});