function newActivity(feed, activity) {
    const paragraph = document.createElement('p');

    paragraph.innerText = activity
    paragraph.classList.add('activity')

    feed.appendChild(paragraph)

}

export {newActivity}