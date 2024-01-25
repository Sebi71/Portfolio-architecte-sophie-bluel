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
function createGallery(filterWorks){
    /**Delete gallery(works) */
    deleteWorks()

    
    
    /**Looping on each work */
    works.forEach(work => {
            /**Creation of work item */
            const figure = document.createElement("figure");
            
            const imageElement = document.createElement("img");
            imageElement.src = work.imageUrl;
            imageElement.setAttribute("alt", work.title);

            const titleImage = document.createElement("figcaption");
            titleImage.innerText = work.title;
            
            galleryElement.appendChild(figure);
            figure.appendChild(imageElement);
            figure.appendChild(titleImage);
        

    });
};


/**FILTER */
/**Adding filters of categories to filter work in the gallery */    
function createFilter(){
    /**Creating a new object in the table*/
    categories.unshift({id: 0, name: "Tous"});
    
    /**Creating div element for categories */
    const portefolio = document.getElementById("portfolio");
    const categoriesElement = document.createElement("div");
    categoriesElement.classList.add("categories");
    portefolio.insertBefore(categoriesElement, galleryElement);
    
    /**Looping on each category */
    categories.forEach((categoryElement, i) => {
        /**Creation of buttons for different categories */
        const categoryBtn = document.createElement("button");
        categoryBtn.innerText = categoryElement.name;
        categoryBtn.value = categoryElement.id;
        categoryBtn.classList.add("category-btn");
        if(i === 0){
            categoryBtn.classList.add("category-selected")
        };
        categoriesElement.appendChild(categoryBtn);
        
        /**Change catégory witch function addEventListener click */
        categoryBtn.addEventListener("click", (e) => {
            const selectedCategoryId = parseInt(e.target.value);
            
            let filterWorks = works;
            if (selectedCategoryId !== 0) {
                filterWorks = works.filter(work => {
                return work.categoryId === selectedCategoryId;
                });
            }
            createGallery();
            console.log(filterWorks);
            
            /**change color button */
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


