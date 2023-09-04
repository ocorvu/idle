function newActivity(feed, activity) {
    const paragraph = document.createElement('p');

    const date = new Date()
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()

    paragraph.innerText = `[${day}/${month}/${year} ${hours}:${minutes}:${seconds}] ${activity}`
    paragraph.classList.add('activity')

    feed.prepend(paragraph)

}

export {newActivity}