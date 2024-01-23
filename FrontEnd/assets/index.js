/* ** */
/* API LIST
/* ** */

/**API WORKS (GALLERY) RECOVERY */
fetch("http://localhost:5678/api/works")
.then(response => response.json())
.then(data => {
    createImage(data)
    console.log(data);
})


/* ** */
/* DECLARATION OF FUNCTIONS */
/* ** */

/**Function DELETE old image HTML */
function deleteOldGallery (){
    const oldGallery = document.querySelector(".gallery");
    while (oldGallery.firstChild){
        oldGallery.removeChild(oldGallery.firstChild)
    }
console.log(oldGallery)
}
deleteOldGallery()


/**Function CREATE new images API*/
function createImage(galleryData){
    const gallery = galleryData;

    const galleryElement = document.querySelector(".gallery");

    gallery.forEach(item => {
        
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
