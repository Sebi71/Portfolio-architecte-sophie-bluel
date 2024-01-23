/* ******************************* */
/* DECLARATION OF GLOBAL VARIABLES */
/* ******************************* */

let works = [];
let categories = [];

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
function deleteOldGallery (){
    const oldGallery = document.querySelector(".gallery");
    while (oldGallery.firstChild){
        oldGallery.removeChild(oldGallery.firstChild)
    }
}
deleteOldGallery()


/**Function CREATE new images API*/
function createGallery(categoryID = null){
    // console.log(works);
    works.forEach(item => {
        
        const figure = document.createElement("figure");
        
        const imageElement = document.createElement("img")
        imageElement.src = item.imageUrl;
        imageElement.setAttribute("alt", item.title)

        const titleImage = document.createElement("figcaption");
        titleImage.innerText = item.title;
        
        galleryElement.appendChild(figure);
        figure.appendChild(imageElement);
        figure.appendChild(titleImage);

    });
}


    /**FILTER */
    
    function createFilter(){
        
        const portefolio = document.getElementById("portfolio");
        const categoriesElement = document.createElement("div");
        categoriesElement.classList.add("categories")
        portefolio.insertBefore(categoriesElement, galleryElement);
        
        categories.unshift({id: 0, name: "Tous"});
        
        categories.forEach(item => {
            const categoryBtn = document.createElement("button");
            categoryBtn.classList.add("category-btn");
            categoryBtn.innerText = item.name;
            categoryBtn.value = item.id;
            categoriesElement.appendChild(categoryBtn);
            
            categoryBtn.addEventListener("click", (e) => {
                console.log("Bouton de catégorie cliqué", e.target.value);
        })
        
    })  
    console.log(categories);
}  
