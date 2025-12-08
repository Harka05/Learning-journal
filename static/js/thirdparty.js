document.addEventListener('DOMContentLoaded', () => {
  const videoSection = document.getElementById('motivationVideo');
  videoSection.className = 'video';
  videoSection.innerHTML = `
    <h2>Motivation Corner</h2>
    <iframe width="420" height="250" src="https://www.youtube.com/embed/Tuw8hxrFBH8?si=haYuDAyEdWfjNJD9" 
    title="YouTube video player" frameborder="0" allow="accelerometer; 
    autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; 
    web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
  `;
//   document.querySelector('main').appendChild(videoSection);
});
