/* ******************************* */
/* DECLARATION OF GLOBAL VARIABLES */
/* ******************************* */

let works = [];
let categories = [];

/** Access to gallery element*/
const galleryElement = document.querySelector(".gallery");

const portfolio = document.getElementById("portfolio");

const header = document.querySelector("header");

const logout = document.querySelector('li a[href="login.html"]');

const myProjets = document.querySelector("#portfolio h2");


/* ******** */
/* API LIST */
/* ******** */

/**API WORKS (GALLERY) RECOVERY */
fetch("http://localhost:5678/api/works")
.then(response => {
    if (!response.ok) {
        throw Error(`${response.status}`)
    }
    return response.json()
})
.then(galleryData => {
    works = galleryData
    createGallery()
})
.catch(error => alert("Erreur : " + error))

/**API CATEGORIES RECOVERY */
fetch("http://localhost:5678/api/categories")
.then(response => {
    if (!response.ok) {
        throw Error(`${response.status}`)
    }
    return response.json()
})
.then(categoriesData => {
    categories = categoriesData
    createFilter()
})
.catch(error => alert("Erreur : " + error))


/* ************************ */
/* DECLARATION OF FUNCTIONS */
/* ************************ */

        /**GALLLERY */

/**Function DELETE old image HTML */
function deleteWorks (){
    while (galleryElement.firstChild){
        galleryElement.removeChild(galleryElement.firstChild)
    }
}


/**Function CREATE new works API*/
function createGallery(categoryId = null){
    /**Delete gallery(works) */
    deleteWorks()

    /**Determine which works array to use based on category */
    const displayWorks = categoryId ? works.filter(work => work.categoryId === categoryId) : works;
    
    /**Loop through each work */
    displayWorks.forEach(work => {
            /**Create a <figure> element for each work */
            const figure = document.createElement("figure");
            /**Create an <img> element to display the work's image */
            const imageElement = document.createElement("img");
            imageElement.src = work.imageUrl;
            imageElement.setAttribute("alt", work.title);
            /**Create a <figcaption> element to display the title of the work */
            const titleImage = document.createElement("figcaption");
            titleImage.innerText = work.title;
            /**Add the elements to the gallery */
            galleryElement.appendChild(figure);
            figure.appendChild(imageElement);
            figure.appendChild(titleImage);
        

    });
};


/**FILTER */
/**Adding filters of categories to filter works in the gallery */    
function createFilter(){
    /**Adding a default category "Tous" (All)*/
    categories.unshift({id: 0, name: "Tous"});
    
    /**Creating <div> element for categories */
    const categoriesElement = document.createElement("div");
    categoriesElement.classList.add("categories");
    portfolio.insertBefore(categoriesElement, galleryElement);
    
    /**Loop through each category */
    categories.forEach((categoryElement, i) => {
        /**Create buttons for different categories */
        const categoryBtn = document.createElement("button");
        categoryBtn.innerText = categoryElement.name;
        categoryBtn.value = categoryElement.id;
        categoryBtn.classList.add("category-btn");
        /**Add a class to the first button */
        if(i === 0){
            categoryBtn.classList.add("category-selected")
        };
        /**Add buttons to the categories <div> */
        categoriesElement.appendChild(categoryBtn);
        
        /**Change catégory witch function addEventListener click */
        categoryBtn.addEventListener("click", (e) => {
            /**Get the selected category ID */
            const selectedCategoryId = parseInt(e.target.value);
            
            /**Update the gallery */
            createGallery(selectedCategoryId);
            
            /**change color of the button */
            const filterColorCategory = document.querySelectorAll(".category-btn");
            filterColorCategory.forEach((filterColor, i) => {
                if(i === selectedCategoryId){
                    filterColor.classList.add("category-selected")
                } else {
                    if(filterColor.classList.contains("category-selected")){
                        filterColor.classList.remove("category-selected")
                    };
                };
            });

        });
    });  
    
    adminMode();
};  

/****************************************************** */

function adminMode(){
    if(sessionStorage.getItem("token")){
        const editMode = `<div class="edit-mode">
        <i class="logo-edit fa-regular fa-pen-to-square"></i>
        <p>Mode édition</p>
        </div>`;
        header.style.marginTop = "88px";
        header.insertAdjacentHTML("afterbegin", editMode);
        
        logout.textContent = "logout";
        logout.href = "#";
        
        logout.addEventListener("click", () => {
            sessionStorage.removeItem("token");
            location.reload();
        });
        /***************************************** */
        const containerDiv = document.createElement("div");
        containerDiv.classList.add("edit-projets");
        const toModified = `<a href="#" class="lien-modifier">
        <i class="fa-regular fa-pen-to-square"></i>
        <p>modifier</p>
        </a>`;
        
        portfolio.insertBefore(containerDiv, portfolio.firstChild)
        containerDiv.appendChild(myProjets);
        
        myProjets.insertAdjacentHTML("afterend", toModified);

        

        const categoriesButtons = document.querySelectorAll('.category-btn');
        categoriesButtons.forEach(button => {
            button.style.display = 'none';
        });
    };
}

