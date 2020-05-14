//var _ = require('lodash');
function* idMaker() {
	//debugger;
    var index = 0;
    for(let i = 0;1; i++)
      yield index++;
};
//id generator for table entities
gen = idMaker()
//class of Product
class TableContent {
	constructor(name, price, quantity, email, locC, loc) {
        this.id= gen.next().value;
		this.name= name;
		this.price= priceAsUSD(price);
		this.quantity= quantity;
		this.email= email;
		this.locC= locC;
		this.loc = loc;
    }
} 

TableContent.prototype.insertRowToTable = function(){
	let tableRowTemplate = _.template(document.getElementById('rowTmpl').innerHTML);
	let options = {
		id: this.id,
		name: this.name,
		quantity: this.quantity,
		price: this.price,

	};
//     $("#Table").append("<tr id=product"+this.id+">" +
// 		"<td>" + "<a href='#' onclick=''>" + this.name + "</a>" + "<div class='quantity'>" + this.quantity + "</div></td>" +
// 		"<td>" + this.price + "</td>" +
// 		"<td><button type=\"button\" id=\'("+this.id+")'\" class=\" col-md-5 btn btn-warning btn-sm\" onclick='editContent("+$(this).attr('id')+")'>Edit</button>\n" +
// 		"<button type=\"button\" id=\'("+this.id+")'\"  class=\" col-md-5 btn btn-info btn-sm btn-delete\" onclick='popDelete("+$(this).attr('id')+")'>Delete</button></td>" +
// 		"</tr>");
	$("#tableBody").append(tableRowTemplate(options));

};


//mocks
let tabCont = [];
tabCont.push(new TableContent('Oil', -2, 1000, 'gaspromneft@gov.ru', 'Russia', ["Moscow"]));
tabCont.push(new TableContent('NotOil', 22,22, 'qw@ert.y', 'Russia', ["Moscow", "St.Petersburg"]));
tabCont.push(new TableContent('Something', 14, 222, 'qw@er.t', 'USA', ["California"]));
tabCont.push(new TableContent('Anything', 66, 4, 'mi@123', 'Ukraine', ["Kharkiv"]));
for (let i =0 ; i< tabCont.length; i++){
    tabCont[i].insertRowToTable();
};


let flag =0;// terrible way of doing this but idk how to check if 'id' is undefined

//Function creates new entries in table and recreates edited entries
function createNewContent (){//this function gets context from editContent()
	// let temp = tabCont.length+1;
	// debugger;
	// if(typeof id !== undefined) { I've tried so hard to lose it all but in the end it doesnt even matter
	// 	temp = id;
	// }
	//console.log(this.tabContent);
	//debugger;
     if (flag != 0){
		deleteContent();//deleting old entry to recreate it for editing
	 }
	flag = 0; // terrible way of doing this but idk how to check if 'id' is undefined
    var checkedArray = [];
	$("#switches input[type='checkbox']:checked").each(function(index, el) {
		var items = $(el).closest('label').text();
		checkedArray.push(items);
    });
    let tabContent = new TableContent($('#name-product').val(),parseFloat($('#price').val().replace(/[^0-9.-]+/g,"")),parseInt($('#quantity').val()),$('#email').val(),$('#location').val(),checkedArray);
    let fakePromise = new Promise((resolve) => {//promise to make it a bit async
		setTimeout(() => {
            resolve(tabCont.push(tabContent));//every table row is in this array 
        },1000);
	});
	fakePromise.then(() =>{
		tabContent.insertRowToTable();
		$('.popup-add input').val('');
	});
	$('.container').css('filter', 'none');
	$('.overlay-add').fadeOut();
}

function iHaveToRefreshNowWithThisTemplatesXD (){
	for (let i = 0 ; i< tabCont.length+1; i++){
		$('#product').remove();
	}	
}
//delete product
function deleteContent() {// this fucntion gets context from popDelete()
	let promise = new Promise((resolve) => {
		setTimeout(() => {
			resolve(_.pull(tabCont,tabContent));
        }, 0);
	});
	promise.then(() =>{
		gen = idMaker();
		iHaveToRefreshNowWithThisTemplatesXD ()
        for (let i =0 ; i< tabCont.length; i++){
            tabCont[i].insertRowToTable();
        }   
    });
	$('.container').css('filter', 'none');
	$('.overlay-del').fadeOut();
	$('#tableBody').empty();
}

//delete popUp
function popDelete(id) {
	id = parseInt(id);
    let tabContent = _.find(tabCont,{'id':id});
    this.tabContent = tabContent;
	$('.container').css('filter', 'blur(5px)');
	$('.overlay-del').fadeIn();
	$('.popup-del-text').text('Are you sure you want to delete  ' + tabContent.name + '?');
}

//'No' on delete popup
function closeDeletePopup(){
    $('.container').css('filter', 'none');
	$('.overlay-del').fadeOut();
}

//'Edit' popup opener
function editContent(id) {
	id = parseInt(id);
	this.id = id;
	let tabContent = _.find(tabCont,{'id': id});
	this.tabContent = tabContent;
//open edit popup
	//debugger;
	$('#popHead').html(tabContent.name);
    $('.container').css('filter', 'blur(5px)');
    $('.overlay-add').fadeIn();
    $('.btn-change').text('Edit');
	$('#name-product').val(tabContent.name);
	$('#email').val(tabContent.email);
	$('#quantity').val(tabContent.quantity);
	$('#price').val(tabContent.price);
	$('#location').val(tabContent.locC);
	flag = 1;
	locSelect(tabContent.loc);
}

//'add' popUp opener
$('.btn-primary').click(function () { 
	$('.container').css('filter', 'blur(5px)');
	$('.overlay-add').fadeIn();
	$('.btn-change').text('Create');
	$('#popHead').html('Product Name');
	locSelect([]);
});
	
