/* ******************************* */
/* DECLARATION OF GLOBAL VARIABLES */
/* ******************************* */

let works = [];
let categories = [];

/** Access to gallery element*/
const galleryElement = document.querySelector(".gallery");


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
    const oldGallery = document.querySelector(".gallery");
    while (oldGallery.firstChild){
        oldGallery.removeChild(oldGallery.firstChild)
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
    const portefolio = document.getElementById("portfolio");
    const categoriesElement = document.createElement("div");
    categoriesElement.classList.add("categories");
    portefolio.insertBefore(categoriesElement, galleryElement);
    
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
};  

/****************************************************** */


const header = document.querySelector("header");
const editMode = '<div class="edit-mode"><i class="logo-edit fa-regular fa-pen-to-square"></i><p>Mode édition</p></div>';

function adminMode(){
    if(localStorage.getItem("token")){
         header.insertAdjacentHTML("afterbegin", editMode);
    }
}
adminMode()