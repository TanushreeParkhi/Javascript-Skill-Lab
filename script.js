let heading=document.querySelector("#main-heading");

heading.addEventListener("click", ()=>{ console.log('You clicked on the heading!');
    console.warn('You clicked on the heading.');
});

document.querySelector('em').addEventListener("click", ()=>{ console.log('You clicked on the em element!');});
document.querySelector('body').addEventListener("click", ()=>{ console.log('You clicked on the body element!');});

//for mouse movement
document.querySelector('html').addEventListener("mousemove", e=>{ console.log(`mousemove x: ${e.clientX}, y: ${e.clientY}`);});

//for keyboard
document.querySelector('html').addEventListener("keydown", e=>{ console.log(e);});
