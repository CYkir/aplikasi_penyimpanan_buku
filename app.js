document.addEventListener('DOMContentLoaded', function () {
    loadBooks();
});

function loadBooks() {
    const belumDibacaList = document.getElementById('list-belum-dibaca');
    const selesaiDibacaList = document.getElementById('list-selesai-dibaca');

    const books = getBooksFromStorage();

    belumDibacaList.innerHTML = '';
    selesaiDibacaList.innerHTML = '';

    books.forEach(function (book) {
        const li = createBookElement(book);

        if (book.isComplete) {
            li.appendChild(createMoveButton(book.id, 'belum-dibaca'));
        } else {
            li.appendChild(createMoveButton(book.id, 'selesai-dibaca'));
        }

        li.appendChild(createDeleteButton(book.id));
        if (book.isComplete) {
            selesaiDibacaList.appendChild(li);
        } else {
            belumDibacaList.appendChild(li);
        }
    });
}

function createBookElement(book) {
    const li = document.createElement('li');
    li.textContent = `${book.title} oleh ${book.author} (${book.year})`;
    return li;
}

function createMoveButton(id, newStatus) {
    const moveButton = document.createElement('button');
    moveButton.textContent = `Pindah ke ${newStatus.replace('-', ' ')}`;
    moveButton.addEventListener('click', function () {
        moveBook(id, newStatus);
        loadBooks();
    });
    return moveButton;
}

function createDeleteButton(id) {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Hapus';
    deleteButton.addEventListener('click', function () {
        if (confirm('Apakah Anda yakin ingin menghapus buku ini?')) {
            removeBook(id);
            loadBooks();
        }
    });
    return deleteButton;
}

function addBook() {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const year = parseInt(document.getElementById('year').value, 10);
    const isComplete = document.getElementById('status').value === 'selesai-dibaca';

    if (!title || !author || !year) {
        alert('Judul, penulis, dan tahun harus diisi!');
        return;
    }

    const newBook = {
        id: generateId(),
        title: title,
        author: author,
        year: year,
        isComplete: isComplete
    };

    const books = getBooksFromStorage();
    books.push(newBook);
    saveBooksToStorage(books);

    loadBooks();
    resetForm();
}

function moveBook(id, newStatus) {
    const books = getBooksFromStorage();
    const updatedBooks = books.map(function (book) {
        if (book.id === id) {
            book.isComplete = !book.isComplete;
        }
        return book;
    });

    saveBooksToStorage(updatedBooks);
}

function removeBook(id) {
    const books = getBooksFromStorage();
    const updatedBooks = books.filter(function (book) {
        return book.id !== id;
    });

    saveBooksToStorage(updatedBooks);
}

function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

function resetForm() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('year').value = '';
    document.getElementById('status').value = 'belum-dibaca';
}

function getBooksFromStorage() {
    let books = [];
    const storedBooks = localStorage.getItem('books');
    if (storedBooks) {
        books = JSON.parse(storedBooks);
    }
    return books;
}

function saveBooksToStorage(books) {
    localStorage.setItem('books', JSON.stringify(books));
}
