const API_BASE_URL = "https://api.artic.edu/api/v1/artworks";
const artResults = document.getElementById("artResults");

document.getElementById("randomArt").addEventListener("click", async () => {
  try {
    const randomPage = Math.floor(Math.random() * 100) + 1; // 페이지 번호를 1~100 사이에서 랜덤
    const response = await fetch(
      `${API_BASE_URL}?page=${randomPage}&limit=1&fields=id,title,artist_title,image_id`
    );
    const data = await response.json();

    if (data.data && data.data.length > 0) {
      displayArtworks(data.data);
    } else {
      artResults.innerHTML = "<p>No random artwork found. Try again.</p>";
    }
  } catch (error) {
    console.error("Error fetching random artwork:", error);
  }
});

document.getElementById("searchArt").addEventListener("click", async () => {
  const keyword = document.getElementById("searchKeyword").value;
  const response = await fetch(
    `${API_BASE_URL}/search?q=${keyword}&fields=id,title,artist_title,image_id`
  );
  const data = await response.json();
  displayArtworks(data.data);
});

function displayArtworks(artworks) {
  artResults.innerHTML = "";
  artworks.forEach((art) => {
    const artDiv = document.createElement("div");
    artDiv.className = "artwork";
    artDiv.innerHTML = `
            <h2>${art.title}</h2>
            <p><strong>Artist:</strong> ${art.artist_title || "Unknown"}</p>
            <img src="https://www.artic.edu/iiif/2/${
              art.image_id
            }/full/843,/0/default.jpg" alt="${art.title}" />
        `;
    artResults.appendChild(artDiv);
  });
}
