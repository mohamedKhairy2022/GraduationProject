let allData = document.getElementById('allData');
let products;
let allProducts = document.getElementById('allProducts');
let allItems = document.getElementById('allItems');
let row = document.getElementById('rowData');
let isMainPage = location.pathname.includes('/main.html');

if ($('#cart').length) {
  const cartItems = JSON.parse(localStorage.getItem('userCart')) || [];
  $('#cart').text(cartItems.length);
}

$(document).ready(() => {
  getMeals('').then(() => {
    $('.loading-screen').fadeOut(500);
    $('body').css('overflow', 'visible');
  });
});

var nvWidth = 0,
  isTrue = !0,
  arr = [];

$('.strip-toggel-menu').click(function () {
  isTrue
    ? ($('.nav-tab-menu').addClass('open-menu').removeClass('close-menu'),
      (nvWidth = $('.nav-tab-menu').width() - 10),
      $('.strip-header-nav').css('left', nvWidth),
      $('.fa-align-justify').toggleClass('fa-times'),
      $('.nav-tab-menu .item1').animate(
        {
          opacity: '1',
          paddingTop: '25px',
        },
        1100
      ),
      $('.nav-tab-menu .item2').animate(
        {
          opacity: '1',
          paddingTop: '25px',
        },
        1200
      ),
      $('.nav-tab-menu .item3').animate(
        {
          opacity: '1',
          paddingTop: '25px',
        },
        1300
      ),
      $('.nav-tab-menu .item4').animate(
        {
          opacity: '1',
          paddingTop: '25px',
        },
        1400
      ),
      $('.nav-tab-menu .item5').animate(
        {
          opacity: '1',
          paddingTop: '25px',
        },
        1500
      ),
      $('.nav-tab-menu .item6').animate(
        {
          opacity: '1',
          paddingTop: '25px',
        },
        1600
      ),
      (isTrue = !isTrue))
    : ($('.nav-tab-menu').addClass('close-menu').removeClass('open-menu'),
      $('.fa-align-justify').toggleClass('fa-times'),
      $('.strip-header-nav').css('left', 0),
      $('.nav-tab-menu li').animate(
        {
          opacity: '0',
          paddingTop: '500px',
        },
        500
      ),
      (isTrue = !isTrue));
});

async function getMeals(term) {
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
  response = await response.json();
  //console.log(response.meals);
  displayMeals(response.meals);
  products = response;
  return response;
}

function displayMeals(arr) {
  if (location.pathname.includes('/Card.html')) return;
  let cartoona = '';
  for (let i = 0; i < arr.length; i++) {
    cartoona += `
        <div class="col-md-3 g-5">
        <div class="items  rounded shadow-lg p-3  bg-body-tertiary text-center">
                <img onclick="getDescription('${arr[i].idMeal}')" src="${arr[i].strMealThumb}" class="w-100 rounded" alt="">
            <div class="itemContent">
                <h4 class="m-2">${arr[i].strMeal}</h4> 
            <div class="starPrice d-flex justify-content-between px-3">
                <i class="fa-solid fa-star d-flex"> <p class="text-dark ms-2">5</p></i> 
                <p class="fw-bold">150 EGP</p>
            </div>
            </div>
            <input type="number" class="numOfOrders form-control mb-3" min="1" value="1" />
            <button onclick="addToCart(${i})" class="btn btn-info w-100">Add to Card +</button>
        </div>
</div>`;
  }
  allProducts.innerHTML = cartoona;
}
if (isMainPage) getMeals('');
///////////////////////////////////////////////////////////////

let cart = JSON.parse(localStorage.getItem('userCart')) || [];

function addToCart(index) {
  const productToAdd = products.meals[index];
  const allProductsElArr = document.getElementById('allProducts').children;
  const numOfOrders = Number(allProductsElArr[index].querySelector('.numOfOrders').value);
  const itemIndexInCart = cart.findIndex((meal) => meal.idMeal === productToAdd.idMeal);
  console.log({ productToAdd, allProductsElArr, numOfOrders, itemIndexInCart });

  if (itemIndexInCart === -1) {
    cart.push({ ...productToAdd, price: 150, numOfOrders });
  } else {
    cart[itemIndexInCart].numOfOrders += numOfOrders;
  }

  localStorage.setItem('userCart', JSON.stringify(cart));
  let items = JSON.parse(localStorage.getItem('userCart'));
  console.log(items);
  $('#cart').html(items.length);
  allProductsElArr[index].querySelector('.numOfOrders').value = 1;
}

