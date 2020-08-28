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
        setCookie(elem.dataset.checkbox, 'checked');
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