$('.cancel').click(function () {
	$('.container').css('filter', 'none');
	$('.overlay-add').fadeOut();
	$('.popup-add input').val('');
	flag = 0;
});

//Value transofrmers
function priceAsUSD (price) {
	let form = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD",
		minimumFractionDigits: 2});
	return form.format(price);
}

function formPrice() {
	let price = $('#price').val();
	let reg = /^\d+$/;
	if (reg.test(price)) {
		$('.btn-change').prop('disabled',false);
		price = priceAsUSD(price);
	}else{
		$('.btn-change').prop('disabled',true);
		price = 'Price must be a number';
	}
	$('#price').val(price);
}

function changePriceToNumber() {
	let price = Number($('#price').val().replace(/[^0-9.-]+/g,""));
	$('#price').val(price);
}

function checkQuantity (){
	let quantity = $('#quantity').val();
	let reg = /^\d+$/;
	if (reg.test(quantity)) {
		//console.log(quantity);
		$('.btn-change').prop('disabled',false);
		//console.log('CorQ');

	}else{
		$('.btn-change').prop('disabled',true);
		quantity = 'Quantity must be a number';
		//console.log('IncQ');
	}
	$('#quantity').val(quantity);
}

function checkEmail(){
	let email = $('#email').val();
	// hehe
	let regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (regEmail.test(email)) {
		$('.btn-change').prop('disabled',false);
	}else{
		$('.btn-change').prop('disabled',true);
		email = 'Your Email is invalid';
	}
	$('#email').val(email);
}

//search button
$('#searchBtn').click(function () {
	event.preventDefault();//used to reload page coz of default Bootstrap button
	$.each($("tbody tr"), function () {
		if ($(this).text().toLowerCase().indexOf($('.form-control').val().toLowerCase()) === -1) {
			$(this).hide();
		} else {
			$(this).show();
		}
	});
});

//search 'Enter' keypress
$('.form-control').keypress(function (event) {
	if (event.which === 13) {
		$.each($("tbody tr"), function () {
			if ($(this).text().toLowerCase().indexOf($('.form-control').val().toLowerCase()) === -1) {
				$(this).hide();
			} else {
				$(this).show();
			}
		});
	}
});

//some Delivery selection mocks 
let locs = new Map();
locs.set("Russia", ["Chita", "Sochi", "St.Petersburg"]);
locs.set("USA", ["Boston", "Philadelphia", "Austin"]);
locs.set("Belarus", ["Minsk", "Brest", "Mogilev"]);
locs.set("Ukrainve", ["Kharkiv", "Sevastopol", "Lviv"]);

//Drop-down list
for (let key of locs.keys()) {
	let newOption = new Option(key, key);
	$('#location').append(newOption);
	locSelect([]);
}

//checkboxes
function locSelect(checkedArray) {
	$("#switches").empty();
	let s = '<label for="selectAll">' + '<input type="checkbox" id="selectAll"> Select All' + '</label>' +
		'<hr>';
	let country = $("#location option:selected").text();
	locs.get(country).forEach(city => {
		if (checkedArray.includes(city)){
			s +='<label>'+'<input type="checkbox" class="check" checked>'+city+'</label>' + '<br>';
		} else {
			s +='<label>'+'<input type="checkbox" class="check">'+city+'</label>' + '<br>';
		}
	});
	$("#switches").append(s);

	//popup-add cities checkbox
	$('#selectAll').click(function () {
		$(".check").prop('checked', $(this).prop('checked'));
	});
}

//sorting
//sorting by name 
function sortName() {
	let tbody = $('#tableBody');
	tbody.find('tr').sort(function (a, b) {
		let x = $('td:first', a).text();
		let y = $('td:first', b).text();
		if ($('#orderN').val() == 'asc') {
			return x.localeCompare(y);
		} else {
			return y.localeCompare(x);
		}
	}).appendTo(tbody);
	let sort_order = $('#orderN').val();
	$('#arrowPrice').toggleClass('arrowPrice_down arrowPrice_top', false);
	$('#arrowPrice').addClass('arrowPrice_none');
	if (sort_order == "asc") {
		document.getElementById("orderN").value = "desc";
		$('#arrowName').toggleClass('arrowName_top arrowName_none', false);
		$('#arrowName').addClass('arrowName_down');
	}
	if (sort_order == "desc") {
		document.getElementById("orderN").value = "asc";
		$('#arrowName').toggleClass('arrowName_down arrowName_none', false);
		$('#arrowName').addClass('arrowName_top');
	}
}

//sorting by price
function sortPrice() {
	let tbody = $('#tableBody');
	tbody.find('tr').sort(function (a, b) {
		let x = parseInt($('td:nth-child(2)', a).text().replace(/[^+\d]/g, ''));
		let y = parseInt($('td:nth-child(2)', b).text().replace(/[^+\d]/g, ''));
		if ($('#orderP').val() == 'asc') {
			return x - y;
		} else {
			return y - x;
		}
	}).appendTo(tbody);
	let sort_order = $('#orderP').val();
	$('#arrowName').toggleClass('arrowName_down arrowName_top', false);
	$('#arrowName').addClass('arrowName_none');
	if (sort_order == "asc") {
		document.getElementById("orderP").value = "desc";
		$('#arrowPrice').toggleClass('arrowPrice_top arrowPrice_none', false);
		$('#arrowPrice').addClass('arrowPrice_down');
	}
	if (sort_order == "desc") {
		document.getElementById("orderP").value = "asc";
		$('#arrowPrice').toggleClass('arrowPrice_down arrowPrice_none', false);
		$('#arrowPrice').addClass('arrowPrice_top');
	}
}
