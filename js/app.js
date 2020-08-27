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