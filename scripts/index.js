var experiences_data = main[0]['Experiences']
var info_data = main[1]['Info']
var education_data = main[2]['Education']
var projects_data = main[3]['Projects']
var publications_data = main[4]['Publications']

$(document).ready(function () {
    
    var usrlang = navigator.language
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const querylan = urlParams.get('lan')
    var resume = document.getElementById('resume-button')
    var nev_buttons = document.getElementsByClassName("nev-button");

    resume.innerText = 'Resume'
    for (var i = 0; i < nev_buttons.length; i++) {
        if (nev_buttons[i].id == 'home_button') {
            nev_buttons[i].innerText = 'Home'
        }
        else if (nev_buttons[i].id == 'publications_button') {
            nev_buttons[i].innerText = 'Publications'
        }
        else if (nev_buttons[i].id == 'experiences_button') {
            nev_buttons[i].innerText = 'Experiences'
        }
        else {
            nev_buttons[i].innerText = 'Projects'
        };
    }
    document.getElementById('home_button').innerText = 'Home'
    document.getElementById('publications_button').innerText = 'Publications'
    document.getElementById('experiences_button').innerText = 'Experiences'
    document.getElementById('projects_button').innerText = 'Projects'

    var ua = window.navigator.userAgent;
    var iOS = ua.match(/iPhone/i);
    var webkit = ua.match(/WebKit/i);
    if (isMobileDevice()) {
        console.log('mobile')
        document.getElementById("container").style.height = "100vh"
    }
    else{
        document.getElementById("container").style.height = "100vh"
    }

    var education_wrapper = document.getElementById('education-wrapper')
    for (var i = Object.keys(education_data).length - 1; i >= 0; i--) {
        var edu = education_data[String(i)]
        education_wrapper.innerHTML += "<div class='dotline'><div class='p'>" + edu['School'] + "<br>" + edu['Degree'] + "<text class='text'>" + edu['Date'] + "</text></div><div class='l_dot'><div class='s_dot'></div></div></div>"
    }
    document.getElementById('home-title').innerText = info_data['Name']

    document.getElementById('highlight').innerHTML = info_data['Highlight']

    document.getElementById('linkedin_link').href = info_data['Links']['LinkedIn']

    document.getElementById('github_link').href = info_data['Links']['Github']

    if (info_data['Links']['Instagram'] != undefined) {
        document.getElementById('ins_link').href = info_data['Links']['Instagram']
    }
    else {
        document.getElementById('instagram').style.display = 'none'
    }

    var entries = info_data['keySkills'].split(',')
    // make entries to dictionary
    for (var i in entries) {
        entries[i] = { label: entries[i], url: 'https://www.google.com/search?q=' + entries[i] }
    }


    var settings = {
        entries: entries,
        width: '100%',
        height: '100%',
        radius: '50%',
        radiusMin: 75,
        bgDraw: true,
        bgColor: '#1B262C',
        opacityOver: 1.00,
        opacityOut: 0.05,
        opacitySpeed: 5,
        fov: 800,
        speed: 0.3,
        fontSize: '2.5vh',
        fontColor: '#00ADB5',
        fontWeight: 'bold',
        fontStyle: 'normal',
        fontSretch: 'normal',
        fontToUpperCase: true
    };

    $('.animated-cloud').svg3DTagCloud(settings);

    experience_wrapper = document.getElementById('exp-cards-list')
    for (var i = Object.keys(experiences_data).length-1; i >= 0; i--) {
        var exp = experiences_data[String(i)]
        exp_card = "<div class='card' onclick=\"location.href='" + exp['id'] + "'\">" + "<div class='card-content'>" + "<div class='banner-holder'>" + 
        "<div class='banner' style='background-image: url(" + exp['imgPath'] + "); background-size: contain'></div>" + 
        "</div>" + "<div class='container-fluid content-holder'>" + "<div class='inner-content'>" + 
        "<div class='info-holder'>" + "<div class='date-category'>" + exp['Date'] + 
        "<br>" + exp['Location'] + "</div>" + "</div>" + "<h3 class='title'>" + exp['Title'] +
        "</h3>" + "<h4 class='company'>" + exp['Company']

        if (exp['Comment'] != undefined) {
            exp_card += "<h5 class='comment'>" + exp['Comment'] + "</h5>"
        }
        
        exp_card += "</h4>" + "<div class='description'>" + "Skills: " + exp['Skills'] + "</div>" + "</div>" 
        + "</div>" + "</div>" + "</div>"
        experience_wrapper.innerHTML += exp_card
    }
    
    pub_cards= document.getElementById('pub_cards')
    for (var i=Object.keys(publications_data).length-1; i>=0; i--){
        pub = publications_data[String(i)]
        console.log(pub['Journal'])
        pub_card = '<li><a href="' + pub['id'] + '" class="pub_card"><img src="' + pub['Cover'] +'" class="pub_card__image" alt="" />' + 
        '<div class="pub_card__overlay"><div class="pub_card__header">' + 
        '<div class="pub_card__header-text"><h3 class="pub_card__title">' + pub['Title'] +'</h3><span class="pub_card__author">' + pub['Authors']  + '</span> <span class="pub_card__status">' + pub['Journal'] + ', ' + pub['Date'] + 
        '</span></div></div><p class="pub_card__description">' + pub['Abstract'] + 
        '</p></div></a></li>'
        pub_cards.innerHTML += pub_card
    }

    var projects_demo = document.getElementById('projects-demo')
    var projects_nodemo = document.getElementById('projects-nodemo')

    for (var i=Object.keys(projects_data).length-1; i>=0; i--){
        demo = projects_data[String(i)]
        project_card = "<div class='demo-card' onclick=\"location.href='" + demo['id'] + "'\">" + "<div class='card-title'>" + demo['Title'] + "</div>" + "<div class='card-description'>" + demo['Description'] + "</div>" + "</div>"
        skills = demo['Skills'].split(',')
        project_card += "<div class=\"skill-holder\" style=\"display: inline\"><div class=\"skills\">Skills: "
        for (var j in skills){
            project_card += "<text class='skill', id='" + skills[j] + "' onclick=\"location.href='https://www.google.com/search?q=" + skills[j] + "'\" style='width: fit-content; cursor: pointer'><i><u>  " + skills[j] + "</u></i></text>  "
        }
        project_card += "</div></div>"

        if (demo['Demo'] == true){
            projects_demo.innerHTML += project_card
        }
        else{
            projects_nodemo.innerHTML += project_card
        }

    }

})

