/* ******************************* */
/* DECLARATION OF GLOBAL VARIABLES */
/* ******************************* */

/**Acces of global API */
let works = [];
let categories = [];

/**Access to "gallery" element*/
const galleryElement = document.querySelector(".gallery");

/**Acces to "portfolio" section */
const portfolio = document.getElementById("portfolio");

/**Acces to <header> element */
const header = document.querySelector("header");

/**Acces to "login" element */
const switchLogout = document.querySelector('li a[href="login.html"]');

/**Acces to portfolio <h2> element */
const titlemyProjets = document.querySelector("#portfolio h2");

/**Default variable for modal access */
let modal = null;

/**Access to the element galley in the modal*/
const firstModalContentGallery = document.querySelector(".gallery-list");

/**Access to different modals */
const firstModal = document.querySelector(".modal-deleted");
const addModal = document.querySelector(".modal-add");

/**Access to deletion message */
const messagePhotoDeleted = document.querySelector(".message-deleted");

/**Access to the photo title input */
const titleAddModal = document.getElementById("title-photo");

/**Acces to the photo categorie input */
const categorieAddModal = document.getElementById("categorie-photo");

/**Access to the validated button of the second modal */
const btnValidAddModal = document.getElementById("btn-valid");

/**Access to photo  add content */
const contentAddPhoto = document.querySelector(".content-add-photo");

/**Access to the photo preview */
const previewNewPhoto = document.querySelector(".preview");

/**Access to the add photo button */
const btnAddFile = document.getElementById("file");

/**Acces to the form in add modal */
const formPhoto = document.querySelector(".form-photo");


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
    createWorks();
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
function createWorks(categoryId = null){
    /**Delete gallery(works) */
    deleteWorks()

    /**Determine which works array to use based on category */
    const displayWorks = categoryId ? works.filter(work => work.categoryId === categoryId) : works;
    
    /**Loop through each work */
    displayWorks.forEach(work => {
            /**Create a <figure> element for each work */
            const figureGallery = document.createElement("figure");
            figureGallery.setAttribute("id", `work-${work.id}`);
            /**Create an <img> element to display the work's image */
            const imageElementGallery = document.createElement("img");
            imageElementGallery.src = work.imageUrl;
            imageElementGallery.setAttribute("alt", work.title);
            /**Create a <figcaption> element to display the title of the work */
            const titleImageGallery = document.createElement("figcaption");
            titleImageGallery.innerText = work.title;
            /**Add the elements to the gallery */
            galleryElement.appendChild(figureGallery);
            figureGallery.appendChild(imageElementGallery);
            figureGallery.appendChild(titleImageGallery);
    });
};


        /**FILTER */

