/* ******************************* */
/* DECLARATION OF GLOBAL VARIABLES */
/* ******************************* */

/**Acces API */
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

/**Access to the element galley in the modal*/
const modalContentGallery = document.querySelector(".gallery-list");

/**Access to different modals */
const deleteModal = document.querySelector(".modal-deleted");
const addModal = document.querySelector(".modal-add");

/**Access to deletion message */
const message = document.querySelector(".message-deleted");

/**Access to the photo title input */
const titleModalAdd = document.getElementById("title-photo");

/**Acces to the photo categorie input */
const categorieModalAdd = document.getElementById("categorie-photo");

/**Access to the validated button of the second modal */
const btnValid = document.getElementById("btn-valid");

/**Access to photo  add content */
const contentAddPhoto = document.querySelector(".content-add-photo");

/**Access to the photo preview */
const preview = document.querySelector(".preview");

/**Access to the add photo button */
const addFile = document.getElementById("file");

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
    works = galleryData;
    createGallery();
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
    categories = categoriesData;
    createFilter();
    adminMode();
    openAddModal();

})
.catch(error => alert("Erreur : " + error))


/* ************************ */
/* DECLARATION OF FUNCTIONS */
/* ************************ */

        /**GALLLERY */

/**Function DELETE old image HTML */
function deleteWorks (){
    galleryElement.innerHTML = "";
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
            figure.setAttribute("id", `work-${work.id}`);
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


        /**MODAL ONE*/

/**Function for opening the modal */
function openModal (e) {
    /**Prevent default click behavior */
    e.preventDefault();

    /**Modal access */
    modal = document.querySelector(".modal");

    /**Show modal with flex */
    modal.style.display = "flex";
    deleteModal.style.display = "block";
    addModal.style.display = "none";

    /**Change accessibility attribute */
    modal.removeAttribute("aria-hidden");
    modal.setAttribute("aria-modal", "true"); 

    /**Add event listeners for closing the modal */
    modal.addEventListener("click", closeModal);
    modal.querySelector(".close-deleted").addEventListener("click", closeModal);
    modal.querySelector(".modal-stop").addEventListener("click", stopPropagation);

    /**Call function to display content */
    displayWorksModal();
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
    modal.querySelector(".close-deleted").removeEventListener("click", closeModal);
    modal.querySelector(".modal-stop").removeEventListener("click", stopPropagation);
    
    /**Reset modal variable to null */
    modal = null;

    /**Calling the function that resets the photo addition modal */
    resetAddModal()
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


        /**UPDATE WORKS IN THE FIRST MODAL */

/**Function to display the content of the modal */
function displayWorksModal () {
    /**Reset existing content */
    modalContentGallery.innerHTML = "";

    /**Loop through each work to display them in the modal */
    works.forEach(work => {
        /**Creating elements */
        const figure = document.createElement("figure");
        figure.setAttribute("class", "cute-gallery");
        figure.setAttribute("id", `modal-${work.id}`)
        const imageModal = document.createElement("img");
        imageModal.src = work.imageUrl;
        imageModal.setAttribute("class", "modal-img");
        
        /**Adding elements */
        modalContentGallery.appendChild(figure);
        figure.appendChild(imageModal);
        
        /**Add a trash icon with the work ID */
        const trash = `<i class="fa-solid fa-trash-can delete-work" id = "trash-${work.id}"></i>`
        figure.insertAdjacentHTML("afterbegin", trash);
        
        /**Add an event listener for deleting the work on click of the trash icon */
        const trashSelected = document.getElementById(`trash-${work.id}`);
        trashSelected.addEventListener("click", () => deleteWorksModal(work.id));
        
    })
};

/**Function to delete a work */
function deleteWorksModal(id) {
    fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
        body: null  
    })
    .then(response => {
        if (!response.ok) {
            throw Error(`${response.status}`);
        }
        // return response.json(); ??
    })
    .then(() => {
        /**Remove image from modal */
        document.getElementById(`modal-${id}`).remove();
        
        /**Displays message for 1.5 second */
        message.style.display="flex";
        setTimeout(()=>{
            message.style.display="none";
        }, 1500)

        /**Delete image from gallery */
        document.getElementById(`work-${id}`).remove();
    })
    .catch(error => alert("Erreur : " + error));
};


        /**MODAL ADD WORK */

