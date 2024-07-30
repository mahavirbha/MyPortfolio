// ============== MENU SHOW Y HIDDEN ============
const navMenu = document.getElementById('nav-menu'),
    toggleMenu = document.getElementById('nav-toggle'),
    closeMenu = document.getElementById('nav-close')

// Show
toggleMenu.addEventListener('click', ()=>{
    navMenu.classList.toggle('show')
})

// Hidden
closeMenu.addEventListener('click', ()=>{
    navMenu.classList.remove('show')
})

// ============Remove Menu ============
const navLink = document.querySelectorAll('.nav_link')

function linkAction(){
    navMenu.classList.remove('show')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

// ============Scroll Sections Active Link

const sections = document.querySelectorAll('section[id]')

window.addEventListener('scroll', scrollActive)

function scrollActive(){
    const scrollY = window.pageYOffset

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 50
        sectionId = current.getAttribute('id')

        if(scrollY > sectionTop && scrollY <= sectionTop+sectionHeight){
            document.querySelector('.nav_menu a[href*='+sectionId+']').classList.add('active')
        }
        else{
            document.querySelector('.nav_menu a[href*='+sectionId+']').classList.remove('active')
        }
    })
}

// contact form

function changeSubmitText(){
    document.getElementById("submit").value = "Submit Via WhatsApp WhatsApp";
    document.getElementById("submit").insertAdjacentHTML("afterend",
                '<h3 style="text-align: center;padding-top:5px;"  id="edited"> Message Via WhatsApp <i class="bx bxl-whatsapp home_social-link"></i></h3>');
}

function changeBack(){
    document.getElementById("submit").value = "Send Message";
    document.getElementById("edited").innerHTML = "";
}


// Welcoming
window.addEventListener("load", (e) => {
    const text_welcome = "Welcome to My Profile";

    // new SpeechSynthesisUtterance object
    let utter = new SpeechSynthesisUtterance();
    utter.lang = 'en-US';
    utter.text = text_welcome;
    utter.volume = 0.5;
    // speak
    window.speechSynthesis.speak(utter);
});

// Speaking Paragraph
const text_ = "Hi, I'm an IT Engineer having good knowledge and hands-on of ML-Stack & Full-Stack development. I love to build web and software which can have a potentially good impact on society.";

const speechBtn = document.querySelector(".speakAbout");

document.querySelector(".speakAbout").addEventListener("click", () => {
    
    // new SpeechSynthesisUtterance object
    let utter = new SpeechSynthesisUtterance();
    utter.lang = 'en-US';
    utter.text = text_;
    utter.volume = 0.5;

    // speak
    window.speechSynthesis.speak(utter);
});

// "Redirecting Linkedin"
const text_linkedin= "Redirecting Linkedin";
document.querySelector(".linkedin").addEventListener("click", () => {
    
    // new SpeechSynthesisUtterance object
    let utter = new SpeechSynthesisUtterance();
    utter.lang = 'en-US';
    utter.text = text_linkedin;
    utter.volume = 0.5;
    // speak
    window.speechSynthesis.speak(utter);
});

// "Redirecting Github"
const text_github = "Redirecting Github";
document.querySelector(".github").addEventListener("click", () => {
    
    // new SpeechSynthesisUtterance object
    let utter = new SpeechSynthesisUtterance();
    utter.lang = 'en-US';
    utter.text = text_github;
    utter.volume = 0.5;
    // speak
    window.speechSynthesis.speak(utter);
});

// "Downloading Resume..."
const text_resume = "Downloading Resume";
document.querySelector(".resumeDownload").addEventListener("click", () => {
    
    // new SpeechSynthesisUtterance object
    let utter = new SpeechSynthesisUtterance();
    utter.lang = 'en-US';
    utter.text = text_resume;
    utter.volume = 0.5;
    // speak
    window.speechSynthesis.speak(utter);
});

