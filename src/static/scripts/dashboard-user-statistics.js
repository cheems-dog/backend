const get = async(id) => {
    const images = document.getElementById('images');
    const size = document.getElementById('size');

    const userData = await fetch(`/api/users/${id}/stats`).then(res => res.json());

    images.innerHTML = `Total images uploaded: ${userData.uploaded}`;
    size.innerHTML = `Total size uploaded: ${userData.prettySize}`;
}