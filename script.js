const currencyList = {

USD:"🇺🇸 USD - US Dollar",
INR:"🇮🇳 INR - Indian Rupee",
EUR:"🇪🇺 EUR - Euro",
GBP:"🇬🇧 GBP - British Pound",
AUD:"🇦🇺 AUD - Australian Dollar",
JPY:"🇯🇵 JPY - Japanese Yen",
CAD:"🇨🇦 CAD - Canadian Dollar",
CNY:"🇨🇳 CNY - Chinese Yuan",
SGD:"🇸🇬 SGD - Singapore Dollar",
AED:"🇦🇪 AED - UAE Dirham",
CHF:"🇨🇭 CHF - Swiss Franc",
NZD:"🇳🇿 NZD - New Zealand Dollar",
KRW:"🇰🇷 KRW - South Korean Won",
ZAR:"🇿🇦 ZAR - South African Rand",
BRL:"🇧🇷 BRL - Brazilian Real",
MXN:"🇲🇽 MXN - Mexican Peso"

};

let from=document.getElementById("from");
let to=document.getElementById("to");

/* add currencies to dropdown */

for(let code in currencyList){

let opt1=document.createElement("option");
opt1.value=code;
opt1.text=currencyList[code];
from.appendChild(opt1);

let opt2=document.createElement("option");
opt2.value=code;
opt2.text=currencyList[code];
to.appendChild(opt2);

}

/* searchable dropdown */

$(document).ready(function(){
$('.currency').select2();
});

/* convert function */

async function convert(){

let f=document.getElementById("from").value;
let t=document.getElementById("to").value;
let amount=document.getElementById("amount").value;

if(amount=="" || amount<=0){
alert("Enter valid amount");
return;
}

if(f==t){
alert("Currencies should be different");
return;
}

try{

let url=`https://open.er-api.com/v6/latest/${f}`;

let response=await fetch(url);

let data=await response.json();

let rate=data.rates[t];

let result=amount*rate;

document.getElementById("result").value=result.toFixed(2);

saveHistory(amount,f,t,result);

drawChart(rate);

}

catch{

alert("Could not fetch exchange rate");

}

}

/* swap currencies */

function swapCurrency(){

let temp=from.value;
from.value=to.value;
to.value=temp;

}

/* dark mode */

function toggleDark(){
document.body.classList.toggle("dark");
}

/* history */

function saveHistory(amount,f,t,result){

let text=amount+" "+f+" → "+result.toFixed(2)+" "+t;

let data=JSON.parse(localStorage.getItem("history")) || [];

data.push(text);

localStorage.setItem("history",JSON.stringify(data));

showHistory();

}

function showHistory(){

let data=JSON.parse(localStorage.getItem("history")) || [];

let box=document.getElementById("history");

box.innerHTML="<b>History</b><br>";

data.slice(-5).reverse().forEach(function(item){
box.innerHTML+=item+"<br>";
});

}

showHistory();

/* simple chart */

let chart;

function drawChart(rate){

let ctx=document.getElementById("chart").getContext("2d");

if(chart){
chart.destroy();
}

chart=new Chart(ctx,{
type:'line',
data:{
labels:["1","2","3","4","5"],
datasets:[{
label:"Rate Trend",
data:[rate*0.98,rate*0.99,rate,rate*1.01,rate*1.02],
borderWidth:2
}]
}
});

}

/* auto detect currency */

autoDetect();

async function autoDetect(){

try{

let res=await fetch("https://ipapi.co/json/");

let data=await res.json();

if(data.currency){
from.value=data.currency;
}

}

catch{}

}