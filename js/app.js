'use strict';

// Task 1. Дан инпут. Ведите в него город, например, Минск. Сохраните его в куки. Зайдя на другую страницу сайта вы должны увидеть фразу 'ваш город - Минск'. 
const task1 = document.querySelector('.task1');
const inp1 = task1.querySelector('input');

inp1.onchange = function () {
    let value = this.value.trim();
    setCookie('user-city', value);
}


// Task 2. При заходе на страницу спросите с помощью инпута день рождения пользователя. Когда он зайдет с следующий раз - напишите сколько месяцев, дней, часов, минут и секунд осталось до его дня рождения. И пусть по этим числам запуститься обратный отсчет (то есть они будут тикать).

const task2 = document.querySelector('.task2');
const inp2 = task2.querySelector('input');

inp2.onchange = saveUserBirthday;
// Установили дату рождения юзера
function saveUserBirthday() {
    let birthday = this.value.trim();
    setCookie('user-birthday', birthday);
    nextUserBirthday();
}

setInterval(nextUserBirthday, 1000);
function nextUserBirthday() {
    // При загрузке считали куки дня рождения
    let userBirthday = getCookie('user-birthday');
    // Если не определена дата, то выходим
    if (!userBirthday) return false;

    // Дата была ранее выбрана, идём дальше
    let currenDate = new Date();

    let dateBirthday = new Date(userBirthday);
    dateBirthday.setFullYear(currenDate.getFullYear());
    dateBirthday.setHours(0); // Часы на полночь

    if (dateBirthday < currenDate) {
        dateBirthday.setFullYear(dateBirthday.getFullYear() + 1);
    }

    currenDate = Math.floor((dateBirthday - currenDate) / 1000);
    let tsec = currenDate % 60;
    currenDate = Math.floor(currenDate / 60);
    if (tsec < 10) tsec = '0' + tsec;
    let tmin = currenDate % 60;
    currenDate = Math.floor(currenDate / 60);
    if (tmin < 10) tmin = '0' + tmin;
    let thour = currenDate % 24;
    currenDate = Math.floor(currenDate / 24);
    let timestr = currenDate + " дней " + thour + " часов " + tmin + " минут " + tsec + " секунд";

    task2.querySelector('p').textContent = 'До вашего дня рождения осталось: ' + timestr;
}


// Task 3. Дана форма с инпутами. Пользователь вводит какие-то данные и закрывает страницу (не факт, что он заполнил всю форму). Сделайте так, чтобы при следующем заходе на страницу введенные им ранее данные стояли на своих местах.

const form3 = document.querySelector('.form-task3');

window.addEventListener('unload', () => {
    // Когда пользователь покидает страницу, перебираем все поря формы и записываем на их основе куки
    saveDataOfForm(form3);
});

function saveDataOfForm(form) {
    for (const input of form.elements) {
        const value = input.value.trim(); // считываем с каждого поля значение
        // Если ничего нет в полях, то не записываем куки
        if (value) {
            const cookieName = Object.keys(input.dataset);
            setCookie(cookieName[0], value);
        }

    }
}

// При загрузке страницы подтягиваем в поля формы информацию из кук
fillInputsOfForm(form3);
function fillInputsOfForm(form) {
    // Перебираем все инпуты формы
    for (const input of form.elements) {
        // Получили с текущего инпута дата атрибут имени куки
        const cookieName = Object.keys(input.dataset)[0];
        // console.warn(cookieName);
        // Если куки нет по атрибуту инпута, то идём к следующему инпуту
        if (!getCookie(cookieName)) continue;

        // Если есть, выбираем инпут по имени куки, по дата атрибуту
        let targetInp = form.querySelector(`input[data-${cookieName}]`);
        
        // Записываем куки в инпут
        targetInp.value = getCookie(cookieName);
    }
}

// Task 4. Даны чекбоксы. Пользователь произвольно отмечает их и закрывает страницу. Сделайте так, чтобы при следующем заходе на страницу чекбоксы стали отмеченными так, как это сделал пользователь ранее.

const form4 = document.querySelector('.form-task4');
// Добавление атрибута с порядковым номером каждого бокса
const allCheckbox4 = form4.querySelectorAll('input[type="checkbox"]');
allCheckbox4.forEach((elem, i) => {
    elem.dataset.checkbox = 'checkbox-' + (i + 1);
});

const checkedCheckboxes = new Set();
// При кликнутом чекбоксе, добавляем его в объект как чекнутый
form4.addEventListener('click', event => {
    const targetCheckbox = event.target.closest('input');
    if (!targetCheckbox) return; // Отсеиваем возможный null

    // Добавляем в массив помеченный чекбокс и удаляем его если он был нажат(снимаем выделение)
    if (targetCheckbox.checked) {
        checkedCheckboxes.add(targetCheckbox);
    } else {
        checkedCheckboxes.delete(targetCheckbox);
    }
});

