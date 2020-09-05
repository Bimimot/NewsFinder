import '../css/style.css';

import FormValidator from './components/FormValidator'; // импортируем класс с валидаторами форм
import Popup from './components/Popup'; // импортируем класс с методами для попапов
import MainApi from './api/MainApi';
import Header from './components/Header';

import { popupContainer, menuContainer, loginButtonClass } from './constants/elements'; // импорт контейнера попапа и классов кнопок
import { loginMarkup, loggedMenuMarkup, unloggedMenuMarkup, buttonMarkup } from './constants/markups'; // импорт разметки для попапов
import { errorsMessages } from './constants/errors'; // импортируем стили для вебпака

const validator = new FormValidator(errorsMessages); // создаем валидатор, передаем тексты ошибок
const popup = new Popup(popupContainer, validator); // создаем методы обработки попапа
const mainApi = new MainApi();
const header = new Header(menuContainer);

document.addEventListener('click', (event) => {
  if (event.target.className.includes(loginButtonClass)) {
    popup.setContent(loginMarkup);
    popup.open();

    popupContainer.querySelector('.popup__form')
      .addEventListener('submit', (event) =>
      { event.preventDefault();
        mainApi.login(popup.getMail(), popup.getPass())
          .then((res) => {
            if (res.ok) {
              popup.close();
            // показываем новый хедер
            header.setMenu(loggedMenuMarkup, 'Васька');
            // сохраняем токен
            } else {
              res.json()
                .then((result) => {
                  popup.setServerError(result.message); // показываем ошибку в попапе
                })
                .catch((error) => console.log(error));
            }
          })
          .catch((error) => console.log(error));
      });
  }
});

// хардкод для активации иконок-закладок
document.querySelectorAll('.cards__bookmark').forEach((item) => {
  item.addEventListener('click', (event) => {
    event.target.classList.toggle('cards__bookmark_clicked_on');
    event.target.classList.toggle('cards__bookmark_clicked_off');
  });
});

// const loginPopup = new Popup(popupLoginContainer, '.button_type_login', validator); // создаем попап для авторизации
// const signupPopup = new Popup(popupSignupContainer, '.button_type_signup', validator); // создаем попап для регистрации
// const menuPopup = new Popup(popupMenuContainer, '.button_type_menu'); // создаем попап для выпадающего меню
