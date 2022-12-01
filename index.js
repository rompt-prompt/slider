'use strict'

const nav = document.querySelector('.nav');
const pages = document.querySelectorAll('.page');
const startPage = document.querySelector('.page_active')
const demoSliders = [
    {
        mode: 'select',
        dataType: 'number',
        range: [0, 100],
        step: 1,
        handles: {
            '1': 1,
            '2': 5,
        },
        neighborHandles: 'jumpover',
        tagsPositions: 'top',
    },
    {
        mode: 'select',
        dataType: 'date',
        range: [new Date('2021-01-01'), new Date('2021-12-31')],
        step: 1,
        stepMeasure: 'month',
        handles: {
            '1': new Date('2021-02-28'),
            '2': new Date('2021-10-31')
        },
        neighborHandles: 'move',
        isVertical: false,
        progressBars: [
            ['sliderstart', '1'], ['sliderend', '2']
        ],
        tagsPositions: ['top', {2: 'bottom'}],
        handlesTextContent: {
            1: 'first', 2: 'second'
        },
        tagsPrefix: '$',
        tagsPostfix: 'P'
    },
    {
        mode: 'select',
        dataType: 'array',
        range: ['Австралия', 'Австрия', 'Азербайджан', 'Албания', 
        'Алжир', 'Ангола', 'Андорра', 'Антигуа и Барбуда', 'Аргентина', 'Армения'],
        step: 1,
        handles: {
            '1': 3,
            '2': 8
        },
        neighborHandles: 'stop',
        tagsPositions: 'top',
    },
    {
        mode: 'select',
        dataType: 'array',
        range: ['Австралия', 'Австрия'],
        step: 1,
        handles: {
            '1': 0
        },
        tagsPositions: 'top',
        isVertical: true,
    }
]

nav.onclick = event => {
    const link = event.target.dataset.link || event.target.parentElement.dataset.link;
    if(!link) return;
    pages.forEach(page => {
        page.dataset.link === link ? 
            page.classList.add('page_active') : 
            page.classList.remove('page_active');
    })
}

function getPage (dataType) {
    return Array.from(pages).find(page => 
        page.dataset.link === dataType);
}

function createDemoTemplate (page) {
    const createElem = (tag, cls) => {
        const elem = document.createElement(tag);
        elem.classList.add(...cls);

        return elem;
    }

    const container = createElem('div', ['slider-container', 'card']);
    const sliderRoot = createElem('div', ['slider']);
    const output = createElem('div', ['output']);
    const config = createElem('div', ['config']);

    container.append(sliderRoot, output, config);
    page.append(container);
    
    return {root: sliderRoot, output, config};
}

function createSliderDemo (options) {
    const page = getPage(options.dataType);
    const demoContainers = createDemoTemplate(page);
console.log(demoContainers)
    options.root = demoContainers.root;
    page.style.display = 'flex';
    new SliderController(options);
    page.style.display = '';
}

demoSliders.forEach(demo => createSliderDemo(demo))