function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    const center_y = (rect.top + rect.bottom) / 2
    const center_x = (rect.left + rect.right) / 2
    return center_x > 0 && center_x < window.innerWidth && center_y > 0 && center_y < window.innerHeight

}

document.addEventListener("wheel", (event) => {

    var wheeling
    clearTimeout(wheeling);
    const buttons = document.getElementsByTagName('button')
    wheeling = setTimeout(function () {
        wheeling = undefined;
        Array.from(buttons).forEach(function (button) {
            const id = button.id.split('_')[0]
            const el = document.getElementById(id)
            if (el == null) {
                return false
            }
            button.style.background = 'None'
            button.style.color = 'gray'
            if (isInViewport(el)) {
                button.style.background = el.style.background
                button.style.color = 'white'
            }
        })
    }, 400);
});

document.addEventListener("touchend", (event) => {
    var wheeling
    clearTimeout(wheeling);
    const buttons = document.getElementsByTagName('button')
    wheeling = setTimeout(function () {
        wheeling = undefined;
        Array.from(buttons).forEach(function (button) {
            const id = button.id.split('_')[0]
            const el = document.getElementById(id)
            if (el == null) {
                return false
            }
            button.style.background = 'None'
            button.style.color = 'gray'
            if (isInViewport(el)) {
                button.style.background = el.style.background
                button.style.color = 'white'
            }
        })
    }, 100);
});

function navigateTo(el) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const nevPage = document.getElementById('nev-page')
    if (nevPage.style.display != 'none') {
        openMenu()
    }
    const nev_page = document.getElementById('nev-page')

    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const buttons = document.getElementsByTagName('button')
    Array.from(buttons).forEach(function (button) {
        if (el.id == button.id.split('_')[0]) {
            button.style.background = el.style.background
            button.style.color = 'white'
        } else {
            button.style.background = 'None'
            button.style.color = 'gray'
        }
    })
}

function checkScrollLimits() {
    const $cardsList = $('.cards-list');
    const scrollLeft = $cardsList.scrollLeft();
    const scrollWidth = $cardsList[0].scrollWidth;
    const clientWidth = $cardsList[0].clientWidth;

    // Check if there's room to scroll left
    if (scrollLeft <= 0) {
        $('#left-arrow-btn').addClass('disabled');
    } else {
        $('#left-arrow-btn').removeClass('disabled');
    }

    // Check if there's room to scroll right
    if (scrollLeft + clientWidth >= scrollWidth) {
        $('#right-arrow-btn').addClass('disabled');
    } else {
        $('#right-arrow-btn').removeClass('disabled');
    }
}

function checkScrollLimits() {
    const $cardsList = $('.cards-list');
    const scrollLeft = $cardsList.scrollLeft();
    const scrollWidth = $cardsList[0].scrollWidth;
    const clientWidth = $cardsList[0].clientWidth;

    // Check if there's room to scroll left
    if (scrollLeft <= 0) {
        document.getElementById('left-arrow').style.borderRight = "8px solid #bdbdbd";
    } else {
        document.getElementById('left-arrow').style.borderRight = "8px solid #424242";
    }

    // Check if there's room to scroll right
    console.log(scrollLeft + clientWidth, scrollWidth)
    if (scrollLeft + clientWidth >= scrollWidth - 10) {
        document.getElementById('right-arrow').style.borderLeft = "8px solid #bdbdbd";
    } else {
        document.getElementById('right-arrow').style.borderLeft = "8px solid #424242";
    }
}

function scrollThumb(direction) {
    console.log(direction);
    const scrollAmount = 1000; // Amount to scroll in pixels (adjust as needed)

    if (direction === 'Left') {
        $('.cards-list').animate({
            scrollLeft: "-=" + scrollAmount
        }, 500, checkScrollLimits);  // Adjust the duration as needed (500ms for example)
    } else if (direction === 'Right') {
        $('.cards-list').animate({
            scrollLeft: "+=" + scrollAmount
        }, 500, checkScrollLimits);  // Adjust the duration as needed
    }
}


function openMenu() {
    // check what section is in view
    const buttons = document.getElementsByTagName('button')
    Array.from(buttons).forEach(function (button) {
        const id = button.id.split('_')[0]
        const el = document.getElementById(id)
        if (el != null) {
            if (isInViewport(el)) {
                button.style.background = el.style.background
                button.style.color = 'white'
            }
            else {
                button.style.background = 'None'
                button.style.color = 'gray'
            }
        }
    })

    const el = document.getElementById('nev-page')
    if (el.style.display == 'none') {
        el.style.display = 'block'
        el.style.animation = 'nev-ani 0.15s linear'
    }
    else {
        var backani
        clearTimeout(backani);
        el.style.animation = 'back-nev-ani 0.15s linear'
        backani = setTimeout(function (ek) {
            el.style.display = 'none'
        }, 150)
    }
}

function isMobileDevice() {
	return window
		.matchMedia("screen and (max-device-width:640px)").matches;
}
