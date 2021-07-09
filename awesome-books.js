/* eslint max-classes-per-file: ["error", 3] */
window.addEventListener('DOMContentLoaded', () => {
  const title = document.querySelector('#book-title');
  const author = document.querySelector('#book-author');
  const addButton = document.querySelector('#add-book-button');
  const bookList = document.querySelector('#book-list');
  const titleError = document.querySelector('#title-error');
  const authorError = document.querySelector('#author-error');
  const list = document.querySelector('#list');
  const addNew = document.querySelector('#add-new');
  const contact = document.querySelector('#contact');
  const bookContainer = document.querySelector('.book-container');
  const books = document.querySelector('#books');
  const form = document.querySelector('#form');
  const contacts = document.querySelector('#contacts');
  const year = document.querySelector('#year');
  const navLinks = document.querySelectorAll('.nav-list a');
  const date = document.querySelector('#date');
  class LinkView {
    constructor(nav, view) {
      this.nav = nav;
      this.view = view;
    }
  }

  class Book {
    constructor(title, author) {
      this.title = title;
      this.author = author;
    }
  }

  class BookList {
    constructor() {
      this.bookArray = [];
      this.key = 'books';
      this.border = '2px solid #000';
    }

    #createBook(book) {
      const bookItem = document.createElement('li');
      bookItem.setAttribute('id', `book${book.id}`);
      bookItem.setAttribute('class', 'book-item');
      const bookDiv = document.createElement('div');
      bookDiv.setAttribute('class', 'book');
      const bookTitleAuthor = document.createElement('div');
      bookTitleAuthor.setAttribute('class', 'book__title-author');
      const h1 = document.createElement('h1');
      h1.setAttribute('class', 'title');
      h1.textContent = `"${book.title}"`;
      const bySpan = document.createElement('span');
      bySpan.textContent = ' by ';
      bySpan.setAttribute('class', 'by');
      const p = document.createElement('p');
      p.setAttribute('class', 'authour');
      p.textContent = `${book.author}`;
      const removeButton = document.createElement('button');
      removeButton.textContent = 'Remove';
      removeButton.setAttribute('class', 'btn');
      removeButton.onclick = () => {
        this.removeBook(book.id);
      };

      bookTitleAuthor.appendChild(h1);
      bookTitleAuthor.appendChild(bySpan);
      bookTitleAuthor.appendChild(p);
      bookDiv.appendChild(bookTitleAuthor);
      bookDiv.appendChild(removeButton);
      bookItem.appendChild(bookDiv);

      return bookItem;
    }

    displayBooks() {
      if (this.#isStorage()) {
        const books = this.getStorage();
        for (let i = 0; i < books.length; i += 1) {
          const book = books[i];
          bookList.appendChild(this.#createBook(book));
        }
      }
      this.#isChildrenInDom();
    }

    #addBook(bookObject) {
      bookObject.id = Date.now();
      if (this.#isStorage()) {
        this.bookArray = this.getStorage();
      }
      this.bookArray.unshift(bookObject);
      this.#setStorage(this.bookArray);
      bookList.prepend(this.#createBook(bookObject));
      this.#isChildrenInDom();
    }

    removeBook(bookId) {
      const bookToRemove = document.querySelector(`#book${bookId}`);
      bookToRemove.parentNode.removeChild(bookToRemove);
      this.bookArray = this.getStorage().filter((book) => book.id !== +bookId);
      this.#setStorage(this.bookArray);
      this.#isChildrenInDom();
    }

    #setStorage(data) {
      localStorage.setItem(this.key, JSON.stringify(data));
    }

    getStorage() {
      return JSON.parse(localStorage.getItem(this.key));
    }

    #isStorage() {
      if (localStorage.getItem(this.key)) {
        return true;
      }
      return false;
    }

    validate() {
      const bookTitle = title.value.trim();
      const bookAuthor = author.value.trim();
      if (!bookTitle || !bookAuthor) {
        if (!bookTitle) {
          titleError.textContent = 'Please provide a valid title';
        } else {
          titleError.textContent = '';
        }
        if (!bookAuthor) {
          authorError.textContent = 'Please provide a valid author';
        } else {
          authorError.textContent = '';
        }
      } else {
        titleError.textContent = '';
        authorError.textContent = '';
        const bookObject = new Book(title.value, author.value);
        this.#addBook(bookObject);
        title.value = '';
        author.value = '';
      }
    }

    #isChildrenInDom() {
      if (bookList.hasChildNodes()) {
        bookList.style.border = this.border;
      } else {
        bookList.style.border = 'none';
      }
    }
  }

  const bookCollection = new BookList();
  bookCollection.displayBooks();

  const linkViews = [new LinkView(list, books), new LinkView(addNew, form),
      new LinkView(contact, contacts)];

  addButton.addEventListener('click', (event) => {
    event.preventDefault();
    bookCollection.validate();
  });

  const toggleActiveLink = () => {
    navLinks.forEach((navLink) => {
      navLink.classList.remove('active');
    });
  };

  const displayHide = () => {
    for (let i = 0; i < bookContainer.children.length; i += 1) {
      bookContainer.children[i].classList.remove('show');
      bookContainer.children[i].classList.add('hide');
    }
  };

  linkViews.forEach((linkView) => {
    linkView.nav.addEventListener('click', () => {
      toggleActiveLink();
      displayHide();
      linkView.nav.classList.add('active');
      linkView.view.classList.add('show');
    });
  });

  function numberSuffix(num) {
    if (num >= 11 && num <= 13) return 'th';

    const lastDigit = num.toString().slice(-1);

    switch (lastDigit) {
      case '1': return 'st';
      case '2': return 'nd';
      case '3': return 'rd';
      default: return 'th';
    }
  }

  /* eslint-disable */
  const { DateTime } = luxon;
  /* eslint-enable */
  setInterval(() => {
    const today = DateTime.local();
    const format = { ...DateTime.DATETIME_MED_WITH_SECONDS, month: 'long' };
    const modifiedDate = today.toLocaleString(format).split(' ');
    const dayNumber = parseInt(modifiedDate[1], 10);
    modifiedDate[1] = dayNumber + numberSuffix(dayNumber);
    modifiedDate[modifiedDate.length - 1] = (modifiedDate[modifiedDate.length - 1]).toLowerCase();
    date.textContent = modifiedDate.join(' ');
  }, 1000);

  const now = DateTime.now();
  year.textContent = now.year;
});