/**Adding filters of categories to filter works in the gallery */    
function createFilter(){
    /**Adding a default category "Tous" (All)*/
    categories.unshift({id: 0, name: "Tous"});
    
    /**Creating <div> element for categories */
    const categoriesElementFilter = document.createElement("div");
    categoriesElementFilter.classList.add("categories");
    portfolio.insertBefore(categoriesElementFilter, galleryElement);
    
    /**Loop through each category */
    categories.forEach((categoryElement, i) => {
        /**Create buttons for different categories */
        const categoryBtnFilter = document.createElement("button");
        categoryBtnFilter.innerText = categoryElement.name;
        categoryBtnFilter.value = categoryElement.id;
        categoryBtnFilter.classList.add("category-btn");
        /**Add a class to the first button */
        if(i === 0){
            categoryBtnFilter.classList.add("category-selected")
        };
        /**Add buttons to the categories <div> */
        categoriesElementFilter.appendChild(categoryBtnFilter);
        
        /**Change catégory witch function addEventListener click */
        categoryBtnFilter.addEventListener("click", (e) => {
            /**Get the selected category ID */
            const selectedCategoryId = parseInt(e.target.value);
            
            /**Update the gallery */
            createWorks(selectedCategoryId);
            
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
        const editModeBar = `<div class="edit-mode">
        <i class="logo-edit fa-regular fa-pen-to-square"></i>
        <p>Mode édition</p>
        </div>`;
        header.style.marginTop = "88px";
        header.insertAdjacentHTML("afterbegin", editModeBar);
        
        /**change login text to switchLogout text */
        switchLogout.textContent = "logout";
        switchLogout.href = "#";
        
        switchLogout.addEventListener("click", () => {
            /**Delete the session token and reload the page */
            sessionStorage.removeItem("token");
            location.reload();
        });
        /**Create a <div> container for toModified and title "Mes Projets"  */
        const containerDivBtn = document.createElement("div");
        containerDivBtn.classList.add("edit-projets");
        /**Create the <di> link to edit projects */
        const btnToModified = `<div class="edit">
        <i class="fa-regular fa-pen-to-square"></i>
        <p>modifier</p>
        </div>`;

        /**Insert container before first portfolio item and move projects inside */
        portfolio.insertBefore(containerDivBtn, portfolio.firstChild);
        containerDivBtn.appendChild(titlemyProjets);
        /**Insert edit link after projects */
        titlemyProjets.insertAdjacentHTML("afterend", btnToModified);

        
        /**Hide category buttons */
        const categoriesButtonsFilter = document.querySelectorAll('.category-btn');
        categoriesButtonsFilter.forEach(button => {
            button.style.display = 'none';
        });

        /**Acces to "modifier" */
        const editBtn = document.querySelector(".edit");
        if (editBtn) {
            /**If the element is found, add an event listener for the click */
            editBtn.addEventListener("click", openFirstModal);
        };
    };
};


        /**FIRST MODAL*/

/**Function for opening the modal */
function openFirstModal (e) {
    /**Prevent default click */
    e.preventDefault();

    /**Modal access */
    modal = document.querySelector(".modal");

    /**Show modal with flex */
    modal.style.display = "flex";
    firstModal.style.display = "block";
    addModal.style.display = "none";

    /**Change accessibility attribute */
    modal.removeAttribute("aria-hidden");
    modal.setAttribute("aria-modal", "true"); 

    /**Add event listeners for closing the modal */
    modal.addEventListener("click", closeModal);
    modal.querySelector(".close-deleted").addEventListener("click", closeModal);
    modal.querySelector(".modal-stop").addEventListener("click", stopPropagation);

    /**Call function to display content */
    displayWorksFirstModal();
 };


/**Function for close the modal */
function closeModal () {
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
    resetAddModal();
};

/**Prevent the element from closing when clicking on it */
function stopPropagation (e) {
    e.stopPropagation();
};

/**Close the modal with escape */
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e);
    };
});


        /**UPDATE WORKS IN THE FIRST MODAL */

/**Function to display the content of the modal */
function displayWorksFirstModal () {
    /**Reset existing content */
    firstModalContentGallery.innerHTML = "";

    /**Loop through each work to display them in the modal */
    works.forEach(work => {
        /**Creating elements */
        const figureFirstModal = document.createElement("figure");
        figureFirstModal.setAttribute("class", "cute-gallery");
        figureFirstModal.setAttribute("id", `modal-${work.id}`)
        const imageFirstModal = document.createElement("img");
        imageFirstModal.src = work.imageUrl;
        imageFirstModal.setAttribute("class", "modal-img");
        
        /**Adding elements */
        firstModalContentGallery.appendChild(figureFirstModal);
        figureFirstModal.appendChild(imageFirstModal);
        
        /**Add a trash icon with the work ID */
        const trashIcon = `<i class="fa-solid fa-trash-can delete-work" id = "trash-${work.id}"></i>`
        figureFirstModal.insertAdjacentHTML("afterbegin", trashIcon);
        
        /**Add an event listener for deleting the work on click of the trash icon */
        const trashPhotoSelected = document.getElementById(`trash-${work.id}`);
        trashPhotoSelected.addEventListener("click", () => deleteWorksFirstModal(work.id));
        
    });
};

/**Function to delete a work */
function deleteWorksFirstModal(id) {
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
    })
    .then(() => {
        /** */
        works = works.filter(work => work.id !== id);

        /**Remove image from modal */
        displayWorksFirstModal();
        
        /**Displays message for 1.5 second */
        messagePhotoDeleted.style.display="flex";
        setTimeout(()=>{
            messagePhotoDeleted.style.display="none";
        }, 1500);

        /**Delete image from gallery */
        createWorks();
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
        firstModal.style.display = "none";
        addModal.style.display = "flex";

        /**Calling the closeModal and stopPropagation function to close the modal, except when clicking on it itself */
        const closeCrossBtn = document.querySelector(".close-add");
        closeCrossBtn.addEventListener("click", closeModal);
        addModal.addEventListener("click", stopPropagation);

        /**Access to the return arrow and call of the function on click to return to the first modal */
        const returnModalIcon = document.querySelector(".return");
        returnModalIcon.addEventListener("click", returnFirstModal);
    });
    /**Calling the function that adds the categories to select */
    addSelectedCategories();
};

/**Function return to the first modal */
function returnFirstModal() {
   /**Hiding the modal adding and reappearing the first modal */ 
    addModal.style.display = "none";
    firstModal.style.display = "block";

    /**Calling the function that resets the photo add modal */
    resetAddModal();
};

