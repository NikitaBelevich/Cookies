'use strict';

// Task 1. Дан инпут. Ведите в него город, например, Минск. Сохраните его в куки. Зайдя на другую страницу сайта вы должны увидеть фразу 'ваш город - Минск'. 
const task1 = document.querySelector('.task1');
const inp1 = task1.querySelector('input');

inp1.onchange = function() {
    let value = this.value.trim();
    setCookie('user-city', value);
}