function getCartItem() {
  let items = JSON.parse(localStorage.getItem('userCart'));
  displayCartItems(items);
  $('#cart').html(items.length);
}

function deletingItems(itemId) {
  let cartItems = JSON.parse(localStorage.getItem('userCart')).filter((item, index) => index != itemId);
  localStorage.setItem('userCart', JSON.stringify(cartItems));
  $('#cart').html(cartItems.length);
  $('#allItems').html('');
  displayCartItems(cartItems);
}

function displayCartItems(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    $('#allItems').append(`<div class="col-md-3 ">
        <div class="card text-center ">
            <div>
                <img class="w-100 rounded-2" src="${items[i].strMealThumb}" alt="meal-foto">
            </div>
            <div class="card-footer p-3">
                <div class="d-flex justify-content-between">
                  <h3 class="text-black fs-4">${items[i].strMeal}</h3>
                  <p><i class="fa-solid fa-heart fs-4 text-warning"></i></p>
                </div>
                <div class="discript d-flex justify-content-between mb-2">
                    <p>
                      Orders: <span>${items[i].numOfOrders}</span>
                    </p>
                    <div class="stars">
                        <i class="text-warning fa-solid fa-star"></i> 4.5 <span class="text-muted">Ratings</span>
                    </div>
                </div>
                <button onclick="deletingItems(${i})" class="btn text-center w-100 btn-sm float-right btn-outline-danger">Delete</button>
            </div>
        </div>
    </div>`);

    total += items[i].price * items[i].numOfOrders;
  }
  $('#Total').html(total + '$');
}

////////////////////////////////////////////////////////////////

$(function () {
  var max = 100;
  $('textarea').keyup(function () {
    var length = $(this).val().length;
    var character = max - length;
    //console.log(character)
    if (character <= 0) {
      $('#char').text('your available character finished');
    } else {
      $('#char').text(character);
    }
  });
});

/*////////////////////////////////////////////////*/

async function getDescription(mealID) {
  $('.loading-container').fadeIn(100);
  let meal = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
  meal = await meal.json();
  displayDescription(meal.meals[0]);
  $('.loading-container').fadeOut(500);
}

function displayDescription(meal) {
  let recipes = '';
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      recipes += `<li class="my-3 mx-1 p-1 alert-success rounded ">${meal[`strMeasure${i}`]} ${
        meal[`strIngredient${i}`]
      }</li>`;
    }
  }

  let tags = meal.strTags?.split(',');
  let tagsStr = '';
  for (let i = 0; i < tags?.length; i++) {
    tagsStr += `<li class="my-3 mx-1 p-1 alert-danger rounded">${tags[i]}</li>`;
  }

  let str = `
  <div class="col-md-4 myM text-white">
        <img class="w-100" src="${meal.strMealThumb}" alt=""
          srcset=""><br>
        <h1>${meal.strMeal}</h1>
      </div>
      <div class="col-md-8 myM text-white text-left">
        <h2>Instructions</h2>
        <p>${meal.strInstructions}</p>
        <p><b class="fw-bolder">Area :</b> ${meal.strArea}</p>
        <p><b class="fw-bolder">Category :</b> ${meal.strCategory}</p>
        <h3>Recipes :</h3>
        <ul class="d-flex " id="recipes">
        </ul>

        <h3 class="my-2 mx-1 p-1">Tags :</h3>
        <ul class="d-flex " id="tags">
        </ul>

        
        <a class="btn btn-success text-white" target="_blank" href="${meal.strSource}">Source</a>
        <a class="btn youtube text-white" target="_blank" href="${meal.strYoutube}">Youtub</a>
      </div>`;
  row.innerHTML = str;
  document.getElementById('recipes').innerHTML = recipes;
  document.getElementById('tags').innerHTML = tagsStr;
  $('html, body').animate(
    {
      scrollTop: 0,
    },
    200
  );
}