/**Function to add different categories */
function addSelectedCategories () {
/**Removing the “Tous” item from the table */
    categories.shift();

    /**"forEach" loop add all categories in the selection input */
    categories.forEach(category => {
            const categoryWork = document.createElement("option");
            categoryWork.setAttribute("value", category.id);
            categoryWork.setAttribute("name", category.name);
            categoryWork.innerText = category.name;
            categorieAddModal.appendChild(categoryWork);
    });
};



        /**ADD NEW WORK (PHOTO)*/

/**Function to get a photo */
function getNewPhoto () {
    
    /**Constant to retrieve the first selected file, "this" refers to the btn "input type: file" */
    const selectedNewPhoto = this.files[0];
    
    /**Required size, 4mo */
    const sizeFileMax = 4 * 1024 * 1024;

    /**Required type */
    const typeFile = ["image/jpeg", "image/png"];
    
    /**Checking the photo size */
    if(selectedNewPhoto.size > sizeFileMax){
        alert("Votre fichier dépasse 4 mo.")

        /**Checking the photo type */    
    } else if(!typeFile.includes(selectedNewPhoto.type)){
        alert("Votre fichier n'est pas au bon format.")
    } else {   
        /**Hide photo content */ 
        contentAddPhoto.style.display = "none";

        /**Creating a new image */
        let newPhoto = document.createElement("img");

        /**Adding the source of the photo using the URL created for it */
        newPhoto.src = URL.createObjectURL(selectedNewPhoto);
        /**Add a class and changing the size to fit in the parent container */
        newPhoto.classList.add("new-photo");
        
        newPhoto.style.height = "169px";

        /**Adding the new image to the <div> previewNewPhoto */
        previewNewPhoto.appendChild(newPhoto);

        newPhoto.addEventListener("click", () => {
            /**Change photos by clicking on it */
            btnAddFile.click();
            
            /**Calling the function that resets the photo addition modal */
            resetAddModal();
        });
    };
};

// /**Button valid disabled initially */
function setBtnState(disabled) {
    btnValidAddModal.disabled = disabled;
    btnValidAddModal.style.cursor = disabled ? "not-allowed" : "pointer";
    btnValidAddModal.style.backgroundColor = disabled ? "grey" : "#1D6154";
};
setBtnState(true);

/**Toggle button state based on input */
function toggleSubmitBtn() {
    const photoAdded = document.querySelector(".new-photo");

    /**Checks if the title, category, and photo meet the conditions to activate the button */
    if (!(titleAddModal.value && categorieAddModal.value && photoAdded !== null)) {
        /**Leave the button disabled */
        setBtnState(true);
    } else {
        /*Activates the button if all conditions are met */
       setBtnState(false);
    };
};

/**Add modal reset function */
function resetAddModal () {
    /**Reset the title, category, image and add file button */
    previewNewPhoto.innerHTML = "";
    titleAddModal.value = "";
    categorieAddModal.value = "";
    btnAddFile.value = "";

    contentAddPhoto.style.display = "flex";
    
    /**reset button valid */
    toggleSubmitBtn();
};


        /**POST API */

/**Function to POST a photo to the API */
function postNewPhoto () {
    /**Creating a formData object to send form data to the add modal */
    const formData = new FormData();

    /**Adding values ​​to formData */
    formData.append("title", titleAddModal.value);
    formData.append("category", categorieAddModal.value);
    formData.append("image", btnAddFile.files[0])

    // console.log("Données envoyées:", {
    //     title: titleAddModal.value,
    //     category : categorieAddModal.value,
    //     image: btnAddFile.files[0]
    // });

    /**Sending to the API */
    fetch("http://localhost:5678/api/works", {
        method: "POST", 
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw Error(`${response.status}`)
        }
        return response.json();

    })
    .then((galleryData) => {
        /**Updating the gallery and closing the modal */
        works.push(galleryData);
        createWorks();
        closeModal();
    })
    .catch(error => alert("Erreur : " + error));
};


/* ****************************** */
/* DECLARATION OF EVENT LISTENERS */
/* ****************************** */

/**EventListener for sending the new form */
formPhoto.addEventListener("submit", function (e) {
    e.preventDefault();
    postNewPhoto();
});

/**EventListener to recover the photo from the computer files */
btnAddFile.addEventListener("change", getNewPhoto);

/**EventListener to disable the validation button of the add modal */
titleAddModal.addEventListener("input", toggleSubmitBtn);
categorieAddModal.addEventListener("input", toggleSubmitBtn);
btnAddFile.addEventListener("change", toggleSubmitBtn);

/***************************************************************************** */