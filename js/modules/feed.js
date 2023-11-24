function date() {
    const date = new Date();
    const day = date.toLocaleDateString();
    const time = date.toLocaleTimeString();

    return `[${day} ${time}] `;
}

function newActivity(feed, activity) {
    const paragraph = document.createElement('p');

    paragraph.innerText = `${date()} ${activity}`;
    paragraph.classList.add('activity');

    feed.prepend(paragraph);

}

export {newActivity}