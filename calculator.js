// треугольники регулировщики
const triangles = document.querySelectorAll('.triangle-btn');

const leftFieldMax = 30;
const rightFieldMax = 50;

triangles.forEach(triangle => {
    triangle.addEventListener('click', e => {
        const currentProperty = e.target.getAttribute('data-property');
        const closestInput = e.target.closest('.input-place').querySelector('.form-field');
        const closestInputID = closestInput.getAttribute('id');
        let closestInputValue = +closestInput.value;
        let limit = closestInputID === 'kedo-field' ? leftFieldMax : rightFieldMax;

        currentProperty === 'up' ? closestInputValue++ : closestInputValue--;

        if (closestInputValue > limit)
        {
            closestInputValue = limit;
        }
        else if (closestInputID === 'kedo-field' && closestInputValue <= 0)
        {
            closestInputValue = 1;
        }
        else if (closestInputValue <= 0)
        {
            closestInputValue = 0;
        }

        closestInput.value = closestInputValue;
    });
});

// ограничение числовых полей
const numberFields = document.querySelectorAll('.new-calculator-form input.form-field');
numberFields.forEach(field => field.addEventListener('input', e => {
    const thisField = e.target.getAttribute('id');
    const limit = thisField === 'kedo-field' ? leftFieldMax : rightFieldMax;
    e.target.value = e.target.value <= limit ? +e.target.value : limit;
}));

numberFields.forEach(field => {
    field.addEventListener('keyup', e => {
        const property = e.target.getAttribute('id');

        if (property === 'kedo-field' && e.target.value < 0)
        {
            e.target.value = 1;
        }
    })
});

numberFields.forEach(field => {
    field.addEventListener('blur', e => {
        const property = e.target.getAttribute('id');

        if (property === 'kedo-field' && +e.target.value === 0)
        {
            e.target.value = 1;
        }
    })
});

// события прокрутки
const rates = document.querySelector('.rates-outer-block').offsetTop * -1;
document.addEventListener('scroll', e => {
    const scrollWindow = e.target.body.getBoundingClientRect().top;
    const tableHeader = document.querySelector('.rates-wrapper');

    scrollWindow <= rates
        ? tableHeader.classList.add('fixed-header-bg-color')
        : tableHeader.classList.remove('fixed-header-bg-color');
});

// показать все функции
document.getElementById('show-functionality-btn').addEventListener('click', btn => {
    let currentBtnText = btn.target.innerText.toLowerCase();
    const functionsWindow = document.querySelector('.functions-window');
    const mistBlock = document.querySelector('.actions-place')
    const functionsWindowStyle = functionsWindow.style;
    const fullTableHeight = document.querySelector('.functions-window__table-place').getBoundingClientRect().height + 40;
    functionsWindowStyle.height = `${fullTableHeight}px`;

    if (currentBtnText === 'показать функционал')
    {
        mistBlock.classList.remove('mist');
        currentBtnText = 'скрыть функционал';
    }
    else
    {
        document.querySelector('html').scroll({top: rates * -1 - 200, behavior: 'smooth'});
        functionsWindowStyle.height = '370px';
        mistBlock.classList.add('mist');
        currentBtnText = 'показать функционал';
    }

    btn.target.innerText = currentBtnText;
});

// логика расчета
const priceList = {
    one_recruiter: 4000,
    additional_recruiter: 1900,
    additional_connection: 950,
    allowance: 2000
};

const calculateForm = document.getElementById('new-calculator-form');
const discountData = document.querySelectorAll('.discount-field');
const calculateBtn = document.getElementById('calculate-btn');

document.getElementById('calculate-btn').addEventListener('click', e => {
    e.preventDefault();
    const discountPercent = +discountData[0].value;
    const discountTime = discountData[1].value;

    const calculateData = [...new FormData(calculateForm)]; // аналогично как Array.from(new FormData(calculateForm))

    const tmpSumm = calculateData[2][1] > 1
        ? (--calculateData[2][1]) * priceList.additional_recruiter + priceList.one_recruiter
        : calculateData[2][1] * priceList.one_recruiter;

    const fastStart = tmpSumm + calculateData[3][1] * priceList.additional_connection; // СТАРТ без скидки
    const extended = fastStart + priceList.allowance * (++calculateData[2][1]);

    const fastStartFormatted = fastStart.toLocaleString();
    const extendedFormatted = extended.toLocaleString(); // Расширенный без скидки

    const ratesPrices = document.querySelectorAll('.prices .discount');
    const discount = document.querySelectorAll('.price-after-discount');

    if (discount.length) {
        discount.forEach(item => item.remove());
        ratesPrices.forEach(item => item.classList.remove('discount-old-price'));
    }

    if (discountPercent > 0) {
        const prices = document.querySelectorAll('.prices');

        const fullMonthResult = fastStart - (fastStart * discountPercent / 100); // полная стоимость СТАРТ со скидкой (если есть)
        const fullMonthResultExtended = extended - (extended * discountPercent / 100); // полная стоимость РАСШИРЕННЫЙ со скидкой (если есть)

        const fastStartDiscountFormatted = Math.round(fullMonthResult).toLocaleString();
        const extendedDiscountFormatted = Math.round(fullMonthResultExtended).toLocaleString();

        const resultsArray = [fastStartDiscountFormatted, extendedDiscountFormatted].map(item => `<div class="price-after-discount">
                    <span class="discount-new-price">${item} руб</span>
                    <div class="discount-deadline">Срок действия акции до ${discountTime}</div>
             </div>`);

        ratesPrices.forEach(item => item.classList.add('discount-old-price'));

        let counter = 0;
        prices.forEach(item => {
            item.insertAdjacentHTML('afterbegin', resultsArray[counter]);
            counter = counter !== resultsArray.length - 1 ? ++counter : 0;
        });
    }

    document.querySelectorAll('.fast-start').forEach(item => item.innerHTML = `${fastStartFormatted} руб`);
    document.querySelectorAll('.extended').forEach(item => item.innerHTML = `${extendedFormatted} руб`);
});

document.addEventListener('DOMContentLoaded', () => {
    calculateBtn.click();
    setTimeout(() => {
        const inputs = document.querySelectorAll('.field-area:not(:last-child) .form-field');
        inputs.forEach(item => item.value = '');
    }, 100);
});