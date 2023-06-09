const bestSellerArea = document.querySelector(".best-products");
const newArea = document.querySelector(".new-products");
const recommendArea = document.querySelector(".recommend-products");
import { fetchProducts } from "./api/getProducts.js";

//모달
const modal = document.querySelector(".modal");
const modalContent = document.querySelector(".modal-text");
const closeModalBtn = document.querySelector(".close-modal-btn");

const productsList = await fetchProducts();

//초기값을 ""으로 할당해주지 않으면 undefined로 초기화되어 출력됨!
let bestProductsHtml = "";
let RecommendProductsHtml = "";
let newProductsHtml = "";

//slice로 상품 30개씩 가져옴
let bestproducts = productsList
    .filter((product) => (product.bestSeller = true))
    .slice(0, 30);
let newProducts = productsList
    .filter((product) => (product.newBook = true))
    .slice(10, 40);
let RecommendProducts = productsList
    .filter((product) => (product.recommend = true))
    .slice(20, 50);
//html 상품 넣기
function addProductList(productsType, typeArea) {
    let newHtml = "";
    productsType.forEach((products) => {
        const { author, productId, introduction, price, title, imgUrl } =
            products;

        const formattedPrice = price.toLocaleString() + "원";

        if (products) {
            newHtml += `
        <li class="products-list-info">
        <a href="./pages/detail.html" class="book-detail-button"><img class="product-cover" src="${imgUrl}" alt="example_cover" data-id="${productId}"/></a>
            <p class= "title">${title}</p>
            <p class="author">${author}</p>
            <p class ="introduction">${introduction}</p>
            <p class="price">${formattedPrice}</p>
        </li>
    `;
        }
    });
    typeArea.innerHTML = newHtml;
}

addProductList(bestproducts, bestSellerArea);
addProductList(newProducts, newArea);
addProductList(RecommendProducts, recommendArea);

//상품 슬라이더 시작
let currentIdx = [0, 0, 0];

const chevronRightBtn = document.querySelectorAll(".fa-chevron-circle-right");
const chevronLeftBtn = document.querySelectorAll(".fa-chevron-circle-left");

//오른쪽 버튼 효과

chevronRightBtn.forEach((button, idx) => {
    button.addEventListener("click", function () {
        let slides = button.parentElement.querySelector(".slides");
        //버튼 나타나고 사라지는 효과
        if (currentIdx[idx] === 0) {
            chevronLeftBtn[idx].style.opacity = 1;
        } else if (currentIdx[idx] === 4) {
            button.style.opacity = 0;
        }
        //슬라이딩 되는 부분
        if (currentIdx[idx] < 5) {

            slides.style.left = -(currentIdx[idx] + 1) * 950 + "px";
            currentIdx[idx] += 1;
        }
    });
});

//왼쪽 버튼 효과

chevronLeftBtn.forEach((button, idx) => {
    button.addEventListener("click", function () {
        let slides = button.parentElement.querySelector(".slides");
        //버튼 나타나고 사라지는 효과
        if (currentIdx[idx] === 1) {
            button.style.opacity = 0;
        } else if (currentIdx[idx] === 5) {
            chevronRightBtn[idx].style.opacity = 1;
        }
        //슬라이딩 되는 부분
        if (currentIdx[idx] > 0) {
            slides.style.left = -(currentIdx[idx] - 1) * 950 + "px";
            currentIdx[idx] -= 1;
        }
    });
});

// 자동 스크롤 버튼
const scrollToTopBtn = document.querySelector(".scroll-to-top");

// 버튼 클릭 시 스무스하게 스크롤
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
}

// 현재 스크롤 위치 파악하고 버튼 노출 조절
function checkScroll() {
    const scrollTop = document.documentElement.scrollTop;

    if (scrollTop > 0) {
        scrollToTopBtn.style.display = "flex";
        scrollToTopBtn.style.opacity = 1;
    } else {
        scrollToTopBtn.style.opacity = 0;
        setTimeout(() => {
            scrollToTopBtn.style.display = "none";
        }, 700);
    }
}

scrollToTopBtn.addEventListener("click", scrollToTop);
window.addEventListener("scroll", checkScroll);

/* 포인터 스크롤 */
const bestSeller = document.querySelector(".best-seller");
const newBook = document.querySelector(".new-book");
const recommendBook = document.querySelector(".recommend-book");

const moveToBest = (e) => {
    e.preventDefault();
    const targetElement = document.getElementById("best-seller");
    targetElement.scrollIntoView({ behavior: "smooth" });
};

const moveToRecommend = (e) => {
    e.preventDefault();
    const targetElement = document.getElementById("recommend-book");
    targetElement.scrollIntoView({ behavior: "smooth" });
};

const moveToNew = (e) => {
    e.preventDefault();
    const targetElement = document.getElementById("new-book");
    targetElement.scrollIntoView({ behavior: "smooth" });
};

bestSeller.addEventListener("click", moveToBest);
recommendBook.addEventListener("click", moveToRecommend);
newBook.addEventListener("click", moveToNew);

/* admin, user 필터링 */

const filterRole = (e) => {
    if (localStorage.getItem("userData")){
        const { role } = JSON.parse(localStorage.getItem("userData"));
        if (role === "admin") {
            e.preventDefault();
            window.location.href = "./pages/manage_category.html";
        } else {
            modalContent.innerHTML = "접근 권한이 없습니다!";
            openModal();
        }
    }
};

const adminPageButton = document.querySelector(".adminpage-button");
adminPageButton.addEventListener("click", filterRole);

/* 베스트셀러, 추천도서, 신간도서 상세페이지 */

const moveToDetailPage = (e) => {
    if (e.target.dataset.id) {
        const productId = {
            productId: e.target.dataset.id,
        };
        localStorage.setItem("detail", JSON.stringify(productId));
    }
};

bestSellerArea.addEventListener("click", moveToDetailPage);
newArea.addEventListener("click", moveToDetailPage);
recommendArea.addEventListener("click", moveToDetailPage);

// 엘라딘의 선택 상세페이지
const EladinPicKImg = document.querySelector(".introduction-content img");
const EladinPicKTitle = document.querySelector(".introduction-content .title");

const moveToEladinPickDetailPage = () => {
    localStorage.setItem("detail", JSON.stringify({ productId: 41 }));
};

EladinPicKImg.addEventListener("click", moveToEladinPickDetailPage);
EladinPicKTitle.addEventListener("click", moveToEladinPickDetailPage);

// 모달
function openModal() {
    modal.classList.add("active");
    setTimeout(() => {
        modal.classList.remove("active");
    }, 2000);
}
closeModalBtn.addEventListener("click", () => {
    modal.classList.remove("active");
});
