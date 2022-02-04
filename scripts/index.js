// let mealCost, tipCost, totalCost, tipPerPerson, totalPerPerson;
const TIP_COST = 'tipCost';
const TOTAL_COST = 'totalCost';
const TIP_PER_PERSON = 'tipPerPerson';
const TOTAL_PER_PERSON = 'totalPerPerson';
const CURRENCY_SYMBOL = '&#8377;'

const KEY_CONSTANTS = { 
    [TIP_COST]: 'Tip: ',
    [TOTAL_COST]: 'Total Amount: ',
    [TIP_PER_PERSON]: 'Tip Per Person: ',
    [TOTAL_PER_PERSON]: 'Total Per Person: ' 
 }


function initData(spec) {
    var that = {};
    that.setField = function(key, val) {
        spec[key] = val;
    }
    that.getField = function(key) {
        console.log(typeof spec[key]);
        return spec[key];
    }
    that.toString = function() {
        var res = '[ ';
        for(let prop in spec) {
            if(spec.hasOwnProperty(prop)) {
                res += `${prop}: ${spec[prop]}, `
            }
        }
        res += ']';
        return res;
    }
    that.getAll = function() {
        const res = {};
        for(let prop in spec) {
            if(spec.hasOwnProperty(prop)) {
                res[KEY_CONSTANTS[prop]] = spec[prop];
            }
        }
        return res;
    }
    return that;
}



const data = new initData({
    [TIP_COST]: 0,
    [TOTAL_COST]: 0,
    [TIP_PER_PERSON]: 0,
    [TOTAL_PER_PERSON]: 0
});

const mealCostField = document.querySelector('#meal-cost-field');
const tipPercentageField = document.querySelector('#tip-percentage-field');
const numberOfPeopleField = document.querySelector('#number-of-people-field');
const calculateBtn = document.querySelector('#calculate-btn');
const resultContainer = document.querySelector('#result-container');

calculateBtn.addEventListener('click', billCalculation);



function billCalculation(e) {
    e.preventDefault();
    resultContainer.innerHTML  = '';
    const mealCostFieldValue = +mealCostField.value;
    const tipPercentageFieldValue = +tipPercentageField.value;
    const numberOfPeopleFieldValue = +numberOfPeopleField.value || 1;
    doCalculation(mealCostFieldValue, tipPercentageFieldValue, numberOfPeopleFieldValue);

    showOutput();
}

function showOutput() {
    const resHeader = createNode('h2', 'Result');
    const tbl = createResultTable();
    resultContainer.appendChild(resHeader);
    resultContainer.appendChild(tbl);
}

function createResultTable() {
    const table = document.createElement('table');
    const tbody = document.createElement('tbody');
    const billData = data.getAll();
    
    for(let prop in billData) {
        const tr = document.createElement('tr');
        const td1 = createNode('td', prop);
        const td2 = createNode('td', `${CURRENCY_SYMBOL} ${billData[prop]}`);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    return table;
}


function createNode(elem, val) {
    const elemNode = document.createElement(elem);
    // const elemTextNode = document.createTextNode(val);
    // elemNode.appendChild(elemTextNode);
    elemNode.innerHTML = val
    return elemNode;
}

function doCalculation(cost, tipPer, people) {
    data.setField(TIP_COST, calcTip(cost, tipPer));
    data.setField(TOTAL_COST, calcTotalCost(cost));
    data.setField(TIP_PER_PERSON, calcTipPerPerson(people));
    data.setField(TOTAL_PER_PERSON, calcTotalPerPerson(people));
}

function calcTip(cost, tipPer) {
    const tipShare =  perToDec(tipPer);
    return arithmetic(mul, [cost, tipShare])
}

function calcTotalCost(cost) {
    return arithmetic(sum, [cost, data.getField(TIP_COST)]);
}

function calcTipPerPerson(people) {
    return arithmetic(divide, [data.getField(TIP_COST), people])
}

function calcTotalPerPerson(people) {
    return arithmetic(divide, [data.getField(TOTAL_COST), people]);
}

function perToDec(percentage) {
    return percentage / 100;
}

function sum(nums) {
    let res = 0;
    for(let i = 0 ; i < nums.length; i++) {
        res += nums[i];
    }
    return res;
}

function mul(nums) {
    let res = 1;
    for(let i = 0 ; i < nums.length; i++) {
        res *= nums[i];
    }
    return res;
}

function divide(nums) {
    let res = nums[0];
    for(let i = 1 ; i < nums.length; i++) {
        res /= nums[i];
    }
    return res;
}

function arithmetic(helper, nums) {
    for(let i = 0; i < nums.length; i++) {
        nums[i] = parseFloat(nums[i]);
    }
    const res = helper(nums);
    return res.toFixed(2);
}