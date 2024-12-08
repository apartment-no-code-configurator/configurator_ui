export const encryptString = (string) => {
  return btoa(string);
}

export const decryptString = (string) => {
  return atob(string);
}

export const validImageExtensionCheck = (fileObj) => {
  const extension = fileObj.name.split(".").pop();
  const validExtensions = ["png", "jpg", "jpeg"];
  return validExtensions.includes(extension)
}

export const validImageFileSize = (fileObj, limitInMB) => {
  const size = (fileObj.size) / (1024 * 1024)
  return size <= limitInMB
}

export const logoutSession = () => {
  //TO-DO: Hit backend to delete token
  localStorage.removeItem("apartix_session_id");
  window.location.href = '/';
}

export const refreshPage = () => {
  window.location.reload()
}

export const flashMessage = (id, message) => {
  const el = document.getElementById(id);
  el.textContent = message;
  el.classList.add("show");
  setTimeout(() => {
    el.classList.remove("show");
  }, 3000);
}

export const hideLicenseTags = () => {
  const licenseTags = document.querySelectorAll('dx-license');
  licenseTags.forEach(tag => {
    tag.style.display = 'none';
  });

  const licenseHTMLTags = document.getElementsByTagName('dx-license');
  Array.from(licenseHTMLTags).forEach(tag => {
    tag.remove(); // Removes the element from the DOM
  });
};

export const observeLicenseTags = () => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        mutation.addedNodes.forEach((node) => {
          if ((node.tagName === 'DX-LICENSE') || (node.tagName === "dx-license")) {
            node.remove();
          }
        });
      }
    });
  });

  // Start observing the document body for child node additions
  observer.observe(document.body, { childList: true, subtree: true });
}