window.addEventListener('beforeunload', saveCheckedCheckboxes);
function saveCheckedCheckboxes() {
    // Когда пользователь покидает страницу, мы для чекнутых чекбоксов записываем куки
    checkedCheckboxes.forEach(elem => {
        setCookie(elem.dataset.checkbox, 'checked', {'max-age': 3600});
    });
}

setCheckedOnCheckbox();
function setCheckedOnCheckbox() {
    allCheckbox4.forEach(elem => {
        const cookieName = Object.values(elem.dataset)[0];
        let cookie = getCookie(cookieName);
        if (!cookie) return;

        // Получили чекбокс который в прошлый раз был чекнут
        let targetCheckbox = document.querySelector(`input[data-checkbox="${cookieName}"]`);
        targetCheckbox.checked = true;
    });
}

// Task 5.  Дан тектареа. Пользователь может потянуть за его угол и изменить его размер. Сделайте так, чтобы при следующем заходе на страницу, текстареа был заданного размера.
const textarea5 = document.querySelector('.task5 textarea');

// При закрытии страницы, мы делаем куки с размерами текстареа
window.addEventListener('unload', () => {
    saveSizesTextarea(textarea5);
});
function saveSizesTextarea(textarea) {
    const textareaName = textarea.getAttribute('name');
    const textareaParametrs = {
        'height': textarea.clientHeight,
        'width': textarea.clientWidth,
    };
    // Устанавливаем куку: имя формы = параметры формы в представлении JSON
    setCookie(textareaName, JSON.stringify(textareaParametrs));
}

// При загрузке документа, мы считваем куки текстареа с размерами, которые были на момент последнего посещения
applaySizesTextarea(textarea5, 4);
function applaySizesTextarea(textarea, padding) {
    const textareaName = textarea.getAttribute('name');
    const textareaCookie = getCookie(textareaName);
    const textareaParametrs = JSON.parse(textareaCookie);
    textarea.style.cssText = `
                        width: ${textareaParametrs.width - padding}px;
                        height: ${textareaParametrs.height - padding}px;    
    `;
}


// Task 6.  Дан инпут. В него можно ввести данные, затем поредактировать их, затем еще поредактировать. Пусть инпут хранит историю своих изменений (даже после перезагрузки страницы). Сверху над инпутом должны появится стрелочки, с помощью которых можно перемещаться по истории.

// в set будем собирать данные из инпута после каждого изменения
const inputHistory = new Set();
const task6 = document.querySelector('.parent-input-history');
const inp6 = task6.querySelector('input');
inp6.addEventListener('change', () => {
    saveHistoryInput(inp6);
});
// TODO Запись куки
function saveHistoryInput(input) {
    const value = input.value.trim();
    if (!value) return;
    inputHistory.add(value);
    console.log(inputHistory);

    const inputName = inp6.getAttribute('name');
    // Создаём куки, значением будут элементы массива разделённые запятой
    setCookie(inputName, `${Array.from(inputHistory)}`);
}
// TODO Получение истории из куки
function getHistoryInput() {
    const inputName = inp6.getAttribute('name');
    const cookieHistory = getCookie(inputName);
    if (!cookieHistory) return;

    const arrayHistory = cookieHistory.split(',');
    return arrayHistory;
}
// Обрабатываем навигацию по истории 
const backHistory = task6.firstElementChild;
const forwardHistory = task6.lastElementChild;

let countHis = 0;
// TODO Forward button -------------------------
forwardHistory.addEventListener('click', () => {
    const history = getHistoryInput();
    if (!history) return;

    const value = inp6.value.trim();
    let historyLength = history.length;
    // Если у нас поле пустое, счётчику даём 0, чтобы наверняка начать с 1 элемента массива
    if (value == '') countHis = 0;
    // Пока у нас счётчик меньше длины массива, мы перемещаемся по массиву
    if (countHis != historyLength) {
        // Если текущее значение инпута равно последнему в массиве, т.е оно у нас в поле, то мы дальше не переключаем
        // Т.е Текущее value инпута только что добавилось в массив последним элементом и дальше переключать некуда, а также, чтобы не происходило переключения на 0 элемент массива, это нелогично, для этого есть кнопка "назад"
        if (value == history[historyLength - 1]) {
            return;
        }
        inp6.value = history[countHis++];
    }
});

// TODO Back button -------------------------
backHistory.addEventListener('click', () => {
    const history = getHistoryInput();
    if (!history) return;
    const value = inp6.value.trim();
    
    // Получили индекс элемента в массиве, который является текущем в инпуте, т.е последний элемент массива
    const currentIndex = history.indexOf(value);
    countHis = currentIndex;
    // Если у нас 0 индекс, значит первый элемент массива уже стоит в инпуте, и мы больше ничего не делаем
    // И если у нас пустое значение инпута, и мы нажимаем влево, то также мы ничего не делаем
    if (countHis == 0 || !value) {
        countHis = 1; // Чтобы правая стрелка сразу выдала 2 элемент массива, т.к первый уже стоит в поле
        return;
    }
    inp6.value = history[--countHis];
});