/**Function open modal for add photo */
function openAddModal (){
    
    /**Access to the first modal button */
    const btnAddPhoto = document.querySelector(".add-photo");

    /**Added an event listener to hide the first modal and display the second */
    btnAddPhoto.addEventListener("click", () => {
        deleteModal.style.display = "none";
        addModal.style.display = "flex";

        /**Calling the closeModal and stopPropagation function to close the modal, except when clicking on it itself */
        const closeBtn = document.querySelector(".close-add");
        closeBtn.addEventListener("click", closeModal);
        addModal.addEventListener("click", stopPropagation);

        /**Access to the return arrow and call of the function on click to return to the first modal */
        const returnModal = document.querySelector(".return");
        returnModal.addEventListener("click", returnFirstModal)
    });
    addSelectedCategories()
};


function addSelectedCategories () {
/**Removing the “Tous” item from the table */
    categories.shift();

    /**"forEach" loop add all categories in the selection input */
    categories.forEach(category => {
            const categoryWork = document.createElement("option");
            categoryWork.setAttribute("id", `categorie-${category.id}`);
            categoryWork.setAttribute("name", category.name);
            categoryWork.innerText = category.name;
            categorieModalAdd.appendChild(categoryWork);
    });
}

/**Function return to the first modal */
function returnFirstModal() {
   /**Hiding the modal adding and reappearing the first modal */ 
    addModal.style.display = "none";
    deleteModal.style.display = "block";

    /**Calling the function that resets the photo add modal */
    resetAddModal();
};


        /**ADD WORK */

/**Function to get an image */
function getPhoto () {
    
    const selectedPhoto = this.files[0];
    
    /**Required size, 4mo */
    const sizeFileMax = 4 * 1024 * 1024;

    /**Required type */
    const typeFile = ["image/jpeg", "image/png"];
    
    /**Checking the photo size */
    if(selectedPhoto.size > sizeFileMax){
        alert("Votre fichier dépasse 4 mo.")

        /**Checking the photo type */    
    } else if(!typeFile.includes(selectedPhoto.type)){
        alert("Votre fichier n'est pas au bon format.")
    } else {   
        /**Hide photo content */ 
        contentAddPhoto.style.display = "none";

        /**Creating a new image */
        let newPhoto = document.createElement("img");

        /**Adding the source of the photo using the URL created for it */
        newPhoto.src = URL.createObjectURL(selectedPhoto);
        /**Add a class and changing the size to fit in the parent container */
        newPhoto.classList.add("new-photo");
        
        newPhoto.style.height = "169px";

        /**Adding the new image to the <div> preview */
        preview.appendChild(newPhoto);

        newPhoto.addEventListener("click", () => {

            addFile.click();
            
            resetAddModal();
        });
    }
};

/***************************************************** */

/**Button valid disabled initially */
function setBtnState(disabled) {
    btnValid.disabled = disabled;
    btnValid.style.cursor = disabled ? "not-allowed" : "pointer";
    btnValid.style.backgroundColor = disabled ? "grey" : "#1D6154";
};
setBtnState(true);

/**Toggle button state based on input */
function toggleSubmitBtn() {
    const photoAdded = document.querySelector(".new-photo");

    /**Checks if the title, category and photo meet the conditions to activate the button */
    setBtnState(!(titleModalAdd.value && categorieModalAdd.value && photoAdded !== null));
};


/**************************** */
/**Add modal reset function */
function resetAddModal () {
    preview.innerHTML = "";
    titleModalAdd.value = "";
    categorieModalAdd.value = "";

    contentAddPhoto.style.display = "flex";
    
    /**reset button valid */
    toggleSubmitBtn();
};

// /***************************************************************** */
// /**fonction post nvx projet */

function postNewPhoto (e) {
    e.preventDefault()
    const photoModalAdd = document.querySelector(".new-photo");
    const formData = new FormData();

    formData.append("title", titleModalAdd.value);
    formData.append("category", categorieModalAdd.value);
    formData.append("imageURL", photoModalAdd.src);

    fetch("http://localhost:5678/api/works", {
        method: "POST", 
        headers: {
            "Accept": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw Error(`${response.status}`)
        }
        // return response.json()
        console.log("ok");
    })
    .then((data) => {
        
        console.log(data);
    })
    .catch(error => alert("Erreur : " + error));
    
}


/***************************************************************** */
/**event pr envoi formulaire */
btnValid.addEventListener("submit", postNewPhoto)


/**event pour récup photo */
addFile.addEventListener("change", getPhoto);

/********************* */

/**event pour désactiver btn */
titleModalAdd.addEventListener("input", toggleSubmitBtn);
categorieModalAdd.addEventListener("input", toggleSubmitBtn);
addFile.addEventListener("change", toggleSubmitBtn);



// categorieModalAdd.addEventListener("change", (e) => {
//     console.log(e.target.selectedIndex);
// })


