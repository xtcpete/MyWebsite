const queryString = window.location.search;
const id = queryString.split('?')[1];

for (var i =0; i<details.length; i++){
    let detail = details[i];
    if (Object.keys(detail)[0] === id) {
        var summary = detail[id];
        break;
    }
}

$(document).ready(function () {
    document.title = summary.Title + " | Experience";
    document.getElementById("banner").innerHTML = "<img class=\"banner-img\" id=\"banner-img\" src=" + summary.imgPath + ">";
    var header = document.getElementById("header")
    header.innerHTML += "<div class=\"title\">" + summary.Title;
    header.innerHTML += "<div class=\"comment\" style=\"font-weight: normal;\">" + summary.Comment + "</div></div>"
    header.innerHTML += "<div class=\"company\">" + summary.Company + "</div>"
    header.innerHTML += "<div class=\"date\">" + summary.Date + "</div>"

    for (var i = 0; i < Object.keys(summary.Summary).length; i++) {
        document.getElementById("summary").innerHTML += "<div class=\"summary-point\">" + "* " + summary.Summary[i] + "</div>"
    }
    var skills = summary.Skills.split(",");
    var skillDiv = document.getElementById("skills");
    for (i in skills) {
        var skill = skills[i];
        html = "<div class=\"skill\", id=\""+ skill+ "\" onclick=\"location.href=\"" + "https://www.google.com/search?q=" + skill + "\"     ><i><u>" + skill + "</u></i></div>";
        skillDiv.innerHTML += html; 
        console.log(html);
    }

    supervisor_div = document.getElementById("supervisor");
    if ("Supervisor" in summary){
        console.log(summary.Supervisor);
        supervisor_html = "<div class=\"supervisor-title\">My Supervisor:</div>"
        supervisor_html += "<div class=\"supervisor-name\"><a href=\""+summary.Supervisor.Email + "\">" + summary.Supervisor.Name + "</a></div>"
        supervisor_div.innerHTML = supervisor_html;
    }
    else{
        supervisor_div.style.display = "none";
    }

    about_div = document.getElementById("about");
    if ("About" in summary){
        about_html = "<div class=\"about-title\">About</div>"
        about_html += "<div class=\"about\">" + summary.About + "</div>"
        about_div.innerHTML = about_html;
    }
    else{
        about_div.style.display = "none";
    }
});

