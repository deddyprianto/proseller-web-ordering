export const  downloadImage = (imageUrl, fileName) =>  {
    // Create a temporary anchor element
    const anchor = document.createElement('a');
    anchor.style.display = 'none';
    anchor.href = imageUrl;
    anchor.download = fileName;
  
    // Add the anchor to the document body
    document.body.appendChild(anchor);
  
    // Trigger a click event on the anchor to initiate the download
    anchor.click();
  
    // Remove the anchor from the document
    document.body.removeChild(anchor);
  }