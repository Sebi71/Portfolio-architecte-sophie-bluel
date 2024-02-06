/* ******************************* */
/* DECLARATION OF GLOBAL VARIABLES */
/* ******************************* */

let works = [];
let categories = [];

/**Access to "gallery" element*/
const galleryElement = document.querySelector(".gallery");

/**Acces to "portfolio" section */
const portfolio = document.getElementById("portfolio");

/**Acces to <header> element */
const header = document.querySelector("header");

/**Acces to "login" element */
const logout = document.querySelector('li a[href="login.html"]');

/**Acces to portfolio <h2> element */
const myProjets = document.querySelector("#portfolio h2");

/**Default variable for modal access */
let modal = null;


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
    createFilter();
    adminMode();
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
};


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
};  

/**ADMIN MODE */
/**Function to enable administrator mode */
function adminMode(){
    /**Check if a token is present in the sessionStorage */
    if(sessionStorage.getItem("token")){
        /**Create <div> edit mode content and insert at the beginning of the header */
        const editMode = `<div class="edit-mode">
        <i class="logo-edit fa-regular fa-pen-to-square"></i>
        <p>Mode édition</p>
        </div>`;
        header.style.marginTop = "88px";
        header.insertAdjacentHTML("afterbegin", editMode);
        
        /**change login text to logout text */
        logout.textContent = "logout";
        logout.href = "#";
        
        logout.addEventListener("click", () => {
            /**Delete the session token and reload the page */
            sessionStorage.removeItem("token");
            location.reload();
        });
        /**Create a <div> container for toModified and title "Mes Projets"  */
        const containerDiv = document.createElement("div");
        containerDiv.classList.add("edit-projets");
        /**Create the <di> link to edit projects */
        const toModified = `<div class="edit">
        <i class="fa-regular fa-pen-to-square"></i>
        <p>modifier</p>
        </div>`;

        /**Insert container before first portfolio item and move projects inside */
        portfolio.insertBefore(containerDiv, portfolio.firstChild);
        containerDiv.appendChild(myProjets);
        /**Insert edit link after projects */
        myProjets.insertAdjacentHTML("afterend", toModified);

        
        /**Hide category buttons */
        const categoriesButtons = document.querySelectorAll('.category-btn');
        categoriesButtons.forEach(button => {
            button.style.display = 'none';
        });

        /**Acces to "modifier" */
        const editBtn = document.querySelector(".edit");
        if (editBtn) {
            /**If the element is found, add an event listener for the click */
            editBtn.addEventListener("click", openModal);
        };
    };
};


/**MODAL */
/**Function for opening the modal */
function openModal (e) {
    /**Prevent default click behavior */
    e.preventDefault();

    /**Modal access */
    modal = document.querySelector(".modal");

    /**Show modal with flex */
    modal.style.display = "flex";

    /**Change accessibility attribute */
    modal.removeAttribute("aria-hidden");
    modal.setAttribute("aria-modal", "true"); 

    /**Add event listeners for closing the modal */
    modal.addEventListener("click", closeModal);
    modal.querySelector("#close").addEventListener("click", closeModal);
    modal.querySelector(".modal-stop").addEventListener("click", stopPropagation);
    
    /**Call function to display content */
    displayWorksModal()
};


/**Function for close the modal */
function closeModal (e) {
    /**Prevent default click behavior */
    e.preventDefault();

    /**Hide modal */
    modal.style.display = "none";

    /**Change accessibility attribute */
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal"); 

    /**Remove event listeners */
    modal.removeEventListener("click", closeModal);
    modal.querySelector("#close").removeEventListener("click", closeModal);
    modal.querySelector(".modal-stop").removeEventListener("click", stopPropagation);
  
    /**Reset modal variable to null */
    modal = null;
};

/**Prevent the element from closing when clicking on it */
function stopPropagation (e) {
    e.stopPropagation();
};

/**Close the modal with escape */
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    };
});


/**Function to display the content of the modal */
function displayWorksModal () {
    /**Access to the element */
    const modalContentGallery = document.querySelector(".gallery-list");

    /**Reset existing content */
    modalContentGallery.innerHTML = null;

    /**Loop through each work to display them in the modal */
    works.forEach(work => {
        /**Creating elements */
        const figure = document.createElement("figure");
        figure.setAttribute("class", "cute-gallery")
        const imageModal = document.createElement("img");
        imageModal.src = work.imageUrl;
        imageModal.setAttribute("class", "modal-img");
        
        /**Adding elements */
        modalContentGallery.appendChild(figure);
        figure.appendChild(imageModal);
        
        /**Add a trash can icon with the work ID */
        const trash = `<i class="fa-solid fa-trash-can delete-work" id = "${work.id}"></i>`
        figure.insertAdjacentHTML("afterbegin", trash);
        
        /**Add an event listener for deleting the work on click of the trash icon */
        const trashSelected = document.getElementById(`${work.id}`);
        trashSelected.addEventListener("click", () => deleteWorksModal(work.id));
        
    })
};

/**Function to delete a work */
function deleteWorksModal(id) {
    console.log("Id n°", id);
}